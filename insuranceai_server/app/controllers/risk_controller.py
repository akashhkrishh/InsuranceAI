from flask import Blueprint, jsonify, request, current_app
from app.services.ollama_service import OllamaService
import json

risk_blueprint = Blueprint("risk", __name__)

@risk_blueprint.route('/ask', methods=['POST'])
def risk_ask():
    data = request.json or {}
    answers = data.get("answers", {})

    QUESTIONS = [
        "What is your age?",
        "Do you smoke? (Yes/No)",
        "Do you have any pre-existing health conditions?",
        "What is your occupation?",
        "How often do you exercise weekly?",
        "Is there any family history of chronic illness?"
    ]

    current_index = len(answers)

    if current_index < len(QUESTIONS):
        next_question = QUESTIONS[current_index]
        return jsonify({"done": False, "question": next_question})

    prompt_lines = [
        "You are an expert insurance analyst.",
        "Must include Based on the following answers, provide a risk score, summary, and 2–4 coverage suggestions.",
        "Respond ONLY in JSON with this format:",
        "{",
        '  "risk_score": "Low | Medium | High",',
        '  "summary": "Short paragraph about the health risk profile.",',
        '  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]',
        "}",
        "Only return valid JSON.\n"
    ]

    ordered_answers = [answers.get(str(i), "") for i in range(len(QUESTIONS))]

    for question, answer in zip(QUESTIONS, ordered_answers):
        prompt_lines.append(f"{question} {answer}")

    prompt_text = "\n".join(prompt_lines)

    try:
        config = {
            "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
            "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
        }
        ollama = OllamaService(config)

        raw_response = ollama.chat(user_id="risk_assessment", user_message=prompt_text)

        try:
            llm_response = json.loads(raw_response)
        except json.JSONDecodeError:
            return jsonify({
                "done": True,
                "llm_response_raw": raw_response,
                "error": "The LLM response was not valid JSON."
            }), 200

        return jsonify({
            "done": True,
            "llm_response": llm_response
        })

    except Exception as e:
        return jsonify({"error": f"LLM risk assessment failed: {str(e)}"}), 500
