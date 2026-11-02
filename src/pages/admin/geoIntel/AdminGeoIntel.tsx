import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../../api";
import AdminPageHeader from "../shell/AdminPageHeader";
import { ADMIN_PAGE_SHELL_CLASS } from "../../../utils/adminResponsive";
import { geoIntelCopy } from "./geoIntelCopy";

type Brand = { _id: string; slug: string; name: string; domains: string[] };
type Engine = {
  id: string;
  label: string;
  labelHe: string;
  status: string;
  notes?: string;
};
type Metrics = {
  sampleSize: number;
  questionsChecked: number;
  mentions: number;
  recommendations: number;
  citations: number;
  visibilityPct: number | null;
  visibilityNote?: string;
  byEngine: Array<{
    engine: string;
    label: string;
    labelHe: string;
    registryStatus: string;
    checkStatus: string;
    n: number;
    appeared: number;
    visibilityPct: number | null;
  }>;
  byDay: Array<{ day: string; n: number; appeared: number; visibilityPct: number | null }>;
};
type QuestionRow = {
  prompt: { _id: string; text: string; language: string };
  engine: string;
  engineCheckStatus: string;
  latestCheck: null | {
    id: string;
    status: string;
    checkedAt?: string;
    detected?: {
      appeared?: boolean;
      recommended?: boolean;
      hasLink?: boolean;
      competitors?: string[];
    };
    sourcesCount?: number;
  };
};

type Tab = "dashboard" | "questions" | "gsc" | "engines";

function yn(v?: boolean, notChecked?: boolean, labelNotChecked?: string) {
  if (notChecked) return labelNotChecked || "—";
  if (v === true) return "✓";
  if (v === false) return "✗";
  return "—";
}

