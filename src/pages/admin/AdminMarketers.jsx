import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";
import BizuplyLoader from "../../components/ui/BizuplyLoader";

const emptyForm = {
  name: "",
  email: "",
  marketerId: "",
  password: "",
};

export default function AdminMarketers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [marketers, setMarketers] = useState([]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const loadMarketers = async () => {
    setListLoading(true);
    try {
      const { data } = await API.get("/admin/marketers");
      setMarketers(data.marketers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadMarketers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { data } = await API.post("/admin/marketers", form);
      if (data.success) {
        setMessage(
          `משווק נוצר בהצלחה: ${data.marketer.marketerId}. התחברות דרך /login`
        );
        setForm(emptyForm);
        await loadMarketers();
      } else {
        setError("שגיאה ביצירת משווק");
      }
    } catch (err) {
      setError(err.response?.data?.error || "שגיאת שרת");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f6fb] text-slate-800">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <h1 className="mb-2 text-2xl font-black text-slate-900">
          משווקי קמפיינים
        </h1>
        <p className="mb-6 text-sm font-bold text-slate-500">
          משווק יכול לפתוח לקוחות עם CRM וניהול קמפיינים בלבד, ולהיכנס לחשבונות
          שלהם לביצוע פעולות.
        </p>

        {message ? (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {message}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2"
        >
          <h2 className="md:col-span-2 text-lg font-black">יצירת משווק חדש</h2>

          <label className="block text-sm font-bold">
            שם המשווק *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
              placeholder="לדוגמה: יעל בן ארי"
            />
          </label>

          <label className="block text-sm font-bold">
            אימייל *
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
              placeholder="marketer@example.com"
            />
          </label>

          <label className="block text-sm font-bold">
            מזהה משווק (marketerId) *
            <input
              name="marketerId"
              value={form.marketerId}
              onChange={handleChange}
              required
              pattern="[A-Za-z0-9_-]{3,20}"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
              placeholder="yael123"
            />
          </label>

          <label className="block text-sm font-bold">
            סיסמה *
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-300"
              placeholder="לפחות 6 תווים"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#7C4DFF] px-5 py-2.5 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0] disabled:opacity-60"
            >
              {loading ? "יוצר..." : "צור משווק"}
            </button>
          </div>
        </form>

        <section>
          <h2 className="mb-3 text-lg font-black">משווקים קיימים</h2>
          {listLoading ? (
            <BizuplyLoader label="טוען משווקים..." />
          ) : marketers.length === 0 ? (
            <p className="text-sm font-bold text-slate-500">אין משווקים עדיין</p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-right text-sm">
                <thead className="bg-slate-50 text-xs font-black text-slate-500">
                  <tr>
                    <th className="px-4 py-3">שם</th>
                    <th className="px-4 py-3">אימייל</th>
                    <th className="px-4 py-3">מזהה</th>
                    <th className="px-4 py-3">לקוחות</th>
                  </tr>
                </thead>
                <tbody>
                  {marketers.map((m) => (
                    <tr key={m._id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-black">{m.name}</td>
                      <td className="px-4 py-3 font-bold text-slate-600">
                        {m.email}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-600">
                        {m.marketerId}
                      </td>
                      <td className="px-4 py-3 font-black">{m.clientCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
