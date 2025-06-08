import os

class Config:
    OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/chat")
    LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "llama3")
