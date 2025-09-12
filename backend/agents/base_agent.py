import json
from abc import ABC, abstractmethod
from typing import Dict, Any
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage
from config.settings import settings
import asyncio

class BaseAgent(ABC):
    def __init__(self, name: str, system_prompt: str):
        self.name = name
        self.system_prompt = system_prompt
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY not found in environment")
        self.llm = ChatGroq(
            groq_api_key=settings.GROQ_API_KEY,
            model_name=settings.LLM_MODEL,
            temperature=0.7,
            max_tokens=2048, # Increased for complex JSON
            timeout=settings.AGENT_TIMEOUT
        )
    
    @abstractmethod
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        pass

    def _clean_and_parse_json(self, text: str) -> Dict[str, Any]:
        """Cleans and parses a JSON string from LLM output."""
        text = text.strip()
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            json_str = text[start_idx:end_idx+1]
            try:
                # --- FIX: Added strict=False to allow control characters like \n inside strings ---
                return json.loads(json_str, strict=False)
            except json.JSONDecodeError as e:
                print(f"JSON parsing failed for {self.name}: {e}")
                raise
        else:
            raise ValueError("No valid JSON object found in the response.")
        
    async def _generate_response(self, prompt: str, is_json: bool = False, max_retries: int = 3) -> str:
        """Generate response with timeout, error handling, and retries."""
        for attempt in range(max_retries):
            try:
                messages = [
                    SystemMessage(content=self.system_prompt),
                    HumanMessage(content=prompt)
                ]
                
                if is_json:
                    messages[1].content += "\n\nIMPORTANT: Your response must be valid JSON only, without any additional text or markdown formatting."
                
                response = await asyncio.wait_for(
                    self.llm.ainvoke(messages),
                    timeout=settings.AGENT_TIMEOUT
                )
                
                content = response.content.strip()
                if not content:
                    raise ValueError("Empty response from model")
                
                if is_json:
                    # Perform a validation parse before returning
                    self._clean_and_parse_json(content)

                return content
                
            except (asyncio.TimeoutError, ValueError, json.JSONDecodeError) as e:
                print(f"Attempt {attempt + 1} failed for {self.name}: {e}")
                if attempt == max_retries - 1:
                    return f"Error: Failed to get a valid response for {self.name} after {max_retries} attempts."
                await asyncio.sleep(1)
        
        return f"Error: Failed to generate response after {max_retries} attempts"