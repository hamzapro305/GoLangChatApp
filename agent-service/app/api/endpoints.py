from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.registry import registry

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.get("/agents")
async def list_agents():
    return {"agents": registry.list_agents()}

@router.post("/agents/{agent_id}/chat")
async def chat_with_agent(agent_id: str, request: ChatRequest):
    agent = registry.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found")
    
    try:
        response = await agent.process(request.message)
        return {
            "agent_id": agent_id,
            "response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
