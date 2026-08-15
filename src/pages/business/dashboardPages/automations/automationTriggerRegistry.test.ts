import { describe, expect, it, beforeEach } from "vitest";
import {
  buildPaletteWithTriggers,
  buildTriggerPaletteItems,
  findTriggerOption,
  nodeSummary,
  triggerOptionFromCatalog,
  type AutomationTriggerOption,
} from "./automationFlowTypes";
import {
  groupTriggerItems,
  readRecentTriggerKeys,
  rememberRecentTriggerKey,
  triggerMatchesQuery,
} from "./automation-builder/triggerPickerUtils";

const SUPPORTED: AutomationTriggerOption[] = [
  {
    key: "new_lead",
    label: "ליד חדש ב־CRM",
    description: "כשליד חדש נכנס ל־CRM",
    category: "crm",
    isSupported: true,
    isPublishable: true,
    keywords: ["ליד", "CRM"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "lead_status_changed",
    label: "שינוי סטטוס ליד",
    description: "כשמעדכנים סטטוס של ליד",
    category: "crm",
    isSupported: true,
    isPublishable: true,
    keywords: ["סטטוס"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "appointment_created",
    label: "נקבעה פגישה",
    description: "כשקובעים פגישה ביומן",
    category: "appointments",
    isSupported: true,
    isPublishable: true,
    keywords: ["פגישה"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "appointment_cancelled",
    label: "פגישה בוטלה",
    description: "כשפגישה מבוטלת",
    category: "appointments",
    isSupported: true,
    isPublishable: true,
    keywords: ["ביטול"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "appointment_reminder",
    label: "תזכורת לפני פגישה",
    description: "לפני מועד הפגישה",
    category: "appointments",
    isSupported: true,
    isPublishable: true,
    keywords: ["תזכורת"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "form_submitted",
    label: "טופס נשלח באתר",
    description: "כשנשלח טופס מהאתר",
    category: "website",
    isSupported: true,
    isPublishable: true,
    keywords: ["טופס"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "order_created",
    label: "נוצרה הזמנה",
    description: "כשנוצרת הזמנה בחנות",
    category: "store",
    isSupported: true,
    isPublishable: true,
    keywords: ["הזמנה"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "store_order_paid",
    label: "התקבלה הזמנה בחנות",
    description: "כשהזמנה בחנות שולמה בהצלחה",
    category: "store",
    isSupported: true,
    isPublishable: true,
    keywords: ["הזמנה", "חנות"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "manual",
    label: "הפעלה ידנית",
    description: "הפעלה ידנית של האוטומציה",
    category: "manual",
    isSupported: true,
    isPublishable: true,
    keywords: ["ידני"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
  {
    key: "scheduled",
    label: "לפי לוח זמנים",
    description: "הפעלה חוזרת",
    category: "schedule",
    isSupported: true,
    isPublishable: true,
    keywords: ["זמן", "תזמון"],
    billingNote: "ללא חיוב",
    triggerBillable: false,
  },
];

describe("automation trigger registry client", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hides unsupported / coming-soon catalog rows", () => {
    expect(
      triggerOptionFromCatalog({
        key: "whatsapp_received",
        label: "whatsapp",
        isSupported: false,
        isPublishable: false,
      })
    ).toBeNull();
    expect(
      triggerOptionFromCatalog({
        key: "lead_no_response",
        label: "no response",
        isSupported: true,
        isPublishable: false,
      })
    ).toBeNull();
  });

  it("builds palette only from publishable triggers", () => {
    const items = buildTriggerPaletteItems(SUPPORTED);
    expect(items.every((item) => item.supported !== false)).toBe(true);
    expect(items.some((item) => item.key === "appointment_cancelled")).toBe(true);
    expect(items.some((item) => item.label.startsWith("טריגר ·"))).toBe(false);
  });

  it("new catalog triggers start with one parallel result", () => {
    const items = buildTriggerPaletteItems(SUPPORTED);
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.defaults.routeCount).toBe(1);
    }
    const newLead = items.find((item) => item.key === "new_lead");
    expect(newLead?.defaults.routeCount).toBe(1);
  });

  it("full palette includes only supported triggers", () => {
    const palette = buildPaletteWithTriggers(SUPPORTED);
    const triggers = palette.filter((item) => item.filter === "trigger");
    expect(triggers.map((item) => item.key).sort()).toEqual(
      SUPPORTED.map((row) => row.key).sort()
    );
  });

  it("picker search matches title, category and keywords", () => {
    const item = buildTriggerPaletteItems(SUPPORTED).find(
      (row) => row.key === "new_lead"
    )!;
    const option = findTriggerOption(SUPPORTED, "new_lead");
    expect(triggerMatchesQuery(item, option, "ליד")).toBe(true);
    expect(triggerMatchesQuery(item, option, "CRM")).toBe(true);
    expect(triggerMatchesQuery(item, option, "וואטסאפ")).toBe(false);
  });

  it("groups categories and only keeps real recent history", () => {
    expect(readRecentTriggerKeys()).toEqual([]);
    const emptyGroups = groupTriggerItems(
      buildTriggerPaletteItems(SUPPORTED),
      SUPPORTED,
      []
    );
    expect(emptyGroups.some((group) => group.id === "recent")).toBe(false);
    expect(emptyGroups.some((group) => group.id === "common")).toBe(true);
    expect(emptyGroups.some((group) => group.id === "crm")).toBe(true);

    rememberRecentTriggerKey("new_lead");
    expect(readRecentTriggerKeys()).toEqual(["new_lead"]);
    const withRecent = groupTriggerItems(
      buildTriggerPaletteItems(SUPPORTED),
      SUPPORTED,
      readRecentTriggerKeys()
    );
    expect(withRecent[0]?.id).toBe("recent");
  });

  it("node summary for triggers avoids duplicating the title", () => {
    expect(
      nodeSummary(
        { triggerKey: "new_lead", label: "ליד חדש ב־CRM" },
        "trigger"
      )
    ).toBe("מופעל בכל יצירת ליד חדש");
    expect(
      nodeSummary(
        {
          triggerKey: "lead_status_changed",
          label: "שינוי סטטוס ליד",
          toStatus: "contacted",
        },
        "trigger"
      )
    ).toMatch(/contacted/);
    expect(
      nodeSummary(
        { triggerKey: "appointment_reminder", hoursBefore: 24 },
        "trigger"
      )
    ).toBe("יום לפני הפגישה");
  });

  it("does not import MiniMap in AutomationFlowEditor", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const file = path.resolve(__dirname, "./AutomationFlowEditor.tsx");
    const source = fs.readFileSync(file, "utf8");
    expect(source).not.toMatch(/\bMiniMap\b/);
  });
});