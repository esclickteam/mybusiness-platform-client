import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { prismDefaultData } from "./defaultData";
import { prismEditorCss } from "./editorCss";

export const prismPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "insights", label: "תובנות", slug: "/insights" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#fffef8",
  surface: "#fff",
  text: "#0a0a0a",
  muted: "#555",
  accent: "#0057ff",
  border: "#0a0a0a14",
  dark: "#0a0a0a",
  light: "#fff",
};

export default createRectTemplatePages({
  id: "prism",
  variant: "prism",
  theme,
  pages: prismPages,
  defaultData: prismDefaultData,
  editorCss: prismEditorCss,
  
});
