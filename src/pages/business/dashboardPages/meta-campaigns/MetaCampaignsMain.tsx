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
import { LayoutDashboard, Megaphone, Settings2, Sparkles } from "lucide-react";
import CreateCampaignButton from "./CreateCampaignButton";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";
import { applyLanguageFromUrl, normalizeLanguage } from "../../../../i18n/localeUtils";
import { isMetaCampaignsKnownChildPath } from "./campaignCreationMode";
import MetaAdsDateRangeBar from "./MetaAdsDateRangeBar";
import { MetaAdsTimeZoneProvider } from "./metaAdsTimeZone";
import "../bizModuleDesign.css";

type MetaCampaignsTab = {
  path: string;
  labelKey: string;
  icon: React.ElementType;
};

const tabs: MetaCampaignsTab[] = [
  { path: "overview", labelKey: "metaCampaigns.nav.overview", icon: LayoutDashboard },
  { path: "campaigns", labelKey: "metaCampaigns.nav.campaigns", icon: Megaphone },
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

    const basePath = isRoot
      ? cleanPath
      : cleanPath.replace(new RegExp(`/${lastPart}$`), "");

    if (
      lastPart === "rules" ||
      lastPart === "automations" ||
      lastPart === "copilot" ||
      lastPart === "health" ||
      lastPart === "goals" ||
      lastPart === "recommendations" ||
      lastPart === "portfolio" ||
      lastPart === "library"
    ) {
      navigate(`${basePath}/overview`, { replace: true });
      return;
    }

    if (!isRoot && isKnownTab) return;

    navigate(`${basePath}/overview`, { replace: true });
  }, [currentTab, isKnownTab, location.pathname, location.search, navigate, searchParams]);

  return (
    <MetaAdsTimeZoneProvider>
    <section
      dir={dir}
      className="biz-module biz-campaigns min-h-[calc(100vh-72px)] px-3 py-3 text-start sm:px-5 sm:py-4 lg:px-6"
    >
      <div className="mx-auto w-full max-w-[1920px]">
        <header className="biz-shell">
          <div className="biz-shell-top">
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
              </div>
            </div>

          <nav
            aria-label={t("metaCampaigns.shell.title")}
            className="biz-tabs"
          >
            <label className="block px-2 py-2 md:hidden">
              <span className="sr-only">{t("metaCampaigns.shell.title")}</span>
              <select
                className="h-11 w-full border border-slate-200 bg-white px-3 text-sm font-black text-slate-800"
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
            <div className="biz-tabs-row hidden md:flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <NavLink
                    key={tab.path}
                    to={{ pathname: tab.path, search: searchParams.toString() }}
                    className={({ isActive }) =>
                      `biz-tab${isActive ? " is-active" : ""}`
                    }
                  >
                    <Icon />
                    <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
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
    </MetaAdsTimeZoneProvider>
  );
}
