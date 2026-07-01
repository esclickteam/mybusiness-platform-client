"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Copy,
  CalendarDays,
  Hash,
  Link as LinkIcon,
  Eye,
  FileText,
  Globe2,
  KeyRound,
  Layers3,
  ListChecks,
  LockKeyhole,
  Mail,
  MonitorSmartphone,
  PencilLine,
  Plus,
  Save,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type PortalStatus = "active" | "draft" | "paused";
type PageAccessType = "free" | "included" | "paid";
type ClientStatus = "not_invited" | "invited" | "active" | "paused";
type PaymentStatus = "free" | "included" | "paid" | "unpaid";

type FieldType =
  | "text"
  | "textarea"
  | "summary"
  | "number"
  | "date"
  | "checkbox"
  | "boolean"
  | "checklist"
  | "status"
  | "select"
  | "link"
  | "email"
  | "phone"
  | "file"
  | "image";

type PortalField = {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
};

type CustomClientField = {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  description: string;
  placeholder: string;
  options: string[];
  required: boolean;
  showInClientProfile: boolean;
  showInClientPortal: boolean;
  clientCanEdit: boolean;
  active: boolean;
  order: number;
};

type PortalPage = {
  id: string;
  title: string;
  description: string;
  path: string;
  accessType: PageAccessType;
  dataMode: "per_client" | "shared";
  owner: "business" | "client" | "both";
  submissionsCount: number;
  lastUpdated: string;
  fields: PortalField[];
};

type PortalSystem = {
  id: string;
  name: string;
  description: string;
  websitePath: string;
  status: PortalStatus;
  monthlyPrice: number;
  currency: string;
  pages: PortalPage[];
};

type ClientAccess = {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  status: ClientStatus;
  paymentStatus: PaymentStatus;
  assignedPageIds: string[];
  monthlyPrice: number;
  lastActivity: string;
  dataEntries: number;
};

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

type ClientPageValues = Record<string, unknown>;

type EditorContext = {
  clientId: string;
  pageId: string;
};

const portalSystem: PortalSystem = {
  id: "main-client-portal",
  name: "Personal Client Area",
  description:
    "The system itself is built in the site builder. Here in the CRM, you manage which clients can log in, which pages are open to them, and their personal data.",
  websitePath: "/client-area",
  status: "active",
  monthlyPrice: 30,
  currency: "USD",
  pages: [
    {
      id: "page-1",
      title: "Personal Dashboard",
      description:
        "A personal client entry page with information, status, links, and an activity summary.",
      path: "/client-area/dashboard",
      accessType: "included",
      dataMode: "per_client",
      owner: "business",
      submissionsCount: 42,
      lastUpdated: "Today",
      fields: [
        {
          id: "mainTitle",
          label: "Main title for the client",
          type: "text",
          placeholder: "For example: Welcome to your personal area",
        },
        {
          id: "summary",
          label: "Personal summary",
          type: "textarea",
          placeholder: "Enter a personal summary that will appear for the client",
        },
        {
          id: "status",
          label: "Client status",
          type: "status",
          options: ["Active", "Pending", "Requires attention", "Completed"],
        },
      ],
    },
    {
      id: "page-2",
      title: "Tracking Form",
      description:
        "A page where the client enters data, and the business sees it inside the CRM.",
      path: "/client-area/tracking",
      accessType: "paid",
      dataMode: "per_client",
      owner: "client",
      submissionsCount: 89,
      lastUpdated: "Yesterday",
      fields: [
        {
          id: "trackingDate",
          label: "Tracking date",
          type: "date",
        },
        {
          id: "clientUpdate",
          label: "Client update",
          type: "textarea",
          placeholder: "The client will enter a personal update here",
        },
        {
          id: "businessNote",
          label: "Business response / note",
          type: "textarea",
          placeholder: "The business can respond to the client here",
        },
        {
          id: "approved",
          label: "Marked as handled",
          type: "checkbox",
        },
      ],
    },
    {
      id: "page-3",
      title: "Personal Plan",
      description:
        "A page the business fills out separately for each client, and the client sees only their own content.",
      path: "/client-area/plan",
      accessType: "paid",
      dataMode: "per_client",
      owner: "business",
      submissionsCount: 27,
      lastUpdated: "3 days ago",
      fields: [
        {
          id: "planTitle",
          label: "Plan name",
          type: "text",
          placeholder: "Personal plan name",
        },
        {
          id: "planDescription",
          label: "Instructions for the client",
          type: "textarea",
          placeholder: "Instructions, explanations, what to do and when",
        },
        {
          id: "tasks",
          label: "Task / item list",
          type: "checklist",
        },
        {
          id: "attachmentUrl",
          label: "File / document link",
          type: "file",
          placeholder: "https://...",
        },
      ],
    },
    {
      id: "page-4",
      title: "Files and Recommendations",
      description: "A page for files, documents, recommendations, and personal content per client.",
      path: "/client-area/files",
      accessType: "included",
      dataMode: "per_client",
      owner: "business",
      submissionsCount: 18,
      lastUpdated: "This week",
      fields: [
        {
          id: "recommendationTitle",
          label: "Recommendation title",
          type: "text",
          placeholder: "Title that will appear to the client",
        },
        {
          id: "recommendationText",
          label: "Recommendation content",
          type: "textarea",
          placeholder: "Personal recommendation, explanation, or summary",
        },
        {
          id: "fileUrl",
          label: "File link",
          type: "file",
          placeholder: "https://...",
        },
        {
          id: "visibleToClient",
          label: "Show to client",
          type: "checkbox",
        },
      ],
    },
  ],
};

