"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { CHARACTERS, type Rarity } from "./characters";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard" | "epic";
export type TaskType = "ponctuelle" | "recurrente";
export type ChestTier = "common" | "rare" | "epic" | "legendary";

export interface Toast {
  id: string;
  type: "exp" | "levelup" | "chest";
  exp?: number;
  level?: number;
  taskTitle?: string;
  combo?: number;
  chestTier?: ChestTier;
}

export interface ChestResult {
  characterId: string;
  isNew: boolean;
  gold: number;
  chestTier: ChestTier;
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

export interface OwnedCharacter {
  characterId: string;
  count: number;
  ownedAt: string; // ISO date of first acquisition
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
  // Gacha
  gold: number;
  chests: Record<ChestTier, number>;
  ownedCharacters: OwnedCharacter[];
  // Themes
  equippedTheme: string | null;
  purchasedThemes: string[];
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

// ─── Gacha helpers ────────────────────────────────────────────────────────────

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Rarity distribution per chest tier
const CHEST_RARITY_WEIGHTS: Record<ChestTier, Record<Rarity, number>> = {
  common:    { common: 70, rare: 25, epic: 5,  legendary: 0  },
  rare:      { common: 40, rare: 40, epic: 15, legendary: 5  },
  epic:      { common: 15, rare: 35, epic: 35, legendary: 15 },
  legendary: { common: 5,  rare: 15, epic: 40, legendary: 40 },
};

// Gold range per chest tier [min, max]
const CHEST_GOLD_RANGE: Record<ChestTier, [number, number]> = {
  common:    [10,  30],
  rare:      [30,  80],
  epic:      [80,  200],
  legendary: [200, 500],
};

// Chest drop chance per difficulty
export const CHEST_DROP_CHANCE: Record<Difficulty, number> = {
  easy:   0.05,
  medium: 0.15,
  hard:   0.35,
  epic:   0.60,
};

// Chest tier distribution when a drop occurs
export const CHEST_DROP_TIER: Record<Difficulty, Record<ChestTier, number>> = {
  easy:   { common: 90, rare: 10, epic: 0,  legendary: 0  },
  medium: { common: 60, rare: 35, epic: 5,  legendary: 0  },
  hard:   { common: 30, rare: 40, epic: 25, legendary: 5  },
  epic:   { common: 10, rare: 30, epic: 40, legendary: 20 },
};

function rollChestDrop(difficulty: Difficulty): ChestTier | null {
  if (Math.random() > CHEST_DROP_CHANCE[difficulty]) return null;
  const tiers: ChestTier[] = ["common", "rare", "epic", "legendary"];
  const w = CHEST_DROP_TIER[difficulty];
  return weightedRandom(tiers, tiers.map((t) => w[t]));
}

export function rollChestOpen(tier: ChestTier, ownedCharacters: OwnedCharacter[]): ChestResult {
  // 1. Roll character rarity
  const rarities: Rarity[] = ["common", "rare", "epic", "legendary"];
  const rw = CHEST_RARITY_WEIGHTS[tier];
  const rolledRarity = weightedRandom(rarities, rarities.map((r) => rw[r]));

  // 2. Pick random character of that rarity
  const pool = CHARACTERS.filter((c) => c.rarity === rolledRarity);
  const character = pool[Math.floor(Math.random() * pool.length)];

  // 3. Roll gold
  const [min, max] = CHEST_GOLD_RANGE[tier];
  const gold = Math.floor(Math.random() * (max - min + 1)) + min;

  // 4. Is it new?
  const alreadyOwned = ownedCharacters.some((o) => o.characterId === character.id);

  return { characterId: character.id, isNew: !alreadyOwned, gold, chestTier: tier };
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface StoreState {
  tasks: Task[];
  profile: Profile;
  toasts: Toast[];
  combo: number;
  lastComboTime: number; // timestamp ms
  pendingChestResult: ChestResult | null; // ephemeral — triggers ChestOpenModal

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
  openChest: (tier: ChestTier) => void;
  clearPendingChestResult: () => void;
  buyTheme: (themeId: string, cost: number) => boolean;
  equipTheme: (themeId: string) => void;

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
  gold: 0,
  chests: { common: 0, rare: 0, epic: 0, legendary: 0 },
  ownedCharacters: [],
  equippedTheme: null,
  purchasedThemes: ["default"],
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: [],
      profile: DEFAULT_PROFILE,
      toasts: [],
      combo: 0,
      lastComboTime: 0,
      pendingChestResult: null,

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

        // Chest drop
        const droppedChest = rollChestDrop(task.difficulty);

        // New chests count
        const newChests = { ...profile.chests };
        if (droppedChest) newChests[droppedChest] += 1;
        if (leveledUp) newChests.rare += 1; // Level up bonus

        const newToasts: Toast[] = [
          { id: nanoid(), type: "exp", exp: finalExp, taskTitle: task.title, combo: newCombo },
          ...(leveledUp ? [{ id: nanoid(), type: "levelup" as const, level: newLevel }] : []),
          ...(droppedChest ? [{ id: nanoid(), type: "chest" as const, chestTier: droppedChest }] : []),
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
            chests: newChests,
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

      openChest: (tier: ChestTier) => {
        const { profile } = get();
        if (profile.chests[tier] <= 0) return;

        const result = rollChestOpen(tier, profile.ownedCharacters);

        // Update owned characters
        const existing = profile.ownedCharacters.find((o) => o.characterId === result.characterId);
        const newOwned = existing
          ? profile.ownedCharacters.map((o) =>
              o.characterId === result.characterId ? { ...o, count: o.count + 1 } : o
            )
          : [
              ...profile.ownedCharacters,
              { characterId: result.characterId, count: 1, ownedAt: new Date().toISOString() },
            ];

        set((s) => ({
          profile: {
            ...s.profile,
            chests: { ...s.profile.chests, [tier]: s.profile.chests[tier] - 1 },
            gold: s.profile.gold + result.gold,
            ownedCharacters: newOwned,
          },
          pendingChestResult: result,
        }));
      },

      clearPendingChestResult: () => set({ pendingChestResult: null }),

      buyTheme: (themeId: string, cost: number) => {
        const { profile } = get();
        if (profile.purchasedThemes.includes(themeId)) return false;
        if (profile.gold < cost) return false;
        set((s) => ({
          profile: {
            ...s.profile,
            gold: s.profile.gold - cost,
            purchasedThemes: [...s.profile.purchasedThemes, themeId],
          },
        }));
        return true;
      },

      equipTheme: (themeId: string) => {
        set((s) => ({ profile: { ...s.profile, equippedTheme: themeId } }));
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
      // Deep-merge profile so new fields get their defaults when loading old persisted data
      merge: (persisted, current) => {
        const p = persisted as typeof current;
        return {
          ...current,
          ...p,
          profile: {
            ...current.profile,
            ...(p?.profile ?? {}),
            chests: { ...current.profile.chests, ...(p?.profile?.chests ?? {}) },
            ownedCharacters: p?.profile?.ownedCharacters ?? current.profile.ownedCharacters,
            purchasedThemes: p?.profile?.purchasedThemes ?? current.profile.purchasedThemes,
          },
        };
      },
    }
  )
);
