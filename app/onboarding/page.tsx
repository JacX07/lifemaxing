"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";

const avatars = ["🧙‍♂️", "🦸", "🥷", "🧝", "🤠", "👩‍🚀", "🦊", "🐉", "⚡", "🔥"];

export default function OnboardingPage() {
  const router = useRouter();
  const updateProfile = useStore((s) => s.updateProfile);

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧙‍♂️");

  function handleStart() {
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center glow-gold"
            style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)" }}
          >
            <Zap size={28} style={{ color: "var(--gold)" }} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text-primary)" }}>
          Welcome to LifeMaxing
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "var(--text-muted)" }}>
          Your journey to level 100 starts here.
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
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
            Your name
          </label>
          <input
            autoFocus
            type="text"
            placeholder="Enter your hero name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              colorScheme: "dark",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-muted)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {/* Preview */}
        {name.trim() && (
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <span className="text-2xl">{avatar}</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{name}</p>
              <p className="text-xs" style={{ color: "var(--gold)" }}>Lv 1 · Dabbler</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            background: name.trim() ? "var(--gold)" : "var(--bg-hover)",
            color: name.trim() ? "var(--bg-base)" : "var(--text-muted)",
            cursor: name.trim() ? "pointer" : "not-allowed",
          }}
        >
          Begin my journey
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
