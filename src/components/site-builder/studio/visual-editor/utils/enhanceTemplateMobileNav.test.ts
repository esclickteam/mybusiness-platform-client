import { afterEach, describe, expect, it } from "vitest";

import {
  detectDesktopNav,
  enhanceTemplateMobileNav,
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

  it("marks overflow when the header row is narrower than its contents", () => {
    const header = document.createElement("header");
    const row = document.createElement("div");
    Object.defineProperty(row, "scrollWidth", { value: 900, configurable: true });
    Object.defineProperty(row, "clientWidth", { value: 640, configurable: true });
    header.appendChild(row);
    expect(headerRowOverflows(header)).toBe(true);
    Object.defineProperty(row, "scrollWidth", { value: 640, configurable: true });
    expect(headerRowOverflows(header)).toBe(false);
  });
});
