import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { browserHostname, resolveApiBaseUrl } from "../apiBaseUrl";

type VersionRow = { versionId: string; label: string; createdAt?: string };
type QualityIssue = { code: string; severity?: string; detail?: string };
type QualityReport = { ready?: boolean; issues?: QualityIssue[]; versionId?: string; stage?: string };
type CodeResult = {
  projectId: string;
  title?: string;
  previewToken: string;
  files: Record<string, string>;
  versions: VersionRow[];
  via?: string;
  durationMs?: number;
  versionId?: string;
  ready?: boolean;
  quality?: QualityReport | null;
  reverted?: boolean;
  phase?: string;
  buildError?: string;
  reply?: string;
};
type ProjectRow = { projectId: string; title: string; status?: string; updatedAt?: string; previewToken?: string };
type StudioView = "home" | "gallery" | "studio";
type ProbeReport = { width?: number; status?: string; ready?: boolean; issues?: QualityIssue[] };

const BRIEF = "";

const ISSUE_LABELS: Record<string, string> = {
  "overflow-x": "העמוד רחב מהמסך",
  "clipped-heading": "כותרת נחתכת",
  overlap: "טקסט חופף",
  "empty-region": "שטח ריק גדול",
  "dead-link": "קישור בלי פעולה",
  "missing-screen": "מסך חסר",
  "missing-nav": "ניווט חסר",
  "missing-text": "הטקסט המבוקש לא מופיע",
  "leftover-text": "הטקסט הישן נשאר",
  filter: "הסינון לא משנה את הרשימה",
  calculator: "המחשבון לא מגיב",
  gallery: "הגלריה לא עובדת",
  properties: "הנכסים חסרים",
  images: "חסרות תמונות",
  rtl: "כיוון העברית חסר",
  hebrew: "חסר טקסט בעברית",
  motion: "חסרים מעבר או אנימציה",
  spacing: "מרווח גדול מדי",
  state: "חסרה אינטראקציה",
  invalid: "הקוד לא עמד בבדיקה",
  "quality-timeout": "בדיקת התצוגה לא הושלמה",
  "stacked-screens": "יותר מעמוד אחד מוצג",
  compare: "ההשוואה לא מגיבה",
  inquiry: "טופס הפנייה לא שומר",
  booking: "קביעת התור לא מוכנה",
};

