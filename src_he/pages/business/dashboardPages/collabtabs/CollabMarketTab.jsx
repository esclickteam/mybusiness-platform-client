import React, { useState, useEffect, useCallback } from "react";
import API from "../../../../api";
import "./CollabMarketTab.css";
import { useNavigate } from "react-router-dom";

function CreateCollabForm({ onSuccess }) {
  const [formData, setFormData] = useState({
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
      if (!title.trim() || !description.trim() || !contactName.trim() || !phone.trim()) {
        setError("Please fill in the proposal title, description, contact person, and phone number");
        return;
      }

      setLoading(true);
      try {
        const message = {
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
          expiryDate:
            formData.expiryDate && !isNaN(new Date(formData.expiryDate).getTime())
              ? new Date(formData.expiryDate).toISOString()
              : undefined,
        };

        await API.post("/business/my/proposals", {
          toBusinessId: null,
          message,
          contactName: formData.contactName.trim(),
          phone: formData.phone.trim(),
        });

        setFormData({
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
        setError("❌ Error publishing the proposal");
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
          placeholder="For example: marketing partner, investor"
        />
      </label>

      <label>
        What the business offers (comma separated):
        <input
          type="text"
          name="offers"
          value={formData.offers}
          onChange={handleChange}
          placeholder="For example: profit sharing, joint advertising"
        />
      </label>

      <label>
        Contact Person*:
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
          placeholder="Contact person's name"
        />
      </label>

      <label>
        Phone*:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Contact phone number"
        />
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
        Valid until:
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={loading} className="save-button">
        {loading ? "Sending..." : "Post Collaboration"}
      </button>
    </form>
  );
}

export default function CollabMarketTab({ isDevUser }) {
  const [collabMarket, setCollabMarket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const navigate = useNavigate();

  const fetchCollabs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/business/proposals/market");
      console.log("Response from /api/business/proposals/market:", res.data);

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
      <CreateCollabForm onSuccess={() => setRefreshFlag((f) => !f)} />

      <h3 className="collab-title">📣 Collaboration Market</h3>

      {loading && <p>Loading collaborations...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && collabMarket.length === 0 && <div>No collaborations to display</div>}

      <div className="partners-grid">
        {collabMarket.map((item) => (
          <div key={item._id} className="collab-card">
            <div className="collab-card-inner">
              <div className="collab-card-content">
                <h3 className="business-name">{item.contactName}</h3>
                <p className="business-category">{item.title}</p>
                <p className="business-desc">{item.description}</p>
                <p>
                  <strong>What the business needs:</strong> {item.needs.join(", ")}
                </p>
                <p>
                  <strong>What the business offers:</strong> {item.offers.join(", ")}
                </p>
                <p>
                  <strong>Budget:</strong> ${item.budget}
                </p>
                <p>
                  <strong>Valid until:</strong>{" "}
                  {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}
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
              {/* The logo was removed at the request */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
