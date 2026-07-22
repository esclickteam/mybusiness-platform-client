import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Clock3,
  DollarSign,
  Edit3,
  ImageIcon,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { BizuplyLoadingState } from "../../../../components/ui/BizuplyLoader";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import API from "@api";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

const DURATION_STEP = 15;
const MAX_DURATION = 12 * 60;

type ServiceItem = {
  _id: string;
  name: string;
  description?: string;
  duration?: number;
  price?: number | string;
  imageUrl?: string;
};

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
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50";

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

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ServiceFormState>(emptyForm);

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

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return services;

    return services.filter((service) => {
      return (
        service.name?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        String(service.price || "").toLowerCase().includes(query) ||
        formatDuration(Number(service.duration) || 0, t)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [services, search, t]);

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

  const servicesWithImage = useMemo(() => {
    return services.filter((service) => Boolean(service.imageUrl)).length;
  }, [services]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingService(null);
  };

  const openAdd = () => {
    resetForm();
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
    <div dir={dir} className="space-y-5 text-start">
      <section className="relative overflow-hidden rounded-[2.3rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-violet-50/70 p-6 shadow-[0_26px_80px_rgba(14,165,233,0.10)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              <Wrench className="h-4 w-4" />
              {t("crm.services.badge")}
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t("crm.services.title")}
            </h2>


            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              {t("crm.services.subtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Plus className="h-5 w-5" />
                {t("crm.services.addService")}
              </button>

              <button
                type="button"
                onClick={() => setShowForm((prev) => !prev)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <Sparkles className="h-5 w-5" />
                {showForm ? t("crm.services.closeForm") : t("crm.services.quickAdd")}
              </button>
            </div>
          </div>

          <ServicesHeroMock />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("crm.services.statTotal")}
          value={services.length.toLocaleString()}
          icon={Wrench}
          helper={t("crm.services.statTotalHelper")}
          tone="sky"
        />

        <StatCard
          label={t("crm.services.statAvgDuration")}
          value={
            averageDuration
              ? formatDuration(averageDuration, t)
              : t("crm.services.durationZero")
          }
          icon={Clock3}
          helper={t("crm.services.statAvgDurationHelper")}
          tone="blue"
        />

        <StatCard
          label={t("crm.services.statCatalogValue")}
          value={t("crm.services.catalogValue", {
            value: totalRevenuePotential.toLocaleString(),
          })}
          icon={DollarSign}
          helper={t("crm.services.statCatalogValueHelper")}
          tone="emerald"
        />

        <StatCard
          label={t("crm.services.statWithImage")}
          value={servicesWithImage.toLocaleString()}
          icon={ImageIcon}
          helper={t("crm.services.statWithImageHelper")}
          tone="violet"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                {t("crm.services.listTitle")}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {t("crm.services.listCount", {
                  shown: filteredServices.length,
                  total: services.length,
                })}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-[360px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder={t("crm.services.searchPlaceholder")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <button
                type="button"
                onClick={openAdd}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
              >
                <Plus className="h-5 w-5" />
                {t("crm.services.newService")}
              </button>
            </div>
          </div>
        </div>

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

        {loading ? (
          <LoadingState />
        ) : filteredServices.length === 0 ? (
          <EmptyServicesState onCreate={openAdd} />
        ) : (
          <div className="grid gap-4 p-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onEdit={() => openEdit(service)}
                onDelete={() => deleteService(service._id)}
              />
            ))}
          </div>
        )}
      </section>
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

  return (
    <div className="border-b border-slate-100 bg-slate-50/60 p-5">
      <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
              {editingService
                ? t("crm.services.formBadgeEdit")
                : t("crm.services.formBadgeNew")}
            </p>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label={t("crm.services.closeFormAria")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label={t("crm.services.nameLabel")} required>
            <input
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
              <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="number"
                placeholder={t("crm.services.pricePlaceholder")}
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                className={`${inputClass} pl-11`}
              />
            </div>
          </FormField>

          <FormField label={t("crm.services.durationLabel")}>
            <select
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
            <label className="flex h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm font-bold text-slate-500 transition hover:border-sky-300 hover:bg-sky-50">
              <span className="truncate">
                {form.imageFile
                  ? form.imageFile.name
                  : t("crm.services.uploadImage")}
              </span>

              <ImageIcon className="h-5 w-5 shrink-0 text-slate-400" />

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
                placeholder={t("crm.services.descriptionPlaceholder")}
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={4}
                className={textareaClass}
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
          >
            {t("crm.common.cancel")}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-5 w-5" />
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
  onDelete,
}: {
  service: ServiceItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const duration = Number(service.duration) || 0;
  const price = Number(service.price) || 0;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="relative h-44 bg-slate-100">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name || t("crm.common.service")}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 via-white to-violet-50 text-sky-900">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-950 hover:text-white"
            aria-label={t("crm.services.editAria")}
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-rose-700 shadow-sm backdrop-blur transition hover:bg-rose-600 hover:text-white"
            aria-label={t("crm.services.deleteAria")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-black text-sky-800 shadow-sm backdrop-blur">
          {t("crm.services.serviceBadge")}
        </div>
      </div>

      <div className="p-5">
        <h4 className="truncate text-lg font-black text-slate-950">
          {service.name || t("crm.services.unnamedService")}
        </h4>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-500">
          {service.description || t("crm.services.noDescription")}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoTile
            icon={Clock3}
            label={t("crm.common.duration")}
            value={duration ? formatDuration(duration, t) : t("crm.common.emDash")}
          />

          <InfoTile
            icon={DollarSign}
            label={t("crm.common.price")}
            value={t("crm.services.priceValue", {
              value: price.toLocaleString(),
            })}
          />
        </div>
      </div>
    </article>
  );
}

function ServicesHeroMock() {
  return (
    <div className="relative hidden h-44 xl:block">
      <div className="absolute left-10 top-0 h-40 w-72 rounded-3xl border border-white bg-white/70 shadow-[0_24px_60px_rgba(14,165,233,0.16)] backdrop-blur" />

      <div className="absolute left-44 top-12 flex h-24 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 shadow-sm">
        <Wrench className="h-10 w-10 text-sky-700" />
      </div>

      <div className="absolute left-20 top-10 h-28 w-44 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-sky-100 backdrop-blur">
        <div className="h-4 w-24 rounded-full bg-sky-200" />
        <div className="mt-4 h-3 w-32 rounded-full bg-slate-100" />
        <div className="mt-3 h-3 w-24 rounded-full bg-slate-100" />
        <div className="mt-3 h-3 w-28 rounded-full bg-slate-100" />
      </div>

      <div className="absolute right-0 top-9 h-28 w-32 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-violet-100 backdrop-blur">
        <div className="flex h-full items-end gap-3">
          <span className="h-12 w-4 rounded-full bg-sky-200" />
          <span className="h-20 w-4 rounded-full bg-violet-300" />
          <span className="h-10 w-4 rounded-full bg-emerald-200" />
        </div>
      </div>

      <div className="absolute right-[-16px] top-5 grid gap-3">
        {[Clock3, DollarSign, ImageIcon].map((Icon, index) => (
          <div
            key={index}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100"
          >
            <Icon className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
  tone: "sky" | "blue" | "emerald" | "violet";
}) {
  const { t } = useTranslation();
  const iconClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "violet"
        ? "bg-violet-50 text-violet-600"
        : tone === "blue"
          ? "bg-blue-50 text-blue-600"
          : "bg-sky-50 text-sky-800";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">
            ▲ {t("crm.common.active")}
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            {helper}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sky-900">
        <Icon className="h-4 w-4" />

        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function EmptyServicesState({ onCreate }: { onCreate: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm">
        <Wrench className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">
        {t("crm.services.emptyTitle")}
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {t("crm.services.emptyText")}
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
      >
        <Plus className="h-5 w-5" />
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
