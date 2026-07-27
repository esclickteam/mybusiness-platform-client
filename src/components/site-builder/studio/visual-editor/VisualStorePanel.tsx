import React from "react";
import { ShoppingBag, X } from "lucide-react";

import StoreProductsManager from "../../../store/StoreProductsManager";

type VisualStorePanelProps = {
  open: boolean;
  businessId?: string;
  onClose: () => void;
};

export default function VisualStorePanel({
  open,
  businessId,
  onClose,
}: VisualStorePanelProps) {
  if (!open) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[80] flex justify-start">
      <button
        type="button"
        aria-label="סגירת ניהול חנות"
        className="pointer-events-auto absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside
        dir="rtl"
        className="pointer-events-auto relative flex h-full w-full max-w-[min(100%,860px)] flex-col border-l border-slate-200 bg-[#f7f8fc] shadow-[-20px_0_60px_rgba(15,23,42,0.18)]"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-slate-800">
                ניהול חנות
              </h2>
              <p className="truncate text-xs font-bold text-slate-500">
                מוצרים, מלאי, הזמנות והגדרות
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 sm:px-4">
          {businessId ? (
            <StoreProductsManager businessId={businessId} embedded />
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <p className="text-sm font-black text-slate-700">
                לא נמצא מזהה עסק לניהול החנות
              </p>
              <p className="mt-2 text-xs font-bold text-slate-500">
                רעננו את העורך או פתחו את האתר מתוך לוח הבקרה
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
