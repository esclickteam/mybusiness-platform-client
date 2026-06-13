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
  name: "אזור לקוחות אישי",
  description:
    "המערכת עצמה נבנית בבונה האתר. כאן ב־CRM מנהלים מי מהלקוחות יכול להתחבר, אילו עמודים פתוחים לו, ומה הנתונים האישיים שלו.",
  websitePath: "/client-area",
  status: "active",
  monthlyPrice: 30,
  currency: "USD",
  pages: [
    {
      id: "page-1",
      title: "דשבורד אישי",
      description:
        "עמוד כניסה אישי ללקוח עם מידע, סטטוס, קישורים ותקציר פעילות.",
      path: "/client-area/dashboard",
      accessType: "included",
      dataMode: "per_client",
      owner: "business",
      submissionsCount: 42,
      lastUpdated: "היום",
      fields: [
        {
          id: "mainTitle",
          label: "כותרת ראשית ללקוח",
          type: "text",
          placeholder: "לדוגמה: ברוך הבא לאזור האישי שלך",
        },
        {
          id: "summary",
          label: "תקציר אישי",
          type: "textarea",
          placeholder: "כאן רושמים תקציר אישי שיופיע ללקוח",
        },
        {
          id: "status",
          label: "סטטוס לקוח",
          type: "status",
          options: ["פעיל", "בהמתנה", "דורש טיפול", "הושלם"],
        },
      ],
    },
    {
      id: "page-2",
      title: "טופס מעקב",
      description:
        "עמוד שבו הלקוח ממלא נתונים, והעסק רואה אותם מתוך ה־CRM.",
      path: "/client-area/tracking",
      accessType: "paid",
      dataMode: "per_client",
      owner: "client",
      submissionsCount: 89,
      lastUpdated: "אתמול",
      fields: [
        {
          id: "trackingDate",
          label: "תאריך מעקב",
          type: "date",
        },
        {
          id: "clientUpdate",
          label: "עדכון מהלקוח",
          type: "textarea",
          placeholder: "הלקוח ימלא כאן עדכון אישי",
        },
        {
          id: "businessNote",
          label: "תגובה / הערה של העסק",
          type: "textarea",
          placeholder: "כאן העסק יכול להגיב ללקוח",
        },
        {
          id: "approved",
          label: "סומן כטופל",
          type: "checkbox",
        },
      ],
    },
    {
      id: "page-3",
      title: "תוכנית אישית",
      description:
        "עמוד שהעסק ממלא לכל לקוח בנפרד, והלקוח רואה רק את התוכן שלו.",
      path: "/client-area/plan",
      accessType: "paid",
      dataMode: "per_client",
      owner: "business",
      submissionsCount: 27,
      lastUpdated: "לפני 3 ימים",
      fields: [
        {
          id: "planTitle",
          label: "שם התוכנית",
          type: "text",
          placeholder: "שם התוכנית האישית",
        },
        {
          id: "planDescription",
          label: "הנחיות ללקוח",
          type: "textarea",
          placeholder: "הנחיות, הסברים, מה לעשות ומתי",
        },
        {
          id: "tasks",
          label: "רשימת משימות / פריטים",
          type: "checklist",
        },
        {
          id: "attachmentUrl",
          label: "קישור לקובץ / מסמך",
          type: "file",
          placeholder: "https://...",
        },
      ],
    },
    {
      id: "page-4",
      title: "קבצים והמלצות",
      description: "עמוד קבצים, מסמכים, המלצות ותוכן אישי לפי לקוח.",
      path: "/client-area/files",
      accessType: "included",
      dataMode: "per_client",
      owner: "business",
      submissionsCount: 18,
      lastUpdated: "השבוע",
      fields: [
        {
          id: "recommendationTitle",
          label: "כותרת ההמלצה",
          type: "text",
          placeholder: "כותרת שתופיע ללקוח",
        },
        {
          id: "recommendationText",
          label: "תוכן ההמלצה",
          type: "textarea",
          placeholder: "המלצה אישית, הסבר או סיכום",
        },
        {
          id: "fileUrl",
          label: "קישור לקובץ",
          type: "file",
          placeholder: "https://...",
        },
        {
          id: "visibleToClient",
          label: "להציג ללקוח",
          type: "checkbox",
        },
      ],
    },
  ],
};

