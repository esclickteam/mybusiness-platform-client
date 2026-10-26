import React from "react";
import { useTranslation } from "react-i18next";
import type { AdSetDraft } from "../adsManagerTypes";
import {
  AUDIENCE_NETWORK_POSITIONS,
  DEVICE_PLATFORMS,
  FACEBOOK_POSITIONS,
  INSTAGRAM_POSITIONS,
  MESSENGER_POSITIONS,
  PUBLISHER_PLATFORMS,
  toggleValue,
} from "../metaAdsManagerParity";
import { MetaSection, MetaTag, MetaToggle } from "../metaAdsUi";

type Props = {
  adSet: AdSetDraft;
  onChange: (patch: Partial<AdSetDraft>) => void;
};

function CheckRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[13px] text-[#050505]">
      <input type="checkbox" checked={checked} onChange={onToggle} />
      {label}
    </label>
  );
}

export default function AdsManagerPlacementsSection({ adSet, onChange }: Props) {
  const { t } = useTranslation();
  const platforms = adSet.publisherPlatforms || [];
  const label = (key: string) =>
    t(`metaCampaigns.adsManager.chrome.place_${key}`, { defaultValue: key });

  return (
    <MetaSection
      title={t("metaCampaigns.adsManager.chrome.placements")}
      action={
        <MetaTag>
          {adSet.advantagePlacements
            ? t("metaCampaigns.adsManager.chrome.advantageOn")
            : t("metaCampaigns.adsManager.chrome.manualPlacements")}
        </MetaTag>
      }
    >
      <p className="text-[13px] leading-snug text-[#65676B]">
        {t("metaCampaigns.adsManager.chrome.placementsHint")}
      </p>
      <MetaToggle
        checked={adSet.advantagePlacements}
        onChange={(advantagePlacements) =>
          onChange({
            advantagePlacements,
            publisherPlatforms: advantagePlacements
              ? adSet.publisherPlatforms
              : adSet.publisherPlatforms?.length
                ? adSet.publisherPlatforms
                : ["facebook", "instagram"],
          })
        }
        label={t("metaCampaigns.adsManager.chrome.advantagePlacements")}
        description={t("metaCampaigns.adsManager.chrome.advantagePlacementsDesc")}
      />
      {adSet.advantagePlacements ? null : (
        <div className="mt-3 space-y-3 rounded-lg border border-[#E4E6EB] p-3">
          <p className="text-[13px] font-semibold">
            {t("metaCampaigns.adsManager.chrome.publisherPlatforms")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PUBLISHER_PLATFORMS.map((value) => (
              <CheckRow
                key={value}
                label={label(value)}
                checked={platforms.includes(value)}
                onToggle={() =>
                  onChange({
                    publisherPlatforms: toggleValue(platforms, value),
                  })
                }
              />
            ))}
          </div>
          {platforms.includes("facebook") ? (
            <div>
              <p className="mb-1 text-[13px] font-semibold">{label("facebook")}</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {FACEBOOK_POSITIONS.map((value) => (
                  <CheckRow
                    key={value}
                    label={label(value)}
                    checked={(adSet.facebookPositions || []).includes(value)}
                    onToggle={() =>
                      onChange({
                        facebookPositions: toggleValue(
                          adSet.facebookPositions || [],
                          value
                        ),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
          {platforms.includes("instagram") ? (
            <div>
              <p className="mb-1 text-[13px] font-semibold">{label("instagram")}</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {INSTAGRAM_POSITIONS.map((value) => (
                  <CheckRow
                    key={value}
                    label={label(value)}
                    checked={(adSet.instagramPositions || []).includes(value)}
                    onToggle={() =>
                      onChange({
                        instagramPositions: toggleValue(
                          adSet.instagramPositions || [],
                          value
                        ),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
          {platforms.includes("messenger") ? (
            <div>
              <p className="mb-1 text-[13px] font-semibold">{label("messenger")}</p>
              {MESSENGER_POSITIONS.map((value) => (
                <CheckRow
                  key={value}
                  label={label(value)}
                  checked={(adSet.messengerPositions || []).includes(value)}
                  onToggle={() =>
                    onChange({
                      messengerPositions: toggleValue(
                        adSet.messengerPositions || [],
                        value
                      ),
                    })
                  }
                />
              ))}
              <p className="mt-1 text-[12px] text-[#65676B]">
                {t("metaCampaigns.adsManager.chrome.sponsoredMessagesNote")}
              </p>
            </div>
          ) : null}
          {platforms.includes("audience_network") ? (
            <div>
              <p className="mb-1 text-[13px] font-semibold">{label("audience_network")}</p>
              {AUDIENCE_NETWORK_POSITIONS.map((value) => (
                <CheckRow
                  key={value}
                  label={label(value)}
                  checked={(adSet.audienceNetworkPositions || []).includes(value)}
                  onToggle={() =>
                    onChange({
                      audienceNetworkPositions: toggleValue(
                        adSet.audienceNetworkPositions || [],
                        value
                      ),
                    })
                  }
                />
              ))}
            </div>
          ) : null}
          <div>
            <p className="mb-1 text-[13px] font-semibold">
              {t("metaCampaigns.adsManager.chrome.devices")}
            </p>
            {DEVICE_PLATFORMS.map((value) => (
              <CheckRow
                key={value}
                label={label(value)}
                checked={(adSet.devicePlatforms || []).includes(value)}
                onToggle={() =>
                  onChange({
                    devicePlatforms: toggleValue(adSet.devicePlatforms || [], value),
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
    </MetaSection>
  );
}
