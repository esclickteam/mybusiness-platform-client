import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "@api";
import "./MarketerBankDetailsForm.css";

export default function MarketerBankDetailsForm({ onSubmit }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    bankName: "",
    branchNumber: "",
    accountNumber: "",
    fullName: "",
    idNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const loadBankDetails = async () => {
    try {
      if (!user?.affiliateId) return;

      setLoadingInitial(true);
      const { data } = await API.get(
        `/affiliate/bank-details/${encodeURIComponent(user.affiliateId)}`,
        { withCredentials: true }
      );

      setForm({
        bankName: data.bankName || "",
        branchNumber: data.branchNumber || "",
        accountNumber: data.accountNumber || "",
        fullName: data.fullName || "",
        idNumber: data.idNumber || "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load bank details");
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadBankDetails();
  }, [user?.affiliateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (!user?.affiliateId) {
        throw new Error("Affiliate marketer not identified");
      }

      const payload = {
        affiliateId: user.affiliateId,
        bankName: form.bankName,
        branchNumber: form.branchNumber,
        accountNumber: form.accountNumber,
        fullName: form.fullName,
        idNumber: form.idNumber,
      };

      await onSubmit(payload);
      setSuccessMsg("Bank details updated successfully!");

      await loadBankDetails();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return <p>Loading bank details...</p>;
  }

  return (
    <section className="marketer-bank-details-form">
      <h2>Update Bank Account Details - Marketer</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="bankName"
          placeholder="Bank Name"
          value={form.bankName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="branchNumber"
          placeholder="Branch Number"
          value={form.branchNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={form.accountNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={form.idNumber}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Details"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {successMsg && <p className="success">{successMsg}</p>}
    </section>
  );
}