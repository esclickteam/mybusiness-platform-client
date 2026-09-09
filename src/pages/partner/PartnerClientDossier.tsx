import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckSquare,
  LogIn,
  Mail,
  Phone,
  Shield,
  StickyNote,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  activatePartnerClient,
  addPartnerNote,
  addPartnerTask,
  enterPartnerClient,
  fetchPartnerClient,
  partnerApiError,
  togglePartnerTask,
} from "../../lib/partnerApi";
import { formatIls } from "../../lib/partnerMoney";
import { billingLabel } from "../../lib/partnerDealMath";
import type { PartnerClient, PartnerDeal } from "../../types/partner";
import PartnerMarkupBreakdown from "../../components/partner/PartnerMarkupBreakdown";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { useAuth } from "../../context/AuthContext";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";
import { partnerStatusLabel } from "../../lib/partnerLabels";
import { getIntlLocale } from "../../i18n/localeUtils";
import { catalogProductName } from "../../i18n/partnerCatalogCopy";
import {
  localizePartnerDemoName,
  localizePartnerDemoText,
  partnerDemoTaskTitle,
} from "../../i18n/partnerDemoCopy";
import { formatPartnerDate, formatPartnerDateTime } from "../../lib/partnerWork";

const MODE_TITLE_KEY: Record<string, string> = {
  partner: "partner.modePartnerTitle",
  customer: "partner.modeCustomerTitle",
  shared: "partner.modeSharedTitle",
};

