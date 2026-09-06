function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const MARKETS = {
  israel: row("Israel (ILS)", "ישראל (₪)", "Israel (ILS)", "Israel (ILS)", "إسرائيل (₪)"),
  usa: row("United States (USD)", "ארה״ב (USD)", "Estados Unidos (USD)", "Estados Unidos (USD)", "الولايات المتحدة (USD)"),
  europe: row("Europe (EUR)", "אירופה (EUR)", "Europa (EUR)", "Europa (EUR)", "أوروبا (EUR)"),
  brazil: row("Brazil (BRL)", "ברזיל (BRL)", "Brasil (BRL)", "Brasil (BRL)", "البرازيل (BRL)"),
  uae: row("United Arab Emirates (AED)", "איחוד האמירויות (AED)", "Emiratos Árabes Unidos (AED)", "Emirados Árabes Unidos (AED)", "الإمارات (AED)"),
  latam: row("Latin America (USD)", "אמריקה הלטינית (USD)", "Latinoamérica (USD)", "América Latina (USD)", "أمريكا اللاتينية (USD)"),
  global: row("International (USD)", "בינלאומי (USD)", "Internacional (USD)", "Internacional (USD)", "دولي (USD)"),
};

const PACKAGES = {
  website: {
    name: row("Website only", "בניית אתר בלבד", "Solo sitio web", "Apenas website", "الموقع فقط"),
    badge: row("Self-serve", "בניה עצמאית", "Autoservicio", "Self-service", "بناء ذاتي"),
    description: row(
      "Build a professional site yourself from a template — publish, get inquiries, and everything links to the CRM.",
      "בונים אתר מקצועי לבד מתבנית — מפרסמים, מקבלים פניות, והכול מקושר ל-CRM.",
      "Crea un sitio profesional desde una plantilla — publica, recibe consultas y todo se conecta al CRM.",
      "Crie um site profissional a partir de um modelo — publique, receba contactos e tudo liga ao CRM.",
      "ابنوا موقعاً مهنياً من قالب — انشروا واستقبلوا الاستفسارات وكل شيء يرتبط بالـ CRM."
    ),
    note: row(
      "One-time payment — no commitment and no auto-renewal",
      "תשלום חד־פעמי — ללא התחייבות וללא חידוש אוטומטי",
      "Pago único — sin compromiso ni renovación automática",
      "Pagamento único — sem compromisso e sem renovação automática",
      "دفعة واحدة — بلا التزام وبلا تجديد تلقائي"
    ),
    button: row("Start with a website", "התחילו עם אתר", "Empezar con un sitio", "Começar com um site", "ابدأوا بموقع"),
    pricePeriod: row("/year", "לשנה", "/año", "/ano", "/سنة"),
  },
  monthly: {
    name: row("BizUply Business", "BizUply Business", "BizUply Business", "BizUply Business", "BizUply Business"),
    badge: row("Flexible", "גמיש", "Flexible", "Flexível", "مرن"),
    description: row(
      "Access to the BizUply business system — CRM, appointments, collaborations, automations, and AI. Website not included.",
      "גישה למערכת BizUply העסקית — CRM, תורים, שיתופים, אוטומציות ו־AI. ללא אתר כלול.",
      "Acceso al sistema de negocio BizUply — CRM, citas, colaboraciones, automatizaciones e IA. El sitio no está incluido.",
      "Acesso ao sistema de negócio BizUply — CRM, marcações, colaborações, automações e IA. O site não está incluído.",
      "الوصول إلى نظام أعمال BizUply — CRM ومواعيد وتعاون وأتمتة وذكاء اصطناعي. الموقع غير مشمول."
    ),
    note: row("Renewing monthly billing", "חיוב חודשי מתחדש", "Facturación mensual renovable", "Cobrança mensal renovável", "فوترة شهرية متجددة"),
    button: row("Start monthly", "התחילו חודשי", "Empezar mensual", "Começar mensal", "ابدأوا شهرياً"),
    pricePeriod: row("/month", "לחודש", "/mes", "/mês", "/شهر"),
  },
  yearly: {
    name: row("BizUply Business yearly", "חבילה עסקית שנתית", "BizUply Business anual", "BizUply Business anual", "BizUply Business سنوي"),
    badge: row("Best value", "הכי משתלם", "Mejor valor", "Melhor valor", "الأفضل قيمة"),
    description: row(
      "The business system at a better yearly price — CRM, appointments, collaborations, and AI. Website not included.",
      "המערכת העסקית במחיר שנתי משתלם — CRM, תורים, שיתופים ו־AI. ללא אתר כלול.",
      "El sistema de negocio a un mejor precio anual — CRM, citas, colaboraciones e IA. El sitio no está incluido.",
      "O sistema de negócio a um melhor preço anual — CRM, marcações, colaborações e IA. O site não está incluído.",
      "نظام الأعمال بسعر سنوي أفضل — CRM ومواعيد وتعاون وذكاء اصطناعي. الموقع غير مشمول."
    ),
    note: row(
      "Renewing yearly billing",
      "חיוב שנתי מתחדש",
      "Facturación anual renovable",
      "Cobrança anual renovável",
      "فوترة سنوية متجددة"
    ),
    button: row("Start yearly", "התחילו שנתי", "Empezar anual", "Começar anual", "ابدأوا سنوياً"),
    pricePeriod: row("/year", "לשנה", "/año", "/ano", "/سنة"),
  },
};

