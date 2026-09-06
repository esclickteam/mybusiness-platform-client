import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LedgerPages from "./pages";

export default function LedgerPreview() {
  return (
    <div dir={templateDir()} data-template-id="ledger" className="min-h-screen w-full" style={{ background: "#f6f3ea", overflowX: "hidden" }}>
      <LedgerPages initialPage="home" mode="preview" />
    </div>
  );
}
