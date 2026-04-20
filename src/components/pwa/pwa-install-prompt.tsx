"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Sparkles, Download } from "lucide-react";
import Cookies from "js-cookie";

const PWA_PROMPT_COOKIE = "harmoniq_pwa_prompt_dismissed";

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already in standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches 
      // @ts-ignore
      || window.navigator.standalone 
      || document.referrer.includes("android-app://");

    if (isStandalone) return;

    // 2. Check dismissal cookie
    const isDismissed = Cookies.get(PWA_PROMPT_COOKIE);
    if (isDismissed) return;

    // 3. Listen for installation prompt (Chrome/Android)
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 4. Force show after a delay for iOS (since they don't have beforeinstallprompt)
    const timer = setTimeout(() => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && !isStandalone && !isDismissed) {
        setShow(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    // Set cookie to expire in 7 days
    Cookies.set(PWA_PROMPT_COOKIE, "true", { expires: 7 });
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // iOS fallback or generic message
      alert("Para instalar no iOS: Toque em 'Compartilhar' e depois em 'Adicionar à Tela de Início'.");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-[1000] max-w-[320px] w-full"
        >
          <div className="relative p-5 rounded-[2rem] bg-zinc-950 border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden group">
            {/* Ambient Glow */}
            <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-500/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-transparent rounded-2xl overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Harmoniq Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    App Experience
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm mb-1 tracking-tight">
                  Instalar Harmoniq
                </h4>
                <p className="text-zinc-500 text-[11px] font-medium leading-relaxed mb-4">
                  Adicione à sua tela inicial para acesso instantâneo e modo tela cheia.
                </p>
                
                <button
                  onClick={handleInstall}
                  className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-[0.2em] hover:bg-yellow-500 hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-3 h-3" />
                  Adicionar agora
                </button>
              </div>

              <button
                onClick={handleDismiss}
                className="absolute top-0 right-0 p-2 text-zinc-600 hover:text-white transition-colors"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
