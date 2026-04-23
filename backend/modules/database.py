import sqlite3
import os
import pandas as pd
from modules.logger import logger

DB_NAME = "drugs.db"
TXT_FILE = "drugs.txt"

# ✅ FIX: Robust Path Handling
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, DB_NAME)
TXT_PATH = os.path.join(BASE_DIR, TXT_FILE)

def init_db():
    """
    Initializes the SQLite database from a TSV source file.
    """
    if os.path.exists(DB_PATH):
        logger.info(f"Database '{DB_NAME}' already exists. Skipping initialization.")
        return

    logger.info(f"Initializing new database at: {DB_PATH}")
    
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS drugs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                smiles TEXT NOT NULL
            )
        ''')
        
        if not os.path.exists(TXT_PATH):
            logger.error(f"Source file '{TXT_FILE}' not found at: {TXT_PATH}")
            return

        logger.info(f"Reading source file: {TXT_FILE}")
        
        # Read TSV with flexible parsing
        df = pd.read_csv(TXT_PATH, sep='\t', comment='!', on_bad_lines='skip', encoding='latin1')
        
        if 'smiles' in df.columns:
            name_col = 'pert_iname' if 'pert_iname' in df.columns else 'sample_id'
            if name_col not in df.columns:
                name_col = df.columns[0] # Fallback to first column
                
            df_clean = df[[name_col, 'smiles']].dropna()
            df_clean = df_clean.drop_duplicates(subset=[name_col])
            
            drugs_data = df_clean.values.tolist()
            
            logger.info(f"Found {len(drugs_data)} valid drug entries. Inserting...")
            
            cursor.executemany('INSERT INTO drugs (name, smiles) VALUES (?, ?)', drugs_data)
            conn.commit()
            logger.info(f"Database initialization complete. Total drugs: {len(drugs_data)}")
            
        else:
            logger.error(f"SMILES column not found in {TXT_FILE}. Check file format.")

        conn.close()
    except Exception as e:
        logger.error(f"Database Initialization Failed: {e}")

def get_all_drugs():
    """
    Retrieves all drugs from the local database.
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT name, smiles FROM drugs") 
        drugs = [{"name": row[0], "smiles": row[1]} for row in cursor.fetchall()]
        conn.close()
        return drugs
    except Exception as e:
        logger.error(f"Failed to fetch drugs from database: {e}")
        return []

if __name__ == "__main__":
    init_db()