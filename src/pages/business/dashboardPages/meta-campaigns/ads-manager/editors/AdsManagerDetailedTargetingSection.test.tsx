import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../../../../i18n/i18n";
import AdsManagerDetailedTargetingSection, {
  __resetDetailedTargetingBrowseCacheForTests,
} from "./AdsManagerDetailedTargetingSection";
import type { AdSetDetailedTarget } from "../adsManagerTypes";

/** Meta-shaped rows: `path` is parent chain; `name` is this node. */
const FIXTURE = [
  {
    id: "",
    name: "__ROOT__",
    type: "interests",
    branch: "interests",
    selectable: false,
    path: [],
  },
  {
    id: "",
    name: "Business and industry",
    type: "interests",
    branch: "interests",
    selectable: false,
    unsupportedReason: "category",
    path: ["Interests"],
  },
  {
    id: "",
    name: "Banking (finance)",
    type: "interests",
    branch: "interests",
    selectable: false,
    unsupportedReason: "category",
    path: ["Interests", "Business and industry"],
  },
  {
    id: "6003063638807",
    name: "Investment banking",
    type: "interests",
    branch: "interests",
    selectable: true,
    // Parent path ends at Banking — name is the leaf (live Meta shape).
    path: ["Interests", "Business and industry", "Banking (finance)"],
    audienceSize: 120000000,
  },
  {
    id: "6003062205328",
    name: "Retail banking",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Business and industry", "Banking (finance)"],
    audienceSize: 209000000,
  },
  {
    id: "6002714398399",
    name: "Small business",
    type: "interests",
    branch: "interests",
    selectable: true,
    path: ["Interests", "Business and industry"],
    audienceSize: 420000000,
  },
  {
    id: "6002714895372",
    name: "Engaged shoppers",
    type: "behaviors",
    branch: "behaviors",
    selectable: true,
    path: ["Behaviors", "Purchase behavior"],
  },
  {
    id: "",
    name: "Purchase behavior",
    type: "behaviors",
    branch: "behaviors",
    selectable: false,
    unsupportedReason: "category",
    path: ["Behaviors"],
  },
  {
    id: "",
    name: "College years",
    type: "college_years",
    branch: "demographics",
    selectable: false,
    unsupportedReason: "category_not_selectable",
    path: ["Demographics", "Education"],
  },
  {
    id: "999001",
    name: "Legacy demographic cluster",
    type: "demographics",
    branch: "demographics",
    selectable: false,
    unsupportedReason: "unsupported_flexible_spec",
    path: ["Demographics", "Other"],
  },
];

const SUGGESTIONS = [
  {
    id: "6003139266461",
    name: "Beauty",
    type: "interests",
    branch: "interests",
    selectable: true,
    audienceSize: 540000000,
    path: ["Interests", "Shopping and fashion", "Beauty"],
  },
  {
    id: "6002714895372",
    name: "Engaged shoppers",
    type: "behaviors",
    branch: "behaviors",
    selectable: true,
    audienceSize: 700000000,
    path: ["Behaviors", "Purchase behavior", "Engaged shoppers"],
  },
];