export default function AdminGeoIntel() {
  const { i18n } = useTranslation();
  const copy = geoIntelCopy(i18n.resolvedLanguage || i18n.language);
  const dir = String(i18n.resolvedLanguage || "").toLowerCase().startsWith("he")
    ? "rtl"
    : "ltr";

  const [tab, setTab] = useState<Tab>("dashboard");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState<any>(null);
  const [csvText, setCsvText] = useState("");
  const [gscImports, setGscImports] = useState<any[]>([]);
  const [engineFilter, setEngineFilter] = useState("gemini");

  const loadStatus = useCallback(async () => {
    const { data } = await API.get("/geo-intel/status");
    setStatus(data);
    setEngines(data.engines || []);
  }, []);

  const loadBrands = useCallback(async () => {
    const { data } = await API.get("/geo-intel/brands");
    const list = data.brands || [];
    setBrands(list);
    if (!brandId && list[0]?._id) setBrandId(list[0]._id);
  }, [brandId]);

  const loadDashboard = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/dashboard", {
      params: { brandId },
    });
    setMetrics(data.metrics);
  }, [brandId]);

  const loadQuestions = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/questions", {
      params: { brandId, engine: engineFilter },
    });
    setRows(data.rows || []);
  }, [brandId, engineFilter]);

  const loadGsc = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/gsc/imports", {
      params: { brandId },
    });
    setGscImports(data.imports || []);
  }, [brandId]);

  const refreshAll = useCallback(async () => {
    setError("");
    try {
      await loadStatus();
      await loadBrands();
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to load");
    }
  }, [loadStatus, loadBrands]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    if (!brandId) return;
    void loadDashboard().catch((err) =>
      setError(err?.response?.data?.error || err.message)
    );
    void loadQuestions().catch(() => {});
    void loadGsc().catch(() => {});
  }, [brandId, loadDashboard, loadQuestions, loadGsc]);

  const onSeed = async () => {
    setBusy(true);
    setError("");
    try {
      await API.post("/geo-intel/seed");
      await loadBrands();
      await loadQuestions();
      await loadDashboard();
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const onCheck = async (promptId: string) => {
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post("/geo-intel/run", {
        brandId,
        promptId,
        engine: engineFilter,
      });
      if (data.deduped) {
        setError(copy.runDeduped);
      }
      await loadQuestions();
      await loadDashboard();
      await loadStatus();
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.error || err.message;
      setError(
        code === "GEO_GEMINI_KEY_MISSING" ? copy.geminiMissing : msg
      );
    } finally {
      setBusy(false);
    }
  };

  const openDetail = async (checkId: string) => {
    setBusy(true);
    try {
      const { data } = await API.get(`/geo-intel/checks/${checkId}`);
      setDetail(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const onImportGsc = async () => {
    setBusy(true);
    setError("");
    try {
      await API.post("/geo-intel/gsc/import", {
        brandId,
        csvText,
        filename: "gsc-upload.csv",
      });
      setCsvText("");
      await loadGsc();
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const tabs = useMemo(
    () =>
      [
        { id: "dashboard" as Tab, label: copy.dashboard },
        { id: "questions" as Tab, label: copy.questions },
        { id: "gsc" as Tab, label: copy.gsc },
        { id: "engines" as Tab, label: copy.engines },
      ] as const,
    [copy]
  );

  return (
    <div className={ADMIN_PAGE_SHELL_CLASS} dir={dir}>
      <main className="mx-auto max-w-[1480px] space-y-4 px-3 py-6 sm:px-6">
        <AdminPageHeader title={copy.title} description={copy.subtitle} />

        <div className="rounded-2xl border border-violet-200/70 bg-gradient-to-br from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] p-4">
          <p className="text-sm font-semibold text-slate-700">{copy.freeOnly}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.plannedHost}</p>
          {status?.gemini ? (
            <p className="mt-2 text-xs text-slate-600">
              Gemini: {status.gemini.configured ? "key configured" : "key missing"} ·{" "}
              {copy.quota}: {status.gemini.budget?.dailyFreeUsed}/
              {status.gemini.budget?.dailyFreeCap} day ·{" "}
              {status.gemini.budget?.monthlyFreeUsed}/
              {status.gemini.budget?.monthlyFreeCap} month
              {status.gemini.budget?.paused
                ? ` · PAUSED: ${status.gemini.budget.pauseReason}`
                : ""}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-bold text-slate-700">{copy.brand}</label>
          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
          >
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({(b.domains || []).join(", ")})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={busy}
            onClick={onSeed}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {copy.seed}
          </button>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                tab === t.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
            {error}
          </p>
        ) : null}

        {tab === "dashboard" ? (
          <section className="space-y-4">
            {!metrics || metrics.sampleSize === 0 ? (
              <p className="text-sm font-semibold text-slate-600">{copy.noData}</p>
            ) : null}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              <Kpi
                label={`${copy.visibility} (n=${metrics?.sampleSize ?? 0})`}
                value={
                  metrics?.visibilityPct == null
                    ? "—"
                    : `${metrics.visibilityPct}%`
                }
              />
              <Kpi
                label={copy.questionsChecked}
                value={String(metrics?.questionsChecked ?? 0)}
              />
              <Kpi label={copy.mentions} value={String(metrics?.mentions ?? 0)} />
              <Kpi
                label={copy.recommendations}
                value={String(metrics?.recommendations ?? 0)}
              />
              <Kpi
                label={copy.citations}
                value={String(metrics?.citations ?? 0)}
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-start">{copy.engine}</th>
                    <th className="px-3 py-2 text-start">{copy.status}</th>
                    <th className="px-3 py-2 text-start">n</th>
                    <th className="px-3 py-2 text-start">{copy.visibility}</th>
                  </tr>
                </thead>
                <tbody>
                  {(metrics?.byEngine || engines.map((e) => ({
                    engine: e.id,
                    label: e.label,
                    labelHe: e.labelHe,
                    registryStatus: e.status,
                    checkStatus: "not_checked",
                    n: 0,
                    visibilityPct: null,
                  }))).map((e) => (
                    <tr key={e.engine} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold">
                        {dir === "rtl" ? e.labelHe || e.label : e.label}
                      </td>
                      <td className="px-3 py-2">
                        {e.checkStatus === "checked"
                          ? "checked"
                          : e.registryStatus === "ready"
                            ? copy.notChecked
                            : e.registryStatus}
                      </td>
                      <td className="px-3 py-2">{e.n}</td>
                      <td className="px-3 py-2">
                        {e.visibilityPct == null
                          ? "—"
                          : `${e.visibilityPct}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(metrics?.byDay || []).length > 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-black text-slate-800">
                  Visibility by day (completed checks only)
                </h3>
                <div className="flex h-40 items-end gap-2">
                  {metrics!.byDay.map((d) => (
                    <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-violet-500/80"
                        style={{
                          height: `${Math.max(4, (d.visibilityPct || 0) * 1.2)}%`,
                          minHeight: 4,
                        }}
                        title={`${d.day}: ${d.visibilityPct ?? "—"}% (n=${d.n})`}
                      />
                      <span className="text-[10px] text-slate-500">
                        {d.day.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {tab === "questions" ? (
          <section className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <label className="text-sm font-bold">{copy.engine}</label>
              <select
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                value={engineFilter}
                onChange={(e) => setEngineFilter(e.target.value)}
              >
                <option value="gemini">gemini</option>
                {engines
                  .filter((e) => e.id !== "gemini")
                  .map((e) => (
                    <option key={e.id} value={e.id} disabled={e.status !== "ready"}>
                      {e.id} ({e.status})
                    </option>
                  ))}
              </select>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-start">{copy.question}</th>
                    <th className="px-3 py-2 text-start">{copy.engine}</th>
                    <th className="px-3 py-2 text-start">{copy.appeared}</th>
                    <th className="px-3 py-2 text-start">{copy.recommended}</th>
                    <th className="px-3 py-2 text-start">{copy.link}</th>
                    <th className="px-3 py-2 text-start">{copy.competitors}</th>
                    <th className="px-3 py-2 text-start">{copy.date}</th>
                    <th className="px-3 py-2 text-start" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const unchecked = r.engineCheckStatus === "not_checked";
                    return (
                      <tr
                        key={r.prompt._id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="max-w-[360px] px-3 py-2">
                          <button
                            type="button"
                            className="text-start font-semibold text-slate-800"
                            disabled={!r.latestCheck?.id}
                            onClick={() =>
                              r.latestCheck?.id && openDetail(r.latestCheck.id)
                            }
                          >
                            {r.prompt.text}
                          </button>
                          <div className="text-xs text-slate-400">
                            {r.prompt.language}
                          </div>
                        </td>
                        <td className="px-3 py-2">{r.engine}</td>
                        <td className="px-3 py-2">
                          {unchecked
                            ? copy.notChecked
                            : yn(r.latestCheck?.detected?.appeared)}
                        </td>
                        <td className="px-3 py-2">
                          {unchecked
                            ? "—"
                            : yn(r.latestCheck?.detected?.recommended)}
                        </td>
                        <td className="px-3 py-2">
                          {unchecked ? "—" : yn(r.latestCheck?.detected?.hasLink)}
                        </td>
                        <td className="px-3 py-2">
                          {unchecked
                            ? "—"
                            : (r.latestCheck?.detected?.competitors || []).join(
                                ", "
                              ) || "—"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {r.latestCheck?.checkedAt
                            ? new Date(r.latestCheck.checkedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            disabled={busy || engineFilter !== "gemini"}
                            onClick={() => onCheck(r.prompt._id)}
                            className="rounded-lg bg-violet-600 px-2 py-1 text-xs font-bold text-white disabled:opacity-40"
                          >
                            {copy.checkNow}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {tab === "gsc" ? (
          <section className="space-y-3">
            <p className="text-sm text-slate-600">
              Import Search Console Generative AI / performance CSV offline.
              Impressions only — separated from LLM GEO scores. No Google API
              calls.
            </p>
            <textarea
              className="min-h-[140px] w-full rounded-xl border border-slate-200 p-3 font-mono text-xs"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Page,Country,Device,Date,Impressions"
            />
            <button
              type="button"
              disabled={busy || !csvText.trim()}
              onClick={onImportGsc}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {copy.importCsv}
            </button>
            <ul className="space-y-1 text-sm">
              {gscImports.map((g) => (
                <li key={g._id} className="rounded-lg border border-slate-200 px-3 py-2">
                  {g.filename} · {g.rowCount} rows ·{" "}
                  {g.createdAt ? new Date(g.createdAt).toLocaleString() : ""}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === "engines" ? (
          <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-start">ID</th>
                  <th className="px-3 py-2 text-start">{copy.status}</th>
                  <th className="px-3 py-2 text-start">Notes</th>
                </tr>
              </thead>
              <tbody>
                {engines.map((e) => (
                  <tr key={e.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold">
                      {dir === "rtl" ? e.labelHe : e.label}
                    </td>
                    <td className="px-3 py-2">{e.status}</td>
                    <td className="px-3 py-2 text-slate-600">{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}
      </main>

      {detail?.check ? (
        <div className="fixed inset-0 z-[80] flex justify-end bg-slate-900/40">
          <div
            className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
            dir={dir}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-black text-slate-900">
                {copy.sources} / {copy.rawAnswer}
              </h2>
              <button
                type="button"
                className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold"
                onClick={() => setDetail(null)}
              >
                {copy.close}
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="mb-1 text-sm font-black">{copy.rawAnswer}</h3>
                <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                  {detail.check.rawAnswer || "—"}
                </pre>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-black">{copy.sources}</h3>
                <ul className="space-y-2">
                  {(detail.check.sources || []).map((s: any, i: number) => (
                    <li
                      key={`${s.url}-${i}`}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        s.isBrand
                          ? "border-violet-400 bg-violet-50"
                          : "border-slate-200"
                      }`}
                    >
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-violet-700 underline"
                      >
                        {s.title || s.domain || s.url}
                      </a>
                      <div className="text-xs text-slate-500">{s.url}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-black">{copy.history}</h3>
                <ul className="text-sm text-slate-700">
                  {(detail.history || []).map((h: any) => (
                    <li key={h._id} className="border-b border-slate-100 py-1">
                      {h.checkedAt
                        ? new Date(h.checkedAt).toLocaleString()
                        : h.dayBucket}{" "}
                      · appeared={String(h.detected?.appeared)} · model={h.model}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-900">{value}</div>
    </div>
  );
}
