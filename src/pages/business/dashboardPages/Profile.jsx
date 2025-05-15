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
    { url: "https://via.placeholder.com/150", type: "image", uploadedAt: Date.now() },
  ],
  services: [
    { name: "ייעוץ", description: "שיחת ייעוץ ראשונית", price: 150 },
    { name: "ליווי", description: "תוכנית ליווי חודשית", price: 800 },
  ],
  reviews: [
    { user: "שירה", comment: "שירות מהמם!", rating: 5 },
    { user: "אלון", comment: "ממש מקצועיים!", rating: 5 },
  ],
};

export default function Profile() {
  const [businessData, setBusinessData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("ראשי");
  const [shopMode, setShopMode] = useState(null);

  useEffect(() => {
    async function fetchBusiness() {
      const token = localStorage.getItem("token");
      const suffix = token ? "" : "?dev=true";
      try {
        const { data } = await API.get(`/business/my${suffix}`);
        const merged = {
          ...fallbackBusiness,
          ...data,
          description: data.about ?? fallbackBusiness.description,
          reviews:
            Array.isArray(data.reviews) && data.reviews.length > 0
              ? data.reviews
              : fallbackBusiness.reviews,
        };
        setBusinessData(merged);
        setFaqs(Array.isArray(data.faqs) ? data.faqs : []);
      } catch (err) {
        setBusinessData(fallbackBusiness);
        setFaqs([]);
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
      <ProfileHeader businessDetails={businessData} />

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
          <ShopAndCalendar
  isPreview={false}
  shopMode={shopMode}
  setShopMode={setShopMode}
  setBusinessDetails={setBusinessData}
/>
        </section>
      )}

      {currentTab === "ביקורות" && (
        <section>
          <ReviewsModule
            reviews={businessData.reviews}
            setReviews={() => {}}   // פונקציה ריקה למניעת שגיאות אם אין עריכה
            isPreview
          />
        </section>
      )}

      {currentTab === "צ'אט עם העסק" && (
        <section>
          <ChatTab
            businessDetails={businessData}
            setBusinessDetails={() => {}} // פונקציה ריקה, אין עריכה
            isPreview
          />
        </section>
      )}

      {currentTab === "שאלות ותשובות" && (
        <section>
          <FaqTab
            faqs={faqs}
            setFaqs={setFaqs}
            isPreview={false}
          />
        </section>
      )}
    </div>
  );
}
