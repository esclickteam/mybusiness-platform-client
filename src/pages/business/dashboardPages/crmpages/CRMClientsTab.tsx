import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Filter,
  Grid2X2,
  Layers3,
  LockKeyhole,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import API from "@api";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";

type CustomFieldType =
  | "text"
  | "textarea"
  | "summary"
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

type ConfiguredClientField = {
  id: string;
  key: string;
  label: string;
  type: CustomFieldType;
  description?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  showInClientProfile?: boolean;
  showInClientPortal?: boolean;
  clientCanEdit?: boolean;
  editableByClient?: boolean;
  active?: boolean;
  order?: number;
};

type ClientDataDraft = Record<string, unknown>;

type ClientDetailTab =
  | "profile"
  | "appointments"
  | "client-data"
  | "portal-access";

type PortalAccessSettings = {
  enabled: boolean;
  status: "not_invited" | "invited" | "active" | "paused";
  loginEmail: string;
  paymentStatus: "free" | "included" | "paid" | "unpaid";
  monthlyPrice: string;
  pages: string;
  lastInviteSentAt: string;
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
const CLIENT_DATA_TAB_ID = "client_data_values";
const PORTAL_ACCESS_TAB_ID = "client_portal_access";

function getFieldTypeLabel(type: CustomFieldType, t: TFunction) {
  return t(`crm.clients.fieldTypes.${type}`);
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

function normalizeClientFieldType(value: unknown): CustomFieldType {
  const allowed: CustomFieldType[] = [
    "text",
    "textarea",
    "summary",
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

function normalizeConfiguredClientField(
  value: Partial<ConfiguredClientField>,
  index: number,
  t: TFunction,
): ConfiguredClientField {
  const label =
    String(value.label || "").trim() ||
    t("crm.clients.defaults.customField", { index: index + 1 });
  const key =
    cleanKey(String(value.key || label)) ||
    t("crm.clients.defaults.customFieldKey", { index: index + 1 });

  return {
    id: String(value.id || key || uid("client_field")),
    key,
    label,
    type: normalizeClientFieldType(value.type),
    description: String(value.description || ""),
    placeholder: String(value.placeholder || ""),
    options: Array.isArray(value.options) ? value.options.map(String) : [],
    required: Boolean(value.required),
    showInClientProfile: value.showInClientProfile !== false,
    showInClientPortal: Boolean(value.showInClientPortal),
    clientCanEdit: Boolean(value.clientCanEdit ?? value.editableByClient),
    editableByClient: Boolean(value.editableByClient ?? value.clientCanEdit),
    active: value.active !== false,
    order: Number(value.order) || index + 1,
  };
}

function loadConfiguredClientFields(t: TFunction): ConfiguredClientField[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((field, index) => normalizeConfiguredClientField(field, index, t))
      .filter(
        (field) =>
          field.active !== false && field.showInClientProfile !== false,
      )
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  } catch {
    return [];
  }
}

function normalizeCustomTabs(value: unknown, t: TFunction): CustomClientTab[] {
  if (!Array.isArray(value)) return [];

  return value.map((tab: any) => ({
    id: String(tab.id || uid("tab")),
    title: String(tab.title || t("crm.clients.defaults.clientTab")),
    description: String(tab.description || ""),
    showInClientPortal: Boolean(tab.showInClientPortal),
    whoCanFill: ["business", "client", "both"].includes(tab.whoCanFill)
      ? tab.whoCanFill
      : "business",
    fields: Array.isArray(tab.fields)
      ? tab.fields.map((field: any) => ({
          id: String(field.id || uid("field")),
          key: String(field.key || cleanKey(field.label || "field")),
          label: String(field.label || t("crm.clients.defaults.customFieldLabel")),
          type: normalizeClientFieldType(field.type),
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
          options: Array.isArray(field.options)
            ? field.options.map(String)
            : [],
          value: field.value ?? "",
        }))
      : [],
    createdAt: tab.createdAt,
    updatedAt: tab.updatedAt,
  }));
}

async function fetchClients(
  businessId: string,
  t: TFunction,
): Promise<CRMClient[]> {
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
    customTabs: normalizeCustomTabs(client.customTabs, t),
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  }));
}

function getClientDataValues(client: CRMClient, t: TFunction): ClientDataDraft {
  const tabs = normalizeCustomTabs(client.customTabs, t);
  const dataTab = tabs.find((tab) => tab.id === CLIENT_DATA_TAB_ID);
  const values: ClientDataDraft = {};

  tabs.forEach((tab) => {
    tab.fields.forEach((field) => {
      if (field.key) values[field.key] = field.value ?? "";
    });
  });

  dataTab?.fields.forEach((field) => {
    if (field.key) values[field.key] = field.value ?? "";
  });

  return values;
}

