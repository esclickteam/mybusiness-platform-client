import API from "../api";

export type BookingFormFieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox";

export type BookingFormField = {
  id: string;
  label: string;
  type: BookingFormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  width?: "half" | "full";
};

export type BookingCustomFieldValue = {
  id: string;
  label: string;
  type: BookingFormFieldType | string;
  value: string;
};

export async function getBookingFormFields(businessId: string) {
  const { data } = await API.get("/appointments/booking-form-fields", {
    params: { businessId },
  });
  return (Array.isArray(data?.fields) ? data.fields : []) as BookingFormField[];
}

export async function saveBookingFormFields(
  businessId: string,
  fields: BookingFormField[]
) {
  const { data } = await API.put("/appointments/booking-form-fields", {
    businessId,
    fields,
  });
  return (Array.isArray(data?.fields) ? data.fields : []) as BookingFormField[];
}
