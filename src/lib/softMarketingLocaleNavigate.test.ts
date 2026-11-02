import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LOCALE_HOLD_ID,
  SOFT_LOCALE_EVENT,
  captureLocalePaintHold,
  heroMediaReady,
  hideRootForSoftLocale,
  releaseLocalePaintHold,
  releaseLocalePaintHoldWhenReady,
  revealRootAfterSoftLocale,
  setSoftLocaleHandlerInstalled,
  softMarketingLocaleNavigate,
} from "./softMarketingLocaleNavigate";

function mountHero({ withImage = true, complete = true } = {}) {
  const root = document.createElement("div");
  root.id = "root";
  const hero = document.createElement("section");
  hero.className = "hx-hero";
  Object.defineProperty(hero, "getBoundingClientRect", {
    value: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0, toJSON: () => ({}) }),
  });
  if (withImage) {
    const img = document.createElement("img");
    img.className = "hx-hero-shot-1";
    Object.defineProperty(img, "complete", { value: complete });
    Object.defineProperty(img, "naturalWidth", { value: complete ? 1200 : 0 });
    hero.appendChild(img);
  }
  root.appendChild(hero);
  document.body.appendChild(root);
  return { root, hero };
}

describe("softMarketingLocaleNavigate", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.querySelector(`#${LOCALE_HOLD_ID}`)?.remove();
    setSoftLocaleHandlerInstalled(false);
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    releaseLocalePaintHold(document);
    setSoftLocaleHandlerInstalled(false);
  });

  it("captures a fixed paint hold from the live hero", () => {
    mountHero();
    const hold = captureLocalePaintHold(document);
    expect(hold?.id).toBe(LOCALE_HOLD_ID);
    expect(hold?.querySelector(".hx-hero")).toBeTruthy();
    expect(getComputedStyle(hold!).position || hold!.style.position).toBe("fixed");
  });

  it("reports hero media ready only when the product image has decoded", () => {
    mountHero({ complete: false });
    expect(heroMediaReady(document)).toBe(false);
    document.body.innerHTML = "";
    mountHero({ complete: true });
    expect(heroMediaReady(document)).toBe(true);
  });

  it("returns false when SoftLocaleRouter is not installed", () => {
    mountHero();
    expect(softMarketingLocaleNavigate("/he", "he")).toBe(false);
    expect(document.getElementById(LOCALE_HOLD_ID)).toBeNull();
  });

  it("dispatches soft-locale, hides #root, and keeps the paint hold", () => {
    mountHero();
    setSoftLocaleHandlerInstalled(true);
    const paths: string[] = [];
    const onSoft = (event: Event) => {
      paths.push((event as CustomEvent).detail.path);
    };
    window.addEventListener(SOFT_LOCALE_EVENT, onSoft as EventListener);

    expect(softMarketingLocaleNavigate("/he", "he")).toBe(true);
    expect(paths).toEqual(["/he"]);
    expect(document.getElementById(LOCALE_HOLD_ID)).toBeTruthy();
    expect(document.getElementById("root")?.dataset.softLocalePending).toBe("1");
    expect(document.getElementById("root")?.style.visibility).toBe("hidden");

    window.removeEventListener(SOFT_LOCALE_EVENT, onSoft as EventListener);
  });

  it("releases the hold only after remount media is ready", async () => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });
    const { root } = mountHero({ complete: true });
    captureLocalePaintHold(document);
    hideRootForSoftLocale(document);
    // Simulate remount: clear old hero, then mount a ready one on next tick.
    root.innerHTML = "";
    releaseLocalePaintHoldWhenReady(document, 2000);

    // First frames: no hero yet — hold stays.
    vi.advanceTimersToNextFrame();
    expect(document.getElementById(LOCALE_HOLD_ID)).toBeTruthy();

    const hero = document.createElement("section");
    hero.className = "hx-hero";
    Object.defineProperty(hero, "getBoundingClientRect", {
      value: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0, toJSON: () => ({}) }),
    });
    const img = document.createElement("img");
    img.className = "hx-hero-shot-1";
    Object.defineProperty(img, "complete", { value: true });
    Object.defineProperty(img, "naturalWidth", { value: 1200 });
    hero.appendChild(img);
    root.appendChild(hero);

    vi.advanceTimersToNextFrame();
    expect(document.getElementById(LOCALE_HOLD_ID)).toBeNull();
    expect(root.style.visibility).toBe("");
    expect(root.dataset.softLocalePending).toBeUndefined();
    vi.useRealTimers();
  });

  it("revealRootAfterSoftLocale clears the pending hide", () => {
    const { root } = mountHero();
    hideRootForSoftLocale(document);
    expect(root.style.visibility).toBe("hidden");
    revealRootAfterSoftLocale(document);
    expect(root.style.visibility).toBe("");
  });
});
