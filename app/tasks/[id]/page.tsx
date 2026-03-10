import { ArrowLeft, Calendar, Flame, Trophy } from "lucide-react";
import Link from "next/link";

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/tasks"
        className="flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} />
        Back to Tasks
      </Link>

      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)", color: "var(--exp-orange)" }}
              >
                🔥 Hard
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
              >
                Work & Career
              </span>
            </div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Code review session
            </h1>
          </div>
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold"
            style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-muted)", color: "var(--gold)" }}
          >
            <Trophy size={14} />
            +50 XP
          </div>
        </div>

        {/* Description placeholder */}
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Review all open PRs and leave detailed feedback. Focus on code quality and test coverage.
        </p>

        {/* Meta */}
        <div
          className="grid grid-cols-2 gap-4 pt-4"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: "var(--text-muted)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Due date</p>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Today</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={14} style={{ color: "var(--exp-orange)" }} />
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Status</p>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
