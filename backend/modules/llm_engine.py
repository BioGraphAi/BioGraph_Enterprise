import os
import json
from google import genai
from google.genai import types

class LLMEngine:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        # 🚀 Use the best model we found
        self.active_model_id = "gemini-2.5-flash" 
        
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                print(f"✅ BioGraph Intelligence Activated (Google Gen AI SDK)")
            except Exception as e:
                print(f"⚠️ GenAI Init Error: {e}")
        else:
            print("⚠️ WARNING: GEMINI_API_KEY not found.")

    def _get_response(self, prompt, system_instruction=None):
        """
        Smart Response Generator with Auto-Fallback
        """
        if not self.client:
            return "⚠️ AI Brain is offline. API Key Missing."

        candidate_models = [
            self.active_model_id,
            "gemini-2.5-flash",
            "gemini-2.5-pro",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-pro"
        ]
        
        # Unique list maintain karte hue fallback logic
        seen = set()
        unique_candidates = [x for x in candidate_models if not (x in seen or seen.add(x))]

        # 🎨 GLOBAL STYLE INSTRUCTION (Jo aapne manga)
        # Ye har response ko format karega
        base_instruction = """
        ROLE: You are 'BioGraph AI', a highly intelligent and versatile research assistant.
        
        TONE & STYLE:
        - Professional yet Casual (Friendly Scientist vibe).
        - Use Emojis 🧪🧬🔬 to make text engaging.
        - Use Markdown HEADINGS (##, ###) for structure.
        - Be concise but detailed where necessary.
        - If asked in Roman Urdu, reply in Roman Urdu.
        
        CAPABILITIES:
        - You can discuss specific biology/chemistry topics AND general topics.
        - Always format answers with bullet points and clear sections.
        """
        
        # Agar specific instruction ayi hai to usay add karein
        if system_instruction:
            final_prompt = f"{base_instruction}\n\nSPECIFIC TASK:\n{system_instruction}\n\nUSER INPUT:\n{prompt}"
        else:
            final_prompt = f"{base_instruction}\n\nUSER INPUT:\n{prompt}"

        for model in unique_candidates:
            try:
                response = self.client.models.generate_content(
                    model=model,
                    contents=final_prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.7 # Thora creative
                    )
                )
                
                if model != self.active_model_id:
                    self.active_model_id = model
                
                return response.text

            except Exception:
                continue

        return "⚠️ System Overload: Check Internet or API Key."

    def analyze_drug(self, drug_data, target_id):
        """
        🔬 DEEP SCIENTIFIC ANALYSIS
        """
        # Data prepare karein
        context = f"""
        Analyze this Drug Candidate:
        - Name: {drug_data.get('name')}
        - SMILES: {drug_data.get('smiles')}
        - Target: {target_id}
        - Score: {drug_data.get('score')}
        - ADMET: {json.dumps(drug_data.get('admet', {}))}
        """
        
        task = """
        Output a JSON object with these keys:
        {
            "summary": "2-line engaging summary 📝",
            "mechanism": "Binding mechanism explanation 🔗",
            "safety_analysis": "Safety risks review ⚠️",
            "clinical_potential": "High/Medium/Low 📈",
            "conclusion": "Final Verdict 🎯"
        }
        RETURN ONLY JSON.
        """
        
        response_text = self._get_response(context, task)
        
        try:
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except:
            return {
                "summary": "Analysis generated but format issue.",
                "mechanism": response_text[:500],
                "safety_analysis": "Check Radar Chart.",
                "clinical_potential": "Manual Review",
                "conclusion": "Parse Error"
            }

    def chat_with_drug(self, user_query, context_data):
        """
        🤖 CHAT MODE (Updated for General + Specific)
        """
        context = f"""
        CURRENT CONTEXT (If relevant):
        Drug Name: {context_data.get('name')}
        Score: {context_data.get('score')}
        ADMET: {context_data.get('admet')}
        
        USER QUERY: "{user_query}"
        """
        
        # Hum koi strict instruction nahi denge, 
        # taake wo Global Style (casual/profesional) use kare.
        return self._get_response(context)

    def optimize_drug(self, drug_data, target_id):
        context = f"Optimize: {drug_data.get('name')} ({drug_data.get('smiles')}) for {target_id}"
        task = """
        Suggest a modification. Return JSON:
        { "original_flaw": "", "suggestion": "", "optimized_smiles": "", "reasoning": "" }
        """
        response_text = self._get_response(context, task)
        try:
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)
        except:
            return {"original_flaw": "Error", "suggestion": "Manual", "optimized_smiles": "", "reasoning": "Parse Error"}

llm_bot = LLMEngine()