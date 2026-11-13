import React, { useState } from "react";

type CompletedCheck = {
  n: number;
  question: string;
  engine: string;
  checkId: string;
  checkedAt?: string | null;
  estimatedCostUsd?: number;
};

export type ActiveRound = {
  active?: boolean;
  statusHe?: string;
  completed?: number;
  total?: number;
  remaining?: number;
  perplexity?: { completed: number; total: number };
  gemini?: { completed: number; total: number };
  spentUsd?: number;
  capUsd?: number;
  checkpoint?: { question?: string; engine?: string } | null;
  geminiModel?: string;
  billingHe?: string;
  stopCode?: string | null;
  updatedAt?: string | null;
  completedChecks?: CompletedCheck[];
};

function money(value: number | undefined, digits: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return `$${n.toFixed(digits)}`;
}

function when(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActiveRoundCard({
  round,
  onOpen,
}: {
  round?: ActiveRound | null;
  onOpen: (checkId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!round?.active) return null;
  const rows: Array<[string, string]> = [
    ["סטטוס", round.statusHe || "—"],
    ["הושלמו", `${round.completed ?? 0}/${round.total ?? 0}`],
    ["נותרו", String(round.remaining ?? 0)],
    ["Perplexity", `${round.perplexity?.completed ?? 0}/${round.perplexity?.total ?? 0}`],
    ["Gemini", `${round.gemini?.completed ?? 0}/${round.gemini?.total ?? 0}`],
    ["עלות מצטברת", money(round.spentUsd, 3)],
    ["תקרת עלות", money(round.capUsd, 2)],
    ["checkpoint", round.checkpoint?.question || "—"],
    ["מודל Gemini", round.geminiModel || "—"],
    ["Billing", round.billingHe || "—"],
    ["סיבת עצירה", round.stopCode || "—"],
    ["זמן עדכון אחרון", when(round.updatedAt)],
  ];
  const completed = round.completedChecks || [];
  return (
    <section className="geo-card geo-active-round" aria-label="סבב מדידות פעיל">
      <h3>סבב מדידות פעיל</h3>
      <dl className="geo-quota-details">
        {rows.map(([label, value]) => (
          <React.Fragment key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <div className="geo-intel-actions">
        <button
          type="button"
          className="geo-btn geo-btn-ghost"
          onClick={() => setOpen((value) => !value)}
        >
          צפה במדידות שהושלמו
        </button>
      </div>
      {open ? (
        completed.length ? (
          <ul className="geo-active-round-list">
            {completed.map((row) => (
              <li key={row.checkId}>
                <span>
                  {row.engine} · {row.question}
                </span>
                <button
                  type="button"
                  className="geo-btn geo-btn-ghost"
                  onClick={() => onOpen(row.checkId)}
                >
                  פתח
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="geo-note">אין מדידות שהושלמו בסבב הזה.</p>
        )
      ) : null}
    </section>
  );
}
