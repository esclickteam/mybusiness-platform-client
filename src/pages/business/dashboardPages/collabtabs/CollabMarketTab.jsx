import React, { useState, useEffect, useCallback } from "react";
import API from "../../../../api";
import "./CollabMarketTab.css";
import { useNavigate } from "react-router-dom";

/* =========================
   Create Collaboration Form
========================= */

function CreateCollabForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    countryCode: "+1", // 🇺🇸 default
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      const { title, description, contactName, phone } = formData;

      if (
        !title.trim() ||
        !description.trim() ||
        !contactName.trim() ||
        !phone.trim()
      ) {
        setError(
          "Please fill in the proposal title, description, contact name, and phone number"
        );
        return;
      }

      setLoading(true);

      try {
        await API.post("/business/my/proposals", {
  toBusinessId: null,

  // required by server
  title: formData.title.trim(),
  description: formData.description.trim(),

  // 🔥 זה החסר
  validUntil:
    formData.expiryDate &&
    !isNaN(new Date(formData.expiryDate).getTime())
      ? new Date(formData.expiryDate).toISOString()
      : null,

  // extended data (כמו קודם)
  message: {
    needs: formData.needs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),

    offers: formData.offers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),

    budget: formData.budget ? Number(formData.budget) : undefined,
  },

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

        if (onSuccess) onSuccess();
      } catch (err) {
        console.error(err);
        setError("❌ Error publishing proposal");
      } finally {
        setLoading(false);
      }
    },
    [formData, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="proposal-form">
      <h3>Post a New Collaboration</h3>

      <label>
        Title*:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Proposal title"
        />
      </label>

      <label>
        Description*:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Detailed description"
        />
      </label>

      <label>
        What the business needs (comma separated):
        <input
          type="text"
          name="needs"
          value={formData.needs}
          onChange={handleChange}
          placeholder="e.g., Marketing partner, investor"
        />
      </label>

      <label>
        What the business offers (comma separated):
        <input
          type="text"
          name="offers"
          value={formData.offers}
          onChange={handleChange}
          placeholder="e.g., Profit sharing, joint advertising"
        />
      </label>

      <label>
        Contact Name*:
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
          placeholder="Contact person name"
        />
      </label>

      <label>
        Phone*:
        <div className="phone-row">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="country-select"
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+972">🇮🇱 +972</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+49">🇩🇪 +49</option>
          </select>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Phone number"
            className="phone-input"
          />
        </div>
      </label>

      <label>
        Budget ($):
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          min="0"
          placeholder="Estimated budget"
        />
      </label>

      <label>
        Expires On:
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={loading} className="save-button">
        {loading ? "Sending..." : "Publish Collaboration"}
      </button>
    </form>
  );
}

/* =========================
   Market View
========================= */

export default function CollabMarketTab({ isDevUser }) {
  const [collabMarket, setCollabMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);


  const navigate = useNavigate();

  const fetchCollabs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await API.get("/business/proposals/market");

      if (Array.isArray(res.data.proposals)) {
        const collabs = res.data.proposals.map((item) => {
          const msg = item.message || {};
          return {
            _id: item._id,
            businessId: item.fromBusinessId,
            title: msg.title,
            description: msg.description,
            needs: msg.needs || [],
            offers: msg.offers || [],
            budget: msg.budget,
            expiryDate: item.expiryDate || msg.expiryDate,
            contactName: item.contactName,
            phone: item.phone,
          };
        });

        setCollabMarket(collabs);
      } else {
        setError("Error loading collaborations");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading collaborations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollabs();
  }, [fetchCollabs, refreshFlag]);

  const handleViewProfile = useCallback(
    (businessId) => {
      if (businessId) {
        navigate(`/business-profile/${businessId}`);
      }
    },
    [navigate]
  );

  return (
  <div className="collab-market-container">
    {/* כותרת */}
    <h3 className="collab-title">📣 Collaboration Market</h3>

    {/* כפתור פתיחת מודאל */}
    <button
      className="add-collab-button"
      onClick={() => setShowCreateModal(true)}
    >
      ➕ Publish Collaboration
    </button>

    {/* מודאל יצירת שיתוף – לפני המרקט */}
    {showCreateModal && (
      <div className="collab-modal-overlay">
        <div className="collab-modal">
          <CreateCollabForm
            onSuccess={() => {
              setShowCreateModal(false);
              setRefreshFlag((f) => !f);
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

    {/* המרקט */}
    {loading && <p>Loading collaborations...</p>}
    {error && <p className="error-text">{error}</p>}

    {!loading && collabMarket.length === 0 && (
      <div>No collaborations to display</div>
    )}

    <div className="partners-grid">
      {collabMarket.map((item) => (
        <div key={item._id} className="collab-card">
          <div className="collab-card-inner">
            <div className="collab-card-content">
              <h3 className="business-name">{item.contactName}</h3>
              <p className="business-category">{item.title}</p>
              <p className="business-desc">{item.description}</p>

              <p>
                <strong>What the business needs:</strong>{" "}
                {item.needs.join(", ")}
              </p>

              <p>
                <strong>What the business offers:</strong>{" "}
                {item.offers.join(", ")}
              </p>

              <p>
                <strong>Budget:</strong> ${item.budget}
              </p>

              <p>
                <strong>Valid Until:</strong>{" "}
                {item.expiryDate
                  ? new Date(item.expiryDate).toLocaleDateString()
                  : "-"}
              </p>

              <div className="collab-card-buttons">
                <button
                  className="message-box-button secondary"
                  onClick={() => handleViewProfile(item.businessId)}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


}
