import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import AutomationBuilderToolbar from "./AutomationBuilderToolbar";

const workflow = {
  _id: "wf-1",
  name: "טיוטה",
  status: "draft",
} as React.ComponentProps<typeof AutomationBuilderToolbar>["workflow"];

describe("AutomationBuilderToolbar", () => {
  it("always fires Add Step from the top button", () => {
    const onOpenPicker = vi.fn();
    render(
      <AutomationBuilderToolbar
        name="טיוטה"
        onNameChange={() => undefined}
        onBack={() => undefined}
        readOnly={false}
        dirty={false}
        saveState="idle"
        saving={false}
        publishing={false}
        workflow={workflow}
        onSave={() => undefined}
        onPublish={() => undefined}
        onPause={() => undefined}
        onResume={() => undefined}
        onToggleTest={() => undefined}
        onOpenPicker={onOpenPicker}
        hasUnsupportedTrigger={false}
        triggerCatalogError=""
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /הוסף שלב/ }));
    expect(onOpenPicker).toHaveBeenCalledTimes(1);
  });
});
