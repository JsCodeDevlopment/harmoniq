"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Showcase() {
  return (
    <section id="showcase" className="py-32 px-6 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
            <h3 className="text-3xl md:text-5xl font-semibold font-outfit tracking-tight text-zinc-950 leading-tight mb-4">
              Interface desenhada para o <span className="text-zinc-400">foco absoluto.</span>
            </h3>
            <p className="text-zinc-600 text-lg font-medium leading-relaxed">
              Tudo o que você precisa, onde você precisa. Sem elementos desnecessários na tela durante sua performance.
            </p>
        </div>

        <motion.div 
            className="relative bg-white rounded-2xl p-3 overflow-hidden aspect-video border border-zinc-200 shadow-2xl shadow-zinc-200"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner">
            <Image 
                src="/harmoniq_hero_mockup_1774402141314.png" 
                alt="Harmoniq Performance Mode Interface" 
                layout="fill" 
                objectFit="cover"
                className="transition-transform duration-1000"
                priority
            />
          </div>
          
          <div className="absolute bottom-10 left-10 z-10 hidden md:block">
             <div className="bg-white/80 backdrop-blur-xl px-6 py-5 rounded-xl border border-zinc-200 shadow-xl">
                <h4 className="text-zinc-950 font-semibold text-lg mb-1 tracking-tight">Modo Performance</h4>
                <p className="text-zinc-500 text-sm font-medium">Controle total na palma da sua mão.</p>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
