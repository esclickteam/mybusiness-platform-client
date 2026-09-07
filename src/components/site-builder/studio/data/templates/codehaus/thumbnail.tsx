import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function CodehausThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#020617", color: "#E2E8F0" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #22C55E66, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#22C55E" }}>{tx("בוטקמפ תכנות")}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"JetBrains Mono\"" }}>Codehaus</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">{tx("בוטקמפ מעשי לפולסטאק — פרויקטים אמיתיים, מנטורים מהתעשייה, ופורטפוליו …")}</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#22C55E55", color: "#22C55E" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
