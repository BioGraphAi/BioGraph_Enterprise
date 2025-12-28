import os
from groq import Groq

# ---------------------------------------------------------
# 🔑 Yahan apni GROQ API Key paste karein
# ---------------------------------------------------------
MY_GROQ_KEY = "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" 

# Client Initialize
client = Groq(api_key=MY_GROQ_KEY)

def generate_scientific_explanation(drug_name, smiles, score, admet, active_sites):
    try:
        # 1. Prepare Data Text
        pharmacophore_text = "None detected"
        if active_sites:
            pharmacophore_text = ", ".join([f"{site['type']} ({len(site['atoms'])} atoms)" for site in active_sites])
        
        # 2. Prompt (Llama 3 ke liye thoda simplified)
        prompt = f"""
        Act as an expert Computational Chemist. Analyze this drug candidate:

        DATA:
        - Molecule: {smiles}
        - Binding Affinity (pKd): {score} (Target is > 7.5)
        - Molecular Weight: {admet.get('mw')}
        - LogP: {admet.get('logp')}
        - Safety Status: {'Safe' if admet.get('is_safe') else 'Unsafe (Violates Rules)'}
        - Pharmacophores: {pharmacophore_text}

        TASK:
        Provide a 3-sentence scientific summary. 
        1. Explain the binding potential.
        2. Comment on safety/ADMET.
        3. Give a final verdict.
        
        Keep it professional and concise.
        """

        # 3. Call Groq (Llama 3 Model)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful scientific assistant."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile", # Super fast & Free model
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        print(f"⚠️ Groq Error: {e}")
        return f"AI Analysis Unavailable. Score: {score}. Please review manually."

# ✅ NEW: Chat Function
def chat_with_drug_data(question, drug_context):
    try:
        # Context string banayen taake AI ko pata ho kis drug ki baat ho rahi hai
        context_str = f"""
        Drug Name: {drug_context.get('name')}
        SMILES: {drug_context.get('smiles')}
        Binding Score: {drug_context.get('score')}
        ADMET Data: {drug_context.get('admet')}
        Pharmacophores: {drug_context.get('active_sites')}
        """

        prompt = f"""
        Context (Drug Data):
        {context_str}

        User Question: "{question}"

        Task: Answer the user's question specifically about this drug based on the provided data.
        Keep the answer short, scientific, and helpful. If data is missing, make a general scientific assumption based on the structure (SMILES).
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful Research Assistant."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile", # Groq Model
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"