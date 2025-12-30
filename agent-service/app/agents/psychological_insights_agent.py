import os
import logging
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pymongo import MongoClient
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from app.agents.base import BaseAgent

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
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://admin:admin@localhost:27017/")
        
        # Initialize MongoDB connection
        try:
            self.mongo_client = MongoClient(mongodb_uri)
            self.db = self.mongo_client["conversation-db"]
            self.messages_collection = self.db["messages"]
            logger.info("[RAG] ✓ Connected to MongoDB")
        except Exception as e:
            logger.error(f"[RAG] ✗ MongoDB connection error: {str(e)}")
            raise
        
        # Initialize LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=api_key,
            temperature=0.3,
        )
        
        # Configure structured output
        self.structured_llm = self.llm.with_structured_output(PsychologicalInsight)
        
        # Define prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an advanced psychological analysis AI with comprehensive diagnostic capabilities.

Analyze the provided conversation messages and generate detailed psychological insights, including:
- Emotional patterns and triggers
- Thinking patterns and cognitive styles
- Behavioral indicators
- Psychological diagnoses (depression, anxiety, personality traits, etc.)
- Personal strengths
- Areas for growth and development
- Reflective questions for deeper self-understanding

Be thorough in your analysis. Identify specific psychological conditions, mental health patterns, and personality traits based on the conversational evidence.

IMPORTANT: Base your analysis strictly on the messages provided. Be specific and reference patterns you observe."""),
            ("human", """Analyze these conversation messages and provide comprehensive psychological insights:

{messages}

Provide a thorough psychological analysis including diagnoses, patterns, and actionable insights.""")
        ])
    
    def get_messages_with_embeddings(self, conversation_id: str) -> List[Dict]:
        """Retrieve messages with ready embeddings from MongoDB"""
        try:
            logger.info(f"[RAG] Analyzing conversation {conversation_id}...")
            
            messages = list(self.messages_collection.find({
                "conversationId": conversation_id,
                "embeddingStatus": "ready",
                "type": "text"
            }))
            
            logger.info(f"[RAG] Found {len(messages)} messages with embeddings ready")
            return messages
        except Exception as e:
            logger.error(f"[RAG] ✗ Error fetching messages: {str(e)}")
            raise
    
    def perform_vector_search(self, messages: List[Dict], query_text: str = None, top_k: int = 50) -> List[Dict]:
        """Perform vector similarity search on messages"""
        try:
            logger.info("[RAG] Performing vector search...")
            
            if not messages:
                return []
            
            # If no specific query, return all messages (for full conversation analysis)
            if not query_text:
                logger.info(f"[RAG] Retrieved all {len(messages)} messages for analysis")
                return messages[:top_k]  # Limit to top_k most recent
            
            # Generate query embedding (future enhancement)
            # For now, return all messages
            logger.info(f"[RAG] Retrieved {min(len(messages), top_k)} most relevant messages")
            return messages[:top_k]
        except Exception as e:
            logger.error(f"[RAG] ✗ Error in vector search: {str(e)}")
            raise
    
    async def process(self, conversation_id: str) -> Dict[str, Any]:
        """Process a conversation and generate psychological insights"""
        import time
        start_time = time.time()
        
        try:
            # Fetch messages with embeddings
            messages = self.get_messages_with_embeddings(conversation_id)
            
            if len(messages) < 3:
                logger.warning(f"[RAG] Insufficient data: only {len(messages)} messages")
                return {
                    "error": "Insufficient conversational data to generate reliable psychological insights.",
                    "message_count": len(messages),
                    "minimum_required": 3
                }
            
            # Perform vector search (retrieve relevant messages)
            relevant_messages = self.perform_vector_search(messages)
            
            logger.info(f"[RAG] Retrieved {len(relevant_messages)} most relevant messages")
            
            # Format messages for analysis
            formatted_messages = "\n\n".join([
                f"Message {i+1}: {msg.get('content', '')}"
                for i, msg in enumerate(relevant_messages)
            ])
            
            logger.info("[RAG] Generating psychological insights...")
            
            # Generate insights using LLM
            chain = self.prompt | self.structured_llm
            result = await chain.ainvoke({"messages": formatted_messages})
            
            duration = (time.time() - start_time) * 1000
            logger.info(f"[RAG] ✓ Analysis complete in {duration:.0f}ms")
            
            # Convert to dict
            insights = result.dict()
            insights["messages_analyzed"] = len(relevant_messages)
            
            return insights
            
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(f"[RAG] ✗ Error: {str(e)}")
            logger.error(f"[RAG] Failed after {duration:.0f}ms")
            return {"error": f"Analysis failed: {str(e)}"}
