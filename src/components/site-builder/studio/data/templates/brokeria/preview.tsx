import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BrokeriaPages from "./pages";
export default function BrokeriaPreview() {
  return (
    <div dir={templateDir()} data-template-id="brokeria" className="min-h-screen w-full" style={{ background: "#0a0f18", color: "#f0f4fa" }}>
      <BrokeriaPages initialPage="home" mode="preview" />
    </div>
  );
}
