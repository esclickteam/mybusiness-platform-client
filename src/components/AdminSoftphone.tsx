import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Delete,
  Grid3X3,
  History,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Play,
  Search,
  Volume2,
  VolumeX,
  UserRound,
  X,
  BellRing,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import API from "../api";
import { useAuth } from "../context/AuthContext";
import {
  ADMIN_FLOATING_PANEL_CLASS,
  ADMIN_MOBILE_BACKDROP_CLASS,
} from "../utils/adminResponsive";
import {
  clearActiveSoftphoneCall,
  consumePendingSoftphoneDial,
  consumeSoftphoneAnswerRequest,
  consumeSoftphoneRejectRequest,
  formatCallDuration,
  formatDisplayPhone,
  getAdminSoftphoneState,
  patchActiveSoftphoneCall,
  presentIncomingSoftphoneCall,
  requestSoftphoneAnswer,
  requestSoftphoneReject,
  setActiveSoftphoneCall,
  setSoftphoneOpen,
  subscribeAdminSoftphone,
  toggleSoftphoneOpen,
  type SoftphoneMode,
} from "../utils/adminSoftphoneStore";
import { startHoldMusic, stopHoldMusic } from "../utils/softphoneHoldMusic";

type SoftphoneTab = "dial" | "contacts" | "history";

type SoftphoneContact = {
  id: string;
  name: string;
  phone: string;
  subtitle?: string;
  source: string;
  refId?: string;
};

type SoftphoneCallLog = {
  _id: string;
  toNumber: string;
  fromNumber?: string;
  contactName?: string;
  contactSource?: string;
  direction?: "outbound" | "inbound";
  status: string;
  mode?: SoftphoneMode;
  durationSec?: number;
  createdAt?: string;
};

type SoftphoneProvider = "telnyx" | "twilio" | "none";

type SoftphoneStatus = {
  mode: SoftphoneMode;
  voipReady: boolean;
  provider?: SoftphoneProvider;
  callerId?: string | null;
  message?: string;
};

type SoftphoneAuthPayload = {
  provider?: SoftphoneProvider;
  authType?: string;
  token?: string;
  login?: string;
  username?: string;
  password?: string;
  connectionId?: string;
  callerNumber?: string;
  fromNumber?: string;
  callerId?: string;
};

/** Normalize Israeli / international dial input to E.164 for Telnyx. */
function normalizeDialNumber(raw: string) {
  let clean = String(raw || "").trim().replace(/[^\d+]/g, "");
  if (!clean) return "";
  if (clean.startsWith("00")) clean = `+${clean.slice(2)}`;
  if (clean.startsWith("+")) {
    const rest = clean.slice(1).replace(/\D/g, "");
    return rest ? `+${rest}` : "";
  }
  const digits = clean.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("972")) return `+${digits}`;
  if (digits.startsWith("0") && digits.length >= 9) {
    return `+972${digits.slice(1)}`;
  }
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return digits;
}

const KEYPAD: Array<{ digit: string; letters: string }> = [
  { digit: "1", letters: "" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
  { digit: "*", letters: "" },
  { digit: "0", letters: "+" },
  { digit: "#", letters: "" },
];

const SOURCE_LABEL: Record<string, string> = {
  customer: "לקוח",
  "early-access": "הרשמה מוקדמת",
  user: "משתמש",
  business: "עסק",
  manual: "ידני",
};

function useSoftphoneState() {
  return useSyncExternalStore(
    subscribeAdminSoftphone,
    getAdminSoftphoneState,
    getAdminSoftphoneState
  );
}

function statusTone(status: string) {
  if (status === "completed" || status === "in-progress") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }
  if (status === "failed" || status === "busy" || status === "canceled") {
    return "bg-rose-50 text-rose-700 ring-rose-100";
  }
  if (status === "no-answer" || status === "ringing") {
    return "bg-amber-50 text-amber-700 ring-amber-100";
  }
  return "bg-slate-50 text-slate-600 ring-slate-100";
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    initiated: "הותחל",
    ringing: "מצלצל",
    "in-progress": "בשיחה",
    completed: "הושלם",
    busy: "תפוס",
    failed: "נכשל",
    canceled: "בוטל",
    "no-answer": "לא נענה",
  };
  return map[status] || status;
}

function ActionButton({
  label,
  onClick,
  tone = "slate",
  active = false,
  disabled = false,
  size = "md",
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "slate" | "emerald" | "rose" | "amber" | "violet";
  active?: boolean;
  disabled?: boolean;
  size?: "md" | "lg" | "xl";
  children: React.ReactNode;
}) {
  const tones = {
    slate: active
      ? "bg-slate-800 text-white shadow-slate-800/25"
      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    emerald:
      "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/30 hover:brightness-105",
    rose: "bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-rose-500/30 hover:brightness-105",
    amber: active
      ? "bg-amber-500 text-white shadow-amber-500/30"
      : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
    violet: active
      ? "bg-[#7C4DFF] text-white shadow-[#7C4DFF]/30"
      : "bg-[#F3EEFF] text-[#7C4DFF] border border-violet-200 hover:bg-violet-100",
  } as const;

  const sizes = {
    md: "h-14 w-14 rounded-2xl",
    lg: "h-16 w-16 rounded-[22px]",
    xl: "h-[76px] w-[76px] rounded-[28px]",
  } as const;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 disabled:opacity-40"
    >
      <span
        className={[
          "inline-flex items-center justify-center shadow-lg transition hover:-translate-y-0.5 active:scale-95",
          tones[tone],
          sizes[size],
        ].join(" ")}
      >
        {children}
      </span>
      <span className="text-[11px] font-black text-slate-600">{label}</span>
    </button>
  );
}

let voipProvider: SoftphoneProvider = "none";
let twilioDevice: any = null;
let twilioCall: any = null;
let pendingIncomingTwilioCall: any = null;
let twilioIncomingBound = false;
let telnyxClient: any = null;
let telnyxCall: any = null;
let pendingIncomingTelnyxCall: any = null;
let telnyxIncomingBound = false;
let telnyxReady = false;
let mutedBeforeHold = false;
/** True only after the user taps ענה in the softphone UI (not via notification open). */
let userAcceptedIncoming = false;
let remoteAudioEl: HTMLAudioElement | null = null;

