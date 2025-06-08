from flask import Blueprint, request, jsonify, current_app
from app.services.ollama_service import OllamaService
import json
from app.data import POLICIES_DB

policy_compare_blueprint = Blueprint("policy_compare", __name__)

@policy_compare_blueprint.route('/compare', methods=['POST'])
def compare_policies():
    data = request.json or {}
    policy_ids = data.get("policies", [])
    user = data.get("user", {})

    if len(policy_ids) < 2:
        return jsonify({"error": "Please provide at least two policy IDs to compare."}), 400

    policies = []
    missing = []
    for pid in policy_ids:
        policy = POLICIES_DB.get(pid)
        if policy:
            policies.append(policy)
        else:
            missing.append(pid)

    if missing:
        return jsonify({"error": f"Policies not found: {', '.join(missing)}"}), 404

    # Build the prompt for the LLM
    prompt_lines = [
        "You are an expert insurance advisor.",
        "Compare the following insurance policies based on the user's profile.",
        "Return only valid JSON with the following structure:\n",
        "{",
        '  "comparison_summary": "Overall verdict comparing the plans.",',
        '  "policy_comparison": [',
        '    {',
        '      "policy_id": "POL001",',
        '      "strengths": ["List of strengths"],',
        '      "weaknesses": ["List of weaknesses"]',
        '    }',
        '  ],',
        '  "coverage_gaps": ["Gap analysis based on user profile and policy offerings"],',
        '  "recommendations": ["Tailored advice to improve coverage or reduce costs"],',
        '  "recommended_policy_id": "POL001"',
        "}\n",
        "IMPORTANT: \"recommended_policy_id\". Do NOT return null or empty value.",
        "Do not include any explanation outside the JSON object.",
        "\nUser Profile:",
        f"- Age: {user.get('age')}",
        f"- Family Size: {user.get('family_size')}",
        f"- Budget: ₹{user.get('budget')}",
        f"- Health Conditions: {', '.join(user.get('health_conditions', ['none']))}",
        "\nPolicies to Compare:"
    ]

    for p in policies:
        prompt_lines.append(
            f"- {p['policy_id']}: {p['plan_type']} by {p['provider']}, Sum Insured ₹{p['sum_insured']}, Premium ₹{p['premium']}, "
            f"Coverage: {', '.join(p['coverage'])}, Exclusions: {', '.join(p['exclusions'])}"
        )

    prompt_text = "\n".join(prompt_lines)

    try:
        config = {
            "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
            "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
        }
        ollama = OllamaService(config)

        ai_response = ollama.chat(
            user_id="policy_comparison",
            messages=[
                {"role": "system", "content": "You are a helpful insurance assistant."},
                {"role": "user", "content": prompt_text}
            ]
        )

        result = json.loads(ai_response)

        return jsonify({
            "user_profile": user,
            "policies_compared": policy_ids,
            "ai_summary": result
        })

    except Exception as e:
        return jsonify({"error": f"Comparison failed: {str(e)}"}), 500
