import React from "react";
import BrokeriaPages from "./pages";
export default function BrokeriaPreview() {
  return (
    <div dir="rtl" data-template-id="brokeria-preview" className="min-h-screen w-full" style={{ background: "#0a0f18", color: "#f0f4fa" }}>
      <BrokeriaPages initialPage="home" mode="preview" />
    </div>
  );
}
