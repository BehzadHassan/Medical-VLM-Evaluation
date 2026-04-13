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
        <nav className="w-64 h-screen sticky top-0 bg-[#0a0c10] border-r border-white/5 text-slate-300 flex flex-col flex-shrink-0 relative shadow-2xl z-20 overflow-hidden">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]" />
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            {/* Logo Section - Reduced padding */}
            <div className="px-8 py-6 relative">
                <div className="flex flex-col gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative h-10 w-10 rounded-xl bg-[#0a0c10] border border-white/10 flex items-center justify-center shadow-2xl">
                            <svg className="w-5 h-5 text-indigo-400 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-base font-black text-white tracking-[0.1em] uppercase leading-tight">
                            MedVLM <span className="text-indigo-500">Eval</span>
                        </h1>
                        <p className="text-[8px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1 flex items-center gap-1.5 single-line">
                             <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                             Research Archive
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto styled-scrollbars-dark relative z-10">
                {/* Main Navigation */}
                <div className="space-y-2">
                    <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Explore</p>
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                                    group relative flex items-center px-4 py-3.5 text-xs font-bold rounded-xl transition-all duration-500
                                    ${isActive
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-200'}
                                `}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent border-l-2 border-indigo-500 rounded-r-xl" />
                                )}
                                <span className={`relative z-10 mr-3 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                    {tab.icon}
                                </span>
                                <span className="relative z-10 tracking-wide font-black uppercase text-[10px]">{tab.name}</span>
                                
                                {!isActive && (
                                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] rounded-xl transition-colors duration-500" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Archive Statistics - Premium Badges */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Snapshot</p>
                        <div className="h-px flex-1 bg-slate-800/50 ml-4"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2.5 px-2">
                        {[
                            { label: 'Models', value: totalModels, icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z', color: 'indigo' },
                            { label: 'Samples', value: Math.round(totalImages), icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4  8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4', color: 'emerald' },
                            { label: 'Scope', value: `${totalModalities} Modes`, icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', color: 'amber' }
                        ].map((stat) => (
                            <div key={stat.label} className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/10 p-3 rounded-xl transition-all duration-500">
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-lg bg-${stat.color}-500/5 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-400 group-hover:scale-105 transition-transform duration-500`}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</span>
                                        <span className="text-xs font-mono text-slate-100 font-black">{stat.value}</span>
                                    </div>
                                </div>
                                {/* Subtle Glow on hover */}
                                <div className={`absolute inset-0 bg-${stat.color}-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Bottom Accent */}
            <div className="p-6">
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rounded-full" />
            </div>
        </nav>
    );
}

