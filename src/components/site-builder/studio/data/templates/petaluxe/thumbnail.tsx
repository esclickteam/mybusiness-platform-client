import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function PetaluxeThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFF5F9", color: "#4A044E" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #BE185D55, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#BE185D" }}>{tx("יופי לכלות")}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Great Vibes\"" }}>Petaluxe</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">{tx("איפור ושיער לכלות ולמלוות — ניסיון מקדים, לוק שנשאר בתמונות, וליווי רגוע…")}</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#BE185D" }} />
      </div>
    </div>
  );
}
