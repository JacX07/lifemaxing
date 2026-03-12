export interface Theme {
  id: string;
  name: string;
  universe: string;
  cost: number; // 0 = free
  emoji: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: "default",
    name: "Dark Gold",
    universe: "Default",
    cost: 0,
    emoji: "⚔️",
    vars: {
      "--bg-base":      "#0d0b08",
      "--bg-surface":   "#161310",
      "--bg-elevated":  "#1e1a14",
      "--bg-hover":     "#251f17",
      "--border":       "#2e2720",
      "--border-subtle":"#211c16",
      "--gold":         "#d4a84b",
      "--gold-bright":  "#f0c060",
      "--gold-muted":   "#8a6820",
      "--gold-dim":     "#3d2e10",
      "--text-primary": "#f0e8d8",
      "--text-secondary":"#a89880",
      "--text-muted":   "#5a5040",
    },
  },
  {
    id: "onepiece",
    name: "Grand Line",
    universe: "One Piece",
    cost: 500,
    emoji: "🏴‍☠️",
    vars: {
      "--bg-base":      "#0a0e1a",
      "--bg-surface":   "#0d1220",
      "--bg-elevated":  "#111828",
      "--bg-hover":     "#162035",
      "--border":       "#1e2d4a",
      "--border-subtle":"#162038",
      "--gold":         "#f97316",
      "--gold-bright":  "#fb923c",
      "--gold-muted":   "#9a3412",
      "--gold-dim":     "#431407",
      "--text-primary": "#fef3c7",
      "--text-secondary":"#a78bfa",
      "--text-muted":   "#4c5679",
    },
  },
  {
    id: "naruto",
    name: "Hidden Leaf",
    universe: "Naruto",
    cost: 500,
    emoji: "🍃",
    vars: {
      "--bg-base":      "#080d08",
      "--bg-surface":   "#0c130c",
      "--bg-elevated":  "#111a11",
      "--bg-hover":     "#162016",
      "--border":       "#1e2e1e",
      "--border-subtle":"#162216",
      "--gold":         "#4ade80",
      "--gold-bright":  "#86efac",
      "--gold-muted":   "#166534",
      "--gold-dim":     "#052e16",
      "--text-primary": "#f0fdf4",
      "--text-secondary":"#a3e635",
      "--text-muted":   "#365314",
    },
  },
  {
    id: "dragonball",
    name: "Super Saiyan",
    universe: "Dragon Ball",
    cost: 800,
    emoji: "⚡",
    vars: {
      "--bg-base":      "#0d0a00",
      "--bg-surface":   "#141000",
      "--bg-elevated":  "#1c1600",
      "--bg-hover":     "#241c00",
      "--border":       "#332800",
      "--border-subtle":"#261e00",
      "--gold":         "#facc15",
      "--gold-bright":  "#fde047",
      "--gold-muted":   "#a16207",
      "--gold-dim":     "#3f2d00",
      "--text-primary": "#fefce8",
      "--text-secondary":"#fbbf24",
      "--text-muted":   "#5c4a00",
    },
  },
  {
    id: "aot",
    name: "Survey Corps",
    universe: "Attack on Titan",
    cost: 800,
    emoji: "⚔️",
    vars: {
      "--bg-base":      "#090b0f",
      "--bg-surface":   "#0d1117",
      "--bg-elevated":  "#111820",
      "--bg-hover":     "#162030",
      "--border":       "#1e2d3d",
      "--border-subtle":"#162030",
      "--gold":         "#60a5fa",
      "--gold-bright":  "#93c5fd",
      "--gold-muted":   "#1d4ed8",
      "--gold-dim":     "#0c1f5c",
      "--text-primary": "#e2e8f0",
      "--text-secondary":"#7dd3fc",
      "--text-muted":   "#1e3a5f",
    },
  },
];

export const THEMES_BY_ID: Record<string, Theme> = Object.fromEntries(
  THEMES.map((t) => [t.id, t])
);

export function applyTheme(themeId: string | null) {
  if (typeof document === "undefined") return;
  const theme = THEMES_BY_ID[themeId ?? "default"] ?? THEMES_BY_ID["default"];
  for (const [key, value] of Object.entries(theme.vars)) {
    document.documentElement.style.setProperty(key, value);
  }
}
