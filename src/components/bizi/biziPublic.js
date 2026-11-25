export function isPublicSalesPath(pathname = "") {
  const path = String(pathname || "");
  if (/\/business(\/|$)/.test(path)) return false;
  if (/\/admin(\/|$)/.test(path)) return false;
  if (/\/partner(\/|$)/.test(path) && !/\/partners(\/|$)/.test(path)) return false;
  return true;
}

const PACKS = {
  he: {
    title: "Bizi AI",
    role: "היועצת העסקית החכמה של Bizuply",
    launcher: "בואו להתייעץ איתי!",
    launcherSub: "Bizi – היועצת החכמה שלכם.",
    greeting: "היי! אני Bizi, היועצת החכמה של Bizuply. ספרו לי קצת על העסק שלכם ואעזור לכם למצוא את הפתרון המתאים ביותר.",
    hint: "המחירים מגיעים מהקטלוג המאושר. אין כאן גישה לנתוני לקוחות.",
    prompts: [
      "התאימו לי חבילה.",
      "אני רוצה הצעת מחיר.",
      "יש לי שאלה על המערכת.",
      "איך מתחילים?",
      "אני רוצה לקבוע הדגמה.",
      "אני רוצה לדבר עם נציג.",
    ],
    lead: "אפשר לשמור את הפנייה רק בהסכמה.",
    name: "שם",
    email: "דוא״ל",
    phone: "טלפון",
    company: "שם העסק",
    agree: "אני מסכים/ה שיצרו איתי קשר",
    send: "שמרו את הפנייה",
    sample: "הצעת מחיר לפי הקטלוג",
  },
  en: {
    title: "Bizi AI",
    role: "Bizuply business advisor",
    launcher: "Let’s talk",
    launcherSub: "Bizi, your business advisor.",
    greeting: "Hi, I’m Bizi, the Bizuply advisor. Tell me a little about the business and I’ll help you find the published package that fits.",
    hint: "Prices come from the approved catalog. This chat cannot read customer data.",
    prompts: [
      "Match a package for me.",
      "I want a quote.",
      "I have a question about the system.",
      "How do I start?",
      "I want to schedule a demo.",
      "I want to talk to a person.",
    ],
    lead: "An enquiry is saved only with consent.",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Business name",
    agree: "I agree to be contacted",
    send: "Save this enquiry",
    sample: "Quote from the catalog",
  },
  es: {
    title: "Bizi AI",
    role: "Asesora de negocio de Bizuply",
    launcher: "Hablemos",
    launcherSub: "Bizi, su asesora de negocio.",
    greeting: "Hola, soy Bizi, la asesora de Bizuply. Cuéntenme sobre el negocio y les ayudo a encontrar el paquete publicado que encaja.",
    hint: "Los precios salen del catálogo aprobado. Este chat no lee datos de clientes.",
    prompts: [
      "Recomiéndenme un paquete.",
      "Quiero una oferta.",
      "Tengo una pregunta sobre el sistema.",
      "¿Cómo se empieza?",
      "Quiero una demostración.",
      "Quiero hablar con una persona.",
    ],
    lead: "La consulta se guarda solo con consentimiento.",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    company: "Nombre del negocio",
    agree: "Acepto que me contacten",
    send: "Guardar la consulta",
    sample: "Oferta según el catálogo",
  },
  "pt-BR": {
    title: "Bizi AI",
    role: "Consultora de negócios da Bizuply",
    launcher: "Vamos conversar",
    launcherSub: "Bizi, sua consultora de negócios.",
    greeting: "Olá, eu sou a Bizi, a consultora da Bizuply. Contem um pouco sobre o negócio e eu ajudo a encontrar o pacote publicado que combina.",
    hint: "Os preços vêm do catálogo aprovado. Este chat não lê dados de clientes.",
    prompts: [
      "Indiquem um pacote para mim.",
      "Quero uma proposta.",
      "Tenho uma pergunta sobre o sistema.",
      "Como começar?",
      "Quero agendar uma demonstração.",
      "Quero falar com uma pessoa.",
    ],
    lead: "O contato só é salvo com consentimento.",
    name: "Nome",
    email: "E-mail",
    phone: "Telefone",
    company: "Nome do negócio",
    agree: "Aceito ser contatado",
    send: "Salvar o contato",
    sample: "Proposta conforme o catálogo",
  },
  ar: {
    title: "Bizi AI",
    role: "مستشارة Bizuply للأعمال",
    launcher: "لنستشر معًا",
    launcherSub: "Bizi، مستشارتكم الذكية.",
    greeting: "مرحباً، أنا Bizi، مستشارة Bizuply. أخبروني عن النشاط وسأساعدكم في إيجاد الباقة المنشورة المناسبة.",
    hint: "الأسعار من الكتالوج المعتمد. هذه الدردشة لا تقرأ بيانات العملاء.",
    prompts: [
      "اقترحوا لي باقة.",
      "أريد عرض سعر.",
      "لدي سؤال عن النظام.",
      "كيف نبدأ؟",
      "أريد تحديد عرض.",
      "أريد التحدث مع شخص.",
    ],
    lead: "لا يُحفظ الطلب إلا بموافقة.",
    name: "الاسم",
    email: "البريد",
    phone: "الهاتف",
    company: "اسم النشاط",
    agree: "أوافق على التواصل معي",
    send: "حفظ الطلب",
    sample: "عرض سعر حسب الكتالوج",
  },
};

export function biziCopy(language) {
  const code = String(language || "en").toLowerCase();
  if (code.startsWith("he") || code.startsWith("iw")) return PACKS.he;
  if (code.startsWith("es")) return PACKS.es;
  if (code.startsWith("pt")) return PACKS["pt-BR"];
  if (code.startsWith("ar")) return PACKS.ar;
  return PACKS.en;
}
