```javascript
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
  "Main",
  "Gallery",
  "Shop / Calendar",
  "Reviews",
  "Chat with Business",
  "Questions and Answers",
];

const fallbackBusiness = {
  name: "Sample Business",
  description: "Welcome to the sample business! We offer amazing services 😊",
  phone: "050-1234567",
  logo: "https://via.placeholder.com/100",
  category: "Marketing",
  area: "Center",
  gallery: [
    { url: "https://via.placeholder.com/300", type: "image" },
    { url: "https://via.placeholder.com/300", type: "image" },
  ],
  story: [
    { url: "https://via.placeholder.com/150", type: "image", uploadedAt: Date.now() },
  ],
  services: [
    { name: "Consultation", description: "Initial consultation call", price: 150 },
    { name: "Coaching", description: "Monthly coaching program", price: 800 },
  ],
  reviews: [
    { user: "Shira", comment: "Amazing service!", rating: 5 },
    { user: "Alon", comment: "Really professional!", rating: 5 },
  ],
};

export default function Profile() {
  const [businessData, setBusinessData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("Main");
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
    return <div className="p-6 text-center">🔄 Loading profile...</div>;
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

      {currentTab === "Main" && (
        <section>
          <MainTab isForm={false} businessDetails={businessData} />
        </section>
      )}

      {currentTab === "Gallery" && (
        <section>
          <GalleryTab isForm={false} businessDetails={businessData} />
        </section>
      )}

      {currentTab === "Shop / Calendar" && (
        <section>
          <ShopAndCalendar
  isPreview={false}
  shopMode={shopMode}
  setShopMode={setShopMode}
  setBusinessDetails={setBusinessData}
/>
        </section>
      )}

      {currentTab === "Reviews" && (
        <section>
          <ReviewsModule
            reviews={businessData.reviews}
            setReviews={() => {}}   // Empty function to prevent errors if no editing
            isPreview
          />
        </section>
      )}

      {currentTab === "Chat with Business" && (
        <section>
          <ChatTab
            businessDetails={businessData}
            setBusinessDetails={() => {}} // Empty function, no editing
            isPreview
          />
        </section>
      )}

      {currentTab === "Questions and Answers" && (
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
```