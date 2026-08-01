import React, { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneCall, PhoneIncoming } from "lucide-react";

import {
  getAdminSoftphoneState,
  subscribeAdminSoftphone,
  toggleSoftphoneOpen,
} from "../utils/adminSoftphoneStore";

/** Header trigger only — the softphone UI lives in AdminSoftphoneHost. */
export default function AdminSoftphoneLauncher() {
  const { open, activeCall } = useSyncExternalStore(
    subscribeAdminSoftphone,
    getAdminSoftphoneState,
    getAdminSoftphoneState
  );

  const inCall =
    Boolean(activeCall) &&
    ["connecting", "ringing", "incoming", "in-progress"].includes(
      activeCall?.status || ""
    );
  const isIncoming = activeCall?.status === "incoming";

  return (
    <button
      type="button"
      data-softphone-launcher="true"
      onClick={() => toggleSoftphoneOpen()}
      aria-label="סופטפון"
      className={[
        "relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-12 sm:w-12",
        isIncoming
          ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white text-emerald-600"
          : inCall
            ? "border-teal-300 bg-gradient-to-br from-teal-50 to-white text-teal-600"
            : open
              ? "border-violet-300 bg-gradient-to-br from-[#F3EEFF] to-white text-[#7C4DFF]"
              : "border-slate-200 bg-white text-slate-500 hover:border-violet-200 hover:text-[#7C4DFF]",
      ].join(" ")}
    >
      {isIncoming ? (
        <motion.span
          animate={{ rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          className="inline-flex"
        >
          <PhoneIncoming className="h-5 w-5" strokeWidth={2.2} />
        </motion.span>
      ) : inCall ? (
        <PhoneCall className="h-5 w-5" strokeWidth={2.2} />
      ) : (
        <Phone className="h-5 w-5" strokeWidth={2.2} />
      )}
      {(inCall || isIncoming) && (
        <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </button>
  );
}
