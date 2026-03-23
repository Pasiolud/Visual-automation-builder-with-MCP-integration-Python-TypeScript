from backend.app.models import GraphPayload, GraphNode, GraphEdge
from backend.app.engine import GraphEngine
import asyncio

async def url_test():
    startNode = GraphNode(id="1", type="startNode", data={})
    urlNode = GraphNode(id="2", type="openUrlNode",data= {"url":"https://playwright.dev/python/docs/intro"})
    edge1 = GraphEdge(source="1", target="2") 

    payload = GraphPayload(nodes=[startNode,urlNode],edges=[edge1])
    engine = GraphEngine(payload)
    engine.build_map()
    await engine.run()

asyncio.run(url_test())
