/**
 * Outbound softphone dial helpers.
 * Telnyx WebRTC reports call progress on `telnyx.notification` (`call.state`),
 * not on `call.on("state")` — that method does not exist on the Call object.
 */

export type OutboundProgress = "connecting" | "ringing" | "in-progress";

export type OutboundTerminal =
  | "completed"
  | "busy"
  | "failed"
  | "no-answer"
  | "canceled";

export type OutboundTelnyxUpdate = {
  status: OutboundProgress | OutboundTerminal;
  terminal: boolean;
  error: string | null;
};

const LIVE_UI_STATUSES = new Set([
  "connecting",
  "ringing",
  "incoming",
  "in-progress",
]);

const ONGOING_TELNYX_STATES = new Set([
  "trying",
  "requesting",
  "ringing",
  "answering",
  "early",
  "active",
  "answered",
  "held",
]);

/** Keep a leading + and dial characters. Never drop a plus the user typed or pasted. */
export function sanitizeDialInput(raw: string) {
  const clean = String(raw || "").replace(/[^\d+*#]/g, "");
  const hasPlus = clean.includes("+");
  const body = clean.replace(/\+/g, "");
  return (hasPlus ? `+${body}` : body).slice(0, 18);
}

/**
 * Normalize a dial string to E.164.
 * A leading + or 00 keeps the country the caller typed.
 * A bare 10-digit NANP number (2109444809) becomes +12109444809.
 * A local 0-prefix is not rewritten to +972.
 */
export function normalizeDialNumber(raw: string) {
  let clean = String(raw || "").trim().replace(/[^\d+]/g, "");
  if (!clean) return "";
  if (clean.startsWith("00")) clean = `+${clean.slice(2)}`;
  if (clean.startsWith("+")) {
    const rest = clean.slice(1).replace(/\D/g, "");
    return rest ? `+${rest}` : "";
  }
  const digits = clean.replace(/\D/g, "");
  if (!digits || digits.startsWith("0")) return "";
  if (digits.startsWith("972")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return "";
}

export function isE164(phone: string) {
  return /^\+[1-9]\d{7,14}$/.test(String(phone || ""));
}

/** Payload passed to TelnyxRTC.newCall. Destination and caller ID are both E.164. */
export function buildTelnyxOutboundInvite(destinationRaw: string, callerRaw: string) {
  const destinationNumber = normalizeDialNumber(destinationRaw);
  const callerNumber = normalizeDialNumber(callerRaw);
  if (!isE164(destinationNumber)) {
    return { ok: false as const, reason: "invalid_destination" as const };
  }
  if (!isE164(callerNumber)) {
    return { ok: false as const, reason: "invalid_caller" as const };
  }
  return {
    ok: true as const,
    invite: {
      destinationNumber,
      callerNumber,
      audio: true as const,
      video: false as const,
    },
  };
}

export function isLiveCallStatus(status: string | null | undefined) {
  return LIVE_UI_STATUSES.has(String(status || ""));
}

/** A Telnyx leg that still owns the line. `new` and terminal states do not. */
export function telnyxLegIsOngoing(state: string | null | undefined) {
  return ONGOING_TELNYX_STATES.has(String(state || "").toLowerCase());
}

export function outboundUpdateFromTelnyxState(
  stateRaw: string,
  causeRaw = "",
  wasAnswered = false
): OutboundTelnyxUpdate | null {
  const state = String(stateRaw || "").toLowerCase();
  const cause = String(causeRaw || "").toLowerCase();

  if (state === "trying" || state === "requesting" || state === "early") {
    return { status: "ringing", terminal: false, error: null };
  }
  if (state === "ringing") {
    return { status: "ringing", terminal: false, error: null };
  }
  if (state === "active" || state === "answered" || state === "held") {
    return { status: "in-progress", terminal: false, error: null };
  }
  if (!["hangup", "destroy", "purge", "done"].includes(state)) {
    return null;
  }

  if (wasAnswered && !cause.includes("fail")) {
    return { status: "completed", terminal: true, error: null };
  }
  if (cause.includes("busy")) {
    return { status: "busy", terminal: true, error: "הקו תפוס. נסו שוב מאוחר יותר." };
  }
  if (
    cause.includes("unallocated") ||
    cause.includes("invalid") ||
    cause.includes("not found")
  ) {
    return {
      status: "failed",
      terminal: true,
      error: "מספר הטלפון אינו תקין לחיוג.",
    };
  }
  if (cause.includes("reject") || cause.includes("forbidden") || cause.includes("decline")) {
    return {
      status: "failed",
      terminal: true,
      error: "השיחה נדחתה. בדקו את המספר היוצא ונסו שוב.",
    };
  }
  if (wasAnswered) {
    return { status: "completed", terminal: true, error: null };
  }
  if (cause.includes("cancel")) {
    return { status: "canceled", terminal: true, error: null };
  }
  if (
    cause.includes("no_answer") ||
    cause.includes("no answer") ||
    cause.includes("originator_cancel")
  ) {
    return {
      status: "no-answer",
      terminal: true,
      error: "אין מענה בצד השני.",
    };
  }
  return {
    status: "failed",
    terminal: true,
    error: "החיוג לא יצא. בדקו את החיבור ואת המספר ונסו שוב.",
  };
}
