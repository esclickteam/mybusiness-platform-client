import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import API from "../../../../api";
import CreatePartnershipAgreementForm from "../../../../components/CreateAgreementForm";
import ProposalForm from "./ProposalForm";
import "./CollabFindPartnerTab.css";

export default function CollabFindPartnerTab({
  searchMode,
  setSearchMode,
  searchCategory,
  setSearchCategory,
  freeText,
  setFreeText,
  categories,
  setSelectedBusiness,
  setOpenModal,
  isDevUser,
  handleSendProposal,
}) {
  const navigate = useNavigate();

  const [myBusinessId, setMyBusinessId] = useState(null);
  const [myBusinessName, setMyBusinessName] = useState("");

  const [currentProposalId, setCurrentProposalId] = useState(null);

  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get("/business/my");
        setMyBusinessId(res.data.business._id);
        setMyBusinessName(res.data.business.businessName);
      } catch (err) {
        console.error("Error fetching my business:", err);
      }
    }
    fetchMyBusiness();
  }, []);

  const [partners, setPartners] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [createAgreementModalOpen, setCreateAgreementModalOpen] = useState(false);
  const [createAgreementPartner, setCreateAgreementPartner] = useState(null);

  const [sendProposalModalOpen, setSendProposalModalOpen] = useState(false);
  const [selectedBusinessForProposal, setSelectedBusinessForProposal] = useState(null);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await API.get("/business/findPartners");
        setPartners(res.data.relevant || []);
      } catch (err) {
        console.error("Error fetching partners", err);
      }
    }
    fetchPartners();
    const intervalId = setInterval(fetchPartners, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredPartners = partners.filter((business) => {
    if (searchMode === "category" && searchCategory) {
      return (
        business.category.toLowerCase().includes(searchCategory.toLowerCase()) ||
        (business.complementaryCategories || []).some((cat) =>
          cat.toLowerCase().includes(searchCategory.toLowerCase())
        )
      );
    }
    if (searchMode === "free" && freeText) {
      const text = freeText.toLowerCase();
      return (
        business.businessName.toLowerCase().includes(text) ||
        business.description.toLowerCase().includes(text) ||
        business.category.toLowerCase().includes(text)
      );
    }
    return true;
  });

  const handleOpenProfile = (business) => {
    if (business._id) {
      navigate("/business/collaborations/profile");



    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="search-container">{/* שדות חיפוש ופילטרים */}</div>

      {/* Partners List */}
      {filteredPartners.length === 0 ? (
        <p>לא נמצאו שותפים.</p>
      ) : (
        filteredPartners.map((business) => {
          const isMine = business._id === myBusinessId;
          return (
            <div
              key={business._id || business.id}
              className={`collab-card${isMine ? " my-business" : ""}`}
            >
              <h3 className="business-name">
                {business.businessName}
                {isMine && <span className="my-business-badge"> (העסק שלי) </span>}
              </h3>
              <p className="business-category">{business.category}</p>
              <p className="business-desc">{business.description}</p>
              <span className="status-badge">סטטוס בקשה: {business.status || "לא ידוע"}</span>
              <div className="collab-card-buttons">
                {isMine ? (
                  <span className="disabled-action">לא ניתן לשלוח לעצמך</span>
                ) : (
                  <button
                    className="message-box-button secondary"
                    onClick={() => handleOpenProfile(business)}
                  >
                    צפייה בפרופיל
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const modalStyle = {
  backgroundColor: "#fff",
  p: 4,
  borderRadius: 2,
  maxWidth: 420,
  m: "10% auto",
  maxHeight: "80vh",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
};
