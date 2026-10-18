import { describe, expect, it } from "vitest";
import { createDefaultAdsManagerState } from "./adsManagerDefaults";
import { buildEditorDraft, stateFromSavedDraft } from "./editorDraft";

describe("editor draft workspace", () => {
  it("round-trips campaign, audience, budget, copy, and form without a blob preview", () => {
    const state = createDefaultAdsManagerState();
    state.campaign.name = "קמפיין חתונות 🎉";
    state.campaign.budgetAmount = "120.50";
    state.campaign.objective = "OUTCOME_LEADS";
    state.selectedLevel = "ad";
    state.selectedId = state.ads[0].id;
    state.adSets[0].locationsSummary = "תל אביב";
    state.adSets[0].ageMin = 25;
    state.adSets[0].ageMax = 45;
    state.adSets[0].advantagePlacements = false;
    state.ads[0].primaryText = "איזה כיף שאתם מתחברים 💜";
    state.ads[0].headline = "תודה 🎉";
    state.ads[0].description = "שורה ראשונה\nשורה שנייה";
    state.ads[0].callToAction = "SIGN_UP";
    state.ads[0].instantFormId = "form-9";
    state.ads[0].instantFormName = "טופס לידים";
    state.ads[0].imageHash = "hash-photo";
    state.ads[0].imagePreviewUrl = "blob:http://local/photo";

    const draft = buildEditorDraft(state);
    const restored = stateFromSavedDraft(draft, { publishRecordId: "publish-1" });

    expect(restored.publishRecordId).toBe("publish-1");
    expect(restored.selectedLevel).toBe("ad");
    expect(restored.campaign.name).toBe("קמפיין חתונות 🎉");
    expect(restored.campaign.budgetAmount).toBe("120.50");
    expect(restored.adSets[0].locationsSummary).toBe("תל אביב");
    expect(restored.adSets[0].ageMin).toBe(25);
    expect(restored.adSets[0].advantagePlacements).toBe(false);
    expect(restored.ads[0].primaryText).toBe("איזה כיף שאתם מתחברים 💜");
    expect(restored.ads[0].headline).toBe("תודה 🎉");
    expect(restored.ads[0].description).toBe("שורה ראשונה\nשורה שנייה");
    expect(restored.ads[0].instantFormId).toBe("form-9");
    expect(restored.ads[0].imageHash).toBe("hash-photo");
    expect(restored.ads[0].imagePreviewUrl).toBe("");
  });
});
