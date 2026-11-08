import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { createMySite } from "../api/mySitesApi";
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
  editorHtml?: string;
  editorCss?: string;
  editorSiteId?: string;
  designGate?: { presentation?: string; customerReady?: boolean; designReview?: boolean } | null;
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
  const [systemNote, setSystemNote] = useState("");
  const opening = useRef(false);

  const building = project?.phase === "planning" || project?.phase === "pages";
  const ready = project?.phase === "ready" && Boolean(project.editorHtml);

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

  useEffect(() => {
    const current = project;
    if (!ready || !current?.editorHtml || !businessId || opening.current) return undefined;
    opening.current = true;
    const editorPath = (siteId: string) => `/business/${businessId}/dashboard/website/sites/${siteId}/edit?template=ai-site&ai=1`;
    async function openEditor() {
      try {
        if (current.editorSiteId) {
          navigate(editorPath(current.editorSiteId));
          return;
        }
        const site = await createMySite({
          businessId,
          name: current.title || "אתר AI",
          templateKey: "ai-site",
          templateName: current.title || "AI",
        });
        if (!site?._id) throw new Error("create");
        const visual = {
          __aiDocument: current.editorHtml,
          __aiCss: current.editorCss || "",
        };
        const homePage = {
          id: "home",
          title: current.title || "ראשי",
          slug: "",
          isHome: true,
          editorMode: "visual-react",
          templateEditorMode: "visual-react",
          templateKey: "ai-site",
          data: visual,
          templateData: visual,
          projectData: { editorMode: "visual-react", templateKey: "ai-site", data: visual, templateData: visual },
          visualEditorPayload: { editorMode: "visual-react", templateKey: "ai-site", data: visual, templateData: visual },
        };
        await API.put("/site-builder/site", {
          businessId,
          siteId: site._id,
          name: current.title || "אתר AI",
          templateKey: "ai-site",
          templateName: current.title || "AI",
          templateEditorMode: "visual-react",
          editorMode: "visual-react",
          published: false,
          status: "draft",
          activePageId: "home",
          pages: [homePage],
          templateData: visual,
          data: visual,
          visualEditorPayload: { editorMode: "visual-react", templateKey: "ai-site", data: visual, templateData: visual },
          projectData: { editorMode: "visual-react", templateKey: "ai-site", data: visual, templateData: visual },
        }, { timeout: 120000 });
        try {
          await API.post(`/ai-studio/code-projects/${current.projectId}/editor-site`, { siteId: site._id }, { timeout: 30000 });
        } catch {
          /* The saved site still opens in the editor when the link is recorded later. */
        }
        navigate(editorPath(site._id));
      } catch (err: any) {
        opening.current = false;
        setError(err?.response?.data?.error || "האתר נבנה, אבל לא הצלחתי לפתוח אותו בעורך.");
      }
    }
    openEditor();
    return undefined;
  }, [ready, project, businessId, navigate]);

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

        {project && (
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
            {ready ? <p className="mt-6 text-sm font-bold text-slate-600">{project.designGate?.presentation === "draft" ? "נפתחת טיוטה בעורך. העיצוב עדיין דורש שיפור." : "הטיוטה נפתחת בעורך. איכות העיצוב ממתינה לבדיקה."}</p> : null}
            <p className="mt-4 max-w-md text-center text-xs leading-5 text-slate-500">פרסום וחיבור דומיין אינם פעילים בגרסה הזו.</p>
          </div>
        )}
      </div>
    </div>
  );
}
