from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments

# Load Twitter dataset (working version)
dataset = load_dataset("tweet_eval", "sentiment")

# Take small subset for faster training
train_data = dataset["train"].shuffle(seed=42).select(range(5000))

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

# Tokenization function
def tokenize(example):
    return tokenizer(example["text"], truncation=True, padding="max_length")

# Apply tokenization
train_data = train_data.map(tokenize, batched=True)

# Load model (3 labels: negative, neutral, positive)
model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=3
)

# Training configuration
training_args = TrainingArguments(
    output_dir="./twitter-results",
    per_device_train_batch_size=8,
    num_train_epochs=1,
    logging_steps=50,
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_data,
)

# Train model
trainer.train()

# Save model
model.save_pretrained("twitter-model")
tokenizer.save_pretrained("twitter-model")