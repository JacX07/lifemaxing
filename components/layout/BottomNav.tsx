"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, CalendarDays, ShoppingBag, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks",     icon: CheckSquare,     label: "Tasks"     },
  { href: "/schedule",  icon: CalendarDays,    label: "Schedule"  },
  { href: "/shop",      icon: ShoppingBag,     label: "Shop"      },
  { href: "/settings",  icon: Settings,        label: "Settings"  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
            style={{ color: active ? "var(--gold)" : "var(--text-muted)" }}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
            {active && (
              <span
                className="absolute bottom-0 w-8 h-0.5 rounded-full"
                style={{ background: "var(--gold)" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
