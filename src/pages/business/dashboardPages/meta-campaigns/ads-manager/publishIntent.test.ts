import { describe, expect, it } from "vitest";
import type { AdsManagerChange } from "./adsManagerDiff";
import {
  publishableAdsManagerChanges,
  publishIntentLabelKey,
  resolvePublishIntent,
} from "./publishIntent";

function change(labelKey: string): AdsManagerChange {
  return {
    id: labelKey,
    labelKey,
    oldValue: "a",
    newValue: "b",
    spendImpact: false,
    entity: "ad",
    entityId: "1",
  };
}

describe("publish intent", () => {
  it("labels a new campaign, an existing campaign with changes, and an unchanged campaign differently", () => {
    expect(
      resolvePublishIntent({ existingCampaign: false, publishableChangeCount: 0 })
    ).toBe("create");
    expect(
      resolvePublishIntent({ existingCampaign: true, publishableChangeCount: 1 })
    ).toBe("update");
    expect(
      resolvePublishIntent({ existingCampaign: true, publishableChangeCount: 0 })
    ).toBe("noop");
    expect(publishIntentLabelKey("create")).toBe("publishCampaign");
    expect(publishIntentLabelKey("update")).toBe("publishChanges");
    expect(publishIntentLabelKey("noop")).toBe("noChangesToPublish");
  });

  it("does not treat moving around the editor as a change to publish", () => {
    const changes = publishableAdsManagerChanges([
      change("changeSelection"),
      change("changeLeadForm"),
    ]);
    expect(changes.map((row) => row.labelKey)).toEqual(["changeLeadForm"]);
  });
});
