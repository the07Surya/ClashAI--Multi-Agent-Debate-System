import json
from typing import Dict, Any
from .base_agent import BaseAgent
from graph.state import JudgeDecision
from config.settings import settings

class JudgeAgent(BaseAgent):
    def __init__(self):
        system_prompt = """<role>
You are THE MODERATOR, an experienced debate facilitator who knows when discussions are productive and when they're spinning wheels.
</role>

<responsibilities>
- Determine if the debate should continue or conclude
- Identify gaps, repetitions, and missed opportunities  
- Provide sharp, specific guidance for next round
- Ensure each voice adds unique value
- Recognize when diminishing returns set in
</responsibilities>

<decision_criteria>
CONTINUE if:
- Key perspectives are missing or underdeveloped
- Agents are talking past each other (need redirection)
- New evidence or angles could add value
- Productive disagreement is generating insight

CONCLUDE if:  
- Positions are clearly established and defended
- Arguments are becoming repetitive
- Core issues have been thoroughly explored
- Agents are simply restating previous points
</decision_criteria>

<response_format>
Always respond with valid JSON only. No other text.
</response_format>"""
        super().__init__("Judge", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        round_count = state["round_count"]
        messages = state["messages"]
        
        # Build transcript
        transcript_by_round = {}
        for msg in messages:
            round_num = msg.round
            if round_num not in transcript_by_round:
                transcript_by_round[round_num] = []
            transcript_by_round[round_num].append(f"{msg.role.title()}: {msg.content}")
        
        formatted_transcript = "\n\n".join([
            f"=== ROUND {round_num} ===\n" + "\n\n".join(round_messages)
            for round_num, round_messages in transcript_by_round.items()
        ])

        prompt = f"""<debate_analysis>
TOPIC: {query}
CURRENT_ROUND: {round_count}
MAX_ROUNDS: {settings.MAX_ROUNDS}

FULL_TRANSCRIPT:
{formatted_transcript}
</debate_analysis>

<task>
Analyze this debate and make your decision.

<evaluation_checklist>
□ Are agents repeating themselves?
□ Are there unexplored angles or missing perspectives?  
□ Is productive disagreement still happening?
□ Would another round add meaningful value?
□ Are all four perspectives clearly differentiated?
</evaluation_checklist>

<guidance_rules>
If continuing, give each agent ONE specific focus:
- Innovator: "Focus on [specific opportunity/solution]"
- Skeptic: "Challenge [specific claim/assumption]"  
- Engineer: "Address [specific technical aspect]"
- Ethicist: "Explore [specific moral dimension]"

Keep guidance under 15 words per agent.
</guidance_rules>

Respond with valid JSON only:
{{
    "should_continue": true/false,
    "reasoning": "2-3 sentence explanation of your decision",
    "targeted_prompts": {{
        "innovator": "Specific 10-15 word guidance",
        "skeptic": "Specific 10-15 word guidance", 
        "engineer": "Specific 10-15 word guidance",
        "ethicist": "Specific 10-15 word guidance"
    }}
}}
</task>"""

        response = await self._generate_response(prompt)
        
        try:
            # Clean and parse JSON
            response = response.strip()
            if response.startswith('```json'):
                response = response[7:-3]
            elif response.startswith('```'):
                response = response[3:-3]
            
            decision_data = json.loads(response)
            judge_decision = JudgeDecision(**decision_data)
            
            state["judge_decision"] = judge_decision
            state["status"] = "judge_decision_complete"
            
            print(f"⚖️ Judge Decision: {'CONTINUE' if judge_decision.should_continue else 'CONCLUDE'}")
            print(f"   Reasoning: {judge_decision.reasoning}")
            
        except (json.JSONDecodeError, Exception) as e:
            print(f"❌ Judge decision parsing error: {e}")
            # Smart fallback based on round analysis
            should_continue = (
                round_count < settings.MAX_ROUNDS and 
                round_count < 2  # Continue for at least 2 rounds
            )
            
            judge_decision = JudgeDecision(
                should_continue=should_continue,
                reasoning=f"Round {round_count} analysis: {'Continue debate for deeper exploration' if should_continue else 'Sufficient exploration achieved, ready for synthesis'}",
                targeted_prompts={
                    "innovator": "Focus on your strongest breakthrough opportunity",
                    "skeptic": "Challenge the most concerning risk or assumption",
                    "engineer": "Address the biggest implementation hurdle",
                    "ethicist": "Explore who benefits most and who might be harmed"
                }
            )
            state["judge_decision"] = judge_decision
            state["status"] = "judge_decision_complete"
        
        return state
