import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InternationalManualPaymentForm from "./InternationalManualPaymentForm";

vi.mock("../../lib/partnerApi", () => ({
  adminRecordPayment: vi.fn(),
}));

describe("international manual payment form", () => {
  it("asks for amount, date, reference, and billing period and does not submit an incomplete payment", async () => {
    const onSaved = vi.fn();
    render(
      <InternationalManualPaymentForm
        target={{
          partnerId: "partner-1",
          name: "Northwind",
          periodStart: "2026-10-30",
          periodEnd: "2027-10-30",
        }}
        onClose={() => {}}
        onSaved={onSaved}
      />
    );
    expect(screen.getByText(/גבייה ידנית/)).toBeInTheDocument();
    expect(screen.getByText(/לא מחייב כרטיס/)).toBeInTheDocument();
    expect(screen.getByTestId("manual-payment-amount")).toHaveValue("5000");
    fireEvent.click(screen.getByRole("button", { name: "תיעוד תשלום מאומת" }));
    expect(await screen.findByText(/Payment date is required/)).toBeInTheDocument();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("defaults a monthly partner to $499", () => {
    render(
      <InternationalManualPaymentForm
        target={{
          partnerId: "partner-2",
          name: "Monthly",
          periodStart: "2026-01-31",
          periodEnd: "2026-02-28",
          billingInterval: "monthly",
          defaultAmount: 499,
        }}
        onClose={() => {}}
        onSaved={() => {}}
      />
    );
    expect(screen.getByTestId("manual-payment-amount")).toHaveValue("499");
    expect(screen.getByText(/\$499 לחודש/)).toBeInTheDocument();
  });
});