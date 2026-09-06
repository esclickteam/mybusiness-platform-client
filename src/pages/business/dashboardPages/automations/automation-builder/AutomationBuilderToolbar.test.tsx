import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import i18n from "@/i18n/i18n";
import AutomationBuilderToolbar from "./AutomationBuilderToolbar";

const workflow = {
  _id: "wf-1",
  name: "טיוטה",
  status: "draft",
} as React.ComponentProps<typeof AutomationBuilderToolbar>["workflow"];

describe("AutomationBuilderToolbar", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

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

    fireEvent.click(screen.getByRole("button", { name: /Add step/ }));
    expect(onOpenPicker).toHaveBeenCalledTimes(1);
  });
});
