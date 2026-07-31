import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MetaLocationTarget } from "../../../../api/metaCampaignsApi";

type Props = {
  locations: MetaLocationTarget[];
  hint?: string;
};

const ISRAEL_BOUNDS = L.latLngBounds([29.4, 34.1], [33.5, 35.95]);

const pinIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:18px;height:18px;border-radius:9999px;
    background:#1877F2;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(15,23,42,.35);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function hasCoords(item: MetaLocationTarget) {
  return (
    item.latitude != null &&
    item.longitude != null &&
    Number.isFinite(item.latitude) &&
    Number.isFinite(item.longitude)
  );
}

export default function MetaLocationsMap({ locations, hint }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const points = useMemo(
    () =>
      locations.filter(hasCoords).map((item) => ({
        id: `${item.type}:${item.key}:${item.radiusKm || 0}`,
        name: item.name,
        lat: Number(item.latitude),
        lng: Number(item.longitude),
        radiusKm:
          item.type === "country"
            ? null
            : item.radiusKm != null && Number(item.radiusKm) > 0
              ? Number(item.radiusKm)
              : null,
      })),
    [locations]
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
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
    window.setTimeout(onResize, 80);
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

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], { icon: pinIcon });
      marker.bindTooltip(point.name, { direction: "top", offset: [0, -8] });
      marker.addTo(layer);
      bounds.extend([point.lat, point.lng]);

      if (point.radiusKm != null) {
        const circle = L.circle([point.lat, point.lng], {
          radius: point.radiusKm * 1000,
          color: "#1877F2",
          weight: 2,
          fillColor: "#1877F2",
          fillOpacity: 0.16,
        });
        circle.bindTooltip(
          `${point.name} · ${point.radiusKm} ק״מ`,
          { sticky: true }
        );
        circle.addTo(layer);
        bounds.extend(circle.getBounds());
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.2), { maxZoom: 12, animate: true });
    }
    window.setTimeout(() => map.invalidateSize(), 60);
  }, [points]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
      <div ref={containerRef} className="h-64 w-full" />
      {hint ? (
        <p className="px-3 py-2 text-[11px] font-semibold text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
