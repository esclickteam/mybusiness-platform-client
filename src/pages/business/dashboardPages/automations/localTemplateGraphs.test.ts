import { describe, expect, it } from "vitest";
import {
  LOCAL_REMINDER_TEMPLATES,
  buildReminderAutomationGraph,
} from "./localTemplateGraphs";

describe("local reminder template graphs", () => {
  it("builds trigger → WhatsApp result with hoursBefore", () => {
    for (const template of LOCAL_REMINDER_TEMPLATES) {
      const { nodes, edges } = buildReminderAutomationGraph(template);
      expect(nodes).toHaveLength(2);
      expect(nodes[0].type).toBe("trigger");
      expect(nodes[0].data.triggerKey).toBe("appointment_reminder");
      expect(nodes[0].data.hoursBefore).toBe(template.hoursBefore);
      expect(nodes[1].type).toBe("action");
      expect(nodes[1].data.actionKey).toBe("whatsapp_template");
      expect(edges).toHaveLength(1);
      expect(edges[0].sourceHandle).toBe("route_1");
      expect(edges[0].label).toBe("תוצאה");
    }
  });

  it("includes 1-day and 2-day reminder templates", () => {
    expect(
      LOCAL_REMINDER_TEMPLATES.some((t) => t.hoursBefore === 24)
    ).toBe(true);
    expect(
      LOCAL_REMINDER_TEMPLATES.some((t) => t.hoursBefore === 48)
    ).toBe(true);
  });
});
