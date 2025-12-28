import asyncio
import unittest
from unittest.mock import MagicMock, patch
from app.agents.notes_creator import NotesCreatorAgent

class TestNotesCreatorAgent(unittest.TestCase):
    @patch('app.agents.notes_creator.genai')
    @patch('app.agents.notes_creator.os.getenv')
    def test_process_success(self, mock_getenv, mock_genai):
        # Setup mocks
        mock_getenv.return_value = "dummy_key"
        mock_model = MagicMock()
        mock_genai.GenerativeModel.return_value = mock_model
        
        mock_response = MagicMock()
        mock_response.text = '{"title": "Test Meeting", "summary": "A test meeting about AI", "key_points": ["Point 1", "Point 2"], "action_items": ["Action 1"], "attendees": ["Alice", "Bob"]}'
        mock_model.generate_content.return_value = mock_response

        agent = NotesCreatorAgent()
        
        # Run process (async)
        loop = asyncio.get_event_loop()
        result = loop.run_until_complete(agent.process("Meeting about AI"))

        # Assertions
        self.assertEqual(result["title"], "Test Meeting")
        self.assertEqual(len(result["key_points"]), 2)
        self.assertEqual(result["attendees"], ["Alice", "Bob"])

if __name__ == '__main__':
    unittest.main()
