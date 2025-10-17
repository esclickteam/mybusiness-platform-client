import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from '@tanstack/react-query';
import BusinessDashboardLayout from "./BusinessDashboardLayout";
import { lazyWithPreload } from '../../utils/lazyWithPreload';

// Editing pages and dashboard
const BuildBusinessPage = lazy(() => import("./dashboardPages/build/Build"));
const DashboardPage = lazyWithPreload(() => import("./dashboardPages/DashboardPage"));

// Additional components
const Collab = lazy(() => import("./dashboardPages/Collab"));
const CollabBusinessProfileTab = lazy(() => import("./dashboardPages/collabtabs/CollabBusinessProfileTab"));
const CollabFindPartnerTab = lazy(() => import("./dashboardPages/collabtabs/CollabFindPartnerTab"));
const CollabMessagesTab = lazy(() => import("./dashboardPages/collabtabs/CollabMessagesTab"));
const CollabMarketTab = lazy(() => import("./dashboardPages/collabtabs/CollabMarketTab"));

const Upgrade = lazy(() => import("./dashboardPages/Upgrade"));
const CartPage = lazy(() => import("./dashboardPages/buildTabs/shopAndCalendar/Appointments/CartPage"));
const BusinessChatPage = lazy(() => import("../../components/BusinessChatPage"));
const CollabChat = lazy(() => import("./dashboardPages/collabtabs/CollabChat"));
const AffiliatePage = lazy(() => import("./dashboardPages/AffiliatePage"));
const BizUplyAdvisor = lazy(() => import("./dashboardPages/BizUplyAdvisor"));
const CRMMain = lazy(() => import("./dashboardPages/crmpages/CRMMain"));
const CRMAppointmentsTab = lazy(() => import("./dashboardPages/crmpages/CRMAppointmentsTab"));
const CRMClientsTab = lazy(() => import("./dashboardPages/crmpages/CRMClientsTab"));
const CRMServicesTab = lazy(() => import("./dashboardPages/crmpages/CRMServicesTab"));
const CRMSettingsTab = lazy(() => import("./dashboardPages/crmpages/CRMSettingsTab"));
const GoalsPage = lazy(() => import("./dashboardPages/GoalsPage"));
const HelpCenter = lazy(() => import("../HelpCenter"));
const WorkHoursTab = lazy(() => import("./dashboardPages/crmpages/WorkHoursTab.jsx"));


// New guide pages
const BuildBusinessGuidePage = lazy(() => import("../BuildBusinessPage"));
const ChatGuidePage = lazy(() => import("../ChatGuidePage"));
const DashboardGuidePage = lazy(() => import("../DashboardGuidePage"));
const AppointmentCRMGuidePage = lazy(() => import("../AppointmentCRMGuidePage"));
const BusinessCollaborationGuidePage = lazy(() => import("../BusinessCollaborationGuidePage"));
const AICompanionGuidePage = lazy(() => import("../AICompanionGuidePage"));
const BillingPage = lazy(() => import("../BillingPage"));


// FAQ pages – standalone components
import ProfileFAQ from "../ProfileFAQ";
import DashboardFAQ from "../DashboardFAQ";
import CustomerMessagesFAQ from "../CustomerMessagesFAQ";
import CollaborationsFAQ from "../CollaborationsFAQ";
import CrmFAQ from "../CrmFAQ";
import BizUplyAdvisorFAQ from "../BizUplyAdvisorFAQ";
import AffiliateProgramFAQ from "../AffiliateProgramFAQ";
import TechnicalSupport from "../technicalSupportFAQs";
import TroubleshootingFAQ from "../troubleshootingFAQs";

// Business profile component
const BusinessProfilePage = lazy(() => import("../BusinessProfilePage"));

// Component to display FAQ (Q&A array)
function FAQPage({ faqs }) {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <h1>Questions & Answers</h1>
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
    return <div>Loading business info...</div>;
  }

  return (
    <Suspense fallback={<div>🔄 Loading dashboard...</div>}>
      <Routes>
        <Route path="" element={<BusinessDashboardLayout />}>
          {/* Default redirects to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Main dashboard page and its sub-tabs */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Business profile page under the same layout */}
          <Route path="dashboard/profile" element={<BusinessProfilePage />} />

          {/* Collaborations with sub-tabs */}
          <Route path="collab" element={<Collab />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<CollabBusinessProfileTab />} />
            <Route path="find-partner" element={<CollabFindPartnerTab />} />
            <Route
              path="messages"
              element={<CollabMessagesTab userBusinessId={user?.businessId} />}
            />
            <Route path="market" element={<CollabMarketTab />} />
          </Route>

          {/* Editing */}
          <Route path="edit" element={<BuildBusinessPage />} />
          <Route path="build" element={<BuildBusinessPage />} />

          {/* Guide pages */}
          <Route path="articles/build-business-page" element={<BuildBusinessGuidePage />} />
          <Route path="articles/chat-guide" element={<ChatGuidePage />} />
          <Route path="articles/dashboard-guide" element={<DashboardGuidePage />} />
          <Route path="articles/appointment-crm-guide" element={<AppointmentCRMGuidePage />} />
          <Route path="articles/business-collaboration" element={<BusinessCollaborationGuidePage />} />
          <Route path="articles/ai-companion" element={<AICompanionGuidePage />} />

          {/* FAQ pages */}
          <Route path="faq/profile" element={<ProfileFAQ />} />
          <Route path="faq/dashboard" element={<DashboardFAQ />} />
          <Route path="faq/customer-messages" element={<CustomerMessagesFAQ />} />
          <Route path="faq/collaborations" element={<CollaborationsFAQ />} />
          <Route path="faq/crm" element={<CrmFAQ />} />
          <Route path="faq/BizUply-advisor" element={<BizUplyAdvisorFAQ />} />
          <Route path="faq/affiliate-program" element={<AffiliateProgramFAQ />} />
          <Route path="faq/technical-support" element={<TechnicalSupport />} />
          <Route path="faq/troubleshooting" element={<TroubleshootingFAQ />} />

          {/* Other routes */}
          <Route path="cart" element={<CartPage />} />
          <Route path="upgrade" element={<Upgrade />} />
          <Route path="BizUply" element={<BizUplyAdvisor />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="messages" element={<BusinessChatPage />} />
          <Route path="business-messages" element={<CollabChat />} />
          <Route path="affiliate" element={<AffiliatePage />} />
          <Route path="billing" element={<BillingPage />} />


          <Route path="crm" element={<CRMMain />}>
            <Route index element={<Navigate to="appointments" replace />} />
            <Route path="appointments" element={<CRMAppointmentsTab businessId={businessId} />} />
            <Route path="clients" element={<CRMClientsTab businessId={businessId} />} />
            <Route path="services" element={<CRMServicesTab businessId={businessId} />} />
            <Route path="settings" element={<CRMSettingsTab businessId={businessId} />} />
            <Route path="work-hours" element={<WorkHoursTab businessId={businessId} />} />
          </Route>

          <Route path="help-center" element={<HelpCenter />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default BusinessDashboardRoutes;
