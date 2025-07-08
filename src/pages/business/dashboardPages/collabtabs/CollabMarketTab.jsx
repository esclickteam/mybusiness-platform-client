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
        setError("אנא מלא את כותרת ההצעה, תיאור, איש קשר וטלפון");
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
        setError("❌ שגיאה בפרסום ההצעה");
      } finally {
        setLoading(false);
      }
    },
    [formData, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="proposal-form">
      <h3>פרסם שיתוף פעולה חדש</h3>

      <label>
        כותרת*:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="כותרת ההצעה"
        />
      </label>

      <label>
        תיאור*:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="תיאור מפורט"
        />
      </label>

      <label>
        מה העסק צריך (מופרד בפסיקים):
        <input
          type="text"
          name="needs"
          value={formData.needs}
          onChange={handleChange}
          placeholder="למשל: שותף שיווק, משקיע"
        />
      </label>

      <label>
        מה העסק נותן (מופרד בפסיקים):
        <input
          type="text"
          name="offers"
          value={formData.offers}
          onChange={handleChange}
          placeholder="למשל: שותפות ברווח, פרסום משותף"
        />
      </label>

      <label>
        איש קשר*:
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
          placeholder="שם איש קשר"
        />
      </label>

      <label>
        טלפון*:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="טלפון ליצירת קשר"
        />
      </label>

      <label>
        תקציב (₪):
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          min="0"
          placeholder="תקציב משוער"
        />
      </label>

      <label>
        תוקף עד:
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" disabled={loading} className="save-button">
        {loading ? "שולח..." : "פרסם שיתוף פעולה"}
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
        setError("שגיאה בטעינת שיתופי פעולה");
      }
    } catch (err) {
      console.error(err);
      setError("שגיאה בטעינת שיתופי פעולה");
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

      <h3 className="collab-title">📣 מרקט שיתופים</h3>

      {loading && <p>טוען שיתופי פעולה...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && collabMarket.length === 0 && <div>אין שיתופי פעולה להצגה</div>}

      <div className="partners-grid">
        {collabMarket.map((item) => (
          <div key={item._id} className="collab-card">
            <div className="collab-card-inner">
              <div className="collab-card-content">
                <h3 className="business-name">{item.contactName}</h3>
                <p className="business-category">{item.title}</p>
                <p className="business-desc">{item.description}</p>
                <p>
                  <strong>מה העסק צריך:</strong> {item.needs.join(", ")}
                </p>
                <p>
                  <strong>מה העסק נותן:</strong> {item.offers.join(", ")}
                </p>
                <p>
                  <strong>תקציב:</strong> ₪{item.budget}
                </p>
                <p>
                  <strong>תוקף עד:</strong>{" "}
                  {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}
                </p>
                <div className="collab-card-buttons">
                  <button
                    className="message-box-button secondary"
                    onClick={() => handleViewProfile(item.businessId)}
                  >
                    צפייה בפרופיל
                  </button>
                </div>
              </div>
              {/* הלוגו הוסר לפי בקשה */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
