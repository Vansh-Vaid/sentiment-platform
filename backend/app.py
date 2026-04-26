from fastapi import FastAPI
from textblob import TextBlob
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

# ✅ CORS FIRST (important)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ In-memory history
history = []

@app.get("/")
def home():
    return {"message": "API is running"}

@app.get("/analyze")
def analyze(text: str):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity

    if polarity > 0:
        sentiment = "POSITIVE"
    elif polarity < 0:
        sentiment = "NEGATIVE"
    else:
        sentiment = "NEUTRAL"

    result = {
        "text": text,
        "sentiment": sentiment,
        "score": round(abs(polarity), 2),
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