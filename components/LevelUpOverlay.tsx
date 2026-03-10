"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, getTitle } from "@/lib/store";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  angle: number;
  distance: number;
}

function generateParticles(count: number): Particle[] {
  const colors = ["#d4a84b", "#f0c060", "#fff7e0", "#c084fc", "#60a5fa", "#4ade80"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 60,
    y: 50 + (Math.random() - 0.5) * 60,
    size: Math.random() * 8 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 1.2 + 0.8,
    delay: Math.random() * 0.6,
    angle: Math.random() * 360,
    distance: Math.random() * 300 + 100,
  }));
}

const PARTICLES = generateParticles(60);

export default function LevelUpOverlay() {
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);

  const [active, setActive] = useState<{ id: string; level: number } | null>(null);

  useEffect(() => {
    const levelUpToast = toasts.find((t) => t.type === "levelup");
    if (levelUpToast && levelUpToast.level) {
      setActive({ id: levelUpToast.id, level: levelUpToast.level });
      dismissToast(levelUpToast.id);
    }
  }, [toasts, dismissToast]);

  function dismiss() {
    setActive(null);
  }

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(dismiss, 4500);
    return () => clearTimeout(t);
  }, [active]);

  const title = active ? getTitle(active.level) : "";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="levelup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismiss}
          className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          {/* Radial gold glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 2.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,168,75,0.25) 0%, transparent 70%)",
            }}
          />

          {/* Particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: "50vw", y: "50vh", scale: 1 }}
              animate={{
                opacity: 0,
                x: `calc(50vw + ${Math.cos((p.angle * Math.PI) / 180) * p.distance}px)`,
                y: `calc(50vh + ${Math.sin((p.angle * Math.PI) / 180) * p.distance}px)`,
                scale: 0,
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
              className="absolute pointer-events-none rounded-full"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          ))}

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
            className="relative flex flex-col items-center gap-5 px-12 py-10 rounded-3xl text-center"
            style={{
              background: "var(--bg-elevated)",
              border: "2px solid var(--gold)",
              boxShadow: "0 0 60px rgba(212,168,75,0.5), 0 0 120px rgba(212,168,75,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEVEL UP label */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-black tracking-[0.3em] uppercase"
              style={{ color: "var(--gold-muted)" }}
            >
              Level Up!
            </motion.p>

            {/* Level number */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.2 }}
              className="relative"
            >
              <motion.p
                animate={{ textShadow: ["0 0 20px rgba(212,168,75,0.8)", "0 0 60px rgba(212,168,75,1)", "0 0 20px rgba(212,168,75,0.8)"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[7rem] font-black leading-none"
                style={{ color: "var(--gold-bright)" }}
              >
                {active.level}
              </motion.p>

              {/* Shine sweep */}
              <motion.div
                initial={{ x: "-100%", opacity: 0.6 }}
                animate={{ x: "200%", opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)",
                }}
              />
            </motion.div>

            {/* Title badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: "spring", stiffness: 300 }}
              className="px-5 py-2 rounded-full text-sm font-bold tracking-wide"
              style={{
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-muted)",
                color: "var(--gold)",
              }}
            >
              🏆 {title}
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
