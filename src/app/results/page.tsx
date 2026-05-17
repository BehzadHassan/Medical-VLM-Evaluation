"use client";

import React, { useState, useEffect } from 'react';

const MODALITIES = ['CXR', 'CT', 'MRI'] as const;
type Modality = typeof MODALITIES[number];

import cxrData from '../../../public/Data/reports/cxr.json';
import ctData from '../../../public/Data/reports/ct.json';
import mriData from '../../../public/Data/reports/mri.json';

const DATA_BY_MODALITY: Record<Modality, any[]> = {
    CXR: cxrData,
    CT: ctData,
    MRI: mriData,
};

const MODALITY_LABELS: Record<Modality, string> = {
    CXR: 'Chest X-Ray',
    CT: 'CT Scan',
    MRI: 'MRI',
};

function getImagePath(modality: Modality, imageId: string) {
    return `/Data/${modality}/${imageId}.png`;
}

function getModelDisplayName(modelKey: string) {
    switch (modelKey.toLowerCase()) {
        case 'biomedclip': return 'BioMedCLIP';
        case 'chexagent': return 'ChexAgent';
        case 'llava_med': return 'LLaVA-Med v1.5';
        case 'medgemma': return 'MedGemma';
        case 'unimedclip': return 'UniMedCLIP';
        default: return modelKey;
    }
}

function getModelColor(modelKey: string) {
    switch (modelKey.toLowerCase()) {
        case 'biomedclip': return { bg: 'bg-blue-50/50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-100 text-blue-800 border-blue-200', accent: 'bg-blue-500' };
        case 'chexagent': return { bg: 'bg-amber-50/50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-800 border-amber-200', accent: 'bg-amber-500' };
        case 'llava_med': return { bg: 'bg-violet-50/50', border: 'border-violet-200', text: 'text-violet-800', badge: 'bg-violet-100 text-violet-800 border-violet-200', accent: 'bg-violet-500' };
        case 'medgemma': return { bg: 'bg-rose-50/50', border: 'border-rose-200', text: 'text-rose-800', badge: 'bg-rose-100 text-rose-800 border-rose-200', accent: 'bg-rose-500' };
        case 'unimedclip': return { bg: 'bg-teal-50/50', border: 'border-teal-200', text: 'text-teal-800', badge: 'bg-teal-100 text-teal-800 border-teal-200', accent: 'bg-teal-500' };
        default: return { bg: 'bg-slate-50/50', border: 'border-slate-200', text: 'text-slate-800', badge: 'bg-slate-100 text-slate-800 border-slate-200', accent: 'bg-slate-500' };
    }
}

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />;
}

