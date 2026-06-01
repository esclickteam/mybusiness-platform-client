import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  StickyNote,
  UserRound,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import API from "@api";
import ClientTasksAndNotes from "../../../../components/CRM/ClientTasksAndNotes";

type CustomerTab = "appointments" | "extras";

type CRMClient = {
  _id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  totalSpent?: number;
  appointments?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};

type AppointmentItem = {
  _id: string;
  serviceName?: string;
  serviceId?: string;
  date?: string;
  time?: string;
  note?: string;
  duration?: number;
  price?: number;
  paid?: boolean;
  paymentMethod?: string;
};

type CustomerData = {
  appointments: AppointmentItem[];
};

type CRMCustomerFileProps = {
  client: CRMClient;
  isNew?: boolean;
  onClose: () => void;
  businessId: string;
};

type NewClientForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
};

export default function CRMCustomerFile({
  client,
  isNew = false,
  onClose,
  businessId,
}: CRMCustomerFileProps) {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<CustomerTab>("appointments");
  const [customerData, setCustomerData] = useState<CustomerData>({
    appointments: [],
  });

  const [loading, setLoading] = useState(false);
  const [savingClient, setSavingClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newClient, setNewClient] = useState<NewClientForm>(
    isNew
      ? {
          fullName: "",
          phone: "",
          email: "",
          address: "",
        }
      : {
          fullName: client?.fullName || "",
          phone: client?.phone || "",
          email: client?.email || "",
          address: client?.address || "",
        }
  );

  const appointments = customerData.appointments;

  const totalAppointments = appointments.length;

  const paidAppointments = useMemo(() => {
    return appointments.filter((appointment) => appointment.paid).length;
  }, [appointments]);

  const totalRevenue = useMemo(() => {
    return appointments.reduce((sum, appointment) => {
      return sum + (Number(appointment.price) || 0);
    }, 0);
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA");

    return [...appointments]
      .filter((appointment) => {
        if (!appointment.date) return false;
        return appointment.date >= today;
      })
      .sort((a, b) => {
        const dateA = `${a.date || ""} ${a.time || ""}`;
        const dateB = `${b.date || ""} ${b.time || ""}`;
        return dateA.localeCompare(dateB);
      })[0];
  }, [appointments]);

  const lastAppointment = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA");

    return [...appointments]
      .filter((appointment) => {
        if (!appointment.date) return false;
        return appointment.date < today;
      })
      .sort((a, b) => {
        const dateA = `${a.date || ""} ${a.time || ""}`;
        const dateB = `${b.date || ""} ${b.time || ""}`;
        return dateB.localeCompare(dateA);
      })[0];
  }, [appointments]);

  const clientInitials = useMemo(() => {
    return String(client?.fullName || newClient.fullName || "Client")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [client?.fullName, newClient.fullName]);

  const handleSave = async () => {
    if (!newClient.fullName.trim() || !newClient.phone.trim()) {
      alert("Full name and phone number are required");
      return;
    }

    if (!businessId) {
      alert("Missing business ID");
      return;
    }

    setSavingClient(true);

    try {
      await API.post("/crm-clients", {
        ...newClient,
        fullName: newClient.fullName.trim(),
        phone: newClient.phone.trim(),
        email: newClient.email.trim(),
        address: newClient.address.trim(),
        businessId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["clients", businessId],
      });

      alert("Client saved successfully");
      onClose();
    } catch (err) {
      console.error("Error saving client:", err);
      alert("Failed to save client");
    } finally {
      setSavingClient(false);
    }
  };

  useEffect(() => {
    const fetchCustomerFile = async () => {
      if (!client?._id || !businessId || isNew) return;

      setLoading(true);
      setError(null);

      try {
        const res = await API.get(`/crm-customer/${client._id}`, {
          params: { businessId },
        });

        setCustomerData({
          appointments: Array.isArray(res.data?.appointments)
            ? res.data.appointments
            : [],
        });
      } catch (err) {
        console.error("Error loading customer file:", err);

        setCustomerData({
          appointments: [],
        });

        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerFile();
  }, [client?._id, businessId, isNew]);

  if (isNew) {
    return (
      <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            New customer file
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Create Client
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add a new client to the CRM database.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField label="Full name" required>
            <input
              value={newClient.fullName}
              onChange={(event) =>
                setNewClient((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
              placeholder="Full name"
              className="input-base"
            />
          </FormField>

          <FormField label="Phone" required>
            <input
              value={newClient.phone}
              onChange={(event) =>
                setNewClient((prev) => ({
                  ...prev,
                  phone: event.target.value,
                }))
              }
              placeholder="Phone"
              className="input-base"
            />
          </FormField>

          <FormField label="Email">
            <input
              value={newClient.email}
              onChange={(event) =>
                setNewClient((prev) => ({
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
              value={newClient.address}
              onChange={(event) =>
                setNewClient((prev) => ({
                  ...prev,
                  address: event.target.value,
                }))
              }
              placeholder="Address"
              className="input-base"
            />
          </FormField>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="crm-secondary-btn"
            disabled={savingClient}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="crm-primary-btn"
            disabled={savingClient}
          >
            {savingClient ? "Saving..." : "Save Client"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-slate-950 via-violet-950 to-violet-700 p-6 text-white shadow-[0_24px_80px_rgba(88,28,135,0.20)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-white/15 text-2xl font-black text-white shadow-xl shadow-violet-950/20">
              {clientInitials || <UserRound className="h-8 w-8" />}
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-violet-100">
                <Sparkles className="h-4 w-4" />
                Customer File
              </div>

              <h2 className="mt-4 truncate text-3xl font-black tracking-tight sm:text-4xl">
                {client?.fullName || "Unnamed Client"}
              </h2>

              <div className="mt-4 grid gap-2 text-sm font-semibold text-violet-100 sm:grid-cols-2">
                <ClientInfoLine icon={Phone} value={client?.phone || "-"} />
                <ClientInfoLine icon={Mail} value={client?.email || "-"} />
                <ClientInfoLine icon={MapPin} value={client?.address || "-"} />
                <ClientInfoLine
                  icon={FileText}
                  value={`Client ID: ${client?._id?.slice(-6) || "-"}`}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
            <CustomerMetric
              label="Appointments"
              value={totalAppointments}
              icon={CalendarDays}
            />
            <CustomerMetric
              label="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
            />
            <CustomerMetric
              label="Paid visits"
              value={paidAppointments}
              icon={CheckCircle2}
            />
            <CustomerMetric
              label="Next visit"
              value={nextAppointment?.date || "-"}
              icon={Clock3}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="flex gap-2 overflow-x-auto">
          <TabButton
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
            icon={CalendarDays}
            label="Appointments"
          />

          <TabButton
            active={activeTab === "extras"}
            onClick={() => setActiveTab("extras")}
            icon={StickyNote}
            label="Notes & Tasks"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState text={error} />
        ) : (
          <>
            {activeTab === "appointments" && (
              <AppointmentsPanel
                appointments={appointments}
                lastAppointment={lastAppointment}
                nextAppointment={nextAppointment}
              />
            )}

            {activeTab === "extras" && (
              <ClientTasksAndNotes
                clientId={client?._id}
                businessId={businessId}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function AppointmentsPanel({
  appointments,
  lastAppointment,
  nextAppointment,
}: {
  appointments: AppointmentItem[];
  lastAppointment?: AppointmentItem;
  nextAppointment?: AppointmentItem;
}) {
  if (appointments.length === 0) {
    return (
      <div className="crm-empty-state">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-violet-600 shadow-sm">
          <CalendarDays className="h-7 w-7" />
        </div>

        <h3 className="text-xl font-black text-slate-950">
          No appointments for this client
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          When this client books or receives a service, their full appointment
          history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2">
        <MiniInsight
          label="Last appointment"
          value={
            lastAppointment
              ? `${lastAppointment.date} · ${lastAppointment.time || "-"}`
              : "-"
          }
          icon={Clock3}
        />

        <MiniInsight
          label="Next appointment"
          value={
            nextAppointment
              ? `${nextAppointment.date} · ${nextAppointment.time || "-"}`
              : "-"
          }
          icon={CalendarDays}
        />
      </div>

      <div>
        <h3 className="mb-4 text-xl font-black text-slate-950">
          Appointment History
        </h3>

        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <AppointmentHistoryCard
              key={appointment._id}
              appointment={appointment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppointmentHistoryCard({
  appointment,
}: {
  appointment: AppointmentItem;
}) {
  const duration = Number(appointment.duration) || 0;
  const price = Number(appointment.price) || 0;

  const durationLabel =
    duration > 0
      ? duration < 60
        ? `${duration}m`
        : `${Math.floor(duration / 60)}h${
            duration % 60 ? ` ${duration % 60}m` : ""
          }`
      : "-";

  return (
    <article className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-white hover:shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-base font-black text-slate-950">
              {appointment.serviceName || "Unknown service"}
            </h4>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {appointment.date || "-"} · {appointment.time || "-"}
            </p>

            {appointment.note && (
              <p className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-500">
                {appointment.note}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[360px]">
          <SmallTile label="Duration" value={durationLabel} />
          <SmallTile label="Price" value={`$${price}`} />
          <SmallTile
            label="Payment"
            value={appointment.paid ? "Paid" : "Unpaid"}
          />
        </div>
      </div>
    </article>
  );
}

function ClientInfoLine({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-violet-100" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function CustomerMetric({
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

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition",
        active
          ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
          : "bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-700",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function MiniInsight({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-black text-slate-950">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function SmallTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-10 text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      <p className="text-sm font-bold text-slate-500">
        Loading customer file...
      </p>
    </div>
  );
}

function ErrorState({ text }: { text: string }) {
  return (
    <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-center">
      <p className="text-lg font-black text-red-700">{text}</p>
      <p className="mt-2 text-sm text-red-500">
        Please refresh the page and try again.
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