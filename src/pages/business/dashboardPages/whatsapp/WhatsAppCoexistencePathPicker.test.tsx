import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import WhatsAppCoexistencePathPicker from "./WhatsAppCoexistencePathPicker";

const copy = {
  cloudTitle: "New or Cloud API number",
  cloudBody: "Register a number on Cloud API. The WhatsApp Business app cannot keep using it.",
  appTitle: "Number already on WhatsApp Business",
  appBody: "Keep using the app and connect Cloud API on the same number.",
  limitsTitle: "After Coexistence",
  limits: ["Throughput is capped at 20 messages per second", "Group chats are not synced"],
};

describe("WhatsAppCoexistencePathPicker", () => {
  it("lets the user pick Coexistence and shows the limits", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <WhatsAppCoexistencePathPicker
        path="cloud_api"
        onChange={onChange}
        copy={copy}
      />
    );
    expect(screen.queryByText(copy.limitsTitle)).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: /Number already on WhatsApp Business/i })
    );
    expect(onChange).toHaveBeenCalledWith("coexistence");
    rerender(
      <WhatsAppCoexistencePathPicker
        path="coexistence"
        onChange={onChange}
        copy={copy}
      />
    );
    expect(screen.getByText(copy.limitsTitle)).toBeTruthy();
    expect(screen.getByText(copy.limits[0])).toBeTruthy();
  });
});
