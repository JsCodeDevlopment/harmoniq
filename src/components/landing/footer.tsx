"use client";

import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-24 px-6 bg-[#020202] border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-transparent rounded-2xl overflow-hidden group">
            <img 
              src="/logo.png" 
              alt="Harmoniq Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-3xl font-black font-outfit tracking-[-0.05em] text-white">
            Harmoniq
          </span>
        </div>

        {/* Description Section */}
        <p className="text-zinc-500 text-lg md:text-xl leading-relaxed font-medium mb-12 max-w-xl opacity-80">
          Plataforma definitiva para músicos de louvor. Desenhada para{" "}
          <span className="text-zinc-200">
            performance, simplicidade e precisão musical.
          </span>
        </p>

        {/* Links Grid */}
        <div className="flex flex-wrap justify-center gap-10 mb-20">
          <a
            href="https://github.com/JsCodeDevlopment"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-zinc-600 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em]"
          >
            GitHub
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="https://www.linkedin.com/in/jscodedevelopment/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-zinc-600 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em]"
          >
            LinkedIn
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="mailto:jonatasilva118@gmail.com"
            className="group flex items-center gap-2 text-zinc-600 hover:text-white transition-all text-xs font-black uppercase tracking-[0.3em]"
          >
            Email
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        {/* Credits Section */}
        <div className="w-full pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
          <p className="hover:text-zinc-500 transition-colors">
            © 2024 Harmoniq. Developed by{" "}
            <span className="text-zinc-500">JsCodeDevlopment</span>.
          </p>
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-zinc-800" />
            <p className="hover:text-zinc-500 transition-colors">
              Designed for Jonatas Silva
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
