# File: backend/modules/admet.py
# Complete ADMET Pharmacokinetics & Safety Module
# Absorption, Distribution, Metabolism, Excretion, Toxicity

from rdkit.Chem import Descriptors, Lipinski, QED, rdMolDescriptors


def calculate_admet_properties(mol):
    """
    Calculates comprehensive ADMET pharmacokinetic properties and safety metrics.
    Uses established medicinal chemistry rules and RDKit descriptors.
    Returns a dictionary of all computed values.
    """
    if not mol:
        return None

    # ═══════════════════════════════════════════════════════
    # 1. BASIC PHYSICOCHEMICAL PROPERTIES
    # ═══════════════════════════════════════════════════════
    mw = Descriptors.MolWt(mol)
    logp = Descriptors.MolLogP(mol)
    hbd = Lipinski.NumHDonors(mol)
    hba = Lipinski.NumHAcceptors(mol)
    tpsa = Descriptors.TPSA(mol)
    rotatable_bonds = Lipinski.NumRotatableBonds(mol)
    formula = rdMolDescriptors.CalcMolFormula(mol)
    num_rings = Descriptors.RingCount(mol)
    num_aromatic_rings = Descriptors.NumAromaticRings(mol)
    heavy_atom_count = Descriptors.HeavyAtomCount(mol)

    # ═══════════════════════════════════════════════════════
    # 2. LIPINSKI RULE OF 5 VALIDATION
    # ═══════════════════════════════════════════════════════
    violations = 0
    if mw > 500: violations += 1
    if logp > 5: violations += 1
    if hbd > 5: violations += 1
    if hba > 10: violations += 1
    lipinski = violations <= 1  # Pass if 0 or 1 violation

    # ═══════════════════════════════════════════════════════
    # 3. DRUG LIKENESS (QED Score: 0 to 1)
    # ═══════════════════════════════════════════════════════
    qed_score = QED.qed(mol)

    # ═══════════════════════════════════════════════════════
    # 4. ABSORPTION — Oral Bioavailability & Intestinal Absorption
    # ═══════════════════════════════════════════════════════
    # Caco-2 Permeability Estimate (rule-based from TPSA)
    # Reference: Ertl et al., J. Med. Chem. 2000
    # TPSA < 60 → High permeability, 60-140 → Moderate, >140 → Low
    if tpsa < 60:
        caco2_permeability = "High"
        absorption_score = 0.9
    elif tpsa < 140:
        caco2_permeability = "Moderate"
        absorption_score = 0.6
    else:
        caco2_permeability = "Low"
        absorption_score = 0.2

    # Human Intestinal Absorption (HIA) estimate
    # Based on Zhao et al. (2002): LogP and TPSA-based classification
    hia_positive = (logp >= -0.4 and logp <= 5.6) and (tpsa < 140) and (mw < 600)
    intestinal_absorption = "High (>80%)" if hia_positive else "Low (<80%)"

    # Oral Bioavailability (Veber's Rule: RotBonds ≤ 10 & TPSA ≤ 140)
    veber_pass = rotatable_bonds <= 10 and tpsa <= 140
    oral_bioavailability = "Good" if veber_pass else "Poor"

    # ═══════════════════════════════════════════════════════
    # 5. DISTRIBUTION — BBB Permeability & Volume of Distribution
    # ═══════════════════════════════════════════════════════
    # Blood-Brain Barrier (BBB) Penetration
    # Clark's Rule: logBB ≈ -0.0148 × TPSA + 0.152 × LogP + 0.139
    # If logBB > 0.3 → High penetrance, -1 to 0.3 → Moderate, < -1 → Low
    log_bb = -0.0148 * tpsa + 0.152 * logp + 0.139
    if log_bb > 0.3:
        bbb = "High Penetrance"
        bbb_score = 0.9
    elif log_bb > -1.0:
        bbb = "Moderate Penetrance"
        bbb_score = 0.5
    else:
        bbb = "Low Penetrance"
        bbb_score = 0.2

    # Plasma Protein Binding (PPB) estimate
    # Highly lipophilic drugs tend to bind plasma proteins more
    if logp > 4:
        ppb = "High (>90%)"
    elif logp > 2:
        ppb = "Moderate (50-90%)"
    else:
        ppb = "Low (<50%)"

    # Volume of Distribution estimate (Vd)
    # Lipophilic compounds distribute more widely
    if logp > 3 and mw < 500:
        vd_estimate = "High (>1 L/kg)"
    elif logp > 1:
        vd_estimate = "Moderate (0.3-1 L/kg)"
    else:
        vd_estimate = "Low (<0.3 L/kg)"

    # ═══════════════════════════════════════════════════════
    # 6. METABOLISM — CYP450 Substrate & Inhibition Risk
    # ═══════════════════════════════════════════════════════
    # CYP450 Substrate Likelihood (rule-based)
    # Lipophilic, larger molecules are more likely CYP substrates
    cyp_risk_factors = 0
    if logp > 2.5: cyp_risk_factors += 1
    if mw > 300: cyp_risk_factors += 1
    if num_aromatic_rings >= 2: cyp_risk_factors += 1
    if hba > 4: cyp_risk_factors += 1

    if cyp_risk_factors >= 3:
        cyp_substrate = "Likely Substrate"
        cyp_inhibition_risk = "High"
        metabolism_stability = "Low"
    elif cyp_risk_factors >= 2:
        cyp_substrate = "Possible Substrate"
        cyp_inhibition_risk = "Moderate"
        metabolism_stability = "Moderate"
    else:
        cyp_substrate = "Unlikely Substrate"
        cyp_inhibition_risk = "Low"
        metabolism_stability = "High"

    # ═══════════════════════════════════════════════════════
    # 7. EXCRETION — Renal Clearance & Half-life Estimate
    # ═══════════════════════════════════════════════════════
    # Renal clearance: Hydrophilic, small molecules are renally cleared
    # Lipophilic, larger molecules undergo hepatic metabolism
    if mw < 300 and logp < 1.5:
        renal_clearance = "High (Renal)"
        clearance_route = "Kidney"
    elif mw < 500 and logp < 3:
        renal_clearance = "Moderate (Mixed)"
        clearance_route = "Kidney + Liver"
    else:
        renal_clearance = "Low (Hepatic)"
        clearance_route = "Liver"

    # Half-life estimate based on clearance and Vd
    if renal_clearance == "High (Renal)":
        half_life = "Short (1-4 hrs)"
    elif metabolism_stability == "High":
        half_life = "Long (>8 hrs)"
    else:
        half_life = "Moderate (4-8 hrs)"

    # ═══════════════════════════════════════════════════════
    # 8. TOXICITY — Safety Assessment
    # ═══════════════════════════════════════════════════════
    # AMES Mutagenicity Risk (rule-based)
    # Aromatic amines, nitro groups increase risk
    ames_risk_factors = 0
    if num_aromatic_rings > 3: ames_risk_factors += 1
    if mw > 500: ames_risk_factors += 1
    ames_mutagenicity = "Low Risk" if ames_risk_factors == 0 else "Moderate Risk"

    # hERG Cardiotoxicity Risk
    # LogP > 3.7 and pKa considerations
    herg_risk = "High Risk" if (logp > 3.7 and mw > 400) else ("Moderate Risk" if logp > 2.5 else "Low Risk")

    # Hepatotoxicity Risk (DILI)
    # BSEP inhibition correlates with LogP > 3, reactive metabolite risk
    hepatotoxicity = "High Risk" if (logp > 4 and mw > 400) else ("Moderate Risk" if logp > 3 else "Low Risk")

    # ═══════════════════════════════════════════════════════
    # 9. OVERALL SAFETY VERDICT
    # ═══════════════════════════════════════════════════════
    is_safe = (violations <= 1 and qed_score > 0.4 and 
               herg_risk != "High Risk" and hepatotoxicity != "High Risk")

    return {
        # Basic Properties
        "mw": round(mw, 2),
        "logp": round(logp, 2),
        "hbd": hbd,
        "hba": hba,
        "tpsa": round(tpsa, 2),
        "rotatable_bonds": rotatable_bonds,
        "formula": formula,
        "num_rings": num_rings,
        "num_aromatic_rings": num_aromatic_rings,
        "heavy_atoms": heavy_atom_count,

        # Lipinski & Drug-likeness
        "violations": violations,
        "lipinski": lipinski,
        "qed": round(qed_score, 2),

        # Absorption
        "caco2_permeability": caco2_permeability,
        "intestinal_absorption": intestinal_absorption,
        "oral_bioavailability": oral_bioavailability,

        # Distribution
        "bbb": bbb,
        "log_bb": round(log_bb, 3),
        "ppb": ppb,
        "vd_estimate": vd_estimate,

        # Metabolism
        "cyp_substrate": cyp_substrate,
        "cyp_inhibition_risk": cyp_inhibition_risk,
        "metabolism_stability": metabolism_stability,

        # Excretion
        "renal_clearance": renal_clearance,
        "clearance_route": clearance_route,
        "half_life": half_life,

        # Toxicity
        "ames_mutagenicity": ames_mutagenicity,
        "herg_risk": herg_risk,
        "hepatotoxicity": hepatotoxicity,

        # Overall Verdict
        "is_safe": is_safe,
    }