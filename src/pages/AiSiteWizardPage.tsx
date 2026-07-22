import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";
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
import { useLocaleDir } from "../hooks/useLocaleDir";

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

const NICHE_IDS = [
  "businessServices",
  "realEstate",
  "beauty",
  "food",
  "education",
  "portfolio",
  "ecommerce",
  "other",
] as const;

const STYLE_IDS = ["modern", "luxury", "warm", "bold", "minimal"] as const;

const TONE_IDS = ["professional", "friendly", "luxury", "energetic"] as const;

const PAGE_IDS = [
  "home",
  "about",
  "services",
  "gallery",
  "pricing",
  "testimonials",
  "faq",
  "contact",
] as const;

const STEP_IDS = ["business", "design", "pages", "summary"] as const;

function randomHex() {
  const hues = ["#0f172a", "#4c1d95", "#0e7490", "#b45309", "#be123c", "#166534"];
  return hues[Math.floor(Math.random() * hues.length)];
}

export default function AiSiteWizardPage() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const base = `/business/${businessId}/dashboard/website`;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<WizardAnswers>({
    businessName: "",
    niche: NICHE_IDS[0],
    description: "",
    audience: "",
    style: "modern",
    tone: TONE_IDS[0],
    primaryColor: "",
    secondaryColor: "",
    preferredPages: ["home", "about", "services", "contact"],
  });

  const progress = useMemo(
    () => Math.round(((step + 1) / STEP_IDS.length) * 100),
    [step]
  );

  function labelNiche(id: string) {
    return t(`aiSiteWizard.niches.${id}`);
  }

  function labelStyle(id: string) {
    return t(`aiSiteWizard.styles.${id}`);
  }

  function labelTone(id: string) {
    return t(`aiSiteWizard.tones.${id}`);
  }

  function labelPage(id: string) {
    return t(`aiSiteWizard.pages.${id}`);
  }

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
      businessName: answers.businessName,
      niche: labelNiche(answers.niche),
      description: answers.description,
      audience: answers.audience,
      style: answers.style,
      tone: labelTone(answers.tone),
      primaryColor: primary,
      secondaryColor: secondary,
      preferredPages: answers.preferredPages.map(labelPage),
    };

    let plan: AiSitePlan | null = null;
    let usedLocalFallback = false;
    let stage: "plan" | "materialize" | "create" | "save" = "plan";

    try {
      setStatusText(t("aiSiteWizard.status.planning"));
      try {
        const { data } = await API.post(
          "/site-builder/ai/generate-site",
          planInput,
          { timeout: 90000 },
        );
        plan = data?.plan as AiSitePlan;
        if (!plan?.pages?.length) {
          throw new Error(data?.error || t("aiSiteWizard.errors.invalidPlan"));
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
        throw new Error(t("aiSiteWizard.errors.cannotBuild"));
      }

      stage = "materialize";
      setStatusText(
        usedLocalFallback
          ? t("aiSiteWizard.status.materializeLocal")
          : t("aiSiteWizard.status.materialize"),
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
      setStatusText(t("aiSiteWizard.status.creating"));
      const site = await createMySite({
        businessId,
        name:
          plan.siteName ||
          answers.businessName ||
          t("aiSiteWizard.defaultSiteName"),
        templateKey: hostKey,
        templateName: plan.siteName || hostKey,
      });

      if (!site?._id) {
        throw new Error(t("aiSiteWizard.errors.createFailed"));
      }

      const homeVisual = built.homeVisual || {};
      const editorUrl = `${base}/sites/${site._id}/edit?template=${encodeURIComponent(hostKey)}&ai=1`;

      stage = "save";
      setStatusText(t("aiSiteWizard.status.saving"));
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
          ? t("aiSiteWizard.errors.stageCreate")
          : stage === "save"
            ? t("aiSiteWizard.errors.stageSave")
            : stage === "materialize"
              ? t("aiSiteWizard.errors.stageMaterialize")
              : t("aiSiteWizard.errors.stagePlan");

      setError(
        isTimeout || isNetwork
          ? t("aiSiteWizard.errors.network", { stage: stageHint })
          : err?.response?.data?.error ||
              err?.message ||
              t("aiSiteWizard.errors.generateFailed"),
      );
    } finally {
      setSubmitting(false);
      setStatusText("");
    }
  }

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#f5f6fb] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate(`${base}/create`)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight className="h-4 w-4" />
          {t("aiSiteWizard.back")}
        </button>

        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("aiSiteWizard.title")}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {t("aiSiteWizard.subtitle")}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              {t("aiSiteWizard.stepOf", {
                current: step + 1,
                total: STEP_IDS.length,
                label: t(`aiSiteWizard.steps.${STEP_IDS[step]}`),
              })}
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
              <Field label={t("aiSiteWizard.fields.businessName")}>
                <input
                  value={answers.businessName}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, businessName: e.target.value }))
                  }
                  className="field"
                  placeholder={t("aiSiteWizard.fields.businessNamePlaceholder")}
                />
              </Field>

              <Field label={t("aiSiteWizard.fields.niche")}>
                <select
                  value={answers.niche}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, niche: e.target.value }))
                  }
                  className="field"
                >
                  {NICHE_IDS.map((id) => (
                    <option key={id} value={id}>
                      {labelNiche(id)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t("aiSiteWizard.fields.description")}>
                <textarea
                  value={answers.description}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, description: e.target.value }))
                  }
                  className="field min-h-[88px] resize-y"
                  placeholder={t("aiSiteWizard.fields.descriptionPlaceholder")}
                />
              </Field>

              <Field label={t("aiSiteWizard.fields.audience")}>
                <input
                  value={answers.audience}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, audience: e.target.value }))
                  }
                  className="field"
                  placeholder={t("aiSiteWizard.fields.audiencePlaceholder")}
                />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  {t("aiSiteWizard.fields.style")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STYLE_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({ ...a, style: id }))
                      }
                      className={`rounded-xl border px-3 py-3 text-start text-sm font-semibold transition ${
                        answers.style === id
                          ? "border-violet-500 bg-violet-50 text-violet-900"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {labelStyle(id)}
                    </button>
                  ))}
                </div>
              </div>

              <Field label={t("aiSiteWizard.fields.tone")}>
                <div className="flex flex-wrap gap-2">
                  {TONE_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, tone: id }))}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        answers.tone === id
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {labelTone(id)}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("aiSiteWizard.fields.primaryColor")}>
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
                <Field label={t("aiSiteWizard.fields.secondaryColor")}>
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
                {t("aiSiteWizard.fields.colorsHint")}
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">
                {t("aiSiteWizard.fields.pagesTitle")}
              </p>
              <p className="mb-3 text-xs text-slate-500">
                {t("aiSiteWizard.fields.pagesHint")}
              </p>
              <div className="flex flex-wrap gap-2">
                {PAGE_IDS.map((page) => {
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
                      {labelPage(page)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3 text-sm text-slate-700">
              <SummaryRow
                label={t("aiSiteWizard.summary.name")}
                value={answers.businessName}
                emptyLabel={t("aiSiteWizard.summary.empty")}
              />
              <SummaryRow
                label={t("aiSiteWizard.summary.niche")}
                value={labelNiche(answers.niche)}
                emptyLabel={t("aiSiteWizard.summary.empty")}
              />
              <SummaryRow
                label={t("aiSiteWizard.summary.style")}
                value={labelStyle(answers.style)}
                emptyLabel={t("aiSiteWizard.summary.empty")}
              />
              <SummaryRow
                label={t("aiSiteWizard.summary.tone")}
                value={labelTone(answers.tone)}
                emptyLabel={t("aiSiteWizard.summary.empty")}
              />
              <SummaryRow
                label={t("aiSiteWizard.summary.pages")}
                value={answers.preferredPages.map(labelPage).join(", ")}
                emptyLabel={t("aiSiteWizard.summary.empty")}
              />
              <p className="rounded-xl bg-violet-50 px-3 py-3 text-xs leading-relaxed text-violet-900">
                {t("aiSiteWizard.summary.note")}
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
              {t("aiSiteWizard.buttons.previous")}
            </button>

            {step < STEP_IDS.length - 1 ? (
              <button
                type="button"
                disabled={!canContinue()}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
              >
                {t("aiSiteWizard.buttons.continue")}
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
                {submitting
                  ? t("aiSiteWizard.buttons.generating")
                  : t("aiSiteWizard.buttons.generate")}
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

function SummaryRow({
  label,
  value,
  emptyLabel,
}: {
  label: string;
  value: string;
  emptyLabel: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <span className="w-16 shrink-0 font-semibold text-slate-500">{label}</span>
      <span className="text-slate-800">{value || emptyLabel}</span>
    </div>
  );
}
