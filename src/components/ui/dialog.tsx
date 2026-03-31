"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  // Prevent scroll when dialog is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm shadow-2xl"
          />

          {/* Dialog Content */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 p-6 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                  {description && (
                    <p className="mt-1 text-sm text-zinc-500 font-medium">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
