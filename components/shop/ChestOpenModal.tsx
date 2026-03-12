"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { CHARACTERS_BY_ID } from "@/lib/characters";

const RARITY_CONFIG = {
  common:    { color: "var(--text-secondary)", bg: "rgba(90,80,64,0.2)",   border: "rgba(90,80,64,0.6)",   label: "Common",    glow: "" },
  rare:      { color: "var(--exp-blue)",       bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.5)", label: "Rare",      glow: "0 0 40px rgba(96,165,250,0.3)" },
  epic:      { color: "var(--exp-purple)",     bg: "rgba(192,132,252,0.1)",border: "rgba(192,132,252,0.5)",label: "Epic",      glow: "0 0 60px rgba(192,132,252,0.4)" },
  legendary: { color: "var(--gold)",           bg: "rgba(212,168,75,0.15)",border: "var(--gold-muted)",    label: "Legendary", glow: "0 0 80px rgba(212,168,75,0.5)" },
};

const UNIVERSE_EMOJI: Record<string, string> = {
  onepiece: "🏴‍☠️",
  naruto: "🍃",
  dragonball: "⚡",
  aot: "⚔️",
  rickmorty: "🌀",
};

export default function ChestOpenModal() {
  const result = useStore((s) => s.pendingChestResult);
  const clear = useStore((s) => s.clearPendingChestResult);

  if (!result) return null;

  const char = CHARACTERS_BY_ID[result.characterId];
  if (!char) return null;

  const cfg = RARITY_CONFIG[char.rarity];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={clear}
      >
        <motion.div
          className="relative flex flex-col items-center gap-6 p-8 rounded-3xl max-w-sm w-full mx-4"
          initial={{ scale: 0.5, y: 60, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          style={{
            background: cfg.bg,
            border: `2px solid ${cfg.border}`,
            boxShadow: cfg.glow,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* NEW badge */}
          {result.isNew && (
            <motion.div
              className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-black"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -8 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{ background: "var(--gold)", color: "var(--bg-base)" }}
            >
              NEW!
            </motion.div>
          )}

          {/* Rarity label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
            style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
          >
            {cfg.label}
          </motion.div>

          {/* Character icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 250, damping: 15 }}
            className="w-28 h-28 rounded-2xl flex items-center justify-center text-6xl"
            style={{ background: "var(--bg-elevated)", border: `2px solid ${cfg.border}`, boxShadow: cfg.glow }}
          >
            {UNIVERSE_EMOJI[char.universe] ?? "✨"}
          </motion.div>

          {/* Name + universe */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <p className="text-xl font-black" style={{ color: cfg.color }}>{char.name}</p>
            <p className="text-sm mt-0.5 capitalize" style={{ color: "var(--text-muted)" }}>
              {char.universe === "onepiece" ? "One Piece" :
               char.universe === "naruto" ? "Naruto" :
               char.universe === "dragonball" ? "Dragon Ball" :
               char.universe === "aot" ? "Attack on Titan" : "Rick & Morty"}
            </p>
            <p className="text-xs mt-2 px-4" style={{ color: "var(--text-secondary)" }}>{char.description}</p>
          </motion.div>

          {/* Gold earned */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)" }}
          >
            <span>🪙</span>
            <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>+{result.gold} Gold</span>
          </motion.div>

          {/* Close button */}
          <motion.button
            onClick={clear}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ background: cfg.border, color: "var(--bg-base)" }}
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
