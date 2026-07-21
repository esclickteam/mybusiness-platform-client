import { createRectTemplatePages } from "../shared/createRectTemplatePages";
import { kineticDefaultData } from "./defaultData";
import { kineticEditorCss } from "./editorCss";

export const kineticPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "services", label: "שירותים", slug: "/services" },
  { id: "work", label: "פרויקטים", slug: "/work" },
  { id: "contact", label: "צור קשר", slug: "/contact" },
];

const theme = {
  bg: "#0b0b0b",
  surface: "#141414",
  text: "#ffffff",
  muted: "#aaa",
  accent: "#ff2d2d",
  border: "#ffffff15",
  dark: "#000",
  light: "#fff",
};

export default createRectTemplatePages({
  id: "kinetic",
  variant: "kinetic",
  theme,
  pages: kineticPages,
  defaultData: kineticDefaultData,
  editorCss: kineticEditorCss,
  
});
