"use client";

import { useState } from "react";
import { X, Zap } from "lucide-react";
import { useStore, type Difficulty, type TaskType, type Task, calcEXP, CHEST_DROP_CHANCE, CHEST_DROP_TIER, type ChestTier } from "@/lib/store";

const DIFFICULTIES: { value: Difficulty; label: string; emoji: string; color: string; bg: string; border: string }[] = [
  { value: "easy",   label: "Easy",   emoji: "🌱", color: "var(--exp-green)",  bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.2)" },
  { value: "medium", label: "Medium", emoji: "⚡", color: "var(--exp-blue)",   bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)" },
  { value: "hard",   label: "Hard",   emoji: "🔥", color: "var(--exp-orange)", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.2)" },
  { value: "epic",   label: "Epic",   emoji: "💎", color: "var(--exp-purple)", bg: "rgba(192,132,252,0.08)", border: "rgba(192,132,252,0.2)" },
];

const CATEGORIES = ["Health & Fitness", "Work & Career", "Learning", "Personal", "Finance", "Other"];

interface Props {
  onClose: () => void;
  editTask?: Task;
  defaultType?: TaskType;
}

export default function NewTaskModal({ onClose, editTask, defaultType }: Props) {
  const addTask = useStore((s) => s.addTask);
  const updateTask = useStore((s) => s.updateTask);

  const [title, setTitle] = useState(editTask?.title ?? "");
  const [type, setType] = useState<TaskType>(editTask?.type ?? defaultType ?? "ponctuelle");
  const [difficulty, setDifficulty] = useState<Difficulty>(editTask?.difficulty ?? "medium");
  const [category, setCategory] = useState(editTask?.category ?? "Personal");
  const [dueDate, setDueDate] = useState(editTask?.dueDate ?? "");
  const [weeklyTarget, setWeeklyTarget] = useState<number>(editTask?.weeklyTarget ?? 2);
  const [fixedDays, setFixedDays] = useState<number[]>(editTask?.fixedDays ?? []);
  const [fixedStartTime, setFixedStartTime] = useState(editTask?.fixedStartTime ?? "");
  const [fixedEndTime, setFixedEndTime] = useState(editTask?.fixedEndTime ?? "");

  const expPreview = calcEXP(difficulty, type, 0);

  const isFixe = editTask ? editTask.type === "fixe" : type === "fixe";
  const canSubmit = title.trim() && !(isFixe && fixedDays.length === 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    if (editTask) {
      updateTask(editTask.id, {
        title: title.trim(),
        difficulty,
        category,
        dueDate: editTask.type === "ponctuelle" && dueDate ? dueDate : undefined,
        weeklyTarget: editTask.type === "hebdomadaire" ? weeklyTarget : undefined,
        fixedDays: editTask.type === "fixe" ? fixedDays : undefined,
        fixedStartTime: editTask.type === "fixe" ? fixedStartTime : undefined,
        fixedEndTime: editTask.type === "fixe" ? fixedEndTime : undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        type,
        difficulty,
        category,
        dueDate: type === "ponctuelle" && dueDate ? dueDate : undefined,
        weeklyTarget: type === "hebdomadaire" ? weeklyTarget : undefined,
        fixedDays: type === "fixe" ? fixedDays : undefined,
        fixedStartTime: type === "fixe" ? fixedStartTime : undefined,
        fixedEndTime: type === "fixe" ? fixedEndTime : undefined,
      });
    }
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
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {editTask ? "Edit Quest" : "New Quest"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
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

          {/* Type — hidden in edit mode to preserve streaks */}
          {!editTask && (
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "ponctuelle",   label: "📌 One-time" },
                { value: "recurrente",   label: "🔁 Daily" },
                { value: "hebdomadaire", label: "📅 Weekly" },
                { value: "fixe",         label: "📆 Fixe" },
              ] as { value: TaskType; label: string }[]).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    background: type === t.value ? "var(--gold-dim)" : "var(--bg-elevated)",
                    border: `1px solid ${type === t.value ? "var(--gold-muted)" : "var(--border-subtle)"}`,
                    color: type === t.value ? "var(--gold)" : "var(--text-secondary)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Weekly target — shown when type is hebdomadaire OR editing a hebdomadaire task */}
          {(type === "hebdomadaire" || editTask?.type === "hebdomadaire") && (
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Times per week
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setWeeklyTarget(n)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    background: weeklyTarget === n ? "var(--gold-dim)" : "var(--bg-elevated)",
                    border: `1px solid ${weeklyTarget === n ? "var(--gold-muted)" : "var(--border-subtle)"}`,
                    color: weeklyTarget === n ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Fixed days — shown for fixe type */}
          {(type === "fixe" || editTask?.type === "fixe") && (
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Jours de la semaine
              </label>
              <div className="flex gap-1.5">
                {([
                  { label: "L", value: 1 },
                  { label: "M", value: 2 },
                  { label: "M", value: 3 },
                  { label: "J", value: 4 },
                  { label: "V", value: 5 },
                  { label: "S", value: 6 },
                  { label: "D", value: 0 },
                ]).map(({ label, value }) => {
                  const active = fixedDays.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFixedDays(active ? fixedDays.filter((d) => d !== value) : [...fixedDays, value])}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                      style={{
                        background: active ? "var(--gold-dim)" : "var(--bg-elevated)",
                        border: `1px solid ${active ? "var(--gold-muted)" : "var(--border-subtle)"}`,
                        color: active ? "var(--gold)" : "var(--text-muted)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fixed time — shown for fixe type */}
          {(type === "fixe" || editTask?.type === "fixe") && (
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Horaire <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optionnel)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={fixedStartTime}
                  onChange={(e) => setFixedStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: fixedStartTime ? "var(--text-primary)" : "var(--text-muted)", colorScheme: "dark" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-muted)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
                <input
                  type="time"
                  value={fixedEndTime}
                  onChange={(e) => setFixedEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: fixedEndTime ? "var(--text-primary)" : "var(--text-muted)", colorScheme: "dark" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold-muted)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                />
              </div>
            </div>
          )}

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
                    className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all hover:opacity-80"
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
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
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
          {(editTask ? editTask.type === "ponctuelle" : type === "ponctuelle") && (
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
              disabled={!canSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all enabled:hover:opacity-80"
              style={{
                background: canSubmit ? "var(--gold)" : "var(--bg-elevated)",
                color: canSubmit ? "var(--bg-base)" : "var(--text-muted)",
                cursor: canSubmit ? "pointer" : "not-allowed",
              }}
            >
              {editTask ? "Save" : "Create Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
