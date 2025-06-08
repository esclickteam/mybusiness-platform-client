// src/pages/business/BusinessDashboardRoutes.jsx

import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import BuildBusinessPage  from "./dashboardPages/build/Build";
import DashboardPage      from "./dashboardPages/DashboardPage";
import Collab             from "./dashboardPages/Collab";
import Upgrade            from "./dashboardPages/Upgrade";
import CartPage           from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";

import BusinessChatPage   from "../../components/BusinessChatPage";

// 🟢 צ'אט עסקי אמיתי בין עסקים — עדכון ייבוא!
import CollabChat         from "./dashboardPages/collabtabs/CollabChat";

import AffiliatePage      from "./dashboardPages/AffiliatePage";
import EsclickAdvisor     from "./dashboardPages/EsclickAdvisor";

import CRMMain            from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab      from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab     from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab     from "./dashboardPages/crmpages/CRMSettingsTab";

import GoalsPage          from "./dashboardPages/GoalsPage";

import { useAuth } from "../../context/AuthContext";
import { createSocket } from "../../socket";
import { getBusinessId } from "../../utils/authHelpers";

const BusinessDashboardRoutes = () => {
  const { initialized, logout, refreshAccessToken } = useAuth();
  const businessId = getBusinessId();
  const socketRef = useRef(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    if (!initialized || !businessId) return;

    async function setupSocket() {
      const token = await refreshAccessToken();
      if (!token) {
        logout();
        return;
      }
      const sock = await createSocket(refreshAccessToken, logout, businessId);
      if (!sock) return;

      socketRef.current = sock;

      sock.on("unreadMessagesCount", (count) => {
        setNewMessagesCount(count || 0);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }

    const cleanup = setupSocket();
    return () => cleanup && cleanup();
  }, [initialized, businessId, logout, refreshAccessToken]);

  return (
    <Routes>
      <Route path="" element={<BusinessDashboardLayout newMessagesCount={newMessagesCount} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="edit"  element={<BuildBusinessPage />} />
        <Route path="build" element={<BuildBusinessPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="collab"  element={<Collab />} />
        <Route path="upgrade" element={<Upgrade />} />
        <Route path="esclick" element={<EsclickAdvisor />} />
        <Route path="goals"   element={<GoalsPage />} />
        <Route path="messages" element={<BusinessChatPage />} />
        <Route path="business-messages" element={<CollabChat />} />
        <Route path="affiliate" element={<AffiliatePage />} />
        <Route path="crm" element={<CRMMain />}>
          <Route index element={<Navigate to="appointments" replace />} />
          <Route path="appointments" element={<CRMAppointmentsTab />} />
          <Route path="clients"      element={<CRMClientsTab />} />
          <Route path="services"     element={<CRMServicesTab />} />
          <Route path="settings"     element={<CRMSettingsTab />} />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BusinessDashboardRoutes;
