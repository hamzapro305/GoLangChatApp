from abc import ABC, abstractmethod
from typing import Any, Dict, Union

class BaseAgent(ABC):
    def __init__(self, name: str, description: str = ""):
        self.name = name
        self.description = description

    @abstractmethod
    async def process(self, message: str) -> Union[str, Dict[str, Any]]:
        """Processes the input message and returns a string or dictionary."""
        pass
