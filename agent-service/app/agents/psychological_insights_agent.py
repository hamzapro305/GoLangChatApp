import os
import logging
from typing import List, Dict, Any, Union
from pydantic import BaseModel, Field
import requests
from pymongo import MongoClient
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from app.agents.base import BaseAgent
import json

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PsychologicalInsight(BaseModel):
    """Structured output for psychological insights"""
    summary: str = Field(description="Brief summary of the psychological analysis")
    emotional_patterns: List[str] = Field(description="Identified emotional patterns")
    thinking_patterns: List[str] = Field(description="Observed thinking patterns")
    behavioral_indicators: List[str] = Field(description="Notable behavioral indicators")
    diagnoses: List[str] = Field(description="Psychological diagnoses based on conversation patterns")
    strengths: List[str] = Field(description="Identified strengths")
    areas_of_growth: List[str] = Field(description="Areas for potential growth")
    suggested_reflections: List[str] = Field(description="Suggested reflections for the user")
    confidence_level: str = Field(description="Confidence level: low, medium, or high")
    ethical_note: str = Field(
        default="This analysis is based on conversational data and should be considered as observational insights.",
        description="Ethical disclaimer"
    )

class PsychologicalInsightsAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="psychological_insights",
            description="Analyzes conversation patterns to provide comprehensive psychological insights and diagnoses"
        )
        
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        
        # Initialize MongoDB connection
        try:
            self.mongo_client = MongoClient(mongodb_uri)
            # Match backend database name
            self.db = self.mongo_client["conversation-db"]
            self.messages_collection = self.db["messages"]
            logger.info("[Psychological Agent] ✓ Connected to MongoDB")
        except Exception as e:
            logger.error(f"[Psychological Agent] ✗ MongoDB connection error: {str(e)}")
            raise

    def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API directly via REST"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 2048
            }
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"[Psychological Agent] Gemini API error: {response.status_code} - {response.text}")
            raise Exception(f"Gemini API error: {response.status_code}")
        
        result = response.json()
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            logger.error(f"[Psychological Agent] Unexpected response structure: {result}")
            raise Exception("Failed to parse Gemini API response")

    def get_messages_with_embeddings(self, conversation_id: str) -> List[Dict]:
        """Retrieve messages with ready embeddings from MongoDB"""
        try:
            logger.info(f"[Psychological Agent] Analyzing conversation {conversation_id}...")
            
            messages = list(self.messages_collection.find({
                "conversationId": conversation_id,
                "embeddingStatus": "ready",
                "type": "text"
            }))
            
            logger.info(f"[Psychological Agent] Found {len(messages)} messages with embeddings ready")
            return messages
        except Exception as e:
            logger.error(f"[Psychological Agent] ✗ Error fetching messages: {str(e)}")
            raise
    
    def perform_vector_search(self, messages: List[Dict], query_text: str = None, top_k: int = 50) -> List[Dict]:
        """Perform vector similarity search on messages"""
        try:
            if not messages:
                return []
            
            # If no specific query, return most recent
            if not query_text:
                return messages[:top_k]
            
            # For now, return all since we are doing full analysis
            return messages[:top_k]
        except Exception as e:
            logger.error(f"[Psychological Agent] ✗ Error in vector search: {str(e)}")
            raise
    
    async def process(self, conversation_id: str) -> Dict[str, Any]:
        """Process a conversation and generate psychological insights"""
        import time
        start_time = time.time()
        
        try:
            # Fetch messages with embeddings
            messages = self.get_messages_with_embeddings(conversation_id)
            
            if len(messages) < 3:
                logger.warning(f"[Psychological Agent] Insufficient data: only {len(messages)} messages")
                return {
                    "error": "Insufficient conversational data to generate reliable psychological insights.",
                    "message_count": len(messages),
                    "minimum_required": 3
                }
            
            # Perform vector search (retrieve relevant messages)
            relevant_messages = self.perform_vector_search(messages)
            
            # Format messages for analysis
            formatted_messages = "\n\n".join([
                f"Message {i+1}: {msg.get('content', '')}"
                for i, msg in enumerate(relevant_messages)
            ])
            
            logger.info("[Psychological Agent] Generating psychological insights with REST API...")
            
            prompt = f"""You are an advanced psychological analysis AI with comprehensive diagnostic capabilities.

Analyze the following conversation messages and generate detailed psychological insights.

MESSAGES:
{formatted_messages}

Return your response as a JSON object with these exact keys:
- summary: string (Brief summary of analysis)
- emotional_patterns: array of strings
- thinking_patterns: array of strings
- behavioral_indicators: array of strings
- diagnoses: array of strings (Psychological diagnoses based on conversation)
- strengths: array of strings
- areas_of_growth: array of strings
- suggested_reflections: array of strings
- confidence_level: string (low, medium, or high)
- ethical_note: string (Ethical disclaimer)

Be thorough and specific."""

            response_text = self._call_gemini_api(prompt)
            
            # Parse JSON response
            try:
                clean_text = response_text.strip()
                if clean_text.startswith("```json"):
                    clean_text = clean_text[7:]
                if clean_text.startswith("```"):
                    clean_text = clean_text[3:]
                if clean_text.endswith("```"):
                    clean_text = clean_text[:-3]
                clean_text = clean_text.strip()
                
                insights = json.loads(clean_text)
                insights["messages_analyzed"] = len(relevant_messages)
                
                duration = (time.time() - start_time) * 1000
                logger.info(f"[Psychological Agent] ✓ Analysis complete in {duration:.0f}ms")
                
                return insights
            except json.JSONDecodeError as e:
                logger.error(f"[Psychological Agent] JSON parse failed: {e}")
                return {"error": "Failed to parse AI response", "raw_response": response_text}
            
        except Exception as e:
            logger.error(f"[Psychological Agent] ✗ Error: {str(e)}")
            return {"error": f"Analysis failed: {str(e)}"}
