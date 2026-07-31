import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bookmark, Trash2, Upload } from "lucide-react";
import { btnGhost, btnSecondary, inputBase } from "../../../../styles/bizuplyUi";
import type {
  MetaInterestTarget,
  MetaLocationTarget,
} from "../../../../api/metaCampaignsApi";

export type SavedAudienceSnapshot = {
  advantageAudience: boolean;
  locations: MetaLocationTarget[];
  locationMode: "places" | "radius";
  interests: MetaInterestTarget[];
  ageMin: string;
  ageMax: string;
  gender: "all" | "1" | "2";
};

export type SavedAudienceEntry = {
  id: string;
  name: string;
  savedAt: string;
  snapshot: SavedAudienceSnapshot;
};

type Props = {
  businessId: string;
  current: SavedAudienceSnapshot;
  onLoad: (audience: SavedAudienceSnapshot) => void;
};

function storageKey(businessId: string) {
  return `bizuply.meta.savedAudiences.${businessId}`;
}

function readSaved(businessId: string): SavedAudienceEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(businessId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSaved(businessId: string, entries: SavedAudienceEntry[]) {
  localStorage.setItem(storageKey(businessId), JSON.stringify(entries));
}

export default function MetaSavedAudiences({
  businessId,
  current,
  onLoad,
}: Props) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<SavedAudienceEntry[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const reload = useCallback(() => {
    setEntries(readSaved(businessId));
  }, [businessId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveCurrent = () => {
    const name = nameInput.trim();
    if (!name) return;

    const entry: SavedAudienceEntry = {
      id: `aud_${Date.now().toString(36)}`,
      name,
      savedAt: new Date().toISOString(),
      snapshot: { ...current },
    };
    const next = [entry, ...entries];
    writeSaved(businessId, next);
    setEntries(next);
    setNameInput("");
    setShowNameInput(false);
  };

  const deleteEntry = (id: string) => {
    const next = entries.filter((item) => item.id !== id);
    writeSaved(businessId, next);
    setEntries(next);
  };

  const promptSave = () => {
    const name = window.prompt(t("metaCampaigns.wizard.savedAudiences.namePrompt"));
    if (!name?.trim()) return;
    const entry: SavedAudienceEntry = {
      id: `aud_${Date.now().toString(36)}`,
      name: name.trim(),
      savedAt: new Date().toISOString(),
      snapshot: { ...current },
    };
    const next = [entry, ...entries];
    writeSaved(businessId, next);
    setEntries(next);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4" dir="rtl">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">
            {t("metaCampaigns.wizard.savedAudiences.title")}
          </p>
          <p className="text-xs font-semibold text-slate-500">
            {t("metaCampaigns.wizard.savedAudiences.hint")}
          </p>
        </div>
        <Bookmark className="h-4 w-4 shrink-0 text-[#1877F2]" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={promptSave}
          className={btnSecondary}
        >
          {t("metaCampaigns.wizard.savedAudiences.save")}
        </button>
        <button
          type="button"
          onClick={() => setShowNameInput((value) => !value)}
          className={btnGhost}
        >
          {t("metaCampaigns.wizard.savedAudiences.saveInline")}
        </button>
      </div>

      {showNameInput ? (
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            className={`${inputBase} min-w-[12rem] flex-1`}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={t("metaCampaigns.wizard.savedAudiences.namePlaceholder")}
          />
          <button
            type="button"
            onClick={saveCurrent}
            disabled={!nameInput.trim()}
            className={btnSecondary}
          >
            {t("metaCampaigns.wizard.savedAudiences.confirmSave")}
          </button>
        </div>
      ) : null}

      {entries.length === 0 ? (
        <p className="text-xs font-semibold text-slate-400">
          {t("metaCampaigns.wizard.savedAudiences.empty")}
        </p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-900">
                  {entry.name}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  {t("metaCampaigns.wizard.savedAudiences.meta", {
                    locations: entry.snapshot.locations.length,
                    interests: entry.snapshot.interests.length,
                    mode: entry.snapshot.advantageAudience
                      ? t("metaCampaigns.wizard.savedAudiences.modeAdvantage")
                      : t("metaCampaigns.wizard.savedAudiences.modeRegular"),
                  })}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  onClick={() => onLoad(entry.snapshot)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#1877F2]/30 bg-white px-2.5 py-1.5 text-xs font-black text-[#1877F2] hover:bg-[#1877F2]/5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {t("metaCampaigns.wizard.savedAudiences.load")}
                </button>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-black text-rose-600 hover:bg-rose-50"
                  aria-label={t("metaCampaigns.wizard.savedAudiences.delete")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
