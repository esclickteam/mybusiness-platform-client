import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../../api";
import "./CollabFindPartnerTab.css";

/* =========================
   Partner Card
========================= */

function PartnerCard({ business, isMine, onOpenProfile }) {
  const logoUrl = business.logo || "/default-logo.png";

  return (
    <div className={`collab-card${isMine ? " my-business" : ""}`}>
      <div className="collab-card-inner">
        <div className="business-card__media">
          <img src={logoUrl} alt={`${business.businessName} logo`} />
        </div>

        <div className="collab-card-content">
          <h3 className="business-name">
            {business.businessName}
            {isMine && (
              <span className="my-business-badge">My Business</span>
            )}
          </h3>

          <p className="business-category">{business.category}</p>

          {business.description && (
            <p className="business-desc">
              {business.description}
            </p>
          )}

          <div className="collab-card-buttons">
  {isMine ? (
    <span className="disabled-action">
      This is your business
    </span>
  ) : (
    <>
      <button
        className="message-box-button primary"
        onClick={() => onOpenProfile(business)}
      >
        View Profile
      </button>

      
    </>
  )}
</div>

        </div>
      </div>
    </div>
  );
}

/* =========================
   Find Partner Tab
========================= */

export default function CollabFindPartnerTab({
  searchMode,
  searchCategory,
  freeText,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [myBusinessId, setMyBusinessId] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gridRef = useRef(null);

  /* =========================
     Fetch Data
  ========================= */

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
      console.error(err);
      setError("Failed to load partners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* =========================
     Filtering Logic
  ========================= */

  const filteredPartners = useMemo(() => {
    if (!partners.length) return [];

    if (searchMode === "category" && searchCategory) {
      const cat = searchCategory.toLowerCase();

      return partners.filter(
        (b) =>
          b.category?.toLowerCase().includes(cat) ||
          (b.complementaryCategories || []).some((c) =>
            c.toLowerCase().includes(cat)
          )
      );
    }

    if (searchMode === "free" && freeText) {
      const text = freeText.toLowerCase();

      return partners.filter(
        (b) =>
          b.businessName?.toLowerCase().includes(text) ||
          b.description?.toLowerCase().includes(text) ||
          b.category?.toLowerCase().includes(text)
      );
    }

    return partners;
  }, [partners, searchMode, searchCategory, freeText]);

  /* =========================
     Navigation
  ========================= */

  const handleOpenProfile = useCallback(
    (business) => {
      navigate(`/business-profile/${business._id}`);
    },
    [navigate]
  );

  /* =========================
     States
  ========================= */

  if (loading) {
    return (
      <div className="collab-state loading">
        Finding relevant partners…
      </div>
    );
  }

  if (error) {
    return (
      <div className="collab-state error">
        {error}
      </div>
    );
  }

  if (filteredPartners.length === 0) {
    return (
      <div className="collab-state empty">
        No matching partners found.
        <span>Try adjusting your search.</span>
      </div>
    );
  }

  /* =========================
     Render
  ========================= */

  return (
    <div className="collab-tab-inner">
      {/* Header */}
      <div className="collab-header">
        <h2>Find Business Partners</h2>
        <p>
          Discover relevant businesses and start a collaboration.
        </p>
      </div>

      {/* Grid */}
      <div className="partners-grid-wrapper">
        <div ref={gridRef} className="partners-grid">
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
    </div>
  );
}
