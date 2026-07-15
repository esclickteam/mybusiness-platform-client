import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import API from "../api";
import { createMySite } from "../api/mySitesApi";
import {
  getStudioTemplateSeedById,
} from "../components/site-builder/studio/data/templates";
import {
  buildClientAiSitePlan,
  materializeAiSitePlan,
  type AiSitePlan,
} from "../utils/materializeAiSitePlan";

type WizardAnswers = {
  businessName: string;
  niche: string;
  description: string;
  audience: string;
  style: string;
  tone: string;
  primaryColor: string;
  secondaryColor: string;
  preferredPages: string[];
};

const NICHES = [
  "עסקים ושירותים",
  "נדל״ן",
  "יופי ובריאות",
  "מזון ומסעדות",
  "חינוך וקורסים",
  "פורטפוליו / יצירה",
  "חנות אונליין",
  "אחר",
];

const STYLES = [
  { id: "modern", label: "מודרני ונקי" },
  { id: "luxury", label: "יוקרתי ואלגנטי" },
  { id: "warm", label: "חם וביתי" },
  { id: "bold", label: "נועז וצבעוני" },
  { id: "minimal", label: "מינימליסטי" },
];

const TONES = ["מקצועי", "ידידותי", "יוקרתי", "צעיר ואנרגטי"];

const PAGE_OPTIONS = [
  "ראשי",
  "אודות",
  "שירותים",
  "גלריה",
  "מחירים",
  "המלצות",
  "שאלות נפוצות",
  "צור קשר",
];

const STEPS = ["עסק", "עיצוב", "דפים", "סיכום"] as const;

function randomHex() {
  const hues = ["#0f172a", "#4c1d95", "#0e7490", "#b45309", "#be123c", "#166534"];
  return hues[Math.floor(Math.random() * hues.length)];
}

