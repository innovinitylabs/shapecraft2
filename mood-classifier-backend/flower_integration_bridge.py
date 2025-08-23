import numpy as np
import joblib
import pandas as pd
import json

# Load the model
pipe_lr = joblib.load(open('models/emotion_classifier_pipe_lr_03_jan_2022.pkl', 'rb'))

def get_flower_art_parameters(text, streak_days=0, community_mood=0.5, trading_activity=0.5):
    """
    Returns parameters optimized for your existing flower art system.
    
    Args:
        text (str): Input text to analyze
        streak_days (int): Number of consecutive good mood days (0-30)
        community_mood (float): Community mood score (0-1)
        trading_activity (float): Trading activity score (0-1)
        
    Returns:
        dict: Parameters mapped to your flower art system
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
    
    dominant_emotion = prediction[0]
    
    # Map ML emotions to your flower art emotions
    emotion_mapping = {
        "joy": "joy",
        "happy": "happy", 
        "sadness": "sad",
        "fear": "fear",
        "anger": "anger",
        "disgust": "disgust",
        "shame": "shame",
        "surprise": "surprise",
        "neutral": "neutral"
    }
    
    mapped_emotion = emotion_mapping.get(dominant_emotion, "neutral")
    
    # Calculate intensity multiplier from confidence
    intensity_multiplier = max(0.1, min(1.0, max_prob * 1.5))
    
    # Map to your flower art parameters
    flower_params = {
        # ========================================
        # 1. EMOTION-BASED COLOR SYSTEM
        # ========================================
        "currentEmotion": mapped_emotion,
        "confidence": float(max_prob),
        "confidencePercentage": float(max_prob * 100),
        
        # ========================================
        # 2. PETAL SYSTEM PARAMETERS
        # ========================================
        "petalParams": {
            "layerCount": max(1, min(10, int(entropy * 3) + 1)),  # 1-10 layers
            "petalCount": max(3, min(20, int(entropy * 8) + 6)),  # 3-20 petals
            "baseLayerRadius": 12 + (max_prob * 8),  # 12-20 radius
            "layerRadiusDecrease": 2 + (confidence_gap * 3),  # 2-5 decrease
            "petalRotation": max(0, min(0.5, entropy * 0.3)),  # 0-0.5 radians
            "layerRotations": [0, 0],  # Will be calculated dynamically
            "layerOffsets": [0, 0],    # Will be calculated dynamically
            "geometrySegments": max(10, min(30, int(entropy * 15) + 10)),  # 10-30 segments
            "geometryPhiStart": np.pi / 3,
            "geometryPhiLength": np.pi / 3,
            "geometryThetaStart": 0,
            "geometryThetaLength": np.pi
        },
        
        # ========================================
        # 3. PETAL OPEN/CLOSE RANGE PARAMETERS
        # ========================================
        "petalOpenCloseParams": {
            "minOpenAngle": 0,
            "maxOpenAngle": 90,
            "openCloseSpeed": max(0.1, min(1.0, 1.0 - confidence_gap)),  # 0.1-1.0
            "individualLayerControl": True,
            "layerOpenCloseRanges": [
                {"min": 0, "max": 90},
                {"min": 0, "max": 90}
            ]
        },
        
        # ========================================
        # 4. HEARTBEAT SYSTEM (BPM CONTROLLED)
        # ========================================
        "heartbeatSettings": {
            "bpm": get_heartbeat_bpm(mapped_emotion, max_prob),
            "intensity": get_heartbeat_intensity(mapped_emotion, max_prob)
        },
        
        "heartbeatParams": {
            "pulseUpdateRate": 0.02,
            "dualPulseEnabled": True,
            "secondaryPulseIntensity": 0.3,
            "glowIntensityRange": {"min": 0.2, "max": 0.9},
            "bpmRange": {"min": 55, "max": 110}
        },
        
        # ========================================
        # 5. PETAL ROTATION SYSTEM
        # ========================================
        "moodSettings": {
            "intensity": get_rotation_intensity(mapped_emotion, max_prob),
            "direction": get_rotation_direction(mapped_emotion)
        },
        
        "rotationParams": {
            "rotationUpdateRate": 0.02,
            "alternatingEnabled": True,
            "individualLayerRotation": True,
            "rotationIntensityRange": {"min": 0.01, "max": 1.0},
            "directionOptions": {"clockwise": 1, "counterclockwise": -1}
        },
        
        # ========================================
        # 6. STALK SYSTEM (COMMUNITY FEATURE)
        # ========================================
        "stalkParams": {
            "baseLength": 10,
            "minLength": 8.8,
            "maxLength": 33,
            "communityMoodThreshold": 0.7,
            "communityMoodMultiplier": 2.0,
            "growthSpeed": 0.1,
            "decaySpeed": 0.05,
            "currentLength": calculate_stalk_length(max_prob, community_mood, streak_days)
        },
        
        # ========================================
        # 7. CONNECTOR/CORE SYSTEM (TRADING ACTIVITY)
        # ========================================
        "connectorParams": {
            "baseColor": "#C0C0C0",
            "tradingActivityColors": {
                "low": "#FF0000",
                "medium": "#FFA500", 
                "high": "#00FF00",
                "veryHigh": "#00FFFF"
            },
            "tradingActivityThresholds": {
                "low": 0.3,
                "medium": 0.6,
                "high": 0.8
            },
            "colorTransitionSpeed": 0.1,
            "currentColor": get_trading_color(trading_activity)
        },
        
        # ========================================
        # 8. BEE SYSTEM (STREAK-BASED)
        # ========================================
        "beeParams": {
            "baseScale": 1.11,
            "basePosition": {"x": 0, "y": 2.1, "z": 0},
            "wingSpeed": get_bee_wing_speed(mapped_emotion, max_prob),
            "wingFlapRange": 0.9,
            "wingFlapIntensity": 0.6,
            "appearanceThreshold": 3,
            "flightBobSpeed": 1.2,
            "flightBobAmplitude": 0.08,
            "rotationSpeed": 0.3,
            "rotationAmplitude": 0.08,
            "shouldAppear": streak_days >= 3
        },
        
        "beeStreakRanges": get_bee_range(streak_days),
        
        # ========================================
        # 9. STREAK SYSTEM PARAMETERS
        # ========================================
        "streakParams": {
            "goodMoodThreshold": 0.7,
            "streakDecayRate": 0.1,
            "maxStreakDays": 30,
            "streakMultiplier": 1.5,
            "currentStreakDays": streak_days,
            "streakFeatures": {
                "beeAppearance": True,
                "beeRangeControl": True,
                "stalkGrowth": True,
                "glowIntensity": True,
                "rotationSpeed": True
            }
        },
        
        # ========================================
        # 10. COMMUNITY & TRADING INTEGRATION
        # ========================================
        "communityParams": {
            "memberCount": 0,  # Will be set by your system
            "averageMood": community_mood,
            "positiveMoodThreshold": 0.7,
            "moodUpdateFrequency": 3600000,
            "stalkGrowthFactor": 0.1
        },
        
        "tradingParams": {
            "tradingVolume": 0,  # Will be set by your system
            "tradingVolumeThreshold": 100,
            "tradingActivityScore": trading_activity,
            "activityUpdateFrequency": 300000,
            "colorTransitionSpeed": 0.1
        },
        
        # ========================================
        # 11. ADDITIONAL ML-BASED PARAMETERS
        # ========================================
        "mlParams": {
            "complexityEntropy": float(entropy),
            "confidenceGap": float(confidence_gap),
            "secondEmotion": second_emotion,
            "secondConfidence": float(second_confidence),
            "emotionProbabilities": proba_dict,
            "sortedEmotions": sorted_emotions,
            "intensityMultiplier": float(intensity_multiplier)
        }
    }
    
    return flower_params

def get_heartbeat_bpm(emotion, confidence):
    """Calculate BPM based on emotion and confidence"""
    base_bpm = {
        "happy": 85, "joy": 95, "sad": 55, "fear": 110,
        "anger": 100, "disgust": 70, "shame": 65, "surprise": 90, "neutral": 72
    }
    
    base = base_bpm.get(emotion, 72)
    # Adjust based on confidence (higher confidence = more extreme BPM)
    confidence_factor = 1.0 + (confidence - 0.5) * 0.4  # ±20% variation
    return int(base * confidence_factor)

def get_heartbeat_intensity(emotion, confidence):
    """Calculate heartbeat intensity based on emotion and confidence"""
    base_intensity = {
        "happy": 0.6, "joy": 0.8, "sad": 0.2, "fear": 0.9,
        "anger": 0.7, "disgust": 0.4, "shame": 0.3, "surprise": 0.7, "neutral": 0.4
    }
    
    base = base_intensity.get(emotion, 0.4)
    # Boost intensity with confidence
    return min(0.9, base * (1.0 + confidence * 0.5))

def get_rotation_intensity(emotion, confidence):
    """Calculate rotation intensity based on emotion and confidence"""
    base_intensity = {
        "happy": 0.8, "joy": 1.0, "sad": 0.01, "fear": 0.6,
        "anger": 0.9, "disgust": 0.4, "shame": 0.3, "surprise": 0.7, "neutral": 0.2
    }
    
    base = base_intensity.get(emotion, 0.2)
    # Apply confidence multiplier
    return min(1.0, base * (1.0 + confidence * 0.5))

def get_rotation_direction(emotion):
    """Get rotation direction based on emotion"""
    clockwise_emotions = ["happy", "joy", "surprise", "neutral"]
    return 1 if emotion in clockwise_emotions else -1

def calculate_stalk_length(confidence, community_mood, streak_days):
    """Calculate stalk length based on confidence, community mood, and streak"""
    base_length = 10 + (confidence * 10)  # 10-20 base length
    community_bonus = (community_mood - 0.5) * 5  # ±2.5 from community
    streak_bonus = min(streak_days * 0.5, 10)  # Up to 10 from streak
    
    total_length = base_length + community_bonus + streak_bonus
    return max(8.8, min(33, total_length))

def get_trading_color(trading_activity):
    """Get connector color based on trading activity"""
    if trading_activity < 0.3:
        return "#FF0000"  # Red
    elif trading_activity < 0.6:
        return "#FFA500"  # Orange
    elif trading_activity < 0.8:
        return "#00FF00"  # Green
    else:
        return "#00FFFF"  # Cyan

def get_bee_wing_speed(emotion, confidence):
    """Calculate bee wing speed based on emotion and confidence"""
    base_speed = {
        "happy": 18, "joy": 22, "sad": 8, "fear": 25,
        "anger": 20, "disgust": 12, "shame": 10, "surprise": 19, "neutral": 15
    }
    
    base = base_speed.get(emotion, 15)
    # Adjust based on confidence
    confidence_factor = 1.0 + (confidence - 0.5) * 0.6  # ±30% variation
    return max(5, min(30, int(base * confidence_factor)))

def get_bee_range(streak_days):
    """Get bee range based on streak days"""
    if streak_days >= 21:
        return {"xRange": {"min": -1.5, "max": 1.5}, "zRange": {"min": -1.5, "max": 1.5}, "yRange": {"min": 2.2, "max": 5}}
    elif streak_days >= 14:
        return {"xRange": {"min": -5, "max": 5}, "zRange": {"min": -5, "max": 5}, "yRange": {"min": 2.2, "max": 10}}
    elif streak_days >= 7:
        return {"xRange": {"min": -10, "max": 10}, "zRange": {"min": -10, "max": 10}, "yRange": {"min": 2.2, "max": 15}}
    elif streak_days >= 3:
        return {"xRange": {"min": -18, "max": 18}, "zRange": {"min": -18, "max": 18}, "yRange": {"min": 2.2, "max": 20}}
    else:
        return None

def get_js_integration_code():
    """Returns JavaScript code to integrate with your flower art system"""
    return """
