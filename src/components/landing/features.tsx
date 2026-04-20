"use client";

import { motion } from "framer-motion";
import { Zap, Smartphone, Clock, ShieldCheck, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Variação Harmônica",
    description: "Algoritmos avançados que sugerem substituições de acordes ricas e sofisticadas para elevar seu som."
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Ajuste automático de legibilidade para tablets e celulares. Cifras que respiram com a sua tela."
  },
  {
    icon: Clock,
    title: "Sync Pro",
    description: "Auto-scroll de precisão milimétrica sincronizado com o tempo da música. Suas mãos livres para adorar."
  },
  {
    icon: ShieldCheck,
    title: "Ambiente Limpo",
    description: "Zero distrações. O modo performance elimina menus e notificações para focar apenas na cifra."
  }
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="group relative p-10 rounded-[2.5rem] bg-zinc-900/20 border border-white/[0.03] hover:border-white/10 hover:bg-zinc-900/40 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-8 right-8 text-zinc-800 font-black text-2xl group-hover:text-yellow-500/20 transition-colors">
        0{index + 1}
      </div>

      <div className="w-14 h-14 bg-zinc-900/50 rounded-2xl flex items-center justify-center mb-10 border border-white/5 group-hover:bg-yellow-500 group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]">
        <feature.icon className="w-6 h-6 text-zinc-500 group-hover:text-black transition-colors" strokeWidth={1.5} />
      </div>

      <h4 className="text-2xl font-bold font-outfit mb-4 text-white tracking-tight group-hover:text-yellow-500 transition-colors">
        {feature.title}
      </h4>
      <p className="text-zinc-500 text-[15px] leading-relaxed group-hover:text-zinc-400 transition-colors">
        {feature.description}
      </p>

      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
         <ArrowUpRight className="w-5 h-5 text-yellow-500/50" />
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-48 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-28">
          <div className="max-w-3xl">
              <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-8 block font-sans">Excelência Técnica</span>
              <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold font-outfit tracking-tight text-white leading-[1.1]">
                A força por trás da <br />
                <span className="text-zinc-700 italic font-light">sua performance.</span>
              </h3>
          </div>
          <p className="text-zinc-500 text-lg font-medium max-w-sm leading-relaxed mb-4 border-l-2 border-yellow-500/20 pl-8">
            Desenvolvemos tecnologias proprietárias para garantir que seu ensaio e culto sejam impecáveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
