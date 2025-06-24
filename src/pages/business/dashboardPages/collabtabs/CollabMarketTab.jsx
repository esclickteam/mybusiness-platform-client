import React, { useState, useEffect } from "react";
import API from "../../../../api"; // הנתיב שלך ל-API
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

      // נקה שדות
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
      setError("\u274C \u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05e4\u05e8\u05e1\u05d5\u05dd \u05d4\u05d4\u05e6\u05e2\u05d4");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="market-modal">
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
        מה העסק צריך ( מופרד בפסיקים ):
        <input
          type="text"
          value={needs}
          onChange={e => setNeeds(e.target.value)}
          placeholder="למשל: שותף שיווק, משקיע"
        />
      </label>

      <label>
        מה העסק נותן ( מופרד בפסיקים ):
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
        if (Array.isArray(res.data.proposals)) {
          const collabs = res.data.proposals.map(item => {
            const msg = item.message || {};
            return {
              _id: item._id,
              businessId: item.fromBusinessId,
              title: msg.title,
              description: msg.description,
              needs: msg.needs || [],
              offers: msg.offers || [],
              budget: msg.budget,
              expiryDate: msg.expiryDate,
              contactName: item.contactName,
              phone: item.phone,
            };
          });
          setCollabMarket(collabs);
        } else {
          setError("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05e2\u05d9\u05e0\u05ea \u05e9\u05d9\u05ea\u05d5\u05e4\u05d9 \u05e4\u05e2\u05d5\u05dc\u05d4");
        }
      } catch (err) {
        console.error(err);
        setError("\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d8\u05e2\u05d9\u05e0\u05ea \u05e9\u05d9\u05ea\u05d5\u05e4\u05d9 \u05e4\u05e2\u05d5\u05dc\u05d4");
      } finally {
        setLoading(false);
      }
    }
    fetchCollabs();
  }, [refreshFlag]);

  return (
    <div className="market-wrapper">
      <CreateCollabForm onSuccess={() => setRefreshFlag(f => !f)} />

      <h3 className="collab-title">📣 מרקט שיתופים
      </h3>

      {loading && <p>טוען שיתופים...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && collabMarket.length === 0 && <p>אין שיתופים להצגה</p>}

      {collabMarket.map(item => (
        <div key={item._id} className="market-card">
          <h4>{item.title}</h4>
          <p><strong>תיאור:</strong> {item.description}</p>
          <p><strong>מה העסק צריך:</strong> {item.needs.join(", ")}</p>
          <p><strong>מה העסק נותן:</strong> {item.offers.join(", ")}</p>
          <p><strong>תקציב:</strong> ₪{item.budget || "לא צוין"}</p>
          <p><strong>תוקף עד:</strong> {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "לא צוין"}</p>
          <p><strong>איש קשר:</strong> {item.contactName}</p>
          <p><strong>טלפון:</strong> {item.phone}</p>
          <button
            className="contact-button"
            onClick={() => navigate(`/business-profile/${item.businessId}`)}
          >
            👁️ צפייה בפרופיל
          </button>
        </div>
      ))}
    </div>
  );
}