function ensureRemoteAudioElement() {
  if (typeof document === "undefined") return null;
  if (remoteAudioEl) return remoteAudioEl;
  const existing = document.getElementById(
    "bizuply-softphone-remote-audio"
  ) as HTMLAudioElement | null;
  if (existing) {
    remoteAudioEl = existing;
    return remoteAudioEl;
  }
  const audio = document.createElement("audio");
  audio.id = "bizuply-softphone-remote-audio";
  audio.autoplay = true;
  audio.setAttribute("playsinline", "true");
  // Keep in DOM (not display:none) — some browsers block playback otherwise.
  audio.style.cssText =
    "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;bottom:0;";
  document.body.appendChild(audio);
  remoteAudioEl = audio;
  return audio;
}

function getTelnyxCallMediaOptions() {
  const remoteElement = ensureRemoteAudioElement();
  return {
    audio: true,
    video: false,
    ...(remoteElement ? { remoteElement } : {}),
  };
}

async function attachTelnyxRemoteAudio(call: any) {
  const audio = ensureRemoteAudioElement();
  if (!audio || !call) return;
  try {
    const stream =
      call.remoteStream instanceof MediaStream
        ? call.remoteStream
        : call.remoteStream?.stream instanceof MediaStream
          ? call.remoteStream.stream
          : null;

    if (stream) {
      audio.srcObject = stream;
    }

    audio.muted = false;
    audio.volume = 1;
    audio.autoplay = true;
    await audio.play().catch(() => {});

    // Retry once — remote tracks sometimes arrive a moment after answer.
    window.setTimeout(() => {
      try {
        const later =
          call.remoteStream instanceof MediaStream ? call.remoteStream : null;
        if (later && audio.srcObject !== later) {
          audio.srcObject = later;
        }
        void audio.play().catch(() => {});
      } catch {
        /* ignore */
      }
    }, 400);
  } catch {
    /* ignore */
  }
}

async function showIncomingCallNotification(opts: {
  fromNumber: string;
  contactName?: string;
  callSid?: string | null;
  callId?: string | null;
}) {
  if (typeof window === "undefined" || typeof Notification === "undefined") {
    return;
  }

  try {
    if (Notification.permission === "default") {
      await Notification.requestPermission().catch(() => "denied");
    }
    if (Notification.permission !== "granted") return;

    const from = opts.fromNumber || "שיחה נכנסת";
    const title = "שיחה נכנסת";
    const body = opts.contactName
      ? `${opts.contactName} · ${from}`
      : from;
    const tag = opts.callSid
      ? `softphone-${opts.callSid}`
      : `softphone-in-${String(opts.fromNumber || "call").replace(/\D/g, "")}`;

    const reg = await navigator.serviceWorker?.ready?.catch?.(() => null);
    const payload = {
      body,
      icon: "/android-chrome-192x192.png",
      badge: "/favicon-v2.png",
      tag,
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 120, 300, 120, 300],
      actions: [
        { action: "open", title: "פתח" },
        { action: "dismiss", title: "דחה" },
      ],
      data: {
        url: `/admin/dashboard?softphone=incoming&from=${encodeURIComponent(from)}`,
        kind: "softphone-incoming",
        softphoneAction: "open",
        fromNumber: from,
        contactName: opts.contactName || "",
        callSid: opts.callSid || "",
        callId: opts.callId || "",
      },
      dir: "rtl" as const,
      lang: "he",
    };

    if (reg?.showNotification) {
      await reg.showNotification(`BizUply · ${title}`, payload);
      return;
    }

    // Fallback without action buttons
    new Notification(`BizUply · ${title}`, {
      body,
      tag,
      requireInteraction: true,
    });
  } catch {
    /* ignore notification failures */
  }
}

async function fetchSoftphoneAuth(): Promise<SoftphoneAuthPayload> {
  const res = await API.get("/admin/softphone/token");
  return (res.data || {}) as SoftphoneAuthPayload;
}

async function ensureTwilioDevice(token: string) {
  const mod = await import("@twilio/voice-sdk");
  const Device = mod.Device;
  if (twilioDevice) {
    await twilioDevice.updateToken(token);
    return twilioDevice;
  }
  twilioDevice = new Device(token, {
    codecPreferences: [mod.Call.Codec.Opus, mod.Call.Codec.PCMU],
    closeProtection: true,
  });
  await twilioDevice.register();
  return twilioDevice;
}

async function ensureTelnyxClient(auth: SoftphoneAuthPayload) {
  if (telnyxClient && telnyxReady) return telnyxClient;

  const telnyxModule = await import("@telnyx/webrtc");
  const TelnyxRTC =
    (telnyxModule as any).TelnyxRTC || (telnyxModule as any).default;
  if (!TelnyxRTC) {
    throw new Error("TelnyxRTC SDK not found");
  }

  if (telnyxClient) {
    try {
      telnyxClient.disconnect?.();
    } catch {
      /* ignore */
    }
    telnyxClient = null;
    telnyxReady = false;
    telnyxIncomingBound = false;
  }

  const login = auth.login || auth.username;
  const password = auth.password;
  if (!login || !password) {
    throw new Error("Telnyx WebRTC credentials missing");
  }

  const client = new TelnyxRTC({ login, password });

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error("Telnyx WebRTC connection timeout"));
    }, 15000);

    client.on?.("telnyx.ready", () => {
      window.clearTimeout(timeout);
      telnyxReady = true;
      resolve();
    });

    client.on?.("telnyx.error", (...args: any[]) => {
      window.clearTimeout(timeout);
      telnyxReady = false;
      reject(args?.[0] || new Error("Telnyx WebRTC error"));
    });

    client.on?.("telnyx.socket.close", () => {
      telnyxReady = false;
    });

    client.on?.("telnyx.notification", (notification: any) => {
      const call = notification?.call || null;
      if (!call) return;

      const state = String(call.state || notification?.state || "").toLowerCase();
      const direction = String(
        call.direction ||
          notification?.direction ||
          notification?.call?.direction ||
          ""
      ).toLowerCase();

      const isInbound =
        direction === "inbound" ||
        direction === "incoming" ||
        Boolean(call.options?.remoteCallerNumber);

      if (isInbound && (state === "ringing" || state === "new")) {
        userAcceptedIncoming = false;
        pendingIncomingTelnyxCall = call;
        const from =
          call.options?.remoteCallerNumber ||
          call.options?.callerNumber ||
          notification?.callerNumber ||
          "שיחה נכנסת";
        const callSid = call.id || call.options?.callID || null;

        presentIncomingSoftphoneCall({
          phone: from,
          contactName: "שיחה נכנסת",
          callSid,
          mode: "voip",
        });
        setSoftphoneOpen(true);
        void showIncomingCallNotification({
          fromNumber: from,
          contactName: "שיחה נכנסת",
          callSid,
        });
      }

      if (
        (telnyxCall === call || pendingIncomingTelnyxCall === call) &&
        (state === "active" || state === "answered")
      ) {
        // Never mark answered unless the user pressed ענה in the softphone UI.
        if (!userAcceptedIncoming) {
          return;
        }
        telnyxCall = call;
        void attachTelnyxRemoteAudio(call);
        const current = getAdminSoftphoneState().activeCall;
        if (current && current.status !== "in-progress") {
          patchActiveSoftphoneCall({
            status: "in-progress",
            startedAt: current.startedAt || Date.now(),
          });
        }
      }

      if (
        ["hangup", "destroy", "purge", "done"].includes(state) &&
        (pendingIncomingTelnyxCall === call || telnyxCall === call)
      ) {
        if (pendingIncomingTelnyxCall === call) {
          pendingIncomingTelnyxCall = null;
        }
        if (telnyxCall === call) {
          telnyxCall = null;
        }
        userAcceptedIncoming = false;
        const current = getAdminSoftphoneState().activeCall;
        if (
          current &&
          ["incoming", "ringing", "connecting", "in-progress"].includes(
            current.status
          )
        ) {
          clearActiveSoftphoneCall();
        }
      }
    });
    telnyxIncomingBound = true;

    telnyxClient = client;
    client.connect?.();
  });

  return telnyxClient;
}

