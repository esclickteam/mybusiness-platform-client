import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard } from "lucide-react";

import BizuplyLoader from "../../ui/BizuplyLoader";
import {
  deleteSitePaymentProvider,
  getSitePaymentProviders,
  saveSitePaymentProvider,
  type SitePaymentCredentials,
  type SitePaymentProvider,
} from "../../../api/sitePaymentsApi";
import { SitePanelHero } from "./SitePanelShell";
import PaymentsProviderGallery from "./payments/PaymentsProviderGallery";
import PaymentProviderConnectView from "./payments/PaymentProviderConnectView";
import {
  getPaymentProviderCatalogItem,
  type PaymentProviderCatalogItem,
} from "./payments/paymentProvidersCatalog";

type SitePaymentsPanelProps = {
  businessId: string;
};

export default function SitePaymentsPanel({ businessId }: SitePaymentsPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [providers, setProviders] = useState<SitePaymentProvider[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadProviders = useCallback(async () => {
    if (!businessId) return;

    setLoading(true);
    setMessage(null);

    try {
      const data = await getSitePaymentProviders(businessId);
      setProviders(data.providers || []);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "שגיאה בטעינת ספקי התשלום",
      });
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const activeCatalogItem = useMemo(
    () => (activeKey ? getPaymentProviderCatalogItem(activeKey) : null),
    [activeKey]
  );

  const activeExisting = useMemo(
    () => providers.find((item) => item.provider === activeKey) || null,
    [providers, activeKey]
  );

  function openProvider(item: PaymentProviderCatalogItem) {
    setMessage(null);
    setActiveKey(item.key);
  }

  async function handleConnect(payload: {
    credentials: SitePaymentCredentials;
    installmentsEnabled: boolean;
    mode: "test" | "live";
  }) {
    if (!businessId || !activeCatalogItem) return;

    setSaving(true);
    setMessage(null);

    try {
      const result = await saveSitePaymentProvider(businessId, {
        provider: activeCatalogItem.key,
        label: activeCatalogItem.name,
        isEnabled: true,
        isPrimary: true,
        mode: payload.mode,
        installmentsEnabled: payload.installmentsEnabled,
        credentials: payload.credentials,
        connectionStatus: "connected",
        lastConnectionCheckAt: new Date().toISOString(),
      });

      if (result.settings?.paymentProviders) {
        setProviders(result.settings.paymentProviders);
      } else if (result.provider) {
        setProviders((prev) => {
          const others = prev.filter(
            (item) => item.provider !== result.provider?.provider
          );
          return [...others, result.provider as SitePaymentProvider];
        });
      } else {
        await loadProviders();
      }

      setMessage({
        type: "success",
        text: `${activeCatalogItem.name} חובר בהצלחה`,
      });
      setActiveKey(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "שגיאה בחיבור ספק התשלום",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!businessId || !activeCatalogItem) return;
    if (!window.confirm(`לנתק את ${activeCatalogItem.name}?`)) return;

    setDisconnecting(true);
    setMessage(null);

    try {
      const result = await deleteSitePaymentProvider(
        businessId,
        activeCatalogItem.key
      );

      if (result.settings?.paymentProviders) {
        setProviders(result.settings.paymentProviders);
      } else {
        setProviders((prev) =>
          prev.filter((item) => item.provider !== activeCatalogItem.key)
        );
      }

      setMessage({
        type: "success",
        text: `${activeCatalogItem.name} נותק בהצלחה`,
      });
      setActiveKey(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          "שגיאה בניתוק ספק התשלום",
      });
    } finally {
      setDisconnecting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <BizuplyLoader size="md" label="טוען ספקי תשלום..." />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SitePanelHero
        icon={CreditCard}
        accent="#059669"
        title="תשלומים"
        description="חברו ספקי סליקה לקבלת תשלומים מהאתר — Max, PayPal, bit, Grow, PayPlus, Tranzila ו-Cal."
      />

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {activeCatalogItem ? (
        <PaymentProviderConnectView
          catalogItem={activeCatalogItem}
          existing={activeExisting}
          saving={saving}
          disconnecting={disconnecting}
          onCancel={() => setActiveKey(null)}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <PaymentsProviderGallery
          savedProviders={providers}
          onConnect={openProvider}
          onManage={openProvider}
        />
      )}
    </div>
  );
}
