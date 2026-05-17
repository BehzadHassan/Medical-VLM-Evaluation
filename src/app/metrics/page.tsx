"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    ALL_MODEL_EVALUATIONS,
    getScoresForFilter,
    getModalityResult,
    getAggregateScores,
    type ModelEvaluation,
    type ModalityResult,
} from '@/lib/evaluationData';

// Tab names: model names + "Comparison"
const MODEL_TAB_NAMES = ALL_MODEL_EVALUATIONS.map(m => m.modelName);
const TABS = ['Methodology', ...MODEL_TAB_NAMES, 'Comparison'] as const;
type TabName = typeof TABS[number];

const MODALITY_ORDER = ['CXR', 'CT', 'MRI'] as const;
const MODALITY_LABELS: Record<string, string> = {
    CXR: 'Chest X-Ray (CXR)',
    CT: 'CT Scan',
    MRI: 'MRI (Brain)',
};

// Clean, professional, clinical color palette
const MODALITY_COLORS: Record<string, { gradient: string; badge: string; accent: string; glow: string }> = {
    CXR: { gradient: 'from-slate-700 to-slate-900', badge: 'bg-slate-100 text-slate-800 border-slate-200', accent: 'slate', glow: 'shadow-slate-500/10' },
    CT: { gradient: 'from-indigo-600 to-indigo-800', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200', accent: 'indigo', glow: 'shadow-indigo-500/10' },
    MRI: { gradient: 'from-blue-600 to-blue-800', badge: 'bg-blue-50 text-blue-800 border-blue-200', accent: 'blue', glow: 'shadow-blue-500/10' },
};

function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

// ────────── Sub-component: Modality Section for a single model ──────────
function ModalitySection({ result }: { result: ModalityResult }) {
    const colors = MODALITY_COLORS[result.modality];
    const hasAuc = result.classes[0]?.aucRoc !== undefined;
    const hasTop3 = result.classes[0]?.top3Acc !== undefined;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className={`bg-gradient-to-r ${colors.gradient} p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-overlay pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <div className="text-white/80 font-bold tracking-widest text-[10px] uppercase mb-2">{MODALITY_LABELS[result.modality]}</div>
                        <div className="text-3xl font-black">{result.numClasses} classes <span className="opacity-40">·</span> {result.numImages} images</div>
                    </div>
                    <div className="text-left sm:text-right bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                        <div className="text-4xl font-black">{(result.overallAccuracy * 100).toFixed(1)}%</div>
                        <div className="text-white/80 text-[10px] font-bold uppercase tracking-wider mt-1">Overall Accuracy</div>
                    </div>
                </div>
                {/* Summary metrics bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 relative z-10">
                    {[
                        { label: 'Precision (W)', val: result.weightedAvg.precision },
                        { label: 'Recall (W)', val: result.weightedAvg.recall },
                        { label: 'F1 (W)', val: result.weightedAvg.f1 },
                        ...(result.top3Accuracy !== undefined ? [{ label: 'Top-3 Acc', val: result.top3Accuracy }] : [{ label: 'F1 (Macro)', val: result.macroAvg.f1 }]),
                    ].map((m, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 shadow-inner relative overflow-hidden">
                            <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{m.label}</div>
                            <div className="text-2xl font-black mt-1">{(m.val * 100).toFixed(1)}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Per-class table */}
            <div className="p-4 sm:p-5 flex flex-col">
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-3 flex items-center gap-2 sm:hidden">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    Swipe table to view all metrics
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm min-w-[650px]">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b-2 border-slate-200 bg-slate-50">
                                <th className="p-3 sm:p-4 pl-4 sm:pl-6 font-bold whitespace-nowrap">Class Label</th>
                                <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Count</th>
                                <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Precision</th>
                                <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Recall</th>
                                <th className="p-3 sm:p-4 font-black text-right text-indigo-600 whitespace-nowrap">F1 Score</th>
                                {hasAuc && <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">AUC-ROC</th>}
                                {hasTop3 && <th className="p-3 sm:p-4 font-bold text-right pr-4 sm:pr-6 whitespace-nowrap">Top-3 Acc</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {result.classes.map((cls) => (
                                <tr key={cls.className} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 sm:p-4 pl-4 sm:pl-6 font-semibold text-slate-700 capitalize text-sm whitespace-nowrap">{cls.className.replace(/_/g, ' ')}</td>
                                    <td className="p-3 sm:p-4 text-right text-slate-500 font-mono text-sm">{cls.n}</td>
                                    <td className="p-3 sm:p-4 text-right text-slate-600">{cls.precision.toFixed(2)}</td>
                                    <td className="p-3 sm:p-4 text-right text-slate-600">{cls.recall.toFixed(2)}</td>
                                    <td className="p-3 sm:p-4 text-right font-bold text-indigo-600 text-base">{cls.f1.toFixed(2)}</td>
                                    {cls.aucRoc !== undefined && <td className="p-3 sm:p-4 text-right text-slate-600">{cls.aucRoc.toFixed(2)}</td>}
                                    {cls.top3Acc !== undefined && <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6 text-slate-600">{cls.top3Acc.toFixed(2)}</td>}
                                </tr>
                            ))}
                            {/* Macro avg */}
                            <tr className="bg-slate-50/80 font-bold text-slate-800 border-t-2 border-slate-200">
                                <td className="p-3 sm:p-4 pl-4 sm:pl-6 flex items-center gap-2 text-xs whitespace-nowrap"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>Macro Avg</td>
                                <td className="p-3 sm:p-4 text-right font-mono text-slate-500">{result.numImages}</td>
                                <td className="p-3 sm:p-4 text-right">{result.macroAvg.precision.toFixed(2)}</td>
                                <td className="p-3 sm:p-4 text-right">{result.macroAvg.recall.toFixed(2)}</td>
                                <td className="p-3 sm:p-4 text-right text-indigo-600 text-base">{result.macroAvg.f1.toFixed(2)}</td>
                                {result.macroAvg.aucRoc !== undefined && <td className="p-3 sm:p-4 text-right">{result.macroAvg.aucRoc.toFixed(2)}</td>}
                                {result.macroAvg.top3Acc !== undefined && <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6">{result.macroAvg.top3Acc.toFixed(2)}</td>}
                            </tr>
                            {/* Weighted avg */}
                            <tr className="bg-indigo-50/50 font-black text-indigo-900 border-t border-indigo-100">
                                <td className="p-3 sm:p-4 pl-4 sm:pl-6 flex items-center gap-2 text-xs whitespace-nowrap"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>Weighted Avg</td>
                                <td className="p-3 sm:p-4 text-right font-mono text-indigo-500">{result.numImages}</td>
                                <td className="p-3 sm:p-4 text-right">{result.weightedAvg.precision.toFixed(2)}</td>
                                <td className="p-3 sm:p-4 text-right">{result.weightedAvg.recall.toFixed(2)}</td>
                                <td className="p-3 sm:p-4 text-right text-indigo-700 text-base">{result.weightedAvg.f1.toFixed(2)}</td>
                                {result.weightedAvg.aucRoc !== undefined && <td className="p-3 sm:p-4 text-right">{result.weightedAvg.aucRoc.toFixed(2)}</td>}
                                {result.weightedAvg.top3Acc !== undefined && <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6">{result.weightedAvg.top3Acc.toFixed(2)}</td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ────────── Sub-component: Comparison Tab ──────────
function ComparisonView() {
    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* Summary comparison cards per modality */}
            {MODALITY_ORDER.map((mod) => {
                const colors = MODALITY_COLORS[mod];
                const modelsWithData = ALL_MODEL_EVALUATIONS
                    .map(m => ({ model: m, result: getModalityResult(m, mod) }))
                    .filter((e): e is { model: ModelEvaluation; result: ModalityResult } => e.result !== undefined)
                    .sort((a, b) => b.result.overallAccuracy - a.result.overallAccuracy);

                if (modelsWithData.length === 0) return null;

                return (
                    <div key={mod} className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden`}>
                        <div className={`p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50`}>
                            <div>
                                <div className={`text-[10px] font-bold tracking-widest uppercase mb-1 ${colors.badge} inline-block px-3 py-1 rounded-lg border`}>{MODALITY_LABELS[mod]}</div>
                                <div className="text-xl font-bold text-slate-900 tracking-tight">Model Comparison</div>
                            </div>
                            <span className="font-semibold text-xs px-4 py-2 rounded-lg border bg-white text-slate-600 border-slate-200 shadow-sm">
                                {modelsWithData.length} Models Evaluated
                            </span>
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col">
                            <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-3 flex items-center gap-2 sm:hidden">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                Swipe table to view all metrics
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left border-collapse min-w-[650px]">
                                    <thead>
                                        <tr className="text-[10px] uppercase tracking-widest text-slate-500 border-b-2 border-slate-200 bg-slate-50">
                                            <th className="p-3 sm:p-4 pl-4 sm:pl-6 font-bold whitespace-nowrap">Rank & Model</th>
                                            <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Accuracy</th>
                                            <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Precision (W)</th>
                                            <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Recall (W)</th>
                                            <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">F1 (W)</th>
                                            <th className="p-3 sm:p-4 font-black text-right pr-4 sm:pr-6 text-indigo-600 whitespace-nowrap">F1 (Macro)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {modelsWithData.map(({ model, result }, index) => {
                                            const isTop = index === 0;
                                            return (
                                                <tr key={model.modelName} className={`hover:bg-slate-50 transition-colors ${isTop ? 'bg-indigo-50/30' : ''}`}>
                                                    <td className="p-3 sm:p-4 pl-4 sm:pl-6 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${isTop ? `bg-gradient-to-br ${colors.gradient} text-white shadow-sm` : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                                #{index + 1}
                                                            </div>
                                                            <span className={`font-semibold text-sm ${isTop ? 'text-indigo-900' : 'text-slate-700'}`}>
                                                                {model.modelName}
                                                            </span>
                                                            {isTop && <span className="px-2 py-1 rounded-md border border-indigo-200 text-[9px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 ml-1">Best</span>}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 sm:p-4 text-right">
                                                        <span className={`text-lg font-black ${isTop ? 'text-indigo-600' : 'text-slate-600'}`}>{(result.overallAccuracy * 100).toFixed(1)}%</span>
                                                    </td>
                                                    <td className="p-3 sm:p-4 text-right text-sm text-slate-600">{(result.weightedAvg.precision * 100).toFixed(1)}%</td>
                                                    <td className="p-3 sm:p-4 text-right text-sm text-slate-600">{(result.weightedAvg.recall * 100).toFixed(1)}%</td>
                                                    <td className="p-3 sm:p-4 text-right text-sm font-bold text-slate-700">{(result.weightedAvg.f1 * 100).toFixed(1)}%</td>
                                                    <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6">
                                                        <span className={`inline-flex items-center justify-center font-bold px-3 py-1.5 rounded-lg text-sm border ${isTop ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                            {(result.macroAvg.f1 * 100).toFixed(1)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bar chart for this modality */}
                        <div className="p-8 border-t border-slate-100 bg-white">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Performance Distribution (F1 Weighted)</div>
                            <div className="h-48 flex items-end gap-4 justify-center max-w-2xl mx-auto">
                                {modelsWithData.map(({ model, result }, i) => {
                                    const heightPct = Math.max(10, result.weightedAvg.f1 * 100);
                                    return (
                                        <div key={model.modelName} className="flex-1 max-w-[80px] flex flex-col justify-end items-center group relative h-full">
                                            <div className="absolute -top-10 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap shadow-md">
                                                {model.modelName}: {(result.weightedAvg.f1 * 100).toFixed(1)}%
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800"></div>
                                            </div>
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-500 border-t border-l border-r ${i === 0 ? `bg-gradient-to-t ${colors.gradient} border-transparent shadow-sm` : 'bg-slate-100 border-slate-200 group-hover:bg-slate-200'}`}
                                                style={{ height: `${heightPct}%` }}
                                            ></div>
                                            <div className={`mt-3 text-[9px] font-bold ${i===0 ? 'text-slate-800' : 'text-slate-400'} uppercase tracking-widest truncate w-full text-center`}>
                                                {model.modelName.split(' ')[0]}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Overall aggregate comparison */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden relative">
                <div className="p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/5 relative z-10 bg-slate-900">
                    <div>
                        <div className="text-[10px] font-bold tracking-widest uppercase mb-2 text-indigo-400 inline-block px-3 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10">Across All Modalities</div>
                        <div className="text-2xl font-black text-white tracking-tight">Overall Average Performance</div>
                    </div>
                </div>
                <div className="p-4 sm:p-6 flex flex-col relative z-10 bg-slate-900">
                    <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-3 flex items-center gap-2 sm:hidden">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        Swipe table to view all metrics
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                        <table className="w-full text-left border-collapse min-w-[650px]">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b-2 border-slate-800 bg-slate-900/50">
                                    <th className="p-3 sm:p-4 pl-4 sm:pl-6 font-bold whitespace-nowrap">Rank & Model</th>
                                    <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Avg Accuracy</th>
                                    <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Avg Precision</th>
                                    <th className="p-3 sm:p-4 font-bold text-right whitespace-nowrap">Avg Recall</th>
                                    <th className="p-3 sm:p-4 font-black text-right pr-4 sm:pr-6 text-indigo-400 whitespace-nowrap">Avg F1</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {[...ALL_MODEL_EVALUATIONS]
                                    .map(m => ({ model: m, scores: getAggregateScores(m) }))
                                    .sort((a, b) => b.scores.accuracy - a.scores.accuracy)
                                    .map(({ model, scores }, index) => {
                                        const isTop = index === 0;
                                        return (
                                            <tr key={model.modelName} className={`hover:bg-slate-800/80 transition-colors ${isTop ? 'bg-slate-800/50' : ''}`}>
                                                <td className="p-3 sm:p-4 pl-4 sm:pl-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${isTop ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                            #{index + 1}
                                                        </div>
                                                        <span className={`font-bold text-sm ${isTop ? 'text-white' : 'text-slate-300'}`}>{model.modelName}</span>
                                                        {isTop && <span className="px-2 py-1 rounded-md border border-indigo-400/50 text-[9px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 ml-1">Best Overall</span>}
                                                    </div>
                                                </td>
                                                <td className="p-3 sm:p-4 text-right">
                                                    <span className={`text-lg font-black ${isTop ? 'text-indigo-400' : 'text-slate-300'}`}>{(scores.accuracy * 100).toFixed(1)}%</span>
                                                </td>
                                                <td className="p-3 sm:p-4 text-right text-sm text-slate-400">{(scores.precision * 100).toFixed(1)}%</td>
                                                <td className="p-3 sm:p-4 text-right text-sm text-slate-400">{(scores.recall * 100).toFixed(1)}%</td>
                                                <td className="p-3 sm:p-4 text-right pr-4 sm:pr-6">
                                                    <span className={`inline-flex items-center justify-center font-bold px-3 py-1.5 rounded-lg text-sm border ${isTop ? 'bg-indigo-600 text-white border-transparent shadow-sm' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                                        {(scores.f1 * 100).toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ────────── Sub-component: Methodology Tab ──────────
const METRICS_INFO = [
    {
        name: 'Accuracy',
        formula: 'Correct / Total',
        what: 'Proportion of correct predictions.',
        why: 'Gives a high-level view but can be misleading with imbalanced datasets. If 90% of images are "Normal", predicting "Normal" every time gives 90% accuracy but misses all diseases.',
    },
    {
        name: 'Precision',
        formula: 'TP / (TP + FP)',
        what: 'Proportion of positive predictions that were actually correct.',
        why: 'Reduces false alarms. A false positive leads to unnecessary follow-up procedures, patient anxiety, and wasted resources.',
    },
    {
        name: 'Recall',
        formula: 'TP / (TP + FN)',
        what: 'Proportion of actual positive cases correctly identified.',
        why: 'Missing a true disease case (false negative) can be life-threatening. Recall is arguably the most critical metric in clinical AI.',
    },
    {
        name: 'F1 Score',
        formula: '2 × (P × R) / (P + R)',
        what: 'Harmonic mean of Precision and Recall.',
        why: 'Medical AI needs both high precision (few false alarms) AND high recall (few missed cases). F1 captures this trade-off.',
    },
];

function MethodologyView() {
    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10 max-w-3xl">
                    <div className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase mb-3 inline-block bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Evaluation Framework</div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Understanding the Metrics</h3>
                    <p className="text-slate-600 leading-relaxed font-medium text-lg">
                        Medical image classification requires rigorous evaluation beyond simple accuracy. Different metrics capture different failure modes — from false alarms that waste resources to missed diagnoses that endanger lives.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {METRICS_INFO.map((metric) => (
                    <div key={metric.name} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow group relative">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black border border-slate-200 text-xl">{metric.name.charAt(0)}</div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-900">{metric.name}</h4>
                                    <code className="text-[10px] font-bold font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded-md mt-1 inline-block border border-slate-200">
                                        {metric.formula}
                                    </code>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">What it is</p>
                                    <p className="text-sm text-slate-700 font-medium">{metric.what}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className={`text-[10px] font-bold uppercase tracking-widest text-indigo-700 mb-1 flex items-center gap-2`}>
                                        Clinical Impact
                                    </p>
                                    <p className="text-sm text-slate-600 font-medium">{metric.why}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ────────── Main Page ──────────
export default function MetricsDashboard() {
    const [activeTab, setActiveTab] = useState<TabName>(TABS[0]);
    const [isLoading, setIsLoading] = useState(true);

    // Skeleton simulation
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const activeModel = useMemo(() => {
        if (activeTab === 'Comparison' || activeTab === 'Methodology') return null;
        return ALL_MODEL_EVALUATIONS.find(m => m.modelName === activeTab) ?? null;
    }, [activeTab]);

    const aggScores = activeModel ? getAggregateScores(activeModel) : null;

    return (
        <div className="flex flex-col w-full max-w-7xl mx-auto pb-12 animate-fade-in relative z-10">
            <div className="mb-8 flex-shrink-0 pt-4 sm:pt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Macro-Level Evaluation
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">Performance Metrics</h2>
                <p className="text-slate-600 text-lg font-medium max-w-2xl">Detailed per-model evaluation results and cross-model comparison.</p>
            </div>

            {/* Model Tabs - clean and minimal */}
            <div className="sticky top-16 lg:top-0 z-30 py-4 bg-slate-50/90 backdrop-blur-md -mx-4 sm:-mx-8 px-4 sm:px-8 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)] border-b border-slate-200">
                <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer px-4 py-2 rounded-lg font-bold text-sm tracking-wide transition-colors border ${
                                activeTab === tab
                                    ? tab === 'Comparison'
                                        ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                                        : tab === 'Methodology'
                                            ? 'bg-white text-indigo-700 border-indigo-200 shadow-sm'
                                            : 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-8 space-y-8 relative z-10">
                {isLoading ? (
                    <div className="space-y-8">
                        <Skeleton className="w-full h-48 sm:h-56 rounded-2xl bg-white shadow-sm" />
                        <Skeleton className="w-full h-[500px] rounded-2xl bg-white shadow-sm" />
                    </div>
                ) : (
                    <>
                        {/* ───── Model Detail View ───── */}
                        {activeModel && aggScores && (
                            <div className="animate-fade-in-up">
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 relative overflow-hidden mb-8 transition-shadow">
                                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                                        <div>
                                            <div className="text-[10px] font-bold text-indigo-700 tracking-widest uppercase mb-3 bg-indigo-50 inline-block px-3 py-1 rounded-lg border border-indigo-100">{activeModel.modelName}</div>
                                            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">Average Across Modalities</div>
                                            <div className="flex flex-wrap gap-2">
                                                {activeModel.modalities.map(m => (
                                                    <span key={m.modality} className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                        {m.modality}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
                                            {[
                                                { label: 'Accuracy', val: aggScores.accuracy },
                                                { label: 'Precision', val: aggScores.precision },
                                                { label: 'Recall', val: aggScores.recall },
                                                { label: 'F1 Score', val: aggScores.f1 },
                                            ].map((m, i) => (
                                                <div key={i} className={`bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-center min-w-[120px] shadow-sm relative overflow-hidden`}>
                                                    <div className="relative z-10">
                                                        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{m.label}</div>
                                                        <div className="text-2xl font-black text-slate-900 mt-1">{(m.val * 100).toFixed(1)}%</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {activeModel.modalities.map((result) => (
                                        <ModalitySection key={result.modality} result={result} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ───── Comparison Tab ───── */}
                        {activeTab === 'Comparison' && <ComparisonView />}

                        {/* ───── Methodology Tab ───── */}
                        {activeTab === 'Methodology' && <MethodologyView />}
                    </>
                )}
            </div>
        </div>
    );
}
