import React, { useState, useEffect } from "react";
import API from "@api";
import "./CreateAgreementForm.css";

export default function CreateAgreementForm({ 
  onCreated, 
  fromBusinessId, 
  fromBusinessName, 
  partnerBusiness, 
  currentUserBusinessId,
  proposalId, 
}) {
  const [formData, setFormData] = useState({
    fromBusinessName: fromBusinessName || "",
    partnerBusinessName: partnerBusiness?.businessName || "",
    title: "",
    description: "",
    giving: "",
    receiving: "",
    type: "",
    payment: "",
    startDate: "",
    endDate: "",
    cancelAnytime: false,
    confidentiality: false,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fromBusinessName: fromBusinessName || "",
      partnerBusinessName: partnerBusiness?.businessName || "",
    }));
  }, [fromBusinessName, partnerBusiness]);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      if (name === "cancelAnytime" && checked) {
        setFormData((prev) => ({ ...prev, startDate: "", endDate: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.partnerBusinessName.trim()) {
      setError("Please enter the partner business name.");
      return;
    }
    if (!formData.title.trim()) {
      setError("Please enter an agreement title.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please fill in the agreement description.");
      return;
    }
    if (!formData.giving.trim()) {
      setError("Please fill in what you will provide under this agreement.");
      return;
    }
    if (!formData.receiving.trim()) {
      setError("Please fill in what you will receive under this agreement.");
      return;
    }
    if (!formData.type) {
      setError("Please select a collaboration type.");
      return;
    }
    if (!formData.cancelAnytime && (!formData.startDate || !formData.endDate)) {
      setError("Please provide start and end dates or select 'Cancelable anytime'.");
      return;
    }
    if (!fromBusinessId) {
      setError("Invalid sender business ID.");
      return;
    }
    if (!partnerBusiness?._id) {
      setError("Invalid partner business ID.");
      return;
    }

    setSending(true);

    try {
      const payload = {
        ...formData,
        invitedBusinessId: partnerBusiness._id,
        proposalId,
      };

      console.log("Sending payload to create agreement:", payload);

      const res = await API.post("/partnershipAgreements", payload);

      console.log("Response from create agreement API:", res.data);

      alert("The agreement was created and sent for the other party’s signature!");
      if (onCreated) onCreated(res.data);
    } catch (err) {
      console.error("Error creating agreement:", err);
      setError("Error creating agreement: " + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-agreement-form" dir="ltr">
      <h2 className="form-title">Collaboration Agreement</h2>

      <label>
        Sender Business Name:
        <input type="text" name="fromBusinessName" value={formData.fromBusinessName} disabled className="form-input" />
      </label>

      <label>
        Partner Business Name:
        <input type="text" name="partnerBusinessName" value={formData.partnerBusinessName} disabled className="form-input" />
      </label>

      <label>
        Agreement Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Agreement title"
          className="form-input"
        />
      </label>

      <label>
        Agreement Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Agreement description"
          className="form-textarea"
        />
      </label>

      <label>
        What You Will Provide:
        <textarea
          name="giving"
          value={formData.giving}
          onChange={handleChange}
          required
          rows={2}
          placeholder="Describe what you will provide"
          className="form-textarea"
        />
      </label>

      <label>
        What You Will Receive:
        <textarea
          name="receiving"
          value={formData.receiving}
          onChange={handleChange}
          required
          rows={2}
          placeholder="Describe what you will receive"
          className="form-textarea"
        />
      </label>

      <label>
        Collaboration Type:
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="form-input"
        >
          <option value="">Select type</option>
          <option value="Unilateral">Unilateral</option>
          <option value="Bilateral">Bilateral</option>
          <option value="With Commissions">With Commissions</option>
        </select>
      </label>

      <label>
        Commissions / Payment (if any):
        <input
          type="text"
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          placeholder="Commissions / Payment"
          className="form-input"
        />
      </label>

      <label>Agreement Duration:</label>
      <div className="date-inputs">
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          disabled={formData.cancelAnytime}
          className="form-input"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          disabled={formData.cancelAnytime}
          className="form-input"
        />
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="cancelAnytime"
          checked={formData.cancelAnytime}
          onChange={handleChange}
        />
        The agreement can be canceled at any time
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="confidentiality"
          checked={formData.confidentiality}
          onChange={handleChange}
        />
        Confidentiality Clause
      </label>

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={sending} className="submit-btn">
        {sending ? "Sending..." : "Create Agreement"}
      </button>
    </form>
  );
}
