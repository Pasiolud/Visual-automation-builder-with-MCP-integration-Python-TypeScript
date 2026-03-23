import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Repeat } from 'lucide-react';
import { ChangeEvent } from 'react';

export function LoopNode({ data, id }: { data: any; id: string }) {
    const { updateNodeData } = useReactFlow();

    const onChangeListVariableName = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { listVariableName: e.target.value });
    };

    const onChangeItemVariableName = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { itemVariableName: e.target.value });
    };

    return (
        <div className="bg-slate-800 border-2 border-orange-500 rounded-full p-4 shadow-[0_0_15px_rgba(249,115,22,0.3)] text-white w-56 h-56 flex flex-col items-center justify-center font-sans box-border">
            {/* Input Handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-orange-500 border-2 border-slate-800"
            />

            <div className="flex flex-col items-center gap-1 mb-3 font-bold text-orange-400">
                <Repeat size={24} />
                <span className="text-sm">Loop (Pętla)</span>
            </div>

            <div className="w-full px-2">
                <label className="text-[10px] text-slate-400 block mb-1 text-center uppercase tracking-wider">
                    Zmienna z listą:
                </label>
                <input
                    type="text"
                    className="w-full mb-2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center text-slate-200 outline-none focus:border-orange-500 nodrag nopan font-mono"
                    placeholder="lista_produktow"
                    value={data.listVariableName || ''}
                    onChange={onChangeListVariableName}
                />

                <label className="text-[10px] text-slate-400 block mb-1 text-center uppercase tracking-wider">
                    Zmienna dla iteracji:
                </label>
                <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-center text-slate-200 outline-none focus:border-orange-500 nodrag nopan font-mono"
                    placeholder="obecny_produkt"
                    value={data.itemVariableName || ''}
                    onChange={onChangeItemVariableName}
                />
            </div>

            <div className="absolute right-0 top-[35%] translate-x-3 text-[10px] text-orange-400 font-bold bg-slate-900 border border-slate-700 px-1 rounded z-10">Next</div>
            {/* Loop Item Handle (Next) */}
            <Handle
                type="source"
                position={Position.Right}
                id="next_item"
                style={{ top: '35%', background: '#f97316', width: '12px', height: '12px', right: '-6px' }}
                className="border-2 border-slate-800"
            />

            <div className="absolute right-0 top-[65%] translate-x-3 text-[10px] text-slate-400 font-bold bg-slate-900 border border-slate-700 px-1 rounded z-10">Done</div>
            {/* Loop Completed Handle */}
            <Handle
                type="source"
                position={Position.Right}
                id="completed"
                style={{ top: '65%', background: '#94a3b8', width: '12px', height: '12px', right: '-6px' }}
                className="border-2 border-slate-800"
            />
        </div>
    );
}
