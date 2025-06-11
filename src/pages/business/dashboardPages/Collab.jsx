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
import PartnershipAgreementsTab from "./PartnershipAgreementsTab";
import "./Collab.css";

const tabMap = {
  profile: 0,
  findPartner: 1,
  sentRequests: 2,
  receivedRequests: 3,
  activeCollabs: 4,
  market: 5,
  agreements: 6,
};

const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  sentRequests: "הצעות שנשלחו",
  receivedRequests: "הצעות שהתקבלו",
  activeCollabs: "שיתופי פעולה פעילים",
  market: "מרקט שיתופים",
  agreements: "הסכמי שיתוף פעולה",
};

export default function Collab() {
  const { tab: tabParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const devMode = true; // אפשרות פיתוח

  // ניהול הטאב לפי URL
  const [tab, setTab] = useState(tabMap[tabParam] ?? 0);
  useEffect(() => {
    if (tabMap[tabParam] !== undefined && tabMap[tabParam] !== tab) {
      setTab(tabMap[tabParam]);
    }
  }, [tabParam]);

  // מחלקות רענון לטאבים שונים
  const [refreshSent, setRefreshSent] = useState(0);
  const [refreshReceived, setRefreshReceived] = useState(0);

  // נתוני פרופיל עסק
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

  // handlers
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
    alert("✅ פרטי הפרופיל נשמרו");
  };

  const handleSendProposal = async (toBusinessId, message) => {
    try {
      await API.post("/business/my/proposals", { toBusinessId, message });
      setRefreshSent((f) => f + 1);
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בשליחת ההצעה");
    }
  };

  const handleStatusChange = () => {
    setRefreshReceived((f) => f + 1);
  };

  const handleOpenChat = (businessWithMessage) => {
    console.log("פותח צ׳אט עם:", businessWithMessage);
  };

  if (loading) return <div className="p-6 text-center">🔄 טוען נתונים...</div>;
  if (!user && !devMode) {
    return <div className="p-6 text-center">⚠️ יש להתחבר כדי לגשת לדף זה.</div>;
  }
  if (!hasCollabAccess && !devMode) {
    return (
      <div className="p-6 text-center">
        <h2>שיתופי פעולה זמינים רק בחבילה מתקדמת</h2>
        <UpgradeBanner />
      </div>
    );
  }

  return (
    <div className="p-6 collab-container">
      <div className="tab-header">
        {Object.keys(tabMap).map((key) => (
          <button
            key={key}
            className={`tab ${tab === tabMap[key] ? "active" : ""}`}
            onClick={() => {
              setTab(tabMap[key]);
              navigate(`/business/collaborations/${key}`, { replace: true });
            }}
          >
            {tabLabels[key]}
          </button>
        ))}
      </div>

      {/* פרופיל עסק */}
      {tab === 0 &&
        (loadingProfile ? (
          <div className="p-6 text-center">🔄 טוען פרופיל עסק...</div>
        ) : (
          <CollabBusinessProfileTab
            profileData={profileData}
            profileImage={profileImage}
            handleSaveProfile={handleSaveProfile}
          />
        ))}

      {/* מצא שותף */}
      {tab === 1 && (
        <CollabFindPartnerTab
          searchMode="category"
          setSearchMode={() => {}}
          searchCategory={""}
          setSearchCategory={() => {}}
          freeText={""}
          setFreeText={() => {}}
          categories={[]}
          setSelectedBusiness={() => {}}
          handleSendProposal={handleSendProposal}
          handleOpenChat={handleOpenChat}
          isDevUser={isDevUser}
        />
      )}

      {/* הצעות שנשלחו */}
      {tab === 2 && <CollabSentRequestsTab refreshFlag={refreshSent} />}

      {/* הצעות שהתקבלו */}
      {tab === 3 && (
        <CollabReceivedRequestsTab
          isDevUser={isDevUser}
          refreshFlag={refreshReceived}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* שיתופי פעולה פעילים */}
      {tab === 4 && <CollabActiveTab isDevUser={isDevUser} />}

      {/* מרקט שיתופים */}
      {tab === 5 && <CollabMarketTab isDevUser={isDevUser} />}

      {/* הסכמי שיתוף פעולה */}
      {tab === 6 && <PartnershipAgreementsTab userBusinessId={user?.businessId} />}
    </div>
  );
}