function hangupActiveVoipCall() {
  try {
    pendingIncomingTwilioCall?.reject?.();
  } catch {
    /* ignore */
  }
  try {
    twilioCall?.disconnect?.();
  } catch {
    /* ignore */
  }
  try {
    pendingIncomingTelnyxCall?.hangup?.();
  } catch {
    /* ignore */
  }
  try {
    telnyxCall?.hangup?.();
  } catch {
    /* ignore */
  }
  pendingIncomingTwilioCall = null;
  twilioCall = null;
  pendingIncomingTelnyxCall = null;
  telnyxCall = null;
  userAcceptedIncoming = false;
}

function setVoipMuted(muted: boolean) {
  try {
    if (voipProvider === "telnyx" && telnyxCall) {
      if (muted) telnyxCall.muteAudio?.();
      else telnyxCall.unmuteAudio?.();
      return;
    }
    if (twilioCall) twilioCall.mute(muted);
  } catch {
    /* ignore */
  }
}

type SoftphoneLauncher = "hidden" | "fab" | "inline";

export default function AdminSoftphone({
  launcher = "inline",
}: {
  launcher?: SoftphoneLauncher;
}) {
  const { open, activeCall, pendingDial, answerRequestId, rejectRequestId } =
    useSoftphoneState();
  const { socket } = useAuth() as { socket: any };
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const endCallRef = useRef<(finalStatus?: string) => Promise<void>>(
    async () => {}
  );

  const [tab, setTab] = useState<SoftphoneTab>("dial");
  const [digits, setDigits] = useState("");
  const [contactName, setContactName] = useState("");
  const [status, setStatus] = useState<SoftphoneStatus>({
    mode: "device",
    voipReady: false,
    provider: "none",
  });
  const [contacts, setContacts] = useState<SoftphoneContact[]>([]);
  const [calls, setCalls] = useState<SoftphoneCallLog[]>([]);
  const [query, setQuery] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [busy, setBusy] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");
  const handledQueryRef = useRef("");

  const elapsedSec = useMemo(() => {
    if (!activeCall?.startedAt) return 0;
    if (
      !["in-progress", "ringing", "connecting", "incoming"].includes(
        activeCall.status
      )
    ) {
      return 0;
    }
    return Math.floor((now - activeCall.startedAt) / 1000);
  }, [activeCall, now]);

  useEffect(() => {
    if (!activeCall) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [activeCall]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("[data-softphone-launcher]")) return;
      if (!rootRef.current?.contains(target as Node)) {
        setSoftphoneOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const loadStatus = useCallback(async () => {
    try {
      const res = await API.get("/admin/softphone/status");
      const provider =
        res.data?.provider === "telnyx" || res.data?.provider === "twilio"
          ? res.data.provider
          : "none";
      voipProvider = provider;
      setStatus({
        mode: res.data?.mode === "voip" ? "voip" : "device",
        voipReady: Boolean(res.data?.voipReady),
        provider,
        callerId: res.data?.callerId || null,
        message: res.data?.message || "",
      });
      return Boolean(res.data?.voipReady);
    } catch {
      voipProvider = "none";
      setStatus({
        mode: "device",
        voipReady: false,
        provider: "none",
        message: "מצב חיוג ממכשיר",
      });
      return false;
    }
  }, []);

  const loadContacts = useCallback(async (q = "") => {
    setLoadingContacts(true);
    try {
      const res = await API.get("/admin/softphone/contacts", {
        params: { q, limit: 40 },
      });
      setContacts(Array.isArray(res.data?.contacts) ? res.data.contacts : []);
    } catch {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const loadCalls = useCallback(async () => {
    setLoadingCalls(true);
    try {
      const res = await API.get("/admin/softphone/calls", {
        params: { limit: 40 },
      });
      setCalls(Array.isArray(res.data?.calls) ? res.data.calls : []);
    } catch {
      setCalls([]);
    } finally {
      setLoadingCalls(false);
    }
  }, []);

  const endCall = useCallback(
    async (finalStatus?: string) => {
      const current = getAdminSoftphoneState().activeCall;
      stopHoldMusic();
      mutedBeforeHold = false;
      hangupActiveVoipCall();

      if (current?.logId) {
        const durationSec = Math.max(
          0,
          Math.floor((Date.now() - current.startedAt) / 1000)
        );
        const statusToSave =
          finalStatus ||
          (current.status === "incoming" ||
          current.status === "connecting" ||
          current.status === "ringing"
            ? "canceled"
            : "completed");
        try {
          await API.patch(`/admin/softphone/calls/${current.logId}`, {
            status: statusToSave,
            durationSec,
            endedAt: new Date().toISOString(),
          });
        } catch {
          /* ignore */
        }
      }

      clearActiveSoftphoneCall();
      void loadCalls();
    },
    [loadCalls]
  );

  useEffect(() => {
    endCallRef.current = endCall;
  }, [endCall]);

  const acceptIncoming = useCallback(async () => {
    const current = getAdminSoftphoneState().activeCall;
    // Only answer when the softphone already shows an incoming call.
    // Never queue another answer request here (that caused mobile auto-answer).
    if (!current || current.status !== "incoming") {
      setSoftphoneOpen(true);
      return;
    }

    try {
      userAcceptedIncoming = true;
      if (pendingIncomingTelnyxCall) {
        telnyxCall = pendingIncomingTelnyxCall;
        pendingIncomingTelnyxCall = null;
        const media = getTelnyxCallMediaOptions();
        if (typeof telnyxCall.answer === "function") {
          await Promise.resolve(telnyxCall.answer(media));
        }
        try {
          telnyxCall.unmuteAudio?.();
        } catch {
          /* ignore */
        }
        await attachTelnyxRemoteAudio(telnyxCall);
      } else if (pendingIncomingTwilioCall) {
        twilioCall = pendingIncomingTwilioCall;
        pendingIncomingTwilioCall = null;
        await twilioCall.accept();
      }
      patchActiveSoftphoneCall({
        status: "in-progress",
        startedAt: Date.now(),
        muted: false,
        speakerOn: true,
      });
      if (current.logId) {
        await API.patch(`/admin/softphone/calls/${current.logId}`, {
          status: "in-progress",
        }).catch(() => {});
      }
      setSoftphoneOpen(true);
    } catch (err: any) {
      userAcceptedIncoming = false;
      patchActiveSoftphoneCall({
        status: "failed",
        error: err?.message || "לא הצלחנו לענות לשיחה",
      });
    }
  }, []);

  const rejectIncoming = useCallback(async () => {
    const current = getAdminSoftphoneState().activeCall;
    try {
      pendingIncomingTelnyxCall?.hangup?.();
    } catch {
      /* ignore */
    }
    try {
      pendingIncomingTwilioCall?.reject?.();
    } catch {
      /* ignore */
    }
    pendingIncomingTelnyxCall = null;
    pendingIncomingTwilioCall = null;
    await endCall("canceled");
    if (!current) requestSoftphoneReject();
  }, [endCall]);

  const startCall = useCallback(
    async (opts?: {
      phone?: string;
      name?: string;
      source?: string;
      refId?: string;
    }) => {
      if (busy || getAdminSoftphoneState().activeCall) return;

      const phone = normalizeDialNumber(opts?.phone || digits || "");
      if (!phone || phone.replace(/\D/g, "").length < 7) {
        setError("הזינו מספר טלפון תקין");
        setSoftphoneOpen(true);
        setTab("dial");
        return;
      }

      setBusy(true);
      setError("");
      setSoftphoneOpen(true);
      setTab("dial");

      const name = String(opts?.name || contactName || "").trim();
      const source = opts?.source || "manual";
      const refId = opts?.refId || "";

      try {
        // Always dial via Telnyx/WebRTC business line — never open native tel:
        // (native dialer shows dual-SIM "אישי / בית עסק" on mobile).
        const auth = await fetchSoftphoneAuth();
        const provider =
          auth.provider === "telnyx" || auth.provider === "twilio"
            ? auth.provider
            : null;

        if (!provider) {
          throw new Error(
            "הסופטפון לא מחובר לקו העסקי. הגדירו Telnyx WebRTC בשרת."
          );
        }

        voipProvider = provider;
        const mode: SoftphoneMode = "voip";
        const callerNumber =
          auth.callerNumber ||
          auth.fromNumber ||
          auth.callerId ||
          "+972555172750";

        const logRes = await API.post("/admin/softphone/calls", {
          toNumber: phone,
          fromNumber: callerNumber,
          contactName: name,
          contactSource: source,
          contactRefId: refId,
          mode,
          direction: "outbound",
          status: "initiated",
        });

        const logId = logRes.data?.call?._id || null;

        setActiveSoftphoneCall({
          logId,
          phone,
          contactName: name,
          contactSource: source,
          contactRefId: refId,
          mode,
          direction: "outbound",
          status: "connecting",
          startedAt: Date.now(),
          muted: false,
          held: false,
          speakerOn: true,
          error: null,
        });

        if (provider === "telnyx") {
          const client = await ensureTelnyxClient(auth);

              const call = client.newCall({
                destinationNumber: phone,
                callerNumber,
                ...getTelnyxCallMediaOptions(),
              });
              telnyxCall = call;
              void attachTelnyxRemoteAudio(call);

          call.on?.("state", (nextState: string) => {
            const state = String(nextState || "").toLowerCase();
            if (state === "ringing" || state === "trying") {
              patchActiveSoftphoneCall({ status: "ringing" });
              if (logId) {
                void API.patch(`/admin/softphone/calls/${logId}`, {
                  status: "ringing",
                  twilioCallSid: call.id || "",
                });
              }
            }
            if (state === "active" || state === "answered") {
              patchActiveSoftphoneCall({ status: "in-progress" });
              void attachTelnyxRemoteAudio(call);
              if (logId) {
                void API.patch(`/admin/softphone/calls/${logId}`, {
                  status: "in-progress",
                  twilioCallSid: call.id || "",
                });
              }
            }
            if (["hangup", "destroy", "purge", "done"].includes(state)) {
              void endCall("completed");
            }
          });

          patchActiveSoftphoneCall({ status: "ringing" });
        } else {
          const device = await ensureTwilioDevice(String(auth.token || ""));
          const call = await device.connect({
            params: { To: phone },
          });
          twilioCall = call;

          call.on("ringing", () => {
            patchActiveSoftphoneCall({ status: "ringing" });
            if (logId) {
              void API.patch(`/admin/softphone/calls/${logId}`, {
                status: "ringing",
                twilioCallSid: call.parameters?.CallSid || "",
              });
            }
          });

          call.on("accept", () => {
            patchActiveSoftphoneCall({ status: "in-progress" });
            if (logId) {
              void API.patch(`/admin/softphone/calls/${logId}`, {
                status: "in-progress",
                twilioCallSid: call.parameters?.CallSid || "",
              });
            }
          });

          call.on("disconnect", () => {
            void endCall("completed");
          });

          call.on("error", (err: any) => {
            patchActiveSoftphoneCall({
              status: "failed",
              error: err?.message || "שגיאת שיחה",
            });
            if (logId) {
              void API.patch(`/admin/softphone/calls/${logId}`, {
                status: "failed",
              });
            }
          });

          patchActiveSoftphoneCall({ status: "ringing" });
        }

        setDigits(phone);
        setContactName(name);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "לא הצלחנו להתחיל שיחה מהקו העסקי";
        setError(message);
        patchActiveSoftphoneCall({
          status: "failed",
          error: message,
        });
        clearActiveSoftphoneCall();
      } finally {
        setBusy(false);
      }
    },
    [busy, contactName, digits, endCall]
  );

  // Pending dial from customer tables
  useEffect(() => {
    if (!pendingDial) return;
    const req = consumePendingSoftphoneDial();
    if (!req) return;
    setDigits(req.phone);
    setContactName(req.name || "");
    void startCall({
      phone: req.phone,
      name: req.name,
      source: req.source,
      refId: req.refId,
    });
  }, [pendingDial, startCall]);

  // Answer / reject intents from PWA notification actions
  useEffect(() => {
    if (!answerRequestId) return;
    consumeSoftphoneAnswerRequest();
    void acceptIncoming();
  }, [answerRequestId, acceptIncoming]);

  useEffect(() => {
    if (!rejectRequestId) return;
    consumeSoftphoneRejectRequest();
    void rejectIncoming();
  }, [rejectRequestId, rejectIncoming]);

  // Deep link from PWA/mobile notification — ALWAYS open the incoming
  // Answer/Decline screen only. Never auto-answer from the URL.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const softphone = params.get("softphone");
    if (
      softphone !== "answer" &&
      softphone !== "incoming" &&
      softphone !== "open"
    ) {
      return;
    }

    const key = location.search;
    if (handledQueryRef.current === key) return;
    handledQueryRef.current = key;

    const from = params.get("from") || "";
    const name = params.get("name") || "שיחה נכנסת";
    const callSid = params.get("callSid") || "";
    const callId = params.get("callId") || "";

    const current = getAdminSoftphoneState().activeCall;
    if (!current || current.status !== "incoming") {
      if (from) {
        presentIncomingSoftphoneCall({
          phone: from,
          contactName: name,
          callSid,
          logId: callId || null,
          mode: status.voipReady ? "voip" : "device",
        });
      }
    }

    setSoftphoneOpen(true);
    // Intentionally no requestSoftphoneAnswer() — user must tap ענה in UI.

    params.delete("softphone");
    params.delete("from");
    params.delete("name");
    params.delete("callSid");
    params.delete("callId");
    const next = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: next ? `?${next}` : "",
      },
      { replace: true }
    );
  }, [location.pathname, location.search, navigate, status.voipReady]);

  // Custom events from SW bridge — open incoming UI only (desktop-identical).
  useEffect(() => {
    const presentFromDetail = (detail: any) => {
      if (!detail?.fromNumber && !getAdminSoftphoneState().activeCall) return;
      const current = getAdminSoftphoneState().activeCall;
      if (detail?.fromNumber && (!current || current.status !== "incoming")) {
        presentIncomingSoftphoneCall({
          phone: detail.fromNumber,
          contactName: detail.contactName || "שיחה נכנסת",
          callSid: detail.callSid || null,
          logId: detail.callId || null,
          mode: status.voipReady ? "voip" : "device",
        });
      }
      setSoftphoneOpen(true);
    };

    const onOpenIncoming = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      presentFromDetail(detail);
    };
    // Legacy SOFTPHONE_ANSWER from old SW builds: open UI only, do not answer.
    const onAnswer = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      presentFromDetail(detail);
    };
    const onReject = () => requestSoftphoneReject();

    window.addEventListener("bizuply:softphone-answer", onAnswer);
    window.addEventListener("bizuply:softphone-open-incoming", onOpenIncoming);
    window.addEventListener("bizuply:softphone-reject", onReject);
    return () => {
      window.removeEventListener("bizuply:softphone-answer", onAnswer);
      window.removeEventListener(
        "bizuply:softphone-open-incoming",
        onOpenIncoming
      );
      window.removeEventListener("bizuply:softphone-reject", onReject);
    };
  }, [status.voipReady]);

  // Socket incoming
  useEffect(() => {
    if (!socket) return;

    const onIncoming = (payload: any) => {
      presentIncomingSoftphoneCall({
        phone: payload?.fromNumber || "שיחה נכנסת",
        contactName: payload?.contactName || "שיחה נכנסת",
        callSid: payload?.callSid || null,
        logId: payload?.callId || null,
        mode: payload?.mode === "voip" ? "voip" : "device",
      });
    };

    socket.emit("joinRoom", "admin-support");
    socket.on("softphone:incoming", onIncoming);
    return () => {
      socket.off("softphone:incoming", onIncoming);
    };
  }, [socket]);

  // Keep VoIP client registered for inbound when ready (Telnyx preferred).
  // Intentionally does NOT hang up on unmount — calls survive navigation.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const voip = await loadStatus();
      if (!voip || cancelled) return;
      try {
        const auth = await fetchSoftphoneAuth();
        if (cancelled) return;

        const provider =
          auth.provider === "telnyx" || auth.provider === "twilio"
            ? auth.provider
            : "twilio";
        voipProvider = provider;

        if (provider === "telnyx") {
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "default"
          ) {
            void Notification.requestPermission().catch(() => {});
          }
          await ensureTelnyxClient(auth);
          return;
        }

        const device = await ensureTwilioDevice(String(auth.token || ""));
        if (!twilioIncomingBound) {
          twilioIncomingBound = true;
          device.on("incoming", (call: any) => {
            pendingIncomingTwilioCall = call;
            const from =
              call?.parameters?.From ||
              call?.parameters?.from ||
              "שיחה נכנסת";
            presentIncomingSoftphoneCall({
              phone: from,
              contactName: "שיחה נכנסת",
              callSid: call?.parameters?.CallSid || null,
              mode: "voip",
            });

            call.on("cancel", () => {
              if (pendingIncomingTwilioCall === call) {
                pendingIncomingTwilioCall = null;
              }
              const current = getAdminSoftphoneState().activeCall;
              if (current?.status === "incoming") {
                void endCallRef.current("no-answer");
              }
            });
          });
        }
      } catch {
        /* device mode */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadStatus]);

  useEffect(() => {
    if (!open) return;
    void loadStatus();
    if (tab === "contacts") void loadContacts(query);
    if (tab === "history") void loadCalls();
  }, [open, tab, loadStatus, loadContacts, loadCalls, query]);

  useEffect(() => {
    if (!open || tab !== "contacts") return;
    const id = window.setTimeout(() => {
      void loadContacts(query);
    }, 220);
    return () => window.clearTimeout(id);
  }, [query, open, tab, loadContacts]);

  const appendDigit = useCallback((digit: string) => {
    setDigits((prev) => (prev.length >= 18 ? prev : `${prev}${digit}`));
    setError("");
  }, []);

  // Physical keyboard dialing while softphone dial pad is open.
  useEffect(() => {
    if (!open || tab !== "dial") return;
    if (activeCall) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = String(target?.tagName || "").toLowerCase();
      const inDigitsField = Boolean(
        target?.closest?.("[data-softphone-digits]")
      );
      // Don't steal typing from other fields (e.g. contact name).
      if (tag === "textarea") return;
      if (tag === "input" && !inDigitsField) return;

      const key = event.key;
      if (/^[0-9*#]$/.test(key)) {
        event.preventDefault();
        appendDigit(key);
        return;
      }
      if (key === "+") {
        event.preventDefault();
        setDigits((prev) => {
          if (prev.includes("+") || prev.length >= 18) return prev;
          return prev ? prev : "+";
        });
        setError("");
        return;
      }
      if (key === "Backspace") {
        event.preventDefault();
        setDigits((prev) => prev.slice(0, -1));
        setError("");
        return;
      }
      if (key === "Enter") {
        event.preventDefault();
        void startCall();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, tab, activeCall, appendDigit, startCall]);

  const toggleMute = useCallback(() => {
    const current = getAdminSoftphoneState().activeCall;
    if (!current || current.held) return;
    const next = !current.muted;
    if (current.mode === "voip") setVoipMuted(next);
    patchActiveSoftphoneCall({ muted: next });
  }, []);

  const toggleHold = useCallback(() => {
    const current = getAdminSoftphoneState().activeCall;
    if (!current || current.status !== "in-progress") return;

    const nextHeld = !current.held;
    if (nextHeld) {
      mutedBeforeHold = Boolean(current.muted);
      if (current.mode === "voip") setVoipMuted(true);
      startHoldMusic();
      patchActiveSoftphoneCall({ held: true, muted: true });
      return;
    }

    stopHoldMusic();
    const restoreMuted = mutedBeforeHold;
    mutedBeforeHold = false;
    if (current.mode === "voip") setVoipMuted(restoreMuted);
    patchActiveSoftphoneCall({ held: false, muted: restoreMuted });
  }, []);

  const toggleSpeaker = useCallback(() => {
    const current = getAdminSoftphoneState().activeCall;
    if (!current) return;
    patchActiveSoftphoneCall({ speakerOn: !current.speakerOn });
  }, []);

  const simulateIncoming = useCallback(async () => {
    if (simulating) return;
    setSimulating(true);
    try {
      const res = await API.post("/admin/softphone/simulate-incoming", {
        fromNumber: digits || "+972501234567",
        contactName: contactName || "בדיקת שיחה נכנסת",
      });
      presentIncomingSoftphoneCall({
        phone: res.data?.call?.fromNumber || digits || "+972501234567",
        contactName:
          res.data?.call?.contactName || contactName || "בדיקת שיחה נכנסת",
        callSid: res.data?.notify?.payload?.callSid || null,
        logId: res.data?.call?._id || null,
        mode: status.mode,
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "לא הצלחנו לשלוח שיחה נכנסת לבדיקה"
      );
    } finally {
      setSimulating(false);
    }
  }, [simulating, digits, contactName, status.mode]);

  const inCall = Boolean(activeCall) &&
    ["connecting", "ringing", "incoming", "in-progress"].includes(
      activeCall?.status || ""
    );
  const isIncoming = activeCall?.status === "incoming";

  const showLauncher = launcher !== "hidden";
  const fabLauncher = launcher === "fab";

  return (
    <div
      className={fabLauncher ? "inline-flex flex-col items-end" : "inline-flex"}
      ref={rootRef}
    >
      {showLauncher ? (
        <button
          type="button"
          data-softphone-launcher="true"
          onClick={() => toggleSoftphoneOpen()}
          aria-label="סופטפון"
          className={[
            "relative inline-flex items-center justify-center border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
            fabLauncher
              ? "h-14 w-14 rounded-full shadow-lg shadow-teal-500/25 sm:h-16 sm:w-16"
              : "h-11 w-11 rounded-2xl sm:h-12 sm:w-12",
            isIncoming
              ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white text-emerald-600"
              : inCall
                ? "border-teal-300 bg-gradient-to-br from-teal-50 to-white text-teal-600"
                : open
                  ? "border-violet-300 bg-gradient-to-br from-[#F3EEFF] to-white text-[#7C4DFF]"
                  : fabLauncher
                    ? "border-teal-200 bg-gradient-to-br from-white to-teal-50 text-teal-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-[#7C4DFF]",
          ].join(" ")}
        >
          {isIncoming ? (
            <motion.span
              animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="inline-flex"
            >
              <PhoneIncoming
                className={fabLauncher ? "h-6 w-6" : "h-5 w-5"}
                strokeWidth={2.2}
              />
            </motion.span>
          ) : inCall ? (
            <PhoneCall
              className={fabLauncher ? "h-6 w-6" : "h-5 w-5"}
              strokeWidth={2.2}
            />
          ) : (
            <Phone
              className={fabLauncher ? "h-6 w-6" : "h-5 w-5"}
              strokeWidth={2.2}
            />
          )}
          {(inCall || isIncoming) && (
            <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </button>
      ) : null}

      <AnimatePresence>
        {open && (
          <motion.button
            key="softphone-backdrop"
            type="button"
            aria-label="סגור סופטפון"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={ADMIN_MOBILE_BACKDROP_CLASS}
            onClick={() => setSoftphoneOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2 }}
            className={ADMIN_FLOATING_PANEL_CLASS}
            dir="rtl"
            style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
          >
            <div className="mx-auto mb-1 mt-2 h-1.5 w-12 shrink-0 rounded-full bg-slate-200 sm:hidden" />
            <div className="relative shrink-0 overflow-hidden border-b border-white/10 px-4 pb-4 pt-4 text-white">
              <div
                className={[
                  "absolute inset-0",
                  isIncoming
                    ? "bg-[linear-gradient(135deg,#059669_0%,#0D9488_55%,#7C4DFF_100%)]"
                    : "bg-[linear-gradient(135deg,#5B2CFF_0%,#7C4DFF_45%,#14B8A6_100%)]",
                ].join(" ")}
              />
              <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                    {isIncoming ? (
                      <PhoneIncoming className="h-5 w-5" />
                    ) : (
                      <Phone className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black">
                      {isIncoming ? "שיחה נכנסת" : "סופטפון"}
                    </p>
                    <p className="truncate text-[11px] font-bold text-white/80">
                      {status.voipReady
                        ? `${
                            status.provider === "telnyx" ? "Telnyx" : "VoIP"
                          } פעיל · ${status.callerId || "+972555172750"}`
                        : "חיוג · אנשי קשר · שיחות נכנסות"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoftphoneOpen(false)}
                  aria-label="סגור"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {!inCall && (
                <div className="relative mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-black/15 p-1">
                  {(
                    [
                      ["dial", "חיוג", Grid3X3],
                      ["contacts", "אנשי קשר", UserRound],
                      ["history", "היסטוריה", History],
                    ] as const
                  ).map(([key, label, Icon]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={[
                        "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-black transition",
                        tab === key
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-white/80 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,#F8F5FF_0%,#FFFFFF_42%)]">
              {isIncoming ? (
                <div className="flex h-full flex-col items-center justify-between px-6 py-8 text-center">
                  <div>
                    <motion.div
                      className="mx-auto mb-5 grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/35"
                      animate={{
                        scale: [1, 1.06, 1],
                        boxShadow: [
                          "0 18px 40px rgba(16,185,129,0.35)",
                          "0 18px 55px rgba(20,184,166,0.45)",
                          "0 18px 40px rgba(16,185,129,0.35)",
                        ],
                      }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      <PhoneIncoming className="h-12 w-12" />
                    </motion.div>
                    <p className="text-xl font-black text-slate-900">
                      {activeCall?.contactName || "שיחה נכנסת"}
                    </p>
                    <p
                      className="mt-1 text-lg font-bold tracking-wide text-slate-500"
                      dir="ltr"
                    >
                      {formatDisplayPhone(activeCall?.phone || "")}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                      <BellRing className="h-3.5 w-3.5" />
                      מצלצל · {formatCallDuration(elapsedSec)}
                    </p>
                  </div>

                  <div className="flex w-full items-end justify-center gap-10 pb-2">
                    <ActionButton
                      label="דחה"
                      tone="rose"
                      size="xl"
                      onClick={() => void rejectIncoming()}
                    >
                      <PhoneOff className="h-8 w-8" />
                    </ActionButton>
                    <ActionButton
                      label="ענה"
                      tone="emerald"
                      size="xl"
                      onClick={() => void acceptIncoming()}
                    >
                      <Phone className="h-8 w-8" />
                    </ActionButton>
                  </div>
                </div>
              ) : inCall ? (
                <div className="flex h-full flex-col items-center justify-between px-6 py-8 text-center">
                  <div>
                    <motion.div
                      className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#7C4DFF] to-teal-500 text-white shadow-xl shadow-[#7C4DFF]/30"
                      animate={{
                        boxShadow: [
                          "0 16px 40px rgba(124,77,255,0.28)",
                          "0 16px 48px rgba(20,184,166,0.35)",
                          "0 16px 40px rgba(124,77,255,0.28)",
                        ],
                      }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      <PhoneCall className="h-10 w-10" />
                    </motion.div>
                    <p className="text-xl font-black text-slate-900">
                      {activeCall?.contactName ||
                        (activeCall?.direction === "inbound"
                          ? "שיחה נכנסת"
                          : "שיחה יוצאת")}
                    </p>
                    <p
                      className="mt-1 text-lg font-bold tracking-wide text-slate-500"
                      dir="ltr"
                    >
                      {formatDisplayPhone(activeCall?.phone || "")}
                    </p>
                    <p className="mt-3 text-sm font-black text-[#7C4DFF]">
                      {activeCall?.status === "connecting"
                        ? "מתחבר..."
                        : activeCall?.status === "ringing"
                          ? "מצלצל..."
                          : activeCall?.held
                            ? "בהמתנה"
                            : formatCallDuration(elapsedSec)}
                    </p>
                    {activeCall?.held ? (
                      <p className="mt-2 text-xs font-bold text-amber-600">
                        נגן המתנה פעיל · המיקרופון מושתק
                      </p>
                    ) : null}
                    {activeCall?.error ? (
                      <p className="mt-3 text-xs font-bold text-rose-600">
                        {activeCall.error}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex w-full flex-wrap items-end justify-center gap-4 pb-1 sm:gap-5">
                    <ActionButton
                      label={activeCall?.muted ? "השמע" : "השתק"}
                      tone="amber"
                      active={Boolean(activeCall?.muted)}
                      disabled={
                        activeCall?.mode !== "voip" || Boolean(activeCall?.held)
                      }
                      onClick={toggleMute}
                    >
                      {activeCall?.muted ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </ActionButton>

                    <ActionButton
                      label={activeCall?.held ? "המשך" : "המתנה"}
                      tone="amber"
                      active={Boolean(activeCall?.held)}
                      disabled={activeCall?.status !== "in-progress"}
                      onClick={toggleHold}
                    >
                      {activeCall?.held ? (
                        <Play className="h-5 w-5" />
                      ) : (
                        <Pause className="h-5 w-5" />
                      )}
                    </ActionButton>

                    <ActionButton
                      label="נתק"
                      tone="rose"
                      size="xl"
                      onClick={() => void endCall()}
                    >
                      <PhoneOff className="h-8 w-8" />
                    </ActionButton>

                    <ActionButton
                      label={activeCall?.speakerOn ? "רמקול" : "שקט"}
                      tone="violet"
                      active={Boolean(activeCall?.speakerOn)}
                      onClick={toggleSpeaker}
                    >
                      {activeCall?.speakerOn ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                    </ActionButton>
                  </div>
                </div>
              ) : tab === "dial" ? (
                <div className="flex h-full flex-col px-4 py-4">
                  <div className="mb-3 rounded-[24px] border border-violet-100 bg-white/80 px-4 py-4 shadow-sm backdrop-blur">
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="שם איש קשר (אופציונלי)"
                      className="mb-2 w-full border-0 bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                    />
                    <div
                      className="flex items-center gap-2"
                      data-softphone-digits="true"
                      dir="ltr"
                    >
                      <input
                        value={digits}
                        onChange={(e) =>
                          setDigits(
                            e.target.value.replace(/[^\d+*#]/g, "").slice(0, 18)
                          )
                        }
                        placeholder="הזינו מספר לחיוג"
                        dir="ltr"
                        inputMode="tel"
                        autoComplete="tel"
                        autoFocus
                        className="w-full border-0 bg-transparent text-center text-3xl font-black tracking-wide text-slate-900 outline-none placeholder:text-slate-300"
                      />
                      {digits ? (
                        <button
                          type="button"
                          onClick={() => setDigits((p) => p.slice(0, -1))}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                          aria-label="מחק ספרה"
                        >
                          <Delete className="h-5 w-5" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {error ? (
                    <p className="mb-2 text-center text-xs font-bold text-rose-600">
                      {error}
                    </p>
                  ) : (
                    <p className="mb-2 text-center text-[11px] font-bold text-slate-400">
                      {status.message || "חייגו מספר או בחרו לקוח מהרשימה"}
                    </p>
                  )}

                  <div
                    className="grid flex-1 grid-cols-3 content-center gap-2 px-1 sm:gap-2.5"
                    dir="ltr"
                  >
                    {KEYPAD.map((key) => (
                      <button
                        key={key.digit}
                        type="button"
                        onClick={() => appendDigit(key.digit)}
                        className="group flex h-[56px] flex-col items-center justify-center rounded-[20px] border border-slate-100 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_24px_rgba(124,77,255,0.12)] active:scale-[0.98] sm:h-[62px] sm:rounded-[22px]"
                      >
                        <span className="text-2xl font-black text-slate-900">
                          {key.digit}
                        </span>
                        {key.letters ? (
                          <span className="text-[10px] font-bold tracking-[0.18em] text-slate-400">
                            {key.letters}
                          </span>
                        ) : (
                          <span className="h-3" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void startCall()}
                      className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-[22px] bg-gradient-to-l from-emerald-500 to-teal-500 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-105 disabled:opacity-60"
                    >
                      {busy ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Phone className="h-5 w-5" />
                      )}
                      חיוג
                    </button>
                    <button
                      type="button"
                      disabled={simulating}
                      onClick={() => void simulateIncoming()}
                      title="בדיקת שיחה נכנסת + התראת PWA עם ענה"
                      className="inline-flex h-14 w-14 items-center justify-center rounded-[22px] border border-violet-200 bg-[#F3EEFF] text-[#7C4DFF] shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
                    >
                      {simulating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <PhoneIncoming className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : tab === "contacts" ? (
                <div className="flex h-full flex-col">
                  <div className="border-b border-slate-100 p-3">
                    <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                      <Search className="h-4 w-4 text-slate-400" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="חיפוש לקוח, נרשם או מספר..."
                        className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-3">
                    {loadingContacts ? (
                      <div className="flex min-h-[220px] items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#7C4DFF]" />
                      </div>
                    ) : contacts.length === 0 ? (
                      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                        <UserRound className="mb-3 h-8 w-8 text-slate-300" />
                        <p className="text-sm font-black text-slate-700">
                          אין אנשי קשר עם טלפון
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {contacts.map((contact) => (
                          <div
                            key={contact.id}
                            className="flex w-full items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3 text-right shadow-sm"
                          >
                            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#F3EEFF] to-teal-50 text-[#7C4DFF]">
                              <UserRound className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-black text-slate-900">
                                {contact.name}
                              </span>
                              <span
                                className="mt-0.5 block truncate text-xs font-bold text-slate-500"
                                dir="ltr"
                              >
                                {formatDisplayPhone(contact.phone)}
                              </span>
                              <span className="mt-1 inline-flex rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-black text-slate-500 ring-1 ring-slate-100">
                                {SOURCE_LABEL[contact.source] || contact.source}
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                void startCall({
                                  phone: contact.phone,
                                  name: contact.name,
                                  source: contact.source,
                                  refId: contact.refId,
                                })
                              }
                              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 transition hover:-translate-y-0.5"
                              aria-label={`חייג אל ${contact.name}`}
                            >
                              <Phone className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-3">
                  {loadingCalls ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-[#7C4DFF]" />
                    </div>
                  ) : calls.length === 0 ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                      <History className="mb-3 h-8 w-8 text-slate-300" />
                      <p className="text-sm font-black text-slate-700">
                        עדיין אין היסטוריית שיחות
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {calls.map((call) => {
                        const remote =
                          call.direction === "inbound"
                            ? call.fromNumber || call.toNumber
                            : call.toNumber;
                        const missed =
                          call.status === "no-answer" ||
                          call.status === "failed" ||
                          call.status === "canceled";
                        return (
                          <button
                            key={call._id}
                            type="button"
                            onClick={() => {
                              setDigits(remote);
                              setContactName(call.contactName || "");
                              setTab("dial");
                            }}
                            className="flex w-full items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3 text-right transition hover:border-violet-200 hover:bg-violet-50/40"
                          >
                            <span
                              className={[
                                "grid h-11 w-11 place-items-center rounded-2xl",
                                missed
                                  ? "bg-rose-50 text-rose-500"
                                  : call.direction === "inbound"
                                    ? "bg-sky-50 text-sky-600"
                                    : "bg-emerald-50 text-emerald-600",
                              ].join(" ")}
                            >
                              {missed ? (
                                <PhoneMissed className="h-5 w-5" />
                              ) : call.direction === "inbound" ? (
                                <PhoneIncoming className="h-5 w-5" />
                              ) : (
                                <PhoneCall className="h-5 w-5" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-black text-slate-900">
                                {call.contactName ||
                                  formatDisplayPhone(remote)}
                              </span>
                              <span
                                className="mt-0.5 block truncate text-xs font-bold text-slate-500"
                                dir="ltr"
                              >
                                {formatDisplayPhone(remote)}
                              </span>
                              <span className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span
                                  className={[
                                    "inline-flex rounded-full px-2 py-0.5 text-[10px] font-black ring-1",
                                    statusTone(call.status),
                                  ].join(" ")}
                                >
                                  {statusLabel(call.status)}
                                </span>
                              </span>
                            </span>
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                              <Phone className="h-4 w-4" />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {inCall && !open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[9998] w-[min(440px,calc(100vw-24px))] -translate-x-1/2 px-2"
            dir="rtl"
          >
            <div
              className={[
                "flex items-center gap-3 rounded-[28px] px-4 py-3 text-white shadow-2xl",
                isIncoming
                  ? "border border-emerald-300/40 bg-gradient-to-l from-emerald-700 via-teal-800 to-slate-900"
                  : "border border-emerald-200/70 bg-gradient-to-l from-slate-900 via-[#2A1B5E] to-teal-900",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setSoftphoneOpen(true)}
                className="flex min-w-0 flex-1 items-center gap-3 text-right"
              >
                <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                  {isIncoming ? (
                    <PhoneIncoming className="h-5 w-5 text-emerald-300" />
                  ) : (
                    <PhoneCall className="h-5 w-5 text-emerald-300" />
                  )}
                  <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {activeCall?.contactName ||
                      (isIncoming ? "שיחה נכנסת" : "שיחה פעילה")}
                  </span>
                  <span className="block text-xs font-bold text-white/70">
                    {isIncoming
                      ? "לחצו לענות"
                      : activeCall?.status === "ringing"
                        ? "מצלצל..."
                        : formatCallDuration(elapsedSec)}
                  </span>
                </span>
              </button>

              {isIncoming ? (
                <>
                  <button
                    type="button"
                    onClick={() => void rejectIncoming()}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg"
                    aria-label="דחה"
                  >
                    <PhoneOff className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void acceptIncoming()}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg"
                    aria-label="ענה"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => void endCall()}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                  aria-label="נתק"
                >
                  <PhoneOff className="h-5 w-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
