import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowUp,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Filter,
  Grid2X2,
  Mail,
  MapPin,
  MoreHorizontal,
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
type ClientStatus = "Active" | "Inactive" | "Prospect" | "Customer";

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
  const [formClient, setFormClient] =
    useState<ClientFormState>(emptyClientForm);
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

  const activeClients = useMemo(() => {
    return clients.filter((client) => getClientStatus(client) === "Active")
      .length;
  }, [clients]);

  const prospectClients = useMemo(() => {
    return clients.filter((client) => getClientStatus(client) === "Prospect")
      .length;
  }, [clients]);

  const customerClients = useMemo(() => {
    return clients.filter((client) => getClientStatus(client) === "Customer")
      .length;
  }, [clients]);

  const inactiveClients = Math.max(clients.length - activeClients, 0);

  const totalAppointments = useMemo(() => {
    return clients.reduce((sum, client) => {
      return (
        sum +
        (Array.isArray(client.appointments) ? client.appointments.length : 0)
      );
    }, 0);
  }, [clients]);

  const revenue = useMemo(() => {
    return clients.reduce((sum, client) => sum + (Number(client.totalSpent) || 0), 0);
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
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
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
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-28 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-100">
              <UsersRound className="h-4 w-4" />
              CRM Clients
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Premium client management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/90">
              Manage customer files, contact details, appointment history and
              future follow-ups from one smart CRM workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-slate-950 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <Plus className="h-5 w-5" />
                Add Client
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 text-sm font-black text-white transition hover:bg-white/10"
              >
                <Download className="h-5 w-5" />
                Import Clients
              </button>
            </div>
          </div>

          <HeroMock />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Total Clients"
          value={clients.length.toLocaleString()}
          icon={UsersRound}
          trend="12.5%"
          tone="sky"
        />
        <StatCard
          label="Active Clients"
          value={activeClients.toLocaleString()}
          icon={UserRound}
          trend="8.2%"
          tone="emerald"
        />
        <StatCard
          label="Appointments"
          value={totalAppointments.toLocaleString()}
          icon={CalendarDays}
          trend="15.3%"
          tone="blue"
        />
        <StatCard
          label="Revenue (MTD)"
          value={`$${revenue.toLocaleString()}`}
          icon={Building2}
          trend="16.7%"
          tone="sky"
        />
        <StatCard
          label="Follow-ups Due"
          value="86"
          icon={Bell}
          trend="6.1%"
          tone="amber"
          negative
        />
        <StatCard
          label="Conversion Rate"
          value="23.6%"
          icon={ArrowUp}
          trend="4.3%"
          tone="emerald"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-[360px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search clients by name, phone, email..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <ToolbarButton icon={Filter} label="Segment" />
              <ToolbarButton icon={Filter} label="Status" />
              <ToolbarButton icon={Filter} label="More Filters" />
              <ToolbarButton icon={ArrowDownUp} label="Sort: Newest" />
              <IconButton icon={Download} label="Export" />
              <IconButton icon={Grid2X2} label="View" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterPill active label={`All ${clients.length}`} />
            <FilterPill label={`Active ${activeClients}`} />
            <FilterPill label={`Inactive ${inactiveClients}`} />
            <FilterPill label={`Prospect ${prospectClients}`} />
            <FilterPill label={`Customer ${customerClients}`} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-slate-950" />
            <p className="text-sm font-bold text-slate-500">Loading clients…</p>
          </div>
        ) : error ? (
          <div className="m-5 rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-lg font-black text-red-700">
              Error loading clients
            </p>
            <p className="mt-2 text-sm text-red-500">
              Please refresh the page and try again.
            </p>
          </div>
        ) : filteredClients.length === 0 ? (
          <EmptyClientsState onCreate={openCreate} />
        ) : (
          <ClientsTable
            clients={filteredClients}
            onOpen={openView}
            onDelete={handleDelete}
          />
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-500">
            Showing 1 to {filteredClients.length} of {clients.length} clients
          </p>

          <div className="flex items-center justify-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition",
                  page === 1
                    ? "bg-slate-950 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {page}
              </button>
            ))}

            <span className="px-2 text-sm font-black text-slate-400">...</span>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50">
            10 per page
          </button>
        </div>
      </section>
    </div>
  );
}

