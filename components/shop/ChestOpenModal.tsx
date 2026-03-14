"use client";

import Image from "next/image";
import { useState } from "react";
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

// Config basée sur le TIER DU COFFRE (pas la rareté du perso)
const CHEST_TIER_CONFIG = {
  common:    { color: "var(--text-secondary)", bg: "rgba(90,80,64,0.2)",   border: "rgba(90,80,64,0.6)",   label: "Common",    glow: "",                              emoji: "📦", iconUrl: null },
  rare:      { color: "var(--exp-blue)",       bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.5)", label: "Rare",      glow: "0 0 40px rgba(96,165,250,0.3)", emoji: "💎", iconUrl: "/icons/rare_chest-removebg-preview.png" },
  epic:      { color: "var(--exp-purple)",     bg: "rgba(192,132,252,0.1)",border: "rgba(192,132,252,0.5)",label: "Epic",      glow: "0 0 60px rgba(192,132,252,0.4)",emoji: "🔮", iconUrl: null },
  legendary: { color: "var(--gold)",           bg: "rgba(212,168,75,0.15)",border: "var(--gold-muted)",    label: "Legendary", glow: "0 0 80px rgba(212,168,75,0.5)", emoji: "👑", iconUrl: null },
};

const PARTICLES = [
  { x: -60, y: -60, delay: 0 },
  { x: 60,  y: -60, delay: 0.05 },
  { x: -80, y: 0,   delay: 0.1 },
  { x: 80,  y: 0,   delay: 0.1 },
  { x: -60, y: 60,  delay: 0.15 },
  { x: 60,  y: 60,  delay: 0.15 },
  { x: 0,   y: -80, delay: 0.05 },
  { x: 0,   y: 80,  delay: 0.2 },
];

export default function ChestOpenModal() {
  const result = useStore((s) => s.pendingChestResult);
  const clear = useStore((s) => s.clearPendingChestResult);
  const [phase, setPhase] = useState<"chest" | "flash" | "reveal">("chest");

  // Reset phase quand un nouveau résultat arrive
  if (!result) {
    if (phase !== "chest") setPhase("chest");
    return null;
  }

  const char = CHARACTERS_BY_ID[result.characterId];
  if (!char) return null;

  const chestCfg = CHEST_TIER_CONFIG[result.chestTier]; // pour phase 1 (coffre)
  const cfg = RARITY_CONFIG[char.rarity];               // pour phase 3 (perso)

  function handleOpen() {
    setPhase("flash");
  }

  function handleClose() {
    setPhase("chest");
    clear();
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={phase === "chest" ? undefined : handleClose}
      >
        {/* ── Phase 1 : Coffre ────────────────────────────────── */}
        {phase === "chest" && (
          <motion.div
            className="relative flex flex-col items-center gap-6 p-8 rounded-3xl max-w-sm w-full mx-4"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
            style={{ background: chestCfg.bg, border: `2px solid ${chestCfg.border}`, boxShadow: chestCfg.glow }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chest tier label */}
            <div
              className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
              style={{ background: chestCfg.bg, border: `1px solid ${chestCfg.border}`, color: chestCfg.color }}
            >
              {chestCfg.label} Chest
            </div>

            {/* Coffre animé */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-44 h-44 rounded-2xl flex items-center justify-center overflow-hidden relative"
              style={{ background: "var(--bg-elevated)", border: `2px solid ${chestCfg.border}`, boxShadow: chestCfg.glow }}
            >
              {chestCfg.iconUrl ? (
                <Image src={chestCfg.iconUrl} alt={chestCfg.label} fill className="object-contain p-2" />
              ) : (
                <span className="text-8xl">{chestCfg.emoji}</span>
              )}
            </motion.div>

            <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
              Tap to reveal your reward…
            </p>

            <button
              onClick={handleOpen}
              className="w-full py-3 rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
              style={{ background: chestCfg.border, color: "var(--bg-base)" }}
            >
              Open!
            </button>
          </motion.div>
        )}

        {/* ── Phase 2 : Flash ─────────────────────────────────── */}
        {phase === "flash" && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.35 }}
            onAnimationComplete={() => setPhase("reveal")}
            style={{ background: "white" }}
          />
        )}

        {/* ── Phase 3 : Reveal perso ──────────────────────────── */}
        {phase === "reveal" && (
          <motion.div
            className="relative flex flex-col items-center gap-6 p-8 rounded-3xl max-w-sm w-full mx-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{ background: cfg.bg, border: `2px solid ${cfg.border}`, boxShadow: cfg.glow }}
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

            {/* Perso + particules */}
            <div className="relative flex items-center justify-center">
              {/* Particules */}
              {PARTICLES.map((p, i) => (
                <motion.span
                  key={i}
                  className="absolute text-lg pointer-events-none"
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], x: p.x, y: p.y }}
                  transition={{ delay: p.delay, duration: 0.6 }}
                >
                  ✨
                </motion.span>
              ))}

              {/* Image perso */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 15 }}
                className="w-28 h-28 rounded-2xl flex items-center justify-center text-6xl overflow-hidden relative"
                style={{ background: "var(--bg-elevated)", border: `2px solid ${cfg.border}`, boxShadow: cfg.glow }}
              >
                {char.imageUrl ? (
                  <Image src={char.imageUrl} alt={char.name} fill className="object-contain" />
                ) : (
                  UNIVERSE_EMOJI[char.universe] ?? "✨"
                )}
              </motion.div>
            </div>

            {/* Nom + univers */}
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

            {/* Gold */}
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

            {/* Close */}
            <motion.button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ background: cfg.border, color: "var(--bg-base)" }}
            >
              Continue
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
