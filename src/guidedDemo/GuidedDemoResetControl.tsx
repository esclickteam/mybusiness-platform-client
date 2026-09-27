import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { isGuidedDemoActive } from "./sessionStore";
import { resetGuidedDemoSession } from "../api/guidedDemoApi";

/** Small demo-only control. Restores sandbox fixtures and never touches a live account. */
export default function GuidedDemoResetControl() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!isGuidedDemoActive()) return null;

  const reset = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await resetGuidedDemoSession();
      window.location.reload();
    } catch {
      toast.error(
        t(
          "leftover.guided.resetFailed",
          "Could not reset the demo. Your live account was not changed."
        )
      );
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("leftover.guided.demoControls", "Demo controls")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="grid h-7 w-7 place-items-center rounded-full text-sm font-black text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        ⋯
      </button>
      {open ? (
        <div className="absolute start-0 top-8 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button
            type="button"
            disabled={busy}
            onClick={() => void reset()}
            className="w-full rounded-lg px-3 py-2 text-start text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            {busy
              ? t("leftover.guided.resetting", "Resetting…")
              : t("leftover.guided.resetDemo", "Reset demo data")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
