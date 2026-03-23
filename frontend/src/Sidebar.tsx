import { Globe, FileText, Play, MousePointerClick, Keyboard, Scissors, Save, Layers, Repeat } from 'lucide-react';

export let pendingNodeType: string | null = null;
export const setPendingNodeType = (t: string | null) => { pendingNodeType = t; };

interface NodeItemProps {
    label: string;
    icon: React.ReactNode;
    nodeType: string;
    color: string;
}

function NodeItem({ label, icon, nodeType, color }: NodeItemProps) {
    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setPendingNodeType(nodeType);

        // Create a visible ghost element that follows the cursor
        const ghost = document.createElement('div');
        ghost.id = 'drag-ghost';
        ghost.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      background: #1e293b;
      border: 2px solid ${color};
      border-radius: 8px;
      padding: 8px 14px;
      color: white;
      font-size: 13px;
      font-family: sans-serif;
      box-shadow: 0 0 15px ${color}55;
      opacity: 0.92;
      left: ${e.clientX - 60}px;
      top:  ${e.clientY - 18}px;
    `;
        ghost.textContent = `+ ${label}`;
        document.body.appendChild(ghost);

        const onMouseMove = (me: MouseEvent) => {
            ghost.style.left = `${me.clientX - 60}px`;
            ghost.style.top = `${me.clientY - 18}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            const existing = document.getElementById('drag-ghost');
            if (existing) existing.remove();
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div
            className="bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 p-3 flex items-center gap-3 rounded select-none shadow-sm"
            style={{ cursor: 'grab' }}
            onMouseDown={onMouseDown}
        >
            <div className="p-1.5 rounded" style={{ background: `${color}22`, color }}>
                {icon}
            </div>
            <span className="text-sm font-medium text-white">{label}</span>
        </div>
    );
}

export function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-4 text-white font-sans h-full shadow-xl z-20">
            <div className="mb-4 pb-4 border-b border-slate-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">NodeGhost RPA</h1>
            </div>

            <div className="flex flex-col gap-3 h-full overflow-y-auto pb-4 custom-scrollbar">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 shrink-0">Available Nodes</h3>

                <NodeItem label="Start Sequence" icon={<Play size={18} />} nodeType="startNode" color="#22c55e" />
                <NodeItem label="Open URL" icon={<Globe size={18} />} nodeType="openUrlNode" color="#3b82f6" />
                <NodeItem label="Click Element" icon={<MousePointerClick size={18} />} nodeType="clickNode" color="#f97316" />
                <NodeItem label="Type Text" icon={<Keyboard size={18} />} nodeType="typeNode" color="#eab308" />
                <NodeItem label="Extract Text" icon={<Scissors size={18} />} nodeType="extractTextNode" color="#ec4899" />

                <div className="h-px bg-slate-700 my-1"></div>
                <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1 shrink-0 flex items-center gap-1">
                    Loops & Arrays
                </h3>
                <NodeItem label="Extract Multiple" icon={<Layers size={18} />} nodeType="extractMultipleNode" color="#6366f1" />
                <NodeItem label="Loop Items" icon={<Repeat size={18} />} nodeType="loopNode" color="#f97316" />

                <div className="h-px bg-slate-700 my-1"></div>
                <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1 shrink-0 flex items-center gap-1">
                    AI Powered
                    (in progress)
                </h3>
                <div className="h-px bg-slate-700 my-1"></div>
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 shrink-0 flex items-center gap-1">
                    Data Export
                </h3>
                <NodeItem label="Export to CSV" icon={<Save size={18} />} nodeType="exportCsvNode" color="#059669" />

                <div className="h-px bg-slate-700 my-1"></div>
                <NodeItem label="Log Message" icon={<FileText size={18} />} nodeType="logNode" color="#a855f7" />
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-500 shrink-0">
                Click and drag nodes onto the canvas.
            </div>
        </aside>
    );
}
