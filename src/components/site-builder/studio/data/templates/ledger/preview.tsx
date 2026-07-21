import React from "react";
import LedgerPages from "./pages";

export default function LedgerPreview() {
  return (
    <div dir="rtl" data-template-id="ledger-preview" className="min-h-screen w-full" style={{ background: "#f6f3ea", overflowX: "hidden" }}>
      <LedgerPages initialPage="home" mode="preview" />
    </div>
  );
}
