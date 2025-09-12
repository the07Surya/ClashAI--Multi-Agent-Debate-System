import json
from typing import Any, Dict, List
from datetime import datetime

def format_timestamp() -> str:
    """Generate ISO formatted timestamp"""
    return datetime.now().isoformat()

def safe_json_parse(json_str: str, fallback: Any = None) -> Any:
    """Safely parse JSON with fallback"""
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return fallback

def validate_agent_response(response: str) -> bool:
    """Validate agent response meets basic criteria"""
    if not response or not response.strip():
        return False
    if len(response) < 10:
        return False
    if len(response) > 2000:
        return False
    return True

class DebateMetrics:
    """Track debate performance metrics"""
    
    def __init__(self):
        self.start_time = None
        self.end_time = None
        self.round_times = []
        self.agent_response_times = {}
    
    def start_debate(self):
        self.start_time = datetime.now()
    
    def end_debate(self):
        self.end_time = datetime.now()
    
    def get_total_duration(self) -> float:
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return 0.0
    
    def get_average_round_time(self) -> float:
        if not self.round_times:
            return 0.0
        return sum(r.get("duration", 0) for r in self.round_times) / len(self.round_times)
        