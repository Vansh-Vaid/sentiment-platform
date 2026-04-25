from fastapi import FastAPI
from textblob import TextBlob

app = FastAPI()

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

    return {
        "sentiment": sentiment,
        "score": round(abs(polarity), 2)
    }