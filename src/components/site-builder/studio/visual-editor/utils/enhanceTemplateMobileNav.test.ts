import { afterEach, describe, expect, it } from "vitest";

import {
  detectDesktopNav,
  enhanceTemplateMobileNav,
  headerNeedsCompactNav,
  headerRowOverflows,
} from "./enhanceTemplateMobileNav";

afterEach(() => {
  document.body.innerHTML = "";
  document.getElementById("bizuply-template-mobile-nav-styles")?.remove();
});

describe("enhanceTemplateMobileNav", () => {
  it("detects hidden md/lg/xl flex desktop navs", () => {
    document.body.innerHTML = `
      <header>
        <nav class="hidden md:flex">שירותים</nav>
      </header>
    `;
    const header = document.querySelector("header") as HTMLElement;
    expect(detectDesktopNav(header)?.bp).toBe("md");
    header.innerHTML = `<nav class="hidden lg:flex">About</nav>`;
    expect(detectDesktopNav(header)?.bp).toBe("lg");
    header.innerHTML = `<nav class="hidden xl:flex">Shop</nav>`;
    expect(detectDesktopNav(header)?.bp).toBe("xl");
  });

  it("injects a hamburger for templates that hide desktop nav without a toggle", () => {
    document.body.innerHTML = `
      <div data-template-id="ido">
        <header>
          <div>
            <a>SOCIAL STUDIO</a>
            <nav class="hidden md:flex"><a>שירותים</a><a>אודות</a></nav>
            <a>קביעת שיחה</a>
          </div>
        </header>
      </div>
    `;
    const root = document.querySelector("[data-template-id='ido']") as HTMLElement;
    enhanceTemplateMobileNav(root);
    const header = root.querySelector("header") as HTMLElement;
    expect(header.getAttribute("data-bizuply-mobile-nav")).toBe("on");
    expect(header.querySelector("[data-bizuply-mobile-toggle='true']")).toBeTruthy();
    expect(header.querySelector("nav")?.getAttribute("data-bizuply-desktop-nav")).toBe(
      "true"
    );
  });

  it("does not inject a second hamburger when a native icon toggle exists", () => {
    document.body.innerHTML = `
      <div data-template-id="scentora">
        <header>
          <div>
            <nav class="hidden xl:flex"><button>Shop</button></nav>
            <button class="inline-flex h-10 w-10 items-center justify-center xl:hidden" aria-label="menu">
              <span class="flex w-4 flex-col gap-1">
                <span class="h-0.5"></span>
                <span class="h-0.5"></span>
                <span class="h-0.5"></span>
              </span>
            </button>
          </div>
        </header>
      </div>
    `;
    const root = document.querySelector("[data-template-id='scentora']") as HTMLElement;
    enhanceTemplateMobileNav(root);
    const header = root.querySelector("header") as HTMLElement;
    expect(header.getAttribute("data-bizuply-mobile-nav")).toBe("native");
    expect(header.querySelector("[data-bizuply-mobile-toggle='true']")).toBeNull();
  });

  it("toggles the injected menu open and closed", () => {
    document.body.innerHTML = `
      <div data-visual-template-canvas="true">
        <header>
          <div>
            <nav class="hidden lg:flex"><a href="#a">A</a></nav>
          </div>
        </header>
      </div>
    `;
    const root = document.querySelector("[data-visual-template-canvas]") as HTMLElement;
    enhanceTemplateMobileNav(root);
    const header = root.querySelector("header") as HTMLElement;
    const toggle = header.querySelector(
      "[data-bizuply-mobile-toggle='true']"
    ) as HTMLButtonElement;
    toggle.click();
    expect(header.classList.contains("bizuply-mobile-nav-open")).toBe(true);
    toggle.click();
    expect(header.classList.contains("bizuply-mobile-nav-open")).toBe(false);
  });

  it("uses compact nav when the header is narrower than the template breakpoint", () => {
    document.body.innerHTML = `
      <header data-bizuply-mobile-nav="on" data-bizuply-nav-bp="lg">
        <div style="width:900px">
          <nav class="hidden lg:flex" data-bizuply-desktop-nav="true"><a>A</a></nav>
        </div>
      </header>
    `;
    const header = document.querySelector("header") as HTMLElement;
    const row = header.querySelector("div") as HTMLElement;
    row.getBoundingClientRect = () =>
      ({ width: 900, height: 64, top: 0, left: 0, bottom: 64, right: 900, x: 0, y: 0, toJSON() {} });
    expect(headerNeedsCompactNav(header)).toBe(true);
    row.getBoundingClientRect = () =>
      ({ width: 1280, height: 64, top: 0, left: 0, bottom: 64, right: 1280, x: 0, y: 0, toJSON() {} });
    expect(headerNeedsCompactNav(header)).toBe(false);
  });

  it("marks overflow from intrinsic chrome widths, not crushed scrollWidth", () => {
    const header = document.createElement("header");
    const row = document.createElement("div");
    row.style.display = "flex";
    Object.defineProperty(row, "clientWidth", { value: 400, configurable: true });
    const logo = document.createElement("a");
    const nav = document.createElement("nav");
    const link = document.createElement("a");
    const cta = document.createElement("a");
    nav.appendChild(link);
    row.append(logo, nav, cta);
    header.appendChild(row);
    [
      [logo, 180],
      [link, 220],
      [cta, 140],
    ].forEach(([el, w]) => {
      const node = el as HTMLElement;
      Object.defineProperty(node, "scrollWidth", { value: w, configurable: true });
      node.getBoundingClientRect = () =>
        ({ width: Number(w), height: 20, top: 0, left: 0, bottom: 20, right: Number(w), x: 0, y: 0, toJSON() {} });
    });
    expect(headerRowOverflows(header)).toBe(true);
    Object.defineProperty(row, "clientWidth", { value: 900, configurable: true });
    expect(headerRowOverflows(header)).toBe(false);
  });
});
