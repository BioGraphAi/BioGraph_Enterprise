import math

def calculate_confidence(score, threshold=7.5):
    """
    Calculates a scientific probability percentage based on pKd score.
    Uses a Sigmoid function logic.
    """
    slope = 1.5 
    try:
        prob_active = 1 / (1 + math.exp(-slope * (score - threshold)))
    except OverflowError:
        prob_active = 1.0 if score > threshold else 0.0

    # Confidence calculation
    if prob_active > 0.5:
        confidence = prob_active
    else:
        confidence = 1.0 - prob_active

    return f"{round(confidence * 100)}%"