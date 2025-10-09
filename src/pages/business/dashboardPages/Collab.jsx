// Collab.js
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import { AiProvider } from "../../../context/AiContext";
import "./Collab.css";

export default function Collab() {
  const { user, loading } = useAuth();
  const { tab } = useParams();

  const [profileData, setProfileData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [socket, setSocket] = useState(null);

  const devMode = true;
  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess =
    isDevUser || user?.subscriptionPlan?.includes("collaboration");

  // טעינת פרופיל העסק
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await API.get("/business/my");
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
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  // חיבור ל-Socket.IO
  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

    const newSocket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (loading) return <div className="p-6 text-center">🔄 טוען נתונים...</div>;
  if (!user && !devMode)
    return <div className="p-6 text-center">⚠️ יש להתחבר כדי לגשת לדף זה.</div>;
  if (!hasCollabAccess && !devMode)
    return (
      <div className="p-6 text-center">
        <h2>שיתופי פעולה זמינים רק בחבילה מתקדמת</h2>
        <UpgradeBanner />
      </div>
    );

  return (
    <AiProvider>
      <div className="p-6 collab-container">
        <nav className="tab-header" role="tablist" aria-label="שיתופי פעולה">
          <NavLink
            to="profile"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            פרופיל עסקי
          </NavLink>
          <NavLink
            to="find-partner"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            מצא שותף עסקי
          </NavLink>
          <NavLink
            to="messages"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            הצעות
          </NavLink>
          <NavLink
            to="market"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            מרקט שיתופים
          </NavLink>
        </nav>

        <Outlet
          context={{
            profileData,
            profileImage,
            loadingProfile,
            socket,
            userBusinessId: user?.businessId ? String(user.businessId) : null,
          }}
        />
      </div>
    </AiProvider>
  );
}
