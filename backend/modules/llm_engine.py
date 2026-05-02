import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from modules.logger import logger

# Load environment variables
load_dotenv()

class LLMEngine:
    def __init__(self):
        # ✅ GitHub Token from .env
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.client = None
        
        # ✅ Model Configuration (GitHub Models supported IDs)
        self.model_id = "gpt-4o" 

        if self.github_token:
            try:
                # GitHub Models is OpenAI-compatible
                self.client = OpenAI(
                    base_url="https://models.inference.ai.azure.com",
                    api_key=self.github_token,
                )
                logger.info(f"BioGraph LLM Engine: GitHub Models ({self.model_id}) Activated")
            except Exception as e:
                logger.error(f"GitHub Models Init Error: {str(e)}")
        else:
            logger.error("CRITICAL: GITHUB_TOKEN is missing in .env file.")

    def _get_response(self, prompt, system_instruction=None):
        """
        Get AI response using GitHub Models API with enhanced safety and style.
        """
        if not self.client:
            return "Error: AI Engine (GitHub) is not configured. Please check your GITHUB_TOKEN."

        base_instruction = """
        ROLE: You are 'BioGraph AI', a world-class medicinal chemist and computational biologist.
        STYLE: Professional, scientific, and data-driven. Use Markdown for formatting.
        UI CONTEXT: The user is viewing a 3D dashboard with ADMET radar charts and 3D protein-ligand interaction views.
        TONE: Authoritative yet accessible.
        LANGUAGE: If the user communicates in Roman Urdu, respond in Roman Urdu with a professional scientific touch.
        """
        
        sys_msg = system_instruction if system_instruction else base_instruction

        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[
                    {"role": "system", "content": sys_msg},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"LLM Response Error: {str(e)}")
            return f"Error: Failed to generate scientific insight. ({str(e)})"

    def analyze_drug(self, drug_data, target_id):
        """
        Detailed scientific analysis for drug candidates with structured output.
        """
        context = f"""
        ANALYZE THIS CANDIDATE FOR REPURPOSING:
        - Molecule Name: {drug_data.get('name')}
        - SMILES: {drug_data.get('smiles')}
        - Target Protein (PDB): {target_id}
        - AI Binding Score (pKd): {drug_data.get('score')}
        - ADMET Profile: {json.dumps(drug_data.get('admet', {}))}
        """
        
        task = """
        Provide a rigorous scientific verdict. Your output MUST be in JSON format.
        Structure: 
        {
          "summary": "High-level overview of the discovery",
          "mechanism": "Proposed biochemical mechanism of interaction",
          "safety": "Detailed safety and toxicity assessment based on ADMET",
          "clinical": "Potential clinical implications or therapeutic use",
          "conclusion": "Final verdict on whether this should proceed to wet-lab testing"
        }
        Do not include any text outside the JSON block.
        """
        
        response_text = self._get_response(context, task)
        
        try:
            # Robust JSON extraction
            cleaned_text = response_text.strip()
            if "```json" in cleaned_text:
                cleaned_text = cleaned_text.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned_text:
                 cleaned_text = cleaned_text.split("```")[1].split("```")[0].strip()
            
            return json.loads(cleaned_text)
        except Exception as e:
            logger.warning(f"LLM JSON Parsing Failed: {e}. Returning raw content.")
            return {
                "summary": "Scientific analysis generated.",
                "content": response_text,
                "error": "Structured parsing failed."
            }

    def chat_with_drug(self, user_query, context_data):
        """
        Context-aware interactive chat for deep-dive research.
        """
        context = f"Research Context: Molecule {context_data.get('name')} (SMILES: {context_data.get('smiles')}). Previous Score: {context_data.get('score')}.\nUser Question: {user_query}"
        return self._get_response(context)

    def summarize_paper(self, abstract_or_url):
        """
        Summarizes biomedical research papers/abstracts.
        Returns structured JSON with key findings, relevance, and keywords.
        """
        task = """
        You are BioGraph AI, an expert biomedical research analyst.
        A researcher has provided a scientific paper abstract or text.
        
        Provide a structured JSON summary:
        {
          "title_guess": "Inferred paper title if not provided",
          "key_findings": "2-3 most important scientific findings",
          "drug_targets": "Any drug targets, proteins, or diseases mentioned",
          "methodology": "Research methods used (ML, clinical trial, etc.)",
          "relevance": "How this relates to drug repurposing or biomedical AI",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }
        Return ONLY valid JSON. No text outside the JSON block.
        
        Paper/Abstract to analyze:\n""" + abstract_or_url
        
        response_text = self._get_response(task)
        try:
            cleaned = response_text.strip()
            if "```json" in cleaned:
                cleaned = cleaned.split("```json")[1].split("```")[0].strip()
            elif "```" in cleaned:
                cleaned = cleaned.split("```")[1].split("```")[0].strip()
            return json.loads(cleaned)
        except Exception:
            return {"key_findings": response_text, "error": "Structured parsing failed"}

# Initialize global instance
llm_bot = LLMEngine()