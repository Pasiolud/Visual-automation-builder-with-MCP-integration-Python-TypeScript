import os
import google.generativeai as gemini
from dotenv import load_dotenv
from backend.app.mcp_server import open_page, get_page_elements, click_element,  type_into_element


class Agent():
    def __init__(self):
        self.tools = [open_page, get_page_elements, click_element,  type_into_element]
        load_dotenv()
        gemini.configure(api_key=os.getenv("FREE_API_KEY"))
        self.model = gemini.GenerativeModel(model_name="gemini-3.1-flash-lite-preview",tools=self.tools)    
        self.chat = self.model.start_chat(enable_automatic_function_calling=True)
        
        
    async def ask(self, prompt:str):
        response = await self.chat.send_message_async(prompt)
        return response.text
    
# tescior

if __name__ == "__main__":
    import asyncio
    
    async def test():
        agent = Agent()
        
        answer = await agent.ask("Wejdz na youtube.com i wyszukaj crazy frog i powiedz mi pierwsze 3 tytulu filmików")
        
        print(f"Odpowiedz: {answer}")
    asyncio.run(test())