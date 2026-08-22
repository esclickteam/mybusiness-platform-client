import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BellRing, Loader2, X } from "lucide-react";

import {
  getPermission,
  isIos,
  isPushSupported,
  isStandalone,
  isSubscribed,
  subscribeToPush,
} from "../utils/push";

const DISMISS_KEY = "bizuply-admin-push-banner-dismissed";

function shouldShowBanner() {
  if (!isPushSupported()) return false;
  if (typeof window === "undefined") return false;
  if (sessionStorage.getItem(DISMISS_KEY) === "1") return false;

  const permission = getPermission();
  if (permission === "denied") return false;

  if (isIos() && !isStandalone()) return true;

  return permission !== "granted";
}

/**
 * Persistent admin PWA prompt — portaled to body so header blur cannot trap it.
 * Shown on /admin until push permission is granted and the device is subscribed.
 */
export default function AdminPushPermissionBanner() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [iosInstall, setIosInstall] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      if (!shouldShowBanner()) {
        if (!cancelled) setVisible(false);
        return;
      }

      const permission = getPermission();
      if (permission === "granted") {
        const subscribed = await isSubscribed();
        if (!cancelled) setVisible(!subscribed);
        return;
      }

      if (!cancelled) {
        setIosInstall(isIos() && !isStandalone());
        setVisible(true);
      }
    }

    void refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function handleEnable() {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      if (iosInstall) {
        setMessage("באייפון: Safari → שיתוף → הוסף למסך הבית, ואז פתחו מהאייקון");
        return;
      }
      const result = await subscribeToPush();
      if (!result.ok) {
        if (result.reason === "ios-install") {
          setIosInstall(true);
          setMessage("באייפון: הוסיפו למסך הבית ופתחו מהאייקון");
          return;
        }
        if (result.reason === "denied") {
          setMessage("התראות חסומות — אשרו בהגדרות האתר (🔒 ליד הכתובת)");
          setVisible(false);
          return;
        }
        setMessage("לא הצלחנו להפעיל התראות — נסו שוב");
        return;
      }
      setVisible(false);
    } finally {
      setBusy(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="admin-push-banner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          dir="rtl"
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[9990] mx-auto max-w-lg sm:inset-x-auto sm:left-6 sm:right-auto"
        >
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-l from-amber-50 via-white to-white p-3 shadow-[0_16px_48px_rgba(15,23,42,0.18)] ring-1 ring-amber-100">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-500 shadow-sm ring-1 ring-amber-100">
                <BellRing className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-slate-900">
                  הפעילו התראות Push באדמין
                </p>
                <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-600">
                  {iosInstall
                    ? "באייפון צריך לפתוח את האפליקציה מהמסך הבית כדי לקבל התראות על שיחות וצ׳אט."
                    : "קבלו בטלפון התראות על שיחות חדשות, תזכורות ופניות תמיכה."}
                </p>
                {message ? (
                  <p className="mt-2 text-[11px] font-bold text-amber-800">
                    {message}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleEnable()}
                  disabled={busy}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-red-500 px-3 text-xs font-black text-white shadow-sm disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <BellRing className="h-4 w-4" />
                  )}
                  {iosInstall ? "איך מתקינים PWA" : "אפשרו התראות עכשיו"}
                </button>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="סגור"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
