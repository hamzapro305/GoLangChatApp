from fastapi import APIRouter, HTTPException, Form
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
