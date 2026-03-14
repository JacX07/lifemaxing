"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useStore, weekKeyStr, type Task } from "@/lib/store";
import NewTaskModal from "@/components/tasks/NewTaskModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentWeekDays(): Date[] {
  const today = new Date();
  const day = today.getDay() || 7; // Mon=1 … Sun=7
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const DAY_JS    = [1, 2, 3, 4, 5, 6, 0]; // col index → getDay()
const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const diffColors: Record<string, { color: string; bg: string; border: string }> = {
  easy:   { color: "var(--exp-green)",  bg: "rgba(74,222,128,0.10)",  border: "rgba(74,222,128,0.25)" },
  medium: { color: "var(--exp-blue)",   bg: "rgba(96,165,250,0.10)",  border: "rgba(96,165,250,0.25)" },
  hard:   { color: "var(--exp-orange)", bg: "rgba(251,146,60,0.10)",  border: "rgba(251,146,60,0.25)" },
  epic:   { color: "var(--exp-purple)", bg: "rgba(192,132,252,0.10)", border: "rgba(192,132,252,0.25)" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const tasks          = useStore((s) => s.tasks);
  const completeTask   = useStore((s) => s.completeTask);
  const isCompletedToday = useStore((s) => s.isCompletedToday);
  const [modalOpen, setModalOpen] = useState(false);

  const weekDays   = getCurrentWeekDays();
  const todayStr   = toDateStr(new Date());
  const currentWeek = weekKeyStr();

  const fixeTasks  = tasks.filter((t) => t.type === "fixe");
  const hebdoTasks = tasks.filter((t) => t.type === "hebdomadaire");

  function tasksForCol(colIndex: number): Task[] {
    return fixeTasks
      .filter((t) => t.fixedDays?.includes(DAY_JS[colIndex]))
      .sort((a, b) => (a.fixedStartTime ?? "").localeCompare(b.fixedStartTime ?? ""));
  }

  const isEmpty = fixeTasks.length === 0 && hebdoTasks.length === 0;

  // Week range label
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  const weekLabel = `${fmt(weekDays[0])} – ${fmt(weekDays[6])}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Emploi du Temps
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Semaine du {weekLabel}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold glow-gold hover:opacity-80 transition-opacity"
          style={{ background: "var(--gold)", color: "var(--bg-base)" }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {isEmpty ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-3">🗓️</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Aucune tâche planifiée. Crée une tâche Fixe ou Hebdomadaire !
          </p>
        </div>
      ) : (
        <>
          {/* ── Desktop grid ──────────────────────────────────────────── */}
          {fixeTasks.length > 0 && (
            <div className="hidden sm:grid grid-cols-7 gap-2 mb-8">
              {weekDays.map((day, colIndex) => {
                const isToday   = toDateStr(day) === todayStr;
                const colTasks  = tasksForCol(colIndex);
                return (
                  <div
                    key={colIndex}
                    className="rounded-xl p-2 min-h-[140px] flex flex-col gap-1.5"
                    style={{
                      background: isToday ? "var(--bg-elevated)" : "var(--bg-surface)",
                      border: `1px solid ${isToday ? "var(--gold-muted)" : "var(--border-subtle)"}`,
                    }}
                  >
                    {/* Column header */}
                    <div className="text-center pb-1.5 border-b mb-1" style={{ borderColor: "var(--border-subtle)" }}>
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: isToday ? "var(--gold)" : "var(--text-muted)" }}
                      >
                        {DAY_LABELS[colIndex]}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: isToday ? "var(--gold)" : "var(--text-secondary)" }}
                      >
                        {day.getDate()}
                      </p>
                    </div>

                    {/* Chips */}
                    {colTasks.map((task) => {
                      const done     = isCompletedToday(task) && isToday;
                      const dc       = diffColors[task.difficulty];
                      const clickable = isToday && !done;
                      return (
                        <button
                          key={task.id}
                          onClick={() => clickable && completeTask(task.id)}
                          className="w-full text-left rounded-lg px-2 py-1.5 text-xs transition-all hover:opacity-80"
                          style={{
                            background: done ? "var(--gold-dim)" : (isToday ? dc.bg : "var(--bg-hover)"),
                            border: `1px solid ${done ? "var(--gold-muted)" : (isToday ? dc.border : "var(--border-subtle)")}`,
                            color: done ? "var(--gold)" : (isToday ? dc.color : "var(--text-muted)"),
                            opacity: !isToday ? 0.5 : 1,
                            cursor: clickable ? "pointer" : "default",
                          }}
                        >
                          {done && <Check size={9} className="inline mr-1" />}
                          <span className="font-medium block truncate">{task.title}</span>
                          {(task.fixedStartTime || task.fixedEndTime) && (
                            <span className="opacity-70">
                              {task.fixedStartTime}{task.fixedEndTime ? `→${task.fixedEndTime}` : ""}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Mobile list ───────────────────────────────────────────── */}
          {fixeTasks.length > 0 && (
            <div className="sm:hidden space-y-3 mb-8">
              {weekDays
                .map((day, colIndex) => ({ day, colIndex, tasks: tasksForCol(colIndex) }))
                .filter(({ tasks }) => tasks.length > 0)
                .sort((a, b) => {
                  // Today first
                  const aToday = toDateStr(a.day) === todayStr ? 0 : 1;
                  const bToday = toDateStr(b.day) === todayStr ? 0 : 1;
                  return aToday - bToday || a.colIndex - b.colIndex;
                })
                .map(({ day, colIndex, tasks: colTasks }) => {
                  const isToday = toDateStr(day) === todayStr;
                  return (
                    <div key={colIndex}>
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                        style={{ color: isToday ? "var(--gold)" : "var(--text-muted)" }}
                      >
                        {isToday ? "Aujourd'hui" : DAY_LABELS[colIndex]} — {day.getDate()}
                      </p>
                      <div className="space-y-1.5">
                        {colTasks.map((task) => {
                          const done     = isCompletedToday(task) && isToday;
                          const dc       = diffColors[task.difficulty];
                          const clickable = isToday && !done;
                          return (
                            <button
                              key={task.id}
                              onClick={() => clickable && completeTask(task.id)}
                              className="w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all hover:opacity-80"
                              style={{
                                background: done ? "var(--gold-dim)" : dc.bg,
                                border: `1px solid ${done ? "var(--gold-muted)" : dc.border}`,
                                opacity: !isToday ? 0.5 : 1,
                                cursor: clickable ? "pointer" : "default",
                              }}
                            >
                              <div
                                className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0"
                                style={{
                                  borderColor: done ? "var(--gold-muted)" : dc.color,
                                  background: done ? "var(--gold-dim)" : "transparent",
                                }}
                              >
                                {done && <Check size={10} style={{ color: "var(--gold)" }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: done ? "var(--gold)" : dc.color }}>
                                  {task.title}
                                </p>
                                {(task.fixedStartTime || task.fixedEndTime) && (
                                  <p className="text-xs opacity-70" style={{ color: dc.color }}>
                                    {task.fixedStartTime}{task.fixedEndTime ? `→${task.fixedEndTime}` : ""}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* ── Flexible section (hebdomadaire) ───────────────────────── */}
          {hebdoTasks.length > 0 && (
            <div>
              <h2
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                Tâches Flexibles
              </h2>
              <div className="space-y-3">
                {hebdoTasks.map((task) => {
                  const count  = task.weekKey === currentWeek ? (task.weekCount ?? 0) : 0;
                  const target = task.weeklyTarget ?? 2;
                  const pct    = Math.min(Math.round((count / target) * 100), 100);
                  const done   = isCompletedToday(task);
                  const full   = count >= target;
                  return (
                    <div
                      key={task.id}
                      className="rounded-xl p-4"
                      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {task.title}
                          </span>
                          {task.category && (
                            <span className="px-1.5 py-0.5 rounded text-xs flex-shrink-0" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                              {task.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span
                            className="text-xs font-semibold"
                            style={{ color: full ? "var(--exp-green)" : "var(--text-muted)" }}
                          >
                            {count}/{target}
                          </span>
                          <button
                            onClick={() => !done && completeTask(task.id)}
                            className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                            style={{
                              borderColor: done ? "var(--gold-muted)" : "var(--border)",
                              background: done ? "var(--gold-dim)" : "transparent",
                              cursor: done ? "default" : "pointer",
                            }}
                          >
                            {done && <Check size={11} style={{ color: "var(--gold)" }} />}
                          </button>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: full ? "var(--exp-green)" : "var(--gold)",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <NewTaskModal defaultType="fixe" onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
