from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.models import GraphPayload
from backend.app.engine import GraphEngine
from backend.app.models import ChatMessage
import sys
import asyncio
from backend.app.services.agent import Agent

# FastAPI usunie problem z blokowaniem jeśli odpalimy graf w osobnym wątku

app = FastAPI()
agent = Agent()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#glowny endpoint
@app.post("/graph")
def graph_load(payload: GraphPayload): # notka: windows bazowo odpala na SelectorEventLoop, który nie zezwala na odpalanie .exe, więc trzeba ręcznie to zrobić
    if sys.platform == 'win32':
        loop = asyncio.ProactorEventLoop()
    else:
        loop = asyncio.new_event_loop()
        
    asyncio.set_event_loop(loop)

    engine = GraphEngine(payload)
    engine.build_map()
    
    # Uruchamiamy graf w nowej pętli
    loop.run_until_complete(engine.run())
    loop.close()

    return {"message": "graph loaded successfully"}

@app.post("/ai/chat")
async def ai_chat(payload: ChatMessage):
    response = await agent.ask(payload.message)
    return {"response":response}