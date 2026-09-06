import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { resolvePostLoginDestination } from "../utils/safeInternalRedirect";
import { useLocaleDir } from "../hooks/useLocaleDir";
import "../styles/ChangePassword.css";

const ChangePassword = () => {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t("changePassword.fillAll"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("changePassword.mismatch"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("changePassword.tooShort"));
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess(t("changePassword.success"));
      const updatedUser = (await refreshUser(true)) || user;
      const dest = resolvePostLoginDestination({
        role: updatedUser?.role,
        businessId: updatedUser?.businessId,
        hasAccess: updatedUser?.hasAccess !== false,
        enabledModules: updatedUser?.enabledModules ?? null,
      });
      setTimeout(() => navigate(dest, { replace: true }), 600);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "WRONG_CURRENT_PASSWORD") {
        setError(t("changePassword.wrongCurrent"));
      } else if (code === "PASSWORD_TOO_SHORT") {
        setError(t("changePassword.tooShort"));
      } else if (code === "FILL_ALL") {
        setError(t("changePassword.fillAll"));
      } else {
        setError(t("changePassword.serverError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard
        title={t("changePassword.title")}
        subtitle={t("changePassword.subtitle")}
      >
        <form onSubmit={handleSubmit} className="space-y-4" dir={dir}>
          <input
            type="password"
            name="currentPassword"
            placeholder={t("changePassword.currentPlaceholder")}
            value={form.currentPassword}
            onChange={handleChange}
            required
            dir="ltr"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-start font-bold"
          />
          <input
            type="password"
            name="newPassword"
            placeholder={t("changePassword.newPlaceholder")}
            value={form.newPassword}
            onChange={handleChange}
            required
            dir="ltr"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-start font-bold"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder={t("changePassword.confirmPlaceholder")}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            dir="ltr"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-start font-bold"
          />
          <button
            className="w-full rounded-2xl bg-slate-900 py-3 font-black text-white disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? t("changePassword.saving") : t("changePassword.submit")}
          </button>
          {error ? <p className="font-bold text-rose-700">{error}</p> : null}
          {success ? (
            <p className="font-bold text-emerald-700">{success}</p>
          ) : null}
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default ChangePassword;
