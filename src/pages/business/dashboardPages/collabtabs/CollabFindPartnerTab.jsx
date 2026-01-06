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
          <p className="business-desc">{business.description}</p>

          <div className="collab-card-buttons">
            {isMine ? (
              <span className="disabled-action">
                You can’t message yourself
              </span>
            ) : (
              <button
                className="message-box-button secondary"
                onClick={() => onOpenProfile(business)}
              >
                View Profile
              </button>
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
  const [gridStabilized, setGridStabilized] = useState(false);


  /* 🔥 key to force grid remount */
  const [gridKey, setGridKey] = useState(0);

  /* 🔍 ref for measuring grid */
  const gridRef = useRef(null);

  /* =========================
     DEBUG: mount / unmount
  ========================= */

  useEffect(() => {
    console.log("🟢 FindPartner MOUNT", {
      pathname: location.pathname,
      key: location.key,
    });

    return () => {
      console.log("🔴 FindPartner UNMOUNT", {
        pathname: location.pathname,
        key: location.key,
      });
    };
  }, [location.pathname]);

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
      setError("Error loading data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  /* =========================
     DEBUG: measure grid
  ========================= */

  useEffect(() => {
    if (!gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const styles = getComputedStyle(gridRef.current);

    console.log("📐 GRID MEASURE", {
      width: rect.width,
      columns: styles.gridTemplateColumns,
      gap: styles.gap,
    });
  }, [gridKey]);

  /* =========================
     DEBUG: ResizeObserver
  ========================= */

  useEffect(() => {
  if (!gridRef.current) return;

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = Math.round(entry.contentRect.width);

      console.log("📏 GRID RESIZED (final)", width);

      // 🔥 run ONLY ONCE when width is ready
      if (width > 600 && !gridStabilized) {
        setGridStabilized(true);
        setGridKey((k) => k + 1);
      }
    }
  });

  observer.observe(gridRef.current);

  return () => observer.disconnect();
}, [gridStabilized]);


  /* =========================
     Filtering Logic
  ========================= */

  const filteredPartners = useMemo(() => {
    if (!partners.length) return [];

    if (searchMode === "category" && searchCategory) {
      const catLower = searchCategory.toLowerCase();

      return partners.filter(
        (b) =>
          b.category.toLowerCase().includes(catLower) ||
          (b.complementaryCategories || []).some((cat) =>
            cat.toLowerCase().includes(catLower)
          )
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

  /* =========================
     Navigation
  ========================= */

  const handleOpenProfile = useCallback(
    (business) => {
      if (business._id) {
        navigate(`/business-profile/${business._id}`);
      }
    },
    [navigate]
  );

  /* =========================
     States
  ========================= */

  if (loading) return <p>Loading partners...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (filteredPartners.length === 0) return <p>No partners found.</p>;

  /* =========================
     Render
  ========================= */

  return (
    <div className="collab-tab-inner">
      <div className="search-container">
        {/* future search fields */}
      </div>

      <div className="partners-grid-wrapper">
        <div
          key={gridKey}
          ref={gridRef}
          className="partners-grid"
        >
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
