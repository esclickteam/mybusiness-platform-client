import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MetaLocationTarget } from "../../../../api/metaCampaignsApi";

type Props = {
  locations: MetaLocationTarget[];
  hint?: string;
  /** Location identity to focus (Meta-style: show that city's real radius). */
  focusKey?: string | null;
  onSelectLocation?: (identity: string) => void;
};

const ISRAEL_BOUNDS = L.latLngBounds([29.45, 34.2], [33.35, 35.9]);

function pinIcon(active: boolean) {
  const color = active ? "#1877F2" : "#64748b";
  return L.divIcon({
    className: "meta-loc-pin",
    html: `<div style="
      width:${active ? 22 : 16}px;height:${active ? 22 : 16}px;border-radius:9999px;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 10px rgba(15,23,42,.4);
    "></div>`,
    iconSize: [active ? 22 : 16, active ? 22 : 16],
    iconAnchor: [active ? 11 : 8, active ? 11 : 8],
  });
}

function hasCoords(item: MetaLocationTarget) {
  return (
    item.latitude != null &&
    item.longitude != null &&
    Number.isFinite(Number(item.latitude)) &&
    Number.isFinite(Number(item.longitude))
  );
}

function identityOf(item: MetaLocationTarget) {
  if (item.type === "custom") return `custom:${item.addressString || item.key}`;
  return `${item.type}:${item.key}`;
}

export default function MetaLocationsMap({
  locations,
  hint,
  focusKey = null,
  onSelectLocation,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const points = useMemo(
    () =>
      locations.filter(hasCoords).map((item) => {
        const radiusKm =
          item.type === "country"
            ? null
            : item.radiusKm != null && Number(item.radiusKm) > 0
              ? Number(item.radiusKm)
              : null;
        return {
          identity: identityOf(item),
          name: item.name,
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          radiusKm,
          isCountry: item.type === "country",
          active: focusKey ? identityOf(item) === focusKey : Boolean(radiusKm),
        };
      }),
    [locations, focusKey]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.fitBounds(ISRAEL_BOUNDS);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    const onResize = () => map.invalidateSize();
    window.setTimeout(onResize, 120);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (!points.length) {
      map.fitBounds(ISRAEL_BOUNDS);
      return;
    }

    const focus =
      points.find((p) => p.identity === focusKey) ||
      points.find((p) => p.radiusKm != null) ||
      points[0];

    points.forEach((point) => {
      const isFocus = point.identity === focus.identity;
      const marker = L.marker([point.lat, point.lng], {
        icon: pinIcon(isFocus),
      });
      marker.on("click", () => onSelectLocation?.(point.identity));
      marker.bindPopup(
        `<strong>${point.name}</strong>${
          point.radiusKm != null
            ? `<br/>רדיוס אמיתי: ${point.radiusKm} ק״מ סביב העיר`
            : point.isCountry
              ? "<br/>מדינה שלמה"
              : ""
        }`
      );
      marker.addTo(layer);

      // Draw REAL geographic circle only for the focused city (Facebook-style).
      if (isFocus && point.radiusKm != null && point.radiusKm > 0) {
        const circle = L.circle([point.lat, point.lng], {
          radius: point.radiusKm * 1000, // meters — true Earth distance
          color: "#1877F2",
          weight: 3,
          fillColor: "#1877F2",
          fillOpacity: 0.2,
          opacity: 1,
        });
        circle.bindTooltip(`${point.name} · רדיוס ${point.radiusKm} ק״מ`, {
          sticky: true,
          direction: "center",
        });
        circle.addTo(layer);

        // Zoom so the full real radius fills the map (user sees what's included).
        map.fitBounds(circle.getBounds().pad(0.15), {
          animate: true,
          maxZoom: 12,
        });
      }
    });

    // If focus has no radius (country / places mode), show all pins.
    if (focus && (focus.radiusKm == null || focus.radiusKm <= 0)) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.35), { maxZoom: 11, animate: true });
      }
    }

    window.setTimeout(() => map.invalidateSize(), 80);
  }, [points, focusKey, onSelectLocation]);

  const focusPoint = points.find((p) => p.identity === focusKey && p.radiusKm != null);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div ref={containerRef} className="h-[360px] w-full" />
      {focusPoint ? (
        <p className="border-t border-slate-200 bg-[#1877F2]/5 px-3 py-2 text-[11px] font-black text-[#1877F2]">
          רדיוס אמיתי סביב {focusPoint.name}: {focusPoint.radiusKm} ק״מ — העיגול
          במפה בקנה מידה גאוגרפי
        </p>
      ) : null}
      {hint ? (
        <p className="px-3 py-2 text-[11px] font-semibold text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