const initialClients: ClientAccess[] = [
  {
    id: "client-1",
    clientName: "בן אשת",
    email: "ben@example.com",
    phone: "0500000000",
    status: "active",
    paymentStatus: "paid",
    assignedPageIds: ["page-1", "page-2", "page-3", "page-4"],
    monthlyPrice: 30,
    lastActivity: "היום",
    dataEntries: 18,
  },
  {
    id: "client-2",
    clientName: "דנה כהן",
    email: "dana@example.com",
    phone: "0520000000",
    status: "invited",
    paymentStatus: "included",
    assignedPageIds: ["page-1", "page-4"],
    monthlyPrice: 0,
    lastActivity: "ממתינה להגדרת סיסמה",
    dataEntries: 0,
  },
  {
    id: "client-3",
    clientName: "רון לוי",
    email: "ron@example.com",
    phone: "0540000000",
    status: "not_invited",
    paymentStatus: "unpaid",
    assignedPageIds: ["page-1", "page-2"],
    monthlyPrice: 30,
    lastActivity: "לא נשלחה הזמנה",
    dataEntries: 0,
  },
];

const initialClientPageData: Record<string, ClientPageValues> = {
  "client-1_page-3": {
    planTitle: "תוכנית אישית לחודש הקרוב",
    planDescription: "כאן העסק ממלא תוכן אישי שהלקוח יראה באזור האישי שלו.",
    tasks: [
      { id: "task-1", text: "פריט ראשון לביצוע", checked: true },
      { id: "task-2", text: "פריט שני לביצוע", checked: false },
    ],
    attachmentUrl: "",
  },
};

const CUSTOM_CLIENT_FIELDS_STORAGE_KEY = "bizuply_custom_client_fields";

const defaultClientDataFields: CustomClientField[] = [
  {
    id: "client_weight",
    key: "weight",
    label: "משקל",
    type: "number",
    description: "נתון מספרי לדוגמה שיופיע בתיק לקוח",
    placeholder: "לדוגמה: 72",
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
    label: "סיכום לקוח",
    type: "summary",
    description: "סיכום פנימי / טקסט ארוך לכל לקוח",
    placeholder: "כתבי כאן סיכום אישי ללקוח",
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
    label: "סטטוס לקוח",
    type: "status",
    description: "סטטוס עבודה מול הלקוח",
    placeholder: "",
    options: ["חדש", "בטיפול", "ממתין", "הושלם", "בוטל"],
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    active: true,
    order: 3,
  },
];

function normalizeClientDataField(field: Partial<CustomClientField>, index: number): CustomClientField {
  const label = String(field.label || "").trim() || `נתון ${index + 1}`;
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
    label: `נתון ${count + 1}`,
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
  if (type === "text") return "טקסט קצר / מילה / שורה";
  if (type === "textarea") return "טקסט ארוך";
  if (type === "summary") return "סיכום";
  if (type === "number") return "מספר";
  if (type === "date") return "תאריך";
  if (type === "checkbox") return "צ׳קבוקס";
  if (type === "boolean") return "כן / לא";
  if (type === "checklist") return "רשימת סימון";
  if (type === "status") return "סטטוס";
  if (type === "select") return "בחירה מרשימה";
  if (type === "link") return "קישור";
  if (type === "email") return "מייל";
  if (type === "phone") return "טלפון";
  if (type === "file") return "קובץ";
  if (type === "image") return "תמונה";
  return "טקסט";
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
  if (status === "active") return "פעיל באתר";
  if (status === "paused") return "מושהה";
  return "טיוטה";
}

function clientStatusLabel(status: ClientStatus) {
  if (status === "active") return "פעיל";
  if (status === "invited") return "הוזמן";
  if (status === "paused") return "מושהה";
  return "לא הוזמן";
}

