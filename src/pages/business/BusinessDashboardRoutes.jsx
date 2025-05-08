// src/routes/BusinessDashboardRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import BuildBusinessPage    from "./dashboardPages/build/Build";
import DashboardPage        from "./dashboardPages/DashboardPage";
import Collab               from "./dashboardPages/Collab";
import Upgrade              from "./dashboardPages/Upgrade";
import CartPage             from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";
import ChatTab              from "./dashboardPages/buildTabs/ChatTab";
import BusinessChat         from "./dashboardPages/BusinessChatComponent";
import AffiliatePage        from "./dashboardPages/AffiliatePage";
import EsclickAdvisor       from "./dashboardPages/EsclickAdvisor";

import CRMMain              from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab   from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab        from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab       from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab       from "./dashboardPages/crmpages/CRMSettingsTab";

import GoalsPage            from "./dashboardPages/GoalsPage";

// ✅ הייבוא החדש של קומפוננטת הצ'אט
import BusinessChatPage from "../BusinessChatPage";

import { BusinessServicesProvider } from "../../context/BusinessServicesContext";

const BusinessDashboardRoutes = () => (
  <Routes>
    <Route element={<BusinessDashboardLayout />}>
      {/* ברירת מחדל — נווט לדשבורד */}
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* דשבורד */}
      <Route path="dashboard" element={<DashboardPage />} />

      {/* Build / Edit */}
      <Route
        path="edit"
        element={
          <BusinessServicesProvider>
            <BuildBusinessPage />
          </BusinessServicesProvider>
        }
      />
      <Route
        path="build"
        element={
          <BusinessServicesProvider>
            <BuildBusinessPage />
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

      {/* טאב־Collab, Upgrade, Advisor, Goals */}
      <Route path="collab"  element={<Collab />} />
      <Route path="upgrade" element={<Upgrade />} />
      <Route path="esclick" element={<EsclickAdvisor />} />
      <Route path="goals"   element={<GoalsPage />} />

      {/* Preview Chat */}
      <Route path="chat-test" element={<ChatTab isPreview />} />
      <Route path="chat/:partnerId" element={<BusinessChat />} />

      {/* Affiliate */}
      <Route path="affiliate" element={<AffiliatePage />} />

      {/* ✅ Route חדש לצ'אט של העסק */}
      <Route path="messages" element={<BusinessChatPage />} />

      {/* CRM */}
      <Route path="crm" element={<CRMMain />}>
        <Route index element={<Navigate to="appointments" replace />} />
        <Route path="appointments" element={<CRMAppointmentsTab />} />
        <Route path="clients"      element={<CRMClientsTab />} />
        <Route path="services"     element={<CRMServicesTab />} />
        <Route path="settings"     element={<CRMSettingsTab />} />
      </Route>
    </Route>
  </Routes>
);

export default BusinessDashboardRoutes;
