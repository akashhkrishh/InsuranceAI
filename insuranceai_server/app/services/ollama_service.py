import requests
import json

class OllamaService:
    def __init__(self, config):
        self.base_url = config.get("OLLAMA_API_URL")
        self.model = config.get("LLM_MODEL_NAME")

    def chat(self, user_id, user_message=None, messages=None):
        # Use messages if given, else build from single user_message
        if messages is None:
            messages = [{"role": "user", "content": user_message}]

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": True
        }

        try:
            response = requests.post(self.base_url, json=payload, stream=True)
            response.raise_for_status()
        except requests.RequestException as e:
            raise RuntimeError(f"Ollama API request failed: {e}")

        full_response = ""
        try:
            for line in response.iter_lines():
                if not line:
                    continue
                chunk = line.decode("utf-8")
                if chunk.startswith("data:"):
                    chunk = chunk[5:].strip()
                if chunk == "[DONE]":
                    break
                data = json.loads(chunk)
                content = data.get("message", {}).get("content", "")
                full_response += content
        except Exception as e:
            raise RuntimeError(f"Failed to stream Ollama response: {e}")

        return full_response
