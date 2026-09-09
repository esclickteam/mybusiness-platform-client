import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function ClothoraThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#FAFAF9", color: "#111827", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #11182766, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#111827", color: "#FFFFFF" }}>{tx("בגדים ואופנה")}</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Bodoni Moda, serif" }}>Clothora</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">{tx("גזרות מדויקות. ארון חי.")}</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {[tx("חנות"), tx("גלריה"), tx("אודות"), "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#11182755", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
