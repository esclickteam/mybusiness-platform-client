import React from "react";
import { buildWhatsAppUrl } from "../whatsapp-float/whatsappFloatUtils";

type BarSettings = {
  isActive?: boolean;
  showWhatsapp?: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showForm?: boolean;
  showBooking?: boolean;
  phone?: string;
  email?: string;
  whatsappPhone?: string;
};

export default function FloatingContactBarWidget({
  settings,
  fallbackPhone,
  hidesWhatsappFloat,
}: {
  settings?: BarSettings | null;
  fallbackPhone?: string;
  hidesWhatsappFloat?: boolean;
}) {
  const cfg = settings || {};
  if (cfg.isActive === false) return null;
  const phone = String(cfg.phone || fallbackPhone || "").trim();
  const wa = buildWhatsAppUrl(String(cfg.whatsappPhone || phone || ""), "");
  const items = [
    cfg.showWhatsapp !== false && wa
      ? { key: "wa", href: wa, label: "WhatsApp" }
      : null,
    cfg.showPhone !== false && phone
      ? { key: "phone", href: `tel:${phone}`, label: "Call" }
      : null,
    cfg.showEmail !== false && cfg.email
      ? { key: "email", href: `mailto:${cfg.email}`, label: "Email" }
      : null,
    cfg.showForm ? { key: "form", href: "#contact", label: "Form" } : null,
    cfg.showBooking ? { key: "book", href: "/booking", label: "Book" } : null,
  ].filter(Boolean) as Array<{ key: string; href: string; label: string }>;

  if (!items.length) return null;

  return (
    <div
      data-bizuply-widget="floating-contact-bar"
      data-bizuply-plugin="floating-contact-bar"
      data-bizuply-plugin-runtime="true"
      data-hides-whatsapp-float={hidesWhatsappFloat ? "true" : "false"}
      className="fixed inset-x-0 bottom-0 z-[2147482800] flex justify-center gap-2 bg-slate-900/95 px-3 py-2 text-sm text-white"
    >
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          className="rounded-full bg-white/10 px-3 py-1.5 font-semibold"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
