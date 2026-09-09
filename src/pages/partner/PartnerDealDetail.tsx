import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchPartnerDeal,
  partnerApiError,
  startPartnerDealCheckout,
  updatePartnerDeal,
  retryPartnerDealActivation,
  changePartnerDealEmail,
  linkPartnerDealBusiness,
  type PartnerServiceRow,
} from "../../lib/partnerApi";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { billingLabel, isCommissionSku, publicPackageLabel } from "../../lib/partnerDealMath";
import { formatIls } from "../../lib/partnerMoney";
import { absoluteCustomerUrl } from "../../lib/partnerBranding";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import type { PartnerClient, PartnerDeal } from "../../types/partner";
import { catalogProductName } from "../../i18n/partnerCatalogCopy";
import { localizePartnerDemoName, localizePartnerDemoText } from "../../i18n/partnerDemoCopy";
import { getIntlLocale } from "../../i18n/localeUtils";

export default function PartnerDealDetail() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { dealId } = useParams();
  const [params] = useSearchParams();
  const [deal, setDeal] = useState<PartnerDeal | null>(null);
  const [client, setClient] = useState<PartnerClient | null>(null);
  const [stripeItems, setStripeItems] = useState<any[]>([]);
  const [serviceRows, setServiceRows] = useState<PartnerServiceRow[]>([]);
  const [billingSafety, setBillingSafety] = useState<{
    enabled?: boolean;
    mode?: string;
    message?: string;
  } | null>(null);
  const [packageDisplayName, setPackageDisplayName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [lineNames, setLineNames] = useState<Record<string, string>>({});
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [email, setEmail] = useState("");
  const [businessId, setBusinessId] = useState("");
  const paidReturn = params.get("paid") === "1";
  const [recovering, setRecovering] = useState("");
  const [confirmingPayment, setConfirmingPayment] = useState(paidReturn);

  useEffect(() => {
    if (!dealId) return;
    let cancelled = false;

    function applyDeal(
      data: {
        deal: PartnerDeal;
        client?: PartnerClient | null;
        stripeItems?: any[];
        serviceRows?: PartnerServiceRow[];
        billingSafety?: { enabled?: boolean; mode?: string; message?: string } | null;
      },
      { hydrateForm = false } = {}
    ) {
      setDeal(data.deal);
      setClient(data.client || null);
      setStripeItems(data.stripeItems || []);
      setServiceRows(data.serviceRows || []);
      setBillingSafety(data.billingSafety || null);
      if (hydrateForm) {
        setEmail(data.client?.contact?.email || "");
        setPackageDisplayName(
          publicPackageLabel(
            localizePartnerDemoText(t, data.deal.packageDisplayName),
            undefined,
            t
          )
        );
        setPackageDescription(data.deal.packageDescription || "");
        const names: Record<string, string> = {};
        for (const line of data.deal.lines || []) {
          if (isCommissionSku(line.sku)) continue;
          const localized = catalogProductName(t, line);
          names[line.sku] = publicPackageLabel(localized, localized || line.sku, t);
        }
        setLineNames(names);
      }
      return data.deal;
    }

    function isPaid(row?: PartnerDeal | null) {
      return row?.paymentStatus === "paid" || row?.status === "paid";
    }

    function activationSettled(row?: PartnerDeal | null) {
      const activation = row?.activationStatus;
      return activation === "active" || activation === "requires_action" || activation === "failed";
    }

    (async () => {
      try {
        const first = applyDeal(await fetchPartnerDeal(dealId), { hydrateForm: true });
        if (cancelled) return;
        if (!paidReturn || (isPaid(first) && activationSettled(first))) {
          setConfirmingPayment(false);
          return;
        }
        setConfirmingPayment(!isPaid(first));
        for (let attempt = 0; attempt < 12 && !cancelled; attempt += 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const next = applyDeal(await fetchPartnerDeal(dealId));
          if (cancelled) return;
          setConfirmingPayment(!isPaid(next));
          if (isPaid(next) && activationSettled(next)) {
            setConfirmingPayment(false);
            return;
          }
        }
        if (!cancelled) setConfirmingPayment(false);
      } catch (err: unknown) {
        if (!cancelled) setError(partnerApiError(err, t("partner.errors.deal")));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dealId, paidReturn]);

  if (!deal && !error) return <BizuplyLoader label={t("partner.deal.loading")} />;
  if (!deal) {
    return <p className="font-black text-rose-700">{error}</p>;
  }

  const totals = deal.totals || ({} as PartnerDeal["totals"]);
  const isPaid = deal.paymentStatus === "paid" || deal.status === "paid";
  const canceled = params.get("canceled") === "1";
  const publicUrl = absoluteCustomerUrl(deal.publicUrl || `/partner/deals/${deal._id}`);

  async function payBizuply() {
    if (!dealId) return;
    setPaying(true);
    setError("");
    try {
      const data = await startPartnerDealCheckout(dealId);
      if (data.url) window.location.href = data.url;
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.checkout")));
      setPaying(false);
    }
  }

  async function savePresentation() {
    if (!dealId) return;
    setSavingName(true);
    setError("");
    try {
      const data = await updatePartnerDeal(dealId, {
        packageDisplayName,
        packageDescription,
        lineNames: Object.entries(lineNames).map(([sku, displayNameHe]) => ({ sku, displayNameHe })),
      });
      setDeal(data.deal);
      if (data.serviceRows) setServiceRows(data.serviceRows);
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.savePackageName")));
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.deal.eyebrow", { number: deal.dealNumber })}
        title={
          localizePartnerDemoName(t, client?.contact?.businessName, {
            personaKey: client?.personaKey,
            field: "businessName",
          }) || t("partner.deal.title")
        }
        subtitle={t("partner.deal.subtitle")}
      />
      {confirmingPayment && !isPaid ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">
          {t("partner.deal.confirmingStripe")}
        </p>
      ) : null}
      {isPaid ? (
        <div className="space-y-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
          <p>{t("partner.deal.bizuplyPaid")}</p>
          {(deal as any).pipelineStatus === "completed" ? (
            <p>{t("partner.deal.activatedEligible")}</p>
          ) : (
            <p>
              {t("partner.deal.pendingUntilActive")}
            </p>
          )}
          {deal.clientProvisioning?.status === "created" ? (
            <p>
              {t("partner.deal.userCreated")}
              {deal.clientProvisioning.email ? ` (${deal.clientProvisioning.email})` : ""}.
              {deal.clientProvisioning.welcomeEmailSent
                ? ` ${t("partner.deal.passwordSent")}`
                : ` ${t("partner.deal.sendCredentials")}`}
            </p>
          ) : null}
          {deal.clientProvisioning?.status === "already_active" ? (
            <p>{t("partner.deal.alreadyHasUser")}</p>
          ) : null}
          {deal.clientProvisioning?.status === "email_exists" ? (
            <p>{t("partner.deal.emailExists")}</p>
          ) : null}
          {deal.clientProvisioning?.status === "failed" ? (
            <p>{t("partner.deal.userCreateFailed")}{deal.clientProvisioning.error ? `: ${deal.clientProvisioning.error}` : ""}.</p>
          ) : null}
        </div>
      ) : null}
      {canceled ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">
          {t("partner.deal.paymentCancelled")}
        </p>
      ) : null}
      {error ? <p className="font-black text-rose-700">{error}</p> : null}
      {billingSafety && billingSafety.enabled === false ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-800">
          {t("partner.deal.billingDisabled")}
          {billingSafety.message ? ` — ${billingSafety.message}` : ""}
        </p>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <label className="block">
          <span className="text-xs font-black text-slate-500">{t("partner.deal.offerPackageName")}</span>
          <input
            value={packageDisplayName}
            onChange={(e) => setPackageDisplayName(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-black outline-none focus:border-violet-400 focus:bg-white"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-xs font-black text-slate-500">{t("partner.deal.licenseDescription")}</span>
          <textarea
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            rows={2}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold outline-none focus:border-violet-400 focus:bg-white"
          />
        </label>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-black text-slate-500">{t("partner.deal.serviceNames")}</p>
          {Object.entries(lineNames).map(([sku, name]) => (
            <input
              key={sku}
              value={name}
              onChange={(e) => setLineNames((prev) => ({ ...prev, [sku]: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black outline-none focus:border-violet-400 focus:bg-white"
            />
          ))}
        </div>
        <button
          type="button"
          disabled={savingName}
          onClick={savePresentation}
          className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
        >
          {savingName ? t("partner.saving") : t("partner.deal.saveNames")}
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label={t("partner.deal.payBizuply")} value={partnerStatusLabel((deal as any).paymentStatus || deal.status, t)} />
        <Stat label={t("partner.deal.activateAccount")} value={partnerStatusLabel((deal as any).activationStatus, t)} />
        <Stat
          label={t("partner.deal.digitalProducts")}
          value={
            (deal as any).fulfillment
              ? t("partner.deal.softwareProgress", {
                  done: (deal as any).fulfillment.softwareFulfilled,
                  total: (deal as any).fulfillment.softwareTotal,
                })
              : "—"
          }
        />
        <Stat label={t("partner.commission")} value={partnerStatusLabel((deal as any).commissionStatus, t)} />
      </section>
      {(deal as any).needsAttention ? (
        <div className="space-y-3 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-black text-amber-900">{t("partner.deal.paidNotActivated")}</p>
          <p className="text-sm font-bold text-amber-800">
            {(deal as any).activationErrorMessage || t("partner.deal.needsActivation")}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="button"
              disabled={Boolean(recovering)}
              onClick={async () => {
                if (!dealId) return;
                setRecovering("retry");
                try {
                  const data = await retryPartnerDealActivation(dealId);
                  setDeal(data.deal);
                } catch (err: unknown) {
                  setError(partnerApiError(err, t("partner.deal.activationFailed")));
                } finally {
                  setRecovering("");
                }
              }}
              className="rounded-2xl bg-slate-900 py-2 text-sm font-black text-white"
            >
              {recovering === "retry" ? t("partner.deal.activating") : t("partner.deal.retryActivation")}
            </button>
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-2xl border px-3 py-2 text-sm font-bold"
                placeholder={t("partner.deal.newEmail")}
              />
              <button
                type="button"
                disabled={Boolean(recovering)}
                onClick={async () => {
                  if (!dealId) return;
                  setRecovering("email");
                  try {
                    const data = await changePartnerDealEmail(dealId, email);
                    setDeal(data.deal);
                  } catch (err: unknown) {
                    setError(partnerApiError(err, t("partner.errors.changeEmail")));
                  } finally {
                    setRecovering("");
                  }
                }}
                className="rounded-2xl border px-3 text-sm font-black"
              >
                {t("partner.deal.saveEmail")}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="flex-1 rounded-2xl border px-3 py-2 text-sm font-bold"
                placeholder={t("partner.deal.existingBusinessId")}
              />
              <button
                type="button"
                disabled={Boolean(recovering)}
                onClick={async () => {
                  if (!dealId) return;
                  setRecovering("link");
                  try {
                    const data = await linkPartnerDealBusiness(dealId, businessId);
                    setDeal(data.deal);
                  } catch (err: unknown) {
                    setError(partnerApiError(err, t("partner.errors.linkBusiness")));
                  } finally {
                    setRecovering("");
                  }
                }}
                className="rounded-2xl border px-3 text-sm font-black"
              >
                {t("partner.deal.linkExisting")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label={t("partner.deal.dealStatus")} value={partnerStatusLabel((deal as any).pipelineStatus || deal.status, t)} />
        <Stat label={t("partner.deal.oneTimeCustomer")} value={formatIls(totals.oneTime)} />
        <Stat label={t("partner.deal.monthlyCustomer")} value={formatIls(totals.monthly)} />
        <Stat label={t("partner.deal.yearlyCustomer")} value={formatIls(totals.annual)} />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Stat
          label={t("partner.deal.yourOneTime")}
          value={formatIls(
            Number(deal.partnerIncomeOneTime) ||
              serviceRows.reduce((sum, row) => sum + Number(row.partnerIncomeOneTime || 0), 0)
          )}
        />
        <Stat
          label={t("partner.deal.yourMonthly")}
          value={t("partner.perMonth", {
            amount: formatIls(
              Number(deal.partnerIncomeRecurring) ||
                serviceRows.reduce((sum, row) => sum + Number(row.partnerIncomeRecurring || 0), 0)
            ),
          })}
        />
        <Stat
          label={t("partner.deal.activeMonthly")}
          value={
            deal.recurringIncomeActive ||
            (isPaid && deal.stripeSubscriptionId && deal.paymentStatus !== "refunded")
              ? t("partner.deal.activeF")
              : t("partner.deal.inactiveF")
          }
        />
      </section>

      <section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-5">
        <h3 className="font-black">{t("partner.deal.internalBreakdown")}</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">
          {t("partner.deal.priceFormula")}
        </p>
        <table className="mt-4 min-w-full text-right text-sm">
          <thead className="text-xs font-black text-slate-500">
            <tr>
              <th className="px-3 py-2">{t("partner.deal.service")}</th>
              <th className="px-3 py-2">{t("partner.deal.customerPrice")}</th>
              <th className="px-3 py-2">{t("partner.deal.payBizuplyCol")}</th>
              <th className="px-3 py-2">{t("partner.deal.oneTimeCommission")}</th>
              <th className="px-3 py-2">{t("partner.deal.monthlyCommission")}</th>
            </tr>
          </thead>
          <tbody>
            {serviceRows.map((row) => (
              <tr key={row.sku} className="border-t border-slate-100">
                <td className="px-3 py-3 font-black">
                  {row.name}
                  <span className="mr-2 text-[11px] font-bold text-slate-400">{billingLabel(row.billing, t)}</span>
                </td>
                <td className="px-3 py-3 font-bold">
                  {formatIls(row.customerPrice)}
                  {row.customerSetup ? (
                    <span className="block text-[11px] text-slate-500">
                      {t("partner.deal.setupFee", { amount: formatIls(row.customerSetup) })}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3 font-bold">
                  {formatIls(row.payBizuply)}
                  {row.payBizuplySetupShare ? (
                    <span className="block text-[11px] text-slate-500">
                      {t("partner.deal.bizuplySetupShare", {
                        amount: formatIls(row.payBizuplySetupShare),
                      })}
                    </span>
                  ) : null}
                  {row.payBizuplyMonthlyShare ? (
                    <span className="block text-[11px] text-slate-500">
                      {t("partner.deal.bizuplyMonthlyShare", {
                        amount: formatIls(row.payBizuplyMonthlyShare),
                      })}
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3 font-bold">{row.oneTimeCommission ? formatIls(row.oneTimeCommission) : "—"}</td>
                <td className="px-3 py-3 font-bold">
                  {row.monthlyCommission ? t("partner.deal.whileActive", { amount: formatIls(row.monthlyCommission) }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <details className="rounded-3xl border border-slate-200 bg-white p-5">
        <summary className="cursor-pointer font-black">{t("partner.deal.stripeNote")}</summary>
        <p className="mb-3 mt-2 text-sm font-bold text-slate-500">
          {t("partner.deal.renewalNote")}
        </p>
        <ul className="space-y-2 text-sm font-bold">
          {stripeItems.map((item) => (
            <li key={item.sku} className="flex justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2">
              <span>
                {catalogProductName(t, item)} · {billingLabel(item.billing, t)}
              </span>
              <span className="font-black">{formatIls(item.amountIls, locale)}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(publicUrl)}
          className="rounded-2xl border px-4 py-2 text-sm font-black"
        >
          {t("partner.deal.copyCustomerLink")}
        </button>
        <a href={publicUrl} className="rounded-2xl border px-4 py-2 text-sm font-black" target="_blank" rel="noreferrer">
          {t("partner.deal.viewCustomerSummary")}
        </a>
        {!isPaid ? (
          <button
            type="button"
            disabled={paying}
            onClick={payBizuply}
            className="rounded-2xl bg-violet-700 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            {paying ? t("partner.deal.openingStripe") : t("partner.deal.goPayBizuply")}
          </button>
        ) : (
          <p className="rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">{t("partner.deal.paidToBizuply")}</p>
        )}
        {client?._id ? (
          <Link to={`/partner/dashboard/crm/${client._id}`} className="rounded-2xl border px-4 py-2 text-sm font-black">
            {t("partner.deal.clientFile")}
          </Link>
        ) : null}
        <Link to="/partner/dashboard/withdrawals" className="rounded-2xl border px-4 py-2 text-sm font-black">
          {t("partner.deal.withdrawCommission")}
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black">{value || "—"}</p>
    </div>
  );
}
