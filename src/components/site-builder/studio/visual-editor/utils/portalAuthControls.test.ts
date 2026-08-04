import { describe, expect, it } from "vitest";

import {
  buildPortalAuthControlId,
  clearPortalShellLinkDomAttrs,
  isPortalAuthControlId,
  isPortalMountShell,
  parsePortalAuthControlId,
  portalControlPatchForShell,
  stripPortalShellLinkFields,
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
    expect(
      isPortalAuthControlId("sec-portal-login__portal_title"),
    ).toBe(true);
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

    expect(
      portalControlPatchForShell("title", { text: "הרשמה" }),
    ).toEqual({ "data-portal-copy-title": "הרשמה" });
  });

  it("strips harvested link fields from portal shells", () => {
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-portal-mount", "true");
    expect(isPortalMountShell(shell)).toBe(true);

    expect(
      stripPortalShellLinkFields({
        text: "טופס",
        href: "/register",
        target: "_self",
        rel: "noopener",
      }),
    ).toEqual({ text: "טופס" });
  });

  it("clears baked-in link attrs from portal shell DOM", () => {
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-public-href", "/register");
    shell.setAttribute("data-visual-link-href", "/register");
    shell.setAttribute("role", "link");
    shell.setAttribute("tabindex", "0");
    clearPortalShellLinkDomAttrs(shell);
    expect(shell.getAttribute("data-bizuply-public-href")).toBeNull();
    expect(shell.getAttribute("data-visual-link-href")).toBeNull();
    expect(shell.getAttribute("role")).toBeNull();
    expect(shell.getAttribute("tabindex")).toBeNull();
  });
});
