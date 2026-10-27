import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createMetaAdStudy,
  createMetaLookalikeAudience,
  listMetaAdStudies,
  listMetaCustomAudiences,
  listMetaSavedAudiences,
  startMetaAdStudy,
  type MetaCustomAudience,
  type MetaSavedAudience,
} from "../../../../../../api/metaCampaignsApi";
import type { AdSetDraft, AdSetInterest } from "../adsManagerTypes";
import { MetaField, MetaSection, metaInputClass } from "../metaAdsUi";

type Props = {
  adSet: AdSetDraft;
  businessId: string | null;
  onChange: (patch: Partial<AdSetDraft>) => void;
  advancedCapabilities?: {
    lookalikeCreate?: boolean;
    abStudyCreate?: boolean;
    abStudyStart?: boolean;
  };
};

function toggleAudience(list: AdSetInterest[], row: MetaCustomAudience): AdSetInterest[] {
  const exists = list.some((item) => item.id === row.id);
  if (exists) return list.filter((item) => item.id !== row.id);
  return [...list, { id: row.id, name: row.name }];
}

export default function AdsManagerAudiencesSection({
  adSet,
  businessId,
  onChange,
  advancedCapabilities,
}: Props) {
  const { t } = useTranslation();
  const [audiences, setAudiences] = useState<MetaCustomAudience[]>([]);
  const [saved, setSaved] = useState<MetaSavedAudience[]>([]);
  const [studies, setStudies] = useState<Array<{ id: string; name?: string; type?: string }>>([]);
  const [error, setError] = useState("");
  const [lalName, setLalName] = useState("");
  const [lalOrigin, setLalOrigin] = useState("");
  const [lalCountry, setLalCountry] = useState("IL");
  const [lalPercent, setLalPercent] = useState(1);
  const [lalBusy, setLalBusy] = useState(false);
  const [abName, setAbName] = useState("");
  const [abBusy, setAbBusy] = useState(false);
  const [pendingStartId, setPendingStartId] = useState("");
  const [confirmStart, setConfirmStart] = useState(false);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    Promise.all([
      listMetaCustomAudiences(businessId),
      listMetaSavedAudiences(businessId),
      listMetaAdStudies(businessId),
    ])
      .then(([custom, savedRows, studyRows]) => {
        if (cancelled) return;
        setAudiences(custom.results || []);
        setSaved(savedRows.results || []);
        setStudies(studyRows.results || []);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err?.message || err));
      });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  const refreshAudiences = async () => {
    if (!businessId) return;
    const [custom, studyRows] = await Promise.all([
      listMetaCustomAudiences(businessId),
      listMetaAdStudies(businessId),
    ]);
    setAudiences(custom.results || []);
    setStudies(studyRows.results || []);
  };

  const createLookalike = async () => {
    if (!businessId || !lalOrigin) return;
    setLalBusy(true);
    setError("");
    try {
      await createMetaLookalikeAudience(businessId, {
        originAudienceId: lalOrigin,
        country: lalCountry,
        percent: lalPercent,
        name: lalName || undefined,
      });
      setLalName("");
      await refreshAudiences();
    } catch (err) {
      const message = err as { response?: { data?: { error?: string } }; message?: string };
      setError(message.response?.data?.error || message.message || String(err));
    } finally {
      setLalBusy(false);
    }
  };

  const createStudy = async () => {
    if (!businessId) return;
    setAbBusy(true);
    setError("");
    try {
      await createMetaAdStudy(businessId, {
        name: abName || "Split test",
        cells: [{ name: "A", treatmentPercentage: 50 }, { name: "B", treatmentPercentage: 50 }],
      });
      setAbName("");
      await refreshAudiences();
    } catch (err) {
      const message = err as { response?: { data?: { error?: string } }; message?: string };
      setError(message.response?.data?.error || message.message || String(err));
    } finally {
      setAbBusy(false);
    }
  };

  const startStudy = async () => {
    if (!businessId || !pendingStartId || !confirmStart) return;
    setAbBusy(true);
    setError("");
    try {
      await startMetaAdStudy(businessId, pendingStartId, true);
      setPendingStartId("");
      setConfirmStart(false);
      await refreshAudiences();
    } catch (err) {
      const message = err as { response?: { data?: { error?: string } }; message?: string };
      setError(message.response?.data?.error || message.message || String(err));
    } finally {
      setAbBusy(false);
    }
  };

  const lookalikes = audiences.filter((row) => row.lookalike);
  const customs = audiences.filter((row) => !row.lookalike);

  return (
    <MetaSection title={t("metaCampaigns.adsManager.chrome.advancedAudiences")}>
      <p className="text-[13px] text-[#65676B]">
        {t("metaCampaigns.adsManager.chrome.advancedAudiencesHint")}
      </p>
      {error ? (
        <p className="mt-2 text-[13px] text-[#C03221]">{error}</p>
      ) : null}
      <AudienceGroup
        title={t("metaCampaigns.adsManager.chrome.customAudiences")}
        rows={customs}
        selected={adSet.customAudiences || []}
        onToggle={(row) =>
          onChange({ customAudiences: toggleAudience(adSet.customAudiences || [], row) })
        }
        empty={t("metaCampaigns.adsManager.chrome.noCustomAudiences")}
      />
      <AudienceGroup
        title={t("metaCampaigns.adsManager.chrome.lookalikeAudiences")}
        rows={lookalikes}
        selected={adSet.customAudiences || []}
        onToggle={(row) =>
          onChange({ customAudiences: toggleAudience(adSet.customAudiences || [], row) })
        }
        empty={t("metaCampaigns.adsManager.chrome.noLookalikes")}
      />
      {advancedCapabilities?.lookalikeCreate ? (
      <div className="mt-3 space-y-2 rounded-md border border-[#E4E6EB] p-3">
        <p className="text-[13px] font-semibold">
          {t("metaCampaigns.adsManager.chrome.createLookalike")}
        </p>
        <p className="text-[12px] text-[#65676B]">
          {t("metaCampaigns.adsManager.chrome.createLookalikeHint")}
        </p>
        <MetaField label={t("metaCampaigns.adsManager.chrome.lookalikeSource")}>
          <select
            className={metaInputClass}
            value={lalOrigin}
            onChange={(e) => setLalOrigin(e.target.value)}
          >
            <option value="">{t("metaCampaigns.adsManager.none")}</option>
            {customs.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>
        </MetaField>
        <div className="grid gap-2 sm:grid-cols-2">
          <MetaField label={t("metaCampaigns.adsManager.chrome.lookalikeCountry")}>
            <select
              className={metaInputClass}
              value={lalCountry}
              onChange={(e) => setLalCountry(e.target.value)}
            >
              {["IL", "US", "GB", "DE", "FR", "IT", "ES", "AE", "AU", "CA"].map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </MetaField>
          <MetaField label={t("metaCampaigns.adsManager.chrome.lookalikePercent")}>
            <select
              className={metaInputClass}
              value={lalPercent}
              onChange={(e) => setLalPercent(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}%
                </option>
              ))}
            </select>
          </MetaField>
        </div>
        <MetaField label={t("metaCampaigns.adsManager.chrome.lookalikeName")}>
          <input
            className={metaInputClass}
            value={lalName}
            onChange={(e) => setLalName(e.target.value)}
          />
        </MetaField>
        <button
          type="button"
          className="rounded-md bg-[#1877F2] px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
          disabled={!lalOrigin || lalBusy}
          onClick={() => void createLookalike()}
        >
          {lalBusy
            ? t("metaCampaigns.adsManager.chrome.creatingLookalike")
            : t("metaCampaigns.adsManager.chrome.createLookalike")}
        </button>
      </div>
      ) : (
        <p className="mt-2 text-[12px] text-[#65676B]">
          {t("metaCampaigns.adsManager.chrome.advancedWritesOff")}
        </p>
      )}
      <AudienceGroup
        title={t("metaCampaigns.adsManager.chrome.excludedAudiences")}
        rows={audiences}
        selected={adSet.excludedAudiences || []}
        onToggle={(row) =>
          onChange({
            excludedAudiences: toggleAudience(adSet.excludedAudiences || [], row),
          })
        }
        empty={t("metaCampaigns.adsManager.chrome.noCustomAudiences")}
      />
      <MetaField label={t("metaCampaigns.adsManager.chrome.savedAudience")}>
        <select
          className={metaInputClass}
          value={adSet.savedAudienceId}
          onChange={(e) => onChange({ savedAudienceId: e.target.value })}
        >
          <option value="">{t("metaCampaigns.adsManager.none")}</option>
          {saved.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
      </MetaField>
      <MetaField label={t("metaCampaigns.adsManager.chrome.localesHint")}>
        <input
          className={metaInputClass}
          value={(adSet.locales || []).join(",")}
          onChange={(e) =>
            onChange({
              locales: e.target.value
                .split(/[,\s]+/)
                .map((item) => Number(item))
                .filter((item) => Number.isFinite(item) && item > 0),
            })
          }
          placeholder="6, 24"
        />
      </MetaField>
      <div className="rounded-md bg-[#F0F2F5] p-3 text-[13px] text-[#65676B]">
        <p className="font-semibold text-[#050505]">
          {t("metaCampaigns.adsManager.chrome.abTests")}
        </p>
        <p className="mt-1">{t("metaCampaigns.adsManager.chrome.abTestsHint")}</p>
        {advancedCapabilities?.abStudyCreate ? (
          <>
        <MetaField label={t("metaCampaigns.adsManager.chrome.abTestName")}>
          <input
            className={metaInputClass}
            value={abName}
            onChange={(e) => setAbName(e.target.value)}
          />
        </MetaField>
        <button
          type="button"
          className="mt-2 rounded-md bg-white px-3 py-2 text-[13px] font-semibold text-[#1877F2] disabled:opacity-50"
          disabled={abBusy}
          onClick={() => void createStudy()}
        >
          {t("metaCampaigns.adsManager.chrome.createAbDraft")}
        </button>
          </>
        ) : (
          <p className="mt-1">{t("metaCampaigns.adsManager.chrome.advancedWritesOff")}</p>
        )}
        {studies.length ? (
          <ul className="mt-3 space-y-2">
            {studies.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  {row.name || row.id} {row.type ? `· ${row.type}` : ""}
                </span>
                {advancedCapabilities?.abStudyStart ? (
                <button
                  type="button"
                  className="text-[12px] font-bold text-[#1877F2]"
                  onClick={() => {
                    setPendingStartId(row.id);
                    setConfirmStart(false);
                  }}
                >
                  {t("metaCampaigns.adsManager.chrome.startAb")}
                </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2">{t("metaCampaigns.adsManager.chrome.abTestsEmpty")}</p>
        )}
        {pendingStartId ? (
          <div className="mt-3 rounded-md border border-[#F5D78E] bg-[#FFF8E5] p-3 text-[#8A6D1D]">
            <p className="font-semibold">{t("metaCampaigns.adsManager.chrome.abConfirmTitle")}</p>
            <p className="mt-1">{t("metaCampaigns.adsManager.chrome.abConfirmBody")}</p>
            <label className="mt-2 flex items-center gap-2 font-semibold">
              <input
                type="checkbox"
                checked={confirmStart}
                onChange={(e) => setConfirmStart(e.target.checked)}
              />
              {t("metaCampaigns.adsManager.chrome.abConfirmCheck")}
            </label>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => setPendingStartId("")}>
                {t("metaCampaigns.adsManager.chrome.refreshConfirmKeep")}
              </button>
              <button
                type="button"
                className="font-bold text-[#1877F2] disabled:opacity-50"
                disabled={!confirmStart || abBusy}
                onClick={() => void startStudy()}
              >
                {t("metaCampaigns.adsManager.chrome.startAb")}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </MetaSection>
  );
}

function AudienceGroup({
  title,
  rows,
  selected,
  onToggle,
  empty,
}: {
  title: string;
  rows: MetaCustomAudience[];
  selected: AdSetInterest[];
  onToggle: (row: MetaCustomAudience) => void;
  empty: string;
}) {
  return (
    <div className="mt-3">
      <p className="mb-1 text-[13px] font-semibold">{title}</p>
      {rows.length ? (
        <div className="max-h-40 space-y-1 overflow-auto rounded-md border border-[#E4E6EB] p-2">
          {rows.map((row) => (
            <label key={`${title}-${row.id}`} className="flex items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                checked={selected.some((item) => item.id === row.id)}
                onChange={() => onToggle(row)}
              />
              <span>
                {row.name}
                {row.lookalike ? " · LAL" : ""}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-[#65676B]">{empty}</p>
      )}
    </div>
  );
}
