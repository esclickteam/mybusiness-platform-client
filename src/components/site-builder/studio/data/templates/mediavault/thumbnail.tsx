import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function MediavaultThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#0B1220", color: "#E2E8F0", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#2563EB" }}>{tx("סוכנות מדיה")}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Mediavault</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">Media Intelligence</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-2 py-4 text-center text-[11px] font-black text-white" style={{ background: "#2563EB" }}>₪62M</div>
        <div className="border px-2 py-4 text-center text-[11px] font-bold" style={{ borderColor: "#2563EB66" }}>dashboard</div>
      </div>
    </div>
  );
}
