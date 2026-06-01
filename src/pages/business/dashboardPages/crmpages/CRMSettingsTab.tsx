import React, { ChangeEvent, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  Settings,
  ShieldCheck,
} from "lucide-react";

type CRMSettingsState = {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  sendFromEmail: string;
  themeColor: string;
};

type SettingFieldName = keyof CRMSettingsState;

const initialSettings: CRMSettingsState = {
  businessName: "My Business",
  businessEmail: "biz@example.com",
  businessPhone: "050-1234567",
  businessAddress: "Tel Aviv",
  sendFromEmail: "no-reply@mycrm.com",
  themeColor: "#0f172a",
};

export default function CRMSettingsTab() {
  const [settings, setSettings] = useState<CRMSettingsState>(initialSettings);
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

      console.log("CRM settings saved:", settings);

      // Future API:
      // await API.post("/crm/settings", settings);

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

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/90">
              Manage your business details, reminder sender email and CRM
              branding from one clean settings screen.
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
          label="Reminder sender"
          value={settings.sendFromEmail ? "Ready" : "Missing"}
          icon={Bell}
          helper="email reminders"
        />
        <StatCard
          label="CRM security"
          value="Protected"
          icon={ShieldCheck}
          helper="system settings"
        />
      </section>

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
                onChange={handleChange}
                placeholder="Business name"
                className="input-tailwind"
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
                onChange={handleChange}
                placeholder="business@example.com"
                className="input-tailwind"
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
                onChange={handleChange}
                placeholder="050-0000000"
                className="input-tailwind"
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
                onChange={handleChange}
                placeholder="Business address"
                className="input-tailwind"
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
                onChange={handleChange}
                placeholder="no-reply@example.com"
                className="input-tailwind"
              />
            </FormField>

            <FormField
              label="Primary Color"
              icon={Palette}
              helper="Brand color used for future CRM customization."
            >
              <div className="flex gap-3">
                <input
                  name="themeColor"
                  type="color"
                  value={settings.themeColor}
                  onChange={handleChange}
                  className="h-12 w-14 cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-1"
                />

                <input
                  name="themeColor"
                  value={settings.themeColor}
                  onChange={handleChange}
                  placeholder="#0f172a"
                  className="input-tailwind flex-1"
                />
              </div>
            </FormField>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-500">
              Changes are saved locally for now. Later we can connect this to
              the database.
            </p>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

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

          <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <h3 className="text-base font-black text-slate-950">
              Brand Preview
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

          <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <h3 className="text-base font-black text-slate-950">
              Settings Tips
            </h3>

            <div className="mt-4 space-y-3">
              <TipItem text="Use a real business email for reminders and notifications." />
              <TipItem text="Keep your phone and address updated for client trust." />
              <TipItem text="Later we can connect these settings to your backend." />
            </div>
          </section>
        </aside>
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

function OverviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
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

function TipItem({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <p className="text-sm font-semibold leading-6 text-slate-600">{text}</p>
    </div>
  );
}