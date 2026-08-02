import React, { useMemo } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Edit3,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import API from "@api";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { formatCrmMoney } from "../../../../utils/crmCurrency";
import { SHOW_BUSINESS_MINI_SAAS } from "./crmFeatureFlags";
import ClientDocumentationPanel, {
  type ClientActivity,
} from "./ClientDocumentationPanel";

export type ClientDetailTab =
  | "profile"
  | "appointments"
  | "payments"
  | "client-data"
  | "portal-access";

export type CRMClientDossierClient = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  appointments?: unknown[];
  appointmentsCount?: number;
  totalSpent?: number;
  activities?: ClientActivity[];
  createdAt?: string;
  updatedAt?: string;
};

type AppointmentRecord = {
  _id?: string;
  id?: string;
  serviceName?: string;
  service?: { name?: string; price?: number; duration?: number };
  title?: string;
  date?: string;
  appointmentDate?: string;
  startDate?: string;
  startAt?: string;
  time?: string;
  appointmentTime?: string;
  startHour?: string;
  duration?: number;
  durationMinutes?: number;
  price?: number;
  paid?: boolean;
  paidAt?: string;
  paymentMethod?: string;
};

type CRMClientDossierProps = {
  client: CRMClientDossierClient;
  businessId: string;
  activeTab: ClientDetailTab;
  setActiveTab: (tab: ClientDetailTab) => void;
  statusLabel: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onActivitiesChange: (activities: ClientActivity[]) => void;
  clientDataPanel: React.ReactNode;
  portalAccessPanel?: React.ReactNode;
};

