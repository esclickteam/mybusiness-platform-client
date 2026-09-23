/**
 * Dev-only visual QA — no nested MemoryRouter (App already has a Router).
 */
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/i18n";
import WhatsAppOverviewTab from "../business/dashboardPages/whatsapp/WhatsAppOverviewTab";
import WhatsAppProfileTab from "../business/dashboardPages/whatsapp/WhatsAppProfileTab";
import WhatsAppInsightsTab from "../business/dashboardPages/whatsapp/WhatsAppInsightsTab";
import WhatsAppBillingTab from "../business/dashboardPages/whatsapp/WhatsAppBillingTab";
import WhatsAppDevelopersTab from "../business/dashboardPages/whatsapp/WhatsAppDevelopersTab";
import WhatsAppTemplateDrawer from "../business/dashboardPages/whatsapp/WhatsAppTemplateDrawer";
import type { WhatsAppConnection, WhatsAppTemplate } from "../../api/whatsappApi";
import { WhatsAppVisualQaProvider } from "./whatsappVisualQaContext";
import {
  formatMessagingLimit,
  formatNameStatus,
  formatQualityRating,
  nameStatusBadgeClass,
  qualityBadgeClass,
  toneBadgeClass,
} from "../business/dashboardPages/whatsapp/hubFormat";
import { MessageCircle, RefreshCw, Settings2 } from "lucide-react";
import { btnSecondary, cardBase } from "../../styles/bizuplyUi";

const MOCK_CONNECTION: WhatsAppConnection = {
  connected: true,
  readyToSend: true,
  readiness: "ready",
  readinessLabel: "Ready",
  status: "connected",
  phoneNumberId: "123456789012345",
  wabaId: "987654321098765",
  wabaName: "Bizuply Demo WABA",
  displayPhoneNumber: "+972 51-595-3390",
  verifiedName: "Invistimo RSVP",
  nameStatus: "APPROVED",
  qualityRating: "GREEN",
  messagingLimitTier: "TIER_10K",
  lastMetaSyncAt: new Date().toISOString(),
  hasAccessToken: true,
  usingEnvFallback: false,
  lastError: "",
  connectedAt: new Date().toISOString(),
  businessVerificationStatus: "verified",
};

const MOCK_TEMPLATE: WhatsAppTemplate = {
  _id: "tpl_demo_1",
  name: "appointment_reminder",
  key: "appointment_reminder",
  category: "appointment_reminder",
  language: "he",
  body: "שלום {{1}}, תזכורת לפגישה בתאריך {{2}} בשעה {{3}}.",
  footer: "Bizuply",
  headerType: "text",
  headerText: "תזכורת לפגישה",
  variables: ["1", "2", "3"],
  buttons: [{ type: "quick_reply", text: "אישור הגעה" }],
  metaStatus: "APPROVED",
  metaQualityScore: "GREEN",
  metaCategory: "UTILITY",
  source: "meta",
  status: "active",
  updatedAt: new Date().toISOString(),
  rejectionReason: "",
};

const TABS = [
  "סקירה",
  "פרופיל",
  "תבניות",
  "הודעות",
  "Inbox",
  "Insights",
  "API / Developers",
  "חיוב ושימוש",
];

