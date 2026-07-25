import React from "react";
import BrandforgePages from "./pages";

export default function BrandforgePreview() {
  return (
    <div dir="rtl" data-template-id="brandforge-preview" className="min-h-screen w-full overflow-x-hidden">
      <BrandforgePages initialPage="home" mode="preview" />
    </div>
  );
}
