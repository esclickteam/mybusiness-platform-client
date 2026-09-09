import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function SummitopsThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#F0FDFA", color: "#134E4A", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#0F766E" }}>{tx("סוכנות ייעוץ עסקי")}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Summitops</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">Operating Clarity</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-2 py-4 text-center text-[11px] font-black text-white" style={{ background: "#0F766E" }}>70+</div>
        <div className="border px-2 py-4 text-center text-[11px] font-bold" style={{ borderColor: "#0F766E66" }}>rail</div>
      </div>
    </div>
  );
}
