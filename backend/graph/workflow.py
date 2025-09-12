from typing import Dict, Any, List
import asyncio
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from .state import DebateState
from agents.researcher import ResearcherAgent
from agents.debate_agents import InnovatorAgent, SkepticAgent, EngineerAgent, EthicistAgent
from agents.judge_agent import JudgeAgent
from agents.moderator import ModeratorAgent
from config.settings import settings

# Initialize all agents
researcher = ResearcherAgent()
innovator = InnovatorAgent()
skeptic = SkepticAgent()
engineer = EngineerAgent()
ethicist = EthicistAgent()
judge = JudgeAgent()
moderator = ModeratorAgent()

# Define debate order - creates natural flow
DEBATE_ORDER = [
    ("innovator", innovator),
    ("skeptic", skeptic),
    ("engineer", engineer),
    ("ethicist", ethicist)
]

# --- Node Functions ---

async def run_researcher(state: DebateState) -> Dict[str, Any]:
    """Research phase: gather info and create a structured brief."""
    print(f"🔍 Starting research for: {state['user_query']}")
    state["status"] = "researching"
    try:
        return await researcher.execute(state)
    except Exception as e:
        print(f"❌ Research failed: {e}")
        return {"status": "research_error"}

async def run_sequential_debate(state: DebateState) -> Dict[str, Any]:
    """Sequential debate phase: agents respond in order with context."""
    state["round_count"] += 1
    current_round = state["round_count"]
    state["status"] = f"debating_round_{current_round}"
    
    print(f"🎯 Starting Round {current_round} - Sequential Debate")
    
    # Each agent in the sequence will execute
    for agent_name, agent in DEBATE_ORDER:
        try:
            print(f"  🤖 {agent_name.title()} is responding...")
            
            # Prepare a dedicated state for the agent, including current context
            agent_state = state.copy()
            agent_state["debate_context"] = get_current_debate_context(state, current_round, agent_name)
            
            # Execute the agent
            state = await agent.execute(agent_state)
            
            print(f"  ✅ {agent_name.title()} responded successfully")
            await asyncio.sleep(0.1) # Small delay for realism/sequencing
            
        except Exception as e:
            print(f"  ❌ {agent_name.title()} failed: {e}")
            continue
    
    print(f"✅ Round {current_round} completed")
    return state

async def run_judge(state: DebateState) -> Dict[str, Any]:
    """Judge phase: analyze the debate and decide the next step."""
    current_round = state["round_count"]
    print(f"⚖️ Judge evaluating Round {current_round}...")
    state["status"] = "judging"
    try:
        return await judge.execute(state)
    except Exception as e:
        print(f"❌ Judge execution failed: {e}")
        return {"status": "judge_error"}

async def run_moderator(state: DebateState) -> Dict[str, Any]:
    """Final synthesis phase: create a structured report."""
    print("📝 Starting final report synthesis...")
    state["status"] = "moderating"
    try:
        return await moderator.execute(state)
    except Exception as e:
        print(f"❌ Final report synthesis failed: {e}")
        return {"status": "synthesis_error"}

# --- Conditional Edge Logic ---

def should_continue(state: DebateState) -> str:
    """Decision point: continue debate or move to synthesis."""
    if state["round_count"] >= settings.MAX_ROUNDS:
        print(f"🏁 Debate concluded: Reached maximum rounds ({settings.MAX_ROUNDS})")
        return "synthesize"
    
    judge_decision = state.get("judge_decision")
    if judge_decision and judge_decision.should_continue:
        print(f"⚖️ Judge decision: CONTINUE to Round {state['round_count'] + 1}")
        print(f"   Reasoning: {judge_decision.reasoning}")
        return "continue_debate"
    else:
        print(f"⚖️ Judge decision: CONCLUDE debate")
        if judge_decision:
            print(f"   Reasoning: {judge_decision.reasoning}")
        return "synthesize"

# --- Helper Functions ---

def get_current_debate_context(state: DebateState, current_round: int, current_agent: str) -> str:
    """Get context from the current round for sequential responses."""
    # Messages from the current round so far
    current_round_messages = [
        f"**{msg.role.title()}**: {msg.content}"
        for msg in state.get("messages", [])
        if msg.round == current_round and msg.role != current_agent
    ]
    
    # Messages from the previous round
    prev_round_messages = [
        f"**{msg.role.title()}**: {msg.content}"
        for msg in state.get("messages", [])
        if msg.round == current_round - 1
    ]

    context = ""
    if prev_round_messages:
        context += f"\n\n**Previous Round {current_round - 1} Discussion:**\n" + "\n\n".join(prev_round_messages)
    if current_round_messages:
        context += f"\n\n**Current Round {current_round} So Far:**\n" + "\n\n".join(current_round_messages)
        
    return context.strip()

# --- Graph Builder ---

def create_debate_graph():
    """Create and compile the sequential debate workflow."""
    workflow = StateGraph(DebateState)
    
    # Add all nodes
    workflow.add_node("researcher", run_researcher)
    workflow.add_node("sequential_debate", run_sequential_debate)
    workflow.add_node("judge", run_judge)
    workflow.add_node("moderator", run_moderator)
    
    # Define the flow
    workflow.set_entry_point("researcher")
    workflow.add_edge("researcher", "sequential_debate")
    workflow.add_edge("sequential_debate", "judge")
    
    # Conditional routing from judge decision
    workflow.add_conditional_edges(
        "judge",
        should_continue,
        {
            "continue_debate": "sequential_debate",
            "synthesize": "moderator"
        }
    )
    
    workflow.add_edge("moderator", END)
    
    # Compile with memory checkpointer
    memory = MemorySaver()
    return workflow.compile(checkpointer=memory)

# Create the compiled debate graph
debate_graph = create_debate_graph()