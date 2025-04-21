// src/pages/business/dashboardPages/Collab.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api";
import UpgradeBanner from "../../../components/UpgradeBanner";
import BusinessChat from "./BusinessChat";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabSentRequestsTab from "./collabtabs/CollabSentRequestsTab";
import CollabReceivedRequestsTab from "./collabtabs/CollabReceivedRequestsTab";
import CollabActiveTab from "./collabtabs/CollabActiveTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import "./Collab.css";

export default function Collab() {
  const { user, loading: authLoading } = useAuth();
  const devMode = import.meta.env.DEV;

  const [tab, setTab] = useState(0);
  const [showBusinessChat, setShowBusinessChat] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // data states
  const [categories, setCategories] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [searchMode, setSearchMode] = useState("category");
  const [searchCategory, setSearchCategory] = useState("");
  const [freeText, setFreeText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeCollabs, setActiveCollabs] = useState([]);
  const [collabMarket, setCollabMarket] = useState([]);

  // access guard
  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess = isDevUser || user?.subscriptionPlan?.includes("collaboration");

  // fetch categories once
  useEffect(() => {
    API.get("/business/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("❌ טעינת קטגוריות:", err));
  }, []);

  // fetch profile once
  useEffect(() => {
    API.get(`/business/my${devMode ? "?dev=true" : ""}`)
      .then(res => {
        const d = res.data;
        setProfileData({
          businessName: d.name,
          category: d.category,
          area: d.area,
          about: d.about,
          collabPref: d.collabPref,
          contact: d.contact,
          phone: d.phone,
          email: d.email,
        });
      })
      .catch(err => console.error("❌ טעינת פרופיל:", err))
      .finally(() => setLoadingProfile(false));
  }, [devMode]);

  // fetch tab‑specific data on change
  useEffect(() => {
    const loadTab = async () => {
      try {
        if (tab === 1) {
          // find partners
          const params = new URLSearchParams();
          if (searchMode === "category") params.set("category", searchCategory);
          else params.set("q", freeText);

          const res = await API.get(`/business/search?${params.toString()}`);
          setSearchResults(res.data);
        }
        if (tab === 2) {
          const res = await API.get("/collab-requests/sent");
          setSentRequests(res.data);
        }
        if (tab === 3) {
          const res = await API.get("/collab-requests/received");
          setReceivedRequests(res.data);
        }
        if (tab === 4) {
          const res = await API.get("/collab-requests/active");
          setActiveCollabs(res.data);
        }
        if (tab === 5) {
          const res = await API.get("/business/collab/suggestions");
          setCollabMarket(res.data);
        }
      } catch (err) {
        console.error("❌ שגיאה בטעינת טאבים:", err);
      }
    };
    loadTab();
  }, [tab, searchMode, searchCategory, freeText]);

  // save profile handler (PUT)
  const handleSaveProfile = async formData => {
    try {
      const res = await API.put("/business/my", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileData(res.data.business);
      setShowEditProfile(false);
      alert("✅ הפרופיל עודכן בהצלחה");
    } catch (err) {
      console.error("❌ שגיאה בעדכון פרופיל:", err);
      alert("❌ נכשל בעדכון הפרופיל");
    }
  };

  if (authLoading) return <div className="p-6 text-center">🔄 טוען נתוני משתמש…</div>;
  if (!user && !devMode) return <div className="p-6 text-center">⚠️ יש להתחבר.</div>;
  if (!hasCollabAccess && !devMode)
    return (
      <div className="p-6 text-center">
        <h2>שידרוג נדרש לשיתופי פעולה</h2>
        <UpgradeBanner />
      </div>
    );

  if (showBusinessChat)
    return (
      <div className="p-6 collab-container">
        <BusinessChat currentUser={user} onClose={() => setShowBusinessChat(false)} />
      </div>
    );

  return (
    <div className="p-6 collab-container">
      <div className="tab-header">
        {[
          "פרופיל עסקי",
          "מצא שותף עסקי",
          "הצעות שנשלחו",
          "הצעות שהתקבלו",
          "שיתופי פעולה פעילים",
          "מרקט שיתופים",
        ].map((label, i) => (
          <button
            key={i}
            className={`tab ${tab === i ? "active" : ""}`}
            onClick={() => setTab(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && loadingProfile && <p>🔄 טוען פרופיל עסקי…</p>}
      {tab === 0 && !loadingProfile && profileData && (
        <CollabBusinessProfileTab
          profileData={profileData}
          showEditProfile={showEditProfile}
          onEdit={() => setShowEditProfile(true)}
          onSave={handleSaveProfile}
        />
      )}

      {tab === 1 && (
        <CollabFindPartnerTab
          categories={categories}
          searchMode={searchMode}
          setSearchMode={setSearchMode}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          freeText={freeText}
          setFreeText={setFreeText}
          results={searchResults}
        />
      )}

      {tab === 2 && <CollabSentRequestsTab sentRequests={sentRequests} />}
      {tab === 3 && <CollabReceivedRequestsTab receivedRequests={receivedRequests} />}
      {tab === 4 && <CollabActiveTab activeCollabs={activeCollabs} />}
      {tab === 5 && <CollabMarketTab marketItems={collabMarket} />}
    </div>
  );
}
