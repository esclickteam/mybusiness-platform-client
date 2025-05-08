// src/pages/business/dashboardPages/Profile.jsx

import React, { useEffect, useState } from "react";
import API from "@api";
import "./Profile.css";
import ProfileHeader from "../../../components/shared/ProfileHeader";
import MainTab from "./buildTabs/MainTab";
import GalleryTab from "./buildTabs/GalleryTab";
import ShopAndCalendar from "./buildTabs/shopAndCalendar/ShopAndCalendar";
import ReviewsModule from "./buildTabs/ReviewsModule";
import FaqTab from "./buildTabs/FaqTab";
import ChatTab from "./buildTabs/ChatTab";
import { BusinessServicesProvider } from "../../../context/BusinessServicesContext";

const TABS = [
  "ראשי",
  "גלריה",
  "חנות / יומן",
  "ביקורות",
  "צ'אט עם העסק",
  "שאלות ותשובות",
];

// מבחינת שדה תיאור, אנחנו מאחדים בין `about` במונגו ל־`description` בצד הלקוח
const fallbackBusiness = {
  name: "עסק לדוגמה",
  description: "ברוכים הבאים לעסק לדוגמה! אנחנו מציעים שירותים מדהימים 😊",
  phone: "050-1234567",
  logo: "https://via.placeholder.com/100",
  category: "שיווק",
  area: "מרכז",
  gallery: [
    { url: "https://via.placeholder.com/300", type: "image" },
    { url: "https://via.placeholder.com/300", type: "image" },
  ],
  story: [
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
      const token = localStorage.getItem("token");
      const suffix = token ? "" : "?dev=true";

      try {
        const { data } = await API.get(`/api/business/my${suffix}`);

        // מאחדים את השדות מהמונגו (about → description) לפורמט צד-לקוח
        setBusinessData({
          ...fallbackBusiness,
          ...data,
          description: data.about ?? fallbackBusiness.description,
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

  if (loading) {
    return <div className="p-6 text-center">🔄 טוען פרופיל...</div>;
  }

  return (
    <div className="profile-wrapper">
      {/* 1. Header עליון – לוגו, שם, דירוג, תיאור, טלפון */}
      <ProfileHeader businessDetails={businessData} />

      {/* 2. כפתורי הטאבים */}
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

      {/* 3. תוכן הטאב הנבחר */}
      {currentTab === "ראשי" && (
        <section>
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
