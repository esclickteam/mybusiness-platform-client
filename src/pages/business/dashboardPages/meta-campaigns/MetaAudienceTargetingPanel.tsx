import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import {
  searchMetaInterestSuggestions,
  searchMetaInterests,
  searchMetaLocations,
  type MetaInterestTarget,
  type MetaLocationTarget,
} from "../../../../api/metaCampaignsApi";
import { inputBase } from "../../../../styles/bizuplyUi";
import MetaLocationsMap from "./MetaLocationsMap";
import { enrichLocationsWithCoords, geocodeLocation } from "./metaLocationGeo";

export const DEFAULT_ISRAEL_LOCATION: MetaLocationTarget = {
  key: "IL",
  name: "Israel",
  type: "country",
  countryCode: "IL",
  countryName: "Israel",
};

/**
 * Optional `section` renders only one audience block for the wizard sub-steps.
 * Omit or pass `"all"` for the full panel (default). Header shows for `"all"` and `"mode"` only.
 */
export type MetaAudienceSection =
  | "all"
  | "mode"
  | "locations"
  | "demographics"
  | "interests";

type Props = {
  businessId?: string | null;
  /** When set, only the matching block is rendered (wizard sub-step gating). */
  section?: MetaAudienceSection;
  advantageAudience: boolean;
  onAdvantageAudienceChange: (value: boolean) => void;
  locations: MetaLocationTarget[];
  onLocationsChange: (value: MetaLocationTarget[]) => void;
  locationMode: "places" | "radius";
  onLocationModeChange: (value: "places" | "radius") => void;
  interests: MetaInterestTarget[];
  onInterestsChange: (value: MetaInterestTarget[]) => void;
  ageMin: string;
  ageMax: string;
  gender: "all" | "1" | "2";
  onAgeMinChange: (value: string) => void;
  onAgeMaxChange: (value: string) => void;
  onGenderChange: (value: "all" | "1" | "2") => void;
};

function locationIdentity(item: MetaLocationTarget) {
  if (item.type === "custom") {
    return `custom:${item.addressString || item.key}`;
  }
  return `${item.type}:${item.key}`;
}

