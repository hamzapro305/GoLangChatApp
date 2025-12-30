import time
import logging
from threading import Thread
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from app.config import config
import traceback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EmbeddingWorker:
    def __init__(self):
        logger.info("[WORKER] Initializing embedding worker...")
        
        # Initialize MongoDB connection
        try:
            self.client = MongoClient(config.MONGODB_URI)
            self.db = self.client[config.DATABASE_NAME]
            self.messages_collection = self.db[config.MESSAGES_COLLECTION]
            logger.info("[WORKER] ✓ Connected to MongoDB")
        except Exception as e:
            logger.error(f"[WORKER] ✗ MongoDB connection error: {str(e)}")
            raise
        
        # Initialize sentence transformer model
        try:
            logger.info(f"[WORKER] Loading embedding model: {config.EMBEDDING_MODEL}")
            self.model = SentenceTransformer(config.EMBEDDING_MODEL)
            logger.info("[WORKER] ✓ Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"[WORKER] ✗ Model loading error: {str(e)}")
            raise
        
        self.running = False
        self.worker_thread = None
    
    def generate_embedding(self, text: str) -> list:
        """Generate embedding for the given text"""
        start_time = time.time()
        try:
            embedding = self.model.encode(text, convert_to_numpy=True)
            embedding_list = embedding.tolist()
            duration = (time.time() - start_time) * 1000  # Convert to ms
            return embedding_list, duration
        except Exception as e:
            logger.error(f"[WORKER] ✗ Embedding generation error: {str(e)}")
            raise
    
    def process_pending_messages(self):
        """Process all pending messages and generate embeddings"""
        try:
            # Find messages with pending embedding status
            pending_messages = self.messages_collection.find({
                "embeddingStatus": "pending",
                "type": "text"
            })
            
            pending_count = self.messages_collection.count_documents({
                "embeddingStatus": "pending",
                "type": "text"
            })
            
            if pending_count > 0:
                logger.info(f"[WORKER] Found {pending_count} messages with pending embeddings")
            
            for message in pending_messages:
                message_id = message.get("_id")
                content = message.get("content", "")
                
                if not content:
                    logger.warning(f"[WORKER] Message {message_id} has no content, skipping")
                    continue
                
                try:
                    logger.info(f"[WORKER] Generating embedding for message {message_id}...")
                    embedding, duration = self.generate_embedding(content)
                    
                    # Update message with embedding
                    self.messages_collection.update_one(
                        {"_id": message_id},
                        {
                            "$set": {
                                "embedding": embedding,
                                "embeddingStatus": "ready"
                            }
                        }
                    )
                    
                    logger.info(f"[WORKER] ✓ Embedding generated in {duration:.0f}ms")
                    logger.info(f"[WORKER] Updated message {message_id} status to ready")
                    
                except Exception as e:
                    logger.error(f"[WORKER] ✗ Error processing message {message_id}: {str(e)}")
                    logger.error(traceback.format_exc())
                    
                    # Mark as failed
                    self.messages_collection.update_one(
                        {"_id": message_id},
                        {"$set": {"embeddingStatus": "failed"}}
                    )
                    logger.info(f"[WORKER] Updated message {message_id} status to failed")
        
        except Exception as e:
            logger.error(f"[WORKER] ✗ Error in process_pending_messages: {str(e)}")
            logger.error(traceback.format_exc())
    
    def run(self):
        """Main worker loop"""
        logger.info(f"[WORKER] Starting worker loop (polling every {config.WORKER_POLL_INTERVAL}s)...")
        self.running = True
        
        while self.running:
            try:
                logger.info("[WORKER] Polling for pending messages...")
                self.process_pending_messages()
            except Exception as e:
                logger.error(f"[WORKER] ✗ Unexpected error in worker loop: {str(e)}")
                logger.error(traceback.format_exc())
            
            # Wait before next poll
            time.sleep(config.WORKER_POLL_INTERVAL)
    
    def start(self):
        """Start the worker in a separate thread"""
        if self.worker_thread and self.worker_thread.is_alive():
            logger.warning("[WORKER] Worker is already running")
            return
        
        self.worker_thread = Thread(target=self.run, daemon=True)
        self.worker_thread.start()
        logger.info("[WORKER] Worker thread started")
    
    def stop(self):
        """Stop the worker"""
        logger.info("[WORKER] Stopping worker...")
        self.running = False
        if self.worker_thread:
            self.worker_thread.join(timeout=10)
        logger.info("[WORKER] Worker stopped")

# Global worker instance
embedding_worker = EmbeddingWorker()
