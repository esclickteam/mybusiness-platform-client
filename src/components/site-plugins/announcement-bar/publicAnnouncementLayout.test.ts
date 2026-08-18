import { afterEach, describe, expect, it } from "vitest";

import {
  ANNOUNCEMENT_HEIGHT_VAR,
  applyPublicAnnouncementHeight,
  applyPublicAnnouncementLayout,
  viewportAnnouncementInset,
} from "./publicAnnouncementLayout";

function mountSite(html: string) {
  document.body.innerHTML = `<div data-bizuply-site="true">${html}</div>`;
  return document.querySelector("[data-bizuply-site='true']") as HTMLElement;
}

afterEach(() => {
  applyPublicAnnouncementHeight(0);
  document.body.innerHTML = "";
  document.documentElement.style.removeProperty(ANNOUNCEMENT_HEIGHT_VAR);
});

describe("public announcement layout", () => {
  it("sets a CSS custom property from the measured height", () => {
    applyPublicAnnouncementHeight(52);
    expect(
      document.documentElement.style.getPropertyValue(ANNOUNCEMENT_HEIGHT_VAR)
    ).toBe("52px");
  });

  it("offsets fixed, sticky, and absolute headers without hardcoded pixels", () => {
    const root = mountSite(`
      <header class="abs" style="position:absolute;top:0px"></header>
      <header class="fix" style="position:fixed;top:0px"></header>
      <header class="stick" style="position:sticky;top:0px"></header>
      <header class="static" style="position:static;top:auto"></header>
    `);
    applyPublicAnnouncementHeight(47);
    expect((root.querySelector(".abs") as HTMLElement).style.top).toMatch(/47px/);
    expect((root.querySelector(".fix") as HTMLElement).style.top).toMatch(/47px/);
    expect((root.querySelector(".stick") as HTMLElement).style.top).toMatch(/47px/);
    expect((root.querySelector(".static") as HTMLElement).style.top).not.toMatch(
      /47px/
    );
  });

  it("preserves a non-zero header top such as top-4", () => {
    mountSite(
      `<header class="pad" style="position:fixed;top:16px"></header>`
    );
    applyPublicAnnouncementHeight(40);
    expect(
      (document.querySelector(".pad") as HTMLElement).style.top
    ).toMatch(/56px|16px \+ 40px/);
  });

  it("uses layout height for absolute headers and viewport inset for sticky/fixed", () => {
    const root = mountSite(`
      <header class="abs" style="position:absolute;top:0px"></header>
      <header class="stick" style="position:sticky;top:0px"></header>
    `);
    applyPublicAnnouncementLayout(50, 12);
    expect((root.querySelector(".abs") as HTMLElement).style.top).toMatch(/50px/);
    expect((root.querySelector(".stick") as HTMLElement).style.top).toMatch(/12px/);
  });

  it("treats a bar that has scrolled away as zero inset", () => {
    const bar = document.createElement("div");
    bar.getBoundingClientRect = () =>
      ({ top: -80, bottom: -20, height: 60, width: 300, left: 0, right: 300, x: 0, y: -80, toJSON() {} }) as DOMRect;
    expect(viewportAnnouncementInset(bar)).toBe(0);
  });

  it("restores original header top when height is 0", () => {
    mountSite(
      `<header class="fix" style="position:fixed;top:0px"></header>`
    );
    applyPublicAnnouncementHeight(61);
    applyPublicAnnouncementHeight(0);
    expect((document.querySelector(".fix") as HTMLElement).style.top).toBe(
      "0px"
    );
    expect(
      document.documentElement.style.getPropertyValue(ANNOUNCEMENT_HEIGHT_VAR)
    ).toBe("0px");
  });
});
