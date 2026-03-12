"use client";

import { useState } from "react";
import Link from "next/link";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import DashboardSection from "@/components/dashboard/DashboardSection";
import TaskCard from "@/components/tasks/TaskCard";
import NewTaskModal from "@/components/tasks/NewTaskModal";
import { useStore } from "@/lib/store";
import { CHARACTERS_BY_ID } from "@/lib/characters";

const UNIVERSE_EMOJI: Record<string, string> = {
  onepiece: "🏴‍☠️", naruto: "🍃", dragonball: "⚡", aot: "⚔️", rickmorty: "🌀",
};
const RARITY_COLOR: Record<string, string> = {
  common: "var(--text-secondary)", rare: "var(--exp-blue)", epic: "var(--exp-purple)", legendary: "var(--gold)",
};

export default function DashboardPage() {
  const tasks = useStore((s) => s.tasks);
  const completeTask = useStore((s) => s.completeTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const isCompletedToday = useStore((s) => s.isCompletedToday);
  const profile = useStore((s) => s.profile);

  const [modalOpen, setModalOpen] = useState(false);

  const dailyTasks = tasks.filter((t) => t.type === "recurrente");
  const dailyDone = dailyTasks.filter((t) => isCompletedToday(t)).length;
  const dailyPct = dailyTasks.length > 0 ? Math.round((dailyDone / dailyTasks.length) * 100) : 0;

  const upcomingTasks = tasks.filter(
    (t) => t.type === "ponctuelle" && !isCompletedToday(t)
  );

  // Last obtained character
  const lastOwned = profile.ownedCharacters.length > 0
    ? [...profile.ownedCharacters].sort((a, b) => b.ownedAt.localeCompare(a.ownedAt))[0]
    : null;
  const lastChar = lastOwned ? CHARACTERS_BY_ID[lastOwned.characterId] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <ProfileHeader />

      {/* Daily progress + last character row */}
      {(dailyTasks.length > 0 || lastChar) && (
        <div className="flex gap-4 mb-6">
          {/* Daily completion ring */}
          {dailyTasks.length > 0 && (
            <div
              className="flex-1 rounded-2xl p-4 flex items-center gap-4"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              {/* SVG ring */}
              <div className="relative flex-shrink-0 w-14 h-14">
                <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                  <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" stroke="var(--bg-hover)" />
                  <circle
                    cx="28" cy="28" r="22" fill="none" strokeWidth="5"
                    stroke={dailyPct === 100 ? "var(--exp-green)" : "var(--gold)"}
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 22}`}
                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - dailyPct / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: dailyPct === 100 ? "var(--exp-green)" : "var(--gold)" }}>
                    {dailyPct}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Daily Quests</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {dailyDone} / {dailyTasks.length} completed
                </p>
                {dailyPct === 100 && (
                  <p className="text-xs mt-1 font-semibold" style={{ color: "var(--exp-green)" }}>
                    All done! 🎉
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Last character */}
          {lastChar && (
            <Link
              href="/shop?tab=collection"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:opacity-80"
              style={{ background: "var(--bg-surface)", border: `1px solid ${RARITY_COLOR[lastChar.rarity]}30` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "var(--bg-elevated)", border: `1px solid ${RARITY_COLOR[lastChar.rarity]}50` }}
              >
                {UNIVERSE_EMOJI[lastChar.universe]}
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Last drop</p>
                <p className="text-sm font-bold" style={{ color: RARITY_COLOR[lastChar.rarity] }}>{lastChar.name}</p>
                <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{lastChar.rarity}</p>
              </div>
            </Link>
          )}
        </div>
      )}

      <DashboardSection title="Daily Quests" count={dailyTasks.length} onAdd={() => setModalOpen(true)}>
        {dailyTasks.length > 0 ? (
          dailyTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              completedToday={isCompletedToday(task)}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        ) : undefined}
      </DashboardSection>

      <DashboardSection title="Upcoming" count={upcomingTasks.length} onAdd={() => setModalOpen(true)}>
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              completedToday={isCompletedToday(task)}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          ))
        ) : undefined}
      </DashboardSection>

      {modalOpen && <NewTaskModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
