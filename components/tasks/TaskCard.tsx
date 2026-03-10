"use client";

import { Check, MoreHorizontal, Repeat2, Calendar, Flame, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Task, calcEXP } from "@/lib/store";

type Difficulty = Task["difficulty"];

const difficultyConfig: Record<Difficulty, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  easy:   { label: "Easy",   color: "var(--exp-green)",  bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.2)",  emoji: "🌱" },
  medium: { label: "Medium", color: "var(--exp-blue)",   bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)",  emoji: "⚡" },
  hard:   { label: "Hard",   color: "var(--exp-orange)", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)",  emoji: "🔥" },
  epic:   { label: "Epic",   color: "var(--exp-purple)", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)", emoji: "💎" },
};

interface TaskCardProps {
  task: Task;
  completedToday: boolean;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, completedToday, onComplete, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const diff = difficultyConfig[task.difficulty];

  // EXP preview (what they'd earn if they complete now)
  const nextStreak = completedToday ? task.streak : task.streak + 1;
  const expReward = calcEXP(task.difficulty, task.type, completedToday ? task.streak : nextStreak);

  const formattedDue = task.dueDate
    ? new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : undefined;

  return (
    <div
      className="group rounded-xl p-4 flex items-center gap-4 transition-all duration-150"
      style={{
        background: completedToday ? "var(--bg-surface)" : "var(--bg-elevated)",
        border: `1px solid ${completedToday ? "var(--border-subtle)" : "var(--border)"}`,
        opacity: completedToday ? 0.55 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => !completedToday && onComplete(task.id)}
        className="flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-150"
        style={{
          borderColor: completedToday ? "var(--gold-muted)" : "var(--border)",
          background: completedToday ? "var(--gold-dim)" : "transparent",
          cursor: completedToday ? "default" : "pointer",
        }}
      >
        {completedToday && <Check size={12} style={{ color: "var(--gold)" }} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="text-sm font-medium truncate"
            style={{
              color: "var(--text-primary)",
              textDecoration: completedToday ? "line-through" : "none",
            }}
          >
            {task.title}
          </span>
          {task.category && (
            <span
              className="px-1.5 py-0.5 rounded text-xs flex-shrink-0"
              style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
            >
              {task.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Difficulty badge */}
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: diff.bg, border: `1px solid ${diff.border}`, color: diff.color }}
          >
            {diff.emoji} {diff.label}
          </span>

          {/* EXP */}
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)", color: "var(--gold)" }}
          >
            +{expReward} XP
          </span>

          {/* Due date */}
          {task.type === "ponctuelle" && formattedDue && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Calendar size={10} />
              {formattedDue}
            </span>
          )}

          {/* Streak */}
          {task.type === "recurrente" && task.streak > 0 && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--exp-orange)" }}>
              <Flame size={10} />
              {task.streak} day streak
            </span>
          )}

          {/* Recurrence icon */}
          {task.type === "recurrente" && (
            <span className="ml-auto">
              <Repeat2 size={12} style={{ color: "var(--text-muted)" }} />
            </span>
          )}
        </div>
      </div>

      {/* Context menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-8 z-10 rounded-lg overflow-hidden shadow-lg"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", minWidth: "120px" }}
          >
            <button
              onClick={() => { onDelete(task.id); setMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm transition-colors"
              style={{ color: "var(--danger)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
