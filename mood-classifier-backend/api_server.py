from flask import Flask, request, jsonify
from flask_cors import CORS
from flower_integration_bridge import get_flower_art_parameters
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/mood-analysis', methods=['POST'])
def analyze_mood():
    """
    API endpoint for mood analysis and flower art parameter generation
    """
    try:
        data = request.get_json()
        
        # Extract parameters
        text = data.get('text', '')
        streak_days = data.get('streakDays', 0)
        community_mood = data.get('communityMood', 0.5)
        trading_activity = data.get('tradingActivity', 0.5)
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Get flower art parameters
        params = get_flower_art_parameters(
            text=text,
            streak_days=streak_days,
            community_mood=community_mood,
            trading_activity=trading_activity
        )
        
        return jsonify({
            'success': True,
            'data': params
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({'status': 'healthy', 'service': 'mood-classifier-api'})

@app.route('/api/example', methods=['GET'])
def example_usage():
    """
    Example usage endpoint
    """
    example_data = {
        'text': 'I\'m feeling really happy today!',
        'streakDays': 5,
        'communityMood': 0.8,
        'tradingActivity': 0.7
    }
    
    params = get_flower_art_parameters(**example_data)
    
    return jsonify({
        'example_request': example_data,
        'example_response': params
    })

if __name__ == '__main__':
    print("=" * 60)
    print("MOOD CLASSIFIER API SERVER")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("Available endpoints:")
    print("  POST /api/mood-analysis - Analyze text and get flower parameters")
    print("  GET  /api/health        - Health check")
    print("  GET  /api/example       - Example usage")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5001)
