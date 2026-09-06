import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Plus, LogIn, Users, Building2, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";

import API from "@api";
import { useAuth } from "../../context/AuthContext";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { getDefaultDashboardPath } from "../../utils/moduleAccess";
import { getTextDirection } from "../../i18n/localeUtils";

const emptyForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  password: "",
};

export default function MarketerDashboardPage() {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
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
      setError(err.response?.data?.error || t("marketer.errorLoad"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
      setCreateMessage(data.message || t("marketer.created"));
      setCreatedCredentials(data.client || null);
      setForm(emptyForm);
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.error || t("marketer.createError"));
    } finally {
      setCreating(false);
    }
  };

  const handleEnterClient = async (client) => {
    if (
      !window.confirm(
        t("marketer.enterConfirm", { name: client.businessName || t("marketer.clientFallback") })
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
      setError(err.response?.data?.error || t("marketer.enterError"));
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
    return <BizuplyLoader fullScreen label={t("marketer.loading")} />;
  }

  return (
    <div
      dir={pageDir}
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
                {t("marketer.title")}
              </h1>
              <p className="text-xs font-bold text-slate-500">
                {marketer?.name || user?.name || t("marketer.role")} · {t("marketer.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              {t("marketer.signOut")}
            </button>
          </div>
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
            <p className="mb-2 font-black">{t("marketer.credentialsTitle")}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span>
                {t("marketer.emailLabel")} <strong>{createdCredentials.email}</strong>
              </span>
              <button
                type="button"
                onClick={() => copyText(createdCredentials.email)}
                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs font-bold"
              >
                <Copy className="h-3.5 w-3.5" /> {t("marketer.copy")}
              </button>
              <span>
                {t("marketer.tempPassword")}{" "}
                <strong>{createdCredentials.temporaryPassword}</strong>
              </span>
              <button
                type="button"
                onClick={() =>
                  copyText(createdCredentials.temporaryPassword || "")
                }
                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs font-bold"
              >
                <Copy className="h-3.5 w-3.5" /> {t("marketer.copy")}
              </button>
            </div>
            <p className="mt-2 text-xs font-bold text-sky-800/80">
              {t("marketer.modulesHint")}
            </p>
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              <span className="text-xs font-bold">{t("marketer.totalClients")}</span>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {clients.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-bold">{t("marketer.clientModules")}</span>
            </div>
            <p className="text-base font-black text-slate-900">
              {t("marketer.crmCampaigns")}
            </p>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">{t("marketer.myClients")}</h2>
            <p className="text-sm font-bold text-slate-500">
              {t("marketer.createHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            {showForm ? t("marketer.closeForm") : t("marketer.newClient")}
          </button>
        </section>

        {showForm ? (
          <form
            onSubmit={handleCreate}
            className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2"
          >
            <label className="block text-sm font-bold text-slate-700">
              {t("marketer.businessName")}
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder={t("marketer.businessExample")}
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              {t("marketer.contactName")}
              <input
                name="contactName"
                value={form.contactName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder={t("marketer.fullName")}
              />
            </label>
            <label className="block text-sm font-bold text-slate-700">
              {t("marketer.email")}
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
              {t("marketer.phone")}
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
              {t("marketer.passwordOptional")}
              <input
                type="text"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-slate-400"
                placeholder={t("marketer.minPassword")}
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {creating ? t("marketer.creating") : t("marketer.createCta")}
              </button>
            </div>
          </form>
        ) : null}

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center">
            <p className="text-base font-black text-slate-800">
              {t("marketer.empty")}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {t("marketer.emptyHint")}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 text-xs font-black text-slate-500">
                <tr>
                  <th className="px-4 py-3">{t("marketer.business")}</th>
                  <th className="hidden px-4 py-3 md:table-cell">{t("marketer.contact")}</th>
                  <th className="hidden px-4 py-3 sm:table-cell">{t("common.email")}</th>
                  <th className="hidden px-4 py-3 lg:table-cell">{t("common.phone")}</th>
                  <th className="px-4 py-3">{t("marketer.access")}</th>
                  <th className="px-4 py-3">{t("marketer.actions")}</th>
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
                        {t("marketer.crmCampaigns")}
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
                          ? t("marketer.entering")
                          : t("marketer.enterClient")}
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
