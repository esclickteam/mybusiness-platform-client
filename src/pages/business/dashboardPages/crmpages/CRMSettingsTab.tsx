import React, { ChangeEvent, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
  Clock,
  ExternalLink,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Palette,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLocaleDir } from "@/hooks/useLocaleDir";
import WorkHoursTab from "./WorkHoursTab";

type CRMSettingsState = {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  sendFromEmail: string;
  themeColor: string;
};

type SettingFieldName = keyof CRMSettingsState;

type SettingsTabKey =
  | "general"
  | "working-hours"
  | "special-dates"
  | "booking-rules"
  | "notifications"
  | "branding"
  | "security";

type SpecialDate = {
  id: string;
  date: string;
  type: "closed" | "blocked-hours" | "custom-hours";
  start: string;
  end: string;
  note: string;
};

type BookingRulesState = {
  minNoticeHours: string;
  maxBookingDays: string;
  bufferMinutes: string;
  cancellationHours: string;
  approvalMode: "automatic" | "manual";
};

type NotificationsState = {
  emailReminders: boolean;
  smsReminders: boolean;
  whatsappReminders: boolean;
  reminderBeforeHours: string;
  followUpAfterDays: string;
};

const initialSettings: CRMSettingsState = {
  businessName: "My Business",
  businessEmail: "biz@example.com",
  businessPhone: "050-1234567",
  businessAddress: "Tel Aviv",
  sendFromEmail: "no-reply@mycrm.com",
  themeColor: "#0f172a",
};

const initialBookingRules: BookingRulesState = {
  minNoticeHours: "4",
  maxBookingDays: "30",
  bufferMinutes: "15",
  cancellationHours: "24",
  approvalMode: "automatic",
};

const initialNotifications: NotificationsState = {
  emailReminders: true,
  smsReminders: false,
  whatsappReminders: false,
  reminderBeforeHours: "24",
  followUpAfterDays: "3",
};

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100";

