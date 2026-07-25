import React from "react";
import EmberplatePages from "./pages";
export default function EmberplatePreview() {
  return (
    <div dir="rtl" data-template-id="emberplate-preview" className="min-h-screen w-full" style={{ background: "#140c08", color: "#f6ebe0" }}>
      <EmberplatePages initialPage="home" mode="preview" />
    </div>
  );
}
