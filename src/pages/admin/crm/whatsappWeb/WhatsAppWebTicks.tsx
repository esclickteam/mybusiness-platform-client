import React from "react";
import { tickKind } from "./whatsAppWebMessages";

export function WhatsAppWebTicks({ status }: { status?: string }) {
  const kind = tickKind(status);
  if (kind === "failed") {
    return (
      <span className="text-[11px] font-black text-rose-600" title="נכשל">
        !
      </span>
    );
  }
  if (kind === "pending") {
    return (
      <span className="text-[10px] text-slate-400" title="ממתין">
        ○
      </span>
    );
  }
  const color = kind === "read" ? "#53bdeb" : "#667781";
  const double = kind === "delivered" || kind === "read";
  return (
    <span
      className="inline-flex translate-y-[1px]"
      title={kind === "read" ? "נקרא" : kind === "delivered" ? "נמסר" : "נשלח"}
      aria-label={kind}
    >
      <svg width={double ? 16 : 12} height="11" viewBox={double ? "0 0 16 11" : "0 0 12 11"} fill="none">
        <path
          d="M1.5 6.2 4.2 9 10.5 1.8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {double ? (
          <path
            d="M6.2 6.2 8.4 9 14.5 1.8"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
    </span>
  );
}
