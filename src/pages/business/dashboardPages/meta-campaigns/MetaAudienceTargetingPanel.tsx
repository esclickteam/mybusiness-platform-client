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
  browseMetaInterestCategories,
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

type Props = {
  businessId?: string | null;
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

function mergeInterestLists(...lists: MetaInterestTarget[][]) {
  const map = new Map<string, MetaInterestTarget>();
  lists.flat().forEach((item) => {
    if (!item?.id || map.has(item.id)) return;
    map.set(item.id, item);
  });
  return Array.from(map.values());
}

export default function MetaAudienceTargetingPanel({
  businessId,
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
  const [locationError, setLocationError] = useState("");
  const [interestError, setInterestError] = useState("");
  const locationReq = useRef(0);
  const interestReq = useRef(0);

  const selectedLocationKeys = useMemo(
    () => new Set(locations.map(locationIdentity)),
    [locations]
  );
  const selectedInterestIds = useMemo(
    () => new Set(interests.map((item) => item.id)),
    [interests]
  );

  useEffect(() => {
    if (!businessId) return;
    const q = locationQuery.trim();
    if (q.length < 2) {
      setLocationResults([]);
      setLocationError("");
      return;
    }

    const reqId = ++locationReq.current;
    const timer = window.setTimeout(async () => {
      try {
        setLocationBusy(true);
        setLocationError("");
        const data = await searchMetaLocations(businessId, {
          q,
          // Prefer Israel results first (like Meta default market here),
          // but still allow worldwide if Meta returns them without filter.
          countryCode: q.length <= 3 ? undefined : "IL",
          locationTypes:
            locationMode === "radius"
              ? ["city", "region", "zip"]
              : ["country", "region", "city", "zip"],
        });
        if (reqId !== locationReq.current) return;
        let results = data.results || [];
        // If Israel-filtered search is empty, retry worldwide from Meta.
        if (!results.length) {
          const worldwide = await searchMetaLocations(businessId, {
            q,
            locationTypes:
              locationMode === "radius"
                ? ["city", "region", "zip"]
                : ["country", "region", "city", "zip"],
          });
          if (reqId !== locationReq.current) return;
          results = worldwide.results || [];
        }
        setLocationResults(results);
      } catch (error: any) {
        if (reqId !== locationReq.current) return;
        setLocationResults([]);
        setLocationError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.form.locationSearchError")
        );
      } finally {
        if (reqId === locationReq.current) setLocationBusy(false);
      }
    }, 320);

    return () => window.clearTimeout(timer);
  }, [businessId, locationMode, locationQuery, t]);

  useEffect(() => {
    if (!businessId) return;
    const q = interestQuery.trim();
    const reqId = ++interestReq.current;

    // Empty query → browse Meta interest categories (same source as Ads Manager browse).
    if (q.length < 2) {
      const timer = window.setTimeout(async () => {
        try {
          setInterestBusy(true);
          setInterestError("");
          const [he, en] = await Promise.all([
            browseMetaInterestCategories(businessId, { locale: "he_IL" }),
            browseMetaInterestCategories(businessId, { locale: "en_US" }).catch(
              () => ({ results: [] as MetaInterestTarget[] })
            ),
          ]);
          if (reqId !== interestReq.current) return;
          setInterestResults(mergeInterestLists(he.results || [], en.results || []));
        } catch (error: any) {
          if (reqId !== interestReq.current) return;
          setInterestResults([]);
          setInterestError(
            error?.response?.data?.error ||
              error?.response?.data?.message ||
              t("metaCampaigns.form.interestSearchError")
          );
        } finally {
          if (reqId === interestReq.current) setInterestBusy(false);
        }
      }, 120);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(async () => {
      try {
        setInterestBusy(true);
        setInterestError("");
        // Server expands each locale with Meta related suggestions (official IDs only).
        const [he, en] = await Promise.all([
          searchMetaInterests(businessId, { q, locale: "he_IL", limit: 50 }),
          searchMetaInterests(businessId, { q, locale: "en_US", limit: 50 }),
        ]);
        if (reqId !== interestReq.current) return;
        setInterestResults(mergeInterestLists(he.results || [], en.results || []));
      } catch (error: any) {
        if (reqId !== interestReq.current) return;
        setInterestResults([]);
        setInterestError(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.form.interestSearchError")
        );
      } finally {
        if (reqId === interestReq.current) setInterestBusy(false);
      }
    }, 320);

    return () => window.clearTimeout(timer);
  }, [businessId, interestQuery, t]);

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
        const [he, en] = await Promise.all([
          searchMetaInterestSuggestions(businessId, {
            names,
            locale: "he_IL",
          }),
          searchMetaInterestSuggestions(businessId, {
            names,
            locale: "en_US",
          }).catch(() => ({ results: [] as MetaInterestTarget[] })),
        ]);
        if (cancelled) return;
        setInterestSuggestions(
          mergeInterestLists(he.results || [], en.results || []).filter(
            (item) => !selectedInterestIds.has(item.id)
          )
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

  // Resolve lat/lng for selected Meta locations so the map can pin + draw radius.
  useEffect(() => {
    let cancelled = false;
    const missing = locations.some(
      (item) =>
        item.latitude == null ||
        item.longitude == null ||
        !Number.isFinite(item.latitude) ||
        !Number.isFinite(item.longitude)
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

  const addLocation = async (item: MetaLocationTarget) => {
    const addressString = [
      item.name,
      item.region,
      item.countryName || item.countryCode,
    ]
      .filter(Boolean)
      .join(", ");

    const point = await geocodeLocation({ ...item, addressString });

    const next: MetaLocationTarget =
      locationMode === "radius"
        ? {
            ...item,
            // Meta radius targeting uses custom_locations (address or lat/lng).
            type: "custom",
            key: item.key || addressString,
            radiusKm,
            addressString,
            latitude: point?.latitude ?? item.latitude ?? null,
            longitude: point?.longitude ?? item.longitude ?? null,
          }
        : {
            ...item,
            radiusKm: undefined,
            addressString: undefined,
            latitude: point?.latitude ?? item.latitude ?? null,
            longitude: point?.longitude ?? item.longitude ?? null,
          };

    const identity = locationIdentity(next);
    const withoutDupes = locations.filter(
      (loc) => locationIdentity(loc) !== identity
    );

    // When choosing cities/radius, keep country Israel as broad base only if still country-only.
    // If user picks a city inside Israel, replace pure country IL with the more specific place
    // (Meta-like: selecting Tel Aviv replaces "Israel" broad targeting with that city).
    const filtered =
      next.type !== "country"
        ? withoutDupes.filter(
            (loc) => !(loc.type === "country" && loc.key === "IL")
          )
        : withoutDupes;

    onLocationsChange([...filtered, next]);
    setLocationQuery("");
    setLocationResults([]);
  };

  const removeLocation = (item: MetaLocationTarget) => {
    const next = locations.filter(
      (loc) => locationIdentity(loc) !== locationIdentity(item)
    );
    onLocationsChange(next.length ? next : [DEFAULT_ISRAEL_LOCATION]);
  };

  const updateLocationRadius = (item: MetaLocationTarget, nextRadius: number) => {
    onLocationsChange(
      locations.map((loc) =>
        locationIdentity(loc) === locationIdentity(item)
          ? { ...loc, radiusKm: nextRadius }
          : loc
      )
    );
  };

  const addInterest = (item: MetaInterestTarget) => {
    if (!item?.id || selectedInterestIds.has(item.id)) return;
    onInterestsChange([...interests, item]);
    setInterestQuery("");
    setInterestResults([]);
  };

  const removeInterest = (id: string) => {
    onInterestsChange(interests.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
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
            onClick={() => onLocationModeChange("places")}
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
            onClick={() => onLocationModeChange("radius")}
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
          <label className="mb-3 block">
            <span className="mb-1.5 block text-xs font-black text-slate-500">
              {t("metaCampaigns.form.radiusKm", { km: radiusKm })}
            </span>
            <input
              type="range"
              min={1}
              max={80}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value) || 25)}
              className="w-full"
            />
          </label>
        ) : null}

        <div className="relative mb-3">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={`${inputBase} ps-10`}
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder={t("metaCampaigns.form.locationSearchPlaceholder")}
          />
          {locationBusy ? (
            <Loader2 className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          ) : null}
        </div>

        {locationError ? (
          <p className="mb-2 text-xs font-semibold text-rose-600">{locationError}</p>
        ) : null}

        {locationResults.length ? (
          <div className="mb-3 max-h-48 overflow-auto rounded-xl border border-slate-100 bg-slate-50">
            {locationResults.map((item) => {
              const selected = selectedLocationKeys.has(locationIdentity(item));
              return (
                <button
                  key={locationIdentity(item)}
                  type="button"
                  disabled={selected}
                  onClick={() => addLocation(item)}
                  className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-3 py-2.5 text-start last:border-b-0 hover:bg-white disabled:opacity-50"
                >
                  <span>
                    <span className="block text-sm font-black text-slate-900">
                      {item.name}
                    </span>
                    <span className="block text-[11px] font-semibold text-slate-500">
                      {[item.type, item.region, item.countryName || item.countryCode]
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

        <div className="mb-3 flex flex-wrap gap-2">
          {locations.map((item) => (
            <span
              key={locationIdentity(item)}
              className="inline-flex items-center gap-2 rounded-full border border-[#1877F2]/20 bg-[#1877F2]/5 px-3 py-1.5 text-xs font-black text-slate-800"
            >
              <MapPin className="h-3.5 w-3.5 text-[#1877F2]" />
              <span>
                {item.name}
                {item.radiusKm
                  ? ` · ${item.radiusKm}${t("metaCampaigns.form.kmShort")}`
                  : ""}
              </span>
              {item.radiusKm ? (
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={item.radiusKm}
                  onChange={(e) =>
                    updateLocationRadius(item, Number(e.target.value) || 25)
                  }
                  className="w-14 rounded-md border border-slate-200 px-1 py-0.5 text-[11px]"
                  title={t("metaCampaigns.form.radiusEdit")}
                />
              ) : null}
              <button
                type="button"
                onClick={() => removeLocation(item)}
                className="rounded-full p-0.5 hover:bg-white"
                aria-label={t("metaCampaigns.form.remove")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <MetaLocationsMap
          locations={locations}
          hint={t("metaCampaigns.form.locationsMapHint")}
        />
      </div>

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

        <div className="relative mb-3 mt-3">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className={`${inputBase} ps-10`}
            value={interestQuery}
            onChange={(e) => setInterestQuery(e.target.value)}
            placeholder={t("metaCampaigns.form.interestSearchPlaceholder")}
          />
          {interestBusy ? (
            <Loader2 className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          ) : null}
        </div>

        {interestError ? (
          <p className="mb-2 text-xs font-semibold text-rose-600">{interestError}</p>
        ) : null}

        {interestResults.length ? (
          <div className="mb-3 max-h-56 overflow-auto rounded-xl border border-slate-100 bg-slate-50">
            {interestResults.map((item) => {
              const selected = selectedInterestIds.has(item.id);
              const size = formatAudienceSize(item.audienceSize);
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={selected}
                  onClick={() => addInterest(item)}
                  className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-3 py-2.5 text-start last:border-b-0 hover:bg-white disabled:opacity-50"
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

        {(suggestionsBusy || interestSuggestions.length > 0) && (
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
              {!suggestionsBusy && !interestSuggestions.length ? (
                <p className="text-[11px] font-semibold text-slate-400">
                  {t("metaCampaigns.form.interestSuggestionsEmpty")}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {!advantageAudience ? (
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
