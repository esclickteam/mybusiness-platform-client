import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLocaleDir } from "../../../hooks/useLocaleDir";

import BusinessAdvisorTab from "./BizUplyTabs/BusinessAdvisorTab";
import BizuplyLoader from "../../../components/ui/BizuplyLoader";

type Appointment = {
  _id?: string;
  id?: string;
  [key: string]: unknown;
};

type BusinessDetails = {
  [key: string]: unknown;
} | null;

type BusinessApiResponse = {
  business?: BusinessDetails;
  [key: string]: unknown;
};

type AppointmentsApiResponse =
  | Appointment[]
  | {
      appointments?: Appointment[];
      data?: Appointment[];
      [key: string]: unknown;
    };

type AuthUser = {
  _id?: string;
  id?: string;
  businessId?: string;
  [key: string]: unknown;
};

const getAppointmentsList = (
  data: AppointmentsApiResponse
): Appointment[] => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.appointments)) return data.appointments;

  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const BizUplyAdvisor: React.FC = () => {
  const dir = useLocaleDir();
  const [businessDetails, setBusinessDetails] =
    useState<BusinessDetails>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string | null>(null);

  const { user, loading } = useAuth() as {
    user: AuthUser | null;
    loading: boolean;
  };

  const businessId = user?.businessId || null;
  const userId = user?._id || user?.id || null;

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!businessId || !token) {
      setBusinessDetails(null);
      setAppointments([]);
      setSelectedAppointmentId(null);
      return;
    }

    let isMounted = true;

    const loadBusinessData = async () => {
      try {
        const res = await fetch(`/api/business/${businessId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("שגיאה בטעינת פרטי העסק");
        }

        const data = (await res.json()) as BusinessApiResponse;

        if (!isMounted) return;

        setBusinessDetails(data?.business || data || null);
      } catch (error) {
        console.error("Business load error:", error);

        if (!isMounted) return;

        setBusinessDetails(null);
      }
    };

    const loadAppointments = async () => {
      try {
        const res = await fetch(`/api/appointments?businessId=${businessId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("שגיאה בטעינת התורים");
        }

        const data = (await res.json()) as AppointmentsApiResponse;
        const list = getAppointmentsList(data);

        if (!isMounted) return;

        setAppointments(list);

        const firstAppointmentId = list[0]?._id || list[0]?.id || null;
        setSelectedAppointmentId(firstAppointmentId);
      } catch (error) {
        console.error("Appointments load error:", error);

        if (!isMounted) return;

        setAppointments([]);
        setSelectedAppointmentId(null);
      }
    };

    void loadBusinessData();
    void loadAppointments();

    return () => {
      isMounted = false;
    };
  }, [businessId]);

  if (loading) {
    return <BizuplyLoader fullScreen label="טוען את יועץ BizUply..." />;
  }

  if (!businessId) {
    return (
      <div
        dir={dir}
        className="flex min-h-[60vh] items-center justify-center px-4"
      >
        <div className="max-w-xl rounded-[28px] border border-amber-200 bg-amber-50 px-6 py-5 text-center shadow-sm">
          <h2 className="text-xl font-black text-slate-800">
            לא נמצא עסק מחובר
          </h2>

          <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">
            כדי להשתמש ביועץ BizUply צריך להתחבר לעסק פעיל במערכת.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      dir={dir}
      className="min-h-screen bg-slate-50 px-3 py-4 sm:px-5 lg:px-6"
    >
      <BusinessAdvisorTab
        businessId={businessId}
        userId={userId}
        conversationId={null}
        businessDetails={{
          business: businessDetails,
          appointments,
          selectedAppointmentId,
        }}
      />
    </main>
  );
};

export default BizUplyAdvisor;