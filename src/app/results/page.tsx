"use client";

import React, { useState } from 'react';

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
        case 'chexagent': return 'Chex Agent';
        case 'llava_med': return 'LLaVA-Med v1.5';
        case 'medgemma': return 'MedGemma';
        case 'unimedclip': return 'UniMedCLIP';
        default: return modelKey;
    }
}

function getModelColor(modelKey: string) {
    switch (modelKey.toLowerCase()) {
        case 'biomedclip': return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', accent: 'bg-blue-500' };
        case 'chexagent': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', accent: 'bg-amber-500' };
        case 'llava_med': return { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-800', accent: 'bg-violet-500' };
        case 'medgemma': return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800', accent: 'bg-rose-500' };
        case 'unimedclip': return { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-800', accent: 'bg-teal-500' };
        default: return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-800', accent: 'bg-slate-500' };
    }
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
        <div className={`rounded-2xl border ${colors.border} overflow-hidden shadow-sm hover:shadow-md transition-all`}>
            {/* Model Header */}
            <div className={`${colors.bg} px-5 py-3 flex items-center justify-between border-b ${colors.border}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.accent}`}></div>
                    <span className={`font-bold text-sm ${colors.text}`}>{displayName}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Wrong'}
                </div>
            </div>

            <div className="bg-white p-5 space-y-4">
                {/* Predicted Label */}
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Predicted:</span>
                    <span className={`font-bold text-sm capitalize px-3 py-1 rounded-lg ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {predicted}
                    </span>
                </div>

                {/* Findings */}
                {mainOutput && (
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Findings / Response</div>
                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100 max-h-32 overflow-y-auto styled-scrollbars">
                            {mainOutput}
                        </p>
                    </div>
                )}

                {/* Impression */}
                {impression && (
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Impression</div>
                        <p className="text-sm text-slate-700 leading-relaxed bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 italic">
                            {impression}
                        </p>
                    </div>
                )}

                {/* Scores (for CLIP models) */}
                {scores && (
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Similarity Scores</div>
                        <div className="space-y-1.5">
                            {Object.entries(scores)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .map(([label, score]) => {
                                    const pct = Math.round((score as number) * 100);
                                    const isTopPrediction = label.toLowerCase().replace(/[-_\s]/g, '') === predicted.toLowerCase().replace(/[-_\s]/g, '');
                                    const isTrue = label.toLowerCase().replace(/[-_\s]/g, '') === trueLabel.toLowerCase().replace(/[-_\s]/g, '');
                                    return (
                                        <div key={label} className="flex items-center gap-2 text-xs">
                                            <span className={`w-36 truncate font-medium capitalize ${isTrue ? 'text-emerald-700 font-bold' : isTopPrediction ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>
                                                {label.replace(/_/g, ' ')}
                                                {isTrue && ' ●'}
                                            </span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${isTrue ? 'bg-emerald-500' : isTopPrediction ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                                    style={{ width: `${Math.max(pct, 1)}%` }}
                                                ></div>
                                            </div>
                                            <span className={`w-12 text-right font-mono ${isTrue ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
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
    return (
        <div className="space-y-6">
            {/* Back button */}
            <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
                Back to Gallery
            </button>

            {/* Image + Ground Truth Header */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                    {/* Image */}
                    <div className="w-full md:w-72 shrink-0">
                        <div className="aspect-square bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                            <img
                                src={getImagePath(modality, sample.image_id)}
                                alt={sample.image_id}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <span className="text-xs font-mono text-slate-400">{sample.image_id}.png</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-3">
                                {MODALITY_LABELS[modality]} · Sample
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{sample.image_id}</h3>
                            <p className="text-slate-500 text-sm mt-1">Cross-model evaluation results for this {MODALITY_LABELS[modality]} image</p>
                        </div>

                        <div className="bg-emerald-50 px-5 py-4 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Ground Truth Label</span>
                            </div>
                            <p className="text-emerald-950 text-xl font-bold capitalize">{sample.true_label}</p>
                        </div>

                        {/* Quick summary: how many models got it right */}
                        {sample.models && (() => {
                            const total = Object.keys(sample.models).length;
                            const correct = Object.values(sample.models).filter((m: any) =>
                                m?.predicted_label?.toLowerCase().replace(/[-_\s]/g, '') === sample.true_label?.toLowerCase().replace(/[-_\s]/g, '')
                            ).length;
                            return (
                                <div className="flex items-center gap-4 pt-2">
                                    <div className={`text-3xl font-black ${correct === total ? 'text-emerald-600' : correct === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                                        {correct}/{total}
                                    </div>
                                    <div className="text-sm text-slate-500">models predicted correctly</div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Model Responses */}
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Model Responses</h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                    <span className="text-xs font-mono text-slate-400">{Object.keys(sample.models || {}).length} Models</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

    const samples = DATA_BY_MODALITY[activeModality];

    const handleModalityChange = (mod: Modality) => {
        setActiveModality(mod);
        setSelectedIdx(null);
    };

    return (
        <div className="flex flex-col w-full max-w-[1600px] mx-auto pb-8 pt-4 sm:pt-8">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-3">
                            Image-Level Analysis
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Image Results</h2>
                        <p className="text-slate-500 mt-2 text-lg">Browse all evaluation images and compare per-image model responses.</p>
                    </div>
                </div>
            </div>

            {/* Modality Tabs - sticky */}
            <div className="sticky top-0 z-20 bg-slate-50 py-3 -mx-4 sm:-mx-8 px-4 sm:px-8 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-sm max-w-fit">
                    {MODALITIES.map((modality) => (
                        <button
                            key={modality}
                            onClick={() => handleModalityChange(modality)}
                            className={`px-8 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                                activeModality === modality
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                            }`}
                        >
                            {MODALITY_LABELS[modality]}
                            <span className="ml-2 text-xs opacity-70">({DATA_BY_MODALITY[modality].length})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">
                {selectedIdx !== null && samples[selectedIdx] ? (
                    <DetailView
                        sample={samples[selectedIdx]}
                        modality={activeModality}
                        onBack={() => setSelectedIdx(null)}
                    />
                ) : (
                    /* ─── Gallery View ─── */
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-lg font-bold text-slate-700">{MODALITY_LABELS[activeModality]} Images</h3>
                            <div className="h-px flex-1 bg-slate-200"></div>
                            <span className="text-xs font-mono text-slate-400">{samples.length} images</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                                        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 text-left flex flex-col"
                                    >
                                        {/* Image thumbnail */}
                                        <div className="aspect-square bg-slate-100 overflow-hidden relative">
                                            <img
                                                src={getImagePath(activeModality, sample.image_id)}
                                                alt={sample.image_id}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            {/* Correct/wrong badge */}
                                            <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                correct === total ? 'bg-emerald-100 text-emerald-700' :
                                                correct === 0 ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {correct}/{total}
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div className="p-3 flex-1 flex flex-col gap-1">
                                            <div className="text-xs font-bold text-slate-800 truncate">{sample.image_id}</div>
                                            <div className="text-[11px] text-slate-500 capitalize font-medium truncate">{sample.true_label}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