describe("AdsManagerDetailedTargetingSection", () => {
  beforeEach(() => {
    __resetDetailedTargetingBrowseCacheForTests();
  });

  it("opens suggestions on empty search click with Relevance/Size tabs", async () => {
    await i18n.changeLanguage("he");
    const suggestFn = vi.fn(async () => ({
      success: true,
      results: SUGGESTIONS,
      source: "browse_catalog_empty_state",
      sort: "relevance",
    }));

    render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={[]}
          onChange={() => {}}
          browseFn={async () => ({ success: true, results: FIXTURE })}
          searchFn={async () => ({ success: true, results: [] })}
          suggestFn={suggestFn as never}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId("detailed-targeting-search"));
    await waitFor(() => expect(suggestFn).toHaveBeenCalled());
    expect(screen.getByTestId("detailed-targeting-panel").getAttribute("data-panel-mode")).toBe(
      "suggestions"
    );
    expect(screen.getByTestId("suggest-tab-relevance")).toBeTruthy();
    expect(screen.getByTestId("suggest-tab-size")).toBeTruthy();
    expect(screen.getByText("Beauty")).toBeTruthy();

    fireEvent.click(screen.getByTestId("suggest-tab-size"));
    await waitFor(() =>
      expect(suggestFn).toHaveBeenCalledWith(
        "biz",
        expect.objectContaining({ sort: "size" })
      )
    );
  });

  it("keeps browse open when drilling replaces the clicked row", async () => {
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
          suggestFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId("detailed-targeting-browse"));
    await waitFor(() => expect(browseFn).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: /^Interests$/i }));
    // Panel must survive the document click that follows a replaced row.
    expect(screen.getByTestId("detailed-targeting-panel")).toBeTruthy();
    expect(screen.getByText("Business and industry")).toBeTruthy();
  });

  it("drills into nested Business and industry without flattening or showing __ROOT__", async () => {
    await i18n.changeLanguage("en");
    const onChange = vi.fn();
    let selected: AdSetDetailedTarget[] = [];
    const browseFn = vi.fn(async () => ({ success: true, results: FIXTURE }));

    render(
      <I18nextProvider i18n={i18n}>
        <AdsManagerDetailedTargetingSection
          businessId="biz"
          selected={selected}
          onChange={(next) => {
            selected = next;
            onChange(next);
          }}
          browseFn={browseFn as never}
          searchFn={async () => ({ success: true, results: [] })}
          suggestFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId("detailed-targeting-browse"));
    await waitFor(() => expect(browseFn).toHaveBeenCalled());
    expect(screen.queryByText("__ROOT__")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^Interests$/i }));
    expect(screen.getByText("Business and industry")).toBeTruthy();
    // Nested leaf must not appear until drill-in
    expect(screen.queryByText("Investment banking")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Business and industry/i }));
    expect(screen.getByText("Banking (finance)")).toBeTruthy();
    expect(screen.getByText("Small business")).toBeTruthy();
    // Meta parent-path rows must not promote Banking into a selectable leaf.
    expect(screen.queryByText("Investment banking")).toBeNull();
    expect(screen.queryByText("Retail banking")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Banking \(finance\)/i }));
    expect(screen.getByText("Investment banking")).toBeTruthy();
    expect(screen.getByText("Retail banking")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Investment banking/i }));
    await waitFor(() => expect(selected[0]?.id).toBe("6003063638807"));
  });

  it("searches in Hebrew/English and supports multi select/remove", async () => {
    await i18n.changeLanguage("he");
    const searchFn = vi.fn(async (_biz: string, query: { q: string }) => {
      if (query.q.includes("יופי")) {
        return {
          success: true,
          results: [
            {
              id: "6003139266461",
              name: "יופי",
              type: "interests",
              branch: "interests",
              selectable: true,
              path: ["Interests"],
            },
          ],
        };
      }
      return {
        success: true,
        results: FIXTURE.filter(
          (row) =>
            row.selectable &&
            row.name.toLowerCase().includes(query.q.toLowerCase())
        ),
      };
    });

    function Harness() {
      const [selected, setSelected] = React.useState<AdSetDetailedTarget[]>([]);
      return (
        <I18nextProvider i18n={i18n}>
          <div data-selected-count={selected.length} />
          <AdsManagerDetailedTargetingSection
            businessId="biz"
            selected={selected}
            onChange={setSelected}
            browseFn={async () => ({ success: true, results: FIXTURE })}
            searchFn={searchFn as never}
            suggestFn={async () => ({ success: true, results: SUGGESTIONS })}
          />
        </I18nextProvider>
      );
    }

    render(<Harness />);

    fireEvent.change(screen.getByTestId("detailed-targeting-search"), {
      target: { value: "יופי" },
    });
    await waitFor(() => expect(searchFn).toHaveBeenCalled());
    fireEvent.click(await screen.findByText("יופי"));
    await waitFor(() =>
      expect(document.querySelector("[data-selected-count]")?.getAttribute("data-selected-count")).toBe(
        "1"
      )
    );

    fireEvent.change(screen.getByTestId("detailed-targeting-search"), {
      target: { value: "Small" },
    });
    await waitFor(() =>
      expect(searchFn).toHaveBeenCalledWith(
        "biz",
        expect.objectContaining({ q: "Small" })
      )
    );
    fireEvent.click(await screen.findByText("Small business"));
    await waitFor(() =>
      expect(document.querySelector("[data-selected-count]")?.getAttribute("data-selected-count")).toBe(
        "2"
      )
    );
    expect(screen.getAllByRole("button", { name: /הסרה:|remove:/i }).length).toBe(2);

    fireEvent.click(screen.getAllByRole("button", { name: /הסרה:|remove:/i })[0]);
    await waitFor(() =>
      expect(document.querySelector("[data-selected-count]")?.getAttribute("data-selected-count")).toBe(
        "1"
      )
    );
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
          suggestFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    fireEvent.click(screen.getByTestId("detailed-targeting-browse"));
    await waitFor(() => expect(browseFn).toHaveBeenCalled());
    fireEvent.click(screen.getByRole("button", { name: /^Demographics$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Other$/i }));
    expect(screen.getByText(/Legacy demographic cluster/i)).toBeTruthy();
    expect(
      screen.getByText(/not supported for Meta flexible_spec/i)
    ).toBeTruthy();
    fireEvent.click(screen.getByTestId("detailed-targeting-browse-back"));
    fireEvent.click(screen.getByRole("button", { name: /^Education$/i }));
    expect(screen.getByText(/College years/i)).toBeTruthy();
    expect(screen.getByText(/browse category only/i)).toBeTruthy();
  });

  it("restores browse panel after a full remount", async () => {
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
          suggestFn={async () => ({ success: true, results: [] })}
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
          suggestFn={async () => ({ success: true, results: [] })}
        />
      </I18nextProvider>
    );

    expect(
      screen.getByTestId("detailed-targeting-browse").getAttribute("aria-expanded")
    ).toBe("true");
    expect(screen.getByTestId("detailed-targeting-panel")).toBeTruthy();
    expect(browseFn).toHaveBeenCalledTimes(1);
  });
});
