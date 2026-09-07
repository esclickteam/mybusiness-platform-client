import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function NailoraThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFF8FA", color: "#3D1F2E" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #FF4D8D55, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#FF4D8D" }}>{tx("סלון ציפורניים")}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Fredoka\"" }}>Nailora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">{tx("מניקור, פדיקור ונייל־ארט מדויק — סטייל מתוק, היגיינה ברזל, ותורים בלי המ…")}</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#FF4D8D" }} />
      </div>
    </div>
  );
}
