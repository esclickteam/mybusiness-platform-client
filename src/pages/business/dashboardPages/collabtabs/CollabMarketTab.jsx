import React, { useState, useEffect } from "react";
import API from "../../../../api";
import "./CollabMarketTab.css";
import { useNavigate } from "react-router-dom";

function CreateCollabForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [needs, setNeeds] = useState("");
  const [offers, setOffers] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim() || !contactName.trim() || !phone.trim()) {
      setError("אנא מלא את כותרת ההצעה, תיאור, איש קשר וטלפון");
      return;
    }

    setLoading(true);
    try {
      const message = {
        title:       title.trim(),
        description: description.trim(),
        needs:       needs.split(",").map(s => s.trim()).filter(Boolean),
        offers:      offers.split(",").map(s => s.trim()).filter(Boolean),
        budget:      budget ? Number(budget) : undefined,
        expiryDate:  expiryDate ? new Date(expiryDate).toISOString() : undefined,
      };

      await API.post("/business/my/proposals", {
        toBusinessId: null,
        message,
        contactName:  contactName.trim(),
        phone:        phone.trim(),
      });

      setTitle("");
      setDescription("");
      setNeeds("");
      setOffers("");
      setContactName("");
      setPhone("");
      setBudget("");
      setExpiryDate("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("❌ שגיאה בפרסום ההצעה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="proposal-form">
      <h3>פרסם שיתוף פעולה חדש</h3>

      <label>
        כותרת*:
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="כותרת ההצעה"
        />
      </label>

      <label>
        תיאור*:
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          placeholder="תיאור מפורט"
        />
      </label>

      <label>
        מה העסק צריך (מופרד בפסיקים):
        <input
          type="text"
          value={needs}
          onChange={e => setNeeds(e.target.value)}
          placeholder="למשל: שותף שיווק, משקיע"
        />
      </label>

      <label>
        מה העסק נותן (מופרד בפסיקים):
        <input
          type="text"
          value={offers}
          onChange={e => setOffers(e.target.value)}
          placeholder="למשל: שותפות ברווח, פרסום משותף"
        />
      </label>

      <label>
        איש קשר*:
        <input
          type="text"
          value={contactName}
          onChange={e => setContactName(e.target.value)}
          required
          placeholder="שם איש קשר"
        />
      </label>

      <label>
        טלפון*:
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          placeholder="טלפון ליצירת קשר"
        />
      </label>

      <label>
        תקציב (₪):
        <input
          type="number"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          min="0"
          placeholder="תקציב משוער"
        />
      </label>

      <label>
        תוקף עד:
        <input
          type="date"
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
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

  useEffect(() => {
    async function fetchCollabs() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/business/proposals/market");
        console.log("Response from /api/business/proposals/market:", res.data);

        if (Array.isArray(res.data.proposals)) {
          const collabs = res.data.proposals.map(item => {
            const msg = item.message || {};
            return {
              _id:         item._id,
              businessId:  item.fromBusinessId,
              title:       msg.title,
              description: msg.description,
              needs:       msg.needs || [],
              offers:      msg.offers || [],
              budget:      msg.budget,
              expiryDate:  item.expiryDate || msg.expiryDate,
              contactName: item.contactName,
              phone:       item.phone,
              imageUrl:    item.imageUrl || "/default-profile.png",
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
    }
    fetchCollabs();
  }, [refreshFlag]);

  return (
    <div className="collab-market-container">
      <CreateCollabForm onSuccess={() => setRefreshFlag(f => !f)} />

      <h3 className="collab-title">📣 מרקט שיתופים</h3>

      {loading && <p>טוען שיתופי פעולה...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && collabMarket.length === 0 && <div>אין שיתופי פעולה להצגה</div>}

      <div className="partners-grid">
        {collabMarket.map(item => (
          <div key={item._id} className="collab-card">
            <div className="collab-card-inner">
              <div className="collab-card-content">
                <h3 className="business-name">{item.contactName}</h3>
                <p className="business-category">{item.title}</p>
                <p className="business-desc">{item.description}</p>
                <p><strong>מה העסק צריך:</strong> {item.needs.join(", ")}</p>
                <p><strong>מה העסק נותן:</strong> {item.offers.join(", ")}</p>
                <p><strong>תקציב:</strong> ₪{item.budget}</p>
                <p><strong>תוקף עד:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
                <div className="collab-card-buttons">
                  <button
                    className="message-box-button secondary"
                    onClick={() => navigate(`/business-profile/${item.businessId}`)}
                  >
                    צפייה בפרופיל
                  </button>
                </div>
              </div>

              <div className="business-logo-left">
                <img src={item.imageUrl} alt={`${item.contactName} לוגו`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
