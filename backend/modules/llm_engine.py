import os
import json
import logging
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup simple logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

class LLMEngine:
    def __init__(self):
        # ✅ GitHub Token from .env
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.client = None
        
        # ✅ Model Configuration (GitHub Models supported IDs)
        # Options: "gpt-4o", "meta-llama-3.1-70b-instruct", "phi-3-medium-128k-instruct"
        self.model_id = "gpt-4o" 

        if self.github_token:
            try:
                # GitHub Models is OpenAI-compatible
                self.client = OpenAI(
                    base_url="https://models.inference.ai.azure.com",
                    api_key=self.github_token,
                )
                logging.info(f"BioGraph Engine: GitHub Models ({self.model_id}) Activated")
            except Exception as e:
                logging.error(f"GitHub Models Init Error: {str(e)}")
        else:
            logging.error("CRITICAL: GITHUB_TOKEN is missing in .env file.")

    def _get_response(self, prompt, system_instruction=None):
        """
        Get AI response using GitHub Models API.
        """
        if not self.client:
            return "Error: AI Engine (GitHub) is not configured. Please check your GITHUB_TOKEN."

        base_instruction = """
        ROLE: You are 'BioGraph AI', a world-class medicinal chemist.
        STYLE: Professional, scientific, and clear. Use Markdown.
        UI: Refer to 'ADMET Radar Chart' or '3D Structure Viewer' when relevant.
        LANGUAGE: If asked in Roman Urdu, reply in Roman Urdu with scientific touch.
        """
        
        sys_msg = system_instruction if system_instruction else base_instruction

        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": sys_msg},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            logging.error(f"GitHub Models Error: {str(e)}")
            return f"Error: Failed to get response from GitHub Models. ({str(e)})"

    def analyze_drug(self, drug_data, target_id):
        """
        Detailed scientific analysis for drug candidates.
        """
        context = f"""
        ANALYZE THIS CANDIDATE:
        - Molecule: {drug_data.get('name')}
        - SMILES: {drug_data.get('smiles')}
        - Target Protein: {target_id}
        - BioGraph Score: {drug_data.get('score')}
        - ADMET Data: {json.dumps(drug_data.get('admet', {}))}
        """
        task = "Provide a detailed scientific verdict in JSON format. Structure: {summary, mechanism, safety, clinical, conclusion}."
        
        response_text = self._get_response(context, task)
        
        try:
            cleaned_text = response_text.strip()
            if "```json" in cleaned_text:
                cleaned_text = cleaned_text.split("```json")[1].split("```")[0].strip()
            return json.loads(cleaned_text)
        except:
            return {"summary": "Analysis generated but parsing failed.", "content": response_text}

    def chat_with_drug(self, user_query, context_data):
        """
        Context-aware interactive chat.
        """
        context = f"Context: {context_data.get('name')} ({context_data.get('smiles')})\nQuestion: {user_query}"
        return self._get_response(context)

# Initialize global instance
llm_bot = LLMEngine()