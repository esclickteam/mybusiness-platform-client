import React from "react";
import SportifyaPages from "./pages";

export default function SportifyaPreview() {
  return (
    <div dir="rtl" data-template-id="sportifya-preview" className="min-h-screen w-full overflow-x-hidden">
      <SportifyaPages initialPage="home" mode="preview" />
    </div>
  );
}
