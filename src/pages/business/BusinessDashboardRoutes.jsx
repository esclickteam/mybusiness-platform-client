// src/pages/business/BusinessDashboardRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import Build from "./dashboardPages/Build";
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

const BusinessDashboardRoutes = () => (
  <Routes>
    <Route element={<BusinessDashboardLayout />}>
      {/* ברירת מחדל לדשבורד */}
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* העמוד הראשי */}
      <Route path="dashboard" element={<DashboardPage />} />

      {/* 🖊️ עמוד עריכה */}
      <Route
        path="edit"
        element={
          <BusinessServicesProvider>
            <Build />
          </BusinessServicesProvider>
        }
      />

      {/* אם יש לך עדיין build כטאב נפרד – תשאיר או תסיר לפי צורך */}
      <Route
        path="build"
        element={
          <BusinessServicesProvider>
            <Build />
          </BusinessServicesProvider>
        }
      />

      {/* שאר ה־tabs */}
      <Route path="cart" element={<BusinessServicesProvider><CartPage /></BusinessServicesProvider>} />
      <Route path="collab" element={<Collab />} />
      <Route path="upgrade" element={<Upgrade />} />
      <Route path="esclick" element={<EsclickAdvisor />} />
      <Route path="goals" element={<GoalsPage />} />
      <Route path="chat-test" element={<ChatTab isPreview />} />
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

export default BusinessDashboardRoutes;
