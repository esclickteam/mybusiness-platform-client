import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Plus, LogIn, Users, Building2, Copy } from "lucide-react";

import API from "@api";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";

const emptyForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  password: "",
};

export default function MarketerDashboardPage() {
  const { user, loginWithToken, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);
  const [marketer, setMarketer] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const [enteringId, setEnteringId] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/marketer/dashboard");
      setClients(data.clients || []);
      setMarketer(data.marketer || null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "שגיאה בטעינת לוח המשווק");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role !== "marketer") {
      navigate("/", { replace: true });
      return;
    }
    refresh();
  }, [user, navigate, refresh]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateMessage("");
    setCreatedCredentials(null);
    setError("");

    try {
      const { data } = await API.post("/marketer/create-client", form);
      setCreateMessage(data.message || "הלקוח נוצר בהצלחה");
      setCreatedCredentials(data.client || null);
      setForm(emptyForm);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || "שגיאה ביצירת לקוח");
    } finally {
      setCreating(false);
    }
  };

  const handleEnterClient = async (client) => {
    if (
      !window.confirm(
        `להיכנס לחשבון של ${client.businessName || "הלקוח"}?\nתוכלו לנהל קמפיינים ו-CRM בשמו.`
      )
    ) {
      return;
    }

    setEnteringId(client._id);
    setError("");

    try {
      const { data } = await API.post("/marketer/impersonate-client", {
        businessId: client._id,
      });

      loginWithToken(data.user, data.token, { skipRedirect: true });

      const businessId = data.user.businessId;
      const path = getDefaultDashboardPath(
        businessId,
        data.user.enabledModules
      );
      navigate(path, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "לא ניתן להיכנס ללקוח");
    } finally {
      setEnteringId(null);
    }
  };

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <BizuplyLoader fullScreen label="טוען לוח משווק..." />;
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,#e8f0ff,transparent_40%),radial-gradient(circle_at_bottom_left,#f0f7f4,transparent_45%),#f7f8fc] text-slate-800"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <header className="border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-black text-slate-900 md:text-xl">
                לוח משווק
              </h1>
              <p className="text-xs font-bold text-slate-500">
                {marketer?.name || user?.name || "משווק"} · ניהול קמפיינים ו-CRM
                ללקוחות
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            התנתקות
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        {createMessage ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {createMessage}
          </div>
        ) : null}

        {createdCredentials ? (
          <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-950">
            <p className="mb-2 font-black">פרטי התחברות ללקוח החדש:</p>
            <div className="flex flex-wrap items-center gap-3">
              <span>
                אימייל: <strong>{createdCredentials.email}</strong>
              </span>
              <button
                type="button"
                onClick={() => copyText(createdCredentials.email)}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs font-bold"
              >
                <Copy className="h-3.5 w-3.5" /> העתק
              </button>
              <span>
                סיסמה זמנית:{" "}
                <strong>{createdCredentials.temporaryPassword}</strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  copyText(createdCredentials.temporaryPassword || "")
                }
                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs font-bold"
              >
                <Copy className="h-3.5 w-3.5" /> העתק
              </button>
            </div>
            <p className="mt-2 text-xs font-bold text-sky-800/80">
              ללקוח פתוחים רק ניהול קמפיינים ו-CRM.
            </p>
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              <span className="text-xs font-bold">סה״כ לקוחות</span>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {clients.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-bold">מודולים ללקוחות</span>
            </div>
            <p className="text-base font-black text-slate-900">
              CRM · ניהול קמפיינים
            </p>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">הלקוחות שלי</h2>
            <p className="text-sm font-bold text-slate-500">
              פתיחת לקוח חדש עם CRM וקמפיינים, וכניסה לניהול מלא אצלו
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "סגור טופס" : "לקוח חדש"}
          </button>
        </section>

        {showForm ? (
          <form
            onSubmit={handleCreate}
            className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2"
          >
            <label className="block text-sm font-bold text-slate-700">
              שם העסק *
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder="לדוגמה: סטודיו נועה"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              איש קשר *
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder="שם מלא"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              אימייל *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder="client@example.com"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              טלפון *
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder="050-0000000"
              />
            </label>
            <label className="block text-sm font-bold text-slate-700 md:col-span-2">
              סיסמה (אופציונלי — אם ריק תיווצר סיסמה זמנית)
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder="לפחות 6 תווים"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {creating ? "יוצר..." : "צור לקוח עם CRM + קמפיינים"}
              </button>
            </div>
          </form>
        ) : null}

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
            <p className="text-base font-black text-slate-800">
              עדיין אין לקוחות
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              פתחו לקוח חדש כדי להתחיל לנהל עבורו קמפיינים ולידים ב-CRM
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr>
                  <th className="px-4 py-3">עסק</th>
                  <th className="hidden px-4 py-3 md:table-cell">איש קשר</th>
                  <th className="hidden px-4 py-3 sm:table-cell">אימייל</th>
                  <th className="hidden px-4 py-3 lg:table-cell">טלפון</th>
                  <th className="px-4 py-3">גישה</th>
                  <th className="px-4 py-3">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client._id}
                    className="border-t border-slate-100 align-middle"
                  >
                    <td className="px-4 py-3 font-black text-slate-900">
                      {client.businessName}
                    </td>
                    <td className="hidden px-4 py-3 font-bold text-slate-600 md:table-cell">
                      {client.owner?.name || "—"}
                    </td>
                    <td className="hidden px-4 py-3 font-bold text-slate-600 sm:table-cell">
                      {client.email || client.owner?.email || "—"}
                    </td>
                    <td className="hidden px-4 py-3 font-bold text-slate-600 lg:table-cell">
                      {client.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-700">
                        CRM · קמפיינים
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={enteringId === client._id}
                        onClick={() => handleEnterClient(client)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 text-xs font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        {enteringId === client._id
                          ? "נכנס..."
                          : "כניסה ללקוח"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