function formatPhone(phone: string) {
  if (!phone) return "";
  return phone.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value?: unknown, locale = "he-IL", emDash = "—") {
  if (!value) return emDash;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(value?: unknown, locale = "he-IL", emDash = "—") {
  if (!value) return emDash;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function cleanWhatsAppPhone(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return `972${digits.slice(1)}`;
  return digits;
}

function getPaymentMethodLabel(method: string | undefined, t: TFunction) {
  const key = String(method || "other");
  const i18nKey = `crm.clients.payments.methods.${key}`;
  const label = t(i18nKey);
  return label === i18nKey ? t("crm.clients.payments.methods.other") : label;
}

function summarizeAppointments(appointments: AppointmentRecord[]) {
  let totalCharged = 0;
  let totalPaid = 0;
  let unpaidCount = 0;
  let paidCount = 0;

  appointments.forEach((item) => {
    const price = Number(item.price || item.service?.price || 0);
    totalCharged += price;
    if (item.paid) {
      totalPaid += price;
      paidCount += 1;
    } else if (price > 0) {
      unpaidCount += 1;
    }
  });

  return {
    totalCharged,
    totalPaid,
    unpaidBalance: Math.max(totalCharged - totalPaid, 0),
    unpaidCount,
    paidCount,
    count: appointments.length,
  };
}

export default function CRMClientDossier({
  client,
  businessId,
  activeTab,
  setActiveTab,
  statusLabel,
  onBack,
  onEdit,
  onDelete,
  onActivitiesChange,
  clientDataPanel,
  portalAccessPanel,
}: CRMClientDossierProps) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const locale = i18n.language?.startsWith("he") ? "he-IL" : i18n.language || "he-IL";
  const emDash = t("crm.common.emDash");
  const whatsappPhone = cleanWhatsAppPhone(client.phone);

  const { data: fetchedAppointments = [], isLoading: appointmentsLoading } =
    useQuery({
      queryKey: ["client-appointments", client._id],
      queryFn: async () => {
        const { data } = await API.get<AppointmentRecord[]>(
          `/crm-clients/${client._id}/appointments`
        );
        return Array.isArray(data) ? data : [];
      },
    });

  const appointments =
    fetchedAppointments.length > 0
      ? fetchedAppointments
      : Array.isArray(client.appointments)
        ? (client.appointments as AppointmentRecord[])
        : [];

  const finance = useMemo(
    () => summarizeAppointments(appointments),
    [appointments]
  );

  const resolvedTab =
    !SHOW_BUSINESS_MINI_SAAS && activeTab === "portal-access"
      ? "profile"
      : activeTab;

  return (
    <div
      dir={dir}
      className="fixed inset-0 z-[90] flex flex-col bg-[#F4F5F8] text-start"
    >
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("crm.clients.details.backToClients")}
              </span>
            </button>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-100 text-base font-black text-[#6D28D9]">
              {getInitials(client.fullName) || (
                <UserRound className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-700">
                {t("crm.clients.details.dossierBadge")}
              </p>
              <h1 className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {client.fullName || t("crm.common.unnamedClient")}
              </h1>
              <p className="mt-0.5 truncate text-xs font-bold text-slate-500 sm:text-sm">
                {t("crm.clients.details.clientFile", {
                  phone: formatPhone(client.phone) || t("crm.common.noPhone"),
                  email: client.email || t("crm.common.noEmail"),
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 items-center rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
              {statusLabel}
            </span>

            {whatsappPhone && (
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-50 px-3 text-sm font-black text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">{t("crm.common.whatsapp")}</span>
              </a>
            )}

            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-50 px-3 text-sm font-black text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">{t("crm.common.call")}</span>
              </a>
            )}

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#6D28D9] px-4 text-sm font-black text-white transition hover:bg-[#5B21B6]"
            >
              <Edit3 className="h-4 w-4" />
              {t("crm.common.edit")}
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-50 px-3 text-sm font-black text-rose-700 transition hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{t("crm.common.delete")}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-3 sm:grid-cols-2 sm:px-5 xl:grid-cols-4">
          <FinanceMetric
            label={t("crm.clients.details.appointments")}
            value={String(
              finance.count ||
                client.appointmentsCount ||
                (Array.isArray(client.appointments)
                  ? client.appointments.length
                  : 0)
            )}
            loading={appointmentsLoading}
          />
          <FinanceMetric
            label={t("crm.clients.payments.totalCharged")}
            value={formatCrmMoney(finance.totalCharged)}
            loading={appointmentsLoading}
          />
          <FinanceMetric
            label={t("crm.clients.payments.totalPaid")}
            value={formatCrmMoney(finance.totalPaid)}
            tone="success"
            loading={appointmentsLoading}
          />
          <FinanceMetric
            label={t("crm.clients.payments.unpaidBalance")}
            value={formatCrmMoney(finance.unpaidBalance)}
            tone={finance.unpaidBalance > 0 ? "warn" : "default"}
            loading={appointmentsLoading}
          />
        </div>

        <div className="flex flex-wrap gap-1 border-t border-slate-100 px-2 sm:px-3">
          <TabButton
            active={resolvedTab === "profile"}
            icon={UserRound}
            label={t("crm.clients.details.tabProfile")}
            onClick={() => setActiveTab("profile")}
          />
          <TabButton
            active={resolvedTab === "appointments"}
            icon={CalendarDays}
            label={t("crm.clients.details.tabAppointments")}
            onClick={() => setActiveTab("appointments")}
          />
          <TabButton
            active={resolvedTab === "payments"}
            icon={Wallet}
            label={t("crm.clients.details.tabPayments")}
            onClick={() => setActiveTab("payments")}
          />
          <TabButton
            active={resolvedTab === "client-data"}
            icon={Layers3}
            label={t("crm.clients.details.tabClientData")}
            onClick={() => setActiveTab("client-data")}
          />
          {SHOW_BUSINESS_MINI_SAAS && (
            <TabButton
              active={resolvedTab === "portal-access"}
              icon={LockKeyhole}
              label={t("crm.clients.details.tabPortalAccess")}
              onClick={() => setActiveTab("portal-access")}
            />
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-[1400px] gap-4 p-3 sm:p-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_260px]">
          <aside className="space-y-3 lg:sticky lg:top-0 lg:self-start">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-col items-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-xl font-black text-[#6D28D9] shadow-sm">
                  {getInitials(client.fullName)}
                </div>
                <h2 className="mt-3 max-w-full truncate text-lg font-black text-slate-800">
                  {client.fullName || t("crm.common.unnamedClient")}
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400">
                  {statusLabel}
                </p>
              </div>

              <div className="space-y-2">
                <DetailRow
                  icon={Phone}
                  label={t("crm.common.phone")}
                  value={formatPhone(client.phone) || emDash}
                />
                <DetailRow
                  icon={Mail}
                  label={t("crm.common.email")}
                  value={client.email || emDash}
                />
                <DetailRow
                  icon={MapPin}
                  label={t("crm.clients.profile.address")}
                  value={client.address || emDash}
                />
                <DetailRow
                  icon={CalendarDays}
                  label={t("crm.clients.profile.created")}
                  value={formatShortDate(client.createdAt, locale, emDash)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-black text-slate-800">
                {t("crm.clients.payments.sidebarTitle")}
              </h3>
              <div className="space-y-2">
                <DetailRow
                  icon={CreditCard}
                  label={t("crm.clients.payments.totalPaid")}
                  value={formatCrmMoney(finance.totalPaid)}
                />
                <DetailRow
                  icon={Wallet}
                  label={t("crm.clients.payments.unpaidBalance")}
                  value={formatCrmMoney(finance.unpaidBalance)}
                />
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("payments")}
                className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xs font-black text-slate-700 transition hover:bg-slate-100"
              >
                {t("crm.clients.payments.openPayments")}
              </button>
            </section>
          </aside>

          <main className="min-w-0 space-y-4">
            {resolvedTab === "profile" && (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-black text-slate-800">
                      {t("crm.clients.profile.title")}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {t("crm.clients.profile.subtitle")}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoCard
                      label={t("crm.clients.profile.fullName")}
                      value={client.fullName || emDash}
                    />
                    <InfoCard
                      label={t("crm.clients.profile.phone")}
                      value={formatPhone(client.phone) || emDash}
                    />
                    <InfoCard
                      label={t("crm.clients.profile.email")}
                      value={client.email || emDash}
                    />
                    <InfoCard
                      label={t("crm.clients.profile.address")}
                      value={client.address || emDash}
                    />
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h4 className="text-sm font-black text-slate-800">
                      {t("crm.clients.profile.crmSummary")}
                    </h4>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <SummaryBox
                        label={t("crm.clients.profile.created")}
                        value={formatDate(client.createdAt, locale, emDash)}
                      />
                      <SummaryBox
                        label={t("crm.clients.profile.updated")}
                        value={formatDate(client.updatedAt, locale, emDash)}
                      />
                      <SummaryBox
                        label={t("crm.clients.profile.totalSpent")}
                        value={formatCrmMoney(
                          finance.totalPaid || Number(client.totalSpent) || 0
                        )}
                      />
                    </div>
                  </div>
                </section>

                <ClientDocumentationPanel
                  clientId={client._id}
                  businessId={businessId}
                  activities={client.activities || []}
                  onActivitiesChange={onActivitiesChange}
                />
              </>
            )}

            {resolvedTab === "appointments" && (
              <AppointmentsPanel
                appointments={appointments}
                loading={appointmentsLoading}
                locale={locale}
                emDash={emDash}
              />
            )}

            {resolvedTab === "payments" && (
              <PaymentsPanel
                appointments={appointments}
                loading={appointmentsLoading}
                finance={finance}
                locale={locale}
                emDash={emDash}
              />
            )}

            {resolvedTab === "client-data" && clientDataPanel}

            {SHOW_BUSINESS_MINI_SAAS &&
              resolvedTab === "portal-access" &&
              portalAccessPanel}
          </main>

          <aside className="hidden space-y-3 xl:block xl:sticky xl:top-0 xl:self-start">
            <section className="rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
              <h3 className="text-sm font-black text-slate-800">
                {t("crm.clients.details.profileSummaryTitle")}
              </h3>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
                {t("crm.clients.details.profileSummaryText")}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-black text-slate-800">
                {t("crm.clients.details.quickFacts")}
              </h3>
              <div className="space-y-2">
                <DetailRow
                  label={t("crm.clients.details.status")}
                  value={statusLabel}
                />
                <DetailRow
                  label={t("crm.clients.payments.paidVisits")}
                  value={String(finance.paidCount)}
                />
                <DetailRow
                  label={t("crm.clients.payments.openInvoices")}
                  value={String(finance.unpaidCount)}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function FinanceMetric({
  label,
  value,
  tone = "default",
  loading,
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warn";
  loading?: boolean;
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-700"
      : tone === "warn"
        ? "text-amber-700"
        : "text-slate-900";

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-base font-black sm:text-lg ${toneClass}`}>
        {loading ? "…" : value}
      </p>
    </div>
  );
}

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative inline-flex h-11 items-center justify-center gap-2 px-3 text-sm font-black transition",
        active
          ? "text-[#6D28D9]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span
        className={[
          "absolute inset-x-2 bottom-0 h-0.5 rounded-full",
          active ? "bg-[#6D28D9]" : "bg-transparent",
        ].join(" ")}
      />
    </button>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <div className="flex items-start gap-2">
        {Icon && (
          <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black text-slate-400">{label}</p>
          <p className="mt-0.5 break-words text-sm font-black text-slate-800">
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="mt-1.5 break-words text-sm font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}

function SummaryBox({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-slate-100">
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function AppointmentsPanel({
  appointments,
  loading,
  locale,
  emDash,
}: {
  appointments: AppointmentRecord[];
  loading: boolean;
  locale: string;
  emDash: string;
}) {
  const { t } = useTranslation();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-black text-slate-800">
          {t("crm.clients.appointmentsPanel.title")}
        </h3>
        <p className="mt-1 text-sm font-bold text-slate-500">
          {t("crm.clients.appointmentsPanel.subtitle")}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <BizuplyLoader />
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
          <h4 className="mt-3 text-xl font-black text-slate-800">
            {t("crm.clients.appointmentsPanel.emptyTitle")}
          </h4>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {t("crm.clients.appointmentsPanel.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {appointments.map((appointment, index) => {
            const serviceName =
              appointment.serviceName ||
              appointment.service?.name ||
              appointment.title ||
              t("crm.clients.appointmentsPanel.defaultService");
            const date =
              appointment.date ||
              appointment.appointmentDate ||
              appointment.startDate ||
              appointment.startAt;
            const time =
              appointment.time ||
              appointment.appointmentTime ||
              appointment.startHour ||
              emDash;
            const duration =
              appointment.duration ||
              appointment.durationMinutes ||
              appointment.service?.duration ||
              30;
            const price = Number(
              appointment.price || appointment.service?.price || 0
            );
            const paid = Boolean(appointment.paid);

            return (
              <article
                key={String(appointment._id || appointment.id || index)}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-black text-slate-800">
                      {serviceName}
                    </h4>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {t("crm.clients.appointmentsPanel.meta", {
                        date: formatShortDate(date, locale, emDash),
                        time,
                        duration,
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {price > 0 && (
                      <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-100">
                        {formatCrmMoney(price)}
                      </span>
                    )}
                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-black",
                        paid
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {paid ? t("crm.common.paid") : t("crm.common.unpaid")}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PaymentsPanel({
  appointments,
  loading,
  finance,
  locale,
  emDash,
}: {
  appointments: AppointmentRecord[];
  loading: boolean;
  finance: ReturnType<typeof summarizeAppointments>;
  locale: string;
  emDash: string;
}) {
  const { t } = useTranslation();
  const paymentRows = appointments.filter(
    (item) => Number(item.price || item.service?.price || 0) > 0
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h3 className="text-lg font-black text-slate-800">
          {t("crm.clients.payments.title")}
        </h3>
        <p className="mt-1 text-sm font-bold text-slate-500">
          {t("crm.clients.payments.subtitle")}
        </p>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SummaryBox
          label={t("crm.clients.payments.totalCharged")}
          value={formatCrmMoney(finance.totalCharged)}
        />
        <SummaryBox
          label={t("crm.clients.payments.totalPaid")}
          value={formatCrmMoney(finance.totalPaid)}
        />
        <SummaryBox
          label={t("crm.clients.payments.unpaidBalance")}
          value={formatCrmMoney(finance.unpaidBalance)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <BizuplyLoader />
        </div>
      ) : paymentRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <Wallet className="mx-auto h-10 w-10 text-slate-300" />
          <h4 className="mt-3 text-xl font-black text-slate-800">
            {t("crm.clients.payments.emptyTitle")}
          </h4>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {t("crm.clients.payments.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-start text-xs font-black uppercase tracking-[0.08em] text-slate-400">
              <tr>
                <th className="px-4 py-3">{t("crm.clients.payments.colService")}</th>
                <th className="px-4 py-3">{t("crm.clients.payments.colDate")}</th>
                <th className="px-4 py-3">{t("crm.clients.payments.colAmount")}</th>
                <th className="px-4 py-3">{t("crm.clients.payments.colMethod")}</th>
                <th className="px-4 py-3">{t("crm.clients.payments.colStatus")}</th>
              </tr>
            </thead>
            <tbody>
              {paymentRows.map((item, index) => {
                const price = Number(item.price || item.service?.price || 0);
                const paid = Boolean(item.paid);
                const serviceName =
                  item.serviceName ||
                  item.service?.name ||
                  item.title ||
                  t("crm.clients.appointmentsPanel.defaultService");
                const date =
                  item.paidAt ||
                  item.date ||
                  item.appointmentDate ||
                  item.startDate ||
                  item.startAt;

                return (
                  <tr
                    key={String(item._id || item.id || index)}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3 font-black text-slate-800">
                      {serviceName}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-600">
                      {formatShortDate(date, locale, emDash)}
                    </td>
                    <td className="px-4 py-3 font-black text-slate-900">
                      {formatCrmMoney(price)}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-600">
                      {getPaymentMethodLabel(item.paymentMethod, t)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-xs font-black",
                          paid
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                        ].join(" ")}
                      >
                        {paid ? t("crm.common.paid") : t("crm.common.unpaid")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
