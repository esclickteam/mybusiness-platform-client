import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function CraftoraThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F5F5F4", color: "#1C1917" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #4D7C0F66, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#4D7C0F" }}>{tx("סדנאות אמנות")}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Bitter\"" }}>Craftora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">{tx("סדנאות קרמיקה, ציור, הדפס ועיצוב — באטלייה שקטה עם חומרים אמיתיים.…")}</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#4D7C0F55", color: "#4D7C0F" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
