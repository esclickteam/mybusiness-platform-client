import { describe, expect, it } from "vitest";
import {
  canToggleMetaDelivery,
  displayListStatus,
  isQaTestDraftName,
  isUnpublishedLocalCampaign,
} from "./campaignLocalDraft";
import { formatDateTimeHe } from "./metaCampaignUtils";

describe("unpublished local drafts", () => {
  it("treats mongo ids and DRAFT rows as local, never pause/resume on Meta", () => {
    expect(
      isUnpublishedLocalCampaign({
        id: "6ae06f095cddb10faa003644",
        status: "PAUSED",
      })
    ).toBe(true);
    expect(displayListStatus({ id: "6ae06f095cddb10faa003644", status: "PAUSED" })).toBe(
      "DRAFT"
    );
    expect(
      canToggleMetaDelivery({ id: "6ae06f095cddb10faa003644", status: "PAUSED" })
    ).toBe(false);
  });

  it("keeps live Meta paused/active campaigns toggleable", () => {
    expect(
      isUnpublishedLocalCampaign({
        id: "120252174521090469",
        status: "PAUSED",
      })
    ).toBe(false);
    expect(
      displayListStatus({ id: "120252174521090469", status: "ACTIVE" })
    ).toBe("ACTIVE");
    expect(
      canToggleMetaDelivery({ id: "120252174521090469", status: "PAUSED" })
    ).toBe(true);
    expect(
      isUnpublishedLocalCampaign({
        id: "120251859679660469",
        status: "PENDING_PUBLISH",
      })
    ).toBe(false);
    expect(
      displayListStatus({
        id: "120251859679660469",
        status: "PENDING_PUBLISH",
      })
    ).toBe("PENDING_PUBLISH");
    expect(
      canToggleMetaDelivery({
        id: "120251859679660469",
        status: "PENDING_PUBLISH",
      })
    ).toBe(true);
  });

  it("formats last-synced times in Asia/Jerusalem instead of UTC", () => {
    const text = formatDateTimeHe("2026-10-27T09:28:00.000Z", "en-US");
    expect(text).toMatch(/11:28/);
  });

  it("matches previous QA draft names without treating every leads draft as junk", () => {
    expect(isQaTestDraftName("Bizuply DT #924 QA PAUSED 2026-10-24T15-17-15-330Z")).toBe(
      true
    );
    expect(isQaTestDraftName("Bizuply DT E2E PAUSED 2026-10-24T12-18-53-743Z")).toBe(true);
    expect(isQaTestDraftName("קמפיין לידים חדש")).toBe(false);
  });
});
