import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

export function StartNode() {
    return (
        <div className="bg-slate-800 border-2 border-green-500 rounded-lg p-3 shadow-lg text-white w-48 font-sans">
            <div className="flex items-center gap-2 mb-2 font-bold text-green-400">
                <Play size={16} />
                <span>Start Sequence</span>
            </div>
            <div className="text-xs text-slate-400">
                Entry point of your automation.
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-green-500 border-2 border-slate-800"
            />
        </div>
    );
}
