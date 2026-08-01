export type SoftphoneMode = "voip" | "device";

export type SoftphoneCallStatus =
  | "idle"
  | "connecting"
  | "ringing"
  | "incoming"
  | "in-progress"
  | "ended"
  | "failed";

export type SoftphoneDirection = "outbound" | "inbound";

export type SoftphoneDialRequest = {
  id: string;
  phone: string;
  name?: string;
  source?: string;
  refId?: string;
  at: number;
};

export type SoftphoneActiveCall = {
  logId?: string | null;
  phone: string;
  contactName: string;
  contactSource?: string;
  contactRefId?: string;
  mode: SoftphoneMode;
  direction: SoftphoneDirection;
  status: SoftphoneCallStatus;
  startedAt: number;
  muted: boolean;
  held?: boolean;
  speakerOn?: boolean;
  callSid?: string | null;
  error?: string | null;
};

type SoftphoneState = {
  open: boolean;
  activeCall: SoftphoneActiveCall | null;
  pendingDial: SoftphoneDialRequest | null;
  answerRequestId: string | null;
  rejectRequestId: string | null;
};

type Listener = () => void;

let state: SoftphoneState = {
  open: false,
  activeCall: null,
  pendingDial: null,
  answerRequestId: null,
  rejectRequestId: null,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getAdminSoftphoneState() {
  return state;
}

export function subscribeAdminSoftphone(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setSoftphoneOpen(open: boolean) {
  state = { ...state, open };
  emit();
}

export function toggleSoftphoneOpen() {
  state = { ...state, open: !state.open };
  emit();
}

export function setActiveSoftphoneCall(call: SoftphoneActiveCall | null) {
  state = { ...state, activeCall: call };
  emit();
}

export function patchActiveSoftphoneCall(
  patch: Partial<SoftphoneActiveCall>
) {
  if (!state.activeCall) return;
  state = {
    ...state,
    activeCall: { ...state.activeCall, ...patch },
  };
  emit();
}

export function clearActiveSoftphoneCall() {
  state = {
    ...state,
    activeCall: null,
    answerRequestId: null,
    rejectRequestId: null,
  };
  emit();
}

/** Queue an outbound dial from customer tables / contacts. */
export function requestSoftphoneDial(input: {
  phone?: string | null;
  name?: string;
  source?: string;
  refId?: string;
}) {
  const phone = String(input.phone || "").trim();
  if (!phone) return false;

  state = {
    ...state,
    open: true,
    pendingDial: {
      id: makeId("dial"),
      phone,
      name: String(input.name || "").trim(),
      source: input.source || "manual",
      refId: input.refId || "",
      at: Date.now(),
    },
  };
  emit();
  return true;
}

export function consumePendingSoftphoneDial() {
  const pending = state.pendingDial;
  if (!pending) return null;
  state = { ...state, pendingDial: null };
  emit();
  return pending;
}

/** Present an incoming call (socket / simulate / Twilio). */
export function presentIncomingSoftphoneCall(input: {
  phone: string;
  contactName?: string;
  callSid?: string | null;
  logId?: string | null;
  mode?: SoftphoneMode;
}) {
  const phone = String(input.phone || "").trim();
  if (!phone) return;

  state = {
    ...state,
    open: true,
    activeCall: {
      logId: input.logId || null,
      phone,
      contactName: String(input.contactName || "שיחה נכנסת").trim(),
      contactSource: "manual",
      mode: input.mode || "device",
      direction: "inbound",
      status: "incoming",
      startedAt: Date.now(),
      muted: false,
      held: false,
      speakerOn: true,
      callSid: input.callSid || null,
      error: null,
    },
  };
  emit();
}

export function requestSoftphoneAnswer() {
  state = {
    ...state,
    open: true,
    answerRequestId: makeId("answer"),
  };
  emit();
}

export function requestSoftphoneReject() {
  state = {
    ...state,
    rejectRequestId: makeId("reject"),
  };
  emit();
}

export function consumeSoftphoneAnswerRequest() {
  const id = state.answerRequestId;
  if (!id) return null;
  state = { ...state, answerRequestId: null };
  emit();
  return id;
}

export function consumeSoftphoneRejectRequest() {
  const id = state.rejectRequestId;
  if (!id) return null;
  state = { ...state, rejectRequestId: null };
  emit();
  return id;
}

export function formatCallDuration(totalSec: number) {
  const sec = Math.max(0, Math.floor(totalSec || 0));
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function formatDisplayPhone(phone: string) {
  const raw = String(phone || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+972") && raw.length >= 12) {
    const rest = raw.slice(4);
    return `0${rest.slice(0, 2)}-${rest.slice(2, 5)}-${rest.slice(5)}`;
  }
  return raw;
}
