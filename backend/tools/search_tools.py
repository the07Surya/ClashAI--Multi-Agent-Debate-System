from tavily import TavilyClient
from config.settings import settings
from typing import List, Dict, Any
from dotenv import load_dotenv
load_dotenv()
import asyncio

class TavilySearchTool:
    def __init__(self):
        if not settings.TAVILY_API_KEY:
            raise ValueError("TAVILY_API_KEY not found in environment")
        self.client = TavilyClient(api_key=settings.TAVILY_API_KEY)
    
    async def search(self, query: str, max_results: int = 8) -> List[Dict[str, Any]]:
        """Perform async web search using Tavily API"""
        try:
            loop = asyncio.get_event_loop()
            results = await asyncio.wait_for(
                loop.run_in_executor(
                    None,
                    lambda: self.client.search(
                        query=query,
                        search_depth="advanced",
                        max_results=max_results,
                        include_domains=["wikipedia.org", "reuters.com", "bbc.com", "nature.com"],
                        exclude_domains=["tiktok.com", "instagram.com"]
                    )
                ),
                timeout=settings.SEARCH_TIMEOUT
            )
            return results.get("results", [])
        except asyncio.TimeoutError:
            print(f"Search timeout for query: {query}")
            return []
        except Exception as e:
            print(f"Search error: {e}")
            return []

# Global search tool instance
search_tool = TavilySearchTool()