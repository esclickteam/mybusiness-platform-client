import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function GroomoraThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0C1208", color: "#F7FEE7" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #65A30D55, transparent 42%), linear-gradient(135deg, #151F10, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#65A30D" }}>{tx("טיפוח גברים")}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Oswald\"" }}>Groomora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">{tx("טיפולי פנים, זקן וגבות לגברים שרוצים להיראות מסודרים בלי להפוך את זה לפר…")}</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#65A30D" }} />
      </div>
    </div>
  );
}
