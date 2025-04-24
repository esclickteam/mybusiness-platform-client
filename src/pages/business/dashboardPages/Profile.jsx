// src/pages/business/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import "./Profile.css";

import ProfileHeader from "../../../components/shared/ProfileHeader";
import GalleryTab from "../dashboardPages/buildTabs/GalleryTab";
import ShopAndCalendar from "../dashboardPages/buildTabs/shopAndCalendar/ShopAndCalendar";
import ReviewsModule from "../dashboardPages/buildTabs/ReviewsModule";
import FaqTab from "../dashboardPages/buildTabs/FaqTab";
import ChatTab from "../dashboardPages/buildTabs/ChatTab";
import { BusinessServicesProvider } from "../../../context/BusinessServicesContext";

const TABS = [
  { key: "main", label: "ראשי" },
  { key: "gallery", label: "גלריה" },
  { key: "shop", label: "חנות / יומן" },
  { key: "reviews", label: "ביקורות" },
  { key: "chat", label: "צ'אט עם העסק" },
  { key: "faq", label: "שאלות ותשובות" },
];

export default function ProfilePage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("main");

  useEffect(() => {
    // Here you fetch your business data from API or context
    fetch("/api/business/my?dev=true", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setBusiness(data))
      .catch(() => setBusiness(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="profile-page__loading">טוען...</div>;
  if (!business) return <div className="profile-page__error">שגיאה בטעינת הפרופיל</div>;

  const renderTab = () => {
    switch (currentTab) {
      case "main":
        return <BusinessServicesProvider>
                 {/* anything else needed */}
               </BusinessServicesProvider>;
      case "gallery":
        return <GalleryTab isForm={false} businessDetails={business} />;
      case "shop":
        return (
          <BusinessServicesProvider>
            <ShopAndCalendar isPreview businessDetails={business} />
          </BusinessServicesProvider>
        );
      case "reviews":
        return <ReviewsModule reviews={business.reviews} setReviews={() => {}} isPreview currentUser={null} />;
      case "chat":
        return <ChatTab isPreview businessDetails={business} setBusinessDetails={() => {}} />;
      case "faq":
        return <FaqTab faqs={business.faqs} setFaqs={() => {}} isPreview currentUser={null} />;
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader business={business} />

      <nav className="profile-tabs">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`profile-tab ${currentTab === key ? "active" : ""}`}
            onClick={() => setCurrentTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="profile-content">
        {renderTab()}
      </div>
    </div>
  );
}
