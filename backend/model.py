from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Load trained Twitter model
model_path = "twitter-model"

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)

# Label mapping (VERY IMPORTANT)
labels = ["NEGATIVE", "NEUTRAL", "POSITIVE"]


def predict_sentiment(text: str):
    # Tokenize input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    # Get model output
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits

    # Convert to probabilities
    probs = torch.softmax(logits, dim=1)[0]

    # Get predicted class
    predicted_class = torch.argmax(probs).item()

    # Get label
    label = labels[predicted_class]

    return {
        "text": text,
        "sentiment": label,
        "score": float(probs[predicted_class]),
        "all_scores": {
            "negative": float(probs[0]),
            "neutral": float(probs[1]),
            "positive": float(probs[2]),
        },
    }