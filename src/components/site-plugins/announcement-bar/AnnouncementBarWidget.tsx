import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import {
  announcementDismissKey,
  mergeAnnouncementBarSettings,
  type AnnouncementBarSettings,
} from "./announcementBarUtils";
import { observePublicAnnouncementLayout, applyPublicAnnouncementFromBar } from "./publicAnnouncementLayout";

type AnnouncementBarWidgetProps = {
  siteKey?: string;
  settings?: Partial<AnnouncementBarSettings> | null;
  mode?: "live" | "editor";
};

function resolveAnnouncementRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;

  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-bizuply-site="true"], [data-bizuply-public-render-root="true"], [data-template-id], [data-studio-page="true"]'
    )
  );

  if (!candidates.length) return null;

  let best: HTMLElement | null = null;
  let bestDepth = -1;
  for (const el of candidates) {
    const hasHeader = Boolean(
      el.querySelector(
        '[data-section-kind="header"], [data-template-section-type="header"], header'
      )
    );
    if (!hasHeader && best) continue;
    let depth = 0;
    let node: HTMLElement | null = el;
    while (node) {
      depth += 1;
      node = node.parentElement;
    }
    if (hasHeader && depth >= bestDepth) {
      best = el;
      bestDepth = depth;
    } else if (!best && depth >= bestDepth) {
      best = el;
      bestDepth = depth;
    }
  }
  return best;
}

function resolveAnnouncementHost(): HTMLElement | null {
  const root = resolveAnnouncementRoot();
  if (!root) return null;

  let host = root.querySelector<HTMLElement>(
    '[data-bizuply-announcement-host="true"]'
  );
  if (!host) {
    host = document.createElement("div");
    host.setAttribute("data-bizuply-announcement-host", "true");
    host.setAttribute("data-bizuply-plugin-runtime", "true");
    host.style.display = "block";
    host.style.width = "100%";
    host.style.position = "relative";
    host.style.zIndex = "60";
    host.style.flexShrink = "0";
    root.insertBefore(host, root.firstChild);
  }
  return host;
}

export default function AnnouncementBarWidget({
  siteKey = "site",
  settings,
  mode = "live",
}: AnnouncementBarWidgetProps) {
  const cfg = mergeAnnouncementBarSettings(settings);
  const [dismissed, setDismissed] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const isEditor = mode === "editor";
  const message = String(cfg.message || "").trim();
  const visible =
    cfg.isActive !== false && Boolean(message) && (isEditor || !dismissed);

  useEffect(() => {
    if (isEditor || !cfg.dismissible) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(localStorage.getItem(announcementDismissKey(siteKey)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [cfg.dismissible, isEditor, siteKey]);

  useEffect(() => {
    let cancelled = false;
    const mount = () => {
      if (cancelled) return;
      setHost(resolveAnnouncementHost());
    };
    mount();
    const timers = [50, 300, 800, 2000].map((ms) => window.setTimeout(mount, ms));
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [mode, siteKey, cfg.message, cfg.isActive]);

  useLayoutEffect(() => {
    if (!visible) {
      applyPublicAnnouncementFromBar(null);
      return;
    }
    let stop = observePublicAnnouncementLayout(barRef.current);
    const frame = window.requestAnimationFrame(() => {
      stop();
      stop = observePublicAnnouncementLayout(barRef.current);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      stop();
      applyPublicAnnouncementFromBar(null);
    };
  }, [visible, host, message, cfg.backgroundColor]);

  if (!visible || !host) return null;

  const linkUrl = String(cfg.linkUrl || "").trim();
  const linkLabel = String(cfg.linkLabel || "").trim();
  const dir =
    typeof document !== "undefined"
      ? document.documentElement.getAttribute("dir") || "rtl"
      : "rtl";

  const ui = (
    <div
      ref={barRef}
      dir={dir === "ltr" ? "ltr" : "rtl"}
      data-bizuply-widget="announcement-bar"
      data-bizuply-plugin="announcement-bar"
      data-bizuply-plugin-runtime="true"
      style={{
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        width: "100%",
        zIndex: 60,
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
            className="absolute start-3 top-1/2 -translate-y-1/2 rounded p-1 opacity-80 hover:opacity-100"
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
          פס הודעות · מעל ההדר · לא נצמד בגלילה
        </div>
      ) : null}
    </div>
  );

  return createPortal(ui, host);
}