function paymentStatusLabel(status: PaymentStatus) {
  if (status === "paid") return "מנוי בתשלום";
  if (status === "included") return "כלול בשירות";
  if (status === "unpaid") return "ממתין לתשלום";
  return "חינם";
}

function pageAccessLabel(accessType: PageAccessType) {
  if (accessType === "paid") return "בתשלום";
  if (accessType === "included") return "כלול";
  return "חינם";
}

function ownerLabel(owner: PortalPage["owner"]) {
  if (owner === "business") return "העסק מעדכן";
  if (owner === "client") return "הלקוח ממלא";
  return "העסק והלקוח";
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
    showToast("נוסף נתון חדש לתיק לקוח");
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
          (!field.key || field.key.startsWith("field_") || field.key.startsWith("נתון_"));

        return {
          ...field,
          ...patch,
          key: shouldUpdateKey ? cleanKey(nextLabel) || field.key : patch.key ?? field.key,
        };
      })
    );
  };

  const deleteClientDataField = (fieldId: string) => {
    if (!window.confirm("למחוק את הנתון הזה מתיקי הלקוחות?")) return;

    syncClientDataFields(clientDataFields.filter((field) => field.id !== fieldId));
    showToast("הנתון נמחק");
  };

  const duplicateClientDataField = (field: CustomClientField) => {
    const copy: CustomClientField = {
      ...field,
      id: uid("client_field"),
      key: `${field.key}_copy`,
      label: `${field.label} - עותק`,
      order: clientDataFields.length + 1,
    };

    syncClientDataFields([...clientDataFields, copy]);
    showToast("הנתון שוכפל");
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
      lastActivity: "הוזמן עכשיו",
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
    showToast("הלקוח נוסף ונשלחה הזמנה להגדרת סיסמה");
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
          lastActivity: "עודכן עכשיו",
        };
      })
    );

    setEditorContext(null);
    showToast("הנתונים נשמרו ללקוח");
  };

  const sendPasswordInvite = (clientId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;

        return {
          ...client,
          status: client.status === "active" ? "active" : "invited",
          lastActivity: "נשלחה הזמנה עכשיו",
        };
      })
    );

    showToast("נשלח מייל להגדרת סיסמה");
  };

  const resetPassword = (clientId: string) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id !== clientId) return client;

        return {
          ...client,
          lastActivity: "נשלח איפוס סיסמה",
        };
      })
    );

    showToast("נשלח מייל לאיפוס סיסמה");
  };

  const copyClientLoginLink = async () => {
    const link = `${window.location.origin}${portalSystem.websitePath}/login`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("הקישור הועתק");
    } catch {
      showToast(link);
    }
  };

  const openSiteBuilder = () => {
    navigate("../../site-builder", { relative: "path" });
  };

  return (
    <section
      dir="rtl"
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
                  אזור לקוחות שמתחבר לאתר
                  <span className="block bg-gradient-to-l from-violet-700 via-fuchsia-600 to-sky-600 bg-clip-text text-transparent">
                    עם נתונים אישיים לכל לקוח.
                  </span>
                </h1>

                <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-500 md:text-base">
                  העמודים עצמם נבנים בבונה האתר. כאן העסק מנהל לקוחות,
                  הרשאות, הזמנות להגדרת סיסמה, גישה לעמודים, נתונים אישיים
                  ותשלום חודשי.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:justify-end">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-[0_14px_36px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-violet-700"
                >
                  <UserPlus size={17} />
                  הוספת לקוח לאזור אישי
                </button>

                <button
                  type="button"
                  onClick={openSiteBuilder}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  <MonitorSmartphone size={17} />
                  פתיחה בבונה האתר
                </button>
              </div>
            </div>

            <div className="relative mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={<Layers3 size={17} />}
                label="עמודים באתר"
                value={portalSystem.pages.length}
                text="עמודי אזור אישי"
              />
              <StatCard
                icon={<Users size={17} />}
                label="לקוחות"
                value={clients.length}
                text={`${activeClients} פעילים`}
              />
              <StatCard
                icon={<Mail size={17} />}
                label="הזמנות"
                value={invitedClients}
                text="ממתינים להגדרת סיסמה"
              />
              <StatCard
                icon={<BadgeDollarSign size={17} />}
                label="הכנסה חודשית"
                value={`$${monthlyRevenue}`}
                text="מלקוחות בתשלום"
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
                title="עמודים שנבנו באתר"
                text="אלה העמודים שהעסק יצר בבונה האתר וסימן כאזור אישי. הנתונים נשמרים לפי לקוח."
                action={
                  <button
                    type="button"
                    onClick={openSiteBuilder}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                  >
                    <Plus size={17} />
                    הוספת עמוד בבונה האתר
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
                        showToast("בחרי קודם לקוח מהרשימה");
                        return;
                      }

                      openPageEditor(selectedClient.id, page.id);
                    }}
                    onPreview={() => {
                      if (!selectedClient) {
                        showToast("בחרי קודם לקוח מהרשימה");
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
                title="לקוחות עם גישה"
                text="כאן העסק פותח לכל לקוח גישה, שולח מייל להגדרת סיסמה ומגדיר אילו עמודים פתוחים לו."
                action={
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-violet-700 px-5 text-sm font-black text-white shadow-[0_18px_50px_rgba(124,58,237,0.25)] transition hover:-translate-y-0.5 hover:bg-violet-800"
                  >
                    <UserPlus size={17} />
                    הוספת לקוח
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
                  placeholder="חיפוש לפי שם, מייל או טלפון..."
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
                      onClick={() => showToast("בשלב הבא נחבר כאן הגדרות לקוח")}
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
                      שליחת מייל להגדרת סיסמה
                    </ActionButton>

                    <ActionButton
                      icon={<KeyRound size={16} />}
                      onClick={() => resetPassword(selectedClient.id)}
                    >
                      איפוס סיסמה
                    </ActionButton>

                    <ActionButton
                      icon={<Eye size={16} />}
                      onClick={() => {
                        const firstPage = selectedClientPages[0];

                        if (!firstPage) {
                          showToast("אין עמודים פתוחים ללקוח");
                          return;
                        }

                        openPagePreview(selectedClient.id, firstPage.id);
                      }}
                    >
                      צפייה כמו הלקוח
                    </ActionButton>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <SideMetric
                      label="תשלום"
                      value={paymentStatusLabel(selectedClient.paymentStatus)}
                    />
                    <SideMetric
                      label="מחיר"
                      value={
                        selectedClient.paymentStatus === "paid"
                          ? `$${selectedClient.monthlyPrice}/חודש`
                          : "—"
                      }
                    />
                    <SideMetric
                      label="עמודים"
                      value={selectedClient.assignedPageIds.length}
                    />
                    <SideMetric
                      label="נתונים"
                      value={selectedClient.dataEntries}
                    />
                  </div>

                  <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm font-black text-slate-950">
                      עמודים פתוחים ללקוח
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
                                {ownerLabel(page.owner)} · נתונים אישיים
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
                              עריכת נתונים
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openPagePreview(selectedClient.id, page.id)
                              }
                              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye size={14} />
                              צפייה
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
                          כניסת לקוח
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
                      העתקת קישור
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <Users size={34} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-lg font-black text-slate-950">
                    לא נבחר לקוח
                  </h3>
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    בחרי לקוח מהרשימה כדי לנהל את הגישה שלו.
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
      <div className="border-b border-slate-100 bg-gradient-to-l from-white via-slate-50 to-violet-50/50 p-4 md:p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm">
              <Settings2 size={14} />
              Client Data Fields
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
              נתונים אוטומטיים בתיק לקוח
            </h2>

            <p className="mt-1 max-w-4xl text-sm font-bold leading-7 text-slate-500">
              כאן מגדירים אילו שדות יופיעו בתיק לקוח ובאזור האישי: טקסט,
              מספר, תאריך, צ׳קבוקס, סטטוס, רשימה, קישור או קובץ.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-violet-700"
          >
            <Plus size={16} />
            הוספת נתון
          </button>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <ClientFieldMetric label="סה״כ נתונים" value={fields.length} />
          <ClientFieldMetric label="פעילים" value={activeFields.length} />
          <ClientFieldMetric label="בתיק לקוח" value={profileFields.length} />
          <ClientFieldMetric label="באזור אישי" value={portalFields.length} />
        </div>
      </div>

      <div className="p-4 md:p-5">
        {fields.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/40 p-8 text-center">
            <Settings2 className="mx-auto h-9 w-9 text-violet-700" />

            <h3 className="mt-3 text-xl font-black text-slate-950">
              עדיין אין נתונים מותאמים
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
              הוסיפי נתון כמו משקל, תאריך לידה, סיכום, סטטוס או קובץ. אחרי
              השמירה הוא יופיע אוטומטית בתיקי הלקוחות.
            </p>

            <button
              type="button"
              onClick={onAdd}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-700"
            >
              <Plus size={16} />
              יצירת נתון ראשון
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
            בתיק הלקוח קוראים את הרשימה הזאת ובונים אוטומטית טופס אישי לכל
            לקוח. בבונה האתר אפשר להשתמש בשם המשתנה של כל שדה.
          </p>

          <div className="w-fit rounded-2xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700 ring-1 ring-violet-100">
            {"{{"}שם_המשתנה{"}}"}
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
                label="שם הנתון"
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
                placeholder="לדוגמה: משקל / סיכום / תאריך לידה"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-slate-600">
              סוג הנתון
            </label>

            <select
              value={field.type}
              onChange={(event) => onUpdate({ type: event.target.value as FieldType })}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-black outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            >
              <option value="text">טקסט קצר</option>
              <option value="textarea">טקסט ארוך</option>
              <option value="summary">סיכום</option>
              <option value="number">מספר</option>
              <option value="date">תאריך</option>
              <option value="status">סטטוס</option>
              <option value="select">בחירה מרשימה</option>
              <option value="checkbox">צ׳קבוקס</option>
              <option value="boolean">כן / לא</option>
              <option value="checklist">רשימת סימון</option>
              <option value="link">קישור</option>
              <option value="email">מייל</option>
              <option value="phone">טלפון</option>
              <option value="file">קובץ</option>
              <option value="image">תמונה</option>
            </select>
          </div>

          <InputBlock
            label="שם משתנה לבונה האתר"
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
            {field.active ? "פעיל" : "כבוי"}
          </button>

          <button
            type="button"
            onClick={onDuplicate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-slate-50"
          >
            <Copy size={14} />
            שכפול
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 text-xs font-black text-rose-700 transition hover:bg-rose-100"
          >
            <X size={14} />
            מחיקה
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <InputBlock
          label="תיאור / הסבר"
          value={field.description}
          onChange={(value) => onUpdate({ description: value })}
          placeholder="הסבר פנימי מה הנתון הזה אומר"
        />

        <InputBlock
          label="Placeholder"
          value={field.placeholder}
          onChange={(value) => onUpdate({ placeholder: value })}
          placeholder="טקסט שיופיע בשדה"
        />
      </div>

      {(field.type === "status" ||
        field.type === "select" ||
        field.type === "checklist") && (
        <div className="mt-3">
          <InputBlock
            label="אפשרויות"
            value={optionText}
            onChange={(value) =>
              onUpdate({
                options: value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              })
            }
            placeholder="חדש, בטיפול, ממתין, הושלם"
          />
        </div>
      )}

      <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <FieldToggle
          title="מופיע בתיק לקוח"
          text="יופיע אוטומטית בכל תיק"
          checked={field.showInClientProfile}
          onClick={() => onUpdate({ showInClientProfile: !field.showInClientProfile })}
        />

        <FieldToggle
          title="מוצג באזור האישי"
          text="הלקוח יראה באתר"
          checked={field.showInClientPortal}
          onClick={() => onUpdate({ showInClientPortal: !field.showInClientPortal })}
        />

        <FieldToggle
          title="הלקוח יכול לערוך"
          text="הלקוח יעדכן בעצמו"
          checked={field.clientCanEdit}
          onClick={() => onUpdate({ clientCanEdit: !field.clientCanEdit })}
        />

        <FieldToggle
          title="שדה חובה"
          text="חובה לפני שמירה"
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
          בתיק לקוח: {field.showInClientProfile ? "כן" : "לא"}
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
        "rounded-2xl border p-3 text-right transition",
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
              הוספת לקוח לאזור אישי
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              הלקוח יקבל מייל להגדרת סיסמה וייכנס לאתר עם הנתונים האישיים שלו
              בלבד.
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
              label="שם הלקוח"
              value={clientName}
              onChange={setClientName}
              placeholder="לדוגמה: דנה כהן"
            />

            <InputBlock
              label="מייל להתחברות"
              value={clientEmail}
              onChange={setClientEmail}
              placeholder="client@email.com"
            />

            <InputBlock
              label="טלפון"
              value={clientPhone}
              onChange={setClientPhone}
              placeholder="0500000000"
            />

            <div>
              <label className="mb-2 block text-xs font-black text-slate-600">
                סוג גישה / תשלום
              </label>

              <select
                value={paymentStatus}
                onChange={(event) =>
                  setPaymentStatus(event.target.value as PaymentStatus)
                }
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option value="paid">מנוי בתשלום</option>
                <option value="included">כלול בשירות</option>
                <option value="free">חינם</option>
                <option value="unpaid">ממתין לתשלום</option>
              </select>
            </div>

            {paymentStatus === "paid" && (
              <InputBlock
                label="מחיר חודשי"
                value={monthlyPrice}
                onChange={setMonthlyPrice}
                placeholder="30"
                type="number"
              />
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-black text-slate-950">
              אילו עמודים לפתוח ללקוח?
            </h3>

            <p className="mt-1 text-xs font-bold text-slate-500">
              אפשר לפתוח את כל המערכת או רק חלק מהעמודים שהעסק בנה באתר.
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
                      "rounded-2xl border p-3 text-right transition",
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
                כרגע זה עובד בפרונט. בשלב הבא נחבר שרת: יצירת חשבון לקוח,
                הרשאות לפי עמודים ושליחת מייל אמיתי להגדרת סיסמה.
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
              שמירה ושליחת הזמנה
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              ביטול
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
              עריכת נתונים אישיים
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              {page.title}
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              לקוח: {client.clientName} · כל מה שנשמר כאן יופיע רק ללקוח הזה.
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
              שמירת נתונים ללקוח
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              ביטול
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
                placeholder="רשמי פריט / משימה / שורה ללקוח"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="h-11 rounded-xl bg-white px-3 text-xs font-black text-rose-600 ring-1 ring-slate-200 hover:bg-rose-50"
              >
                מחיקה
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-300 bg-violet-50 text-sm font-black text-violet-700 hover:bg-violet-100"
          >
            <Plus size={15} />
            הוספת פריט
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
              תצוגה כמו לקוח
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
                <span>{item.text || "פריט ללא טקסט"}</span>
              </div>
            ))
          ) : (
            <p className="text-sm font-bold text-slate-400">לא הוגדרו פריטים</p>
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
          {value ? "כן" : "לא"}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black text-slate-400">{field.label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-800">
        {String(value || "לא הוזן מידע")}
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
                {page.fields.length} שדות
              </span>
              <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                {page.submissionsCount} רשומות
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
            עריכת נתונים
          </button>

          <button
            type="button"
            onClick={onPreview}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Eye size={14} />
            צפייה
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
        "rounded-[22px] border px-4 py-3 text-right transition",
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
              {client.email} · {client.phone || "אין טלפון"}
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-4 lg:w-[560px]">
          <ClientMiniMetric
            label="סטטוס"
            value={clientStatusLabel(client.status)}
          />
          <ClientMiniMetric
            label="תשלום"
            value={paymentStatusLabel(client.paymentStatus)}
          />
          <ClientMiniMetric label="עמודים" value={client.assignedPageIds.length} />
          <ClientMiniMetric label="פעילות" value={client.lastActivity} />
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
