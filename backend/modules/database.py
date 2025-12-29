import sqlite3
import pandas as pd
import os
from modules.config import DB_PATH, TXT_FILE_PATH

def init_db():
    """
    Initializes the SQLite database.
    If the database exists, it skips initialization.
    Otherwise, it reads from the seed text file and populates the database.
    """
    if os.path.exists(DB_PATH):
        print(f"✅ Database '{DB_PATH}' already exists. Skipping reset.")
        return

    print(f"⚙️ Initializing database at {DB_PATH}...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS drugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            smiles TEXT NOT NULL
        )
    ''')
    
    if not os.path.exists(TXT_FILE_PATH):
        print(f"❌ Error: '{TXT_FILE_PATH}' not found! Please check backend folder.")
        conn.close()
        return

    print(f"📂 Reading Samples File '{TXT_FILE_PATH}'...")
    
    try:
        df = pd.read_csv(TXT_FILE_PATH, sep='\t', comment='!', on_bad_lines='skip', encoding='latin1')
        
        if 'smiles' in df.columns:
            name_col = 'pert_iname' if 'pert_iname' in df.columns else 'sample_id'
            df_clean = df[[name_col, 'smiles']].dropna()
            df_clean = df_clean.drop_duplicates(subset=[name_col])
            
            drugs_data = df_clean.values.tolist()
            
            print(f"✅ SMILES FOUND! Total {len(drugs_data)} drugs.")
            print("⏳ Inserting into Database...")
            
            cursor.executemany('INSERT INTO drugs (name, smiles) VALUES (?, ?)', drugs_data)
            conn.commit()
            print(f"🎉 Database ready with {len(drugs_data)} drugs.")
            
        else:
            print("❌ Still no SMILES found? Check columns.")

    except Exception as e:
        print(f"❌ Error initializing DB: {e}")

    conn.close()

def get_all_drugs():
    """
    Fetches all drugs from the database.
    TODO: Add pagination for scalability.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name, smiles FROM drugs") 
    drugs = [{"name": row[0], "smiles": row[1]} for row in cursor.fetchall()]
    conn.close()
    return drugs

if __name__ == "__main__":
    init_db()
