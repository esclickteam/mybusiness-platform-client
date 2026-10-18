import { describe, expect, it } from "vitest";
import { leadgenTosBlocksPublish, leadgenTosUrl } from "./leadgenTos";

describe("leadgen TOS helpers", () => {
  it("builds the official page-specific Facebook URL", () => {
    expect(leadgenTosUrl("1222199210985216")).toBe(
      "https://www.facebook.com/ads/leadgen/tos?page_id=1222199210985216"
    );
  });

  it("blocks publish only when Meta has not verified acceptance for the page", () => {
    expect(
      leadgenTosBlocksPublish({
        status: "required",
        accepted: false,
        verified: false,
      })
    ).toBe(true);
    expect(
      leadgenTosBlocksPublish({
        status: "missing_permission",
        accepted: false,
        verified: false,
      })
    ).toBe(true);
    expect(
      leadgenTosBlocksPublish({
        status: "accepted",
        accepted: true,
        verified: false,
      })
    ).toBe(true);
    expect(
      leadgenTosBlocksPublish({
        status: "accepted",
        accepted: true,
        verified: true,
      })
    ).toBe(false);
    expect(
      leadgenTosBlocksPublish({
        status: "demo",
        demoSafe: true,
        accepted: false,
        verified: false,
      })
    ).toBe(false);
    expect(
      leadgenTosBlocksPublish({
        status: "unavailable",
        accepted: false,
        verified: false,
      })
    ).toBe(false);
  });
});
