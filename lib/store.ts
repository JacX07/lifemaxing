"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard" | "epic";
export type TaskType = "ponctuelle" | "recurrente";

export interface Toast {
  id: string;
  type: "exp" | "levelup";
  exp?: number;
  level?: number;
  taskTitle?: string;
  combo?: number;
}

const COMBO_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function comboMultiplier(combo: number): number {
  if (combo >= 5) return 2.0;
  if (combo >= 4) return 1.5;
  if (combo >= 3) return 1.25;
  if (combo >= 2) return 1.1;
  return 1.0;
}

export function comboLabel(combo: number): string {
  if (combo >= 5) return "LEGENDARY";
  if (combo >= 4) return "EPIC";
  if (combo >= 3) return "GREAT";
  if (combo >= 2) return "NICE";
  return "";
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  difficulty: Difficulty;
  category: string;
  dueDate?: string; // YYYY-MM-DD, for ponctuelle
  streak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  createdAt: string;
}

export interface Profile {
  name: string;
  avatar: string;
  totalEXP: number;
  streak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayTasksDone: number;
  todayEXPEarned: number;
  allTimeTasksDone: number;
}

// ─── EXP helpers ──────────────────────────────────────────────────────────────

const BASE_EXP: Record<Difficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  epic: 100,
};

export function calcEXP(difficulty: Difficulty, type: TaskType, streak: number): number {
  let exp = BASE_EXP[difficulty];
  if (type === "recurrente") exp *= 1.1;
  if (streak >= 30) exp *= 2.0;
  else if (streak >= 14) exp *= 1.5;
  else if (streak >= 7) exp *= 1.25;
  else if (streak >= 3) exp *= 1.1;
  return Math.round(exp);
}

// ─── Level helpers ────────────────────────────────────────────────────────────

// EXP needed to go from level N to N+1 = N * 100
// Level 1→2: 100, Level 2→3: 200, etc.
export function calcExpProgress(totalEXP: number): {
  level: number;
  currentEXP: number;
  expToNext: number;
} {
  let level = 1;
  let remaining = totalEXP;
  while (remaining >= level * 100) {
    remaining -= level * 100;
    level++;
  }
  return { level, currentEXP: remaining, expToNext: level * 100 };
}

const TITLES: Record<number, string> = {
  1: "Dabbler",
  2: "Apprentice",
  3: "Journeyman",
  4: "Adept",
  5: "Veteran",
  6: "Expert",
  7: "Master",
  8: "Grandmaster",
  9: "Legend",
};

export function getTitle(level: number): string {
  return TITLES[Math.min(level, 9)] ?? "Mythic";
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface StoreState {
  tasks: Task[];
  profile: Profile;
  toasts: Toast[];
  combo: number;
  lastComboTime: number; // timestamp ms

  // Actions
  addTask: (input: {
    title: string;
    type: TaskType;
    difficulty: Difficulty;
    category: string;
    dueDate?: string;
  }) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Pick<Task, "title" | "difficulty" | "category" | "dueDate">>) => void;
  updateProfile: (updates: Partial<Pick<Profile, "name" | "avatar">>) => void;
  checkDailyReset: () => void;
  dismissToast: (id: string) => void;

  // Derived helpers
  getExpProgress: () => {
    level: number;
    currentEXP: number;
    expToNext: number;
    progressPct: number;
    title: string;
  };
  isCompletedToday: (task: Task) => boolean;
}

