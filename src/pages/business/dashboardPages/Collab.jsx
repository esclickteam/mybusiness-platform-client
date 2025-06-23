import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabMessagesTab from "./collabtabs/CollabMessagesTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import { AiProvider } from "../../../context/AiContext";
import "./Collab.css";

// תפריט צד קבוע עם ניווט טאבים
const Sidebar = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: "profile", label: "פרופיל עסקי" },
    { id: "findPartner", label: "מצא שותף עסקי" },
    { id: "messages", label: "הצעות" },
    { id: "market", label: "מרקט שיתופים" },
  ];

  return (
    <div className="collab-sidebar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onChangeTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default function Collab() {
  const { tab: tabParam } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const devMode = true;

  // ננהל את הטאב הנבחר לפי פרמטר מהכתובת או ברירת מחדל
  const [tab, setTab] = useState(tabParam || "profile");

  // נעדכן URL ונחליף תוכן
  const changeTab = (newTab) => {
    setTab(newTab);
    navigate(`/business/collaborations/${newTab}`, { replace: true });
  };

  // שאר הלוגיקה (socket, פרופיל וכו') נשארת זהה

  const [refreshSent, setRefreshSent] = useState(0);
  const [refreshReceived, setRefreshReceived] = useState(0);

  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // --- Socket.IO state ---
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://api.esclick.co.il";

    const newSocket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

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
      <div className="collab-layout">
        <Sidebar activeTab={tab} onChangeTab={changeTab} />

        <div className="collab-content">
          {tab === "profile" &&
            (loadingProfile ? (
              <div className="p-6 text-center">🔄 טוען פרופיל עסק...</div>
            ) : (
              <CollabBusinessProfileTab
                profileData={profileData}
                profileImage={profileImage}
                handleSaveProfile={handleSaveProfile}
              />
            ))}

          {tab === "findPartner" && (
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

          {tab === "messages" && (
            <CollabMessagesTab
              socket={socket}
              refreshFlag={refreshSent + refreshReceived}
              onStatusChange={handleStatusChange}
              userBusinessId={user?.businessId}
            />
          )}

          {tab === "market" && <CollabMarketTab isDevUser={isDevUser} />}
        </div>
      </div>
    </AiProvider>
  );
}
