import { describe, expect, it } from "vitest";
import { clearHomeDocumentPaint, isHomePaintPath } from "./clearHomeDocumentPaint";

describe("clearHomeDocumentPaint", () => {
  it("recognizes only public home paint routes", () => {
    expect(isHomePaintPath("/")).toBe(true);
    expect(isHomePaintPath("/home-preview")).toBe(true);
    expect(isHomePaintPath("/login")).toBe(false);
    expect(isHomePaintPath("/business/x/dashboard/dashboard")).toBe(false);
    expect(isHomePaintPath("/crm")).toBe(false);
  });

  it("removes purple home document chrome left after SPA navigation", () => {
    document.documentElement.className = "bizuply-home hx-preview";
    document.documentElement.setAttribute(
      "style",
      "background:#5b21b6; --bizuply-a11y-font-scale: 1;",
    );
    document.body.style.background = "rgb(91, 33, 182)";
    const root = document.createElement("div");
    root.id = "root";
    root.setAttribute("hidden", "");
    document.body.appendChild(root);
    const paint = document.createElement("div");
    paint.id = "bizuply-first-paint";
    document.body.appendChild(paint);

    clearHomeDocumentPaint(document);

    expect(document.documentElement.classList.contains("bizuply-home")).toBe(false);
    expect(document.documentElement.classList.contains("hx-preview")).toBe(false);
    expect(document.documentElement.getAttribute("style") || "").not.toMatch(/5b21b6/i);
    expect(document.documentElement.getAttribute("style") || "").toMatch(
      /--bizuply-a11y-font-scale/,
    );
    expect(document.body.style.background).toBe("");
    expect(document.getElementById("bizuply-first-paint")).toBeNull();
    expect(root.hasAttribute("hidden")).toBe(false);

    root.remove();
  });
});
