import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api";
import "./CollabFindPartnerTab.css";

function PartnerCard({ business, isMine, onOpenProfile }) {
  const logoUrl = business.logo || "/default-logo.png";

  return (
    <div key={business._id} className={`collab-card${isMine ? " my-business" : ""}`}>
      <div className="collab-card-inner">
        <div className="collab-card-content">
          <h3 className="business-name">
            {business.businessName}
            {isMine && <span className="my-business-badge">העסק שלי</span>}
          </h3>
          <p className="business-category">{business.category}</p>
          <p className="business-desc">{business.description}</p>
          <div className="collab-card-buttons">
            {isMine ? (
              <span className="disabled-action">לא ניתן לשלוח לעצמך</span>
            ) : (
              <button
                className="message-box-button secondary"
                onClick={() => onOpenProfile(business)}
              >
                צפייה בפרופיל
              </button>
            )}
          </div>
        </div>

        <div className="business-logo-left">
          <img src={logoUrl} alt={`${business.businessName} לוגו`} />
        </div>
      </div>
    </div>
  );
}

export default function CollabFindPartnerTab({ searchMode, searchCategory, freeText }) {
  const navigate = useNavigate();
  const [myBusinessId, setMyBusinessId] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [myBusinessRes, partnersRes] = await Promise.all([
        API.get("/business/my"),
        API.get("/business/findPartners"),
      ]);
      setMyBusinessId(myBusinessRes.data.business._id);
      setPartners(partnersRes.data.relevant || []);
    } catch (err) {
      setError("שגיאה בטעינת נתונים");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // אם רוצה רענון תקופתי, אפשר פה להוסיף setInterval עם ניקוי
  }, [fetchData]);

  const filteredPartners = useMemo(() => {
    if (!partners.length) return [];

    if (searchMode === "category" && searchCategory) {
      const catLower = searchCategory.toLowerCase();
      return partners.filter(
        (b) =>
          b.category.toLowerCase().includes(catLower) ||
          (b.complementaryCategories || []).some((cat) => cat.toLowerCase().includes(catLower))
      );
    }

    if (searchMode === "free" && freeText) {
      const text = freeText.toLowerCase();
      return partners.filter(
        (b) =>
          b.businessName.toLowerCase().includes(text) ||
          b.description.toLowerCase().includes(text) ||
          b.category.toLowerCase().includes(text)
      );
    }

    return partners;
  }, [partners, searchMode, searchCategory, freeText]);

  const handleOpenProfile = useCallback(
    (business) => {
      if (business._id) {
        navigate(`/business-profile/${business._id}`);
      }
    },
    [navigate]
  );

  if (loading) return <p>טוען שותפים...</p>;
  if (error) return <p className="error-text">{error}</p>;

  if (filteredPartners.length === 0) {
    return <p>לא נמצאו שותפים.</p>;
  }

  return (
    <div>
      <div className="search-container">{/* שדות חיפוש בעתיד */}</div>

      <div className="partners-grid">
        {filteredPartners.map((business) => (
          <PartnerCard
            key={business._id}
            business={business}
            isMine={business._id === myBusinessId}
            onOpenProfile={handleOpenProfile}
          />
        ))}
      </div>
    </div>
  );
}
