"use client";

import React, { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowLeft, ChevronLeft, Search, Sparkles } from "lucide-react";
import AiAutomationsTab from "../business/dashboardPages/BizUplyTabs/AiAutomationsTab";
import {
  AI_AUTOMATION_CATALOG,
  AI_BILLING_SAFE_MESSAGE,
  getAiTemplateByKey,
  listSupportedAiTemplates,
  searchAiTemplates,
  type AiAutomationTemplate,
  type AiConfigFieldDef,
} from "../business/dashboardPages/automations/aiAutomationCatalog";
import { MixedBidiText } from "../business/dashboardPages/automations/automation-builder/bidiText";

const SECTION_IDS = {
  defaults: "section-templates-default",
  category: "section-ai-category",
  search: "section-ai-search",
  advisor: "section-ai-advisor",
  preview: "section-lead-scoring-preview",
  blueprint: "section-lead-scoring-blueprint",
  drawer: "section-ai-node-drawer",
  hidden: "section-hidden-templates",
  rtl: "section-rtl-mixed",
} as const;

function AiBadge() {
  return (
    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
      AI
    </span>
  );
}

function TemplateCard({ template }: { template: AiAutomationTemplate }) {
  const Icon = (Icons[template.icon as keyof typeof Icons] ||
    Sparkles) as React.ElementType;
  return (
    <article className="flex flex-col rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
        <Icon className="h-5 w-5" />
      </span>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <h3 className="font-black text-slate-900">{template.titleHe}</h3>
        <AiBadge />
      </div>
      <p className="mt-2 flex-1 text-xs font-semibold leading-6 text-slate-600">
        {template.description}
      </p>
      <p className="mt-3 text-[11px] font-semibold leading-5 text-slate-500">
        {AI_BILLING_SAFE_MESSAGE}
      </p>
      <button
        type="button"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-3 text-xs font-black text-white"
      >
        הפעל תבנית
      </button>
    </article>
  );
}

function ConfigFieldMock({ field }: { field: AiConfigFieldDef }) {
  const common =
    "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 disabled:opacity-80";
  const value = field.defaultValue;
  if (field.type === "textarea") {
    return (
      <label className="block">
        <span className="text-xs font-bold text-slate-700">{field.label}</span>
        <textarea
          className={`${common} min-h-[72px]`}
          disabled
          defaultValue={String(value ?? "")}
        />
      </label>
    );
  }
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" disabled defaultChecked={Boolean(value)} />
        {field.label}
      </label>
    );
  }
  if (field.type === "select" || field.type === "multiselect") {
    return (
      <label className="block">
        <span className="text-xs font-bold text-slate-700">{field.label}</span>
        <input
          className={common}
          disabled
          defaultValue={
            Array.isArray(value) ? value.join(", ") : String(value ?? "")
          }
        />
      </label>
    );
  }
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-700">{field.label}</span>
      <input
        className={common}
        type={field.type === "number" ? "number" : "text"}
        disabled
        defaultValue={String(value ?? "")}
      />
    </label>
  );
}

