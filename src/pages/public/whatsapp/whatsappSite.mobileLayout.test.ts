import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8").replace(/\r\n/g, "\n");
const css = read("src/pages/public/whatsapp/whatsappSite.css");
const widgetCss = read("src/components/site-plugins/accessibility/AccessibilityWidget.css");

function mobileRule(source: string, selector: string) {
  const media = source.match(/@media \(max-width: 520px\) \{([\s\S]*?)\n\}/)?.[1] ?? "";
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return media.match(new RegExp(`\\n\\s*${escaped} \\{([^}]*)\\}`))?.[1] ?? "";
}

describe("WhatsApp API login footer on a 390px phone", () => {
  it("keeps the footer links horizontally clear of the floating buttons in both bottom corners", () => {
    const rule = mobileRule(css, ".wa-login-footer");
    const [, , inline, bottom] = rule.match(/padding:\s*(\d+)px\s+(\d+)px\s+(\d+)px/) ?? [];
    expect(Number(inline), "footer inline padding").toBeGreaterThanOrEqual(72);
    expect(Number(bottom), "footer bottom padding").toBeGreaterThanOrEqual(80);

    // Accessibility button on phones: 16px inset + 50px wide = 66px from the edge.
    expect(widgetCss).toMatch(/\.bizuply-a11y-trigger \{\s*width: 50px;/);
    expect(widgetCss).toMatch(/\.bizuply-a11y-trigger--left \{\s*left: 1rem;/);
    expect(Number(inline)).toBeGreaterThan(16 + 50);

    // Room left for links at 390px still fits the longest Hebrew link on one line.
    expect(390 - Number(inline) * 2).toBeGreaterThanOrEqual(200);
  });

  it("lets footer links wrap instead of overflowing", () => {
    const base = css.match(/\n\.wa-login-footer \{([^}]*)\}/)?.[1] ?? "";
    expect(base).toMatch(/flex-wrap:\s*wrap/);
    expect(base).not.toMatch(/white-space:\s*nowrap/);
  });
});
