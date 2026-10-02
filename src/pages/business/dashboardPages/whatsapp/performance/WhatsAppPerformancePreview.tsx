import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../i18n/localeUtils";
import { buildPerformanceFixture } from "./performanceFixture";
import { PerformanceToolbar } from "./WhatsAppPerformanceLayout";
import { OverviewBody } from "./WhatsAppPerformanceOverview";
import { MessagesBody } from "./WhatsAppPerformanceMessages";
import { TemplatesBody } from "./WhatsAppPerformanceTemplates";

const SECTIONS = ["overview", "messages", "templates"] as const;

export default function WhatsAppPerformancePreview() {
  const { t, i18n } = useTranslation();
  const view = buildPerformanceFixture();
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("overview");
  const [day, setDay] = useState<string | null>(null);
  const [preset, setPreset] = useState<"7" | "30" | "90" | "custom">("7");

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3 bg-[#F5F7FB] p-3">
      {view.samplePreview ? (
        <p className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          {t("whatsapp.performance.sampleBanner")}
        </p>
      ) : null}
      <PerformanceToolbar
        view={view}
        preset={preset}
        since="2026-09-01"
        until="2026-10-02"
        phoneNumberId=""
        syncing={false}
        onPreset={setPreset}
        onSince={() => undefined}
        onUntil={() => undefined}
        onPhone={() => undefined}
        onRefresh={() => undefined}
        onExport={() => undefined}
      />
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1">
        {SECTIONS.map((value) => (
          <button
            key={value}
            type="button"
            className={[
              "shrink-0 rounded-md px-3 py-2 text-xs font-bold sm:text-sm",
              section === value ? "bg-emerald-50 text-emerald-800" : "text-slate-500",
            ].join(" ")}
            onClick={() => setSection(value)}
          >
            {t(`whatsapp.performance.tabs.${value}`)}
          </button>
        ))}
      </div>
      {section === "overview" ? (
        <OverviewBody view={view} selectedDay={day} onSelectDay={setDay} />
      ) : null}
      {section === "messages" ? (
        <MessagesBody view={view} selectedDay={day} onSelectDay={setDay} />
      ) : null}
      {section === "templates" ? <TemplatesBody view={view} /> : null}
    </div>
  );
}
