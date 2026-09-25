import React from "react";
import { cardBase } from "../../../../styles/bizuplyUi";

/** Local tab-content skeleton — never replaces the WhatsApp hub chrome. */
export default function WhatsAppTabSuspenseFallback() {
  return (
    <div
      className="space-y-3"
      aria-busy="true"
      aria-live="polite"
      data-testid="whatsapp-tab-suspense"
    >
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`${cardBase} h-[72px] animate-pulse bg-slate-50`}
          />
        ))}
      </div>
      <div className={`${cardBase} h-40 animate-pulse bg-slate-50`} />
    </div>
  );
}
