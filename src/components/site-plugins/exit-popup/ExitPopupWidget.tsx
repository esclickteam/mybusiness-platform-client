import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { submitPublicSiteLead } from "../../../api/publicSiteLeadsApi";
import {
  markExitPopupSeen,
  mergeExitPopupSettings,
  wasExitPopupSeenRecently,
  type ExitPopupSettings,
} from "./exitPopupUtils";

type ExitPopupWidgetProps = {
  siteKey?: string;
  slug?: string;
  settings?: Partial<ExitPopupSettings> | null;
  mode?: "live" | "editor";
};

export default function ExitPopupWidget({
  siteKey = "site",
  slug = "",
  settings,
  mode = "live",
}: ExitPopupWidgetProps) {
  const cfg = mergeExitPopupSettings(settings);
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

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
      markExitPopupSeen(siteKey);
    };

    const trigger = cfg.trigger || "exit-or-delay";
    let timer: number | undefined;

    if (trigger === "delay" || trigger === "exit-or-delay") {
      const delayMs = Math.max(3, Number(cfg.delaySeconds) || 25) * 1000;
      timer = window.setTimeout(show, delayMs);
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      if (trigger === "delay") return;
      show();
    };

    document.addEventListener("mouseout", onMouseLeave);
    return () => {
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("mouseout", onMouseLeave);
    };
  }, [cfg.delaySeconds, cfg.isActive, cfg.showOncePerDays, cfg.trigger, mode, siteKey]);

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
      data-bizuply-plugin-runtime="true"
      className="fixed inset-0 z-[2147483200] flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={cfg.headline || "פופאפ לידים"}
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
