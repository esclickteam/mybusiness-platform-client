import React from "react";
import PastaforaPages from "./pages";
export default function PastaforaPreview() {
  return (
    <div dir="rtl" data-template-id="pastafora" className="min-h-screen w-full" style={{ background: "#faf7f2", color: "#2c1810" }}>
      <PastaforaPages initialPage="home" mode="preview" />
    </div>
  );
}
