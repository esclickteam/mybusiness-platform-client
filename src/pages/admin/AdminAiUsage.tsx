import React, { useEffect, useState } from "react";
import API from "../../api";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import { ADMIN_PAGE_SHELL_CLASS } from "../../utils/adminResponsive";

type Range = "today" | "24h" | "7d" | "month";

type GroupRow = {
  key: string;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  cost: number;
};

type Report = {
  range: string;
  totalCost: number;
  calls: number;
  inputTokens: number;
  outputTokens: number;
  failed: number;
  retried: number;
  byFeature: GroupRow[];
  byModel: GroupRow[];
  byBusiness: GroupRow[];
  mostExpensive?: {
    feature?: string;
    model?: string;
    estimatedCost?: number;
    requestId?: string;
    createdAt?: string;
  } | null;
  recent?: Array<{
    _id: string;
    feature: string;
    model: string;
    estimatedCost?: number;
    inputTokens?: number;
    outputTokens?: number;
    createdAt?: string;
    failed?: boolean;
  }>;
  alerts?: Array<{ _id: string; message: string; createdAt?: string }>;
};

function money(value?: number) {
  return `$${(Number(value) || 0).toFixed(4)}`;
}

export default function AdminAiUsage() {
  const [range, setRange] = useState<Range>("24h");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    API.get("/admin/ai-usage", { params: { range } })
      .then(({ data }) => {
        if (!cancelled) setReport(data.report);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.error || "Failed to load AI usage");
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir="rtl">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <AdminPageHeader
          title="שימוש ב-AI"
          description="עלות, טוקנים וקריאות לפי טווח זמן."
        />
        <div className="flex flex-wrap gap-2">
          {(["today", "24h", "7d", "month"] as Range[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm font-black ${
                range === item ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
              onClick={() => setRange(item)}
            >
              {item === "today"
                ? "היום"
                : item === "24h"
                  ? "24 שעות"
                  : item === "7d"
                    ? "7 ימים"
                    : "החודש"}
            </button>
          ))}
        </div>
        {error ? <p className="font-bold text-rose-600">{error}</p> : null}
        {report ? (
          <>
            <div className="biz-stat-grid">
              <article className="biz-stat-card">
                <p>עלות כוללת</p>
                <strong>{money(report.totalCost)}</strong>
              </article>
              <article className="biz-stat-card">
                <p>קריאות</p>
                <strong>{report.calls}</strong>
              </article>
              <article className="biz-stat-card">
                <p>טוקנים</p>
                <strong>{report.inputTokens + report.outputTokens}</strong>
              </article>
              <article className="biz-stat-card is-alert">
                <p>נכשלו / נוסו שוב</p>
                <strong>
                  {report.failed} / {report.retried}
                </strong>
              </article>
            </div>
            {report.mostExpensive ? (
              <p className="text-sm font-semibold text-slate-700">
                היקרה ביותר: {report.mostExpensive.feature} · {report.mostExpensive.model} ·{" "}
                {money(report.mostExpensive.estimatedCost)} · {report.mostExpensive.requestId}
              </p>
            ) : null}
            <section className="rounded-xl border bg-white p-4">
              <h2 className="mb-2 font-black">לפי יכולת</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-right text-slate-500">
                    <th>יכולת</th>
                    <th>קריאות</th>
                    <th>קלט</th>
                    <th>פלט</th>
                    <th>עלות</th>
                  </tr>
                </thead>
                <tbody>
                  {report.byFeature.map((row) => (
                    <tr key={row.key} className="border-t">
                      <td className="py-1 font-bold">{row.key}</td>
                      <td>{row.calls}</td>
                      <td>{row.inputTokens}</td>
                      <td>{row.outputTokens}</td>
                      <td>{money(row.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="rounded-xl border bg-white p-4">
              <h2 className="mb-2 font-black">לפי מודל</h2>
              {report.byModel.map((row) => (
                <p key={row.key} className="text-sm font-semibold">
                  {row.key}: {row.calls} קריאות · {money(row.cost)}
                </p>
              ))}
            </section>
            {report.alerts?.length ? (
              <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h2 className="mb-2 font-black">התראות</h2>
                {report.alerts.map((alert) => (
                  <p key={alert._id} className="text-sm font-semibold">
                    {alert.message}
                  </p>
                ))}
              </section>
            ) : null}
          </>
        ) : (
          <p className="font-bold text-slate-500">טוען...</p>
        )}
      </main>
    </div>
  );
}