function ClientsTable({
  clients,
  onOpen,
  onDelete,
}: {
  clients: CRMClient[];
  onOpen: (client: CRMClient) => void;
  onDelete: (client: CRMClient, event?: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1120px] w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-white text-left">
            <th className="w-12 px-4 py-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-500"
              />
            </th>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Appointment</TableHead>
            <TableHead>Last Interaction</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Total Appts</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {clients.map((client, index) => {
            const status = getClientStatus(client);
            const initials = getInitials(client.fullName);
            const owner = getOwner(index);

            return (
              <tr
                key={client._id}
                onClick={() => onOpen(client)}
                className="group cursor-pointer border-b border-slate-100 transition hover:bg-slate-50/80"
              >
                <td className="px-4 py-4" onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-500"
                  />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-black text-sky-900">
                      {initials || <UserRound className="h-4 w-4" />}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">
                        {client.fullName || "Unnamed client"}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-400">
                        {client.address || "No company"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {client.phone && (
                      <p className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-sky-800" />
                        {formatPhone(client.phone)}
                      </p>
                    )}
                    {client.email && (
                      <p className="flex max-w-[170px] items-center gap-2 truncate text-xs font-semibold text-slate-600">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-sky-800" />
                        {client.email}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <p className="max-w-[140px] truncate text-xs font-bold text-slate-600">
                    {client.address || "—"}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">USA</p>
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={status} />
                </td>

                <td className="px-4 py-4">
                  <p className="text-xs font-bold text-slate-700">
                    {getNextAppointment(index)}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {getNextTime(index)}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <p className="text-xs font-bold text-slate-700">
                    {getLastInteraction(index)}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {client.email ? "Email" : "Phone Call"}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] font-black text-slate-500">
                        {owner.initials}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-700">{owner.name}</p>
                  </div>
                </td>

                <td className="px-4 py-4 text-center">
                  <p className="text-sm font-black text-slate-900">
                    {client.appointments?.length || 0}
                  </p>
                </td>

                <td className="px-4 py-4 text-right" onClick={(event) => event.stopPropagation()}>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(client)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-950 hover:text-white"
                      aria-label="Open client"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => onDelete(client, event)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-600 hover:text-white"
                      aria-label="Delete client"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
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
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
          className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save Client"}
        </button>
      </div>
    </div>
  );
}

function HeroMock() {
  return (
    <div className="relative hidden h-44 xl:block">
      <div className="absolute right-10 top-0 h-40 w-72 rounded-3xl border border-white/10 bg-white/10 backdrop-blur" />
      <div className="absolute right-44 top-12 flex h-24 w-32 items-center justify-center rounded-2xl bg-white/12 backdrop-blur">
        <UserRound className="h-10 w-10 text-white/85" />
      </div>
      <div className="absolute right-20 top-10 h-28 w-44 rounded-2xl bg-white/10 p-5 backdrop-blur">
        <div className="h-4 w-24 rounded-full bg-white/35" />
        <div className="mt-4 h-3 w-32 rounded-full bg-white/20" />
        <div className="mt-3 h-3 w-24 rounded-full bg-white/20" />
        <div className="mt-3 h-3 w-28 rounded-full bg-white/20" />
      </div>
      <div className="absolute right-0 top-9 h-28 w-32 rounded-2xl bg-white/10 p-5 backdrop-blur">
        <div className="flex h-full items-end gap-3">
          <span className="h-12 w-4 rounded-full bg-white/25" />
          <span className="h-20 w-4 rounded-full bg-white/35" />
          <span className="h-10 w-4 rounded-full bg-white/25" />
        </div>
      </div>
      <div className="absolute right-[-16px] top-5 grid gap-3">
        {[Phone, Mail, MapPin].map((Icon, index) => (
          <div
            key={index}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur"
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
  trend,
  tone,
  negative,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  trend: string;
  tone: "sky" | "emerald" | "blue" | "amber";
  negative?: boolean;
}) {
  const iconClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "amber"
      ? "bg-amber-50 text-amber-600"
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
          <div className="mt-2 flex items-center gap-2">
            <span
              className={[
                "text-xs font-black",
                negative ? "text-rose-600" : "text-emerald-600",
              ].join(" ")}
            >
              {negative ? "▼" : "▲"} {trend}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            vs last 30 days
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

function ToolbarButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 transition hover:bg-slate-50">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function IconButton({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function FilterPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={[
        "rounded-xl px-4 py-2 text-xs font-black transition",
        active
          ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
          : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={[
        "px-4 py-4 text-xs font-black text-slate-400",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: ClientStatus }) {
  const className =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Customer"
      ? "bg-sky-50 text-sky-800"
      : status === "Prospect"
      ? "bg-blue-50 text-blue-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-black ${className}`}
    >
      {status}
    </span>
  );
}

function EmptyClientsState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm">
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
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
      >
        <Plus className="h-5 w-5" />
        Create client
      </button>
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getClientStatus(client: CRMClient): ClientStatus {
  const appts = Array.isArray(client.appointments) ? client.appointments.length : 0;

  if (appts >= 3) return "Customer";
  if (appts >= 1) return "Active";
  if (client.email || client.phone) return "Prospect";
  return "Inactive";
}

function formatPhone(phone: string) {
  if (!phone) return "";
  return phone.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

function getNextAppointment(index: number) {
  const dates = ["May 22, 2025", "May 23, 2025", "May 25, 2025", "May 26, 2025", "—", "May 27, 2025"];
  return dates[index % dates.length];
}

function getNextTime(index: number) {
  const times = ["10:30 AM", "02:00 PM", "11:00 AM", "01:30 PM", "", "09:00 AM"];
  return times[index % times.length];
}

function getLastInteraction(index: number) {
  const dates = ["May 18, 2025", "May 19, 2025", "May 17, 2025", "May 18, 2025", "Apr 29, 2025", "May 20, 2025"];
  return dates[index % dates.length];
}

function getOwner(index: number) {
  const owners = [
    { name: "Sarah J.", initials: "SJ" },
    { name: "Michael T.", initials: "MT" },
    { name: "Emily R.", initials: "ER" },
    { name: "Daniel K.", initials: "DK" },
  ];

  return owners[index % owners.length];
}