const DEFAULT_PROFILE: Profile = {
  name: "Player",
  avatar: "🧙‍♂️",
  totalEXP: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveDate: "",
  todayTasksDone: 0,
  todayEXPEarned: 0,
  allTimeTasksDone: 0,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      profile: DEFAULT_PROFILE,
      toasts: [],
      combo: 0,
      lastComboTime: 0,

      isCompletedToday: (task: Task) => task.lastCompletedDate === todayStr(),

      addTask: ({ title, type, difficulty, category, dueDate }) => {
        const task: Task = {
          id: nanoid(),
          title,
          type,
          difficulty,
          category,
          dueDate,
          streak: 0,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
      },

      completeTask: (id: string) => {
        const today = todayStr();
        const yesterday = yesterdayStr();
        const { tasks, profile } = get();
        const task = tasks.find((t) => t.id === id);
        if (!task || task.lastCompletedDate === today) return;

        // Update task streak
        const isConsecutive = task.lastCompletedDate === yesterday;
        const newStreak = isConsecutive ? task.streak + 1 : 1;
        const exp = calcEXP(task.difficulty, task.type, newStreak);

        const updatedTask: Task = {
          ...task,
          streak: newStreak,
          lastCompletedDate: today,
        };

        // Combo
        const now = Date.now();
        const { combo: prevCombo, lastComboTime } = get();
        const withinWindow = now - lastComboTime < COMBO_WINDOW_MS;
        const newCombo = withinWindow ? prevCombo + 1 : 1;

        // Apply combo multiplier on top of base EXP
        const comboMult = comboMultiplier(newCombo);
        const finalExp = Math.round(exp * comboMult);

        // Update profile streak (first task of the day)
        let newProfileStreak = profile.streak;
        let todayTasksDone = profile.todayTasksDone;
        let todayEXPEarned = profile.todayEXPEarned;

        if (profile.lastActiveDate !== today) {
          const continued = profile.lastActiveDate === yesterday;
          newProfileStreak = continued ? profile.streak + 1 : 1;
          todayTasksDone = 0;
          todayEXPEarned = 0;
        }

        const newTodayDone = todayTasksDone + 1;
        const newTodayEXP = todayEXPEarned + finalExp;
        const newBestStreak = Math.max(profile.bestStreak, newProfileStreak);

        const oldLevel = calcExpProgress(profile.totalEXP).level;
        const newTotalEXP = profile.totalEXP + finalExp;
        const newLevel = calcExpProgress(newTotalEXP).level;
        const leveledUp = newLevel > oldLevel;

        const newToasts: Toast[] = [
          { id: nanoid(), type: "exp", exp: finalExp, taskTitle: task.title, combo: newCombo },
          ...(leveledUp ? [{ id: nanoid(), type: "levelup" as const, level: newLevel }] : []),
        ];

        set((s) => ({
          tasks: tasks.map((t) => (t.id === id ? updatedTask : t)),
          profile: {
            ...profile,
            totalEXP: newTotalEXP,
            streak: newProfileStreak,
            bestStreak: newBestStreak,
            lastActiveDate: today,
            todayTasksDone: newTodayDone,
            todayEXPEarned: newTodayEXP,
            allTimeTasksDone: profile.allTimeTasksDone + 1,
          },
          toasts: [...s.toasts, ...newToasts],
          combo: newCombo,
          lastComboTime: now,
        }));
      },

      deleteTask: (id: string) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      updateTask: (id, updates) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      updateProfile: (updates) => {
        set((s) => ({ profile: { ...s.profile, ...updates } }));
      },

      dismissToast: (id: string) => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },

      checkDailyReset: () => {
        const today = todayStr();
        const yesterday = yesterdayStr();
        const { profile } = get();

        if (profile.lastActiveDate === today) return; // Already checked today

        // Reset today's counters
        const missed = profile.lastActiveDate !== yesterday && profile.lastActiveDate !== "";
        set((s) => ({
          profile: {
            ...s.profile,
            streak: missed ? 0 : s.profile.streak,
            todayTasksDone: 0,
            todayEXPEarned: 0,
          },
        }));
      },

      getExpProgress: () => {
        const { totalEXP } = get().profile;
        const { level, currentEXP, expToNext } = calcExpProgress(totalEXP);
        const progressPct = Math.round((currentEXP / expToNext) * 100);
        return { level, currentEXP, expToNext, progressPct, title: getTitle(level) };
      },
    }),
    {
      name: "lifemaxing-store",
      partialize: (s) => ({ tasks: s.tasks, profile: s.profile }),
    }
  )
);
