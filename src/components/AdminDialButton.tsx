import React from "react";
import { Phone } from "lucide-react";

import { requestSoftphoneDial } from "../utils/adminSoftphoneStore";

type AdminDialButtonProps = {
  phone?: string | null;
  name?: string;
  source?: string;
  refId?: string;
  size?: "sm" | "md";
  label?: string;
  className?: string;
};

export default function AdminDialButton({
  phone,
  name,
  source = "manual",
  refId,
  size = "sm",
  label,
  className = "",
}: AdminDialButtonProps) {
  const value = String(phone || "").trim();
  if (!value) return null;

  const compact = size === "sm";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        requestSoftphoneDial({ phone: value, name, source, refId });
      }}
      title={`חייג אל ${name || value}`}
      aria-label={`חייג אל ${name || value}`}
      className={[
        "inline-flex items-center justify-center gap-1.5 font-black transition hover:-translate-y-0.5 active:scale-95",
        compact
          ? "h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg"
          : "h-10 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 px-3.5 text-xs text-white shadow-md shadow-emerald-500/25 hover:shadow-lg",
        className,
      ].join(" ")}
    >
      <Phone className={compact ? "h-4 w-4" : "h-3.5 w-3.5"} strokeWidth={2.4} />
      {!compact && (label || "חייג")}
    </button>
  );
}
