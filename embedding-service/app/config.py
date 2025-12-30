import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://admin:admin@localhost:27017/")
    DATABASE_NAME = "conversation-db"
    MESSAGES_COLLECTION = "messages"
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    WORKER_POLL_INTERVAL = 5  # seconds
    
config = Config()
