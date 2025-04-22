import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import Profile from "./dashboardPages/Profile";
import Build from "./dashboardPages/Build";

import DashboardPage from "./dashboardPages/DashboardPage";
import Collab from "./dashboardPages/Collab";
import Upgrade from "./dashboardPages/Upgrade";
import CartPage from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";
import ChatTab from "./dashboardPages/buildTabs/ChatTab";
import BusinessChat from "./dashboardPages/BusinessChatComponent";
import AffiliatePage from "./dashboardPages/AffiliatePage";
// ✅ יועץ עסקליק
import EsclickAdvisor from "./dashboardPages/EsclickAdvisor";

// ✅ מערכת CRM
import CRMMain from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab from "./dashboardPages/crmpages/CRMSettingsTab";

// ✅ הודעות מלקוחות (חדש)
import BusinessMessagesPage from "./dashboardPages/BusinessMessagesPage";

// ✅ דף היעדים
import GoalsPage from "./dashboardPages/GoalsPage";

import { BusinessServicesProvider } from '../../context/BusinessServicesContext';

const BusinessDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BusinessDashboardLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<Profile />} />

        <Route path="build" element={
          <BusinessServicesProvider>
            <Build />
          </BusinessServicesProvider>
        } />

        <Route path="cart" element={
          <BusinessServicesProvider>
            <CartPage />
          </BusinessServicesProvider>
        } />

        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="collab" element={<Collab />} />
        <Route path="upgrade" element={<Upgrade />} />
        <Route path="esclick" element={<EsclickAdvisor />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="chat-test" element={<ChatTab isPreview={true} />} />
        <Route path="chat/:partnerId" element={<BusinessChat />} />
        <Route path="affiliate" element={<AffiliatePage />} />
        {/* ✅ הודעות מלקוחות */}
        <Route path="messages" element={<BusinessMessagesPage />} />

        {/* ✅ CRM */}
        <Route path="crm" element={<CRMMain />}>
          <Route path="appointments" element={<CRMAppointmentsTab />} />
          <Route path="clients" element={<CRMClientsTab />} />
          <Route path="services" element={<CRMServicesTab />} />
          <Route path="settings" element={<CRMSettingsTab />} />
          <Route index element={<Navigate to="appointments" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default BusinessDashboardRoutes;
