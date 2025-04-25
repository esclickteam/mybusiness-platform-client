import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import Build from "./dashboardPages/Build";
import Profile from "./dashboardPages/Profile";
import DashboardPage from "./dashboardPages/DashboardPage";
import Collab from "./dashboardPages/Collab";
import Upgrade from "./dashboardPages/Upgrade";
import CartPage from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";
import ChatTab from "./dashboardPages/buildTabs/ChatTab";
import BusinessChat from "./dashboardPages/BusinessChatComponent";
import AffiliatePage from "./dashboardPages/AffiliatePage";
import EsclickAdvisor from "./dashboardPages/EsclickAdvisor";

import CRMMain from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab from "./dashboardPages/crmpages/CRMSettingsTab";

import BusinessMessagesPage from "./dashboardPages/BusinessMessagesPage";
import GoalsPage from "./dashboardPages/GoalsPage";

import { BusinessServicesProvider } from "../../context/BusinessServicesContext";

const BusinessDashboardRoutes = () => {
  return (
    <Routes>
      {/* 🔸 דשבורד עם סיידבר */}
      <Route element={<BusinessDashboardLayout />}>

        {/* ברירת מחדל לדשבורד */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* טאבים שונים */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<Profile />} />

        <Route
          path="build"
          element={
            <BusinessServicesProvider>
              <Build />
            </BusinessServicesProvider>
          }
        />

        <Route
          path="cart"
          element={
            <BusinessServicesProvider>
              <CartPage />
            </BusinessServicesProvider>
          }
        />

        <Route path="collab" element={<Collab />} />
        <Route path="upgrade" element={<Upgrade />} />
        <Route path="esclick" element={<EsclickAdvisor />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="chat-test" element={<ChatTab isPreview={true} />} />
        <Route path="chat/:partnerId" element={<BusinessChat />} />
        <Route path="affiliate" element={<AffiliatePage />} />
        <Route path="messages" element={<BusinessMessagesPage />} />

        {/* מערכת CRM */}
        <Route path="crm" element={<CRMMain />}>
          <Route index element={<Navigate to="appointments" replace />} />
          <Route path="appointments" element={<CRMAppointmentsTab />} />
          <Route path="clients" element={<CRMClientsTab />} />
          <Route path="services" element={<CRMServicesTab />} />
          <Route path="settings" element={<CRMSettingsTab />} />
        </Route>

      </Route>
    </Routes>
  );
};

export default BusinessDashboardRoutes;
