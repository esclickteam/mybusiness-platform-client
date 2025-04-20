import React, { useState } from "react";
import "./CollabMarketTab.css";

export default function CollabMarketTab({ isDevUser }) {
  const [collabMarket, setCollabMarket] = useState([
    {
      _id: "market-1",
      title: "קמפיין קיץ משותף",
      category: "שיווק",
      description: "שיתוף פעולה לקידום עסקים מקומיים ברשתות.",
      contactName: "ליאת בן דוד",
      phone: "052-1111111",
      image: "https://via.placeholder.com/600x200"
    },
    {
      _id: "market-2",
      title: "ערב נטוורקינג לנשים עצמאיות",
      category: "הפקת אירועים",
      description: "אירוע נטוורקינג כולל הרצאות ושיתופים.",
      contactName: "נועה רז",
      phone: "054-2222222",
      image: "https://via.placeholder.com/600x200"
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    contactName: "",
    phone: "",
    image: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    const newItem = {
      ...formData,
      _id: Date.now().toString()
    };
    setCollabMarket((prev) => [newItem, ...prev]);
    setFormData({
      title: "",
      category: "",
      description: "",
      contactName: "",
      phone: "",
      image: ""
    });
    setModalOpen(false);
  };

  return (
    <div className="collab-market-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="collab-title">📣 מרקט שיתופים</h3>
        <button className="add-collab-button" onClick={() => setModalOpen(true)}>
          + הוספת שיתוף פעולה
        </button>
      </div>

      {collabMarket.map((item) => (
        <div key={item._id} className="collab-card">
          {item.image && (
            <img src={item.image} alt={item.title} className="collab-market-image" />
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

      {modalOpen && (
        <div className="collab-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="collab-modal" onClick={(e) => e.stopPropagation()}>
            <h3>✨ הוספת שיתוף חדש</h3>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="כותרת" />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="קטגוריה" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="תיאור"></textarea>
            <input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="איש קשר" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="טלפון" />
            <input name="image" value={formData.image} onChange={handleChange} placeholder="לינק לתמונה (לא חובה)" />
            <div className="modal-buttons">
              <button onClick={handleSubmit} className="save-button">שמור</button>
              <button onClick={() => setModalOpen(false)} className="cancel-button">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
