import { describe, expect, it } from "vitest";
import {
  campaignConfiguredOn,
  campaignMatchesStatusFilter,
  canToggleMetaDelivery,
  DELIVERY_REFRESH_MS,
  deliveryLabelStatuses,
  displayListStatus,
  isQaTestDraftName,
  isUnpublishedLocalCampaign,
  loadHideQaDrafts,
  mergeDeliveryRefresh,
  saveHideQaDrafts,
  shouldRefreshDelivery,
} from "./campaignLocalDraft";
import { deliveryStatusLabel, formatDateTimeHe, metaDeliveryStatusKey } from "./metaCampaignUtils";

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

  it("shows ad review while the campaign switch stays on", () => {
    const row = {
      id: "120258064256700405",
      status: "ACTIVE",
      configuredStatus: "ACTIVE",
      effectiveStatus: "PENDING_REVIEW",
      deliveryStatus: "PENDING_REVIEW",
      deliveryStatuses: ["PENDING_REVIEW"],
    };
    expect(displayListStatus(row)).toBe("PENDING_REVIEW");
    expect(deliveryLabelStatuses(row)).toEqual(["PENDING_REVIEW"]);
    expect(campaignConfiguredOn(row)).toBe(true);
    expect(metaDeliveryStatusKey("PENDING_REVIEW")).toBe("pending_review");
  });

  it("keeps rejected and in-review ads visible beside an active ad", () => {
    const row = {
      id: "120258064256700405",
      configuredStatus: "ACTIVE",
      deliveryStatuses: ["DISAPPROVED", "PENDING_REVIEW", "ACTIVE"],
    };
    expect(deliveryLabelStatuses(row)).toEqual(["DISAPPROVED", "PENDING_REVIEW", "ACTIVE"]);
    expect(displayListStatus(row)).toBe("DISAPPROVED");
    expect(campaignConfiguredOn(row)).toBe(true);
    const label = deliveryStatusLabel(deliveryLabelStatuses(row), (key, options) => {
      if (key.endsWith("disapproved")) return "נדחה";
      if (key.endsWith("pending_review")) return "בבדיקה";
      if (key.endsWith("active")) return "פעיל";
      return options?.defaultValue || key;
    });
    expect(label).toBe("נדחה · בבדיקה · פעיל");
    expect(campaignMatchesStatusFilter(row, "DISAPPROVED", "DISAPPROVED")).toBe(true);
    expect(campaignMatchesStatusFilter(row, "PENDING_REVIEW", "DISAPPROVED")).toBe(true);
    expect(campaignMatchesStatusFilter(row, "ACTIVE", "DISAPPROVED")).toBe(true);
  });

  it("does not turn an unknown status or a failed refresh into active", () => {
    const row = {
      id: "120258064256700405",
      configuredStatus: "ACTIVE",
      deliveryStatus: "LEARNING_LIMITED",
    };
    expect(displayListStatus(row)).toBe("LEARNING_LIMITED");
    expect(metaDeliveryStatusKey("LEARNING_LIMITED")).toBe("limited");
    expect(metaDeliveryStatusKey("UNKNOWN")).toBe("unknown");
    expect(metaDeliveryStatusKey("NOT_A_META_STATUS")).toBe("not_a_meta_status");
    const current = [{ id: "120258064256700405", configuredStatus: "ACTIVE", deliveryStatus: "PENDING_REVIEW" }];
    expect(mergeDeliveryRefresh(current, null, { failed: true })).toEqual(current);
    expect(
      mergeDeliveryRefresh(current, [
        {
          id: "120258064256700405",
          configuredStatus: "ACTIVE",
          deliveryStatus: "UNKNOWN",
          deliveryStatuses: ["UNKNOWN"],
          deliverySyncError: true,
        },
      ])
    ).toEqual(current);
    expect(
      mergeDeliveryRefresh(
        [{ id: "120258064256700405", configuredStatus: "ACTIVE", deliveryStatus: "" }],
        [
          {
            id: "120258064256700405",
            configuredStatus: "ACTIVE",
            deliveryStatus: "UNKNOWN",
            deliveryStatuses: ["UNKNOWN"],
            deliverySyncError: true,
          },
        ]
      )[0].deliveryStatus
    ).toBe("UNKNOWN");
  });

  it("refreshes delivery only while the tab is visible, once a minute", () => {
    expect(DELIVERY_REFRESH_MS).toBe(60_000);
    expect(shouldRefreshDelivery("visible")).toBe(true);
    expect(shouldRefreshDelivery("hidden")).toBe(false);
    expect(shouldRefreshDelivery("")).toBe(false);
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

  it("defaults hide-QA-drafts off and persists the user's checkbox", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    expect(loadHideQaDrafts(storage, "biz-1")).toBe(false);
    saveHideQaDrafts(storage, "biz-1", true);
    expect(loadHideQaDrafts(storage, "biz-1")).toBe(true);
    expect(loadHideQaDrafts(storage, "biz-2")).toBe(false);
    saveHideQaDrafts(storage, "biz-1", false);
    expect(loadHideQaDrafts(storage, "biz-1")).toBe(false);
  });
});
