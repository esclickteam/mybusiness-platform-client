import React from "react";

const COPY = {
  crawl: {
    en: ["Who you help", "The service", "How to book or ask", "The price, if you publish one", "How to reach you"],
    he: ["את מי אתם עוזרים", "השירות", "איך קובעים או שואלים", "המחיר, אם מפרסמים אותו", "איך מגיעים אליכם"],
    es: ["A quién ayuda", "El servicio", "Cómo reservar o preguntar", "El precio, si lo publica", "Cómo llegar a usted"],
    "pt-BR": ["Quem você atende", "O serviço", "Como agendar ou perguntar", "O preço, se você publica", "Como falar com você"],
    ar: ["من تساعدون", "الخدمة", "كيف يُحجز أو يُسأل", "السعر، إن نشرتموه", "كيف يصلون إليكم"],
  },
  path: {
    en: ["Meta Lead Ad", "Website form", "Google Ads form", "CRM lead, with its source", "Status and a dated task"],
    he: ["ליד ממודעת Meta", "טופס באתר", "טופס Google Ads", "ליד ב־CRM, עם המקור", "סטטוס ומשימה עם תאריך"],
    es: ["Lead de Meta", "Formulario del sitio", "Formulario de Google Ads", "Lead en el CRM, con su origen", "Estado y una tarea con fecha"],
    "pt-BR": ["Lead da Meta", "Formulário do site", "Formulário do Google Ads", "Lead no CRM, com a origem", "Status e uma tarefa com data"],
    ar: ["عميل من إعلان Meta", "نموذج الموقع", "نموذج Google Ads", "عميل في CRM مع مصدره", "حالة ومهمة بتاريخ"],
  },
  fees: {
    en: ["WhatsApp Business API — $29/month per connected number.", "Meta messaging charges apply separately, based on usage and message category."],
    he: ["WhatsApp Business API — 29 דולר לחודש לכל מספר מחובר.", "חיובי ההודעות של Meta מחושבים בנפרד, לפי השימוש וקטגוריית ההודעה."],
    es: ["WhatsApp Business API — 29 USD al mes por número conectado.", "Los cargos de mensajería de Meta se aplican aparte, según el uso y la categoría del mensaje."],
    "pt-BR": ["WhatsApp Business API — US$ 29 por mês por número conectado.", "As cobranças de mensagens da Meta são à parte, conforme o uso e a categoria da mensagem."],
    ar: ["WhatsApp Business API — 29 دولاراً شهرياً لكل رقم متصل.", "رسوم رسائل Meta تُحسب بشكل منفصل، حسب الاستخدام وفئة الرسالة."],
  },
  automation: {
    en: ["Trigger: lead status becomes Contacted", "Action: create a CRM task", "Publish", "The lead changes status", "Run history shows Success"],
    he: ["טריגר: הסטטוס הופך ל־Contacted", "פעולה: יצירת משימת CRM", "פרסום", "הליד משנה סטטוס", "ההיסטוריה מציגה Success"],
    es: ["Disparador: el estado pasa a Contacted", "Acción: crear una tarea de CRM", "Publicar", "El lead cambia de estado", "El historial muestra Success"],
    "pt-BR": ["Gatilho: o status muda para Contacted", "Ação: criar uma tarefa de CRM", "Publicar", "O lead muda de status", "O histórico mostra Success"],
    ar: ["المشغّل: الحالة تصبح Contacted", "الإجراء: إنشاء مهمة CRM", "النشر", "يتغير وضع العميل", "السجل يعرض Success"],
  },
};

export default function GuideFigure({ kind, locale }) {
  const lines = COPY[kind]?.[locale] || COPY[kind]?.en;
  if (!lines) return null;
  return (
    <ol className={`guide-figure guide-figure--${kind}`}>
      {lines.map((line, index) => (
        <li key={line}>
          <span>{index + 1}</span>
          {line}
        </li>
      ))}
    </ol>
  );
}
