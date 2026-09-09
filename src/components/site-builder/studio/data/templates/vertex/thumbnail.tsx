import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function VertexThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#050505", color: "#f5f5f5" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-black" style={{ background: "#00ff88", color: "#050505" }}>
            VE
          </div>
          <span className="text-sm font-bold">Vertex</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#00ff88" }}>
          {tx("ייעוץ טכנולוגי")}</span>
      </div>
      <div className="mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#00ff88" }}>
          {tx("ייעוץ טכנולוגי")}</p>
        <h3 className="max-w-[220px] text-2xl font-black leading-tight">{tx("מערכות שמזנקות קדימה.")}</h3>
        <div className="mt-6 grid grid-cols-3 gap-0 border" style={{ borderColor: "#00ff8833" }}>
          {[["120+", tx("פרויקטים")], ["18", tx("שנים")], ["96%", tx("שביעות")]].map(([n, l]) => (
            <div key={l} className="border px-2 py-3" style={{ borderColor: "#00ff8833" }}>
              <div className="text-sm font-black">{n}</div>
              <div className="text-[9px] opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
