import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../api";
import { pick, svCopy } from "./copy";
import "./searchVisibility.css";

type Job = {
  id: string;
  domain?: string;
  url?: string;
  status?: string;
  phase?: string;
  progress?: { phase?: string; pages?: number; requests?: number };
  scores?: {
    seo?: { score?: number | null; coverage?: number | null };
    geo?: { score?: number | null; coverage?: number | null };
    aeo?: { score?: number | null; coverage?: number | null };
    critical?: number;
    warnings?: number;
    recommendations?: number;
    disclaimer?: string;
  } | null;
  stats?: { fetched?: number; failed?: number; discovered?: number } | null;
  tasks?: Array<Record<string, unknown>>;
  limitations?: string[];
  createdAt?: string;
  formulaVersion?: string;
  ruleVersion?: string;
};

type Finding = Record<string, any>;
type PageRow = Record<string, any>;

const PHASES = ["connect", "discover", "seo", "geo", "aeo", "report"];

function scoreText(value: number | null | undefined, unavailable: string) {
  return value == null ? unavailable : String(value);
}

export default function SearchVisibilityApp() {
  const { i18n } = useTranslation();
  const t = svCopy(i18n.language);
  const [url, setUrl] = useState("https://");
  const [mode, setMode] = useState("quick");
  const [advanced, setAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [history, setHistory] = useState<Job[]>([]);
  const [tab, setTab] = useState("overview");
  const [type, setType] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [openId, setOpenId] = useState("");
  const [pageDetail, setPageDetail] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [compareNote, setCompareNote] = useState("");

  async function loadJob(id: string) {
    const response = await API.get(`/search-visibility/scans/${id}`);
    setJob(response.data.job);
    setFindings(response.data.findings || []);
    setPages(response.data.pages || []);
    return response.data.job as Job;
  }

  useEffect(() => {
    API.get("/search-visibility/scans").then((response) => {
      setHistory(response.data.jobs || []);
      setNeedsLogin(false);
    }).catch((err) => {
      if (err?.response?.status === 401) setNeedsLogin(true);
    });
  }, []);

  useEffect(() => {
    if (!job?.id || !["queued", "running"].includes(job.status || "")) return undefined;
    const timer = window.setInterval(() => {
      loadJob(job.id).catch(() => {});
    }, 1500);
    return () => window.clearInterval(timer);
  }, [job?.id, job?.status]);

  async function start(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    setPageDetail(null);
    try {
      const response = await API.post("/search-visibility/scans", { url, mode });
      setNeedsLogin(false);
      const next = await loadJob(response.data.id);
      setJob(next);
      setTab("overview");
      const list = await API.get("/search-visibility/scans");
      setHistory(list.data.jobs || []);
    } catch (err: any) {
      if (err?.response?.status === 401) setNeedsLogin(true);
      setError(err?.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!job?.id) return;
    await API.post(`/search-visibility/scans/${job.id}/cancel`);
    await loadJob(job.id);
  }

  async function openPage(pageId: string) {
    if (!job?.id) return;
    const response = await API.get(`/search-visibility/scans/${job.id}/pages/${pageId}`);
    setPageDetail(response.data);
    setTab("page");
  }

  async function mark(row: Finding) {
    if (!job?.id) return;
    await API.post(`/search-visibility/scans/${job.id}/remediation`, {
      ruleId: row.ruleId,
      url: row.affectedUrls?.[0] || "",
    });
    setFindings((current) => current.map((item) => item.id === row.id ? { ...item, customerStatus: "customer_marked" } : item));
  }

  async function download(format: string) {
    if (!job?.id) return;
    const response = await API.get(`/search-visibility/scans/${job.id}/export.${format}`, {
      params: { locale: t.dir === "rtl" ? "he" : "en", variant: format === "pdf" ? "technical" : undefined },
      responseType: format === "json" ? "json" : "blob",
    });
    if (format === "json") {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `bizuply-${job.domain || "scan"}.json`;
      link.click();
      URL.revokeObjectURL(href);
      return;
    }
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.download = `bizuply-${job.domain || "scan"}.${format}`;
    link.click();
    URL.revokeObjectURL(href);
  }

  async function compareWith(otherId: string) {
    if (!job?.id) return;
    const response = await API.get(`/search-visibility/scans/${job.id}/compare/${otherId}`);
    const row = response.data.comparison;
    setCompareNote(`${row.note} SEO ${row.scoreDelta?.seo ?? "—"}`);
    setTab("history");
  }

  const visible = useMemo(() => findings.filter((row) => {
    if (type !== "all" && row.category !== type) return false;
    if (severity !== "all" && row.severity !== severity) return false;
    if (status !== "all" && row.status !== status) return false;
    return true;
  }), [findings, type, severity, status]);

  const phase = job?.phase || job?.progress?.phase || "";
  const phaseIndex = PHASES.indexOf(phase === "done" ? "report" : phase);
  const running = job && ["queued", "running"].includes(job.status || "");

  return (
    <main className="search-visibility" dir={t.dir}>
      <div className="sv-wrap">
        <p className="sv-kicker"><Link to="/seo-scanner">{t.product}</Link></p>
        <h1>{t.start}</h1>
        {needsLogin ? <p><Link className="sv-link-button" to="/login">{t.login}</Link></p> : null}
        <form className="sv-row" onSubmit={start}>
          <label className="sv-field">
            <span>{t.url}</span>
            <input value={url} onChange={(event) => setUrl(event.target.value)} inputMode="url" required />
          </label>
          <button className="sv-button" type="submit" disabled={busy}>{t.start}</button>
        </form>
        <p><button className="sv-button secondary" type="button" onClick={() => setAdvanced((value) => !value)}>{t.advanced}</button></p>
        {advanced ? (
          <label className="sv-field">
            <span>{t.mode}</span>
            <select value={mode} onChange={(event) => setMode(event.target.value)}>
              <option value="quick">{t.quick}</option>
              <option value="full">{t.full}</option>
            </select>
          </label>
        ) : null}
        {error ? <p className="sv-note">{error}</p> : null}

        {job ? (
          <>
            <div className="sv-steps" aria-live="polite">
              {t.steps.map((label, index) => (
                <div key={label} className={`sv-step${index === phaseIndex ? " on" : ""}${phase === "done" || index < phaseIndex ? " done" : ""}`}>{label}</div>
              ))}
            </div>
            {running ? <button className="sv-button secondary" type="button" onClick={cancel}>{t.dir === "rtl" ? "ביטול" : "Cancel"}</button> : null}
            <div className="sv-scores">
              <div className="sv-score"><span>SEO</span><strong>{scoreText(job.scores?.seo?.score, t.unavailable)}</strong><span>{t.coverage} {job.scores?.seo?.coverage ?? "—"}%</span></div>
              <div className="sv-score"><span>GEO</span><strong>{scoreText(job.scores?.geo?.score, t.unavailable)}</strong><span>{t.coverage} {job.scores?.geo?.coverage ?? "—"}%</span></div>
              <div className="sv-score"><span>AEO</span><strong>{scoreText(job.scores?.aeo?.score, t.unavailable)}</strong><span>{t.coverage} {job.scores?.aeo?.coverage ?? "—"}%</span></div>
            </div>
            <p className="sv-meta">{job.scores?.disclaimer || t.disclaimer}</p>
            <div className="sv-tabs">
              {["overview", "findings", "fixes", "history"].map((id) => (
                <button key={id} className="sv-button secondary" type="button" aria-selected={tab === id} onClick={() => setTab(id)}>
                  {t[id as "overview"]}
                </button>
              ))}
            </div>

            {tab === "overview" ? (
              <section className="sv-panel">
                <h2>{job.domain || job.url}</h2>
                <p>{t.scanned}: {job.createdAt ? new Date(job.createdAt).toLocaleString() : "—"} · {t.pageCount}: {job.stats?.fetched ?? job.progress?.pages ?? 0} · {t.status}: {job.status}</p>
                <p>{t.critical}: {job.scores?.critical ?? 0} · {t.warnings}: {job.scores?.warnings ?? 0} · {t.recommendations}: {job.scores?.recommendations ?? 0}</p>
                <div className="sv-row">
                  <button className="sv-button secondary" type="button" onClick={() => download("pdf")}>{t.exportPdf}</button>
                  <button className="sv-button secondary" type="button" onClick={() => download("csv")}>{t.exportCsv}</button>
                  <button className="sv-button secondary" type="button" onClick={() => download("json")}>{t.exportJson}</button>
                </div>
                {(job.limitations || []).map((line) => <p key={line}>{line}</p>)}
                <h2>{t.pages}</h2>
                <table className="sv-table">
                  <tbody>
                    {pages.map((item) => (
                      <tr key={item.id}>
                        <td><button type="button" onClick={() => openPage(item.id)}>{item.finalUrl || item.url}</button></td>
                        <td>{item.status || item.error || "—"}</td>
                        <td>{item.title || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}

            {tab === "findings" ? (
              <section>
                <div className="sv-filters">
                  <select aria-label={t.filterType} value={type} onChange={(event) => setType(event.target.value)}>
                    <option value="all">{t.all}</option>
                    <option value="seo">SEO</option>
                    <option value="geo">GEO</option>
                    <option value="aeo">AEO</option>
                  </select>
                  <select aria-label={t.filterSeverity} value={severity} onChange={(event) => setSeverity(event.target.value)}>
                    <option value="all">{t.all}</option>
                    <option value="critical">critical</option>
                    <option value="warning">warning</option>
                    <option value="info">info</option>
                  </select>
                  <select aria-label={t.filterStatus} value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value="all">{t.all}</option>
                    <option value="fail">fail</option>
                    <option value="warning">warning</option>
                    <option value="pass">pass</option>
                    <option value="not_checked">not_checked</option>
                  </select>
                </div>
                <table className="sv-table">
                  <thead>
                    <tr>
                      <th>{t.findings}</th><th>{t.filterType}</th><th>{t.filterSeverity}</th><th>{t.pages}</th><th>{t.filterStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((row) => (
                      <tr key={row.id || row.ruleId}>
                        <td><button type="button" onClick={() => setOpenId(openId === row.id ? "" : row.id)}>{pick(row, i18n.language, "titleHe", "titleEn")}</button></td>
                        <td>{row.category}</td>
                        <td><span className={`sv-pill ${row.severity}`}>{row.severity}</span></td>
                        <td>{(row.affectedUrls || []).length}</td>
                        <td>{row.status === "not_checked" ? t.unavailable : row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visible.filter((row) => row.id === openId).map((row) => (
                  <article className="sv-panel" key={`${row.id}-detail`}>
                    <h2>{pick(row, i18n.language, "titleHe", "titleEn")}</h2>
                    <p>{t.why}: {pick(row, i18n.language, "explanationHe", "explanationEn")}</p>
                    <p>{t.evidence}: {row.evidence || t.unavailable}</p>
                    <p>{t.action}: {pick(row, i18n.language, "recommendationHe", "recommendationEn")}</p>
                    <p>{(row.affectedUrls || []).join(" · ")}</p>
                    {(row.docs || []).map((doc: any) => <p key={doc.url}>{t.docs}: <a href={doc.url}>{doc.name}</a></p>)}
                    {row.status === "fail" || row.status === "warning" ? (
                      <button className="sv-button secondary" type="button" onClick={() => mark(row)}>
                        {row.customerStatus === "customer_marked" ? t.marked : t.mark}
                      </button>
                    ) : null}
                  </article>
                ))}
              </section>
            ) : null}

            {tab === "fixes" ? (
              <section className="sv-grid">
                {(job.tasks || []).map((task: any) => (
                  <article className="sv-card" key={task.ruleId}>
                    <h2>{pick(task, i18n.language, "titleHe", "titleEn")}</h2>
                    <p>{pick(task, i18n.language, "explanationHe", "explanationEn")}</p>
                    <p>{t.effort}: {task.effort} · {(task.affectedUrls || []).length}</p>
                    <p>{pick(task, i18n.language, "instructionsHe", "instructionsEn")}</p>
                  </article>
                ))}
              </section>
            ) : null}

            {tab === "history" ? (
              <section className="sv-panel">
                <h2>{t.history}</h2>
                {compareNote ? <p>{t.engineNote}: {compareNote}</p> : null}
                {history.length === 0 ? <p>{t.empty}</p> : null}
                <table className="sv-table">
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td><button type="button" onClick={() => loadJob(item.id).then(setJob)}>{item.domain}</button></td>
                        <td>{item.status}</td>
                        <td>SEO {item.scores?.seo?.score ?? "—"}</td>
                        <td>{item.id !== job.id ? <button type="button" onClick={() => compareWith(item.id)}>{t.compare}</button> : null}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ) : null}

            {tab === "page" && pageDetail ? (
              <section className="sv-panel">
                <button className="sv-button secondary" type="button" onClick={() => setTab("overview")}>{t.back}</button>
                <h2>{pageDetail.page?.finalUrl}</h2>
                <p>{pageDetail.page?.status} · {pageDetail.page?.title}</p>
                <p>{pageDetail.page?.description}</p>
                {(pageDetail.findings || []).map((row: Finding) => (
                  <p key={row.ruleId}>{pick(row, i18n.language, "titleHe", "titleEn")} — {row.evidence}</p>
                ))}
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
