from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import predict_sentiment

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 In-memory storage
history_data = []

# Root
@app.get("/")
def home():
    return {"message": "API is running"}

# Analyze
@app.get("/analyze")
def analyze(text: str):
    result = predict_sentiment(text)

    entry = {
        "text": result["text"],
        "sentiment": result["sentiment"]
    }

    # 🔥 DEBUG PRINT
    print("ADDING TO HISTORY:", entry)

    # Add to history (latest first)
    history_data.insert(0, entry)

    # Keep only last 10
    if len(history_data) > 10:
        history_data.pop()

    return {
        "text": result["text"],
        "sentiment": result["sentiment"],
        "score": result["score"]
    }

# Stats
@app.get("/stats")
def stats():
    positive = sum(1 for x in history_data if x["sentiment"] == "POSITIVE")
    negative = sum(1 for x in history_data if x["sentiment"] == "NEGATIVE")
    neutral = sum(1 for x in history_data if x["sentiment"] == "NEUTRAL")

    return {
        "positive": positive,
        "negative": negative,
        "neutral": neutral
    }

# History (REAL DATA)
@app.get("/history")
def history():
    print("CURRENT HISTORY:", history_data)  # debug
    return history_data