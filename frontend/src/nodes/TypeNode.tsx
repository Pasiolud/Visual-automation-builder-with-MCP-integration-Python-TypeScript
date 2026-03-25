import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Keyboard } from 'lucide-react';
import { ChangeEvent } from 'react';

export function TypeNode({ data, id }: { data: any; id: string }) {
    const { updateNodeData } = useReactFlow();

    const onChangeSelector = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { selector: e.target.value });
    };

    const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { text: e.target.value });
    };

    return (
        <div className="bg-slate-800 border-2 border-yellow-500 rounded-lg p-3 shadow-lg text-white w-56 font-sans">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-yellow-500 border-2 border-slate-800"
            />

            <div className="flex items-center gap-2 mb-2 font-bold text-yellow-500">
                <Keyboard size={16} />
                <span>Type Text</span>
            </div>

            <label className="text-xs text-slate-400 block mb-1">
                CSS Selector:
            </label>
            <input
                type="text"
                className="w-full mb-2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-yellow-500 nodrag nopan"
                placeholder="input[name='q']"
                value={data.selector || ''}
                onChange={onChangeSelector}
            />

            <label className="text-xs text-slate-400 block mb-1">
                Text to type:
            </label>
            <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-yellow-500 nodrag nopan"
                placeholder="Hello World"
                value={data.text || ''}
                onChange={onChangeText}
            />

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-yellow-500 border-2 border-slate-800"
            />
        </div>
    );
}
