# controllers/claims_controller.py

from flask import Blueprint, jsonify, current_app
from app.data import POLICIES_DB
from app.services.ollama_service import OllamaService
import json

claims_blueprint = Blueprint("claims", __name__)

@claims_blueprint.route('/<policy_id>', methods=['GET'])
def get_claim_process(policy_id):
    policy = POLICIES_DB.get(policy_id)
    if not policy:
        return jsonify({"error": "Policy not found"}), 404

    prompt = (
        "You are an expert insurance claims advisor.\n"
        "Based on the following policy details, generate a JSON object with the claim process steps and the required documents.\n"
        "Also provide a simple English explanation of how to file a claim for this policy.\n"
        "Return only valid JSON with this exact structure, without any extra text:\n"
        "{\n"
        '  "claim_process": {\n'
        '    "steps": ["step 1", "step 2", "..."],\n'
        '    "required_documents": ["doc1", "doc2", "..."]\n'
        '  },\n'
        '  "simple_explanation": "Explain claim filing in simple English."\n'
        "}\n"
        "Do not include any explanations, introductions, or trailing text.\n"
        f"Policy details:\n"
        f"Provider: {policy['provider']}\n"
        f"Plan Type: {policy['plan_type']}\n"
        f"Coverage: {', '.join(policy.get('coverage', []))}\n"
        f"Exclusions: {', '.join(policy.get('exclusions', []))}\n"
        f"Sum Insured: ₹{policy['sum_insured']}\n"
        f"Premium: ₹{policy['premium']}\n"
    )

    try:
        config = {
            "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
            "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
        }
        ollama = OllamaService(config)

        ai_response = ollama.chat(
            user_id=f"claims_{policy_id}",
            messages=[
                {"role": "system", "content": "You are a helpful insurance assistant."},
                {"role": "user", "content": prompt}
            ]
        )


        # Attempt to parse JSON response
        result = json.loads(ai_response)

        # Validate keys in the response, else fallback
        claim_process = result.get("claim_process")
        simple_explanation = result.get("simple_explanation")

        if not claim_process or not simple_explanation:
            raise ValueError("Missing keys in AI response")

    except Exception as e:
        # Fallback to DB claim_process if AI fails
        claim_process = policy.get("claim_process", {})
        simple_explanation = (
            "To file a claim, follow the documented steps provided with your policy."
        )
        print(f"AI processing failed: {e}")

    return jsonify({
        "policy_id": policy_id,
        "provider": policy["provider"],
        "plan_type": policy["plan_type"],
        "claim_process": claim_process,
        "simple_explanation": simple_explanation
    })
