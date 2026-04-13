"use client";

import React, { useState, useMemo } from 'react';
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

// Color palette for the modality cards
const MODALITY_COLORS: Record<string, { gradient: string; badge: string; accent: string }> = {
    CXR: { gradient: 'from-indigo-600 to-violet-700', badge: 'bg-indigo-100 text-indigo-700', accent: 'indigo' },
    CT: { gradient: 'from-emerald-600 to-teal-700', badge: 'bg-emerald-100 text-emerald-700', accent: 'emerald' },
    MRI: { gradient: 'from-rose-600 to-pink-700', badge: 'bg-rose-100 text-rose-700', accent: 'rose' },
};

// ────────── Sub-component: Modality Section for a single model ──────────
function ModalitySection({ result }: { result: ModalityResult }) {
    const colors = MODALITY_COLORS[result.modality];
    const hasAuc = result.classes[0]?.aucRoc !== undefined;
    const hasTop3 = result.classes[0]?.top3Acc !== undefined;

    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-white/70 font-bold tracking-widest text-xs uppercase mb-1">{MODALITY_LABELS[result.modality]}</div>
                        <div className="text-2xl font-black">{result.numClasses} classes · {result.numImages} images</div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black">{(result.overallAccuracy * 100).toFixed(1)}%</div>
                        <div className="text-white/70 text-sm font-medium">Overall Accuracy</div>
                    </div>
                </div>
                {/* Summary metrics bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                    {[
                        { label: 'Precision (W)', val: result.weightedAvg.precision },
                        { label: 'Recall (W)', val: result.weightedAvg.recall },
                        { label: 'F1 (W)', val: result.weightedAvg.f1 },
                        ...(result.top3Accuracy !== undefined ? [{ label: 'Top-3 Acc', val: result.top3Accuracy }] : [{ label: 'F1 (Macro)', val: result.macroAvg.f1 }]),
                    ].map((m, i) => (
                        <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
                            <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{m.label}</div>
                            <div className="text-xl font-black mt-0.5">{(m.val * 100).toFixed(1)}%</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Per-class table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                    <thead>
                        <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/50">
                            <th className="p-3 pl-5 font-bold">Class</th>
                            <th className="p-3 font-bold text-right">N</th>
                            <th className="p-3 font-bold text-right">Precision</th>
                            <th className="p-3 font-bold text-right">Recall</th>
                            <th className="p-3 font-bold text-right">F1</th>
                            {hasAuc && <th className="p-3 font-bold text-right">AUC-ROC</th>}
                            {hasTop3 && <th className="p-3 font-bold text-right pr-5">Top-3 Acc</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {result.classes.map((cls) => (
                            <tr key={cls.className} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 pl-5 font-medium text-slate-700">{cls.className}</td>
                                <td className="p-3 text-right text-slate-500">{cls.n}</td>
                                <td className="p-3 text-right text-slate-600">{cls.precision.toFixed(2)}</td>
                                <td className="p-3 text-right text-slate-600">{cls.recall.toFixed(2)}</td>
                                <td className="p-3 text-right font-semibold text-slate-700">{cls.f1.toFixed(2)}</td>
                                {cls.aucRoc !== undefined && <td className="p-3 text-right text-slate-600">{cls.aucRoc.toFixed(2)}</td>}
                                {cls.top3Acc !== undefined && <td className="p-3 text-right pr-5 text-slate-600">{cls.top3Acc.toFixed(2)}</td>}
                            </tr>
                        ))}
                        {/* Macro avg */}
                        <tr className="bg-slate-50 font-bold text-slate-800 border-t-2 border-slate-200">
                            <td className="p-3 pl-5">Macro Avg</td>
                            <td className="p-3 text-right">{result.numImages}</td>
                            <td className="p-3 text-right">{result.macroAvg.precision.toFixed(2)}</td>
                            <td className="p-3 text-right">{result.macroAvg.recall.toFixed(2)}</td>
                            <td className="p-3 text-right">{result.macroAvg.f1.toFixed(2)}</td>
                            {result.macroAvg.aucRoc !== undefined && <td className="p-3 text-right">{result.macroAvg.aucRoc.toFixed(2)}</td>}
                            {result.macroAvg.top3Acc !== undefined && <td className="p-3 text-right pr-5">{result.macroAvg.top3Acc.toFixed(2)}</td>}
                        </tr>
                        {/* Weighted avg */}
                        <tr className="bg-slate-50 font-bold text-slate-700">
                            <td className="p-3 pl-5">Weighted Avg</td>
                            <td className="p-3 text-right">{result.numImages}</td>
                            <td className="p-3 text-right">{result.weightedAvg.precision.toFixed(2)}</td>
                            <td className="p-3 text-right">{result.weightedAvg.recall.toFixed(2)}</td>
                            <td className="p-3 text-right">{result.weightedAvg.f1.toFixed(2)}</td>
                            {result.weightedAvg.aucRoc !== undefined && <td className="p-3 text-right">{result.weightedAvg.aucRoc.toFixed(2)}</td>}
                            {result.weightedAvg.top3Acc !== undefined && <td className="p-3 text-right pr-5">{result.weightedAvg.top3Acc.toFixed(2)}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ────────── Sub-component: Comparison Tab ──────────
function ComparisonView() {
    return (
        <div className="space-y-8">
            {/* Summary comparison cards per modality */}
            {MODALITY_ORDER.map((mod) => {
                const colors = MODALITY_COLORS[mod];
                const modelsWithData = ALL_MODEL_EVALUATIONS
                    .map(m => ({ model: m, result: getModalityResult(m, mod) }))
                    .filter((e): e is { model: ModelEvaluation; result: ModalityResult } => e.result !== undefined)
                    .sort((a, b) => b.result.overallAccuracy - a.result.overallAccuracy);

                if (modelsWithData.length === 0) return null;

                return (
                    <div key={mod} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className={`bg-gradient-to-r ${colors.gradient} p-5 text-white flex items-center justify-between`}>
                            <div>
                                <div className="text-white/70 font-bold tracking-widest text-xs uppercase mb-0.5">{MODALITY_LABELS[mod]}</div>
                                <div className="text-xl font-black">Model Comparison</div>
                            </div>
                            <span className={`${colors.badge} font-bold text-xs px-3 py-1 rounded-full`}>
                                {modelsWithData.length} Models
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/50">
                                        <th className="p-4 pl-6 font-bold">Rank & Model</th>
                                        <th className="p-4 font-bold text-right">Accuracy</th>
                                        <th className="p-4 font-bold text-right">Precision (W)</th>
                                        <th className="p-4 font-bold text-right">Recall (W)</th>
                                        <th className="p-4 font-bold text-right">F1 (W)</th>
                                        <th className="p-4 font-bold text-right pr-6">F1 (Macro)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {modelsWithData.map(({ model, result }, index) => {
                                        const isTop = index === 0;
                                        return (
                                            <tr key={model.modelName} className={`hover:bg-slate-50 transition-colors ${isTop ? 'bg-indigo-50/30' : ''}`}>
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] ${isTop ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-500'}`}>
                                                            #{index + 1}
                                                        </div>
                                                        <span className={`font-bold ${isTop ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                            {model.modelName}
                                                        </span>
                                                        {isTop && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700">Best</span>}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={`text-lg font-bold ${isTop ? 'text-indigo-700' : 'text-slate-700'}`}>{(result.overallAccuracy * 100).toFixed(1)}%</span>
                                                </td>
                                                <td className="p-4 text-right font-medium text-slate-600">{(result.weightedAvg.precision * 100).toFixed(1)}%</td>
                                                <td className="p-4 text-right font-medium text-slate-600">{(result.weightedAvg.recall * 100).toFixed(1)}%</td>
                                                <td className="p-4 text-right font-medium text-slate-600">{(result.weightedAvg.f1 * 100).toFixed(1)}%</td>
                                                <td className="p-4 text-right pr-6">
                                                    <span className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-lg text-sm">
                                                        {(result.macroAvg.f1 * 100).toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Bar chart for this modality */}
                        <div className="p-6 border-t border-slate-100">
                            <div className="text-sm font-bold text-slate-600 mb-4">F1 Score Distribution</div>
                            <div className="h-36 flex items-end gap-3">
                                {modelsWithData.map(({ model, result }, i) => {
                                    const heightPct = Math.max(15, result.weightedAvg.f1 * 100);
                                    return (
                                        <div key={model.modelName} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                                            <div className="absolute -top-9 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                                                {model.modelName}: {(result.weightedAvg.f1 * 100).toFixed(1)}%
                                            </div>
                                            <div
                                                className={`w-full max-w-[72px] rounded-t-xl transition-all duration-700 ${i === 0 ? `bg-gradient-to-t ${colors.gradient}` : 'bg-slate-200 group-hover:bg-slate-300'}`}
                                                style={{ height: `${heightPct}%` }}
                                            ></div>
                                            <div className="mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate w-full text-center">
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
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 text-white">
                    <div className="text-white/60 font-bold tracking-widest text-xs uppercase mb-0.5">Across All Modalities</div>
                    <div className="text-xl font-black">Overall Average Performance</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/50">
                                <th className="p-4 pl-6 font-bold">Rank & Model</th>
                                <th className="p-4 font-bold text-right">Modalities</th>
                                <th className="p-4 font-bold text-right">Avg Accuracy</th>
                                <th className="p-4 font-bold text-right">Avg Precision</th>
                                <th className="p-4 font-bold text-right">Avg Recall</th>
                                <th className="p-4 font-bold text-right pr-6">Avg F1</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[...ALL_MODEL_EVALUATIONS]
                                .map(m => ({ model: m, scores: getAggregateScores(m) }))
                                .sort((a, b) => b.scores.accuracy - a.scores.accuracy)
                                .map(({ model, scores }, index) => {
                                    const isTop = index === 0;
                                    return (
                                        <tr key={model.modelName} className={`hover:bg-slate-50 transition-colors ${isTop ? 'bg-indigo-50/30' : ''}`}>
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] ${isTop ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'bg-slate-100 text-slate-500'}`}>
                                                        #{index + 1}
                                                    </div>
                                                    <span className={`font-bold ${isTop ? 'text-indigo-900' : 'text-slate-800'}`}>{model.modelName}</span>
                                                    {isTop && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700">Best</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex gap-1 justify-end">
                                                    {model.modalities.map(m => (
                                                        <span key={m.modality} className={`${MODALITY_COLORS[m.modality].badge} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                                                            {m.modality}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`text-lg font-bold ${isTop ? 'text-indigo-700' : 'text-slate-700'}`}>{(scores.accuracy * 100).toFixed(1)}%</span>
                                            </td>
                                            <td className="p-4 text-right font-medium text-slate-600">{(scores.precision * 100).toFixed(1)}%</td>
                                            <td className="p-4 text-right font-medium text-slate-600">{(scores.recall * 100).toFixed(1)}%</td>
                                            <td className="p-4 text-right pr-6">
                                                <span className="inline-flex items-center justify-center bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-lg text-sm">
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
    );
}

// ────────── Sub-component: Methodology Tab ──────────
const METRICS_INFO = [
    {
        name: 'Accuracy',
        formula: 'Correct Predictions / Total Predictions',
        icon: '🎯',
        color: 'indigo',
        what: 'Accuracy measures the overall proportion of correct predictions out of all predictions made by the model.',
        why: 'In medical imaging, accuracy gives a high-level view of how often the model gets the diagnosis right. However, it can be misleading with imbalanced datasets — for example, if 90% of images are "Normal", a model that always predicts "Normal" would have 90% accuracy but miss every disease case.',
        limitation: 'Not reliable alone for clinical evaluation where class imbalance is common (e.g., rare diseases). Must be paired with Precision and Recall.',
    },
    {
        name: 'Precision',
        formula: 'True Positives / (True Positives + False Positives)',
        icon: '🔬',
        color: 'emerald',
        what: 'Precision measures what proportion of the model\'s positive predictions were actually correct. High precision means fewer false alarms.',
        why: 'In clinical settings, a false positive (e.g., diagnosing cancer when there is none) leads to unnecessary follow-up procedures, patient anxiety, and wasted medical resources. High precision reduces these harmful false alarms.',
        limitation: 'A model can achieve high precision by being very conservative — only predicting positive when extremely confident — but this may miss real cases (low recall).',
    },
    {
        name: 'Recall (Sensitivity)',
        formula: 'True Positives / (True Positives + False Negatives)',
        icon: '🩺',
        color: 'rose',
        what: 'Recall measures the proportion of actual positive cases that the model correctly identified. High recall means fewer missed diagnoses.',
        why: 'In medical diagnosis, missing a true disease case (false negative) can be life-threatening. A patient with undetected tuberculosis or cancer could miss critical treatment windows. Recall is arguably the most important metric in clinical AI — we cannot afford to miss real cases.',
        limitation: 'Maximizing recall alone could lead to predicting everything as positive, which would destroy precision. The balance is captured by F1.',
    },
    {
        name: 'F1 Score',
        formula: '2 × (Precision × Recall) / (Precision + Recall)',
        icon: '⚖️',
        color: 'violet',
        what: 'The F1 Score is the harmonic mean of Precision and Recall. It penalizes models that sacrifice one for the other, rewarding balanced performance.',
        why: 'Medical AI needs both high precision (few false alarms) AND high recall (few missed cases). F1 captures this trade-off in a single number. A model with 95% precision but 30% recall would have a low F1, correctly flagging that it misses too many real cases despite being precise when it does predict.',
        limitation: 'Treats precision and recall as equally important. In some clinical scenarios, recall may deserve more weight (use F-beta score instead).',
    },
    {
        name: 'AUC-ROC',
        formula: 'Area Under the Receiver Operating Characteristic Curve',
        icon: '📈',
        color: 'blue',
        what: 'AUC-ROC measures the model\'s ability to distinguish between classes across all possible prediction thresholds. A score of 1.0 means perfect separation; 0.5 means random guessing.',
        why: 'CLIP-based models (BioMedCLIP, UniMedCLIP) output similarity scores rather than binary predictions. AUC-ROC evaluates how well these scores can separate the correct class from incorrect ones regardless of the chosen threshold. This is essential because different deployment settings may require different confidence thresholds.',
        limitation: 'Can be overly optimistic with highly imbalanced datasets. Complemented by Top-3 Accuracy for practical usability.',
        modelsUsed: 'BioMedCLIP, UniMedCLIP',
    },
    {
        name: 'Top-3 Accuracy (RCR)',
        formula: 'Correct label appears in top 3 ranked predictions / Total',
        icon: '🏅',
        color: 'amber',
        what: 'Top-3 Accuracy (also called Rank-based Correct Retrieval) checks whether the correct diagnosis appears among the model\'s top 3 predictions, not just the top 1.',
        why: 'Zero-shot CLIP models rank all possible labels by similarity. The top-1 prediction may not always be correct, but if the correct answer is in the top 3, a radiologist can quickly identify it from a short list. This metric measures practical clinical utility — can the model narrow the differential diagnosis to a manageable shortlist?',
        limitation: 'Only meaningful for ranking-based models. Generative models (MedGemma, LLaVA-Med, ChexAgent) produce free-text outputs and are evaluated differently.',
        modelsUsed: 'BioMedCLIP, UniMedCLIP',
    },
];

const AVERAGE_TYPES = [
    {
        name: 'Macro Average',
        icon: '📊',
        description: 'Computes the metric independently for each class and then takes the unweighted mean. Every class contributes equally regardless of its size.',
        why: 'Ensures rare diseases (small classes) are given equal importance as common conditions. A model that performs well on common diagnoses but fails on rare ones will have a low macro average, correctly flagging the issue.',
    },
    {
        name: 'Weighted Average',
        icon: '⚖️',
        description: 'Computes the metric for each class and takes a weighted mean, where each class\'s weight is proportional to its number of samples.',
        why: 'Reflects real-world performance where the model will encounter common conditions more frequently. Useful for understanding overall clinical throughput accuracy.',
    },
];

function MethodologyView() {
    return (
        <div className="space-y-8">
            {/* Intro */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-bl-full"></div>
                <div className="relative z-10">
                    <div className="text-slate-400 font-bold tracking-widest text-xs uppercase mb-2">Evaluation Framework</div>
                    <h3 className="text-3xl font-black tracking-tight mb-3">Why These Metrics?</h3>
                    <p className="text-slate-300 leading-relaxed max-w-3xl">
                        Medical image classification requires rigorous evaluation beyond simple accuracy. Different metrics capture different failure modes — 
                        from false alarms that waste resources to missed diagnoses that endanger lives. Below is a detailed explanation of each metric 
                        we use and why it matters for evaluating Vision-Language Models in clinical settings.
                    </p>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {METRICS_INFO.map((metric) => (
                    <div key={metric.name} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-3xl">{metric.icon}</div>
                                <div>
                                    <h4 className="text-xl font-black text-slate-800 tracking-tight">{metric.name}</h4>
                                    <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                                        {metric.formula}
                                    </code>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">What It Measures</div>
                                    <p className="text-sm text-slate-700 leading-relaxed">{metric.what}</p>
                                </div>
                                <div className={`bg-emerald-50 border border-emerald-100 rounded-xl p-4`}>
                                    <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">Why It Matters for Medical AI</div>
                                    <p className="text-sm text-emerald-900 leading-relaxed">{metric.why}</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">⚠ Limitation</div>
                                    <p className="text-sm text-amber-900 leading-relaxed">{metric.limitation}</p>
                                </div>
                                {'modelsUsed' in metric && metric.modelsUsed && (
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Used For:</span>
                                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">{metric.modelsUsed}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Averaging Methods */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Macro vs. Weighted Averaging</h3>
                    <p className="text-slate-500 text-sm mt-1">How we aggregate per-class metrics into a single score.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {AVERAGE_TYPES.map((avg) => (
                        <div key={avg.name} className="p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{avg.icon}</span>
                                <h4 className="text-lg font-bold text-slate-800">{avg.name}</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">{avg.description}</p>
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                                <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-1">Why We Use It</div>
                                <p className="text-sm text-indigo-900 leading-relaxed">{avg.why}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Model-Type Metric Mapping */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Which Metrics Apply to Which Models?</h3>
                    <p className="text-slate-500 text-sm mt-1">Different model architectures produce different output types, requiring different evaluation strategies.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200 bg-slate-50/50">
                                <th className="p-4 pl-6 font-bold">Model Type</th>
                                <th className="p-4 font-bold">Models</th>
                                <th className="p-4 font-bold">Output Type</th>
                                <th className="p-4 font-bold pr-6">Metrics Used</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 pl-6 font-bold text-slate-800">Zero-Shot CLIP</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">BioMedCLIP</span>
                                        <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">UniMedCLIP</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">Similarity scores per label</td>
                                <td className="p-4 pr-6 text-sm text-slate-600">Accuracy, Precision, Recall, F1, <strong>AUC-ROC</strong>, <strong>Top-3 Acc</strong></td>
                            </tr>
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 pl-6 font-bold text-slate-800">Generative VLM</td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-xs font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">MedGemma</span>
                                        <span className="text-xs font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">LLaVA-Med v1.5</span>
                                        <span className="text-xs font-bold bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">ChexAgent</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">Free-text classification label</td>
                                <td className="p-4 pr-6 text-sm text-slate-600">Accuracy, Precision, Recall, F1</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ────────── Main Page ──────────
export default function MetricsDashboard() {
    const [activeTab, setActiveTab] = useState<TabName>(TABS[0]);

    // Find active model data (null if on Comparison tab)
    const activeModel = useMemo(() => {
        if (activeTab === 'Comparison' || activeTab === 'Methodology') return null;
        return ALL_MODEL_EVALUATIONS.find(m => m.modelName === activeTab) ?? null;
    }, [activeTab]);

    const aggScores = activeModel ? getAggregateScores(activeModel) : null;

    return (
        <div className="flex flex-col w-full max-w-[1600px] mx-auto pb-8">
            <div className="mb-6 flex-shrink-0 pt-4 sm:pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-3">
                            Macro-Level Evaluation
                        </div>
                        <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">Performance Metrics</h2>
                        <p className="text-slate-500 mt-2 text-lg">Detailed per-model evaluation results and cross-model comparison.</p>
                    </div>
                </div>
            </div>

            {/* Model Tabs - sticky */}
            <div className="sticky top-0 z-20 bg-slate-50 py-3 -mx-4 sm:-mx-8 px-4 sm:px-8 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]">
            <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-sm">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${
                            activeTab === tab
                                ? tab === 'Comparison'
                                    ? 'bg-slate-800 text-white shadow-md shadow-slate-500/20'
                                    : tab === 'Methodology'
                                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            </div>

            <div className="space-y-8 pb-12">
                {/* ───── Model Detail View ───── */}
                {activeModel && aggScores && (
                    <>
                        {/* Model summary header card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-bl-full z-0 transition-transform group-hover:scale-110 duration-700"></div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="text-indigo-200 font-bold tracking-widest text-xs uppercase mb-1">{activeModel.modelName}</div>
                                    <div className="text-3xl font-black tracking-tight">Average Across {activeModel.modalities.length} Modalities</div>
                                    <div className="flex gap-2 mt-3">
                                        {activeModel.modalities.map(m => (
                                            <span key={m.modality} className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                                                {m.modality}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Accuracy', val: aggScores.accuracy },
                                        { label: 'Precision', val: aggScores.precision },
                                        { label: 'Recall', val: aggScores.recall },
                                        { label: 'F1 Score', val: aggScores.f1 },
                                    ].map((m, i) => (
                                        <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[100px]">
                                            <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{m.label}</div>
                                            <div className="text-2xl font-black mt-0.5">{(m.val * 100).toFixed(1)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modality sections */}
                        {activeModel.modalities.map((result) => (
                            <ModalitySection key={result.modality} result={result} />
                        ))}
                    </>
                )}

                {/* ───── Comparison Tab ───── */}
                {activeTab === 'Comparison' && <ComparisonView />}

                {/* ───── Methodology Tab ───── */}
                {activeTab === 'Methodology' && <MethodologyView />}
            </div>
        </div>
    );
}
