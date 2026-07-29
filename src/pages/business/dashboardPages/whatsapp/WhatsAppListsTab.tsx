import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Loader2, Plus, Trash2, UserPlus } from "lucide-react";
import {
  addWhatsAppListMembers,
  createWhatsAppList,
  deleteWhatsAppList,
  listWhatsAppLists,
  listWhatsAppRecipients,
  removeWhatsAppListMember,
  type WhatsAppMailingList,
  type WhatsAppRecipient,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

export default function WhatsAppListsTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState<WhatsAppMailingList[]>([]);
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [newListName, setNewListName] = useState("");
  const [newListPurpose, setNewListPurpose] = useState("promotions");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [ls, people] = await Promise.all([
        listWhatsAppLists(businessId),
        listWhatsAppRecipients(businessId),
      ]);
      setLists(ls);
      setRecipients(people);
      if (!selectedListId && ls[0]?._id) setSelectedListId(ls[0]._id);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadLists")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const selectedList = useMemo(
    () => lists.find((list) => list._id === selectedListId) || null,
    [lists, selectedListId]
  );

  const createList = async () => {
    if (!businessId || !newListName.trim()) {
      toast.error(t("whatsapp.lists.nameRequired"));
      return;
    }
    try {
      setSaving(true);
      const list = await createWhatsAppList(businessId, {
        name: newListName.trim(),
        purpose: newListPurpose,
      });
      setNewListName("");
      setSelectedListId(list._id);
      toast.success(t("whatsapp.lists.created"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.createList")
      );
    } finally {
      setSaving(false);
    }
  };

  const removeList = async (id: string) => {
    if (!businessId) return;
    if (!window.confirm(t("whatsapp.lists.confirmDelete"))) return;
    try {
      await deleteWhatsAppList(businessId, id);
      if (selectedListId === id) setSelectedListId("");
      toast.success(t("whatsapp.lists.deleted"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.deleteList")
      );
    }
  };

  const addMembers = async () => {
    if (!businessId || !selectedListId || !selectedClientIds.length) {
      toast.error(t("whatsapp.lists.selectClients"));
      return;
    }
    try {
      setSaving(true);
      await addWhatsAppListMembers(businessId, selectedListId, {
        clientIds: selectedClientIds,
      });
      setSelectedClientIds([]);
      toast.success(t("whatsapp.lists.membersAdded"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.addMembers")
      );
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!businessId || !selectedListId) return;
    try {
      await removeWhatsAppListMember(businessId, selectedListId, memberId);
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.removeMember")
      );
    }
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.2fr]">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.lists.title")}
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {t("whatsapp.lists.subtitle")}
        </p>

        <div className="mt-4 grid gap-2">
          <input
            className={inputBase}
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder={t("whatsapp.lists.namePlaceholder")}
          />
          <select
            className={inputBase}
            value={newListPurpose}
            onChange={(e) => setNewListPurpose(e.target.value)}
          >
            <option value="promotions">{t("whatsapp.lists.purpose.promotions")}</option>
            <option value="reminders">{t("whatsapp.lists.purpose.reminders")}</option>
            <option value="updates">{t("whatsapp.lists.purpose.updates")}</option>
            <option value="general">{t("whatsapp.lists.purpose.general")}</option>
          </select>
          <button
            type="button"
            className={btnPrimary}
            disabled={saving}
            onClick={createList}
          >
            <Plus className="h-4 w-4" />
            {t("whatsapp.lists.create")}
          </button>
        </div>

        <div className="mt-5 space-y-2">
          {lists.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-sm font-medium text-slate-400">
              {t("whatsapp.lists.empty")}
            </p>
          ) : (
            lists.map((list) => (
              <button
                key={list._id}
                type="button"
                onClick={() => setSelectedListId(list._id)}
                className={[
                  "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-3 text-start transition",
                  selectedListId === list._id
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-emerald-200",
                ].join(" ")}
              >
                <span>
                  <span className="block text-sm font-black text-slate-900">
                    {list.name}
                  </span>
                  <span className="block text-xs font-medium text-slate-500">
                    {t("whatsapp.lists.memberCount", {
                      count: list.memberCount ?? list.members?.length ?? 0,
                    })}
                  </span>
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeList(list._id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      removeList(list._id);
                    }
                  }}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-white hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </span>
              </button>
            ))
          )}
        </div>
      </section>

      <section className={`${cardBase} p-4 sm:p-5`}>
        {!selectedList ? (
          <p className="py-16 text-center text-sm font-medium text-slate-400">
            {t("whatsapp.lists.selectListHint")}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedList.name}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {t(`whatsapp.lists.purpose.${selectedList.purpose || "general"}`)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-black text-slate-800">
                {t("whatsapp.lists.addFromCrm")}
              </h4>
              <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {recipients.map((client) => {
                  const checked = selectedClientIds.includes(client.id);
                  return (
                    <label
                      key={client.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedClientIds((prev) =>
                            checked
                              ? prev.filter((id) => id !== client.id)
                              : [...prev, client.id]
                          )
                        }
                        className="h-4 w-4 accent-emerald-600"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-slate-800">
                          {client.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {client.phone}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <button
                type="button"
                className={`${btnPrimary} mt-3`}
                disabled={saving || !selectedClientIds.length}
                onClick={addMembers}
              >
                <UserPlus className="h-4 w-4" />
                {t("whatsapp.lists.addSelected")}
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-black text-slate-800">
                {t("whatsapp.lists.members")}
              </h4>
              <div className="mt-2 space-y-2">
                {(selectedList.members || []).length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-sm font-medium text-slate-400">
                    {t("whatsapp.lists.noMembers")}
                  </p>
                ) : (
                  (selectedList.members || []).map((member) => (
                    <div
                      key={member._id || member.phone}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {member.name || t("whatsapp.lists.unnamed")}
                        </p>
                        <p className="truncate text-xs font-medium text-slate-500">
                          {member.phone}
                        </p>
                      </div>
                      {member._id && (
                        <button
                          type="button"
                          className={btnSecondary}
                          onClick={() => removeMember(member._id!)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
