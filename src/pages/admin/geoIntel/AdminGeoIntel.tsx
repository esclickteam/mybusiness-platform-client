import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { geoIntelCopy } from "./geoIntelCopy";
import { geoGet, geoPatch, geoPost } from "./geoApi";
import {
  formatSeedResultHe,
  shouldShowSeedInitButton,
  type SeedSummary,
} from "./seedBootstrap";
import { canShowMeasurementActions } from "./runActionVisibility";
import { findingKindHe } from "./improvementWork";
import ImprovementWorkList from "./ImprovementWorkList";
import {
  collectionMethodHe,
  dataClassHe,
  priorityHe,
  sampleSizeHe,
  severityHe,
} from "./geoLabels";
import type { Brand, Engine, Tab } from "./types";
import "./geoIntel.css";

type Props = { stagingInfo?: Record<string, unknown> | null };

function AwaitBox({ message }: { message?: string }) {
  return (
    <div className="geo-intel-banner" role="status">
      {message ||
        "ממתין לחיבור מקור / מדידות אמת — אין נתונים מומצאים."}
    </div>
  );
}

function Kpi({
  label,
  value,
  denom,
  onClick,
}: {
  label: string;
  value: string | number | null | undefined;
  denom?: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        className="geo-kpi geo-kpi-clickable"
        onClick={onClick}
      >
        <div className="geo-kpi-label">{label}</div>
        <div className="geo-kpi-value">{value ?? "—"}</div>
        {denom ? <div className="geo-kpi-sub">{denom}</div> : null}
      </button>
    );
  }
  return (
    <div className="geo-kpi">
      <div className="geo-kpi-label">{label}</div>
      <div className="geo-kpi-value">{value ?? "—"}</div>
      {denom ? <div className="geo-kpi-sub">{denom}</div> : null}
    </div>
  );
}

