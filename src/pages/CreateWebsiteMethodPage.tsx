import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, LayoutTemplate, Sparkles } from "lucide-react";
import { useLocaleDir } from "../hooks/useLocaleDir";

export default function CreateWebsiteMethodPage() {
  const { businessId = "" } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const base = `/business/${businessId}/dashboard/website`;

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#f5f6fb] px-4 py-8 text-start sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(base)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowRight
            className={`h-4 w-4 ${dir === "ltr" ? "rotate-180" : ""}`}
          />
          {t("createWebsite.backToMySites")}
        </button>

        <div className="mb-8">
          <p className="mb-1 text-sm font-medium text-slate-500">
            {t("createWebsite.eyebrow")}
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t("createWebsite.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            {t("createWebsite.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate(`${base}/templates`)}
            className="group rounded-2xl border border-slate-200 bg-white p-6 text-start shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 border border-violet-100/80 text-slate-800 group-hover:text-white">
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {t("createWebsite.template.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t("createWebsite.template.description")}
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-violet-700">
              {t("createWebsite.template.cta")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`${base}/create/ai`)}
            className="group rounded-2xl border border-violet-200 bg-gradient-to-br from-white via-white to-violet-50 p-6 text-start shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:border-violet-200/80 group-hover:from-violet-200/80 group-hover:via-sky-100 group-hover:to-cyan-100 group-hover:text-slate-800">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {t("createWebsite.ai.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t("createWebsite.ai.description")}
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-violet-700">
              {t("createWebsite.ai.cta")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
