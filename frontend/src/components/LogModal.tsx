import { useMemo } from 'react';
import { X, Terminal, Database, CheckCircle2, AlertCircle } from 'lucide-react';

interface LogModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: string;
}

export function LogModal({ isOpen, onClose, logs }: LogModalProps) {
    if (!isOpen) return null;

    const { execLogs, memoryLogs } = useMemo(() => {
        const lines = logs.split('\n');
        const exec: string[] = [];
        const mem: string[] = [];

        let isMemorySection = false;

        for (const line of lines) {
            if (line.startsWith('Current Memory:')) {
                isMemorySection = true;
                mem.push(line.replace('Current Memory:', '').trim());
                continue;
            }

            if (isMemorySection) {
                mem.push(line);
            } else {
                exec.push(line);
            }
        }

        return { execLogs: exec, memoryLogs: mem.join('\n') };
    }, [logs]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Terminal className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">Execution Results</h2>
                            <p className="text-sm text-slate-400">Review automation steps and memory state</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Execution Steps Panel */}
                    <div className="w-1/2 flex flex-col border-r border-slate-700 bg-slate-900/50">
                        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Process Log</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
                            {execLogs.map((line, idx) => {
                                let colorClass = "text-slate-300";
                                if (line.includes('❌') || line.includes('Error')) colorClass = "text-red-400 font-medium";
                                else if (line.includes('✅') || line.includes('Completed')) colorClass = "text-emerald-400";
                                else if (line.includes('⚠️')) colorClass = "text-yellow-400";
                                else if (line.includes('➡️') || line.includes('🔁')) colorClass = "text-blue-300";

                                return (
                                    <div key={idx} className={`p-2 rounded bg-slate-800/40 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors ${colorClass}`}>
                                        {line}
                                    </div>
                                );
                            })}
                            {execLogs.length === 0 && (
                                <div className="text-slate-500 italic flex items-center gap-2">
                                    <AlertCircle size={14} /> No execution logs found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Memory State Panel */}
                    <div className="w-1/2 flex flex-col bg-slate-950">
                        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
                            <Database size={16} className="text-purple-400" />
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">node Context memory</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <pre className="font-mono text-sm text-purple-300 bg-slate-900/80 p-4 rounded-lg border border-slate-800 shadow-inner overflow-x-auto">
                                {memoryLogs || "{\n  // Empty state\n}"}
                            </pre>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-800 border-t border-slate-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Close Viewer
                    </button>
                </div>

            </div>
        </div>
    );
}
