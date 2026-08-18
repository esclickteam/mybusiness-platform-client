import React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function PartnerPageHeader({ eyebrow, title, subtitle, actions }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7C4DFF]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 md:text-[28px]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
