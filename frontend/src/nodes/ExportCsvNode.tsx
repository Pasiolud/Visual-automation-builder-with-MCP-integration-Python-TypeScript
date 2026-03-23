import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Save } from 'lucide-react';
import { ChangeEvent } from 'react';

export function ExportCsvNode({ data, id }: { data: any; id: string }) {
    const { updateNodeData } = useReactFlow();

    const onChangeFilePath = (e: ChangeEvent<HTMLInputElement>) => {
        updateNodeData(id, { filePath: e.target.value });
    };

    const onChangeVariables = (e: ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(id, { variables: e.target.value });
    };

    return (
        <div className="bg-slate-800 border-2 border-emerald-600 rounded-lg p-3 shadow-lg text-white w-64 font-sans">
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-emerald-600 border-2 border-slate-800"
            />

            <div className="flex items-center gap-2 mb-3 font-bold text-emerald-500">
                <Save size={16} />
                <span>Export to CSV</span>
            </div>

            <label className="text-xs text-slate-400 block mb-1">
                File path (z .csv):
            </label>
            <input
                type="text"
                className="w-full mb-2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-emerald-600 nodrag nopan"
                placeholder="C:/results/data.csv"
                value={data.filePath || ''}
                onChange={onChangeFilePath}
            />

            <label className="text-xs text-slate-400 block mb-1">
                Variables to export (e.g. price,productName):
            </label>
            <textarea
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 outline-none focus:border-emerald-600 nodrag nopan resize-none h-16"
                placeholder="price,productName"
                value={data.variables || ''}
                onChange={onChangeVariables}
            />

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-emerald-600 border-2 border-slate-800"
            />
        </div>
    );
}
