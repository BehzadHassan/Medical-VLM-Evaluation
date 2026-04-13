import React, { useState } from 'react';
import { ModelMetrics } from '@/types';
import { MODEL_METADATA } from '@/lib/data';

interface ModelCardProps {
    modelName: string;
    output: string;
    confidenceScore?: number;
    loading?: boolean;
    metrics?: ModelMetrics;
}

export default function ModelCard({
    modelName,
    output,
    confidenceScore,
    loading = false,
    metrics
}: ModelCardProps) {
    const [showInfo, setShowInfo] = useState(false);
    const metadata = MODEL_METADATA[modelName];

    return (
        <div className="flex flex-col h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm overflow-visible relative transition-all duration-300 hover:shadow-lg hover:border-indigo-200 group">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white px-5 py-4 flex justify-between items-center relative rounded-t-2xl border-b border-slate-100/80">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                        {metadata?.name || modelName}
                    </h3>
                    {metadata && (
                        <div className="relative">
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                onMouseEnter={() => setShowInfo(true)}
                                onMouseLeave={() => setShowInfo(false)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            {/* Info Popover */}
                            {showInfo && (
                                <div className="absolute left-0 top-8 z-50 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-5 text-left animate-in fade-in zoom-in-95 duration-200">
                                    <div className="mb-4">
                                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-full uppercase tracking-wider">{metadata.role}</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Why it's here</p>
                                            <p className="text-xs text-slate-300 leading-relaxed">{metadata.whyInList}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1">Context</p>
                                            <p className="text-xs text-slate-300 leading-relaxed">{metadata.relevance}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-800">
                                        <a
                                            href={metadata.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center group-hover:underline"
                                        >
                                            View Official Model
                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {confidenceScore !== undefined && (
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-sm ${confidenceScore > 0.8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100' :
                        confidenceScore > 0.5 ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100' :
                            'bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100'
                        }`}>
                        {(confidenceScore * 100).toFixed(0)}% Conf
                    </span>
                )}
            </div>

            <div className="p-5 flex-grow overflow-auto min-h-[160px] text-sm text-slate-700 leading-relaxed">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-indigo-400">
                        <div className="flex flex-col items-center gap-4">
                            <span className="relative flex h-8 w-8">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-8 w-8 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 animate-pulse">Running Inference</span>
                        </div>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap font-serif text-base">{output || "Waiting for prompt input..."}</div>
                )}
            </div>

            {/* Metrics Section */}
            {!loading && metrics && (
                <div className="bg-slate-50/50 p-5 rounded-b-2xl border-t border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Evaluation Metrics</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <MetricBar label="Acc" value={metrics.accuracy} color="bg-emerald-500" />
                        <MetricBar label="Pre" value={metrics.precision} color="bg-indigo-500" />
                        <MetricBar label="Rec" value={metrics.recall} color="bg-purple-500" />
                        <MetricBar label="F1" value={metrics.f1_score} color="bg-blue-500" />
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span className="uppercase tracking-wider">{label}</span>
                <span className="text-slate-700">{(value * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${value * 100}%` }}></div>
            </div>
        </div>
    )
}