// Integration function for your flower art system
function updateFlowerFromMoodClassifier(text, streakDays = 0, communityMood = 0.5, tradingActivity = 0.5) {
    // This function should be called from your Python backend
    // with the parameters from get_flower_art_parameters()
    
    // Example usage:
    // fetch('/api/mood-analysis', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({text: text, streakDays: streakDays, communityMood: communityMood, tradingActivity: tradingActivity})
    // })
    // .then(response => response.json())
    // .then(data => {
    //     updateEmotionFromClassifier(data.currentEmotion, data.confidence, data.streakParams.currentStreakDays);
    //     // Update other parameters as needed
    // });
}

// Function to update your existing flower art system
function updateEmotionFromClassifier(newEmotion, confidence, streakDays = 0) {
    currentEmotion = newEmotion;
    currentConfidence = confidence;
    currentStreakDays = streakDays;
    
    // Your existing update functions
    calculateMoodRotation();
    calculateHeartbeatBPM();
    updateFlowerColors();
    updatePetalOpenClose();
    updateStalkLength();
    updateConnectorColor();
    updateBeeBehavior();
    updateStreakEffects();
    
    updateMoodRotationDisplay();
    updateHeartbeatDisplay();
}
"""

# Example usage
if __name__ == "__main__":
    test_texts = [
        "I'm feeling really happy today!",
        "This makes me so angry and frustrated", 
        "I'm scared and worried about the future",
        "I feel sad and lonely"
    ]
    
    print("=" * 80)
    print("FLOWER ART INTEGRATION BRIDGE")
    print("=" * 80)
    
    for text in test_texts:
        print(f"\nInput: '{text}'")
        print("-" * 60)
        
        params = get_flower_art_parameters(text, streak_days=5, community_mood=0.8, trading_activity=0.7)
        
        print(f"Emotion: {params['currentEmotion']}")
        print(f"Confidence: {params['confidencePercentage']:.1f}%")
        print(f"Petal Count: {params['petalParams']['petalCount']}")
        print(f"Layer Count: {params['petalParams']['layerCount']}")
        print(f"Heartbeat BPM: {params['heartbeatSettings']['bpm']}")
        print(f"Rotation Intensity: {params['moodSettings']['intensity']:.2f}")
        print(f"Stalk Length: {params['stalkParams']['currentLength']:.1f}")
        print(f"Bee Should Appear: {params['beeParams']['shouldAppear']}")
        print(f"Complexity: {params['mlParams']['complexityEntropy']:.2f}")
        
        print("-" * 60)
    
    print("\n" + "=" * 80)
    print("JAVASCRIPT INTEGRATION CODE")
    print("=" * 80)
    print(get_js_integration_code())
