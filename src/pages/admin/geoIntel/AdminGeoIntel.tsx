import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../../api";
import { ADMIN_PAGE_SHELL_CLASS } from "../../../utils/adminResponsive";
import { geoIntelCopy } from "./geoIntelCopy";
import "./geoIntel.css";

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
  byDay: Array<{
    day: string;
    n: number;
    appeared: number;
    visibilityPct: number | null;
  }>;
};
type QuestionRow = {
  prompt: { _id: string; text: string; language: string; topic?: string };
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

type Tab = "dashboard" | "questions" | "competitors" | "gsc" | "engines" | "settings";

function statusLabel(
  copy: ReturnType<typeof geoIntelCopy>,
  unchecked: boolean,
  value?: boolean
) {
  if (unchecked) return copy.waitingCheck;
  if (value === true) return copy.yes;
  if (value === false) return copy.no;
  return "—";
}

export default function AdminGeoIntel() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language;
  const copy = geoIntelCopy(lang);
  const dir = String(lang).toLowerCase().startsWith("he") ? "rtl" : "ltr";

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
  const [langFilter, setLangFilter] = useState("");

  const loadStatus = useCallback(async () => {
    const { data } = await API.get("/geo-intel/status");
    setStatus(data);
    setEngines(data.engines || []);
  }, []);

  const loadBrands = useCallback(async () => {
    const { data } = await API.get("/geo-intel/brands");
    const list = data.brands || [];
    setBrands(list);
    setBrandId((prev) => prev || list[0]?._id || "");
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/dashboard", { params: { brandId } });
    setMetrics(data.metrics);
  }, [brandId]);

  const loadQuestions = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/questions", {
      params: {
        brandId,
        engine: engineFilter,
        ...(langFilter ? { language: langFilter } : {}),
      },
    });
    setRows(data.rows || []);
  }, [brandId, engineFilter, langFilter]);

  const loadGsc = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/gsc/imports", { params: { brandId } });
    setGscImports(data.imports || []);
  }, [brandId]);

  useEffect(() => {
    void (async () => {
      try {
        await loadStatus();
        await loadBrands();
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || "Failed to load");
      }
    })();
  }, [loadStatus, loadBrands]);

  useEffect(() => {
    if (!brandId) return;
    void loadDashboard().catch((err) =>
      setError(err?.response?.data?.error || err.message)
    );
    void loadQuestions().catch(() => {});
    void loadGsc().catch(() => {});
  }, [brandId, loadDashboard, loadQuestions, loadGsc]);

  const activeBrand = brands.find((b) => b._id === brandId);

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
      if (data.deduped) setError(copy.runDeduped);
      await loadQuestions();
      await loadDashboard();
      await loadStatus();
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.error || err.message;
      setError(code === "GEO_GEMINI_KEY_MISSING" ? copy.geminiMissing : msg);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!error) return;
    const el = document.getElementById("geo-intel-error");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

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

  const nav = useMemo(
    () =>
      [
        { id: "dashboard" as Tab, label: copy.navOverview },
        { id: "questions" as Tab, label: copy.navQuestions },
        { id: "competitors" as Tab, label: copy.navCompetitors },
        { id: "gsc" as Tab, label: copy.gsc },
        { id: "engines" as Tab, label: copy.engines },
        { id: "settings" as Tab, label: copy.navSettings },
      ] as const,
    [copy]
  );

  const engineRows =
    metrics?.byEngine ||
    engines.map((e) => ({
      engine: e.id,
      label: e.label,
      labelHe: e.labelHe,
      registryStatus: e.status,
      checkStatus: "not_checked",
      n: 0,
      appeared: 0,
      visibilityPct: null as number | null,
    }));

  const visibilityDisplay =
    metrics?.visibilityPct == null ? "—" : `${metrics.visibilityPct}%`;
  const n = metrics?.sampleSize ?? 0;

  return (
    <div className={`${ADMIN_PAGE_SHELL_CLASS} geo-intel-root`} dir={dir}>
      <div className="geo-intel-shell">
        <aside className="geo-intel-side">
          <div className="geo-intel-brand">
            <div className="geo-intel-brand-mark" />
            <span>Bizuply GEO</span>
          </div>
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`geo-intel-nav-btn${tab === item.id ? " active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="geo-intel-side-foot">
            {copy.freeOnly}
            <br />
            {copy.plannedHost}
          </div>
        </aside>

        <main className="geo-intel-main">
          <div className="geo-intel-topbar">
            <div className="geo-intel-title">
              <h1>
                {tab === "questions" ? copy.questionsTitle : copy.title}
              </h1>
              <p>
                {tab === "questions" ? copy.questionsSubtitle : copy.subtitle}
              </p>
            </div>
            <div className="geo-intel-switcher" aria-label={copy.brand}>
              {brands.map((b) => (
                <button
                  key={b._id}
                  type="button"
                  className={brandId === b._id ? "active" : ""}
                  onClick={() => setBrandId(b._id)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="geo-intel-banner">
            <strong>{copy.freeOnly}</strong>
            <div className="meta">
              Gemini:{" "}
              {status?.gemini?.configured ? copy.keyConfigured : copy.keyMissing} ·{" "}
              {copy.quota}: {status?.gemini?.budget?.dailyFreeUsed ?? 0}/
              {status?.gemini?.budget?.dailyFreeCap ?? 400} {copy.day} ·{" "}
              {status?.gemini?.budget?.monthlyFreeUsed ?? 0}/
              {status?.gemini?.budget?.monthlyFreeCap ?? 4500} {copy.month}
              {status?.gemini?.budget?.paused
                ? ` · ${copy.paused}: ${status.gemini.budget.pauseReason}`
                : ""}
              {activeBrand
                ? ` · ${activeBrand.name} (${(activeBrand.domains || []).join(", ")})`
                : ""}
            </div>
          </div>

          <div className="geo-intel-actions">
            <button
              type="button"
              className="geo-btn geo-btn-primary"
              disabled={busy}
              onClick={onSeed}
            >
              {copy.seed}
            </button>
            <button
              type="button"
              className="geo-btn geo-btn-ghost"
              onClick={() => setTab("questions")}
            >
              {copy.navQuestions}
            </button>
            <button
              type="button"
              className="geo-btn geo-btn-ghost"
              onClick={() => setTab("gsc")}
            >
              {copy.importCsv}
            </button>
          </div>

          {error ? (
            <div className="geo-error" role="alert" id="geo-intel-error">
              {error}
            </div>
          ) : null}

          {tab === "dashboard" ? (
            <section>
              <div className="geo-kpi-grid">
                <div className="geo-kpi">
                  <div className="geo-kpi-label">
                    <span className="geo-kpi-icon">◎</span>
                    {copy.mentions}
                  </div>
                  <div className="geo-kpi-value">
                    {n === 0 ? "—" : metrics?.mentions ?? 0}
                  </div>
                  <div className="geo-kpi-sub">
                    {n === 0 ? copy.notCheckedYet : `n=${n}`}
                  </div>
                </div>
                <div className="geo-kpi">
                  <div className="geo-kpi-label">
                    <span className="geo-kpi-icon">★</span>
                    {copy.recommendations}
                  </div>
                  <div className="geo-kpi-value">
                    {n === 0 ? "—" : metrics?.recommendations ?? 0}
                  </div>
                  <div className="geo-kpi-sub">
                    {n === 0 ? copy.notCheckedYet : `n=${n}`}
                  </div>
                </div>
                <div className="geo-kpi">
                  <div className="geo-kpi-label">
                    <span className="geo-kpi-icon">⤴</span>
                    {copy.citations}
                  </div>
                  <div className="geo-kpi-value">
                    {n === 0 ? "—" : metrics?.citations ?? 0}
                  </div>
                  <div className="geo-kpi-sub">
                    {n === 0 ? copy.notCheckedYet : `n=${n}`}
                  </div>
                </div>
                <div className="geo-kpi">
                  <div className="geo-kpi-label">
                    <span className="geo-kpi-icon">▦</span>
                    {copy.competitorRank}
                  </div>
                  <div className="geo-kpi-value">—</div>
                  <div className="geo-kpi-sub">{copy.notCheckedYet}</div>
                </div>
              </div>

              <div className="geo-dash-grid">
                <div className="geo-card">
                  <h3>{copy.visibilityOverTime}</h3>
                  <div className="geo-empty-chart">
                    <div>
                      <div className="orb">✦</div>
                      <div style={{ fontWeight: 800 }}>{copy.waitingFirstChecks}</div>
                      <div
                        style={{
                          marginTop: 6,
                          color: "#64748b",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {copy.noData}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="geo-card geo-score-card">
                  <div style={{ color: "#64748b", fontWeight: 700, fontSize: 13 }}>
                    {copy.visibility}
                  </div>
                  <div className="score">
                    {visibilityDisplay === "—"
                      ? "—"
                      : visibilityDisplay.replace("%", "")}
                  </div>
                  <div style={{ fontWeight: 800, marginTop: 4 }}>
                    {visibilityDisplay === "—"
                      ? copy.noScoreData
                      : `${visibilityDisplay}`}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 6, fontWeight: 600 }}>
                    n={n} · {n === 0 ? copy.notCheckedYet : copy.sampleSize}
                  </div>
                </div>
              </div>

              <div className="geo-card">
                <h3>{copy.engineCompare}</h3>
                <div className="geo-engine-row">
                  {engineRows.map((e) => {
                    const unchecked = e.checkStatus !== "checked";
                    const label = dir === "rtl" ? e.labelHe || e.label : e.label;
                    const pct = e.visibilityPct == null ? 0 : e.visibilityPct;
                    return (
                      <div className="geo-engine-item" key={e.engine}>
                        <div style={{ fontWeight: 800, fontSize: 13 }}>{label}</div>
                        <div className="geo-bar">
                          <span style={{ width: unchecked ? "0%" : `${pct}%` }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>
                          {unchecked
                            ? copy.notChecked
                            : `${e.appeared}/${e.n} · ${pct}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          {tab === "questions" ? (
            <section>
              <div className="geo-filters">
                <select
                  value={engineFilter}
                  onChange={(e) => setEngineFilter(e.target.value)}
                  aria-label={copy.engine}
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
                <select
                  value={langFilter}
                  onChange={(e) => setLangFilter(e.target.value)}
                  aria-label={copy.language}
                >
                  <option value="">{copy.allLanguages}</option>
                  <option value="he">he</option>
                  <option value="en">en</option>
                </select>
                <span className="geo-pill muted">
                  {copy.showing} {rows.length} {copy.questions}
                </span>
              </div>

              <div className="geo-table-wrap">
                <table className="geo-table">
                  <thead>
                    <tr>
                      <th>{copy.question}</th>
                      <th>{copy.engine}</th>
                      <th>{copy.appeared}</th>
                      <th>{copy.recommended}</th>
                      <th>{copy.link}</th>
                      <th>{copy.competitors}</th>
                      <th>{copy.date}</th>
                      <th>{copy.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const unchecked = r.engineCheckStatus === "not_checked";
                      return (
                        <tr key={r.prompt._id}>
                          <td>
                            <button
                              type="button"
                              className="geo-q-text"
                              disabled={!r.latestCheck?.id}
                              onClick={() =>
                                r.latestCheck?.id && openDetail(r.latestCheck.id)
                              }
                            >
                              {r.prompt.text}
                            </button>
                            <div className="geo-tag">
                              {(r.prompt.topic || "starter").toUpperCase()} ·{" "}
                              {r.prompt.language}
                            </div>
                          </td>
                          <td>
                            <span className="geo-pill">{r.engine}</span>
                          </td>
                          <td>
                            <span className={`geo-pill ${unchecked ? "wait" : ""}`}>
                              {statusLabel(
                                copy,
                                unchecked,
                                r.latestCheck?.detected?.appeared
                              )}
                            </span>
                          </td>
                          <td>
                            <span className={`geo-pill ${unchecked ? "wait" : ""}`}>
                              {statusLabel(
                                copy,
                                unchecked,
                                r.latestCheck?.detected?.recommended
                              )}
                            </span>
                          </td>
                          <td>
                            <span className={`geo-pill ${unchecked ? "wait" : ""}`}>
                              {unchecked
                                ? copy.notCheckedYet
                                : r.latestCheck?.detected?.hasLink
                                  ? copy.yes
                                  : copy.no}
                            </span>
                          </td>
                          <td>
                            {unchecked
                              ? copy.notCheckedYet
                              : (r.latestCheck?.detected?.competitors || []).join(
                                  ", "
                                ) || "—"}
                          </td>
                          <td>
                            {r.latestCheck?.checkedAt
                              ? new Date(r.latestCheck.checkedAt).toLocaleString()
                              : copy.notCheckedYet}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="geo-btn geo-btn-outline"
                              disabled={busy || engineFilter !== "gemini"}
                              onClick={() => onCheck(r.prompt._id)}
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

          {tab === "competitors" ? (
            <section className="geo-card">
              <h3>{copy.navCompetitors}</h3>
              <p style={{ color: "#64748b", fontWeight: 600 }}>
                {copy.competitorsEmpty}
              </p>
            </section>
          ) : null}

          {tab === "gsc" ? (
            <section className="geo-card" style={{ display: "grid", gap: 12 }}>
              <h3>{copy.gsc}</h3>
              <p style={{ color: "#64748b", fontWeight: 600, margin: 0 }}>
                {copy.gscHelp}
              </p>
              <textarea
                style={{
                  minHeight: 140,
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  padding: 12,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                }}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Page,Country,Device,Date,Impressions"
              />
              <div>
                <button
                  type="button"
                  className="geo-btn geo-btn-primary"
                  disabled={busy || !csvText.trim()}
                  onClick={onImportGsc}
                >
                  {copy.importCsv}
                </button>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {gscImports.map((g) => (
                  <li
                    key={g._id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "10px 12px",
                      marginBottom: 8,
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {g.filename} · {g.rowCount} rows ·{" "}
                    {g.createdAt ? new Date(g.createdAt).toLocaleString() : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === "engines" || tab === "settings" ? (
            <section className="geo-table-wrap">
              <table className="geo-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{copy.status}</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {engines.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontWeight: 800 }}>
                        {dir === "rtl" ? e.labelHe : e.label}
                      </td>
                      <td>
                        <span
                          className={`geo-pill ${
                            e.status === "ready"
                              ? "ok"
                              : e.status === "planned"
                                ? "wait"
                                : "muted"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td style={{ color: "#64748b" }}>{e.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}
        </main>
      </div>

      {detail?.check ? (
        <div className="geo-drawer-backdrop">
          <div className="geo-drawer" dir={dir}>
            <div className="geo-drawer-head">
              <strong>
                {copy.sources} / {copy.rawAnswer}
              </strong>
              <button
                type="button"
                className="geo-btn geo-btn-ghost"
                onClick={() => setDetail(null)}
              >
                {copy.close}
              </button>
            </div>
            <div className="geo-drawer-body">
              <div>
                <h3 style={{ margin: "0 0 8px" }}>{copy.rawAnswer}</h3>
                <pre className="geo-pre">{detail.check.rawAnswer || "—"}</pre>
              </div>
              <div>
                <h3 style={{ margin: "0 0 8px" }}>{copy.sources}</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {(detail.check.sources || []).map((s: any, i: number) => (
                    <div
                      key={`${s.url}-${i}`}
                      className={`geo-source${s.isBrand ? " brand" : ""}`}
                    >
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontWeight: 800, color: "#4f46e5" }}
                      >
                        {s.title || s.domain || s.url}
                      </a>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{s.url}</div>
                    </div>
                  ))}
                  {(detail.check.sources || []).length === 0 ? (
                    <div className="geo-pill wait">{copy.notCheckedYet}</div>
                  ) : null}
                </div>
              </div>
              <div>
                <h3 style={{ margin: "0 0 8px" }}>{copy.history}</h3>
                <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                  {(detail.history || []).map((h: any) => (
                    <li key={h._id} style={{ marginBottom: 6, fontSize: 13 }}>
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
