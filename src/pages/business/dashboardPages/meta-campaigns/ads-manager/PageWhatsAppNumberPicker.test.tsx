import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import en from "../../../../../i18n/locales/en.json";

const listPageWhatsAppNumbers = vi.fn();
const inspectPageWhatsAppNumber = vi.fn();
const requestPageWhatsAppCode = vi.fn();
const verifyPageWhatsAppCode = vi.fn();

vi.mock("../../../../../api/metaCampaignsApi", () => ({
  listPageWhatsAppNumbers: (...args: unknown[]) => listPageWhatsAppNumbers(...args),
  inspectPageWhatsAppNumber: (...args: unknown[]) => inspectPageWhatsAppNumber(...args),
  requestPageWhatsAppCode: (...args: unknown[]) => requestPageWhatsAppCode(...args),
  verifyPageWhatsAppCode: (...args: unknown[]) => verifyPageWhatsAppCode(...args),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const value = key.split(".").reduce<unknown>(
        (acc, segment) =>
          acc && typeof acc === "object"
            ? (acc as Record<string, unknown>)[segment]
            : undefined,
        en
      );
      return typeof value === "string" ? value : key;
    },
    i18n: { language: "en" },
  }),
}));

import PageWhatsAppNumberPicker from "./PageWhatsAppNumberPicker";

const linked = {
  id: "972515573699",
  phone: "972515573699",
  e164: "+972515573699",
  displayNumber: "+972 51-557-3699",
  linkedToPage: true,
};

describe("PageWhatsAppNumberPicker", () => {
  beforeEach(() => {
    listPageWhatsAppNumbers.mockReset();
    inspectPageWhatsAppNumber.mockReset();
    requestPageWhatsAppCode.mockReset();
    verifyPageWhatsAppCode.mockReset();
  });

  it("lets the user pick a number already linked to the Page", async () => {
    listPageWhatsAppNumbers.mockResolvedValue({ numbers: [linked] });
    const onSelect = vi.fn();
    render(
      <PageWhatsAppNumberPicker
        businessId="biz-1"
        pageId="page-1"
        selectedPhone=""
        onSelect={onSelect}
      />
    );
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(linked));
    fireEvent.click(screen.getByTestId("page-whatsapp-selected"));
    expect(screen.getByText("+972 51-557-3699")).toBeTruthy();
    expect(screen.getByTestId("page-whatsapp-connect-another")).toBeTruthy();
    expect(screen.queryByText("Connect WhatsApp Business")).toBeNull();
  });

  it("selects an already-linked number without sending a verification code", async () => {
    listPageWhatsAppNumbers.mockResolvedValue({ numbers: [] });
    inspectPageWhatsAppNumber.mockResolvedValue({
      linked: true,
      alreadyLinkedToThisPage: true,
      number: linked,
      numbers: [linked],
    });
    const onSelect = vi.fn();
    render(
      <PageWhatsAppNumberPicker
        businessId="biz-1"
        pageId="page-1"
        selectedPhone=""
        onSelect={onSelect}
      />
    );
    await waitFor(() => screen.getByTestId("page-whatsapp-phone"));
    fireEvent.change(screen.getByTestId("page-whatsapp-phone"), {
      target: { value: "515573699" },
    });
    fireEvent.click(screen.getByTestId("page-whatsapp-continue"));
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(linked));
    expect(requestPageWhatsAppCode).not.toHaveBeenCalled();
    expect(screen.getByTestId("page-whatsapp-success")).toBeTruthy();
  });

  it("asks Meta for a code and verifies it before marking the number connected", async () => {
    listPageWhatsAppNumbers
      .mockResolvedValueOnce({ numbers: [] })
      .mockResolvedValueOnce({ numbers: [linked] });
    inspectPageWhatsAppNumber.mockResolvedValue({ linked: false, needsVerification: true });
    requestPageWhatsAppCode.mockResolvedValue({
      linked: false,
      codeSent: true,
      needsVerification: true,
    });
    verifyPageWhatsAppCode.mockResolvedValue({
      linked: true,
      number: linked,
      numbers: [linked],
    });
    const onSelect = vi.fn();
    render(
      <PageWhatsAppNumberPicker
        businessId="biz-1"
        pageId="page-1"
        selectedPhone=""
        onSelect={onSelect}
      />
    );
    await waitFor(() => screen.getByTestId("page-whatsapp-phone"));
    fireEvent.change(screen.getByTestId("page-whatsapp-phone"), {
      target: { value: "515573699" },
    });
    fireEvent.click(screen.getByTestId("page-whatsapp-continue"));
    await waitFor(() => screen.getByTestId("page-whatsapp-code"));
    fireEvent.change(screen.getByTestId("page-whatsapp-code"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByTestId("page-whatsapp-continue"));
    await waitFor(() => expect(verifyPageWhatsAppCode).toHaveBeenCalled());
    expect(onSelect).toHaveBeenCalledWith(linked);
  });

  it("shows Meta's already-on-another-account error and can cancel mid-flow", async () => {
    listPageWhatsAppNumbers.mockResolvedValue({ numbers: [] });
    inspectPageWhatsAppNumber.mockResolvedValue({ linked: false });
    requestPageWhatsAppCode.mockResolvedValue({
      linked: false,
      message: "This number is already used in another WhatsApp Business account.",
    });
    render(
      <PageWhatsAppNumberPicker
        businessId="biz-1"
        pageId="page-1"
        selectedPhone=""
        onSelect={vi.fn()}
      />
    );
    await waitFor(() => screen.getByTestId("page-whatsapp-phone"));
    fireEvent.change(screen.getByTestId("page-whatsapp-phone"), {
      target: { value: "555039072" },
    });
    fireEvent.click(screen.getByTestId("page-whatsapp-continue"));
    await waitFor(() => screen.getByTestId("page-whatsapp-error"));
    fireEvent.click(screen.getByLabelText("Cancel"));
    expect(screen.queryByTestId("page-whatsapp-modal")).toBeNull();
  });
});
