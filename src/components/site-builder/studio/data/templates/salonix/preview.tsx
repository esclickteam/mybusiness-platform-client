import React from "react";
import SalonixPages from "./pages";

export default function SalonixPreview() {
  return (
    <div dir="rtl" data-template-id="salonix-preview" className="min-h-screen w-full overflow-x-hidden bg-white">
      <SalonixPages initialPage="home" mode="preview" />
    </div>
  );
}
