// Collab.tsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { io, Socket } from "socket.io-client";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import { AiProvider } from "../../../context/AiContext";
import { fetchMyBusinessId } from "./collabtabs/collabUtils";
import { useLocaleDir } from "../../../hooks/useLocaleDir";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

type ProfileData = {
  businessName: string;
  category: string;
  area: string;
  about: string;
  collabPref: string;
  contact: string;
  phone: string;
  email: string;
};

type AuthUser = {
  email?: string;
  role?: string;
  businessId?: string | number;
  subscriptionPlan?: string;
  hasAccess?: boolean;
  isTrialActive?: boolean;
  hasPaid?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isImpersonating?: boolean;
};

type TabItem = {
  to: string;
  labelKey: string;
};

const tabDefs: TabItem[] = [
  { to: "profile", labelKey: "collab.tabs.profile" },
  { to: "find-partner", labelKey: "collab.tabs.findPartner" },
  { to: "messages", labelKey: "collab.tabs.messages" },
  { to: "market", labelKey: "collab.tabs.market" },
];

export default function Collab() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { user, loading, isImpersonating } = useAuth() as AuthContextValue;
  const location = useLocation();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileImage] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [resolvedBusinessId, setResolvedBusinessId] = useState<string | null>(
    null
  );

  const tabs = useMemo(
    () =>
      tabDefs.map((tab) => ({
        to: tab.to,
        label: t(tab.labelKey),
      })),
    [t]
  );

  const devMode = false;
  const isDevUser = user?.email === "newuser@example.com";
  const isAdmin = user?.role === "admin";
  // Admin (or admin entering a business) bypasses plan paywalls
  const hasCollabAccess =
    isAdmin ||
    Boolean(isImpersonating) ||
    isDevUser ||
    Boolean(user?.hasAccess) ||
    Boolean(user?.isTrialActive) ||
    Boolean(user?.hasPaid) ||
    user?.subscriptionPlan === "trial" ||
    user?.subscriptionPlan === "monthly" ||
    user?.subscriptionPlan === "yearly" ||
    user?.subscriptionPlan === "quarterly";

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const { data } = await API.get("/business/my");

        if (!isMounted) return;

        setProfileData({
          businessName: data.businessName || data.name || "",
          category: data.category || "",
          area: data.area || "",
          about: data.about || "",
          collabPref: data.collabPref || "",
          contact: data.contact || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    }

    void fetchProfile();

    void fetchMyBusinessId().then((id) => {
      if (isMounted && id) {
        setResolvedBusinessId(id);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

    const newSocket = io(socketUrl, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (loading) {
    return <BizuplyLoader fullScreen label={t("collab.loading")} />;
  }

  if (!user && !devMode) {
    return (
      <div dir={dir} className="p-6 text-center text-sm font-bold text-slate-700">
        ⚠️ {t("collab.loginRequired")}
      </div>
    );
  }

  if (!hasCollabAccess && !devMode) {
    return (
      <div dir={dir} className="p-6 text-center">
        <h2 className="text-xl font-black text-slate-800">
          {t("collab.upgradeOnly")}
        </h2>

        <div className="mt-4">
          <UpgradeBanner />
        </div>
      </div>
    );
  }

  return (
    <AiProvider>
      <section
        dir={dir}
        className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-white via-sky-50/40 to-cyan-50/60 px-4 py-6 text-start text-slate-800 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <nav
            role="tablist"
            aria-label={t("collab.navAria")}
            className="mb-8 flex flex-row justify-center gap-5 overflow-x-auto rounded-[2rem] border border-slate-100 bg-white/85 px-4 py-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl"
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  [
                    "flex min-h-14 shrink-0 items-center justify-center rounded-full px-8 text-lg font-black transition-all duration-300",
                    "focus:outline-none focus:ring-4 focus:ring-violet-100",
                    isActive
                      ? "bg-purple-700 text-white shadow-[0_14px_34px_rgba(126,34,206,0.30)] hover:bg-purple-800"
                      : "bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-violet-50 hover:text-purple-700",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <Outlet
              key={location.pathname}
              context={{
                profileData,
                profileImage,
                loadingProfile,
                socket,
                userBusinessId:
                  (user?.businessId ? String(user.businessId) : null) ||
                  resolvedBusinessId,
              }}
            />
          </div>
        </div>
      </section>
    </AiProvider>
  );
}
