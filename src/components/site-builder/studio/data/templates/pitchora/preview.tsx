import React from "react";
import PitchoraPages from "./pages";

export default function PitchoraPreview() {
  return (
    <div dir="rtl" data-template-id="pitchora-preview" className="min-h-screen w-full overflow-x-hidden">
      <PitchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
