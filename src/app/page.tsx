"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MODEL_METADATA } from '@/lib/data';

// Custom Skeleton Component
function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />;
}

export default function OverviewPage() {
  const models = Object.values(MODEL_METADATA);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate network/processing load to show skeleton
  useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-16 w-full animate-fade-in relative z-10">
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 px-8 sm:px-16 lg:px-20 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden isolation-auto">
         {/* Subtle Professional Glows */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-50 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[35rem] h-[35rem] bg-indigo-50 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-40 left-20 w-[35rem] h-[35rem] bg-blue-50 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Clinical Evaluation Framework
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.05]">
            Medical AI <br/>
            <span className="text-indigo-600">
              Benchmarking
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mb-10 font-medium">
            Evaluating state-of-the-art Vision-Language Models for medical imaging diagnosis. 
            Focused on accessibility, accuracy, and safe deployment in resource-constrained clinical environments.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <Link
              href="/metrics"
              className="cursor-pointer px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl shadow-md shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group border border-indigo-700"
            >
              Performance Metrics
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <Link
              href="/results"
              className="cursor-pointer px-8 py-4 bg-white text-slate-700 font-bold text-lg rounded-xl shadow-sm border border-slate-300 hover:border-slate-400 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Browse Scans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Models Evaluated', value: models.length, sub: 'SOTA Architectures' },
          { label: 'Modalities', value: '3', sub: 'CXR, CT, MRI' },
          { label: 'Project Scope', value: 'FYP', sub: 'Clinical Validation' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
            {isLoading ? (
                <div className="flex flex-col gap-3 relative z-10">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-12 w-16" />
                    <Skeleton className="h-4 w-32" />
                </div>
            ) : (
                <div className="animate-fade-in-up relative z-10" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2 pl-3">{stat.label}</div>
                    <div className="text-5xl font-black text-slate-900 tracking-tight pl-3">{stat.value}</div>
                    <div className="text-slate-500 text-sm mt-2 pl-3 font-semibold">{stat.sub}</div>
                </div>
            )}
          </div>
        ))}
      </section>

      {/* Models List */}
      <section>
        <div className="flex items-center gap-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Evaluated Models</h2>
            <div className="h-px flex-1 bg-slate-200"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model, idx) => (
            <div key={model.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                {isLoading ? (
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-20 w-full" />
                        <div className="flex gap-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-20" /></div>
                    </div>
                ) : (
                    <div className="animate-fade-in-up h-full flex flex-col relative z-10" style={{ animationDelay: `${idx * 100}ms` }}>
                        {model.bestModality && (
                        <div className="absolute top-0 right-0 z-20 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">
                            Best for {model.bestModality.split(' ').pop()}
                        </div>
                        )}
                        <div className="p-8 pb-0 flex justify-between items-start relative z-10">
                            <div>
                                <div className="text-[10px] font-bold text-indigo-700 bg-indigo-50 inline-block px-3 py-1 rounded-lg mb-3 uppercase tracking-widest border border-indigo-100">{model.role}</div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{model.name}</h3>
                            </div>
                        </div>
                        
                        <div className="px-8 py-5 flex-grow relative z-10">
                            <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">
                                {model.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {model.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                                    {tag}
                                </span>
                                ))}
                                <span className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold font-mono shadow-sm">
                                    {model.params}
                                </span>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 mt-auto flex justify-between items-center group-hover:bg-indigo-50/50 transition-colors relative z-10">
                            <div className="flex -space-x-3">
                                {/* Insights Toolkit */}
                                <div className="relative group/tooltip">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500 border border-slate-200 shadow-sm cursor-help relative z-10 hover:z-20 hover:text-indigo-600 hover:border-indigo-300 transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div className="absolute bottom-full left-0 mb-3 w-64 p-4 bg-slate-800 text-white text-sm rounded-xl shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-30 pointer-events-none transform translate-y-2 group-hover/tooltip:translate-y-0">
                                        <span className="block font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-1">Why Included</span>
                                        <span className="leading-relaxed">{model.whyInList}</span>
                                        <div className="absolute top-full left-5 -translate-x-1/2 border-[8px] border-transparent border-t-slate-800"></div>
                                    </div>
                                </div>

                                <div className="relative group/tooltip">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm cursor-help relative z-10 hover:z-20 hover:bg-indigo-100 transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div className="absolute bottom-full left-0 mb-3 w-64 p-4 bg-indigo-900 text-white text-sm rounded-xl shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-30 pointer-events-none transform translate-y-2 group-hover/tooltip:translate-y-0">
                                        <span className="block font-bold text-indigo-300 uppercase tracking-widest text-[10px] mb-1">Clinical Relevance</span>
                                        <span className="leading-relaxed">{model.relevance}</span>
                                        <div className="absolute top-full left-5 -translate-x-1/2 border-[8px] border-transparent border-t-indigo-900"></div>
                                    </div>
                                </div>
                            </div>
                        <a
                            href={model.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-white hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:shadow group/btn"
                        >
                            <span className="relative z-10">View Source</span>
                            <svg className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                        </div>
                    </div>
                )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
