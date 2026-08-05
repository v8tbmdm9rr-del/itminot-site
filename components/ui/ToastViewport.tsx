"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useToastStore } from "@/store/toast";

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex flex-col items-center gap-2 px-4 sm:bottom-8 sm:items-end sm:right-8 sm:left-auto">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-cream/10 bg-charcoal-soft/95 p-4 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="mt-0.5 shrink-0 text-gold" size={20} aria-hidden />
            <div className="flex-1">
              <p className="text-sm font-semibold text-cream">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-xs leading-relaxed text-cream/65">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Закрыть уведомление"
              className="shrink-0 text-cream/50 hover:text-cream"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
