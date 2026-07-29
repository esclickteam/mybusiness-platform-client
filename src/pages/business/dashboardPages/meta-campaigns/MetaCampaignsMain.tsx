import React, { useEffect, useMemo } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Megaphone, PlusCircle, Settings2, Sparkles } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { normalizeBusinessId } from "../../../../utils/notificationNavigation";

type MetaCampaignsTab = {
  path: string;
  labelKey: string;
  icon: React.ElementType;
};

const tabs: MetaCampaignsTab[] = [
  { path: "overview", labelKey: "metaCampaigns.nav.overview", icon: LayoutDashboard },
  { path: "create", labelKey: "metaCampaigns.nav.create", icon: PlusCircle },
  { path: "settings", labelKey: "metaCampaigns.nav.settings", icon: Settings2 },
];

export default function MetaCampaignsMain() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const location = useLocation();
  const navigate = useNavigate();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const businessId =
    normalizeBusinessId(urlBusinessId) ||
    normalizeBusinessId(user?.businessId) ||
    null;

  const currentTab = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1] || "overview";
    if (parts.includes("edit")) return "edit";
    return last;
  }, [location.pathname]);

  const isKnownTab = useMemo(
    () =>
      tabs.some((tab) => tab.path === currentTab) ||
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

              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-1.5">
                <Megaphone className="h-3.5 w-3.5 text-violet-600" />
                <span className="text-xs font-black text-violet-700">
                  {t("metaCampaigns.shell.channel")}
                </span>
              </div>
            </div>
          </div>

          <nav
            aria-label={t("metaCampaigns.shell.title")}
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
