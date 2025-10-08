```javascript
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "@api"; // axios is predefined
import "./MarketerBankDetailsForm.css";

export default function MarketerBankDetailsForm() {
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
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        bankName: user.bankName || "",
        branchNumber: user.branch || "",
        accountNumber: user.account || "",
        fullName: user.fullName || "",
        idNumber: user.idNumber || "",
      });
    }
  }, [user]);

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
      if (!user?.affiliateId) throw new Error("Unidentified marketer");

      const payload = {
        affiliateId: user.affiliateId,
        bankName: form.bankName,
        branchNumber: form.branchNumber,
        accountNumber: form.accountNumber,
        fullName: form.fullName,
        idNumber: form.idNumber,
      };

      const res = await API.put("/affiliate-marketer/marketers/bank-details", payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setSuccessMsg("Bank details updated successfully!");
      } else {
        throw new Error("Error updating details");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

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
          placeholder='ID Number'
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
```