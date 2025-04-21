import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
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

  // --- data states ---
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [freeText, setFreeText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeCollabs, setActiveCollabs] = useState([]);
  const [collabMarket, setCollabMarket] = useState([]);

  // --- profile tab ---
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // dev user / access guard
  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess = isDevUser || user?.subscriptionPlan?.includes("collaboration");

  // --- fetch categories on mount ---
  useEffect(() => {
    fetch("/api/business/categories", { credentials: "include" })
      .then((r) => r.json())
      .then(setCategories)
      .catch((err) => console.error("❌ טעינת קטגוריות:", err));
  }, []);

  // --- fetch profile data once ---
  useEffect(() => {
    fetch(`/api/business/my${devMode ? "?dev=true" : ""}`, {
      credentials: "include",
    })
      .then((r) => r.text())
      .then((text) => {
        if (text.startsWith("<!DOCTYPE")) throw new Error("חזר HTML במקום JSON");
        return JSON.parse(text);
      })
      .then((data) => {
        setProfileData({
          businessName: data.name,
          category: data.category,
          area: data.area,
          about: data.about,
          collabPref: data.collabPref,
          contact: data.contact,
          phone: data.phone,
          email: data.email,
        });
      })
      .catch((err) => console.error("❌ שגיאה בטעינת פרופיל:", err))
      .finally(() => setLoadingProfile(false));
  }, [devMode]);

  // --- fetch tab‑specific data whenever the user switches tab ---
  useEffect(() => {
    async function loadTab() {
      try {
        if (tab === 1) {
          // מצא שותף עסקי: חיפוש לפי קטגוריה או free-text
          const params = new URLSearchParams();
          if (searchMode === "category") params.set("category", searchCategory);
          else if (searchMode === "free") params.set("q", freeText);

          const res = await fetch(`/api/business/search?${params}`, {
            credentials: "include",
          });
          setSearchResults(await res.json());
        }
        if (tab === 2) {
          // בקשות שנשלחו
          const res = await fetch("/api/collab-requests/sent", {
            credentials: "include",
          });
          setSentRequests(await res.json());
        }
        if (tab === 3) {
          // בקשות שהתקבלו
          const res = await fetch("/api/collab-requests/received", {
            credentials: "include",
          });
          setReceivedRequests(await res.json());
        }
        if (tab === 4) {
          // שיתופי פעולה פעילים
          const res = await fetch("/api/collab-requests/active", {
            credentials: "include",
          });
          setActiveCollabs(await res.json());
        }
        if (tab === 5) {
          // מרקט שיתופים
          const res = await fetch("/api/business/collab/suggestions", {
            credentials: "include",
          });
          setCollabMarket(await res.json());
        }
      } catch (err) {
        console.error("❌ שגיאה בטעינת Tab", tab, err);
      }
    }
    loadTab();
  }, [tab, searchCategory, freeText]);

  // --- handlers קצרות ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // כאן תשגרי PUT ל־/api/business/my עם formData
    alert("✅ פרטי הפרופיל נשמרו (בחלק הבא נוסיף כאן את ה‑PUT)");
    setShowEditProfile(false);
  };

  if (authLoading) return <div className="p-6 text-center">🔄 טוען נתוני משתמש...</div>;
  if (!user && !devMode)
    return <div className="p-6 text-center">⚠️ יש להתחבר כדי לגשת לדף זה.</div>;
  if (!hasCollabAccess && !devMode)
    return (
      <div className="p-6 text-center">
        <h2>שיתופי פעולה זמינים רק בחבילה מתקדמת</h2>
        <p>שדרג את החבילה שלך כדי לפתוח את האפשרות לשיתוף פעולה.</p>
        <UpgradeBanner />
      </div>
    );

  // --- render ---
  if (showBusinessChat)
    return (
      <div className="p-6 collab-container">
        <BusinessChat currentUser={user} />
        <button className="collab-form-button mt-4" onClick={() => setShowBusinessChat(false)}>
          🔙 חזרה לפרופיל העסקי
        </button>
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

      {tab === 0 && loadingProfile && (
        <div className="p-6 text-center">🔄 טוען פרופיל עסק...</div>
      )}
      {tab === 0 && !loadingProfile && profileData && (
        <CollabBusinessProfileTab
          profileData={profileData}
          setShowEditProfile={setShowEditProfile}
          handleSaveProfile={handleSaveProfile}
          showEditProfile={showEditProfile}
        />
      )}

      {tab === 1 && (
        <CollabFindPartnerTab
          categories={categories}
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
