import React, { useState, useEffect } from "react";
import API from "../../../../api"; // הנתיב שלך ל-API
import "./CollabMarketTab.css";

function CreateCollabForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [needs, setNeeds] = useState("");
  const [offers, setOffers] = useState("");
  const [budget, setBudget] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError("אנא מלא את הכותרת והתיאור");
      return;
    }

    setLoading(true);
    try {
      const message = {
        title: title.trim(),
        description: description.trim(),
        needs: needs.split(",").map(s => s.trim()).filter(Boolean),
        offers: offers.split(",").map(s => s.trim()).filter(Boolean),
        budget: budget ? Number(budget) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      };
      await API.post("/business/my/proposals", {
        toBusinessId: null,
        message,
      });
      setTitle("");
      setDescription("");
      setNeeds("");
      setOffers("");
      setBudget("");
      setExpiryDate("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError("שגיאה בפרסום ההצעה");
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

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
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

  useEffect(() => {
    async function fetchCollabs() {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/business/proposals/market");
        console.log("Response from /business/proposals/market:", res.data);

        if (res.data.proposals && Array.isArray(res.data.proposals)) {
          const collabs = res.data.proposals.map(item => {
            const msg = item.message || {};
            return {
              _id: item._id,
              title: msg.title || "שיתוף פעולה",
              category: msg.category || item.category || "כללי",
              description: msg.description || "",
              contactName: item.businessName || "שותף עסקי",
              phone: msg.phone || "",
              image: item.logo || "",
            };
          });
          setCollabMarket(collabs);
        } else {
          setError("שגיאה בטעינת שיתופי פעולה");
        }
      } catch (err) {
        setError("שגיאה בטעינת שיתופי פעולה");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollabs();
  }, [refreshFlag]);

  return (
    <div className="collab-market-container">
      <CreateCollabForm onSuccess={() => setRefreshFlag(f => !f)} />

      <div className="flex justify-between items-center mb-4">
        <h3 className="collab-title">📣 מרקט שיתופים</h3>
      </div>

      {loading && <p>טוען שיתופי פעולה...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && collabMarket.length === 0 && (
        <div>אין שיתופי פעולה להצגה</div>
      )}

      {collabMarket.map((item) => (
        <div key={item._id} className="collab-card">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="collab-market-image"
            />
          )}
          <h4>{item.title}</h4>
          <p><strong>קטגוריה:</strong> {item.category}</p>
          <p>{item.description}</p>
          <p><strong>איש קשר:</strong> {item.contactName}</p>
          <p><strong>טלפון:</strong> {item.phone}</p>
          <button
            className="contact-button"
            onClick={() => alert(`פותח צ'אט עם ${item.contactName}`)}
          >
            📩 פנה בצ'אט
          </button>
        </div>
      ))}
    </div>
  );
}
