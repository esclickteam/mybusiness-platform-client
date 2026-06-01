import React, { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  DollarSign,
  Edit3,
  ImageIcon,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

import API from "@api";

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

export default function CRMServicesTab() {
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

        setServices(res.data.services || res.data.data || []);
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
        service.description?.toLowerCase().includes(query)
      );
    });
  }, [services, search]);

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
      alert("Service name and price are required");
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

      setServices(res.data.services || res.data.data || services);
      closeForm();
    } catch (err) {
      console.error("Save service error:", err);
      alert("Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await API.delete(`/business/my/services/${id}`);
      setServices((prev) => prev.filter((service) => service._id !== id));
    } catch (err) {
      console.error("Delete service error:", err);
      alert("Failed to delete service");
    }
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-28 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-100">
              <Wrench className="h-4 w-4" />
              CRM Services
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Services, pricing and duration
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/90">
              Manage your service catalog, prices, appointment duration and
              images from one clean CRM workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-950 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-sky-50"
          >
            <Plus className="h-5 w-5" />
            Add Service
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total services"
          value={services.length}
          icon={Wrench}
        />
        <StatCard
          label="Avg duration"
          value={averageDuration ? formatDuration(averageDuration) : "0m"}
          icon={Clock3}
        />
        <StatCard
          label="Catalog value"
          value={`$${totalRevenuePotential.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          label="With image"
          value={services.filter((service) => Boolean(service.imageUrl)).length}
          icon={ImageIcon}
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">Services</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {filteredServices.length} shown from {services.length} total
                services
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-[360px]"
                />
              </div>

              <button
                type="button"
                onClick={openAdd}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
              >
                <Plus className="h-5 w-5" />
                New Service
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
  return (
    <div className="border-b border-slate-100 bg-slate-50/60 p-5">
      <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
              {editingService ? "Edit service" : "New service"}
            </p>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {editingService ? "Edit Service" : "Add Service"}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Define service details, price, duration and image.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Service name" required>
            <input
              placeholder="Service name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              className="input-tailwind"
            />
          </FormField>

          <FormField label="Price" required>
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                className="input-tailwind pl-11"
              />
            </div>
          </FormField>

          <FormField label="Duration">
            <select
              value={form.duration}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  duration: Number(event.target.value),
                }))
              }
              className="input-tailwind"
            >
              {Array.from(
                { length: MAX_DURATION / DURATION_STEP },
                (_, index) => {
                  const minutes = (index + 1) * DURATION_STEP;

                  return (
                    <option key={minutes} value={minutes}>
                      {formatDuration(minutes)}
                    </option>
                  );
                }
              )}
            </select>
          </FormField>

          <FormField label="Image">
            <label className="flex h-12 cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 text-sm font-bold text-slate-500 transition hover:border-sky-300 hover:bg-sky-50">
              <span className="truncate">
                {form.imageFile ? form.imageFile.name : "Upload service image"}
              </span>
              <ImageIcon className="h-5 w-5 text-slate-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    imageFile: event.target.files?.[0] || null,
                  }))
                }
              />
            </label>
          </FormField>

          <div className="lg:col-span-2">
            <FormField label="Description">
              <textarea
                placeholder="Short description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={4}
                className="input-tailwind resize-none py-3"
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
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Service"}
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
  const duration = Number(service.duration) || 0;
  const price = Number(service.price) || 0;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="relative h-44 bg-slate-100">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-sky-50 text-sky-900">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-950 hover:text-white"
            aria-label="Edit service"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 text-rose-700 shadow-sm backdrop-blur transition hover:bg-rose-600 hover:text-white"
            aria-label="Delete service"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <h4 className="truncate text-lg font-black text-slate-950">
          {service.name}
        </h4>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-500">
          {service.description || "No description"}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <InfoTile
            icon={Clock3}
            label="Duration"
            value={duration ? formatDuration(duration) : "-"}
          />

          <InfoTile
            icon={DollarSign}
            label="Price"
            value={`$${price.toLocaleString()}`}
          />
        </div>
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            live catalog
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
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
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm">
        <Wrench className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">No services yet</h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Add your first service so clients can book appointments with the right
        price and duration.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
      >
        <Plus className="h-5 w-5" />
        Create service
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-slate-950" />
      <p className="text-sm font-bold text-slate-500">Loading services...</p>
    </div>
  );
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

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h > 0) {
    return `${h}h${m ? ` ${m}m` : ""}`;
  }

  return `${minutes}m`;
}