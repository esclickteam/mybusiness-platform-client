import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";
export default function SkyholdThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"#080c1088" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"#38bdf8" }}>{tx("מגדלי מגורים · פנטהאוזים")}</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"Syne"', color:"#e8edf5" }}>Skyhold</h3></div></div>
    </div>
  );
}
