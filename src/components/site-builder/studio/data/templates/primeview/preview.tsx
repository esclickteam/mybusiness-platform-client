import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PrimeviewPages from "./pages";
export default function PrimeviewPreview() {
  return (
    <div dir={templateDir()} data-template-id="primeview" className="min-h-screen w-full" style={{ background: "#f8fafc", color: "#0f172a" }}>
      <PrimeviewPages initialPage="home" mode="preview" />
    </div>
  );
}
