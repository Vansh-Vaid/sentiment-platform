from transformers import pipeline

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="sshleifer/tiny-distilbert-base-uncased-finetuned-sst-2-english"
)