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

const settingsTabs: {
  key: SettingsTabKey;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    key: "general",
    label: "General",
    description: "Business details",
    icon: Settings,
  },
  {
    key: "working-hours",
    label: "Working Hours",
    description: "Weekly availability",
    icon: Clock,
  },
  {
    key: "special-dates",
    label: "Special Dates",
    description: "Closed dates & blocked hours",
    icon: CalendarX2,
  },
  {
    key: "booking-rules",
    label: "Booking Rules",
    description: "Booking limits",
    icon: SlidersHorizontal,
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Reminders & messages",
    icon: Bell,
  },
  {
    key: "branding",
    label: "Branding",
    description: "Colors & preview",
    icon: Palette,
  },
  {
    key: "security",
    label: "Security",
    description: "Protected CRM",
    icon: ShieldCheck,
  },
];

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function CRMSettingsTab() {
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

  const activeTabData =
    settingsTabs.find((tab) => tab.key === activeTab) || settingsTabs[0];

  const ActiveSettingsIcon = activeTabData.icon;

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

      // Future API:
      // await API.post("/crm/settings", {
      //   settings,
      //   bookingRules,
      //   notifications,
      //   specialDates,
      // });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Settings save error:", error);
      alert("Failed to save settings");
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
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-28 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-100">
              <Settings className="h-4 w-4" />
              CRM Settings
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Business and CRM preferences
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-sky-100/90">
              Manage business profile, working hours, blocked dates, booking
              rules, reminders, branding and security from one clean settings
              screen.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-950 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-5 w-5" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Profile completion"
          value={`${completionPercent}%`}
          icon={CheckCircle2}
          helper="business details"
        />
        <StatCard
          label="Business email"
          value={settings.businessEmail ? "Active" : "Missing"}
          icon={Mail}
          helper="customer communication"
        />
        <StatCard
          label="Working hours"
          value="Ready"
          icon={Clock}
          helper="booking availability"
        />
        <StatCard
          label="CRM security"
          value="Protected"
          icon={ShieldCheck}
          helper="system settings"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)] xl:sticky xl:top-6">
          <div className="p-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
              Settings tabs
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              CRM Setup
            </h3>
          </div>

          <div className="mt-2 grid gap-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "group relative flex items-center gap-3 rounded-[1.35rem] border px-3 py-3 text-left transition",
                    isActive
                      ? "border-sky-100 bg-gradient-to-r from-sky-50 via-white to-violet-50 shadow-[0_14px_34px_rgba(14,165,233,0.13)]"
                      : "border-transparent bg-transparent hover:border-slate-100 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-sky-400 to-violet-400" />
                  )}

                  <div
                    className={[
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                      isActive
                        ? "bg-white text-sky-700 shadow-sm ring-1 ring-sky-100"
                        : "bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-700",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {tab.label}
                    </p>

                    <p
                      className={[
                        "truncate text-xs font-bold",
                        isActive ? "text-sky-600" : "text-slate-400",
                      ].join(" ")}
                    >
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0 space-y-5">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
                <ActiveSettingsIcon className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  {activeTabData.label}
                </h3>

                <p className="text-sm font-semibold text-slate-500">
                  {activeTabData.description}
                </p>
              </div>
            </div>
          </div>

          {activeTab === "general" && (
            <GeneralSettings
              settings={settings}
              onChange={handleChange}
              onSave={handleSave}
              saving={saving}
            />
          )}

          {activeTab === "working-hours" && <WorkHoursTab />}

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
        </main>
      </section>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-sm font-black text-emerald-700 shadow-[0_20px_70px_rgba(15,23,42,0.18)]">
          <CheckCircle2 className="h-5 w-5" />
          Settings saved successfully
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
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-2xl font-black text-slate-950">
            General Settings
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            These details are used across your CRM, reminders and business
            profile.
          </p>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <FormField
            label="Business Name"
            icon={Building2}
            helper="Displayed inside the CRM and business profile."
          >
            <input
              name="businessName"
              value={settings.businessName}
              onChange={onChange}
              placeholder="Business name"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Business Email"
            icon={Mail}
            helper="Used for client communication and alerts."
          >
            <input
              name="businessEmail"
              type="email"
              value={settings.businessEmail}
              onChange={onChange}
              placeholder="business@example.com"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Business Phone"
            icon={Phone}
            helper="Main phone number shown to clients."
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
            label="Address"
            icon={MapPin}
            helper="Business location or service area."
          >
            <input
              name="businessAddress"
              value={settings.businessAddress}
              onChange={onChange}
              placeholder="Business address"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Reminder Sending Email"
            icon={Bell}
            helper="The email address used for CRM reminders."
          >
            <input
              name="sendFromEmail"
              type="email"
              value={settings.sendFromEmail}
              onChange={onChange}
              placeholder="no-reply@example.com"
              className={inputClass}
            />
          </FormField>

          <FormField
            label="Services"
            icon={Wrench}
            helper="Services stay as a main CRM module."
          >
            <a
              href="../services"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 text-sm font-black text-sky-800 transition hover:bg-sky-100"
            >
              <ExternalLink className="h-4 w-4" />
              Open Services
            </a>
          </FormField>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-500">
            Working hours and special dates are managed inside Settings.
            Services stays as a main CRM module.
          </p>

          <SaveButton onClick={onSave} saving={saving} label="Save Changes" />
        </div>
      </div>

      <SettingsAside settings={settings} />
    </section>
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
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-950">
            Special Dates & Exceptions
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Block full dates, block a specific time range, or define special
            opening hours for one date.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
        >
          <CalendarX2 className="h-5 w-5" />
          Add Exception
        </button>
      </div>

      <div className="grid gap-4 p-5">
        {specialDates.map((item) => (
          <article
            key={item.id}
            className="rounded-[1.7rem] border border-slate-100 bg-slate-50/60 p-4"
          >
            <div className="grid gap-4 xl:grid-cols-[180px_220px_1fr_auto] xl:items-end">
              <FormSmall label="Date">
                <input
                  type="date"
                  value={item.date}
                  onChange={(event) =>
                    onUpdate(item.id, { date: event.target.value })
                  }
                  className={inputClass}
                />
              </FormSmall>

              <FormSmall label="Exception Type">
                <select
                  value={item.type}
                  onChange={(event) =>
                    onUpdate(item.id, {
                      type: event.target.value as SpecialDate["type"],
                    })
                  }
                  className={inputClass}
                >
                  <option value="closed">Closed all day</option>
                  <option value="blocked-hours">Block time range</option>
                  <option value="custom-hours">Custom opening hours</option>
                </select>
              </FormSmall>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormSmall label="Start">
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

                <FormSmall label="End">
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
                Delete
              </button>
            </div>

            <div className="mt-4">
              <FormSmall label="Internal note">
                <textarea
                  value={item.note}
                  onChange={(event) =>
                    onUpdate(item.id, { note: event.target.value })
                  }
                  placeholder="Example: holiday, vacation, private event..."
                  rows={3}
                  className={textareaClass}
                />
              </FormSmall>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-500">
          Later this should be saved to the backend as booking availability
          exceptions.
        </p>

        <SaveButton onClick={onSave} saving={saving} label="Save Exceptions" />
      </div>
    </section>
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
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-2xl font-black text-slate-950">Booking Rules</h3>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Control how clients can book, cancel and schedule appointments.
        </p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <FormField
          label="Minimum notice"
          icon={CalendarClock}
          helper="How many hours before an appointment clients can book."
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
          label="Maximum booking window"
          icon={CalendarClock}
          helper="How many days ahead clients can book."
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
          label="Buffer between appointments"
          icon={Clock}
          helper="Minutes to block between bookings."
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
          label="Cancellation limit"
          icon={CalendarX2}
          helper="How many hours before the appointment clients can cancel."
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
          label="Approval mode"
          icon={SlidersHorizontal}
          helper="Choose if bookings are approved automatically or manually."
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
            <option value="automatic">Automatic approval</option>
            <option value="manual">Manual approval</option>
          </select>
        </FormField>
      </div>

      <div className="flex justify-end border-t border-slate-100 p-5">
        <SaveButton onClick={onSave} saving={saving} label="Save Rules" />
      </div>
    </section>
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
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-2xl font-black text-slate-950">Notifications</h3>

        <p className="mt-1 text-sm font-semibold text-slate-500">
          Configure reminders, follow-ups and sender email.
        </p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <FormField
          label="Reminder Sending Email"
          icon={Mail}
          helper="Used as the sender for reminder emails."
        >
          <input
            name="sendFromEmail"
            value={settings.sendFromEmail}
            onChange={onChange}
            placeholder="no-reply@example.com"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Reminder before appointment"
          icon={Bell}
          helper="How many hours before the appointment to remind."
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
          label="Follow-up after"
          icon={MessageSquareText}
          helper="How many days after appointment to create follow-up."
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
            title="Email reminders"
            text="Send reminder emails to clients."
            checked={notifications.emailReminders}
            onClick={() =>
              setNotifications((prev) => ({
                ...prev,
                emailReminders: !prev.emailReminders,
              }))
            }
          />

          <ToggleBox
            title="SMS reminders"
            text="Prepare SMS reminder rules."
            checked={notifications.smsReminders}
            onClick={() =>
              setNotifications((prev) => ({
                ...prev,
                smsReminders: !prev.smsReminders,
              }))
            }
          />

          <ToggleBox
            title="WhatsApp reminders"
            text="Prepare WhatsApp reminder rules."
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

      <div className="flex justify-end border-t border-slate-100 p-5">
        <SaveButton onClick={onSave} saving={saving} label="Save Notifications" />
      </div>
    </section>
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
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-2xl font-black text-slate-950">Branding</h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Control CRM brand color and visual preview.
          </p>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <FormField
            label="Primary Color"
            icon={Palette}
            helper="Brand color used for CRM customization."
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
            label="Business Name"
            icon={Building2}
            helper="Displayed in previews and client portal."
          >
            <input
              name="businessName"
              value={settings.businessName}
              onChange={onChange}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="flex justify-end border-t border-slate-100 p-5">
          <SaveButton onClick={onSave} saving={saving} label="Save Branding" />
        </div>
      </div>

      <BrandPreview settings={settings} />
    </section>
  );
}

function SecuritySettings() {
  return (
    <section className="grid gap-5 lg:grid-cols-3">
      <SecurityCard
        icon={ShieldCheck}
        title="Protected CRM"
        text="Your CRM security settings are ready for protected client data."
      />

      <SecurityCard
        icon={LockKeyhole}
        title="Private client files"
        text="Client details and private portal variables should stay behind login."
      />

      <SecurityCard
        icon={Sparkles}
        title="Future permissions"
        text="Later you can add role permissions for workers, admins and clients."
      />
    </section>
  );
}

function SettingsAside({ settings }: { settings: CRMSettingsState }) {
  return (
    <aside className="space-y-5">
      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
            <Settings className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-black text-slate-950">
              Settings Overview
            </h3>

            <p className="text-xs font-semibold text-slate-500">
              Live status of this CRM setup
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <OverviewRow label="Business name" value={settings.businessName} />
          <OverviewRow label="Email" value={settings.businessEmail} />
          <OverviewRow label="Phone" value={settings.businessPhone} />
          <OverviewRow label="Address" value={settings.businessAddress} />
          <OverviewRow label="Sender" value={settings.sendFromEmail} />
        </div>
      </section>

      <BrandPreview settings={settings} />
    </aside>
  );
}

function BrandPreview({ settings }: { settings: CRMSettingsState }) {
  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <h3 className="text-base font-black text-slate-950">Brand Preview</h3>

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
              {settings.businessName || "Business Name"}
            </p>

            <p className="truncate text-xs font-semibold text-slate-500">
              {settings.businessEmail || "business@example.com"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
          style={{ backgroundColor: settings.themeColor }}
        >
          Preview Button
        </button>
      </div>
    </section>
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
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>

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
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>

      <span className="max-w-[170px] truncate text-sm font-black text-slate-800">
        {value || "Missing"}
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
        "rounded-2xl border p-4 text-left transition",
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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Save className="h-5 w-5" />
      {saving ? "Saving..." : label}
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