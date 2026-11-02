import React, { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../../api";
import { geoIntelCopy, type GeoCopy } from "./geoIntelCopy";
import "./geoIntel.css";

type Brand = { _id: string; slug: string; name: string; domains: string[] };
type Engine = {
  id: string;
  label: string;
  labelHe: string;
  status: string;
  notes?: string;
  notesHe?: string;
  consumerUiMatch?: string;
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

type Tab =
  | "dashboard"
  | "questions"
  | "competitors"
  | "recommendations"
  | "alerts"
  | "gsc"
  | "engines"
  | "settings";

const PAGE_SIZE = 8;

function statusLabel(copy: GeoCopy, unchecked: boolean, value?: boolean) {
  if (unchecked) return copy.waitingCheck;
  if (value === true) return copy.yes;
  if (value === false) return copy.no;
  return "—";
}

function engineStatusHe(copy: GeoCopy, e: Engine) {
  if (e.consumerUiMatch === "dev_tool") return copy.statusDevTool;
  if (e.status === "ready") return copy.statusReady;
  if (e.status === "planned") return copy.statusPlanned;
  return copy.statusUnavailable;
}

function highlightAnswer(
  text: string,
  aliases: string[]
): React.ReactNode {
  if (!text) return "—";
  const terms = aliases.map((a) => String(a || "").trim()).filter(Boolean);
  if (!terms.length) return text;
  const re = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "giu"
  );
  const parts = String(text).split(re);
  return parts.map((part, i) => {
    const hit = terms.some((t) => t.toLowerCase() === part.toLowerCase());
    return hit ? (
      <mark key={i} className="geo-mark">
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    );
  });
}

export default function AdminGeoIntel() {
  const copy = geoIntelCopy();
  const dir = "rtl";

  const [tab, setTab] = useState<Tab>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alpha">("newest");
  const [page, setPage] = useState(1);
  const [compData, setCompData] = useState<any>(null);
  const [recData, setRecData] = useState<any>(null);
  const [truthPlan, setTruthPlan] = useState<any>(null);

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
    const { data } = await API.get("/geo-intel/dashboard", {
      params: {
        brandId,
        ...(engineFilter ? { engine: engineFilter } : {}),
        ...(fromDate ? { from: fromDate } : {}),
        ...(toDate ? { to: toDate } : {}),
      },
    });
    setMetrics(data.metrics);
  }, [brandId, engineFilter, fromDate, toDate]);

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
    setPage(1);
  }, [brandId, engineFilter, langFilter]);

  const loadGsc = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/gsc/imports", { params: { brandId } });
    setGscImports(data.imports || []);
  }, [brandId]);

  const loadCompetitors = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/competitors", {
      params: {
        brandId,
        ...(engineFilter ? { engine: engineFilter } : {}),
        ...(fromDate ? { from: fromDate } : {}),
        ...(toDate ? { to: toDate } : {}),
      },
    });
    setCompData(data);
  }, [brandId, engineFilter, fromDate, toDate]);

  const loadRecommendations = useCallback(async () => {
    if (!brandId) return;
    const { data } = await API.get("/geo-intel/recommendations", {
      params: { brandId },
    });
    setRecData(data);
  }, [brandId]);

  useEffect(() => {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await loadStatus();
        await loadBrands();
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || "טעינה נכשלה");
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
    void loadCompetitors().catch(() => {});
    void loadRecommendations().catch(() => {});
  }, [
    brandId,
    loadDashboard,
    loadQuestions,
    loadGsc,
    loadCompetitors,
    loadRecommendations,
  ]);

  useEffect(() => {
    if (!error) return;
    document
      .getElementById("geo-intel-error")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  const activeBrand = brands.find((b) => b._id === brandId);

  const filteredRows = useMemo(() => {
    let list = [...rows];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) => r.prompt.text.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      if (sortBy === "alpha") {
        return a.prompt.text.localeCompare(b.prompt.text, "he");
      }
      const ta = a.latestCheck?.checkedAt
        ? new Date(a.latestCheck.checkedAt).getTime()
        : 0;
      const tb = b.latestCheck?.checkedAt
        ? new Date(b.latestCheck.checkedAt).getTime()
        : 0;
      return sortBy === "oldest" ? ta - tb : tb - ta;
    });
    return list;
  }, [rows, search, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  const onPrepareTruth = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post("/geo-intel/prepare-truth-checks");
      setTruthPlan(data);
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
      await loadCompetitors();
      await loadRecommendations();
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const msg = err?.response?.data?.error || err.message;
      setError(code === "GEO_GEMINI_KEY_MISSING" ? copy.geminiMissing : msg);
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

  const nav = [
    { id: "dashboard" as Tab, label: copy.navOverview },
    { id: "questions" as Tab, label: copy.navQuestions },
    { id: "competitors" as Tab, label: copy.navCompetitors },
    { id: "recommendations" as Tab, label: copy.navRecommendations },
    { id: "alerts" as Tab, label: copy.navAlerts },
    { id: "gsc" as Tab, label: copy.gsc },
    { id: "engines" as Tab, label: copy.engines },
    { id: "settings" as Tab, label: copy.navSettings },
  ];

  const selectTab = (id: Tab) => {
    setTab(id);
    setMenuOpen(false);
  };

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

  const n = metrics?.sampleSize ?? 0;
  const visibilityDisplay =
    metrics?.visibilityPct == null ? null : metrics.visibilityPct;
  const mentionPct =
    n > 0 ? Math.round(((metrics?.mentions || 0) / n) * 1000) / 10 : null;

  const brandAliases = [
    activeBrand?.name,
    ...(activeBrand?.domains || []).map((d) => d.split(".")[0]),
  ].filter(Boolean) as string[];

  const title =
    tab === "questions"
      ? copy.questionsTitle
      : tab === "competitors"
        ? copy.competitorsTitle
        : tab === "recommendations"
          ? copy.recommendationsTitle
          : copy.title;

  const subtitle =
    tab === "questions"
      ? copy.questionsSubtitle
      : tab === "competitors"
        ? copy.competitorsSubtitle
        : tab === "recommendations"
          ? copy.recommendationsSubtitle
          : copy.subtitle;

  return (
    <div className="geo-intel-root geo-intel-standalone" dir={dir} lang="he">
      <div className={`geo-intel-shell${menuOpen ? " menu-open" : ""}`}>
        <aside className="geo-intel-side" aria-label="ניווט GEO">
          <div className="geo-intel-brand">
            <div className="geo-intel-brand-mark" aria-hidden />
            <span>Bizuply GEO</span>
          </div>
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`geo-intel-nav-btn${tab === item.id ? " active" : ""}`}
              onClick={() => selectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="geo-intel-side-foot">
            {copy.hebrewUiOnly}
            <br />
            {copy.plannedHost}
          </div>
        </aside>

        {menuOpen ? (
          <button
            type="button"
            className="geo-menu-backdrop"
            aria-label={copy.closeMenu}
            onClick={() => setMenuOpen(false)}
          />
        ) : null}

        <main className="geo-intel-main">
          <div className="geo-intel-topbar">
            <button
              type="button"
              className="geo-menu-toggle"
              aria-label={copy.openMenu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰ {copy.menu}
            </button>
            <div className="geo-intel-title">
              <h1>{title}</h1>
              <p>{subtitle}</p>
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
              disabled={busy}
              onClick={onPrepareTruth}
            >
              {copy.prepareTruth}
            </button>
            <button
              type="button"
              className="geo-btn geo-btn-ghost"
              onClick={() => selectTab("questions")}
            >
              {copy.navQuestions}
            </button>
          </div>

          {truthPlan ? (
            <div className="geo-intel-banner">
              <strong>{copy.prepareTruthDone}</strong>
              <div className="meta">
                {(truthPlan.plans || [])
                  .map(
                    (p: any) =>
                      `${p.brandName}: ${p.prompts?.length || 0} שאלות · ${p.status}`
                  )
                  .join(" · ")}
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="geo-error" role="alert" id="geo-intel-error">
              {error}
            </div>
          ) : null}

          {(tab === "dashboard" || tab === "questions") && (
            <div className="geo-filters">
              <select
                value={engineFilter}
                onChange={(e) => setEngineFilter(e.target.value)}
                aria-label={copy.engine}
              >
                <option value="gemini">Gemini</option>
                {engines
                  .filter((e) => e.id !== "gemini")
                  .map((e) => (
                    <option
                      key={e.id}
                      value={e.id}
                      disabled={e.status !== "ready"}
                    >
                      {e.labelHe || e.label} ({engineStatusHe(copy, e)})
                    </option>
                  ))}
              </select>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                aria-label={copy.language}
              >
                <option value="">{copy.allLanguages}</option>
                <option value="he">עברית (he)</option>
                <option value="en">English (en)</option>
              </select>
              <label className="geo-date-label">
                {copy.fromDate}
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </label>
              <label className="geo-date-label">
                {copy.toDate}
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="geo-btn geo-btn-ghost"
                onClick={() => {
                  void loadDashboard();
                  void loadQuestions();
                  void loadCompetitors();
                }}
              >
                {copy.applyFilters}
              </button>
              <button
                type="button"
                className="geo-btn geo-btn-ghost"
                onClick={() => {
                  setLangFilter("");
                  setFromDate("");
                  setToDate("");
                  setSearch("");
                }}
              >
                {copy.clearFilters}
              </button>
            </div>
          )}

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
                    {n === 0
                      ? copy.notCheckedYet
                      : `${mentionPct}% ${copy.pctOfChecked} · n=${n}`}
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
                    {copy.questionsChecked}
                  </div>
                  <div className="geo-kpi-value">
                    {n === 0 ? "—" : metrics?.questionsChecked ?? 0}
                  </div>
                  <div className="geo-kpi-sub">
                    {n === 0 ? copy.notCheckedYet : copy.sampleSize}
                  </div>
                </div>
              </div>

              <div className="geo-dash-grid">
                <div className="geo-card">
                  <h3>{copy.visibilityOverTime}</h3>
                  {metrics?.byDay?.length ? (
                    <div className="geo-trend">
                      {metrics.byDay.map((d) => (
                        <div key={d.day} className="geo-trend-row">
                          <span>{d.day}</span>
                          <div className="geo-bar">
                            <span
                              style={{
                                width: `${d.visibilityPct ?? 0}%`,
                              }}
                            />
                          </div>
                          <span>
                            {d.visibilityPct == null
                              ? copy.notChecked
                              : `${d.visibilityPct}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="geo-empty-chart">
                      <div>
                        <div className="orb">✦</div>
                        <div style={{ fontWeight: 800 }}>
                          {copy.waitingFirstChecks}
                        </div>
                        <div className="geo-empty-sub">{copy.noData}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="geo-card geo-score-card">
                  <div className="geo-score-label">{copy.visibility}</div>
                  <div className="score">
                    {visibilityDisplay == null ? "—" : visibilityDisplay}
                  </div>
                  <div style={{ fontWeight: 800, marginTop: 4 }}>
                    {visibilityDisplay == null
                      ? copy.noScoreData
                      : `${visibilityDisplay}%`}
                  </div>
                  <div className="geo-empty-sub">
                    n={n} · {n === 0 ? copy.notCheckedYet : metrics?.visibilityNote}
                  </div>
                </div>
              </div>

              <div className="geo-card">
                <h3>{copy.engineCompare}</h3>
                <p className="geo-hint">{copy.apiVsConsumer}</p>
                <div className="geo-engine-row">
                  {engineRows.map((e) => {
                    const unchecked = e.checkStatus !== "checked";
                    const label = e.labelHe || e.label;
                    const pct = e.visibilityPct == null ? 0 : e.visibilityPct;
                    return (
                      <div className="geo-engine-item" key={e.engine}>
                        <div className="geo-engine-name">{label}</div>
                        <div className="geo-bar">
                          <span style={{ width: unchecked ? "0%" : `${pct}%` }} />
                        </div>
                        <div className="geo-engine-meta">
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
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder={copy.search}
                  aria-label={copy.search}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label={copy.sortBy}
                >
                  <option value="newest">{copy.sortNewest}</option>
                  <option value="oldest">{copy.sortOldest}</option>
                  <option value="alpha">{copy.sortAlpha}</option>
                </select>
                <span className="geo-pill muted">
                  {copy.showing} {pageRows.length} {copy.of} {filteredRows.length}{" "}
                  {copy.questions}
                </span>
              </div>

              <div className="geo-table-wrap">
                <table className="geo-table">
                  <thead>
                    <tr>
                      <th>{copy.question}</th>
                      <th>{copy.engine}</th>
                      <th>{copy.language}</th>
                      <th>{copy.appeared}</th>
                      <th>{copy.recommended}</th>
                      <th>{copy.link}</th>
                      <th>{copy.competitors}</th>
                      <th>{copy.date}</th>
                      <th>{copy.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((r) => {
                      const unchecked = r.engineCheckStatus === "not_checked";
                      return (
                        <tr key={r.prompt._id}>
                          <td>
                            <button
                              type="button"
                              className="geo-q-text"
                              disabled={!r.latestCheck?.id}
                              onClick={() =>
                                r.latestCheck?.id &&
                                openDetail(r.latestCheck.id)
                              }
                            >
                              {r.prompt.text}
                            </button>
                            <div className="geo-tag">
                              {(r.prompt.topic || "starter").toUpperCase()}
                            </div>
                          </td>
                          <td>
                            <span className="geo-pill">{r.engine}</span>
                          </td>
                          <td>{r.prompt.language}</td>
                          <td>
                            <span
                              className={`geo-pill ${unchecked ? "wait" : ""}`}
                            >
                              {statusLabel(
                                copy,
                                unchecked,
                                r.latestCheck?.detected?.appeared
                              )}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`geo-pill ${unchecked ? "wait" : ""}`}
                            >
                              {statusLabel(
                                copy,
                                unchecked,
                                r.latestCheck?.detected?.recommended
                              )}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`geo-pill ${unchecked ? "wait" : ""}`}
                            >
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
                              ? new Date(
                                  r.latestCheck.checkedAt
                                ).toLocaleString("he-IL", {
                                  timeZone: "Asia/Jerusalem",
                                })
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

              <div className="geo-pager">
                <button
                  type="button"
                  className="geo-btn geo-btn-ghost"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {copy.prev}
                </button>
                <span>
                  {copy.page} {page} {copy.of} {pageCount}
                </span>
                <button
                  type="button"
                  className="geo-btn geo-btn-ghost"
                  disabled={page >= pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  {copy.next}
                </button>
              </div>
            </section>
          ) : null}

          {tab === "competitors" ? (
            <section className="geo-stack">
              <div className="geo-card">
                <h3>{copy.competitorsTitle}</h3>
                <p className="geo-hint">
                  {compData?.note || copy.competitorsEmpty}
                </p>
                {(compData?.competitors || []).length === 0 ? (
                  <div className="geo-pill wait">{copy.notCheckedYet}</div>
                ) : (
                  <div className="geo-table-wrap">
                    <table className="geo-table">
                      <thead>
                        <tr>
                          <th>{copy.competitors}</th>
                          <th>{copy.mentions}</th>
                          <th>{copy.recommendations}</th>
                          <th>לבד בלי המותג</th>
                        </tr>
                      </thead>
                      <tbody>
                        {compData.competitors.map((c: any) => (
                          <tr key={c.name}>
                            <td style={{ fontWeight: 800 }}>{c.name}</td>
                            <td>{c.mentions}</td>
                            <td>{c.recommendationsOverlap}</td>
                            <td>{c.aloneWins}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="geo-card">
                <h3>{copy.gapsTitle}</h3>
                {(compData?.gapsWhereCompetitorsWin || []).length === 0 ? (
                  <div className="geo-pill muted">{copy.notCheckedYet}</div>
                ) : (
                  <ul className="geo-list">
                    {compData.gapsWhereCompetitorsWin.map((g: any) => (
                      <li key={String(g.checkId)}>
                        <button
                          type="button"
                          className="geo-q-text"
                          onClick={() => openDetail(g.checkId)}
                        >
                          {g.question}
                        </button>
                        <div className="geo-tag">
                          {g.engine} · {(g.competitors || []).join(", ")}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="geo-card">
                <h3>{copy.topSourcesTitle}</h3>
                {(compData?.topSources || []).length === 0 ? (
                  <div className="geo-pill muted">{copy.notCheckedYet}</div>
                ) : (
                  <ul className="geo-list">
                    {compData.topSources.map((s: any) => (
                      <li key={s.domain}>
                        <strong>{s.domain}</strong> · {s.count}
                        {s.isBrand ? " · מותג" : ""}
                        {s.isCompetitor ? " · מתחרה" : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ) : null}

          {tab === "recommendations" ? (
            <section className="geo-stack">
              <div className="geo-kpi-grid geo-kpi-grid-3">
                <div className="geo-kpi">
                  <div className="geo-kpi-label">{copy.visibility}</div>
                  <div className="geo-kpi-value">
                    {recData?.visibilityPct == null
                      ? "—"
                      : `${recData.visibilityPct}%`}
                  </div>
                </div>
                <div className="geo-kpi">
                  <div className="geo-kpi-label">{copy.mentions}</div>
                  <div className="geo-kpi-value">
                    {recData?.checkStatus === "not_checked"
                      ? "—"
                      : recData?.mentions ?? "—"}
                  </div>
                </div>
                <div className="geo-kpi">
                  <div className="geo-kpi-label">{copy.citations}</div>
                  <div className="geo-kpi-value">
                    {recData?.checkStatus === "not_checked"
                      ? "—"
                      : recData?.citations ?? "—"}
                  </div>
                </div>
              </div>
              {(recData?.tips || []).map((t: any) => (
                <div key={t.id} className={`geo-tip geo-tip-${t.severity}`}>
                  <strong>{t.title}</strong>
                  <p>{t.body}</p>
                </div>
              ))}
            </section>
          ) : null}

          {tab === "alerts" ? (
            <section className="geo-card">
              <h3>{copy.navAlerts}</h3>
              <p className="geo-hint">{copy.alertsEmpty}</p>
            </section>
          ) : null}

          {tab === "gsc" ? (
            <section className="geo-card geo-stack">
              <h3>{copy.gsc}</h3>
              <p className="geo-hint">{copy.gscHelp}</p>
              <textarea
                className="geo-textarea"
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
              <ul className="geo-list">
                {gscImports.map((g) => (
                  <li key={g._id} className="geo-import-row">
                    {g.filename} · {g.rowCount} שורות ·{" "}
                    {g.createdAt
                      ? new Date(g.createdAt).toLocaleString("he-IL", {
                          timeZone: "Asia/Jerusalem",
                        })
                      : ""}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tab === "engines" || tab === "settings" ? (
            <section>
              <p className="geo-hint">{copy.apiVsConsumer}</p>
              <div className="geo-table-wrap">
                <table className="geo-table">
                  <thead>
                    <tr>
                      <th>מנוע</th>
                      <th>{copy.status}</th>
                      <th>הערות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engines.map((e) => (
                      <tr key={e.id}>
                        <td style={{ fontWeight: 800 }}>
                          {e.labelHe || e.label}
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
                            {engineStatusHe(copy, e)}
                          </span>
                        </td>
                        <td className="geo-muted-cell">
                          {e.notesHe || e.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {detail?.check ? (
        <div className="geo-drawer-backdrop">
          <div className="geo-drawer" dir="rtl" lang="he">
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
              <div className="geo-meta-grid">
                <div>
                  <span className="geo-meta-k">{copy.engine}</span>
                  <span>{detail.check.engine}</span>
                </div>
                <div>
                  <span className="geo-meta-k">{copy.model}</span>
                  <span>{detail.check.model || "—"}</span>
                </div>
                <div>
                  <span className="geo-meta-k">{copy.checkedAt}</span>
                  <span>
                    {detail.check.checkedAt
                      ? new Date(detail.check.checkedAt).toLocaleString(
                          "he-IL",
                          { timeZone: "Asia/Jerusalem" }
                        )
                      : "—"}
                  </span>
                </div>
              </div>
              <div>
                <h3>
                  {copy.rawAnswer} · {copy.mentionHighlight}
                </h3>
                <div className="geo-pre">
                  {highlightAnswer(
                    detail.check.rawAnswer || "",
                    [
                      ...brandAliases,
                      ...(detail.check.brandId?.aliases || []),
                      detail.check.brandId?.name,
                    ].filter(Boolean)
                  )}
                </div>
              </div>
              <div>
                <h3>{copy.competitors}</h3>
                <div>
                  {(detail.check.detected?.competitors || []).join(", ") ||
                    "—"}
                </div>
              </div>
              <div>
                <h3>{copy.ourSources}</h3>
                <SourceList
                  sources={(detail.check.sources || []).filter(
                    (s: any) => s.isBrand
                  )}
                  empty={copy.notCheckedYet}
                />
              </div>
              <div>
                <h3>{copy.competitorSources}</h3>
                <SourceList
                  sources={(detail.check.sources || []).filter(
                    (s: any) => s.isCompetitor && !s.isBrand
                  )}
                  empty="—"
                />
              </div>
              <div>
                <h3>{copy.otherSources}</h3>
                <SourceList
                  sources={(detail.check.sources || []).filter(
                    (s: any) => !s.isBrand && !s.isCompetitor
                  )}
                  empty="—"
                />
              </div>
              <div>
                <h3>{copy.history}</h3>
                <ul className="geo-list">
                  {(detail.history || []).map((h: any) => (
                    <li key={h._id}>
                      {h.checkedAt
                        ? new Date(h.checkedAt).toLocaleString("he-IL", {
                            timeZone: "Asia/Jerusalem",
                          })
                        : h.dayBucket}{" "}
                      · הופיע={String(h.detected?.appeared)} · מודל={h.model}
                    </li>
                  ))}
                  {(detail.history || []).length === 0 ? (
                    <li>{copy.notCheckedYet}</li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SourceList({
  sources,
  empty,
}: {
  sources: Array<{ url?: string; title?: string; domain?: string; isBrand?: boolean }>;
  empty: string;
}) {
  if (!sources.length) return <div className="geo-pill muted">{empty}</div>;
  return (
    <div className="geo-source-list">
      {sources.map((s, i) => (
        <div
          key={`${s.url}-${i}`}
          className={`geo-source${s.isBrand ? " brand" : ""}`}
        >
          {s.url ? (
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title || s.domain || s.url}
            </a>
          ) : (
            <strong>{s.title || s.domain || "—"}</strong>
          )}
          <div className="geo-source-url">{s.url}</div>
        </div>
      ))}
    </div>
  );
}
