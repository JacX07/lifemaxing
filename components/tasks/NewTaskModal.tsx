"use client";

import { useState } from "react";
import { X, Zap } from "lucide-react";
import { useStore, type Difficulty, type TaskType, calcEXP, CHEST_DROP_CHANCE, CHEST_DROP_TIER, type ChestTier } from "@/lib/store";

const DIFFICULTIES: { value: Difficulty; label: string; emoji: string; color: string; bg: string; border: string }[] = [
  { value: "easy",   label: "Easy",   emoji: "🌱", color: "var(--exp-green)",  bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.2)" },
  { value: "medium", label: "Medium", emoji: "⚡", color: "var(--exp-blue)",   bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)" },
  { value: "hard",   label: "Hard",   emoji: "🔥", color: "var(--exp-orange)", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)" },
  { value: "epic",   label: "Epic",   emoji: "💎", color: "var(--exp-purple)", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)" },
];

const CATEGORIES = ["Health & Fitness", "Work & Career", "Learning", "Personal", "Finance", "Other"];

interface Props {
  onClose: () => void;
}

export default function NewTaskModal({ onClose }: Props) {
  const addTask = useStore((s) => s.addTask);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("ponctuelle");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");

  const expPreview = calcEXP(difficulty, type, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      type,
      difficulty,
      category,
      dueDate: type === "ponctuelle" && dueDate ? dueDate : undefined,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>New Quest</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to accomplish?"
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

          {/* Type */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["ponctuelle", "recurrente"] as TaskType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: type === t ? "var(--gold-dim)" : "var(--bg-elevated)",
                    border: `1px solid ${type === t ? "var(--gold-muted)" : "var(--border-subtle)"}`,
                    color: type === t ? "var(--gold)" : "var(--text-secondary)",
                  }}
                >
                  {t === "ponctuelle" ? "📌 One-time" : "🔁 Daily"}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTIES.map((d) => {
                const dropPct = Math.round(CHEST_DROP_CHANCE[d.value] * 100);
                const tiers = CHEST_DROP_TIER[d.value];
                const topTiers = (["legendary", "epic", "rare", "common"] as ChestTier[])
                  .filter((t) => tiers[t] > 0)
                  .slice(0, 2)
                  .map((t) => t.slice(0, 3))
                  .join("/");
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: difficulty === d.value ? d.bg : "var(--bg-elevated)",
                      border: `1px solid ${difficulty === d.value ? d.border : "var(--border-subtle)"}`,
                      color: difficulty === d.value ? d.color : "var(--text-muted)",
                    }}
                  >
                    <span className="text-base">{d.emoji}</span>
                    <span>{d.label}</span>
                    <span className="text-xs opacity-70">📦{dropPct}%</span>
                    <span className="text-xs opacity-50">{topTiers}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: category === c ? "var(--bg-hover)" : "var(--bg-elevated)",
                    border: `1px solid ${category === c ? "var(--border)" : "var(--border-subtle)"}`,
                    color: category === c ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Due date (only for ponctuelle) */}
          {type === "ponctuelle" && (
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Due Date <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: dueDate ? "var(--text-primary)" : "var(--text-muted)",
                  colorScheme: "dark",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-muted)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              />
            </div>
          )}

          {/* EXP preview + Submit */}
          <div className="flex items-center gap-3 pt-1">
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0"
              style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)", color: "var(--gold)" }}
            >
              <Zap size={14} />
              +{expPreview} XP
            </div>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: title.trim() ? "var(--gold)" : "var(--bg-elevated)",
                color: title.trim() ? "var(--bg-base)" : "var(--text-muted)",
                cursor: title.trim() ? "pointer" : "not-allowed",
              }}
            >
              Create Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
