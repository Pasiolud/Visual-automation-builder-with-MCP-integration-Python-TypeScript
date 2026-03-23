import { Handle, Position, useReactFlow } from '@xyflow/react';
import { MousePointerClick } from 'lucide-react';
import { ChangeEvent } from 'react';

export function ClickNode({ data, id }: { data: any; id: string }) {
    const { updateNodeData } = useReactFlow();

    const onChangeParams = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { selector: e.target.value });
    };

    return (
        <div className="bg-slate-800 border-2 border-orange-500 rounded-lg p-3 shadow-lg text-white w-56 font-sans">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-orange-500 border-2 border-slate-800"
            />

            <div className="flex items-center gap-2 mb-2 font-bold text-orange-400">
                <MousePointerClick size={16} />
                <span>Click Element</span>
            </div>

            <label className="text-xs text-slate-400 block mb-1">
                CSS Selector:
            </label>
            <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-orange-500 nodrag nopan"
                placeholder="#submit-btn"
                value={data.selector || ''}
                onChange={onChangeParams}
            />

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-orange-500 border-2 border-slate-800"
            />
        </div>
    );
}
