import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  PushBellDiscoverChip,
  PushCompactUpsellCard,
  PushEmptyStateUpsell,
} from "./PushDiscoverabilityCards";

describe("PushDiscoverabilityCards", () => {
  it("empty state trial-eligible shows trial CTA and badge", () => {
    const onOpen = vi.fn();
    render(
      <PushEmptyStateUpsell trialEligible onOpenPushSettings={onOpen} />
    );

    expect(screen.getByTestId("push-upsell-trial-badge")).toHaveTextContent(
      "7 ימים חינם"
    );
    fireEvent.click(screen.getByTestId("push-empty-upsell-cta"));
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("push-empty-upsell-cta")).toHaveTextContent(
      "נסו התראות Push"
    );
    expect(screen.getByText("או 19 ₪ לחודש בחיוב שנתי")).toBeInTheDocument();
  });

  it("empty state trial-used hides free-trial copy", () => {
    render(
      <PushEmptyStateUpsell
        trialEligible={false}
        onOpenPushSettings={() => {}}
      />
    );

    expect(screen.queryByTestId("push-upsell-trial-badge")).not.toBeInTheDocument();
    expect(screen.getByTestId("push-upsell-paid-price")).toHaveTextContent(
      "29 ₪ לחודש"
    );
    expect(screen.getByText("או 228 ₪ לשנה")).toBeInTheDocument();
    expect(screen.getByTestId("push-empty-upsell-cta")).toHaveTextContent(
      "הפעלת התראות Push"
    );
    expect(screen.queryByText("7 ימים חינם")).not.toBeInTheDocument();
  });

  it("compact upsell trial-eligible shows badge and opens settings", () => {
    const onOpen = vi.fn();
    render(
      <PushCompactUpsellCard trialEligible onOpenPushSettings={onOpen} />
    );

    expect(screen.getByTestId("push-compact-upsell")).toBeInTheDocument();
    expect(screen.getByTestId("push-upsell-trial-badge")).toHaveTextContent(
      "7 ימים חינם"
    );
    fireEvent.click(screen.getByTestId("push-compact-upsell-cta"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("compact upsell trial-used has no free-trial badge", () => {
    render(
      <PushCompactUpsellCard
        trialEligible={false}
        onOpenPushSettings={() => {}}
      />
    );

    expect(screen.queryByTestId("push-upsell-trial-badge")).not.toBeInTheDocument();
    expect(screen.queryByText("7 ימים חינם")).not.toBeInTheDocument();
    expect(screen.getByText(/29 ₪ לחודש/)).toBeInTheDocument();
  });

  it("bell chip is a distinct button that opens settings", () => {
    const onOpen = vi.fn();
    render(
      <div className="relative">
        <PushBellDiscoverChip trialEligible onOpenPushSettings={onOpen} />
      </div>
    );

    const chip = screen.getByTestId("push-bell-chip");
    expect(chip.tagName).toBe("BUTTON");
    fireEvent.click(chip);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
