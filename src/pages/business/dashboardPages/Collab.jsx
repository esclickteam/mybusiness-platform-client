// Collab.js
import React, { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { io } from "socket.io-client";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import { AiProvider } from "../../../context/AiContext";
import "./Collab.css";

export default function Collab() {
  const { user, loading } = useAuth();
  const { businessId } = useParams(); // ✅ מקור האמת היחיד
  const location = useLocation();

  const role = (user?.role || "").toLowerCase();
  const isAdmin = role === "admin";

  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [socket, setSocket] = useState(null);

  const devMode = true;
  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess =
    isDevUser || user?.subscriptionPlan?.includes("collaboration");

  /* =========================
     Load business profile
     ✅ תמיד לפי businessId מה־URL
  ========================= */
  useEffect(() => {
    if (!user || !businessId) return;

    async function fetchProfile() {
      try {
        const { data } = await API.get(`/business/${businessId}`);

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
        console.error("❌ Error loading business profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [user, businessId]);

  /* =========================
     Socket.IO
     ✅ businessId מה־URL
  ========================= */
  useEffect(() => {
    if (!businessId) return;

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "https://api.bizuply.com";

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem("token"),
        businessId,
      },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [businessId]);

  /* =========================
     Guards
  ========================= */
  if (loading || loadingProfile) {
    return <div className="p-6 text-center">🔄 Loading data...</div>;
  }

  if (!user && !devMode) {
    return <div className="p-6 text-center">⚠️ Please sign in.</div>;
  }

  if (!hasCollabAccess && !isAdmin && !devMode) {
    return (
      <div className="p-6 text-center">
        <h2>Collaborations are available only in the advanced plan</h2>
        <UpgradeBanner />
      </div>
    );
  }

  /* =========================
     Render
  ========================= */
  return (
    <AiProvider>
      <div className="p-6 collab-container">
        {/* Tabs */}
        <nav className="tab-header tab-header-ltr">
          <NavLink
            to="profile"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            Business Profile
          </NavLink>

          <NavLink
            to="find-partner"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            Find Business Partner
          </NavLink>

          <NavLink
            to="messages"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            Proposals
          </NavLink>

          <NavLink
            to="market"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            Collaboration Market
          </NavLink>
        </nav>

        {/* Tabs content */}
        <Outlet
          key={location.pathname}
          context={{
            profileData,
            loadingProfile,
            socket,
            businessId, // ✅ תמיד מה־URL
            isAdmin,
          }}
        />
      </div>
    </AiProvider>
  );
}
