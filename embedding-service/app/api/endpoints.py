from fastapi import APIRouter
from pydantic import BaseModel
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class GenerateEmbeddingRequest(BaseModel):
    message_id: str

@router.post("/embeddings/generate")
async def generate_embedding(request: GenerateEmbeddingRequest):
    """
    Endpoint triggered by backend when a new message is created.
    The actual embedding generation happens in the background worker.
    """
    logger.info(f"[API] Received embedding generation request for message: {request.message_id}")
    return {
        "status": "queued",
        "message": f"Embedding generation queued for message {request.message_id}"
    }

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "embedding-service"}
