import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabSentRequestsTab from "./collabtabs/CollabSentRequestsTab";
import CollabReceivedRequestsTab from "./collabtabs/CollabReceivedRequestsTab";
import CollabActiveTab from "./collabtabs/CollabActiveTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import "./Collab.css";

const tabMap = {
  profile: 0,
  findPartner: 1,
  sentRequests: 2,
  receivedRequests: 3,
  activeCollabs: 4,
  market: 5,
};

const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  sentRequests: "הצעות שנשלחו",
  receivedRequests: "הצעות שהתקבלו",
  activeCollabs: "שיתופי פעולה פעילים",
  market: "מרקט שיתופים",
};

export default function Collab() {
  const { tab: tabParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const devMode = true; // אפשרות פיתוח

  // setTab מתעדכן לפי הפרמטר ב-URL או ברירת מחדל 0
  const [tab, setTab] = useState(tabMap[tabParam] ?? 0);

  useEffect(() => {
    // כשפרמטר הטאב ב-URL משתנה, עדכן את הסטייט
    if (tabMap[tabParam] !== undefined && tabMap[tabParam] !== tab) {
      setTab(tabMap[tabParam]);
    }
  }, [tabParam]);

  const handleTabChange = (newTabIndex) => {
    setTab(newTabIndex);
    const tabKey = Object.keys(tabMap).find((key) => tabMap[key] === newTabIndex);
    // שנה URL בהתאם לטאב הנבחר
    navigate(`/business/collaborations/${tabKey}`, { replace: true });
  };

  // כל שאר הסטייטים והלוגיקה שלך - לדוגמה:
  const [showBusinessChat, setShowBusinessChat] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");
  const [freeText, setFreeText] = useState("");
  const [categories, setCategories] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeCollabs, setActiveCollabs] = useState([]);
  const [collabMarket, setCollabMarket] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await API.get("/business/my");
        setProfileData({
          businessName: data.businessName || data.name || "",
          category: data.category || "",
          area: data.area || "",
          about: data.about || "",
          collabPref: data.collabPref || "",
          contact: data.contact || "",
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess = isDevUser || user?.subscriptionPlan?.includes("collaboration");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const form = e.target;
    const newData = {
      businessName: form.businessName.value,
      category: form.category.value,
      area: form.area.value,
      about: form.about.value,
      collabPref: form.collabPref.value,
      contact: form.contact.value,
      phone: form.phone.value,
      email: form.email.value,
    };
    setProfileData(newData);
    setShowEditProfile(false);
    alert("✅ פרטי הפרופיל נשמרו");
  };

  const handleSendProposal = (business) => {
    console.log("נשלחת הצעה אל:", business);
  };

  const handleOpenProfile = (business) => {
    setSelectedBusiness(business);
  };

  const handleOpenChat = (business) => {
    console.log("פותח צ׳אט עם:", business);
  };

  if (loading) return <div className="p-6 text-center">🔄 טוען נתונים...</div>;
  if (!user && !devMode) {
    return <div className="p-6 text-center">⚠️ יש להתחבר כדי לגשת לדף זה.</div>;
  }
  if (!hasCollabAccess && !devMode) {
    return (
      <div className="p-6 text-center">
        <h2>שיתופי פעולה זמינים רק בחבילה מתקדמת</h2>
        <p>שדרג את החבילה שלך כדי לפתוח את האפשרות לשתף פעולה עם עסקים אחרים.</p>
        <UpgradeBanner />
      </div>
    );
  }

  return showBusinessChat ? (
    <div className="p-6 collab-container">
      <BusinessChat currentUser={user} />
      <button className="collab-form-button mt-4" onClick={() => setShowBusinessChat(false)}>
        🔙 חזרה לפרופיל העסקי
      </button>
    </div>
  ) : (
    <div className="p-6 collab-container">
      <div className="tab-header">
        {Object.keys(tabMap).map((key) => (
          <button
            key={key}
            className={`tab ${tab === tabMap[key] ? "active" : ""}`}
            onClick={() => handleTabChange(tabMap[key])}
          >
            {tabLabels[key]}
          </button>
        ))}
      </div>

      {tab === 0 && loadingProfile && <div className="p-6 text-center">🔄 טוען פרופיל עסק...</div>}

      {tab === 0 && !loadingProfile && profileData && (
        <CollabBusinessProfileTab
          profileData={profileData}
          profileImage={profileImage}
          setShowEditProfile={setShowEditProfile}
          setShowBusinessChat={setShowBusinessChat}
          handleSaveProfile={handleSaveProfile}
          showEditProfile={showEditProfile}
        />
      )}

      {tab === 1 && (
        <CollabFindPartnerTab
          searchMode={searchCategory ? "category" : "free"}
          setSearchMode={() => {}}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          freeText={freeText}
          setFreeText={setFreeText}
          categories={categories}
          setSelectedBusiness={setSelectedBusiness}
          handleSendProposal={handleSendProposal}
          handleOpenProfile={handleOpenProfile}
          handleOpenChat={handleOpenChat}
          isDevUser={isDevUser}
        />
      )}

      {tab === 2 && <CollabSentRequestsTab sentRequests={sentRequests} />}
      {tab === 3 && <CollabReceivedRequestsTab receivedRequests={receivedRequests} isDevUser={isDevUser} />}
      {tab === 4 && <CollabActiveTab isDevUser={isDevUser} />}
      {tab === 5 && <CollabMarketTab isDevUser={isDevUser} />}
    </div>
  );
}
