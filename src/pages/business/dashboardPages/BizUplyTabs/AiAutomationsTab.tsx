"use client";

import React from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";
import { useLocaleDir } from "@/hooks/useLocaleDir";
import {
  AI_BILLING_SAFE_MESSAGE,
  listSupportedAiTemplates,
} from "../automations/aiAutomationCatalog";

type AiAutomationsTabProps = {
  businessId?: string | null;
};

export default function AiAutomationsTab({ businessId }: AiAutomationsTabProps) {
  const dir = useLocaleDir();
  const templates = listSupportedAiTemplates();
  const basePath = businessId
    ? `/business/${businessId}/dashboard/automations`
    : "/";

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-180px)] rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <header className="rounded-[24px] border border-violet-200 bg-violet-50 px-5 py-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-violet-700" />
          <div>
            <h2 className="text-2xl font-black text-slate-900">אוטומציות AI</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              בחרו תבנית מוכנה והתאימו אותה לעסק שלכם.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold leading-5 text-slate-600">
          היועץ העסקי מנתח וממליץ; כאן מפעילים תהליכים אוטומטיים בבונה האוטומציות.
        </p>
      </header>

      {templates.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-600">
          אין כרגע תבניות AI זמינות להפעלה. נסו שוב בהמשך.
        </div>
      ) : (
        <>
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {AI_BILLING_SAFE_MESSAGE}
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => {
              const Icon = (Icons[template.icon as keyof typeof Icons] ||
                Sparkles) as React.ElementType;
              return (
                <article
                  key={template.templateKey}
                  className="flex flex-col rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 flex items-center gap-2">
                    <h3 className="font-black text-slate-900">
                      {template.titleHe}
                    </h3>
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-black text-violet-700">
                      AI
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-xs font-semibold leading-6 text-slate-600">
                    {template.description}
                  </p>
                  <Link
                    to={`${basePath}?recipe=${template.recipeKey}&configureAi=1`}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-3 text-xs font-black text-white hover:bg-violet-700"
                  >
                    הפעל תבנית
                  </Link>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
