// src/pages/business/BusinessDashboardRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import DashboardPage from "./dashboardPages/DashboardPage";
import Profile from "./dashboardPages/Profile";
import Build from "./dashboardPages/Build";
import CartPage from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";
import Collab from "./dashboardPages/Collab";
import Upgrade from "./dashboardPages/Upgrade";
import EsclickAdvisor from "./dashboardPages/EsclickAdvisor";
import GoalsPage from "./dashboardPages/GoalsPage";
import ChatTab from "./dashboardPages/buildTabs/ChatTab";
import BusinessChat from "./dashboardPages/BusinessChatComponent";
import AffiliatePage from "./dashboardPages/AffiliatePage";
import BusinessMessagesPage from "./dashboardPages/BusinessMessagesPage";

import CRMMain from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab from "./dashboardPages/crmpages/CRMSettingsTab";

import { BusinessServicesProvider } from "../../context/BusinessServicesContext";

const BusinessDashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<BusinessDashboardLayout />}>
        {/* ברירת מחדל – עמוד הדשבורד */}
        <Route index element={<DashboardPage />} />

        {/* פרופיל ובניית עמוד העסקי */}
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

        {/* שיתופי פעולה, שדרוג ומסלולי מנויים */}
        <Route path="collab" element={<Collab />} />
        <Route path="upgrade" element={<Upgrade />} />

        {/* יועץ עסקליק, יעדים והודעות */}
        <Route path="esclick" element={<EsclickAdvisor />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="messages" element={<BusinessMessagesPage />} />

        {/* צ'אט */}
        <Route path="chat-test" element={<ChatTab isPreview />} />
        <Route path="chat/:partnerId" element={<BusinessChat />} />

        {/* Affiliate */}
        <Route path="affiliate" element={<AffiliatePage />} />

        {/* CRM תתי־טאבים */}
        <Route path="crm" element={<CRMMain />}>
          <Route index element={<CRMAppointmentsTab />} />
          <Route path="appointments" element={<CRMAppointmentsTab />} />
          <Route path="clients" element={<CRMClientsTab />} />
          <Route path="services" element={<CRMServicesTab />} />
          <Route path="settings" element={<CRMSettingsTab />} />
        </Route>

        {/* עבור נתיב בלתי־קיים – חזרה לדשבורד */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
};

export default BusinessDashboardRoutes;
