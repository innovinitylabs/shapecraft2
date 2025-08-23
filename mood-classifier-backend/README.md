# Mood Classifier - ML-Based Text Emotion Analysis

A machine learning-powered web application that analyzes text and predicts emotions using a trained scikit-learn model.

## 🎯 Features

- **8 Emotion Categories**: anger, disgust, fear, happy, joy, neutral, sad, shame, surprise
- **Confidence Scores**: Shows prediction confidence for reliability assessment
- **Probability Distribution**: Displays probability scores for all emotions
- **Visual Charts**: Interactive Altair charts for easy interpretation
- **70% Accuracy**: Trained model with proven performance

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/innovinitylabs/mood-classifier.git
   cd mood-classifier
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   streamlit run app.py
   ```

4. **Open your browser**
   Navigate to `http://localhost:8501`

## 📊 How It Works

### Input
- Enter any text in the text area
- Click "Submit" to analyze

### Output
- **Primary Emotion**: Predicted emotion with emoji
- **Confidence Score**: How confident the model is (0-100%)
- **Probability Distribution**: Scores for all 8 emotions
- **Visual Chart**: Bar chart showing emotion probabilities

### Example Output
```
Input: "I'm feeling really happy today!"

Prediction: happy:🤗
Confidence: 85.2%

Probability Distribution:
- happy: 85%
- joy: 5%
- neutral: 2%
- fear: 3%
- anger: 2%
- disgust: 1%
- sad: 1%
- shame: 1%
```

## 🛠️ Technical Details

- **Model**: Scikit-learn Linear Regression pipeline
- **Training Data**: Speech dataset with labeled emotions
- **Features**: Text preprocessing and feature extraction
- **Frontend**: Streamlit web application
- **Visualization**: Altair charts

## 📁 Project Structure

```
mood-classifier/
├── app.py                 # Main Streamlit application
├── models/                # Trained ML model
│   └── emotion_classifier_pipe_lr_03_jan_2022.pkl
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Created By

Riza Mohamed

---

**Note**: This is the essential ML-based mood classifier extracted from the original MoodTracker project. It focuses solely on text emotion analysis using machine learning.
