import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import API from "@api"; // Assume API is configured with axios
import "./BankDetailsForm.css";

const BankDetailsForm = () => {
  const { t } = useTranslation();
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
        throw new Error(t("dashboard.bankDetails.unavailable"));
      }

      const formData = new FormData();
      formData.append("bankName", form.bankName);
      formData.append("branch", form.branchNumber);
      formData.append("account", form.accountNumber);
      formData.append("fullName", form.fullName);
      formData.append("idNumber", form.idNumber);

      const response = await API.put("/business/my/bank-details", formData);

      if (response.status !== 200) {
        throw new Error(t("dashboard.bankDetails.saveError"));
      }

      alert(t("dashboard.bankDetails.saved"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bank-details-form">
      <h2>🏦 {t("dashboard.bankDetails.title")}</h2>
      <p className="disclaimer">{t("dashboard.bankDetails.disclaimer")}</p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="bankName">{t("dashboard.bankDetails.bankName")}</label>
        <input
          type="text"
          id="bankName"
          name="bankName"
          placeholder={t("dashboard.bankDetails.placeholderBank")}
          required
          value={form.bankName}
          onChange={handleChange}
        />

        <label htmlFor="branchNumber">{t("dashboard.bankDetails.branchNumber")}</label>
        <input
          type="text"
          id="branchNumber"
          name="branchNumber"
          placeholder="123"
          required
          value={form.branchNumber}
          onChange={handleChange}
        />

        <label htmlFor="accountNumber">{t("dashboard.bankDetails.accountNumber")}</label>
        <input
          type="text"
          id="accountNumber"
          name="accountNumber"
          placeholder="12345678"
          required
          value={form.accountNumber}
          onChange={handleChange}
        />

        <label htmlFor="fullName">{t("dashboard.bankDetails.fullName")}</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder={t("dashboard.bankDetails.placeholderName")}
          required
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="idNumber">{t("dashboard.bankDetails.idNumber")}</label>
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
          {loading
            ? t("dashboard.bankDetails.saving")
            : `💾 ${t("dashboard.bankDetails.save")}`}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
};

export default BankDetailsForm;
