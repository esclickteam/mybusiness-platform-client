import React from "react";
import { MessageCircle } from "lucide-react";

import {
  buildWhatsAppUrl,
  mergeWhatsAppFloatSettings,
  type WhatsAppFloatSettings,
} from "./whatsappFloatUtils";

type WhatsAppFloatWidgetProps = {
  settings?: Partial<WhatsAppFloatSettings> | null;
  mode?: "live" | "editor";
};

export default function WhatsAppFloatWidget({
  settings,
  mode = "live",
}: WhatsAppFloatWidgetProps) {
  const cfg = mergeWhatsAppFloatSettings(settings);
  if (cfg.isActive === false) return null;

  const href = buildWhatsAppUrl(cfg.phone, cfg.message);
  const hideOnMobile = cfg.showOnMobile === false;

  const button = (
    <a
      href={href || undefined}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (!href || mode === "editor") {
          e.preventDefault();
        }
      }}
      aria-label="פתחו שיחה ב-WhatsApp"
      className={`fixed z-[2147483000] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe57] ${
        hideOnMobile ? "hidden sm:flex" : "flex"
      }`}
      style={{ bottom: 24, left: 24 }}
      title={mode === "editor" && !href ? "הזינו מספר WhatsApp בהגדרות" : "WhatsApp"}
    >
      <MessageCircle size={28} strokeWidth={2.2} fill="currentColor" />
    </a>
  );

  return button;
}
