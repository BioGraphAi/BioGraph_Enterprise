import os
import logging
from dotenv import load_dotenv
load_dotenv()
from modules.llm_engine import llm_bot

print("Testing OpenRouter...")
response = llm_bot._get_response("Hi, respond in 3 words.")
print(f"Response: {response}")
