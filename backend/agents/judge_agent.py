import json
from typing import Dict, Any
from .base_agent import BaseAgent
from graph.state import JudgeDecision
from config.settings import settings

class JudgeAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are the JUDGE - an impartial debate moderator who ensures productive discourse.

Your responsibilities:
- Analyze debate quality and depth of discussion
- Determine if the debate should continue or conclude
- Provide clear reasoning for your decisions
- Generate targeted prompts to guide productive next rounds
- Ensure all perspectives are thoroughly explored

Focus on maximizing insight while preventing repetition or stagnation.

Always respond with valid JSON following this exact structure:
{
    "should_continue": true/false,
    "reasoning": "Your detailed analysis and reasoning",
    "targeted_prompts": {
        "innovator": "Specific guidance for innovator's next response",
        "skeptic": "Specific guidance for skeptic's next response",
        "engineer": "Specific guidance for engineer's next response",
        "ethicist": "Specific guidance for ethicist's next response"
    }
}"""
        super().__init__("Judge", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        round_count = state["round_count"]
        messages = state["messages"]
        
        # Format debate transcript
        transcript = "\n\n".join([
            f"ROUND {msg.round} - {msg.role.upper()}:\n{msg.content}"
            for msg in messages
        ])
        
        prompt = f"""Debate Topic: {query}
Current Round: {round_count}
Max Rounds: {settings.MAX_ROUNDS}

Complete Debate Transcript:
{transcript}

As the JUDGE, analyze this debate and decide:

1. Should the debate CONTINUE or CONCLUDE?
2. What is your detailed reasoning?
3. If continuing, provide specific guidance for each expert's next response.

Respond with ONLY valid JSON using this exact structure:
{{
    "should_continue": true/false,
    "reasoning": "Your detailed analysis and reasoning",
    "targeted_prompts": {{
        "innovator": "Specific guidance for innovator's next response",
        "skeptic": "Specific guidance for skeptic's next response",
        "engineer": "Specific guidance for engineer's next response",
        "ethicist": "Specific guidance for ethicist's next response"
    }}
}}

Consider:
- Are key points being addressed adequately?
- Is there productive disagreement or just repetition?
- Are important perspectives missing?
- Would another round add significant value?"""
        
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
            
            decision_data = json.loads(response)
            judge_decision = JudgeDecision(**decision_data)
            
            state["judge_decision"] = judge_decision
            state["status"] = "judge_decision_complete"
            
        except (json.JSONDecodeError, Exception) as e:
            print(f"Judge decision parsing error: {e}")
            print(f"Raw response: {response}")
            
            # Fallback decision
            judge_decision = JudgeDecision(
                should_continue=round_count < settings.MAX_ROUNDS,
                reasoning=f"Default continuation logic applied due to parsing error. Round {round_count} of {settings.MAX_ROUNDS}.",
                targeted_prompts={
                    "innovator": "Continue developing your innovative perspective with specific examples",
                    "skeptic": "Provide more detailed critical analysis and identify specific risks",
                    "engineer": "Focus on technical implementation details and practical constraints",
                    "ethicist": "Elaborate on ethical implications and stakeholder impacts"
                }
            )
            state["judge_decision"] = judge_decision
            state["status"] = "judge_decision_complete"
        
        return state