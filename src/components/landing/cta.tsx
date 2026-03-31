"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Music } from "lucide-react";

export function CTA() {
  return (
    <section id="about" className="py-48 px-6 text-center bg-yellow-500">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-12 shadow-2xl transition-all duration-500">
            <Music className="w-10 h-10 text-yellow-500" strokeWidth={2} />
          </div>
          <h2 className="text-5xl md:text-7xl font-semibold font-outfit mb-8 tracking-tight text-black leading-tight">
            Pronto para elevar o seu <br />
            <span className="opacity-60">louvor ao próximo nível?</span>
          </h2>
          <p className="text-black/70 text-lg md:text-xl mb-16 max-w-xl mx-auto font-medium">
            Junte-se a milhares de músicos que buscam excelência e simplicidade
            na plataforma mais profissional do mercado.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full md:w-auto h-14 px-10 rounded-xl bg-black text-white font-semibold text-lg hover:bg-zinc-900 transition-all shadow-xl flex items-center justify-center gap-2.5 outline-none border-none cursor-pointer"
            >
              Começar agora{" "}
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full md:w-auto h-14 px-10 rounded-xl border-black text-black font-semibold text-lg hover:bg-black/5 transition-all cursor-pointer"
            >
              Ver demonstração
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
