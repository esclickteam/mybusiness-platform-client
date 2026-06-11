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
  Eye,
  Filter,
  Grid2X2,
  Layers3,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Save,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@api";
import CRMCustomerFile from "./CRMCustomerFile";

type CustomFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "status"
  | "checkbox"
  | "boolean"
  | "select"
  | "checklist"
  | "link"
  | "email"
  | "phone"
  | "file"
  | "image";

type CustomFieldSource =
  | "business_input"
  | "client_input"
  | "crm_profile"
  | "appointments"
  | "payments"
  | "custom";

type CustomField = {
  id: string;
  key: string;
  label: string;
  type: CustomFieldType;
  source: CustomFieldSource;
  showInClientProfile: boolean;
  showInClientPortal: boolean;
  editableByClient: boolean;
  required: boolean;
  placeholder?: string;
  options?: string[];
  value?: unknown;
};

type CustomClientTab = {
  id: string;
  title: string;
  description: string;
  showInClientPortal: boolean;
  whoCanFill: "business" | "client" | "both";
  fields: CustomField[];
  createdAt?: string;
  updatedAt?: string;
};

type CRMClient = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  appointments?: unknown[];
  totalSpent?: number;
  customTabs?: CustomClientTab[];
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

const CUSTOM_FIELDS_STORAGE_KEY = "bizuply_custom_client_fields";

const clientFieldTypeLabels: Record<CustomFieldType, string> = {
  text: "טקסט קצר",
  textarea: "סיכום / טקסט ארוך",
  number: "מספר",
  date: "תאריך",
  status: "סטטוס",
  checkbox: "צ׳קבוקס",
  boolean: "כן / לא",
  select: "בחירה מרשימה",
  checklist: "רשימת סימון",
  link: "קישור",
  email: "מייל",
  phone: "טלפון",
  file: "קובץ",
  image: "תמונה",
};

function normalizeClientFieldType(value: unknown): CustomFieldType {
  const allowed: CustomFieldType[] = [
    "text",
    "textarea",
    "number",
    "date",
    "status",
    "checkbox",
    "boolean",
    "select",
    "checklist",
    "link",
    "email",
    "phone",
    "file",
    "image",
  ];

  return allowed.includes(value as CustomFieldType)
    ? (value as CustomFieldType)
    : "text";
}

function buildGlobalCustomClientFields(customTabs: CustomClientTab[]) {
  return customTabs
    .flatMap((tab, tabIndex) =>
      tab.fields.map((field, fieldIndex) => ({
        id: field.id,
        key: cleanKey(field.key || field.label || field.id),
        label: field.label,
        type: field.type,
        description: field.placeholder || tab.description || "",
        required: Boolean(field.required),
        showInClientProfile: field.showInClientProfile !== false,
        showInClientPortal: Boolean(field.showInClientPortal),
        clientCanEdit: Boolean(field.editableByClient),
        options: Array.isArray(field.options) ? field.options : [],
        active: true,
        order: tabIndex * 100 + fieldIndex + 1,
      }))
    )
    .filter((field) => field.key && field.label && field.showInClientProfile);
}

