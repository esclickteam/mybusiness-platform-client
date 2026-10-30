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
});