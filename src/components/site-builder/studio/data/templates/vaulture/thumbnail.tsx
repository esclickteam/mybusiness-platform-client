import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";
export default function VaultureThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"#05040388" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"#d4af37" }}>{tx("נדל״ן יוקרה · כסף וזהב")}</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"Cormorant Garamond"', color:"#f5f0e8" }}>Vaulture</h3></div></div>
    </div>
  );
}