export default function PartnerClientDossier() {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as {
    loginWithToken?: (
      user: unknown,
      token: string,
      options?: { skipRedirect?: boolean }
    ) => void;
  };
  const [client, setClient] = useState<PartnerClient | null>(null);
  const [deals, setDeals] = useState<PartnerDeal[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");
  const [tab, setTab] = useState("overview");
  const [entering, setEntering] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPartnerClient(clientId);
        if (!cancelled) {
          setClient(data.client);
          setDeals(data.deals || []);
        }
      } catch (err: any) {
        if (!cancelled) setError(partnerApiError(err, t("partner.errors.clientFile")));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientId, t]);

  async function saveNote() {
    if (!client || !note.trim()) return;
    const notes = await addPartnerNote(client._id, note.trim());
    setClient({ ...client, notes });
    setNote("");
  }

  async function saveTask() {
    if (!client || !task.trim()) return;
    const tasks = await addPartnerTask(client._id, task.trim());
    setClient({ ...client, tasks });
    setTask("");
  }

  async function enterClient() {
    if (!client?.canEnterClient) return;
    setEntering(true);
    setError("");
    try {
      const data = await enterPartnerClient(client._id);
      loginWithToken?.(data.user, data.token, { skipRedirect: true });
      navigate(getDefaultDashboardPath(data.user.businessId, data.user.enabledModules), {
        replace: true,
      });
    } catch (err: any) {
      setError(partnerApiError(err, t("partner.errors.enterClient")));
    } finally {
      setEntering(false);
    }
  }

  async function activateClient() {
    if (!clientId) return;
    setActivating(true);
    setError("");
    try {
      await activatePartnerClient(clientId);
      const refreshed = await fetchPartnerClient(clientId);
      setClient(refreshed.client);
      setDeals(refreshed.deals || []);
    } catch (err: unknown) {
      setError(partnerApiError(err, t("partner.errors.activateClient")));
    } finally {
      setActivating(false);
    }
  }

  if (loading) return <BizuplyLoader label={t("partner.dossier.loading")} />;
  if (!client) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
        {error || t("partner.dossier.notFound")}
      </div>
    );
  }

  const extra = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.markup || line.additionalCommission || 0),
    0
  );
  const partnerShare = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.partnerMarkupShare || 0),
    0
  );
  const bizuplyShare = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.bizuplyMarkupShare || 0),
    0
  );
  const wholesaleTotal = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.partnerWholesalePrice || 0),
    0
  );
  const finalTotal = (client.selectedSkus || []).reduce(
    (sum, line) => sum + Number(line.customerFinalPrice || 0),
    0
  );
  const dueTotal = wholesaleTotal + bizuplyShare;

  return (
    <div className="space-y-5">
      <Link
        to="/partner/dashboard/crm"
        className="inline-flex items-center gap-1 text-sm font-black text-slate-500 hover:text-slate-900"
      >
        <ArrowRight className="h-4 w-4" />
        {t("partner.dossier.back")}
      </Link>

      <PartnerPageHeader
        eyebrow={t("partner.dossier.fullFile")}
        title={localizePartnerDemoName(t, client.contact.businessName, {
          personaKey: client.personaKey,
          field: "businessName",
        })}
        subtitle={`${localizePartnerDemoName(t, client.contact.contactName, {
          personaKey: client.personaKey,
          field: "contactName",
        })} · ${client.contact.email}`}
        actions={
          <>
            {deals.some(
              (deal) =>
                deal.needsAttention ||
                (deal.paymentStatus === "paid" && deal.activationStatus !== "active")
            ) ? (
              <button
                type="button"
                disabled={activating}
                onClick={activateClient}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-black text-white"
              >
                {activating ? t("partner.dossier.activating") : t("partner.dossier.activateAfterPayment")}
              </button>
            ) : null}
            {client.canEnterClient ? (
              <button
                type="button"
                disabled={entering}
                onClick={enterClient}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-slate-900/15"
              >
                <LogIn className="h-4 w-4" />
                {entering ? t("partner.dossier.entering") : t("partner.dossier.enterClient")}
              </button>
            ) : (
              <span className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black text-amber-800">
                {t("partner.dossier.enterAfterActivation")}
              </span>
            )}
          </>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="flex flex-wrap gap-2">
        {[
          ["overview", "partner.dossier.overview"],
          ["details", "partner.dossier.details"],
          ["products", "partner.dossier.packageServices"],
          ["deals", "partner.dossier.dealHistory"],
          ["pricing", "partner.dossier.internalPricing"],
          ["permissions", "partner.dossier.permissions"],
          ["tasks", "partner.dossier.tasks"],
          ["notes", "partner.dossier.notes"],
          ["history", "partner.dossier.history"],
        ].map(([id, labelKey]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={[
              "rounded-full px-4 py-2 text-sm font-black",
              tab === id
                ? "bg-[#6D28D9] text-white shadow-[0_8px_18px_rgba(109,40,217,0.22)]"
                : "bg-white text-slate-600 shadow-sm",
            ].join(" ")}
          >
            {t(labelKey)}
          </button>
        ))}
        <Link
          to="/partner/dashboard/transactions"
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black"
        >
          {t("partner.dossier.deals")}
        </Link>
      </section>

      {tab === "overview" || tab === "details" || tab === "history" ? (
      <section className="grid gap-3 md:grid-cols-4">
        <InfoCard icon={User} label={t("partner.statusLabel")} value={partnerStatusLabel(client.status, t)} />
        <InfoCard
          icon={Shield}
          label={t("partner.dossier.managementMode")}
          value={MODE_TITLE_KEY[client.managementMode] ? t(MODE_TITLE_KEY[client.managementMode]) : client.managementMode}
        />
        <InfoCard icon={Mail} label={t("partner.email")} value={client.contact.email} />
        <InfoCard icon={Phone} label={t("partner.phone")} value={client.contact.phone || "—"} />
      </section>
      ) : null}

      <section className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-4">
        <DateCell label={t("partner.dossier.created")} value={formatPartnerDate(client.createdAt, locale)} />
        <DateCell label={t("partner.dossier.activated")} value={formatPartnerDate(client.activatedAt, locale)} />
        <DateCell label={t("partner.dossier.joined")} value={formatPartnerDate(client.joinedAt, locale)} />
        <DateCell label={t("partner.dossier.nextBilling")} value={formatPartnerDate(client.nextBillingDate, locale)} />
      </section>

      <section className="grid gap-3 rounded-3xl border border-violet-100 bg-gradient-to-l from-[#f7f3ff] to-white p-5 md:grid-cols-3">
        <MoneyCell
          label={t("partner.dossier.package")}
          value={(() => {
            const pkg = (client.selectedSkus || []).find((line) =>
              ["monthly", "yearly", "website_only"].includes(String(line.sku))
            );
            return pkg ? catalogProductName(t, pkg) : "—";
          })()}
        />
        <MoneyCell
          label={t("partner.dossier.services")}
          value={t("partner.dossier.activeCount", {
            count: (client.selectedSkus || []).filter((line) => !line.included).length,
          })}
        />
        <MoneyCell label={t("partner.dossier.monthlyPayment")} value={formatIls(client.mrrCustomer)} />
        <MoneyCell
          label={t("partner.dossier.oneTime")}
          value={formatIls(
            (client.selectedSkus || []).reduce(
              (sum, line) =>
                sum +
                Number(
                  line.customerOneTimeAmount ||
                    (line.billing === "one_time" ? line.customerFinalPrice : 0) ||
                    0
                ),
              0
            )
          )}
        />
        <MoneyCell
          label={t("partner.dossier.yourOneTime")}
          value={formatIls(
            (client.selectedSkus || []).reduce(
              (sum, line) => sum + Number(line.oneTimePartnerShare || 0),
              0
            )
          )}
        />
        <MoneyCell
          label={t("partner.dossier.yourMonthly")}
          value={t("partner.perMonth", {
            amount: formatIls(
              (client.selectedSkus || []).reduce(
                (sum, line) => sum + Number(line.recurringPartnerShare || 0),
                0
              )
            ),
          })}
        />
      </section>
      {deals[0] ? (
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/partner/dashboard/deals/${deals[deals.length - 1]._id}`}
            className="inline-flex rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-black text-violet-800"
          >
            {t("partner.dossier.dealFile")}
          </Link>
          <Link
            to={`/partner/deals/${deals[deals.length - 1]._id}`}
            className="inline-flex rounded-2xl border px-4 py-2 text-sm font-black text-slate-600"
          >
            {t("partner.dossier.customerSummary")}
          </Link>
        </div>
      ) : null}

      {client.contact.notes ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="mb-2 font-black">{t("partner.dossier.commercialBackground")}</h3>
          <p className="whitespace-pre-wrap text-sm font-bold leading-6 text-slate-600">
            {localizePartnerDemoName(t, client.contact.notes, {
              personaKey: client.personaKey,
              field: "contactNotes",
            })}
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-black">{t("partner.dossier.packageServices")}</h3>
          <Link
            to={`/partner/dashboard/clients/new?clientId=${client._id}`}
            className="rounded-2xl border px-3 py-2 text-sm font-black"
          >
            {t("partner.dossier.newDeal")}
          </Link>
        </div>
        {(client.selectedSkus || []).map((line) => (
          <article
            key={line.sku}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black">{catalogProductName(t, line)}</p>
                <p className="text-sm font-bold text-slate-500">
                  {billingLabel(line.billing, t)}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">
                {client.status === "active"
                  ? t("partner.active")
                  : client.status === "waiting_payment"
                    ? t("partner.dossier.waitingPayment")
                    : client.status === "payment_issue"
                      ? t("partner.dossier.paymentIssue")
                      : client.status === "cancelled"
                        ? t("partner.dossier.cancelled")
                        : partnerStatusLabel(client.status, t)}
              </span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm font-bold">
              <p>
                {t("partner.dossier.priceLabel")}{" "}
                {Number(line.customerOneTimeAmount) || Number(line.customerRecurringAmount)
                  ? `${Number(line.customerOneTimeAmount) ? t("partner.dossier.oneTimeAmount", { amount: formatIls(line.customerOneTimeAmount) }) : ""}${
                      Number(line.customerOneTimeAmount) && Number(line.customerRecurringAmount)
                        ? " + "
                        : ""
                    }${Number(line.customerRecurringAmount) ? t("partner.perMonth", { amount: formatIls(line.customerRecurringAmount) }) : ""}`
                  : formatIls(line.customerFinalPrice)}
              </p>
              <p>
                {t("partner.dossier.oneTimeIncome", {
                  amount: formatIls(line.oneTimePartnerShare),
                })}
              </p>
              <p>
                {t("partner.dossier.monthlyIncome", {
                  amount: formatIls(line.recurringPartnerShare),
                })}
              </p>
            </div>
            {tab === "pricing" ? (
              <div className="mt-4">
                <PartnerMarkupBreakdown line={line} />
              </div>
            ) : null}
          </article>
        ))}
        {!client.selectedSkus?.length ? (
          <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm font-bold text-slate-500">
            {t("partner.dossier.noProducts")}
          </p>
        ) : tab === "pricing" ? (
          <div className="rounded-3xl border border-slate-900 bg-slate-900 p-5 text-white">
            <p className="text-xs font-black text-white/60">{t("partner.dossier.internalBreakdown")}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[11px] font-bold text-white/55">{t("partner.dossier.bizuplyPrice")}</p>
                <p className="text-lg font-black">{formatIls(wholesaleTotal)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">{t("partner.dossier.totalCommission")}</p>
                <p className="text-lg font-black">{formatIls(extra)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">{t("partner.dossier.customerFinal")}</p>
                <p className="text-lg font-black">{formatIls(finalTotal)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">{t("partner.dossier.yourCommission")}</p>
                <p className="text-lg font-black">{formatIls(partnerShare)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">{t("partner.dossier.bizuplyShare")}</p>
                <p className="text-lg font-black">{formatIls(bizuplyShare)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/55">{t("partner.dossier.payBizuply")}</p>
                <p className="text-lg font-black">{formatIls(dueTotal)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {tab === "deals" || tab === "overview" ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="mb-3 font-black">{t("partner.dossier.dealHistory")}</h3>
          <div className="space-y-2">
            {deals.map((deal) => (
              <Link
                key={deal._id}
                to={`/partner/dashboard/deals/${deal._id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 hover:bg-violet-50"
              >
                <div>
                  <p className="font-black">{deal.dealNumber}</p>
                  <p className="text-xs font-bold text-slate-500">
                    {formatPartnerDate(deal.createdAt, locale)} · {partnerStatusLabel(deal.status, t)}
                  </p>
                </div>
                <p className="font-black">{formatIls(deal.totals?.customerNow)}</p>
              </Link>
            ))}
            {!deals.length ? (
              <p className="text-sm font-bold text-slate-400">{t("partner.dossier.noDeals")}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {client.enabledEntitlements?.length ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="mb-2 font-black">{t("partner.dossier.enabledPermissions")}</h3>
          <div className="flex flex-wrap gap-2">
            {client.enabledEntitlements.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-violet-600" />
            <h3 className="font-black">{t("partner.dossier.notesLog")}</h3>
          </div>
          <div className="space-y-2">
            {(client.notes || []).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-sm font-bold text-slate-800">
                  {localizePartnerDemoText(t, {
                    titleKey: item.textKey,
                    text: item.text,
                  })}
                </p>
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {formatPartnerDateTime(item.createdAt, locale)}
                </p>
              </div>
            ))}
            {!client.notes?.length ? (
              <p className="text-sm font-bold text-slate-400">{t("partner.dossier.noNotes")}</p>
            ) : null}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
              placeholder={t("partner.dossier.addNote")}
            />
            <button
              type="button"
              onClick={saveNote}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white"
            >
              {t("partner.save")}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-violet-600" />
            <h3 className="font-black">{t("partner.dossier.followupTasks")}</h3>
          </div>
          <div className="space-y-2">
            {(client.tasks || []).map((item) => (
              <label key={item._id} className="flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(item.done)}
                  onChange={async (e) => {
                    const tasks = await togglePartnerTask(
                      client._id,
                      String(item._id),
                      e.target.checked
                    );
                    setClient({ ...client, tasks });
                  }}
                  className="mt-1 accent-violet-700"
                />
                <span className={item.done ? "font-bold text-slate-400 line-through" : "font-bold"}>
                  {partnerDemoTaskTitle(t, item)}
                  <span className="mt-1 block text-[11px] font-bold text-slate-400">
                    {formatPartnerDateTime(item.createdAt, locale)}
                    {item.dueAt ? ` · ${t("partner.dossier.duePrefix", { when: formatPartnerDateTime(item.dueAt, locale) })}` : ""}
                  </span>
                </span>
              </label>
            ))}
            {!client.tasks?.length ? (
              <p className="text-sm font-bold text-slate-400">{t("partner.dossier.noOpenTasks")}</p>
            ) : null}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-bold"
              placeholder={t("partner.dossier.newTask")}
            />
            <button
              type="button"
              onClick={saveTask}
              className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-black text-white"
            >
              {t("partner.dossier.add")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-black">{label}</span>
      </div>
      <p className="font-black text-slate-900">{value}</p>
    </div>
  );
}

function DateCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-800">{value}</p>
    </div>
  );
}

function MoneyCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black text-violet-700">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}
