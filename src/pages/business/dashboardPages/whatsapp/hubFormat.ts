/** Shared WhatsApp Hub helpers — status badges & Meta field formatting. */

type Translate = (key: string, defaultValue?: string) => string;

function tr(t: Translate | undefined, key: string, fallback: string) {
  return t ? t(key, fallback) : fallback;
}

export function formatQualityRating(raw?: string | null, t?: Translate): string {
  const q = String(raw || "").trim().toUpperCase();
  if (!q) return "";
  if (q === "GREEN" || q === "HIGH") return tr(t, "whatsapp.hub.qualityHigh", "High");
  if (q === "YELLOW" || q === "MEDIUM") return tr(t, "whatsapp.hub.qualityMedium", "Medium");
  if (q === "RED" || q === "LOW") return tr(t, "whatsapp.hub.qualityLow", "Low");
  return raw || "";
}

export function qualityBadgeClass(raw?: string | null): string {
  const q = String(raw || "").trim().toUpperCase();
  if (q === "GREEN" || q === "HIGH") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (q === "YELLOW" || q === "MEDIUM") return "bg-amber-50 text-amber-800 border-amber-100";
  if (q === "RED" || q === "LOW") return "bg-rose-50 text-rose-700 border-rose-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}

export function formatNameStatus(raw?: string | null, t?: Translate): string {
  const s = String(raw || "").trim().toUpperCase();
  if (!s) return "";
  const map: Record<string, [string, string]> = {
    APPROVED: ["whatsapp.hub.approved", "Approved"],
    PENDING_REVIEW: ["whatsapp.hub.pending", "Pending"],
    DECLINED: ["whatsapp.hub.rejected", "Rejected"],
    REJECTED: ["whatsapp.hub.rejected", "Rejected"],
    EXPIRED: ["whatsapp.hub.nameExpired", "Expired"],
    AVAILABLE_WITHOUT_REVIEW: ["whatsapp.hub.nameAvailable", "Available"],
    NONE: ["whatsapp.hub.nameNone", "None"],
  };
  const hit = map[s];
  if (!hit) return raw || "";
  return tr(t, hit[0], hit[1]);
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

export function formatMessagingLimit(raw?: string | null, t?: Translate): string {
  const v = String(raw || "").trim();
  if (!v) return "";
  const upper = v.toUpperCase();
  if (upper.includes("UNLIMITED") || upper === "TIER_UNLIMITED") {
    return tr(t, "whatsapp.hub.unlimited", "Unlimited");
  }
  const tierMatch = upper.match(/TIER_(\d+)\s*([KM])?/);
  if (tierMatch) {
    let n = Number(tierMatch[1]);
    if (tierMatch[2] === "K") n *= 1000;
    if (tierMatch[2] === "M") n *= 1_000_000;
    return `\u200E${n.toLocaleString()} / 24h`;
  }
  const match = upper.match(/(\d[\d,]*)\s*([KM])?/);
  if (match) {
    let n = Number(match[1].replace(/,/g, ""));
    if (match[2] === "K") n *= 1000;
    if (match[2] === "M") n *= 1_000_000;
    // Keep "10,000 / 24h" LTR so RTL pages don't reverse the slash order.
    return `\u200E${n.toLocaleString()} / 24h`;
  }
  return v.replace(/^TIER_/, "").replace(/_/g, " ");
}

export function connectionReadyLabel(
  connected: boolean,
  readyToSend?: boolean,
  readiness?: string,
  t?: Translate
): { status: string; tone: "ok" | "warn" | "bad" | "neutral" } {
  if (!connected) {
    return { status: tr(t, "whatsapp.hub.disconnected", "Disconnected"), tone: "neutral" };
  }
  if (readyToSend || readiness === "ready") {
    return { status: tr(t, "whatsapp.hub.ready", "Ready"), tone: "ok" };
  }
  if (readiness === "error" || readiness === "registration_failed") {
    return { status: tr(t, "whatsapp.hub.issue", "Issue"), tone: "bad" };
  }
  return { status: tr(t, "whatsapp.hub.issue", "Issue"), tone: "warn" };
}

export function toneBadgeClass(tone: "ok" | "warn" | "bad" | "neutral"): string {
  if (tone === "ok") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (tone === "warn") return "bg-amber-50 text-amber-800 border-amber-100";
  if (tone === "bad") return "bg-rose-50 text-rose-700 border-rose-100";
  return "bg-slate-50 text-slate-600 border-slate-100";
}
