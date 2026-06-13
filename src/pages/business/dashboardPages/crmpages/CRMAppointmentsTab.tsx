import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  DollarSign,
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

import API from "@api";
import { useAuth } from "../../../../context/AuthContext";
import SelectTimeFromSlots from "./SelectTimeFromSlots";

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

type ScheduleDay = {
  day: number;
  start?: string;
  end?: string;
  closed?: boolean;
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
  business?: {
    _id?: string;
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
};

function getTodayIso() {
  return new Date().toLocaleDateString("en-CA");
}

function toIsoDate(date: Date) {
  return date.toLocaleDateString("en-CA");
}

function getAppointmentDateTime(appointment: AppointmentItem) {
  if (!appointment.date) return null;

  const parsed = new Date(`${appointment.date}T${appointment.time || "00:00"}`);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDuration(minutes?: number) {
  const value = Number(minutes) || 30;
  const hours = Math.floor(value / 60);
  const rest = value % 60;

  if (hours > 0) {
    return `${hours}h${rest ? ` ${rest}m` : ""}`;
  }

  return `${value}m`;
}

function formatMoney(value?: number) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function cleanPhone(value?: string) {
  return String(value || "")
    .trim()
    .replace(/[^\d+]/g, "");
}

function normalizePhone(value?: string) {
  return cleanPhone(value);
}

function detectAndNormalizePhone(value?: string): DetectedPhone {
  const clean = cleanPhone(value);

  if (!clean) {
    return {
      phone: "",
      country: "il",
    };
  }

  // Israel local mobile / local landline: 0526850711 / 036666666
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

  // Default fallback — לא USA
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

function normalizeEmail(value?: string) {
  return String(value || "").trim().toLowerCase();
}

function getClientIdFromAppointment(appointment: AppointmentItem) {
  const value = appointment.crmClientId;

  if (!value) return "";

  if (typeof value === "string") return value;

  return String(value._id || "");
}

function getClientName(client?: CRMClient | null) {
  return (
    client?.fullName ||
    client?.name ||
    client?.clientName ||
    "Unnamed client"
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
  clients: CRMClient[]
) {
  const client = getAppointmentClient(appointment, clientsById, clients);

  return (
    appointment.clientSnapshot?.name ||
    getClientName(client) ||
    "Unnamed client"
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

function getServiceName(appointment: AppointmentItem) {
  return appointment.serviceName || "Appointment";
}

function getMonthCells(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingEmptyCells = first.getDay();

  const cells: Array<Date | null> = [];

  for (let i = 0; i < leadingEmptyCells; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function buildScheduleArray(businessSchedule: Record<string, any> | null) {
  if (!businessSchedule) return [];

  return Object.entries(businessSchedule).map<ScheduleDay>(([day, value]) => {
    if (!value || !value.start || !value.end) {
      return {
        day: Number(day),
        closed: true,
      };
    }

    return {
      day: Number(day),
      start: value.start,
      end: value.end,
      closed: false,
    };
  });
}

function getWorkHoursLabel(schedule: Record<string, any> | null) {
  if (!schedule) return "Not loaded";

  const openDays = Object.values(schedule).filter(
    (item: any) => item?.start && item?.end
  );

  if (openDays.length === 0) return "No work hours";

  return `${openDays.length} open days`;
}

export default function CRMAppointmentsTab() {
  const { user, socket } = useAuth() as AuthValue;
  const businessId = user?.businessId || user?.business?._id || "";

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [emailMenuOpenId, setEmailMenuOpenId] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(getTodayIso());
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [listMode, setListMode] = useState<ListMode>("all");

  const [newAppointment, setNewAppointment] =
    useState<AppointmentFormState>(emptyAppointmentForm);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [businessSchedule, setBusinessSchedule] = useState<Record<
    string,
    any
  > | null>(null);

  const scheduleArray = useMemo(
    () => buildScheduleArray(businessSchedule),
    [businessSchedule]
  );

  const clientsById = useMemo(() => {
    return clients.reduce<Record<string, CRMClient>>((acc, client) => {
      if (client._id) acc[client._id] = client;
      return acc;
    }, {});
  }, [clients]);

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

    API.get("/appointments/get-work-hours", {
      params: { businessId },
    })
      .then((res: any) => setBusinessSchedule(res.data.workHours || {}))
      .catch((err: unknown) => {
        console.error("Failed loading work hours:", err);
        setBusinessSchedule({});
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

    return () => {
      socket.off("appointmentCreated", onCreated);
      socket.off("appointmentUpdated", onUpdated);
      socket.off("appointmentDeleted", onDeleted);
    };
  }, [socket, queryClient, businessId]);

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

      const name = getAppointmentClientName(appointment, clientsById, clients);
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
  ]);

  const totalRevenue = useMemo(() => {
    return appointments.reduce((sum, appointment) => {
      return sum + (Number(appointment.price) || 0);
    }, 0);
  }, [appointments]);

  const paidRevenue = useMemo(() => {
    return appointments.reduce((sum, appointment) => {
      if (!appointment.paid) return sum;
      return sum + (Number(appointment.price) || 0);
    }, 0);
  }, [appointments]);

  const todayAppointments = appointmentsByDate[getTodayIso()] || [];
  const selectedDayAppointments = appointmentsByDate[selectedDate] || [];

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
    setNewAppointment({
      ...emptyAppointmentForm,
      date: selectedDate || getTodayIso(),
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowAddForm(true);
  };

  const closeModal = () => {
    setShowAddForm(false);
    setEditId(null);
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
      clientName: client ? getClientName(client) : "",
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

    setNewAppointment({
      crmClientId: clientId,
      clientName:
        appointment.clientSnapshot?.name ||
        (client ? getClientName(client) : ""),
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
    });
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await API.delete(`/appointments/${id}`);

      await queryClient.invalidateQueries({
        queryKey: ["appointments", businessId],
      });
    } catch (err) {
      console.error("Cancel appointment error:", err);
      alert("Failed to cancel appointment");
    }
  };

  const openClientFile = (appointment: AppointmentItem) => {
    const clientId = getAppointmentClientFileId(
      appointment,
      clientsById,
      clients
    );

    if (!clientId) {
      alert("No client file found for this appointment");
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
      alert("Missing required fields");
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
    };

    setIsSaving(true);

    try {
      if (editId) {
        await API.patch(`/appointments/${editId}`, payload);
      } else {
        await API.post("/appointments", payload);
      }

      await queryClient.invalidateQueries({
        queryKey: ["appointments", businessId],
      });

      closeModal();
    } catch (err: any) {
      console.error("Save appointment error:", err);
      alert(err?.response?.data?.message || "Failed to save appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      refetch(),
      queryClient.invalidateQueries({ queryKey: ["clients"] }),
      queryClient.invalidateQueries({ queryKey: ["services"] }),
      queryClient.invalidateQueries({ queryKey: ["work-hours"] }),
    ]);
  };

  const goPrevMonth = () => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthCells = getMonthCells(monthDate);

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <p className="text-sm font-bold text-slate-500">
          Loading synced appointments…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
        <p className="text-lg font-black text-red-700">
          Error loading appointments
        </p>
        <p className="mt-2 text-sm text-red-500">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-950">
      <section className="overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
        <div className="relative p-5 sm:p-6 lg:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />

          <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-black text-sky-700 shadow-sm">
                <CalendarDays className="h-4 w-4" />
                Synced Calendar
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Appointments calendar
              </h2>

              <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-500">
                All appointments are synced from the CRM, services, work hours
                and client files. Schedule, edit, cancel and open the client
                file directly from each booking.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshAll}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCw
                  className={[
                    "h-4 w-4",
                    isFetching ? "animate-spin" : "",
                  ].join(" ")}
                />
                Refresh sync
              </button>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Plus className="h-4 w-4" />
                Schedule appointment
              </button>
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Total appointments"
              value={appointments.length}
              icon={CalendarDays}
            />
            <MetricCard
              label="Today"
              value={todayAppointments.length}
              icon={Clock3}
            />
            <MetricCard
              label="Upcoming"
              value={upcomingCount}
              icon={CheckCircle2}
            />
            <MetricCard
              label="Revenue"
              value={formatMoney(totalRevenue)}
              icon={DollarSign}
            />
            <MetricCard
              label="Unpaid"
              value={unpaidCount}
              icon={CreditCard}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <section className="rounded-[2rem] border border-white/80 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.07)] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                {formatMonthTitle(monthDate)}
              </h3>

              <p className="mt-1 text-sm font-bold text-slate-500">
                Click a day to filter the synced appointment list.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevMonth}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setMonthDate(now);
                  setSelectedDate(getTodayIso());
                  setListMode("today");
                }}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
              >
                Today
              </button>

              <button
                type="button"
                onClick={goNextMonth}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="rounded-2xl bg-slate-50 px-2 py-3 text-xs font-black text-slate-400"
              >
                {day}
              </div>
            ))}

            {monthCells.map((cell, index) => {
              if (!cell) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[116px] rounded-2xl bg-slate-50/60"
                  />
                );
              }

              const key = toIsoDate(cell);
              const dayAppointments = appointmentsByDate[key] || [];
              const isToday = key === getTodayIso();
              const isSelected = key === selectedDate;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setSelectedDate(key);
                    setListMode("selected");
                  }}
                  className={[
                    "min-h-[116px] rounded-2xl border p-3 text-left transition",
                    isSelected
                      ? "border-sky-300 bg-sky-50 shadow-[0_16px_36px_rgba(14,165,233,0.12)]"
                      : "border-slate-100 bg-white hover:border-sky-200 hover:bg-sky-50/40",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={[
                        "grid h-8 w-8 place-items-center rounded-xl text-sm font-black",
                        isToday
                          ? "bg-slate-950 text-white"
                          : "bg-slate-50 text-slate-800",
                      ].join(" ")}
                    >
                      {cell.getDate()}
                    </span>

                    {dayAppointments.length > 0 && (
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-700 ring-1 ring-violet-100">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment._id}
                        className="truncate rounded-xl bg-sky-50 px-2 py-1.5 text-[11px] font-black text-sky-700"
                      >
                        {appointment.time || "—"} ·{" "}
                        {getAppointmentClientName(
                          appointment,
                          clientsById,
                          clients
                        )}
                      </div>
                    ))}

                    {dayAppointments.length > 3 && (
                      <div className="text-[11px] font-black text-slate-400">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.07)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  Synced list
                </h3>

                <p className="mt-1 text-sm font-bold text-slate-500">
                  {listMode === "selected"
                    ? `${selectedDayAppointments.length} appointments on ${formatDate(
                        selectedDate
                      )}`
                    : "All CRM appointments in one place"}
                </p>
              </div>

              {isFetching && (
                <Loader2 className="h-5 w-5 animate-spin text-sky-700" />
              )}
            </div>

            <div className="relative mt-4">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by client, phone, email or service..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <FilterButton
                active={listMode === "all"}
                onClick={() => setListMode("all")}
              >
                All
              </FilterButton>
              <FilterButton
                active={listMode === "today"}
                onClick={() => setListMode("today")}
              >
                Today
              </FilterButton>
              <FilterButton
                active={listMode === "selected"}
                onClick={() => setListMode("selected")}
              >
                Day
              </FilterButton>
              <FilterButton
                active={listMode === "upcoming"}
                onClick={() => setListMode("upcoming")}
              >
                Upcoming
              </FilterButton>
            </div>

            <div className="mt-4 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {filteredAppointments.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50 p-7 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-slate-300" />

                  <h3 className="mt-3 text-base font-black text-slate-950">
                    No appointments found
                  </h3>

                  <p className="mt-1 text-sm font-bold text-slate-500">
                    Schedule a new appointment or change the filter.
                  </p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    clients={clients}
                    clientsById={clientsById}
                    emailMenuOpenId={emailMenuOpenId}
                    setEmailMenuOpenId={setEmailMenuOpenId}
                    onEmail={openEmail}
                    onEdit={() => handleEditAppointment(appointment)}
                    onCancel={() => handleCancelAppointment(appointment._id)}
                    onOpenClient={() => openClientFile(appointment)}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 shadow-[0_18px_50px_rgba(14,165,233,0.08)]">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-600">
                  Work hours
                </p>
                <p className="text-sm font-black text-slate-950">
                  {getWorkHoursLabel(businessSchedule)}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm font-bold leading-6 text-slate-500">
              Time slots are based on the business work hours and selected
              service duration.
            </p>
          </section>
        </aside>
      </div>

      {showAddForm && (
        <AppointmentModal
          editId={editId}
          businessId={businessId}
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
    <div className="rounded-[1.6rem] border border-slate-100 bg-white/85 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
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
        "h-10 rounded-2xl text-xs font-black transition",
        active
          ? "bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]"
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
  emailMenuOpenId,
  setEmailMenuOpenId,
  onEmail,
  onEdit,
  onCancel,
  onOpenClient,
}: {
  appointment: AppointmentItem;
  clients: CRMClient[];
  clientsById: Record<string, CRMClient>;
  emailMenuOpenId: string | null;
  setEmailMenuOpenId: React.Dispatch<React.SetStateAction<string | null>>;
  onEmail: (params: OpenEmailParams) => void;
  onEdit: () => void;
  onCancel: () => void;
  onOpenClient: () => void;
}) {
  const clientName = getAppointmentClientName(appointment, clientsById, clients);
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

  const reminderBody = `Hi ${clientName},

This is a reminder for your appointment on ${appointment.date || "-"} at ${
    appointment.time || "-"
  }.

Thank you.`;

  return (
    <article className="rounded-[1.6rem] border border-slate-100 bg-white p-4 shadow-sm transition hover:border-sky-100 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-black text-sky-700 ring-1 ring-sky-100">
            <CheckCircle2 className="h-3 w-3" />
            Scheduled
          </div>

          <h3 className="mt-2 truncate text-lg font-black text-slate-950">
            {clientName}
          </h3>

          <p className="mt-1 truncate text-sm font-bold text-slate-500">
            {getServiceName(appointment)}
          </p>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          <CalendarDays className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">
        <div className="flex items-center justify-between gap-3">
          <span>Date</span>
          <span className="text-slate-950">{formatDate(appointment.date)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span>Time</span>
          <span className="text-slate-950">{appointment.time || "—"}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span>Duration</span>
          <span className="text-slate-950">
            {formatDuration(appointment.duration)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span>Payment</span>
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-black",
              appointment.paid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            ].join(" ")}
          >
            {appointment.paid ? "Paid" : "Unpaid"}
          </span>
        </div>

        {Number(appointment.price) > 0 && (
          <div className="flex items-center justify-between gap-3">
            <span>Price</span>
            <span className="text-slate-950">
              {formatMoney(appointment.price)}
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
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-950 text-xs font-black text-white transition hover:bg-sky-700"
        >
          <Edit3 className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={onOpenClient}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5" />
          Client file
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              if (!clientEmail) {
                alert("This client does not have an email address.");
                return;
              }

              setEmailMenuOpenId((current) =>
                current === appointment._id ? null : appointment._id
              );
            }}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>

          {emailMenuOpenId === appointment._id && clientEmail && (
            <div className="absolute bottom-12 left-0 z-30 w-40 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <EmailOption
                onClick={() =>
                  onEmail({
                    provider: "gmail",
                    email: clientEmail,
                    subject: "Appointment reminder",
                    body: reminderBody,
                  })
                }
              >
                Gmail
              </EmailOption>

              <EmailOption
                onClick={() =>
                  onEmail({
                    provider: "outlook",
                    email: clientEmail,
                    subject: "Appointment reminder",
                    body: reminderBody,
                  })
                }
              >
                Outlook
              </EmailOption>

              <EmailOption
                onClick={() =>
                  onEmail({
                    provider: "default",
                    email: clientEmail,
                    subject: "Appointment reminder",
                    body: reminderBody,
                  })
                }
              >
                Default mail
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
          Cancel
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
      className="block w-full rounded-xl px-3 py-2 text-left text-xs font-black text-slate-700 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function AppointmentModal({
  editId,
  businessId,
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2.2rem] bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white via-sky-50/50 to-violet-50/50 p-5 md:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700 ring-1 ring-sky-100">
              <CalendarDays className="h-3.5 w-3.5" />
              {editId ? "Edit booking" : "New booking"}
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-950">
              {editId ? "Edit appointment" : "Schedule appointment"}
            </h2>

            <p className="mt-1 text-sm font-bold text-slate-500">
              Choose a client, service, date and available time slot.
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
            <div className="space-y-5">
              <div className="rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Client details
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      Select an existing client or type manually.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormBlock label="Existing client">
                    <select
                      value={appointment.crmClientId}
                      onChange={(event) => onSelectClient(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="">Select client</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {getClientName(client)}
                        </option>
                      ))}
                    </select>
                  </FormBlock>

                  <FormInput
                    label="Client name"
                    value={appointment.clientName}
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        clientName: value,
                      }))
                    }
                    placeholder="Client name"
                  />

                  <FormBlock label="Phone">
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
                    label="Email"
                    type="email"
                    value={appointment.email}
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        email: value,
                      }))
                    }
                    placeholder="client@email.com"
                  />

                  <div className="md:col-span-2">
                    <FormInput
                      label="Address"
                      value={appointment.address}
                      onChange={(value) =>
                        setAppointment((prev) => ({
                          ...prev,
                          address: value,
                        }))
                      }
                      placeholder="Client address"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      Appointment details
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      Time slots are synced with work hours.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormBlock label="Service">
                    <select
                      value={appointment.serviceId}
                      onChange={(event) => onSelectService(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="">Select service</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name || service.title || "Service"}
                        </option>
                      ))}
                    </select>
                  </FormBlock>

                  <FormInput
                    label="Date"
                    type="date"
                    value={appointment.date}
                    onChange={(value) =>
                      setAppointment((prev) => ({
                        ...prev,
                        date: value,
                        time: "",
                      }))
                    }
                  />

                  <FormBlock label="Available time">
                    <SelectTimeFromSlots
                      date={appointment.date}
                      selectedTime={appointment.time}
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
                    />
                  </FormBlock>

                  <FormBlock label="Duration">
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
                          {formatDuration(minutes)}
                        </option>
                      ))}
                    </select>
                  </FormBlock>

                  <FormInput
                    label="Price"
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

                  <FormBlock label="Payment">
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
                      <span>{appointment.paid ? "Paid" : "Unpaid"}</span>
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

                  <div className="md:col-span-2">
                    <FormBlock label="Note">
                      <textarea
                        value={appointment.note}
                        onChange={(event) =>
                          setAppointment((prev) => ({
                            ...prev,
                            note: event.target.value,
                          }))
                        }
                        placeholder="Internal note..."
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                    </FormBlock>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.7rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-5 shadow-sm">
                <h3 className="text-base font-black text-slate-950">
                  Booking summary
                </h3>

                <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                  <SummaryRow label="Client" value={appointment.clientName || "—"} />
                  <SummaryRow label="Service" value={appointment.serviceName || "—"} />
                  <SummaryRow label="Date" value={appointment.date || "—"} />
                  <SummaryRow label="Time" value={appointment.time || "—"} />
                  <SummaryRow
                    label="Duration"
                    value={formatDuration(appointment.duration)}
                  />
                  <SummaryRow
                    label="Price"
                    value={formatMoney(Number(appointment.price) || 0)}
                  />
                  <SummaryRow
                    label="Payment"
                    value={appointment.paid ? "Paid" : "Unpaid"}
                  />
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Required
                </p>

                <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                  Client name, phone, service, date and time are required before
                  saving.
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
            <button
              type="button"
              onClick={onSave}
              disabled={
                isSaving ||
                !appointment.clientName ||
                !appointment.clientPhone ||
                !appointment.serviceId ||
                !appointment.date ||
                !appointment.time
              }
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {editId ? "Save changes" : "Save appointment"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-13 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <FormBlock label={label}>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
      <span className="text-right text-slate-950">{value}</span>
    </div>
  );
}