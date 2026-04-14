import os
#import google.generativeai as gemini
from google import genai
from dotenv import load_dotenv
from backend.app.mcp_server import open_page, get_page_elements, click_element,  type_into_element


class Agent():
    def __init__(self):
        load_dotenv()


        self.function_map = {
            "open_page": open_page,
            "get_page_elements": get_page_elements,
            "click_element": click_element,
            "type_into_element": type_into_element,
        }
        # dokumentacja
        self.tools = [open_page, get_page_elements, click_element,  type_into_element]
        self.client = genai.Client(api_key=os.getenv("FREE_API_KEY"))
        self.config = genai.types.GenerateContentConfig(
            tools=self.tools,
            automatic_function_calling=genai.types.AutomaticFunctionCallingConfig(
                disable=True
            ) # po to zeby sam tych async nie wolal bo nie on sobie z nimi nie radzi i nie nie mozna dac po prostu = False

        )
        self.chat = self.client.aio.chats.create(
            model="gemini-2.5-flash",
            config=self.config,
        )
        
        
    async def ask(self, prompt:str):

        response = await self.chat.send_message(prompt)

        while response.function_calls:
            for function_call in response.function_calls:
                args = function_call.args
                func = function_call.name
                
                if func in self.function_map:
                    func_to_call = self.function_map[func]
                    result = await func_to_call(**args)
                    # dobra tylko co ja mam teraz zwrocic w sumie 
                    response = await self.chat.send_message(
                        genai.types.Part.from_function_response(
                            name=func,
                            response={"result":result},
                        )
                    )
        return response.text


    
# tescior
#EMM wczesniej dzialalo teraz tak jakby nie dziala na tych funkcjach asynchronicznych
#w sensie nie wywoluje chyba funkcje tylko ze on nie wie ze to asynchorniczna to robi fikolka
#jakby nie umial w async
if __name__ == "__main__":
    import asyncio
    
    async def test():
        agent = Agent()
        try:
            answer = await agent.ask("Wejdz na youtube.com i wyszukaj crazy frog i powiedz mi pierwsze 3 tytulu filmików")
            print(f"Odpowiedz: {answer}")
        except Exception as e:
            print(f"Error: {e}")
        
        
    asyncio.run(test())