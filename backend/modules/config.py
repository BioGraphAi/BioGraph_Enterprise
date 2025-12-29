import os
from pathlib import Path

# Base Directories
BACKEND_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BACKEND_DIR.parent

# Database Configuration
DB_NAME = os.getenv("DB_NAME", "drugs.db")
DB_PATH = BACKEND_DIR / DB_NAME
TXT_FILE = os.getenv("TXT_FILE", "drugs.txt")
TXT_FILE_PATH = BACKEND_DIR / TXT_FILE

# Model Configuration
MODEL_PATH = BACKEND_DIR / os.getenv("MODEL_FILE", "drug_model_v4.pt")
DEVICE_TYPE = os.getenv("DEVICE", "cpu")

# API Keys
# Default is empty string for security. Must be set in environment variables.
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# System Configuration
MAX_THREADS = int(os.getenv("MAX_THREADS", 4))
