import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabMessagesTab from "./collabtabs/CollabMessagesTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import { AiProvider } from "../../../context/AiContext";  // <-- הוספתי כאן
import "./Collab.css";

const tabMap = {
  profile: 0,
  findPartner: 1,
  messages: 2,
  market: 3,
};

const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  messages: "הצעות",
  market: "מרקט שיתופים",
};

export default function Collab() {
  const { tab: tabParam } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const devMode = true;

  const [tab, setTab] = useState(tabMap[tabParam] ?? 0);

  useEffect(() => {
    if (tabMap[tabParam] !== undefined && tabMap[tabParam] !== tab) {
      setTab(tabMap[tabParam]);
    }
  }, [tabParam, tab]);

  const [refreshSent, setRefreshSent] = useState(0);
  const [refreshReceived, setRefreshReceived] = useState(0);

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
  const hasCollabAccess =
    isDevUser || user?.subscriptionPlan?.includes("collaboration");

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

  const handleSendProposal = async (toBusinessId, message, contactName, phone) => {
  try {
    let endpoint = "";
    const payload = { message, contactName, phone };

    if (toBusinessId) {
      endpoint = "/business/my/proposals/private";
      payload.toBusinessId = toBusinessId;
    } else {
      endpoint = "/business/my/proposals/public";
    }

    await API.post(endpoint, payload);
    setRefreshSent((f) => f + 1);
  } catch (err) {
    console.error(err);
    alert("❌ שגיאה בשליחת ההצעה");
  }
};


  const handleStatusChange = () => {
    setRefreshSent((f) => f + 1);
    setRefreshReceived((f) => f + 1);
  };

  const handleOpenChat = (businessWithMessage) => {
    console.log("פותח צ׳אט עם:", businessWithMessage);
  };

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

  return (
    <AiProvider>
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

        {tab === tabMap.profile &&
          (loadingProfile ? (
            <div className="p-6 text-center">🔄 טוען פרופיל עסק...</div>
          ) : (
            <CollabBusinessProfileTab
              profileData={profileData}
              profileImage={profileImage}
              handleSaveProfile={handleSaveProfile}
            />
          ))}

        {tab === tabMap.findPartner && (
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

        {tab === tabMap.messages && (
          <CollabMessagesTab
            refreshFlag={refreshSent + refreshReceived}
            onStatusChange={handleStatusChange}
            userBusinessId={user?.businessId}
          />
        )}

        {tab === tabMap.market && <CollabMarketTab isDevUser={isDevUser} />}
      </div>
    </AiProvider>
  );
}
