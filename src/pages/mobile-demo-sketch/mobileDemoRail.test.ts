import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { MOBILE_DEMO_DURATION, MOBILE_DEMO_RAIL, MOBILE_DEMO_SCENES, sceneAt } from "./mobileDemoRail";

describe("mobile demo sketch rail", () => {
  it("follows the requested sidebar order and uses icons from the real nav", () => {
    expect(MOBILE_DEMO_RAIL.map((item) => item.en)).toEqual([
      "Business",
      "Website",
      "CRM System",
      "Automations",
      "WhatsApp API",
      "Meta Campaigns",
      "Collaborations",
      "Business Advisor",
      "Edit Business Page",
      "View Public Profile",
      "Build Website",
    ]);
    const nav = readFileSync(path.join(process.cwd(), "src/components/BusinessWorkspaceNav.tsx"), "utf8");
    for (const item of MOBILE_DEMO_RAIL) {
      expect(nav, item.icon).toContain(item.icon);
    }
    expect(new Set(MOBILE_DEMO_RAIL.map((item) => item.icon)).size).toBe(MOBILE_DEMO_RAIL.length);
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
    expect(sceneAt(0).scene.rail).toBe("business");
    expect(sceneAt(2.5).scene.id).toBe("crm");
    expect(sceneAt(5).scene.id).toBe("whatsapp");
    expect(sceneAt(7.5).scene.id).toBe("task");
    expect(sceneAt(10).scene.id).toBe("meeting");
    expect(sceneAt(12.6).scene.id).toBe("automations");
    expect(sceneAt(12.6).local).toBeGreaterThan(0);
    expect(sceneAt(12.6).local).toBeLessThan(1);
  });
});
