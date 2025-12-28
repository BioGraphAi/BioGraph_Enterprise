# File: backend/modules/admet.py

from rdkit.Chem import Descriptors, Lipinski, QED

def calculate_admet_properties(mol):
    """
    Calculates advanced physicochemical properties and safety metrics.
    Returns a dictionary of values.
    """
    if not mol:
        return None

    # 1. Basic Properties
    mw = Descriptors.MolWt(mol)
    logp = Descriptors.MolLogP(mol)
    hbd = Lipinski.NumHDonors(mol)
    hba = Lipinski.NumHAcceptors(mol)
    tpsa = Descriptors.TPSA(mol)
    rotatable_bonds = Lipinski.NumRotatableBonds(mol)

    # 2. Lipinski Rule of 5 Validation
    violations = 0
    if mw > 500: violations += 1
    if logp > 5: violations += 1
    if hbd > 5: violations += 1
    if hba > 10: violations += 1

    # 3. Drug Likeness (QED Score: 0 to 1)
    qed_score = QED.qed(mol)

    # 4. Toxicity / Safety Verdict
    # Agar QED < 0.4 hai ya Violations > 1 hain, to Drug risky hai
    is_safe = violations <= 1 and qed_score > 0.4

    return {
        "mw": round(mw, 2),             # Molecular Weight
        "logp": round(logp, 2),         # Solubility
        "hbd": hbd,                     # Hydrogen Bond Donors
        "hba": hba,                     # Hydrogen Bond Acceptors
        "tpsa": round(tpsa, 2),         # Surface Area
        "rotatable_bonds": rotatable_bonds, # Flexibility
        "violations": violations,       # Rule of 5 Failures
        "qed": round(qed_score, 2),     # Quality Score
        "is_safe": is_safe              # Final Safety Verdict
    }