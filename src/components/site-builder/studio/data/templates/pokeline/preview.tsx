import React from "react";
import PokelinePages from "./pages";
export default function PokelinePreview() {
  return (
    <div dir="rtl" data-template-id="pokeline" className="min-h-screen w-full" style={{ background: "#071a1f", color: "#e8f7f6" }}>
      <PokelinePages initialPage="home" mode="preview" />
    </div>
  );
}
