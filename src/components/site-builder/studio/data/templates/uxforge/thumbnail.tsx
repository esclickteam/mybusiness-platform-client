import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function UxforgeThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#F3F4F6", color: "#111827", fontFamily: "Miriam Libre, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#111827", color: "#fff" }}>{tx("סוכנות UX/UI")}</div>
        <h3 className="mt-4 text-3xl font-black leading-none">UXForge</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">wireframe craft</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#06B6D4", color: "#fff" }}>128</div>
      </div>
    </div>
  );
}
