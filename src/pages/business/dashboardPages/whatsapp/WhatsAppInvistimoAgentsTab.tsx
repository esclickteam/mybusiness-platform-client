import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  listInvistimoWhatsAppAgents,
  saveInvistimoWhatsAppAgent,
  updateInvistimoWhatsAppAgent,
  type InvistimoWhatsAppAgent,
} from "../../../../api/whatsappApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
import {
  btnPrimary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

const PERMISSIONS = [
  "inbox",
  "send",
  "templates",
  "automations",
  "contacts",
  "scheduled",
  "reports",
] as const;

export default function WhatsAppInvistimoAgentsTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<WhatsAppHubOutletContext>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agents, setAgents] = useState<InvistimoWhatsAppAgent[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("agent");
  const [permissions, setPermissions] = useState<string[]>(["inbox", "send"]);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      setAgents(await listInvistimoWhatsAppAgents(businessId));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.loadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const invite = async () => {
    if (!businessId) return;
    try {
      setSaving(true);
      await saveInvistimoWhatsAppAgent(businessId, {
        name,
        email,
        role,
        permissions,
      });
      setName("");
      setEmail("");
      toast.success(t("whatsapp.invistimoOps.agentSaved"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (agent: InvistimoWhatsAppAgent, status: string) => {
    if (!businessId || agent.locked) return;
    try {
      await updateInvistimoWhatsAppAgent(businessId, agent.id, { status });
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.saveError")
      );
    }
  };

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div className={`${cardBase} p-4`}>
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.invistimoOps.agentsTitle")}
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {t("whatsapp.invistimoOps.agentsSubtitle")}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className={inputBase}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("whatsapp.invistimoOps.agentName")}
          />
          <input
            className={inputBase}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("whatsapp.invistimoOps.agentEmail")}
          />
          <select
            className={inputBase}
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="manager">{t("whatsapp.invistimoOps.roleManager")}</option>
            <option value="agent">{t("whatsapp.invistimoOps.roleAgent")}</option>
            <option value="viewer">{t("whatsapp.invistimoOps.roleViewer")}</option>
          </select>
          <div className="flex flex-wrap gap-2">
            {PERMISSIONS.map((key) => (
              <label
                key={key}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600"
              >
                <input
                  type="checkbox"
                  checked={permissions.includes(key)}
                  onChange={() => togglePermission(key)}
                />
                {t(`whatsapp.invistimoOps.perm.${key}`)}
              </label>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`${btnPrimary} mt-3`}
          disabled={saving}
          onClick={() => void invite()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("whatsapp.invistimoOps.inviteAgent")}
        </button>
      </div>

      <section className={`${cardBase} overflow-hidden`}>
        {loading ? (
          <div className="p-4">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : (
          <table className="w-full text-start text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">{t("whatsapp.invistimoOps.agentName")}</th>
                <th className="px-3 py-2">{t("whatsapp.invistimoOps.agentEmail")}</th>
                <th className="px-3 py-2">{t("whatsapp.invistimoOps.role")}</th>
                <th className="px-3 py-2">{t("whatsapp.invistimoOps.status")}</th>
                <th className="px-3 py-2">{t("whatsapp.invistimoOps.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-bold">{agent.name}</td>
                  <td className="px-3 py-2" dir="ltr">
                    {agent.email}
                  </td>
                  <td className="px-3 py-2">{agent.role}</td>
                  <td className="px-3 py-2">{agent.status}</td>
                  <td className="px-3 py-2">
                    {agent.locked ? (
                      <span className="text-xs font-bold text-slate-400">
                        {t("whatsapp.invistimoOps.ownerLocked")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="text-xs font-bold text-rose-700"
                        onClick={() =>
                          void setStatus(
                            agent,
                            agent.status === "disabled" ? "invited" : "disabled"
                          )
                        }
                      >
                        {agent.status === "disabled"
                          ? t("whatsapp.invistimoOps.enable")
                          : t("whatsapp.invistimoOps.disable")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
