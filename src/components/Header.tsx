import React from 'react';

export default function Header() {
    return (
        <header className="w-full py-6 border-b border-gray-200 bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Vision-Language Model Research Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Comparative Analysis of Multi-Modal Query Responses
                </p>
            </div>
        </header>
    );
}
