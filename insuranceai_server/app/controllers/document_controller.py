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

    # Step 1: Extract text from PDF
    try:
        pdf_reader = PyPDF2.PdfReader(file)
        full_text = ""
        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                full_text += text + "\n"
    except Exception as e:
        return jsonify({"error": f"Failed to extract PDF text: {str(e)}"}), 500

    # Step 2: Init OllamaService with app config
    config = {
        "OLLAMA_API_URL": current_app.config["OLLAMA_API_URL"],
        "LLM_MODEL_NAME": current_app.config["LLM_MODEL_NAME"]
    }
    ollama = OllamaService(config)

    # Step 3: Check if it's an insurance policy
    try:
        classification_prompt = (
            "You are a document classifier. Analyze the following text and determine if it is "
            "an insurance policy document. Answer only with 'Yes' or 'No'.\n\n"
            f"{full_text[:1500]}"
        )
        response = ollama.chat(user_id="classifier", user_message=classification_prompt)
        decision = response.strip().lower()

        if "no" in decision:
            return jsonify({"error": "This does not appear to be an insurance policy document."}), 400
    except Exception as e:
        return jsonify({"error": f"LLM validation failed: {str(e)}"}), 500

    # Step 4: Generate structured JSON summary
    try:
        summary_prompt = (
            "You are an expert insurance assistant. Analyze the following insurance policy document and generate a user-friendly JSON summary.\n\n"
            "Return only valid JSON in this format:\n\n"
            "{\n"
            '  "coverage_details": "What the policy covers.",\n'
            '  "premium_and_deductible": "Costs including premiums and deductibles.",\n'
            '  "claims_process": "Steps for the user to file a claim.",\n'
            '  "exclusions": "What is not covered by the policy.",\n'
            '  "benefits": "Any special benefits, riders, or features."\n'
            "}\n\n"
            "Use plain, easy-to-understand language. Do not include extra explanation or formatting like HTML or markdown.\n\n"
            "Begin analyzing the document below:\n\n"
            f"{full_text[:4000]}"
        )

        llm_response = ollama.chat(user_id="summarizer", user_message=summary_prompt)

        # Try parsing LLM output as JSON
        try:
            summary_json = json.loads(llm_response)
        except json.JSONDecodeError:
            return jsonify({
                "summary_raw": llm_response,
                "error": "LLM returned invalid JSON format."
            }), 200

    except Exception as e:
        return jsonify({"error": f"LLM summarization failed: {str(e)}"}), 500

    return jsonify({"summary": summary_json})
