import { describe, expect, it } from "vitest";

import {
  buildPortalAuthControlId,
  isPortalAuthControlId,
  parsePortalAuthControlId,
  portalControlPatchForShell,
} from "./portalAuthControls";

describe("portalAuthControls", () => {
  it("builds and parses control ids", () => {
    const id = buildPortalAuthControlId("sec-portal-login", "switch");
    expect(id).toBe("sec-portal-login__portal_switch");
    expect(isPortalAuthControlId(id)).toBe(true);
    expect(parsePortalAuthControlId(id)).toEqual({
      shellId: "sec-portal-login",
      kind: "switch",
    });
  });

  it("maps text/href edits onto durable shell attributes", () => {
    expect(
      portalControlPatchForShell("submit", {
        text: "כניסה",
        href: "/ignored",
      }),
    ).toEqual({ "data-portal-copy-submit": "כניסה" });

    expect(
      portalControlPatchForShell("switch", {
        text: "להרשמה",
        href: "/register",
      }),
    ).toEqual({
      "data-portal-copy-switch": "להרשמה",
      "data-portal-link-switch": "/register",
    });

    expect(
      portalControlPatchForShell("forgot", { href: "/forgot" }),
    ).toEqual({ "data-portal-link-forgot": "/forgot" });
  });
});