const settingsTabMeta: {
  key: SettingsTabKey;
  labelKey: string;
  icon: React.ElementType;
}[] = [
  { key: "general", labelKey: "crm.settings.tabs.general.label", icon: Settings },
  {
    key: "working-hours",
    labelKey: "crm.settings.tabs.workingHours.label",
    icon: Clock,
  },
  {
    key: "special-dates",
    labelKey: "crm.settings.tabs.specialDates.label",
    icon: CalendarX2,
  },
  {
    key: "booking-rules",
    labelKey: "crm.settings.tabs.bookingRules.label",
    icon: SlidersHorizontal,
  },
  {
    key: "notifications",
    labelKey: "crm.settings.tabs.notifications.label",
    icon: Bell,
  },
  {
    key: "branding",
    labelKey: "crm.settings.tabs.branding.label",
    icon: Palette,
  },
  {
    key: "security",
    labelKey: "crm.settings.tabs.security.label",
    icon: ShieldCheck,
  },
];

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function CRMSettingsTab() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("general");
  const [settings, setSettings] = useState<CRMSettingsState>(initialSettings);
  const [bookingRules, setBookingRules] =
    useState<BookingRulesState>(initialBookingRules);
  const [notifications, setNotifications] =
    useState<NotificationsState>(initialNotifications);

  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([
    {
      id: createId("exception"),
      date: "",
      type: "closed",
      start: "09:00",
      end: "17:00",
      note: "",
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const completedFields = useMemo(() => {
    return Object.values(settings).filter((value) => String(value).trim())
      .length;
  }, [settings]);

  const completionPercent = Math.round(
    (completedFields / Object.keys(settings).length) * 100
  );

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setSettings((prev) => ({
      ...prev,
      [name as SettingFieldName]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      console.log("CRM settings saved:", {
        settings,
        bookingRules,
        notifications,
        specialDates,
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Settings save error:", error);
      alert(t("crm.settings.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const addSpecialDate = () => {
    setSpecialDates((prev) => [
      {
        id: createId("exception"),
        date: "",
        type: "closed",
        start: "09:00",
        end: "17:00",
        note: "",
      },
      ...prev,
    ]);
  };

  const updateSpecialDate = (id: string, patch: Partial<SpecialDate>) => {
    setSpecialDates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const deleteSpecialDate = (id: string) => {
    setSpecialDates((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div dir={dir} className="space-y-5">
      <section className="relative overflow-hidden rounded-[2.3rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-violet-50/70 p-6 shadow-[0_26px_80px_rgba(14,165,233,0.10)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              <Settings className="h-4 w-4" />
              {t("crm.settings.badge")}
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t("crm.settings.heroTitle")}
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              {t("crm.settings.heroSubtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-5 w-5" />
                {saving
                  ? t("crm.common.saving")
                  : t("crm.settings.saveSettings")}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("working-hours")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <Clock className="h-5 w-5" />
                {t("crm.settings.workingHoursCta")}
              </button>
            </div>
          </div>

          <SettingsHeroMock />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("crm.settings.stats.profileCompletion")}
          value={`${completionPercent}%`}
          icon={CheckCircle2}
          helper={t("crm.settings.stats.profileHelper")}
        />

        <StatCard
          label={t("crm.settings.stats.businessEmail")}
          value={
            settings.businessEmail
              ? t("crm.common.active")
              : t("crm.common.missing")
          }
          icon={Mail}
          helper={t("crm.settings.stats.emailHelper")}
        />

        <StatCard
          label={t("crm.settings.stats.workingHours")}
          value={t("crm.common.ready")}
          icon={Clock}
          helper={t("crm.settings.stats.hoursHelper")}
        />

        <StatCard
          label={t("crm.settings.stats.crmSecurity")}
          value={t("crm.common.protected")}
          icon={ShieldCheck}
          helper={t("crm.settings.stats.securityHelper")}
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                {t("crm.settings.setupTitle")}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {t("crm.settings.setupSubtitle")}
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-black text-emerald-700">
                {t("crm.settings.liveCrm")}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {settingsTabMeta.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "flex min-w-fit items-center gap-3 rounded-2xl border px-4 py-3 text-start transition",
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-200"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-4 w-4",
                      isActive ? "text-white" : "text-sky-800",
                    ].join(" ")}
                  />

                  <span className="whitespace-nowrap text-sm font-black">
                    {t(tab.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              onChange={handleChange}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "working-hours" && (
            <WorkHoursTab variant="settings" />
          )}

          {activeTab === "special-dates" && (
            <SpecialDatesSettings
              specialDates={specialDates}
              onAdd={addSpecialDate}
              onUpdate={updateSpecialDate}
              onDelete={deleteSpecialDate}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "booking-rules" && (
            <BookingRulesSettings
              bookingRules={bookingRules}
              setBookingRules={setBookingRules}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsSettings
              settings={settings}
              notifications={notifications}
              setNotifications={setNotifications}
              onChange={handleChange}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "branding" && (
            <BrandingSettings
              settings={settings}
              onChange={handleChange}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "security" && <SecuritySettings />}
        </div>
      </section>

      {saved && (
        <div className="fixed bottom-6 end-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm font-black text-emerald-700 shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
          <CheckCircle2 className="h-5 w-5" />
          {t("crm.settings.savedToast")}
        </div>
      )}
    </div>
  );
}

function GeneralSettings({
  settings,
  onChange,
  onSave,
  saving,
}: {
  settings: CRMSettingsState;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();

  return (
    <SettingsPanel
      icon={Settings}
      eyebrow={t("crm.settings.general.eyebrow")}
      title={t("crm.settings.general.title")}
      description={t("crm.settings.general.description")}
      actionLabel={t("crm.common.saveChanges")}
      saving={saving}
      onSave={onSave}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label={t("crm.settings.general.businessName")}
          icon={Building2}
          helper={t("crm.settings.general.businessNameHelper")}
        >
          <input
            name="businessName"
            value={settings.businessName}
            onChange={onChange}
            placeholder={t("crm.settings.general.businessNamePlaceholder")}
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.general.businessEmail")}
          icon={Mail}
          helper={t("crm.settings.general.businessEmailHelper")}
        >
          <input
            name="businessEmail"
            type="email"
            value={settings.businessEmail}
            onChange={onChange}
            placeholder={t("crm.settings.general.businessEmailPlaceholder")}
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.general.businessPhone")}
          icon={Phone}
          helper={t("crm.settings.general.businessPhoneHelper")}
        >
          <input
            name="businessPhone"
            value={settings.businessPhone}
            onChange={onChange}
            placeholder="050-0000000"
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.general.address")}
          icon={MapPin}
          helper={t("crm.settings.general.addressHelper")}
        >
          <input
            name="businessAddress"
            value={settings.businessAddress}
            onChange={onChange}
            placeholder={t("crm.settings.general.addressPlaceholder")}
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.general.sendFromEmail")}
          icon={Bell}
          helper={t("crm.settings.general.sendFromEmailHelper")}
        >
          <input
            name="sendFromEmail"
            type="email"
            value={settings.sendFromEmail}
            onChange={onChange}
            placeholder={t("crm.settings.general.sendFromEmailPlaceholder")}
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.general.services")}
          icon={Wrench}
          helper={t("crm.settings.general.servicesHelper")}
        >
          <a
            href="../services"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 text-sm font-black text-sky-800 transition hover:bg-sky-100"
          >
            <ExternalLink className="h-4 w-4" />
            {t("crm.settings.general.openServices")}
          </a>
        </FormField>
      </div>

      <SettingsAside settings={settings} />
    </SettingsPanel>
  );
}

function SpecialDatesSettings({
  specialDates,
  onAdd,
  onUpdate,
  onDelete,
  onSave,
  saving,
}: {
  specialDates: SpecialDate[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<SpecialDate>) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();

  return (
    <SettingsPanel
      icon={CalendarX2}
      eyebrow={t("crm.settings.specialDates.eyebrow")}
      title={t("crm.settings.specialDates.title")}
      description={t("crm.settings.specialDates.description")}
      actionLabel={t("crm.settings.specialDates.addException")}
      saving={false}
      onSave={onAdd}
      secondaryActionLabel={t("crm.settings.specialDates.saveExceptions")}
      secondarySaving={saving}
      onSecondarySave={onSave}
    >
      <div className="space-y-4">
        {specialDates.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.7rem] border border-slate-100 bg-slate-50/60 p-4"
          >
            <div className="grid gap-4 xl:grid-cols-[180px_220px_1fr_auto] xl:items-end">
              <FormSmall label={t("crm.common.date")}>
                <input
                  type="date"
                  value={item.date}
                  onChange={(event) =>
                    onUpdate(item.id, { date: event.target.value })
                  }
                  className={inputClass}
                />
              </FormSmall>

              <FormSmall label={t("crm.settings.specialDates.exceptionType")}>
                <select
                  value={item.type}
                  onChange={(event) =>
                    onUpdate(item.id, {
                      type: event.target.value as SpecialDate["type"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="closed">
                    {t("crm.settings.specialDates.closedAllDay")}
                  </option>
                  <option value="blocked-hours">
                    {t("crm.settings.specialDates.blockTimeRange")}
                  </option>
                  <option value="custom-hours">
                    {t("crm.settings.specialDates.customOpeningHours")}
                  </option>
                </select>
              </FormSmall>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormSmall label={t("crm.settings.specialDates.start")}>
                  <input
                    type="time"
                    value={item.start}
                    disabled={item.type === "closed"}
                    onChange={(event) =>
                      onUpdate(item.id, { start: event.target.value })
                    }
                    className={inputClass}
                  />
                </FormSmall>

                <FormSmall label={t("crm.settings.specialDates.end")}>
                  <input
                    type="time"
                    value={item.end}
                    disabled={item.type === "closed"}
                    onChange={(event) =>
                      onUpdate(item.id, { end: event.target.value })
                    }
                    className={inputClass}
                  />
                </FormSmall>
              </div>

              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="h-12 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
              >
                {t("crm.common.delete")}
              </button>
            </div>

            <div className="mt-4">
              <FormSmall label={t("crm.settings.specialDates.internalNote")}>
                <textarea
                  value={item.note}
                  onChange={(event) =>
                    onUpdate(item.id, { note: event.target.value })
                  }
                  placeholder={t("crm.settings.specialDates.notePlaceholder")}
                  rows={3}
                  className={textareaClass}
                />
              </FormSmall>
            </div>
          </article>
        ))}
      </div>

      <SettingsTipCard
        icon={CalendarX2}
        title={t("crm.settings.specialDates.tipTitle")}
        text={t("crm.settings.specialDates.tipText")}
      />
    </SettingsPanel>
  );
}

function BookingRulesSettings({
  bookingRules,
  setBookingRules,
  onSave,
  saving,
}: {
  bookingRules: BookingRulesState;
  setBookingRules: React.Dispatch<React.SetStateAction<BookingRulesState>>;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();

  return (
    <SettingsPanel
      icon={SlidersHorizontal}
      eyebrow={t("crm.settings.bookingRules.eyebrow")}
      title={t("crm.settings.bookingRules.title")}
      description={t("crm.settings.bookingRules.description")}
      actionLabel={t("crm.settings.bookingRules.saveRules")}
      saving={saving}
      onSave={onSave}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label={t("crm.settings.bookingRules.minNotice")}
          icon={CalendarClock}
          helper={t("crm.settings.bookingRules.minNoticeHelper")}
        >
          <input
            type="number"
            value={bookingRules.minNoticeHours}
            onChange={(event) =>
              setBookingRules((prev) => ({
                ...prev,
                minNoticeHours: event.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.bookingRules.maxWindow")}
          icon={CalendarClock}
          helper={t("crm.settings.bookingRules.maxWindowHelper")}
        >
          <input
            type="number"
            value={bookingRules.maxBookingDays}
            onChange={(event) =>
              setBookingRules((prev) => ({
                ...prev,
                maxBookingDays: event.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.bookingRules.buffer")}
          icon={Clock}
          helper={t("crm.settings.bookingRules.bufferHelper")}
        >
          <input
            type="number"
            value={bookingRules.bufferMinutes}
            onChange={(event) =>
              setBookingRules((prev) => ({
                ...prev,
                bufferMinutes: event.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.bookingRules.cancellation")}
          icon={CalendarX2}
          helper={t("crm.settings.bookingRules.cancellationHelper")}
        >
          <input
            type="number"
            value={bookingRules.cancellationHours}
            onChange={(event) =>
              setBookingRules((prev) => ({
                ...prev,
                cancellationHours: event.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.bookingRules.approvalMode")}
          icon={SlidersHorizontal}
          helper={t("crm.settings.bookingRules.approvalModeHelper")}
        >
          <select
            value={bookingRules.approvalMode}
            onChange={(event) =>
              setBookingRules((prev) => ({
                ...prev,
                approvalMode: event.target
                  .value as BookingRulesState["approvalMode"],
              }))
            }
            className={inputClass}
          >
            <option value="automatic">
              {t("crm.settings.bookingRules.automaticApproval")}
            </option>
            <option value="manual">
              {t("crm.settings.bookingRules.manualApproval")}
            </option>
          </select>
        </FormField>
      </div>

      <SettingsTipCard
        icon={Sparkles}
        title={t("crm.settings.bookingRules.tipTitle")}
        text={t("crm.settings.bookingRules.tipText")}
      />
    </SettingsPanel>
  );
}

function NotificationsSettings({
  settings,
  notifications,
  setNotifications,
  onChange,
  onSave,
  saving,
}: {
  settings: CRMSettingsState;
  notifications: NotificationsState;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationsState>>;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();

  return (
    <SettingsPanel
      icon={Bell}
      eyebrow={t("crm.settings.notifications.eyebrow")}
      title={t("crm.settings.notifications.title")}
      description={t("crm.settings.notifications.description")}
      actionLabel={t("crm.settings.notifications.saveNotifications")}
      saving={saving}
      onSave={onSave}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label={t("crm.settings.notifications.sendFromEmail")}
          icon={Mail}
          helper={t("crm.settings.notifications.sendFromEmailHelper")}
        >
          <input
            name="sendFromEmail"
            value={settings.sendFromEmail}
            onChange={onChange}
            placeholder={t(
              "crm.settings.notifications.sendFromEmailPlaceholder"
            )}
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.notifications.reminderBefore")}
          icon={Bell}
          helper={t("crm.settings.notifications.reminderBeforeHelper")}
        >
          <input
            type="number"
            value={notifications.reminderBeforeHours}
            onChange={(event) =>
              setNotifications((prev) => ({
                ...prev,
                reminderBeforeHours: event.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <FormField
          label={t("crm.settings.notifications.followUpAfter")}
          icon={MessageSquareText}
          helper={t("crm.settings.notifications.followUpAfterHelper")}
        >
          <input
            type="number"
            value={notifications.followUpAfterDays}
            onChange={(event) =>
              setNotifications((prev) => ({
                ...prev,
                followUpAfterDays: event.target.value,
              }))
            }
            className={inputClass}
          />
        </FormField>

        <div className="grid gap-3">
          <ToggleBox
            title={t("crm.settings.notifications.emailReminders")}
            text={t("crm.settings.notifications.emailRemindersText")}
            checked={notifications.emailReminders}
            onClick={() =>
              setNotifications((prev) => ({
                ...prev,
                emailReminders: !prev.emailReminders,
              }))
            }
          />

          <ToggleBox
            title={t("crm.settings.notifications.smsReminders")}
            text={t("crm.settings.notifications.smsRemindersText")}
            checked={notifications.smsReminders}
            onClick={() =>
              setNotifications((prev) => ({
                ...prev,
                smsReminders: !prev.smsReminders,
              }))
            }
          />

          <ToggleBox
            title={t("crm.settings.notifications.whatsappReminders")}
            text={t("crm.settings.notifications.whatsappRemindersText")}
            checked={notifications.whatsappReminders}
            onClick={() =>
              setNotifications((prev) => ({
                ...prev,
                whatsappReminders: !prev.whatsappReminders,
              }))
            }
          />
        </div>
      </div>

      <SettingsTipCard
        icon={MessageSquareText}
        title={t("crm.settings.notifications.tipTitle")}
        text={t("crm.settings.notifications.tipText")}
      />
    </SettingsPanel>
  );
}

function BrandingSettings({
  settings,
  onChange,
  onSave,
  saving,
}: {
  settings: CRMSettingsState;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const { t } = useTranslation();

  return (
    <SettingsPanel
      icon={Palette}
      eyebrow={t("crm.settings.branding.eyebrow")}
      title={t("crm.settings.branding.title")}
      description={t("crm.settings.branding.description")}
      actionLabel={t("crm.settings.branding.saveBranding")}
      saving={saving}
      onSave={onSave}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label={t("crm.settings.branding.primaryColor")}
          icon={Palette}
          helper={t("crm.settings.branding.primaryColorHelper")}
        >
          <div className="flex gap-3">
            <input
              name="themeColor"
              type="color"
              value={settings.themeColor}
              onChange={onChange}
              className="h-12 w-14 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-1"
            />

            <input
              name="themeColor"
              value={settings.themeColor}
              onChange={onChange}
              placeholder="#0f172a"
              className={inputClass}
            />
          </div>
        </FormField>

        <FormField
          label={t("crm.settings.branding.businessName")}
          icon={Building2}
          helper={t("crm.settings.branding.businessNameHelper")}
        >
          <input
            name="businessName"
            value={settings.businessName}
            onChange={onChange}
            className={inputClass}
          />
        </FormField>
      </div>

      <BrandPreview settings={settings} />
    </SettingsPanel>
  );
}

function SecuritySettings() {
  const { t } = useTranslation();

  return (
    <SettingsPanel
      icon={ShieldCheck}
      eyebrow={t("crm.settings.security.eyebrow")}
      title={t("crm.settings.security.title")}
      description={t("crm.settings.security.description")}
      actionLabel={t("crm.settings.security.protectedAction")}
      saving={false}
      onSave={() => undefined}
      hideAction
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <SecurityCard
          icon={ShieldCheck}
          title={t("crm.settings.security.protectedCrmTitle")}
          text={t("crm.settings.security.protectedCrmText")}
        />

        <SecurityCard
          icon={LockKeyhole}
          title={t("crm.settings.security.privateFilesTitle")}
          text={t("crm.settings.security.privateFilesText")}
        />

        <SecurityCard
          icon={Sparkles}
          title={t("crm.settings.security.futurePermissionsTitle")}
          text={t("crm.settings.security.futurePermissionsText")}
        />
      </div>

      <SettingsTipCard
        icon={LockKeyhole}
        title={t("crm.settings.security.tipTitle")}
        text={t("crm.settings.security.tipText")}
      />
    </SettingsPanel>
  );
}

function SettingsPanel({
  icon: Icon,
  eyebrow,
  title,
  description,
  actionLabel,
  saving,
  onSave,
  secondaryActionLabel,
  secondarySaving,
  onSecondarySave,
  hideAction,
  children,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  saving: boolean;
  onSave: () => void;
  secondaryActionLabel?: string;
  secondarySaving?: boolean;
  onSecondarySave?: () => void;
  hideAction?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-violet-50/50 p-5 shadow-[0_18px_50px_rgba(14,165,233,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
              <Icon className="h-5 w-5" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">
                {eyebrow}
              </div>

              <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                {title}
              </h3>

              <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                {description}
              </p>
            </div>
          </div>

          {!hideAction && (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              {saving ? t("crm.common.saving") : actionLabel}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 p-5">
            <h3 className="text-2xl font-black text-slate-950">{title}</h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {description}
            </p>
          </div>

          <div className="p-5">{children}</div>

          {onSecondarySave && secondaryActionLabel && (
            <div className="flex justify-end border-t border-slate-100 p-5">
              <SaveButton
                onClick={onSecondarySave}
                saving={Boolean(secondarySaving)}
                label={secondaryActionLabel}
              />
            </div>
          )}
        </div>

        <SettingsTipCard icon={Icon} title={title} text={description} />
      </div>
    </section>
  );
}

function SettingsAside({ settings }: { settings: CRMSettingsState }) {
  const { t } = useTranslation();

  return (
    <aside className="space-y-5">
      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
            <Settings className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-black text-slate-950">
              {t("crm.settings.general.overviewTitle")}
            </h3>

            <p className="text-xs font-semibold text-slate-500">
              {t("crm.settings.general.overviewSubtitle")}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <OverviewRow
            label={t("crm.settings.general.overviewBusinessName")}
            value={settings.businessName}
          />
          <OverviewRow
            label={t("crm.common.email")}
            value={settings.businessEmail}
          />
          <OverviewRow
            label={t("crm.common.phone")}
            value={settings.businessPhone}
          />
          <OverviewRow
            label={t("crm.common.address")}
            value={settings.businessAddress}
          />
          <OverviewRow
            label={t("crm.settings.general.overviewSender")}
            value={settings.sendFromEmail}
          />
        </div>
      </section>

      <BrandPreview settings={settings} />
    </aside>
  );
}

function BrandPreview({ settings }: { settings: CRMSettingsState }) {
  const { t } = useTranslation();

  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <h3 className="text-base font-black text-slate-950">
        {t("crm.settings.branding.previewTitle")}
      </h3>

      <div className="mt-4 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm"
            style={{ backgroundColor: settings.themeColor }}
          >
            <Building2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">
              {settings.businessName ||
                t("crm.settings.branding.previewFallbackName")}
            </p>

            <p className="truncate text-xs font-semibold text-slate-500">
              {settings.businessEmail ||
                t("crm.settings.branding.previewFallbackEmail")}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
          style={{ backgroundColor: settings.themeColor }}
        >
          {t("crm.settings.branding.previewButton")}
        </button>
      </div>
    </section>
  );
}

function SettingsTipCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  const { t } = useTranslation();

  return (
    <aside className="h-fit rounded-[2rem] border border-sky-100 bg-sky-50/50 p-5 shadow-[0_12px_36px_rgba(14,165,233,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-800 shadow-sm ring-1 ring-sky-100">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-base font-black text-slate-950">{title}</h3>

          <p className="text-xs font-semibold text-slate-500">
            {t("crm.settings.tipSectionLabel")}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
        {text}
      </p>
    </aside>
  );
}

function SettingsHeroMock() {
  return (
    <div className="relative hidden h-44 xl:block">
      <div className="absolute right-10 top-0 h-40 w-72 rounded-3xl border border-white bg-white/70 shadow-[0_24px_60px_rgba(14,165,233,0.16)] backdrop-blur" />

      <div className="absolute right-44 top-12 flex h-24 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 shadow-sm">
        <Settings className="h-10 w-10 text-sky-700" />
      </div>

      <div className="absolute right-20 top-10 h-28 w-44 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-sky-100 backdrop-blur">
        <div className="h-4 w-24 rounded-full bg-sky-200" />
        <div className="mt-4 h-3 w-32 rounded-full bg-slate-100" />
        <div className="mt-3 h-3 w-24 rounded-full bg-slate-100" />
        <div className="mt-3 h-3 w-28 rounded-full bg-slate-100" />
      </div>

      <div className="absolute right-0 top-9 h-28 w-32 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-violet-100 backdrop-blur">
        <div className="flex h-full items-end gap-3">
          <span className="h-12 w-4 rounded-full bg-sky-200" />
          <span className="h-20 w-4 rounded-full bg-violet-300" />
          <span className="h-10 w-4 rounded-full bg-emerald-200" />
        </div>
      </div>

      <div className="absolute right-[-16px] top-5 grid gap-3">
        {[Clock, Bell, Palette].map((Icon, index) => (
          <div
            key={index}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100"
          >
            <Icon className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  helper,
  children,
}: {
  label: string;
  icon: React.ElementType;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-[1.5rem] border border-slate-100 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-900 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <span className="block text-sm font-black text-slate-900">
            {label}
          </span>

          <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">
            {helper}
          </span>
        </div>
      </div>

      {children}
    </label>
  );
}

function FormSmall({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>

      {children}
    </label>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">
            {t("crm.common.statusActive")}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>

      <span className="max-w-[170px] truncate text-sm font-black text-slate-800">
        {value || t("crm.common.missing")}
      </span>
    </div>
  );
}

function ToggleBox({
  title,
  text,
  checked,
  onClick,
}: {
  title: string;
  text: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-start transition",
        checked
          ? "border-sky-200 bg-sky-50"
          : "border-slate-200 bg-slate-50 hover:bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>

          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            {text}
          </p>
        </div>

        <span
          className={[
            "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
            checked
              ? "border-sky-700 bg-sky-700 text-white"
              : "border-slate-300 bg-white text-transparent",
          ].join(" ")}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

function SaveButton({
  onClick,
  saving,
  label,
}: {
  onClick: () => void;
  saving: boolean;
  label: string;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save className="h-5 w-5" />
      {saving ? t("crm.common.saving") : label}
    </button>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {text}
      </p>
    </article>
  );
}
