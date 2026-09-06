import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Copy,
  KeyRound,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
} from "lucide-react";

import {
  createSitePortalMember,
  deleteSitePortalMember,
  listSitePortalMembers,
  reinviteSitePortalMember,
  updateSitePortalMember,
  type SitePortalPageInfo,
} from "../../../api/sitePortalApi";
import type { SitePortalMember } from "../../../utils/sitePortalSession";
import { btnPrimary, btnSecondary } from "./siteManagementUi";
import { getIntlLocale } from "../../../i18n/localeUtils";

type Props = {
  siteId: string;
  publicUrl?: string;
};

function statusLabel(status: string, t: (key: string) => string) {
  switch (status) {
    case "active":
      return t("sitePortal.statusActive");
    case "invited":
      return t("sitePortal.statusInvited");
    case "paused":
      return t("sitePortal.statusPaused");
    case "disabled":
      return t("sitePortal.statusDisabled");
    default:
      return status;
  }
}

export default function SitePortalMembersPanel({ siteId, publicUrl = "" }: Props) {
  const { t, i18n } = useTranslation();
  const intlLocale = getIntlLocale(i18n.language);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [members, setMembers] = useState<SitePortalMember[]>([]);
  const [portalPages, setPortalPages] = useState<SitePortalPageInfo[]>([]);
  const [loginPath, setLoginPath] = useState("/portal/login");
  const [notice, setNotice] = useState("");

  const [activeTab, setActiveTab] = useState<"registered" | "added" | "all">(
    "registered",
  );
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [sendInvite, setSendInvite] = useState(true);
  const [assignedPageIds, setAssignedPageIds] = useState<string[]>([]);

  /*
    Visitors who signed up through the published site are tagged "self".
    Legacy rows without the tag are treated as self-registered too.
  */
  const isSelfRegistered = (member: SitePortalMember) =>
    (member.signupSource || "self") === "self";

  const registeredMembers = useMemo(
    () => members.filter(isSelfRegistered),
    [members],
  );

  const addedMembers = useMemo(
    () => members.filter((member) => !isSelfRegistered(member)),
    [members],
  );

  const visibleMembers =
    activeTab === "registered"
      ? registeredMembers
      : activeTab === "added"
        ? addedMembers
        : members;

  const loginUrl = useMemo(() => {
    const base = String(publicUrl || "").replace(/\/$/, "");
    return base ? `${base}${loginPath}` : loginPath;
  }, [publicUrl, loginPath]);

  const load = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    setError("");

    try {
      const data = await listSitePortalMembers(siteId);
      setMembers(data.members || []);
      setPortalPages(data.portalPages || []);
      setLoginPath(data.loginPath || "/portal/login");
      setAssignedPageIds((prev) =>
        prev.length ? prev : (data.portalPages || []).map((p) => p.id)
      );
    } catch (err: any) {
      setError(err?.message || t("sitePortal.loadError"));
    } finally {
      setLoading(false);
    }
  }, [siteId, t]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setFullName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setSendInvite(true);
    setAssignedPageIds(portalPages.map((p) => p.id));
    setShowForm(false);
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const result = await createSitePortalMember(siteId, {
        fullName,
        email,
        phone,
        password: sendInvite ? undefined : password,
        sendInvite,
        assignedPageIds,
        returnPassword: !sendInvite,
      });

      if (result.inviteUrl) {
        setNotice(t("sitePortal.inviteCreated", { url: result.inviteUrl }));
        try {
          await navigator.clipboard.writeText(result.inviteUrl);
        } catch {
          /* ignore */
        }
      } else {
        setNotice(t("sitePortal.memberAdded"));
      }

      resetForm();
      await load();
    } catch (err: any) {
      setError(err?.message || t("sitePortal.createFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleStatus(member: SitePortalMember, status: string) {
    try {
      await updateSitePortalMember(siteId, member.id, { status });
      await load();
    } catch (err: any) {
      alert(err?.message || t("sitePortal.updateFailed"));
    }
  }

  async function handleDelete(member: SitePortalMember) {
    if (!window.confirm(t("sitePortal.deleteConfirm", { name: member.fullName }))) return;

    try {
      await deleteSitePortalMember(siteId, member.id);
      await load();
    } catch (err: any) {
      alert(err?.message || t("sitePortal.deleteFailed"));
    }
  }

  async function handleReinvite(member: SitePortalMember) {
    try {
      const result = await reinviteSitePortalMember(siteId, member.id);
      setNotice(t("sitePortal.newInvite", { url: result.inviteUrl }));
      try {
        await navigator.clipboard.writeText(result.inviteUrl);
      } catch {
        /* ignore */
      }
      await load();
    } catch (err: any) {
      alert(err?.message || t("sitePortal.inviteFailed"));
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border border-violet-100/70 bg-white p-8 text-center text-sm font-semibold text-slate-500">
        {t("sitePortal.loading")}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-sky-100 bg-gradient-to-l from-sky-50/80 to-white p-5">
        <h3 className="text-base font-bold text-slate-900">
          {t("sitePortal.howTitle")}
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pr-5 text-sm font-medium leading-6 text-slate-600">
          <li>
            {t("sitePortal.howStep1")}
          </li>
          <li>
            {t("sitePortal.howStep2Before")} <strong>{t("sitePortal.howStep2Strong")}</strong> {t("sitePortal.howStep2After")}
          </li>
          <li>{t("sitePortal.howStep3")}</li>
          <li>{t("sitePortal.howStep4")}</li>
          <li>
            {t("sitePortal.howStep5Before")} <code className="rounded bg-white px-1.5 py-0.5 text-xs ring-1 ring-slate-200">{loginUrl}</code>{" "}
            {t("sitePortal.howStep5After")}
          </li>
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <code className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {loginUrl}
          </code>
          <button
            type="button"
            className={btnSecondary + " h-8 px-3 text-xs"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(loginUrl);
                setNotice(t("sitePortal.copiedLogin"));
              } catch {
                setNotice(loginUrl);
              }
            }}
          >
            <Copy size={14} />
            {t("sitePortal.copyLink")}
          </button>
        </div>
        <p className="mt-3 text-xs font-semibold text-slate-400">
          {t("sitePortal.siteOnlyHint")}
        </p>
      </div>

      {notice ? (
        <div className="rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}

      {portalPages.length === 0 ? (
        <div className="rounded-md border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          {t("sitePortal.noPages")}
        </div>
      ) : (
        <div className="rounded-md border border-violet-100/70 bg-white p-4">
          <p className="text-xs font-bold text-slate-500">
            {t("sitePortal.privatePages")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {portalPages.map((page) => (
              <span
                key={page.id}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"
              >
                {page.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["registered", t("sitePortal.tabRegistered", { count: registeredMembers.length })],
              ["added", t("sitePortal.tabAdded", { count: addedMembers.length })],
              ["all", t("sitePortal.tabAll", { count: members.length })],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className={[
                "rounded-full px-4 py-2 text-xs font-bold transition",
                activeTab === value
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => setShowForm((v) => !v)}
        >
          <UserPlus size={16} />
          {t("sitePortal.addMember")}
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="space-y-3 rounded-md border border-violet-100/70 bg-white p-5"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-600">{t("sitePortal.fullName")}</span>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-600">{t("sitePortal.email")}</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold text-slate-600">{t("sitePortal.phone")}</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border border-slate-200 px-3 py-2"
              />
            </label>
            {!sendInvite ? (
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-slate-600">{t("sitePortal.password")}</span>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                />
              </label>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={sendInvite}
              onChange={(e) => setSendInvite(e.target.checked)}
            />
            {t("sitePortal.sendInvite")}
          </label>

          {portalPages.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-bold text-slate-500">
                {t("sitePortal.allowedPages")}
              </p>
              <div className="flex flex-wrap gap-3">
                {portalPages.map((page) => {
                  const checked = assignedPageIds.includes(page.id);
                  return (
                    <label
                      key={page.id}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setAssignedPageIds((prev) =>
                            e.target.checked
                              ? [...prev, page.id]
                              : prev.filter((id) => id !== page.id)
                          );
                        }}
                      />
                      {page.title}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              <Plus size={16} />
              {saving ? t("sitePortal.saving") : t("sitePortal.save")}
            </button>
            <button
              type="button"
              className={btnSecondary}
              onClick={resetForm}
            >
              {t("sitePortal.cancel")}
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-md border border-violet-100/70 bg-white">
        {visibleMembers.length === 0 ? (
          <div className="p-8 text-center text-sm font-semibold text-slate-500">
            {activeTab === "registered"
              ? t("sitePortal.emptyRegistered")
              : activeTab === "added"
                ? t("sitePortal.emptyAdded")
                : t("sitePortal.emptyAll")}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {member.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{member.email}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {statusLabel(member.status, t)}
                    {" · "}
                    {isSelfRegistered(member) ? t("sitePortal.registeredOnSite") : t("sitePortal.addedByYou")}
                    {member.assignedPageIds?.length
                      ? ` · ${t("sitePortal.pagesCount", { count: member.assignedPageIds.length })}`
                      : ` · ${t("sitePortal.allPortalPages")}`}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                    {member.createdAt
                      ? t("sitePortal.joined", { date: new Date(member.createdAt).toLocaleDateString(intlLocale) })
                      : ""}
                    {member.lastLoginAt
                      ? ` · ${t("sitePortal.lastLogin", { date: new Date(member.lastLoginAt).toLocaleDateString(intlLocale) })}`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.status === "active" ? (
                    <button
                      type="button"
                      className={btnSecondary + " h-8 px-3 text-xs"}
                      onClick={() => handleStatus(member, "paused")}
                    >
                      {t("sitePortal.pause")}
                    </button>
                  ) : member.status === "paused" || member.status === "disabled" ? (
                    <button
                      type="button"
                      className={btnSecondary + " h-8 px-3 text-xs"}
                      onClick={() => handleStatus(member, "active")}
                    >
                      {t("sitePortal.activate")}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className={btnSecondary + " h-8 px-3 text-xs"}
                    onClick={() => handleReinvite(member)}
                    title={t("sitePortal.newInviteTitle")}
                  >
                    {member.status === "invited" ? (
                      <RefreshCw size={14} />
                    ) : (
                      <KeyRound size={14} />
                    )}
                    {t("sitePortal.invite")}
                  </button>

                  <button
                    type="button"
                    className={btnSecondary + " h-8 px-3 text-xs text-rose-600"}
                    onClick={() => handleDelete(member)}
                  >
                    <Trash2 size={14} />
                    {t("sitePortal.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