function MockHubChrome({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const qualityLabel = formatQualityRating(MOCK_CONNECTION.qualityRating);
  const nameStatusLabel = formatNameStatus(MOCK_CONNECTION.nameStatus);
  const limitLabel = formatMessagingLimit(MOCK_CONNECTION.messagingLimitTier);

  return (
    <div className="bg-[#F5F7FB] p-3" dir="rtl">
      <header className="mb-3 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-2.5 border-b border-slate-100 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h1 className="text-base font-black text-slate-900">
                  {MOCK_CONNECTION.verifiedName}
                </h1>
                <span className="text-sm font-semibold text-slate-500" dir="ltr">
                  {MOCK_CONNECTION.displayPhoneNumber}
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${toneBadgeClass("ok")}`}
                >
                  Connected
                </span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${toneBadgeClass("ok")}`}
                >
                  Ready
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-semibold text-slate-500">
                <span>
                  Quality:{" "}
                  <span
                    className={`rounded border px-1.5 text-[10px] font-bold ${qualityBadgeClass(
                      MOCK_CONNECTION.qualityRating
                    )}`}
                  >
                    {qualityLabel}
                  </span>
                </span>
                <span>Limit: {limitLabel}</span>
                <span>
                  Name:{" "}
                  <span
                    className={`rounded border px-1.5 text-[10px] font-bold ${nameStatusBadgeClass(
                      MOCK_CONNECTION.nameStatus
                    )}`}
                  >
                    {nameStatusLabel}
                  </span>
                </span>
                <span>Last sync: just now</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className={`${btnSecondary} !px-2.5 !py-1.5 text-[11px]`}>
              <Settings2 className="h-3.5 w-3.5" />
              ניהול חיבור
            </span>
            <span className={`${btnSecondary} !px-2.5 !py-1.5 text-[11px]`}>
              <RefreshCw className="h-3.5 w-3.5" />
              סנכרון עם Meta
            </span>
          </div>
        </div>
        <nav className="flex flex-wrap gap-0.5 px-2">
          {TABS.map((tab) => (
            <span
              key={tab}
              className={[
                "relative shrink-0 px-2.5 py-2.5 text-[13px] font-bold",
                tab === active ? "text-emerald-700" : "text-slate-500",
              ].join(" ")}
            >
              {tab}
              {tab === active ? (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-500" />
              ) : null}
            </span>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

function QaBlock({
  label,
  active,
  children,
}: {
  label: string;
  active: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-qa-screen={label}
      className="mb-8 overflow-hidden rounded-xl border border-dashed border-violet-200 bg-white shadow-sm"
    >
      <div className="border-b border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-800">
        QA: {label}
      </div>
      <WhatsAppVisualQaProvider value={{ connection: MOCK_CONNECTION }}>
        <MockHubChrome active={active}>{children}</MockHubChrome>
      </WhatsAppVisualQaProvider>
    </section>
  );
}

function TemplatesTableMock() {
  return (
    <div className="space-y-3 p-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-black text-slate-900">תבניות</h2>
        <div className="flex gap-1.5">
          <span className={`${btnSecondary} !px-3 !py-1.5 text-xs`}>
            סנכרון עם Meta
          </span>
          <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
            יצירת תבנית
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {["הכל", "מאושרות", "ממתינות", "נדחו"].map((f, i) => (
          <span
            key={f}
            className={[
              "rounded-full border px-3 py-1 text-xs font-black",
              i === 0
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600",
            ].join(" ")}
          >
            {f}
          </span>
        ))}
        <span className="ms-auto rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-400">
          חיפוש תבניות…
        </span>
      </div>
      <div className={`${cardBase} overflow-x-auto`}>
        <table className="min-w-full text-start text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase text-slate-400">
            <tr>
              <th className="px-3 py-2.5">Name</th>
              <th className="px-3 py-2.5">Preview</th>
              <th className="px-3 py-2.5">Language</th>
              <th className="px-3 py-2.5">Category</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Quality</th>
              <th className="px-3 py-2.5">Updated</th>
              <th className="px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-50 hover:bg-slate-50/60">
              <td className="px-3 py-2.5 font-black">appointment_reminder</td>
              <td className="max-w-[220px] truncate px-3 py-2.5 text-xs text-slate-500">
                שלום {"{{1}}"}, תזכורת לפגישה בתאריך {"{{2}}"}…
              </td>
              <td className="px-3 py-2.5 text-xs font-bold">he</td>
              <td className="px-3 py-2.5 text-xs font-semibold text-slate-600">
                Utility
              </td>
              <td className="px-3 py-2.5">
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                  Approved
                </span>
              </td>
              <td className="px-3 py-2.5">
                <span className="rounded-md border border-emerald-100 bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-800">
                  High
                </span>
              </td>
              <td className="px-3 py-2.5 text-[11px] text-slate-500">היום</td>
              <td className="px-3 py-2.5 text-[10px] font-bold text-slate-500">
                View · Send
              </td>
            </tr>
            <tr className="hover:bg-slate-50/60">
              <td className="px-3 py-2.5 font-black">promo_weekend</td>
              <td className="max-w-[220px] truncate px-3 py-2.5 text-xs text-slate-500">
                מבצע סופ״ש — עד 30% הנחה
              </td>
              <td className="px-3 py-2.5 text-xs font-bold">he</td>
              <td className="px-3 py-2.5 text-xs font-semibold text-slate-600">
                Marketing
              </td>
              <td className="px-3 py-2.5">
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                  Pending
                </span>
              </td>
              <td className="px-3 py-2.5 text-[11px] text-slate-400">—</td>
              <td className="px-3 py-2.5 text-[11px] text-slate-500">אתמול</td>
              <td className="px-3 py-2.5 text-[10px] font-bold text-slate-500">
                View
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MessagesMock() {
  return (
    <div className={`${cardBase} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
        <div>
          <h2 className="text-base font-black">הודעות</h2>
          <p className="text-xs font-semibold text-slate-500">
            שליחת קמפיינים, ניהול רשימות וצפייה בהיסטוריה
          </p>
        </div>
        <div className="flex gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {["שליחה", "רשימות תפוצה", "היסטוריה"].map((t, i) => (
            <span
              key={t}
              className={[
                "rounded-md px-2.5 py-1.5 text-xs font-bold",
                i === 0
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500",
              ].join(" ")}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 text-sm font-semibold text-slate-600">
        אזור שליחה — בחירת תבנית מאושרת, נמענים ותצוגה מקדימה.
      </div>
    </div>
  );
}

export default function WhatsAppHubVisualQaPage() {
  if (!import.meta.env.DEV) {
    return (
      <div className="p-8 text-sm font-semibold text-slate-600">
        Visual QA is available in development builds only.
      </div>
    );
  }

  if (i18n.language !== "he") {
    void i18n.changeLanguage("he");
  }

  const screen = new URLSearchParams(window.location.search)
    .get("screen")
    ?.toLowerCase();
  const show = (id: string) => !screen || screen === id;

  return (
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen bg-slate-100 p-4" dir="rtl" lang="he">
        <h1 className="mb-4 text-lg font-black text-slate-900">
          WhatsApp Hub — Visual QA (dev · RTL · 1440)
          {screen ? ` · ${screen}` : ""}
        </h1>
        <div className="mx-auto max-w-[1440px] space-y-6">
          {show("overview") ? (
            <QaBlock label="overview" active="סקירה">
              <WhatsAppOverviewTab />
            </QaBlock>
          ) : null}
          {show("profile") ? (
            <QaBlock label="profile" active="פרופיל">
              <WhatsAppProfileTab />
            </QaBlock>
          ) : null}
          {show("templates") ? (
            <QaBlock label="templates" active="תבניות">
              <TemplatesTableMock />
            </QaBlock>
          ) : null}
          {show("template-drawer") ? (
            <section
              data-qa-screen="template-drawer"
              className="relative mb-8 min-h-[640px] overflow-hidden rounded-xl border border-dashed border-violet-200 bg-[#F5F7FB]"
            >
              <div className="border-b border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-800">
                QA: Template Drawer
              </div>
              <div className="relative min-h-[600px] p-3">
                <TemplatesTableMock />
                <WhatsAppTemplateDrawer
                  open
                  contained
                  template={MOCK_TEMPLATE}
                  onClose={() => undefined}
                />
              </div>
            </section>
          ) : null}
          {show("messages") ? (
            <QaBlock label="messages" active="הודעות">
              <MessagesMock />
            </QaBlock>
          ) : null}
          {show("insights") ? (
            <QaBlock label="insights" active="Insights">
              <WhatsAppInsightsTab />
            </QaBlock>
          ) : null}
          {show("developers") ? (
            <QaBlock label="developers" active="API / Developers">
              <WhatsAppDevelopersTab />
            </QaBlock>
          ) : null}
          {show("billing") ? (
            <QaBlock label="billing" active="חיוב ושימוש">
              <WhatsAppBillingTab />
            </QaBlock>
          ) : null}
        </div>
      </div>
    </I18nextProvider>
  );
}
