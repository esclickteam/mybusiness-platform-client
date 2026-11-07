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
type ProjectRow = { projectId: string; title: string; status?: string; updatedAt?: string };
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
  const label = ISSUE_LABELS[issue.code] || issue.code;
  return issue.detail ? `${label} (${issue.detail})` : label;
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
        if (projects[0]?.projectId) {
          const saved = await API.get(`/ai-studio/code-projects/${projects[0].projectId}`, { timeout: 30000 });
          if (!cancelled) setProject(saved.data);
        }
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
    setSavedProjects((current) => {
      const row = { projectId: next.projectId, title: next.title || "React runtime", status: next.ready ? "ready" : "draft" };
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

  const qualityIssues = project?.quality?.issues || [];
  const ready = project?.quality?.stage === "visual"
    && project?.quality?.ready === true
    && project?.quality?.versionId === project?.versionId;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100" dir="rtl">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-amber-200">BIZUPLY AI STUDIO</div>
        <h1 className="mt-1 text-xl font-black">תארו אתר, ואז בקשו שינויים</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          התצוגה נפתחת בנפרד מהחשבון. פנייה או תור נשמרים דרך Bizuply, בלי גישה של האתר למסד. פרסום וחיבור דומיין אינם פעילים בגרסה הזו.
        </p>
      </div>
      <div className="grid gap-4 p-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="space-y-3">
          {savedProjects.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400">פרויקטים שמורים</div>
              {savedProjects.map((item) => (
                <button
                  key={item.projectId}
                  type="button"
                  disabled={busy || checking}
                  onClick={() => openSaved(item.projectId)}
                  className="block w-full truncate rounded-md border border-white/10 px-3 py-2 text-right text-xs text-slate-300"
                >
                  {item.title || item.projectId}
                </button>
              ))}
            </div>
          )}
          <textarea
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            placeholder="תארו את העסק, העמודים, והפעולות שהגולש צריך לבצע"
            className="h-40 w-full rounded-lg border border-white/10 bg-slate-900 p-3 text-sm"
          />
          <button
            type="button"
            disabled={busy || checking || brief.trim().length < 20}
            onClick={createSite}
            className="rounded-md bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy ? "יוצרים עבורך אתר בהתאמה אישית" : "צרו אתר"}
          </button>
          {project && (
            <>
              <div className="rounded-md border border-white/10 p-3 text-xs">
                <div className={project.phase === "ready" || ready ? "text-emerald-300" : "text-amber-200"}>
                  {busy && project.phase === "ready"
                    ? "מעדכנים את האתר"
                    : project.phase === "planning" || project.phase === "pages" || busy
                    ? "יוצרים עבורך אתר בהתאמה אישית"
                    : project.phase === "stopped"
                      ? "הבנייה נעצרה לפני השלמה"
                      : checking
                        ? "בודקים את התצוגה במחשב ובטלפון"
                        : project.phase === "ready" || ready
                          ? "האתר שלך מוכן"
                          : "אפשר להתחיל מתאר חדש"}
                </div>
                {project.durationMs ? <div className="mt-1 text-slate-400">הפעולה האחרונה נמשכה {Math.round(project.durationMs / 1000)} שניות</div> : null}
                <ul className="mt-2 space-y-1 text-slate-300">
                  {qualityIssues.map((item, index) => (
                    <li key={`${item.code}-${index}`}>{issueText(item)}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="שנו צבע, פונט, תמונה, כפתור, מקטע, כותרת או פוטר"
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={busy || checking || !message.trim()}
                  onClick={() => sendEdit()}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                >
                  שלח
                </button>
              </div>
              {reply ? <p className="text-sm text-slate-200">{reply}</p> : null}
              <div className="text-xs text-slate-400">גרסאות</div>
              <div className="space-y-2">
                {(project.versions || []).map((version) => (
                  <button
                    key={version.versionId}
                    type="button"
                    disabled={busy || checking}
                    onClick={() => restore(version.versionId)}
                    className="block w-full truncate rounded-md border border-white/10 px-3 py-2 text-right text-xs text-slate-300"
                  >
                    שחזור · {version.label || version.versionId}
                  </button>
                ))}
              </div>
            </>
          )}
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </section>
        <section className="min-h-[80vh] overflow-auto rounded-xl border border-white/10 bg-black p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-400">תצוגה</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setViewport(1440)} className="rounded-md border border-white/10 px-3 py-1 text-xs">
                מחשב
              </button>
              <button type="button" onClick={() => setViewport(390)} className="rounded-md border border-white/10 px-3 py-1 text-xs">
                טלפון
              </button>
            </div>
          </div>
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              key={`${previewUrl}:${project?.versionId || ""}:${frameNonce}`}
              title="תצוגת האתר המבודדת"
              src={previewUrl}
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              onLoad={() => loadWait.current?.()}
              className="mx-auto block h-[80vh] border-0 bg-white"
              style={{ width: viewport }}
            />
          ) : (
            <p className="p-6 text-sm text-slate-500">האתר יופיע כאן אחרי היצירה.</p>
          )}
        </section>
      </div>
    </div>
  );
}
