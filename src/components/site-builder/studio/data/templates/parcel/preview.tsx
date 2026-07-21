import React from "react";
import ParcelPages from "./pages";

export default function ParcelPreview() {
  return (
    <div dir="rtl" data-template-id="parcel-preview" className="min-h-screen w-full overflow-hidden" style={{ background: "#efe9da", color: "#243018" }}>
      <ParcelPages initialPage="home" mode="preview" />
    </div>
  );
}