function buildClientDataTab(
  configuredFields: ConfiguredClientField[],
  values: ClientDataDraft,
  previousTabs: CustomClientTab[],
  t: TFunction,
): CustomClientTab {
  const previousDataTab = previousTabs.find(
    (tab) => tab.id === CLIENT_DATA_TAB_ID,
  );
  const previousValues = getFieldsValueMap(previousDataTab?.fields || []);
  const now = new Date().toISOString();

  return {
    id: CLIENT_DATA_TAB_ID,
    title: t("crm.clients.clientDataPanel.tabTitle"),
    description: t("crm.clients.clientDataPanel.tabDescription"),
    showInClientPortal: true,
    whoCanFill: "business",
    createdAt: previousDataTab?.createdAt || now,
    updatedAt: now,
    fields: configuredFields.map((field) => ({
      id: field.id || `client_data_${field.key}`,
      key: field.key,
      label: field.label,
      type: field.type,
      source: "business_input",
      showInClientProfile: field.showInClientProfile !== false,
      showInClientPortal: Boolean(field.showInClientPortal),
      editableByClient: Boolean(field.clientCanEdit),
      required: Boolean(field.required),
      placeholder: field.placeholder || field.description || "",
      options: Array.isArray(field.options) ? field.options : [],
      value:
        values[field.key] ??
        previousValues[field.key] ??
        defaultFieldValue(field.type),
    })),
  };
}

function getFieldsValueMap(fields: CustomField[]) {
  return fields.reduce<Record<string, unknown>>((acc, field) => {
    if (field.key) acc[field.key] = field.value ?? "";
    return acc;
  }, {});
}

function defaultFieldValue(type: CustomFieldType) {
  if (type === "checkbox" || type === "boolean") return false;
  if (type === "checklist") return [];
  return "";
}

function getPortalAccessSettings(
  client: CRMClient,
  t: TFunction,
): PortalAccessSettings {
  const tabs = normalizeCustomTabs(client.customTabs, t);
  const portalTab = tabs.find((tab) => tab.id === PORTAL_ACCESS_TAB_ID);
  const values = getFieldsValueMap(portalTab?.fields || []);

  return {
    enabled: Boolean(values.portal_enabled),
    status:
      String(values.portal_status || "not_invited") === "invited" ||
      String(values.portal_status || "not_invited") === "active" ||
      String(values.portal_status || "not_invited") === "paused"
        ? (String(values.portal_status) as PortalAccessSettings["status"])
        : "not_invited",
    loginEmail: String(values.portal_login_email || client.email || ""),
    paymentStatus:
      String(values.portal_payment_status || "included") === "free" ||
      String(values.portal_payment_status || "included") === "paid" ||
      String(values.portal_payment_status || "included") === "unpaid"
        ? (String(
            values.portal_payment_status,
          ) as PortalAccessSettings["paymentStatus"])
        : "included",
    monthlyPrice: String(values.portal_monthly_price || "0"),
    pages: String(values.portal_pages || ""),
    lastInviteSentAt: String(values.portal_last_invite_sent_at || ""),
  };
}

function buildPortalAccessTab(
  settings: PortalAccessSettings,
  previousTabs: CustomClientTab[],
  t: TFunction,
): CustomClientTab {
  const previousPortalTab = previousTabs.find(
    (tab) => tab.id === PORTAL_ACCESS_TAB_ID,
  );
  const now = new Date().toISOString();

  return {
    id: PORTAL_ACCESS_TAB_ID,
    title: t("crm.clients.portal.tabTitle"),
    description: t("crm.clients.portal.tabDescription"),
    showInClientPortal: false,
    whoCanFill: "business",
    createdAt: previousPortalTab?.createdAt || now,
    updatedAt: now,
    fields: [
      createPortalField(
        "portal_enabled",
        t("crm.clients.portal.fieldAccessEnabled"),
        "boolean",
        settings.enabled,
      ),
      createPortalField(
        "portal_status",
        t("crm.clients.portal.fieldAccessStatus"),
        "status",
        settings.status,
        ["not_invited", "invited", "active", "paused"],
      ),
      createPortalField(
        "portal_login_email",
        t("crm.clients.portal.fieldLoginEmail"),
        "email",
        settings.loginEmail,
      ),
      createPortalField(
        "portal_payment_status",
        t("crm.clients.portal.fieldPaymentStatus"),
        "status",
        settings.paymentStatus,
        ["free", "included", "paid", "unpaid"],
      ),
      createPortalField(
        "portal_monthly_price",
        t("crm.clients.portal.fieldMonthlyPrice"),
        "number",
        settings.monthlyPrice,
      ),
      createPortalField(
        "portal_pages",
        t("crm.clients.portal.fieldEnabledPages"),
        "textarea",
        settings.pages,
      ),
      createPortalField(
        "portal_last_invite_sent_at",
        t("crm.clients.portal.fieldLastInvite"),
        "date",
        settings.lastInviteSentAt,
      ),
    ],
  };
}

function createPortalField(
  key: string,
  label: string,
  type: CustomFieldType,
  value: unknown,
  options: string[] = [],
): CustomField {
  return {
    id: key,
    key,
    label,
    type,
    source: "business_input",
    showInClientProfile: false,
    showInClientPortal: false,
    editableByClient: false,
    required: false,
    placeholder: "",
    options,
    value,
  };
}

function upsertTab(tabs: CustomClientTab[], nextTab: CustomClientTab) {
  const exists = tabs.some((tab) => tab.id === nextTab.id);

  if (!exists) return [nextTab, ...tabs];

  return tabs.map((tab) => (tab.id === nextTab.id ? nextTab : tab));
}

