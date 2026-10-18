import { describe, expect, it } from "vitest";
import he from "../../../../i18n/locales/he.json";
import {
  deleteFailureMessage,
  isLocalCampaignDraft,
  removeCampaignFromList,
} from "./campaignListDeletion";

const CONFIRM_MESSAGE = "האם למחוק את הקמפיין? פעולה זו אינה ניתנת לביטול.";

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
  it("uses the exact Hebrew confirmation copy", () => {
    expect(he.metaCampaigns.actions.confirmDeleteCampaignMessage).toBe(CONFIRM_MESSAGE);
    expect(t("metaCampaigns.actions.confirmDeleteCampaignMessage")).toBe(CONFIRM_MESSAGE);
  });

  it("deletes only a local draft and keeps a Meta campaign in the list", () => {
    expect(isLocalCampaignDraft({ id: "draft-1", localOnly: true, metaCampaignId: "" })).toBe(true);
    expect(isLocalCampaignDraft({ id: "120251822243990469", localOnly: false, metaCampaignId: "120251822243990469" })).toBe(false);
    expect(isLocalCampaignDraft({ id: "draft-2", localOnly: true, metaCampaignId: "120251822243990469" })).toBe(false);

    const rows = [
      { id: "draft-1", name: "טיוטה" },
      { id: "120251822243990469", name: "Evently360" },
    ];
    const next = removeCampaignFromList(rows, "draft-1");
    expect(next.map((row) => row.id)).toEqual(["120251822243990469"]);
    expect(next).toHaveLength(1);
  });

  it("returns a Hebrew error and does not describe a removed campaign", () => {
    expect(deleteFailureMessage({ response: { data: { error: "Could not delete the draft" } } }, t)).toBe(
      "מחיקת הקמפיין נכשלה. הקמפיין נשאר ברשימה."
    );
    expect(deleteFailureMessage({ response: { data: { code: "FORBIDDEN" } } }, t)).toBe(
      "אין הרשאה למחוק קמפיין של עסק אחר."
    );
    expect(
      deleteFailureMessage(
        { response: { data: { code: "META_LIST_REMOVAL_BLOCKED" } } },
        t,
        "קמפיין חי"
      )
    ).toContain("קמפיין חי");
    expect(deleteFailureMessage({ response: { data: { error: "הטיוטה לא נמצאה." } } }, t)).toBe(
      "הטיוטה לא נמצאה."
    );
  });
});
