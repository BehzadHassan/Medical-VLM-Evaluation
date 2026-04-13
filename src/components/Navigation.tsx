"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ALL_MODEL_EVALUATIONS } from '@/lib/evaluationData';

export default function Navigation() {
    const pathname = usePathname();

    const totalModels = ALL_MODEL_EVALUATIONS.length;
    const totalModalities = 3; // CXR, CT, MRI
    const totalImages = ALL_MODEL_EVALUATIONS.reduce((acc, model) => {
        return acc + model.modalities.reduce((s, m) => s + m.numImages, 0);
    }, 0) / totalModels; // Average images per model (since they share the same test set mostly)

    const tabs = [
        {
            name: 'Overview', href: '/', icon: (
                <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            )
        },
        {
            name: 'Performance Metrics', href: '/metrics', icon: (
                <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            )
        },
        {
            name: 'Image Results', href: '/results', icon: (
                <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            )
        },
    ];

    return (
        <nav className="w-64 bg-slate-950 border-r border-slate-800/50 text-slate-300 flex flex-col flex-shrink-0 relative shadow-2xl z-20">
            {/* Subtle Gradient background on nav */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />

            {/* Logo Section */}
            <div className="p-6 relative">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20 shadow-xl flex items-center justify-center border border-white/10">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight leading-none">EVAL-VLM</h1>
                        <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mt-1">Research Hub</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto styled-scrollbars-dark relative">
                {/* Main Navigation */}
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Nav Overview</p>
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                                    group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300
                                    ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-400/20'
                                        : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'}
                                `}
                            >
                                {tab.icon}
                                {tab.name}
                            </Link>
                        );
                    })}
                </div>

                {/* System Statistics */}
                <div className="space-y-4">
                    <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">System Status</p>
                    <div className="px-4 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Model</span>
                            <span className="font-mono text-indigo-400 font-bold">{totalModels}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                           <div className="bg-indigo-500 h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500">Test Samples</span>
                            <span className="font-mono text-emerald-400 font-bold">{Math.round(totalImages)}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                           <div className="bg-emerald-500 h-full w-[100%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-slate-500">Modalities</span>
                            <span className="font-mono text-amber-400 font-bold">{totalModalities}</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                           <div className="bg-amber-500 h-full w-[100%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                        </div>
                    </div>
                </div>

                {/* Active Session Card */}
                <div className="px-2">
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 rounded-2xl p-4 border border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full group-hover:bg-indigo-500/10 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Benchmarking</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-200 mb-1">Med-VLM-Suite v1.2</h4>
                            <p className="text-[10px] text-slate-500 leading-tight">All models synchronized with latest zero-shot weights.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Version Footer */}
            <div className="p-4 relative">
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-slate-500 font-mono tracking-tighter">BUILD_ID: 7FA2-9BD1</span>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md group-hover:bg-indigo-500 group-hover:text-white transition-all underline underline-offset-2 decoration-indigo-500/30 hover:decoration-white">v0.1.4</span>
                </div>
            </div>
        </nav>
    );
}

