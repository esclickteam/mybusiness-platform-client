import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from '@tanstack/react-query';
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import BuildBusinessPage  from "./dashboardPages/build/Build";
import DashboardPage      from "./dashboardPages/DashboardPage";
import Collab             from "./dashboardPages/Collab";
import Upgrade            from "./dashboardPages/Upgrade";
import CartPage           from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";

import BusinessChatPage   from "../../components/BusinessChatPage";
import CollabChat         from "./dashboardPages/collabtabs/CollabChat";

import AffiliatePage      from "./dashboardPages/AffiliatePage";
import EsclickAdvisor     from "./dashboardPages/EsclickAdvisor";

import CRMMain            from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab      from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab     from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab     from "./dashboardPages/crmpages/CRMSettingsTab";

import GoalsPage          from "./dashboardPages/GoalsPage";

const BusinessDashboardRoutes = () => {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (businessId) {
      // Prefetch בסיסי של נתונים שהמשתמש צפוי להשתמש בהם
      queryClient.prefetchQuery(['businessProfile', businessId], () =>
        fetch(`/api/business/${businessId}`).then(res => res.json())
      );
      queryClient.prefetchQuery(['businessServices', businessId], () =>
        fetch(`/api/business/my/services`).then(res => res.json())
      );
      queryClient.prefetchQuery(['businessAppointments', businessId], () =>
        fetch(`/api/appointments?businessId=${businessId}`).then(res => res.json())
      );
      // הוסף כאן prefetch לפי הצורך
    }
  }, [businessId, queryClient]);

  if (!businessId) {
    return <div>טוען מידע העסק...</div>;
  }

  return (
    <Routes>
      <Route path="" element={<BusinessDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="edit" element={<BuildBusinessPage />} />
        <Route path="build" element={<BuildBusinessPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="collab" element={<Collab />} />
        <Route path="upgrade" element={<Upgrade />} />
        <Route path="esclick" element={<EsclickAdvisor />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="messages" element={<BusinessChatPage />} />
        <Route path="business-messages" element={<CollabChat />} />
        <Route path="affiliate" element={<AffiliatePage />} />
        <Route path="crm" element={<CRMMain />}>
          <Route index element={<Navigate to="appointments" replace />} />
          <Route path="appointments" element={<CRMAppointmentsTab businessId={businessId} />} />
          <Route path="clients" element={<CRMClientsTab businessId={businessId} />} />
          <Route path="services" element={<CRMServicesTab businessId={businessId} />} />
          <Route path="settings" element={<CRMSettingsTab businessId={businessId} />} />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default BusinessDashboardRoutes;
