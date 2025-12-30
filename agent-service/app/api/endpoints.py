from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel
from app.agents.registry import registry

router = APIRouter()

@router.get("/agents")
async def list_agents():
    return {"agents": registry.list_agents()}

@router.post("/agents/{agent_id}/chat")
async def chat_with_agent(agent_id: str, message: str = Form(...)):
    agent = registry.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    
    try:
        response = await agent.process(message)
        return {
            "agent_id": agent_id,
            "response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class AnalyzeConversationRequest(BaseModel):
    conversation_id: str

@router.post("/agents/psychological_insights/analyze")
async def analyze_conversation(request: AnalyzeConversationRequest):
    """
    Analyze a conversation and generate psychological insights
    """
    agent = registry.get_agent("psychological_insights")
    if not agent:
        raise HTTPException(status_code=404, detail="Psychological Insights Agent not found")
    
    try:
        insights = await agent.process(request.conversation_id)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/agents/notes_creator/analyze")
async def create_notes(request: AnalyzeConversationRequest):
    """
    Analyze a conversation and generate structured notes
    """
    agent = registry.get_agent("notes_creator")
    if not agent:
        raise HTTPException(status_code=404, detail="Notes Creator Agent not found")
    
    try:
        notes = await agent.process(request.conversation_id)
        return notes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
