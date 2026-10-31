import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  History,
  Loader2,
  Send,
  Sparkles,
  Eye,
} from "lucide-react";
import {
  chatAiStudioProject,
  createAiStudioProject,
  getAiStudioProject,
  getAiStudioStatus,
  restoreAiStudioVersion,
  type AiStudioStatus,
} from "../api/aiStudioApi";
import { materializeAiSitePlan, type AiSitePlan } from "../utils/materializeAiSitePlan";
import { createMySite } from "../api/mySitesApi";
import API from "../api";
import BizuplyLoader from "../components/ui/BizuplyLoader";

type ChatRow = { role: "user" | "assistant"; content: string; action?: string; via?: string };

export default function AiStudioPocPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<AiStudioStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState<string>("");
  const [plan, setPlan] = useState<AiSitePlan | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatRow[]>([]);
  const [input, setInput] = useState("צור אתר למכון יופי בשם נווה בסגנון luxury");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [linkedSiteId, setLinkedSiteId] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const st = await getAiStudioStatus(false);
        if (!cancelled) setStatus(st);
      } catch (e: any) {
        if (!cancelled) {
          setStatus({
            success: false,
            enabled: false,
            flagOn: false,
            allowlisted: false,
            publishEnabled: false,
            freeCodePocEnabled: false,
          });
          setError(e?.response?.data?.error || "לא ניתן לטעון סטטוס AI Studio");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const preview = useMemo(() => {
    if (!plan) return null;
    try {
      return materializeAiSitePlan(plan);
    } catch {
      return null;
    }
  }, [plan]);

  async function ensureProject() {
    if (projectId) return projectId;
    const created = await createAiStudioProject({
      title: "AI Studio PoC",
      templateKey: "adion",
      track: "visual_json",
    });
    const id = String(created.project?._id || "");
    setProjectId(id);
    return id;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    try {
      const id = await ensureProject();
      const result = await chatAiStudioProject(id, text);
      setPlan(result.summary ? (result.project?.plan as AiSitePlan) : result.project?.plan || null);
      if (result.project?.plan) setPlan(result.project.plan as AiSitePlan);
      setVersions(result.project?.versions || []);
      setCredits(result.credits?.balance ?? null);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.reply || "",
          action: result.action,
          via: result.via,
        },
      ]);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "שגיאה בשיחה");
    } finally {
      setBusy(false);
    }
  }

  async function saveAsDraftSite() {
    if (!plan || busy) return;
    setBusy(true);
    setError("");
    try {
      const created = await createMySite({
        businessId,
        name: plan.siteName || "AI Studio draft",
        templateKey: "adion",
        templateName: "Adion",
      });
      const siteId = String((created as any)?._id || (created as any)?.id || "");
      if (!siteId) throw new Error("create site failed");
      const materialized = materializeAiSitePlan(plan);
      const home = materialized.pages.find((p) => p.isHome) || materialized.pages[0];
      await API.put("/site-builder/site", {
        businessId,
        siteId,
        name: plan.siteName,
        templateKey: "adion",
        editorMode: "visual-react",
        templateEditorMode: "visual-react",
        published: false,
        status: "draft",
        activePageId: materialized.activePageId,
        pages: materialized.pages,
        data: home?.data,
        templateData: home?.templateData,
        projectData: home?.projectData,
        visualEditorPayload: home?.visualEditorPayload,
        brand: plan.brand,
        seoSettings: plan.seo,
      });
      if (projectId) {
        const { linkAiStudioSite } = await import("../api/aiStudioApi");
        await linkAiStudioSite(projectId, siteId);
      }
      setLinkedSiteId(siteId);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "שמירת טיוטה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function openInStudio() {
    if (!linkedSiteId) {
      await saveAsDraftSite();
    }
    const id = linkedSiteId;
    if (!id) return;
    navigate(`/business/${businessId}/dashboard/website/sites/${id}/edit?template=adion&ai=1`);
  }

  async function onRestore(versionId: string) {
    if (!projectId || busy) return;
    setBusy(true);
    try {
      const result = await restoreAiStudioVersion(projectId, versionId);
      setPlan(result.project?.plan || null);
      setVersions(result.project?.versions || []);
      const refreshed = await getAiStudioProject(projectId);
      setMessages(
        (refreshed.project?.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
          action: m.action,
          via: m.via,
        }))
      );
    } catch (e: any) {
      setError(e?.response?.data?.error || "שחזור נכשל");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <BizuplyLoader />
      </div>
    );
  }

  if (!status?.enabled) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center" dir="rtl">
        <div className="mx-auto mb-4 inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
          בטא
        </div>
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-violet-600" />
        <h1 className="text-2xl font-black text-slate-900">Bizuply AI Studio</h1>
        <p className="mt-3 text-slate-600">
          הבטא סגורה לעסק הזה. כשהיא פתוחה אפשר ליצור טיוטת אתר בשיחה, לשנות צבעים
          ועמודים, ולשמור אותה כדי לפתוח אותה שוב.
        </p>
        <p className="mt-3 text-sm text-slate-500">
          בגרסה הזו אין פרסום אתר, אין תשלום, ואין בניית אפליקציה או SaaS.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-white"
          onClick={() => navigate(`/business/${businessId}/dashboard/website`)}
        >
          חזרה לאתרים
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50" dir="rtl">
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="text-xs font-semibold tracking-wide text-violet-600">
              BIZUPLY AI STUDIO · בטא
            </div>
            <h1 className="text-lg font-black text-slate-900">טיוטת אתר בשיחה</h1>
            <p className="mt-1 max-w-xl text-xs text-slate-500">
              אפשר ליצור טיוטה, לשנות צבעים ועמודים, ולשמור. התצוגה היא מבנה הטיוטה, לא אתר
              מפורסם. פרסום ותשלום סגורים בבטא הזו.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {credits != null && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                ניסיונות בבטא, בלי חיוב: {credits}
              </span>
            )}
            <button
              type="button"
              disabled={!plan || busy}
              onClick={saveAsDraftSite}
              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 disabled:opacity-50"
            >
              שמור טיוטת אתר
            </button>
            <button
              type="button"
              disabled={!plan || busy}
              onClick={openInStudio}
              className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-white disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              פתח ב-Website Studio
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_240px]">
        <section className="flex min-h-[70vh] flex-col rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
            צ׳אט
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500">
                נסו: «צור אתר למכון יופי בשם נווה», «החלף צבעים ל-#7c3aed», «הוסף עמוד מחירים».
              </p>
            )}
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "mr-8 bg-violet-50 text-slate-900"
                    : "ml-8 bg-slate-50 text-slate-800"
                }`}
              >
                <div>{m.content}</div>
                {(m.action || m.via) && (
                  <div className="mt-1 text-[11px] text-slate-400">
                    {m.action} {m.via ? `· ${m.via}` : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
          {error && <div className="px-4 text-sm text-rose-600">{error}</div>}
          <div className="flex gap-2 border-t border-slate-100 p-3">
            <input
              className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="כתבו בקשה בעברית…"
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-violet-700 px-3 py-2 text-white disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              שלח
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800">
            מבנה הטיוטה
          </div>
          <div className="space-y-3 p-4">
            {!plan && (
              <p className="text-sm text-slate-500">האתר יופיע כאן אחרי יצירה בשיחה.</p>
            )}
            {plan && (
              <>
                <div
                  className="rounded-lg p-4 text-white"
                  style={{
                    background: `linear-gradient(120deg, ${plan.palette?.primary || "#4c1d95"}, ${
                      plan.palette?.secondary || "#0ea5e9"
                    })`,
                  }}
                >
                  <div className="text-xs opacity-80">{plan.brand?.tagline || plan.niche}</div>
                  <div className="text-2xl font-black">{plan.siteName}</div>
                </div>
                {(plan.pages || []).map((page) => (
                  <div key={page.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {page.title}
                      {page.isHome ? " · בית" : ""}
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600">
                      {(page.sections || []).map((s, i) => (
                        <li key={`${page.id}-${i}`}>
                          {s.libraryId}
                          {s.content?.title ? ` — ${String(s.content.title)}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {preview && (
                  <p className="text-xs text-slate-400">{preview.pages.length} עמודים בטיוטה</p>
                )}
              </>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-3 text-sm font-semibold">
            <History className="h-4 w-4" />
            גרסאות
          </div>
          <div className="max-h-[70vh] space-y-2 overflow-auto p-3">
            {!versions.length && (
              <p className="text-xs text-slate-500">גרסאות יווצרו אחרי כל שינוי מוצלח.</p>
            )}
            {[...versions].reverse().map((v) => (
              <button
                key={v.versionId}
                type="button"
                onClick={() => void onRestore(v.versionId)}
                className="block w-full rounded-md border border-slate-100 px-2 py-2 text-right text-xs hover:bg-slate-50"
              >
                <div className="font-semibold text-slate-800">{v.label || v.versionId}</div>
                <div className="text-slate-400">{v.versionId}</div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