const initialClients: ClientAccess[] = [
  {
    id: "client-1",
    clientName: "Ben Eshet",
    email: "ben@example.com",
    phone: "0500000000",
    status: "active",
    paymentStatus: "paid",
    assignedPageIds: ["page-1", "page-2", "page-3", "page-4"],
    monthlyPrice: 30,
    lastActivity: "Today",
    dataEntries: 18,
  },
  {
    id: "client-2",
    clientName: "Dana Cohen",
    email: "dana@example.com",
    phone: "0520000000",
    status: "invited",
    paymentStatus: "included",
    assignedPageIds: ["page-1", "page-4"],
    monthlyPrice: 0,
    lastActivity: "Waiting for password setup",
    dataEntries: 0,
  },
  {
    id: "client-3",
    clientName: "Ron Levy",
    email: "ron@example.com",
    phone: "0540000000",
    status: "not_invited",
    paymentStatus: "unpaid",
    assignedPageIds: ["page-1", "page-2"],
    monthlyPrice: 30,
    lastActivity: "Invitation not sent",
    dataEntries: 0,
  },
];

const initialClientPageData: Record<string, ClientPageValues> = {
  "client-1_page-3": {
    planTitle: "Personal plan for the coming month",
    planDescription: "Here the business fills in personal content that the client will see in their personal area.",
    tasks: [
      { id: "task-1", text: "First item to complete", checked: true },
      { id: "task-2", text: "Second item to complete", checked: false },
    ],
    attachmentUrl: "",
  },
};

const CUSTOM_CLIENT_FIELDS_STORAGE_KEY = "bizuply_custom_client_fields";

const defaultClientDataFields: CustomClientField[] = [
  {
    id: "client_weight",
    key: "weight",
    label: "Weight",
    type: "number",
    description: "Example numeric data that will appear in the client profile",
    placeholder: "For example: 72",
    options: [],
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    active: true,
    order: 1,
  },
  {
    id: "client_summary",
    key: "summary",
    label: "Client summary",
    type: "summary",
    description: "Internal summary / long text for each client",
    placeholder: "Write a personal summary for the client here",
    options: [],
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    active: true,
    order: 2,
  },
  {
    id: "client_status",
    key: "client_status",
    label: "Client status",
    type: "status",
    description: "Work status with the client",
    placeholder: "",
    options: ["New", "In progress", "Waiting", "Completed", "Canceled"],
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    active: true,
    order: 3,
  },
];

function normalizeClientDataField(field: Partial<CustomClientField>, index: number): CustomClientField {
  const label = String(field.label || "").trim() || `Field ${index + 1}`;
  const key = cleanKey(String(field.key || label)) || `field_${index + 1}`;
  const typeList: FieldType[] = [
    "text",
    "textarea",
    "summary",
    "number",
    "date",
    "checkbox",
    "boolean",
    "checklist",
    "status",
    "select",
    "link",
    "email",
    "phone",
    "file",
    "image",
  ];

  return {
    id: String(field.id || uid("client_field")),
    key,
    label,
    type: typeList.includes(field.type as FieldType) ? (field.type as FieldType) : "text",
    description: String(field.description || ""),
    placeholder: String(field.placeholder || ""),
    options: Array.isArray(field.options) ? field.options.map(String) : [],
    required: Boolean(field.required),
    showInClientProfile: field.showInClientProfile !== false,
    showInClientPortal: Boolean(field.showInClientPortal),
    clientCanEdit: Boolean(field.clientCanEdit),
    active: field.active !== false,
    order: Number(field.order) || index + 1,
  };
}

function loadClientDataFields(): CustomClientField[] {
  if (typeof window === "undefined") return defaultClientDataFields;

  try {
    const raw = window.localStorage.getItem(CUSTOM_CLIENT_FIELDS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    const list = Array.isArray(parsed) ? parsed : defaultClientDataFields;
    return list.map(normalizeClientDataField).sort((a, b) => a.order - b.order);
  } catch {
    return defaultClientDataFields;
  }
}

function saveClientDataFields(fields: CustomClientField[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    CUSTOM_CLIENT_FIELDS_STORAGE_KEY,
    JSON.stringify(fields.map((field, index) => ({ ...field, order: index + 1 })))
  );
}

function createClientDataField(count: number): CustomClientField {
  return {
    id: uid("client_field"),
    key: `field_${count + 1}`,
    label: `Field ${count + 1}`,
    type: "text",
    description: "",
    placeholder: "",
    options: [],
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    active: true,
    order: count + 1,
  };
}

function fieldTypeLabel(type: FieldType) {
  if (type === "text") return "Short text / word / line";
  if (type === "textarea") return "Long text";
  if (type === "summary") return "Summary";
  if (type === "number") return "Number";
  if (type === "date") return "Date";
  if (type === "checkbox") return "Checkbox";
  if (type === "boolean") return "Yes / No";
  if (type === "checklist") return "Checklist";
  if (type === "status") return "Status";
  if (type === "select") return "Dropdown selection";
  if (type === "link") return "Link";
  if (type === "email") return "Email";
  if (type === "phone") return "Phone";
  if (type === "file") return "File";
  if (type === "image") return "Image";
  return "Text";
}

function getClientFieldIcon(type: FieldType) {
  if (type === "number") return Hash;
  if (type === "date") return CalendarDays;
  if (type === "status" || type === "select" || type === "checklist") return ListChecks;
  if (type === "file" || type === "image" || type === "summary" || type === "textarea") return FileText;
  if (type === "link") return LinkIcon;
  if (type === "email") return Mail;
  if (type === "phone") return Users;
  if (type === "checkbox" || type === "boolean") return CheckCircle2;
  return Settings2;
}

function portalStatusLabel(status: PortalStatus) {
  if (status === "active") return "Active on site";
  if (status === "paused") return "Paused";
  return "Draft";
}

function clientStatusLabel(status: ClientStatus) {
  if (status === "active") return "Active";
  if (status === "invited") return "Invited";
  if (status === "paused") return "Paused";
  return "Not invited";
}

function paymentStatusLabel(status: PaymentStatus) {
  if (status === "paid") return "Paid subscription";
  if (status === "included") return "Included in service";
  if (status === "unpaid") return "Awaiting payment";
  return "Free";
}

function pageAccessLabel(accessType: PageAccessType) {
  if (accessType === "paid") return "Paid";
  if (accessType === "included") return "Included";
  return "Free";
}

function ownerLabel(owner: PortalPage["owner"]) {
  if (owner === "business") return "Business updates";
  if (owner === "client") return "Client fills in";
  return "Business and client";
}

function safeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return String(Date.now());
}

