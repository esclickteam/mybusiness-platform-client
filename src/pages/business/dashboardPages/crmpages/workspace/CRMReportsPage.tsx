import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchReports } from "./crmWorkspaceApi";
import { getApiErrorMessage } from "../../../../../utils/apiErrorMessage";

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CRMReportsPage() {
  const { t } = useTranslation();
  const [to, setTo] = useState(isoDate(new Date()));
  const [from, setFrom] = useState(isoDate(new Date(Date.now() - 29 * 86400000)));
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    void fetchReports(from, to)
      .then(setData)
      .catch((err) => setError(getApiErrorMessage(err, t("crm.leads.errors.requestFailed"))));
  }, [from, to, t]);

  const totals = data?.metrics?.totals || {};
  const series = data?.metrics?.series || [];
  const statusEntries = Object.entries(data?.metrics?.byStatus || {}).map(([name, count]) => ({
    name,
    count,
  }));
  const sourceEntries = Object.entries(data?.metrics?.bySource || {}).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border bg-white p-4">
        <label className="text-xs font-black">
          {t("crm.workspace.from")}
          <input className="mt-1 block h-10 rounded-xl border px-3" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label className="text-xs font-black">
          {t("crm.workspace.to")}
          <input className="mt-1 block h-10 rounded-xl border px-3" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
      </div>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["leads", totals.leads],
          ["newLeads", totals.newLeads],
          ["inProgress", totals.inProgress],
          ["closed", totals.closed],
          ["lost", totals.lost],
          ["conversionRate", `${totals.conversionRate || 0}%`],
          ["dealSum", totals.dealSum],
          ["revenue", totals.revenue],
          ["openTasks", totals.openTasks],
          ["upcomingMeetings", totals.upcomingMeetings],
        ].map(([key, value]) => (
          <div key={String(key)} className="rounded-2xl border bg-white p-4">
            <p className="text-xs font-black text-slate-500">{t(`crm.workspace.metrics.${key}`)}</p>
            <p className="mt-2 text-2xl font-black">{value ?? 0}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title={t("crm.workspace.charts.leadsOverTime")}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6D28D9" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.status")}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusEntries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6D28D9" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.sources")}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sourceEntries}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title={t("crm.workspace.charts.deals")}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data?.metrics?.dealsByMonth || []}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h3 className="text-sm font-black">{t("crm.workspace.metrics.byAgent")}</h3>
        <ul className="mt-2 space-y-1 text-sm font-bold">
          {(data?.metrics?.byAgent || []).map((row: any) => (
            <li key={row.assignedToUserId || row.assignedToName}>
              {row.assignedToName}: {row.leads} / {row.converted}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h3 className="mb-3 text-sm font-black">{title}</h3>
      {children}
    </section>
  );
}
