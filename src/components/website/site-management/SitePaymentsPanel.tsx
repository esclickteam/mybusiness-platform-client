import React from "react";
import { CreditCard } from "lucide-react";

import StoreProductsManager from "../../store/StoreProductsManager";
import { SitePanelHero } from "./SitePanelShell";

type SitePaymentsPanelProps = {
  businessId: string;
};

export default function SitePaymentsPanel({ businessId }: SitePaymentsPanelProps) {
  return (
    <div className="space-y-5">
      <SitePanelHero
        icon={CreditCard}
        accent="#059669"
        title="סליקה ותשלומים"
        description="חברו ספקי סליקה — Stripe, PayPal, Tranzila, Grow, העברה בנקאית ועוד. ההגדרות חלות על תשלומים מהאתר."
      />

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
