"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Check, ShoppingCart } from "lucide-react";
import { useStore, type ChestTier } from "@/lib/store";
import { CHARACTERS, CHARACTERS_BY_ID, type Universe } from "@/lib/characters";
import { THEMES } from "@/lib/themes";

const CHEST_CONFIG: Record<ChestTier, { label: string; color: string; border: string; glow: string; emoji: string; desc: string }> = {
  common:    { label: "Common",    color: "var(--text-secondary)", border: "var(--border)",       glow: "rgba(90,80,64,0.2)",   emoji: "📦", desc: "Mostly common characters" },
  rare:      { label: "Rare",      color: "var(--exp-blue)",       border: "rgba(96,165,250,0.4)", glow: "rgba(96,165,250,0.2)", emoji: "💎", desc: "A mix of common & rare" },
  epic:      { label: "Epic",      color: "var(--exp-purple)",     border: "rgba(192,132,252,0.4)",glow: "rgba(192,132,252,0.2)",emoji: "🔮", desc: "Rare & epic characters" },
  legendary: { label: "Legendary", color: "var(--gold)",           border: "var(--gold-muted)",   glow: "rgba(212,168,75,0.3)", emoji: "👑", desc: "Epic & legendary characters" },
};

const TIERS: ChestTier[] = ["common", "rare", "epic", "legendary"];

