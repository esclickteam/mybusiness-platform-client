// src/pages/business/BusinessDashboardRoutes.jsx

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import Build                               from "./dashboardPages/Build";
import Profile                             from "./dashboardPages/Profile";
import DashboardPage                       from "./dashboardPages/DashboardPage";
import Collab                              from "./dashboardPages/Collab";
import Upgrade                             from "./dashboardPages/Upgrade";
import CartPage                            from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";
import ChatTab                             from "./dashboardPages/buildTabs/ChatTab";
import BusinessChat                        from "./dashboardPages/BusinessChatComponent";
import AffiliatePage                       from "./dashboardPages/AffiliatePage";
import EsclickAdvisor                      from "./dashboardPages/EsclickAdvisor";

import CRMMain                             from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab                  from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab                       from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab                      from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab                      from "./dashboardPages/crmpages/CRMSettingsTab";

import BusinessMessagesPage                from "./dashboardPages/BusinessMessagesPage";
import GoalsPage                           from "./dashboardPages/GoalsPage";

import { BusinessServicesProvider }       from "../../context/BusinessServicesContext";

const BusinessDashboardRoutes = () => {
  return (
    <Routes>
      {/* כל התוכן בתוך ה־Layout */}
      <Route element={<BusinessDashboardLayout />}>
        {/* Public: עמוד העסק הציבורי עם ה־sidebar */}
        <Route
          path="/business/:businessId"
          element={
            <BusinessServicesProvider>
              <Build />
            </BusinessServicesProvider>
          }
        />

        {/* ברירת מחדל ל־dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* טאב דשבורד */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* טאב פרופיל */}
        <Route path="profile" element={<Profile />} />

        {/* טאב עריכת עמוד */}
        <Route
          path="build"
          element={
            <BusinessServicesProvider>
              <Build />
            </BusinessServicesProvider>
          }
        />

        {/* Cart */}
        <Route
          path="cart"
          element={
            <BusinessServicesProvider>
              <CartPage />
            </BusinessServicesProvider>
          }
        />

        {/* Collab */}
        <Route path="collab" element={<Collab />} />

        {/* Upgrade */}
        <Route path="upgrade" element={<Upgrade />} />

        {/* Esclick Advisor */}
        <Route path="esclick" element={<EsclickAdvisor />} />

        {/* Goals */}
        <Route path="goals" element={<GoalsPage />} />

        {/* Chat */}
        <Route path="chat-test" element={<ChatTab isPreview={true} />} />
        <Route path="chat/:partnerId" element={<BusinessChat />} />

        {/* Affiliate */}
        <Route path="affiliate" element={<AffiliatePage />} />

        {/* Messages */}
        <Route path="messages" element={<BusinessMessagesPage />} />

        {/* CRM */}
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
