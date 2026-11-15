import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MOBILE_DEMO_DURATION, MOBILE_DEMO_RAIL, MOBILE_DEMO_SCENES, sceneAt } from "./mobileDemoRail";

describe("mobile demo sketch rail", () => {
  it("follows the requested sidebar order and uses icons from the real nav", () => {
    const nav = readFileSync(path.join(process.cwd(), "src/components/BusinessWorkspaceNav.tsx"), "utf8");
    const itemsStart = nav.indexOf("const items: NavItemConfig[]");
    const itemsEnd = nav.indexOf("const whatsappBase", itemsStart);
    const items = nav.slice(itemsStart, itemsEnd);
    const found = [...items.matchAll(/labelKey: "businessNav\.([^"]+)"[\s\S]{0,500}?icon: (\w+)/g)].map((match) => ({
      key: match[1],
      icon: match[2],
    }));
    const skipped = new Set(["mySaas", "saasBridge", "globalBusinessClub"]);
    const live = found.filter((item) => !skipped.has(item.key));
    expect(MOBILE_DEMO_RAIL.map((item) => item.icon)).toEqual(live.map((item) => item.icon));
    expect(MOBILE_DEMO_RAIL.map((item) => item.en)).not.toContain("Website");
  });

  it("plays the sample story in order over 15 seconds", () => {
    expect(MOBILE_DEMO_DURATION).toBe(15);
    expect(MOBILE_DEMO_SCENES.map((scene) => scene.id)).toEqual([
      "lead",
      "crm",
      "whatsapp",
      "task",
      "meeting",
      "automations",
    ]);
    expect(sceneAt(0).scene.rail).toBe("dashboard");
    expect(sceneAt(2.5).scene.id).toBe("crm");
    expect(sceneAt(5).scene.id).toBe("whatsapp");
    expect(sceneAt(7.5).scene.id).toBe("task");
    expect(sceneAt(10).scene.id).toBe("meeting");
    expect(sceneAt(12.6).scene.id).toBe("automations");
    expect(sceneAt(12.6).local).toBeGreaterThan(0);
    expect(sceneAt(12.6).local).toBeLessThan(1);
  });
});
