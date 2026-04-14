import { useCallback, useRef, useState, useEffect } from 'react';
import { Play, Save, RotateCcw, Terminal } from 'lucide-react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import './App.css';
import { Sidebar, pendingNodeType, setPendingNodeType } from './Sidebar';
import { StartNode } from './nodes/StartNode';
import { OpenUrlNode } from './nodes/OpenUrlNode';
import { LogNode } from './nodes/LogNode';
import { ClickNode } from './nodes/ClickNode';
import { TypeNode } from './nodes/TypeNode';
import { ExtractTextNode } from './nodes/ExtractTextNode';
import { ExportCsvNode } from './nodes/ExportCsvNode';
import { ExtractMultipleNode } from './nodes/ExtractMultipleNode';
import { LoopNode } from './nodes/LoopNode';
import { LogModal } from './components/LogModal';
import { ChatPanel } from './components/ChatPanel';

const nodeTypes = {
  startNode: StartNode,
  openUrlNode: OpenUrlNode,
  logNode: LogNode,
  clickNode: ClickNode,
  typeNode: TypeNode,
  extractTextNode: ExtractTextNode,
  exportCsvNode: ExportCsvNode,
  extractMultipleNode: ExtractMultipleNode,
  loopNode: LoopNode,
};

const getId = () => `dndnode_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

function Board() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);


  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [executionLogs, setExecutionLogs] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);


  useEffect(() => {
    const savedNodes = localStorage.getItem('nodeghost_nodes');
    const savedEdges = localStorage.getItem('nodeghost_edges');
    if (savedNodes) {
      try { setNodes(JSON.parse(savedNodes)); } catch (e) { console.error(e); }
    }
    if (savedEdges) {
      try { setEdges(JSON.parse(savedEdges)); } catch (e) { console.error(e); }
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        className: node.id === activeNodeId
          ? 'ring-4 ring-green-500 rounded-lg transition-all duration-300 transform scale-105 z-50'
          : 'transition-all duration-300 z-0',
      }))
    );
  }, [activeNodeId, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  const onBoardMouseUp = useCallback(
    (event: React.MouseEvent) => {
      const type = pendingNodeType;
      setPendingNodeType(null);
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const runAutomation = async () => {
    try {
      setActiveNodeId(null);

      const graph = {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
        edges: edges.map(e => ({ source: e.source, target: e.target, sourceHandle: e.sourceHandle })),
      };

      console.log('Sending graph to backend:', graph);
      const response = await fetch('http://localhost:8000/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graph)
      });

      const result = await response.json();
      console.log('Backend response:', result);
      setActiveNodeId(null);

      setExecutionLogs(JSON.stringify(result, null, 2));
      setIsLogModalOpen(true);
    } catch (e: any) {
      console.error('Error running automation:', e);
      setActiveNodeId(null);
      setExecutionLogs(`Fatal Error running automation:\n${e.toString()}`);
      setIsLogModalOpen(true);
    }
  };

  const saveBoard = () => {
    localStorage.setItem('nodeghost_nodes', JSON.stringify(nodes));
    localStorage.setItem('nodeghost_edges', JSON.stringify(edges));
    alert("Board saved successfully! It will restore when you refresh.");
  };

  const clearBoard = () => {
    if (window.confirm("Are you sure you want to clear the board?")) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem('nodeghost_nodes');
      localStorage.removeItem('nodeghost_edges');
    }
  };

  return (
    <div
      className="flex-1 h-full relative"
      ref={reactFlowWrapper}
      onMouseUp={onBoardMouseUp}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>

      <LogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        logs={executionLogs}
      />

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium py-2 px-4 border border-slate-700 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Terminal size={16} /> Show Logs
        </button>
        <button
          onClick={saveBoard}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 border border-slate-700 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <Save size={16} /> Save Board(PLACEHOLDER)
          {/*w przyszlosci dodac zapis osobnych automatyzacji*/}
        </button>
        <button
          onClick={clearBoard}
          className="bg-slate-800/80 hover:bg-red-900/50 hover:text-red-400 text-slate-400 font-medium py-2 px-4 border border-slate-700/50 hover:border-red-900/50 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      <button
        onClick={runAutomation}
        className="absolute bottom-6 right-6 z-10 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center gap-2 transition-all"
      >
        <Play size={20} />
        Run Automation
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex h-screen w-screen bg-slate-900 overflow-hidden">
      <Sidebar />
      <ReactFlowProvider>
        <Board />
      </ReactFlowProvider>
    </div>
  );
}
