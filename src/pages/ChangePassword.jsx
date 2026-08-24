import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";
import { resolvePostLoginDestination } from "../utils/safeInternalRedirect";
import "../styles/ChangePassword.css";

const ChangePassword = () => {
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
      setError("יש למלא את כל השדות");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("הסיסמה החדשה ואישור הסיסמה אינם תואמים");
      return;
    }

    if (newPassword.length < 6) {
      setError("הסיסמה החדשה חייבת להכיל 6 תווים לפחות");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess("הסיסמה עודכנה בהצלחה");
      const updatedUser = (await refreshUser(true)) || user;
      const dest = resolvePostLoginDestination({
        role: updatedUser?.role,
        businessId: updatedUser?.businessId,
        hasAccess: updatedUser?.hasAccess !== false,
        enabledModules: updatedUser?.enabledModules ?? null,
      });
      setTimeout(() => navigate(dest, { replace: true }), 600);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || "שגיאת שרת. נסו שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard title="הגדרת סיסמה חדשה" subtitle="הסיסמה החד-פעמית מיועדת לכניסה ראשונה בלבד. בחרו סיסמה אישית להמשך.">
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <input
            type="password"
            name="currentPassword"
            placeholder="סיסמה חד-פעמית / נוכחית"
            value={form.currentPassword}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
          />
          <input
            type="password"
            name="newPassword"
            placeholder="סיסמה חדשה"
            value={form.newPassword}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="אישור סיסמה חדשה"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-bold"
          />
          <button
            className="w-full rounded-2xl bg-slate-900 py-3 font-black text-white disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "שומר..." : "שמירת סיסמה"}
          </button>
          {error ? <p className="font-bold text-rose-700">{error}</p> : null}
          {success ? <p className="font-bold text-emerald-700">{success}</p> : null}
        </form>
      </AuthCard>
    </AuthShell>
  );
};

export default ChangePassword;
