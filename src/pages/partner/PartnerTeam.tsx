import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchPartnerTeam,
  invitePartnerMember,
  partnerApiError,
  revokePartnerMember,
  updatePartnerMember,
} from "../../lib/partnerApi";
import type { PartnerPermission } from "../../types/partner";
import PartnerPageHeader from "../../components/partner/PartnerPageHeader";
import {
  PartnerCard,
  PartnerInput,
  PartnerPrimaryButton,
} from "../../components/partner/partnerUi";

const PERMISSIONS: PartnerPermission[] = [
  "view_clients",
  "create_clients",
  "edit_clients",
  "manage_subscriptions",
  "manage_pricing",
  "manage_permissions",
  "view_financial_reports",
  "manage_storefront",
  "manage_partner_settings",
];

const PERM_I18N_KEY: Record<PartnerPermission, string> = {
  view_clients: "view_clients",
  create_clients: "create_clients",
  edit_clients: "edit_clients",
  manage_subscriptions: "manage_subscriptions",
  manage_pricing: "manage_pricing",
  manage_permissions: "manage_permissions",
  view_financial_reports: "financial_reports",
  manage_storefront: "manage_store",
  manage_partner_settings: "partner_settings",
};

export default function PartnerTeam() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    permissions: ["view_clients"] as PartnerPermission[],
  });

  async function refresh() {
    const next = await fetchPartnerTeam();
    setData(next);
  }

  useEffect(() => {
    refresh().catch((err) => setError(partnerApiError(err, t("partner.errors.team"))));
  }, [t]);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await invitePartnerMember(form);
      setForm({ name: "", email: "", password: "", permissions: ["view_clients"] });
      await refresh();
    } catch (err: any) {
      setError(err.response?.data?.error || t("partner.errors.invite"));
    }
  }

  return (
    <div className="space-y-5">
      <PartnerPageHeader
        eyebrow={t("partner.team.title")}
        title={t("partner.team.partnerTeam")}
        subtitle={t("partner.team.seatLimit", { used: data?.used || 0, limit: data?.limit ?? 0 })}
      />
      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={invite} className="grid gap-3">
        <PartnerCard className="grid gap-3 p-5">
        <PartnerInput
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder={t("partner.team.name")}
        />
        <PartnerInput
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder={t("partner.email")}
        />
        <PartnerInput
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder={t("common.password")}
        />
        <div className="grid gap-1 text-sm">
          {PERMISSIONS.map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={form.permissions.includes(key)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...form.permissions, key]
                    : form.permissions.filter((item) => item !== key);
                  setForm({ ...form, permissions: next });
                }}
              />{" "}
              {t(`partner.team.perm.${PERM_I18N_KEY[key]}`)}
            </label>
          ))}
        </div>
        <PartnerPrimaryButton type="submit">{t("partner.team.invite")}</PartnerPrimaryButton>
        </PartnerCard>
      </form>

      <div className="space-y-3">
        {(data?.members || []).map((member: any) => (
          <article key={member._id} className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <p className="font-black">
              {member.user?.name || t("partner.team.user")} · {member.role} · {member.status}
            </p>
            <p className="text-sm text-slate-500">{member.user?.email}</p>
            {member.role === "owner" ? (
              <p className="mt-2 text-xs font-bold text-slate-500">{t("partner.team.ownerAlways")}</p>
            ) : (
              <div className="mt-2 grid gap-1 text-sm">
                {PERMISSIONS.map((key) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={(member.permissions || []).includes(key)}
                      onChange={async (e) => {
                        const current = new Set(member.permissions || []);
                        if (e.target.checked) current.add(key);
                        else current.delete(key);
                        await updatePartnerMember(member._id, [...current] as PartnerPermission[]);
                        await refresh();
                      }}
                    />{" "}
                    {t(`partner.team.perm.${PERM_I18N_KEY[key]}`)}
                  </label>
                ))}
                <button
                  type="button"
                  onClick={async () => {
                    await revokePartnerMember(member._id);
                    await refresh();
                  }}
                  className="mt-2 w-fit rounded-xl border border-rose-200 px-3 py-1 text-sm font-bold text-rose-700"
                >
                  {t("partner.team.revoke")}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
