import React from "react";
import PrimeviewPages from "./pages";
export default function PrimeviewPreview() {
  return (
    <div dir="rtl" data-template-id="primeview-preview" className="min-h-screen w-full" style={{ background: "#f8fafc", color: "#0f172a" }}>
      <PrimeviewPages initialPage="home" mode="preview" />
    </div>
  );
}
