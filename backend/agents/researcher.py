import json
from typing import Dict, Any
from .base_agent import BaseAgent
from tools.search_tools import search_tool
from graph.state import ResearchBrief
from duckduckgo_search import DDGS


class ResearcherAgent(BaseAgent):
    def __init__(self):
        system_prompt = """You are an expert research analyst. Your role is to:
        1. Research topics thoroughly using web search results
        2. Extract and synthesize key information
        3. Identify arguments from multiple perspectives
        4. Present findings in structured JSON format
        
        Always respond with valid JSON following this exact structure:
        {
            "key_facts": ["fact1", "fact2", ...],
            "pro_arguments": ["argument1", "argument2", ...],
            "con_arguments": ["counter1", "counter2", ...],
            "recent_developments": ["development1", "development2", ...],
            "source_urls": ["url1", "url2", ...]
        }
        
        Be objective, factual, and comprehensive."""
        super().__init__("Researcher", system_prompt)
    
    async def execute(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state["user_query"]
        
        # Perform web search
        search_results = await search_tool.search(query, max_results=8)
        
        if not search_results:
            # Fallback brief if search fails
            fallback_brief = ResearchBrief(
                key_facts=[f"Search unavailable for: {query}"],
                pro_arguments=["Unable to retrieve supporting arguments"],
                con_arguments=["Unable to retrieve opposing arguments"],
                recent_developments=["No recent developments available"],
                source_urls=[]
            )
            state["research_brief"] = fallback_brief
            state["status"] = "research_complete"
            return state
        
        # Prepare search context
        search_context = "\n\n".join([
            f"SOURCE {i+1}:\nTitle: {result.get('title', 'N/A')}\n"
            f"Content: {result.get('content', 'N/A')[:500]}...\n"
            f"URL: {result.get('url', 'N/A')}"
            for i, result in enumerate(search_results[:6])
        ])
        
        synthesis_prompt = f"""Research Topic: {query}

Search Results:
{search_context}

Based on these search results, synthesize the information into a structured analysis.
Based on these search results, synthesize the information into a structured analysis.
You MUST extract information for all the following keys.

- key_facts: Extract objective, well-established facts about the topic.
- pro_arguments: Extract arguments that support, favor, or are optimistic about the topic.
- con_arguments: Extract arguments that oppose, criticize, or raise concerns about the topic.
- recent_developments: Extract recent news, updates, or developments related to the topic.
- source_urls: Extract the source URLs for verification.

Respond with ONLY valid JSON, no other text. Use this exact structure:
{{
    "key_facts": ["fact1", "fact2", ...],
    "pro_arguments": ["argument1", "argument2", ...],
    "con_arguments": ["counter1", "counter2", ...],
    "recent_developments": ["development1", "development2", ...],
    "source_urls": ["url1", "url2", ...]
}}"""
        
        # Generate structured brief
        response = await self._generate_response(synthesis_prompt)
        
        try:
            # Clean and parse JSON
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
            
            brief_data = json.loads(response)
            research_brief = ResearchBrief(**brief_data)
            
            # Add source URLs from search results
            if not research_brief.source_urls or len(research_brief.source_urls) == 0:
                research_brief.source_urls = [
                    result.get('url', '') for result in search_results[:5]
                    if result.get('url')
                ]
            
            state["research_brief"] = research_brief
            state["status"] = "research_complete"
            
        except (json.JSONDecodeError, Exception) as e:
            print(f"Research synthesis error: {e}")
            print(f"Raw response: {response}")
            
            # Fallback brief with search results
            fallback_brief = ResearchBrief(
                key_facts=[f"Research on: {query}"],
                pro_arguments=["Multiple perspectives exist supporting this topic"],
                con_arguments=["Various criticisms and concerns have been raised"],
                recent_developments=["Ongoing developments in this area"],
                source_urls=[result.get('url', '') for result in search_results[:3] if result.get('url')]
            )
            state["research_brief"] = fallback_brief
            state["status"] = "research_complete"
        
        return state