function formatAudienceSize(value?: number | null) {
  if (value == null || !Number.isFinite(value) || value <= 0) return "";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

function looksLikeInterestMatch(item: MetaInterestTarget, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return false;
  const name = String(item.name || "").toLowerCase();
  const path = (item.path || []).join(" ").toLowerCase();
  // Keep only results that actually relate to the typed query (Ads Manager feel).
  return name.includes(query) || path.includes(query) || query.includes(name);
}

export default function MetaAudienceTargetingPanel({
  businessId,
  section,
  advantageAudience,
  onAdvantageAudienceChange,
  locations,
  onLocationsChange,
  locationMode,
  onLocationModeChange,
  interests,
  onInterestsChange,
  ageMin,
  ageMax,
  gender,
  onAgeMinChange,
  onAgeMaxChange,
  onGenderChange,
}: Props) {
  const { t } = useTranslation();
  const showAll = !section || section === "all";
  const showHeader = showAll || section === "mode";
  const showMode = showAll || section === "mode";
  const showLocations = showAll || section === "locations";
  const showInterests = showAll || section === "interests";
  const showDemographics = showAll || section === "demographics";
  const [locationQuery, setLocationQuery] = useState("");
  const [interestQuery, setInterestQuery] = useState("");
  const [locationResults, setLocationResults] = useState<MetaLocationTarget[]>(
    []
  );
  const [interestResults, setInterestResults] = useState<MetaInterestTarget[]>(
    []
  );
  const [interestSuggestions, setInterestSuggestions] = useState<
    MetaInterestTarget[]
  >([]);
  const [locationBusy, setLocationBusy] = useState(false);
  const [interestBusy, setInterestBusy] = useState(false);
  const [suggestionsBusy, setSuggestionsBusy] = useState(false);
  const [radiusKm, setRadiusKm] = useState(25);
  const [activeLocationKey, setActiveLocationKey] = useState<string | null>(null);
  const [locationError, setLocationError] = useState("");
  const [interestError, setInterestError] = useState("");
  const [interestOpen, setInterestOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const locationReq = useRef(0);
  const interestReq = useRef(0);
  const interestBoxRef = useRef<HTMLDivElement | null>(null);
  const locationBoxRef = useRef<HTMLDivElement | null>(null);

  const selectedLocationKeys = useMemo(
    () => new Set(locations.map(locationIdentity)),
    [locations]
  );
  const selectedInterestIds = useMemo(
    () => new Set(interests.map((item) => item.id)),
    [interests]
  );

  // Close dropdowns on outside click — like Meta.
  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      const target = event.target as Node;
      if (interestBoxRef.current && !interestBoxRef.current.contains(target)) {
        setInterestOpen(false);
      }
      if (locationBoxRef.current && !locationBoxRef.current.contains(target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!businessId) return;
    const q = locationQuery.trim();
    if (q.length < 2) {
      setLocationResults([]);
      setLocationError("");
      setLocationOpen(false);
      return;
    }

    const reqId = ++locationReq.current;
    const timer = window.setTimeout(async () => {
      try {
        setLocationBusy(true);
        setLocationError("");
        // Radius mode = cities only (Facebook drop-pin around a city).
        const locationTypes =
          locationMode === "radius"
            ? ["city"]
            : ["country", "region", "city", "zip"];
        const data = await searchMetaLocations(businessId, {
          q,
          countryCode: "IL",
          locationTypes,
        });
        if (reqId !== locationReq.current) return;
        let results = data.results || [];
        if (!results.length) {
          const worldwide = await searchMetaLocations(businessId, {
            q,
            locationTypes,
          });
          if (reqId !== locationReq.current) return;
          results = worldwide.results || [];
        }
        // In radius mode keep only real cities from Meta.
        if (locationMode === "radius") {
          results = results.filter((item) =>
            /city|subcity|neighborhood/i.test(item.type || "city")
          );
        }
        setLocationResults(results);
        setLocationOpen(true);
      } catch (error: any) {
        if (reqId !== locationReq.current) return;
        setLocationResults([]);
        setLocationOpen(false);
        setLocationError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.form.locationSearchError")
        );
      } finally {
        if (reqId === locationReq.current) setLocationBusy(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [businessId, locationMode, locationQuery, t]);

  useEffect(() => {
    if (!businessId) return;
    const q = interestQuery.trim();
    // Meta style: closed until the user types a real query.
    if (q.length < 2) {
      setInterestResults([]);
      setInterestError("");
      setInterestOpen(false);
      return;
    }

    const reqId = ++interestReq.current;
    const timer = window.setTimeout(async () => {
      try {
        setInterestBusy(true);
        setInterestError("");
        // ONLY Meta adinterest autocomplete for the typed query.
        const he = await searchMetaInterests(businessId, {
          q,
          locale: "he_IL",
          limit: 25,
        });
        let rows = he.results || [];
        if (!rows.length) {
          const en = await searchMetaInterests(businessId, {
            q,
            locale: "en_US",
            limit: 25,
          });
          rows = en.results || [];
        }
        // Guard against unrelated API noise.
        const filtered = rows.filter((item) => looksLikeInterestMatch(item, q));
        const finalRows = filtered.length ? filtered : rows;
        if (reqId !== interestReq.current) return;
        setInterestResults(finalRows);
        setInterestOpen(finalRows.length > 0);
      } catch (error: any) {
        if (reqId !== interestReq.current) return;
        setInterestResults([]);
        setInterestOpen(false);
        setInterestError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.form.interestSearchError")
        );
      } finally {
        if (reqId === interestReq.current) setInterestBusy(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [businessId, interestQuery, t]);

  // Suggestions ONLY after an interest was selected (Meta "Suggestions" row).
  useEffect(() => {
    if (!businessId || !interests.length) {
      setInterestSuggestions([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setSuggestionsBusy(true);
        const names = interests.map((item) => item.name).filter(Boolean);
        const data = await searchMetaInterestSuggestions(businessId, {
          names,
          locale: "he_IL",
        });
        if (cancelled) return;
        setInterestSuggestions(
          (data.results || []).filter((item) => !selectedInterestIds.has(item.id))
        );
      } catch {
        if (!cancelled) setInterestSuggestions([]);
      } finally {
        if (!cancelled) setSuggestionsBusy(false);
      }
    };

    const timer = window.setTimeout(load, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [businessId, interests, selectedInterestIds]);

  // Geocode selected Meta places for map pins / radius circles.
  useEffect(() => {
    let cancelled = false;
    const missing = locations.some(
      (item) =>
        item.latitude == null ||
        item.longitude == null ||
        !Number.isFinite(Number(item.latitude)) ||
        !Number.isFinite(Number(item.longitude))
    );
    if (!missing) return;

    (async () => {
      const enriched = await enrichLocationsWithCoords(locations);
      if (cancelled) return;
      const changed = enriched.some((item, index) => {
        const prev = locations[index];
        return (
          prev &&
          (prev.latitude !== item.latitude || prev.longitude !== item.longitude)
        );
      });
      if (changed) onLocationsChange(enriched);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations.map((item) => `${item.key}:${item.name}`).join("|")]);

  // Keep focus on a radius city when list changes.
  useEffect(() => {
    if (locationMode !== "radius") return;
    const radiusLocs = locations.filter(
      (loc) => loc.radiusKm != null && Number(loc.radiusKm) > 0
    );
    if (!radiusLocs.length) {
      setActiveLocationKey(null);
      return;
    }
    if (
      !activeLocationKey ||
      !radiusLocs.some((loc) => locationIdentity(loc) === activeLocationKey)
    ) {
      setActiveLocationKey(locationIdentity(radiusLocs[radiusLocs.length - 1]));
    }
  }, [locations, locationMode, activeLocationKey]);

  const setRadiusForActiveCity = (nextRadius: number) => {
    const value = Math.min(80, Math.max(1, nextRadius || 25));
    setRadiusKm(value);
    if (locationMode !== "radius") return;
    const targetKey =
      activeLocationKey ||
      (locations.length ? locationIdentity(locations[locations.length - 1]) : null);
    if (!targetKey) return;
    onLocationsChange(
      locations.map((loc) =>
        locationIdentity(loc) === targetKey ? { ...loc, radiusKm: value } : loc
      )
    );
  };

  const addLocation = async (item: MetaLocationTarget) => {
    const addressString = [
      item.name,
      item.region,
      item.countryName || item.countryCode || "Israel",
    ]
      .filter(Boolean)
      .join(", ");

    const point = await geocodeLocation({
      ...item,
      addressString,
      countryCode: item.countryCode || "IL",
    });

    if (locationMode === "radius") {
      // Facebook style: one city + real radius around it.
      const next: MetaLocationTarget = {
        ...item,
        type: /city|subcity|neighborhood/i.test(item.type || "")
          ? item.type
          : "city",
        key: item.key,
        metaCityKey: item.key,
        radiusKm,
        addressString,
        latitude: point?.latitude ?? null,
        longitude: point?.longitude ?? null,
        countryCode: item.countryCode || "IL",
      };
      // Replace previous radius cities with the newly chosen city (clear Meta-like pin).
      onLocationsChange([next]);
      setActiveLocationKey(locationIdentity(next));
      setLocationQuery("");
      setLocationResults([]);
      setLocationOpen(false);
      return;
    }

    const next: MetaLocationTarget = {
      ...item,
      radiusKm: undefined,
      addressString: undefined,
      metaCityKey: undefined,
      latitude: point?.latitude ?? item.latitude ?? null,
      longitude: point?.longitude ?? item.longitude ?? null,
    };

    const identity = locationIdentity(next);
    const withoutDupes = locations.filter(
      (loc) => locationIdentity(loc) !== identity
    );
    const filtered =
      next.type !== "country"
        ? withoutDupes.filter(
            (loc) => !(loc.type === "country" && loc.key === "IL")
          )
        : withoutDupes;

    onLocationsChange([...filtered, next]);
    setActiveLocationKey(identity);
    setLocationQuery("");
    setLocationResults([]);
    setLocationOpen(false);
  };

  const removeLocation = (item: MetaLocationTarget) => {
    const next = locations.filter(
      (loc) => locationIdentity(loc) !== locationIdentity(item)
    );
    onLocationsChange(
      next.length ? next : locationMode === "radius" ? [] : [DEFAULT_ISRAEL_LOCATION]
    );
    if (activeLocationKey === locationIdentity(item)) {
      setActiveLocationKey(next.length ? locationIdentity(next[next.length - 1]) : null);
    }
  };

  const updateLocationRadius = (item: MetaLocationTarget, nextRadius: number) => {
    const value = Math.min(80, Math.max(1, nextRadius || 25));
    setRadiusKm(value);
    setActiveLocationKey(locationIdentity(item));
    onLocationsChange(
      locations.map((loc) =>
        locationIdentity(loc) === locationIdentity(item)
          ? { ...loc, radiusKm: value }
          : loc
      )
    );
  };

  const switchLocationMode = (mode: "places" | "radius") => {
    onLocationModeChange(mode);
    if (mode === "radius") {
      // Start clean like Facebook pin drop — wait for a city.
      onLocationsChange([]);
      setActiveLocationKey(null);
    } else if (!locations.length) {
      onLocationsChange([{ ...DEFAULT_ISRAEL_LOCATION }]);
    } else {
      // Strip radius when leaving radius mode.
      onLocationsChange(
        locations.map((loc) => ({
          ...loc,
          radiusKm: undefined,
          metaCityKey: undefined,
        }))
      );
    }
  };

  const addInterest = (item: MetaInterestTarget) => {
    if (!item?.id || selectedInterestIds.has(item.id)) return;
    onInterestsChange([...interests, item]);
    setInterestQuery("");
    setInterestResults([]);
    setInterestOpen(false);
  };

  const removeInterest = (id: string) => {
    onInterestsChange(interests.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {showHeader ? (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900">
              {t("metaCampaigns.form.audienceTitle")}
            </p>
            <p className="text-sm font-semibold text-slate-500">
              {t("metaCampaigns.form.audienceHintMeta")}
            </p>
          </div>
        </div>
      ) : null}

      {showMode ? (
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAdvantageAudienceChange(true)}
          className={[
            "rounded-2xl border px-4 py-4 text-start transition",
            advantageAudience
              ? "border-[#1877F2] bg-[#1877F2]/5 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300",
          ].join(" ")}
        >
          <span className="mb-1 flex items-center gap-2 text-sm font-black text-slate-900">
            <Sparkles className="h-4 w-4 text-[#1877F2]" />
            {t("metaCampaigns.form.advantageAudienceTitle")}
          </span>
          <span className="block text-xs font-semibold text-slate-500">
            {t("metaCampaigns.form.advantageAudienceHint")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onAdvantageAudienceChange(false)}
          className={[
            "rounded-2xl border px-4 py-4 text-start transition",
            !advantageAudience
              ? "border-[#1877F2] bg-[#1877F2]/5 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300",
          ].join(" ")}
        >
          <span className="mb-1 block text-sm font-black text-slate-900">
            {t("metaCampaigns.form.regularAudienceTitle")}
          </span>
          <span className="block text-xs font-semibold text-slate-500">
            {t("metaCampaigns.form.regularAudienceHint")}
          </span>
        </button>
      </div>
      ) : null}

      {showLocations ? (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black text-slate-900">
              {t("metaCampaigns.form.locationsTitle")}
            </p>
            <p className="text-xs font-semibold text-slate-500">
              {t("metaCampaigns.form.locationsHint")}
            </p>
          </div>
          <MapPin className="h-4 w-4 text-[#1877F2]" />
        </div>

        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => switchLocationMode("places")}
            className={[
              "rounded-xl border px-3 py-2.5 text-start text-xs font-black",
              locationMode === "places"
                ? "border-[#1877F2] bg-[#1877F2]/5 text-[#1877F2]"
                : "border-slate-200 bg-slate-50 text-slate-700",
            ].join(" ")}
          >
            {t("metaCampaigns.form.locationModePlaces")}
          </button>
          <button
            type="button"
            onClick={() => switchLocationMode("radius")}
            className={[
              "rounded-xl border px-3 py-2.5 text-start text-xs font-black",
              locationMode === "radius"
                ? "border-[#1877F2] bg-[#1877F2]/5 text-[#1877F2]"
                : "border-slate-200 bg-slate-50 text-slate-700",
            ].join(" ")}
          >
            <span className="inline-flex items-center gap-1">
              <Navigation className="h-3.5 w-3.5" />
              {t("metaCampaigns.form.locationModeRadius")}
            </span>
          </button>
        </div>

        {locationMode === "radius" ? (
          <div className="mb-3 rounded-xl border border-[#1877F2]/20 bg-[#1877F2]/5 p-3">
            <p className="mb-2 text-xs font-black text-[#1877F2]">
              כמו בפייסבוק: בחרו עיר ← הוסיפו ← הגדירו רדיוס רק סביב העיר הזו
            </p>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black text-slate-600">
                {t("metaCampaigns.form.radiusKm", { km: radiusKm })}
              </span>
              <input
                type="range"
                min={1}
                max={80}
                value={radiusKm}
                onChange={(e) =>
                  setRadiusForActiveCity(Number(e.target.value) || 25)
                }
                className="w-full accent-[#1877F2]"
              />
              <span className="mt-1 block text-[11px] font-semibold text-slate-500">
                {locations[0]?.name
                  ? `רדיוס אמיתי סביב ${locations[0].name}: ${radiusKm} ק״מ`
                  : "קודם חפשו והוסיפו עיר — ואז הרדיוס יופיע סביבה במפה"}
              </span>
            </label>
          </div>
        ) : null}

        <div className="relative mb-3" ref={locationBoxRef}>
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={`${inputBase} ps-10`}
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setLocationOpen(e.target.value.trim().length >= 2);
            }}
            onFocus={() => {
              if (locationResults.length) setLocationOpen(true);
            }}
            placeholder={t("metaCampaigns.form.locationSearchPlaceholder")}
            autoComplete="off"
          />
          {locationBusy ? (
            <Loader2 className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          ) : null}

          {locationOpen && locationResults.length ? (
            <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
              {locationResults.map((item) => {
                const selected = selectedLocationKeys.has(locationIdentity(item));
                return (
                  <button
                    key={locationIdentity(item)}
                    type="button"
                    disabled={selected}
                    onClick={() => addLocation(item)}
                    className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-3 py-2.5 text-start last:border-b-0 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <span>
                      <span className="block text-sm font-black text-slate-900">
                        {item.name}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        {[
                          item.type,
                          item.region,
                          item.countryName || item.countryCode,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <span className="text-[11px] font-black text-[#1877F2]">
                      {selected
                        ? t("metaCampaigns.form.selected")
                        : t("metaCampaigns.form.add")}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {locationError ? (
          <p className="mb-2 text-xs font-semibold text-rose-600">{locationError}</p>
        ) : null}

        <div className="mb-3 flex flex-wrap gap-2">
          {locations.length ? (
            locations.map((item) => {
              const id = locationIdentity(item);
              const active = activeLocationKey === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveLocationKey(id);
                    if (item.radiusKm != null) setRadiusKm(Number(item.radiusKm));
                  }}
                  className={[
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black",
                    active
                      ? "border-[#1877F2] bg-[#1877F2] text-white"
                      : "border-[#1877F2]/20 bg-[#1877F2]/5 text-slate-800",
                  ].join(" ")}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {item.name}
                    {item.radiusKm != null
                      ? ` · ${item.radiusKm}${t("metaCampaigns.form.kmShort")}`
                      : ""}
                  </span>
                  {locationMode === "radius" ? (
                    <input
                      type="number"
                      min={1}
                      max={80}
                      value={item.radiusKm ?? radiusKm}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateLocationRadius(item, Number(e.target.value) || 25)
                      }
                      className="w-14 rounded-md border border-white/40 bg-white px-1 py-0.5 text-[11px] text-slate-800"
                      title={t("metaCampaigns.form.radiusEdit")}
                    />
                  ) : null}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLocation(item);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        removeLocation(item);
                      }
                    }}
                    className="rounded-full p-0.5 hover:bg-white/30"
                    aria-label={t("metaCampaigns.form.remove")}
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })
          ) : locationMode === "radius" ? (
            <p className="text-xs font-semibold text-slate-400">
              חפשו עיר (לדוגמה: באר שבע / חיפה) והוסיפו — ואז הגדירו רדיוס סביבה
            </p>
          ) : null}
        </div>

        <MetaLocationsMap
          locations={locations}
          focusKey={activeLocationKey}
          onSelectLocation={setActiveLocationKey}
          hint={
            locationMode === "radius"
              ? "כמו בפייסבוק: העיגול הוא רדיוס אמיתי בק״מ רק סביב העיר שנבחרה. זום המפה מציג מה נכלל בתוך הרדיוס."
              : t("metaCampaigns.form.locationsMapHint")
          }
        />
      </div>
      ) : null}

      {showInterests ? (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-1">
          <p className="text-sm font-black text-slate-900">
            {t("metaCampaigns.form.interestsTitle")}
          </p>
          <p className="text-xs font-semibold text-slate-500">
            {advantageAudience
              ? t("metaCampaigns.form.interestsHintAdvantage")
              : t("metaCampaigns.form.interestsHint")}
          </p>
        </div>

        <div className="relative mb-3 mt-3" ref={interestBoxRef}>
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={`${inputBase} ps-10`}
            value={interestQuery}
            onChange={(e) => {
              setInterestQuery(e.target.value);
              if (e.target.value.trim().length < 2) {
                setInterestOpen(false);
                setInterestResults([]);
              }
            }}
            onFocus={() => {
              if (interestResults.length && interestQuery.trim().length >= 2) {
                setInterestOpen(true);
              }
            }}
            placeholder={t("metaCampaigns.form.interestSearchPlaceholder")}
            autoComplete="off"
          />
          {interestBusy ? (
            <Loader2 className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          ) : null}

          {interestOpen && interestResults.length ? (
            <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl">
              {interestResults.map((item) => {
                const selected = selectedInterestIds.has(item.id);
                const size = formatAudienceSize(item.audienceSize);
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={selected}
                    onClick={() => addInterest(item)}
                    className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-3 py-2.5 text-start last:border-b-0 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <span>
                      <span className="block text-sm font-black text-slate-900">
                        {item.name}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        {[
                          item.path?.slice(-2).join(" › "),
                          size
                            ? t("metaCampaigns.form.audienceSize", { size })
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <span className="text-[11px] font-black text-[#1877F2]">
                      {selected
                        ? t("metaCampaigns.form.selected")
                        : t("metaCampaigns.form.add")}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {interestError ? (
          <p className="mb-2 text-xs font-semibold text-rose-600">{interestError}</p>
        ) : null}

        {!interestBusy &&
        interestQuery.trim().length >= 2 &&
        !interestResults.length &&
        !interestError ? (
          <p className="mb-2 text-xs font-semibold text-slate-400">
            לא נמצאו תחומי עניין במטא ל־“{interestQuery.trim()}”
          </p>
        ) : null}

        <div className="mb-3 flex flex-wrap gap-2">
          {interests.length ? (
            interests.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-slate-800"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => removeInterest(item.id)}
                  className="rounded-full p-0.5 hover:bg-white"
                  aria-label={t("metaCampaigns.form.remove")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs font-semibold text-slate-400">
              {t("metaCampaigns.form.interestsEmpty")}
            </p>
          )}
        </div>

        {interests.length > 0 &&
        (suggestionsBusy || interestSuggestions.length > 0) ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-black text-slate-700">
              {t("metaCampaigns.form.interestSuggestionsTitle")}
              {suggestionsBusy ? (
                <Loader2 className="ms-2 inline h-3.5 w-3.5 animate-spin" />
              ) : null}
            </p>
            <div className="flex flex-wrap gap-2">
              {interestSuggestions.slice(0, 12).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addInterest(item)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black text-slate-700 hover:border-[#1877F2] hover:text-[#1877F2]"
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      ) : null}

      {showDemographics && !advantageAudience ? (
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-black text-slate-500">
              {t("metaCampaigns.form.ageMin")}
            </span>
            <input
              type="number"
              min="13"
              max="65"
              className={inputBase}
              value={ageMin}
              onChange={(e) => onAgeMinChange(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-black text-slate-500">
              {t("metaCampaigns.form.ageMax")}
            </span>
            <input
              type="number"
              min="13"
              max="65"
              className={inputBase}
              value={ageMax}
              onChange={(e) => onAgeMaxChange(e.target.value)}
            />
          </label>
          <label className="col-span-2 block">
            <span className="mb-1.5 block text-xs font-black text-slate-500">
              {t("metaCampaigns.form.gender")}
            </span>
            <select
              className={inputBase}
              value={gender}
              onChange={(e) =>
                onGenderChange(e.target.value as "all" | "1" | "2")
              }
            >
              <option value="all">{t("metaCampaigns.form.genderAll")}</option>
              <option value="1">{t("metaCampaigns.form.genderMale")}</option>
              <option value="2">{t("metaCampaigns.form.genderFemale")}</option>
            </select>
          </label>
        </div>
      ) : null}
    </div>
  );
}
