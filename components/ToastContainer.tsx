"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, Trophy } from "lucide-react";
import { useStore, comboLabel, comboMultiplier } from "@/lib/store";

const AUTO_DISMISS_MS = 3000;
const COMBO_WINDOW_MS = 5 * 60 * 1000;

export default function ToastContainer() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);
  const combo = useStore((s) => s.combo);
  const lastComboTime = useStore((s) => s.lastComboTime);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => dismissToast(latest.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toasts, dismissToast]);

  // Is the combo still active?
  const comboActive = combo >= 2 && Date.now() - lastComboTime < COMBO_WINDOW_MS;
  const mult = comboMultiplier(combo);
  const label = comboLabel(combo);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {/* Persistent combo indicator */}
      <AnimatePresence>
        {comboActive && (
          <motion.div
            key="combo-badge"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(192,132,252,0.15)",
              border: "1px solid rgba(192,132,252,0.4)",
              boxShadow: "0 0 20px rgba(192,132,252,0.2)",
            }}
          >
            <span className="text-sm">⚡</span>
            <div className="text-xs font-bold" style={{ color: "var(--exp-purple)" }}>
              {combo}x COMBO
            </div>
            <div
              className="px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "rgba(192,132,252,0.2)", color: "var(--exp-purple)" }}
            >
              ×{mult.toFixed(1)}
            </div>
            <div className="text-xs font-semibold" style={{ color: "rgba(192,132,252,0.7)" }}>
              {label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {toast.type === "exp" ? (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--gold-muted)",
                  boxShadow: "0 0 20px rgba(212,168,75,0.2)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gold-dim)" }}
                >
                  <Zap size={16} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold" style={{ color: "var(--gold)" }}>
                      +{toast.exp} XP
                    </p>
                    {toast.combo && toast.combo >= 2 && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(192,132,252,0.2)", color: "var(--exp-purple)" }}
                      >
                        {toast.combo}x COMBO
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate max-w-[180px]" style={{ color: "var(--text-muted)" }}>
                    {toast.taskTitle}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
                style={{
                  background: "var(--gold-dim)",
                  border: "1px solid var(--gold)",
                  boxShadow: "0 0 30px rgba(212,168,75,0.4)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gold)" }}
                >
                  <Trophy size={16} style={{ color: "var(--bg-base)" }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--gold-bright)" }}>
                    Level Up! 🎉
                  </p>
                  <p className="text-xs" style={{ color: "var(--gold)" }}>
                    You reached level {toast.level}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
