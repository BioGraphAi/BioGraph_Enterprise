import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("GITHUB_TOKEN")
client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=token,
)

print("Testing GitHub Models (GPT-4o)...")
try:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hi, respond in 2 words."}],
        temperature=1.0
    )
    print(f"Response: {response.choices[0].message.content}")
except Exception as e:
    print(f"Error: {e}")
