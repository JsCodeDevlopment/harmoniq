"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export function Showcase() {
  return (
    <section
      id="showcase"
      className="py-48 px-6 bg-zinc-50 relative overflow-hidden"
    >
      {/* Decorative subtle texture or elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20 mb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              Design de Performance
            </div>

            <h3 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold font-outfit tracking-[-0.05em] text-zinc-950 leading-[0.9] mb-10">
              Interface desenhada <br />
              <span className="text-zinc-300">para o foco </span>
              <span className="italic font-light text-zinc-400">absoluto.</span>
            </h3>

            <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl border-l-[3px] border-yellow-500 pl-8">
              Tudo o que você precisa, exatamente onde você precisa. Eliminamos
              a poluição visual para que sua performance seja fluida.
            </p>
          </div>
        </div>

        <motion.div
          className="relative group rounded-[3rem] p-4 md:p-6 bg-zinc-200/50 border border-zinc-200 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.1)]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden bg-white shadow-2xl">
            <Image
              src="/harmoniq_hero_mockup_1774402141314.png"
              alt="Harmoniq Performance Mode Interface"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
              priority
            />
            {/* Soft inner shadow overlay */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] pointer-events-none" />
          </div>

          {/* Minimalist Floating Annotation */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute -bottom-10 right-1/2 translate-x-1/2 md:translate-x-0 md:-right-10 z-10"
          >
            <div className="bg-white/90 backdrop-blur-xl px-10 py-8 rounded-[2.5rem] border border-zinc-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] text-center md:text-left">
              <div className="w-8 h-1 bg-yellow-500 rounded-full mb-6 mx-auto md:mx-0" />
              <h4 className="text-zinc-950 font-black text-xl mb-2 tracking-tight font-outfit uppercase tracking-tighter">
                Stage Ready
              </h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[220px]">
                Modo de baixa luminosidade testado em ambientes de palco reais.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
