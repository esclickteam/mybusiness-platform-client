import React from "react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../i18n/localeUtils";

type SitePanelHeroProps = {
  icon: LucideIcon;
  accent: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function SitePanelHero({
  icon: Icon,
  accent,
  title,
  description,
  actions,
}: SitePanelHeroProps) {
  const { i18n } = useTranslation();
  return (
    <div
      dir={getTextDirection(i18n.language)}
      className="overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-l from-violet-50 via-white to-indigo-50/40 p-5 text-start shadow-sm md:p-6"
      style={{ borderColor: `${accent}22` }}
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-start gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            }}
          >
            <Icon size={22} />
          </div>
            <div className="min-w-0 text-start">
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          </div>
        </div>
        {actions ? (
          <div className="flex flex-wrap justify-start gap-2">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}

export function SitePanelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { i18n } = useTranslation();
  return (
    <div
      dir={getTextDirection(i18n.language)}
      className={`rounded-2xl border border-slate-200/80 bg-white p-5 text-start shadow-sm md:p-6 ${className}`}
    >
      {children}
    </div>
  );
}
