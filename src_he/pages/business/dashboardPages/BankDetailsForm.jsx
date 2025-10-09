import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "@api"; // Assume the API is set up with axios
import "./BankDetailsForm.css";

const BankDetailsForm = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    bankName: "",
    branchNumber: "",
    accountNumber: "",
    fullName: "",
    idNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        bankName: user.bankName || "",
        branchNumber: user.branch || "",
        accountNumber: user.account || "",
        fullName: user.fullName || "",
        idNumber: user.idNumber || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("Business details are not available. Please log in again.");
      }

      const formData = new FormData();
      formData.append("bankName", form.bankName);
      formData.append("branch", form.branchNumber);
      formData.append("account", form.accountNumber);
      formData.append("fullName", form.fullName);
      formData.append("idNumber", form.idNumber);

      const response = await API.put("/business/my/bank-details", formData);

      if (response.status !== 200) {
        throw new Error("Error saving details");
      }

      alert("Details saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bank-details-form">
      <h2>🏦 Bank Account Details for Payment Receipt</h2>
      <p className="disclaimer">
        It is your responsibility to update the details in case of changes.
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="bankName">Bank Name:</label>
        <input
          type="text"
          id="bankName"
          name="bankName"
          placeholder="Bank Hapoalim"
          required
          value={form.bankName}
          onChange={handleChange}
        />

        <label htmlFor="branchNumber">Branch Number:</label>
        <input
          type="text"
          id="branchNumber"
          name="branchNumber"
          placeholder="123"
          required
          value={form.branchNumber}
          onChange={handleChange}
        />

        <label htmlFor="accountNumber">Account Number:</label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          placeholder="12345678"
          required
          value={form.accountNumber}
          onChange={handleChange}
        />

        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="The name as it appears in the bank"
          required
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="idNumber">ID Number / Company Number:</label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          placeholder="302114567"
          required
          value={form.idNumber}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "💾 Save Details"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default BankDetailsForm;
