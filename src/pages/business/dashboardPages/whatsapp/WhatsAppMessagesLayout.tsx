import React, { Suspense } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { History, ListChecks, Send } from "lucide-react";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { cardBase } from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";
import WhatsAppTabSuspenseFallback from "./WhatsAppTabSuspenseFallback";

const SUB_TABS = [
  { path: "compose", labelKey: "whatsapp.nav.compose", icon: Send },
  { path: "lists", labelKey: "whatsapp.nav.lists", icon: ListChecks },
  { path: "history", labelKey: "whatsapp.nav.history", icon: History },
] as const;

export default function WhatsAppMessagesLayout() {
  const { t, i18n } = useTranslation();
  const ctx = useOutletContext<WhatsAppHubOutletContext>();

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      <div className={`${cardBase} overflow-hidden !shadow-none`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5 sm:px-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              {t("whatsapp.nav.messages")}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              {t("whatsapp.hub.messagesSubtitle")}
            </p>
          </div>
          <nav
            aria-label={t("whatsapp.nav.messages")}
            className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5"
          >
            {SUB_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    [
                      "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition",
                      isActive
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800",
                    ].join(" ")
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(tab.labelKey)}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="p-3 sm:p-4">
          <Suspense fallback={<WhatsAppTabSuspenseFallback />}>
            <Outlet context={ctx} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
