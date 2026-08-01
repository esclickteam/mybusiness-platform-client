import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Coffee,
  Grid3X3,
  Mic,
  MicOff,
  Pause,
  Phone,
  PhoneCall,
  PhoneOff,
  Play,
  Power,
  Search,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import {
  formatCallDuration,
  formatDisplayPhone,
} from "../../utils/adminSoftphoneStore";
import { startHoldMusic, stopHoldMusic } from "../../utils/softphoneHoldMusic";

type SoftphoneMode = "voip" | "device";

type ActiveCall = {
  logId?: string | null;
  phone: string;
  contactName: string;
  mode: SoftphoneMode;
  status: "connecting" | "ringing" | "in-progress";
  startedAt: number;
  muted: boolean;
  held: boolean;
};

const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

let twilioDevice: any = null;
let twilioCall: any = null;
let mutedBeforeHold = false;

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

function hangupTwilio() {
  try {
    twilioCall?.disconnect?.();
  } catch {
    /* ignore */
  }
  twilioCall = null;
}

/**
 * Investimo-style softphone toolbar: one horizontal row with shift + dial +
 * in-call controls (icons), professional and compact.
 */
export default function StaffSoftphoneBar() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [shiftSec, setShiftSec] = useState(0);
  const [digits, setDigits] = useState("");
  const [padOpen, setPadOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [voipReady, setVoipReady] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const activeCallRef = useRef<ActiveCall | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    if (!isWorking || isOnBreak) return;
    const id = window.setInterval(() => setShiftSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [isWorking, isOnBreak]);

  useEffect(() => {
    if (!activeCall) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [activeCall]);

  useEffect(() => {
    void API.get("/staff/softphone/status")
      .then((res) => setVoipReady(Boolean(res.data?.voipReady)))
      .catch(() => setVoipReady(false));
  }, []);

  useEffect(() => {
    if (!padOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setPadOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [padOpen]);

  const shiftLabel = useMemo(() => {
    const h = Math.floor(shiftSec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((shiftSec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (shiftSec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [shiftSec]);

  const callElapsed = useMemo(() => {
    if (!activeCall?.startedAt) return 0;
    return Math.floor((now - activeCall.startedAt) / 1000);
  }, [activeCall, now]);

  const endCall = useCallback(async (finalStatus = "completed") => {
    stopHoldMusic();
    mutedBeforeHold = false;
    const current = activeCallRef.current;
    hangupTwilio();
    setActiveCall(null);
    activeCallRef.current = null;
    if (current?.logId) {
      const durationSec = Math.max(
        0,
        Math.floor((Date.now() - current.startedAt) / 1000)
      );
      try {
        await API.patch(`/staff/softphone/calls/${current.logId}`, {
          status: finalStatus,
          durationSec,
          endedAt: new Date().toISOString(),
        });
      } catch {
        /* ignore */
      }
    }
  }, []);

  const startCall = useCallback(async () => {
    if (busy || activeCallRef.current) return;
    const phone = digits.trim();
    if (!phone || phone.replace(/\D/g, "").length < 7) {
      setError("הזינו מספר תקין");
      return;
    }

    setBusy(true);
    setError("");
    setPadOpen(false);

    try {
      const statusRes = await API.get("/staff/softphone/status");
      const mode: SoftphoneMode =
        statusRes.data?.mode === "voip" ? "voip" : "device";

      const logRes = await API.post("/staff/softphone/calls", {
        toNumber: phone,
        contactName: "",
        contactSource: "manual",
        mode,
        direction: "outbound",
        status: "initiated",
      });
      const logId = logRes.data?.call?._id || null;

      setActiveCall({
        logId,
        phone,
        contactName: formatDisplayPhone(phone),
        mode,
        status: "connecting",
        startedAt: Date.now(),
        muted: false,
        held: false,
      });

      if (mode === "voip") {
        try {
          const tokenRes = await API.get("/staff/softphone/token");
          const device = await ensureTwilioDevice(tokenRes.data.token);
          const call = await device.connect({ params: { To: phone } });
          twilioCall = call;

          call.on("ringing", () => {
            setActiveCall((prev) =>
              prev ? { ...prev, status: "ringing" } : prev
            );
          });
          call.on("accept", () => {
            setActiveCall((prev) =>
              prev ? { ...prev, status: "in-progress" } : prev
            );
            if (logId) {
              void API.patch(`/staff/softphone/calls/${logId}`, {
                status: "in-progress",
                twilioCallSid: call.parameters?.CallSid || "",
              });
            }
          });
          call.on("disconnect", () => {
            void endCall("completed");
          });
          call.on("error", () => {
            setError("שגיאת שיחה");
            void endCall("failed");
          });
          setActiveCall((prev) =>
            prev ? { ...prev, status: "ringing" } : prev
          );
        } catch {
          const a = document.createElement("a");
          a.href = `tel:${phone}`;
          a.rel = "noopener";
          a.click();
          setActiveCall((prev) =>
            prev
              ? { ...prev, mode: "device", status: "in-progress" }
              : prev
          );
        }
      } else {
        const a = document.createElement("a");
        a.href = `tel:${phone}`;
        a.rel = "noopener";
        a.click();
        setActiveCall((prev) =>
          prev ? { ...prev, status: "in-progress" } : prev
        );
        if (logId) {
          void API.patch(`/staff/softphone/calls/${logId}`, {
            status: "in-progress",
          });
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "לא הצלחנו להתחיל שיחה");
      setActiveCall(null);
    } finally {
      setBusy(false);
    }
  }, [activeCall, busy, digits, endCall]);

  const toggleMute = useCallback(() => {
    setActiveCall((prev) => {
      if (!prev || prev.held) return prev;
      const next = !prev.muted;
      try {
        if (prev.mode === "voip" && twilioCall) twilioCall.mute(next);
      } catch {
        /* ignore */
      }
      return { ...prev, muted: next };
    });
  }, []);

  const toggleHold = useCallback(() => {
    setActiveCall((prev) => {
      if (!prev || prev.status !== "in-progress") return prev;
      const nextHeld = !prev.held;
      if (nextHeld) {
        mutedBeforeHold = prev.muted;
        try {
          if (prev.mode === "voip" && twilioCall) twilioCall.mute(true);
        } catch {
          /* ignore */
        }
        startHoldMusic();
        return { ...prev, held: true, muted: true };
      }
      stopHoldMusic();
      const restore = mutedBeforeHold;
      mutedBeforeHold = false;
      try {
        if (prev.mode === "voip" && twilioCall) twilioCall.mute(restore);
      } catch {
        /* ignore */
      }
      return { ...prev, held: false, muted: restore };
    });
  }, []);

  const handleSearch = () => {
    const phone = digits.trim();
    if (!phone) return;
    navigate(`/staff/profile?phone=${encodeURIComponent(phone)}`);
  };

  const statusTone = isOnBreak
    ? "bg-amber-100 text-amber-800 ring-amber-200"
    : isWorking
      ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";

  const statusText = isOnBreak
    ? "בהפסקה"
    : isWorking
      ? "פעיל"
      : "לא פעיל";

  return (
    <div
      ref={rootRef}
      dir="rtl"
      className="sticky top-0 z-[900] border-b border-violet-200/80 bg-gradient-to-l from-[#f7f3ff] via-white to-[#eefbf8] shadow-[0_8px_30px_rgba(91,44,255,0.08)]"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
        {/* Shift / status */}
        <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-violet-100 bg-white/80 px-3 py-2 shadow-sm">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-[#7C4DFF]">
            <Timer className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-bold text-slate-400">זמן משמרת</p>
            <p className="font-mono text-sm font-black text-slate-800" dir="ltr">
              {shiftLabel}
            </p>
          </div>
          <span
            className={`ms-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${statusTone}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusText}
          </span>
        </div>

        {!isWorking ? (
          <IconBtn
            label="התחל משמרת"
            tone="violet"
            onClick={() => {
              setIsWorking(true);
              setShiftSec(0);
              setIsOnBreak(false);
            }}
          >
            <Play className="h-4 w-4" />
          </IconBtn>
        ) : (
          <>
            <IconBtn
              label={isOnBreak ? "חזרה" : "הפסקה"}
              tone="amber"
              active={isOnBreak}
              onClick={() => setIsOnBreak((v) => !v)}
            >
              <Coffee className="h-4 w-4" />
            </IconBtn>
            <IconBtn
              label="סיום"
              tone="rose"
              onClick={() => {
                setIsWorking(false);
                setIsOnBreak(false);
              }}
            >
              <Power className="h-4 w-4" />
            </IconBtn>
          </>
        )}

        <div className="mx-1 hidden h-8 w-px bg-violet-100 sm:block" />

        {/* Softphone row */}
        {activeCall ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 rounded-2xl border border-teal-200 bg-gradient-to-l from-teal-50 to-white px-3 py-2 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/30">
              <PhoneCall className="h-4 w-4" />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-black text-slate-900">
                {activeCall.contactName || formatDisplayPhone(activeCall.phone)}
              </p>
              <p className="text-[11px] font-bold text-teal-700">
                {activeCall.status === "connecting"
                  ? "מתחבר..."
                  : activeCall.status === "ringing"
                    ? "מצלצל..."
                    : activeCall.held
                      ? "בהמתנה"
                      : formatCallDuration(callElapsed)}
              </p>
            </div>

            <div className="ms-auto flex items-center gap-1.5">
              <IconBtn
                label={activeCall.muted ? "השמע" : "השתק"}
                tone="amber"
                active={activeCall.muted}
                disabled={activeCall.mode !== "voip" || activeCall.held}
                onClick={toggleMute}
              >
                {activeCall.muted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </IconBtn>
              <IconBtn
                label={activeCall.held ? "המשך" : "המתנה"}
                tone="amber"
                active={activeCall.held}
                disabled={activeCall.status !== "in-progress"}
                onClick={toggleHold}
              >
                {activeCall.held ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </IconBtn>
              <IconBtn
                label="נתק"
                tone="rose"
                onClick={() => void endCall()}
              >
                <PhoneOff className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>
        ) : (
          <div className="relative flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
              <Phone className="h-4 w-4 shrink-0 text-[#7C4DFF]" />
              <input
                value={digits}
                onChange={(e) =>
                  setDigits(e.target.value.replace(/[^\d+*#]/g, ""))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") void startCall();
                }}
                placeholder="חייגו מספר טלפון..."
                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setPadOpen((v) => !v)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  padOpen
                    ? "bg-violet-100 text-[#7C4DFF]"
                    : "text-slate-400 hover:bg-slate-50 hover:text-[#7C4DFF]"
                }`}
                aria-label="לוח חיוג"
                title="לוח חיוג"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>

            <IconBtn
              label="חיוג"
              tone="emerald"
              disabled={busy}
              onClick={() => void startCall()}
            >
              <Phone className="h-4 w-4" />
            </IconBtn>

            <IconBtn
              label="חיפוש"
              tone="slate"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </IconBtn>

            {voipReady ? (
              <span className="hidden text-[11px] font-bold text-emerald-600 sm:inline">
                VoIP מוכן
              </span>
            ) : (
              <span className="hidden text-[11px] font-bold text-slate-400 sm:inline">
                מצב מכשיר
              </span>
            )}

            <AnimatePresence>
              {padOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute start-0 top-[calc(100%+8px)] z-20 w-[min(280px,calc(100vw-24px))] rounded-2xl border border-violet-100 bg-white p-3 shadow-2xl shadow-violet-500/15"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {KEYPAD.map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() =>
                          setDigits((prev) =>
                            prev.length >= 18 ? prev : `${prev}${digit}`
                          )
                        }
                        className="h-11 rounded-xl border border-slate-100 bg-slate-50 text-lg font-black text-slate-800 transition hover:border-violet-200 hover:bg-violet-50"
                      >
                        {digit}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => void startCall()}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 py-2.5 text-sm font-black text-white shadow-md shadow-emerald-500/25"
                  >
                    <Phone className="h-4 w-4" />
                    חייג
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>

      {error ? (
        <div className="border-t border-rose-100 bg-rose-50 px-4 py-1.5 text-center text-xs font-bold text-rose-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  children,
  tone = "slate",
  active = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "slate" | "violet" | "emerald" | "amber" | "rose";
  active?: boolean;
  disabled?: boolean;
}) {
  const tones: Record<string, string> = {
    slate: active
      ? "bg-slate-800 text-white"
      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
    violet: active
      ? "bg-[#7C4DFF] text-white"
      : "bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/25 hover:brightness-105",
    emerald:
      "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:brightness-105",
    amber: active
      ? "bg-amber-500 text-white"
      : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
    rose: "bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-md shadow-rose-500/25 hover:brightness-105",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-black transition disabled:opacity-40 ${tones[tone]}`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
