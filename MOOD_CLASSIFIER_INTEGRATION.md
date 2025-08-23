# 🌸 Mood Classifier Integration

This document describes the integration of the [mood-classifier](https://github.com/innovinitylabs/mood-classifier) with the Shapes of Mind NFT project.

## 🚀 Quick Start

### 1. Start the Mood Classifier Backend

```bash
# From the project root
./start-mood-classifier.sh
```

This will:
- Create a Python virtual environment
- Install required dependencies
- Start the Flask API server on port 5001

### 2. Start the Frontend

```bash
# In another terminal
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Test the Integration

1. Navigate to `http://localhost:3000/mint`
2. Enter text describing your mood
3. Click "Analyze Mood" to see the AI-generated flower parameters
4. Preview your unique flower before minting

## 🔧 Architecture

### Backend (Python Flask)
- **API Server**: `mood-classifier-backend/api_server.py`
- **ML Model**: Emotion classification using scikit-learn
- **Integration Bridge**: `flower_integration_bridge.py` - Maps ML predictions to flower art parameters
- **Port**: 5001

### Frontend (Next.js)
- **Service**: `src/services/moodClassifierService.ts` - API client
- **Component**: `src/components/MoodInput.tsx` - Mood input interface
- **Page**: `src/app/mint/page.tsx` - Enhanced mint page with mood analysis
- **Art Component**: `src/components/FlowerArt.tsx` - Updated to accept mood classifier parameters

## 📊 API Endpoints

### POST `/api/mood-analysis`
Analyzes text and returns flower art parameters.

**Request:**
```json
{
  "text": "I'm feeling really happy today!",
  "streakDays": 5,
  "communityMood": 0.8,
  "tradingActivity": 0.7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentEmotion": "joy",
    "confidence": 0.85,
    "confidencePercentage": 85.0,
    "petalParams": {
      "layerCount": 4,
      "petalCount": 14,
      "baseLayerRadius": 16
    },
    "heartbeatSettings": {
      "bpm": 98,
      "intensity": 0.72
    },
    "moodSettings": {
      "intensity": 1.0,
      "direction": 1
    }
    // ... more parameters
  }
}
```

### GET `/api/health`
Health check endpoint.

### GET `/api/example`
Returns example request and response.

## 🎨 Flower Art Parameters

The mood classifier generates comprehensive parameters for the flower art system:

### Emotion-Based Parameters
- **Current Emotion**: happy, joy, sad, fear, anger, disgust, shame, surprise, neutral
- **Confidence**: 0.0-1.0 (confidence in emotion prediction)
- **Color Mapping**: Each emotion maps to specific color palettes

### Petal System
- **Layer Count**: 1-10 layers based on emotional complexity
- **Petal Count**: 3-20 petals based on emotional intensity
- **Rotation Speed**: Based on emotion and confidence
- **Rotation Direction**: Clockwise/counter-clockwise based on emotion

### Heartbeat System
- **BPM**: 55-110 based on emotion (sad=slow, fear=fast)
- **Glow Intensity**: 0.2-0.9 based on emotion and confidence
- **Pulse Pattern**: Realistic heartbeat with dual pulse system

### Streak-Based Features
- **Bee Appearance**: After 3+ days of good mood
- **Bee Range**: Decreases with longer streaks
- **Stalk Growth**: Based on community mood
- **Glow Enhancement**: Increases with streak length

## 🔄 Integration Flow

1. **User Input**: User describes their mood in text
2. **ML Analysis**: Backend analyzes text using trained model
3. **Parameter Generation**: ML predictions mapped to flower art parameters
4. **Real-time Preview**: Flower art updates with new parameters
5. **Minting**: Parameters stored for NFT creation

## 🛠️ Development

### Adding New Parameters

1. **Backend**: Update `flower_integration_bridge.py`
2. **Frontend**: Update `moodClassifierService.ts` interfaces
3. **Art Component**: Update `FlowerArt.tsx` to use new parameters

### Testing

```bash
# Test backend
curl -X POST http://localhost:5001/api/mood-analysis \
  -H "Content-Type: application/json" \
  -d '{"text": "I am feeling wonderful today!", "streakDays": 7}'

# Test frontend
npm run dev
# Navigate to http://localhost:3000/mint
```

## 🔮 Future Enhancements

### Smart Contract Integration
- **Mood Storage**: Store mood data on-chain
- **Streak Tracking**: Track consecutive good mood days
- **Community Features**: Aggregate community mood data
- **Trading Activity**: Integrate with marketplace data

### Advanced Features
- **Audio Analysis**: Voice-based mood detection
- **Image Analysis**: Facial expression mood detection
- **Biometric Integration**: Heart rate, stress level integration
- **Social Features**: Mood sharing and community interaction

## 🐛 Troubleshooting

### Backend Issues
- **Port 5001 in use**: Change port in `api_server.py`
- **Model file missing**: Download from mood-classifier repository
- **Python dependencies**: Run `pip install -r requirements.txt`

### Frontend Issues
- **API connection failed**: Check if backend is running on port 5001
- **CORS errors**: Backend has CORS enabled, check network tab
- **Parameter mapping**: Verify TypeScript interfaces match backend response

### Environment Variables
```bash
# Optional: Set custom API URL
NEXT_PUBLIC_MOOD_CLASSIFIER_API_URL=http://localhost:5001
```

## 📚 Resources

- [Mood Classifier Repository](https://github.com/innovinitylabs/mood-classifier)
- [Flower Art Parameters Documentation](./PARAMETER_REPORT.md)
- [API Integration Guide](./API_INTEGRATION.md)
