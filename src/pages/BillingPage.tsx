"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useLocaleDir } from "../hooks/useLocaleDir";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import {
  cancelSubscription,
  fetchBillingOverview,
  resumeSubscription,
  type BillingOverview,
} from "../api/billingApi";
import {
  formatBillingDate,
  formatIls,
  MONTHLY_SERVICE_KEYS,
  statusBadgeClass,
} from "../components/billing/billingFormat";
import {
  createDomainRenewalCheckout,
  retryDomainRenewal,
} from "../services/domainService";

type HistoryFilter =
  | "all"
  | "packages"
  | "services"
  | "domains"
  | "failed"
  | "refunds"
  | "one_time"
  | "recurring";

type MessageState = { type: "success" | "error" | null; text: string };

function SectionCard({
  badge,
  badgeClass,
  title,
  hint,
  children,
  action,
}: {
  badge: string;
  badgeClass?: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-100 bg-gradient-to-br from-white via-slate-50 to-violet-50/60 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div
              className={[
                "inline-flex rounded-full px-4 py-1.5 text-xs font-black",
                badgeClass || "bg-violet-100 text-violet-700",
              ].join(" ")}
            >
              {badge}
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-800">
              {title}
            </h2>
            {hint ? (
              <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
            ) : null}
          </div>
          {action}
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function EmptyBlock({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center">
      <h3 className="text-base font-black text-slate-800">{title}</h3>
      {hint ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-black text-slate-800">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-bold text-slate-800">{children}</div>
    </div>
  );
}

export default function BillingPage() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const dateLocale = i18n.language?.startsWith("he") ? "he-IL" : "en-US";
  const navigate = useNavigate();
  const { businessId: urlBusinessId } = useParams();
  const { user, refreshUser, setUser } = useAuth() as {
    user: { _id?: string; businessId?: string; subscriptionCancelled?: boolean } | null;
    refreshUser: (force?: boolean) => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
  };

  const businessId =
    urlBusinessId ||
    (typeof user?.businessId === "string" ? user.businessId : "") ||
    "";

  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [loadingResume, setLoadingResume] = useState(false);
  const [busyDomainId, setBusyDomainId] = useState("");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [message, setMessage] = useState<MessageState>({ type: null, text: "" });
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      setLoadError(t("billing.errors.missingBusiness"));
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchBillingOverview(businessId);
      setOverview(data);
    } catch (err) {
      console.error(err);
      setLoadError(t("billing.errors.loadFailed"));
      setOverview(null);
    } finally {
      setLoading(false);
    }
  }, [businessId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const statusLabel = useCallback(
    (status?: string | null) => {
      if (!status) return "—";
      const key = `billing.statusLabels.${status}`;
      const translated = t(key);
      return translated === key ? status : translated;
    },
    [t]
  );

  const billingTypeLabel = useCallback(
    (billingType?: string | null) => {
      if (!billingType) return "—";
      const map: Record<string, string> = {
        one_time: t("billing.billingTypes.oneTime"),
        recurring_month: t("billing.billingTypes.recurringMonth"),
        recurring_year: t("billing.billingTypes.recurringYear"),
      };
      return map[billingType] || billingType;
    },
    [t]
  );

  const typeLabel = useCallback(
    (type?: string) => {
      const map: Record<string, string> = {
        package: t("billing.historyTypes.package"),
        service: t("billing.historyTypes.service"),
        addon: t("billing.historyTypes.addon"),
        domain_renewal: t("billing.historyTypes.domain"),
        refund: t("billing.historyTypes.refund"),
      };
      return map[type || ""] || type || "—";
    },
    [t]
  );

  const filteredHistory = useMemo(() => {
    const rows = overview?.paymentHistory || [];
    return rows.filter((row) => {
      if (historyFilter === "all") return true;
      if (historyFilter === "packages") return row.type === "package";
      if (historyFilter === "services")
        return row.type === "service" || row.type === "addon";
      if (historyFilter === "domains") return row.type === "domain_renewal";
      if (historyFilter === "failed") return row.status === "failed";
      if (historyFilter === "refunds")
        return (
          row.status === "refunded" ||
          row.status === "partially_refunded" ||
          row.refundStatus === "partial" ||
          row.refundStatus === "full"
        );
      if (historyFilter === "one_time")
        return (
          row.type === "addon" ||
          row.billingKind === "one_time" ||
          (row.type === "package" && !row.billingPeriod)
        );
      if (historyFilter === "recurring")
        return (
          row.billingKind === "recurring_month" ||
          row.billingKind === "recurring_year" ||
          (row.type === "package" && Boolean(row.billingPeriod))
        );
      return true;
    });
  }, [overview?.paymentHistory, historyFilter]);

  const monthlyServices = useMemo(
    () =>
      (overview?.serviceOrders || []).filter(
        (s) =>
          s.billingType === "recurring_month" ||
          s.billingType === "recurring_year" ||
          MONTHLY_SERVICE_KEYS.has(s.serviceKey)
      ),
    [overview?.serviceOrders]
  );

  const oneTimeServices = useMemo(() => {
    const monthlyIds = new Set(monthlyServices.map((s) => s.id));
    return (overview?.serviceOrders || []).filter((s) => !monthlyIds.has(s.id));
  }, [overview?.serviceOrders, monthlyServices]);

  const handleCancel = async () => {
    setMessage({ type: null, text: "" });
    setLoadingCancel(true);
    try {
      await cancelSubscription();
      setUser((prev) =>
        prev ? { ...prev, subscriptionCancelled: true } : prev
      );
      await refreshUser(true);
      await load();
      setMessage({ type: "success", text: t("billing.messages.cancelSuccess") });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: t("billing.messages.cancelError") });
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleResume = async () => {
    setMessage({ type: null, text: "" });
    setLoadingResume(true);
    try {
      await resumeSubscription();
      setUser((prev) =>
        prev ? { ...prev, subscriptionCancelled: false } : prev
      );
      await refreshUser(true);
      await load();
      setMessage({ type: "success", text: t("billing.messages.resumeSuccess") });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: t("billing.messages.resumeError") });
    } finally {
      setLoadingResume(false);
    }
  };

  const handleDomainAction = async (domain: BillingOverview["domains"][number]) => {
    if (
      domain.cta === "in_progress" ||
      domain.cta === "renewed" ||
      domain.cta === "request_quote"
    ) {
      return;
    }
    setBusyDomainId(domain.id);
    try {
      if (domain.cta === "retry") {
        await retryDomainRenewal(domain.id, domain.activeRenewalOrderId || undefined);
        await load();
        return;
      }
      const result = await createDomainRenewalCheckout(domain.id);
      const url = result.checkoutUrl;
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error("no checkout url");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: t("billing.domains.actionError") });
    } finally {
      setBusyDomainId("");
    }
  };

  const domainCtaLabel = (cta: string) => {
    const map: Record<string, string> = {
      renew: t("billing.domains.ctaRenew"),
      continue_payment: t("billing.domains.ctaContinue"),
      in_progress: t("billing.domains.ctaInProgress"),
      request_quote: t("billing.domains.ctaQuote"),
      retry: t("billing.domains.ctaRetry"),
      renewed: t("billing.domains.ctaRenewed"),
    };
    return map[cta] || t("billing.domains.ctaDetails");
  };

  const filters: { id: HistoryFilter; label: string }[] = [
    { id: "all", label: t("billing.filters.all") },
    { id: "packages", label: t("billing.filters.packages") },
    { id: "services", label: t("billing.filters.services") },
    { id: "domains", label: t("billing.filters.domains") },
    { id: "failed", label: t("billing.filters.failed") },
    { id: "refunds", label: t("billing.filters.refunds") },
    { id: "one_time", label: t("billing.filters.oneTime") },
    { id: "recurring", label: t("billing.filters.recurring") },
  ];

  if (loading) {
    return (
      <main dir={dir} className="flex min-h-screen items-center justify-center bg-slate-50">
        <BizuplyLoader size="xl" label={t("billing.loading")} />
      </main>
    );
  }

  const summary = overview?.summary;
  const primaryPlan = overview?.primaryPlan;
  const websiteAccess = overview?.websiteAccess;

  return (
    <main
      dir={dir}
      className="min-h-screen bg-slate-50 px-4 py-6 text-start text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-6">
        {loadError ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {loadError}
          </div>
        ) : null}

        {(overview?.failedPayments?.length || 0) > 0 ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4">
            <p className="text-sm font-black text-rose-800">
              {t("billing.failed.banner")}
            </p>
            <div className="mt-3 space-y-3">
              {overview!.failedPayments.map((fp) => (
                <div
                  key={fp.id}
                  className="flex flex-col gap-3 rounded-2xl bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-black text-slate-800">{fp.description}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatIls(fp.amount, dateLocale)} ·{" "}
                      {formatBillingDate(fp.date, dateLocale)} ·{" "}
                      {t("billing.failed.attempts", {
                        count: fp.attemptCount || 1,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/contact"
                      className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-black text-rose-700"
                    >
                      {t("billing.failed.updatePaymentMethod")}
                    </a>
                    {fp.canRetry ? (
                      <button
                        type="button"
                        onClick={() => navigate("/pricing")}
                        className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white"
                      >
                        {t("billing.failed.retry")}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Summary */}
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden bg-gradient-to-l from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80 px-6 py-8 sm:px-8 lg:px-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black text-black/80 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t("billing.badge")}
              </div>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                {t("billing.title")}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                {t("billing.subtitle")}
              </p>

              {summary?.trialAccess?.active ? (
                <p className="mt-3 text-sm font-bold text-amber-700">
                  {t("billing.trialAccessNote", {
                    date: formatBillingDate(summary.trialAccess.endsAt, dateLocale),
                  })}
                </p>
              ) : null}

              <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatChip
                  label={t("billing.summary.planName")}
                  value={
                    summary?.primaryPlanName || t("billing.summary.noActivePlan")
                  }
                />
                <StatChip
                  label={t("billing.summary.planStatus")}
                  value={statusLabel(summary?.primaryPlanStatus)}
                />
                <StatChip
                  label={t("billing.summary.nextCharge")}
                  value={
                    summary?.nextChargeAmount != null
                      ? `${formatIls(summary.nextChargeAmount, dateLocale)} · ${formatBillingDate(summary.nextChargeDate, dateLocale)}`
                      : "—"
                  }
                />
                <StatChip
                  label={t("billing.totalPaid")}
                  value={formatIls(summary?.totalPaid, dateLocale)}
                />
                <StatChip
                  label={t("billing.summary.activeSubscriptions")}
                  value={summary?.activeSubscriptionsCount ?? 0}
                />
                <StatChip
                  label={t("billing.summary.activeServices")}
                  value={summary?.activeServicesCount ?? 0}
                />
                <StatChip
                  label={t("billing.summary.pendingAttention")}
                  value={summary?.pendingAttentionCount ?? 0}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Primary plan */}
        <SectionCard
          badge={t("billing.subscription")}
          title={t("billing.primaryPlanTitle")}
          hint={t("billing.yourPlanHint")}
        >
          {!primaryPlan ? (
            <div className="space-y-4">
              <EmptyBlock
                title={t("billing.empty.noPlan")}
                hint={t("billing.empty.noPlanHint")}
              />
              <button
                type="button"
                onClick={() => navigate("/pricing")}
                className="flex h-12 w-full items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-sm font-black text-slate-900"
              >
                {t("billing.choosePlan")}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label={t("billing.plan")}>
                  <p className="text-xl font-black">{primaryPlan.name}</p>
                </Field>
                <Field label={t("billing.amount")}>
                  {formatIls(primaryPlan.priceIls, dateLocale)}
                </Field>
                <Field label={t("billing.billingType")}>
                  {billingTypeLabel(primaryPlan.billingType)}
                </Field>
                <Field label={t("billing.status")}>
                  <span
                    className={[
                      "inline-flex rounded-full px-3 py-1.5 text-xs font-black",
                      statusBadgeClass(primaryPlan.status),
                    ].join(" ")}
                  >
                    {statusLabel(primaryPlan.status)}
                    {primaryPlan.cancelAtPeriodEnd
                      ? ` · ${t("billing.statusLabels.activeNoRenewal")}`
                      : ""}
                  </span>
                </Field>
                <Field label={t("billing.start")}>
                  {formatBillingDate(primaryPlan.start, dateLocale)}
                </Field>
                <Field
                  label={
                    primaryPlan.billingType === "one_time"
                      ? t("billing.validUntil")
                      : t("billing.nextBilling")
                  }
                >
                  {formatBillingDate(
                    primaryPlan.nextBillingDate || primaryPlan.end,
                    dateLocale
                  )}
                </Field>
                {primaryPlan.cancelAtPeriodEnd ? (
                  <Field label={t("billing.cancelScheduledAt")}>
                    {formatBillingDate(primaryPlan.cancelScheduledAt, dateLocale)}
                  </Field>
                ) : null}
                {primaryPlan.stripeSubscriptionIdMasked ? (
                  <Field label={t("billing.stripeRef")}>
                    {primaryPlan.stripeSubscriptionIdMasked}
                  </Field>
                ) : null}
              </div>

              {websiteAccess && primaryPlan.sku === "website_only" ? (
                <div className="rounded-[1.25rem] border border-sky-100 bg-sky-50/70 p-4 text-sm font-bold text-slate-700">
                  <p>
                    {t("billing.website.accessUntil")}:{" "}
                    {formatBillingDate(websiteAccess.accessUntil, dateLocale)}
                  </p>
                  <p className="mt-1">{t("billing.website.noAutoRenew")}</p>
                </div>
              ) : null}

              {(primaryPlan.lineItems || []).filter((li) => li.kind === "upsell")
                .length > 0 ? (
                <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {t("billing.purchaseAddons")}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm font-bold text-slate-700">
                    {primaryPlan.lineItems
                      .filter((li) => li.kind === "upsell")
                      .map((li) => (
                        <li key={li.sku}>
                          {li.name} · {formatIls(li.amountIls, dateLocale)}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}

              {message.text ? (
                <div
                  className={[
                    "rounded-2xl px-4 py-3 text-sm font-bold leading-6",
                    message.type === "success"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-rose-100 bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  {message.text}
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {primaryPlan.actions.canCancelRenewal ? (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loadingCancel}
                    className="h-12 rounded-2xl border border-rose-200 bg-white px-5 text-sm font-black text-rose-600 disabled:opacity-60"
                  >
                    {loadingCancel
                      ? t("billing.cancelling")
                      : t("billing.cancelRenewal")}
                  </button>
                ) : null}
                {primaryPlan.actions.canResume ? (
                  <button
                    type="button"
                    onClick={handleResume}
                    disabled={loadingResume}
                    className="h-12 rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 text-sm font-black disabled:opacity-60"
                  >
                    {loadingResume
                      ? t("billing.resuming")
                      : t("billing.resumeSubscription")}
                  </button>
                ) : null}
                {primaryPlan.actions.canRenewWebsite ||
                primaryPlan.sku === "website_only" ? (
                  <button
                    type="button"
                    onClick={() => navigate("/pricing")}
                    className="h-12 rounded-2xl border border-sky-200 bg-sky-50 px-5 text-sm font-black text-sky-800"
                  >
                    {t("billing.website.renewYear")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => navigate("/pricing")}
                  className="h-12 rounded-2xl border border-violet-200 bg-white px-5 text-sm font-black text-violet-700"
                >
                  {t("billing.upgradeOrChange")}
                </button>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Services */}
        <SectionCard
          badge={t("billing.services.badge")}
          badgeClass="bg-sky-100 text-sky-700"
          title={t("billing.services.title")}
          hint={t("billing.services.hint")}
        >
          {(overview?.serviceOrders?.length || 0) === 0 ? (
            <EmptyBlock title={t("billing.empty.noServices")} />
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-700">
                  {t("billing.services.oneTime")}
                </h3>
                {oneTimeServices.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">—</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {oneTimeServices.map((so) => (
                      <ServiceOrderCard
                        key={so.id}
                        so={so}
                        dateLocale={dateLocale}
                        statusLabel={statusLabel}
                        billingTypeLabel={billingTypeLabel}
                        selected={selectedServiceId === so.id}
                        onToggle={() =>
                          setSelectedServiceId((id) =>
                            id === so.id ? null : so.id
                          )
                        }
                        onRepurchase={() => navigate("/pricing")}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-700">
                  {t("billing.services.monthly")}
                </h3>
                {monthlyServices.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">—</p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {monthlyServices.map((so) => (
                      <ServiceOrderCard
                        key={so.id}
                        so={so}
                        dateLocale={dateLocale}
                        statusLabel={statusLabel}
                        billingTypeLabel={billingTypeLabel}
                        selected={selectedServiceId === so.id}
                        onToggle={() =>
                          setSelectedServiceId((id) =>
                            id === so.id ? null : so.id
                          )
                        }
                        onRepurchase={() => navigate("/pricing")}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Domains */}
        <SectionCard
          badge={t("billing.domains.badge")}
          badgeClass="bg-emerald-100 text-emerald-700"
          title={t("billing.domains.title")}
          hint={t("billing.domains.hint")}
        >
          {(overview?.domains?.length || 0) === 0 ? (
            <EmptyBlock title={t("billing.empty.noDomains")} />
          ) : (
            <div className="space-y-3">
              {overview!.domains.map((dom) => (
                <div
                  key={dom.id}
                  className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-black text-slate-800">
                        {dom.domain}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {t("billing.domains.expires")}:{" "}
                        {formatBillingDate(dom.expiresAt, dateLocale)}
                        {dom.daysRemaining != null
                          ? ` · ${t("billing.domains.daysLeft", { count: dom.daysRemaining })}`
                          : ""}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {t("billing.domains.renewalStatus")}: {dom.renewalStatus}
                        {dom.lastRenewalPrice
                          ? ` · ${formatIls(dom.lastRenewalPrice, dateLocale)}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          busyDomainId === dom.id ||
                          dom.cta === "in_progress" ||
                          dom.cta === "renewed" ||
                          dom.cta === "request_quote"
                        }
                        onClick={() => void handleDomainAction(dom)}
                        className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-black text-emerald-800 disabled:opacity-50"
                      >
                        {busyDomainId === dom.id
                          ? "..."
                          : domainCtaLabel(dom.cta)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Upcoming */}
        <SectionCard
          badge={t("billing.upcoming.badge")}
          badgeClass="bg-amber-100 text-amber-800"
          title={t("billing.upcoming.title")}
        >
          {(overview?.upcomingCharges?.length || 0) === 0 ? (
            <EmptyBlock title={t("billing.empty.noUpcoming")} />
          ) : (
            <div className="space-y-3">
              {overview!.upcomingCharges.map((c) => (
                <div
                  key={c.id}
                  className="grid gap-2 rounded-[1.25rem] border border-slate-100 bg-white p-4 sm:grid-cols-4"
                >
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      {t("billing.plan")}
                    </p>
                    <p className="mt-1 font-black">{c.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      {t("billing.amount")}
                    </p>
                    <p className="mt-1 font-black">
                      {formatIls(c.amount, dateLocale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      {t("billing.nextBilling")}
                    </p>
                    <p className="mt-1 font-bold">
                      {formatBillingDate(c.chargeAt, dateLocale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase text-slate-400">
                      {t("billing.status")}
                    </p>
                    <p className="mt-1 font-bold">
                      {c.cancelScheduled
                        ? t("billing.upcoming.cancelScheduled")
                        : statusLabel(c.status)}
                      {" · "}
                      {c.frequency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Payment history */}
        <SectionCard
          badge={t("billing.payments")}
          badgeClass="bg-slate-100 text-slate-600"
          title={t("billing.paymentHistory")}
          hint={t("billing.paymentHistoryHint")}
          action={
            <div className="rounded-2xl bg-slate-50 px-5 py-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                {t("billing.records")}
              </p>
              <p className="mt-1 text-2xl font-black">
                {filteredHistory.length}
              </p>
            </div>
          }
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setHistoryFilter(f.id)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-black",
                  historyFilter === f.id
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredHistory.length === 0 ? (
            <EmptyBlock
              title={t("billing.noPayments")}
              hint={t("billing.noPaymentsHint")}
            />
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-100 md:block">
                <table className="w-full border-collapse text-start text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">
                        {t("billing.date")}
                      </th>
                      <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">
                        {t("billing.history.transaction")}
                      </th>
                      <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">
                        {t("billing.history.description")}
                      </th>
                      <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">
                        {t("billing.history.type")}
                      </th>
                      <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">
                        {t("billing.amount")}
                      </th>
                      <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">
                        {t("billing.status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-bold">
                          {formatBillingDate(row.date, dateLocale)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">
                          {row.transactionId}
                        </td>
                        <td className="px-4 py-3 font-black">{row.description}</td>
                        <td className="px-4 py-3">{typeLabel(row.type)}</td>
                        <td className="px-4 py-3 font-black">
                          {formatIls(row.amount, dateLocale)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={[
                              "inline-flex rounded-full px-3 py-1 text-xs font-black",
                              statusBadgeClass(row.status),
                            ].join(" ")}
                          >
                            {statusLabel(row.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3 md:hidden">
                {filteredHistory.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-black text-slate-800">{row.description}</p>
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-xs font-black",
                          statusBadgeClass(row.status),
                        ].join(" ")}
                      >
                        {statusLabel(row.status)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {formatBillingDate(row.date, dateLocale)} ·{" "}
                      {typeLabel(row.type)}
                    </p>
                    <p className="mt-1 text-base font-black">
                      {formatIls(row.amount, dateLocale)}
                    </p>
                    <p className="mt-1 font-mono text-xs text-slate-400">
                      {row.transactionId}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>

        {/* Refunds / cancellations */}
        {(overview?.refunds?.length || 0) > 0 ||
        primaryPlan?.cancelAtPeriodEnd ? (
          <SectionCard
            badge={t("billing.refunds.badge")}
            badgeClass="bg-rose-100 text-rose-700"
            title={t("billing.refunds.title")}
          >
            <div className="space-y-3">
              {primaryPlan?.cancelAtPeriodEnd ? (
                <div className="rounded-[1.25rem] border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-900">
                  {t("billing.refunds.cancelAtPeriodEnd", {
                    date: formatBillingDate(
                      primaryPlan.cancelScheduledAt,
                      dateLocale
                    ),
                  })}
                </div>
              ) : null}
              {(overview?.refunds || []).map((r) => (
                <div
                  key={r.id}
                  className="rounded-[1.25rem] border border-slate-100 bg-white p-4"
                >
                  <p className="font-black">{r.description}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatIls(r.refundedAmount || r.amount, dateLocale)} ·{" "}
                    {formatBillingDate(r.date, dateLocale)} ·{" "}
                    {r.refundKind === "partial"
                      ? t("billing.refunds.partial")
                      : r.refundKind === "pending_review"
                        ? t("billing.refunds.pendingReview")
                        : t("billing.refunds.full")}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}
      </div>
    </main>
  );
}

function ServiceOrderCard({
  so,
  dateLocale,
  statusLabel,
  billingTypeLabel,
  selected,
  onToggle,
  onRepurchase,
}: {
  so: BillingOverview["serviceOrders"][number];
  dateLocale: string;
  statusLabel: (s?: string | null) => string;
  billingTypeLabel: (s?: string | null) => string;
  selected: boolean;
  onToggle: () => void;
  onRepurchase: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-[1.25rem] border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-black text-slate-800">{so.serviceName}</p>
          <p className="mt-1 text-sm text-slate-600">
            {formatIls(so.pricePaidIls, dateLocale)} ·{" "}
            {billingTypeLabel(so.billingType)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            {t("billing.services.paymentStatus")}: {statusLabel(so.paymentStatus)}{" "}
            · {t("billing.services.fulfillment")}:{" "}
            {statusLabel(so.fulfillmentStatus)} ·{" "}
            {t("billing.services.serviceStatus")}: {statusLabel(so.serviceStatus)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
          >
            {t("billing.services.details")}
          </button>
          {so.actions.canRepurchase ? (
            <button
              type="button"
              onClick={onRepurchase}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-black text-violet-700"
            >
              {t("billing.services.repurchase")}
            </button>
          ) : null}
          <a
            href="/contact"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black"
          >
            {t("billing.contactSupport")}
          </a>
        </div>
      </div>
      {selected ? (
        <div className="mt-3 grid gap-2 border-t border-slate-200 pt-3 text-sm sm:grid-cols-2">
          <p>
            {t("billing.services.purchasedAt")}:{" "}
            {formatBillingDate(so.purchasedAt, dateLocale)}
          </p>
          <p>
            {t("billing.services.nextRenewal")}:{" "}
            {formatBillingDate(so.nextRenewalAt, dateLocale)}
          </p>
          <p>
            {t("billing.services.endedAt")}:{" "}
            {formatBillingDate(so.endedAt, dateLocale)}
          </p>
          <p>
            {t("billing.services.assignedTo")}:{" "}
            {so.assignedTo?.name || "—"}
          </p>
          {so.parentPurchaseId ? (
            <p>
              {t("billing.services.linkedPurchase")}: {so.parentPurchaseId}
            </p>
          ) : null}
          {so.cancelAtPeriodEnd ? (
            <p className="text-amber-700">{t("billing.upcoming.cancelScheduled")}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
