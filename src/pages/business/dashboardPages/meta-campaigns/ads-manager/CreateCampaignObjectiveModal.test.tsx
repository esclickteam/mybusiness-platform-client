import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import he from "../../../../../i18n/locales/he.json";
import en from "../../../../../i18n/locales/en.json";
import CreateCampaignObjectiveModal from "./CreateCampaignObjectiveModal";

const localeRef = { current: he as Record<string, unknown> };

function resolveKey(locale: unknown, key: string) {
  return key.split(".").reduce<unknown>(
    (acc, segment) =>
      acc && typeof acc === "object"
        ? (acc as Record<string, unknown>)[segment]
        : undefined,
    locale
  );
}

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const value = resolveKey(localeRef.current, key);
      return typeof value === "string" ? value : key;
    },
    i18n: { language: localeRef.current === en ? "en" : "he" },
  }),
}));

vi.mock("../../../../../hooks/useLocaleDir", () => ({
  useLocaleDir: () => (localeRef.current === en ? "ltr" : "rtl"),
}));

describe("CreateCampaignObjectiveModal i18n", () => {
  it("renders the HE Ads Manager modal in Hebrew with RTL", () => {
    localeRef.current = he as Record<string, unknown>;
    render(
      <CreateCampaignObjectiveModal
        open
        onCancel={() => undefined}
        onContinue={() => undefined}
      />
    );
    const dialog = screen.getByTestId("meta-ads-objective-modal");
    expect(dialog.getAttribute("dir")).toBe("rtl");
    expect(screen.getByText("יצירת קמפיין חדש")).toBeTruthy();
    expect(screen.getByText("יצירת קבוצת מודעות או מודעה")).toBeTruthy();
    expect(screen.getByText("בחר סוג רכישה")).toBeTruthy();
    expect(screen.getByText("מכרז")).toBeTruthy();
    expect(screen.getByText("בחר מטרת קמפיין")).toBeTruthy();
    expect(screen.getByText("מודעות")).toBeTruthy();
    expect(screen.getByText("תנועה")).toBeTruthy();
    expect(screen.getByText("מעורבות")).toBeTruthy();
    expect(screen.getByText("לידים")).toBeTruthy();
    expect(screen.getByText("קידום אפליקציה")).toBeTruthy();
    expect(screen.getByText("מכירות")).toBeTruthy();
    expect(screen.getByText("מידע על מטרות קמפיין")).toBeTruthy();
    expect(screen.getByText("ביטול")).toBeTruthy();
    expect(screen.getByText("המשך")).toBeTruthy();
    expect(screen.queryByText("Create new campaign")).toBeNull();
    expect(screen.queryByText("Awareness")).toBeNull();
    expect(screen.queryByText("OUTCOME_LEADS")).toBeNull();
  });

  it("keeps English copy when language is EN", () => {
    localeRef.current = en as Record<string, unknown>;
    render(
      <CreateCampaignObjectiveModal
        open
        onCancel={() => undefined}
        onContinue={() => undefined}
      />
    );
    const dialog = screen.getByTestId("meta-ads-objective-modal");
    expect(dialog.getAttribute("dir")).toBe("ltr");
    expect(screen.getByText("Create new campaign")).toBeTruthy();
    expect(screen.getByText("Awareness")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Continue")).toBeTruthy();
    expect(screen.queryByText("יצירת קמפיין חדש")).toBeNull();
  });
});
