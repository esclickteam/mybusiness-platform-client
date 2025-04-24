// src/pages/business/dashboardPages/Profile.jsx
import React, { useEffect, useState } from "react";
import "./Profile.css";
import ProfileHeader from "../../../components/shared/ProfileHeader";
// ✅ החלפנו את הייבוא:
import MainTab from "../dashboardPages/buildTabs/MainTab";
import GalleryTab from "../dashboardPages/buildTabs/GalleryTab";
import ShopAndCalendar from "../dashboardPages/buildTabs/shopAndCalendar/ShopAndCalendar";
import ReviewsModule from "../dashboardPages/buildTabs/ReviewsModule";
import FaqTab from "../dashboardPages/buildTabs/FaqTab";
import ChatTab from "../dashboardPages/buildTabs/ChatTab";
import { BusinessServicesProvider } from "../../../context/BusinessServicesContext";

const TABS = [
  "ראשי",
  "גלריה",
  "חנות / יומן",
  "ביקורות",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

const fallbackBusiness = {
  name: "עסק לדוגמה",
  about: "ברוכים הבאים לעסק לדוגמה! אנחנו מציעים שירותים מדהימים 😊",
  phone: "050-1234567",
  logo: "https://via.placeholder.com/100",
  category: "שיווק",
  area: "מרכז",
  gallery: [
    { url: "https://via.placeholder.com/300", type: "image" },
    { url: "https://via.placeholder.com/300", type: "image" },
  ],
  stories: [
    {
      url: "https://via.placeholder.com/150",
      type: "image",
      uploadedAt: Date.now(),
    },
  ],
  services: [
    { name: "ייעוץ", description: "שיחת ייעוץ ראשונית", price: 150 },
    { name: "ליווי", description: "תוכנית ליווי חודשית", price: 800 },
  ],
  reviews: [
    { user: "שירה", comment: "שירות מהמם!", rating: 5 },
    { user: "אלון", comment: "ממש מקצועיים!", rating: 5 },
  ],
  faqs: [
    { q: "איך אפשר להזמין?", a: "פשוט דרך הכפתור באתר" },
    { q: "האם השירות כולל מע״מ?", a: "כן" },
  ],
};

export default function Profile() {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ראשי");

  useEffect(() => {
    async function fetchBusiness() {
      const API_BASE_URL = "/api";
      const isLoggedIn = !!localStorage.getItem("token");
      const url = `${API_BASE_URL}/business/my${isLoggedIn ? "" : "?dev=true"}`;

      try {
        const res = await fetch(url, { credentials: "include" });
        if (res.status === 404) throw new Error("404 Not Found");

        const text = await res.text();
        if (text.startsWith("<!DOCTYPE html>") || text.includes("Not Found")) {
          throw new Error("תשובת HTML – כנראה אין חיבור ל־API");
        }

        const data = JSON.parse(text);
        setBusinessData({
          ...fallbackBusiness,
          ...data,
          about: data.about || fallbackBusiness.about,
          reviews:
            Array.isArray(data.reviews) && data.reviews.length > 0
              ? data.reviews
              : fallbackBusiness.reviews,
        });
      } catch (err) {
        setBusinessData(fallbackBusiness);
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, []);

  if (loading) return <div className="p-6 text-center">🔄 טוען פרופיל...</div>;

  return (
    <div className="profile-wrapper">
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab ${currentTab === tab ? "active" : ""}`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {currentTab === "ראשי" && (
        <section>
          {/* Header עליון */}
          <ProfileHeader businessDetails={businessData} />

          {/* גלריה + 2 ביקורות אחרונות */}
          <MainTab isForm={false} businessDetails={businessData} />
        </section>
      )}

      {currentTab === "גלריה" && (
        <section>
          <GalleryTab isForm={false} businessDetails={businessData} />
        </section>
      )}

      {currentTab === "חנות / יומן" && (
        <section>
          <BusinessServicesProvider>
            <ShopAndCalendar isPreview businessDetails={businessData} />
          </BusinessServicesProvider>
        </section>
      )}

      {currentTab === "ביקורות" && (
        <section>
          <ReviewsModule
            reviews={businessData.reviews}
            setReviews={() => {}}
            isPreview
            currentUser={null}
          />
        </section>
      )}

      {currentTab === "צ'אט עם העסק" && (
        <section>
          <ChatTab
            businessDetails={businessData}
            setBusinessDetails={() => {}}
            isPreview
          />
        </section>
      )}

      {currentTab === "שאלות ותשובות" && (
        <section>
          <FaqTab
            faqs={businessData.faqs}
            setFaqs={() => {}}
            isPreview
            currentUser={null}
          />
        </section>
      )}
    </div>
  );
}
