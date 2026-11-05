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
};
type ProjectRow = { projectId: string; title: string; status?: string; updatedAt?: string };
type ProbeReport = { width?: number; status?: string; ready?: boolean; issues?: QualityIssue[] };

const BRIEF =
  "צור אתר נדל״ן יוקרתי בדובאי בשם AURELIA ESTATES. עצב כל מסך במלואו: בית, נכסים, מחשבון וקשר. Hero מלא, טיפוגרפיה עם היררכיה, קומפוזיציות שונות, תמונות אדריכלות, אנימציה ומעברים. בלי שטחים ריקים, בלי חפיפת כותרות ובלי חיתוך. עברית מימין לשמאל, והשם באנגלית נשאר קריא. ארבעה נכסי דמו עם סינון לפי אזור, מחיר וחדרי שינה. מחשבון משכנתה שההחזר שלו משתנה. גלריה שנפתחת ומחליפה תמונות. התאמה ל־1440 ול־390. כל התוכן הוא הדגמה.";

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
  const [publishNote, setPublishNote] = useState("");
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const loadWait = useRef<(() => void) | null>(null);
  const probeWait = useRef<((report: ProbeReport) => void) | null>(null);
  const expectVersion = useRef("");

  const previewUrl = useMemo(
    () => (project ? isolatedPreviewUrl(project.projectId, project.previewToken) : ""),
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
      const { data } = await API.post("/ai-studio/code-projects", { brief }, { timeout: 180000 });
      remember(data);
      setMessage("");
      setBusy(false);
      await review(data);
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
        { timeout: 180000 }
      );
      remember(data);
      setMessage("");
      setBusy(false);
      await review(data);
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

  async function checkPublish() {
    if (!project) return;
    setBusy(true);
    setPublishNote("");
    try {
      const { data } = await API.post(`/ai-studio/code-projects/${project.projectId}/publish-plan`, {}, { timeout: 30000 });
      setPublishNote(data?.published ? "האתר פורסם" : "הפרסום נשאר כבוי. הבדיקה לא פרסמה אתר.");
    } catch (err: any) {
      setPublishNote(err?.response?.data?.error || "בדיקת הפרסום נכשלה");
    }
    setBusy(false);
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
        <div className="text-xs font-semibold tracking-wide text-amber-200">AI STUDIO · REACT RUNTIME</div>
        <h1 className="mt-1 text-xl font-black">אתר שנכתב בקוד, בלי תבנית מארחת</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          התצוגה נטענת מדומיין נפרד, בלי עוגיות ההתחברות. שמירת פנייה או תור עוברת רק דרך הממשק של הפרויקט. רענון העמוד פותח מחדש את הפרויקט השמור.
          העסק הפעיל: {businessId}
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
            className="h-40 w-full rounded-lg border border-white/10 bg-slate-900 p-3 text-sm"
          />
          <button
            type="button"
            disabled={busy || checking}
            onClick={createSite}
            className="rounded-md bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy ? "המודל כותב…" : "צור אתר React"}
          </button>
          {project && (
            <>
              <div className="rounded-md border border-white/10 p-3 text-xs">
                <div className={ready ? "text-emerald-300" : "text-amber-200"}>
                  {checking ? "בודק את האתר ב־1440 וב־390…" : ready ? "האתר עבר את בדיקת האיכות" : "האתר לא מסומן כמוכן"}
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
                  placeholder="בקשו שינוי בקוד, במבנה או בפונקציה"
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
              <button
                type="button"
                disabled={busy || checking}
                onClick={checkPublish}
                className="rounded-md border border-white/10 px-3 py-2 text-xs text-slate-300"
              >
                בדיקת פרסום
              </button>
              {publishNote ? <p className="text-xs text-slate-400">{publishNote}</p> : null}
              <div className="space-y-2">
                {(project.versions || []).map((version) => (
                  <button
                    key={version.versionId}
                    type="button"
                    disabled={busy || checking}
                    onClick={() => restore(version.versionId)}
                    className="block w-full truncate rounded-md border border-white/10 px-3 py-2 text-right text-xs text-slate-300"
                  >
                    {version.label || version.versionId}
                  </button>
                ))}
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {Object.keys(project.files || {}).map((filePath) => (
                  <li key={filePath}>{filePath}</li>
                ))}
              </ul>
            </>
          )}
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </section>
        <section className="min-h-[80vh] overflow-auto rounded-xl border border-white/10 bg-black p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-400">תצוגה מבודדת</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setViewport(1440)} className="rounded-md border border-white/10 px-3 py-1 text-xs">
                1440
              </button>
              <button type="button" onClick={() => setViewport(390)} className="rounded-md border border-white/10 px-3 py-1 text-xs">
                390
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
            <p className="p-6 text-sm text-slate-500">האתר יופיע כאן אחרי שהמודל יסיים לכתוב את הקבצים.</p>
          )}
        </section>
      </div>
    </div>
  );
}
