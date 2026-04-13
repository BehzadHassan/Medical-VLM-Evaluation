import React from 'react';
import Link from 'next/link';
import { MODEL_METADATA } from '@/lib/data';

export default function OverviewPage() {
  const models = Object.values(MODEL_METADATA);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 pt-4 sm:pt-8">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-8 sm:px-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden isolation-auto">
         {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
          <div className="absolute top-12 -left-24 w-[24rem] h-[24rem] bg-slate-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-32 w-[28rem] h-[28rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm text-slate-800 text-xs font-black tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Clinical Evaluation Framework
          </div>
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Medical VLM <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-slate-700 to-indigo-700 drop-shadow-sm">
              Benchmarking
            </span>
          </h1>
          <p className="text-xl text-slate-700 leading-relaxed max-w-2xl mb-10 font-medium">
            Evaluating state-of-the-art Vision-Language Models for medical imaging diagnosis. 
            Focused on resource-constrained deployment environments in Pakistan.
          </p>
          
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/results"
              className="px-8 py-4 bg-slate-900 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3"
            >
              View Results
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <Link
              href="/dataset"
              className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 font-bold text-lg rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3 group"
            >
              <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
              Explore Dataset
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Models Evaluated', value: models.length, sub: 'SOTA Medical Architectures', color: 'blue' },
          { label: 'Modalities', value: '3', sub: 'CXR, CT Scan, MRI', color: 'fuchsia' },
          { label: 'Evaluation Goal', value: 'FYP', sub: 'Final Year Research Project', color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-slate-300 transition-all duration-300">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-50 rounded-full blur-2xl -z-10 group-hover:bg-${stat.color}-100 transition-colors duration-500`}></div>
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-${stat.color}-400 to-${stat.color}-600`}></div>
            <div className={`text-${stat.color}-600 text-xs font-black uppercase tracking-widest mb-3 pl-2`}>{stat.label}</div>
            <div className="text-5xl font-black text-slate-800 tracking-tight pl-2">{stat.value}</div>
            <div className="text-slate-500 text-sm mt-3 pl-2 font-medium">{stat.sub}</div>
          </div>
        ))}
      </section>

      {/* Models List */}
      <section>
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Participating Models</h2>
            <div className="h-px flex-1 bg-slate-200 ml-6"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col h-full">
                <div className="p-6 pb-0 flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded mb-3 uppercase tracking-widest">{model.role}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{model.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-mono font-medium">
                        {model.params}
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4 flex-grow">
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {model.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-medium text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl mt-auto flex justify-between items-center group-hover:bg-slate-100/50 transition-colors">
                    <div className="flex -space-x-2">
                        {/* Custom Tooltip 1 */}
                        <div className="relative group/tooltip">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 border-2 border-white shadow-sm cursor-help relative z-10 hover:z-20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-30 pointer-events-none">
                                <span className="block font-bold text-slate-300 mb-0.5">Why Included:</span>
                                {model.whyInList}
                                <div className="absolute top-full left-4 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                        </div>

                        {/* Custom Tooltip 2 */}
                        <div className="relative group/tooltip">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 border-2 border-white shadow-sm cursor-help relative z-10 hover:z-20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-30 pointer-events-none">
                                <span className="block font-bold text-indigo-300 mb-0.5">Relevance to Pakistan:</span>
                                {model.relevance}
                                <div className="absolute top-full left-4 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                            </div>
                        </div>
                    </div>
                  <a
                    href={model.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    View Source
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 pl-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </a>
                </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
