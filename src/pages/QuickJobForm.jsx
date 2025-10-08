import React, { useState } from "react";
import "./QuickJobForm.css";

function QuickJobForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "today",
    time: "",
    priceMin: "",
    priceMax: "",
    phone: "",
    address: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("✅ עבודה נשלחה:", formData);
    // שליחה ל-API תבוא כאן
  };

  return (
    <div className="quick-jobs-board">
      <h1>📋 פרסום עבודה מהירה</h1>

      <form className="quick-job-form" onSubmit={handleSubmit}>
        <h2>פרסם עבודה להיום / מחר</h2>

        <input
          type="text"
          name="title"
          placeholder="כותרת העבודה"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="תיאור קצר של העבודה"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <select name="date" value={formData.date} onChange={handleChange}>
          <option value="today">היום</option>
          <option value="tomorrow">מחר</option>
        </select>

        <input
          type="text"
          name="time"
          placeholder="שעות מועדפות (לדוג׳: 9:00-13:00)"
          value={formData.time}
          onChange={handleChange}
        />

        <div className="price-range">
          <input
            type="number"
            name="priceMin"
            placeholder="מחיר מינימלי"
            value={formData.priceMin}
            onChange={handleChange}
          />
          <span> - </span>
          <input
            type="number"
            name="priceMax"
            placeholder="מחיר מקסימלי"
            value={formData.priceMax}
            onChange={handleChange}
          />
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="טלפון ליצירת קשר"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="כתובת העבודה"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">📤 פרסם עבודה</button>
      </form>
    </div>
  );
}

export default QuickJobForm;