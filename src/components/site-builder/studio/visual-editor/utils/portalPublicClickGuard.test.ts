import { describe, expect, it } from "vitest";

import {
  clearPortalShellLinkDomAttrs,
  isPortalMountShell,
} from "./portalAuthControls";
import { applyVisualAttributesToDom } from "./visualDomApply";
import { VISUAL_ATTRIBUTE_KEY } from "./visualData";

describe("portal public/editor link guards", () => {
  it("detects portal mount shells", () => {
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-portal-mount", "true");
    shell.setAttribute("data-bizuply-widget", "portal-login");
    expect(isPortalMountShell(shell)).toBe(true);
  });

  it("does not re-apply link attrs from __attributes onto portal shells", () => {
    const root = document.createElement("div");
    const shell = document.createElement("div");
    shell.setAttribute("data-bizuply-portal-mount", "true");
    shell.setAttribute("data-bizuply-widget", "portal-register");
    shell.setAttribute("data-visual-edit-id", "sec-portal-register");
    root.appendChild(shell);
    document.body.appendChild(root);

    applyVisualAttributesToDom(root, {
      [VISUAL_ATTRIBUTE_KEY]: {
        "sec-portal-register": {
          "data-bizuply-portal-mount": "true",
          "data-bizuply-widget": "portal-register",
          "data-visual-link-href": "/account",
          "data-bizuply-public-href": "/account",
          href: "/account",
        },
      },
    });

    expect(shell.getAttribute("data-visual-link-href")).toBeNull();
    expect(shell.getAttribute("data-bizuply-public-href")).toBeNull();
    expect(shell.getAttribute("href")).toBeNull();
    expect(shell.getAttribute("data-bizuply-portal-mount")).toBe("true");

    root.remove();
  });

  it("clears shell link attrs helper", () => {
    const shell = document.createElement("div");
    shell.setAttribute("data-visual-link-href", "/x");
    shell.setAttribute("role", "link");
    clearPortalShellLinkDomAttrs(shell);
    expect(shell.getAttribute("data-visual-link-href")).toBeNull();
    expect(shell.getAttribute("role")).toBeNull();
  });
});
