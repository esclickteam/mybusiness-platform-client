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
  collaborations: 4, // טאב חדש
  market: 5,
};

const tabLabels = {
  profile: "פרופיל עסקי",
  findPartner: "מצא שותף עסקי",
  messages: "הצעות",
  collabsAndAgreements: "שיתופי פעולה והסכמים",
  collaborations: "שיתופי פעולה", // טאב חדש
  market: "מרקט שיתופים",
};

export default function Collab() {
  const { tab: tabParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const devMode = true; // מצב פיתוח

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
        />
      )}

      {tab === tabMap.collabsAndAgreements && (
        <CollabsAndAgreementsTab
          isDevUser={isDevUser}
          userBusinessId={user?.businessId}
          token={user?.token}
        />
      )}

      {tab === tabMap.collaborations && (
        <CollaborationsTab
          refreshSent={refreshSent}
          refreshReceived={refreshReceived}
        />
      )}

      {tab === tabMap.market && <CollabMarketTab isDevUser={isDevUser} />}
    </div>
  );
}

// קומפוננטת הצגת שיתופי פעולה שנשלחו והתקבלו
function CollaborationsTab({ refreshSent, refreshReceived }) {
  const [sentProposals, setSentProposals] = useState([]);
  const [receivedProposals, setReceivedProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      try {
        const sentRes = await API.get("/business/my/proposals/sent");
        const receivedRes = await API.get("/business/my/proposals/received");
        setSentProposals(sentRes.data.proposalsSent || []);
        setReceivedProposals(receivedRes.data.proposalsReceived || []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, [refreshSent, refreshReceived]);

  if (loading) return <div className="p-6 text-center">🔄 טוען שיתופי פעולה...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h3>שיתופי פעולה שנשלחו</h3>
      {sentProposals.length === 0 ? (
        <p>לא נשלחו שיתופי פעולה</p>
      ) : (
        <ul>
          {sentProposals.map((proposal) => (
            <li key={proposal._id} style={{ marginBottom: 10 }}>
              <strong>אל: </strong> {proposal.toBusinessId?.businessName || "-"} <br />
              <strong>סטטוס: </strong> {proposal.status} <br />
              <strong>הודעה: </strong> {proposal.message || "-"}
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: 40 }}>שיתופי פעולה שהתקבלו</h3>
      {receivedProposals.length === 0 ? (
        <p>לא התקבלו שיתופי פעולה</p>
      ) : (
        <ul>
          {receivedProposals.map((proposal) => (
            <li key={proposal._id} style={{ marginBottom: 10 }}>
              <strong>מ: </strong> {proposal.fromBusinessId?.businessName || "-"} <br />
              <strong>סטטוס: </strong> {proposal.status} <br />
              <strong>הודעה: </strong> {proposal.message || "-"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// קומפוננטה פנימית, לא default export
function CollabsAndAgreementsTab({ isDevUser, userBusinessId, token }) {
  const [activeView, setActiveView] = useState("active"); // 'active' | 'agreements'

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
