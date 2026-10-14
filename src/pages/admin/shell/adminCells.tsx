import type { ReactNode } from "react";
import { Phone } from "lucide-react";

import { requestSoftphoneDial } from "../../../utils/adminSoftphoneStore";

export function AdminDash() {
  return <span className="biz-dash">—</span>;
}

export function AdminEllipsis({
  children,
  title,
  muted = false,
  dir,
}: {
  children?: ReactNode;
  title?: string;
  muted?: boolean;
  dir?: "rtl" | "ltr";
}) {
  const text = typeof children === "string" || typeof children === "number" ? String(children) : "";
  if (!text) return <AdminDash />;
  return (
    <span className={muted ? "biz-ellipsis biz-muted" : "biz-ellipsis"} dir={dir} title={title || text}>
      {children}
    </span>
  );
}

export function AdminIdentity({
  name,
  subtitle,
  image,
  fallback,
}: {
  name?: string | null;
  subtitle?: string | null;
  image?: string | null;
  fallback?: string;
}) {
  const label = name?.trim() || "—";
  const initial = (fallback || label).trim().charAt(0) || "•";
  return (
    <div className="biz-identity">
      <span className="biz-identity-logo">
        {image ? <img src={image} alt="" /> : initial}
      </span>
      <span className="biz-identity-copy">
        <strong title={label}>{label}</strong>
        {subtitle ? (
          <small dir="ltr" title={subtitle}>
            {subtitle}
          </small>
        ) : null}
      </span>
    </div>
  );
}

export function AdminPhone({
  phone,
  name,
  source = "manual",
  refId,
}: {
  phone?: string | null;
  name?: string;
  source?: string;
  refId?: string;
}) {
  const value = String(phone || "").trim();
  if (!value) return <AdminDash />;
  return (
    <button
      type="button"
      className="biz-phone-link"
      dir="ltr"
      title={value}
      aria-label={`חייג אל ${name || value}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        requestSoftphoneDial({ phone: value, name, source, refId });
      }}
    >
      <Phone size={14} strokeWidth={2} />
      <span>{value}</span>
    </button>
  );
}

const BADGE_TONE: Record<string, string> = {
  neutral: "",
  success: "is-success",
  warning: "is-warning",
  danger: "is-danger",
  info: "is-info",
};

export function AdminBadge({
  children,
  tone = "neutral",
}: {
  children?: ReactNode;
  tone?: keyof typeof BADGE_TONE | string;
}) {
  const text = typeof children === "string" ? children : undefined;
  if (children == null || children === "") return <AdminDash />;
  return (
    <span className={`biz-badge ${BADGE_TONE[tone] || ""}`} title={text}>
      {children}
    </span>
  );
}

export function formatAdminDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function AdminDateText({ value }: { value?: string | null }) {
  const formatted = formatAdminDate(value);
  if (!formatted) return <AdminDash />;
  return <span className="biz-nowrap">{formatted}</span>;
}

export function formatAdminMoney(amount?: number | null, currency = "ILS") {
  if (amount == null || !Number.isFinite(Number(amount))) return "";
  try {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency,
      maximumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
    }).format(Number(amount));
  } catch {
    return `${amount} ${currency}`;
  }
}

export function AdminMoney({
  amount,
  currency = "ILS",
}: {
  amount?: number | null;
  currency?: string;
}) {
  const formatted = formatAdminMoney(amount, currency);
  if (!formatted) return <AdminDash />;
  return <span className="biz-nowrap">{formatted}</span>;
}
