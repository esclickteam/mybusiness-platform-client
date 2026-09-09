"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type UpgradeOfferCardProps = {
  onUpgrade: () => void | Promise<void>;
  onClose: () => void | Promise<void>;
  expiresAt?: string | Date | null;
};

const EARLY_BIRD_DISMISSED_KEY = "bizuplyEarlyBirdDismissed";

function formatTimeLeft(
  ms: number,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return t("billing.earlyBird.timeLeft", { hours, minutes });
}

export default function UpgradeOfferCard({
  onUpgrade,
  onClose,
  expiresAt,
}: UpgradeOfferCardProps) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());
  const [dismissed, setDismissed] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    console.log("🎉 UpgradeOfferCard MOUNTED", { expiresAt });
  }, [expiresAt]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const wasDismissed =
      sessionStorage.getItem(EARLY_BIRD_DISMISSED_KEY) === "true";

    setDismissed(wasDismissed);
  }, []);

  const fallbackExpiresAt = useMemo(() => {
    return Date.now() + 48 * 60 * 60 * 1000;
  }, []);

  const targetTs = useMemo(() => {
    if (!expiresAt) return fallbackExpiresAt;

    const parsed = new Date(expiresAt).getTime();

    return Number.isFinite(parsed) ? parsed : fallbackExpiresAt;
  }, [expiresAt, fallbackExpiresAt]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(id);
  }, []);

  const msLeft = Math.max(0, targetTs - now);
  const isExpired = msLeft <= 0;

  const handleClose = async () => {
    // סוגר מיידית — לא מחכה לשרת
    setDismissed(true);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(EARLY_BIRD_DISMISSED_KEY, "true");
    }

    try {
      await onClose?.();
    } catch (error) {
      console.warn("Early bird close failed, but modal is already closed:", error);
    }
  };

  const handleUpgrade = async () => {
    if (upgrading || isExpired) return;

    try {
      setUpgrading(true);
      await onUpgrade?.();
    } catch (error) {
      console.error("Early bird upgrade failed:", error);
      alert(t("billing.earlyBird.checkoutFailed"));
    } finally {
      setUpgrading(false);
    }
  };

  if (dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="
        fixed inset-0 z-[999999]
        flex items-center justify-center
        bg-black/45 px-4
        pointer-events-auto
      "
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="
          relative z-[1000000]
          w-full max-w-[430px]
          overflow-hidden rounded-[28px]
          border border-white/70
          bg-white
          p-6 text-center
          shadow-[0_28px_90px_rgba(15,23,42,0.28)]
          pointer-events-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#F59E0B]" />

        <button
          type="button"
          aria-label={t("billing.earlyBird.closeAria")}
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="
            absolute right-4 top-4 z-[1000001]
            flex h-9 w-9 items-center justify-center
            rounded-full border border-slate-200
            bg-white text-2xl font-black leading-none text-slate-500
            shadow-sm transition
            hover:bg-slate-50 hover:text-slate-900
            active:scale-95
            pointer-events-auto
          "
        >
          ×
        </button>

        <div
          className="
            mx-auto mb-4 inline-flex items-center gap-2
            rounded-full border border-violet-100
            bg-violet-50 px-4 py-2
            text-sm font-extrabold text-violet-700
          "
        >
          🎁 {t("billing.earlyBird.badge")}
        </div>

        <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-800">
          {t("billing.earlyBird.titleLead")}{" "}
          <span className="text-violet-700">₪119</span>
          <span className="ml-2 align-middle text-lg font-black text-slate-400 line-through">
            ₪149
          </span>
        </h2>

        <p className="mb-4 text-sm font-bold text-emerald-600">
          {t("billing.earlyBird.save")}
        </p>

        {!isExpired && (
          <p className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            {t("billing.earlyBird.endsIn", {
              time: formatTimeLeft(msLeft, t),
            })}
          </p>
        )}

        <p className="mb-4 text-[15px] leading-7 text-slate-600">
          {t("billing.earlyBird.body")}
        </p>

        <p className="mb-5 text-sm text-slate-500">
          {t("billing.earlyBird.thenMonthly")}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUpgrade();
          }}
          disabled={isExpired || upgrading}
          className="
            relative z-[1000001]
            w-full rounded-2xl
            bg-gradient-to-r from-[#6D28D9] to-[#DB2777]
            px-5 py-4
            text-base font-black text-black
            shadow-[0_16px_36px_rgba(109,40,217,0.28)]
            transition
            hover:scale-[1.01]
            active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60
            pointer-events-auto
          "
        >
          {upgrading
            ? t("billing.earlyBird.checkoutBusy")
            : t("billing.earlyBird.cta")}
        </button>

        <p className="mt-4 text-xs font-semibold text-slate-400">
          {t("billing.earlyBird.finePrint")}
        </p>
      </div>
    </div>
  );
}
