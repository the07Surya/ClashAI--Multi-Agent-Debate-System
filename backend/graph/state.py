from typing import List, Dict, Any, Optional, TypedDict
from pydantic import BaseModel
from datetime import datetime

class DebateMessage(BaseModel):
    role: str
    content: str
    round: int
    timestamp: str

class ResearchBrief(BaseModel):
    key_facts: List[str] = []
    pro_arguments: List[str] = []
    con_arguments: List[str] = []
    recent_developments: List[str] = []
    source_urls: List[str] = []

class JudgeDecision(BaseModel):
    should_continue: bool
    reasoning: str
    targeted_prompts: Dict[str, str] = {}
    
    # Add this to handle dictionary inputs
    @classmethod
    def parse_obj(cls, obj):
        if isinstance(obj, dict):
            return cls(**obj)
        return obj
class FinalReport(BaseModel):
    summary: str
    key_insights: List[str] = []
    consensus_points: List[str] = []
    tensions: List[str] = []
    unresolved_questions: List[str] = []
    recommendations: List[str] = []

class DebateState(TypedDict):
    user_query: str
    research_brief: Optional[ResearchBrief]
    messages: List[DebateMessage]
    round_count: int
    judge_decision: Optional[JudgeDecision]
    final_report: Optional[FinalReport]
    status: str