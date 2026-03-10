"use client";

import TaskCard from "@/components/tasks/TaskCard";
import { Filter, Plus, Search, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useStore, type Task } from "@/lib/store";
import NewTaskModal from "@/components/tasks/NewTaskModal";

const categories = ["All", "Health & Fitness", "Work & Career", "Learning", "Personal"];
const types = ["All", "Ponctuelle", "Récurrente"];
const sortOptions = [
  { value: "created", label: "Newest" },
  { value: "difficulty", label: "Difficulty" },
  { value: "streak", label: "Streak" },
  { value: "due", label: "Due date" },
] as const;

type SortKey = typeof sortOptions[number]["value"];

const difficultyOrder = { epic: 0, hard: 1, medium: 2, easy: 3 };

function sortTasks(tasks: Task[], sort: SortKey): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sort) {
      case "difficulty":
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "streak":
        return b.streak - a.streak;
      case "due":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      case "created":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
}

export default function TasksPage() {
  const tasks = useStore((s) => s.tasks);
  const completeTask = useStore((s) => s.completeTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const isCompletedToday = useStore((s) => s.isCompletedToday);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("created");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { pending, done } = useMemo(() => {
    const base = tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || t.category === activeCategory;
      const matchType =
        activeType === "All" ||
        (activeType === "Ponctuelle" && t.type === "ponctuelle") ||
        (activeType === "Récurrente" && t.type === "recurrente");
      return matchSearch && matchCat && matchType;
    });

    const sorted = sortTasks(base, sortKey);
    return {
      pending: sorted.filter((t) => !isCompletedToday(t)),
      done: sorted.filter((t) => isCompletedToday(t)),
    };
  }, [tasks, search, activeCategory, activeType, sortKey, isCompletedToday]);

  const currentSort = sortOptions.find((o) => o.value === sortKey)!;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>All Tasks</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {tasks.length} tasks · {done.length} done today
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold glow-gold"
          style={{ background: "var(--gold)", color: "var(--bg-base)" }}
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Search + Sort */}
      <div className="flex gap-2 mb-4">
        <div
          className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          <Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu((v) => !v)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-medium transition-all h-full"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <ArrowUpDown size={14} />
            {currentSort.label}
          </button>
          {showSortMenu && (
            <div
              className="absolute right-0 top-full mt-1 z-10 rounded-xl overflow-hidden shadow-lg"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", minWidth: "120px" }}
            >
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortKey(opt.value); setShowSortMenu(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 w-full text-left text-xs transition-colors"
                  style={{
                    color: sortKey === opt.value ? "var(--gold)" : "var(--text-secondary)",
                    background: sortKey === opt.value ? "var(--gold-dim)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (sortKey !== opt.value) e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { if (sortKey !== opt.value) e.currentTarget.style.background = "transparent"; }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} style={{ color: "var(--text-muted)" }} />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeType === t ? "var(--gold-dim)" : "var(--bg-elevated)",
                border: `1px solid ${activeType === t ? "var(--gold-muted)" : "var(--border-subtle)"}`,
                color: activeType === t ? "var(--gold)" : "var(--text-secondary)",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeCategory === c ? "var(--bg-hover)" : "var(--bg-elevated)",
                border: `1px solid ${activeCategory === c ? "var(--border)" : "var(--border-subtle)"}`,
                color: activeCategory === c ? "var(--text-primary)" : "var(--text-muted)",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Pending tasks */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">⚔️</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            No quests yet. Add your first task!
          </p>
        </div>
      ) : pending.length === 0 && done.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            No tasks match your filters.
          </p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="space-y-2 mb-6">
              {pending.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  completedToday={false}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}

          {/* Done today section */}
          {done.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Done today
                </span>
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-bold"
                  style={{ background: "rgba(74,222,128,0.1)", color: "var(--exp-green)" }}
                >
                  {done.length}
                </span>
              </div>
              <div className="space-y-2">
                {done.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    completedToday={true}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {modalOpen && <NewTaskModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
