import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Layers } from 'lucide-react';
import { ChangeEvent } from 'react';

export function ExtractMultipleNode({ data, id }: { data: any; id: string }) {
    const { updateNodeData } = useReactFlow();

    const onChangeSelector = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { selector: e.target.value });
    };

    const onChangeListVariableName = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { listVariableName: e.target.value });
    };

    const onChangeExtractType = (e: ChangeEvent<HTMLSelectElement>) => {
        updateNodeData(id, { extractType: e.target.value });
    };

    return (
        <div className="bg-slate-800 border-2 border-indigo-500 rounded-lg p-3 shadow-[0_0_15px_rgba(99,102,241,0.2)] text-white w-64 font-sans min-w-[280px]">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-indigo-500 border-2 border-slate-800"
            />

            <div className="flex items-center gap-2 mb-3 font-bold text-indigo-400">
                <Layers size={16} />
                <span>Extract Multiple</span>
            </div>

            <label className="text-xs text-slate-400 block mb-1">
                CSS Selector (e.g. a.product-link):
            </label>
            <input
                type="text"
                className="w-full mb-3 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-indigo-500 nodrag nopan"
                placeholder=".product-item h2"
                value={data.selector || ''}
                onChange={onChangeSelector}
            />

            <label className="text-xs text-slate-400 block mb-1">
                What to extract?
            </label>
            <select
                className="w-full mb-3 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-indigo-500 nodrag nopan"
                value={data.extractType || 'text'}
                onChange={onChangeExtractType}
            >
                <option value="text">Full Text (innerText)</option>
                <option value="href">Link (Attribute href)</option>
            </select>

            <label className="text-xs text-slate-400 block mb-1">
                Save list as variable:
            </label>
            <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-indigo-500 nodrag nopan font-mono"
                placeholder="np. lista_linkow"
                value={data.listVariableName || ''}
                onChange={onChangeListVariableName}
            />

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-indigo-500 border-2 border-slate-800"
            />
        </div>
    );
}
