import { describe, expect, it } from "vitest";
import he from "../../../../i18n/locales/he.json";
import {
  deleteDialogCopy,
  deleteFailureMessage,
  isLocalCampaignDraft,
  removeCampaignFromList,
  removeCampaignsFromList,
} from "./campaignListDeletion";

const CONFIRM_TITLE = "האם ברצונך למחוק את הקמפיין?";
const CONFIRM_MESSAGE = "אם תמחק את הקמפיין הזה, לא תהיה לך אפשרות לשחזר אותו מאוחר יותר.";

function t(key: string, options?: Record<string, unknown>) {
  const value = key.split(".").reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[segment];
  }, he);
  if (typeof value !== "string") return key;
  return Object.entries(options || {}).reduce(
    (text, [name, replacement]) => text.replaceAll(`{{${name}}}`, String(replacement)),
    value
  );
}

describe("campaign list deletion", () => {
  it("uses the Meta Ads Manager Hebrew confirmation copy", () => {
    expect(he.metaCampaigns.actions.confirmDeleteCampaignTitle).toBe(CONFIRM_TITLE);
    expect(he.metaCampaigns.actions.confirmDeleteCampaignMessage).toBe(CONFIRM_MESSAGE);
    expect(he.metaCampaigns.actions.deleteCampaign).toBe("מחיקה");
    expect(deleteDialogCopy(t, "campaign", 1)).toEqual({ title: CONFIRM_TITLE, body: CONFIRM_MESSAGE });
  });

  it("removes deleted campaigns from the manager list", () => {
    expect(isLocalCampaignDraft({ id: "draft-1", localOnly: true, metaCampaignId: "" })).toBe(true);
    expect(isLocalCampaignDraft({ id: "120251822243990469", localOnly: false, metaCampaignId: "120251822243990469" })).toBe(false);

    const rows = [
      { id: "draft-1", name: "טיוטה" },
      { id: "120251822243990469", name: "Evently360" },
    ];
    expect(removeCampaignFromList(rows, "draft-1").map((row) => row.id)).toEqual(["120251822243990469"]);
    expect(removeCampaignsFromList(rows, ["draft-1", "120251822243990469"])).toEqual([]);
  });

  it("returns a Hebrew error and does not describe a removed campaign", () => {
    expect(deleteFailureMessage({ response: { data: { error: "Could not delete the draft" } } }, t)).toBe(
      "מחיקת הקמפיין נכשלה. הקמפיין נשאר ברשימה."
    );
    expect(deleteFailureMessage({ response: { data: { code: "FORBIDDEN" } } }, t)).toBe(
      "אין הרשאה למחוק קמפיין של עסק אחר."
    );
    expect(deleteFailureMessage({ response: { data: { error: "אין הרשאה למחוק את הפריט בחשבון הפרסום המחובר ב-Meta." } } }, t)).toBe(
      "אין הרשאה למחוק את הפריט בחשבון הפרסום המחובר ב-Meta."
    );
  });
});
