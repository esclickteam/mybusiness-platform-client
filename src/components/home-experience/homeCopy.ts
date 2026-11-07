const HOME_BUTTONS: Record<string, { es: string; pt: string; ar: string }> = {
  "Skip to content": { es: "Saltar al contenido", pt: "Pular para o conteúdo", ar: "تخطي إلى المحتوى" },
  "Start free": { es: "Empiecen gratis", pt: "Comecem grátis", ar: "ابدأوا مجانًا" },
  "See the system": { es: "Ver el sistema", pt: "Ver o sistema", ar: "شاهدوا النظام" },
  "Watch the demo": { es: "Ver la demostración", pt: "Ver a demonstração", ar: "شاهدوا العرض" },
  Campaigns: { es: "Campañas", pt: "Campanhas", ar: "الحملات" },
  Websites: { es: "Sitios", pt: "Sites", ar: "المواقع" },
  Automations: { es: "Automatizaciones", pt: "Automações", ar: "الأتمتة" },
  "Explore Bizuply CRM": { es: "Explorar el CRM de Bizuply", pt: "Explorar o CRM da Bizuply", ar: "استكشفوا CRM من Bizuply" },
  Terms: { es: "Términos", pt: "Termos", ar: "الشروط" },
  Privacy: { es: "Privacidad", pt: "Privacidade", ar: "الخصوصية" },
  Contact: { es: "Contacto", pt: "Contato", ar: "اتصلوا بنا" },
  Region: { es: "Región", pt: "Região", ar: "المنطقة" },
  "Choose a region": { es: "Elegir región", pt: "Escolher região", ar: "اختيار المنطقة" },
};

export function homeButtonLabel(language: string, english: string) {
  const value = String(language || "en").toLowerCase();
  const row = HOME_BUTTONS[english];
  if (!row) return english;
  if (value.startsWith("es")) return row.es;
  if (value.startsWith("pt")) return row.pt;
  if (value.startsWith("ar")) return row.ar;
  return english;
}
