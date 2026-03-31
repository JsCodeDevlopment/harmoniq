"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Louvores Disponíveis", value: "200k+" },
  { label: "Transposições Ativas", value: "1.2M+" },
  { label: "User Satisfaction", value: "99.9%" },
  { label: "Anúncios Exibidos", value: "ZERO" }
];

export function Stats() {
  return (
    <section className="py-24 px-6 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            className="text-center md:text-left flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-3xl md:text-4xl font-semibold font-outfit text-zinc-950 tracking-tight">{stat.value}</p>
            <p className="text-zinc-500 text-[12px] font-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
