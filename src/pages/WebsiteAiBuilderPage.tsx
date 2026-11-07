import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { browserHostname, resolveApiBaseUrl } from "../apiBaseUrl";
import logo from "../images/logo_final.svg";

type Step = { id: string; state: "done" | "active" | "waiting" | "stopped" };
type VersionRow = { versionId: string; label: string; createdAt?: string };
type Project = {
  projectId: string;
  title?: string;
  previewToken?: string;
  files?: Record<string, string>;
  versions?: VersionRow[];
  phase?: string;
  brief?: string;
  buildError?: string;
  buildSteps?: Step[];
  reply?: string;
};

const STEP_LABELS: Record<string, string> = {
  direction: "מגבשים את הכיוון העיצובי",
  palette: "מתאימים צבעים וטיפוגרפיה",
  structure: "בונים את מבנה האתר",
  content: "יוצרים תוכן ומוסיפים תמונות",
  actions: "מחברים כפתורים ופעולות",
  responsive: "מתאימים למחשב ולטלפון",
  complete: "משלימים את האתר שלך",
};

const STEP_ORDER = Object.keys(STEP_LABELS);

function previewUrl(projectId: string, token: string) {
  const base = resolveApiBaseUrl({
    envApiUrl: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE,
    hostname: browserHostname(),
  });
  if (!/^https:\/\//.test(base) || !token) return "";
  return `${base}/ai-studio/code-preview/${projectId}?t=${encodeURIComponent(token)}`;
}

function textBits(source: string) {
  const found: string[] = [];
  const pattern = /<(h1|h2|button)\b[^>]*>([^<{][^<]{1,80})</g;
  let match = pattern.exec(source);
  while (match && found.length < 8) {
    const text = match[2].replace(/\s+/g, " ").trim();
    if (text && /[א-ת]/.test(text) && !/[{}=()]|setScreen|[A-Za-z]{4,}/.test(text) && !found.includes(text)) found.push(text);
    match = pattern.exec(source);
  }
  return found;
}

function imageBits(source: string) {
  return [...source.matchAll(/https:\/\/images\.unsplash\.com\/photo-[A-Za-z0-9-]+/g)]
    .map((item) => item[0])
    .filter((item, index, all) => all.indexOf(item) === index)
    .slice(0, 4);
}

function stepsFor(project: Project | null): Step[] {
  if (project?.buildSteps?.length) return project.buildSteps;
  return STEP_ORDER.map((id, index) => ({ id, state: index === 0 ? "active" : "waiting" }));
}

export default function WebsiteAiBuilderPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const base = `/business/${businessId}/dashboard/website`;
  const requested = new URLSearchParams(window.location.search).get("project") || "";
  const [brief, setBrief] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [systemNote, setSystemNote] = useState("");

  const app = project?.files?.["src/App.jsx"] || "";
  const texts = useMemo(() => textBits(app), [app]);
  const images = useMemo(() => imageBits(app), [app]);
  const building = project?.phase === "planning" || project?.phase === "pages";
  const ready = project?.phase === "ready" && Boolean(app);
  const frame = project?.projectId && project.previewToken ? previewUrl(project.projectId, project.previewToken) : "";

  function remember(next: Project) {
    setProject(next);
    const url = new URL(window.location.href);
    url.searchParams.set("project", next.projectId);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    const source = `${next.brief || ""} ${next.title || ""}`;
    setSystemNote(/מערכת|דשבורד|פורטל|הרשא|חנות|סליק/.test(source)
      ? "זוהתה בקשה למערכת. התחברות, הרשאות וסליקה אינם פעילים כל עוד אין להם מימוש מאובטח."
      : "");
  }

  useEffect(() => {
    if (!requested) return;
    let stop = false;
    async function load() {
      try {
        const { data } = await API.get(`/ai-studio/code-projects/${requested}`, { timeout: 30000 });
        if (!stop) remember(data);
      } catch (err: any) {
        if (!stop) setError(err?.response?.status === 404
          ? "הפרויקט הזה שייך לחשבון אחר או שאינו זמין."
          : "לא הצלחתי לטעון את האתר.");
      }
    }
    load();
    return () => {
      stop = true;
    };
  }, [requested]);

  useEffect(() => {
    if (!project?.projectId || !building) return undefined;
    const timer = window.setInterval(async () => {
      try {
        const { data } = await API.get(`/ai-studio/code-projects/${project.projectId}`, { timeout: 30000 });
        remember(data);
      } catch {
        /* the next poll retries a transient read */
      }
    }, 2000);
    return () => window.clearInterval(timer);
  }, [project?.projectId, building]);

  async function createSite() {
    if (brief.trim().length < 20) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post("/ai-studio/code-projects", { brief: brief.trim() }, { timeout: 30000 });
      remember(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא הצלחתי להתחיל את הבנייה.");
    } finally {
      setBusy(false);
    }
  }

  async function resume() {
    if (!project) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(`/ai-studio/code-projects/${project.projectId}/resume`, {}, { timeout: 30000 });
      remember(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא הצלחתי להמשיך את הבנייה.");
    } finally {
      setBusy(false);
    }
  }

  async function saveManual(kind: string, from: string, to: string) {
    if (!project || !to.trim() || to.trim() === from) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(`/ai-studio/code-projects/${project.projectId}/manual`, { kind, from, to: to.trim() }, { timeout: 30000 });
      remember(data);
      setDrafts((current) => ({ ...current, [from]: "" }));
    } catch (err: any) {
      setError(err?.response?.data?.error || "העריכה הידנית לא נשמרה.");
    } finally {
      setBusy(false);
    }
  }

  async function sendChat() {
    if (!project || chat.trim().length < 2) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(`/ai-studio/code-projects/${project.projectId}/chat`, { message: chat.trim() }, { timeout: 120000 });
      remember(data);
      setChat("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "השינוי הממוקד לא הושלם. האתר הקודם נשמר.");
    } finally {
      setBusy(false);
    }
  }

  async function restore(versionId: string) {
    if (!project) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(`/ai-studio/code-projects/${project.projectId}/restore`, { versionId }, { timeout: 30000 });
      remember(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "השחזור לא הושלם.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <style>{`
        @keyframes ai-orbit { to { transform: rotate(360deg); } }
        @keyframes ai-ring { to { stroke-dashoffset: 0; } }
        .ai-orbit { animation: ai-orbit 9s linear infinite; transform-origin: 96px 96px; }
        .ai-ring { animation: ai-ring 2.8s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .ai-orbit, .ai-ring { animation: none; }
        }
      `}</style>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-violet-700">בונה האתרים</p>
            <h1 className="text-2xl font-black">{project?.title || "יצירה באמצעות AI"}</h1>
          </div>
          <button type="button" onClick={() => navigate(`${base}/templates`)} className="border border-slate-200 bg-white px-4 py-2 text-sm font-bold">בניית אתר בעורך</button>
        </div>
        {error ? <p className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}
        {systemNote ? <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{systemNote}</p> : null}

        {!project && (
          <form className="mx-auto w-full max-w-2xl bg-white p-6 shadow-sm" onSubmit={(event) => { event.preventDefault(); createSite(); }}>
            <label className="text-sm font-bold" htmlFor="ai-brief">תארו את האתר</label>
            <textarea id="ai-brief" value={brief} onChange={(event) => setBrief(event.target.value)} className="mt-3 min-h-36 w-full border border-slate-200 p-3" placeholder="העסק, הקהל, והתחושה שאתם רוצים באתר" />
            <button type="submit" disabled={busy || brief.trim().length < 20} className="mt-4 bg-[#5B4CF5] px-5 py-3 text-sm font-black text-white disabled:opacity-50">צרו אתר</button>
          </form>
        )}

        {project && !ready && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-6 py-10">
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 192 192" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle cx="96" cy="96" r="78" fill="none" stroke="#e0e7ff" strokeWidth="8" />
                <circle className="ai-ring" cx="96" cy="96" r="78" fill="none" stroke="#5B4CF5" strokeWidth="8" strokeLinecap="round" strokeDasharray="120 370" />
              </svg>
              <div className="ai-orbit absolute left-0 top-0 h-48 w-48">
                <span className="absolute left-1/2 top-1 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full bg-[#22D3EE] text-[11px] font-black text-slate-950">אתר</span>
              </div>
              <img src={logo} alt="Bizuply" className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 object-contain" />
            </div>
            <ol className="mt-8 w-full max-w-md space-y-2">
              {stepsFor(project).map((step) => (
                <li key={step.id} className="flex items-center justify-between border border-slate-100 px-3 py-2 text-sm">
                  <span>{STEP_LABELS[step.id] || step.id}</span>
                  <span className="font-bold text-slate-500">{step.state === "done" ? "הושלם" : step.state === "active" ? "בתהליך" : step.state === "stopped" ? "נעצר" : "ממתין"}</span>
                </li>
              ))}
            </ol>
            {project.phase === "stopped" ? (
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">{project.buildError || "הבנייה נעצרה לפני שהאתר הושלם. התיאור נשמר."}</p>
                <button type="button" onClick={resume} disabled={busy} className="mt-3 bg-[#5B4CF5] px-5 py-3 text-sm font-black text-white">נסו שוב</button>
              </div>
            ) : null}
          </div>
        )}

        {ready && (
          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="flex max-h-[80vh] flex-col gap-4 overflow-auto bg-white p-4">
              <p className="text-sm leading-6 text-slate-600">{project.brief}</p>
              <div>
                <h2 className="text-sm font-black">עריכה ידנית</h2>
                {texts.map((text) => (
                  <label key={text} className="mt-3 block text-xs font-bold text-slate-500">
                    {text}
                    <input value={drafts[text] ?? text} onChange={(event) => setDrafts((current) => ({ ...current, [text]: event.target.value }))} className="mt-1 w-full border border-slate-200 px-2 py-2 text-sm font-normal text-slate-900" />
                    <button type="button" onClick={() => saveManual("text", text, drafts[text] ?? text)} disabled={busy} className="mt-1 border border-violet-200 px-2 py-1">שמירה</button>
                  </label>
                ))}
                {images.map((src) => (
                  <label key={src} className="mt-3 block text-xs font-bold text-slate-500">
                    תמונה
                    <input value={drafts[src] ?? src} onChange={(event) => setDrafts((current) => ({ ...current, [src]: event.target.value }))} className="mt-1 w-full border border-slate-200 px-2 py-2 text-sm font-normal" />
                    <button type="button" onClick={() => saveManual("image", src, drafts[src] ?? src)} disabled={busy} className="mt-1 border border-violet-200 px-2 py-1">שמירת תמונה</button>
                  </label>
                ))}
              </div>
              <div>
                <h2 className="text-sm font-black">שינוי באמצעות AI</h2>
                <textarea value={chat} onChange={(event) => setChat(event.target.value)} className="mt-2 min-h-20 w-full border border-slate-200 p-2 text-sm" placeholder="שנו צבע כפתור, פונט או כותרת. שאר האתר נשמר." />
                <button type="button" onClick={sendChat} disabled={busy} className="mt-2 bg-[#5B4CF5] px-4 py-2 text-sm font-black text-white">שלח</button>
                {project.reply ? <p className="mt-2 text-sm text-slate-600">{project.reply}</p> : null}
              </div>
              <div>
                <h2 className="text-sm font-black">גרסאות</h2>
                {(project.versions || []).map((version) => (
                  <button key={version.versionId} type="button" onClick={() => restore(version.versionId)} disabled={busy} className="mt-2 block w-full border border-slate-200 px-2 py-2 text-start text-sm">שחזור · {version.label}</button>
                ))}
              </div>
              <p className="text-xs leading-5 text-slate-500">פרסום וחיבור דומיין אינם פעילים בגרסה הזו. הקוד שנוצר אינו רץ על שרת Bizuply.</p>
            </aside>
            <div className="min-h-[70vh] bg-white">
              {frame ? <iframe title={project.title || "תצוגת האתר"} src={frame} className="h-[80vh] w-full border-0" /> : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
