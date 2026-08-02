import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  announcementDismissKey,
  mergeAnnouncementBarSettings,
  type AnnouncementBarSettings,
} from "./announcementBarUtils";

type AnnouncementBarWidgetProps = {
  siteKey?: string;
  settings?: Partial<AnnouncementBarSettings> | null;
  mode?: "live" | "editor";
};

export default function AnnouncementBarWidget({
  siteKey = "site",
  settings,
  mode = "live",
}: AnnouncementBarWidgetProps) {
  const cfg = mergeAnnouncementBarSettings(settings);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (mode === "editor" || !cfg.dismissible) return;
    try {
      setDismissed(localStorage.getItem(announcementDismissKey(siteKey)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [cfg.dismissible, mode, siteKey]);

  if (cfg.isActive === false) return null;
  if (dismissed && mode !== "editor") return null;

  const message = String(cfg.message || "").trim();
  if (!message) return null;

  const linkUrl = String(cfg.linkUrl || "").trim();
  const linkLabel = String(cfg.linkLabel || "").trim();

  return (
    <div
      dir="rtl"
      data-bizuply-widget="announcement-bar"
      data-bizuply-plugin-runtime="true"
      className="fixed top-0 inset-x-0 z-[2147482900] w-full"
      style={{
        background: cfg.backgroundColor || "#0F172A",
        color: cfg.textColor || "#FFFFFF",
      }}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-3 px-10 py-2.5 text-center text-sm font-semibold leading-snug">
        <span>{message}</span>
        {linkUrl ? (
          <a
            href={linkUrl}
            className="underline underline-offset-2 opacity-95 hover:opacity-100"
            style={{ color: "inherit" }}
          >
            {linkLabel || "לפרטים"}
          </a>
        ) : null}
        {cfg.dismissible ? (
          <button
            type="button"
            aria-label="סגירת הודעה"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-1 opacity-80 hover:opacity-100"
            onClick={() => {
              setDismissed(true);
              if (mode === "live") {
                try {
                  localStorage.setItem(announcementDismissKey(siteKey), "1");
                } catch {
                  // ignore
                }
              }
            }}
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
