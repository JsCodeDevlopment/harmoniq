"use client";

import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  
  const displayValue = useTransform(springValue, (latest) => 
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref} className="font-black">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Cifras Disponíveis", value: 512648, suffix: "+" },
  { label: "Anúncios Exibidos", value: 0, suffix: "" },
  { label: "Foco no Altar", value: 100, suffix: "%" },
  { label: "Transposições Pro", value: 12, suffix: "k+" }
];

export function Stats() {
  return (
    <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="relative px-8 text-center md:text-left group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <div className="flex flex-col gap-2 relative z-10">
                <p className="text-[clamp(2rem,4vw,3.5rem)] font-black font-outfit text-zinc-950 tracking-[-0.05em] leading-none">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500 transition-colors" />
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    {stat.label}
                  </p>
                </div>
              </div>
              
              {/* Vertical divider for desktop */}
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-12 bg-zinc-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
