import { describe, expect, it } from "vitest";
import { marketingAllowed, readTrackingChoice } from "./trackingConsent";

describe("tracking consent", () => {
  it("keeps marketing measurement off until the visitor allows it", () => {
    expect(readTrackingChoice("")).toBe("unknown");
    expect(marketingAllowed("bizuply_lang=he")).toBe(false);
    expect(marketingAllowed("bizuply_tracking=essential")).toBe(false);
    expect(marketingAllowed("bizuply_lang=he; bizuply_tracking=all")).toBe(true);
  });
});