export default function ShopPage() {
  const [tab, setTab] = useState<"gacha" | "boutique" | "pokedex">("gacha");
  const profile = useStore((s) => s.profile);
  const openChest = useStore((s) => s.openChest);
  const buyTheme = useStore((s) => s.buyTheme);
  const equipTheme = useStore((s) => s.equipTheme);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Shop</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Open chests to discover characters. Complete tasks to earn chests.
        </p>
      </div>

      {/* Gold display */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6"
        style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)" }}
      >
        <span className="text-lg">🪙</span>
        <span className="font-bold" style={{ color: "var(--gold)" }}>{profile.gold} Gold</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        {([["gacha", "Chests"], ["boutique", "Boutique"], ["pokedex", "Pokédex"]] as const).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t ? "var(--gold-dim)" : "transparent",
              border: tab === t ? "1px solid var(--gold-muted)" : "1px solid transparent",
              color: tab === t ? "var(--gold)" : "var(--text-secondary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chest Tab */}
      {tab === "gacha" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TIERS.map((tier) => {
            const cfg = CHEST_CONFIG[tier];
            const count = profile.chests[tier];
            return (
              <motion.div
                key={tier}
                whileHover={count > 0 ? { scale: 1.02 } : {}}
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{ background: "var(--bg-elevated)", border: `1px solid ${cfg.border}`, boxShadow: `0 0 20px ${cfg.glow}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cfg.emoji}</span>
                    <div>
                      <p className="font-bold" style={{ color: cfg.color }}>{cfg.label} Chest</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{cfg.desc}</p>
                    </div>
                  </div>
                  <div
                    className="px-3 py-1 rounded-lg text-sm font-bold"
                    style={{ background: count > 0 ? `${cfg.glow}` : "var(--bg-hover)", color: count > 0 ? cfg.color : "var(--text-muted)", border: `1px solid ${count > 0 ? cfg.border : "var(--border)"}` }}
                  >
                    ×{count}
                  </div>
                </div>

                <button
                  onClick={() => count > 0 && openChest(tier)}
                  disabled={count === 0}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: count > 0 ? cfg.glow : "var(--bg-hover)",
                    border: `1px solid ${count > 0 ? cfg.border : "var(--border)"}`,
                    color: count > 0 ? cfg.color : "var(--text-muted)",
                    cursor: count > 0 ? "pointer" : "not-allowed",
                    opacity: count > 0 ? 1 : 0.5,
                  }}
                >
                  {count > 0 ? `Open ${cfg.label} Chest` : "No chests available"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Boutique Tab */}
      {tab === "boutique" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const owned = profile.purchasedThemes.includes(theme.id);
            const equipped = profile.equippedTheme === theme.id || (theme.id === "default" && !profile.equippedTheme);
            const canAfford = profile.gold >= theme.cost;
            return (
              <motion.div
                key={theme.id}
                className="rounded-2xl p-5 flex flex-col gap-4"
                style={{
                  background: "var(--bg-elevated)",
                  border: equipped ? "2px solid var(--gold)" : "1px solid var(--border)",
                  boxShadow: equipped ? "0 0 20px rgba(212,168,75,0.2)" : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{theme.emoji}</span>
                    <div>
                      <p className="font-bold" style={{ color: "var(--text-primary)" }}>{theme.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{theme.universe}</p>
                    </div>
                  </div>
                  {equipped && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold" style={{ background: "var(--gold-dim)", color: "var(--gold)", border: "1px solid var(--gold-muted)" }}>
                      <Check size={10} /> Equipped
                    </span>
                  )}
                </div>

                {owned ? (
                  <button
                    onClick={() => !equipped && equipTheme(theme.id)}
                    disabled={equipped}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
                    style={{
                      background: equipped ? "var(--gold-dim)" : "var(--bg-hover)",
                      border: `1px solid ${equipped ? "var(--gold-muted)" : "var(--border)"}`,
                      color: equipped ? "var(--gold)" : "var(--text-secondary)",
                      cursor: equipped ? "default" : "pointer",
                    }}
                  >
                    {equipped ? "Currently equipped" : "Equip theme"}
                  </button>
                ) : (
                  <button
                    onClick={() => canAfford && buyTheme(theme.id, theme.cost)}
                    disabled={!canAfford}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    style={{
                      background: canAfford ? "var(--gold-dim)" : "var(--bg-hover)",
                      border: `1px solid ${canAfford ? "var(--gold-muted)" : "var(--border)"}`,
                      color: canAfford ? "var(--gold)" : "var(--text-muted)",
                      cursor: canAfford ? "pointer" : "not-allowed",
                      opacity: canAfford ? 1 : 0.5,
                    }}
                  >
                    <ShoppingCart size={14} />
                    {theme.cost === 0 ? "Free" : `🪙 ${theme.cost} Gold`}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pokédex Tab */}
      {tab === "pokedex" && <PokedexTab />}

    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RARITY_COLOR: Record<string, string> = {
  common: "var(--text-muted)",
  rare: "var(--exp-blue)",
  epic: "var(--exp-purple)",
  legendary: "var(--gold)",
};

const RARITY_GLOW: Record<string, string> = {
  common: "rgba(90,80,64,0.15)",
  rare: "rgba(96,165,250,0.2)",
  epic: "rgba(192,132,252,0.2)",
  legendary: "rgba(212,168,75,0.25)",
};

const UNIVERSE_EMOJI: Record<Universe, string> = {
  onepiece: "🏴‍☠️",
  naruto: "🍃",
  dragonball: "⚡",
  aot: "⚔️",
  rickmorty: "🌀",
};

const UNIVERSE_LABELS: { id: Universe | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "onepiece", label: "🏴‍☠️ One Piece" },
  { id: "naruto", label: "🍃 Naruto" },
  { id: "dragonball", label: "⚡ Dragon Ball" },
  { id: "aot", label: "⚔️ AoT" },
  { id: "rickmorty", label: "🌀 Rick & Morty" },
];

function rarityStars(rarity: string): string {
  const counts: Record<string, number> = { common: 1, rare: 2, epic: 3, legendary: 4 };
  const n = counts[rarity] ?? 1;
  return "★".repeat(n) + "☆".repeat(4 - n);
}

// ─── PokedexTab ───────────────────────────────────────────────────────────────

function PokedexTab() {
  const ownedCharacters = useStore((s) => s.profile.ownedCharacters);
  const [universeFilter, setUniverseFilter] = useState<Universe | "all">("all");

  const ownedMap = new Map(ownedCharacters.map((o) => [o.characterId, o]));
  const discovered = ownedCharacters.length;
  const total = CHARACTERS.length;

  const filtered = CHARACTERS.filter(
    (c) => universeFilter === "all" || c.universe === universeFilter
  ).sort((a, b) => {
    const aOwned = ownedMap.has(a.id) ? 0 : 1;
    const bOwned = ownedMap.has(b.id) ? 0 : 1;
    return aOwned - bOwned;
  });

  return (
    <div>
      {/* Counter */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          <span style={{ color: "var(--gold)" }}>{discovered}</span>
          <span style={{ color: "var(--text-muted)" }}> / {total} discovered</span>
        </p>
      </div>

      {/* Universe filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {UNIVERSE_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setUniverseFilter(id as Universe | "all")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: universeFilter === id ? "var(--gold-dim)" : "var(--bg-elevated)",
              border: `1px solid ${universeFilter === id ? "var(--gold-muted)" : "var(--border-subtle)"}`,
              color: universeFilter === id ? "var(--gold)" : "var(--text-secondary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((char) => {
          const owned = ownedMap.get(char.id);
          const color = RARITY_COLOR[char.rarity];
          const glow = RARITY_GLOW[char.rarity];

          if (owned) {
            return (
              <div
                key={char.id}
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{
                  background: "var(--bg-elevated)",
                  border: `1px solid ${color}50`,
                  boxShadow: `0 0 12px ${glow}`,
                }}
              >
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center text-4xl overflow-hidden relative"
                  style={{ background: "var(--bg-hover)" }}
                >
                  {char.imageUrl ? (
                    <Image src={char.imageUrl} alt={char.name} fill className="object-cover" />
                  ) : (
                    UNIVERSE_EMOJI[char.universe]
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{char.name}</p>
                  <p className="text-xs font-medium" style={{ color, letterSpacing: "0.05em" }}>
                    {rarityStars(char.rarity)}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>{char.rarity}</p>
                    {owned.count > 1 && (
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                        ×{owned.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Not owned — semi-revealed
          return (
            <div
              key={char.id}
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                opacity: 0.6,
                filter: "saturate(0.3)",
              }}
            >
              <div
                className="w-full aspect-square rounded-lg flex items-center justify-center text-4xl"
                style={{ background: "var(--bg-hover)" }}
              >
                {UNIVERSE_EMOJI[char.universe]}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>???</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>????</p>
                <div className="flex items-center justify-between mt-0.5">
                  <Lock size={10} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
