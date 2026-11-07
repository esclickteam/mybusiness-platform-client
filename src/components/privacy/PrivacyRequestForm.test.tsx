import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyRequestForm from "./PrivacyRequestForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "ar" },
  }),
}));

vi.mock("../../api", () => ({
  default: { post: vi.fn() },
}));

describe("privacy request form", () => {
  it("shows Arabic labels and does not offer automatic deletion", () => {
    render(<PrivacyRequestForm />);
    expect(screen.getByRole("heading", { name: "طلب اطلاع أو تصحيح" })).toBeTruthy();
    expect(screen.getByLabelText("البريد")).toBeTruthy();
    expect(screen.getByRole("button", { name: "إرسال الطلب" })).toBeTruthy();
    expect(screen.getByText(/ولا يحذف السجلات/)).toBeTruthy();
  });
});
