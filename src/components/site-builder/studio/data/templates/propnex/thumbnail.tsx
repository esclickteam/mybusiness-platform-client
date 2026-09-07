import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";
export default function PropnexThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="grid h-full min-h-[260px] grid-cols-3 gap-1 p-2" style={{ background:"#f4f6f9" }}><div className="col-span-2 p-2"><p className="text-[10px]" style={{ color:"#2563eb" }}>{tx("סוכנות נדל״ן חכמה")}</p><h3 className="text-2xl font-bold" style={{ fontFamily:'"Space Grotesk"' }}>Propnex</h3></div><div style={{ backgroundImage:"url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="col-span-3 h-6" style={{ background:"#2563eb" }} /></div>
    </div>
  );
}
