import React, { useState, useEffect, useCallback } from "react";
import API from "../../../../api";
import "./CollabMarketTab.css";
import { useNavigate } from "react-router-dom";

/* =========================
   Create Collaboration Form
========================= */

function CreateCollabForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    countryCode: "+1",
    title: "",
    description: "",
    needs: "",
    offers: "",
    contactName: "",
    phone: "",
    budget: "",
    expiryDate: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      const { title, description, contactName, phone } = formData;
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
          validUntil: formData.expiryDate
            ? new Date(formData.expiryDate).toISOString()
            : null,
          contactName: formData.contactName.trim(),
          phone: `${formData.countryCode}${formData.phone.trim()}`,
        });

        setFormData({
          countryCode: "+1",
          title: "",
          description: "",
          needs: "",
          offers: "",
          contactName: "",
          phone: "",
          budget: "",
          expiryDate: "",
        });

        onSuccess?.();
      } catch {
        setError("❌ Error publishing proposal");
      } finally {
        setLoading(false);
      }
    },
    [formData, onSuccess]
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
      </div>

      <div className="form-group">
        <label>Offers</label>
        <input
          name="offers"
          placeholder="Equity, Partnership"
          value={formData.offers}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Contact Name *</label>
        <input
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group phone-group">
        <select
          name="countryCode"
          value={formData.countryCode}
          onChange={handleChange}
        >
          <option value="+1">🇺🇸 +1</option>
          <option value="+972">🇮🇱 +972</option>
        </select>
        <input
          name="phone"
          placeholder="Phone number"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <input
          type="number"
          name="budget"
          placeholder="Budget ($)"
          value={formData.budget}
          onChange={handleChange}
        />
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
      </div>

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
          + Publish
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
            <h3 className="collab-title">{item.title}</h3>

            <div className="tags-row">
              {item.needs?.map((n) => (
                <span key={n} className="tag need">{n}</span>
              ))}
              {item.offers?.map((o) => (
                <span key={o} className="tag offer">{o}</span>
              ))}
            </div>

            <p className="description">{item.description}</p>

            <div className="meta">
              <span>{item.budget ? `$${item.budget}` : "No budget"}</span>
              <span>
                {item.validUntil
                  ? new Date(item.validUntil).toLocaleDateString()
                  : "No expiry"}
              </span>
            </div>

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
