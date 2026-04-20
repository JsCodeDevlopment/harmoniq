"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section
      id="about"
      className="py-52 px-6 text-center bg-yellow-500 relative overflow-hidden"
    >
      {/* Subtle organic background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl">
            <Sparkles className="w-3 h-3" />
            Performance Elevada
          </div>

          <div className="w-24 h-24 rounded-[2rem] overflow-hidden mx-auto mb-16 transition-transform hover:scale-110 duration-700 shadow-xl border border-white/5">
            <img
              src="/logo.png"
              alt="Harmoniq Logo"
              className="w-full h-full object-contain p-4"
            />
          </div>

          <h2 className="text-[clamp(2.5rem,7.5vw,5.5rem)] font-black font-outfit mb-10 tracking-[-0.05em] text-black leading-[0.9]">
            Eleve o seu louvor <br />
            <span className="opacity-40 italic font-light">
              ao próximo nível.
            </span>
          </h2>

          <p className="text-black/80 text-lg md:text-xl mb-16 max-w-xl mx-auto font-medium leading-relaxed">
            Una-se a músicos que buscam a perfeição. A plataforma definitiva
            para ensaios produtivos e cultos inspirados.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="group relative h-16 px-12 rounded-full bg-black text-yellow-500 font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                Começar agora
                <ChevronRight
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  strokeWidth={3}
                />
              </span>
              {/* Shine animation overlay */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
            </button>

            <button className="h-16 px-12 rounded-full border-2 border-black/10 text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-black/5 transition-all">
              Ver demonstração
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
