import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { browserHostname, resolveApiBaseUrl } from "../apiBaseUrl";

type VersionRow = { versionId: string; label: string; createdAt?: string };
type CodeResult = {
  projectId: string;
  previewToken: string;
  files: Record<string, string>;
  versions: VersionRow[];
  via?: string;
  durationMs?: number;
  versionId?: string;
};

const BRIEF =
  "צור אתר נדל״ן יוקרתי בדובאי בשם AURELIA ESTATES. עמוד בית מקורי עם Hero מלא, טיפוגרפיה גדולה, צבעי פחם שמנת וזהב רך, אנימציית כניסה עדינה ומרווחים צפופים בלי רצועות ריקות. עמוד הנכסים מציג ארבעה נכסי דמו עם סינון לפי אזור, מחיר מרבי ומספר חדרי שינה, והסינון משנה את הרשימה. הוסף מחשבון משכנתה שההחזר החודשי שלו משתנה לפי המחיר, המקדמה, הריבית והשנים. הוסף גלריה שנפתחת ומעבירה בין תמונות. התאם למחשב ולמסך ברוחב 390 פיקסלים. כל התוכן הוא הדגמה.";

function isolatedPreviewUrl(projectId: string, token: string) {
  const base = resolveApiBaseUrl({
    envApiUrl: import.meta.env.VITE_API_URL,
    mode: import.meta.env.MODE,
    hostname: browserHostname(),
  });
  if (!/^https:\/\//.test(base)) return "";
  return `${base}/ai-studio/code-preview/${projectId}?t=${encodeURIComponent(token)}`;
}

export default function AiStudioCodePage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const [brief, setBrief] = useState(BRIEF);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState<CodeResult | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  const previewUrl = useMemo(
    () => (project ? isolatedPreviewUrl(project.projectId, project.previewToken) : ""),
    [project]
  );

  async function createSite() {
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post("/ai-studio/code-projects", { brief }, { timeout: 180000 });
      setProject(data);
      setMessage("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "יצירת האתר נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function sendEdit() {
    if (!project || !message.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { data } = await API.post(
        `/ai-studio/code-projects/${project.projectId}/chat`,
        { message },
        { timeout: 180000 }
      );
      setProject(data);
      setMessage("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "השינוי נכשל");
    } finally {
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
      setProject(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "השחזור נכשל");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100" dir="rtl">
      <div className="border-b border-white/10 px-4 py-4">
        <div className="text-xs font-semibold tracking-wide text-amber-200">AI STUDIO · REACT RUNTIME</div>
        <h1 className="mt-1 text-xl font-black">אתר שנכתב בקוד, בלי תבנית מארחת</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          התצוגה נטענת מדומיין נפרד, בלי עוגיות ההתחברות ובלי גישה לרשת. שרת Bizuply שומר את הקבצים ואינו מריץ אותם.
          העסק הפעיל: {businessId}
        </p>
      </div>
      <div className="grid gap-4 p-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="space-y-3">
          <textarea
            value={brief}
            onChange={(event) => setBrief(event.target.value)}
            className="h-48 w-full rounded-lg border border-white/10 bg-slate-900 p-3 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={createSite}
            className="rounded-md bg-amber-200 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {busy ? "המודל כותב…" : "צור אתר React"}
          </button>
          {project && (
            <>
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="בקשו שינוי בקוד"
                  className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={busy || !message.trim()}
                  onClick={sendEdit}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                >
                  שלח
                </button>
              </div>
              <div className="space-y-2">
                {(project.versions || []).map((version) => (
                  <button
                    key={version.versionId}
                    type="button"
                    disabled={busy}
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
        <section className="min-h-[80vh] rounded-xl border border-white/10 bg-black p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-400">תצוגה מבודדת</div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setViewport("desktop")} className="rounded-md border border-white/10 px-3 py-1 text-xs">
                מחשב
              </button>
              <button type="button" onClick={() => setViewport("mobile")} className="rounded-md border border-white/10 px-3 py-1 text-xs">
                מובייל
              </button>
            </div>
          </div>
          {previewUrl ? (
            <iframe
              key={`${previewUrl}:${project?.versionId || ""}`}
              title="תצוגת האתר המבודדת"
              src={previewUrl}
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              className="mx-auto block h-[80vh] border-0 bg-white"
              style={{ width: viewport === "mobile" ? 390 : "100%" }}
            />
          ) : (
            <p className="p-6 text-sm text-slate-500">האתר יופיע כאן אחרי שהמודל יסיים לכתוב את הקבצים.</p>
          )}
        </section>
      </div>
    </div>
  );
}
