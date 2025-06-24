import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api";
import "./CollabFindPartnerTab.css";

export default function CollabFindPartnerTab({
  searchMode,
  searchCategory,
  freeText,
}) {
  const navigate = useNavigate();
  const [myBusinessId, setMyBusinessId] = useState(null);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get("/business/my");
        setMyBusinessId(res.data.business._id);
      } catch (err) {
        console.error("Error fetching my business:", err);
      }
    }
    fetchMyBusiness();
  }, []);

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
      navigate(`/business-profile/${business._id}`);
    }
  };

  return (
    <div className="partners-grid">
      {filteredPartners.map((business) => {
        const isMine = business._id === myBusinessId;
        const logoUrl = business.logo || "/default-logo.png";

        return (
          <div
            key={business._id || business.id}
            className={`collab-card${isMine ? " my-business" : ""}`}
          >
            <div className="business-logo">
              <img src={logoUrl} alt={`${business.businessName} לוגו`} />
            </div>
            <h3 className="business-name">
              {business.businessName}
              {isMine && <span className="my-business-badge">העסק שלי</span>}
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
      })}
    </div>
  );
}