function getClientStatusLabel(status: ClientStatus, t: TFunction): string {
  return t(`crm.clients.statuses.${status}`);
}

export default function CRMClientsTab({ businessId }: CRMClientsTabProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<Mode>("list");
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [formClient, setFormClient] =
    useState<ClientFormState>(emptyClientForm);
  const [isSaving, setIsSaving] = useState(false);
  const [activeClientTab, setActiveClientTab] =
    useState<ClientDetailTab>("profile");
  const [configuredClientFields, setConfiguredClientFields] = useState<
    ConfiguredClientField[]
  >([]);

  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery<CRMClient[]>({
    queryKey: ["clients", businessId],
    queryFn: () => fetchClients(businessId, t),
    enabled: Boolean(businessId),
  });

  useEffect(() => {
    const loadFields = () =>
      setConfiguredClientFields(loadConfiguredClientFields(t));

    loadFields();
    window.addEventListener("storage", loadFields);

    return () => window.removeEventListener("storage", loadFields);
  }, [t]);

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
      0,
    );
  }, [clients]);

  const portalAccessCount = useMemo(() => {
    return clients.filter((client) => getPortalAccessSettings(client, t).enabled)
      .length;
  }, [clients, t]);

  const customDataCount = configuredClientFields.length;

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
    setActiveClientTab("profile");
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
    customTabs: CustomClientTab[],
  ) => {
    try {
      await API.put(`/crm-clients/${clientId}/custom-tabs`, {
        customTabs,
      });
    } catch (err) {
      console.warn(
        "Client custom data was updated locally, but server route is missing/not ready:",
        err,
      );
    }
  };

  const updateSelectedClientCustomTabs = async (
    updater: (tabs: CustomClientTab[]) => CustomClientTab[],
  ) => {
    if (!selectedClient) return;

    const currentTabs = normalizeCustomTabs(selectedClient.customTabs, t);
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

    await persistClientCustomTabs(selectedClient._id, nextTabs);
  };

  const handleSaveClientData = async (values: ClientDataDraft) => {
    if (!selectedClient) return;

    await updateSelectedClientCustomTabs((currentTabs) => {
      const nextDataTab = buildClientDataTab(
        configuredClientFields,
        values,
        currentTabs,
        t,
      );
      return upsertTab(currentTabs, nextDataTab);
    });
  };

  const handleSavePortalAccess = async (settings: PortalAccessSettings) => {
    if (!selectedClient) return;

    await updateSelectedClientCustomTabs((currentTabs) => {
      const nextPortalTab = buildPortalAccessTab(settings, currentTabs, t);
      return upsertTab(currentTabs, nextPortalTab);
    });
  };

  const handleSendPortalInvite = async () => {
    if (!selectedClient) return;

    const current = getPortalAccessSettings(selectedClient, t);

    await handleSavePortalAccess({
      ...current,
      enabled: true,
      status: current.status === "active" ? "active" : "invited",
      lastInviteSentAt: new Date().toISOString(),
    });

    alert(t("crm.clients.portal.inviteAlert"));
  };

  const handleDelete = async (
    client: CRMClient,
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event?.stopPropagation();

    if (!window.confirm(t("crm.clients.alerts.deleteConfirm", { name: client.fullName }))) return;

    try {
      await API.delete(`/crm-clients/${client._id}`);
      await invalidateClients();

      if (selectedClient?._id === client._id) {
        setSelectedClient(null);
        setMode("list");
      }
    } catch (err) {
      console.error("Delete client error:", err);
      alert(t("crm.clients.alerts.deleteFailed"));
    }
  };

  const validateForm = () => {
    if (!formClient.fullName.trim()) {
      alert(t("crm.clients.alerts.nameRequired"));
      return false;
    }

    if (!formClient.phone.trim()) {
      alert(t("crm.clients.alerts.phoneRequired"));
      return false;
    }

    if (!businessId) {
      alert(t("crm.clients.alerts.businessIdMissing"));
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
        customTabs: normalizeCustomTabs(res.data?.customTabs, t),
      };

      setSelectedClient(createdClient);
      resetForm();
      setActiveClientTab("profile");
      setMode("view");
    } catch (err) {
      console.error("Create client error:", err);
      alert(t("crm.clients.alerts.createFailed"));
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
          : prev,
      );

      setMode("view");
    } catch (err) {
      console.error("Update client error:", err);
      alert(t("crm.clients.alerts.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  if (mode === "view" && selectedClient) {
    return (
      <ClientDetailsView
        client={selectedClient}
        activeTab={activeClientTab}
        setActiveTab={setActiveClientTab}
        configuredFields={configuredClientFields}
        onBack={() => {
          setSelectedClient(null);
          setMode("list");
          invalidateClients();
        }}
        onEdit={() => setMode("edit")}
        onDelete={(event) => handleDelete(selectedClient, event)}
        onSaveClientData={handleSaveClientData}
        onSavePortalAccess={handleSavePortalAccess}
        onSendPortalInvite={handleSendPortalInvite}
      />
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
    <div dir={dir} className="space-y-5 text-start">
      <section className="relative overflow-hidden rounded-[2.3rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-violet-50/70 p-6 shadow-[0_26px_80px_rgba(14,165,233,0.10)]">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 top-10 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              <UsersRound className="h-4 w-4" />
              {t("crm.clients.badge")}
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t("crm.clients.title")}
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              {t("crm.clients.subtitle")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Plus className="h-5 w-5" />
                {t("crm.clients.addClient")}
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
              >
                <Download className="h-5 w-5" />
                {t("crm.clients.importClients")}
              </button>
            </div>
          </div>

          <HeroMock />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label={t("crm.clients.stats.totalClients")}
          value={clients.length.toLocaleString()}
          icon={UsersRound}
          trend="12.5%"
          tone="sky"
        />
        <StatCard
          label={t("crm.clients.stats.activeClients")}
          value={activeClients.toLocaleString()}
          icon={UserRound}
          trend="8.2%"
          tone="emerald"
        />
        <StatCard
          label={t("crm.clients.stats.appointments")}
          value={totalAppointments.toLocaleString()}
          icon={CalendarDays}
          trend="15.3%"
          tone="blue"
        />
        <StatCard
          label={t("crm.clients.stats.monthlyRevenue")}
          value={t("crm.common.currencyAmount", { amount: revenue.toLocaleString() })}
          icon={Building2}
          trend="16.7%"
          tone="sky"
        />
        <StatCard
          label={t("crm.clients.stats.clientDataFields")}
          value={customDataCount.toLocaleString()}
          icon={Layers3}
          trend={t("crm.clients.stats.trendReady")}
          tone="amber"
        />
        <StatCard
          label={t("crm.clients.stats.portalAccess")}
          value={portalAccessCount.toLocaleString()}
          icon={ShieldCheck}
          trend={t("crm.clients.stats.trendActive")}
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
                placeholder={t("crm.clients.searchPlaceholder")}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <ToolbarButton icon={Filter} label={t("crm.clients.toolbar.segment")} />
              <ToolbarButton icon={Filter} label={t("crm.clients.toolbar.status")} />
              <ToolbarButton icon={Filter} label={t("crm.clients.toolbar.moreFilters")} />
              <ToolbarButton icon={ArrowDownUp} label={t("crm.clients.toolbar.sortNewest")} />
              <IconButton icon={Download} label={t("crm.clients.toolbar.export")} />
              <IconButton icon={Grid2X2} label={t("crm.clients.toolbar.view")} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterPill active label={t("crm.clients.filters.all", { count: clients.length })} />
            <FilterPill label={t("crm.clients.filters.active", { count: activeClients })} />
            <FilterPill label={t("crm.clients.filters.inactive", { count: inactiveClients })} />
            <FilterPill label={t("crm.clients.filters.prospects", { count: prospectClients })} />
            <FilterPill label={t("crm.clients.filters.customers", { count: customerClients })} />
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center">
            <BizuplyLoader size="lg" />
            <p className="text-sm font-bold text-slate-500">{t("crm.clients.loading")}</p>
          </div>
        ) : error ? (
          <div className="m-5 rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
            <p className="text-lg font-black text-red-700">
              {t("crm.clients.loadFailedTitle")}
            </p>
            <p className="mt-2 text-sm text-red-500">
              {t("crm.clients.loadFailedDescription")}
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
            {t("crm.clients.showing", { from: filteredClients.length, total: clients.length })}
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
            {t("crm.clients.perPage")}
          </button>
        </div>
      </section>
    </div>
  );
}

function ClientDetailsView({
  client,
  activeTab,
  setActiveTab,
  configuredFields,
  onBack,
  onEdit,
  onDelete,
  onSaveClientData,
  onSavePortalAccess,
  onSendPortalInvite,
}: {
  client: CRMClient;
  activeTab: ClientDetailTab;
  setActiveTab: (tab: ClientDetailTab) => void;
  configuredFields: ConfiguredClientField[];
  onBack: () => void;
  onEdit: () => void;
  onDelete: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  onSaveClientData: (values: ClientDataDraft) => Promise<void>;
  onSavePortalAccess: (settings: PortalAccessSettings) => Promise<void>;
  onSendPortalInvite: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const portalAccess = getPortalAccessSettings(client, t);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
        <div className="relative bg-gradient-to-br from-white via-sky-50/70 to-violet-50/60 p-5 sm:p-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />
          <div className="pointer-events-none absolute left-10 bottom-[-110px] h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-slate-950 text-lg font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                {getInitials(client.fullName) || (
                  <UserRound className="h-7 w-7" />
                )}
              </div>

              <div className="min-w-0">
                <button
                  type="button"
                  onClick={onBack}
                  className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-slate-600 shadow-sm ring-1 ring-slate-100 transition hover:bg-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("crm.clients.details.backToClients")}
                </button>

                <h2 className="truncate text-3xl font-black tracking-tight text-slate-950">
                  {client.fullName || t("crm.common.unnamedClient")}
                </h2>

                <p className="mt-1 text-sm font-bold text-slate-500">
                  {t("crm.clients.details.clientFile", {
                    phone: formatPhone(client.phone) || t("crm.common.noPhone"),
                    email: client.email || t("crm.common.noEmail"),
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Edit3 className="h-4 w-4" />
                {t("crm.common.edit")}
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" />
                {t("crm.common.delete")}
              </button>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ClientMiniMetric label={t("crm.clients.details.status")} value={getClientStatusLabel(getClientStatus(client), t)} />
            <ClientMiniMetric
              label={t("crm.clients.details.appointments")}
              value={
                Array.isArray(client.appointments)
                  ? client.appointments.length
                  : 0
              }
            />
            <ClientMiniMetric
              label={t("crm.clients.details.clientDataFields")}
              value={configuredFields.length}
            />
            <ClientMiniMetric
              label={t("crm.clients.details.portalAccess")}
              value={
                portalAccess.enabled
                  ? accessStatusLabel(portalAccess.status, t)
                  : t("crm.common.off")
              }
            />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white p-3">
          <div className="flex flex-wrap gap-2">
            <ClientTabButton
              active={activeTab === "profile"}
              icon={UserRound}
              label={t("crm.clients.details.tabProfile")}
              onClick={() => setActiveTab("profile")}
            />
            <ClientTabButton
              active={activeTab === "appointments"}
              icon={CalendarDays}
              label={t("crm.clients.details.tabAppointments")}
              onClick={() => setActiveTab("appointments")}
            />
            <ClientTabButton
              active={activeTab === "client-data"}
              icon={Layers3}
              label={t("crm.clients.details.tabClientData")}
              onClick={() => setActiveTab("client-data")}
            />
            <ClientTabButton
              active={activeTab === "portal-access"}
              icon={LockKeyhole}
              label={t("crm.clients.details.tabPortalAccess")}
              onClick={() => setActiveTab("portal-access")}
            />
          </div>
        </div>
      </section>

      {activeTab === "profile" && <ClientProfilePanel client={client} />}

      {activeTab === "appointments" && (
        <ClientAppointmentsPanel client={client} />
      )}

      {activeTab === "client-data" && (
        <ClientDataPanel
          client={client}
          fields={configuredFields}
          onSave={onSaveClientData}
        />
      )}

      {activeTab === "portal-access" && (
        <PortalAccessPanel
          client={client}
          settings={portalAccess}
          onSave={onSavePortalAccess}
          onSendInvite={onSendPortalInvite}
        />
      )}
    </div>
  );
}

function ClientTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition",
        active
          ? "bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.16)]"
          : "bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ClientMiniMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/80 bg-white/85 p-4 shadow-sm">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function ClientProfilePanel({ client }: { client: CRMClient }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const emDash = t("crm.common.emDash");

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-950">{t("crm.clients.profile.title")}</h3>
          <p className="text-sm font-bold text-slate-500">
            {t("crm.clients.profile.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={UserRound}
          label={t("crm.clients.profile.fullName")}
          value={client.fullName || emDash}
        />
        <InfoCard
          icon={Phone}
          label={t("crm.clients.profile.phone")}
          value={formatPhone(client.phone) || emDash}
        />
        <InfoCard icon={Mail} label={t("crm.clients.profile.email")} value={client.email || emDash} />
        <InfoCard icon={MapPin} label={t("crm.clients.profile.address")} value={client.address || emDash} />
      </div>

      <div className="mt-5 rounded-[1.7rem] border border-slate-100 bg-slate-50 p-5">
        <h4 className="text-base font-black text-slate-950">{t("crm.clients.profile.crmSummary")}</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SummaryBox label={t("crm.clients.profile.created")} value={formatDate(client.createdAt, locale, emDash)} />
          <SummaryBox label={t("crm.clients.profile.updated")} value={formatDate(client.updatedAt, locale, emDash)} />
          <SummaryBox
            label={t("crm.clients.profile.totalSpent")}
            value={t("crm.common.currencyAmount", {
              amount: Number(client.totalSpent || 0).toLocaleString(),
            })}
          />
        </div>
      </div>
    </section>
  );
}

function ClientAppointmentsPanel({ client }: { client: CRMClient }) {
  const { t } = useTranslation();
  const appointments = Array.isArray(client.appointments)
    ? client.appointments
    : [];

  return (
    <section className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-950">
              {t("crm.clients.appointmentsPanel.title")}
            </h3>
            <p className="text-sm font-bold text-slate-500">
              {t("crm.clients.appointmentsPanel.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-[1.7rem] border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-slate-300" />
          <h4 className="mt-3 text-xl font-black text-slate-950">
            {t("crm.clients.appointmentsPanel.emptyTitle")}
          </h4>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {t("crm.clients.appointmentsPanel.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {appointments.map((appointment, index) => (
            <ClientAppointmentCard
              key={getAppointmentId(appointment, index)}
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ClientAppointmentCard({ appointment }: { appointment: unknown }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";
  const emDash = t("crm.common.emDash");
  const item = appointment as Record<string, any>;
  const serviceName =
    item.serviceName ||
    item.service?.name ||
    item.title ||
    t("crm.clients.appointmentsPanel.defaultService");
  const date =
    item.date || item.appointmentDate || item.startDate || item.startAt;
  const time = item.time || item.appointmentTime || item.startHour || emDash;
  const duration =
    item.duration || item.durationMinutes || item.service?.duration || 30;
  const price = Number(item.price || item.service?.price || 0);
  const paid = Boolean(item.paid);

  return (
    <article className="rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm transition hover:border-sky-100 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-base font-black text-slate-950">
              {serviceName}
            </h4>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {t("crm.clients.appointmentsPanel.meta", {
                date: formatDate(date, locale, emDash),
                time,
                duration,
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {price > 0 && (
            <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700 ring-1 ring-slate-100">
              {t("crm.common.currencyAmount", { amount: price.toLocaleString() })}
            </span>
          )}

          <span
            className={[
              "rounded-full px-3 py-1.5 text-xs font-black",
              paid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {paid ? t("crm.common.paid") : t("crm.common.unpaid")}
          </span>
        </div>
      </div>
    </article>
  );
}

function ClientDataPanel({
  client,
  fields,
  onSave,
}: {
  client: CRMClient;
  fields: ConfiguredClientField[];
  onSave: (values: ClientDataDraft) => Promise<void>;
}) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const [draft, setDraft] = useState<ClientDataDraft>(() =>
    getClientDataValues(client, t),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(getClientDataValues(client, t));
  }, [client, t]);

  const updateValue = (key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      alert(t("crm.clients.clientDataPanel.savedAlert"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      dir={dir}
      className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700">
            <Layers3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-950">{t("crm.clients.clientDataPanel.title")}</h3>
            <p className="text-sm font-bold text-slate-500">
              {t("crm.clients.clientDataPanel.subtitle")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving || fields.length === 0}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? t("crm.common.saving") : t("crm.clients.clientDataPanel.savingData")}
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-[1.7rem] border border-dashed border-violet-200 bg-violet-50/40 p-10 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-violet-600" />
          <h4 className="mt-3 text-xl font-black text-slate-950">
            {t("crm.clients.clientDataPanel.emptyTitle")}
          </h4>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
            {t("crm.clients.clientDataPanel.emptyDescription")}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {fields.map((field) => (
            <ConfiguredFieldInput
              key={field.key}
              field={field}
              value={draft[field.key] ?? defaultFieldValue(field.type)}
              onChange={(value) => updateValue(field.key, value)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ConfiguredFieldInput({
  field,
  value,
  onChange,
}: {
  field: ConfiguredClientField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const { t } = useTranslation();
  const stringValue = value == null ? "" : String(value);

  if (field.type === "textarea" || field.type === "summary") {
    return (
      <DataFieldShell field={field} wide>
        <textarea
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder || field.description || ""}
          rows={4}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      </DataFieldShell>
    );
  }

  if (field.type === "select" || field.type === "status") {
    return (
      <DataFieldShell field={field}>
        <select
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          <option value="">{t("crm.common.select")}</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </DataFieldShell>
    );
  }

  if (field.type === "checkbox" || field.type === "boolean") {
    return (
      <DataFieldShell field={field}>
        <button
          type="button"
          onClick={() => onChange(!Boolean(value))}
          className={[
            "flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-sm font-black transition",
            Boolean(value)
              ? "border-violet-300 bg-violet-50 text-violet-700"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
          ].join(" ")}
        >
          <span>{Boolean(value) ? t("crm.common.yes") : t("crm.common.no")}</span>
          <span
            className={[
              "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
              Boolean(value)
                ? "border-violet-700 bg-violet-700 text-white"
                : "border-slate-300 bg-white text-transparent",
            ].join(" ")}
          >
            ✓
          </span>
        </button>
      </DataFieldShell>
    );
  }

  if (field.type === "checklist") {
    const selected = Array.isArray(value) ? value.map(String) : [];

    return (
      <DataFieldShell field={field} wide>
        <div className="grid gap-2 sm:grid-cols-2">
          {(field.options || []).map((option) => {
            const checked = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  const next = checked
                    ? selected.filter((item) => item !== option)
                    : [...selected, option];
                  onChange(next);
                }}
                className={[
                  "rounded-2xl border p-3 text-start text-sm font-black transition",
                  checked
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white",
                ].join(" ")}
              >
                {option}
              </button>
            );
          })}
        </div>
      </DataFieldShell>
    );
  }

  return (
    <DataFieldShell field={field}>
      <input
        type={inputTypeForField(field.type)}
        value={stringValue}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder || field.description || ""}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </DataFieldShell>
  );
}

function DataFieldShell({
  field,
  wide,
  children,
}: {
  field: ConfiguredClientField;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className={wide ? "lg:col-span-2" : ""}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-slate-800">
          {field.label}
          {field.required && <span className="mr-1 text-rose-500">*</span>}
        </label>
        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700 ring-1 ring-violet-100">
          {getFieldTypeLabel(field.type, t)}
        </span>
      </div>
      {children}
      <p className="mt-2 text-xs font-bold text-slate-400">
        {"{{"}
        {field.key}
        {"}}"}
      </p>
    </div>
  );
}

function inputTypeForField(type: CustomFieldType) {
  if (type === "number") return "number";
  if (type === "date") return "date";
  if (type === "email") return "email";
  if (type === "phone") return "tel";
  if (type === "link") return "url";
  if (type === "file" || type === "image") return "url";
  return "text";
}

function PortalAccessPanel({
  client,
  settings,
  onSave,
  onSendInvite,
}: {
  client: CRMClient;
  settings: PortalAccessSettings;
  onSave: (settings: PortalAccessSettings) => Promise<void>;
  onSendInvite: () => Promise<void>;
}) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const locale = i18n.language || "en";
  const emDash = t("crm.common.emDash");
  const [draft, setDraft] = useState<PortalAccessSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const update = <K extends keyof PortalAccessSettings>(
    key: K,
    value: PortalAccessSettings[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(draft);
      alert(t("crm.clients.portal.savedAlert"));
    } finally {
      setSaving(false);
    }
  };

  const sendInvite = async () => {
    setSending(true);
    try {
      await onSendInvite();
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      dir={dir}
      className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-950">
              {t("crm.clients.portal.title")}
            </h3>
            <p className="text-sm font-bold text-slate-500">
              {t("crm.clients.portal.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={sendInvite}
            disabled={sending || !draft.loginEmail}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail className="h-4 w-4" />
            {sending ? t("crm.clients.portal.sending") : t("crm.clients.portal.sendInvitation")}
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? t("crm.common.saving") : t("crm.clients.portal.savingAccess")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.7rem] border border-slate-100 bg-slate-50 p-5">
          <button
            type="button"
            onClick={() => update("enabled", !draft.enabled)}
            className={[
              "flex w-full items-center justify-between rounded-2xl border p-4 text-start transition",
              draft.enabled
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <div>
              <p className="text-sm font-black text-slate-950">
                {t("crm.clients.portal.privateAccess")}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500">
                {t("crm.clients.portal.privateAccessHint")}
              </p>
            </div>
            <span
              className={[
                "grid h-7 w-7 place-items-center rounded-full border text-xs font-black",
                draft.enabled
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-transparent",
              ].join(" ")}
            >
              ✓
            </span>
          </button>

          <div className="mt-4 grid gap-4">
            <PortalFormField label={t("crm.clients.portal.accessStatus")}>
              <select
                value={draft.status}
                onChange={(event) =>
                  update(
                    "status",
                    event.target.value as PortalAccessSettings["status"],
                  )
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              >
                <option value="not_invited">{t("crm.common.notInvited")}</option>
                <option value="invited">{t("crm.common.invited")}</option>
                <option value="active">{t("crm.common.active")}</option>
                <option value="paused">{t("crm.common.paused")}</option>
              </select>
            </PortalFormField>

            <PortalFormField label={t("crm.clients.portal.loginEmail")}>
              <input
                type="email"
                value={draft.loginEmail}
                onChange={(event) => update("loginEmail", event.target.value)}
                placeholder={client.email || t("crm.clients.portal.emailPlaceholder")}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </PortalFormField>
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-slate-100 bg-slate-50 p-5">
          <div className="grid gap-4">
            <PortalFormField label={t("crm.clients.portal.paymentType")}>
              <select
                value={draft.paymentStatus}
                onChange={(event) =>
                  update(
                    "paymentStatus",
                    event.target.value as PortalAccessSettings["paymentStatus"],
                  )
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              >
                <option value="included">{t("crm.clients.portal.paymentIncluded")}</option>
                <option value="free">{t("crm.clients.portal.paymentFree")}</option>
                <option value="paid">{t("crm.clients.portal.paymentPaid")}</option>
                <option value="unpaid">{t("crm.clients.portal.paymentUnpaid")}</option>
              </select>
            </PortalFormField>

            <PortalFormField label={t("crm.clients.portal.monthlyPrice")}>
              <input
                type="number"
                value={draft.monthlyPrice}
                onChange={(event) => update("monthlyPrice", event.target.value)}
                placeholder="0"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </PortalFormField>

            <PortalFormField label={t("crm.clients.portal.enabledPages")}>
              <textarea
                value={draft.pages}
                onChange={(event) => update("pages", event.target.value)}
                placeholder={t("crm.clients.portal.pagesPlaceholder")}
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-950 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
              />
            </PortalFormField>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.7rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <SummaryBox label={t("crm.clients.portal.statusSummary")} value={accessStatusLabel(draft.status, t)} />
          <SummaryBox label={t("crm.clients.portal.loginEmail")} value={draft.loginEmail || emDash} />
          <SummaryBox
            label={t("crm.clients.portal.lastInvitation")}
            value={
              draft.lastInviteSentAt
                ? formatDate(draft.lastInviteSentAt, locale, emDash)
                : t("crm.clients.portal.notSent")
            }
          />
        </div>
      </div>
    </section>
  );
}

function PortalFormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-100 bg-slate-50 p-4">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 truncate text-base font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SummaryBox({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-base font-black text-slate-950">{value}</p>
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
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1120px] w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-white text-start">
            <th className="w-12 px-4 py-4">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-500"
              />
            </th>
            <TableHead>{t("crm.clients.table.customer")}</TableHead>
            <TableHead>{t("crm.clients.table.contactDetails")}</TableHead>
            <TableHead>{t("crm.clients.table.location")}</TableHead>
            <TableHead>{t("crm.clients.table.status")}</TableHead>
            <TableHead>{t("crm.clients.table.appointments")}</TableHead>
            <TableHead>{t("crm.clients.table.portalAccess")}</TableHead>
            <TableHead>{t("crm.clients.table.clientData")}</TableHead>
            <TableHead>{t("crm.clients.table.totalSpent")}</TableHead>
            <TableHead align="right">{t("crm.clients.table.actions")}</TableHead>
          </tr>
        </thead>

        <tbody>
          {clients.map((client) => {
            const status = getClientStatus(client);
            const initials = getInitials(client.fullName);
            const portalAccess = getPortalAccessSettings(client, t);
            const dataValues = Object.keys(getClientDataValues(client, t)).length;

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
                        {client.fullName || t("crm.common.unnamedClient")}
                      </p>
                      <p className="truncate text-xs font-semibold text-slate-400">
                        {client.address || t("crm.clients.table.noAddress")}
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
                    {client.address || t("crm.common.emDash")}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">{t("crm.clients.table.israel")}</p>
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={status} />
                </td>

                <td className="px-4 py-4 text-center">
                  <p className="text-sm font-black text-slate-900">
                    {client.appointments?.length || 0}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {t("crm.clients.table.customerOnly")}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={[
                      "inline-flex rounded-xl px-3 py-1.5 text-xs font-black",
                      portalAccess.enabled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-50 text-slate-500",
                    ].join(" ")}
                  >
                    {portalAccess.enabled
                      ? accessStatusLabel(portalAccess.status, t)
                      : t("crm.common.off")}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">
                  <p className="text-sm font-black text-slate-900">
                    {dataValues}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">{t("crm.clients.table.values")}</p>
                </td>

                <td className="px-4 py-4">
                  <p className="text-sm font-black text-slate-900">
                    {t("crm.common.currencyAmount", {
                      amount: Number(client.totalSpent || 0).toLocaleString(),
                    })}
                  </p>
                </td>

                <td
                  className="px-4 py-4 text-start"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(client)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-950 hover:text-white"
                      aria-label={t("crm.clients.table.openClient")}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => onDelete(client, event)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-600 hover:text-white"
                      aria-label={t("crm.clients.table.deleteClient")}
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
  const { t } = useTranslation();

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
            {mode === "create"
              ? t("crm.clients.form.newContact")
              : t("crm.clients.form.editContact")}
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-950">
            {mode === "create"
              ? t("crm.clients.form.addClient")
              : t("crm.clients.form.editClient")}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {t("crm.clients.form.subtitle")}
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
        <FormField label={t("crm.clients.form.fullName")} required>
          <input
            placeholder={t("crm.clients.form.fullName")}
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

        <FormField label={t("crm.clients.form.phone")} required>
          <input
            placeholder={t("crm.clients.form.phone")}
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

        <FormField label={t("crm.clients.form.email")}>
          <input
            placeholder={t("crm.clients.form.email")}
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

        <FormField label={t("crm.clients.form.address")}>
          <input
            placeholder={t("crm.clients.form.address")}
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
          {t("crm.common.cancel")}
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? t("crm.common.saving") : t("crm.clients.form.saveClient")}
        </button>
      </div>
    </div>
  );
}

function HeroMock() {
  return (
    <div className="relative hidden h-44 xl:block">
      <div className="absolute left-10 top-0 h-40 w-72 rounded-3xl border border-white bg-white/70 shadow-[0_24px_60px_rgba(14,165,233,0.16)] backdrop-blur" />
      <div className="absolute left-44 top-12 flex h-24 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 shadow-sm">
        <UserRound className="h-10 w-10 text-sky-700" />
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
  const { t } = useTranslation();
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
            {t("crm.clients.stats.comparedToLast30Days")}
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
        align === "right" ? "text-start" : "text-start",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: ClientStatus }) {
  const { t } = useTranslation();
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
      {getClientStatusLabel(status, t)}
    </span>
  );
}

function EmptyClientsState({ onCreate }: { onCreate: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm">
        <UsersRound className="h-7 w-7" />
      </div>

      <h4 className="text-xl font-black text-slate-950">{t("crm.clients.emptyTitle")}</h4>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {t("crm.clients.emptyDescription")}
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
      >
        <Plus className="h-5 w-5" />
        {t("crm.clients.createClient")}
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

function formatDate(value?: unknown, locale = "en-US", emDash = "—") {
  if (!value) return emDash;

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function getAppointmentId(appointment: unknown, index: number) {
  const item = appointment as Record<string, any>;
  return String(item._id || item.id || item.appointmentId || index);
}

function accessStatusLabel(
  status: PortalAccessSettings["status"],
  t: TFunction,
) {
  if (status === "active") return t("crm.common.active");
  if (status === "invited") return t("crm.common.invited");
  if (status === "paused") return t("crm.common.paused");
  return t("crm.common.notInvited");
}