const heNumber = new Intl.NumberFormat("he-IL");

const heIls = new Intl.NumberFormat("he-IL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const heDate = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
});

const heDateTime = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export const WHATSAPP_DEFAULT_UNIT_PRICE_ILS = 0.2;

export function formatHeNumber(value: number) {
  return heNumber.format(Number.isFinite(value) ? value : 0);
}

export function formatHeIls(value: number) {
  return `${heIls.format(Number.isFinite(value) ? value : 0)} ₪`;
}

export function formatHeDate(iso: string | null | undefined) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return heDate.format(date);
}

export function formatHeDateTime(iso: string | null | undefined) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return heDateTime.format(date);
}

export function resolveWhatsAppUnitPriceIls(unitPriceIls?: number | null) {
  const n = Number(unitPriceIls);
  return Number.isFinite(n) && n > 0 ? n : WHATSAPP_DEFAULT_UNIT_PRICE_ILS;
}
