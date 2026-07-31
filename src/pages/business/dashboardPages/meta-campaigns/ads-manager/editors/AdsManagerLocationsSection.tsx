import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  Search,
} from "lucide-react";
import {
  searchMetaLocations,
  type MetaLocationTarget,
} from "../../../../../../api/metaCampaignsApi";
import MetaLocationsMap from "../../MetaLocationsMap";
import { geocodeLocation } from "../../metaLocationGeo";
import type { AdsManagerLocation } from "../adsManagerTypes";

type Props = {
  locations: AdsManagerLocation[];
  expanded: boolean;
  businessId: string | null;
  onExpandedChange: (expanded: boolean) => void;
  onLocationsChange: (locations: AdsManagerLocation[]) => void;
};

const DEFAULT_RADIUS_MILES = 25;
const MIN_RADIUS_MILES = 10;
const MAX_RADIUS_MILES = 50;
const MI_TO_KM = 1.60934;

function locationIdentity(loc: AdsManagerLocation | MetaLocationTarget) {
  if (loc.type === "custom") {
    return `custom:${(loc as MetaLocationTarget).addressString || loc.key}`;
  }
  return `${loc.type}:${loc.key}`;
}

function isCityType(type?: string) {
  return /city|subcity|neighborhood/i.test(type || "");
}

function milesToKm(miles: number) {
  return Math.round(miles * MI_TO_KM * 10) / 10;
}

function locationLabel(loc: AdsManagerLocation) {
  const base = [loc.name, loc.region].filter(Boolean).join(", ");
  if (!isCityType(loc.type)) return base || loc.name;
  if (loc.cityOnly || loc.radiusMiles == null) return base;
  return `${base} + ${loc.radiusMiles}mi`;
}

function toMapLocation(loc: AdsManagerLocation): MetaLocationTarget {
  const cityOnly = Boolean(loc.cityOnly) || loc.radiusMiles == null;
  const radiusKm =
    isCityType(loc.type) && !cityOnly && loc.radiusMiles != null
      ? milesToKm(loc.radiusMiles)
      : loc.radiusKm ?? null;
  return {
    key: loc.key,
    name: loc.name,
    type: loc.type,
    countryCode: loc.countryCode,
    countryName: loc.countryName,
    region: loc.region,
    metaCityKey: loc.metaCityKey || loc.key,
    radiusKm: isCityType(loc.type) && !cityOnly ? radiusKm : null,
    latitude: loc.latitude,
    longitude: loc.longitude,
    distanceUnit: "mile",
  };
}