function BlueprintFlow({ template }: { template: AiAutomationTemplate }) {
  const nodes = template.builderBlueprint.nodes;
  return (
    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
      {nodes.map((node, index) => {
        const label =
          (node.data as { label?: string } | undefined)?.label || node.type;
        const actionKey = String(
          (node.data as { actionKey?: string } | undefined)?.actionKey || ""
        );
        const kind =
          node.type === "trigger"
            ? "טריגר"
            : actionKey.startsWith("ai_")
              ? "AI"
              : "התראה";
        return (
          <React.Fragment key={node.id}>
            <div className="min-w-[140px] rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wide text-violet-600">
                {kind}
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">{label}</div>
              <div className="mt-1 text-[10px] font-semibold text-slate-500">
                {node.id}
              </div>
            </div>
            {index < nodes.length - 1 ? (
              <span
                className="inline-flex items-center gap-1 text-slate-400"
                aria-hidden
              >
                <ArrowLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ms-2" />
              </span>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Section({
  id,
  title,
  children,
  note,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  note?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <header className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-xl font-black text-slate-900">{title}</h2>
        {note ? (
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
            {note}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function WorkflowIconFallback() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
      <Icons.Workflow className="h-5 w-5" />
    </span>
  );
}

export default function AiAutomationTemplatesVisualPage() {
  const [query, setQuery] = useState("ליד");
  const supported = useMemo(() => listSupportedAiTemplates(), []);
  const searchResults = useMemo(() => searchAiTemplates(query), [query]);
  const leadScoring = getAiTemplateByKey("ai_lead_scoring");
  const hidden = AI_AUTOMATION_CATALOG.filter(
    (template) => template.supported.endToEnd === false
  );

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <header className="rounded-[28px] border border-violet-200 bg-violet-50 px-5 py-6">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700">
            DEV Visual QA
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            AI Automation Templates — אימות ויזואלי
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
            עמוד פיתוח בלבד לבדיקת תצוגת תבניות AI, חיפוש, יועץ עסקי, blueprint
            ושדות הגדרה. רספונסיבי לטאבלט (~768) ולמובייל (~390).
          </p>
        </header>

        <Section
          id={SECTION_IDS.defaults}
          title="Templates default"
          note="כותרת בסגנון תבניות רגילות (לא AI). שבב AI מופיע כשהתבנית נתמכת."
        >
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <WorkflowIconFallback />
              <h3 className="text-lg font-black text-slate-900">
                תזכורת פגישה ללקוח
              </h3>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              תבנית רגילה ללא שבב AI. כשתבנית AI נתמכת — מופיע לידה שבב{" "}
              <AiBadge />.
            </p>
          </div>
        </Section>

        <Section
          id={SECTION_IDS.category}
          title="AI category"
          note={`רשת כרטיסים מ־listSupportedAiTemplates() — ${supported.length} תבניות`}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {supported.map((template) => (
              <TemplateCard key={template.templateKey} template={template} />
            ))}
          </div>
        </Section>

        <Section
          id={SECTION_IDS.search}
          title="AI search"
          note='סינון באמצעות searchAiTemplates(query); ברירת מחדל: ליד'
        >
          <label className="relative block max-w-md">
            <Search className="pointer-events-none absolute top-1/2 end-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pe-10 ps-3 text-sm font-semibold text-slate-800 outline-none ring-violet-200 focus:ring-2"
              placeholder="חפש תבנית AI..."
              aria-label="חיפוש תבניות AI"
            />
          </label>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            תוצאות עבור &quot;{query}&quot;: {searchResults.length}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {searchResults.map((template) => (
              <TemplateCard key={template.templateKey} template={template} />
            ))}
          </div>
        </Section>

        <Section
          id={SECTION_IDS.advisor}
          title="AI / Business Advisor"
          note="רנדור אמיתי של AiAutomationsTab"
        >
          <AiAutomationsTab businessId="demo" />
        </Section>

        <Section
          id={SECTION_IDS.preview}
          title="Lead Scoring preview"
          note="getAiTemplateByKey('ai_lead_scoring')"
        >
          {leadScoring ? (
            <div className="space-y-3 rounded-[22px] border border-violet-100 bg-violet-50/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black">{leadScoring.titleHe}</h3>
                <AiBadge />
              </div>
              <dl className="grid gap-2 text-sm font-semibold text-slate-700 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">מתחיל כש</dt>
                  <dd>{leadScoring.customerExplanation.startsWhen}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">ה-AI עושה</dt>
                  <dd>{leadScoring.customerExplanation.aiDoes}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">אחר כך</dt>
                  <dd>{leadScoring.customerExplanation.afterwards}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">מערכות</dt>
                  <dd>{leadScoring.customerExplanation.systems.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">estimatedActions</dt>
                  <dd>{leadScoring.customerExplanation.estimatedActions}</dd>
                </div>
              </dl>
              <p className="text-xs font-semibold text-slate-600">
                {AI_BILLING_SAFE_MESSAGE}
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-red-600">
              לא נמצאה תבנית ai_lead_scoring
            </p>
          )}
        </Section>

        <Section
          id={SECTION_IDS.blueprint}
          title="Lead Scoring blueprint"
          note="זרימה אופקית: טריגר → AI → התראה מתוך builderBlueprint"
        >
          {leadScoring ? (
            <BlueprintFlow template={leadScoring} />
          ) : (
            <p className="text-sm font-semibold text-red-600">חסר blueprint</p>
          )}
        </Section>

        <Section
          id={SECTION_IDS.drawer}
          title="AI node drawer fields"
          note="שדות requiredConfiguration של דירוג לידים (mock מושבת)"
        >
          {leadScoring ? (
            <form className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              {leadScoring.requiredConfiguration.map((field) => (
                <div
                  key={field.key}
                  className={
                    field.type === "textarea" ? "sm:col-span-2" : undefined
                  }
                >
                  <ConfigFieldMock field={field} />
                </div>
              ))}
            </form>
          ) : null}
        </Section>

        <Section
          id={SECTION_IDS.hidden}
          title="Hidden templates"
          note="רק כותרות עם endToEnd=false — לא מופיעות בגריד לקוח"
        >
          <ul className="flex flex-wrap gap-2">
            {hidden.map((template) => (
              <li
                key={template.templateKey}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700"
              >
                {template.titleHe}
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-600">
                  מוסתר
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            סה״כ מוסתרות: {hidden.length}
          </p>
        </Section>

        <Section
          id={SECTION_IDS.rtl}
          title="RTL mixed"
          note="MixedBidiText עם עברית + AI + CRM + WhatsApp"
        >
          <MixedBidiText
            as="h3"
            className="text-lg font-black text-slate-900"
            text="דירוג לידים ב-AI ל-CRM ושליחה ב-WhatsApp"
          />
          <p className="mt-2 text-sm font-semibold text-slate-600">
            <MixedBidiText text="תבנית משולבת: AI מנתח ליד ב-CRM ואז שולח התראה ב-WhatsApp." />
          </p>
        </Section>

        <footer className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-xs font-semibold text-slate-500">
          Responsive note: הגרידים עוברים ל־1 עמודה במובייל, 2 בטאבלט (~768),
          ו־3 בדסקטופ. עמוד זה זמין רק ב־import.meta.env.DEV.
        </footer>
      </div>
    </div>
  );
}
