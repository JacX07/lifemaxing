"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Settings, Zap, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const profile = useStore((s) => s.profile);
  const getExpProgress = useStore((s) => s.getExpProgress);
  const { level, progressPct, title } = getExpProgress();

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center glow-gold"
          style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)" }}
        >
          <Zap size={16} style={{ color: "var(--gold)" }} />
        </div>
        <div>
          <p className="font-bold text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
            LifeMaxing
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Level up your life</p>
        </div>
      </div>

      {/* Mini profile */}
      <div
        className="mx-3 mt-4 mb-2 rounded-xl p-3 flex items-center gap-3"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "var(--bg-hover)", border: "1px solid var(--border)" }}
        >
          {profile.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
            {profile.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Trophy size={10} style={{ color: "var(--gold)" }} />
            <p className="text-xs" style={{ color: "var(--gold)" }}>
              Lv {level} · {title}
            </p>
          </div>
        </div>
      </div>

      {/* EXP bar mini */}
      <div className="px-3 mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>EXP</span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
          <div className="h-full rounded-full exp-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
              style={{
                background: active ? "var(--gold-dim)" : "transparent",
                border: active ? "1px solid var(--gold-muted)" : "1px solid transparent",
                color: active ? "var(--gold)" : "var(--text-secondary)",
              }}
            >
              <Icon size={16} style={{ color: active ? "var(--gold)" : "var(--text-muted)" }} />
              <span className="text-sm font-medium">{label}</span>
              {active && (
                <div className="ml-auto w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom stats */}
      <div
        className="mx-3 mb-4 rounded-xl p-3 space-y-2"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Today
        </p>
        <div className="flex justify-between">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Tasks done</span>
          <span className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
            {profile.todayTasksDone}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Streak</span>
          <span className="text-xs font-bold" style={{ color: "var(--gold)" }}>
            🔥 {profile.streak} days
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>EXP earned</span>
          <span className="text-xs font-bold" style={{ color: "var(--exp-green)" }}>
            +{profile.todayEXPEarned} XP
          </span>
        </div>
      </div>
    </aside>
  );
}
