from flask import Flask, request, jsonify
from flask_cors import CORS
import ollama
import PyPDF2  # For PDF text extraction; install via `pip install PyPDF2`

app = Flask(__name__)
CORS(app)

# Sample in-memory data (for demo)
policies = []
claims = []

@app.route("/api/policies", methods=["GET", "POST"])
def policies_api():
    if request.method == "GET":
        return jsonify(policies)
    elif request.method == "POST":
        data = request.json
        policies.append(data)
        return jsonify({"message": "Policy added", "policy": data}), 201

@app.route("/api/claims", methods=["GET", "POST"])
def claims_api():
    if request.method == "GET":
        return jsonify(claims)
    elif request.method == "POST":
        data = request.json
        claims.append(data)
        return jsonify({"message": "Claim filed", "claim": data}), 201
@app.route("/api/risk/ask", methods=["POST"])
def risk_ask():
    data = request.json
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
    else:
        # All answers collected, prepare prompt for risk analysis
        prompt = ["Analyze the health insurance risk profile based on the following answers. Provide a risk score (Low, Medium, High) and coverage suggestions. \n"]
     
        prompt_lines = [            
            "Analyze the health insurance risk profile based on the following answers. "
            "Provide a brief risk score (Low, Medium, High) and concise coverage suggestions. "
            "Return only a short summary without extra explanation.\n\n"
        ]
        for q, a in zip(QUESTIONS, answers.values()):
            prompt_lines.append(f"{q} {a}")

        prompt = "\n".join(prompt_lines)

        try:
            # Call ollama LLM to analyze risk
            response = ollama.chat(
                model="llama3",
                messages=[{"role": "user", "content": prompt}]
            )
            llm_reply = response["message"]["content"]

            # You can parse LLM reply here if structured, or just send it as is
            # For demo, let's just send full reply back and expect structured text from LLM
            # You can improve by adding JSON output format in prompt to parse easily

            return jsonify({
                "done": True,
                "llm_response": llm_reply
            })

        except Exception as e:
            return jsonify({"error": f"LLM risk assessment failed: {str(e)}"}), 500

@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    user_message = request.json.get("message", "")
    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": user_message}]
    )
    reply = response["message"]["content"]
    return jsonify({"reply": reply})

@app.route("/api/documents/analyze", methods=["POST"])
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

    # Step 1: Ask LLM if this is an insurance policy
    try:
        classification_prompt = (
            "You are a document classifier. Analyze the following text and determine if it is "
            "an insurance policy document. Answer only with 'Yes' or 'No'.\n\n"
            f"{full_text[:1500]}"  # Limit input to save tokens
        )
        response = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": classification_prompt}]
        )
        decision = response["message"]["content"].strip().lower()
        if "no" in decision:
            return jsonify({"error": "This does not appear to be an insurance policy document."}), 400
    except Exception as e:
        return jsonify({"error": f"LLM validation failed: {str(e)}"}), 500

    # Step 2: Summarize if it is a valid policy
    try:
        summary_prompt = (
            "You are an expert insurance assistant. Analyze the following insurance policy document and generate a clear and concise HTML summary.\n\n"
    "Use these formatting rules:\n"
    "- Use <ul> and <li> for lists.\n"
    "- Use <strong> for key terms or headings.\n"
    "- Use <hr> to separate major sections.\n\n"
    "Organize the summary into the following sections (if available):\n"
    "<ul>"
    "<li><strong>Coverage Details</strong>: What does the policy cover?</li>"
    "<li><strong>Premium & Deductible</strong>: What are the costs?</li>"
    "<li><strong>Claims Process</strong>: How can the user file a claim?</li>"
    "<li><strong>Exclusions</strong>: What is not covered?</li>"
    "<li><strong>Benefits</strong>: Any special benefits or riders?</li>"
    "</ul>\n"
    "<hr>\n"
    "Break down complex policy language into easy-to-understand explanations.\n\n"
    f"{full_text[:4000]}"
        )

        summary_response = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": summary_prompt}]
        )
        summary = summary_response["message"]["content"]
    except Exception as e:
        return jsonify({"error": f"LLM summarization failed: {str(e)}"}), 500

    return jsonify({"summary": summary})

@app.route("/api/claims/guide", methods=["POST"])
def claims_guide():
    user_question = request.json.get("question", "")

    prompt = (
        "You are a helpful insurance advisor. Provide clear and concise guidance to users "
        "about insurance claim processes and required documents based on the following question:\n\n"
        f"{user_question}\n\n"
        "Reply in simple steps or bullet points where helpful."
    )

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )
    reply = response["message"]["content"]
    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)
