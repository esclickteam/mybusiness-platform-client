import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles, Workflow } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import WhatsAppAutomationsTab from "../whatsapp/WhatsAppAutomationsTab";

/**
 * Top-level Automations workspace in the business dashboard.
 * Reuses the WhatsApp automations manager UI with its own shell + nav entry.
 */
export default function AutomationsMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth() as {
    user?: { businessId?: string | null } | null;
  };
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-72px)] bg-[#F7F8FC] px-3 py-4 text-start text-slate-900 sm:px-5 sm:py-5 lg:px-6"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <header className="mb-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-violet-50/80 via-sky-50/50 to-cyan-50/40"
            />
            <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("automations.shell.badge", "Automations")}
                </p>
                <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t("automations.shell.title", "Automations")}
                </h1>
                <p className="mt-0.5 max-w-2xl text-sm font-semibold text-slate-500">
                  {t(
                    "automations.shell.subtitle",
                    "Reminders, follow-ups and WhatsApp workflows that run in the background."
                  )}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-1.5">
                <Workflow className="h-3.5 w-3.5 text-violet-600" />
                <span className="text-xs font-black text-violet-700">
                  {t("automations.shell.channel", "CRM + WhatsApp")}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full min-w-0">
          <WhatsAppAutomationsTab businessIdOverride={businessId} />
        </main>
      </div>
    </section>
  );
}
