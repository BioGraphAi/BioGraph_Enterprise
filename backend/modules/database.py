import sqlite3
import os
import pandas as pd

DB_NAME = "drugs.db"
TXT_FILE = "drugs.txt"

def init_db():
    # 1. Check agar DB pehle se exist karta hai to reset na karein (Data Safety)
    if os.path.exists(DB_NAME):
        print(f"✅ Database '{DB_NAME}' already exists. Skipping reset.")
        return

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS drugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            smiles TEXT NOT NULL
        )
    ''')
    
    file_path = os.path.join(os.path.dirname(__file__), TXT_FILE)
    if not os.path.exists(file_path):
        print(f"❌ Error: '{TXT_FILE}' nahi mili! Backend folder mein check karein.")
        return

    print(f"📂 Reading Samples File '{TXT_FILE}'...")
    
    try:
        df = pd.read_csv(file_path, sep='\t', comment='!', on_bad_lines='skip', encoding='latin1')
        
        if 'smiles' in df.columns:
            name_col = 'pert_iname' if 'pert_iname' in df.columns else 'sample_id'
            df_clean = df[[name_col, 'smiles']].dropna()
            df_clean = df_clean.drop_duplicates(subset=[name_col])
            
            drugs_data = df_clean.values.tolist()
            
            print(f"✅ SMILES MIL GAYE! Total {len(drugs_data)} drugs.")
            print("⏳ Inserting into Database...")
            
            cursor.executemany('INSERT INTO drugs (name, smiles) VALUES (?, ?)', drugs_data)
            conn.commit()
            print(f"🎉 Database ready with {len(drugs_data)} drugs.")
            
        else:
            print("❌ Ab bhi SMILES nahi mile? Columns check karein.")

    except Exception as e:
        print(f"❌ Error: {e}")

    conn.close()

def get_all_drugs():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # 2. LIMIT hata diya hai - Ab saaray drugs (6000+) aayenge
    cursor.execute("SELECT name, smiles FROM drugs") 
    drugs = [{"name": row[0], "smiles": row[1]} for row in cursor.fetchall()]
    conn.close()
    return drugs

if __name__ == "__main__":
    init_db()