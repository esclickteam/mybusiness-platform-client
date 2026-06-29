// Collab.tsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import { AiProvider } from "../../../context/AiContext";

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
  businessId?: string | number;
  subscriptionPlan?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
};

type TabItem = {
  to: string;
  label: string;
};

const tabs: TabItem[] = [
  {
    to: "profile",
    label: "פרופיל עסקי",
  },
  {
    to: "find-partner",
    label: "מציאת שותף עסקי",
  },
  {
    to: "messages",
    label: "הצעות שיתוף פעולה",
  },
  {
    to: "market",
    label: "שוק שיתופי פעולה",
  },
];

export default function Collab() {
  const { user, loading } = useAuth() as AuthContextValue;
  const location = useLocation();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileImage] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const devMode = true;
  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess =
    isDevUser || Boolean(user?.subscriptionPlan?.includes("collaboration"));

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
        console.error("שגיאה בטעינת הפרופיל:", err);
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    }

    void fetchProfile();

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
    return (
      <div dir="rtl" className="p-6 text-center text-sm font-bold text-slate-700">
        🔄 טוען נתונים...
      </div>
    );
  }

  if (!user && !devMode) {
    return (
      <div dir="rtl" className="p-6 text-center text-sm font-bold text-slate-700">
        ⚠️ יש להתחבר כדי לגשת לעמוד הזה.
      </div>
    );
  }

  if (!hasCollabAccess && !devMode) {
    return (
      <div dir="rtl" className="p-6 text-center">
        <h2 className="text-xl font-black text-slate-950">
          שיתופי פעולה זמינים רק במסלול המתקדם
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
        dir="rtl"
        className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-white via-sky-50/40 to-cyan-50/60 px-4 py-6 text-right text-slate-950 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-7xl">
          <nav
            role="tablist"
            aria-label="שיתופי פעולה"
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
                userBusinessId: user?.businessId
                  ? String(user.businessId)
                  : null,
              }}
            />
          </div>
        </div>
      </section>
    </AiProvider>
  );
}