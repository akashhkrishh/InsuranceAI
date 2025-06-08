from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS

from app.controllers.chatbot_controller import chatbot_blueprint
from app.controllers.claims_controller import claims_blueprint
from app.controllers.document_controller import document_blueprint
from app.controllers.policy_comparison_controller import policy_compare_blueprint
from app.controllers.risk_controller import risk_blueprint
from app.config import Config  # Import your Config class properly


def create_app():
    load_dotenv()  # Load environment variables from .env file

    app = Flask(__name__)
    app.config.from_object(Config)  # Load config from your Config class

    CORS(app)  # Enable CORS

    # Register blueprints with URL prefixes
    # app.register_blueprint(welcome_blueprint, url_prefix="/")
    app.register_blueprint(document_blueprint, url_prefix="/api/document")
    app.register_blueprint(risk_blueprint, url_prefix="/api/risk")
    app.register_blueprint(chatbot_blueprint, url_prefix="/api/chatbot")
    app.register_blueprint(policy_compare_blueprint, url_prefix="/api/policy_compare")
    app.register_blueprint(claims_blueprint, url_prefix="/api/claims")

    return app


