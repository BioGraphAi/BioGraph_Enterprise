import torch
import httpx
import pubchempy as pcp
from rdkit import Chem
from rdkit.Chem import ChemicalFeatures
from rdkit import RDConfig
import os
from torch_geometric.data import Data

ATOM_DICT = {'C':0, 'N':1, 'O':2, 'S':3, 'F':4, 'Cl':5, 'Br':6, 'I':7, 'P':8, 'Unknown':9} 
AMINO_DICT = {aa: i for i, aa in enumerate("ACDEFGHIKLMNPQRSTVWY")}

fdefName = os.path.join(RDConfig.RDDataDir, 'BaseFeatures.fdef')
featFactory = ChemicalFeatures.BuildFeatureFactory(fdefName)

def get_smiles_from_input(input_str):
    if not input_str: return None, None
    input_str = input_str.strip()
    
    # 1. Try Direct SMILES
    mol = Chem.MolFromSmiles(input_str)
    if mol: return input_str, mol 

    # 2. Try Name Search
    print(f"🌍 Searching PubChem for Name: {input_str}")
    try:
        compounds = pcp.get_compounds(input_str, 'name')
        if compounds:
            found_smiles = compounds[0].isomeric_smiles
            mol = Chem.MolFromSmiles(found_smiles)
            if mol: return found_smiles, mol
    except Exception as e:
        print(f"❌ PubChem Lookup Failed: {e}")
    
    return None, None

async def get_protein_sequence(pdb_id):
    # Clean ID
    orig_id = pdb_id.strip()
    pid = orig_id.lower()
    
    print(f"🧬 Fetching sequence for PDB: {pid}...")

    # 1️⃣ Attempt: EBI PDBe API (Smart Entity Search)
    try:
        url = f"https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/{pid}"
        async with httpx.AsyncClient(follow_redirects=True) as client:
            resp = await client.get(url, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                # Check all molecules in the entry to find a valid protein sequence
                if pid in data:
                    for molecule in data[pid]:
                        if 'sequence' in molecule and molecule['sequence']:
                            return molecule['sequence']
    except Exception as e:
        print(f"💡 EBI Fallback triggered (Error: {e})")
        
    # 2️⃣ Attempt: RCSB PDB Core API
    try:
        url = f"https://data.rcsb.org/rest/v1/core/polymer_entity/{pid}/1"
        async with httpx.AsyncClient(follow_redirects=True) as client:
            resp = await client.get(url, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                seq = data.get('entity_poly', {}).get('pdbx_seq_one_letter_code')
                if seq: return seq
    except Exception: pass

    # 3️⃣ Attempt: RCSB Direct FASTA (The "Always Works" Method)
    try:
        url = f"https://www.rcsb.org/fasta/entry/{orig_id.upper()}"
        async with httpx.AsyncClient(follow_redirects=True) as client:
            resp = await client.get(url, timeout=15.0)
            if resp.status_code == 200:
                lines = resp.text.splitlines()
                sequence = "".join([line.strip() for line in lines if not line.startswith(">")])
                if sequence: return sequence
    except Exception as e:
        print(f"❌ All Protein Fetch Methods Failed for {pid}: {e}")
        
    return None 

def get_pharmacophore_data(mol):
    if not mol: return []
    try:
        feats = featFactory.GetFeaturesForMol(mol)
        pharmacophores = []
        for f in feats:
            family = f.GetFamily()
            if family in ['Donor', 'Acceptor', 'Aromatic', 'Hydrophobe']:
                pharmacophores.append({
                    "type": family,
                    "atoms": list(f.GetAtomIds()),
                    "desc": f.GetType()
                })
        return pharmacophores
    except Exception as e:
        print(f"⚠️ Pharmacophore Error: {e}")
        return []

def process_data_object(smiles, protein_seq, max_len=1000):
    try:
        mol = Chem.MolFromSmiles(smiles)
        if not mol: return None
        
        x = [ATOM_DICT.get(atom.GetSymbol(), 9) for atom in mol.GetAtoms()]
        x = torch.tensor(x, dtype=torch.long)
        
        src, dst = [], []
        for bond in mol.GetBonds():
            i, j = bond.GetBeginAtomIdx(), bond.GetEndAtomIdx()
            src += [i, j]; dst += [j, i]
        edge_index = torch.tensor([src, dst], dtype=torch.long)
        
        # ✅ FIX: Handle None protein_seq and cleaner slicing/padding
        safe_seq = protein_seq if protein_seq else ""
        seq_indices = [AMINO_DICT.get(aa, 21) for aa in safe_seq]
        
        # Keep only up to max_len
        seq_indices = seq_indices[:max_len]
        
        # Pad with 21 if shorter
        if len(seq_indices) < max_len:
            seq_indices += [21] * (max_len - len(seq_indices))
            
        prot_tensor = torch.tensor(seq_indices, dtype=torch.long).unsqueeze(0)
        
        data = Data(x=x, edge_index=edge_index)
        data.protein = prot_tensor
        return data
    except Exception as e:
        print(f"⚠️ Process Data Object Error for SMILES {smiles}: {e}")
        return None