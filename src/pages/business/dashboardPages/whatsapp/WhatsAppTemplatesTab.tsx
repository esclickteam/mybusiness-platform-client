import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createWhatsAppTemplate,
  deleteWhatsAppTemplate,
  listWhatsAppTemplates,
  updateWhatsAppTemplate,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

const CATEGORIES = [
  "appointment_reminder",
  "promotion",
  "follow_up",
  "welcome",
  "custom",
] as const;

const emptyForm = {
  name: "",
  body: "",
  category: "custom" as WhatsAppTemplate["category"],
  language: "he",
};

export default function WhatsAppTemplatesTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setEditingId(null);
      setForm(emptyForm);
      setShowForm(true);
      const next = new URLSearchParams(searchParams);
      next.delete("create");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await listWhatsAppTemplates(businessId);
      setTemplates(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadTemplates")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (tpl: WhatsAppTemplate) => {
    setEditingId(tpl._id);
    setForm({
      name: tpl.name,
      body: tpl.body,
      category: tpl.category,
      language: tpl.language || "he",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!businessId) return;
    if (!form.name.trim() || !form.body.trim()) {
      toast.error(t("whatsapp.templates.required"));
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await updateWhatsAppTemplate(businessId, editingId, form);
        toast.success(t("whatsapp.templates.updated"));
      } else {
        await createWhatsAppTemplate(businessId, form);
        toast.success(t("whatsapp.templates.created"));
      }
      resetForm();
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.saveTemplate")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!businessId) return;
    if (!window.confirm(t("whatsapp.templates.confirmDelete"))) return;
    try {
      await deleteWhatsAppTemplate(businessId, id);
      toast.success(t("whatsapp.templates.deleted"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.deleteTemplate")
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.templates.title")}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {t("whatsapp.templates.subtitle")}
          </p>
        </div>
        <button
          type="button"
          className={btnPrimary}
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          {t("whatsapp.templates.create")}
        </button>
      </div>

      {showForm && (
        <section className={`${cardBase} p-4 sm:p-5`}>
          <h3 className="text-base font-black text-slate-900">
            {editingId
              ? t("whatsapp.templates.editTitle")
              : t("whatsapp.templates.createTitle")}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 sm:col-span-1">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.name")}
              </span>
              <input
                className={inputBase}
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.category")}
              </span>
              <select
                className={inputBase}
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as WhatsAppTemplate["category"],
                  }))
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(`whatsapp.categories.${cat}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.templates.body")}
              </span>
              <textarea
                className={`${inputBase} min-h-[140px] py-3`}
                value={form.body}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, body: e.target.value }))
                }
                placeholder={t("whatsapp.templates.bodyPlaceholder")}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={btnPrimary}
              disabled={saving}
              onClick={handleSave}
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("whatsapp.templates.save")}
            </button>
            <button type="button" className={btnSecondary} onClick={resetForm}>
              {t("whatsapp.templates.cancel")}
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((tpl) => (
          <article key={tpl._id} className={`${cardBase} flex flex-col p-4`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                  {t(`whatsapp.categories.${tpl.category}`)}
                </p>
                <h3 className="mt-1 text-base font-black text-slate-900">
                  {tpl.name}
                </h3>
              </div>
              {tpl.isSystem && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                  {t("whatsapp.templates.system")}
                </span>
              )}
            </div>
            <p className="mt-3 flex-1 whitespace-pre-wrap text-sm font-medium leading-relaxed text-slate-600">
              {tpl.body}
            </p>
            {!!tpl.variables?.length && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tpl.variables.map((variable) => (
                  <span
                    key={variable}
                    className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={() => startEdit(tpl)}
              >
                <Pencil className="h-3.5 w-3.5" />
                {t("whatsapp.templates.edit")}
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => handleDelete(tpl._id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("whatsapp.templates.delete")}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
