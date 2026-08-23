import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { submitPublicSiteLead } from "../../../api/publicSiteLeadsApi";
import { postPublicSiteEvent } from "../../../api/publicSiteRuntimeApi";
import {
  markExitPopupSeen,
  mergeExitPopupSettings,
  wasExitPopupSeenRecently,
  type ExitPopupSettings,
} from "./exitPopupUtils";
import { matchesDeviceTarget, matchesPageTarget } from "../whatsapp-float/whatsappFloatUtils";

type ExitPopupWidgetProps = {
  siteKey?: string;
  slug?: string;
  pageId?: string;
  settings?: Partial<ExitPopupSettings> | null;
  mode?: "live" | "editor";
};

export default function ExitPopupWidget({
  siteKey = "site",
  slug = "",
  pageId = "",
  settings,
  mode = "live",
}: ExitPopupWidgetProps) {
  const cfg = useMemo(() => mergeExitPopupSettings(settings), [settings]);
  const [open, setOpen] = useState(mode === "editor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "editor" || cfg.isActive === false) return;
    if (wasExitPopupSeenRecently(siteKey, cfg.showOncePerDays)) return;
    if (!matchesPageTarget(cfg.pageTargeting, pageId)) return;
    if (!matchesDeviceTarget(cfg.deviceTargeting)) return;
    if (cfg.schedule?.enabled) {
      const now = Date.now();
      const start = cfg.schedule.startAt ? Date.parse(cfg.schedule.startAt) : 0;
      const end = cfg.schedule.endAt ? Date.parse(cfg.schedule.endAt) : Number.POSITIVE_INFINITY;
      if (now < start || now > end) return;
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      markExitPopupSeen(siteKey);
      void postPublicSiteEvent(slug, {
        eventType: "popup_impression",
        pagePath: window.location.pathname,
        source: "exit-popup",
      });
    };

    const trigger = cfg.trigger || "exit-or-delay";
    let timer: number | undefined;
    const delaySeconds = Number(cfg.delaySeconds);
    const hasDelay = Number.isFinite(delaySeconds) && delaySeconds > 0;

    if (trigger === "delay" && hasDelay) {
      timer = window.setTimeout(show, delaySeconds * 1000);
    } else if (trigger === "delay") {
      timer = window.setTimeout(show, 25000);
    } else if (trigger === "exit-or-delay" && hasDelay) {
      timer = window.setTimeout(show, delaySeconds * 1000);
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      if (trigger === "delay" || trigger === "scroll") return;
      show();
    };

    const onScroll = () => {
      if (trigger !== "scroll" && trigger !== "exit-or-delay") return;
      const percent = Number(cfg.scrollPercent) || 0;
      if (percent <= 0) return;
      const doc = document.documentElement;
      const scrolled = (window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= percent) show();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mouseout", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, [cfg, mode, pageId, siteKey, slug]);

  if (cfg.isActive === false || !open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!String(name).trim()) {
      setError("נא למלא שם");
      return;
    }
    if (cfg.requirePhone && !String(phone).trim()) {
      setError("נא למלא טלפון");
      return;
    }
    if (mode === "editor") {
      setDone(true);
      return;
    }

    setSubmitting(true);
    try {
      await submitPublicSiteLead(slug, {
        formId: "exit-popup",
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: String(email).trim(),
        message: "ליד מפופאפ לידים",
        pagePath: typeof window !== "undefined" ? window.location.pathname : "",
      });
      setDone(true);
      void postPublicSiteEvent(slug, {
        eventType: "popup_conversion",
        pagePath: typeof window !== "undefined" ? window.location.pathname : "",
        source: "exit-popup",
      });
    } catch {
      setError("שליחה נכשלה — נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      dir="rtl"
      data-bizuply-widget="exit-popup"
      data-bizuply-plugin="exit-popup"
      data-bizuply-plugin-runtime="true"
      className="fixed inset-0 z-[2147483200] flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={cfg.headline || "פופאפ לידים"}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          aria-label="סגירה"
          className="absolute left-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          onClick={() => setOpen(false)}
        >
          <X size={18} />
        </button>

        {done ? (
          <p className="m-0 py-8 text-center text-base font-semibold text-slate-800">
            {cfg.successMessage}
          </p>
        ) : (
          <>
            <h2 className="m-0 text-xl font-bold text-slate-900">
              {cfg.headline}
            </h2>
            {cfg.subheadline ? (
              <p className="mt-2 text-sm text-slate-600">{cfg.subheadline}</p>
            ) : null}
            <form className="mt-5 space-y-3" onSubmit={onSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם מלא"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="טלפון"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="אימייל (אופציונלי)"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
              {error ? (
                <p className="m-0 text-xs font-medium text-red-600">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ background: cfg.accentColor || "#EF4444" }}
                onClick={() => {
                  if (!slug) return;
                  fetch(`/api/site-builder/public/${encodeURIComponent(slug)}/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      eventType: "popup_click",
                      pagePath: window.location.pathname,
                      source: "exit-popup",
                    }),
                  }).catch(() => undefined);
                }}
              >
                {submitting ? "שולח..." : cfg.ctaLabel || "שלחו"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
