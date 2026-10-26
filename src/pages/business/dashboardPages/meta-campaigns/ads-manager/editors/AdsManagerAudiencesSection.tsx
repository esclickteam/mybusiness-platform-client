import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  listMetaAdStudies,
  listMetaCustomAudiences,
  listMetaSavedAudiences,
  type MetaCustomAudience,
  type MetaSavedAudience,
} from "../../../../../../api/metaCampaignsApi";
import type { AdSetDraft, AdSetInterest } from "../adsManagerTypes";
import { MetaField, MetaSection, metaInputClass } from "../metaAdsUi";

type Props = {
  adSet: AdSetDraft;
  businessId: string | null;
  onChange: (patch: Partial<AdSetDraft>) => void;
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
}: Props) {
  const { t } = useTranslation();
  const [audiences, setAudiences] = useState<MetaCustomAudience[]>([]);
  const [saved, setSaved] = useState<MetaSavedAudience[]>([]);
  const [studies, setStudies] = useState<Array<{ id: string; name?: string; type?: string }>>([]);
  const [error, setError] = useState("");

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
        {studies.length ? (
          <ul className="mt-1 list-disc ps-5">
            {studies.map((row) => (
              <li key={row.id}>
                {row.name || row.id} {row.type ? `· ${row.type}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("metaCampaigns.adsManager.chrome.abTestsEmpty")}</p>
        )}
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
