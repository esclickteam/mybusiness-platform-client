import React from "react";
import JewelisPages from "./pages";

export default function JewelisPreview() {
  return (
    <div dir="rtl" data-template-id="jewelis-preview" className="min-h-screen w-full overflow-x-hidden">
      <JewelisPages initialPage="home" mode="preview" />
    </div>
  );
}
