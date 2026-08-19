import { describe, expect, it } from "vitest";
import {
  approvedNeedLabelFromCatalog,
  canSubmitSendDemo,
  demoContentSummary,
  isValidDemoPhone,
  orderedPresets,
  payloadFingerprint,
  resolveSelectedKeys,
  sourcePhoneForPrefill,
} from "./adminSendForm";

const catalog = {
  modules: [
    { key: "crm", title: "CRM", interactive: true },
    { key: "website-builder", title: "בניית אתר", interactive: true },
    { key: "automations", title: "אוטומציות", interactive: true },
    {
      key: "email",
      title: "אימייל",
      interactive: false,
      simulationReason: "הסבר בלבד",
    },
  ],
  presets: [
    { key: "custom", title: "בחירה מותאמת אישית", moduleKeys: [] },
    { key: "full", title: "דמו מלא", moduleKeys: ["crm", "website-builder", "automations", "email"] },
    { key: "crm-only", title: "CRM", moduleKeys: ["crm"] },
    { key: "website-only", title: "בניית אתר", moduleKeys: ["website-builder"] },
    { key: "automations-only", title: "אוטומציות", moduleKeys: ["automations"] },
  ],
};

describe("admin send demo form", () => {
  it("prefills a real phone and treats missing CRM phone as empty", () => {
    expect(sourcePhoneForPrefill("0501234567")).toBe("0501234567");
    expect(sourcePhoneForPrefill("לא צוין")).toBe("");
    expect(sourcePhoneForPrefill("")).toBe("");
  });

  it("keeps destination phone independent from the CRM source snapshot", () => {
    const crmPhone = "0501234567";
    let destination = sourcePhoneForPrefill(crmPhone);
    destination = "0529999999";
    expect(destination).toBe("0529999999");
    expect(crmPhone).toBe("0501234567");
  });

  it("accepts the required Israeli phone formats", () => {
    for (const value of ["0501234567", "050-1234567", "+972501234567", "972501234567"]) {
      expect(isValidDemoPhone(value)).toBe(true);
    }
    expect(isValidDemoPhone("123")).toBe(false);
    expect(isValidDemoPhone("")).toBe(false);
  });

  it("loads presets from the catalog, not a hardcoded second list", () => {
    expect(orderedPresets(catalog).map((p) => p.key)).toEqual([
      "full",
      "crm-only",
      "website-only",
      "automations-only",
      "custom",
    ]);
  });

  it("resolves CRM / website / automations / full / custom selections from the catalog", () => {
    expect(resolveSelectedKeys({ catalog, presetKey: "crm-only", moduleKeys: [] })).toEqual(["crm"]);
    expect(resolveSelectedKeys({ catalog, presetKey: "website-only", moduleKeys: [] })).toEqual([
      "website-builder",
    ]);
    expect(resolveSelectedKeys({ catalog, presetKey: "automations-only", moduleKeys: [] })).toEqual([
      "automations",
    ]);
    expect(resolveSelectedKeys({ catalog, presetKey: "full", moduleKeys: [] })).toHaveLength(4);
    expect(
      resolveSelectedKeys({
        catalog,
        presetKey: "custom",
        moduleKeys: ["crm", "email", "bogus"],
      })
    ).toEqual(["crm", "email"]);
  });

  it("blocks send until a valid phone and at least one module exist", () => {
    expect(
      canSubmitSendDemo({ customerName: "ישראל", phone: "0501234567", selectedKeys: [] })
    ).toBe(false);
    expect(
      canSubmitSendDemo({ customerName: "ישראל", phone: "123", selectedKeys: ["crm"] })
    ).toBe(false);
    expect(
      canSubmitSendDemo({ customerName: "", phone: "0501234567", selectedKeys: ["crm"] })
    ).toBe(false);
    expect(
      canSubmitSendDemo({ customerName: "ישראל", phone: "0501234567", selectedKeys: ["crm"] })
    ).toBe(true);
  });

  it("summarizes full demo vs selected modules", () => {
    expect(
      demoContentSummary({
        catalog,
        presetKey: "full",
        selectedKeys: ["crm", "website-builder", "automations", "email"],
      })
    ).toBe("דמו מלא — 4 מודולים");
    expect(
      demoContentSummary({
        catalog,
        presetKey: "custom",
        selectedKeys: ["crm", "automations", "website-builder"],
      })
    ).toBe("CRM · בניית אתר · אוטומציות");
  });

  it("maps an approved need label only from catalog titles", () => {
    expect(
      approvedNeedLabelFromCatalog({ catalog, candidates: ["CRM", "something invented"] })
    ).toBe("CRM");
    expect(
      approvedNeedLabelFromCatalog({ catalog, candidates: ["AI will invent this"] })
    ).toBe("");
  });

  it("retries the same invitation when destination content did not change", () => {
    const first = payloadFingerprint({
      customerPhone: "0501234567",
      presetKey: "crm-only",
      moduleKeys: ["crm"],
    });
    const same = payloadFingerprint({
      customerPhone: "0501234567",
      presetKey: "crm-only",
      moduleKeys: ["crm"],
    });
    const changed = payloadFingerprint({
      customerPhone: "0520000000",
      presetKey: "crm-only",
      moduleKeys: ["crm"],
    });
    expect(first).toBe(same);
    expect(first).not.toBe(changed);
  });
});
