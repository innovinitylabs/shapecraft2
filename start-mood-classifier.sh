#!/bin/bash

echo "🌸 Starting Mood Classifier Backend..."
echo "======================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "mood-classifier-backend" ]; then
    echo "❌ mood-classifier-backend directory not found. Please run this script from the project root."
    exit 1
fi

cd mood-classifier-backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if model file exists
if [ ! -f "models/emotion_classifier_pipe_lr_03_jan_2022.pkl" ]; then
    echo "⚠️  Model file not found. Please ensure the model file is in the models/ directory."
    echo "   You may need to download it from the mood-classifier repository."
fi

# Start the server
echo "🚀 Starting Mood Classifier API server..."
echo "   API will be available at: http://localhost:5001"
echo "   Health check: http://localhost:5001/api/health"
echo "   Example: http://localhost:5001/api/example"
echo ""
echo "Press Ctrl+C to stop the server"
echo "======================================"

python3 api_server.py
