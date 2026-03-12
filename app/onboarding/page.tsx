"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

const avatars = ["🧙‍♂️", "🦸", "🥷", "🧝", "🤠", "👩‍🚀", "🦊", "🐉", "⚡", "🔥"];

const FEATURES = [
  { emoji: "⚔️", title: "Complete Tasks", desc: "Earn XP & level up your character" },
  { emoji: "📦", title: "Earn Chests", desc: "Drop from hard tasks as rare rewards" },
  { emoji: "🏴‍☠️", title: "Collect Characters", desc: "26 heroes across 5 universes" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useStore((s) => s.updateProfile);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧙‍♂️");

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleBegin() {
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl p-8 overflow-hidden relative"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? "24px" : "8px",
                height: "8px",
                background: i === step ? "var(--gold)" : "var(--border)",
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center glow-gold"
                  style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)" }}
                >
                  <Zap size={32} style={{ color: "var(--gold)" }} />
                </motion.div>
              </div>

              <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>
                LifeMaxing
              </h1>
              <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)" }}>
                Gamify your life. Level up for real.
              </p>

              {/* Feature cards */}
              <div className="space-y-3 mb-8">
                {FEATURES.map((feat, i) => (
                  <motion.div
                    key={feat.title}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.35 }}
                    className="flex items-center gap-4 p-3 rounded-xl"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                  >
                    <span className="text-2xl">{feat.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{feat.title}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                style={{ background: "var(--gold)", color: "var(--bg-base)" }}
              >
                Start your journey
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>
                Create your hero
              </h2>
              <p className="text-sm text-center mb-6" style={{ color: "var(--text-muted)" }}>
                Choose your avatar and enter your name
              </p>

              {/* Avatar picker */}
              <div className="mb-5">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
                  Choose your avatar
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {avatars.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className="w-full aspect-square rounded-xl text-2xl flex items-center justify-center transition-all"
                      style={{
                        background: avatar === a ? "var(--gold-dim)" : "var(--bg-elevated)",
                        border: `2px solid ${avatar === a ? "var(--gold)" : "var(--border-subtle)"}`,
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                  Your hero name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter your hero name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && goNext()}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-muted)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>

              {/* Live preview */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-6"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  opacity: name.trim() ? 1 : 0.4,
                  transition: "opacity 0.2s",
                }}
              >
                <span className="text-2xl">{avatar}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {name.trim() || "Your Name"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--gold)" }}>Lv 1 · Dabbler</p>
                </div>
              </div>

              <button
                onClick={goNext}
                disabled={!name.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: name.trim() ? "var(--gold)" : "var(--bg-elevated)",
                  color: name.trim() ? "var(--bg-base)" : "var(--text-muted)",
                  cursor: name.trim() ? "pointer" : "not-allowed",
                  border: name.trim() ? "none" : "1px solid var(--border)",
                }}
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <ConfettiStep name={name} avatar={avatar} onBegin={handleBegin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ConfettiStep({ name, avatar, onBegin }: { name: string; avatar: string; onBegin: () => void }) {
  useEffect(() => {
    let cancelled = false;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (cancelled) return;
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#d4a84b", "#f0c060", "#fff8e1", "#fbbf24", "#92400e"],
        zIndex: 9999,
      });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="text-center mb-6"
      >
        <div className="text-6xl mb-3">{avatar}</div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{name}</h2>
        <p className="text-sm font-semibold mt-1" style={{ color: "var(--gold)" }}>Lv 1 · Dabbler</p>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl mb-6 text-center"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--gold-muted)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          ✨ Your adventure begins...
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Complete tasks, earn chests, collect heroes.
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={onBegin}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
        style={{ background: "var(--gold)", color: "var(--bg-base)" }}
      >
        Begin
        <ArrowRight size={16} />
      </motion.button>
    </>
  );
}
