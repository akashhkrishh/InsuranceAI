from flask import Blueprint, jsonify, request, current_app
from app.services.ollama_service import OllamaService

chatbot_blueprint = Blueprint("chatbot", __name__)

# In-memory conversation store: user_id -> list of messages
conversation_contexts = {}

@chatbot_blueprint.route('/', methods=['POST'])
def chat():
    data = request.json or {}
    user_id = data.get("user_id")
    user_message = data.get("message")

    if not user_id or not user_message:
        return jsonify({"error": "Missing 'user_id' or 'message' in request"}), 400

    # Load conversation history or start new
    history = conversation_contexts.get(user_id, [])

    # Add user message to history
    history.append({"role": "user", "content": user_message})

    try:
        config = {
            "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
            "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
        }
        ollama = OllamaService(config)

        # Pass full conversation history to chat method
        response_text = ollama.chat(user_id=user_id, messages=history)

        # Add assistant reply to history
        history.append({"role": "assistant", "content": response_text})

        # Save updated conversation (limit history to last 20 messages)
        conversation_contexts[user_id] = history[-20:]

        return jsonify({
            "user_id": user_id,
            "response": response_text
        })

    except Exception as e:
        return jsonify({"error": f"Chatbot failed: {str(e)}"}), 500
