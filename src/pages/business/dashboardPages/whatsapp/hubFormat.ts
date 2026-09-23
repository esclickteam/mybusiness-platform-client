/** Shared WhatsApp Hub helpers — status badges & Meta field formatting. */

export function formatQualityRating(raw?: string | null): string {
  const q = String(raw || "").trim().toUpperCase();
  if (!q) return "";
  if (q === "GREEN" || q === "HIGH") return "High";
  if (q === "YELLOW" || q === "MEDIUM") return "Medium";
  if (q === "RED" || q === "LOW") return "Low";
  return raw || "";
}

export function qualityBadgeClass(raw?: string | null): string {
  const q = String(raw || "").trim().toUpperCase();
  if (q === "GREEN" || q === "HIGH") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (q === "YELLOW" || q === "MEDIUM") return "bg-amber-50 text-amber-800 border-amber-100";
  if (q === "RED" || q === "LOW") return "bg-rose-50 text-rose-700 border-rose-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}

export function formatNameStatus(raw?: string | null): string {
  const s = String(raw || "").trim().toUpperCase();
  if (!s) return "";
  const map: Record<string, string> = {
    APPROVED: "Approved",
    PENDING_REVIEW: "Pending",
    DECLINED: "Rejected",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
    AVAILABLE_WITHOUT_REVIEW: "Available",
    NONE: "None",
  };
  return map[s] || raw || "";
}

export function nameStatusBadgeClass(raw?: string | null): string {
  const s = String(raw || "").trim().toUpperCase();
  if (s === "APPROVED" || s === "AVAILABLE_WITHOUT_REVIEW") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (s === "PENDING_REVIEW") return "bg-amber-50 text-amber-800 border-amber-100";
  if (s === "DECLINED" || s === "REJECTED" || s === "EXPIRED") {
    return "bg-rose-50 text-rose-700 border-rose-100";
  }
  return "bg-slate-50 text-slate-600 border-slate-100";
}

export function formatMessagingLimit(raw?: string | null): string {
  const v = String(raw || "").trim();
  if (!v) return "";
  const upper = v.toUpperCase();
  if (upper.includes("UNLIMITED") || upper === "TIER_UNLIMITED") return "Unlimited";
  const match = v.match(/(\d[\d,]*)/);
  if (match) {
    const n = match[1].replace(/,/g, "");
    return `${Number(n).toLocaleString()} / 24h`;
  }
  return v.replace(/^TIER_/, "").replace(/_/g, " ");
}

export function connectionReadyLabel(
  connected: boolean,
  readyToSend?: boolean,
  readiness?: string
): { status: string; tone: "ok" | "warn" | "bad" | "neutral" } {
  if (!connected) return { status: "Disconnected", tone: "neutral" };
  if (readyToSend || readiness === "ready") return { status: "Ready", tone: "ok" };
  if (readiness === "error" || readiness === "registration_failed") {
    return { status: "Issue", tone: "bad" };
  }
  return { status: "Issue", tone: "warn" };
}

export function toneBadgeClass(tone: "ok" | "warn" | "bad" | "neutral"): string {
  if (tone === "ok") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (tone === "warn") return "bg-amber-50 text-amber-800 border-amber-100";
  if (tone === "bad") return "bg-rose-50 text-rose-700 border-rose-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}
