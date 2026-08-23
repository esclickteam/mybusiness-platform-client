import React, { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Activity,
  History,
  Inbox,
  ListChecks,
  MessageCircle,
  Send,
  Settings2,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import { reactivateWhatsAppBilling } from "../../../../api/whatsappBillingApi";
import { useWhatsAppBilling } from "./billing/useWhatsAppBilling";
import WhatsAppUsageCard from "./billing/WhatsAppUsageCard";
import WhatsAppBillingSetupModal from "./billing/WhatsAppBillingSetupModal";
import WhatsAppCheckoutProcessing from "./billing/WhatsAppCheckoutProcessing";
import GuidedDemoSandboxButton from "../../../../guidedDemo/GuidedDemoSandboxButton";

type WhatsAppTab = {
  path: string;
  labelKey: string;
  icon: React.ElementType;
};

const tabs: WhatsAppTab[] = [
  { path: "compose", labelKey: "whatsapp.nav.compose", icon: Send },
  { path: "templates", labelKey: "whatsapp.nav.templates", icon: MessageCircle },
  { path: "lists", labelKey: "whatsapp.nav.lists", icon: ListChecks },
  { path: "automations", labelKey: "whatsapp.nav.automations", icon: Workflow },
  { path: "inbox", labelKey: "whatsapp.nav.inbox", icon: Inbox },
  { path: "history", labelKey: "whatsapp.nav.history", icon: History },
  { path: "health", labelKey: "whatsapp.nav.health", icon: Activity },
  { path: "settings", labelKey: "whatsapp.nav.settings", icon: Settings2 },
];

function readWaBillingFlag(searchParams: URLSearchParams) {
  return (
    searchParams.get("waBilling") ||
    searchParams.get("whatsappBilling") ||
    null
  );
}

export default function WhatsAppMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupModalMode, setSetupModalMode] = useState<"setup" | "manage">(
    "setup"
  );
  const [checkoutProcessingOpen, setCheckoutProcessingOpen] = useState(false);

  const {
    usage: billingUsage,
    loading: billingLoading,
    error: billingError,
    refresh: refreshBilling,
    setUsage: setBillingUsage,
  } = useWhatsAppBilling(businessId);

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "compose";
  }, [location.pathname]);

  const isKnownTab = useMemo(
    () => tabs.some((tab) => tab.path === currentTab),
    [currentTab]
  );

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const pathParts = cleanPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const isRoot = lastPart === "whatsapp";

    if (!isRoot && isKnownTab) return;

    const basePath = isRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/compose`, { replace: true });
  }, [currentTab, isKnownTab, location.pathname, navigate]);

  useEffect(() => {
    const flag = readWaBillingFlag(searchParams);
    if (!flag) return;
    if (flag === "processing") {
      setCheckoutProcessingOpen(true);
      toast.info("מעדכנים את חיוב WhatsApp...");
    } else if (flag === "cancel") {
      toast.info("הגדרת החיוב בוטלה — ניתן להגדיר מחדש בכל עת.");
    }
    const next = new URLSearchParams(searchParams);
    next.delete("waBilling");
    next.delete("whatsappBilling");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const openSetupModal = (mode: "setup" | "manage") => {
    setSetupModalMode(mode);
    setSetupModalOpen(true);
  };

  const handleReactivate = async () => {
    if (!businessId) return;
    try {
      await reactivateWhatsAppBilling(businessId);
      toast.success("הביטול בוטל והחיוב יישאר פעיל.");
      await refreshBilling();
    } catch {
      toast.error("לא הצלחנו להשאיר את החיוב פעיל.");
    }
  };

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
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-emerald-50/80 via-sky-50/50 to-violet-50/40"
            />
            <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("whatsapp.shell.badge")}
                </p>
                <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t("whatsapp.shell.title")}
                </h1>
                <p className="mt-0.5 max-w-2xl text-sm font-semibold text-slate-500">
                  {t("whatsapp.shell.subtitle")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <GuidedDemoSandboxButton
                  target="whatsapp-demo-send"
                  className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black text-amber-900"
                >
                  שלחו הודעת הדגמה — לא נשלחת ללקוח אמיתי
                </GuidedDemoSandboxButton>
                <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-xs font-black text-emerald-700">
                    {t("whatsapp.shell.channel")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label={t("whatsapp.shell.title")}
            className="border-t border-slate-100 px-2 sm:px-3"
          >
            <div
              className={[
                "flex items-stretch gap-0.5 overflow-x-auto",
                "[scrollbar-width:none] [-ms-overflow-style:none]",
                "[&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent",
              ].join(" ")}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                      [
                        "group relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-black transition-colors",
                        "focus:outline-none focus-visible:bg-emerald-50",
                        isActive
                          ? "text-emerald-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={[
                            "h-4 w-4 shrink-0",
                            isActive
                              ? "text-emerald-600"
                              : "text-slate-400 group-hover:text-slate-600",
                          ].join(" ")}
                        />
                        <span className="whitespace-nowrap">
                          {t(tab.labelKey)}
                        </span>
                        <span
                          className={[
                            "absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity",
                            isActive
                              ? "bg-emerald-500 opacity-100"
                              : "opacity-0",
                          ].join(" ")}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </header>

        {businessId ? (
          <WhatsAppUsageCard
            businessId={businessId}
            usage={billingUsage}
            loading={billingLoading}
            error={billingError}
            onRetry={() => void refreshBilling()}
            onOpenSetup={() => openSetupModal("setup")}
            onOpenManage={() => openSetupModal("manage")}
            onReactivate={() => void handleReactivate()}
          />
        ) : null}

        <main className="w-full min-w-0">
          <Outlet context={{ businessId }} />
        </main>
      </div>

      {businessId ? (
        <>
          <WhatsAppBillingSetupModal
            open={setupModalOpen}
            businessId={businessId}
            usage={billingUsage}
            initialMode={setupModalMode}
            onClose={() => setSetupModalOpen(false)}
            onUsageUpdated={async () => {
              await refreshBilling();
            }}
          />
          <WhatsAppCheckoutProcessing
            open={checkoutProcessingOpen}
            businessId={businessId}
            onDone={(usage) => {
              setBillingUsage(usage);
              setCheckoutProcessingOpen(false);
              void refreshBilling();
            }}
            onClose={() => setCheckoutProcessingOpen(false)}
          />
        </>
      ) : null}
    </section>
  );
}
