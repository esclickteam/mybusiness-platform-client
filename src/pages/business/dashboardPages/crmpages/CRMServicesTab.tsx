import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Copy,
  Edit3,
  ImageIcon,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { BizuplyLoadingState } from "../../../../components/ui/BizuplyLoader";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import API from "@api";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { crmCurrencySymbol, formatCrmMoney } from "../../../../utils/crmCurrency";
import { getDemoFixture } from "../../../../guidedDemo/demoLocale";
import { isGuidedDemoActive } from "../../../../guidedDemo/sessionStore";
import type { DemoServiceFixture } from "../../../../guidedDemo/fixtures/demoFixtures";
import "./crmWorkspace.css";

const DURATION_STEP = 15;
const MAX_DURATION = 12 * 60;

/** Currency mark used in place of DollarSign across the services CRM UI. */
function ShekelIcon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center text-[1.05em] font-black leading-none ${className}`}
    >
      {crmCurrencySymbol()}
    </span>
  );
}

type ServiceItem = {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number | string;
  imageUrl?: string;
  category?: string;
  active?: boolean;
};

type SortKey = "name" | "price" | "duration";

type ServiceFormState = {
  name: string;
  description: string;
  duration: number;
  price: string;
  imageFile: File | null;
};

const emptyForm: ServiceFormState = {
  name: "",
  description: "",
  duration: 30,
  price: "",
  imageFile: null,
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6D28D9]/40 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6D28D9]/40 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50";

function normalizeServices(value: unknown): ServiceItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((service: any) => ({
      _id: String(service?._id || service?.id || ""),
      name: String(service?.name || ""),
      description: String(service?.description || ""),
      duration: Number(service?.duration) || 0,
      price: service?.price ?? "",
      imageUrl: String(service?.imageUrl || service?.image || ""),
      category: String(service?.category || service?.group || ""),
      active: service?.active !== false && service?.isActive !== false,
    }))
    .filter((service) => service._id || service.name);
}

function extractServicesFromResponse(data: any, fallback: ServiceItem[]) {
  const possible =
    data?.services ??
    data?.data ??
    data?.items ??
    data?.serviceList ??
    data;

  const normalized = normalizeServices(possible);

  return normalized.length ? normalized : fallback;
}

function formatDuration(minutes: number, t: TFunction) {
  if (!minutes) return t("crm.services.durationZero");

  if (minutes < 60) {
    return t("crm.services.durationMinutes", { count: minutes });
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!rest) {
    return t("crm.services.durationHours", { count: hours });
  }

  return t("crm.services.durationHoursMinutes", { hours, minutes: rest });
}

export default function CRMServicesTab() {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [menuId, setMenuId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [viewMode, setViewMode] = useState<"cards" | "table">(() => {
    return window.localStorage.getItem("crm.services.view") === "cards" ? "cards" : "table";
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);

        const res = await API.get("/business/my/services");

        setServices(extractServicesFromResponse(res.data, []));
      } catch (err) {
        console.error("Failed loading services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    window.localStorage.setItem("crm.services.view", viewMode);
  }, [viewMode]);

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = services.filter((service) => {
      if (statusFilter === "active" && service.active === false) return false;
      if (statusFilter === "inactive" && service.active !== false) return false;
      if (!query) return true;
      const category = service.category || t("crm.services.generalCategory");
      return (
        service.name?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        String(service.price || "").toLowerCase().includes(query) ||
        formatDuration(Number(service.duration) || 0, t)
          .toLowerCase()
          .includes(query)
      );
    });
    const sorted = [...rows].sort((a, b) => {
      if (sortKey === "price") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortKey === "duration") return (Number(a.duration) || 0) - (Number(b.duration) || 0);
      return String(a.name || "").localeCompare(String(b.name || ""), undefined, { sensitivity: "base" });
    });
    return sorted;
  }, [services, search, t, sortKey, statusFilter]);

  const totalRevenuePotential = useMemo(() => {
    return services.reduce((sum, service) => {
      return sum + (Number(service.price) || 0);
    }, 0);
  }, [services]);

  const averageDuration = useMemo(() => {
    if (services.length === 0) return 0;

    const total = services.reduce((sum, service) => {
      return sum + (Number(service.duration) || 0);
    }, 0);

    return Math.round(total / services.length);
  }, [services]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingService(null);
  };

  const openAdd = () => {
    resetForm();
    const demoService = getDemoFixture<DemoServiceFixture>("service");
    if (demoService && isGuidedDemoActive()) {
      setForm({
        ...emptyForm,
        description: demoService.description,
        duration: demoService.duration,
        price: String(demoService.price),
      });
    }
    setShowForm(true);
  };

  const openEdit = (service: ServiceItem) => {
    setEditingService(service);

    setForm({
      name: service.name || "",
      description: service.description || "",
      duration: Number(service.duration) || 30,
      price: service.price !== undefined ? String(service.price) : "",
      imageFile: null,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const saveService = async () => {
    if (!form.name.trim() || !form.price) {
      alert(t("crm.services.namePriceRequired"));
      return;
    }

    setSaving(true);

    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    data.append("duration", String(form.duration));
    data.append("price", String(form.price));

    if (form.imageFile) {
      data.append("image", form.imageFile);
    }

    try {
      const res = editingService
        ? await API.put(`/business/my/services/${editingService._id}`, data)
        : await API.post("/business/my/services", data);

      const nextServices = extractServicesFromResponse(res.data, services);

      setServices(nextServices);

      closeForm();
    } catch (err) {
      console.error("Save service error:", err);
      alert(t("crm.services.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const duplicateService = async (service: ServiceItem) => {
    const data = new FormData();
    data.append("name", `${service.name} ${t("crm.services.copySuffix")}`);
    data.append("description", service.description || "");
    data.append("duration", String(service.duration || 30));
    data.append("price", String(service.price || 0));
    try {
      const res = await API.post("/business/my/services", data);
      setServices(extractServicesFromResponse(res.data, services));
    } catch (err) {
      console.error("Duplicate service error:", err);
      alert(t("crm.services.saveFailed"));
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm(t("crm.services.deleteConfirm"))) return;

    try {
      await API.delete(`/business/my/services/${id}`);
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (err) {
      console.error("Delete service error:", err);
      alert(t("crm.services.deleteFailed"));
    }
  };

  return (
    <div dir={dir} className="crm-ops min-w-0 space-y-2 overflow-x-hidden bg-[#F7F8FC] text-start">
      <header className="crm-ops-toolbar">
        <div className="min-w-0 flex-1">
          <h2>{t("crm.services.title")}</h2>
          <div className="crm-ops-stats mt-1">
            <span>{t("crm.services.statTotal")}: <b>{services.length}</b></span>
            <span>{t("crm.services.statAvgDuration")}: <b>{averageDuration ? formatDuration(averageDuration, t) : t("crm.services.durationZero")}</b></span>
            <span>{t("crm.services.statCatalogValue")}: <b>{formatCrmMoney(totalRevenuePotential)}</b></span>
          </div>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute start-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("crm.services.searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-8 w-full rounded-lg border border-slate-200 bg-white pe-2 ps-8 text-sm font-semibold outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "inactive")}
          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold"
        >
          <option value="all">{t("crm.common.all")}</option>
          <option value="active">{t("crm.common.active")}</option>
          <option value="inactive">{t("crm.services.inactive")}</option>
        </select>
        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as SortKey)}
          className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold"
        >
          <option value="name">{t("crm.services.sortName")}</option>
          <option value="price">{t("crm.services.sortPrice")}</option>
          <option value="duration">{t("crm.services.sortDuration")}</option>
        </select>
        <button
          type="button"
          onClick={() => setViewMode("table")}
          className={`h-8 rounded-lg border px-2.5 text-xs font-black ${viewMode === "table" ? "border-violet-300 bg-violet-50 text-[#6D28D9]" : "border-slate-200 bg-white"}`}
        >
          {t("crm.services.tableView")}
        </button>
        <button
          type="button"
          onClick={() => setViewMode("cards")}
          className={`h-8 rounded-lg border px-2.5 text-xs font-black ${viewMode === "cards" ? "border-violet-300 bg-violet-50 text-[#6D28D9]" : "border-slate-200 bg-white"}`}
        >
          {t("crm.services.cardsView")}
        </button>
        <button
          type="button"
          onClick={openAdd}
          data-demo-target="services-add-button"
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#6D28D9] px-3 text-xs font-black text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("crm.services.addService")}
        </button>
      </header>

      <section className="overflow-hidden rounded-[10px] border border-slate-200 bg-white">
        {loading ? (
          <LoadingState />
        ) : filteredServices.length === 0 ? (
          <EmptyServicesState onCreate={openAdd} />
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>{t("crm.services.name")}</th>
                  <th>{t("crm.services.category")}</th>
                  <th>{t("crm.services.duration")}</th>
                  <th>{t("crm.services.price")}</th>
                  <th>{t("crm.common.status")}</th>
                  <th>{t("crm.common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service._id}>
                    <td className="font-extrabold">{service.name}</td>
                    <td>{service.category || t("crm.services.generalCategory")}</td>
                    <td>{formatDuration(Number(service.duration) || 0, t)}</td>
                    <td>{formatCrmMoney(Number(service.price) || 0)}</td>
                    <td>{service.active === false ? t("crm.services.inactive") : t("crm.common.active")}</td>
                    <td className="relative">
                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200"
                        aria-label={t("crm.common.actions")}
                        onClick={() => setMenuId((current) => (current === service._id ? null : service._id))}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menuId === service._id && (
                        <div className="crm-menu end-2 top-10">
                          <button type="button" className="block w-full rounded-md px-3 py-1.5 text-start text-xs font-bold" onClick={() => { setMenuId(null); openEdit(service); }}>{t("crm.common.edit")}</button>
                          <button type="button" className="block w-full rounded-md px-3 py-1.5 text-start text-xs font-bold" onClick={() => { setMenuId(null); void duplicateService(service); }}>{t("crm.services.duplicate")}</button>
                          <button type="button" className="block w-full rounded-md px-3 py-1.5 text-start text-xs font-bold text-rose-700" onClick={() => { setMenuId(null); void deleteService(service._id); }}>{t("crm.common.delete")}</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="crm-svc-grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={() => openEdit(service)}
                onDuplicate={() => void duplicateService(service)}
                onDelete={() => deleteService(service._id)}
              />
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <ServiceFormPanel
          form={form}
          setForm={setForm}
          editingService={editingService}
          saving={saving}
          onCancel={closeForm}
          onSave={saveService}
        />
      )}
    </div>
  );
}

function ServiceFormPanel({
  form,
  setForm,
  editingService,
  saving,
  onCancel,
  onSave,
}: {
  form: ServiceFormState;
  setForm: React.Dispatch<React.SetStateAction<ServiceFormState>>;
  editingService: ServiceItem | null;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  const { t } = useTranslation();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setForm((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const dir = useLocaleDir();

  return (
    <div className="crm-drawer" dir={dir} role="dialog" aria-modal="true">
      <button type="button" className="flex-1" aria-label={t("crm.services.closeFormAria")} onClick={onCancel} />
      <div className="crm-drawer-panel">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#6D28D9]">
              {editingService
                ? t("crm.services.formBadgeEdit")
                : t("crm.services.formBadgeNew")}
            </p>
            <h3 className="mt-1 text-xl font-black text-slate-900">
              {editingService
                ? t("crm.services.formTitleEdit")
                : t("crm.services.formTitleNew")}
            </h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("crm.services.formSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label={t("crm.services.closeFormAria")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label={t("crm.services.nameLabel")} required>
            <input
              data-demo-target="services-name"
              placeholder={t("crm.services.namePlaceholder")}
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              className={inputClass}
            />
          </FormField>

          <FormField label={t("crm.services.priceLabel")} required>
            <div className="relative">
              <ShekelIcon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sm text-slate-400" />
              <input
                type="number"
                data-demo-target="services-price"
                placeholder={t("crm.services.pricePlaceholder")}
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                className={`${inputClass} ps-10`}
              />
            </div>
          </FormField>

          <FormField label={t("crm.services.durationLabel")}>
            <select
              data-demo-target="services-duration"
              value={form.duration}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  duration: Number(event.target.value),
                }))
              }
              className={inputClass}
            >
              {Array.from(
                { length: MAX_DURATION / DURATION_STEP },
                (_, index) => {
                  const minutes = (index + 1) * DURATION_STEP;

                  return (
                    <option key={minutes} value={minutes}>
                      {formatDuration(minutes, t)}
                    </option>
                  );
                }
              )}
            </select>
          </FormField>

          <FormField label={t("crm.services.imageLabel")}>
            <label className="flex h-11 cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm font-bold text-slate-500 transition hover:border-[#6D28D9]/40 hover:bg-violet-50">
              <span className="truncate">
                {form.imageFile
                  ? form.imageFile.name
                  : t("crm.services.uploadImage")}
              </span>
              <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </FormField>

          <div className="lg:col-span-2">
            <FormField label={t("crm.services.descriptionLabel")}>
              <textarea
                data-demo-target="services-description"
                placeholder={t("crm.services.descriptionPlaceholder")}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={3}
                className={textareaClass}
              />
            </FormField>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-200"
          >
            {t("crm.common.cancel")}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            data-demo-target="services-save-button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? t("crm.services.saving") : t("crm.services.saveService")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  service: ServiceItem;
  onEdit: () => void;
  onDuplicate?: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const duration = Number(service.duration) || 0;
  const price = Number(service.price) || 0;

  return (
    <article className="crm-svc-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-black text-slate-900">
            {service.name || t("crm.services.unnamedService")}
          </h4>
          <p className="truncate text-[11px] font-semibold text-slate-500">
            {service.category || t("crm.services.generalCategory")}
            {" · "}
            {service.active === false ? t("crm.services.inactive") : t("crm.common.active")}
          </p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={onEdit} className="grid h-7 w-7 place-items-center rounded-md border border-slate-200" aria-label={t("crm.services.editAria")}>
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          {onDuplicate && (
            <button type="button" onClick={onDuplicate} className="grid h-7 w-7 place-items-center rounded-md border border-slate-200" aria-label={t("crm.services.duplicate")}>
              <Copy className="h-3.5 w-3.5" />
            </button>
          )}
          <button type="button" onClick={onDelete} className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 text-rose-600" aria-label={t("crm.services.deleteAria")}>
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="line-clamp-2 text-xs font-semibold text-slate-500">
        {service.description || t("crm.services.noDescription")}
      </p>
      <div className="mt-auto flex items-center justify-between text-xs font-black">
        <span className="inline-flex items-center gap-1 text-slate-600">
          <Clock3 className="h-3.5 w-3.5" />
          {duration ? formatDuration(duration, t) : t("crm.common.emDash")}
        </span>
        <span>{formatCrmMoney(price)}</span>
      </div>
    </article>
  );
}

function EmptyServicesState({ onCreate }: { onCreate: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="crm-empty">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#6D28D9] shadow-sm ring-1 ring-violet-100">
        <Wrench className="h-6 w-6" />
      </div>

      <h4 className="text-xl font-black text-slate-900">
        {t("crm.services.emptyTitle")}
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {t("crm.services.emptyText")}
      </p>

      <button
        type="button"
        onClick={onCreate}
        data-demo-target="services-add-button"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#5B21B6]"
      >
        <Plus className="h-4 w-4" />
        {t("crm.services.createService")}
      </button>
    </div>
  );
}

function LoadingState() {
  const { t } = useTranslation();

  return <BizuplyLoadingState label={t("crm.workHours.loading")} />;
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>

      {children}
    </label>
  );
}
