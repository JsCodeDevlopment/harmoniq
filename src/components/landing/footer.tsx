"use client";

import { Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/5">
            <Music className="w-4 h-4 text-yellow-500" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight text-white">
            Harmoniq
          </span>
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed font-medium mb-10 max-w-md">
          Plataforma definitiva para músicos de louvor. Focada em performance,
          simplicidade e precisão musical.
        </p>

        <div className="flex gap-8 mb-12">
          <a
            href="https://github.com/JsCodeDevlopment"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors text-sm font-medium"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/jscodedevelopment/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors text-sm font-medium"
          >
            LinkedIn
          </a>
          <a
            href="mailto:contato@harmoniq.com"
            className="text-zinc-500 hover:text-white transition-colors text-sm font-medium"
          >
            Email
          </a>
        </div>

        <div className="w-full pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-[11px] font-medium tracking-wide">
          <p>
            © 2024 Harmoniq. Desenvolvido por{" "}
            <span className="text-zinc-400">JsCodeDevlopment</span>.
          </p>
          <p>Designed for Jonatas Silva</p>
        </div>
      </div>
    </footer>
  );
}
