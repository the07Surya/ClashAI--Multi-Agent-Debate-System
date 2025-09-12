from typing import Dict, Any
from datetime import datetime
from .base_agent import BaseAgent
from graph.state import DebateMessage

class InnovatorAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are the INNOVATOR - a visionary expert who champions progress and innovation.

Your role in this SEQUENTIAL DEBATE:
- You often speak FIRST, setting the innovative tone
- Champion new ideas, opportunities, and transformative potential
- Focus on future possibilities and emerging solutions
- Challenge conventional thinking with creative alternatives
- Build upon or respectfully counter previous speakers when relevant

Style: Optimistic, forward-thinking, solution-oriented. 
Always cite specific examples and evidence. Keep responses focused and under 200 words."""
        super().__init__("Innovator", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        brief = state.get("research_brief")
        round_count = state["round_count"]
        debate_context = state.get("debate_context", "")
        
        # Get targeted prompt from judge if available
        targeted_guidance = ""
        if state.get("judge_decision") and state["judge_decision"].targeted_prompts:
            targeted_guidance = state["judge_decision"].targeted_prompts.get("innovator", "")
        
        # Build context-aware prompt
        prompt = f"""Topic: {query}

Research Foundation:
Key Facts: {brief.key_facts if brief else []}
Supporting Evidence: {brief.pro_arguments if brief else []}
Recent Developments: {brief.recent_developments if brief else []}

{debate_context}

{f"Judge's Strategic Guidance: {targeted_guidance}" if targeted_guidance else ""}

As the INNOVATOR in Round {round_count}, provide your {'opening innovation-focused argument' if round_count == 1 and not debate_context.strip() else 'response that builds on the discussion while advancing innovative solutions'}.

Focus on:
- Breakthrough opportunities and transformative potential
- How innovation can address concerns raised by others
- Concrete examples of successful innovations
- Future-oriented solutions

