import React from "react";
import SoleoraPages from "./pages";

export default function SoleoraPreview() {
  return (
    <div dir="rtl" data-template-id="soleora-preview" className="min-h-screen w-full overflow-x-hidden">
      <SoleoraPages initialPage="home" mode="preview" />
    </div>
  );
}
