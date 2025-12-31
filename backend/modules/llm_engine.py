import os
import json
from groq import Groq

class LLMEngine:
    def __init__(self):
        # ✅ Groq API Key
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        
        # ✅ Latest Llama 3.3 model for high performance
        self.active_model_id = "llama-3.3-70b-versatile" 
        
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
                print(f"🚀 BioGraph Intelligence v3 (Llama-3) Activated")
            except Exception as e:
                print(f"⚠️ Groq Connection Error: {e}")
        else:
            print("⚠️ ERROR: GROQ_API_KEY is missing in .env file.")

    def _get_response(self, prompt, system_instruction=None):
        if not self.client:
            return "⚠️ AI Core is offline. Please check API configuration."

        # ✅ Global System Instruction (Optimized for Visualization References)
        base_instruction = """
        ROLE: You are 'BioGraph AI', a world-class medicinal chemist and research assistant.
        
        STYLE:
        - Use professional, yet engaging language.
        - Use Emojis (🧪, 🧬, 💊, 🔬, 📊) to highlight points.
        - Always use Markdown (Headings, Bold, Lists) for high readability.
        - IMPORTANT: Refer to the visual tools in the UI. For example:
            - 'Check the ADMET Radar Chart for toxicity details.'
            - 'Look at the 3D Structure Viewer to see binding poses.'
            - 'The BioGraph Score (shown on the gauge) indicates high potential.'
        
        LANGUAGE:
        - If the user asks in Roman Urdu/Hindi, reply in Roman Urdu with a scientific touch.
        """
        
        system_msg = system_instruction if system_instruction else base_instruction

        try:
            completion = self.client.chat.completions.create(
                model=self.active_model_id,
                messages=[
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6, # Thora precise rakhne ke liye
                max_tokens=2500
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"❌ AI Error: {e}")
            return "⚠️ System Overload: AI is temporarily unavailable. Please retry in a moment."

    def analyze_drug(self, drug_data, target_id):
        """
        🔬 Scientific Deep-Dive Analysis
        """
        context = f"""
        ANALYZE THIS CANDIDATE:
        - Molecule: {drug_data.get('name')}
        - SMILES: {drug_data.get('smiles')}
        - Target Protein: {target_id}
        - BioGraph Score: {drug_data.get('score')}
        - ADMET Data: {json.dumps(drug_data.get('admet', {}))}
        """
        
        task = """
        Provide a detailed scientific verdict in JSON format.
        Structure:
        {
            "summary": "Engaging 2-line summary 📝",
            "mechanism": "Detailed binding explanation 🔗",
            "safety_analysis": "Critical safety/toxicity review (refer to ADMET chart) ⚠️",
            "clinical_potential": "High/Medium/Low with reasoning 📈",
            "conclusion": "Final Verdict & next steps 🎯"
        }
        RETURN ONLY VALID JSON.
        """
        
        response_text = self._get_response(context, task)
        
        try:
            # Cleaning Llama's markdown wrappers if any
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except:
            return {
                "summary": "Analysis generated with formatting issues.",
                "mechanism": response_text[:500],
                "safety_analysis": "Please check the automated ADMET metrics below.",
                "clinical_potential": "Manual review required",
                "conclusion": "Parsing Error"
            }

    def chat_with_drug(self, user_query, context_data):
        """
        🤖 Context-Aware Interactive Chat
        """
        context = f"""
        CURRENT MOLECULE CONTEXT:
        Name: {context_data.get('name')}
        SMILES: {context_data.get('smiles')}
        Score: {context_data.get('score')}
        ADMET: {context_data.get('admet')}
        
        USER QUESTION: "{user_query}"
        """
        return self._get_response(context)

# Initialize global bot
llm_bot = LLMEngine()