const UPGRADE = {
  title: row(
    "This module is not included in your plan",
    "המודול הזה לא כלול בחבילה שלך",
    "Este módulo no está incluido en tu plan",
    "Este módulo não está incluído no seu plano",
    "هذه الوحدة غير مشمولة في باقتكم"
  ),
  text: row(
    "Your current plan includes website and domain management only.\nTo get CRM, leads, appointments, collaborations, automations, and business AI — upgrade to the business plan.",
    "החבילה הנוכחית כוללת ניהול אתר ודומיין בלבד.\nכדי לקבל CRM, לידים, תורים, שיתופים, אוטומציות ו-AI עסקי — יש לשדרג לחבילה העסקית.",
    "Tu plan actual incluye solo la web y el dominio.\nPara CRM, leads, citas, colaboraciones, automatizaciones e IA — mejora al plan Business.",
    "O seu plano atual inclui apenas o site e o domínio.\nPara CRM, leads, marcações, colaborações, automações e IA — atualize para o plano Business.",
    "باقتكم الحالية تشمل إدارة الموقع والنطاق فقط.\nللحصول على CRM والليدات والمواعيد والتعاون والأتمتة والذكاء الاصطناعي — ترقوا إلى باقة الأعمال."
  ),
  upgradeCta: row(
    "Upgrade to the business plan",
    "שדרוג לחבילה העסקית",
    "Mejorar al plan Business",
    "Atualizar para o plano Business",
    "الترقية إلى باقة الأعمال"
  ),
  backToWebsite: row(
    "Back to website management",
    "חזרה לניהול האתר",
    "Volver a la web",
    "Voltar à gestão do site",
    "العودة إلى إدارة الموقع"
  ),
};

const BANNER = {
  text: row(
    "This feature is included only in advanced plans.",
    "הפיצ׳ר הזה כלול רק בחבילות מתקדמות.",
    "Esta función solo está incluida en planes avanzados.",
    "Esta funcionalidade só está incluída em planos avançados.",
    "هذه الميزة مشمولة فقط في الباقات المتقدمة."
  ),
  cta: row("Upgrade now", "שדרגו עכשיו", "Mejorar ahora", "Atualizar agora", "ترقوا الآن"),
};

const REGIONAL = {
  unavailable: row(
    "This regional price is not configured for checkout yet. Contact support — we will not charge a different currency.",
    "המחיר האזורי הזה עדיין לא מוגדר לתשלום. פנו לתמיכה — לא נחייב במטבע אחר.",
    "Este precio regional aún no está configurado para el pago. Contacta con soporte — no cobraremos otra moneda.",
    "Este preço regional ainda não está configurado para pagamento. Contacte o suporte — não cobramos noutra moeda.",
    "هذا السعر الإقليمي غير مُعدّ للدفع بعد. تواصلوا مع الدعم — لن نحصّل بعملة أخرى."
  ),
};

export function extraPricingMarketsLocaleObject(locale) {
  return {
    billing: {
      markets: pick(MARKETS, locale),
      upgrade: pick(UPGRADE, locale),
      regional: pick(REGIONAL, locale),
    },
    leftover: {
      upgradeBanner: pick(BANNER, locale),
    },
    pricing: {
      packages: Object.fromEntries(
        Object.entries(PACKAGES).map(([key, fields]) => [key, pick(fields, locale)])
      ),
    },
  };
}
