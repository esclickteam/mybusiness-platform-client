import React from "react";

import CycloraPages from "./pages";

export default function CycloraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="cyclora-preview"
      className="relative h-screen min-h-screen w-full overflow-hidden bg-black text-white"
    >
      <div className="h-full w-full overflow-x-hidden overflow-y-auto">
        <CycloraPages initialPage="home" mode="preview" />
      </div>
    </div>
  );
}