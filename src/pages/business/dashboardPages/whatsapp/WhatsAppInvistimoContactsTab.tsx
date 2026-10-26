import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { listInvistimoWhatsAppContacts } from "../../../../api/whatsappApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
import { cardBase, inputBase } from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

export default function WhatsAppInvistimoContactsTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<WhatsAppHubOutletContext>();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<
    Array<{ id?: string; name?: string; phone?: string; email?: string }>
  >([]);
  const [lists, setLists] = useState<
    Array<{ id: string; name: string; purpose?: string; memberCount?: number }>
  >([]);

  const load = async (query = q) => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await listInvistimoWhatsAppContacts(businessId, query);
      setGuests(data.guests || []);
      setLists(data.lists || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.loadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div className={`${cardBase} p-4`}>
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.invistimoOps.contactsTitle")}
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {t("whatsapp.invistimoOps.contactsSubtitle")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            className={`${inputBase} max-w-sm`}
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={t("whatsapp.invistimoOps.searchGuests")}
          />
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold"
            onClick={() => void load(q)}
          >
            {t("whatsapp.invistimoOps.search")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardBase} p-4`}>
          <h3 className="text-sm font-black text-slate-900">
            {t("whatsapp.invistimoOps.guests")}
          </h3>
          {loading ? (
            <Loader2 className="mt-4 h-5 w-5 animate-spin text-slate-400" />
          ) : guests.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              {t("whatsapp.invistimoOps.noGuests")}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {guests.slice(0, 200).map((guest) => (
                <li key={guest.id || guest.phone} className="py-2">
                  <div className="text-sm font-bold text-slate-800">
                    {guest.name || t("whatsapp.lists.unnamed")}
                  </div>
                  <div className="text-xs font-semibold text-slate-500" dir="ltr">
                    {guest.phone}
                    {guest.email ? ` · ${guest.email}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`${cardBase} p-4`}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-black text-slate-900">
              {t("whatsapp.nav.lists")}
            </h3>
            <Link
              to="../messages/lists"
              className="text-xs font-bold text-emerald-700"
            >
              {t("whatsapp.invistimoOps.manageLists")}
            </Link>
          </div>
          {lists.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              {t("whatsapp.lists.empty")}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {lists.map((list) => (
                <li
                  key={list.id}
                  className="rounded-md border border-slate-100 px-3 py-2"
                >
                  <div className="text-sm font-bold">{list.name}</div>
                  <div className="text-xs text-slate-500">
                    {t("whatsapp.lists.memberCount", {
                      count: list.memberCount || 0,
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
