import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function SolenneThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f7f3ee", color: "#1d1a17" }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #f7f3ee 15%, transparent 70%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.22em]" style={{ color: "#8b6f5c" }}>{tx("הפקת אירועים")}</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Solenne</h3>
        <p className="mt-2 max-w-[220px] text-xs leading-5 opacity-80">{tx("חתונות ואירועים פרטיים עם קו עיצובי נקי, רגש מדו…")}</p>
      </div>
    </div>
  );
}
