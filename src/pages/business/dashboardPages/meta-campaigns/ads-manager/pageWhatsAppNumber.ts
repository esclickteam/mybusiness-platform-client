export type PageWhatsAppNumber = {
  id: string;
  phone: string;
  e164?: string;
  displayNumber: string;
  isWhatsAppBusiness?: boolean;
  linkedToPage?: boolean;
  pageId?: string;
};

export type PageWhatsAppCountry = {
  iso: string;
  dial: string;
  label: string;
};

export const PAGE_WHATSAPP_COUNTRIES: PageWhatsAppCountry[] = [
  { iso: "IL", dial: "972", label: "Israel" },
  { iso: "US", dial: "1", label: "United States" },
  { iso: "GB", dial: "44", label: "United Kingdom" },
  { iso: "DE", dial: "49", label: "Germany" },
  { iso: "FR", dial: "33", label: "France" },
  { iso: "IT", dial: "39", label: "Italy" },
  { iso: "ES", dial: "34", label: "Spain" },
  { iso: "BR", dial: "55", label: "Brazil" },
  { iso: "IN", dial: "91", label: "India" },
  { iso: "UA", dial: "380", label: "Ukraine" },
  { iso: "RU", dial: "7", label: "Russia" },
  { iso: "TR", dial: "90", label: "Turkey" },
  { iso: "AE", dial: "971", label: "United Arab Emirates" },
  { iso: "SA", dial: "966", label: "Saudi Arabia" },
  { iso: "EG", dial: "20", label: "Egypt" },
  { iso: "JO", dial: "962", label: "Jordan" },
  { iso: "MA", dial: "212", label: "Morocco" },
];

export const WHATSAPP_CONVERSION_LOCATION = "WhatsApp";
export const MAX_VERIFY_ATTEMPTS = 5;

export function isWhatsAppConversionLocation(value?: string | null): boolean {
  return String(value || "").toLowerCase().includes("whatsapp");
}

export function digitsOnly(value: string): string {
  return String(value || "").replace(/\D/g, "");
}

export function toWhatsAppDigits(value: string, defaultDial = "972"): string {
  let digits = digitsOnly(value);
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(defaultDial)) return digits;
  if (defaultDial === "972" && digits.startsWith("0") && digits.length >= 9) {
    return `972${digits.slice(1)}`;
  }
  return digits;
}

export function numbersEqual(a?: string | null, b?: string | null): boolean {
  const left = toWhatsAppDigits(String(a || ""));
  const right = toWhatsAppDigits(String(b || ""));
  return Boolean(left) && left === right;
}

export function splitPhoneInput(
  value: string,
  country: PageWhatsAppCountry = PAGE_WHATSAPP_COUNTRIES[0]
): { country: PageWhatsAppCountry; national: string } {
  const digits = digitsOnly(value);
  const match = PAGE_WHATSAPP_COUNTRIES.find(
    (row) => digits.startsWith(row.dial) && digits.length > row.dial.length
  );
  if (match) {
    return { country: match, national: digits.slice(match.dial.length) };
  }
  if (country.dial === "972" && digits.startsWith("0")) {
    return { country, national: digits.slice(1) };
  }
  return { country, national: digits };
}

export function composeWhatsAppPhone(
  country: PageWhatsAppCountry,
  national: string
): string {
  const local = digitsOnly(national).replace(/^0+/, "");
  if (!local) return "";
  return `${country.dial}${local}`;
}

export function displayWhatsAppNumber(phone: string): string {
  const digits = toWhatsAppDigits(phone);
  if (!digits) return "";
  if (digits.startsWith("972") && digits.length >= 11) {
    const rest = digits.slice(3);
    return `+972 ${rest.slice(0, 2)}-${rest.slice(2)}`;
  }
  return `+${digits}`;
}

export function findLinkedNumber(
  numbers: PageWhatsAppNumber[],
  phone?: string | null
): PageWhatsAppNumber | null {
  if (!phone) return null;
  return numbers.find((row) => numbersEqual(row.phone, phone)) || null;
}
