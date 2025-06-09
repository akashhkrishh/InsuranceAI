from flask import Blueprint, jsonify, request, current_app
from app.services.ollama_service import OllamaService

chatbot_blueprint = Blueprint("chatbot", __name__)

conversation_contexts = {}

SYSTEM_PROMPT = {
    "role": "system",
    "content": (
        "You are an insurance assistant. You only answer insurance-related questions and respond in simple language. "
        "If the question relates to any claim, provide the link http://localhost:5173/claim-assistant. "
        "If the question is not related to insurance, respond with 'Not a relevant question.' "
        "Greeting messages and questions like 'Who are you?' are allowed."
        "Suggest a question related to insurance."
    )
}
@chatbot_blueprint.route('/chat', methods=['POST'])
def chat():
    data = request.json or {}
    user_id = data.get("user_id")
    user_message = data.get("message")

    if not user_id:
        return jsonify({"error": "Missing 'user_id' in request"}), 400

    history = conversation_contexts.get(user_id, [])


    if not history or (not user_message or user_message.strip() == ""):
        welcome_message = "I am an Insurance Assistant. Ask me a question."
        conversation_contexts[user_id] = [
            SYSTEM_PROMPT,
            {"role": "assistant", "content": welcome_message}
        ]
        return jsonify({
            "user_id": user_id,
            "response": welcome_message
        })

    if not user_message or user_message.strip() == "":
        return jsonify({"error": "Missing 'message' in request"}), 400

    history.append({"role": "user", "content": user_message})

    try:
        config = {
            "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
            "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
        }
        ollama = OllamaService(config)

        response_text = ollama.chat(user_id=user_id, messages=history)

        history.append({"role": "assistant", "content": response_text})

        conversation_contexts[user_id] = history[-20:]

        return jsonify({
            "user_id": user_id,
            "response": response_text
        })

    except Exception as e:
        return jsonify({"error": f"Chatbot failed: {str(e)}"}), 500
