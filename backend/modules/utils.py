import math
import numpy as np

def calculate_confidence(score, threshold=7.5):
    """
    Calculates scientific confidence % using sigmoid logic.
    Scikit-learn compatible: uses numpy for precision.
    Returns a formatted percentage string.
    """
    try:
        slope = 1.5
        z = slope * (score - threshold)
        prob_active = 1.0 / (1.0 + np.exp(-z))
    except (OverflowError, ValueError):
        prob_active = 1.0 if score > threshold else 0.0

    # Confidence is how certain we are (active or inactive)
    confidence = prob_active if prob_active >= 0.5 else (1.0 - prob_active)
    return f"{round(float(confidence) * 100)}%"


def calculate_repurposing_score(pKd_score, admet_data=None):
    """
    Calculates a composite Repurposing Potential Score (0-100).
    Combines:
      - AI Binding Affinity (pKd)   → 60% weight
      - ADMET Safety (QED + Lipinski) → 40% weight
    As shown on the BioGraph Enterprise FYP poster.
    """
    # 1. Binding component (pKd range: 4.0–12.0 → normalize to 0–1)
    binding_norm = max(0.0, min(1.0, (pKd_score - 4.0) / (12.0 - 4.0)))
    binding_component = binding_norm * 60.0  # Max 60 points

    # 2. ADMET component
    admet_component = 0.0
    if admet_data:
        qed = admet_data.get('qed', 0.5)          # 0–1
        violations = admet_data.get('violations', 2)  # Lower is better
        is_safe = admet_data.get('is_safe', False)

        qed_score = qed * 20.0                          # Max 20 points
        violation_penalty = max(0, (2 - violations)) / 2 * 10  # Max 10 points
        safety_bonus = 10.0 if is_safe else 0.0          # Max 10 points

        admet_component = qed_score + violation_penalty + safety_bonus

    total = round(binding_component + admet_component, 1)
    return min(100.0, total)  # Cap at 100