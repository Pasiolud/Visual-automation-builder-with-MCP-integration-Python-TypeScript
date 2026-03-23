from backend.app.models import GraphPayload, GraphNode, GraphEdge
from backend.app.engine import GraphEngine
import asyncio

async def test_graph():
    startNode = GraphNode(id="1", type="startNode", data={})
    logNode = GraphNode(id="2", type="logNode", data={"message":"log pierwszy"})
    logNode2 = GraphNode(id="3", type="logNode", data={"message":"log drugi"})

    edge1 = GraphEdge(source="1", target="2")
    edge2 = GraphEdge(source="2", target="3")

    graphPayload = GraphPayload(
        nodes = [startNode,logNode,logNode2],
        edges = [edge1,edge2]
    )

    graph_engine = GraphEngine(graphPayload)
    graph_engine.build_map()
    await graph_engine.run()

asyncio.run(test_graph())

    