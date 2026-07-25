import React from "react";
import ClothoraPages from "./pages";

export default function ClothoraPreview() {
  return (
    <div dir="rtl" data-template-id="clothora-preview" className="min-h-screen w-full overflow-x-hidden">
      <ClothoraPages initialPage="home" mode="preview" />
    </div>
  );
}
