import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../i18n/localeUtils";
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
  isProviderConnected,
  type PaymentProviderCatalogItem,
} from "./payments/paymentProvidersCatalog";
import { SitePanelCard } from "./SitePanelShell";

type SitePaymentsPanelProps = {
  businessId: string;
};

export default function SitePaymentsPanel({ businessId }: SitePaymentsPanelProps) {
  const { t, i18n } = useTranslation();
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
          t("leftover.sitePayments.loadError", "Could not load payment providers"),
      });
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

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

  const connectedProviders = useMemo(
    () =>
      providers.filter((item) =>
        isProviderConnected(item.connectionStatus, item.isEnabled)
      ),
    [providers]
  );

  const primaryConnected = useMemo(() => {
    return (
      connectedProviders.find((item) => item.isPrimary) ||
      connectedProviders[0] ||
      null
    );
  }, [connectedProviders]);

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
        text: t("leftover.sitePayments.connectedOk", {
          name: activeCatalogItem.name,
          defaultValue: "{{name}} connected successfully",
        }),
      });
      setActiveKey(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          t("leftover.sitePayments.connectError", "Could not connect the payment provider"),
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    if (!businessId || !activeCatalogItem) return;
    if (
      !window.confirm(
        t("leftover.sitePayments.disconnectConfirm", {
          name: activeCatalogItem.name,
          defaultValue: "Disconnect {{name}}?",
        })
      )
    )
      return;

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
        text: t("leftover.sitePayments.disconnectedOk", {
          name: activeCatalogItem.name,
          defaultValue: "{{name}} disconnected successfully",
        }),
      });
      setActiveKey(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          err?.response?.data?.error ||
          err?.message ||
          t("leftover.sitePayments.disconnectError", "Could not disconnect the payment provider"),
      });
    } finally {
      setDisconnecting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <BizuplyLoader
          size="md"
          label={t("leftover.sitePayments.loading", "Loading payment providers...")}
        />
      </div>
    );
  }

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-5 text-start">
      <SitePanelHero
        icon={CreditCard}
        accent="#059669"
        title={t("leftover.sitePayments.title", "Payments")}
        description={t(
          "leftover.sitePayments.description",
          "Connect checkout providers to the site. The live-site cart uses the connected provider you mark as primary (PayPal, Stripe, and more)."
        )}
      />

      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-right text-sm font-medium ${
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
        <>
          {primaryConnected ? (
            <SitePanelCard className="text-right">
              <h3 className="text-sm font-bold text-slate-900">
                {t("leftover.sitePayments.connectedToSite", {
                  name: primaryConnected.label || primaryConnected.provider,
                  defaultValue: "{{name}} is connected to the site",
                })}
              </h3>
              <ol className="mt-2 space-y-1 text-sm text-slate-600">
                <li>
                  {t(
                    "leftover.sitePayments.stepAdd",
                    "1. Add products from the store / template to the live-site cart."
                  )}
                </li>
                <li>
                  {t(
                    "leftover.sitePayments.stepCheckout",
                    "2. Click checkout — the cart opens with the connected provider."
                  )}
                </li>
                <li>
                  {t("leftover.sitePayments.stepPay", {
                    name: primaryConnected.label || primaryConnected.provider,
                    defaultValue: "3. The customer pays through {{name}}.",
                  })}
                </li>
              </ol>
            </SitePanelCard>
          ) : null}
          <PaymentsProviderGallery
            savedProviders={providers}
            onConnect={openProvider}
            onManage={openProvider}
          />
        </>
      )}
    </div>
  );
}
