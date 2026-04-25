from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Load model from HuggingFace (NO local files needed)
sentiment_pipeline = pipeline("sentiment-analysis")

@app.get("/")
def home():
    return {"message": "API is running"}

@app.get("/analyze")
def analyze(text: str):
    result = sentiment_pipeline(text)[0]

    return {
        "sentiment": result["label"],
        "score": result["score"]
    }