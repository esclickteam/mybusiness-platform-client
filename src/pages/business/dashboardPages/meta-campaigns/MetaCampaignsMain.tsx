import React, { useEffect, useMemo } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, ListChecks, Megaphone, MessageSquare, PieChart, Settings2, Sparkles, Target } from "lucide-react";
import CreateCampaignButton from "./CreateCampaignButton";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import LanguageSwitcher from "../../../../components/LanguageSwitcher";
import { applyLanguageFromUrl, normalizeLanguage } from "../../../../i18n/localeUtils";
import { isMetaCampaignsKnownChildPath } from "./campaignCreationMode";
import MetaAdsDateRangeBar from "./MetaAdsDateRangeBar";

type MetaCampaignsTab = {
  path: string;
  labelKey: string;
  icon: React.ElementType;
};

const tabs: MetaCampaignsTab[] = [
  { path: "overview", labelKey: "metaCampaigns.nav.overview", icon: LayoutDashboard },
  { path: "campaigns", labelKey: "metaCampaigns.nav.campaigns", icon: Megaphone },
  { path: "goals", labelKey: "metaCampaigns.nav.goals", icon: Target },
  { path: "rules", labelKey: "metaCampaigns.nav.automations", icon: ListChecks },
  { path: "portfolio", labelKey: "metaCampaigns.nav.portfolio", icon: PieChart },
  { path: "copilot", labelKey: "metaCampaigns.nav.copilot", icon: MessageSquare },
  { path: "settings", labelKey: "metaCampaigns.nav.settings", icon: Settings2 },
];

export default function MetaCampaignsMain() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;
  const currentLang = normalizeLanguage(i18n.language);

  useEffect(() => {
    const fromUrl = applyLanguageFromUrl();
    if (fromUrl && fromUrl !== currentLang) {
      void i18n.changeLanguage(fromUrl);
    }
  }, [currentLang, i18n, searchParams]);

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "overview";
    if (parts.includes("edit")) return "edit";
    if (last === "automations") return "rules";
    return last;
  }, [location.pathname]);

  const isKnownTab = useMemo(
    () =>
      tabs.some((tab) => tab.path === currentTab) ||
      isMetaCampaignsKnownChildPath(currentTab) ||
      currentTab === "edit" ||
      /^\d+$/.test(currentTab),
    [currentTab]
  );

  useEffect(() => {
    const cleanPath = location.pathname.replace(/\/+$/, "");
    const pathParts = cleanPath.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const isRoot = lastPart === "meta-campaigns";

    if (pathParts.includes("edit")) return;
    if (!isRoot && isKnownTab) return;

    const basePath = isRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${currentTab}$`), "");

    navigate(`${basePath}/overview`, { replace: true });
  }, [currentTab, isKnownTab, location.pathname, navigate]);

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
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-blue-50/80 via-violet-50/50 to-sky-50/40"
            />
            <div className="relative flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("metaCampaigns.shell.badge")}
                </p>
                <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t("metaCampaigns.shell.title")}
                </h1>
                <p className="mt-0.5 max-w-2xl text-sm font-semibold text-slate-500">
                  {t("metaCampaigns.shell.subtitle")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <MetaAdsDateRangeBar />
                {businessId ? (
                  <CreateCampaignButton
                    basePath={`/business/${businessId}/dashboard/meta-campaigns`}
                  />
                ) : null}
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <nav
            aria-label={t("metaCampaigns.shell.title")}
            className="border-t border-slate-100 px-2 sm:px-3"
          >
            <label className="block px-2 py-2 md:hidden">
              <span className="sr-only">{t("metaCampaigns.shell.title")}</span>
              <select
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-800"
                value={tabs.some((tab) => tab.path === currentTab) ? currentTab : "overview"}
                onChange={(event) =>
                  navigate({ pathname: event.target.value, search: searchParams.toString() })
                }
              >
                {tabs.map((tab) => (
                  <option key={tab.path} value={tab.path}>
                    {t(tab.labelKey)}
                  </option>
                ))}
              </select>
            </label>
            <div
              className={[
                "hidden items-stretch gap-0.5 md:flex",
              ].join(" ")}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.path}
                    to={{ pathname: tab.path, search: searchParams.toString() }}
                    className={({ isActive }) =>
                      [
                        "group relative flex shrink-0 items-center gap-2 px-3 py-3 text-sm font-black transition-colors",
                        "focus:outline-none focus-visible:bg-violet-50",
                        isActive
                          ? "text-violet-700"
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
                              ? "text-violet-600"
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
                              ? "bg-violet-500 opacity-100"
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

        <main className="w-full min-w-0">
          <Outlet context={{ businessId }} />
        </main>
      </div>
    </section>
  );
}
