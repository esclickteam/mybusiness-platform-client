import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

const EDITOR_CHROME_OFFSET_PX = 72;

export default function AnnouncementBarWidget({
  siteKey = "site",
  settings,
  mode = "live",
}: AnnouncementBarWidgetProps) {
  const cfg = mergeAnnouncementBarSettings(settings);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (mode === "editor" || !cfg.dismissible) {
      setDismissed(false);
      return;
    }
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
  const isEditor = mode === "editor";

  const ui = (
    <div
      dir="rtl"
      data-bizuply-widget="announcement-bar"
      data-bizuply-plugin-runtime="true"
      style={{
        position: "fixed",
        // Sit under the editor chrome so the bar is visible (header z is higher).
        top: isEditor ? EDITOR_CHROME_OFFSET_PX : 0,
        left: 0,
        right: 0,
        zIndex: isEditor ? 2147483090 : 2147483640,
        width: "100%",
        background: cfg.backgroundColor || "#0F172A",
        color: cfg.textColor || "#FFFFFF",
        boxShadow: "0 8px 24px rgba(15,23,42,0.18)",
      }}
    >
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-3 px-10 py-2.5 text-center text-sm font-semibold leading-snug">
        <span>{message}</span>
        {linkUrl ? (
          <a
            href={linkUrl}
            className="underline underline-offset-2 opacity-95 hover:opacity-100"
            style={{ color: "inherit" }}
            onClick={(e) => {
              if (isEditor) e.preventDefault();
            }}
          >
            {linkLabel || "לפרטים"}
          </a>
        ) : null}
        {cfg.dismissible ? (
          <button
            type="button"
            aria-label="סגור"
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
      {isEditor ? (
        <div className="border-t border-white/15 bg-black/20 px-3 py-1 text-center text-[10px] font-bold">
          פס הודעות · תצוגה בעורך
        </div>
      ) : null}
    </div>
  );

  if (typeof document === "undefined") return ui;
  return createPortal(ui, document.body);
}
