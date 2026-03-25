import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Globe } from 'lucide-react';
import { ChangeEvent } from 'react';

export function OpenUrlNode({ data, id }: { data: any; id: string }) {
    const { updateNodeData } = useReactFlow();

    const onChangeParams = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { url: e.target.value });
    };

    return (
        <div className="bg-slate-800 border-2 border-blue-500 rounded-lg p-3 shadow-lg text-white w-56 font-sans">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-blue-500 border-2 border-slate-800"
            />

            <div className="flex items-center gap-2 mb-2 font-bold text-blue-400">
                <Globe size={16} />
                <span>Open URL</span>
            </div>

            <label className="text-xs text-slate-400 block mb-1">
                Website URL:
            </label>
            <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-blue-500 nodrag nopan"
                placeholder="https://example.com"
                value={data.url || ''}
                onChange={onChangeParams}
            />

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-blue-500 border-2 border-slate-800"
            />
        </div>
    );
}
