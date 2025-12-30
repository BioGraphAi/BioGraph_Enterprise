import os
import json
from groq import Groq

class LLMEngine:
    def __init__(self):
        # 🔑 API Key Environment se load hogi
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        
        # Models List
        self.models = [
            "llama-3.3-70b-versatile",
            "llama-3.1-70b-versatile",
            "llama-3.1-8b-instant"
        ]
        
        if self.api_key:
            try:
                self.client = Groq(api_key=self.api_key)
                print(f"✅ BioGraph Super-Intelligence Activated (Groq)")
            except Exception as e:
                print(f"⚠️ LLM Init Error: {e}")
        else:
            print("⚠️ WARNING: GROQ_API_KEY not found. AI features will be disabled.")

    def _get_response(self, system_prompt, user_prompt):
        if not self.client:
            return "⚠️ AI Brain is offline. API Key Missing."

        for model in self.models:
            try:
                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=model,
                    temperature=0.6,
                    max_tokens=1500,
                )
                return chat_completion.choices[0].message.content
            except Exception as e:
                print(f"⚠️ Model {model} failed, switching brain... Error: {e}")
                continue
        
        return "⚠️ System Overload: All AI models are currently busy."

    def analyze_drug(self, drug_data, target_id):
        system_prompt = """
        You are BioGraph AI, a world-class Lead Discovery Scientist.
        STRICT OUTPUT FORMAT (JSON ONLY):
        {
            "summary": "2-line executive summary.",
            "mechanism": "How does it actually bind?",
            "safety_analysis": "Critical review of ADMET.",
            "clinical_potential": "High/Medium/Low",
            "conclusion": "Final verdict"
        }
        """
        
        sites_text = "No specific pharmacophores detected"
        if drug_data.get('active_sites'):
            sites_text = ", ".join([f"{s['type']} ({len(s['atoms'])} atoms)" for s in drug_data.get('active_sites')])

        user_prompt = f"""
        🔬 ANALYZE THIS CANDIDATE:
        Name: {drug_data.get('name')}
        SMILES: {drug_data.get('smiles')}
        Target: {target_id}
        Binding Score: {drug_data.get('score')}
        Active Sites: {sites_text}
        ADMET: {json.dumps(drug_data.get('admet', {}))}
        """
        
        response = self._get_response(system_prompt, user_prompt)
        
        try:
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            elif "```" in response:
                response = response.split("```")[1].split("```")[0]
            return json.loads(response)
        except:
            return {
                "summary": "AI Analysis generated but format was unstructured.",
                "mechanism": response[:500] + "...",
                "safety_analysis": "Check Radar Chart.",
                "clinical_potential": "Manual Review",
                "conclusion": "Parse Error."
            }

    def chat_with_drug(self, user_query, context_data):
        system_prompt = "You are 'BioGraph AI'. Reply in Roman Urdu if asked in it. Be scientific but empathetic."
        drug_context = f"Drug: {context_data.get('name')}, Score: {context_data.get('score')}, ADMET: {context_data.get('admet')}"
        return self._get_response(system_prompt, f"{drug_context}\nUSER: {user_query}")

    def optimize_drug(self, drug_data, target_id):
        system_prompt = """
        Suggest chemical modification.
        OUTPUT JSON: {"original_flaw": "", "suggestion": "", "optimized_smiles": "", "reasoning": ""}
        """
        user_prompt = f"Optimize {drug_data.get('name')} (SMILES: {drug_data.get('smiles')}) for Target {target_id}."
        
        response = self._get_response(system_prompt, user_prompt)
        try:
            if "```json" in response: response = response.split("```json")[1].split("```")[0]
            elif "```" in response: response = response.split("```")[1].split("```")[0]
            return json.loads(response)
        except:
            return {"original_flaw": "N/A", "suggestion": "Manual refinement", "optimized_smiles": drug_data.get('smiles'), "reasoning": "AI Format Error"}

# ✅ Instance Creation (Ye zaroori hai taake import error na aye)
llm_bot = LLMEngine()