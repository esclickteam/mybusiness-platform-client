import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchFunnel, fetchReports } from "./crmWorkspaceApi";
import { getApiErrorMessage } from "../../../../../utils/apiErrorMessage";
import { downloadBlob, downloadText, periodChange, toCsv } from "../crmUi";
import { useLocaleDir } from "../../../../../hooks/useLocaleDir";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CRMReportsPage() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [to, setTo] = useState(isoDate(new Date()));
  const [from, setFrom] = useState(isoDate(new Date(Date.now() - 29 * 86400000)));
  const [data, setData] = useState<any>(null);
  const [funnel, setFunnel] = useState<Array<{ key: string; label: string; count: number; amount: number }>>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError("");
    setLoading(true);
    Promise.all([fetchReports(from, to), fetchFunnel()])
      .then(([reports, funnelData]) => {
        if (cancelled) return;
        setData(reports);
        setFunnel(funnelData.funnel || []);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err, t("crm.leads.errors.requestFailed")));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to, t]);

  const totals = data?.metrics?.totals || {};
  const previous = data?.metrics?.previous || {};
  const series = data?.metrics?.series || [];
  const statusEntries = Object.entries(data?.metrics?.byStatus || {}).map(([name, count]) => ({
    name,
    count,
  }));
  const sourceEntries = Object.entries(data?.metrics?.bySource || {}).map(([name, count]) => ({
    name,
    count,
  }));

  const kpis = useMemo(
    () =>
      [
        ["leads", totals.leads, previous.leads],
        ["newLeads", totals.newLeads, previous.newLeads],
        ["inProgress", totals.inProgress, previous.inProgress],
        ["activeClients", totals.activeClients, null],
        ["closed", totals.closed, previous.closed],
        ["conversionRate", totals.conversionRate, previous.conversionRate, "%"],
        ["dealSum", totals.dealSum, previous.dealSum],
        ["revenue", totals.revenue, previous.revenue],
        ["meetings", totals.meetings, null],
        ["openTasks", totals.openTasks, null],
      ] as Array<[string, unknown, unknown, string?]>,
    [totals, previous]
  );

  const exportRows = [
    [t("crm.workspace.from"), from, t("crm.workspace.to"), to],
    [],
    ...kpis.map(([key, value]) => [t(`crm.workspace.metrics.${key}`), value ?? 0]),
  ];

  const exportCsv = () => downloadText(`crm-reports-${from}-${to}.csv`, toCsv(exportRows));

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("CRM");
    exportRows.forEach((row) => sheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    downloadBlob(
      `crm-reports-${from}-${to}.xlsx`,
      new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    );
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Bizuply CRM", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [[t("crm.workspace.metric"), t("crm.workspace.value")]],
      body: kpis.map(([key, value]) => [t(`crm.workspace.metrics.${key}`), String(value ?? 0)]),
    });
    doc.save(`crm-reports-${from}-${to}.pdf`);
  };

  return (
    <div className="crm-page crm-surface space-y-3" dir={dir}>
      <div className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200/80 bg-white p-3">
        <label className="text-[11px] font-black text-slate-500">
          {t("crm.workspace.from")}
          <input className="mt-1 block h-10 rounded-xl border border-slate-200 px-3 text-sm" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label className="text-[11px] font-black text-slate-500">
          {t("crm.workspace.to")}
          <input className="mt-1 block h-10 rounded-xl border border-slate-200 px-3 text-sm" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
        <div className="ms-auto flex flex-wrap gap-2">
          <button type="button" className="crm-btn" onClick={exportCsv}>CSV</button>
          <button type="button" className="crm-btn" onClick={() => void exportExcel()}>Excel</button>
          <button type="button" className="crm-btn" onClick={exportPdf}>PDF</button>
        </div>
      </div>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
      {loading && !data ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="crm-kpi animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {kpis.map(([key, value, prev, suffix]) => {
            const delta = periodChange(Number(value) || 0, prev as number);
            return (
              <div key={String(key)} className="crm-kpi">
                <h3>{t(`crm.workspace.metrics.${key}`)}</h3>
                <p>
                  {value ?? 0}
                  {suffix || ""}
                </p>
                {delta ? (
                  <div className={`crm-delta ${delta.dir === "down" ? "text-rose-600" : delta.dir === "up" ? "text-emerald-600" : "text-slate-400"}`}>
                    {delta.label} {t("crm.workspace.vsPreviousPeriod")}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      <div className="grid gap-3 xl:grid-cols-2">
        <ChartCard title={t("crm.workspace.charts.leadsOverTime")}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={series}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6D28D9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.status")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusEntries}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6D28D9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.funnel")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={funnel} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="label" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.sources")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceEntries}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.deals")}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.metrics?.dealsByMonth || []}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.metrics.byAgent")}>
          <ul className="space-y-1 text-sm font-bold">
            {(data?.metrics?.byAgent || []).map((row: any) => (
              <li key={row.assignedToUserId || row.assignedToName}>
                {row.assignedToName}: {row.leads} / {row.converted}
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="crm-chart-card">
      <h3 className="mb-2 text-sm font-black text-slate-800">{title}</h3>
      {children}
    </section>
  );
}
