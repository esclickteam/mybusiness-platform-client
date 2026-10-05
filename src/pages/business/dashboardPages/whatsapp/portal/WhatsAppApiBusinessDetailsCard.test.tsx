import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import WhatsAppApiBusinessDetailsCard from "./WhatsAppApiBusinessDetailsCard";

const updateProfile = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
  initReactI18next: { type: "3rdParty", init: () => undefined },
}));

vi.mock("../../../../../api/whatsappApiPortal", () => ({
  updateWhatsAppApiBusinessProfile: (...args: unknown[]) => updateProfile(...args),
}));

afterEach(() => {
  cleanup();
  updateProfile.mockReset();
});

const K = "whatsappApiPortal.setup.businessDetails";
const empty = { pending: true, name: "", businessName: "", phone: "" };

function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(`${K}.${label}`), { target: { value } });
}

describe("WhatsAppApiBusinessDetailsCard", () => {
  it("validates before calling the server", () => {
    render(<WhatsAppApiBusinessDetailsCard businessId="b1" profile={empty} onSaved={vi.fn()} />);
    fill("phone", "12");
    fireEvent.click(screen.getByText(`${K}.save`));

    expect(updateProfile).not.toHaveBeenCalled();
    expect(screen.getAllByText(`${K}.required`)).toHaveLength(2);
    expect(screen.getByText(`${K}.invalidPhone`)).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByLabelText(`${K}.name`));
  });

  it("saves trimmed details and hands the saved profile back", async () => {
    const saved = { pending: false, name: "Dana Levi", businessName: "Acme", phone: "+972 50-123-4567" };
    updateProfile.mockResolvedValue({ success: true, profile: saved });
    const onSaved = vi.fn();
    render(<WhatsAppApiBusinessDetailsCard businessId="b1" profile={empty} onSaved={onSaved} />);
    fill("name", " Dana Levi ");
    fill("businessName", "Acme");
    fill("phone", "+972 50-123-4567");
    fireEvent.click(screen.getByText(`${K}.save`));

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(saved));
    expect(updateProfile).toHaveBeenCalledWith("b1", {
      name: "Dana Levi",
      businessName: "Acme",
      phone: "+972 50-123-4567",
    });
  });

  it("shows server field errors next to the fields", async () => {
    updateProfile.mockRejectedValue({ response: { status: 400, data: { fields: { phone: "Enter a valid phone number." } } } });
    render(<WhatsAppApiBusinessDetailsCard businessId="b1" profile={empty} onSaved={vi.fn()} />);
    fill("name", "Dana");
    fill("businessName", "Acme");
    fill("phone", "+1 555 123 4567");
    fireEvent.click(screen.getByText(`${K}.save`));

    expect(await screen.findByText(`${K}.invalidPhone`)).toBeInTheDocument();
  });
});
