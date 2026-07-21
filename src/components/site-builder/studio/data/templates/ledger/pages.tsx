import { createRectTemplatePages } from "../shared/createRectTemplatePagesFactory";
import { ledgerDefaultData } from "./defaultData";
import { ledgerEditorCss } from "./editorCss";

export const ledgerPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#f6f3ea",
  surface: "#fffdf8",
  text: "#102018",
  muted: "#5a6b62",
  accent: "#0d5c45",
  border: "#10201820",
  dark: "#102018",
  light: "#f6f3ea",
};

export default createRectTemplatePages({
  id: "ledger",
  variant: "ledger",
  theme,
  pages: ledgerPages,
  defaultData: ledgerDefaultData,
  editorCss: ledgerEditorCss,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
});
