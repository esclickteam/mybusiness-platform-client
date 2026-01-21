import React, { useState, useEffect, useCallback } from "react";
import API from "../../../../api";
import "./CollabMarketTab.css";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


/* =========================
   Create Collaboration Form
========================= */

function CreateCollabForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    needs: "",
    offers: "",
    contactName: "",
    budget: "",
    expiryDate: "",
  });

  const [useExpiry, setUseExpiry] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");


  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      const { title, description, contactName } = formData;
if (!title || !description || !contactName || !phone) {

        setError("Please fill all required fields");
        return;
      }

      setLoading(true);
      try {
        await API.post("/collaboration-market", {
          title: formData.title.trim(),
          description: formData.description.trim(),
          needs: formData.needs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          offers: formData.offers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          budget: formData.budget ? Number(formData.budget) : undefined,
          validUntil:
            useExpiry && formData.expiryDate
              ? new Date(formData.expiryDate).toISOString()
              : null,
          contactName: formData.contactName.trim(),
          phone,

        });

        setFormData({
  title: "",
  description: "",
  needs: "",
  offers: "",
  contactName: "",
  budget: "",
  expiryDate: "",
});
        setPhone("");  
        setUseExpiry(false);

        onSuccess?.();
      } catch {
        setError("❌ Error publishing proposal");
      } finally {
        setLoading(false);
      }
    },
    [formData, useExpiry, phone, onSuccess]
  );

  return (
    <form className="proposal-form" onSubmit={handleSubmit}>
      <h3>Publish Collaboration</h3>

      <div className="form-group">
        <label>Title *</label>
        <input name="title" value={formData.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Needs</label>
        <input
          name="needs"
          placeholder="Marketing, Investor"
          value={formData.needs}
          onChange={handleChange}
        />
        <small>Comma separated (optional)</small>
      </div>

      <div className="form-group">
        <label>Offers</label>
        <input
          name="offers"
          placeholder="Equity, Partnership"
          value={formData.offers}
          onChange={handleChange}
        />
        <small>Comma separated (optional)</small>
      </div>

      <div className="form-group">
        <label>Contact Name *</label>
        <input
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
  <label>Phone *</label>

  <PhoneInput
    country="us"
    value={phone}
    onChange={(v) => setPhone(v)}
    inputProps={{
      required: true,
      name: "phone",
    }}
  />
</div>


      <div className="form-row">
        <input
          type="number"
          name="budget"
          placeholder="Budget ($) – optional"
          value={formData.budget}
          onChange={handleChange}
        />
      </div>

      {/* Expiry toggle */}
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={useExpiry}
            onChange={(e) => setUseExpiry(e.target.checked)}
          />
          Set expiration date (optional)
        </label>
      </div>

      {useExpiry && (
        <div className="form-group">
          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
          />
        </div>
      )}

      {error && <div className="error-text">{error}</div>}

      <button className="save-button" disabled={loading}>
        {loading ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}

/* =========================
   Market View
========================= */

export default function CollabMarketTab() {
  const [collabMarket, setCollabMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const fetchCollabs = useCallback(async () => {
    setLoading(true);
    const res = await API.get("/collaboration-market");
    setCollabMarket(res.data.collabs || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCollabs();
  }, [fetchCollabs]);

  return (
    <div className="collab-market-container">
      <div className="collab-header">
        <h2>Collaboration Market</h2>
        <button
          className="add-collab-button"
          onClick={() => setShowCreateModal(true)}
        >
          + Publish Collaboration
        </button>
      </div>

      {showCreateModal && (
        <div className="collab-modal-overlay">
          <div className="collab-modal">
            <CreateCollabForm
              onSuccess={() => {
                setShowCreateModal(false);
                fetchCollabs();
              }}
            />
            <button
              className="cancel-button"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <p>Loading...</p>}

      <div className="partners-grid">
        {collabMarket.map((item) => (
          
          <div key={item._id} className="collab-card">
  {/* תוכן */}
  <div className="collab-card-content">
    <h3 className="collab-title">{item.title}</h3>

    <div className="tags-block">
      {item.needs?.length > 0 && (
        <>
          <div className="tag-label">Needs</div>
          <div className="tags-row">
            {item.needs.map((n) => (
              <span key={n} className="tag need">{n}</span>
            ))}
          </div>
        </>
      )}

      {item.offers?.length > 0 && (
        <>
          <div className="tag-label">Offers</div>
          <div className="tags-row">
            {item.offers.map((o) => (
              <span key={o} className="tag offer">{o}</span>
            ))}
          </div>
        </>
      )}
    </div>

    <div className="description-block">
      <div className="description-label">Description</div>
      <p className="description">{item.description}</p>
    </div>

    <div className="meta">
      <span>
        <strong>Budget:</strong>{" "}
        {item.budget ? `$${item.budget}` : "Not specified"}
      </span>

      <span>
        <strong>Expires:</strong>{" "}
        {item.validUntil
          ? new Date(item.validUntil).toLocaleDateString()
          : "No expiration"}
      </span>
    </div>
  </div>

  {/* כפתור */}
  <button
    className="message-box-button"
    onClick={() =>
      navigate(`/business-profile/${item.fromBusinessId}`)
    }
  >
    View Profile
  </button>
</div>


        ))}
      </div>
    </div>
  );
}
