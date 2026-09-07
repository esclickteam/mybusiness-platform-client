import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function PharmoraThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#F0F9FF", color: "#0C4A6E", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #0369A166, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#0369A1", color: "#F0F9FF" }}>{tx("פארם וטיפוח")}</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "IBM Plex Sans, serif" }}>Pharmora</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">{tx("מדף נקי. בחירה ברורה.")}</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {[tx("חנות"), tx("גלריה"), tx("אודות"), "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#0369A155", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
