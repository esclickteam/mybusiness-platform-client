import API from "../api";

export type PublicBookingService = {
  _id?: string;
  id?: string;
  name?: string;
  duration?: number;
  price?: number;
  description?: string;
};

/**
 * Public booking services — same endpoint BookingWidget uses.
 * GET /business/:businessId (no auth). Returns [] when the business has none.
 * Throws on missing business (404) / network errors for the caller to handle.
 */
export async function getPublicBookingServices(businessId: string) {
  const { data } = await API.get(`/business/${businessId}`);
  const list = (data?.business?.services ||
    data?.services ||
    []) as PublicBookingService[];
  if (!Array.isArray(list)) return [];
  return list.filter((service) => {
    const id = String(service?._id || service?.id || "").trim();
    const name = String(service?.name || "").trim();
    return Boolean(id && name);
  });
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
  guestEmail: string;
  guestNote?: string;
}) {
  const { data } = await API.post("/appointments/public", {
    ...payload,
    name: payload.guestName,
    phone: payload.guestPhone,
    email: payload.guestEmail,
    note: payload.guestNote,
  });
  return data;
}
