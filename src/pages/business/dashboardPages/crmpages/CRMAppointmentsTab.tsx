import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isGuidedDemoActive } from "@/guidedDemo/sessionStore";
import { formatDemoMoney, getDemoCurrency } from "@/guidedDemo/demoCurrency";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import API from "@api";
import BizuplyLoader, {
  BizuplyLoadingState,
} from "../../../../components/ui/BizuplyLoader";
import { useAuth } from "../../../../context/AuthContext";
import SelectTimeFromSlots from "./SelectTimeFromSlots";
import {
  useBusinessWorkHours,
  type ScheduleDay,
} from "../../../../hooks/useBusinessWorkHours";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import { WORK_HOURS_UPDATED_EVENT } from "../../../../utils/workHoursEvents";
import {
  applyClientSessionConsumption,
  isAppointmentTreatmentCompleted,
} from "./clientSessionConsumption";
import { findAppointmentConflict } from "./appointmentOverlap";
import AppointmentCalendarBoard from "./AppointmentCalendarBoard";
import {
  shiftAnchor,
  toIsoDate,
  type CalendarView,
} from "./appointmentCalendarLayout";
import "./crmWorkspace.css";

const DURATION_STEP = 15;
const MAX_DURATION = 12 * 60;

type ServiceItem = {
  _id: string;
  name?: string;
  title?: string;
  price?: number;
  duration?: number;
};

type CRMClient = {
  _id: string;
  fullName?: string;
  name?: string;
  clientName?: string;
  phone?: string;
  email?: string;
  address?: string;
};

type ClientSnapshot = {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
};

type AppointmentItem = {
  _id: string;
  business?: string;
  crmClientId?: string | CRMClient | null;
  client?: string;
  clientSnapshot?: ClientSnapshot;
  serviceId?: string;
  serviceName?: string;
  date?: string;
  time?: string;
  duration?: number;
  price?: number;
  paid?: boolean;
  paidAt?: string | null;
  paymentMethod?: string;
  note?: string;
  address?: string;
  createdAt?: string;
  /** Treatment was fulfilled / used for this visit */
  completed?: boolean;
  status?: string;
};

type AppointmentFormState = {
  crmClientId: string;
  clientName: string;
  clientPhone: string;
  address: string;
  email: string;
  note: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: string | number;
  paid: boolean;
  /** When true, one package treatment is consumed for the linked CRM client */
  completed: boolean;
  duration: number;
};

type EmailProvider = "gmail" | "outlook" | "default";

type OpenEmailParams = {
  provider: EmailProvider;
  email: string;
  subject: string;
  body: string;
};

type AuthUser = {
  businessId?: string;
  country?: string;
  currency?: string;
  locale?: string;
  phone?: string;
  business?: {
    _id?: string;
    country?: string;
    currency?: string;
    locale?: string;
    phone?: string;
  };
};

type AuthValue = {
  user?: AuthUser | null;
  socket?: any;
};

type ListMode = "all" | "today" | "selected" | "upcoming";

type DetectedPhone = {
  phone: string;
  country: string;
};

type DetectedCurrency = {
  currency: string;
  locale: string;
};

const emptyAppointmentForm: AppointmentFormState = {
  crmClientId: "",
  clientName: "",
  clientPhone: "",
  address: "",
  email: "",
  note: "",
  serviceId: "",
  serviceName: "",
  date: "",
  time: "",
  duration: 30,
  price: "",
  paid: false,
  completed: false,
};

function getTodayIso() {
  return new Date().toLocaleDateString("en-CA");
}

