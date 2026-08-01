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
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Search,
  UserRound,
  X,
} from "lucide-react";

import API from "../api";
import {
  clearActiveSoftphoneCall,
  formatCallDuration,
  formatDisplayPhone,
  getAdminSoftphoneState,
  patchActiveSoftphoneCall,
  setActiveSoftphoneCall,
  setSoftphoneOpen,
  subscribeAdminSoftphone,
  toggleSoftphoneOpen,
  type SoftphoneMode,
} from "../utils/adminSoftphoneStore";

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
  contactName?: string;
  contactSource?: string;
  status: string;
  mode?: SoftphoneMode;
  durationSec?: number;
  createdAt?: string;
  startedAt?: string;
};

type SoftphoneStatus = {
  mode: SoftphoneMode;
  voipReady: boolean;
  callerId?: string | null;
  message?: string;
};

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

let twilioDevice: any = null;
let twilioCall: any = null;

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

function hangupTwilioCall() {
  try {
    twilioCall?.disconnect?.();
  } catch {
    /* ignore */
  }
  twilioCall = null;
}

export default function AdminSoftphone() {
  const { open, activeCall } = useSoftphoneState();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [tab, setTab] = useState<SoftphoneTab>("dial");
  const [digits, setDigits] = useState("");
  const [contactName, setContactName] = useState("");
  const [status, setStatus] = useState<SoftphoneStatus>({
    mode: "device",
    voipReady: false,
  });
  const [contacts, setContacts] = useState<SoftphoneContact[]>([]);
  const [calls, setCalls] = useState<SoftphoneCallLog[]>([]);
  const [query, setQuery] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState("");

  const elapsedSec = useMemo(() => {
    if (!activeCall?.startedAt) return 0;
    if (
      activeCall.status !== "in-progress" &&
      activeCall.status !== "ringing" &&
      activeCall.status !== "connecting"
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
      if (!rootRef.current?.contains(e.target as Node)) {
        setSoftphoneOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const loadStatus = useCallback(async () => {
    try {
      const res = await API.get("/admin/softphone/status");
      setStatus({
        mode: res.data?.mode === "voip" ? "voip" : "device",
        voipReady: Boolean(res.data?.voipReady),
        callerId: res.data?.callerId || null,
        message: res.data?.message || "",
      });
    } catch {
      setStatus({
        mode: "device",
        voipReady: false,
        message: "מצב חיוג ממכשיר",
      });
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

  useEffect(() => {
    void loadStatus();
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
    setDigits((prev) => {
      if (prev.length >= 18) return prev;
      return `${prev}${digit}`;
    });
    setError("");
  }, []);

  const backspace = useCallback(() => {
    setDigits((prev) => prev.slice(0, -1));
  }, []);

  const endCall = useCallback(async () => {
    const current = getAdminSoftphoneState().activeCall;
    hangupTwilioCall();

    if (current?.logId) {
      const durationSec = Math.max(
        0,
        Math.floor((Date.now() - current.startedAt) / 1000)
      );
      try {
        await API.patch(`/admin/softphone/calls/${current.logId}`, {
          status:
            current.status === "connecting" || current.status === "ringing"
              ? "canceled"
              : "completed",
          durationSec,
          endedAt: new Date().toISOString(),
        });
      } catch {
        /* ignore */
      }
    }

    clearActiveSoftphoneCall();
    void loadCalls();
  }, [loadCalls]);

  const startCall = useCallback(
    async (opts?: {
      phone?: string;
      name?: string;
      source?: string;
      refId?: string;
    }) => {
      if (busy || activeCall) return;

      const phone = String(opts?.phone || digits || "").trim();
      if (!phone || phone.replace(/\D/g, "").length < 7) {
        setError("הזינו מספר טלפון תקין");
        return;
      }

      setBusy(true);
      setError("");

      const name = String(opts?.name || contactName || "").trim();
      const source = opts?.source || "manual";
      const refId = opts?.refId || "";

      try {
        await loadStatus();
        const statusRes = await API.get("/admin/softphone/status");
        const mode: SoftphoneMode =
          statusRes.data?.mode === "voip" ? "voip" : "device";

        const logRes = await API.post("/admin/softphone/calls", {
          toNumber: phone,
          contactName: name,
          contactSource: source,
          contactRefId: refId,
          mode,
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
          status: "connecting",
          startedAt: Date.now(),
          muted: false,
          error: null,
        });

        if (mode === "voip") {
          try {
            const tokenRes = await API.get("/admin/softphone/token");
            const device = await ensureTwilioDevice(tokenRes.data.token);
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
              void endCall();
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
          } catch (err: any) {
            // Fallback to device dial if VoIP fails
            const fallbackLink = document.createElement("a");
            fallbackLink.href = `tel:${phone}`;
            fallbackLink.rel = "noopener";
            fallbackLink.click();
            patchActiveSoftphoneCall({
              mode: "device",
              status: "in-progress",
              error: null,
            });
            if (logId) {
              await API.patch(`/admin/softphone/calls/${logId}`, {
                mode: "device",
                status: "in-progress",
                notes: err?.message || "VoIP fallback to device",
              }).catch(() => {});
            }
          }
        } else {
          const deviceLink = document.createElement("a");
          deviceLink.href = `tel:${phone}`;
          deviceLink.rel = "noopener";
          deviceLink.click();
          patchActiveSoftphoneCall({ status: "in-progress" });
          if (logId) {
            await API.patch(`/admin/softphone/calls/${logId}`, {
              status: "in-progress",
            }).catch(() => {});
          }
        }

        setDigits(phone);
        setContactName(name);
        setTab("dial");
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "לא הצלחנו להתחיל שיחה"
        );
        clearActiveSoftphoneCall();
      } finally {
        setBusy(false);
      }
    },
    [activeCall, busy, contactName, digits, endCall, loadStatus]
  );

  const toggleMute = useCallback(async () => {
    const current = getAdminSoftphoneState().activeCall;
    if (!current) return;
    const next = !current.muted;
    try {
      if (current.mode === "voip" && twilioCall) {
        twilioCall.mute(next);
      }
    } catch {
      /* ignore */
    }
    patchActiveSoftphoneCall({ muted: next });
  }, []);

  const inCall =
    Boolean(activeCall) &&
    ["connecting", "ringing", "in-progress"].includes(
      activeCall?.status || ""
    );

  return (
    <div className="inline-flex" ref={rootRef}>
      <button
        type="button"
        onClick={() => toggleSoftphoneOpen()}
        aria-label="סופטפון"
        className={[
          "relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
          inCall
            ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white text-emerald-600"
            : open
              ? "border-violet-300 bg-gradient-to-br from-[#F3EEFF] to-white text-[#7C4DFF]"
              : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-[#7C4DFF]",
        ].join(" ")}
      >
        {inCall ? (
          <motion.span
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="inline-flex"
          >
            <PhoneCall className="h-5 w-5" strokeWidth={2.2} />
          </motion.span>
        ) : (
          <Phone className="h-5 w-5" strokeWidth={2.2} />
        )}
        {inCall && (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed left-4 top-20 z-[9999] flex h-[min(640px,calc(100vh-6.5rem))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-[30px] border border-slate-200/90 bg-white text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:left-6"
            dir="rtl"
            style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
          >
            <div className="relative shrink-0 overflow-hidden border-b border-white/10 px-4 pb-4 pt-4 text-white">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#5B2CFF_0%,#7C4DFF_45%,#14B8A6_100%)]" />
              <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-teal-300/20 blur-2xl" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-black">סופטפון</p>
                    <p className="truncate text-[11px] font-bold text-white/80">
                      {status.voipReady
                        ? `VoIP פעיל · ${status.callerId || "מספר יוצא"}`
                        : "חיוג מהיר · אנשי קשר · היסטוריה"}
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
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,#F8F5FF_0%,#FFFFFF_42%)]">
              {inCall ? (
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
                      {activeCall?.contactName || "שיחה יוצאת"}
                    </p>
                    <p className="mt-1 text-lg font-bold tracking-wide text-slate-500" dir="ltr">
                      {formatDisplayPhone(activeCall?.phone || "")}
                    </p>
                    <p className="mt-3 text-sm font-black text-[#7C4DFF]">
                      {activeCall?.status === "connecting"
                        ? "מתחבר..."
                        : activeCall?.status === "ringing"
                          ? "מצלצל..."
                          : formatCallDuration(elapsedSec)}
                    </p>
                    <p className="mt-1 text-[11px] font-bold text-slate-400">
                      {activeCall?.mode === "voip"
                        ? "שיחת דפדפן (VoIP)"
                        : "חיוג דרך המכשיר"}
                    </p>
                    {activeCall?.error ? (
                      <p className="mt-3 text-xs font-bold text-rose-600">
                        {activeCall.error}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex w-full items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => void toggleMute()}
                      disabled={activeCall?.mode !== "voip"}
                      className={[
                        "inline-flex h-14 w-14 items-center justify-center rounded-full border transition",
                        activeCall?.muted
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                        activeCall?.mode !== "voip" ? "opacity-40" : "",
                      ].join(" ")}
                      title={
                        activeCall?.mode === "voip"
                          ? "השתקה"
                          : "השתקה זמינה בשיחות VoIP"
                      }
                    >
                      {activeCall?.muted ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => void endCall()}
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/35 transition hover:bg-rose-600"
                      aria-label="נתק"
                    >
                      <PhoneOff className="h-7 w-7" />
                    </button>
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
                    <div className="flex items-center gap-2">
                      <input
                        value={digits}
                        onChange={(e) =>
                          setDigits(e.target.value.replace(/[^\d+*#]/g, ""))
                        }
                        placeholder="הזינו מספר לחיוג"
                        dir="ltr"
                        className="w-full border-0 bg-transparent text-center text-3xl font-black tracking-wide text-slate-900 outline-none placeholder:text-slate-300"
                      />
                      {digits ? (
                        <button
                          type="button"
                          onClick={backspace}
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
                      {status.message ||
                        (status.voipReady
                          ? "מוכן לשיחות מהדפדפן"
                          : "לחיצה על חיוג תפתח את שיחת הטלפון במכשיר")}
                    </p>
                  )}

                  <div className="grid flex-1 grid-cols-3 content-center gap-2.5 px-1">
                    {KEYPAD.map((key) => (
                      <button
                        key={key.digit}
                        type="button"
                        onClick={() => appendDigit(key.digit)}
                        className="group flex h-[64px] flex-col items-center justify-center rounded-[22px] border border-slate-100 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_12px_24px_rgba(124,77,255,0.12)] active:scale-[0.98]"
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

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void startCall()}
                    className="mt-3 inline-flex h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-gradient-to-l from-emerald-500 to-teal-500 text-base font-black text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-105 disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Phone className="h-5 w-5" />
                    )}
                    חיוג
                  </button>
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
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          נטען מלקוחות, הרשמה מוקדמת ומשתמשים
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {contacts.map((contact) => (
                          <button
                            key={contact.id}
                            type="button"
                            onClick={() =>
                              void startCall({
                                phone: contact.phone,
                                name: contact.name,
                                source: contact.source,
                                refId: contact.refId,
                              })
                            }
                            className="flex w-full items-center gap-3 rounded-3xl border border-slate-100 bg-white p-3 text-right shadow-sm transition hover:border-violet-200 hover:shadow-md"
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
                            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                              <Phone className="h-4 w-4" />
                            </span>
                          </button>
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
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        כל חיוג מהסופטפון יישמר כאן
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {calls.map((call) => {
                        const missed =
                          call.status === "no-answer" ||
                          call.status === "failed" ||
                          call.status === "canceled";
                        return (
                          <button
                            key={call._id}
                            type="button"
                            onClick={() => {
                              setDigits(call.toNumber);
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
                                  : "bg-emerald-50 text-emerald-600",
                              ].join(" ")}
                            >
                              {missed ? (
                                <PhoneMissed className="h-5 w-5" />
                              ) : (
                                <PhoneIncoming className="h-5 w-5" />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-black text-slate-900">
                                {call.contactName ||
                                  formatDisplayPhone(call.toNumber)}
                              </span>
                              <span
                                className="mt-0.5 block truncate text-xs font-bold text-slate-500"
                                dir="ltr"
                              >
                                {formatDisplayPhone(call.toNumber)}
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
                                <span className="text-[10px] font-bold text-slate-400">
                                  {call.createdAt
                                    ? new Date(call.createdAt).toLocaleString(
                                        "he-IL",
                                        {
                                          day: "2-digit",
                                          month: "2-digit",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )
                                    : ""}
                                </span>
                              </span>
                            </span>
                            <span className="text-xs font-black text-slate-400">
                              {formatCallDuration(call.durationSec || 0)}
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
            className="fixed bottom-5 left-1/2 z-[9998] w-[min(420px,calc(100vw-24px))] -translate-x-1/2"
            dir="rtl"
          >
            <div className="flex items-center gap-3 rounded-[28px] border border-emerald-200/70 bg-gradient-to-l from-slate-900 via-[#2A1B5E] to-teal-900 px-4 py-3 text-white shadow-2xl shadow-slate-900/30">
              <button
                type="button"
                onClick={() => setSoftphoneOpen(true)}
                className="flex min-w-0 flex-1 items-center gap-3 text-right"
              >
                <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                  <PhoneCall className="h-5 w-5 text-emerald-300" />
                  <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-black">
                    {activeCall?.contactName || "שיחה פעילה"}
                  </span>
                  <span className="block text-xs font-bold text-white/70">
                    {activeCall?.status === "ringing"
                      ? "מצלצל..."
                      : formatCallDuration(elapsedSec)}
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => void endCall()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                aria-label="נתק"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
