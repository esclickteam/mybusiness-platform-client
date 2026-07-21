import React from "react";

import StoreProductsManager from "../../store/StoreProductsManager";

type SitePaymentsPanelProps = {
  businessId: string;
};

export default function SitePaymentsPanel({ businessId }: SitePaymentsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[28px] border border-emerald-100 bg-gradient-to-l from-emerald-50 via-white to-white p-5 md:p-6">
        <h2 className="text-xl font-black text-slate-950">סליקה ותשלומים</h2>
        <p className="mt-1 max-w-2xl text-sm font-bold leading-7 text-slate-500">
          חברו ספקי סליקה — Stripe, PayPal, Tranzila, Grow, העברה בנקאית
          ועוד. ההגדרות חלות על תשלומים מהאתר.
        </p>
      </div>

      <StoreProductsManager
        businessId={businessId}
        embedded
        initialView="settings"
        allowedViews={["settings"]}
        settingsFocus="payments"
      />
    </div>
  );
}
