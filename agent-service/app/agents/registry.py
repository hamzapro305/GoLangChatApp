from typing import Dict, Type
from app.agents.base import BaseAgent
from app.agents.notes_creator import NotesCreatorAgent

class AgentRegistry:
    _agents: Dict[str, BaseAgent] = {}

    @classmethod
    def register_agent(cls, agent_instance: BaseAgent):
        cls._agents[agent_instance.name] = agent_instance

    @classmethod
    def get_agent(cls, name: str) -> BaseAgent:
        return cls._agents.get(name)

    @classmethod
    def list_agents(cls):
        return [
            {"name": agent.name, "description": agent.description}
            for agent in cls._agents.values()
        ]

# Initialize and register agents
registry = AgentRegistry()

try:
    registry.register_agent(NotesCreatorAgent())
except Exception as e:
    print(f"Warning: Could not register NotesCreatorAgent: {e}")
