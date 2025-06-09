from flask import Blueprint, jsonify, request, current_app
import PyPDF2
import json
from app.services.ollama_service import OllamaService

document_blueprint = Blueprint("document", __name__)

@document_blueprint.route('/analyze', methods=['POST'])
def analyze_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    try:
        pdf_reader = PyPDF2.PdfReader(file)
        full_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    except Exception as e:
        return jsonify({"error": f"Failed to extract PDF text: {str(e)}"}), 500

    config = {
        "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
        "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
    }
    ollama = OllamaService(config)

    try:
        classification_prompt = (
            "You are a document classifier. Analyze the following text and determine if it is "
            "an insurance policy document. Answer ONLY with 'Yes' or 'No'.\n\n"
            f"{full_text[:1500]}"
        )
        response = ollama.chat(user_id="classifier", user_message=classification_prompt)
        decision = response.strip().lower()

        if "no" in decision:
            return jsonify({"error": "This does not appear to be an insurance policy document."}), 400
    except Exception as e:
        return jsonify({"error": f"LLM validation failed: {str(e)}"}), 500

    try:
        summary_prompt = (
            "You are an expert insurance assistant.\n\n"
            "Analyze the following insurance policy document and return ONLY a valid JSON object.\n"
            "Do NOT include any extra text, labels, or formatting like HTML or markdown.\n"
            "The JSON must strictly follow this structure:\n\n"
            "{\n"
            '  "coverage_details": "Clearly explain what the policy covers.",\n'
            '  "premium_and_deductible": "Mention any premium or deductible costs.",\n'
            '  "claims_process": "Summarize the steps required to file a claim.",\n'
            '  "exclusions": "List what is not covered by the policy.",\n'
            '  "benefits": "List any special benefits or features."\n'
            "}\n\n"
            "Return ONLY the JSON object, without any explanation or extra characters.\n\n"
            "Document text to analyze:\n\n"
            f"{full_text[:4000]}"
        )

        llm_response = ollama.chat(user_id="summarizer", user_message=summary_prompt)

        json_start = llm_response.find("{")
        json_end = llm_response.rfind("}") + 1
        json_str = llm_response[json_start:json_end].strip()

        try:
            summary_json = json.loads(json_str)
        except json.JSONDecodeError:
            return jsonify({
                "error": "LLM returned invalid JSON format.",
                "summary_raw": llm_response
            }), 200

    except Exception as e:
        return jsonify({"error": f"LLM summarization failed: {str(e)}"}), 500

    return jsonify({
        "summary": summary_json,
        "summary_raw": llm_response
    }), 200
