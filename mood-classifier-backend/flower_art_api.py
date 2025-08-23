import numpy as np
import joblib
import pandas as pd

# Load the model
pipe_lr = joblib.load(open('models/emotion_classifier_pipe_lr_03_jan_2022.pkl', 'rb'))

def get_flower_parameters(text):
    """
    Returns optimized parameters for flower art generation based on text emotion analysis.
    
    Args:
        text (str): Input text to analyze
        
    Returns:
        dict: Parameters for flower art generation
    """
    # Get ML model predictions
    prediction = pipe_lr.predict([text])
    probability = pipe_lr.predict_proba([text])
    
    # Create probability dictionary
    proba_df = pd.DataFrame(probability, columns=pipe_lr.classes_)
    proba_dict = proba_df.iloc[0].to_dict()
    
    # Calculate key metrics
    max_prob = np.max(probability)
    min_prob = np.min(probability)
    entropy = -np.sum(probability[0] * np.log(probability[0] + 1e-10))
    
    # Sort emotions by probability
    sorted_emotions = sorted(proba_dict.items(), key=lambda x: x[1], reverse=True)
    second_emotion = sorted_emotions[1][0]
    second_confidence = sorted_emotions[1][1]
    confidence_gap = max_prob - second_confidence
    
    # Color mapping for emotions
    emotion_colors = {
        "joy": "#FFD700",      # Golden yellow
        "happy": "#FF69B4",    # Hot pink  
        "sadness": "#4169E1",  # Royal blue
        "fear": "#800080",     # Purple
        "anger": "#FF4500",    # Orange red
        "disgust": "#228B22",  # Forest green
        "shame": "#FFB6C1",    # Light pink
        "surprise": "#FF1493", # Deep pink
        "neutral": "#C0C0C0"   # Silver
    }
    
    # Calculate color temperature (-1 = cool, 1 = warm)
    warm_emotions = ["joy", "happy", "anger", "surprise"]
    cool_emotions = ["sadness", "fear", "shame", "neutral"]
    neutral_emotions = ["disgust"]
    
    dominant_emotion = prediction[0]
    if dominant_emotion in warm_emotions:
        color_temperature = 0.5 + (max_prob * 0.5)  # 0.5 to 1.0
    elif dominant_emotion in cool_emotions:
        color_temperature = -0.5 - (max_prob * 0.5)  # -1.0 to -0.5
    else:
        color_temperature = 0.0  # Neutral
    
    return {
        # Primary Controls
        "dominant_emotion": dominant_emotion,
        "confidence_score": float(max_prob),
        "confidence_percentage": float(max_prob * 100),
        
        # Visual Controls
        "flower_size": float(max_prob * 200 + 50),  # 50-250px
        "petal_count": int(entropy * 10) + 5,  # 5-25 petals
        "color_intensity": float(max_prob),  # 0.0-1.0
        "animation_speed": float(1.0 - confidence_gap),  # Inverse relationship
        
        # Color Controls
        "primary_color": emotion_colors.get(dominant_emotion, "#C0C0C0"),
        "color_temperature": float(color_temperature),  # -1.0 to 1.0
        "opacity": float(max_prob * 0.8 + 0.2),  # 0.2-1.0
        
        # Secondary Controls
        "secondary_emotion": second_emotion,
        "secondary_confidence": float(second_confidence),
        "secondary_color": emotion_colors.get(second_emotion, "#C0C0C0"),
        "complexity_level": float(entropy),
        "stability_factor": float(confidence_gap),
        
        # Animation Controls
        "rotation_speed": float(entropy * 0.5),  # 0.0-1.0
        "pulse_rate": float(max_prob * 2),  # 0.0-2.0
        "tremble_intensity": float(1.0 - confidence_gap),  # 0.0-1.0
        
        # Advanced Controls
        "emotion_blend": proba_dict,
        "texture_variation": float(max_prob - min_prob),
        "detail_level": int(entropy * 5) + 1,  # 1-10
        
        # Raw Data (for advanced use)
        "raw_prediction": prediction.tolist(),
        "raw_probabilities": probability.tolist(),
        "sorted_emotions": sorted_emotions
    }

def get_simple_flower_params(text):
    """
    Returns simplified parameters for basic flower art generation.
    
    Args:
        text (str): Input text to analyze
        
    Returns:
        dict: Basic parameters for flower art
    """
    params = get_flower_parameters(text)
    
    return {
        "emotion": params["dominant_emotion"],
        "confidence": params["confidence_score"],
        "size": params["flower_size"],
        "petals": params["petal_count"],
        "color": params["primary_color"],
        "speed": params["animation_speed"],
        "complexity": params["complexity_level"]
    }

# Example usage
if __name__ == "__main__":
    test_texts = [
        "I'm feeling really happy today!",
        "This makes me so angry and frustrated",
        "I'm scared and worried about the future",
        "I feel sad and lonely"
    ]
    
    print("=" * 60)
    print("FLOWER ART PARAMETERS API")
    print("=" * 60)
    
    for text in test_texts:
        print(f"\nInput: '{text}'")
        print("-" * 40)
        
        params = get_flower_parameters(text)
        
        print(f"Emotion: {params['dominant_emotion']}")
        print(f"Confidence: {params['confidence_percentage']:.1f}%")
        print(f"Size: {params['flower_size']:.0f}px")
        print(f"Petals: {params['petal_count']}")
        print(f"Color: {params['primary_color']}")
        print(f"Animation Speed: {params['animation_speed']:.2f}")
        print(f"Complexity: {params['complexity_level']:.2f}")
        
        print("-" * 40)
