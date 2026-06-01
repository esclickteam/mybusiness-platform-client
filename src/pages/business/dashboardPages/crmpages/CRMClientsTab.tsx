import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import API from "@api";
import CRMCustomerFile from "./CRMCustomerFile";

type CRMClient = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  appointments?: unknown[];
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
};

type CRMClientsTabProps = {
  businessId: string;
};

type ClientFormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
};

type Mode = "list" | "create" | "view" | "edit";

const emptyClientForm: ClientFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
};

async function fetchClients(businessId: string): Promise<CRMClient[]> {
  if (!businessId) return [];

  const res = await API.get(`/crm-clients/${businessId}`);

  const rawClients = Array.isArray(res.data) ? res.data : [];

  return rawClients.map((client: any) => ({
    _id: client._id,
    fullName: client.fullName || "",
    phone: String(client.phone || "").replace(/\s/g, ""),
    email: String(client.email || "").replace(/\s/g, ""),
    address: client.address || "",
    appointments: Array.isArray(client.appointments) ? client.appointments : [],
    totalSpent: Number(client.totalSpent) || 0,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  }));
}

export default function CRMClientsTab({ businessId }: CRMClientsTabProps) {
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<Mode>("list");
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [formClient, setFormClient] = useState<ClientFormState>(emptyClientForm);
  const [isSaving, setIsSaving] = useState(false);

  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery<CRMClient[]>({
    queryKey: ["clients", businessId],
    queryFn: () => fetchClients(businessId),
    enabled: Boolean(businessId),
  });

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return clients;

    return clients.filter((client) => {
      return (
        client.fullName.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.address.toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  const clientsWithEmail = useMemo(() => {
    return clients.filter((client) => Boolean(client.email)).length;
  }, [clients]);

  const clientsWithAddress = useMemo(() => {
    return clients.filter((client) => Boolean(client.address)).length;
  }, [clients]);

  const totalAppointments = useMemo(() => {
    return clients.reduce((sum, client) => {
      return sum + (Array.isArray(client.appointments) ? client.appointments.length : 0);
    }, 0);
  }, [clients]);

  useEffect(() => {
    if (mode === "edit" && selectedClient) {
      setFormClient({
        fullName: selectedClient.fullName || "",
        phone: selectedClient.phone || "",
        email: selectedClient.email || "",
        address: selectedClient.address || "",
      });
    }
  }, [mode, selectedClient]);

  const resetForm = () => {
    setFormClient(emptyClientForm);
  };

  const openCreate = () => {
    resetForm();
    setSelectedClient(null);
    setMode("create");
  };

  const openView = (client: CRMClient) => {
    setSelectedClient(client);
    setMode("view");
  };

  const closeForm = () => {
    if (mode === "edit" && selectedClient) {
      setMode("view");
      return;
    }

    setMode("list");
    resetForm();
  };

  const invalidateClients = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["clients", businessId],
    });
  };

  const handleDelete = async (
    client: CRMClient,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    event?.stopPropagation();

    if (!window.confirm(`Delete "${client.fullName}"?`)) return;

    try {
      await API.delete(`/crm-clients/${client._id}`);
      await invalidateClients();

      if (selectedClient?._id === client._id) {
        setSelectedClient(null);
        setMode("list");
      }
    } catch (err) {
      console.error("Delete client error:", err);
      alert("Delete failed");
    }
  };

  const validateForm = () => {
    if (!formClient.fullName.trim()) {
      alert("Name is required");
      return false;
    }

    if (!formClient.phone.trim()) {
      alert("Phone is required");
      return false;
    }

    if (!businessId) {
      alert("Missing business ID");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (isSaving || !validateForm()) return;

    setIsSaving(true);

    try {
      const res = await API.post("/crm-clients", {
        ...formClient,
        fullName: formClient.fullName.trim(),
        phone: formClient.phone.trim(),
        email: formClient.email.trim(),
        address: formClient.address.trim(),
        businessId,
      });

      await invalidateClients();

      const createdClient: CRMClient = {
        _id: res.data?._id,
        fullName: res.data?.fullName || formClient.fullName,
        phone: res.data?.phone || formClient.phone,
        email: res.data?.email || formClient.email,
        address: res.data?.address || formClient.address,
        appointments: res.data?.appointments || [],
        totalSpent: res.data?.totalSpent || 0,
      };

      setSelectedClient(createdClient);
      resetForm();
      setMode("view");
    } catch (err) {
      console.error("Create client error:", err);
      alert("Create failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (isSaving || !validateForm() || !selectedClient) return;

    setIsSaving(true);

    try {
      await API.put(`/crm-clients/${selectedClient._id}`, {
        fullName: formClient.fullName.trim(),
        phone: formClient.phone.trim(),
        email: formClient.email.trim(),
        address: formClient.address.trim(),
      });

      await invalidateClients();

      setSelectedClient((prev) =>
        prev
          ? {
              ...prev,
              ...formClient,
            }
          : prev
      );

      setMode("view");
    } catch (err) {
      console.error("Update client error:", err);
      alert("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (mode === "view" && selectedClient) {
      return (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedClient(null);
                setMode("list");
                invalidateClients();
              }}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to clients
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("edit")}
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </button>

              <button
                type="button"
                onClick={(event) => handleDelete(selectedClient, event)}
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <CRMCustomerFile
            client={selectedClient}
            businessId={businessId}
            onClose={() => {
              setSelectedClient(null);
              setMode("list");
              invalidateClients();
            }}
          />
        </div>
      );
    }

    if (mode === "create" || mode === "edit") {
      return (
        <ClientFormPanel
          mode={mode}
          formClient={formClient}
          setFormClient={setFormClient}
          isSaving={isSaving}
          onCancel={closeForm}
          onSave={mode === "create" ? handleCreate : handleUpdate}
        />
      );
    }

    return (
      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-950">Clients</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {filteredClients.length} shown from {clients.length} total clients
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 sm:w-[360px]"
                placeholder="Search by name, phone, email or address…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              <Plus className="h-5 w-5" />
              Add Client
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-[2rem] border border-slate-100 bg-slate-50 p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="text-sm font-bold text-slate-500">Loading clients…</p>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-lg font-black text-red-700">Error loading clients</p>
            <p className="mt-2 text-sm text-red-500">
              Please refresh the page and try again.
            </p>
          </div>
        ) : filteredClients.length === 0 ? (
          <EmptyClientsState onCreate={openCreate} />
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {filteredClients.map((client) => (
              <ClientCard
                key={client._id}
                client={client}
                onOpen={() => openView(client)}
                onDelete={(event) => handleDelete(client, event)}
              />
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-slate-950 via-violet-950 to-violet-700 p-6 text-white shadow-[0_24px_80px_rgba(88,28,135,0.20)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-100">
              <UsersRound className="h-4 w-4" />
              CRM Clients
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Premium client management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-100">
              Manage customer files, contact details, appointment history and
              future follow-ups from one smart CRM workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-violet-700 shadow-xl shadow-violet-950/20 transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            <Plus className="h-5 w-5" />
            Add Client
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total clients" value={clients.length} icon={UsersRound} />
          <MetricCard label="With email" value={clientsWithEmail} icon={Mail} />
          <MetricCard label="With address" value={clientsWithAddress} icon={MapPin} />
          <MetricCard
            label="Appointments"
            value={totalAppointments}
            icon={Building2}
          />
        </div>
      </section>

      {renderContent()}
    </div>
  );
}

function ClientCard({
  client,
  onOpen,
  onDelete,
}: {
  client: CRMClient;
  onOpen: () => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const initials = client.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article
      onClick={onOpen}
      className="group cursor-pointer rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg font-black text-violet-700">
            {initials || <UserRound className="h-6 w-6" />}
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {client.fullName || "Unnamed client"}
            </h4>

            <div className="mt-2 space-y-1 text-sm font-semibold text-slate-500">
              {client.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-violet-500" />
                  {client.phone}
                </p>
              )}

              {client.email && (
                <p className="flex items-center gap-2 truncate">
                  <Mail className="h-4 w-4 text-violet-500" />
                  {client.email}
                </p>
              )}

              {client.address && (
                <p className="flex items-center gap-2 truncate">
                  <MapPin className="h-4 w-4 text-violet-500" />
                  {client.address}
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-700 transition hover:bg-rose-600 hover:text-white"
          aria-label="Delete client"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <InfoTile
          label="Appointments"
          value={client.appointments?.length || 0}
        />
        <InfoTile
          label="Email"
          value={client.email ? "Saved" : "Missing"}
        />
        <InfoTile
          label="Status"
          value="Active"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="rounded-2xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 transition hover:bg-violet-600 hover:text-white"
        >
          Open file
        </button>
      </div>
    </article>
  );
}

function ClientFormPanel({
  mode,
  formClient,
  setFormClient,
  isSaving,
  onCancel,
  onSave,
}: {
  mode: "create" | "edit";
  formClient: ClientFormState;
  setFormClient: React.Dispatch<React.SetStateAction<ClientFormState>>;
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            {mode === "create" ? "New CRM contact" : "Edit CRM contact"}
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-950">
            {mode === "create" ? "Add Client" : "Edit Client"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Save client details once and use them across appointments, follow-ups
            and customer files.
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
        <FormField label="Full name" required>
          <input
            placeholder="Full name"
            value={formClient.fullName}
            onChange={(event) =>
              setFormClient((prev) => ({
                ...prev,
                fullName: event.target.value,
              }))
            }
            className="input-base"
          />
        </FormField>

        <FormField label="Phone" required>
          <PhoneInput
            country="us"
            preferredCountries={["il", "us", "gb", "ca"]}
            enableSearch
            value={formClient.phone}
            onChange={(phone) =>
              setFormClient((prev) => ({
                ...prev,
                phone,
              }))
            }
            inputProps={{
              required: true,
            }}
            containerClass="!w-full"
            inputClass="!w-full !h-[48px] !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !text-sm !font-semibold !text-slate-900 !outline-none"
            buttonClass="!rounded-l-2xl !border-slate-200"
          />
        </FormField>

        <FormField label="Email">
          <input
            placeholder="Email"
            type="email"
            value={formClient.email}
            onChange={(event) =>
              setFormClient((prev) => ({
                ...prev,
                email: event.target.value,
              }))
            }
            className="input-base"
          />
        </FormField>

        <FormField label="Address">
          <input
            placeholder="Address"
            value={formClient.address}
            onChange={(event) =>
              setFormClient((prev) => ({
                ...prev,
                address: event.target.value,
              }))
            }
            className="input-base"
          />
        </FormField>
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
          disabled={isSaving}
          className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save Client"}
        </button>
      </div>
    </div>
  );
}

function EmptyClientsState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-6 rounded-[2rem] border border-dashed border-violet-200 bg-violet-50/50 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-violet-600 shadow-sm">
        <UsersRound className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">No clients yet</h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first CRM client or let the system add clients automatically
        from public bookings.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
      >
        <Plus className="h-5 w-5" />
        Create client
      </button>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-900">
        {value}
      </p>
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