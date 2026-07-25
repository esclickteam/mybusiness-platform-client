import React from "react";
import NarrativaPages from "./pages";

export default function NarrativaPreview() {
  return (
    <div dir="rtl" data-template-id="narrativa-preview" className="min-h-screen w-full overflow-x-hidden">
      <NarrativaPages initialPage="home" mode="preview" />
    </div>
  );
}