function getAppointmentDateTime(appointment: AppointmentItem) {
  if (!appointment.date) return null;

  const parsed = new Date(`${appointment.date}T${appointment.time || "00:00"}`);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function formatDate(date?: string, locale = "en-US", emDash = "—") {
  if (!date) return emDash;

  const parsed = new Date(`${date}T00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function formatMonthTitle(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDuration(minutes: number | undefined, t: TFunction) {
  const value = Number(minutes) || 30;
  const hours = Math.floor(value / 60);
  const rest = value % 60;

  if (hours > 0) {
    return rest
      ? t("crm.common.durationHoursMinutes", { hours, minutes: rest })
      : t("crm.common.durationHours", { count: hours });
  }

  return t("crm.common.durationMinutes", { count: value });
}

function cleanPhone(value?: string) {
  return String(value || "")
    .trim()
    .replace(/[^\d+]/g, "");
}

function normalizePhone(value?: string) {
  return cleanPhone(value);
}

function normalizeEmail(value?: string) {
  return String(value || "").trim().toLowerCase();
}

function detectAndNormalizePhone(value?: string): DetectedPhone {
  const clean = cleanPhone(value);

  if (!clean) {
    return {
      phone: "",
      country: "il",
    };
  }

  // Israel local mobile / landline: 0526850711 / 036666666
  if (/^0\d{8,9}$/.test(clean)) {
    return {
      phone: `972${clean.slice(1)}`,
      country: "il",
    };
  }

  // Israel mobile without leading zero: 526850711
  if (/^5\d{8}$/.test(clean)) {
    return {
      phone: `972${clean}`,
      country: "il",
    };
  }

  // Israel international
  if (/^\+972\d{8,9}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "il",
    };
  }

  if (/^972\d{8,9}$/.test(clean)) {
    return {
      phone: clean,
      country: "il",
    };
  }

  // USA / Canada
  if (/^\+1\d{10}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "us",
    };
  }

  if (/^1\d{10}$/.test(clean)) {
    return {
      phone: clean,
      country: "us",
    };
  }

  // UK
  if (/^\+44\d{9,10}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "gb",
    };
  }

  if (/^44\d{9,10}$/.test(clean)) {
    return {
      phone: clean,
      country: "gb",
    };
  }

  // France
  if (/^\+33\d{9}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "fr",
    };
  }

  if (/^33\d{9}$/.test(clean)) {
    return {
      phone: clean,
      country: "fr",
    };
  }

  // Germany
  if (/^\+49\d{7,13}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "de",
    };
  }

  if (/^49\d{7,13}$/.test(clean)) {
    return {
      phone: clean,
      country: "de",
    };
  }

  // Spain
  if (/^\+34\d{9}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "es",
    };
  }

  if (/^34\d{9}$/.test(clean)) {
    return {
      phone: clean,
      country: "es",
    };
  }

  // Italy
  if (/^\+39\d{8,11}$/.test(clean)) {
    return {
      phone: clean.replace("+", ""),
      country: "it",
    };
  }

  if (/^39\d{8,11}$/.test(clean)) {
    return {
      phone: clean,
      country: "it",
    };
  }

  // Generic international fallback
  if (clean.startsWith("+")) {
    return {
      phone: clean.replace("+", ""),
      country: "il",
    };
  }

  // Default fallback — not USA
  return {
    phone: clean,
    country: "il",
  };
}

function phoneForApi(value?: string) {
  const detected = detectAndNormalizePhone(value);

  if (!detected.phone) return "";

  return detected.phone.startsWith("+")
    ? detected.phone
    : `+${detected.phone}`;
}

function detectCurrencyFromUser(user?: AuthUser | null): DetectedCurrency {
  const country = String(user?.business?.country || user?.country || "")
    .trim()
    .toLowerCase();

  const currency = String(user?.business?.currency || user?.currency || "")
    .trim()
    .toUpperCase();

  const locale = String(user?.business?.locale || user?.locale || "")
    .trim()
    .toLowerCase();

  const phone = cleanPhone(user?.business?.phone || user?.phone || "");

  if (currency) {
    if (currency === "ILS") {
      return {
        currency: "ILS",
        locale: "he-IL",
      };
    }

    if (currency === "USD") {
      return {
        currency: "USD",
        locale: "en-US",
      };
    }

    return {
      currency,
      locale: locale || "en-US",
    };
  }

  if (
    country === "israel" ||
    country === "il" ||
    
    locale === "he-il" ||
    phone.startsWith("972") ||
    phone.startsWith("+972") ||
    /^05\d{8}$/.test(phone)
  ) {
    return {
      currency: "ILS",
      locale: "he-IL",
    };
  }

  if (
    country === "united states" ||
    country === "united states of america" ||
    country === "usa" ||
    country === "us" ||
    country === "america" ||
    locale === "en-us" ||
    phone.startsWith("1") ||
    phone.startsWith("+1")
  ) {
    return {
      currency: "USD",
      locale: "en-US",
    };
  }

  // Default for this product: Israeli Shekels
  return {
    currency: "ILS",
    locale: "he-IL",
  };
}

function formatMoney(value?: number, user?: AuthUser | null) {
  if (getDemoCurrency()) return formatDemoMoney(Math.round(Number(value || 0)));
  const detected = detectCurrencyFromUser(user);

  // Never show USD when the business looks Israeli / unset — prefer ₪
  const currency =
    detected.currency === "USD" && !user?.business?.currency
      ? "ILS"
      : detected.currency;
  const locale = currency === "ILS" ? "he-IL" : detected.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getClientIdFromAppointment(appointment: AppointmentItem) {
  const value = appointment.crmClientId;

  if (!value) return "";

  if (typeof value === "string") return value;

  return String(value._id || "");
}

function getClientName(client?: CRMClient | null, unnamed = "Unnamed client") {
  return (
    client?.fullName ||
    client?.name ||
    client?.clientName ||
    unnamed
  );
}

function getAppointmentClient(
  appointment: AppointmentItem,
  clientsById: Record<string, CRMClient>,
  clients: CRMClient[]
) {
  const populated =
    appointment.crmClientId && typeof appointment.crmClientId === "object"
      ? appointment.crmClientId
      : null;

  if (populated?._id) return populated;

  const id = getClientIdFromAppointment(appointment);
  if (id && clientsById[id]) return clientsById[id];

  const snapshotPhone = normalizePhone(appointment.clientSnapshot?.phone);
  const snapshotEmail = normalizeEmail(appointment.clientSnapshot?.email);

  if (snapshotPhone || snapshotEmail) {
    const found = clients.find((client) => {
      const phoneMatch =
        snapshotPhone && normalizePhone(client.phone) === snapshotPhone;
      const emailMatch =
        snapshotEmail && normalizeEmail(client.email) === snapshotEmail;

      return phoneMatch || emailMatch;
    });

    if (found) return found;
  }

  return null;
}

function getAppointmentClientName(
  appointment: AppointmentItem,
  clientsById: Record<string, CRMClient>,
  clients: CRMClient[],
  unnamed = "Unnamed client"
) {
  const client = getAppointmentClient(appointment, clientsById, clients);

  return (
    appointment.clientSnapshot?.name ||
    getClientName(client, unnamed) ||
    unnamed
  );
}

function getAppointmentClientPhone(
  appointment: AppointmentItem,
  clientsById: Record<string, CRMClient>,
  clients: CRMClient[]
) {
  const client = getAppointmentClient(appointment, clientsById, clients);

  return appointment.clientSnapshot?.phone || client?.phone || "";
}

function getAppointmentClientEmail(
  appointment: AppointmentItem,
  clientsById: Record<string, CRMClient>,
  clients: CRMClient[]
) {
  const client = getAppointmentClient(appointment, clientsById, clients);

  return appointment.clientSnapshot?.email || client?.email || "";
}

function getAppointmentClientFileId(
  appointment: AppointmentItem,
  clientsById: Record<string, CRMClient>,
  clients: CRMClient[]
) {
  const directId = getClientIdFromAppointment(appointment);

  if (directId) return directId;

  const client = getAppointmentClient(appointment, clientsById, clients);

  return client?._id || "";
}

function getServiceName(appointment: AppointmentItem, fallback = "Appointment") {
  return appointment.serviceName || fallback;
}

export default function CRMAppointmentsTab() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const { user, socket } = useAuth() as AuthValue;
  const businessId = user?.businessId || user?.business?._id || "";
  const unnamedClient = t("crm.common.unnamedClient");
  const dateLocale = i18n.language || "en-US";
  const emDash = t("crm.common.emDash");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [emailMenuOpenId, setEmailMenuOpenId] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [listMode, setListMode] = useState<ListMode>("upcoming");
  const [calendarView, setCalendarView] = useState<CalendarView>(() => {
    const saved = window.localStorage.getItem("crm.appointments.view");
    return saved === "week" || saved === "day" || saved === "month" ? saved : "month";
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [newAppointment, setNewAppointment] =
    useState<AppointmentFormState>(emptyAppointmentForm);
  /** Previous "treatment completed" flag when editing — used to consume/restore package counters once. */
  const previousCompletedRef = useRef(false);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [clients, setClients] = useState<CRMClient[]>([]);

  const {
    schedule: businessSchedule,
    scheduleArray,
    label: workHoursLabel,
    hasOpenDays,
    setSchedule,
    refetch: refetchWorkHours,
  } = useBusinessWorkHours(businessId);

  const clientsById = useMemo(() => {
    return clients.reduce<Record<string, CRMClient>>((acc, client) => {
      if (client._id) acc[client._id] = client;
      return acc;
    }, {});
  }, [clients]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const apply = () => {
      setIsMobile(media.matches);
      if (media.matches) setSidebarOpen(false);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("crm.appointments.view", calendarView);
  }, [calendarView]);

  useEffect(() => {
    if (!businessId) return;

    API.get("/business/my/services")
      .then((res: any) => setServices(res.data.services || []))
      .catch((err: unknown) => {
        console.error("Failed loading services:", err);
        setServices([]);
      });

    API.get(`/crm-clients/${businessId}`)
      .then((res: any) => setClients(Array.isArray(res.data) ? res.data : []))
      .catch((err: unknown) => {
        console.error("Failed loading clients:", err);
        setClients([]);
      });
  }, [businessId]);

  const {
    data: appointments = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<AppointmentItem[]>({
    queryKey: ["appointments", businessId],
    queryFn: async () => {
      const res = await API.get("/appointments/all-with-services", {
        params: { businessId },
      });

      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(businessId),
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!socket || !businessId) return;

    const onCreated = (appointment: AppointmentItem) => {
      queryClient.setQueryData<AppointmentItem[]>(
        ["appointments", businessId],
        (old = []) =>
          old.some((item) => item._id === appointment._id)
            ? old
            : [appointment, ...old]
      );
    };

    const onUpdated = (updated: AppointmentItem) => {
      queryClient.setQueryData<AppointmentItem[]>(
        ["appointments", businessId],
        (old = []) =>
          old.map((item) => (item._id === updated._id ? updated : item))
      );
    };

    const onDeleted = ({ id }: { id: string }) => {
      queryClient.setQueryData<AppointmentItem[]>(
        ["appointments", businessId],
        (old = []) => old.filter((item) => item._id !== id)
      );
    };

    socket.on("appointmentCreated", onCreated);
    socket.on("appointmentUpdated", onUpdated);
    socket.on("appointmentDeleted", onDeleted);

    const onWorkHoursUpdated = (schedule: Record<string, unknown>) => {
      setSchedule(schedule as any);
      void refetchWorkHours();
    };

    socket.on("workHoursUpdated", onWorkHoursUpdated);

    return () => {
      socket.off("appointmentCreated", onCreated);
      socket.off("appointmentUpdated", onUpdated);
      socket.off("appointmentDeleted", onDeleted);
      socket.off("workHoursUpdated", onWorkHoursUpdated);
    };
  }, [socket, queryClient, businessId, setSchedule, refetchWorkHours]);

  useEffect(() => {
    if (!businessId) return;

    const onLocalWorkHoursUpdated = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        businessId?: string;
        schedule?: Record<string, unknown>;
      };

      if (detail?.businessId !== businessId || !detail.schedule) return;

      setSchedule(detail.schedule as any);
      void refetchWorkHours();
    };

    window.addEventListener(WORK_HOURS_UPDATED_EVENT, onLocalWorkHoursUpdated);

    return () => {
      window.removeEventListener(
        WORK_HOURS_UPDATED_EVENT,
        onLocalWorkHoursUpdated
      );
    };
  }, [businessId, setSchedule, refetchWorkHours]);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aTime = getAppointmentDateTime(a)?.getTime() || 0;
      const bTime = getAppointmentDateTime(b)?.getTime() || 0;

      return aTime - bTime;
    });
  }, [appointments]);

  const appointmentsByDate = useMemo(() => {
    return sortedAppointments.reduce<Record<string, AppointmentItem[]>>(
      (acc, appointment) => {
        if (!appointment.date) return acc;

        if (!acc[appointment.date]) acc[appointment.date] = [];
        acc[appointment.date].push(appointment);

        return acc;
      },
      {}
    );
  }, [sortedAppointments]);

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();
    const today = getTodayIso();

    return sortedAppointments.filter((appointment) => {
      if (listMode === "today" && appointment.date !== today) return false;
      if (listMode === "selected" && appointment.date !== selectedDate) {
        return false;
      }

      if (listMode === "upcoming") {
        const apptDate = getAppointmentDateTime(appointment);

        if (!apptDate || apptDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
          return false;
        }
      }

      if (!query) return true;

      const name = getAppointmentClientName(
        appointment,
        clientsById,
        clients,
        unnamedClient
      );
      const phone = getAppointmentClientPhone(appointment, clientsById, clients);
      const email = getAppointmentClientEmail(appointment, clientsById, clients);
      const serviceName = appointment.serviceName || "";

      return (
        name.toLowerCase().includes(query) ||
        phone.includes(query) ||
        email.toLowerCase().includes(query) ||
        serviceName.toLowerCase().includes(query)
      );
    });
  }, [
    clients,
    clientsById,
    listMode,
    search,
    selectedDate,
    sortedAppointments,
    unnamedClient,
  ]);

  const todayAppointments = appointmentsByDate[getTodayIso()] || [];

  const unpaidCount = useMemo(() => {
    return appointments.filter((appointment) => !appointment.paid).length;
  }, [appointments]);

  const upcomingCount = useMemo(() => {
    const now = Date.now();

    return appointments.filter((appointment) => {
      const apptDate = getAppointmentDateTime(appointment);
      return apptDate && apptDate.getTime() >= now;
    }).length;
  }, [appointments]);

  const minDuration = useMemo(() => {
    const service = services.find(
      (item) => item._id === newAppointment.serviceId
    );

    return Number(service?.duration) || 30;
  }, [services, newAppointment.serviceId]);

  useEffect(() => {
    if (newAppointment.duration < minDuration) {
      setNewAppointment((prev) => ({
        ...prev,
        duration: minDuration,
      }));
    }
  }, [minDuration, newAppointment.duration]);

  const resetForm = () => {
    setEditId(null);
    previousCompletedRef.current = false;
    setNewAppointment({
      ...emptyAppointmentForm,
      date: selectedDate || getTodayIso(),
    });
  };

  const openCreateModal = (date = selectedDate, time = "") => {
    if (!hasOpenDays) {
      const go = window.confirm(t("crm.appointments.noWorkHoursConfirm"));

      if (go) {
        navigate(`/business/${businessId}/dashboard/crm/work-hours`);
      }

      return;
    }

    setEditId(null);
    previousCompletedRef.current = false;
    setNewAppointment({
      ...emptyAppointmentForm,
      date: date || selectedDate || getTodayIso(),
      time,
    });
    setShowAddForm(true);
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditId(null);
    previousCompletedRef.current = false;
    setNewAppointment(emptyAppointmentForm);
  };

  const openEmail = ({ provider, email, subject, body }: OpenEmailParams) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    if (provider === "gmail") {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodedSubject}&body=${encodedBody}`,
        "_blank"
      );
      return;
    }

    if (provider === "outlook") {
      window.open(
        `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${encodedSubject}&body=${encodedBody}`,
        "_blank"
      );
      return;
    }

    window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  const handleSelectClient = (clientId: string) => {
    const client = clientsById[clientId];
    const detectedPhone = detectAndNormalizePhone(client?.phone || "");

    setNewAppointment((prev) => ({
      ...prev,
      crmClientId: clientId,
      clientName: client ? getClientName(client, unnamedClient) : "",
      clientPhone: detectedPhone.phone,
      email: client?.email || "",
      address: client?.address || "",
    }));
  };

  const handleSelectService = (serviceId: string) => {
    const service = services.find((item) => item._id === serviceId);

    setNewAppointment((prev) => ({
      ...prev,
      serviceId: service?._id || "",
      serviceName: service?.name || service?.title || "",
      time: "",
      duration: Number(service?.duration) || 30,
      price: service?.price ?? "",
    }));
  };

  const handleEditAppointment = (appointment: AppointmentItem) => {
    const client = getAppointmentClient(appointment, clientsById, clients);
    const clientId = getAppointmentClientFileId(
      appointment,
      clientsById,
      clients
    );

    const detectedPhone = detectAndNormalizePhone(
      appointment.clientSnapshot?.phone || client?.phone || ""
    );

    setEditId(appointment._id);
    setShowAddForm(true);

    const wasCompleted = isAppointmentTreatmentCompleted(appointment);
    previousCompletedRef.current = wasCompleted;

    setNewAppointment({
      crmClientId: clientId,
      clientName:
        appointment.clientSnapshot?.name ||
        (client ? getClientName(client, unnamedClient) : ""),
      clientPhone: detectedPhone.phone,
      address:
        appointment.clientSnapshot?.address ||
        appointment.address ||
        client?.address ||
        "",
      email: appointment.clientSnapshot?.email || client?.email || "",
      note: appointment.note || "",
      serviceId: appointment.serviceId || "",
      serviceName: appointment.serviceName || "",
      date: appointment.date || "",
      time: appointment.time || "",
      duration: Number(appointment.duration) || 30,
      price: appointment.price ?? "",
      paid: Boolean(appointment.paid),
      completed: wasCompleted,
    });
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm(t("crm.appointments.cancelConfirm"))) return;

    try {
      await API.delete(`/appointments/${id}`);

      await queryClient.invalidateQueries({
        queryKey: ["appointments", businessId],
      });
    } catch (err) {
      console.error("Cancel appointment error:", err);
      alert(t("crm.appointments.cancelFailed"));
    }
  };

  const openClientFile = (appointment: AppointmentItem) => {
    const clientId = getAppointmentClientFileId(
      appointment,
      clientsById,
      clients
    );

    if (!clientId) {
      alert(t("crm.appointments.noClientFile"));
      return;
    }

    navigate(`../clients?clientId=${encodeURIComponent(clientId)}`, {
      relative: "path",
    });
  };

  const saveAppointment = async () => {
    if (isSaving) return;

    if (
      !newAppointment.clientName ||
      !newAppointment.clientPhone ||
      !newAppointment.serviceId ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      alert(t("crm.appointments.requiredMissing"));
      return;
    }

    const conflict = findAppointmentConflict(
      {
        _id: editId || "new",
        date: newAppointment.date,
        time: newAppointment.time,
        duration: Number(newAppointment.duration) || 30,
      },
      appointments
    );
    if (conflict && !window.confirm(t("crm.appointments.conflictWarning"))) {
      return;
    }

    const selectedService = services.find(
      (service) => service._id === newAppointment.serviceId
    );

    const payload = {
      businessId,
      name: newAppointment.clientName.trim(),
      phone: phoneForApi(newAppointment.clientPhone),
      email: newAppointment.email.trim(),
      address: newAppointment.address.trim(),
      price: Number(newAppointment.price) || 0,
      paid: newAppointment.paid,
      note: newAppointment.note.trim(),
      serviceId: newAppointment.serviceId,
      serviceName:
        newAppointment.serviceName ||
        selectedService?.name ||
        selectedService?.title ||
        "",
      date: newAppointment.date,
      time: newAppointment.time,
      duration: Number(newAppointment.duration) || minDuration,
      crmClientId: newAppointment.crmClientId || null,
      // Fulfilment is stored in the appointment status; keep one source of truth.
      status: newAppointment.completed ? "completed" : "not_completed",
    };

    setIsSaving(true);

    try {
      if (editId) {
        await API.patch(`/appointments/${editId}`, payload);
      } else {
        await API.post("/appointments", payload);
      }

      const clientId = String(newAppointment.crmClientId || "").trim();
      const wasCompleted = previousCompletedRef.current;
      const nowCompleted = Boolean(newAppointment.completed);

      if (clientId && businessId && wasCompleted !== nowCompleted) {
        try {
          const result = await applyClientSessionConsumption(
            businessId,
            clientId,
            { delta: nowCompleted ? 1 : -1 },
          );
          if (result?.updated && nowCompleted) {
            const left =
              result.treatmentsLeft == null
                ? ""
                : String(result.treatmentsLeft);
            alert(
              left === ""
                ? t("crm.appointments.treatmentConsumed")
                : t("crm.appointments.treatmentConsumedWithLeft", {
                    count: left,
                  }),
            );
          }
          await queryClient.invalidateQueries({
            queryKey: ["clients", businessId],
          });
        } catch (consumeErr) {
          console.error("Session consumption failed:", consumeErr);
          alert(t("crm.appointments.treatmentConsumeFailed"));
        }
      }

      // The saved state is now the baseline, so saving again without changing
      // fulfilment cannot consume a second treatment.
      previousCompletedRef.current = nowCompleted;

      await queryClient.invalidateQueries({
        queryKey: ["appointments", businessId],
      });

      closeModal();
    } catch (err: any) {
      console.error("Save appointment error:", err);
      alert(err?.response?.data?.message || t("crm.appointments.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      refetch(),
      refetchWorkHours(),
      queryClient.invalidateQueries({ queryKey: ["clients"] }),
      queryClient.invalidateQueries({ queryKey: ["services"] }),
    ]);
  };

  const goByView = (direction: -1 | 1) => {
    setMonthDate((prev) => {
      const next = shiftAnchor(prev, calendarView, direction);
      if (calendarView !== "month") {
        setSelectedDate(toIsoDate(next));
      }
      return next;
    });
  };

  const handleMoveAppointment = async (id: string, target: { date: string; time: string }) => {
    const appointment = appointments.find((item) => item._id === id);
    if (!appointment) return;
    if (appointment.date === target.date && appointment.time === target.time) return;
    if (!window.confirm(t("crm.appointments.moveConfirm", { date: target.date, time: target.time }))) {
      return;
    }
    const conflict = findAppointmentConflict(
      { _id: id, date: target.date, time: target.time, duration: appointment.duration },
      appointments
    );
    if (conflict && !window.confirm(t("crm.appointments.conflictWarning"))) {
      return;
    }
    try {
      await API.patch(`/appointments/${id}`, {
        date: target.date,
        time: target.time,
        duration: appointment.duration,
      });
      await queryClient.invalidateQueries({ queryKey: ["appointments", businessId] });
    } catch (err) {
      console.error("Move appointment error:", err);
      alert(t("crm.appointments.saveFailed"));
    }
  };

  if (isLoading) {
    return <BizuplyLoadingState label={t("crm.appointments.loading")} />;
  }

  if (isError) {
    return (
      <div dir={dir} className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center">
        <p className="text-lg font-black text-red-700">
          {t("crm.appointments.loadErrorTitle")}
        </p>
        <p className="mt-2 text-sm text-red-500">
          {t("crm.appointments.loadErrorText")}
        </p>
      </div>
    );
  }

  const weekdayLabels = [
    t("crm.appointments.weekdaySun"),
    t("crm.appointments.weekdayMon"),
    t("crm.appointments.weekdayTue"),
    t("crm.appointments.weekdayWed"),
    t("crm.appointments.weekdayThu"),
    t("crm.appointments.weekdayFri"),
    t("crm.appointments.weekdaySat"),
  ];

  const boardAppointments = sortedAppointments.map((appointment) => ({
    _id: appointment._id,
    date: appointment.date,
    time: appointment.time,
    duration: appointment.duration,
    serviceName: appointment.serviceName,
    status: appointment.status,
    paid: appointment.paid,
    completed: appointment.completed,
    label: getAppointmentClientName(appointment, clientsById, clients, unnamedClient),
  }));

  return (
    <div dir={dir} className="crm-ops space-y-2 bg-[#F7F8FC] text-start text-slate-800">
      <header className="crm-ops-toolbar">
        <div className="min-w-0 flex-1">
          <h2>{t("crm.appointments.title")}</h2>
          <div className="crm-ops-stats mt-1">
            <span>{t("crm.appointments.metricTotal")}: <b>{appointments.length}</b></span>
            <span>{t("crm.appointments.metricToday")}: <b>{todayAppointments.length}</b></span>
            <span>{t("crm.appointments.metricUpcoming")}: <b>{upcomingCount}</b></span>
            <span>{t("crm.appointments.metricUnpaid")}: <b>{unpaidCount}</b></span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {(["month", "week", "day"] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setCalendarView(view)}
              className={[
                "h-8 rounded-lg border px-2.5 text-xs font-black",
                calendarView === view
                  ? "border-violet-300 bg-violet-50 text-[#6D28D9]"
                  : "border-slate-200 bg-white text-slate-600",
              ].join(" ")}
            >
              {t(`crm.appointments.views.${view}`)}
            </button>
          ))}
          <button type="button" onClick={() => goByView(-1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white" aria-label={t("crm.appointments.prevRange")}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setMonthDate(now);
              setSelectedDate(getTodayIso());
              setListMode("today");
              if (isMobile) setCalendarView("day");
            }}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-black"
          >
            {t("crm.common.today")}
          </button>
          <button type="button" onClick={() => goByView(1)} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white" aria-label={t("crm.appointments.nextRange")}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <strong className="px-1 text-sm">{formatMonthTitle(monthDate, dateLocale)}</strong>
          <button type="button" onClick={() => setSidebarOpen((open) => !open)} className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-black">
            {sidebarOpen ? t("crm.appointments.hideSidebar") : t("crm.appointments.showSidebar")}
          </button>
          <button type="button" onClick={refreshAll} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white" aria-label={t("crm.appointments.refreshSync")}>
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => openCreateModal()}
            data-demo-target="calendar-create-appointment"
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#6D28D9] px-3 text-xs font-black text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("crm.appointments.createAppointment")}
          </button>
        </div>
      </header>

      <div className={`crm-cal-shell ${sidebarOpen ? "" : "is-collapsed"}`}>
        <AppointmentCalendarBoard
          view={calendarView}
          isMobile={isMobile}
          anchor={monthDate}
          selectedDate={selectedDate}
          weekdayLabels={weekdayLabels}
          todayIso={getTodayIso()}
          appointments={boardAppointments}
          onSelectDate={(iso) => {
            setSelectedDate(iso);
            setListMode("selected");
            setMonthDate(new Date(`${iso}T12:00:00`));
          }}
          onOpenAppointment={(id) => {
            const appointment = appointments.find((item) => item._id === id);
            if (appointment) handleEditAppointment(appointment);
          }}
          onCreateAt={(date, time) => openCreateModal(date, time)}
          onDropAppointment={handleMoveAppointment}
        />

        {sidebarOpen && (
          <aside className="crm-side">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
              <div>
                <h3 className="text-sm font-black">{t("crm.appointments.upcomingTitle")}</h3>
                <p className="text-[11px] font-semibold text-slate-500">{workHoursLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/business/${businessId}/dashboard/crm/work-hours`)}
                className="text-[11px] font-black text-[#6D28D9]"
              >
                {t("crm.appointments.updateHours")}
              </button>
            </div>
            <div className="px-3 py-2">
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute start-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("crm.appointments.searchPlaceholder")}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pe-2 ps-7 text-xs font-semibold outline-none"
                />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1">
                <FilterButton active={listMode === "all"} onClick={() => setListMode("all")}>
                  {t("crm.appointments.filterAll")}
                </FilterButton>
                <FilterButton active={listMode === "today"} onClick={() => setListMode("today")}>
                  {t("crm.appointments.filterToday")}
                </FilterButton>
                <FilterButton active={listMode === "selected"} onClick={() => setListMode("selected")}>
                  {t("crm.appointments.filterDay")}
                </FilterButton>
                <FilterButton active={listMode === "upcoming"} onClick={() => setListMode("upcoming")}>
                  {t("crm.appointments.filterUpcoming")}
                </FilterButton>
              </div>
            </div>
            <div className="crm-side-list overflow-y-auto" data-demo-target={isGuidedDemoActive() ? "calendar-existing-appointments" : undefined}>
              {filteredAppointments.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs font-semibold text-slate-500">
                  {t("crm.appointments.emptyText")}
                </p>
              ) : (
                filteredAppointments.slice(0, 40).map((appointment) => (
                  <button
                    key={appointment._id}
                    type="button"
                    className="crm-side-row"
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    <span className="text-[11px] font-black text-slate-500">
                      {appointment.time || emDash}
                      <br />
                      {appointment.date}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">
                        {getAppointmentClientName(appointment, clientsById, clients, unnamedClient)}
                      </span>
                      <span className="block truncate text-[11px] font-semibold text-slate-500">
                        {getServiceName(appointment, t("crm.appointments.defaultServiceName"))}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </aside>
        )}
      </div>

      {showAddForm && (
        <AppointmentModal
          editId={editId}
          businessId={businessId}
          user={user}
          appointment={newAppointment}
          setAppointment={setNewAppointment}
          services={services}
          clients={clients}
          minDuration={minDuration}
          isSaving={isSaving}
          scheduleArray={scheduleArray}
          onClose={closeModal}
          onSave={saveAppointment}
          onSelectClient={handleSelectClient}
          onSelectService={handleSelectService}
        />
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-8 rounded-lg px-2 text-[11px] font-black transition",
        active
          ? "bg-[#6D28D9] text-white shadow-[0_10px_24px_rgba(109,40,217,0.22)]"
          : "bg-slate-50 text-slate-600 hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function AppointmentCard({
  appointment,
  clients,
  clientsById,
  user,
  emailMenuOpenId,
  setEmailMenuOpenId,
  onEmail,
  onEdit,
  onCancel,
  onOpenClient,
  demoTarget,
}: {
  appointment: AppointmentItem;
  clients: CRMClient[];
  clientsById: Record<string, CRMClient>;
  user?: AuthUser | null;
  emailMenuOpenId: string | null;
  setEmailMenuOpenId: React.Dispatch<React.SetStateAction<string | null>>;
  onEmail: (params: OpenEmailParams) => void;
  onEdit: () => void;
  onCancel: () => void;
  onOpenClient: () => void;
  demoTarget?: string;
}) {
  const { t, i18n } = useTranslation();
  const unnamedClient = t("crm.common.unnamedClient");
  const emDash = t("crm.common.emDash");
  const dateLocale = i18n.language || "en-US";

  const clientName = getAppointmentClientName(
    appointment,
    clientsById,
    clients,
    unnamedClient
  );
  const clientPhone = getAppointmentClientPhone(
    appointment,
    clientsById,
    clients
  );
  const clientEmail = getAppointmentClientEmail(
    appointment,
    clientsById,
    clients
  );

  const reminderBody = t("crm.appointments.emailReminderBody", {
    name: clientName,
    date: appointment.date || emDash,
    time: appointment.time || emDash,
  });

  return (
    <article
      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-sky-100 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]"
      data-demo-target={demoTarget}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={[
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ring-1",
              isAppointmentTreatmentCompleted(appointment)
                ? "bg-violet-50 text-violet-800 ring-violet-100"
                : "bg-sky-50 text-sky-700 ring-sky-100",
            ].join(" ")}
          >
            <CheckCircle2 className="h-3 w-3" />
            {isAppointmentTreatmentCompleted(appointment)
              ? t("crm.appointments.treatmentCompleted")
              : t("crm.appointments.scheduled")}
          </div>

          <h3 className="mt-2 truncate text-lg font-black text-slate-800">
            {clientName}
          </h3>

          <p className="mt-1 truncate text-sm font-bold text-slate-500">
            {getServiceName(appointment, t("crm.appointments.defaultServiceName"))}
          </p>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          <CalendarDays className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <span>{t("crm.common.date")}</span>
          <span className="text-slate-800">
            {formatDate(appointment.date, dateLocale, emDash)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span>{t("crm.common.time")}</span>
          <span className="text-slate-800">{appointment.time || emDash}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span>{t("crm.common.duration")}</span>
          <span className="text-slate-800">
            {formatDuration(appointment.duration, t)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span>{t("crm.common.payment")}</span>
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-black",
              appointment.paid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {appointment.paid ? t("crm.common.paid") : t("crm.common.unpaid")}
          </span>
        </div>

        {Number(appointment.price) > 0 && (
          <div className="flex items-center justify-between gap-3">
            <span>{t("crm.common.price")}</span>
            <span className="text-slate-800">
              {formatMoney(appointment.price, user)}
            </span>
          </div>
        )}
      </div>

      {(clientPhone || clientEmail) && (
        <div className="mt-3 grid gap-2 text-xs font-bold text-slate-500">
          {clientPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{clientPhone}</span>
            </div>
          )}

          {clientEmail && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">{clientEmail}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#6D28D9] text-white transition hover:bg-[#5B21B6]"
        >
          <Edit3 className="h-3.5 w-3.5" />
          {t("crm.common.edit")}
        </button>

        <button
          type="button"
          onClick={onOpenClient}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" />
          {t("crm.appointments.clientFile")}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (!clientEmail) {
                alert(t("crm.appointments.noEmail"));
                return;
              }

              setEmailMenuOpenId((current) =>
                current === appointment._id ? null : appointment._id
              );
            }}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Mail className="h-3.5 w-3.5" />
            {t("crm.common.email")}
          </button>

          {emailMenuOpenId === appointment._id && clientEmail && (
            <div className="absolute bottom-12 left-0 z-30 w-40 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <EmailOption
                onClick={() =>
                  onEmail({
                    provider: "gmail",
                    email: clientEmail,
                    subject: t("crm.appointments.emailReminderSubject"),
                    body: reminderBody,
                  })
                }
              >
                {t("crm.appointments.gmail")}
              </EmailOption>

              <EmailOption
                onClick={() =>
                  onEmail({
                    provider: "outlook",
                    email: clientEmail,
                    subject: t("crm.appointments.emailReminderSubject"),
                    body: reminderBody,
                  })
                }
              >
                {t("crm.appointments.outlook")}
              </EmailOption>

              <EmailOption
                onClick={() =>
                  onEmail({
                    provider: "default",
                    email: clientEmail,
                    subject: t("crm.appointments.emailReminderSubject"),
                    body: reminderBody,
                  })
                }
              >
                {t("crm.appointments.defaultEmail")}
              </EmailOption>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-rose-50 text-xs font-black text-rose-700 transition hover:bg-rose-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t("crm.appointments.cancelAppointment")}
        </button>
      </div>
    </article>
  );
}

function EmailOption({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-xl px-3 py-2 text-start text-xs font-black text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function AppointmentModal({
  editId,
  businessId,
  user,
  appointment,
  setAppointment,
  services,
  clients,
  minDuration,
  isSaving,
  scheduleArray,
  onClose,
  onSave,
  onSelectClient,
  onSelectService,
}: {
  editId: string | null;
  businessId: string;
  user?: AuthUser | null;
  appointment: AppointmentFormState;
  setAppointment: React.Dispatch<React.SetStateAction<AppointmentFormState>>;
  services: ServiceItem[];
  clients: CRMClient[];
  minDuration: number;
  isSaving: boolean;
  scheduleArray: ScheduleDay[];
  onClose: () => void;
  onSave: () => void;
  onSelectClient: (clientId: string) => void;
  onSelectService: (serviceId: string) => void;
}) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const unnamedClient = t("crm.common.unnamedClient");
  const emDash = t("crm.common.emDash");

  const durationOptions = useMemo(() => {
    return Array.from(
      {
        length: Math.floor((MAX_DURATION - minDuration) / DURATION_STEP) + 1,
      },
      (_, index) => minDuration + index * DURATION_STEP
    );
  }, [minDuration]);

  const detectedPhone = useMemo(
    () => detectAndNormalizePhone(appointment.clientPhone),
    [appointment.clientPhone]
  );

  return (
    <div dir={dir} className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5 md:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-1 text-xs font-black text-[#6D28D9] ring-1 ring-violet-100">
              <CalendarDays className="h-3.5 w-3.5" />
              {editId
                ? t("crm.appointments.modalBadgeEdit")
                : t("crm.appointments.modalBadgeNew")}
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-900">
              {editId
                ? t("crm.appointments.modalTitleEdit")
                : t("crm.appointments.modalTitleNew")}
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("crm.appointments.modalSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-105px)] overflow-y-auto p-5 md:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div dir={dir} className="space-y-5 text-start">
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-800">
                      {t("crm.appointments.clientDetailsTitle")}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {t("crm.appointments.clientDetailsSubtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormBlock label={t("crm.appointments.existingClient")}>
                    <select
                      data-demo-target="calendar-appointment-client"
                      value={appointment.crmClientId}
                      onChange={(event) => onSelectClient(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="">{t("crm.appointments.selectClient")}</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {getClientName(client, unnamedClient)}
                        </option>
                      ))}
                    </select>
                  </FormBlock>

                  <FormInput
                    label={t("crm.appointments.clientName")}
                    value={appointment.clientName}
                    demoTarget="calendar-appointment-client"
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        clientName: value,
                      }))
                    }
                    placeholder={t("crm.appointments.clientNamePlaceholder")}
                  />

                  <FormBlock label={t("crm.common.phone")}>
                    <div className="rounded-2xl border border-slate-200 bg-white px-2 py-1 transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100">
                      <PhoneInput
                        country={detectedPhone.country}
                        value={detectedPhone.phone}
                        enableSearch
                        onChange={(phone) =>
                          setAppointment((prev) => ({
                            ...prev,
                            clientPhone: phone,
                          }))
                        }
                        inputClass="!h-10 !w-full !border-0 !bg-transparent !text-sm !font-bold !text-slate-900 !shadow-none !outline-none"
                        buttonClass="!border-0 !bg-transparent"
                        containerClass="!w-full"
                      />
                    </div>
                  </FormBlock>

                  <FormInput
                    label={t("crm.common.email")}
                    type="email"
                    value={appointment.email}
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        email: value,
                      }))
                    }
                    placeholder={t("crm.appointments.emailPlaceholder")}
                  />

                  <div className="md:col-span-2">
                    <FormInput
                      label={t("crm.common.address")}
                      value={appointment.address}
                      onChange={(value) =>
                        setAppointment((prev) => ({
                          ...prev,
                          address: value,
                        }))
                      }
                      placeholder={t("crm.appointments.addressPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-800">
                      {t("crm.appointments.appointmentDetailsTitle")}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      {t("crm.appointments.appointmentDetailsSubtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormBlock label={t("crm.common.service")}>
                    <select
                      data-demo-target="calendar-appointment-service"
                      value={appointment.serviceId}
                      onChange={(event) => onSelectService(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="">{t("crm.appointments.selectService")}</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name || service.title || t("crm.common.service")}
                        </option>
                      ))}
                    </select>
                  </FormBlock>

                  <FormInput
                    label={t("crm.common.date")}
                    type="date"
                    demoTarget="calendar-appointment-date"
                    value={appointment.date}
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        date: value,
                        time: "",
                      }))
                    }
                  />

                  <FormBlock label={t("crm.appointments.availableTime")}>
                    <SelectTimeFromSlots
                      date={appointment.date}
                      selectedTime={appointment.time}
                      demoTarget="calendar-appointment-time"
                      onChange={(time: string) =>
                        setAppointment((prev) => ({
                          ...prev,
                          time,
                        }))
                      }
                      businessId={businessId}
                      serviceId={appointment.serviceId}
                      schedule={scheduleArray}
                      duration={appointment.duration}
                      excludeAppointmentId={editId}
                    />
                  </FormBlock>

                  <FormBlock label={t("crm.common.duration")}>
                    <select
                      value={appointment.duration}
                      onChange={(event) =>
                        setAppointment((prev) => ({
                          ...prev,
                          duration: Number(event.target.value),
                          time: "",
                        }))
                      }
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    >
                      {durationOptions.map((minutes) => (
                        <option key={minutes} value={minutes}>
                          {formatDuration(minutes, t)}
                        </option>
                      ))}
                    </select>
                  </FormBlock>

                  <FormInput
                    label={t("crm.common.price")}
                    type="number"
                    value={String(appointment.price)}
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        price: value,
                      }))
                    }
                    placeholder="0"
                  />

                  <FormBlock label={t("crm.common.payment")}>
                    <button
                      type="button"
                      onClick={() =>
                        setAppointment((prev) => ({
                          ...prev,
                          paid: !prev.paid,
                        }))
                      }
                      className={[
                        "flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-sm font-black transition",
                        appointment.paid
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      <span>
                        {appointment.paid
                          ? t("crm.common.paid")
                          : t("crm.common.unpaid")}
                      </span>
                      <span
                        className={[
                          "grid h-6 w-6 place-items-center rounded-full text-xs",
                          appointment.paid
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-transparent",
                        ].join(" ")}
                      >
                        ✓
                      </span>
                    </button>
                  </FormBlock>

                  <FormBlock label={t("crm.appointments.treatmentFulfillment")}>
                    <button
                      type="button"
                      onClick={() =>
                        setAppointment((prev) => ({
                          ...prev,
                          completed: !prev.completed,
                        }))
                      }
                      className={[
                        "flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-sm font-black transition",
                        appointment.completed
                          ? "border-violet-300 bg-violet-50 text-violet-800"
                          : "border-slate-200 bg-slate-50 text-slate-600",
                      ].join(" ")}
                      title={t("crm.appointments.treatmentFulfillmentHint")}
                    >
                      <span>
                        {appointment.completed
                          ? t("crm.appointments.treatmentCompleted")
                          : t("crm.appointments.treatmentNotCompleted")}
                      </span>
                      <span
                        className={[
                          "grid h-6 w-6 place-items-center rounded-full text-xs",
                          appointment.completed
                            ? "bg-[#6D28D9] text-white"
                            : "bg-white text-transparent ring-1 ring-slate-300",
                        ].join(" ")}
                      >
                        ✓
                      </span>
                    </button>
                    <p className="mt-2 text-xs font-bold text-slate-400">
                      {t("crm.appointments.treatmentFulfillmentHint")}
                    </p>
                  </FormBlock>

                  <div className="md:col-span-2">
                    <FormBlock label={t("crm.common.note")}>
                      <textarea
                        value={appointment.note}
                        onChange={(event) =>
                          setAppointment((prev) => ({
                            ...prev,
                            note: event.target.value,
                          }))
                        }
                        placeholder={t("crm.appointments.notePlaceholder")}
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                    </FormBlock>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 shadow-sm">
                <h3 className="text-base font-black text-slate-800">
                  {t("crm.appointments.bookingSummary")}
                </h3>

                <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                  <SummaryRow
                    label={t("crm.common.client")}
                    value={appointment.clientName || emDash}
                  />
                  <SummaryRow
                    label={t("crm.common.service")}
                    value={appointment.serviceName || emDash}
                  />
                  <SummaryRow
                    label={t("crm.common.date")}
                    value={appointment.date || emDash}
                  />
                  <SummaryRow
                    label={t("crm.common.time")}
                    value={appointment.time || emDash}
                  />
                  <SummaryRow
                    label={t("crm.common.duration")}
                    value={formatDuration(appointment.duration, t)}
                  />
                  <SummaryRow
                    label={t("crm.common.price")}
                    value={formatMoney(Number(appointment.price) || 0, user)}
                  />
                  <SummaryRow
                    label={t("crm.common.payment")}
                    value={
                      appointment.paid
                        ? t("crm.common.paid")
                        : t("crm.common.unpaid")
                    }
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("crm.common.required")}
                </p>

                <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                  {t("crm.appointments.requiredHint")}
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onSave}
              data-demo-target="calendar-save-appointment"
              disabled={
                isSaving ||
                !appointment.clientName ||
                !appointment.clientPhone ||
                !appointment.serviceId ||
                !appointment.date ||
                !appointment.time
              }
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#6D28D9] text-white shadow-xl transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? (
                <BizuplyLoader size="xs" compact />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {editId
                ? t("crm.appointments.saveChanges")
                : t("crm.appointments.saveAppointment")}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-13 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              {t("crm.common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormBlock({
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

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  demoTarget,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  demoTarget?: string;
}) {
  return (
    <FormBlock label={label}>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        data-demo-target={demoTarget}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
      />
    </FormBlock>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-3 py-2 ring-1 ring-white">
      <span className="text-slate-400">{label}</span>
      <span className="text-end text-slate-800">{value}</span>
    </div>
  );
}