// ─────── Model Response Card ───────
function ModelResponseCard({ modelKey, modelResult, trueLabel }: { modelKey: string; modelResult: any; trueLabel: string }) {
    const displayName = getModelDisplayName(modelKey);
    const colors = getModelColor(modelKey);
    const predicted = modelResult?.predicted_label || 'N/A';
    const isCorrect = predicted.toLowerCase().replace(/[-_\s]/g, '') === trueLabel.toLowerCase().replace(/[-_\s]/g, '');

    // Extract the main text output
    let mainOutput = '';
    if (modelResult?.findings) mainOutput = modelResult.findings;
    else if (modelResult?.response) mainOutput = modelResult.response;
    else if (typeof modelResult === 'string') mainOutput = modelResult;

    const impression = modelResult?.impression || null;
    const scores = modelResult?.scores || null;

    return (
        <div className={`bg-white rounded-[2rem] border ${colors.border} overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group`}>
            {/* Model Header */}
            <div className={`${colors.bg} px-6 py-4 flex items-center justify-between border-b ${colors.border} group-hover:bg-opacity-100 transition-colors`}>
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors.accent} shadow-sm`}></div>
                    <span className={`font-black text-sm ${colors.text} tracking-tight`}>{displayName}</span>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${isCorrect ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {isCorrect ? 'Correct Match' : 'Mismatch'}
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Predicted Label */}
                <div className="flex items-start flex-col gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100 inline-block">Predicted Diagnosis</span>
                    <span className={`font-bold text-base capitalize px-4 py-2 rounded-xl w-full border ${isCorrect ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]' : 'bg-rose-50 text-rose-900 border-rose-200 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]'}`}>
                        {predicted}
                    </span>
                </div>

                {/* Findings */}
                {mainOutput && (
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100 inline-block mb-2">Model Rationale / Output</span>
                        <div className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 rounded-2xl p-4 border border-slate-200 max-h-40 overflow-y-auto styled-scrollbars font-medium relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 rounded-l-2xl"></div>
                            {mainOutput}
                        </div>
                    </div>
                )}

                {/* Impression */}
                {impression && (
                    <div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 inline-block mb-2">Clinical Impression</span>
                        <div className="text-sm text-indigo-900 leading-relaxed bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 italic relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-300 rounded-l-2xl"></div>
                            "{impression}"
                        </div>
                    </div>
                )}

                {/* Scores (for CLIP models) */}
                {scores && (
                    <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-100 inline-block mb-3">Similarity Scores (Top Rankings)</span>
                        <div className="space-y-2">
                            {Object.entries(scores)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .slice(0, 5) // Show only top 5 to keep UI clean
                                .map(([label, score], idx) => {
                                    const pct = Math.round((score as number) * 100);
                                    const isTopPrediction = label.toLowerCase().replace(/[-_\s]/g, '') === predicted.toLowerCase().replace(/[-_\s]/g, '');
                                    const isTrue = label.toLowerCase().replace(/[-_\s]/g, '') === trueLabel.toLowerCase().replace(/[-_\s]/g, '');
                                    return (
                                        <div key={label} className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                                            <div className="w-5 font-black text-[10px] text-slate-400 text-center">#{idx + 1}</div>
                                            <span className={`w-32 truncate font-medium capitalize ${isTrue ? 'text-emerald-700 font-bold' : isTopPrediction ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                                                {label.replace(/_/g, ' ')}
                                            </span>
                                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${isTrue ? 'bg-emerald-500' : isTopPrediction ? 'bg-indigo-500' : 'bg-slate-400'}`}
                                                    style={{ width: `${Math.max(pct, 2)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`w-12 text-right font-mono font-bold ${isTrue ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                {(score as number).toFixed(3)}
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


// ─────── Detail View (when an image is selected) ───────
function DetailView({ sample, modality, onBack }: { sample: any; modality: Modality; onBack: () => void }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [sample]);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Skeleton className="w-32 h-10 rounded-xl" />
                <div className="flex flex-col md:flex-row gap-8">
                    <Skeleton className="w-full md:w-80 aspect-square rounded-[2rem]" />
                    <div className="flex-1 space-y-4 py-4">
                        <Skeleton className="w-48 h-6" />
                        <Skeleton className="w-3/4 h-12" />
                        <Skeleton className="w-full h-32 rounded-2xl mt-8" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Back button */}
            <button onClick={onBack} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group">
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                Back to Gallery
            </button>

            {/* Image + Ground Truth Header */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
                <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start relative z-10">
                    {/* Image */}
                    <div className="w-full md:w-80 shrink-0">
                        <div className="aspect-square bg-slate-50 rounded-[2rem] border-2 border-slate-100 overflow-hidden shadow-sm relative group p-2">
                            <img
                                src={getImagePath(modality, sample.image_id)}
                                alt={sample.image_id}
                                className="w-full h-full object-contain rounded-[1.5rem] bg-black/5"
                            />
                            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="mt-4 text-center">
                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-md">{sample.image_id}.png</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6 pt-2">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                {MODALITY_LABELS[modality]} Sample
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">{sample.image_id.replace(/_/g, ' ')}</h3>
                            <p className="text-slate-500 text-base mt-4 font-medium">Cross-model evaluation results for this specific patient scan.</p>
                        </div>

                        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full blur-2xl"></div>
                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Ground Truth Diagnosis</span>
                            </div>
                            <p className="text-emerald-950 text-3xl font-black capitalize relative z-10">{sample.true_label.replace(/_/g, ' ')}</p>
                        </div>

                        {/* Quick summary */}
                        {sample.models && (() => {
                            const total = Object.keys(sample.models).length;
                            const correct = Object.values(sample.models).filter((m: any) =>
                                m?.predicted_label?.toLowerCase().replace(/[-_\s]/g, '') === sample.true_label?.toLowerCase().replace(/[-_\s]/g, '')
                            ).length;
                            return (
                                <div className="flex items-center gap-4 pt-2 bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5">
                                    <div className={`text-4xl font-black ${correct === total ? 'text-emerald-600' : correct === 0 ? 'text-rose-600' : 'text-amber-600'}`}>
                                        {correct}<span className="text-2xl text-slate-300">/{total}</span>
                                    </div>
                                    <div className="text-sm font-bold text-slate-600 leading-tight">
                                        Models predicted <br/><span className="text-slate-400 font-medium">the diagnosis correctly</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Model Responses */}
            <div className="pt-4">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Model Responses</h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-lg">{Object.keys(sample.models || {}).length} Models Evaluated</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(sample.models || {}).map(([modelKey, modelResult]) => (
                        <ModelResponseCard
                            key={modelKey}
                            modelKey={modelKey}
                            modelResult={modelResult}
                            trueLabel={sample.true_label}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}


// ─────── Main Page ───────
export default function ResultsPage() {
    const [activeModality, setActiveModality] = useState<Modality>('CXR');
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const samples = DATA_BY_MODALITY[activeModality];

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, [activeModality]);

    const handleModalityChange = (mod: Modality) => {
        setActiveModality(mod);
        setSelectedIdx(null);
    };

    return (
        <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 pt-4 sm:pt-8 animate-fade-in">
            {/* Page Header */}
            <div className="mb-6 flex-shrink-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Image-Level Analysis
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">Diagnostic Results</h2>
                <p className="text-slate-600 text-lg font-medium">Browse clinical images and compare individual model responses.</p>
            </div>

            {/* Modality Tabs - sticky */}
            <div className="sticky top-16 lg:top-0 z-30 py-4 bg-slate-50/80 backdrop-blur-xl -mx-4 sm:-mx-8 px-4 sm:px-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border-b border-slate-200">
                <div className="flex flex-wrap gap-2">
                    {MODALITIES.map((modality) => (
                        <button
                            key={modality}
                            onClick={() => handleModalityChange(modality)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 border flex items-center gap-2 ${
                                activeModality === modality
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            {MODALITY_LABELS[modality]}
                            <span className={`text-[10px] px-2 py-0.5 rounded-md ${activeModality === modality ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {DATA_BY_MODALITY[modality].length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mt-8">
                {selectedIdx !== null && samples[selectedIdx] ? (
                    <DetailView
                        sample={samples[selectedIdx]}
                        modality={activeModality}
                        onBack={() => setSelectedIdx(null)}
                    />
                ) : (
                    /* ─── Gallery View ─── */
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                            <h3 className="text-xl font-black text-slate-800">Archive Gallery</h3>
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-lg">{samples.length} Scans</span>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="flex flex-col gap-3">
                                        <Skeleton className="w-full aspect-square rounded-[1.5rem]" />
                                        <Skeleton className="w-2/3 h-4" />
                                        <Skeleton className="w-1/2 h-3" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                                {samples.map((sample, idx) => {
                                    // Quick check how many models got it right
                                    const models = sample.models || {};
                                    const total = Object.keys(models).length;
                                    const correct = Object.values(models).filter((m: any) =>
                                        m?.predicted_label?.toLowerCase().replace(/[-_\s]/g, '') === sample.true_label?.toLowerCase().replace(/[-_\s]/g, '')
                                    ).length;

                                    return (
                                        <button
                                            key={sample.image_id}
                                            onClick={() => setSelectedIdx(idx)}
                                            className="group bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 text-left flex flex-col p-2"
                                            style={{ animationDelay: `${(idx % 10) * 50}ms` }}
                                        >
                                            {/* Image thumbnail */}
                                            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative mb-2">
                                                <img
                                                    src={getImagePath(activeModality, sample.image_id)}
                                                    alt={sample.image_id}
                                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 bg-black/5"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                {/* Correct/wrong badge */}
                                                <div className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-lg border shadow-sm backdrop-blur-md ${
                                                    correct === total ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200' :
                                                    correct === 0 ? 'bg-rose-50/90 text-rose-700 border-rose-200' :
                                                    'bg-amber-50/90 text-amber-700 border-amber-200'
                                                }`}>
                                                    {correct}/{total}
                                                </div>
                                            </div>
                                            {/* Info */}
                                            <div className="px-2 pb-2 flex-1 flex flex-col gap-1">
                                                <div className="text-[11px] font-bold text-slate-800 truncate">{sample.image_id}</div>
                                                <div className="text-[10px] text-slate-500 capitalize font-medium truncate">{sample.true_label.replace(/_/g, ' ')}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
