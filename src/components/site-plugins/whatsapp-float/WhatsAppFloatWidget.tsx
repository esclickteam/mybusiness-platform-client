import React from "react";
import { MessageCircle } from "lucide-react";

import {
  buildWhatsAppUrl,
  mergeWhatsAppFloatSettings,
  type WhatsAppFloatSettings,
} from "./whatsappFloatUtils";

type WhatsAppFloatWidgetProps = {
  settings?: Partial<WhatsAppFloatSettings> | null;
  fallbackPhone?: string;
  mode?: "live" | "editor";
};

export default function WhatsAppFloatWidget({
  settings,
  fallbackPhone = "",
  mode = "live",
}: WhatsAppFloatWidgetProps) {
  const cfg = mergeWhatsAppFloatSettings(settings);
  if (cfg.isActive === false) return null;

  const phone = String(cfg.phone || "").trim() || String(fallbackPhone || "").trim();
  const href = buildWhatsAppUrl(phone, cfg.message);
  const hideOnMobile = cfg.showOnMobile === false;
  const missingPhone = !href;

  return (
    <div
      className={`fixed z-[2147483000] ${hideOnMobile ? "hidden sm:block" : "block"}`}
      style={{ bottom: 24, left: 24 }}
      data-bizuply-widget="whatsapp-float"
    >
      <a
        href={href || undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!href) {
            e.preventDefault();
            return;
          }
          // Allow opening WhatsApp in editor for a quick sanity check.
        }}
        aria-label="פתחו שיחה ב-WhatsApp"
        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 ${
          missingPhone ? "bg-slate-400 cursor-not-allowed" : "bg-[#25D366] hover:bg-[#1ebe57]"
        }`}
        title={
          missingPhone
            ? "הזינו מספר WhatsApp בהגדרות התוסף"
            : "WhatsApp"
        }
      >
        <MessageCircle size={28} strokeWidth={2.2} fill="currentColor" />
        {missingPhone && mode === "editor" ? (
          <span className="absolute -top-2 -right-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-white shadow">
            מספר?
          </span>
        ) : null}
      </a>
    </div>
  );
}
