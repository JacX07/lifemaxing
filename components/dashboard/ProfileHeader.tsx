"use client";

import { Trophy, Flame, CheckCheck, Star, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ProfileHeader() {
  const profile = useStore((s) => s.profile);
  const getExpProgress = useStore((s) => s.getExpProgress);
  const { level, currentEXP, expToNext, progressPct, title } = getExpProgress();

  const stats = [
    { label: "Streak", value: `${profile.streak} days`, icon: Flame, color: "var(--exp-orange)" },
    { label: "Today", value: `${profile.todayTasksDone} tasks`, icon: CheckCheck, color: "var(--exp-green)" },
    { label: "All time", value: `${profile.allTimeTasksDone} tasks`, icon: Star, color: "var(--exp-blue)" },
    { label: "Best streak", value: `${profile.bestStreak} days`, icon: TrendingUp, color: "var(--exp-purple)" },
  ];

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl glow-gold"
            style={{ background: "var(--bg-elevated)", border: "2px solid var(--gold-muted)" }}
          >
            {profile.avatar}
          </div>
          <div
            className="absolute -bottom-2 -right-2 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--gold)", color: "var(--bg-base)" }}
          >
            {level}
          </div>
        </div>

        {/* Name + EXP */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {profile.name}
            </h1>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-muted)",
                color: "var(--gold)",
              }}
            >
              <Trophy size={10} />
              {title}
            </div>
          </div>

          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            Level {level} · {currentEXP} / {expToNext} XP to next level
          </p>

          {/* EXP bar */}
          <div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: "var(--bg-hover)", border: "1px solid var(--border-subtle)" }}
            >
              <div
                className="h-full rounded-full exp-bar-fill transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{currentEXP} XP</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{expToNext} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div
        className="grid grid-cols-4 gap-3 mt-5 pt-5"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-3 flex flex-col gap-1.5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-1.5">
              <Icon size={12} style={{ color }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
            <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
