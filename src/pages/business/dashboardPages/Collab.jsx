import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabMessagesTab from "./collabtabs/CollabMessagesTab";
import CollabActiveTab from "./collabtabs/CollabActiveTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import PartnershipAgreementsTab from "./PartnershipAgreementsTab";
import "./Collab.css";

// מיפוי הטאבים הראשיים בעמוד
const tabMap = {
  profile: 0,
  findPartner: 1,
  messages: 2,
  collabsAndAgreements: 3, // טאב מאוחד לשיתופי פעולה פעילים והסכמים
  market: 4,
};

// שמות הטאבים שיוצגו למשתמש
const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  messages: "הצעות",
  collabsAndAgreements: "שיתופי פעולה והסכמים",
  market: "מרקט שיתופים",
};

// קומפוננטה פנימית לטאב המאוחד של שיתופי פעולה והסכמים
function CollabsAndAgreementsTab({ isDevUser, userBusinessId }) {
  // ניהול תצוגת הטאב הפנימי - 'active' או 'agreements'
  const [activeView, setActiveView] = useState("active");

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      {/* כפתורים למעבר בין שיתופי פעולה פעילים להסכמים */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          style={{
            backgroundColor: activeView === "active" ? "#6b46c1" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setActiveView("active")}
        >
          שיתופי פעולה פעילים
        </button>
        <button
          style={{
            backgroundColor: activeView === "agreements" ? "#6b46c1" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setActiveView("agreements")}
        >
          הסכמי שיתוף פעולה
        </button>
      </div>

      {/* הצגת התצוגה לפי הבחירה */}
      {activeView === "active" && <CollabActiveTab isDevUser={isDevUser} />}
      {activeView === "agreements" && (
        <PartnershipAgreementsTab userBusinessId={userBusinessId} />
      )}
    </div>
  );
}

// הקומפוננטה הראשית של שיתוף הפעולה
export default function Collab() {
  const { tab: tabParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const devMode = true; // מצב פיתוח

  // ניהול הטאב שנבחר לפי ה-URL
  const [tab, setTab] = useState(tabMap[tabParam] ?? 0);

  useEffect(() => {
    if (tabMap[tabParam] !== undefined && tabMap[tabParam] !== tab) {
      setTab(tabMap[tabParam]);
    }
  }, [tabParam]);

  // רענון לטאבים של הצעות שנשלחו והתקבלו
  const [refreshSent, setRefreshSent] = useState(0);
  const [refreshReceived, setRefreshReceived] = useState(0);

  // נתוני פרופיל העסק
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

  // בדיקות הרשאות וגישה
  const isDevUser = user?.email === "newuser@example.com";
  const hasCollabAccess =
    isDevUser || user?.subscriptionPlan?.includes("collaboration");

  // שמירת פרופיל חדש
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

  // שליחת הצעה חדשה
  const handleSendProposal = async (toBusinessId, message) => {
    try {
      await API.post("/business/my/proposals", { toBusinessId, message });
      setRefreshSent((f) => f + 1);
    } catch (err) {
      console.error(err);
      alert("❌ שגיאה בשליחת ההצעה");
    }
  };

  // רענון הצעות לאחר שינויים
  const handleStatusChange = () => {
    setRefreshSent((f) => f + 1);
    setRefreshReceived((f) => f + 1);
  };

  // פתיחת צ'אט (ממשק)
  const handleOpenChat = (businessWithMessage) => {
    console.log("פותח צ׳אט עם:", businessWithMessage);
  };

  // בדיקות טעינה והרשאות
  if (loading) return <div className="p-6 text-center">🔄 טוען נתונים...</div>;
  if (!user && !devMode) {
    return (
      <div className="p-6 text-center">⚠️ יש להתחבר כדי לגשת לדף זה.</div>
    );
  }
  if (!hasCollabAccess && !devMode) {
    return (
      <div className="p-6 text-center">
        <h2>שיתופי פעולה זמינים רק בחבילה מתקדמת</h2>
        <UpgradeBanner />
      </div>
    );
  }

  // ממשק המשתמש עם הטאבים
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

      {/* הצגת הטאב לפי הבחירה */}
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

      {tab === 2 && (
        <CollabMessagesTab
          refreshFlag={refreshSent + refreshReceived}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* כאן טאב מאוחד לשיתופי פעולה פעילים והסכמים */}
      {tab === 3 && (
        <CollabsAndAgreementsTab
          isDevUser={isDevUser}
          userBusinessId={user?.businessId}
        />
      )}

      {tab === 4 && <CollabMarketTab isDevUser={isDevUser} />}
    </div>
  );
}