export default function AdsManagerLocationsSection({
  locations,
  expanded,
  businessId,
  onExpandedChange,
  onLocationsChange,
}: Props) {
  const [includeMode, setIncludeMode] = useState<"include" | "exclude">(
    "include"
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MetaLocationTarget[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [radiusMenuKey, setRadiusMenuKey] = useState<string | null>(null);
  const [reachMore, setReachMore] = useState(true);
  const [includeOpen, setIncludeOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const reqId = useRef(0);

  const selectedKeys = useMemo(
    () => new Set(locations.map(locationIdentity)),
    [locations]
  );

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!boxRef.current?.contains(target)) {
        setOpen(false);
        setRadiusMenuKey(null);
      }
      if (!searchBarRef.current?.contains(target)) {
        setIncludeOpen(false);
        setBrowseOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      setError("");
      return;
    }
    if (!businessId) {
      setResults([]);
      setOpen(false);
      setError("Connect Meta Ads to search locations.");
      return;
    }

    const id = ++reqId.current;
    const timer = window.setTimeout(async () => {
      try {
        setBusy(true);
        setError("");
        const locationTypes = ["country", "region", "city", "zip"];
        let data = await searchMetaLocations(businessId, {
          q,
          countryCode: "IL",
          locationTypes,
          limit: 16,
        });
        let rows = data.results || [];
        if (!rows.length) {
          data = await searchMetaLocations(businessId, {
            q,
            locationTypes,
            limit: 16,
          });
          rows = data.results || [];
        }
        if (id !== reqId.current) return;
        setResults(rows);
        setOpen(true);
        if (!rows.length) {
          setError("No locations found. Try another city name.");
        }
      } catch (err: unknown) {
        if (id !== reqId.current) return;
        const e = err as { response?: { data?: { error?: string } } };
        setResults([]);
        setOpen(false);
        setError(
          e?.response?.data?.error ||
            "Location search failed. Check Meta connection."
        );
      } finally {
        if (id === reqId.current) setBusy(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [query, businessId]);

  const commitLocations = (next: AdsManagerLocation[], focus?: string) => {
    onLocationsChange(next);
    if (focus) setFocusKey(focus);
  };

  const addLocation = async (item: MetaLocationTarget) => {
    const identity = locationIdentity(item);
    if (selectedKeys.has(identity)) return;

    const addressString = [
      item.name,
      item.region,
      item.countryName || item.countryCode || "Israel",
    ]
      .filter(Boolean)
      .join(", ");

    const point = await geocodeLocation(
      {
        ...item,
        addressString,
        countryCode: item.countryCode || "IL",
      },
      businessId
    );

    const isCity = isCityType(item.type);
    const next: AdsManagerLocation = {
      key: item.key,
      name: item.name,
      type: isCity ? item.type || "city" : item.type,
      countryCode: item.countryCode || "IL",
      countryName: item.countryName,
      region: item.region,
      metaCityKey: isCity ? item.key : undefined,
      // Meta default for cities: radius around city
      cityOnly: isCity ? false : undefined,
      radiusMiles: isCity ? DEFAULT_RADIUS_MILES : null,
      radiusKm: isCity ? milesToKm(DEFAULT_RADIUS_MILES) : null,
      distanceUnit: isCity ? "mile" : undefined,
      latitude: point?.latitude ?? item.latitude ?? null,
      longitude: point?.longitude ?? item.longitude ?? null,
      include: includeMode === "include",
    };

    let filtered = locations.filter(
      (loc) => locationIdentity(loc) !== identity
    );
    // Drop whole-country Israel when a more specific place is added (Meta-like).
    if (next.type !== "country") {
      filtered = filtered.filter(
        (loc) => !(loc.type === "country" && String(loc.key).toUpperCase() === "IL")
      );
    }

    commitLocations([...filtered, next], identity);
    setQuery("");
    setResults([]);
    setOpen(false);
    setError("");
    if (isCity) setRadiusMenuKey(identity);
  };

  const removeLocation = (identity: string) => {
    const next = locations.filter((loc) => locationIdentity(loc) !== identity);
    commitLocations(next);
    if (focusKey === identity) setFocusKey(null);
    if (radiusMenuKey === identity) setRadiusMenuKey(null);
  };

  const patchLocation = (
    identity: string,
    patch: Partial<AdsManagerLocation>
  ) => {
    commitLocations(
      locations.map((loc) =>
        locationIdentity(loc) === identity ? { ...loc, ...patch } : loc
      ),
      identity
    );
  };

  const setCityOnly = (identity: string) => {
    patchLocation(identity, {
      cityOnly: true,
      radiusMiles: null,
      radiusKm: null,
    });
    setRadiusMenuKey(null);
  };

  const setCityRadius = (identity: string, miles: number) => {
    const value = Math.min(
      MAX_RADIUS_MILES,
      Math.max(MIN_RADIUS_MILES, miles || DEFAULT_RADIUS_MILES)
    );
    patchLocation(identity, {
      cityOnly: false,
      radiusMiles: value,
      radiusKm: milesToKm(value),
      distanceUnit: "mile",
    });
  };

  const mapLocations = locations.map(toMapLocation);

  return (
    <div className="rounded-lg border border-[#CED0D4]" ref={boxRef}>
      <button
        type="button"
        className="flex w-full items-center justify-between bg-[#E7F3FF] px-3 py-2.5 text-left"
        onClick={() => onExpandedChange(!expanded)}
      >
        <span className="flex items-center gap-1.5 text-[15px] font-bold text-[#050505]">
          Locations
          <Info className="h-3.5 w-3.5 text-[#65676B]" />
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-[#65676B]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#65676B]" />
        )}
      </button>

      {expanded ? (
        <div className="space-y-3 bg-white px-3 py-3">
          {/* Selected location chips + Meta radius menus */}
          {locations.length ? (
            <div className="space-y-2">
              {locations.map((loc) => {
                const id = locationIdentity(loc);
                const isCity = isCityType(loc.type);
                const menuOpen = radiusMenuKey === id;
                return (
                  <div key={id} className="relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-[#CED0D4] bg-[#F7F8FA] px-2 py-1 text-[12px] font-semibold text-[#050505]">
                        <MapPin className="h-3.5 w-3.5 text-[#31A24C]" />
                        {loc.include === false ? (
                          <span className="text-[#65676B]">Exclude ·</span>
                        ) : null}
                        {isCity ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 font-semibold hover:text-[#1877F2]"
                            onClick={() => {
                              setRadiusMenuKey(menuOpen ? null : id);
                              setFocusKey(id);
                            }}
                          >
                            {locationLabel(loc)}
                            <ChevronDown className="h-3.5 w-3.5 text-[#65676B]" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="font-semibold hover:text-[#1877F2]"
                            onClick={() => setFocusKey(id)}
                          >
                            {loc.name}
                          </button>
                        )}
                        <button
                          type="button"
                          className="ml-1 text-[#65676B] hover:text-[#FA383E]"
                          onClick={() => removeLocation(id)}
                          aria-label="Remove location"
                        >
                          ×
                        </button>
                      </span>
                    </div>

                    {isCity && menuOpen ? (
                      <div className="absolute z-[1220] mt-1 w-[280px] rounded-lg border border-[#CED0D4] bg-white p-2 shadow-lg">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] font-semibold text-[#050505] hover:bg-[#F0F2F5]"
                          onClick={() => setCityOnly(id)}
                        >
                          <span className="w-4 shrink-0">
                            {loc.cityOnly || loc.radiusMiles == null ? (
                              <Check className="h-3.5 w-3.5 text-[#1877F2]" />
                            ) : null}
                          </span>
                          Current city only
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] font-semibold text-[#050505] hover:bg-[#F0F2F5]"
                          onClick={() =>
                            setCityRadius(
                              id,
                              loc.radiusMiles ?? DEFAULT_RADIUS_MILES
                            )
                          }
                        >
                          <span className="w-4 shrink-0">
                            {!loc.cityOnly && loc.radiusMiles != null ? (
                              <Check className="h-3.5 w-3.5 text-[#1877F2]" />
                            ) : null}
                          </span>
                          Cities within radius
                          <Info className="h-3.5 w-3.5 text-[#8A8D91]" />
                        </button>
                        {!loc.cityOnly && loc.radiusMiles != null ? (
                          <div className="mt-1 flex items-center gap-2 px-2 pb-2 pt-1">
                            <span className="text-[11px] font-semibold text-[#65676B]">
                              {MIN_RADIUS_MILES}
                            </span>
                            <input
                              type="range"
                              min={MIN_RADIUS_MILES}
                              max={MAX_RADIUS_MILES}
                              value={loc.radiusMiles}
                              onChange={(e) =>
                                setCityRadius(id, Number(e.target.value))
                              }
                              className="min-w-0 flex-1 accent-[#1877F2]"
                            />
                            <span className="text-[11px] font-semibold text-[#65676B]">
                              {MAX_RADIUS_MILES}
                            </span>
                            <input
                              type="number"
                              min={MIN_RADIUS_MILES}
                              max={MAX_RADIUS_MILES}
                              value={loc.radiusMiles}
                              onChange={(e) =>
                                setCityRadius(id, Number(e.target.value))
                              }
                              className="w-12 rounded border border-[#CED0D4] px-1 py-0.5 text-center text-[12px] font-semibold"
                            />
                            <span className="text-[12px] font-semibold text-[#65676B]">
                              mi
                            </span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[13px] text-[#65676B]">
              No locations selected yet. Search for a city to add it.
            </p>
          )}

          {/* Search overlays the map (Meta): high z-index above Leaflet panes */}
          <div className="relative">
            <div
              className="relative z-[1200] w-full"
              ref={searchBarRef}
              dir="ltr"
            >
              <div className="flex h-10 w-full items-stretch overflow-hidden rounded-md border border-[#CED0D4] bg-white focus-within:border-[#1877F2] focus-within:shadow-[0_0_0_2px_rgba(24,119,242,0.2)]">
                <div className="relative shrink-0 border-r border-[#CED0D4]">
                  <button
                    type="button"
                    className="flex h-full items-center gap-1 px-3 text-[13px] font-semibold text-[#050505] hover:bg-[#F0F2F5]"
                    onClick={() => {
                      setIncludeOpen((v) => !v);
                      setBrowseOpen(false);
                    }}
                  >
                    {includeMode === "include" ? "Include" : "Exclude"}
                    <ChevronDown className="h-3.5 w-3.5 text-[#65676B]" />
                  </button>
                  {includeOpen ? (
                    <div className="absolute left-0 top-full z-[1210] mt-1 min-w-[120px] overflow-hidden rounded-md border border-[#CED0D4] bg-white shadow-lg">
                      {(
                        [
                          ["include", "Include"],
                          ["exclude", "Exclude"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold hover:bg-[#F0F2F5]"
                          onClick={() => {
                            setIncludeMode(value);
                            setIncludeOpen(false);
                          }}
                        >
                          <span className="w-4">
                            {includeMode === value ? (
                              <Check className="h-3.5 w-3.5 text-[#1877F2]" />
                            ) : null}
                          </span>
                          {label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <label className="relative flex min-w-0 flex-1 items-center">
                  <Search className="pointer-events-none absolute left-3 h-4 w-4 shrink-0 text-[#8A8D91]" />
                  <input
                    className="h-full w-full border-0 bg-transparent py-0 pl-9 pr-3 text-[14px] text-[#050505] outline-none placeholder:text-[#8A8D91]"
                    placeholder="Search locations"
                    value={query}
                    autoComplete="off"
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (e.target.value.trim().length >= 2) setOpen(true);
                    }}
                    onFocus={() => {
                      setIncludeOpen(false);
                      setBrowseOpen(false);
                      if (results.length || query.trim().length >= 2) {
                        setOpen(true);
                      }
                    }}
                  />
                  {busy ? (
                    <span className="absolute right-3 text-[11px] font-semibold text-[#65676B]">
                      …
                    </span>
                  ) : null}
                </label>

                <div className="relative shrink-0 border-l border-[#CED0D4]">
                  <button
                    type="button"
                    className="flex h-full items-center gap-1 px-3 text-[13px] font-semibold text-[#050505] hover:bg-[#F0F2F5]"
                    onClick={() => {
                      setBrowseOpen((v) => !v);
                      setIncludeOpen(false);
                      setOpen(false);
                    }}
                  >
                    Browse
                    <ChevronDown className="h-3.5 w-3.5 text-[#65676B]" />
                  </button>
                  {browseOpen ? (
                    <div className="absolute right-0 top-full z-[1210] mt-1 min-w-[180px] overflow-hidden rounded-md border border-[#CED0D4] bg-white shadow-lg">
                      {[
                        { label: "Countries", q: "Israel" },
                        { label: "Regions", q: "Haifa" },
                        { label: "Cities", q: "Tel Aviv" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className="block w-full px-3 py-2.5 text-left text-[13px] font-semibold text-[#050505] hover:bg-[#F0F2F5]"
                          onClick={() => {
                            setQuery(item.q);
                            setBrowseOpen(false);
                            setOpen(true);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {open && (results.length > 0 || busy) ? (
                <div className="absolute left-0 right-0 top-full z-[1220] mt-1 max-h-60 overflow-y-auto rounded-lg border border-[#CED0D4] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                  {busy && !results.length ? (
                    <p className="px-3 py-3 text-[13px] text-[#65676B]">
                      Searching…
                    </p>
                  ) : (
                    results.map((item) => {
                      const id = locationIdentity(item);
                      const selected = selectedKeys.has(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={selected}
                          className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-[#E7F3FF] disabled:opacity-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => addLocation(item)}
                        >
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1877F2]" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-[#050505]">
                              {item.name}
                            </span>
                            <span className="block truncate text-[11px] text-[#65676B]">
                              {[
                                item.type,
                                item.region,
                                item.countryName || item.countryCode,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </span>
                          <span className="shrink-0 text-[11px] font-bold text-[#1877F2]">
                            {selected ? "Added" : "Add"}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="relative z-0 mt-2 text-[12px] font-semibold text-[#FA383E]">
                {error}
              </p>
            ) : (
              <p className="relative z-0 mt-2 text-[12px] leading-snug text-[#65676B]">
                You can type countries, regions, cities or postal codes. For
                cities, choose current city only or a radius — just like Meta.
              </p>
            )}

            <div className="relative z-0 mt-3">
              <MetaLocationsMap
                locations={mapLocations}
                focusKey={focusKey}
                onSelectLocation={setFocusKey}
                hint="Pins and radius circles match your selected cities from Meta location search."
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-[13px] text-[#050505]">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[#1877F2]"
              checked={reachMore}
              onChange={(e) => setReachMore(e.target.checked)}
            />
            <span>
              <span className="font-semibold">
                Reach more people likely to respond
              </span>
              <span className="mt-0.5 block text-[12px] text-[#65676B]">
                We&apos;ll also reach people interested in your selected cities
                and regions, in those countries.
              </span>
            </span>
          </label>
        </div>
      ) : null}
    </div>
  );
}