export default function AiSiteWizardPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const base = `/business/${businessId}/dashboard/website`;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<WizardAnswers>({
    businessName: "",
    niche: NICHES[0],
    description: "",
    audience: "",
    style: "modern",
    tone: TONES[0],
    primaryColor: "",
    secondaryColor: "",
    preferredPages: ["ראשי", "אודות", "שירותים", "צור קשר"],
  });

  const progress = useMemo(
    () => Math.round(((step + 1) / STEPS.length) * 100),
    [step]
  );

  function togglePage(page: string) {
    setAnswers((prev) => {
      const exists = prev.preferredPages.includes(page);
      return {
        ...prev,
        preferredPages: exists
          ? prev.preferredPages.filter((p) => p !== page)
          : [...prev.preferredPages, page],
      };
    });
  }

  function canContinue() {
    if (step === 0) {
      return Boolean(answers.businessName.trim() && answers.niche);
    }
    if (step === 1) return Boolean(answers.style && answers.tone);
    if (step === 2) return answers.preferredPages.length > 0;
    return true;
  }

  async function handleGenerate() {
    if (!businessId) return;

    setSubmitting(true);
    setError("");

    const primary = answers.primaryColor.trim() || randomHex();
    const secondary = answers.secondaryColor.trim() || randomHex();
    const planInput = {
      businessId,
      ...answers,
      primaryColor: primary,
      secondaryColor: secondary,
    };

    let plan: AiSitePlan | null = null;
    let usedLocalFallback = false;
    let stage: "plan" | "materialize" | "create" | "save" = "plan";

    try {
      setStatusText("ה־AI מתכנן עמודים וסקשנים...");
      try {
        const { data } = await API.post(
          "/site-builder/ai/generate-site",
          planInput,
          { timeout: 90000 },
        );
        plan = data?.plan as AiSitePlan;
        if (!plan?.pages?.length) {
          throw new Error(data?.error || "ה־AI לא החזיר מבנה אתר תקף");
        }
      } catch (planErr: any) {
        const serverPlan = planErr?.response?.data?.plan as AiSitePlan | undefined;
        if (serverPlan?.pages?.length) {
          plan = serverPlan;
        } else {
          const status = planErr?.response?.status as number | undefined;
          const isTimeout =
            planErr?.code === "ECONNABORTED" ||
            /timeout/i.test(String(planErr?.message || ""));
          const isNetwork =
            planErr?.message === "Network Error" || !planErr?.response;
          const isTransient =
            isTimeout ||
            isNetwork ||
            status === 404 ||
            status === 408 ||
            status === 502 ||
            status === 503 ||
            status === 504;

          if (isTransient) {
            console.warn(
              "[AiSiteWizard] generate-site failed, using client plan",
              planErr?.message || planErr,
            );
            plan = buildClientAiSitePlan(planInput);
            usedLocalFallback = true;
          } else {
            throw planErr;
          }
        }
      }

      if (!plan?.pages?.length) {
        throw new Error("לא ניתן לבנות מבנה אתר");
      }

      stage = "materialize";
      setStatusText(
        usedLocalFallback
          ? "בונה אתר מהספרייה (מצב מקומי)..."
          : "מרכיב סקשנים אמיתיים מהספרייה...",
      );
      const built = materializeAiSitePlan({
        ...plan,
        hostTemplateKey: "velmora",
        templateKey: "velmora",
      });

      const hostKey = built.hostTemplateKey;
      const localSeed = getStudioTemplateSeedById(hostKey) as any;

      const templateForEditor = {
        ...(localSeed || {}),
        id: hostKey,
        key: hostKey,
        rendererKey: hostKey,
        renderMode: "registry",
        editorMode: "renderer",
        name: plan.siteName || answers.businessName || hostKey,
        aiGenerated: true,
        aiPlan: plan,
        aiFallback: usedLocalFallback,
        palette: {
          ...(localSeed?.palette || {}),
          ...(plan.palette || {}),
        },
      };

      localStorage.setItem("bizuply-selected-template-key", hostKey);
      localStorage.setItem("bizuply-selected-template-id", hostKey);
      localStorage.setItem(
        "bizuply-selected-template-data",
        JSON.stringify(templateForEditor),
      );
      localStorage.setItem("bizuply-ai-site-plan", JSON.stringify(plan));
      localStorage.setItem(
        "bizuply-ai-site-visual",
        JSON.stringify({
          pages: built.pages,
          activePageId: built.activePageId,
          homeVisual: built.homeVisual,
        }),
      );

      stage = "create";
      setStatusText("יוצר את האתר...");
      const site = await createMySite({
        businessId,
        name: plan.siteName || answers.businessName || "האתר שלי",
        templateKey: hostKey,
        templateName: plan.siteName || hostKey,
      });

      if (!site?._id) {
        throw new Error("יצירת האתר נכשלה");
      }

      const homeVisual = built.homeVisual || {};
      const editorUrl = `${base}/sites/${site._id}/edit?template=${encodeURIComponent(hostKey)}&ai=1`;

      stage = "save";
      setStatusText("שומר את התוכן לשרת...");
      try {
        await API.put(
          "/site-builder/site",
          {
            businessId,
            siteId: site._id,
            name: plan.siteName || answers.businessName,
            templateKey: hostKey,
            templateName: plan.siteName || hostKey,
            templateEditorMode: "visual-react",
            editorMode: "visual-react",
            published: false,
            status: "draft",
            seo: plan.seo,
            brand: plan.brand,
            templateData: homeVisual,
            data: homeVisual,
            visualEditorPayload: {
              editorMode: "visual-react",
              templateKey: hostKey,
              data: homeVisual,
              templateData: homeVisual,
              snapshotPageId: built.activePageId,
            },
            projectData: {
              editorMode: "visual-react",
              templateKey: hostKey,
              data: homeVisual,
              templateData: homeVisual,
              activePageId: built.activePageId,
            },
            pages: built.pages,
            activePageId: built.activePageId,
            snapshotPageId: built.activePageId,
          },
          { timeout: 120000 },
        );
      } catch (saveErr: any) {
        // Site exists + visual is in localStorage — open editor anyway
        console.warn(
          "[AiSiteWizard] save failed, opening editor with local visual",
          saveErr?.message || saveErr,
        );
      }

      navigate(editorUrl);
    } catch (err: any) {
      const isTimeout =
        err?.code === "ECONNABORTED" ||
        /timeout/i.test(String(err?.message || ""));
      const isNetwork =
        err?.message === "Network Error" || !err?.response;

      const stageHint =
        stage === "create"
          ? "יצירת האתר"
          : stage === "save"
            ? "שמירת התוכן"
            : stage === "materialize"
              ? "הרכבת הסקשנים"
              : "תכנון האתר";

      setError(
        isTimeout || isNetwork
          ? `בעיית רשת ב${stageHint} — נסו שוב. אם זה ממשיך, בדקו חיבור או התחברות מחדש.`
          : err?.response?.data?.error ||
              err?.message ||
              "יצירת האתר עם AI נכשלה",
      );
    } finally {
      setSubmitting(false);
      setStatusText("");
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f5f6fb] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate(`${base}/create`)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לבחירת שיטה
        </button>

        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">בניית אתר עם AI</h1>
            <p className="mt-1 text-sm text-slate-600">
              ה־AI יבנה עמודים חדשים וסקשנים אמיתיים לפי הצבעים וההגדרות שלכם —
              לא רק בחירת תבנית מוכנה.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              שלב {step + 1} מתוך {STEPS.length}: {STEPS[step]}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <Field label="שם העסק / האתר">
                <input
                  value={answers.businessName}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, businessName: e.target.value }))
                  }
                  className="field"
                  placeholder="לדוגמה: סטודיו נועם"
                />
              </Field>

              <Field label="תחום העסק">
                <select
                  value={answers.niche}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, niche: e.target.value }))
                  }
                  className="field"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="תיאור קצר (אופציונלי)">
                <textarea
                  value={answers.description}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, description: e.target.value }))
                  }
                  className="field min-h-[88px] resize-y"
                  placeholder="מה העסק עושה, למי הוא פונה, מה מייחד אותו..."
                />
              </Field>

              <Field label="קהל יעד (אופציונלי)">
                <input
                  value={answers.audience}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, audience: e.target.value }))
                  }
                  className="field"
                  placeholder="לקוחות פרטיים, עסקים קטנים, משפחות..."
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  סגנון עיצוב מועדף
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({ ...a, style: s.id }))
                      }
                      className={`rounded-xl border px-3 py-3 text-right text-sm font-semibold transition ${
                        answers.style === s.id
                          ? "border-violet-500 bg-violet-50 text-violet-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="טון כתיבה">
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, tone: t }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        answers.tone === t
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="צבע ראשי">
                  <input
                    type="color"
                    value={answers.primaryColor || "#4c1d95"}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        primaryColor: e.target.value,
                      }))
                    }
                    className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                  />
                </Field>
                <Field label="צבע משני">
                  <input
                    type="color"
                    value={answers.secondaryColor || "#0ea5e9"}
                    onChange={(e) =>
                      setAnswers((a) => ({
                        ...a,
                        secondaryColor: e.target.value,
                      }))
                    }
                    className="h-11 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                  />
                </Field>
              </div>
              <p className="text-xs text-slate-500">
                הצבעים יוטמעו בסקשנים שנבנים. אם תשאיר ריק — ה־AI ישלים אוטומטית.
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                אילו עמודים לבנות?
              </p>
              <p className="mb-3 text-xs text-slate-500">
                לכל עמוד ה־AI יבחר סקשנים מהספרייה וימלא תוכן מותאם.
              </p>
              <div className="flex flex-wrap gap-2">
                {PAGE_OPTIONS.map((page) => {
                  const active = answers.preferredPages.includes(page);
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => togglePage(page)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        active
                          ? "bg-violet-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {active ? <Check className="h-3.5 w-3.5" /> : null}
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3 text-sm text-slate-700">
              <SummaryRow label="שם" value={answers.businessName} />
              <SummaryRow label="תחום" value={answers.niche} />
              <SummaryRow
                label="סגנון"
                value={STYLES.find((s) => s.id === answers.style)?.label || ""}
              />
              <SummaryRow label="טון" value={answers.tone} />
              <SummaryRow
                label="עמודים"
                value={answers.preferredPages.join(", ")}
              />
              <p className="rounded-xl bg-violet-50 px-3 py-3 text-xs leading-relaxed text-violet-900">
                ייבנו עמודים חדשים עם סקשנים אמיתיים מהספרייה (Hero, אודות,
                שירותים וכו׳), עם הצבעים שבחרתם, ואז ייפתח העורך לעריכה מלאה.
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {statusText ? (
            <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {statusText}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={step === 0 || submitting}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              הקודם
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
              >
                המשך
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting || !canContinue()}
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {submitting ? "בונה את האתר..." : "בנה אתר עם AI"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .field {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #fff;
          padding: 0.65rem 0.85rem;
          font-size: 0.875rem;
          outline: none;
        }
        .field:focus {
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <span className="w-16 shrink-0 font-semibold text-slate-500">{label}</span>
      <span className="text-slate-800">{value || "—"}</span>
    </div>
  );
}
