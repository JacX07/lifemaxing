"use client";

import { ReactNode } from "react";
import { Plus } from "lucide-react";

interface Props {
  title: string;
  count?: number;
  onAdd?: () => void;
  emptyMessage?: string;
  children?: ReactNode;
}

export default function DashboardSection({ title, count, onAdd, emptyMessage, children }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
            {title}
          </h2>
          {count !== undefined && (
            <span
              className="px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
            >
              {count}
            </span>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-muted)",
              color: "var(--gold)",
            }}
          >
            <Plus size={12} />
            Add
          </button>
        )}
      </div>

      {children ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <div
          className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
          style={{ background: "var(--bg-surface)", border: "1px dashed var(--border)" }}
        >
          <p className="text-2xl mb-2">⚔️</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {emptyMessage ?? "No tasks yet"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Click <strong>Add</strong> to create your first quest
          </p>
        </div>
      )}
    </div>
  );
}
