import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: str = "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"
    TAVILY_API_KEY: str = "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"
    
    # Server Configuration
    HOST: str = "localhost"
    PORT: int = 8000
    
    # Debate Configuration
    MAX_ROUNDS: int = 3
    MAX_AGENTS: int = 4
    
    # Model Configuration
    LLM_MODEL: str = "gemma2-9b-it"
    
    # Timeouts
    AGENT_TIMEOUT: int = 30
    SEARCH_TIMEOUT: int = 15
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()