Keep under 200 words and be specific with examples."""
        
        try:
            response = await self._generate_response(prompt)
            
            # Create and add message
            message = DebateMessage(
                role="innovator",
                content=response,
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(message)
            print(f"✅ Innovator Round {round_count}: {len(response)} characters")
            
        except Exception as e:
            print(f"❌ Innovator execution error: {e}")
            # Add error message to maintain flow
            error_message = DebateMessage(
                role="innovator",
                content=f"I apologize, but I encountered a technical issue while formulating my response about {query}. The innovative potential of this topic deserves proper analysis.",
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(error_message)
        
        return state

class SkepticAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are the SKEPTIC - a critical analyst who rigorously examines claims and identifies risks.

Your role in this SEQUENTIAL DEBATE:
- You often RESPOND to the Innovator's optimistic claims
- Question assumptions and challenge unsupported assertions
- Identify potential risks, downsides, and unintended consequences
- Demand evidence and rigorous analysis
- Point out implementation challenges that others may overlook

Style: Analytical, evidence-based, constructively critical. 
Always cite specific concerns and evidence. Keep responses focused and under 200 words."""
        super().__init__("Skeptic", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        brief = state.get("research_brief")
        round_count = state["round_count"]
        debate_context = state.get("debate_context", "")
        
        targeted_guidance = ""
        if state.get("judge_decision") and state["judge_decision"].targeted_prompts:
            targeted_guidance = state["judge_decision"].targeted_prompts.get("skeptic", "")
        
        prompt = f"""Topic: {query}

Research Foundation:
Key Facts: {brief.key_facts if brief else []}
Critical Evidence: {brief.con_arguments if brief else []}
Concerns: {brief.recent_developments if brief else []}

{debate_context}

{f"Judge's Strategic Guidance: {targeted_guidance}" if targeted_guidance else ""}

As the SKEPTIC in Round {round_count}, provide your {'critical analysis' if round_count == 1 and not debate_context.strip() else 'critical response that challenges claims made by previous speakers'}.

Focus on:
- Questioning assumptions and unsupported claims
- Identifying risks and potential negative consequences
- Demanding evidence for optimistic projections
- Pointing out implementation challenges and barriers

Be constructively critical and evidence-based. Keep under 200 words."""
        
        try:
            response = await self._generate_response(prompt)
            
            message = DebateMessage(
                role="skeptic",
                content=response,
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(message)
            print(f"✅ Skeptic Round {round_count}: {len(response)} characters")
            
        except Exception as e:
            print(f"❌ Skeptic execution error: {e}")
            error_message = DebateMessage(
                role="skeptic",
                content=f"I'm experiencing technical difficulties, but I must emphasize that {query} requires careful scrutiny of potential risks and unintended consequences before moving forward.",
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(error_message)
        
        return state

class EngineerAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are the ENGINEER - a technical expert focused on practical implementation and feasibility.

Your role in this SEQUENTIAL DEBATE:
- You respond AFTER Innovator and Skeptic have presented their views
- Ground abstract ideas in technical reality
- Evaluate practical feasibility and implementation challenges
- Consider resource requirements, scalability, and maintenance
- Bridge the gap between vision and practical execution

Style: Pragmatic, detail-oriented, technically grounded.
Focus on "how to actually build/implement this". Keep responses under 200 words."""
        super().__init__("Engineer", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        brief = state.get("research_brief")
        round_count = state["round_count"]
        debate_context = state.get("debate_context", "")
        
        targeted_guidance = ""
        if state.get("judge_decision") and state["judge_decision"].targeted_prompts:
            targeted_guidance = state["judge_decision"].targeted_prompts.get("engineer", "")
        
        prompt = f"""Topic: {query}

Technical Context:
Key Facts: {brief.key_facts if brief else []}
Implementation Factors: {brief.pro_arguments + brief.con_arguments if brief else []}

{debate_context}

{f"Judge's Strategic Guidance: {targeted_guidance}" if targeted_guidance else ""}

As the ENGINEER in Round {round_count}, provide your {'technical feasibility analysis' if round_count == 1 and not debate_context.strip() else 'engineering perspective that addresses the practical implementation aspects of what previous speakers have discussed'}.

Focus on:
- Technical feasibility and implementation challenges
- Resource requirements and scalability considerations
- Practical solutions to problems raised by others
- Real-world constraints and technical limitations

Ground your response in technical reality. Keep under 200 words."""
        
        try:
            response = await self._generate_response(prompt)
            
            message = DebateMessage(
                role="engineer",
                content=response,
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(message)
            print(f"✅ Engineer Round {round_count}: {len(response)} characters")
            
        except Exception as e:
            print(f"❌ Engineer execution error: {e}")
            error_message = DebateMessage(
                role="engineer",
                content=f"Technical difficulties prevent my full analysis, but from an engineering perspective, {query} requires careful consideration of implementation feasibility, resource requirements, and scalability factors.",
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(error_message)
        
        return state

class EthicistAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are the ETHICIST - a moral philosopher examining ethical implications and social responsibility.

Your role in this SEQUENTIAL DEBATE:
- You speak LAST in each round, providing moral perspective on all previous arguments
- Examine ethical implications of proposed solutions
- Consider impact on different stakeholders and communities
- Address questions of fairness, justice, and social responsibility
- Weigh moral considerations against practical and innovative arguments

Style: Thoughtful, principled, human-centered.
Consider diverse ethical frameworks and stakeholder impacts. Keep responses under 200 words."""
        super().__init__("Ethicist", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        brief = state.get("research_brief")
        round_count = state["round_count"]
        debate_context = state.get("debate_context", "")
        
        targeted_guidance = ""
        if state.get("judge_decision") and state["judge_decision"].targeted_prompts:
            targeted_guidance = state["judge_decision"].targeted_prompts.get("ethicist", "")
        
        prompt = f"""Topic: {query}

Ethical Context:
Key Facts: {brief.key_facts if brief else []}
Social Implications: {brief.pro_arguments + brief.con_arguments if brief else []}

{debate_context}

{f"Judge's Strategic Guidance: {targeted_guidance}" if targeted_guidance else ""}

As the ETHICIST speaking LAST in Round {round_count}, provide your {'ethical analysis' if round_count == 1 and not debate_context.strip() else 'moral perspective on the arguments presented by the Innovator, Skeptic, and Engineer'}.

Focus on:
- Ethical implications of proposed solutions and concerns raised
- Impact on different stakeholders and communities
- Questions of fairness, justice, and social responsibility
- Moral considerations that should guide decision-making

Consider multiple ethical frameworks. Keep under 200 words."""
        
        try:
            response = await self._generate_response(prompt)
            
            message = DebateMessage(
                role="ethicist",
                content=response,
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(message)
            print(f"✅ Ethicist Round {round_count}: {len(response)} characters")
            
        except Exception as e:
            print(f"❌ Ethicist execution error: {e}")
            error_message = DebateMessage(
                role="ethicist",
                content=f"Despite technical challenges, I must emphasize that {query} raises important ethical questions about stakeholder impact, fairness, and social responsibility that deserve careful moral consideration.",
                round=round_count,
                timestamp=datetime.now().isoformat()
            )
            state["messages"].append(error_message)
        
        return state