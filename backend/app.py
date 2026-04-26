from fastapi import FastAPI
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# 🔥 Load better models
sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=1
)

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

history = []

@app.get("/")
def home():
    return {"message": "AI API running"}

# 🚀 ADVANCED ANALYSIS
@app.get("/analyze")
def analyze(text: str):

    # Sentiment
    s = sentiment_model(text)[0]

    label_map = {
        "LABEL_0": "NEGATIVE",
        "LABEL_1": "NEUTRAL",
        "LABEL_2": "POSITIVE"
    }

    sentiment = label_map.get(s["label"], "NEUTRAL")
    sentiment_score = round(s["score"], 2)

    # Emotion
    e = emotion_model(text)[0][0]

    emotion = e["label"].upper()
    emotion_score = round(e["score"], 2)

    # Intensity logic
    if sentiment_score > 0.8:
        intensity = "HIGH"
    elif sentiment_score > 0.6:
        intensity = "MEDIUM"
    else:
        intensity = "LOW"

    result = {
        "text": text,
        "sentiment": sentiment,
        "score": sentiment_score,
        "emotion": emotion,
        "emotion_score": emotion_score,
        "intensity": intensity,
        "time": datetime.now().strftime("%H:%M:%S")
    }

    history.insert(0, result)

    return result

@app.get("/history")
def get_history():
    return history[:10]

@app.get("/stats")
def get_stats():
    stats = {
        "POSITIVE": 0,
        "NEGATIVE": 0,
        "NEUTRAL": 0
    }

    for item in history:
        stats[item["sentiment"]] += 1

    return stats