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
    console.log("✅ Job submitted:", formData);
    // API submission goes here
  };

  return (
    <div className="quick-jobs-board">
      <h1>📋 Post a Quick Job</h1>

      <form className="quick-job-form" onSubmit={handleSubmit}>
        <h2>Post a job for today / tomorrow</h2>

        <input
          type="text"
          name="title"
          placeholder="Job title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Short description of the job"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <select name="date" value={formData.date} onChange={handleChange}>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>

        <input
          type="text"
          name="time"
          placeholder="Preferred hours (e.g., 9:00–13:00)"
          value={formData.time}
          onChange={handleChange}
        />

        <div className="price-range">
          <input
            type="number"
            name="priceMin"
            placeholder="Minimum price"
            value={formData.priceMin}
            onChange={handleChange}
          />
          <span> - </span>
          <input
            type="number"
            name="priceMax"
            placeholder="Maximum price"
            value={formData.priceMax}
            onChange={handleChange}
          />
        </div>

        <input
          type="tel"
          name="phone"
          placeholder="Contact phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Job address"
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

        <button type="submit">📤 Post Job</button>
      </form>
    </div>
  );
}

export default QuickJobForm;
