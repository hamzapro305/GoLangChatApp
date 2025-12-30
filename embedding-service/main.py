from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router
from app.workers.embedding_worker import embedding_worker
import logging
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Embedding Service",
    description="Microservice for generating message embeddings using sentence-transformers",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    """Start the embedding worker on application startup"""
    logger.info("[EMBEDDING-SERVICE] Starting embedding service on port 8002...")
    logger.info("[EMBEDDING-SERVICE] Initializing background worker...")
    embedding_worker.start()
    logger.info("[EMBEDDING-SERVICE] ✓ Service ready")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop the embedding worker on application shutdown"""
    logger.info("[EMBEDDING-SERVICE] Shutting down...")
    embedding_worker.stop()
    logger.info("[EMBEDDING-SERVICE] ✓ Shutdown complete")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
