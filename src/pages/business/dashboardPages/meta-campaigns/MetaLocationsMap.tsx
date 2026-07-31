import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MetaLocationTarget } from "../../../../api/metaCampaignsApi";

type Props = {
  locations: MetaLocationTarget[];
  hint?: string;
  /** Force-draw this radius (km) on non-country pins when location has no radiusKm. */
  fallbackRadiusKm?: number | null;
};

const ISRAEL_BOUNDS = L.latLngBounds([29.45, 34.2], [33.35, 35.9]);

const pinIcon = L.divIcon({
  className: "meta-loc-pin",
  html: `<div style="
    width:20px;height:20px;border-radius:9999px;
    background:#1877F2;border:3px solid #fff;
    box-shadow:0 2px 10px rgba(15,23,42,.4);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function hasCoords(item: MetaLocationTarget) {
  return (
    item.latitude != null &&
    item.longitude != null &&
    Number.isFinite(Number(item.latitude)) &&
    Number.isFinite(Number(item.longitude))
  );
}

export default function MetaLocationsMap({
  locations,
  hint,
  fallbackRadiusKm = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const points = useMemo(
    () =>
      locations.filter(hasCoords).map((item) => {
        const explicit =
          item.radiusKm != null && Number(item.radiusKm) > 0
            ? Number(item.radiusKm)
            : null;
        const radiusKm =
          item.type === "country"
            ? null
            : explicit ??
              (fallbackRadiusKm != null && fallbackRadiusKm > 0
                ? Number(fallbackRadiusKm)
                : null);
        return {
          id: `${item.type}:${item.key}:${radiusKm || 0}:${item.latitude}:${item.longitude}`,
          name: item.name,
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          radiusKm,
          isCountry: item.type === "country",
        };
      }),
    [locations, fallbackRadiusKm]
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
    window.setTimeout(onResize, 100);
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

    const bounds = L.latLngBounds([]);
    let hasRadius = false;

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: pinIcon });
      marker.bindPopup(
        `<strong>${point.name}</strong>${
          point.radiusKm != null
            ? `<br/>רדיוס: ${point.radiusKm} ק״מ`
            : point.isCountry
              ? "<br/>מדינה שלמה"
              : ""
        }`
      );
      marker.addTo(layer);
      bounds.extend([point.lat, point.lng]);

      if (point.radiusKm != null && point.radiusKm > 0) {
        hasRadius = true;
        const meters = point.radiusKm * 1000;
        const circle = L.circle([point.lat, point.lng], {
          radius: meters,
          color: "#1877F2",
          weight: 3,
          fillColor: "#1877F2",
          fillOpacity: 0.18,
          opacity: 0.95,
        });
        circle.bindTooltip(`${point.name} · ${point.radiusKm} ק״מ`, {
          sticky: true,
          direction: "center",
          className: "meta-radius-tooltip",
        });
        circle.addTo(layer);
        bounds.extend(circle.getBounds());
      }
    });

    if (bounds.isValid()) {
      // Zoom out enough so the full radius circle is visible (what's included).
      map.fitBounds(bounds.pad(hasRadius ? 0.35 : 0.25), {
        maxZoom: hasRadius ? 11 : 12,
        animate: true,
      });
    }
    window.setTimeout(() => map.invalidateSize(), 80);
  }, [points]);

  const radiusSummary = points
    .filter((p) => p.radiusKm != null)
    .map((p) => `${p.name}: ${p.radiusKm} ק״מ`)
    .join(" · ");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div ref={containerRef} className="h-80 w-full" />
      {radiusSummary ? (
        <p className="border-t border-slate-200 bg-[#1877F2]/5 px-3 py-2 text-[11px] font-black text-[#1877F2]">
          אזור שנכלל ברדיוס — {radiusSummary}
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
