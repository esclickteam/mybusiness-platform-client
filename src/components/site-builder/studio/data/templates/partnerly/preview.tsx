import React from "react";
import PartnerlyPages from "./pages";

export default function PartnerlyPreview() {
  return (
    <div dir="rtl" data-template-id="partnerly-preview" className="min-h-screen w-full overflow-x-hidden">
      <PartnerlyPages initialPage="home" mode="preview" />
    </div>
  );
}
