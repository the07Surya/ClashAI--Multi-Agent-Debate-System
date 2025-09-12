import json
from typing import Dict, Any
from .base_agent import BaseAgent
from graph.state import FinalReport

class ModeratorAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are the MODERATOR - an expert synthesizer who creates comprehensive final reports.

Your role:
- Analyze the complete debate transcript objectively
- Identify key insights that emerged from the discussion
- Highlight areas of consensus and persistent disagreements
- Extract unresolved questions requiring further investigation
- Provide actionable recommendations based on the debate

Create balanced, insightful summaries that capture the full value of the expert discussion.

Always respond with valid JSON following this exact structure:
{
    "summary": "Executive summary of the debate and key conclusions",
    "key_insights": ["insight1", "insight2", "insight3", ...],
    "consensus_points": ["area of agreement 1", "area of agreement 2", ...],
    "tensions": ["disagreement 1", "disagreement 2", ...],
    "unresolved_questions": ["question 1", "question 2", ...],
    "recommendations": ["actionable recommendation 1", "recommendation 2", ...]
}"""
        super().__init__("Moderator", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        brief = state.get("research_brief")
        messages = state["messages"]
        
        # Format complete debate transcript
        transcript = "\n\n".join([
            f"ROUND {msg.round} - {msg.role.upper()}:\n{msg.content}"
            for msg in messages
        ])
        
        # Include research context
        research_context = ""
        if brief:
            research_context = f"""
Research Foundation:
- Key Facts: {brief.key_facts}
- Supporting Arguments: {brief.pro_arguments}  
- Critical Arguments: {brief.con_arguments}
- Recent Developments: {brief.recent_developments}
"""
        
        prompt = f"""Original Question: {query}

{research_context}

Complete Expert Debate Transcript:
{transcript}

As the MODERATOR, synthesize this expert debate into a comprehensive final report.

Respond with ONLY valid JSON using this exact structure:
{{
    "summary": "Executive summary of the debate and key conclusions",
    "key_insights": ["insight1", "insight2", "insight3", ...],
    "consensus_points": ["area of agreement 1", "area of agreement 2", ...],
    "tensions": ["disagreement 1", "disagreement 2", ...],
    "unresolved_questions": ["question 1", "question 2", ...],
    "recommendations": ["actionable recommendation 1", "recommendation 2", ...]
}}

Focus on:
- What new insights emerged from the multi-perspective discussion?
- Where did experts find common ground?
- What fundamental disagreements persist?
- What questions need further investigation?
- What practical steps should be considered?"""
        
        response = await self._generate_response(prompt)
        
        try:
            # Clean JSON response
            response = response.strip()
            
            # Handle markdown code blocks
            if response.startswith('```json'):
                response = response[7:]
            if response.endswith('```'):
                response = response[:-3]
            if response.startswith('```'):
                response = response[3:]
            if response.endswith('```'):
                response = response[:-3]
            
            # Extract JSON if it's embedded in text
            if not response.startswith('{'):
                start_idx = response.find('{')
                if start_idx >= 0:
                    response = response[start_idx:]
            
            if not response.endswith('}'):
                end_idx = response.rfind('}') + 1
                if end_idx > 0:
                    response = response[:end_idx]
            
            report_data = json.loads(response)
            final_report = FinalReport(**report_data)
            
            state["final_report"] = final_report
            state["status"] = "complete"
            
        except (json.JSONDecodeError, Exception) as e:
            print(f"Final report synthesis error: {e}")
            print(f"Raw response: {response}")
            
            # Fallback report
            final_report = FinalReport(
                summary=f"Multi-expert debate completed on: {query}. Analysis encountered technical issues but debate transcript is available for review.",
                key_insights=["Multiple expert perspectives were successfully engaged", "Different viewpoints were presented and debated"],
                consensus_points=["The importance of considering multiple perspectives was demonstrated"],
                tensions=["Technical synthesis limitations prevented detailed tension analysis"],
                unresolved_questions=["Detailed analysis requires manual review of debate transcript"],
                recommendations=["Review complete debate transcript for comprehensive insights", "Consider follow-up debates on specific sub-topics"]
            )
            state["final_report"] = final_report
            state["status"] = "complete"
        
        return state