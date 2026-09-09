import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function MasterlyThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0A0A0A", color: "#FAF7F0" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #D4AF3766, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#D4AF37" }}>{tx("מאסטרקלאס")}</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Cinzel\"" }}>Masterly</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">{tx("מאסטרקלאסים בלעדיים עם יוצרים ומנהיגים — עומק, אלגנטיות, ותובנות שלא מ…")}</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#D4AF3755", color: "#D4AF37" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
