"use client";

import React, { useState, useRef } from 'react';

interface SearchInputProps {
  onSearch: (text: string, image: File | null) => void;
  isLoading: boolean;
}

export default function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !selectedImage) return;
    onSearch(query, selectedImage);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 relative z-20">
      <div className="relative group">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe the medical image or ask for a diagnosis overview..."
          className="w-full h-40 p-5 pb-16 bg-white/80 backdrop-blur-md border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none text-slate-800 placeholder-slate-400 transition-all shadow-sm focus:shadow-md outline-none text-lg font-serif"
          disabled={isLoading}
        />
        
        {/* Absolute positioned action bar inside textarea */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className={`cursor-pointer group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Upload Medical Image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </label>
                
                {selectedImage && (
                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-left-2">
                        <div className="w-6 h-6 rounded bg-indigo-200 flex items-center justify-center text-[10px] filter saturate-50">🖼️</div>
                        <span className="text-xs font-semibold text-indigo-900 truncate max-w-[120px] font-mono">
                            {selectedImage.name}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedImage(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={(!query.trim() && !selectedImage) || isLoading}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                    (!query.trim() && !selectedImage) || isLoading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] hover:-translate-y-0.5'
                }`}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inferencing...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        Execute Query
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                )}
            </button>
        </div>
      </div>
    </form>
  );
}