function isolatedPreviewUrl(projectId: string, token: string) {
  const base = resolveApiBaseUrl({
    envApiUrl: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE,
    hostname: browserHostname(),
  });
  if (!/^https:\/\//.test(base)) return "";
  return `${base}/ai-studio/code-preview/${projectId}?t=${encodeURIComponent(token)}`;
}

function issueText(issue: QualityIssue) {
  const label = ISSUE_LABELS[issue.code] || "נדרשת בדיקה";
  return issue.detail ? `${label} (${issue.detail})` : label;
}

function displayTitle(title?: string) {
  const text = String(title || "").trim();
  if (!text || text === "React runtime") return "אתר חדש";
  return text;
}

function formatWhen(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("he-IL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function versionLabel(version: VersionRow) {
  const label = String(version.label || "").trim();
  if (label && !label.startsWith("v_")) return label;
  return formatWhen(version.createdAt) || "גרסה שמורה";
}

export default function AiStudioCodePage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const [brief, setBrief] = useState(BRIEF);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState<CodeResult | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectRow[]>([]);
  const [viewport, setViewport] = useState<1440 | 390>(1440);
  const [frameNonce, setFrameNonce] = useState(0);
  const [reply, setReply] = useState("");
  const [view, setView] = useState<StudioView>("home");
  const [fullscreen, setFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const loadWait = useRef<(() => void) | null>(null);
  const probeWait = useRef<((report: ProbeReport) => void) | null>(null);
  const expectVersion = useRef("");

  const previewUrl = useMemo(
    () => (project?.files?.["src/App.jsx"] ? isolatedPreviewUrl(project.projectId, project.previewToken) : ""),
    [project]
  );

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data || {};
      if (data.source !== "bizuply-preview" || data.type !== "quality") return;
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) return;
      if (data.versionId && expectVersion.current && data.versionId !== expectVersion.current) return;
      probeWait.current?.(data);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function reopen() {
      try {
        const { data } = await API.get("/ai-studio/code-projects", { timeout: 30000 });
        if (cancelled) return;
        const projects = Array.isArray(data?.projects) ? data.projects : [];
        setSavedProjects(projects);
      } catch {
        if (!cancelled) setError("לא הצלחתי לפתוח את הפרויקט השמור");
      }
    }
    void reopen();
    return () => {
      cancelled = true;
    };
    // The saved project is loaded once when the studio page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  function remember(next: CodeResult) {
    setProject(next);
    setView("studio");
    setSavedProjects((current) => {
      const row = {
        projectId: next.projectId,
        title: displayTitle(next.title),
        status: next.ready ? "ready" : "draft",
        updatedAt: new Date().toISOString(),
        previewToken: next.previewToken,
      };
      return [row, ...current.filter((item) => item.projectId !== next.projectId)];
    });
  }

  async function measureWidth(width: 1440 | 390) {
    setViewport(width);
    setFrameNonce((value) => value + 1);
    await new Promise<void>((resolve) => {
      loadWait.current = resolve;
    });
    return new Promise<ProbeReport>((resolve) => {
      const timer = window.setTimeout(() => {
        probeWait.current = null;
        resolve({ width, status: "timeout", ready: false, issues: [{ code: "quality-timeout", severity: "timeout", detail: String(width) }] });
      }, 20000);
      probeWait.current = (report) => {
        window.clearTimeout(timer);
        probeWait.current = null;
        resolve({ ...report, width });
      };
      iframeRef.current?.contentWindow?.postMessage({ source: "bizuply-studio", type: "measure" }, "*");
    });
  }

  async function review(current: CodeResult) {
    if (!current?.projectId || !current.previewToken) return;
    expectVersion.current = current.versionId || "";
    setChecking(true);
    setError("");
    try {
      const desktop = await measureWidth(1440);
      const mobile = await measureWidth(390);
      const issues = [...(desktop.issues || []), ...(mobile.issues || [])];
      const measured = desktop.status === "measured" && mobile.status === "measured";
      const failures = issues.filter((item) => item.severity !== "timeout" && item.code !== "quality-timeout");
      const { data } = await API.post(
        `/ai-studio/code-projects/${current.projectId}/quality`,
        {
          versionId: current.versionId,
          status: measured ? "measured" : "timeout",
          ready: measured && failures.length === 0,
          issues,
          widths: [1440, 390],
        },
        { timeout: 30000 }
      );
      remember(data);
      if (data.reverted) {
        setError("הבקשה לא הושלמה במלואה. השינוי לא נשמר והגרסה הקודמת נשארה.");
        return;
      }
      setFrameNonce((value) => value + 1);
    } catch (err: any) {
      setError(err?.response?.data?.error || "בדיקת האיכות נכשלה");
    } finally {
      setChecking(false);
    }
  }

  async function createSite() {
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post("/ai-studio/code-projects", { brief }, { timeout: 30000 });
      remember(data);
      setMessage("");
      let latest = data;
      const started = Date.now();
      while (Date.now() - started < 90000) {
        await new Promise((resolve) => window.setTimeout(resolve, Date.now() - started < 15000 ? 1000 : 2000));
        const saved = await API.get(`/ai-studio/code-projects/${data.projectId}`, { timeout: 30000 });
        latest = saved.data;
        remember(latest);
        setFrameNonce((value) => value + 1);
        if (latest.phase === "ready" || latest.phase === "stopped") break;
      }
      setBusy(false);
      if (latest.phase === "ready") await review(latest);
      else setError(latest.buildError || "הבנייה עדיין לא הושלמה");
    } catch (err: any) {
      setError(err?.response?.data?.error || "יצירת האתר נכשלה");
      setBusy(false);
    }
  }

  async function sendEdit(text = message) {
    if (!project || !text.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(
        `/ai-studio/code-projects/${project.projectId}/chat`,
        { message: text },
        { timeout: 600000 }
      );
      remember(data);
      setMessage("");
      setReply(data.reply || "");
      setBusy(false);
      if (!data.reply) await review(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "השינוי נכשל");
      setBusy(false);
    }
  }

  async function restore(versionId: string) {
    if (!project) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(
        `/ai-studio/code-projects/${project.projectId}/restore`,
        { versionId },
        { timeout: 30000 }
      );
      remember(data);
      setBusy(false);
      await review(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "השחזור נכשל");
      setBusy(false);
    }
  }

  async function openSaved(projectId: string) {
    setBusy(true);
    setError("");
    try {
      const { data } = await API.get(`/ai-studio/code-projects/${projectId}`, { timeout: 30000 });
      remember(data);
      setBusy(false);
      await review(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "פתיחת הפרויקט נכשלה");
      setBusy(false);
    }
  }

  useEffect(() => {
    const node = stageRef.current;
    if (!node || view !== "studio") return undefined;
    const measure = () => {
      const available = Math.max(280, node.clientWidth - 48);
      setScale(Math.min(1, available / viewport));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [viewport, view, fullscreen, project?.projectId]);

  const qualityIssues = project?.quality?.issues || [];
  const ready = project?.quality?.stage === "visual"
    && project?.quality?.ready === true
    && project?.quality?.versionId === project?.versionId;

  const statusLine = busy && project?.phase === "ready"
    ? "מעדכנים את האתר"
    : project?.phase === "planning" || project?.phase === "pages" || busy
      ? "יוצרים עבורך אתר בהתאמה אישית"
      : project?.phase === "stopped"
        ? "הבנייה נעצרה לפני השלמה"
        : checking
          ? "בודקים את התצוגה במחשב ובטלפון"
          : project?.phase === "ready" || ready
            ? "האתר שלך מוכן"
            : "אפשר להתחיל מתאר חדש";

  const frameHeight = viewport === 390 ? 780 : 900;
  const frameWidth = Math.round(viewport * (fullscreen ? 1 : scale));
  const shownHeight = Math.round(frameHeight * (fullscreen ? 1 : scale));

  function previewFrame(full: boolean) {
    if (!previewUrl) {
      return <p className="p-8 text-sm text-slate-500">האתר יופיע כאן אחרי היצירה.</p>;
    }
    const width = full ? "100%" : viewport;
    const height = full ? "100%" : frameHeight;
    return (
      <iframe
        ref={full ? undefined : iframeRef}
        key={`${previewUrl}:${project?.versionId || ""}:${frameNonce}:${full ? "full" : viewport}`}
        title="תצוגת האתר"
        src={previewUrl}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        onLoad={() => {
          if (!full) loadWait.current?.();
        }}
        className="block border-0 bg-white"
        style={full
          ? { width: "100%", height: "100%" }
          : { width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}
      />
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[linear-gradient(180deg,#faf7ff_0%,#f3f8ff_48%,#eefcff_100%)] text-slate-800" dir="rtl">
      <header className="flex items-center justify-between gap-4 border-b border-violet-200/80 bg-white/80 px-5 py-3 backdrop-blur">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-wide text-[#5B4CF5]">AI Studio</div>
          <div className="truncate text-sm font-semibold text-slate-900">
            {view === "studio" ? displayTitle(project?.title) : "בניית אתר"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setView("home"); setFullscreen(false); }} className="border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">אתר חדש</button>
          <button type="button" onClick={() => setView("gallery")} className="border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-[#3730a3]">הפרויקטים שלי</button>
          <a href={`/business/${businessId}/dashboard`} className="border border-transparent px-3 py-2 text-sm font-semibold text-slate-500">חזרה ללוח</a>
        </div>
      </header>

      {view === "home" && (
        <div className="flex h-[calc(100vh-57px)] items-center justify-center px-6">
          <div className="w-full max-w-2xl">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">איזה אתר נבנה היום?</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">תארו את העסק, העמודים, ומה הגולש צריך לעשות. האתר נשמר כאן, ואפשר להמשיך לערוך אותו אחר כך.</p>
            <textarea
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              placeholder="תארו את העסק, העמודים, והפעולות שהגולש צריך לבצע"
              className="mt-6 h-44 w-full border border-violet-200 bg-white p-4 text-base shadow-[0_16px_40px_rgba(91,76,245,0.08)] outline-none focus:border-[#5B4CF5]"
            />
            <button
              type="button"
              disabled={busy || checking || brief.trim().length < 20}
              onClick={createSite}
              className="mt-4 bg-[#5B4CF5] px-6 py-3 text-base font-bold text-white disabled:opacity-50"
            >
              {busy ? "יוצרים עבורך אתר בהתאמה אישית" : "צרו אתר"}
            </button>
            <p className="mt-4 text-sm text-slate-500">פנייה או תור נשמרים דרך Bizuply. פרסום וחיבור דומיין אינם פעילים בגרסה הזו.</p>
            {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
          </div>
        </div>
      )}

      {view === "gallery" && (
        <div className="h-[calc(100vh-57px)] overflow-y-auto px-6 py-6">
          <h1 className="text-2xl font-black text-slate-900">הפרויקטים שלי</h1>
          {savedProjects.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">עדיין אין אתרים שמורים.</p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {savedProjects.map((item) => {
                const thumb = item.previewToken ? isolatedPreviewUrl(item.projectId, item.previewToken) : "";
                return (
                  <article key={item.projectId} className="overflow-hidden border border-violet-100 bg-white shadow-[0_12px_30px_rgba(37,99,235,0.06)]">
                    <div className="relative h-40 overflow-hidden bg-[#eef2ff]">
                      {thumb ? (
                        <iframe title="" src={thumb} sandbox="allow-scripts" tabIndex={-1} className="pointer-events-none absolute right-0 top-0 border-0 bg-white" style={{ width: 1440, height: 900, transform: "scale(0.22)", transformOrigin: "top right" }} />
                      ) : (
                        <div className="flex h-full items-end bg-[linear-gradient(135deg,#5B4CF5,#38bdf8)] p-4 text-lg font-bold text-white">{displayTitle(item.title)}</div>
                      )}
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <h2 className="truncate text-base font-bold text-slate-900">{displayTitle(item.title)}</h2>
                        <p className="mt-1 text-xs text-slate-500">{formatWhen(item.updatedAt) || "עודכן לאחרונה"}</p>
                      </div>
                      <button type="button" disabled={busy || checking} onClick={() => openSaved(item.projectId)} className="bg-[#5B4CF5] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">פתיחה</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {view === "studio" && (
        <div className="grid h-[calc(100vh-57px)] min-h-0 grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="flex min-h-0 flex-col gap-3 overflow-y-auto border-l border-violet-100 bg-white/75 p-4">
            <div className="border border-violet-100 bg-white p-3 text-sm">
              <div className={project?.phase === "ready" || ready ? "font-semibold text-emerald-700" : "font-semibold text-[#5B4CF5]"}>{statusLine}</div>
              {project?.durationMs ? <div className="mt-1 text-slate-500">הפעולה האחרונה נמשכה {Math.round(project.durationMs / 1000)} שניות</div> : null}
              {qualityIssues.length > 0 && (
                <ul className="mt-2 space-y-1 text-slate-600">
                  {qualityIssues.map((item, index) => (
                    <li key={`${item.code}-${index}`}>{issueText(item)}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="שנו צבע, פונט, תמונה, כפתור, מקטע, כותרת או פוטר"
                className="min-w-0 flex-1 border border-violet-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#5B4CF5]"
              />
              <button type="button" disabled={busy || checking || !message.trim()} onClick={() => sendEdit()} className="bg-[#2563eb] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">שלח</button>
            </div>
            {reply ? <p className="text-sm leading-6 text-slate-700">{reply}</p> : null}
            <div className="text-xs font-semibold text-slate-500">גרסאות</div>
            <div className="space-y-2">
              {(project?.versions || []).map((version) => (
                <button key={version.versionId} type="button" disabled={busy || checking} onClick={() => restore(version.versionId)} className="block w-full truncate border border-violet-100 bg-white px-3 py-2 text-right text-sm text-slate-700">
                  שחזור · {versionLabel(version)}
                </button>
              ))}
            </div>
            {error && <p className="text-sm text-rose-700">{error}</p>}
          </section>
          <section className="flex min-h-0 min-w-0 flex-col bg-[#eef2ff]">
            <div className="flex items-center justify-between gap-3 border-b border-violet-100 bg-white/80 px-4 py-2">
              <div className="text-sm font-semibold text-slate-600">תצוגה</div>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setFullscreen(false); setViewport(1440); }} className={`border px-3 py-1.5 text-sm font-semibold ${viewport === 1440 && !fullscreen ? "border-[#5B4CF5] bg-[#5B4CF5] text-white" : "border-violet-200 bg-white text-slate-700"}`}>מחשב</button>
                <button type="button" onClick={() => { setFullscreen(false); setViewport(390); }} className={`border px-3 py-1.5 text-sm font-semibold ${viewport === 390 && !fullscreen ? "border-[#5B4CF5] bg-[#5B4CF5] text-white" : "border-violet-200 bg-white text-slate-700"}`}>טלפון</button>
                <button type="button" onClick={() => setFullscreen(true)} className="border border-violet-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">מסך מלא</button>
              </div>
            </div>
            <div ref={stageRef} className="min-h-0 flex-1 overflow-hidden p-6">
              <div className="mx-auto overflow-hidden bg-white shadow-[0_18px_50px_rgba(30,41,59,0.12)]" style={{ width: frameWidth, height: shownHeight }}>
                {previewFrame(false)}
              </div>
            </div>
          </section>
        </div>
      )}

      {fullscreen && previewUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-violet-100 px-4 py-3">
            <div className="font-semibold text-slate-900">{displayTitle(project?.title)}</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => window.open(previewUrl, "_blank", "noopener")} className="border border-violet-200 px-3 py-2 text-sm font-semibold">פתיחה בחלון</button>
              <button type="button" onClick={() => setFullscreen(false)} className="bg-[#5B4CF5] px-3 py-2 text-sm font-bold text-white">סגירה</button>
            </div>
          </div>
          <div className="min-h-0 flex-1">{previewFrame(true)}</div>
        </div>
      )}
    </div>
  );
}
