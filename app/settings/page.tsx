"use client";

import { useState } from "react";
import { User, RotateCcw, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const avatars = ["🧙‍♂️", "🦸", "🥷", "🧝", "🤠", "👩‍🚀", "🦊", "🐉", "⚡", "🔥"];

export default function SettingsPage() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const router = useRouter();

  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleSave() {
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    localStorage.removeItem("lifemaxing-store");
    window.location.href = "/onboarding";
  }

  const isDirty = name.trim() !== profile.name || avatar !== profile.avatar;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Settings</h1>

      {/* Profile section */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <User size={14} style={{ color: "var(--gold)" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Profile
          </span>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Avatar */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              Avatar
            </label>
            <div className="flex gap-2 flex-wrap">
              {avatars.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className="w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all hover:opacity-80"
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

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
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

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!isDirty && !saved}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all enabled:hover:opacity-80"
            style={{
              background: saved ? "rgba(74,222,128,0.15)" : isDirty ? "var(--gold)" : "var(--bg-elevated)",
              border: saved ? "1px solid rgba(74,222,128,0.3)" : isDirty ? "none" : "1px solid var(--border-subtle)",
              color: saved ? "var(--exp-green)" : isDirty ? "var(--bg-base)" : "var(--text-muted)",
              cursor: isDirty ? "pointer" : "default",
            }}
          >
            {saved ? <><Check size={14} /> Saved!</> : "Save changes"}
          </button>
        </div>
      </div>

      {/* Stats preview */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid var(--border-subtle)" }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            Your Stats
          </span>
        </div>
        {[
          { label: "Total EXP", value: `${profile.totalEXP} XP` },
          { label: "All-time tasks done", value: `${profile.allTimeTasksDone}` },
          { label: "Best streak", value: `${profile.bestStreak} days` },
          { label: "Current streak", value: `${profile.streak} days` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-surface)", border: "1px solid rgba(248,113,113,0.2)" }}
      >
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid rgba(248,113,113,0.15)" }}
        >
          <RotateCcw size={14} style={{ color: "var(--danger)" }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--danger)" }}>
            Danger Zone
          </span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Reset all data</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Deletes all tasks, EXP and progress. Cannot be undone.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ml-4 hover:opacity-80"
            style={{
              background: confirmReset ? "var(--danger)" : "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              color: confirmReset ? "white" : "var(--danger)",
            }}
          >
            {confirmReset ? "Confirm reset" : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}
