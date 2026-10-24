import { describe, expect, it, vi } from "vitest";
import {
  isPublishTimeoutError,
  recoverTimedOutPublish,
} from "./recoverTimedOutPublish";

describe("recoverTimedOutPublish", () => {
  it("detects the 20s Axios timeout the interceptor used to flatten", () => {
    expect(
      isPublishTimeoutError({
        isTimeout: true,
        code: "NETWORK_TIMEOUT",
        message: "Network timeout",
      })
    ).toBe(true);
    expect(
      isPublishTimeoutError({
        message: "timeout of 20000ms exceeded",
        code: "ECONNABORTED",
      })
    ).toBe(true);
    expect(isPublishTimeoutError({ message: "Forbidden" })).toBe(false);
  });

  it("returns the Meta ad once the server finishes after a client timeout", async () => {
    const wait = vi.fn().mockResolvedValue({
      id: "pub-1",
      publishStatus: "submitted",
      metaAdId: "120251824746210469",
      metaCampaignId: "120251822243990469",
      metaAdSetId: "120251823719850469",
      metaCreativeId: "cr-1",
      displayStatus: "PAUSED",
      outcome: "created_paused",
    });
    const result = await recoverTimedOutPublish(
      { isTimeout: true, code: "NETWORK_TIMEOUT", message: "Network timeout" },
      "pub-1",
      wait
    );
    expect(result.adId).toBe("120251824746210469");
    expect(result.publish.metaCampaignId).toBe("120251822243990469");
    expect(wait).toHaveBeenCalledWith("pub-1");
  });

  it("surfaces Meta's stored Hebrew error when the delayed publish failed", async () => {
    await expect(
      recoverTimedOutPublish(
        { isTimeout: true },
        "pub-1",
        async () => ({
          id: "pub-1",
          publishStatus: "partial_failed",
          lastError: "אין הרשאה לפרסם בחשבון המודעות או בדף הזה.",
          failedStage: "adset",
        })
      )
    ).rejects.toMatchObject({
      response: {
        data: {
          error: "אין הרשאה לפרסם בחשבון המודעות או בדף הזה.",
          failedStage: "adset",
        },
      },
    });
  });
});
