import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../../../i18n/i18n";
import AdsManagerDetailedTargetingSection, {
  __resetDetailedTargetingBrowseCacheForTests,
} from "./AdsManagerDetailedTargetingSection";
import type { AdSetDetailedTarget } from "../adsManagerTypes";

const FIXTURE = [
  {
    id: "6002714398399",
    name: "Small business",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Business and industry", "Small business"],
    audienceSize: 420000000,
  },
  {
    id: "",
    name: "Business and industry",
    type: "interests",
    branch: "interests",
    selectable: false,
    unsupportedReason: "category",
    path: ["Interests", "Business and industry"],
  },
  {
    id: "6002714895372",
    name: "Engaged shoppers",
    type: "behaviors",
    branch: "behaviors",
    selectable: true,
    path: ["Behaviors", "Purchase behavior", "Engaged shoppers"],
  },
  {
    id: "",
    name: "Purchase behavior",
    type: "behaviors",
    branch: "behaviors",
    selectable: false,
    unsupportedReason: "category",
    path: ["Behaviors", "Purchase behavior"],
  },
  {
    id: "",
    name: "College years",
    type: "college_years",
    branch: "demographics",
    selectable: false,
    unsupportedReason: "category_not_selectable",
    path: ["Demographics", "Education", "College years"],
  },
  {
    id: "999001",
    name: "Legacy demographic cluster",
    type: "demographics",
    branch: "demographics",
    selectable: false,
    unsupportedReason: "unsupported_flexible_spec",
    path: ["Demographics", "Other", "Legacy demographic cluster"],
  },
];

describe("AdsManagerDetailedTargetingSection", () => {
  beforeEach(() => {
    __resetDetailedTargetingBrowseCacheForTests();
  });

  it("opens browse, selects multiple Meta targets, and removes one", async () => {
    await i18n.changeLanguage("en");
    const onChange = vi.fn();
    let selected: AdSetDetailedTarget[] = [];
    const browseFn = vi.fn(async () => ({ success: true, results: FIXTURE }));
    const searchFn = vi.fn(async () => ({
      success: true,
      results: FIXTURE.filter((row) => row.selectable),
    }));

    const { rerender } = render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={selected}
          onChange={(next) => {
            selected = next;
            onChange(next);
          }}
          browseFn={browseFn as never}
          searchFn={searchFn as never}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /browse/i }));
    await waitFor(() => expect(browseFn).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: /interests/i }));
    fireEvent.click(screen.getByRole("button", { name: /Business and industry/i }));
    fireEvent.click(screen.getByRole("button", { name: /Small business/i }));

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(selected[0]?.id).toBe("6002714398399");
    expect(selected[0]?.type).toBe("interests");

    rerender(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={selected}
          onChange={(next) => {
            selected = next;
            onChange(next);
          }}
          browseFn={browseFn as never}
          searchFn={searchFn as never}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /behaviors/i }));
    fireEvent.click(screen.getByRole("button", { name: /Purchase behavior/i }));
    fireEvent.click(screen.getByRole("button", { name: /Engaged shoppers/i }));

    await waitFor(() => expect(selected.length).toBe(2));
    expect(selected.map((row) => row.type).sort()).toEqual([
      "behaviors",
      "interests",
    ]);

    rerender(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={selected}
          onChange={(next) => {
            selected = next;
            onChange(next);
          }}
          browseFn={browseFn as never}
          searchFn={searchFn as never}
        />
      </I18nextProvider>
    );

    fireEvent.click(
      screen.getByLabelText(new RegExp(`remove:.*${selected[0].name}`, "i"))
    );
    await waitFor(() => expect(selected.length).toBe(1));
  });

  it("keeps the browse panel open after clicking עיון / Browse", async () => {
    await i18n.changeLanguage("he");
    const browseFn = vi.fn(async () => ({ success: true, results: FIXTURE }));
    render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={[]}
          onChange={() => {}}
          browseFn={browseFn as never}
          searchFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId("detailed-targeting-browse"));
    await waitFor(() => expect(browseFn).toHaveBeenCalled());
    expect(screen.getByTestId("detailed-targeting-panel")).toBeTruthy();
    expect(screen.getByRole("button", { name: /דמוגרפיה|Demographics/i })).toBeTruthy();
    // Document click outside should close; click inside must not.
    fireEvent.click(screen.getByTestId("detailed-targeting-panel"));
    expect(screen.getByTestId("detailed-targeting-panel")).toBeTruthy();
  });

  it("restores browse panel after a full remount (dashboard loader swap)", async () => {
    await i18n.changeLanguage("he");
    const browseFn = vi.fn(async () => ({ success: true, results: FIXTURE }));
    const view = render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={[]}
          onChange={() => {}}
          browseFn={browseFn as never}
          searchFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId("detailed-targeting-browse"));
    await waitFor(() => expect(browseFn).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId("detailed-targeting-panel")).toBeTruthy();

    view.unmount();
    render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={[]}
          onChange={() => {}}
          browseFn={browseFn as never}
          searchFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    expect(screen.getByTestId("detailed-targeting-browse").getAttribute("aria-expanded")).toBe(
      "true"
    );
    expect(screen.getByTestId("detailed-targeting-panel")).toBeTruthy();
    expect(screen.getByRole("button", { name: /דמוגרפיה|Demographics/i })).toBeTruthy();
    // Cache hit — no second Meta browse call.
    expect(browseFn).toHaveBeenCalledTimes(1);
  });

  it("shows why unsupported Meta types cannot be selected", async () => {
    await i18n.changeLanguage("en");
    const browseFn = vi.fn(async () => ({ success: true, results: FIXTURE }));
    render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={[]}
          onChange={() => {}}
          browseFn={browseFn as never}
          searchFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /browse/i }));
    await waitFor(() => expect(browseFn).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: /demographics/i }));
    fireEvent.click(screen.getByRole("button", { name: /Other/i }));
    expect(
      screen.getByText(/not supported for Meta flexible_spec/i)
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Education/i }));
    expect(screen.getByText(/browse category only/i)).toBeTruthy();
  });
});
