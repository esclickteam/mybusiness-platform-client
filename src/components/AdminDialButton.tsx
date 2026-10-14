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
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        requestSoftphoneDial({ phone: value, name, source, refId });
      }}
      title={`חייג אל ${name || value}`}
      aria-label={`חייג אל ${name || value}`}
      className={[
        compact ? "biz-phone-link" : "biz-btn biz-btn-secondary biz-btn-row",
        className,
      ].join(" ")}
    >
      <Phone size={14} strokeWidth={2} />
      {compact ? <span dir="ltr">{value}</span> : label || "חייג"}
    </button>
  );
}
