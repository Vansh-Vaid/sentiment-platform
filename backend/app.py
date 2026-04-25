from fastapi import FastAPI
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

app = FastAPI()

# Load lightweight model properly
model_name = "sshleifer/tiny-distilbert-base-uncased-finetuned-sst-2-english"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model=model,
    tokenizer=tokenizer
)

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