function uid(prefix = "id") {
  return `${prefix}_${safeId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function cleanKey(value: string) {
  const hebrewMap: Record<string, string> = {
    א: "a",
    ב: "b",
    ג: "g",
    ד: "d",
    ה: "h",
    ו: "v",
    ז: "z",
    ח: "ch",
    ט: "t",
    י: "y",
    כ: "k",
    ך: "k",
    ל: "l",
    מ: "m",
    ם: "m",
    נ: "n",
    ן: "n",
    ס: "s",
    ע: "a",
    פ: "p",
    ף: "p",
    צ: "tz",
    ץ: "tz",
    ק: "k",
    ר: "r",
    ש: "sh",
    ת: "t",
  };

  const text = String(value || "")
    .trim()
    .toLowerCase()
    .split("")
    .map((char) => hebrewMap[char] || char)
    .join("");

  return text
    .replace(/[^a-z0-9_\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getDataKey(clientId: string, pageId: string) {
  return `${clientId}_${pageId}`;
}

function createDefaultValues(page: PortalPage): ClientPageValues {
  return page.fields.reduce<ClientPageValues>((acc, field) => {
    if (field.type === "checkbox") acc[field.id] = false;
    else if (field.type === "checklist") acc[field.id] = [];
    else acc[field.id] = "";

    return acc;
  }, {});
}

export default function MiniSaaSManager() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<ClientAccess[]>(initialClients);
  const [clientPageData, setClientPageData] =
    useState<Record<string, ClientPageValues>>(initialClientPageData);

  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialClients[0]?.id || ""
  );

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editorContext, setEditorContext] = useState<EditorContext | null>(null);
  const [previewContext, setPreviewContext] = useState<EditorContext | null>(
    null
  );
  const [toast, setToast] = useState("");

  const [clientDataFields, setClientDataFields] = useState<CustomClientField[]>(
    () => loadClientDataFields()
  );

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("paid");
  const [monthlyPrice, setMonthlyPrice] = useState(
    String(portalSystem.monthlyPrice)
  );
  const [assignedPageIds, setAssignedPageIds] = useState<string[]>(
    portalSystem.pages.map((page) => page.id)
  );

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return clients;

    return clients.filter((client) => {
      return (
        client.clientName.toLowerCase().includes(q) ||
        client.email.toLowerCase().includes(q) ||
        client.phone.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  const selectedClient = useMemo(() => {
    return clients.find((client) => client.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const selectedClientPages = useMemo(() => {
    if (!selectedClient) return [];

    return portalSystem.pages.filter((page) =>
      selectedClient.assignedPageIds.includes(page.id)
    );
  }, [selectedClient]);

  const editorClient = useMemo(() => {
    if (!editorContext) return null;
    return clients.find((client) => client.id === editorContext.clientId) || null;
  }, [clients, editorContext]);

  const editorPage = useMemo(() => {
    if (!editorContext) return null;
    return (
      portalSystem.pages.find((page) => page.id === editorContext.pageId) || null
    );
  }, [editorContext]);

  const previewClient = useMemo(() => {
    if (!previewContext) return null;
    return clients.find((client) => client.id === previewContext.clientId) || null;
  }, [clients, previewContext]);

  const previewPage = useMemo(() => {
    if (!previewContext) return null;
    return (
      portalSystem.pages.find((page) => page.id === previewContext.pageId) ||
      null
    );
  }, [previewContext]);

  useEffect(() => {
    saveClientDataFields(clientDataFields);
  }, [clientDataFields]);

  const syncClientDataFields = (nextFields: CustomClientField[]) => {
    const normalized = nextFields
      .map(normalizeClientDataField)
      .sort((a, b) => a.order - b.order)
      .map((field, index) => ({ ...field, order: index + 1 }));

    setClientDataFields(normalized);
    saveClientDataFields(normalized);
  };

  const addClientDataField = () => {
    syncClientDataFields([
      ...clientDataFields,
      createClientDataField(clientDataFields.length),
    ]);
    showToast("A new field was added to the client profile");
  };

  const updateClientDataField = (
    fieldId: string,
    patch: Partial<CustomClientField>
  ) => {
    syncClientDataFields(
      clientDataFields.map((field) => {
        if (field.id !== fieldId) return field;

        const nextLabel = patch.label ?? field.label;
        const shouldUpdateKey =
          patch.label !== undefined &&
          (!field.key || field.key.startsWith("field_") || field.key.startsWith("field_"));

        return {
          ...field,
          ...patch,
          key: shouldUpdateKey ? cleanKey(nextLabel) || field.key : patch.key ?? field.key,
        };
      })
    );
  };

  const deleteClientDataField = (fieldId: string) => {
    if (!window.confirm("Delete this field from client profiles?")) return;

    syncClientDataFields(clientDataFields.filter((field) => field.id !== fieldId));
    showToast("The field was deleted");
  };

  const duplicateClientDataField = (field: CustomClientField) => {
    const copy: CustomClientField = {
      ...field,
      id: uid("client_field"),
      key: `${field.key}_copy`,
      label: `${field.label} - Copy`,
      order: clientDataFields.length + 1,
    };

    syncClientDataFields([...clientDataFields, copy]);
    showToast("The field was duplicated");
  };

  const activeClients = clients.filter(
    (client) => client.status === "active"
  ).length;

  const invitedClients = clients.filter(
    (client) => client.status === "invited"
  ).length;

  const monthlyRevenue = clients.reduce((sum, client) => {
    if (client.paymentStatus !== "paid") return sum;
    return sum + Number(client.monthlyPrice || 0);
  }, 0);

  const toggleAssignedPage = (pageId: string) => {
    setAssignedPageIds((prev) => {
      if (prev.includes(pageId)) {
        return prev.filter((id) => id !== pageId);
      }

      return [...prev, pageId];
    });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const resetInviteForm = () => {
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setPaymentStatus("paid");
    setMonthlyPrice(String(portalSystem.monthlyPrice));
    setAssignedPageIds(portalSystem.pages.map((page) => page.id));
  };

  const createInvite = () => {
    const cleanName = clientName.trim();
    const cleanEmail = clientEmail.trim();

    if (!cleanName || !cleanEmail) return;

    const nextClient: ClientAccess = {
      id: safeId(),
      clientName: cleanName,
      email: cleanEmail,
      phone: clientPhone.trim(),
      status: "invited",
      paymentStatus,
      assignedPageIds,
      monthlyPrice: paymentStatus === "paid" ? Number(monthlyPrice || 0) : 0,
      lastActivity: "Invited now",
      dataEntries: 0,
    };

    const newData: Record<string, ClientPageValues> = {};

    assignedPageIds.forEach((pageId) => {
      const page = portalSystem.pages.find((item) => item.id === pageId);
      if (!page) return;
      newData[getDataKey(nextClient.id, pageId)] = createDefaultValues(page);
    });

    setClients((prev) => [nextClient, ...prev]);
    setClientPageData((prev) => ({ ...prev, ...newData }));
    setSelectedClientId(nextClient.id);
    setShowInviteModal(false);
    resetInviteForm();
    showToast("The client was added and a password setup invitation was sent");
  };

  const openPageEditor = (clientId: string, pageId: string) => {
    const page = portalSystem.pages.find((item) => item.id === pageId);
    if (!page) return;

    const key = getDataKey(clientId, pageId);

    setClientPageData((prev) => {
      if (prev[key]) return prev;

      return {
        ...prev,
        [key]: createDefaultValues(page),
      };
    });

    setEditorContext({ clientId, pageId });
  };

  const openPagePreview = (clientId: string, pageId: string) => {
    const page = portalSystem.pages.find((item) => item.id === pageId);
    if (!page) return;

    const key = getDataKey(clientId, pageId);

    setClientPageData((prev) => {
      if (prev[key]) return prev;

      return {
        ...prev,
        [key]: createDefaultValues(page),
      };
    });

    setPreviewContext({ clientId, pageId });
  };

  const saveFieldValue = (fieldId: string, value: unknown) => {
    if (!editorContext) return;

    const key = getDataKey(editorContext.clientId, editorContext.pageId);

    setClientPageData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [fieldId]: value,
      },
    }));
  };

  const saveEditor = () => {
    if (!editorContext) return;

    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== editorContext.clientId) return client;

        return {
          ...client,
          dataEntries: client.dataEntries + 1,
          lastActivity: "Updated now",
        };
      })
    );

    setEditorContext(null);
    showToast("The data was saved for the client");
  };

  const sendPasswordInvite = (clientId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;

        return {
          ...client,
          status: client.status === "active" ? "active" : "invited",
          lastActivity: "Invitation sent now",
        };
      })
    );

    showToast("Password setup email sent");
  };

  const resetPassword = (clientId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;

        return {
          ...client,
          lastActivity: "Password reset sent",
        };
      })
    );

    showToast("Password reset email sent");
  };

  const copyClientLoginLink = async () => {
    const link = `${window.location.origin}${portalSystem.websitePath}/login`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied");
    } catch {
      showToast(link);
    }
  };

  const openSiteBuilder = () => {
    navigate("../../site-builder", { relative: "path" });
  };

  return (
    <section
      dir="ltr"
      className="min-h-screen bg-[#F4F7FB] p-4 text-slate-950 md:p-7"
    >
      {toast && (
        <div className="fixed left-1/2 top-5 z-[80] -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-2xl">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="relative p-5 md:p-7">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-100/80 blur-3xl" />
            <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 ring-1 ring-violet-100">
                  <Sparkles size={14} />
                  Client Portal / Mini SaaS
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-4xl">
                  Client area connected to the website
                  <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">
                    with personal data for every client.
                  </span>
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-500 md:text-base">
                  The pages themselves are built in the site builder. Here the business manages clients,
                  permissions, password setup invitations, page access, personal data,
                  and monthly payments.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:justify-end">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-[0_14px_36px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  <UserPlus size={17} />
                  Add client to personal area
                </button>

                <button
                  type="button"
                  onClick={openSiteBuilder}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  <MonitorSmartphone size={17} />
                  Open in site builder
                </button>
              </div>
            </div>

            <div className="relative mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Layers3 size={17} />}
                label="Website pages"
                value={portalSystem.pages.length}
                text="Personal area pages"
              />
              <StatCard
                icon={<Users size={17} />}
                label="Clients"
                value={clients.length}
                text={`${activeClients} active`}
              />
              <StatCard
                icon={<Mail size={17} />}
                label="Invitations"
                value={invitedClients}
                text="Waiting for password setup"
              />
              <StatCard
                icon={<BadgeDollarSign size={17} />}
                label="Monthly revenue"
                value={`$${monthlyRevenue}`}
                text="From paying clients"
              />
            </div>
          </div>
        </header>

        <ClientDataFieldsManager
          fields={clientDataFields}
          onAdd={addClientDataField}
          onUpdate={updateClientDataField}
          onDelete={deleteClientDataField}
          onDuplicate={duplicateClientDataField}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <main className="space-y-5">
            <section className="rounded-[28px] border border-white/80 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-5">
              <SectionHeader
                badge="Website pages"
                title="Pages built on the website"
                text="These are the pages the business created in the site builder and marked as a personal area. Data is saved per client."
                action={
                  <button
                    type="button"
                    onClick={openSiteBuilder}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                  >
                    <Plus size={17} />
                    Add page in site builder
                  </button>
                }
              />

              <div className="grid gap-3">
                {portalSystem.pages.map((page) => (
                  <PortalPageCard
                    key={page.id}
                    page={page}
                    onEdit={() => {
                      if (!selectedClient) {
                        showToast("Select a client from the list first");
                        return;
                      }

                      openPageEditor(selectedClient.id, page.id);
                    }}
                    onPreview={() => {
                      if (!selectedClient) {
                        showToast("Select a client from the list first");
                        return;
                      }

                      openPagePreview(selectedClient.id, page.id);
                    }}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/80 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-5">
              <SectionHeader
                badge="Clients access"
                title="Clients with access"
                text="Here the business opens access for each client, sends a password setup email, and defines which pages are open to them."
                action={
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-black text-white shadow-[0_18px_50px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:bg-violet-800"
                  >
                    <UserPlus size={17} />
                    Add client
                  </button>
                }
              />

              <div className="relative mb-5">
                <Search
                  size={18}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pr-12 pl-4 text-sm font-bold outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="grid gap-3">
                {filteredClients.map((client) => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    selected={client.id === selectedClientId}
                    onClick={() => setSelectedClientId(client.id)}
                  />
                ))}
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-white/80 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.06)] md:p-5 xl:sticky xl:top-6">
              {selectedClient ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                        <ShieldCheck size={14} />
                        {clientStatusLabel(selectedClient.status)}
                      </div>

                      <h2 className="mt-3 text-2xl font-black text-slate-950">
                        {selectedClient.clientName}
                      </h2>

                      <p className="mt-1 text-sm font-bold text-slate-500">
                        {selectedClient.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast("In the next step, we will connect client settings here")}
                      className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                    >
                      <Settings2 size={17} />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <ActionButton
                      icon={<Send size={16} />}
                      onClick={() => sendPasswordInvite(selectedClient.id)}
                    >
                      Send password setup email
                    </ActionButton>

                    <ActionButton
                      icon={<KeyRound size={16} />}
                      onClick={() => resetPassword(selectedClient.id)}
                    >
                      Reset password
                    </ActionButton>

                    <ActionButton
                      icon={<Eye size={16} />}
                      onClick={() => {
                        const firstPage = selectedClientPages[0];

                        if (!firstPage) {
                          showToast("No pages are open for this client");
                          return;
                        }

                        openPagePreview(selectedClient.id, firstPage.id);
                      }}
                    >
                      View as client
                    </ActionButton>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <SideMetric
                      label="Payment"
                      value={paymentStatusLabel(selectedClient.paymentStatus)}
                    />
                    <SideMetric
                      label="Price"
                      value={
                        selectedClient.paymentStatus === "paid"
                          ? `$${selectedClient.monthlyPrice}/month`
                          : "—"
                      }
                    />
                    <SideMetric
                      label="Pages"
                      value={selectedClient.assignedPageIds.length}
                    />
                    <SideMetric
                      label="Data"
                      value={selectedClient.dataEntries}
                    />
                  </div>

                  <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      Pages open to the client
                    </h3>

                    <div className="mt-4 grid gap-3">
                      {selectedClientPages.map((page) => (
                        <div
                          key={page.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-slate-950">
                                {page.title}
                              </p>

                              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                                {ownerLabel(page.owner)} · Personal data
                              </p>
                            </div>

                            <CheckCircle2
                              size={18}
                              className="shrink-0 text-emerald-500"
                            />
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openPageEditor(selectedClient.id, page.id)
                              }
                              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-slate-950 text-xs font-black text-white transition hover:bg-violet-700"
                            >
                              <PencilLine size={14} />
                              Edit data
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openPagePreview(selectedClient.id, page.id)
                              }
                              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye size={14} />
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-violet-700 ring-1 ring-violet-100">
                        <LockKeyhole size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                          Client login
                        </p>
                        <p className="truncate text-sm font-black text-slate-950">
                          {portalSystem.websitePath}/login
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={copyClientLoginLink}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Copy size={15} />
                      Copy link
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <Users size={34} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">
                    No client selected
                  </h3>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    Select a client from the list to manage their access.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      {showInviteModal && (
        <InviteClientModal
          clientName={clientName}
          setClientName={setClientName}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
          clientPhone={clientPhone}
          setClientPhone={setClientPhone}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          monthlyPrice={monthlyPrice}
          setMonthlyPrice={setMonthlyPrice}
          assignedPageIds={assignedPageIds}
          toggleAssignedPage={toggleAssignedPage}
          onClose={() => setShowInviteModal(false)}
          onCreate={createInvite}
        />
      )}

      {editorContext && editorClient && editorPage && (
        <DataEditorModal
          client={editorClient}
          page={editorPage}
          values={
            clientPageData[getDataKey(editorClient.id, editorPage.id)] ||
            createDefaultValues(editorPage)
          }
          onChange={saveFieldValue}
          onSave={saveEditor}
          onClose={() => setEditorContext(null)}
        />
      )}

      {previewContext && previewClient && previewPage && (
        <ClientPreviewModal
          client={previewClient}
          page={previewPage}
          values={
            clientPageData[getDataKey(previewClient.id, previewPage.id)] ||
            createDefaultValues(previewPage)
          }
          onClose={() => setPreviewContext(null)}
        />
      )}
    </section>
  );
}

function ClientDataFieldsManager({
  fields,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  fields: CustomClientField[];
  onAdd: () => void;
  onUpdate: (fieldId: string, patch: Partial<CustomClientField>) => void;
  onDelete: (fieldId: string) => void;
  onDuplicate: (field: CustomClientField) => void;
}) {
  const activeFields = fields.filter((field) => field.active);
  const profileFields = fields.filter((field) => field.showInClientProfile);
  const portalFields = fields.filter((field) => field.showInClientPortal);

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white via-slate-50 to-violet-50/50 p-4 md:p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm">
              <Settings2 size={14} />
              Client Data Fields
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
              Automatic fields in the client profile
            </h2>

            <p className="mt-1 max-w-4xl text-sm font-bold leading-7 text-slate-500">
              Here you define which fields will appear in the client profile and personal area: text,
              number, date, checkbox, status, list, link, or file.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            <Plus size={16} />
            Add field
          </button>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <ClientFieldMetric label="Total fields" value={fields.length} />
          <ClientFieldMetric label="active" value={activeFields.length} />
          <ClientFieldMetric label="In client profile" value={profileFields.length} />
          <ClientFieldMetric label="In personal area" value={portalFields.length} />
        </div>
      </div>

      <div className="p-4 md:p-5">
        {fields.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/40 p-8 text-center">
            <Settings2 className="mx-auto h-9 w-9 text-violet-700" />

            <h3 className="mt-3 text-xl font-black text-slate-950">
              No custom fields yet
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              Add a field such as weight, birth date, summary, status, or file. After
              saving, it will appear automatically in client profiles.
            </p>

            <button
              type="button"
              onClick={onAdd}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
            >
              <Plus size={16} />
              Create first field
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {fields.map((field) => (
              <ClientDataFieldEditor
                key={field.id}
                field={field}
                onUpdate={(patch) => onUpdate(field.id, patch)}
                onDelete={() => onDelete(field.id)}
                onDuplicate={() => onDuplicate(field)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 p-4 md:p-5">
        <div className="flex flex-col gap-3 rounded-[24px] border border-violet-100 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-4xl text-sm font-bold leading-7 text-slate-500">
            The client profile reads this list and automatically builds a personal form for each
            client. In the site builder, you can use each field variable name.
          </p>

          <div className="w-fit rounded-2xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 ring-1 ring-violet-100">
            {"{{"}variable_name{"}}"}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClientDataFieldEditor({
  field,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  field: CustomClientField;
  onUpdate: (patch: Partial<CustomClientField>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const Icon = getClientFieldIcon(field.type);
  const optionText = (field.options || []).join(", ");

  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px_minmax(0,1fr)]">
          <div className="flex min-w-0 gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700">
              <Icon size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <InputBlock
                label="Field name"
                value={field.label}
                onChange={(value) =>
                  onUpdate({
                    label: value,
                    key:
                      !field.key || field.key.startsWith("field_")
                        ? cleanKey(value) || field.key
                        : field.key,
                  })
                }
                placeholder="For example: Weight / Summary / Birth date"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-600">
              Field type
            </label>

            <select
              value={field.type}
              onChange={(event) => onUpdate({ type: event.target.value as FieldType })}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            >
              <option value="text">Short text</option>
              <option value="textarea">Long text</option>
              <option value="summary">Summary</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
              <option value="select">Dropdown selection</option>
              <option value="checkbox">Checkbox</option>
              <option value="boolean">Yes / No</option>
              <option value="checklist">Checklist</option>
              <option value="link">Link</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="file">File</option>
              <option value="image">Image</option>
            </select>
          </div>

          <InputBlock
            label="Variable name for site builder"
            value={field.key}
            onChange={(value) => onUpdate({ key: cleanKey(value) })}
            placeholder="weight / summary / client_status"
          />
        </div>

        <div className="flex flex-wrap gap-2 xl:justify-end">
          <button
            type="button"
            onClick={() => onUpdate({ active: !field.active })}
            className={[
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition",
              field.active
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                : "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
            ].join(" ")}
          >
            <CheckCircle2 size={14} />
            {field.active ? "Active" : "Off"}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50"
          >
            <Copy size={14} />
            Duplicate
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 text-xs font-black text-rose-700 transition hover:bg-rose-100"
          >
            <X size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <InputBlock
          label="Description / explanation"
          value={field.description}
          onChange={(value) => onUpdate({ description: value })}
          placeholder="Internal explanation of what this field means"
        />

        <InputBlock
          label="Placeholder"
          value={field.placeholder}
          onChange={(value) => onUpdate({ placeholder: value })}
          placeholder="Text that will appear in the field"
        />
      </div>

      {(field.type === "status" ||
        field.type === "select" ||
        field.type === "checklist") && (
        <div className="mt-3">
          <InputBlock
            label="Options"
            value={optionText}
            onChange={(value) =>
              onUpdate({
                options: value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="New, In progress, Waiting, Completed"
          />
        </div>
      )}

      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <FieldToggle
          title="Appears in client profile"
          text="Will appear automatically in every profile"
          checked={field.showInClientProfile}
          onClick={() => onUpdate({ showInClientProfile: !field.showInClientProfile })}
        />

        <FieldToggle
          title="Shown in personal area"
          text="The client will see it on the website"
          checked={field.showInClientPortal}
          onClick={() => onUpdate({ showInClientPortal: !field.showInClientPortal })}
        />

        <FieldToggle
          title="Client can edit"
          text="The client will update it themselves"
          checked={field.clientCanEdit}
          onClick={() => onUpdate({ clientCanEdit: !field.clientCanEdit })}
        />

        <FieldToggle
          title="Required field"
          text="Required before saving"
          checked={field.required}
          onClick={() => onUpdate({ required: !field.required })}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs font-black text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1">
          {fieldTypeLabel(field.type)}
        </span>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700 ring-1 ring-violet-100">
          {"{{"}{field.key || "field"}{"}}"}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1">
          In client profile: {field.showInClientProfile ? "Yes" : "No"}
        </span>
      </div>
    </article>
  );
}

function ClientFieldMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/90 p-3 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function FieldToggle({
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
        "rounded-2xl border p-3 text-left transition",
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

function InviteClientModal({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  paymentStatus,
  setPaymentStatus,
  monthlyPrice,
  setMonthlyPrice,
  assignedPageIds,
  toggleAssignedPage,
  onClose,
  onCreate,
}: {
  clientName: string;
  setClientName: (value: string) => void;
  clientEmail: string;
  setClientEmail: (value: string) => void;
  clientPhone: string;
  setClientPhone: (value: string) => void;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (value: PaymentStatus) => void;
  monthlyPrice: string;
  setMonthlyPrice: (value: string) => void;
  assignedPageIds: string[];
  toggleAssignedPage: (pageId: string) => void;
  onClose: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[34px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 md:p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Add client to personal area
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              The client will receive a password setup email and log into the website with only
              their personal data.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <InputBlock
              label="Client name"
              value={clientName}
              onChange={setClientName}
              placeholder="For example: Dana Cohen"
            />

            <InputBlock
              label="Login email"
              value={clientEmail}
              onChange={setClientEmail}
              placeholder="client@email.com"
            />

            <InputBlock
              label="Phone"
              value={clientPhone}
              onChange={setClientPhone}
              placeholder="0500000000"
            />

            <div>
              <label className="mb-2 block text-xs font-black text-slate-600">
                Access / payment type
              </label>

              <select
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value as PaymentStatus)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option value="paid">Paid subscription</option>
                <option value="included">Included in service</option>
                <option value="free">Free</option>
                <option value="unpaid">Awaiting payment</option>
              </select>
            </div>

            {paymentStatus === "paid" && (
              <InputBlock
                label="Monthly price"
                value={monthlyPrice}
                onChange={setMonthlyPrice}
                placeholder="30"
                type="number"
              />
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-black text-slate-950">
              Which pages should be opened for the client?
            </h3>

            <p className="mt-1 text-xs font-bold text-slate-500">
              You can open the entire system or only some of the pages the business built on the website.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {portalSystem.pages.map((page) => {
                const checked = assignedPageIds.includes(page.id);

                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => toggleAssignedPage(page.id)}
                    className={[
                      "rounded-2xl border p-3 text-left transition",
                      checked
                        ? "border-violet-300 bg-violet-50 shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {page.title}
                        </p>

                        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                          {ownerLabel(page.owner)} ·{" "}
                          {pageAccessLabel(page.accessType)}
                        </p>
                      </div>

                      <span
                        className={[
                          "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
                          checked
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-slate-300 bg-white text-transparent",
                        ].join(" ")}
                      >
                        ✓
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <Clock3 size={18} className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-xs font-bold leading-6 text-amber-800">
                Currently this works on the frontend. In the next step, we will connect the server: create a client account,
                permissions by page, and send a real password setup email.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCreate}
              disabled={!clientName.trim() || !clientEmail.trim()}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={17} />
              Save and send invitation
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataEditorModal({
  client,
  page,
  values,
  onChange,
  onSave,
  onClose,
}: {
  client: ClientAccess;
  page: PortalPage;
  values: ClientPageValues;
  onChange: (fieldId: string, value: unknown) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[34px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 md:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
              <ListChecks size={14} />
              Edit personal data
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              {page.title}
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              Client: {client.clientName} · Everything saved here will appear only for this client.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-92px)] overflow-y-auto p-5 md:p-6">
          <div className="grid gap-4">
            {page.fields.map((field) => (
              <FieldEditor
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(value) => onChange(field.id, value)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              <Save size={17} />
              Save data for client
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: PortalField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "textarea") {
    return (
      <FieldShell label={field.label}>
        <textarea
          value={String(value || "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          rows={5}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </FieldShell>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <span className="text-sm font-black text-slate-700">{field.label}</span>

        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-5 w-5 accent-violet-700"
        />
      </label>
    );
  }

  if (field.type === "status") {
    return (
      <FieldShell label={field.label}>
        <select
          value={String(value || field.options?.[0] || "")}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        >
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (field.type === "checklist") {
    const items = Array.isArray(value) ? (value as ChecklistItem[]) : [];

    const updateItem = (itemId: string, patch: Partial<ChecklistItem>) => {
      onChange(
        items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, ...patch };
        })
      );
    };

    const addItem = () => {
      onChange([
        ...items,
        {
          id: safeId(),
          text: "",
          checked: false,
        },
      ]);
    };

    const removeItem = (itemId: string) => {
      onChange(items.filter((item) => item.id !== itemId));
    };

    return (
      <FieldShell label={field.label}>
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[auto_1fr_auto]"
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(event) =>
                  updateItem(item.id, { checked: event.target.checked })
                }
                className="mt-3 h-5 w-5 accent-violet-700"
              />

              <input
                value={item.text}
                onChange={(event) =>
                  updateItem(item.id, { text: event.target.value })
                }
                placeholder="Enter an item / task / line for the client"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="h-11 rounded-xl bg-white px-3 text-xs font-black text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 text-sm font-black text-violet-700 hover:bg-violet-100"
          >
            <Plus size={15} />
            Add item
          </button>
        </div>
      </FieldShell>
    );
  }

  return (
    <FieldShell label={field.label}>
      <input
        value={String(value || "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </FieldShell>
  );
}

function ClientPreviewModal({
  client,
  page,
  values,
  onClose,
}: {
  client: ClientAccess;
  page: PortalPage;
  values: ClientPageValues;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[34px] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 md:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
              <Eye size={14} />
              Client view
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              {page.title}
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              {client.clientName} · {client.email}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-92px)] overflow-y-auto bg-slate-50 p-5 md:p-6">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-black text-slate-950">
              {page.title}
            </h3>

            <p className="mt-2 text-sm font-bold leading-7 text-slate-500">
              {page.description}
            </p>

            <div className="mt-6 grid gap-4">
              {page.fields.map((field) => (
                <PreviewValue
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewValue({
  field,
  value,
}: {
  field: PortalField;
  value: unknown;
}) {
  if (field.type === "checklist") {
    const items = Array.isArray(value) ? (value as ChecklistItem[]) : [];

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-black text-slate-400">{field.label}</p>

        <div className="mt-3 grid gap-2">
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700"
              >
                <span>{item.checked ? "✓" : "○"}</span>
                <span>{item.text || "Item without text"}</span>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-slate-400">No items defined</p>
          )}
        </div>
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-black text-slate-700">{field.label}</p>
        <span className="text-sm font-black text-violet-700">
          {value ? "Yes" : "No"}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black text-slate-400">{field.label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-800">
        {String(value || "No information entered")}
      </p>
    </div>
  );
}

function SectionHeader({
  badge,
  title,
  text,
  action,
}: {
  badge: string;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
          {badge}
        </div>

        <h2 className="text-xl font-black text-slate-950 md:text-2xl">{title}</h2>

        <p className="mt-1 max-w-3xl text-sm font-bold leading-6 text-slate-500">
          {text}
        </p>
      </div>

      {action}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
          {icon}
        </div>

        <p className="text-2xl font-black text-slate-950">{value}</p>
      </div>

      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-slate-500">{text}</p>
    </div>
  );
}

function PortalPageCard({
  page,
  onEdit,
  onPreview,
}: {
  page: PortalPage;
  onEdit: () => void;
  onPreview: () => void;
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700">
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-slate-950">{page.title}</h3>
              <span
                className={[
                  "rounded-full px-2.5 py-1 text-[10px] font-black",
                  page.accessType === "paid"
                    ? "bg-violet-50 text-violet-700"
                    : "bg-emerald-50 text-emerald-700",
                ].join(" ")}
              >
                {pageAccessLabel(page.accessType)}
              </span>
            </div>

            <p className="mt-1 line-clamp-2 text-sm font-bold leading-6 text-slate-500">
              {page.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-black text-slate-500">
              <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                {page.path}
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                {ownerLabel(page.owner)}
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                {page.fields.length} fields
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                {page.submissionsCount} records
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-violet-700"
          >
            <PencilLine size={14} />
            Edit data
          </button>

          <button
            type="button"
            onClick={onPreview}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={14} />
            View
          </button>
        </div>
      </div>
    </article>
  );
}

function ClientRow({
  client,
  selected,
  onClick,
}: {
  client: ClientAccess;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-[22px] border px-4 py-3 text-left transition",
        selected
          ? "border-violet-300 bg-violet-50 shadow-md"
          : "border-slate-200 bg-white hover:bg-slate-50",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={[
              "grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-xs font-black",
              selected
                ? "bg-violet-700 text-white"
                : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {client.clientName
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">
              {client.clientName}
            </p>
            <p className="mt-1 truncate text-xs font-bold text-slate-500">
              {client.email} · {client.phone || "No phone"}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-4 lg:w-[560px]">
          <ClientMiniMetric
            label="Status"
            value={clientStatusLabel(client.status)}
          />
          <ClientMiniMetric
            label="Payment"
            value={paymentStatusLabel(client.paymentStatus)}
          />
          <ClientMiniMetric label="Pages" value={client.assignedPageIds.length} />
          <ClientMiniMetric label="Activity" value={client.lastActivity} />
        </div>
      </div>
    </button>
  );
}

function DarkInfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white/80">
      <span>{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span>{label}</span>
      <span className="font-black text-slate-800">{value}</span>
    </div>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
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
    <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-200">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xs font-black text-slate-950">{value}</p>
    </div>
  );
}

function SideMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function ActionButton({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
    >
      {icon}
      {children}
    </button>
  );
}

function InputBlock({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black outline-none transition placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-600">
        {label}
      </label>

      {children}
    </div>
  );
}
