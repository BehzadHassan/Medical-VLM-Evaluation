"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ onNavigate, isCollapsed = false }: { onNavigate?: () => void, isCollapsed?: boolean }) {
    const pathname = usePathname();

    const tabs = [
        {
            name: 'Dashboard Overview', href: '/', icon: (
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            )
        },
        {
            name: 'Performance Metrics', href: '/metrics', icon: (
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            )
        },
        {
            name: 'Diagnostic Results', href: '/results', icon: (
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            )
        },
    ];

    return (
        <nav className={`h-screen bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col flex-shrink-0 relative shadow-2xl z-30 overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            {/* Logo Section */}
            <div className={`px-6 py-8 border-b border-slate-800 relative z-10 bg-slate-950 ${isCollapsed ? 'px-0 flex justify-center' : ''}`}>
                <div className="flex flex-col gap-3">
                    <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
                        <div className="relative group">
                            <div className="relative h-12 w-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                                </svg>
                            </div>
                        </div>
                        {!isCollapsed && (
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                                MedVLM <span className="text-indigo-500">Eval</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">
                                Research Evaluation
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`flex-1 py-8 space-y-8 overflow-y-auto styled-scrollbars relative z-10 ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {/* Main Navigation */}
                <div className="space-y-2">
                    {!isCollapsed && <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Menu</p>}
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                onClick={onNavigate}
                                className={`
                                    cursor-pointer group relative flex items-center py-3.5 text-sm font-bold rounded-xl transition-all duration-200 overflow-hidden
                                    ${isCollapsed ? 'px-0 justify-center' : 'px-4'}
                                    ${isActive
                                        ? 'text-white bg-slate-900 border border-slate-800'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}
                                `}
                            >
                                {/* Active subtle indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full" />
                                )}

                                <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} flex items-center justify-center ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                                    {tab.icon}
                                </span>
                                {!isCollapsed && <span className="relative z-10 whitespace-nowrap">{tab.name}</span>}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Premium Bottom Accent */}
            <div className={`p-6 border-t border-slate-800 bg-slate-950 relative z-10 ${isCollapsed ? 'px-0 py-6 flex justify-center' : ''}`}>
                <div className={`flex items-center gap-4 group cursor-default ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-white shadow-sm border border-slate-700 flex items-center justify-center overflow-hidden">
                        <img src="/image.png" className="w-full h-full object-contain p-1.5 opacity-90 transition-opacity duration-300" alt="IBA Logo" onError={(e) => e.currentTarget.style.display='none'} />
                    </div>
                    {!isCollapsed && (
                    <div className="text-xs font-bold text-slate-300 leading-tight whitespace-nowrap">
                        Sukkur IBA <br/>
                        <span className="font-semibold text-slate-500 text-[10px] tracking-widest uppercase">Research Wing</span>
                    </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
