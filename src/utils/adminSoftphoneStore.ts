export type SoftphoneMode = "voip" | "device";

export type SoftphoneCallStatus =
  | "idle"
  | "connecting"
  | "ringing"
  | "in-progress"
  | "ended"
  | "failed";

export type SoftphoneActiveCall = {
  logId?: string | null;
  phone: string;
  contactName: string;
  contactSource?: string;
  contactRefId?: string;
  mode: SoftphoneMode;
  status: SoftphoneCallStatus;
  startedAt: number;
  muted: boolean;
  error?: string | null;
};

type SoftphoneState = {
  open: boolean;
  activeCall: SoftphoneActiveCall | null;
};

type Listener = () => void;

let state: SoftphoneState = {
  open: false,
  activeCall: null,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
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
  state = { ...state, activeCall: null };
  emit();
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
