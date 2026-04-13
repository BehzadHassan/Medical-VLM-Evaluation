import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "Medical VLM Evaluation",
  description: "Comparative Analysis of Vision-Language Models",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {/* Background Decorative Blur gradients */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-50/50 blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-50/50 blur-[120px]" />
        </div>
        
        <div className="flex min-h-screen">
          <Navigation />
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <header className="h-16 border-b border-transparent bg-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)] backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
              <h2 className="text-slate-800 font-semibold text-lg tracking-tight uppercase tracking-widest text-[10px]">Evaluation Dashboard</h2>
              <div className="flex items-center space-x-4">
                <div className="h-9 p-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm shadow-indigo-200">
                    <div className="h-full w-full px-3 rounded-full bg-white flex items-center justify-center text-slate-800 font-bold text-xs">
                        Admin
                    </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-auto px-4 sm:px-8 pb-4 sm:pb-8 styled-scrollbars">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
