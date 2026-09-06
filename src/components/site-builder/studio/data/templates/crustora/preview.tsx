import React from "react";
import { useTranslation } from "react-i18next";
import { localizeBuiltInTemplateSeed } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";
import { crustoraDefaultData } from "./defaultData";
import CrustoraPages from "./pages";
export default function CrustoraPreview() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} data-template-id="crustora" className="min-h-screen w-full" style={{ background: "#faf4eb", color: "#2a1810" }}>
      <CrustoraPages
        initialPage="home"
        mode="preview"
        data={localizeBuiltInTemplateSeed(crustoraDefaultData, i18n.language)}
      />
    </div>
  );
}