function Table({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="geo-table-wrap">
      <table className="geo-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>אין שורות להצגה</td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminGeoIntel({ stagingInfo = null }: Props) {
  const copy = geoIntelCopy();
  const location = useLocation();
  const embeddedInAdmin = /\/admin(\/|$)/.test(location.pathname);
  const [tab, setTab] = useState<Tab>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannersDismissed, setBannersDismissed] = useState(() => {
    try {
      return sessionStorage.getItem("geo-intel-banners-dismissed") === "1";
    } catch {
      return false;
    }
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandId, setBrandId] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [engines, setEngines] = useState<Engine[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [engineFilter, setEngineFilter] = useState("");
  const [langFilter, setLangFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);
  const [seedSummary, setSeedSummary] = useState<SeedSummary | null>(null);
  const [seedInitConsumed, setSeedInitConsumed] = useState(false);
  const [trialConfirmOpen, setTrialConfirmOpen] = useState(false);
  const [trialResult, setTrialResult] = useState<any>(null);

  const [overview, setOverview] = useState<any>(null);
  const [visibility, setVisibility] = useState<any>(null);
  const [promptIntel, setPromptIntel] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any>(null);
  const [citations, setCitations] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any>(null);
  const [improvementPlan, setImprovementPlan] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [tech, setTech] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [providers, setProviders] = useState<any>(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [manualForm, setManualForm] = useState({
    promptId: "",
    engine: "openai",
    language: "he",
    country: "IL",
    rawAnswer: "",
    sourcesText: "",
    model: "",
  });
  const [prompts, setPrompts] = useState<any[]>([]);
  const [csvText, setCsvText] = useState("");
  const [gscImports, setGscImports] = useState<any[]>([]);
  const [catalogDraft, setCatalogDraft] = useState<any>(null);
  const [costMatrix, setCostMatrix] = useState<any>(null);
  const [monitoringStatus, setMonitoringStatus] = useState<any>(null);

  const activeBrand = useMemo(
    () => brands.find((b) => b._id === brandId) || null,
    [brands, brandId]
  );

  const filterParams = useMemo(() => {
    const p: Record<string, string> = { brandId };
    if (engineFilter && engineFilter !== "all") p.engine = engineFilter;
    if (langFilter) p.language = langFilter;
    if (fromDate) p.from = fromDate;
    if (toDate) p.to = toDate;
    return p;
  }, [brandId, engineFilter, langFilter, fromDate, toDate]);

  const loadCore = useCallback(async () => {
    const [st, br, prov] = await Promise.all([
      geoGet("/status"),
      geoGet("/brands"),
      geoGet("/providers"),
    ]);
    setStatus(st);
    setEngines(st.engines || []);
    setBrands(br.brands || []);
    setProviders(prov);
    if (st?.seedBootstrap?.complete) setSeedInitConsumed(true);
    setBrandId((prev) => prev || br.brands?.[0]?._id || "");
  }, []);

  const loadBrandData = useCallback(async () => {
    if (!brandId) return;
    setBusy(true);
    setError("");
    try {
      const [
        dash,
        vis,
        pi,
        comp,
        cit,
        opp,
        plan,
        tr,
        cont,
        ta,
        al,
        ch,
        pr,
        gsc,
      ] = await Promise.all([
        geoGet("/dashboard", filterParams),
        geoGet("/visibility", filterParams),
        geoGet("/prompt-intel", filterParams),
        geoGet("/competitor-intel", filterParams),
        geoGet("/citations", filterParams),
        geoGet("/opportunities", filterParams),
        geoGet("/improvement-plan", { ...filterParams, engine: "perplexity" }),
        geoGet("/trends", filterParams),
        geoGet("/content-intel", { brandId }),
        geoGet("/tech-audit", { brandId }),
        geoGet("/alerts", { brandId }),
        geoGet("/checks", { brandId, limit: 100 }),
        geoGet("/prompts", { brandId, active: "1" }),
        geoGet("/gsc/imports", { brandId }),
      ]);
      setOverview(dash);
      setVisibility(vis);
      setPromptIntel(pi);
      setCompetitors(comp);
      setCitations(cit);
      setOpportunities(opp);
      setImprovementPlan(plan);
      setTrends(tr);
      setContent(cont);
      setTech(ta);
      setAlerts(al);
      setChecks(ch.checks || []);
      setPrompts(pr.prompts || []);
      setGscImports(gsc.imports || []);
      setManualForm((prev) => ({
        ...prev,
        promptId: prev.promptId || pr.prompts?.[0]?._id || "",
        language:
          activeBrand?.slug === "bizuply"
            ? "en"
            : activeBrand?.slug === "invistimo"
              ? "he"
              : prev.language,
        country: activeBrand?.slug === "invistimo" ? "IL" : "",
      }));
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || "טעינה נכשלה");
    } finally {
      setBusy(false);
    }
  }, [brandId, filterParams, activeBrand?.slug]);

  useEffect(() => {
    loadCore().catch((e) =>
      setError(e?.response?.data?.error || e.message || "status failed")
    );
  }, [loadCore]);

  useEffect(() => {
    if (!activeBrand) return;
    if (activeBrand.slug === "invistimo") setLangFilter("he");
    else if (activeBrand.slug === "bizuply") setLangFilter("en");
  }, [activeBrand?.slug]);

  useEffect(() => {
    loadBrandData();
  }, [loadBrandData]);

  useEffect(() => {
    if (tab !== "catalogDraft") return;
    let cancelled = false;
    (async () => {
      try {
        const slug = activeBrand?.slug || "";
        const data = await geoGet("/catalog-draft", {
          brandSlug: slug || undefined,
          limit: 150,
          offset: 0,
        });
        if (!cancelled) setCatalogDraft(data);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.response?.data?.error || e.message || "catalog draft failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, activeBrand?.slug]);

  useEffect(() => {
    if (tab !== "costs" && tab !== "settings") return;
    let cancelled = false;
    (async () => {
      try {
        const [costs, mon] = await Promise.all([
          geoGet("/cost-matrix"),
          geoGet("/monitoring-status"),
        ]);
        if (!cancelled) {
          setCostMatrix(costs);
          setMonitoringStatus(mon);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.response?.data?.error || e.message || "cost matrix failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const nav: Array<{ id: Tab; label: string }> = [
    { id: "overview", label: copy.navOverview },
    { id: "visibility", label: "נראות AI" },
    { id: "appeared", label: "שאלות שבהן הופענו" },
    { id: "missing", label: "שאלות שבהן לא הופענו" },
    { id: "discovery", label: "גילוי שאלות" },
    { id: "competitors", label: copy.navCompetitors },
    { id: "citations", label: "מקורות וציטוטים" },
    { id: "opportunities", label: "הזדמנויות" },
    { id: "improvementPlan", label: copy.navImprovementPlan },
    { id: "content", label: "ניתוח תוכן" },
    { id: "tech", label: "ביקורת טכנית" },
    { id: "trends", label: "מגמות" },
    { id: "reports", label: "דוחות" },
    { id: "measurements", label: "ניהול מדידות" },
    { id: "alerts", label: copy.navAlerts },
    { id: "catalogDraft", label: copy.navCatalogDraft },
    { id: "costs", label: copy.navCosts },
    { id: "settings", label: copy.navSettings },
  ];

  const selectTab = (id: Tab) => {
    setTab(id);
    setMenuOpen(false);
  };

  const openCheck = async (id: string) => {
    try {
      const data = await geoGet(`/checks/${id}`);
      setDetail(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || "detail failed");
    }
  };

  const runSeed = async () => {
    setBusy(true);
    try {
      const data = await geoPost("/seed");
      setSeedSummary(data.summary || data.result?.summary || null);
      setSeedInitConsumed(true);
      setSeedConfirmOpen(false);
      await loadBrandData();
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || "seed failed");
    } finally {
      setBusy(false);
    }
  };

  const runTrialSmoke = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await geoPost("/trial-smoke", { confirm: true });
      setTrialResult(data);
      setTrialConfirmOpen(false);
      await loadCore();
      await loadBrandData();
      if (data?.check?.detected?.appeared) selectTab("appeared");
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || "trial smoke failed");
    } finally {
      setBusy(false);
    }
  };

  const saveManual = async () => {
    setBusy(true);
    try {
      const sources = manualForm.sourcesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      await geoPost("/manual-check", {
        brandId,
        promptId: manualForm.promptId,
        engine: manualForm.engine,
        language: manualForm.language,
        country: manualForm.country,
        model: manualForm.model,
        rawAnswer: manualForm.rawAnswer,
        sources,
        dataClass: "measurement",
      });
      setManualForm((p) => ({ ...p, rawAnswer: "", sourcesText: "" }));
      await loadBrandData();
      selectTab("appeared");
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message || "manual failed");
    } finally {
      setBusy(false);
    }
  };

  const q = search.trim().toLowerCase();
  const filterText = (text: string) =>
    !q || String(text || "").toLowerCase().includes(q);

  const title =
    nav.find((n) => n.id === tab)?.label || copy.title;

  return (
    <div
      className={`geo-intel-root${embeddedInAdmin ? " geo-intel-embedded" : " geo-intel-standalone"}`}
      dir="rtl"
      lang="he"
    >
      <div className={`geo-intel-shell${menuOpen ? " menu-open" : ""}`}>
        <aside className="geo-intel-side" aria-label="ניווט">
          <div className="geo-intel-brand">
            <div className="geo-intel-brand-mark" aria-hidden />
            <div>
              <strong>{copy.title}</strong>
              <div className="geo-side-sub">שימוש פנימי בלבד</div>
            </div>
          </div>
          <div className="geo-intel-nav-scroll">
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
          </div>
          <div className="geo-intel-side-foot">{copy.privateOwnerOnly}</div>
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
          {embeddedInAdmin ? (
            <div className="geo-embed-tabs" aria-label="ניווט">
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
            </div>
          ) : null}
          <div className="geo-intel-topbar">
            <button
              type="button"
              className="geo-menu-toggle"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {copy.menu}
            </button>
            <div className="geo-intel-title">
              <h1>{title}</h1>
              <p>
                {copy.subtitle}
                {activeBrand
                  ? ` · ${activeBrand.name} (${(activeBrand.domains || []).join(", ")})`
                  : ""}
              </p>
            </div>
            <div className="geo-intel-switcher" aria-label={copy.brand}>
              {brands.map((b) => (
                <button
                  key={b._id}
                  type="button"
                  className={brandId === b._id ? "active" : ""}
                  onClick={() => {
                    setBrandId(b._id);
                    setLangFilter(
                      b.slug === "invistimo"
                        ? "he"
                        : b.slug === "bizuply"
                          ? "en"
                          : ""
                    );
                  }}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {!bannersDismissed ? (
            <>
              <div className="geo-intel-banner">{copy.freeOnly}</div>
              <div className="geo-intel-banner muted">
                {copy.hebrewUiOnly}
                {" · "}
                <button
                  type="button"
                  className="geo-link-btn"
                  onClick={() => {
                    setBannersDismissed(true);
                    try {
                      sessionStorage.setItem(
                        "geo-intel-banners-dismissed",
                        "1"
                      );
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  {copy.dismissBanners}
                </button>
              </div>
            </>
          ) : null}

          <div className="geo-intel-actions">
            {shouldShowSeedInitButton(status?.seedBootstrap, seedInitConsumed) ? (
              <button
                type="button"
                className="geo-btn geo-btn-primary"
                disabled={busy}
                onClick={() => setSeedConfirmOpen(true)}
              >
                {copy.seed}
              </button>
            ) : null}
            {canShowMeasurementActions(status) &&
            status?.trialSmoke?.buttonVisible !== false &&
            status?.perplexity?.billingApproved ? (
              <button
                type="button"
                className="geo-btn geo-btn-primary"
                disabled={busy || status?.trialSmoke?.inProgress}
                title={copy.trialSmokeHint}
                onClick={() => setTrialConfirmOpen(true)}
              >
                {copy.trialSmoke}
              </button>
            ) : null}
            <button
              type="button"
              className="geo-btn geo-btn-ghost"
              disabled={busy || !brandId}
              onClick={() => loadBrandData()}
            >
              רענון
            </button>
          </div>

          {seedSummary ? (
            <div className="geo-intel-banner geo-seed-result" role="status">
              {formatSeedResultHe(seedSummary)}
            </div>
          ) : null}

          {trialResult?.check ? (
            <div className="geo-intel-banner geo-seed-result" role="status">
              {copy.trialSmokeDone}
              {" · "}
              מקורות: {trialResult.check.sourcesCount ?? 0}
              {" · "}
              עלות: ${Number(trialResult.check.estimatedCostUsd || 0).toFixed(4)}
              {" · "}
              תקציב: ${Number(trialResult.budget?.spentUsd || 0).toFixed(4)} / $
              {Number(trialResult.budget?.hardCapUsd || 2).toFixed(0)}
            </div>
          ) : null}

          {seedConfirmOpen ? (
            <div className="geo-confirm-backdrop">
              <div className="geo-confirm-dialog" role="dialog">
                <h3>{copy.seedConfirmTitle}</h3>
                <p>{copy.seedConfirmBody}</p>
                <div className="geo-confirm-actions">
                  <button
                    type="button"
                    className="geo-btn geo-btn-ghost"
                    onClick={() => setSeedConfirmOpen(false)}
                  >
                    {copy.seedCancel}
                  </button>
                  <button
                    type="button"
                    className="geo-btn geo-btn-primary"
                    disabled={busy}
                    onClick={runSeed}
                  >
                    {copy.seedConfirmAction}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {trialConfirmOpen ? (
            <div className="geo-confirm-backdrop">
              <div className="geo-confirm-dialog" role="dialog">
                <h3>{copy.trialSmokeConfirmTitle}</h3>
                <p>{copy.trialSmokeConfirmBody}</p>
                <div className="geo-confirm-actions">
                  <button
                    type="button"
                    className="geo-btn geo-btn-ghost"
                    onClick={() => setTrialConfirmOpen(false)}
                  >
                    {copy.trialSmokeCancel}
                  </button>
                  <button
                    type="button"
                    className="geo-btn geo-btn-primary"
                    disabled={busy}
                    onClick={runTrialSmoke}
                  >
                    {copy.trialSmokeConfirmAction}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="geo-error" role="alert" id="geo-intel-error">
              {error}
            </div>
          ) : null}

          <div className="geo-filters">
            <select
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value)}
              aria-label={copy.engine}
            >
              <option value="">{copy.allEngines}</option>
              {engines.map((en) => (
                <option key={en.id} value={en.id}>
                  {en.labelHe || en.label}
                </option>
              ))}
            </select>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              aria-label={copy.language}
            >
              <option value="">{copy.allLanguages}</option>
              <option value="he">{copy.langHebrew}</option>
              <option value="en">{copy.langEnglish}</option>
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label={copy.fromDate}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label={copy.toDate}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={copy.search}
            />
          </div>

          {tab === "overview" ? (
            <section>
              {(overview?.metrics?.sampleSize || 0) === 0 ? (
                <AwaitBox message={overview?.metrics?.visibilityNote} />
              ) : null}
              <div className="geo-kpi-grid">
                <Kpi
                  label="נראות AI"
                  value={
                    overview?.metrics?.visibilityPct == null
                      ? "—"
                      : `${overview.metrics.visibilityPct}%`
                  }
                  denom={sampleSizeHe(overview?.metrics?.sampleSize)}
                  onClick={() => selectTab("visibility")}
                />
                <Kpi
                  label={copy.mentions}
                  value={overview?.metrics?.mentions ?? 0}
                  denom={sampleSizeHe(overview?.metrics?.sampleSize)}
                  onClick={() => selectTab("appeared")}
                />
                <Kpi
                  label={copy.recommendations}
                  value={overview?.metrics?.recommendations ?? 0}
                  denom={sampleSizeHe(overview?.metrics?.sampleSize)}
                  onClick={() => selectTab("opportunities")}
                />
                <Kpi
                  label={copy.citations}
                  value={overview?.metrics?.citations ?? 0}
                  denom={sampleSizeHe(overview?.metrics?.sampleSize)}
                  onClick={() => selectTab("citations")}
                />
              </div>
              {(overview?.metrics?.sampleSize || 0) > 0 &&
              (overview?.metrics?.sampleSize || 0) < 10 ? (
                <div className="geo-intel-banner muted" role="status">
                  {copy.sampleTooSmall}
                </div>
              ) : null}
              <div className="geo-card">
                <h3>{copy.metricDefinitionsTitle}</h3>
                <p className="geo-note">{copy.metricDefinitionsBody}</p>
              </div>
              <div className="geo-card">
                <h3>{copy.engineCompare}</h3>
                <Table
                  columns={["מנוע", "מדגם", "הופעות", "נראות %", "סטטוס"]}
                  rows={(overview?.metrics?.byEngine || []).map((r: any) => [
                    r.labelHe || r.engine,
                    r.n,
                    r.appeared,
                    r.visibilityPct == null ? "—" : `${r.visibilityPct}%`,
                    r.checkStatus === "checked" ? "נבדק" : copy.notChecked,
                  ])}
                />
              </div>
              <div className="geo-card">
                <h3>הזדמנויות דחופות</h3>
                {(opportunities?.opportunities || [])
                  .filter((o: any) => o.priority === "critical")
                  .slice(0, 5)
                  .map((o: any) => (
                    <div key={o.id} className="geo-tip">
                      <strong>{o.titleHe}</strong>
                      <p>{o.bodyHe}</p>
                    </div>
                  ))}
                {!opportunities?.opportunities?.length ? (
                  <AwaitBox message={opportunities?.messageHe} />
                ) : null}
              </div>
            </section>
          ) : null}

          {tab === "visibility" ? (
            <section>
              {visibility?.awaitingData ? (
                <AwaitBox message={visibility.messageHe} />
              ) : (
                <>
                  <p className="geo-note">{visibility?.denominatorNoteHe}</p>
                  <div className="geo-kpi-grid">
                    <Kpi
                      label="שיעור הופעה"
                      value={
                        visibility?.appearanceRatePct == null
                          ? "—"
                          : `${visibility.appearanceRatePct}%`
                      }
                      denom={sampleSizeHe(visibility?.sampleSize)}
                    />
                    <Kpi
                      label="שיעור המלצה"
                      value={
                        visibility?.recommendationRatePct == null
                          ? "—"
                          : `${visibility.recommendationRatePct}%`
                      }
                      denom={sampleSizeHe(visibility?.sampleSize)}
                    />
                    <Kpi
                      label="שיעור ציטוט"
                      value={
                        visibility?.citationRatePct == null
                          ? "—"
                          : `${visibility.citationRatePct}%`
                      }
                      denom={sampleSizeHe(visibility?.sampleSize)}
                    />
                  </div>
                  <Table
                    columns={["שאלה", "שפה", "n", "הופעה %", "המלצה %", "ציטוט %", "פירוט"]}
                    rows={(visibility?.byPrompt || [])
                      .filter((r: any) => filterText(r.text))
                      .map((r: any) => [
                        <span dir={r.language === "he" ? "rtl" : "ltr"}>
                          {r.text}
                        </span>,
                        r.language,
                        r.sampleSize,
                        r.appearanceRatePct == null ? "—" : `${r.appearanceRatePct}%`,
                        r.recommendationRatePct == null
                          ? "—"
                          : `${r.recommendationRatePct}%`,
                        r.citationRatePct == null ? "—" : `${r.citationRatePct}%`,
                        r.latestCheckId ? (
                          <button
                            type="button"
                            className="geo-btn geo-btn-ghost"
                            onClick={() => openCheck(r.latestCheckId)}
                          >
                            מדידה
                          </button>
                        ) : (
                          "—"
                        ),
                      ])}
                  />
                </>
              )}
            </section>
          ) : null}

          {tab === "appeared" || tab === "missing" ? (
            <section>
              {promptIntel?.awaitingData ? (
                <AwaitBox message={promptIntel.messageHe} />
              ) : null}
              <Table
                columns={["שאלה", "כוונה", "n", "סטטוס", "מתחרים", "מדידה"]}
                rows={((tab === "appeared"
                  ? promptIntel?.appeared
                  : promptIntel?.missing) || [])
                  .filter((r: any) => filterText(r.text))
                  .map((r: any) => [
                    <span dir={r.language === "he" ? "rtl" : "ltr"}>
                      {r.text}
                    </span>,
                    r.intent || "—",
                    r.sampleSize,
                    r.statusHe,
                    (r.competitors || []).join(", ") || "—",
                    r.latestCheckId ? (
                      <button
                        type="button"
                        className="geo-btn geo-btn-ghost"
                        onClick={() => openCheck(r.latestCheckId)}
                      >
                        פתח
                      </button>
                    ) : (
                      "—"
                    ),
                  ])}
              />
            </section>
          ) : null}

          {tab === "discovery" ? (
            <section>
              <div className="geo-intel-banner">
                {promptIntel?.discovery?.disclaimerHe}
              </div>
              <div className="geo-intel-actions">
                <button
                  type="button"
                  className="geo-btn geo-btn-primary"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await geoPost(
                        "/prompt-suggestions/refresh",
                        {},
                        { brandId }
                      );
                      await loadBrandData();
                    } catch (e: any) {
                      setError(e?.response?.data?.error || e.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  רענון הצעות / גילוי
                </button>
              </div>
              <h3>התגלו ממקור אמיתי</h3>
              <Table
                columns={["שאלה", "מקור", "סטטוס", "פעולה"]}
                rows={(promptIntel?.discovery?.discovered || []).map(
                  (s: any) => [
                    s.text,
                    s.source,
                    s.status,
                    <button
                      type="button"
                      className="geo-btn geo-btn-ghost"
                      onClick={async () => {
                        await geoPost(
                          `/prompt-suggestions/${s._id}/accept`,
                          {},
                          { brandId }
                        );
                        await loadBrandData();
                      }}
                    >
                      הוסף לקטלוג
                    </button>,
                  ]
                )}
              />
              <h3>הצעות מערכת (לא שאילתות פרטיות שנצפו)</h3>
              <Table
                columns={["שאלה", "כוונה", "סטטוס", "פעולה"]}
                rows={(promptIntel?.discovery?.suggested || []).map((s: any) => [
                  s.text,
                  s.intent || "—",
                  s.status,
                  <button
                    type="button"
                    className="geo-btn geo-btn-ghost"
                    onClick={async () => {
                      await geoPost(
                        `/prompt-suggestions/${s._id}/accept`,
                        {},
                        { brandId }
                      );
                      await loadBrandData();
                    }}
                  >
                    הוסף לקטלוג
                  </button>,
                ])}
              />
            </section>
          ) : null}

          {tab === "competitors" ? (
            <section>
              {competitors?.awaitingData ? (
                <AwaitBox message={competitors.messageHe} />
              ) : (
                <>
                  <p className="geo-note">{competitors?.denominatorNoteHe}</p>
                  <Table
                    columns={[
                      "שם",
                      "n",
                      "הופעה %",
                      "המלצה %",
                      "ציטוט %",
                    ]}
                    rows={(competitors?.shareOfVoice || []).map((r: any) => [
                      r.isUs ? <strong>{r.name}</strong> : r.name,
                      r.sampleSize,
                      r.appearanceRatePct == null
                        ? "—"
                        : `${r.appearanceRatePct}%`,
                      r.recommendationRatePct == null
                        ? "—"
                        : `${r.recommendationRatePct}%`,
                      r.citationRatePct == null ? "—" : `${r.citationRatePct}%`,
                    ])}
                  />
                  <h3>פערים — מתחרים מופיעים ואנחנו לא</h3>
                  <Table
                    columns={["שאלה / תיאור"]}
                    rows={(competitors?.gaps || []).map((g: any) => [
                      typeof g === "string" ? g : g.text || g.prompt || JSON.stringify(g),
                    ])}
                  />
                </>
              )}
            </section>
          ) : null}

          {tab === "citations" ? (
            <section>
              {citations?.awaitingData ? (
                <AwaitBox message={citations.messageHe} />
              ) : (
                <>
                  <p className="geo-note">{citations?.denominatorNoteHe}</p>
                  <div className="geo-kpi-grid">
                    <Kpi
                      label="אירועי ציטוט"
                      value={citations?.totalCitationEvents ?? 0}
                      denom={sampleSizeHe(citations?.sampleSize)}
                    />
                    <Kpi
                      label="שיתוף שלנו"
                      value={
                        citations?.shareOursPct == null
                          ? "—"
                          : `${citations.shareOursPct}%`
                      }
                    />
                    <Kpi
                      label="שיתוף מתחרים"
                      value={
                        citations?.shareCompetitorsPct == null
                          ? "—"
                          : `${citations.shareCompetitorsPct}%`
                      }
                    />
                  </div>
                  <Table
                    columns={["דומיין", "סוג", "ציטוטים", "מדידות", "פירוט"]}
                    rows={(citations?.domains || [])
                      .filter((d: any) => filterText(d.domain))
                      .map((d: any) => [
                        d.domain,
                        d.kind,
                        d.citations,
                        d.distinctChecks,
                        d.evidenceCheckIds?.[0] ? (
                          <button
                            type="button"
                            className="geo-btn geo-btn-ghost"
                            onClick={() => openCheck(d.evidenceCheckIds[0])}
                          >
                            מדידה
                          </button>
                        ) : (
                          "—"
                        ),
                      ])}
                  />
                </>
              )}
            </section>
          ) : null}

          {tab === "opportunities" ? (
            <section>
              {opportunities?.awaitingData ? (
                <AwaitBox message={opportunities.messageHe} />
              ) : (
                <Table
                  columns={["עדיפות", "כותרת", "פירוט", "פעולה", "ראיה"]}
                  rows={(opportunities?.opportunities || []).map((o: any) => [
                    priorityHe(o.priority),
                    o.titleHe,
                    o.bodyHe,
                    o.actionHe,
                    o.evidenceCheckIds?.[0] ? (
                      <button
                        type="button"
                        className="geo-btn geo-btn-ghost"
                        onClick={() => openCheck(o.evidenceCheckIds[0])}
                      >
                        מדידה
                      </button>
                    ) : (
                      "—"
                    ),
                  ])}
                />
              )}
            </section>
          ) : null}

          {tab === "improvementPlan" ? (
            <section className="geo-plan" dir="rtl" lang="he">
              <div className="geo-plan-hero">
                <h2>{copy.navImprovementPlan}</h2>
                <p>{copy.improvementPlanHint}</p>
                {improvementPlan?.bannerHe ? (
                  <p className="geo-plan-disclaimer">{improvementPlan.bannerHe}</p>
                ) : null}
                {improvementPlan?.disclaimerHe ? (
                  <p className="geo-plan-disclaimer">
                    {improvementPlan.disclaimerHe}
                  </p>
                ) : null}
              </div>
              {improvementPlan?.awaitingData ? (
                <AwaitBox message={improvementPlan.messageHe} />
              ) : (
                <>
                  <div className="geo-kpi-grid">
                    <Kpi
                      label={copy.improvementProgress}
                      value={
                        improvementPlan?.progress?.pctDone == null
                          ? "—"
                          : `${improvementPlan.progress.pctDone}%`
                      }
                      denom={`${improvementPlan?.progress?.done || 0}/${improvementPlan?.progress?.total || 0} הושלמו`}
                    />
                    <Kpi
                      label="מדגם מדידות"
                      value={improvementPlan?.sampleSize ?? "—"}
                    />
                    <Kpi
                      label="שיעור הופעה"
                      value={
                        improvementPlan?.appearanceRatePct == null
                          ? "—"
                          : `${improvementPlan.appearanceRatePct}%`
                      }
                    />
                    <Kpi
                      label="חסרים עם מתחרים"
                      value={
                        improvementPlan?.missingWithCompetitorsCount ?? "—"
                      }
                    />
                  </div>

                  <h3>{copy.improvementProven}</h3>
                  <Table
                    columns={["סוג", "כותרת", "פירוט", "ראיות"]}
                    rows={(improvementPlan?.findingsProven || []).map(
                      (f: any) => [
                        findingKindHe(f.kind),
                        f.titleHe,
                        f.bodyHe,
                        (f.evidenceCheckIds || []).length
                          ? `${f.evidenceCheckIds.length} מדידות`
                          : "—",
                      ]
                    )}
                  />

                  <h3>{copy.improvementHypothesis}</h3>
                  <Table
                    columns={["סוג", "כותרת", "פירוט", "סטטוס אימות"]}
                    rows={(improvementPlan?.findingsHypothesis || []).map(
                      (f: any) => [
                        findingKindHe(f.kind),
                        f.titleHe,
                        f.bodyHe,
                        "דורש בדיקה ידנית",
                      ]
                    )}
                  />

                  <h3>{copy.improvementTasks}</h3>
                  <ImprovementWorkList
                    brandName={improvementPlan?.brand?.name || activeBrand?.name || ""}
                    tasks={improvementPlan?.tasks || []}
                    busy={busy}
                    onUpdate={async (taskKey, status, noteHe) => {
                      setBusy(true);
                      try {
                        await geoPatch(
                          `/improvement-plan/tasks/${encodeURIComponent(taskKey)}`,
                          { status, noteHe },
                          { brandId }
                        );
                        await loadBrandData();
                      } catch (err: any) {
                        setError(
                          err?.response?.data?.error ||
                            err.message ||
                            "עדכון סטטוס נכשל"
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  />
                </>
              )}
            </section>
          ) : null}

          {tab === "content" ? (
            <section>
              {content?.awaitingData ? (
                <AwaitBox message={content.messageHe} />
              ) : null}
              <h3>עמודים שנבדקו בדומיין</h3>
              <Table
                columns={["נתיב", "סטטוס", "כותרת", "URL"]}
                rows={(content?.pages || []).map((p: any) => [
                  p.path,
                  p.statusHe,
                  p.title || "—",
                  p.url,
                ])}
              />
              <h3>מיפוי שאלות → עמודי יעד</h3>
              <Table
                columns={["שאלה", "יעד", "קיים?", "המלצה"]}
                rows={(content?.mappings || [])
                  .filter((m: any) => filterText(m.text))
                  .map((m: any) => [
                    m.text,
                    m.suggestedPath,
                    m.targetExists ? "כן" : "לא",
                    m.suggestionHe,
                  ])}
              />
            </section>
          ) : null}

          {tab === "tech" ? (
            <section>
              {tech?.awaitingData ? (
                <AwaitBox />
              ) : (
                <>
                  <div className="geo-kpi-grid">
                    <Kpi
                      label="ציון ביקורת"
                      value={
                        tech?.summary?.scorePct == null
                          ? "—"
                          : `${tech.summary.scorePct}%`
                      }
                      denom={tech?.summary?.denominatorNoteHe}
                    />
                  </div>
                  <Table
                    columns={["בדיקה", "עבר?", "פירוט"]}
                    rows={(tech?.checks || []).map((c: any) => [
                      c.labelHe,
                      c.ok ? "כן" : "לא",
                      c.detailHe,
                    ])}
                  />
                </>
              )}
            </section>
          ) : null}

          {tab === "trends" ? (
            <section>
              {trends?.awaitingData ? (
                <AwaitBox message={trends.messageHe} />
              ) : (
                <>
                  <p className="geo-note">{trends?.denominatorNoteHe}</p>
                  <div className="geo-card" style={{ height: 320 }}>
                    <h3>נראות לפי יום (עם n)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <LineChart data={trends?.byDay || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(v: any, name: string, props: any) => [
                            `${v}% (${sampleSizeHe(props?.payload?.sampleSize)})`,
                            name,
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="appearanceRatePct"
                          name="הופעה %"
                          stroke="#4f46e5"
                          connectNulls
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="geo-card" style={{ height: 320 }}>
                    <h3>מדגם יומי</h3>
                    <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={trends?.byDay || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sampleSize" name="n" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {trends?.periodCompare ? (
                    <div className="geo-intel-banner">
                      השוואת תקופות:{" "}
                      {trends.periodCompare.earlier.appearanceRatePct ?? "—"}% →{" "}
                      {trends.periodCompare.later.appearanceRatePct ?? "—"}%
                      (Δ {trends.periodCompare.deltaAppearancePts ?? "—"}) ·{" "}
                      {trends.periodCompare.noteHe}
                    </div>
                  ) : null}
                </>
              )}
            </section>
          ) : null}

          {tab === "reports" ? (
            <section>
              <div className="geo-intel-actions">
                <button
                  type="button"
                  className="geo-btn geo-btn-primary"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const data = await geoGet("/report", filterParams);
                      setReport(data);
                    } catch (e: any) {
                      setError(e?.response?.data?.error || e.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  הפק דוח JSON
                </button>
                <a
                  className="geo-btn geo-btn-ghost"
                  href={`/api/geo-intel/report?brandId=${brandId}&format=csv`}
                >
                  ייצוא CSV
                </a>
              </div>
              {report ? (
                <pre className="geo-code" dir="ltr">
                  {JSON.stringify(report, null, 2).slice(0, 8000)}
                </pre>
              ) : (
                <AwaitBox message="הפיקו דוח כדי לראות סיכום מבוסס מדידות אמת." />
              )}
              <h3>עלות צפויה להפעלת מדידות API (כבוי)</h3>
              <pre className="geo-code" dir="ltr">
                {JSON.stringify(
                  providers?.providers
                    ? {
                        noteHe: providers.noteHe,
                        estimate: report?.costEstimate || null,
                        providers: providers.providers,
                      }
                    : providers,
                  null,
                  2
                )}
              </pre>
            </section>
          ) : null}

          {tab === "measurements" ? (
            <section>
              {canShowMeasurementActions(status) ? (
              <>
              <h3>הזנה ידנית מאומתת (ממשק צרכני)</h3>
              <div className="geo-card geo-form">
                <select
                  value={manualForm.promptId}
                  onChange={(e) =>
                    setManualForm((p) => ({ ...p, promptId: e.target.value }))
                  }
                >
                  {prompts.map((p) => (
                    <option key={p._id} value={p._id}>
                      [{p.language}] {p.text.slice(0, 80)}
                    </option>
                  ))}
                </select>
                <select
                  value={manualForm.engine}
                  onChange={(e) =>
                    setManualForm((p) => ({ ...p, engine: e.target.value }))
                  }
                >
                  {["openai", "gemini", "claude", "perplexity"].map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={8}
                  value={manualForm.rawAnswer}
                  onChange={(e) =>
                    setManualForm((p) => ({ ...p, rawAnswer: e.target.value }))
                  }
                  placeholder={copy.manualAnswer}
                />
                <textarea
                  rows={3}
                  value={manualForm.sourcesText}
                  onChange={(e) =>
                    setManualForm((p) => ({
                      ...p,
                      sourcesText: e.target.value,
                    }))
                  }
                  placeholder={copy.manualSources}
                />
                <button
                  type="button"
                  className="geo-btn geo-btn-primary"
                  disabled={busy || !manualForm.rawAnswer.trim()}
                  onClick={saveManual}
                >
                  {copy.manualSave}
                </button>
              </div>

              <h3>ייבוא מ־Search Console</h3>
              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="CSV…"
              />
              <button
                type="button"
                className="geo-btn geo-btn-ghost"
                disabled={busy || !csvText.trim()}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await geoPost("/gsc/import", {
                      brandId,
                      csvText,
                      filename: "manual.csv",
                    });
                    setCsvText("");
                    await loadBrandData();
                  } catch (e: any) {
                    setError(e?.response?.data?.error || e.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {copy.importCsv}
              </button>
              </>
              ) : (
                <p className="geo-plan-approval">
                  הזנה ידנית, מדידת ניסיון וייבוא מ־Search Console מוצגים רק לחשבון עם הרשאת הרצה.
                </p>
              )}
              <Table
                columns={["קובץ", "שורות", "תאריך"]}
                rows={(gscImports || []).map((g: any) => [
                  g.filename || "—",
                  g.rowCount,
                  g.createdAt
                    ? new Date(g.createdAt).toLocaleString("he-IL")
                    : "—",
                ])}
              />

              <h3>מדידות אחרונות (אמת)</h3>
              <Table
                columns={[
                  "מנוע",
                  "שיטה",
                  copy.apiCallLabel,
                  "הופיע",
                  "תאריך",
                  "פירוט",
                ]}
                rows={(checks || [])
                  .filter((c: any) => c.dataClass !== "test_fixture")
                  .map((c: any) => [
                    c.engine,
                    collectionMethodHe(c.collectionMethod),
                    c.apiCallMade ? copy.yes : copy.no,
                    c.detected?.appeared ? copy.yes : copy.no,
                    c.checkedAt
                      ? new Date(c.checkedAt).toLocaleString("he-IL")
                      : "—",
                    <button
                      type="button"
                      className="geo-btn geo-btn-ghost"
                      onClick={() => openCheck(c._id)}
                    >
                      פתח
                    </button>,
                  ])}
              />
            </section>
          ) : null}

          {tab === "costs" ? (
            <section>
              <div className="geo-card">
                <h3>{copy.costsTitle}</h3>
                <p className="geo-note">{copy.costsHint}</p>
                <div className="geo-intel-banner muted">{copy.aioDisclaimer}</div>
                <div className="geo-intel-banner">{copy.perplexityReadyHint}</div>
                <div className="geo-intel-banner muted">
                  {monitoringStatus?.noteHe || copy.monitoringOff}
                </div>
                {monitoringStatus?.sharedBudget || monitoringStatus?.budget ? (
                  <div className="geo-kpi-row" style={{ marginTop: 12 }}>
                    <div className="geo-kpi">
                      <div className="geo-kpi-label">{copy.sharedBudgetTitle}</div>
                      <div className="geo-kpi-value">
                        $
                        {Number(
                          monitoringStatus.sharedBudget?.hardCapUsd ??
                            costMatrix?.sharedMonthlyCapUsd ??
                            50
                        ).toFixed(0)}
                      </div>
                      <div className="geo-kpi-sub">
                        {monitoringStatus.sharedBudget?.monthBucket || ""}
                      </div>
                    </div>
                    <div className="geo-kpi">
                      <div className="geo-kpi-label">{copy.sharedBudgetUsed}</div>
                      <div className="geo-kpi-value">
                        $
                        {Number(
                          monitoringStatus.sharedBudget?.spentUsd || 0
                        ).toFixed(2)}
                      </div>
                      <div className="geo-kpi-sub">
                        {Number(
                          monitoringStatus.sharedBudget?.usedPct || 0
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                    <div className="geo-kpi">
                      <div className="geo-kpi-label">
                        {copy.sharedBudgetRemaining}
                      </div>
                      <div className="geo-kpi-value">
                        $
                        {Number(
                          monitoringStatus.sharedBudget?.remainingUsd || 0
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ) : null}
                <p className="geo-note">{copy.providerLimitNote}</p>
                {monitoringStatus?.sharedBudget?.engineAllocationUsd ||
                costMatrix?.engineAllocationUsd ? (
                  <div className="geo-card" style={{ marginTop: 12 }}>
                    <h3>{copy.engineCapsTitle}</h3>
                    <Table
                      columns={["מנוע", "תקרה חודשית", "נוצל", "נותר", "סיכון ספק"]}
                      rows={["perplexity", "openai", "claude", "gemini"].map(
                        (id) => {
                          const alloc =
                            monitoringStatus?.sharedBudget
                              ?.engineAllocationUsd?.[id] ??
                            costMatrix?.engineAllocationUsd?.[id];
                          const row =
                            monitoringStatus?.sharedBudget?.byEngine?.[id] ||
                            {};
                          const risk =
                            monitoringStatus?.sharedBudget?.providerRiskHe?.[
                              id
                            ] ||
                            costMatrix?.providerRiskHe?.[id] ||
                            "—";
                          return [
                            id,
                            alloc != null ? `$${alloc}` : "—",
                            row.spentUsd != null
                              ? `$${Number(row.spentUsd).toFixed(2)}`
                              : "—",
                            row.remainingUsd != null
                              ? `$${Number(row.remainingUsd).toFixed(2)}`
                              : "—",
                            String(risk).slice(0, 80),
                          ];
                        }
                      )}
                    />
                  </div>
                ) : null}
                {monitoringStatus?.lastRunSummary ? (
                  <p className="geo-note">
                    הרצה אחרונה: הושלמו{" "}
                    {monitoringStatus.lastRunSummary.completed ?? 0} · כפולים{" "}
                    {monitoringStatus.lastRunSummary.deduped ?? 0} · נכשלו{" "}
                    {monitoringStatus.lastRunSummary.failed ?? 0}
                    {monitoringStatus.lastRunSummary.byBrand
                      ? ` · לפי מותג: ${JSON.stringify(
                          monitoringStatus.lastRunSummary.byBrand
                        )}`
                      : ""}
                  </p>
                ) : null}
              </div>
              <Table
                columns={[
                  "מנוע",
                  "סטטוס",
                  "מוכן להרצה",
                  "עלות לבדיקה",
                  "150 שאלות",
                  "מפתח",
                  "אישור חיוב",
                  "הערות",
                ]}
                rows={(costMatrix?.rows || []).map((r: any) => {
                  const ready = monitoringStatus?.engines?.find(
                    (e: any) => e.id === r.engineId
                  )?.readiness;
                  return [
                    r.labelHe || r.engineId,
                    r.status === "ready"
                      ? "מוכן"
                      : r.status === "unavailable"
                        ? "לא זמין (API)"
                        : r.status,
                    ready?.ok
                      ? "כן"
                      : ready?.reason
                        ? String(ready.reason)
                        : "—",
                    r.estimatedUsdPerCheck == null
                      ? "—"
                      : `$${Number(r.estimatedUsdPerCheck).toFixed(3)}`,
                    r.estimate150Usd == null
                      ? "—"
                      : `$${Number(r.estimate150Usd).toFixed(2)}`,
                    r.keyConfigured ? "כן" : "לא",
                    r.billingApproved ? "כן" : "לא",
                    r.notesHe || "—",
                  ];
                })}
              />
              {costMatrix?.perplexityCreditPlan ? (
                <div className="geo-card">
                  <h3>קרדיטים Perplexity</h3>
                  <p className="geo-note">
                    {costMatrix.perplexityCreditPlan.noteHe}
                  </p>
                  <p>
                    יתרה מדווחת בחשבון: $
                    {costMatrix.perplexityCreditPlan.reportedCreditsUsd} ·
                    הערכה לבדיקה: $
                    {costMatrix.perplexityCreditPlan.estimatedUsdPerCheck}
                  </p>
                </div>
              ) : null}
              {!costMatrix?.rows?.length ? (
                <AwaitBox message="טוען מטריצת עלויות…" />
              ) : null}
            </section>
          ) : null}

          {tab === "catalogDraft" ? (
            <section>
              <div className="geo-card">
                <h3>{copy.catalogDraftTitle}</h3>
                <p className="geo-note">{copy.catalogDraftHint}</p>
                <div className="geo-intel-banner muted">
                  {copy.catalogDraftNotActive}
                  {catalogDraft?.totals
                    ? ` · סה״כ בטיוטה: ${catalogDraft.totals.prompts}`
                    : ""}
                </div>
              </div>
              <Table
                columns={[
                  copy.question,
                  copy.intent,
                  copy.category,
                  copy.businessImportance,
                  copy.competitors,
                ]}
                rows={(catalogDraft?.entries || [])
                  .filter((e: any) => filterText(e.text))
                  .map((e: any) => [
                  <span dir={e.language === "he" ? "rtl" : "ltr"}>{e.text}</span>,
                  e.intent,
                  e.category,
                  e.businessImportance === "high"
                    ? copy.importanceHigh
                    : e.businessImportance === "low"
                      ? copy.importanceLow
                      : copy.importanceMedium,
                  (e.competitors || []).join(", "),
                ])}
              />
              {!catalogDraft?.entries?.length ? (
                <AwaitBox message="טוען טיוטת קטלוג או שאין נתונים בשרת זה." />
              ) : null}
            </section>
          ) : null}

          {tab === "alerts" ? (
            <section>
              <div className="geo-intel-banner">
                {alerts?.deliveryNoteHe ||
                  "משלוח התראות אוטומטי כבוי עד אישור."}
              </div>
              <button
                type="button"
                className="geo-btn geo-btn-primary"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await geoPost("/alerts/refresh", {}, { brandId });
                    await loadBrandData();
                  } catch (e: any) {
                    setError(e?.response?.data?.error || e.message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                רענון התראות פנימיות
              </button>
              <Table
                columns={["חומרה", "כותרת", "תוכן", "אישור"]}
                rows={(alerts?.alerts || []).map((a: any) => [
                  severityHe(a.severity),
                  a.titleHe,
                  a.bodyHe,
                  <button
                    type="button"
                    className="geo-btn geo-btn-ghost"
                    onClick={async () => {
                      await geoPost(`/alerts/${a._id}/ack`, {}, { brandId });
                      await loadBrandData();
                    }}
                  >
                    סמן כטופל
                  </button>,
                ])}
              />
              {!alerts?.alerts?.length ? (
                <AwaitBox message={copy.alertsEmpty} />
              ) : null}
            </section>
          ) : null}

          {tab === "settings" ? (
            <section>
              <div className="geo-card">
                <h3>{copy.settingsEnvTitle}</h3>
                <p>{copy.settingsEnvHelp}</p>
                <div className="geo-intel-banner muted">{copy.aioDisclaimer}</div>
                <pre className="geo-code" dir="ltr">
                  {JSON.stringify(
                    {
                      hostActive: status?.hostActive,
                      privateOwnerOnly: status?.privateOwnerOnly,
                      paidApisAllowed: status?.paidApisAllowed,
                      automation: status?.automation,
                      monitoring: {
                        enabled: monitoringStatus?.enabled,
                        cron: monitoringStatus?.cron,
                        engines: monitoringStatus?.engineAllowlist,
                        maxChecksPerRun: monitoringStatus?.maxChecksPerRun,
                      },
                      gemini: {
                        configured: status?.gemini?.configured,
                        freeOnly: status?.gemini?.freeOnly,
                      },
                      stagingInfo,
                      providers: providers?.providers?.map((p: any) => ({
                        id: p.id,
                        runnableNow: p.runnableNow,
                        estimatedUsdPerCheck: p.estimatedUsdPerCheck,
                        statusHe: p.statusHe,
                      })),
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {detail ? (
        <div className="geo-drawer-backdrop" onClick={() => setDetail(null)}>
          <div
            className="geo-drawer"
            dir="rtl"
            lang="he"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="geo-drawer-head">
              <h3>{copy.proofTitle}</h3>
              <button
                type="button"
                className="geo-btn geo-btn-ghost"
                onClick={() => setDetail(null)}
              >
                {copy.close}
              </button>
            </div>
            <div className="geo-drawer-body">
              <div className="geo-card">
                <h4>{copy.detailMeta}</h4>
                <p>
                  {copy.engine}: {detail.check?.engine}
                  {" · "}
                  {copy.collectionMethod}:{" "}
                  {collectionMethodHe(detail.check?.collectionMethod)}
                  {" · "}
                  {copy.apiCallLabel}:{" "}
                  {detail.check?.apiCallMade ? copy.yes : copy.no}
                  {" · "}
                  {copy.dataClassLabel}: {dataClassHe(detail.check?.dataClass)}
                </p>
                <p>
                  {copy.date}:{" "}
                  {detail.check?.checkedAt
                    ? new Date(detail.check.checkedAt).toLocaleString("he-IL")
                    : "—"}
                </p>
              </div>
              <div className="geo-card">
                <h4>{copy.detectedSummary}</h4>
                <p>
                  {copy.brandMentioned}:{" "}
                  {detail.check?.detected?.appeared ? copy.yes : copy.no}
                  {" · "}
                  {copy.brandRecommended}:{" "}
                  {detail.check?.detected?.recommended ? copy.yes : copy.no}
                  {" · "}
                  {copy.brandCited}:{" "}
                  {detail.check?.detected?.hasLink ? copy.yes : copy.no}
                </p>
                {(detail.check?.detected?.competitors || []).length ? (
                  <p>
                    {copy.competitorsDetected}:{" "}
                    {(detail.check.detected.competitors || [])
                      .map((c: any) =>
                        typeof c === "string" ? c : c?.name || ""
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : null}
              </div>
              <div>
                <h4>{copy.rawAnswer}</h4>
                <pre className="geo-code">{detail.check?.rawAnswer}</pre>
              </div>
              <div>
                <h4>{copy.sources}</h4>
                {(detail.check?.sources || []).length === 0 ? (
                  <p className="geo-note">{copy.noSourcesCited}</p>
                ) : (
                  <ul className="geo-source-list">
                    {(detail.check?.sources || []).map((s: any, i: number) => (
                      <li
                        key={i}
                        className={`geo-source${s.isBrand ? " brand" : ""}${s.isCompetitor ? " competitor" : ""}`}
                      >
                        <a href={s.url} target="_blank" rel="noreferrer">
                          {s.domain || s.url}
                        </a>
                        {s.title ? <div className="geo-note">{s.title}</div> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
