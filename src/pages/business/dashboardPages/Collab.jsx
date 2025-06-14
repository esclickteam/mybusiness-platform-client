import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabMessagesTab from "./collabtabs/CollabMessagesTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import CollabActiveTab from "./collabtabs/CollabActiveTab";
import PartnershipAgreementsTab from "./PartnershipAgreementsTab";
import "./Collab.css";

const tabMap = {
  profile: 0,
  findPartner: 1,
  messages: 2,
  collabsAndAgreements: 3,
  market: 4,
};

const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  messages: "הצעות",
  collabsAndAgreements: "שיתופי פעולה והסכמים",
  market: "מרקט שיתופים",
};

export default function Collab() {
  const { tab: tabParam } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [tab, setTab] = useState(tabMap[tabParam] ?? 0);
  const [businessId, setBusinessId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ניהול שינויים ב-URL
  useEffect(() => {
    if (tabMap[tabParam] !== undefined && tabMap[tabParam] !== tab) {
      setTab(tabMap[tabParam]);
    }
  }, [tabParam]);

  // בדיקה ולוגים של user - עזר לזיהוי מזהה העסק
  useEffect(() => {
    console.log("User object from context:", user);
  }, [user]);

  // קבלת מזהה העסק מתוך user או מה-API
  useEffect(() => {
    if (user?.business?._id) {
      console.log("Setting businessId from user.business._id:", user.business._id);
      setBusinessId(user.business._id);
    } else {
      async function fetchBusinessId() {
        try {
          console.log("Fetching businessId from /business/my API...");
          const { data } = await API.get("/business/my");
          console.log("Received business data:", data);
          setBusinessId(data._id);
        } catch (err) {
          console.error("Failed to fetch business ID:", err);
        }
      }
      fetchBusinessId();
    }
  }, [user]);

  // טעינת פרופיל העסק לפרופיל עסקי
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoadingProfile(true);
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

  if (loading) return <div className="p-6 text-center">🔄 טוען נתונים...</div>;
  if (!user) return <div className="p-6 text-center">⚠️ יש להתחבר כדי לגשת לדף זה.</div>;
  if (!hasCollabAccess) {
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

      {tab === 0 &&
        (loadingProfile ? (
          <div className="p-6 text-center">🔄 טוען פרופיל עסק...</div>
        ) : (
          <CollabBusinessProfileTab
            profileData={profileData}
            handleSaveProfile={() => alert("שמירת פרופיל - יש להוסיף לוגיקה")}
          />
        ))}

      {tab === 1 && (
        <CollabFindPartnerTab
          isDevUser={isDevUser}
          handleSendProposal={() => alert("שליחת הצעה - יש להוסיף לוגיקה")}
          handleOpenChat={() => alert("פתיחת צ׳אט - יש להוסיף לוגיקה")}
        />
      )}

      {tab === 2 && (
        <CollabMessagesTab
          refreshFlag={0}
          onStatusChange={() => console.log("Status changed")}
        />
      )}

      {tab === 3 && businessId && (
        <CollabsAndAgreementsTab
          isDevUser={isDevUser}
          userBusinessId={businessId}
          token={user?.token}
        />
      )}

      {tab === 4 && <CollabMarketTab isDevUser={isDevUser} />}
    </div>
  );
}

// קומפוננטה פנימית לשיתופי פעולה והסכמים
function CollabsAndAgreementsTab({ isDevUser, userBusinessId, token }) {
  const [activeView, setActiveView] = React.useState("active"); // 'active' | 'agreements'

  const tabStyle = (tab) => ({
    backgroundColor: activeView === tab ? "#6b46c1" : "#ccc",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  });

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button style={tabStyle("active")} onClick={() => setActiveView("active")}>
          שיתופי פעולה פעילים
        </button>
        <button style={tabStyle("agreements")} onClick={() => setActiveView("agreements")}>
          הסכמי שיתוף פעולה
        </button>
      </div>

      {activeView === "active" && (
        <CollabActiveTab
          isDevUser={isDevUser}
          userBusinessId={userBusinessId}
          token={token}
        />
      )}

      {activeView === "agreements" && (
        <PartnershipAgreementsTab userBusinessId={userBusinessId} />
      )}
    </div>
  );
}
