import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import API from "@api";
import { useAuth } from "../../../context/AuthContext";
import UpgradeBanner from "../../../components/UpgradeBanner";
import CollabBusinessProfileTab from "./collabtabs/CollabBusinessProfileTab";
import CollabFindPartnerTab from "./collabtabs/CollabFindPartnerTab";
import CollabActiveTab from "./collabtabs/CollabActiveTab";
import CollabMarketTab from "./collabtabs/CollabMarketTab";
import PartnershipAgreementsTab from "./PartnershipAgreementsTab";
import "./Collab.css";

const tabMap = {
  profile: 0,
  findPartner: 1,
  messages: 2, // טאב אחד חדש שמאחד את הצעות שנשלחו והתקבלו
  activeCollabs: 3,
  market: 4,
  agreements: 5,
};

const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  messages: "הודעות",
  activeCollabs: "שיתופי פעולה פעילים",
  market: "מרקט שיתופים",
  agreements: "הסכמי שיתוף פעולה",
};

function CollabMessagesTab({ refreshFlag, onStatusChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("sent"); // 'sent' או 'received'

  useEffect(() => {
    setLoading(true);
    async function fetchMessages() {
      try {
        const endpoint = filter === "sent" ? "/business/my/proposals/sent" : "/business/my/proposals/received";
        const res = await API.get(endpoint);
        setMessages(res.data[filter === "sent" ? "proposalsSent" : "proposalsReceived"] || []);
        setError(null);
      } catch (err) {
        console.error("Error loading proposals:", err);
        setError("שגיאה בטעינת ההודעות");
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [filter, refreshFlag]);

  const handleCancelProposal = async (proposalId) => {
    if (!window.confirm("האם למחוק את ההצעה?")) return;
    try {
      await API.delete(`/business/my/proposals/${proposalId}`);
      setMessages((prev) => prev.filter((p) => p.proposalId !== proposalId));
      alert("ההצעה בוטלה בהצלחה");
    } catch (err) {
      console.error("שגיאה בביטול ההצעה:", err.response || err.message || err);
      alert("שגיאה בביטול ההצעה");
    }
  };

  const handleAccept = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "accepted" });
      setMessages(prev =>
        prev.map(p =>
          (p.proposalId === proposalId || p._id === proposalId)
            ? { ...p, status: "accepted" }
            : p
        )
      );
      alert("ההצעה אושרה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה באישור ההצעה");
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await API.put(`/business/my/proposals/${proposalId}/status`, { status: "rejected" });
      setMessages(prev =>
        prev.map(p =>
          (p.proposalId === proposalId || p._id === proposalId)
            ? { ...p, status: "rejected" }
            : p
        )
      );
      alert("ההצעה נדחתה בהצלחה");
      onStatusChange?.();
    } catch (err) {
      console.error(err);
      alert("שגיאה בדחיית ההצעה");
    }
  };

  const parseMessage = (message) => {
    if (!message) return {};
    const lines = message.split('\n').map(line => line.trim());
    const parsed = {};
    lines.forEach(line => {
      if (line.startsWith('כותרת:')) parsed.title = line.replace('כותרת:', '').trim();
      else if (line.startsWith('תיאור:')) parsed.description = line.replace('תיאור:', '').trim();
      else if (line.startsWith('סכום:')) parsed.amount = line.replace('סכום:', '').trim();
      else if (line.startsWith('תוקף עד:')) parsed.validUntil = line.replace('תוקף עד:', '').trim();
    });
    return parsed;
  };

  if (loading) return <p>טוען הודעות...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ direction: "rtl", maxWidth: 700, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h3 style={{ color: "#6b46c1", marginBottom: 20, textAlign: "center" }}>📩 הודעות</h3>

      {/* סינון בין נשלחו להתקבלו */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
        <button
          style={{
            backgroundColor: filter === "sent" ? "#6b46c1" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setFilter("sent")}
        >
          הצעות שנשלחו
        </button>
        <button
          style={{
            backgroundColor: filter === "received" ? "#6b46c1" : "#ccc",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setFilter("received")}
        >
          הצעות שהתקבלו
        </button>
      </div>

      {messages.length === 0 ? (
        <p style={{ textAlign: "center" }}>אין הודעות להצגה.</p>
      ) : (
        messages.map((req) => {
          const { title, description, amount, validUntil } = parseMessage(req.message);
          return (
            <div
              key={req.proposalId || req._id}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                marginBottom: 16,
                wordBreak: "break-word",
                lineHeight: 1.6,
              }}
            >
              <p><strong>עסק שולח:</strong> {req.fromBusinessId?.businessName || "לא ידוע"}</p>
              <p><strong>עסק מקבל:</strong> {req.toBusinessId?.businessName || "לא ידוע"}</p>
              <p><strong>כותרת הצעה:</strong> {title || "-"}</p>
              <p><strong>תיאור הצעה:</strong> {description || "-"}</p>
              <p><strong>סכום:</strong> {amount != null ? amount + " ₪" : "-"}</p>
              <p><strong>תוקף הצעה:</strong> {validUntil ? new Date(validUntil).toLocaleDateString("he-IL") : "-"}</p>
              <p><strong>סטטוס:</strong> {req.status}</p>
              <p style={{ color: "#666", fontSize: "0.9rem", marginTop: 12 }}>
                נשלח ב־{new Date(req.createdAt).toLocaleDateString("he-IL")}
              </p>

              <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "flex-end" }}>
                {req.status === "pending" && filter === "received" ? (
                  <>
                    <button
                      style={{
                        backgroundColor: "#6b46c1",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleAccept(req.proposalId || req._id)}
                    >
                      ✅ אשר
                    </button>
                    <button
                      style={{
                        backgroundColor: "#d53f8c",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleReject(req.proposalId || req._id)}
                    >
                      ❌ דחה
                    </button>
                  </>
                ) : filter === "sent" ? (
                  <button
                    style={{
                      backgroundColor: "#d53f8c",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleCancelProposal(req.proposalId)}
                  >
                    🗑️ ביטול
                  </button>
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function Collab() {
  const { tab: tabParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const devMode = true; // אפשרות פיתוח

  const [tab, setTab] = useState(tabMap[tabParam] ?? 0);
  useEffect(() => {
    if (tabMap[tabParam] !== undefined && tabMap[tabParam] !== tab) {
      setTab(tabMap[tabParam]);
    }
  }, [tabParam]);

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
    setRefreshSent((f) => f + 1);
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

      {/* הודעות - טאב מאוחד */}
      {tab === 2 && (
        <CollabMessagesTab
          refreshFlag={refreshSent + refreshReceived}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* שיתופי פעולה פעילים */}
      {tab === 3 && <CollabActiveTab isDevUser={isDevUser} />}

      {/* מרקט שיתופים */}
      {tab === 4 && <CollabMarketTab isDevUser={isDevUser} />}

      {/* הסכמי שיתוף פעולה */}
      {tab === 5 && <PartnershipAgreementsTab userBusinessId={user?.businessId} />}
    </div>
  );
}