function saveGlobalCustomClientFields(customTabs: CustomClientTab[]) {
  if (typeof window === "undefined") return;

  const fields = buildGlobalCustomClientFields(customTabs);
  window.localStorage.setItem(CUSTOM_FIELDS_STORAGE_KEY, JSON.stringify(fields));
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function cleanKey(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[{}]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

function variableToken(value: string) {
  const key = cleanKey(value);
  return key || "שם_המשתנה";
}

function normalizeCustomTabs(value: unknown): CustomClientTab[] {
  if (!Array.isArray(value)) return [];

  return value.map((tab: any) => ({
    id: String(tab.id || uid("tab")),
    title: String(tab.title || "טאב חדש"),
    description: String(tab.description || ""),
    showInClientPortal: Boolean(tab.showInClientPortal),
    whoCanFill: ["business", "client", "both"].includes(tab.whoCanFill)
      ? tab.whoCanFill
      : "business",
    fields: Array.isArray(tab.fields)
      ? tab.fields.map((field: any) => ({
          id: String(field.id || uid("field")),
          key: String(field.key || cleanKey(field.label || "field")),
          label: String(field.label || "נתון חדש"),
          type: [
            "text",
            "textarea",
            "number",
            "date",
            "status",
            "checkbox",
            "boolean",
            "select",
            "checklist",
            "link",
            "email",
            "phone",
            "file",
            "image",
          ].includes(field.type)
            ? field.type
            : "text",
          source: [
            "business_input",
            "client_input",
            "crm_profile",
            "appointments",
            "payments",
            "custom",
          ].includes(field.source)
            ? field.source
            : "business_input",
          showInClientProfile: field.showInClientProfile !== false,
          showInClientPortal: Boolean(field.showInClientPortal),
          editableByClient: Boolean(field.editableByClient),
          required: Boolean(field.required),
          placeholder: String(field.placeholder || ""),
          options: Array.isArray(field.options) ? field.options : [],
          value: field.value ?? "",
        }))
      : [],
    createdAt: tab.createdAt,
    updatedAt: tab.updatedAt,
  }));
}

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
    customTabs: normalizeCustomTabs(client.customTabs),
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
    return clients.reduce(
      (sum, client) => sum + (Number(client.totalSpent) || 0),
      0
    );
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

  const persistClientCustomTabs = async (
    clientId: string,
    customTabs: CustomClientTab[]
  ) => {
    saveGlobalCustomClientFields(customTabs);

    try {
      await API.put(`/crm-clients/${clientId}/custom-tabs`, {
        customTabs,
      });
    } catch (err) {
      console.warn(
        "Custom tabs were updated locally, but server route is missing/not ready:",
        err
      );
    }
  };

  const updateSelectedClientCustomTabs = async (
    updater: (tabs: CustomClientTab[]) => CustomClientTab[]
  ) => {
    if (!selectedClient) return;

    const currentTabs = normalizeCustomTabs(selectedClient.customTabs);
    const nextTabs = updater(currentTabs);

    const nextClient: CRMClient = {
      ...selectedClient,
      customTabs: nextTabs,
      updatedAt: new Date().toISOString(),
    };

    setSelectedClient(nextClient);

    queryClient.setQueryData<CRMClient[]>(["clients", businessId], (old) => {
      if (!old) return old;

      return old.map((client) => {
        if (client._id !== selectedClient._id) return client;
        return nextClient;
      });
    });

    saveGlobalCustomClientFields(nextTabs);
    await persistClientCustomTabs(selectedClient._id, nextTabs);
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
        customTabs: normalizeCustomTabs(res.data?.customTabs),
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

        <ClientCustomTabsBuilder
          client={selectedClient}
          onUpdateTabs={updateSelectedClientCustomTabs}
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
      <section className="relative overflow-hidden rounded-[2.3rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-violet-50/70 p-6 shadow-[0_26px_80px_rgba(14,165,233,0.10)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              <UsersRound className="h-4 w-4" />
              CRM Clients
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Premium client management
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              Manage customer files, contact details, appointment history,
              custom client data and private portal variables from one clean
              CRM workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Plus className="h-5 w-5" />
                Add Client
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
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

function ClientCustomTabsBuilder({
  client,
  onUpdateTabs,
}: {
  client: CRMClient;
  onUpdateTabs: (
    updater: (tabs: CustomClientTab[]) => CustomClientTab[]
  ) => Promise<void>;
}) {
  const tabs = normalizeCustomTabs(client.customTabs);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || "");

  useEffect(() => {
    if (!tabs.length) {
      setActiveTabId("");
      return;
    }

    const exists = tabs.some((tab) => tab.id === activeTabId);
    if (!exists) setActiveTabId(tabs[0].id);
  }, [activeTabId, tabs]);

  useEffect(() => {
    saveGlobalCustomClientFields(tabs);
  }, [tabs]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0] || null;

  const createTab = async () => {
    const now = new Date().toISOString();
    const nextTab: CustomClientTab = {
      id: uid("tab"),
      title: "טאב מותאם חדש",
      description: "",
      showInClientPortal: false,
      whoCanFill: "business",
      fields: [],
      createdAt: now,
      updatedAt: now,
    };

    await onUpdateTabs((current) => [nextTab, ...current]);
    setActiveTabId(nextTab.id);
  };

  const updateTab = async (
    tabId: string,
    patch: Partial<CustomClientTab>
  ) => {
    await onUpdateTabs((current) =>
      current.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : tab
      )
    );
  };

  const deleteTab = async (tabId: string) => {
    if (!window.confirm("למחוק את הטאב וכל הנתונים שבו?")) return;

    await onUpdateTabs((current) => current.filter((tab) => tab.id !== tabId));
  };

  const createField = async (tabId: string) => {
    const count = (activeTab?.fields.length || 0) + 1;

    const nextField: CustomField = {
      id: uid("field"),
      key: `נתון_${count}`,
      label: `נתון ${count}`,
      type: "text",
      source: "business_input",
      showInClientProfile: true,
      showInClientPortal: true,
      editableByClient: false,
      required: false,
      placeholder: "",
      options: [],
      value: "",
    };

    await updateTab(tabId, {
      fields: [...(activeTab?.fields || []), nextField],
    });
  };

  const updateField = async (
    tabId: string,
    fieldId: string,
    patch: Partial<CustomField>
  ) => {
    const targetTab = tabs.find((tab) => tab.id === tabId);
    if (!targetTab) return;

    const nextFields = targetTab.fields.map((field) => {
      if (field.id !== fieldId) return field;

      const nextLabel = patch.label ?? field.label;
      const shouldAutoKey =
        patch.label !== undefined &&
        (!field.key ||
          field.key.startsWith("custom_field_") ||
          field.key.startsWith("נתון_"));

      return {
        ...field,
        ...patch,
        key: shouldAutoKey ? cleanKey(nextLabel) || field.key : patch.key ?? field.key,
      };
    });

    await updateTab(tabId, { fields: nextFields });
  };

  const deleteField = async (tabId: string, fieldId: string) => {
    const targetTab = tabs.find((tab) => tab.id === tabId);
    if (!targetTab) return;

    await updateTab(tabId, {
      fields: targetTab.fields.filter((field) => field.id !== fieldId),
    });
  };

  return (
    <section
      dir="rtl"
      className="overflow-hidden rounded-[2.4rem] border border-violet-100 bg-white shadow-[0_28px_90px_rgba(88,28,135,0.08)]"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-violet-50 to-sky-50 p-6 text-slate-950">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/60 blur-3xl" />
        <div className="pointer-events-none absolute left-10 bottom-[-90px] h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="pointer-events-none absolute right-1/2 top-6 h-44 w-44 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/85 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              מערכת SaaS מתוך תיק הלקוח
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              טאבים, נתונים ומשתנים לאזור האישי
            </h2>

            <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-500">
              כאן בעל העסק מגדיר נתונים לכל לקוח. לכל נתון יש “שם משתנה”
              שאפשר להשתמש בו בבונה האתר בדפים שאחרי התחברות, לדוגמה:
              <span className="mx-1 rounded-xl bg-white px-2 py-1 font-black text-violet-700 shadow-sm">{"{{"}משקל{"}}"}</span>
              יציג לכל לקוח את המשקל שלו.
            </p>
          </div>

          <button
            type="button"
            onClick={createTab}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 text-sm font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            <Plus className="h-5 w-5" />
            הוספת טאב ללקוח
          </button>
        </div>
      </div>

      {tabs.length === 0 ? (
        <div className="p-8">
          <div className="rounded-[2rem] border border-dashed border-violet-200 bg-violet-50/50 p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-violet-700 shadow-sm">
              <Layers3 className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-2xl font-black text-slate-950">
              עדיין אין טאבים מותאמים
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-7 text-slate-500">
              לחצי על “הוספת טאב ללקוח” כדי ליצור לדוגמה תכנית טיפול, מדדים,
              מעקב, מסמכים, שאלון או כל מערכת אחרת שהעסק רוצה לבנות.
            </p>

            <button
              type="button"
              onClick={createTab}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
            >
              <Plus className="h-5 w-5" />
              יצירת טאב ראשון
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-0 xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="border-l border-slate-100 bg-slate-50/70 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
                  Client tabs
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-950">
                  טאבים בתיק לקוח
                </h3>
              </div>

              <button
                type="button"
                onClick={createTab}
                className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white transition hover:bg-violet-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={[
                    "rounded-[1.4rem] border p-4 text-right transition",
                    tab.id === activeTabId
                      ? "border-violet-300 bg-white shadow-lg"
                      : "border-slate-200 bg-white/70 hover:bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        {tab.title}
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {tab.fields.length} נתונים ·{" "}
                        {tab.showInClientPortal ? "מוצג באזור אישי" : "פנימי"}
                      </p>
                    </div>

                    {tab.showInClientPortal && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                        SaaS
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {activeTab && (
            <main className="min-w-0 p-5 lg:p-6">
              <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-5">
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                  <FormField label="שם הטאב">
                    <input
                      value={activeTab.title}
                      onChange={(event) =>
                        updateTab(activeTab.id, { title: event.target.value })
                      }
                      placeholder="לדוגמה: תכנית טיפול / מדדים / מעקב"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </FormField>

                  <FormField label="מי ממלא את הנתונים">
                    <select
                      value={activeTab.whoCanFill}
                      onChange={(event) =>
                        updateTab(activeTab.id, {
                          whoCanFill: event.target.value as CustomClientTab["whoCanFill"],
                        })
                      }
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    >
                      <option value="business">רק בעל העסק</option>
                      <option value="client">רק הלקוח</option>
                      <option value="both">בעל העסק והלקוח</option>
                    </select>
                  </FormField>

                  <button
                    type="button"
                    onClick={() => deleteTab(activeTab.id)}
                    className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100 lg:mt-[30px]"
                  >
                    <Trash2 className="h-4 w-4" />
                    מחיקת טאב
                  </button>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_260px]">
                  <FormField label="תיאור פנימי / הסבר">
                    <textarea
                      value={activeTab.description}
                      onChange={(event) =>
                        updateTab(activeTab.id, {
                          description: event.target.value,
                        })
                      }
                      placeholder="הסבר קצר על הטאב ומה הנתונים שהוא מנהל"
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                    />
                  </FormField>

                  <button
                    type="button"
                    onClick={() =>
                      updateTab(activeTab.id, {
                        showInClientPortal: !activeTab.showInClientPortal,
                      })
                    }
                    className={[
                      "mt-6 rounded-2xl border p-4 text-right transition lg:mt-[30px]",
                      activeTab.showInClientPortal
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          הצגה באזור האישי
                        </p>
                        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                          אם מופעל — הטאב יופיע גם ללקוח באתר.
                        </p>
                      </div>

                      <span
                        className={[
                          "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
                          activeTab.showInClientPortal
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white text-transparent",
                        ].join(" ")}
                      >
                        ✓
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-950">
                    נתונים / משתנים בטאב
                  </h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    כאן בוחרים אילו נתונים יהיו בטאב: גיל, גובה, משקל, תאריך,
                    קובץ, סטטוס, תכנית, מדד או כל שדה מותאם. כל נתון מקבל שם
                    משתנה לשימוש בבונה האתר.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => createField(activeTab.id)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                >
                  <Plus className="h-5 w-5" />
                  הוספת נתון
                </button>
              </div>

              {activeTab.fields.length === 0 ? (
                <div className="mt-5 rounded-[2rem] border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center">
                  <Settings2 className="mx-auto h-9 w-9 text-violet-600" />
                  <h4 className="mt-3 text-xl font-black text-slate-950">
                    עדיין אין נתונים בטאב הזה
                  </h4>
                  <p className="mx-auto mt-2 max-w-xl text-sm font-bold leading-7 text-slate-500">
                    הוסיפי נתונים חופשיים שהעסק יבחר. כל נתון יכול להיות פנימי
                    בלבד או להופיע גם באזור האישי של הלקוח.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4">
                  {activeTab.fields.map((field) => (
                    <CustomFieldEditor
                      key={field.id}
                      field={field}
                      onUpdate={(patch) =>
                        updateField(activeTab.id, field.id, patch)
                      }
                      onDelete={() => deleteField(activeTab.id, field.id)}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-[2rem] border border-violet-100 bg-gradient-to-l from-violet-50 to-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-violet-700">
                      <Eye className="h-4 w-4" />
                      איך זה מתחבר ל־SaaS?
                    </div>

                    <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                      הטאב נשמר בתיק הלקוח. אם “הצגה באזור האישי” פעיל — הלקוח
                      יראה אותו כשהוא מתחבר לאתר. נתונים שמקורם בפגישות/תשלומים
                      יימשכו אוטומטית, ושדות שהלקוח ממלא יחזרו לתיק הלקוח.
                    </p>
                  </div>

                  <div className="grid min-w-[240px] grid-cols-2 gap-3">
                    <MiniStat label="נתונים" value={activeTab.fields.length} />
                    <MiniStat
                      label="מוצגים ללקוח"
                      value={
                        activeTab.fields.filter((field) => field.showInClientPortal)
                          .length
                      }
                    />
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      )}
    </section>
  );
}

function CustomFieldEditor({
  field,
  onUpdate,
  onDelete,
}: {
  field: CustomField;
  onUpdate: (patch: Partial<CustomField>) => void;
  onDelete: () => void;
}) {
  const optionText = (field.options || []).join(", ");

  return (
    <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[1fr_170px_190px]">
        <FormField label="שם הנתון">
          <input
            value={field.label}
            onChange={(event) => {
              const label = event.target.value;
              const nextKey =
                !field.key ||
                field.key.startsWith("custom_field_") ||
                field.key.startsWith("נתון_")
                  ? variableToken(label)
                  : field.key;

              onUpdate({
                label,
                key: nextKey,
              });
            }}
            placeholder="לדוגמה: גיל / גובה / תכנית טיפול"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </FormField>

        <FormField label="סוג שדה">
          <select
            value={field.type}
            onChange={(event) =>
              onUpdate({ type: event.target.value as CustomFieldType })
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            <option value="text">טקסט קצר / מילה / שורה</option>
            <option value="textarea">סיכום / טקסט ארוך</option>
            <option value="number">מספר</option>
            <option value="date">תאריך</option>
            <option value="status">סטטוס</option>
            <option value="checkbox">צ׳קבוקס</option>
            <option value="boolean">כן / לא</option>
            <option value="select">בחירה מרשימה</option>
            <option value="checklist">רשימת סימון</option>
            <option value="link">קישור</option>
            <option value="email">מייל</option>
            <option value="phone">טלפון</option>
            <option value="file">קובץ</option>
            <option value="image">תמונה</option>
          </select>
        </FormField>

        <FormField label="מקור הנתון">
          <select
            value={field.source}
            onChange={(event) =>
              onUpdate({ source: event.target.value as CustomFieldSource })
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          >
            <option value="business_input">בעל העסק ממלא</option>
            <option value="client_input">הלקוח ממלא</option>
            <option value="crm_profile">מתיק הלקוח</option>
            <option value="appointments">מפגישות</option>
            <option value="payments">מתשלומים</option>
            <option value="custom">מותאם אישית</option>
          </select>
        </FormField>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <FormField label="שם המשתנה באתר">
          <input
            value={field.key}
            onChange={(event) =>
              onUpdate({ key: variableToken(event.target.value) })
            }
            placeholder="משקל / גיל / treatment_plan"
            className="h-12 w-full rounded-2xl border border-violet-100 bg-violet-50/60 px-4 text-sm font-black text-violet-800 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </FormField>

        <FormField label="טקסט עזר">
          <input
            value={field.placeholder || ""}
            onChange={(event) => onUpdate({ placeholder: event.target.value })}
            placeholder="טקסט שיופיע בשדה"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </FormField>
      </div>

      <div className="mt-4 rounded-2xl border border-sky-100 bg-gradient-to-l from-sky-50 to-white p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">
              שם המשתנה שהעסק ישתמש בו בבונה האתר
            </p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
              לדוגמה: אם שם המשתנה הוא “משקל”, בעמוד פרטי אחרי התחברות אפשר
              להציג את הערך האישי של כל לקוח באמצעות המשתנה.
            </p>
          </div>

          <div className="w-fit rounded-2xl bg-white px-4 py-3 text-sm font-black text-violet-700 shadow-sm ring-1 ring-violet-100">
            {"{{"}
            {field.key || "שם_המשתנה"}
            {"}}"}
          </div>
        </div>
      </div>

      {(field.type === "select" || field.type === "checklist" || field.type === "status") && (
        <div className="mt-4">
          <FormField label="אפשרויות">
            <input
              value={optionText}
              onChange={(event) =>
                onUpdate({
                  options: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              placeholder="אפשרות 1, אפשרות 2, אפשרות 3"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </FormField>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <ToggleBox
          title="מופיע בתיק לקוח"
          text="השדה יתווסף אוטומטית לכל תיק לקוח"
          checked={field.showInClientProfile !== false}
          onClick={() =>
            onUpdate({ showInClientProfile: field.showInClientProfile === false })
          }
        />

        <ToggleBox
          title="מוצג באזור האישי"
          text="הלקוח יראה את הנתון באתר"
          checked={field.showInClientPortal}
          onClick={() =>
            onUpdate({ showInClientPortal: !field.showInClientPortal })
          }
        />

        <ToggleBox
          title="הלקוח יכול לערוך"
          text="הלקוח יכול להזין/לעדכן"
          checked={field.editableByClient}
          onClick={() => onUpdate({ editableByClient: !field.editableByClient })}
        />

        <ToggleBox
          title="שדה חובה"
          text="לא ניתן לשלוח בלי למלא"
          checked={field.required}
          onClick={() => onUpdate({ required: !field.required })}
        />
      </div>

      <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center">
        <div className="rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-3 text-xs font-black text-slate-600">
          <span className="text-slate-400">משתנה לבונה האתר: </span>
          <span className="rounded-xl bg-white px-2 py-1 text-violet-700 shadow-sm">
            {"{{"}
            {field.key || "שם_המשתנה"}
            {"}}"}
          </span>
          <span className="mx-2 text-slate-300">·</span>
          {fieldTypeLabel(field.type)} · {fieldSourceLabel(field.source)}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-xs font-black text-rose-700 transition hover:bg-rose-100"
        >
          <Trash2 className="h-4 w-4" />
          מחיקת נתון
        </button>
      </div>
    </article>
  );
}

function ToggleBox({
  title,
  text,
  checked,
  onClick,
}: {
  title: string;
  text: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border p-4 text-right transition",
        checked
          ? "border-violet-300 bg-violet-50"
          : "border-slate-200 bg-slate-50 hover:bg-white",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
            {text}
          </p>
        </div>

        <span
          className={[
            "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
            checked
              ? "border-violet-700 bg-violet-700 text-white"
              : "border-slate-300 bg-white text-transparent",
          ].join(" ")}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
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
  onDelete: (
    client: CRMClient,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void;
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
                <td
                  className="px-4 py-4"
                  onClick={(event) => event.stopPropagation()}
                >
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
                    <p className="text-xs font-bold text-slate-700">
                      {owner.name}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4 text-center">
                  <p className="text-sm font-black text-slate-900">
                    {client.appointments?.length || 0}
                  </p>
                </td>

                <td
                  className="px-4 py-4 text-right"
                  onClick={(event) => event.stopPropagation()}
                >
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
          <input
            placeholder="Phone"
            value={formClient.phone}
            onChange={(event) =>
              setFormClient((prev) => ({
                ...prev,
                phone: event.target.value,
              }))
            }
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
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
      <div className="absolute right-10 top-0 h-40 w-72 rounded-3xl border border-white bg-white/70 shadow-[0_24px_60px_rgba(14,165,233,0.16)] backdrop-blur" />
      <div className="absolute right-44 top-12 flex h-24 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 shadow-sm">
        <UserRound className="h-10 w-10 text-sky-700" />
      </div>
      <div className="absolute right-20 top-10 h-28 w-44 rounded-2xl bg-white/85 p-5 shadow-sm ring-1 ring-sky-100 backdrop-blur">
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
        {[Phone, Mail, MapPin].map((Icon, index) => (
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
  const appts = Array.isArray(client.appointments)
    ? client.appointments.length
    : 0;

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
  const dates = [
    "May 22, 2025",
    "May 23, 2025",
    "May 25, 2025",
    "May 26, 2025",
    "—",
    "May 27, 2025",
  ];
  return dates[index % dates.length];
}

function getNextTime(index: number) {
  const times = [
    "10:30 AM",
    "02:00 PM",
    "11:00 AM",
    "01:30 PM",
    "",
    "09:00 AM",
  ];
  return times[index % times.length];
}

function getLastInteraction(index: number) {
  const dates = [
    "May 18, 2025",
    "May 19, 2025",
    "May 17, 2025",
    "May 18, 2025",
    "Apr 29, 2025",
    "May 20, 2025",
  ];
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

function fieldTypeLabel(type: CustomFieldType) {
  if (type === "text") return "טקסט קצר";
  if (type === "textarea") return "טקסט ארוך";
  if (type === "number") return "מספר";
  if (type === "date") return "תאריך";
  if (type === "checkbox") return "צ׳קבוקס";
  if (type === "select") return "בחירה";
  if (type === "checklist") return "רשימת סימון";
  if (type === "file") return "קובץ";
  if (type === "image") return "תמונה";
  return type;
}

function fieldSourceLabel(source: CustomFieldSource) {
  if (source === "business_input") return "בעל העסק ממלא";
  if (source === "client_input") return "הלקוח ממלא";
  if (source === "crm_profile") return "מתיק הלקוח";
  if (source === "appointments") return "מפגישות";
  if (source === "payments") return "מתשלומים";
  return "מותאם אישית";
}