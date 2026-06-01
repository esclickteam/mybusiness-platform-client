import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  Edit3,
  Mail,
  Plus,
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
  crmClientId?: string;
  clientSnapshot?: ClientSnapshot;
  serviceId?: string;
  serviceName?: string;
  date?: string;
  time?: string;
  duration?: number;
  price?: number;
  paid?: boolean;
  note?: string;
  address?: string;
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

export default function CRMAppointmentsTab() {
  const { user, socket } = useAuth() as AuthValue;
  const businessId = user?.businessId || user?.business?._id || "";

  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [emailMenuOpenId, setEmailMenuOpenId] = useState<string | null>(null);

  const [newAppointment, setNewAppointment] =
    useState<AppointmentFormState>(emptyAppointmentForm);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [clients, setClients] = useState<CRMClient[]>([]);
  const [businessSchedule, setBusinessSchedule] = useState<Record<
    string,
    any
  > | null>(null);

  const scheduleArray = useMemo<ScheduleDay[]>(() => {
    if (!businessSchedule) return [];

    return Object.entries(businessSchedule).map(([day, value]) => {
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
  }, [businessSchedule]);

  useEffect(() => {
    if (!businessId) return;

    API.get("/business/my/services")
      .then((res: any) => setServices(res.data.services || []))
      .catch((err: unknown) => {
        console.error("Failed loading services:", err);
        setServices([]);
      });

    API.get(`/crm-clients/${businessId}`)
      .then((res: any) => setClients(res.data || []))
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
  } = useQuery<AppointmentItem[]>({
    queryKey: ["appointments", businessId],
    queryFn: async () => {
      const res = await API.get("/appointments/all-with-services", {
        params: { businessId },
      });

      return res.data || [];
    },
    enabled: Boolean(businessId),
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

  const filteredAppointments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return appointments;

    return appointments.filter((appointment) => {
      const name = appointment.clientSnapshot?.name || "";
      const phone = appointment.clientSnapshot?.phone || "";
      const email = appointment.clientSnapshot?.email || "";
      const serviceName = appointment.serviceName || "";

      return (
        name.toLowerCase().includes(query) ||
        phone.includes(query) ||
        email.toLowerCase().includes(query) ||
        serviceName.toLowerCase().includes(query)
      );
    });
  }, [appointments, search]);

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

  const unpaidCount = useMemo(() => {
    return appointments.filter((appointment) => !appointment.paid).length;
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA");
    return appointments.filter((appointment) => appointment.date === today);
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
    setNewAppointment(emptyAppointmentForm);
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

  const handleEditAppointment = (appointment: AppointmentItem) => {
    setEditId(appointment._id);
    setShowAddForm(true);

    setNewAppointment({
      crmClientId:
        typeof appointment.crmClientId === "string"
          ? appointment.crmClientId
          : "",
      clientName: appointment.clientSnapshot?.name || "",
      clientPhone: appointment.clientSnapshot?.phone || "",
      address: appointment.clientSnapshot?.address || appointment.address || "",
      email: appointment.clientSnapshot?.email || "",
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

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await API.delete(`/appointments/${id}`);
      queryClient.invalidateQueries({
        queryKey: ["appointments", businessId],
      });
    } catch (err) {
      console.error("Delete appointment error:", err);
      alert("Failed to delete appointment");
    }
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
      phone: newAppointment.clientPhone.trim(),
      email: newAppointment.email.trim(),
      address: newAppointment.address.trim(),
      price: Number(newAppointment.price) || 0,
      paid: newAppointment.paid,
      note: newAppointment.note.trim(),
      serviceId: newAppointment.serviceId,
      serviceName: newAppointment.serviceName || selectedService?.name || "",
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
    } catch (err) {
      console.error("Save appointment error:", err);
      alert("Failed to save appointment");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-slate-950" />
        <p className="text-sm font-bold text-slate-500">
          Loading appointments…
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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/16 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-20 h-56 w-56 rounded-full bg-white/8 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-100">
              <CalendarDays className="h-4 w-4" />
              Appointments CRM
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Smart appointment management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/90">
              Manage bookings, client details, services, payments and follow-ups
              from one premium CRM screen.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-sky-50"
          >
            <Plus className="h-5 w-5" />
            Add Appointment
          </button>
        </div>

        <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
            label="Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
          <MetricCard label="Unpaid" value={unpaidCount} icon={CreditCard} />
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-950">
              Appointments
            </h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {filteredAppointments.length} shown · $
              {paidRevenue.toLocaleString()} paid
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, phone, email or service…"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-[360px]"
              />
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
            >
              <Plus className="h-5 w-5" />
              New Appointment
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              emailMenuOpenId={emailMenuOpenId}
              setEmailMenuOpenId={setEmailMenuOpenId}
              openEmail={openEmail}
              onEdit={() => handleEditAppointment(appointment)}
              onDelete={() => handleDeleteAppointment(appointment._id)}
            />
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="mt-6 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950 shadow-sm">
              <CalendarDays className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black text-slate-950">
              No appointments yet
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first appointment or wait for clients to book from the
              public business profile.
            </p>
          </div>
        )}
      </section>

      {showAddForm && (
        <AppointmentModal
          editId={editId}
          clients={clients}
          services={services}
          businessId={businessId}
          scheduleArray={scheduleArray}
          newAppointment={newAppointment}
          setNewAppointment={setNewAppointment}
          minDuration={minDuration}
          isSaving={isSaving}
          onClose={closeModal}
          onSave={saveAppointment}
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
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100">
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

function AppointmentCard({
  appointment,
  emailMenuOpenId,
  setEmailMenuOpenId,
  openEmail,
  onEdit,
  onDelete,
}: {
  appointment: AppointmentItem;
  emailMenuOpenId: string | null;
  setEmailMenuOpenId: React.Dispatch<React.SetStateAction<string | null>>;
  openEmail: (params: OpenEmailParams) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const name = appointment.clientSnapshot?.name || "Unknown client";
  const phone = appointment.clientSnapshot?.phone || "";
  const email = appointment.clientSnapshot?.email || "";
  const service = appointment.serviceName || "Unknown service";
  const price = Number(appointment.price) || 0;
  const duration = Number(appointment.duration) || 0;

  const reminderBody = `Hi ${name},\n\nThis is a reminder for your appointment on ${appointment.date} at ${appointment.time}.`;

  return (
    <article className="group relative rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
            <UserRound className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {name}
            </h4>

            <div className="mt-1 space-y-1 text-sm font-semibold text-slate-500">
              {phone && <p>{phone}</p>}
              {email && <p className="truncate">📧 {email}</p>}
            </div>
          </div>
        </div>

        <span
          className={[
            "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black",
            appointment.paid
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          ].join(" ")}
        >
          {appointment.paid ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {appointment.paid ? "Paid" : "Unpaid"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <InfoTile label="Service" value={service} />
        <InfoTile
          label="Date & Time"
          value={`${appointment.date || "-"} · ${appointment.time || "-"}`}
        />
        <InfoTile
          label="Duration"
          value={
            duration
              ? duration < 60
                ? `${duration}m`
                : `${Math.floor(duration / 60)}h${
                    duration % 60 ? ` ${duration % 60}m` : ""
                  }`
              : "-"
          }
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-800">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          ${price}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              title="Send email"
              onClick={() => {
                if (!email) {
                  alert("This client does not have an email address.");
                  return;
                }

                setEmailMenuOpenId(
                  emailMenuOpenId === appointment._id
                    ? null
                    : appointment._id
                );
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-sky-50 hover:text-sky-900"
            >
              <Mail className="h-4 w-4" />
            </button>

            {emailMenuOpenId === appointment._id && (
              <div className="absolute right-0 top-12 z-20 w-40 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                <EmailMenuButton
                  label="Gmail"
                  onClick={() =>
                    openEmail({
                      provider: "gmail",
                      email,
                      subject: "Appointment reminder",
                      body: reminderBody,
                    })
                  }
                />
                <EmailMenuButton
                  label="Outlook"
                  onClick={() =>
                    openEmail({
                      provider: "outlook",
                      email,
                      subject: "Appointment reminder",
                      body: reminderBody,
                    })
                  }
                />
                <EmailMenuButton
                  label="Default"
                  onClick={() =>
                    openEmail({
                      provider: "default",
                      email,
                      subject: "Appointment reminder",
                      body: reminderBody,
                    })
                  }
                />
              </div>
            )}
          </div>

          <button
            type="button"
            title="Edit appointment"
            onClick={onEdit}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-900 transition hover:bg-slate-950 hover:text-white"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Delete appointment"
            onClick={onDelete}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700 transition hover:bg-rose-600 hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function AppointmentModal({
  editId,
  clients,
  services,
  businessId,
  scheduleArray,
  newAppointment,
  setNewAppointment,
  minDuration,
  isSaving,
  onClose,
  onSave,
}: {
  editId: string | null;
  clients: CRMClient[];
  services: ServiceItem[];
  businessId: string;
  scheduleArray: ScheduleDay[];
  newAppointment: AppointmentFormState;
  setNewAppointment: React.Dispatch<
    React.SetStateAction<AppointmentFormState>
  >;
  minDuration: number;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
              {editId ? "Edit booking" : "New booking"}
            </p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {editId ? "Edit Appointment" : "Add Appointment"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Create or update a client appointment directly inside your CRM.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="CRM Client">
            <select
              value={newAppointment.crmClientId}
              onChange={(event) => {
                const client = clients.find(
                  (item) => item._id === event.target.value
                );

                setNewAppointment((prev) => ({
                  ...prev,
                  crmClientId: client?._id || "",
                  clientName: client?.fullName || "",
                  clientPhone: client?.phone
                    ? client.phone.replace(/\D/g, "")
                    : "",
                  email: client?.email || "",
                  address: client?.address || "",
                }));
              }}
              className="input-base"
            >
              <option value="">Select CRM Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.fullName}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Full Name" required>
            <input
              value={newAppointment.clientName}
              onChange={(event) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  clientName: event.target.value,
                }))
              }
              placeholder="Full name"
              className="input-base"
            />
          </FormField>

          <FormField label="Phone" required>
            <PhoneInput
              country="us"
              value={newAppointment.clientPhone}
              onChange={(phone) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  clientPhone: phone,
                }))
              }
              containerClass="!w-full"
              inputClass="!w-full !h-[48px] !rounded-2xl !border !border-slate-200 !bg-slate-50 !pl-14 !text-sm !font-semibold !text-slate-900 !outline-none"
              buttonClass="!rounded-l-2xl !border-slate-200"
            />
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              value={newAppointment.email}
              onChange={(event) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              placeholder="Email"
              className="input-base"
            />
          </FormField>

          <FormField label="Address">
            <input
              value={newAppointment.address}
              onChange={(event) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  address: event.target.value,
                }))
              }
              placeholder="Address"
              className="input-base"
            />
          </FormField>

          <FormField label="Service" required>
            <select
              value={newAppointment.serviceId}
              onChange={(event) => {
                const service = services.find(
                  (item) => item._id === event.target.value
                );

                setNewAppointment((prev) => ({
                  ...prev,
                  serviceId: service?._id || "",
                  serviceName: service?.name || service?.title || "",
                  time: "",
                  duration: Number(service?.duration) || 30,
                  price: service?.price ?? "",
                }));
              }}
              className="input-base"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name || service.title}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Date" required>
            <input
              type="date"
              value={newAppointment.date}
              onChange={(event) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  date: event.target.value,
                  time: "",
                }))
              }
              className="input-base"
            />
          </FormField>

          <FormField label="Available Time" required>
            <SelectTimeFromSlots
              date={newAppointment.date}
              selectedTime={newAppointment.time}
              onChange={(time: string) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  time,
                }))
              }
              businessId={businessId}
              serviceId={newAppointment.serviceId}
              schedule={scheduleArray}
              duration={newAppointment.duration}
            />
          </FormField>

          <FormField label="Duration">
            <select
              value={newAppointment.duration}
              onChange={(event) =>
                setNewAppointment((prev) => ({
                  ...prev,
                  duration: Number(event.target.value),
                }))
              }
              className="input-base"
            >
              {Array.from(
                {
                  length:
                    Math.floor((MAX_DURATION - minDuration) / DURATION_STEP) +
                    1,
                },
                (_, index) => {
                  const minutes = minDuration + index * DURATION_STEP;
                  const hours = Math.floor(minutes / 60);
                  const mins = minutes % 60;

                  const label =
                    hours > 0
                      ? `${hours}h${mins ? ` ${mins}m` : ""}`
                      : `${minutes}m`;

                  return (
                    <option key={minutes} value={minutes}>
                      {label}
                    </option>
                  );
                }
              )}
            </select>
          </FormField>

          <FormField label="Price">
            <div className="relative">
              <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                value={newAppointment.price}
                onChange={(event) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                placeholder="Price"
                className="input-base pl-11"
              />
            </div>
          </FormField>

          <div className="lg:col-span-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-black text-slate-800">
              <input
                type="checkbox"
                checked={newAppointment.paid}
                onChange={(event) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    paid: event.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-slate-300 text-slate-950 focus:ring-sky-500"
              />
              Mark as paid
            </label>
          </div>

          <div className="lg:col-span-2">
            <FormField label="Internal Note">
              <textarea
                value={newAppointment.note}
                onChange={(event) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
                placeholder="Add note for this appointment"
                rows={4}
                className="input-base resize-none"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
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
            {isSaving ? "Saving…" : editId ? "Save Changes" : "Schedule"}
          </button>
        </div>
      </div>
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

function EmailMenuButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-600 transition hover:bg-sky-50 hover:text-sky-900"
    >
      {label}
    </button>
  );
}