"use client";

import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden text-slate-900 relative font-sans">
            {/* Highly Professional, Minimal Background */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-slate-50">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar Navigation Container */}
            <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:flex ${isSidebarOpen ? 'lg:w-[280px] lg:translate-x-0' : 'lg:w-[80px] lg:translate-x-0'} overflow-visible`}>
                <div className={`flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'}`}>
                    <Navigation onNavigate={closeMobileMenu} isCollapsed={!isSidebarOpen} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
                {/* Clean, Professional Glass Header */}
                <header className="h-16 lg:h-20 border-b border-slate-200/80 bg-white/70 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        {/* Desktop Toggle */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="cursor-pointer p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 hidden lg:block transition-all"
                            title="Toggle Sidebar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        {/* Mobile Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="cursor-pointer p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden transition-all"
                            title="Open Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h2 className="text-slate-800 font-black text-sm sm:text-base tracking-widest uppercase hidden sm:block">
                            Evaluation <span className="text-indigo-600 font-black">Dashboard</span>
                        </h2>
                        <h2 className="text-slate-800 font-black text-sm tracking-widest uppercase sm:hidden">
                            Evaluation <span className="text-indigo-600">Dashboard</span>
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Professional Status Indicator */}
                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm cursor-default">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Live System</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full styled-scrollbars relative">
                    <div className="h-full p-4 sm:p-6 lg:p-10 animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
