import { useEffect, useMemo, useState } from "react";

import { getPublicBookingServices } from "../../../../../../api/publicBookingApi";

type CrmService = {
  name: string;
  description: string;
  durationLabel: string;
  priceLabel: string;
};

function formatDuration(duration?: number) {
  if (!duration || !Number.isFinite(Number(duration))) return "";
  return `${Math.round(Number(duration))} דק׳`;
}

function formatPrice(price?: number) {
  if (price == null || !Number.isFinite(Number(price))) return "";
  return `₪${Math.round(Number(price))}`;
}

/**
 * Overlay CRM booking services onto beauty-template itemOne..itemFour data keys.
 * Falls back to template demo data when businessId is missing or CRM is empty.
 */
export function useCrmBookingServiceData(
  baseData: Record<string, any>,
  businessId?: string | null,
) {
  const id = String(businessId || "").trim();
  const [services, setServices] = useState<CrmService[]>([]);

  useEffect(() => {
    if (!id) {
      setServices([]);
      return;
    }

    let cancelled = false;
    getPublicBookingServices(id)
      .then((list) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) {
          if (!cancelled) setServices([]);
          return;
        }
        setServices(
          list.map((service, index) => ({
            name: String(service.name || `שירות ${index + 1}`),
            description: String(service.description || ""),
            durationLabel: formatDuration(service.duration),
            priceLabel: formatPrice(
              service.price != null ? Number(service.price) : undefined,
            ),
          })),
        );
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return useMemo(() => {
    if (!services.length) return baseData;

    const next: Record<string, any> = { ...baseData };
    const keys = ["One", "Two", "Three", "Four"] as const;

    services.slice(0, 4).forEach((service, index) => {
      const key = keys[index];
      next[`item${key}Title`] = service.name;
      if (service.description) {
        next[`item${key}Text`] = service.description;
      }
      if (service.durationLabel) {
        next[`item${key}Duration`] = service.durationLabel;
      }
      if (service.priceLabel) {
        next[`item${key}Price`] = service.priceLabel;
      }
    });

    return next;
  }, [baseData, services]);
}
