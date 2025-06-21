import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from '@tanstack/react-query';
import BusinessDashboardLayout from "./BusinessDashboardLayout";
import { lazyWithPreload } from '../../utils/lazyWithPreload';

// דפי עריכה ודשבורד
const BuildBusinessPage = lazy(() => import("./dashboardPages/build/Build"));
const DashboardPage = lazyWithPreload(() => import("./dashboardPages/DashboardPage"));

// רכיבים נוספים
const Collab = lazy(() => import("./dashboardPages/Collab"));
const Upgrade = lazy(() => import("./dashboardPages/Upgrade"));
const CartPage = lazy(() => import("./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage"));
const BusinessChatPage = lazy(() => import("../../components/BusinessChatPage"));
const CollabChat = lazy(() => import("./dashboardPages/collabtabs/CollabChat"));
const AffiliatePage = lazy(() => import("./dashboardPages/AffiliatePage"));
const EsclickAdvisor = lazy(() => import("./dashboardPages/EsclickAdvisor"));
const CRMMain = lazy(() => import("./dashboardPages/crmpages/CRMMain"));
const CRMAppointmentsTab = lazy(() => import("./dashboardPages/crmpages/CRMAppointmentsTab"));
const CRMClientsTab = lazy(() => import("./dashboardPages/crmpages/CRMClientsTab"));
const CRMServicesTab = lazy(() => import("./dashboardPages/crmpages/CRMServicesTab"));
const CRMSettingsTab = lazy(() => import("./dashboardPages/crmpages/CRMSettingsTab"));
const GoalsPage = lazy(() => import("./dashboardPages/GoalsPage"));
const HelpCenter = lazy(() => import("../HelpCenter"));

// דפי מדריכים חדשים
const BuildBusinessGuidePage = lazy(() => import("../BuildBusinessPage"));
const ChatGuidePage = lazy(() => import("../ChatGuidePage"));
const DashboardGuidePage = lazy(() => import("../DashboardGuidePage"));
const AppointmentCRMGuidePage = lazy(() => import("../AppointmentCRMGuidePage"));
const BusinessCollaborationGuidePage = lazy(() => import("../BusinessCollaborationGuidePage"));
const AICompanionGuidePage = lazy(() => import("../AICompanionGuidePage"));

// דפי FAQ - ייבוא מערכי נתונים ורכיבים
import ProfileFAQ from "../ProfileFAQ"; // רכיב React עצמאי
import DashboardFAQ from "../DashboardFAQ"; // רכיב React עצמאי
import CustomerMessagesFAQ from "../CustomerMessagesFAQ"; // רכיב React עצמאי
import CollaborationsFAQ from "../CollaborationsFAQ"; // רכיב React עצמאי
import CrmFAQ from "../CrmFAQ"; // רכיב React עצמאי
import EskelikAdvisorFAQ from "../EskelikAdvisorFAQ"; // רכיב React עצמאי
import AffiliateProgramFAQ from "../AffiliateProgramFAQ"; // רכיב React עצמאי
import technicalSupportFAQs from "../technicalSupportFAQs"; // מערך נתונים
import troubleshootingFAQs from "../troubleshootingFAQs"; // מערך נתונים

// רכיב להצגת FAQ (מערך שאלות ותשובות)
function FAQPage({ faqs }) {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h1>שאלות ותשובות</h1>
      {faqs.map(({ question, answer }, idx) => (
        <section key={idx} style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#3a0ca3" }}>{question}</h2>
          <div>{answer}</div>
        </section>
      ))}
    </div>
  );
}

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

          {/* עריכה */}
          <Route path="edit" element={<BuildBusinessPage />} />
          <Route path="build" element={<BuildBusinessPage />} />

          {/* דפי מדריכים */}
          <Route path="articles/build-business-page" element={<BuildBusinessGuidePage />} />
          <Route path="articles/chat-guide" element={<ChatGuidePage />} />
          <Route path="articles/dashboard-guide" element={<DashboardGuidePage />} />
          <Route path="articles/appointment-crm-guide" element={<AppointmentCRMGuidePage />} />
          <Route path="articles/business-collaboration" element={<BusinessCollaborationGuidePage />} />
          <Route path="articles/ai-companion" element={<AICompanionGuidePage />} />

          {/* דפי FAQ */}
          <Route path="faq/profile" element={<ProfileFAQ />} />
          <Route path="faq/dashboard" element={<DashboardFAQ />} />
          <Route path="faq/customer-messages" element={<CustomerMessagesFAQ />} />
          <Route path="faq/collaborations" element={<CollaborationsFAQ />} />
          <Route path="faq/crm" element={<CrmFAQ />} />
          <Route path="faq/eskelik-advisor" element={<EskelikAdvisorFAQ />} />
          <Route path="faq/affiliate-program" element={<AffiliateProgramFAQ />} />
          <Route path="faq/technical-support" element={<FAQPage faqs={technicalSupportFAQs} />} />
          <Route path="faq/troubleshooting" element={<FAQPage faqs={troubleshootingFAQs} />} />

          {/* שאר הנתיבים */}
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

          <Route path="help-center" element={<HelpCenter />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BusinessDashboardRoutes;
