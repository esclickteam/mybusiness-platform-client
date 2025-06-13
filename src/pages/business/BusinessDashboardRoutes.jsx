import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from '@tanstack/react-query';
import BusinessDashboardLayout from "./BusinessDashboardLayout";
import { lazyWithPreload } from '../../utils/lazyWithPreload';


// רכיבים דינמיים
const BuildBusinessPage  = lazy(() => import("./dashboardPages/build/Build"));
const DashboardPage = lazyWithPreload(() => import("./dashboardPages/DashboardPage"));
const Collab             = lazy(() => import("./dashboardPages/Collab"));
const Upgrade            = lazy(() => import("./dashboardPages/Upgrade"));
const CartPage           = lazy(() => import("./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage"));
const BusinessChatPage   = lazy(() => import("../../components/BusinessChatPage"));
const CollabChat         = lazy(() => import("./dashboardPages/collabtabs/CollabChat"));
const AffiliatePage      = lazy(() => import("./dashboardPages/AffiliatePage"));
const EsclickAdvisor     = lazy(() => import("./dashboardPages/EsclickAdvisor"));
const CRMMain            = lazy(() => import("./dashboardPages/crmpages/CRMMain"));
const CRMAppointmentsTab = lazy(() => import("./dashboardPages/crmpages/CRMAppointmentsTab"));
const CRMClientsTab      = lazy(() => import("./dashboardPages/crmpages/CRMClientsTab"));
const CRMServicesTab     = lazy(() => import("./dashboardPages/crmpages/CRMServicesTab"));
const CRMSettingsTab     = lazy(() => import("./dashboardPages/crmpages/CRMSettingsTab"));
const GoalsPage          = lazy(() => import("./dashboardPages/GoalsPage"));

const BusinessDashboardRoutes = () => {
  const { user } = useAuth();
  const businessId = user?.businessId;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (businessId) {
      queryClient.prefetchQuery(['businessProfile', businessId], () =>
        fetch(`/api/business/${businessId}`).then(res => res.json())
      );
      queryClient.prefetchQuery(['businessServices', businessId], () =>
        fetch(`/api/business/my/services`).then(res => res.json())
      );
      queryClient.prefetchQuery(['businessAppointments', businessId], () =>
        fetch(`/api/appointments?businessId=${businessId}`).then(res => res.json())
      );
    }
  }, [businessId, queryClient]);

  if (!businessId) {
    return <div>טוען מידע העסק...</div>;
  }

  return (
    <Suspense fallback={<div>🔄 טוען דשבורד...</div>}>
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
    </Suspense>
  );
};

export default BusinessDashboardRoutes;
