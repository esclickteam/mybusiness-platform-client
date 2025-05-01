import React, { useState } from "react";

export default function BusinessSupport() {
  const [formData, setFormData] = useState({
    name: '',
    issueDescription: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן תוכל להוסיף את הקוד לשליחה לשרת או פעולה אחרת עם הנתונים
    alert('הפנייה נשלחה בהצלחה');
  };

  return (
    <div className="support-page">
      <h1>תמיכה לעסקים</h1>

      <section>
        <h2>שאלות נפוצות</h2>
        <ul>
          <li>איך מעדכנים את פרופיל העסק?</li>
          <li>איך אני מוסיף עובד לעסק שלי?</li>
          <li>מה לעשות אם אני נתקל בבעיה טכנית?</li>
        </ul>
      </section>

      <section>
        <h2>צור קשר עם צוות התמיכה</h2>
        <p>נשמח לעזור לך. אנא פנה אלינו דרך טופס יצירת קשר או בטלפון.</p>
        <form onSubmit={handleSubmit}>
          <label>שמך:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label>תיאור הבעיה:</label>
          <textarea
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleInputChange}
            required
          />

          <button type="submit">שלח פנייה</button>
        </form>
      </section>

      <section>
        <h2>מדריכים וסרטונים</h2>
        <ul>
          <li><a href="/guides/update-profile">איך לעדכן את פרופיל העסק</a></li>
          <li><a href="/guides/manage-schedule">איך לנהל את לוח הזמנים של העסק</a></li>
        </ul>
      </section>
    </div>
  );
}
