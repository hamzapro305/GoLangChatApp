import os
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
import requests
from app.agents.base import BaseAgent
from dotenv import load_dotenv
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
import json
import logging

load_dotenv()

logger = logging.getLogger(__name__)

class NotesResponse(BaseModel):
    """Structured notes with additional metadata."""
    summary: str = Field(description="Overall summary of the conversation")
    key_points: List[str] = Field(description="Main key points discussed")
    action_items: List[str] = Field(description="Action items or tasks identified")
    decisions: List[str] = Field(description="Decisions made during the conversation")
    participants: List[str] = Field(description="Participants in the conversation")

class NotesCreatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="notes_creator",
            description="Analyzes conversation messages and creates structured notes with summary, key points, action items, and decisions."
        )
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # MongoDB connection
        mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
        self.mongo_client = MongoClient(mongodb_uri)
        # Match backend database name from config/database.go
        self.db = self.mongo_client["conversation-db"] 
        self.messages_collection = self.db["messages"]
        self.users_collection = self.db["users"]

    def _get_user_name(self, user_id: str) -> str:
        """Fetch username from database"""
        try:
            user = self.users_collection.find_one({"_id": ObjectId(user_id)})
            if user and "name" in user:
                return user["name"]
            return f"User_{user_id[:6]}"
        except Exception as e:
            logger.error(f"[Notes Creator] Error fetching user name for {user_id}: {e}")
            return f"User_{user_id[:6]}"

    def _format_conversation(self, messages: List[Dict]) -> str:
        """Format messages into readable conversation transcript"""
        formatted_lines = []
        formatted_lines.append("=== CONVERSATION TRANSCRIPT ===\n")
        
        for msg in messages:
            sender_id = msg.get("senderId", "unknown")
            sender_name = self._get_user_name(sender_id)
            content = msg.get("content", "")
            timestamp = msg.get("createdAt", "")
            
            # Format timestamp
            try:
                if isinstance(timestamp, str):
                    # Handle Go style RFC3339 timestamps
                    dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                else:
                    dt = timestamp
                time_str = dt.strftime("%Y-%m-%d %H:%M")
            except Exception:
                time_str = "Unknown time"
            
            formatted_lines.append(f"[{time_str}] {sender_name}: {content}")
        
        formatted_lines.append("\n=== END OF TRANSCRIPT ===")
        return "\n".join(formatted_lines)

    def _call_gemini_api(self, prompt: str) -> str:
        """Call Gemini API directly via REST"""
        # Using v1beta as it supports gemini-1.5-flash and the 2.0 experimental models
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048
            }
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        logger.info(f"[Notes Creator] Sending request to Gemini REST API...")
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"[Notes Creator] Gemini API error: {response.status_code} - {response.text}")
            raise Exception(f"Gemini API error: {response.status_code}")
        
        result = response.json()
        try:
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError) as e:
            logger.error(f"[Notes Creator] Unexpected response structure: {result}")
            raise Exception("Failed to parse Gemini API response")

    async def process(self, conversation_id: str) -> Union[str, Dict[str, Any]]:
        """
        Fetch conversation messages, format them, and generate structured notes
        """
        try:
            logger.info(f"[Notes Creator] Processing conversation: {conversation_id}")
            
            # Fetch all messages for the conversation
            messages = list(self.messages_collection.find({
                "conversationId": conversation_id
            }).sort("createdAt", 1))
            
            logger.info(f"[Notes Creator] Found {len(messages)} messages")
            
            if not messages:
                logger.warning(f"[Notes Creator] No messages found for conversation: {conversation_id}")
                return {
                    "error": "No messages found in this conversation",
                    "summary": "",
                    "key_points": [],
                    "action_items": [],
                    "decisions": [],
                    "participants": []
                }
            
            # Format conversation with usernames and timestamps
            formatted_conversation = self._format_conversation(messages)
            logger.info(f"[Notes Creator] Formatted conversation length: {len(formatted_conversation)}")
            
            # Get unique participants
            participants_ids = list(set([msg.get("senderId") for msg in messages if msg.get("senderId")]))
            participant_names = [self._get_user_name(p_id) for p_id in participants_ids]
            
            # Generate notes using Gemini
            logger.info("[Notes Creator] Generating notes with Gemini REST API...")
            
            prompt = f"""You are an expert conversation analyst. Analyze the following conversation transcript and create comprehensive structured notes.

TRANSCRIPT:
{formatted_conversation}

Return your response as a JSON object with these exact keys:
- summary: A concise string summarizing the entire conversation.
- key_points: An array of strings representing the main topics discussed.
- action_items: An array of strings representing tasks or follow-ups identified.
- decisions: An array of strings representing decisions reached.

Ensure the output is valid JSON."""

            response_text = self._call_gemini_api(prompt)
            logger.info("[Notes Creator] Gemini response received")
            
            # Parse JSON response
            try:
                # Remove markdown code blocks if present
                clean_text = response_text.strip()
                if clean_text.startswith("```json"):
                    clean_text = clean_text[7:]
                if clean_text.startswith("```"):
                    clean_text = clean_text[3:]
                if clean_text.endswith("```"):
                    clean_text = clean_text[:-3]
                clean_text = clean_text.strip()
                
                notes_dict = json.loads(clean_text)
                
                # Ensure all required fields exist
                for field in ["summary", "key_points", "action_items", "decisions"]:
                    if field not in notes_dict:
                        notes_dict[field] = "" if field == "summary" else []
                
                notes_dict["participants"] = participant_names
                
                logger.info("[Notes Creator] ✓ Notes generated successfully")
                return notes_dict
            except json.JSONDecodeError as e:
                logger.error(f"[Notes Creator] JSON parse failed: {e}. Raw response: {response_text}")
                # Fallback to a structured error
                return {
                    "error": "Failed to parse AI response as JSON",
                    "raw_response": response_text,
                    "summary": "Error parsing notes",
                    "key_points": [],
                    "action_items": [],
                    "decisions": [],
                    "participants": participant_names
                }
            
        except Exception as e:
            logger.error(f"[Notes Creator] Error in process: {str(e)}")
            return {
                "error": f"Note creation failed: {str(e)}",
                "summary": "",
                "key_points": [],
                "action_items": [],
                "decisions": [],
                "participants": []
            }
