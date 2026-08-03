import API from "../api";

export type PublicBookingService = {
  _id?: string;
  id?: string;
  name?: string;
  duration?: number;
  price?: number;
  description?: string;
};

export async function getPublicBookingServices(businessId: string) {
  const { data } = await API.get(`/business/${businessId}`);
  const list = (data?.business?.services || data?.services || []) as PublicBookingService[];
  return Array.isArray(list) ? list : [];
}

export async function getPublicBookingSlots(params: {
  businessId: string;
  serviceId: string;
  date: string;
}) {
  const { data } = await API.get("/appointments/slots", { params });
  const slots = Array.isArray(data?.slots) ? data.slots : [];
  return slots.map(String);
}

export async function createPublicBooking(payload: {
  businessId: string;
  serviceId: string;
  date: string;
  time: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestNote?: string;
  customFields?: Array<{
    id: string;
    label: string;
    type?: string;
    value: string;
  }>;
}) {
  const { data } = await API.post("/appointments/public", {
    ...payload,
    name: payload.guestName,
    phone: payload.guestPhone,
    email: payload.guestEmail,
    note: payload.guestNote,
    customFields: payload.customFields || [],
  });
  return data;
}
