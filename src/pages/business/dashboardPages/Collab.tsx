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
import "../../interiorDesign.css";

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
  { to: "collaborations", labelKey: "collab.tabs.collaborations" },
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
        className="biz-interior min-h-[calc(100vh-72px)] px-4 py-6 text-start sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <nav
            role="tablist"
            aria-label={t("collab.navAria")}
            className="mb-6 flex flex-wrap gap-2 bg-transparent p-0"
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  [
                    "flex min-h-11 items-center justify-center px-4 text-sm font-black",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b21b6]",
                    isActive
                      ? "bg-[#5b21b6] text-white"
                      : "border border-[rgba(91,33,182,0.18)] bg-white text-[#21172f]",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div>
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
