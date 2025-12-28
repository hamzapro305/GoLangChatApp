import os
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from app.agents.base import BaseAgent
from dotenv import load_dotenv

load_dotenv()

class NoteItem(BaseModel):
    """Individual note item extracted from conversation."""
    title: str = Field(description="A short, descriptive title for the note (e.g., 'Database Requirement', 'Meeting Schedule').")
    description: str = Field(description="Detailed content of the note. This should capture the specifics mentioned in the chat.")

class NotesResponse(BaseModel):
    """List of notes extracted from the input."""
    notes: List[NoteItem] = Field(description="A list of structured notes extracted from the conversation.")

class NotesCreatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="notes_creator",
            description="Extracts specific requirements, plans, and key information into a list of structured notes."
        )
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize LangChain LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=api_key,
            temperature=0.1, # Slightly higher temperature for better extraction
        )
        
        # Configure structured output
        self.structured_llm = self.llm.with_structured_output(NotesResponse)
        
        # Define prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a precision-oriented assistant for a professional chat application. 
             Your task is to analyze the user's chat message and extract all actionable pieces of information, requirements, technical preferences, or scheduled events as individual notes.

             Rules:
             1. Every important point should be its own note in the 'notes' array.
             2. Titles should be concise and categorizing (e.g., 'Tech Stack', 'Client Request', 'Scheduling').
             3. Descriptions should be clear and preserve the context (e.g., 'Client needs a MongoDB database for the app').
             4. If the message is simple like 'i have a meeting tomorrow', create a note with Title: 'Meeting' and Description: 'Meeting scheduled for tomorrow'.
             5. ALWAYS return the 'notes' array, even if there is only one note.
             6. Capture technical details precisely (e.g., specific databases, languages, or frameworks).
             """),
            ("human", "{input_text}")
        ])

    async def process(self, message: str) -> Union[str, Dict[str, Any]]:
        try:
            # Chain: Prompt | Structured LLM
            chain = self.prompt | self.structured_llm
            result = await chain.ainvoke({"input_text": message})
            
            # Convert Pydantic model to dict
            return result.dict()
        except Exception as e:
            return {"error": f"Extraction failed: {str(e)}"}
