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

import { BusinessServicesProvider } from "../../context/BusinessServicesContext";

const BusinessDashboardRoutes = () => (
  <Routes>
    {/* Layout משותף לכל דפי הדשבורד */}
    <Route path="" element={<BusinessDashboardLayout />}>

      {/* ברירת מחדל — נווט ל"תמצית" הדשבורד */}
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* תמצית הדשבורד */}
      <Route path="dashboard" element={<DashboardPage />} />

      {/* עריכת העסק */}
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

      {/* סל הקניות */}
      <Route
        path="cart"
        element={
          <BusinessServicesProvider>
            <CartPage />
          </BusinessServicesProvider>
        }
      />

      {/* לשוניות נוספות */}
      <Route path="collab"  element={<Collab />} />
      <Route path="upgrade" element={<Upgrade />} />
      <Route path="esclick" element={<EsclickAdvisor />} />
      <Route path="goals"   element={<GoalsPage />} />

      {/* Preview לצ'אט */}
      <Route path="chat-test" element={<ChatTab isPreview />} />
      <Route path="chat/:partnerId" element={<BusinessChat />} />

      {/* הודעות מהלקוחות */}
      <Route path="messages" element={<BusinessMessagesPage />} />

      {/* שותפים ואפיליאייט */}
      <Route path="affiliate" element={<AffiliatePage />} />

      {/* CRM */}
      <Route path="crm" element={<CRMMain />}>
        <Route index element={<Navigate to="appointments" replace />} />
        <Route path="appointments" element={<CRMAppointmentsTab />} />
        <Route path="clients"      element={<CRMClientsTab />} />
        <Route path="services"     element={<CRMServicesTab />} />
        <Route path="settings"     element={<CRMSettingsTab />} />
      </Route>

      {/* ברירת מחדל לתיקון נתיב */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
);

export default BusinessDashboardRoutes;
