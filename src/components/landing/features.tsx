"use client";

import { motion } from "framer-motion";
import { Zap, Smartphone, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Performance Instantânea",
    description: "Carregamento ultrarrápido das suas cifras favoritas, sem anúncios intrusivos ou interrupções no palco."
  },
  {
    icon: Smartphone,
    title: "Experiência Mobile First",
    description: "Desenhado especificamente para ser impecável no seu tablet ou celular, onde quer que você esteja tocando."
  },
  {
    icon: Clock,
    title: "Auto-Scroll Inteligente",
    description: "Recurso exclusivo de acompanhamento automático que rola a cifra no seu tempo de execução."
  },
  {
    icon: ShieldCheck,
    title: "Distração Zero",
    description: "Interface minimalista, focada em entregar a música de forma limpa, clara e sem interferências externas."
  }
];

export function Features() {
  return (
    <section id="features" className="py-48 px-6 bg-black border-y border-white/3">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24">
          <div className="max-w-2xl">
              <span className="text-yellow-500 text-[12px] font-semibold uppercase tracking-wider mb-6 block font-sans">Diferenciais</span>
              <h3 className="text-4xl md:text-6xl font-semibold font-outfit tracking-tight text-white leading-tight">
                Projetado por músicos,<br /> para <span className="text-zinc-500">excelência.</span>
              </h3>
          </div>
          <p className="text-zinc-500 text-lg font-medium max-w-sm mb-6 leading-relaxed">
            Cada recurso foi pensado para resolver os problemas reais de quem toca ao vivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl bg-zinc-900/30 border border-white/3 hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-8 border border-white/5 group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-zinc-400 group-hover:text-black transition-colors" strokeWidth={2} />
              </div>
              <h4 className="text-xl font-semibold font-outfit mb-4 text-white tracking-tight">{feature.title}</h4>
              <p className="text-zinc-500 text-[15px] leading-relaxed group-hover:text-zinc-400 transition-colors">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
