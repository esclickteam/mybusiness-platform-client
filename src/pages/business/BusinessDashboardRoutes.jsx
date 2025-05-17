// src/pages/business/BusinessDashboardRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import BusinessDashboardLayout from "./BusinessDashboardLayout";

import BuildBusinessPage  from "./dashboardPages/build/Build";
import DashboardPage      from "./dashboardPages/DashboardPage";
import Collab             from "./dashboardPages/Collab";
import Upgrade            from "./dashboardPages/Upgrade";
import CartPage           from "./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage";

// ✅ רכיב צ'אט הכולל sidebar ו-area
import ChatSection from "./dashboardPages/buildTabs/buildSections/ChatSection";

import AffiliatePage      from "./dashboardPages/AffiliatePage";
import EsclickAdvisor     from "./dashboardPages/EsclickAdvisor";

import CRMMain            from "./dashboardPages/crmpages/CRMMain";
import CRMAppointmentsTab from "./dashboardPages/crmpages/CRMAppointmentsTab";
import CRMClientsTab      from "./dashboardPages/crmpages/CRMClientsTab";
import CRMServicesTab     from "./dashboardPages/crmpages/CRMServicesTab";
import CRMSettingsTab     from "./dashboardPages/crmpages/CRMSettingsTab";

import GoalsPage          from "./dashboardPages/GoalsPage";

const BusinessDashboardRoutes = () => (
  <Routes>
    {/* Layout משותף לכל לשוניות בדשבורד */}
    <Route path="" element={<BusinessDashboardLayout />}>
      {/* ברירת מחדל → תמצית */}
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* תמצית הדשבורד */}
      <Route path="dashboard" element={<DashboardPage />} />

      {/* עריכת העסק */}
      <Route path="edit" element={<BuildBusinessPage />} />
      <Route path="build" element={<BuildBusinessPage />} />

      {/* סל הקניות */}
      <Route path="cart" element={<CartPage />} />

      {/* לשוניות נוספות */}
      <Route path="collab"  element={<Collab />} />
      <Route path="upgrade" element={<Upgrade />} />
      <Route path="esclick" element={<EsclickAdvisor />} />
      <Route path="goals"   element={<GoalsPage />} />

      {/* לשונית ההודעות */}
      {/* בלי wildcard - פשוט messages */}
      <Route path="messages" element={<ChatSection isBusiness />} />

      {/* שותפים ואפיליאייט */}
      <Route path="affiliate" element={<AffiliatePage />} />

      {/* CRM nested */}
      <Route path="crm" element={<CRMMain />}>
        <Route index               element={<Navigate to="appointments" replace />} />
        <Route path="appointments" element={<CRMAppointmentsTab />} />
        <Route path="clients"      element={<CRMClientsTab />} />
        <Route path="services"     element={<CRMServicesTab />} />
        <Route path="settings"     element={<CRMSettingsTab />} />
      </Route>

      {/* כל נתיב אחר בתוך דשבורד → חזרה לתמצית */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Route>
  </Routes>
);

export default BusinessDashboardRoutes;
