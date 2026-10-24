import React from "react";

const COPY = {
  crawl: {
    en: ["Title", "One H1", "Opening answer", "Canonical URL", "hreflang only when that language exists"],
    he: ["כותרת העמוד", "H1 אחד", "תשובה בפתיח", "כתובת canonical", "hreflang רק כשהשפה קיימת"],
    es: ["Título", "Un solo H1", "Respuesta de apertura", "URL canónica", "hreflang solo si ese idioma existe"],
    "pt-BR": ["Título", "Um único H1", "Resposta de abertura", "URL canônica", "hreflang só quando o idioma existe"],
    ar: ["العنوان", "عنوان H1 واحد", "إجابة في الافتتاح", "رابط canonical", "hreflang فقط إذا وُجدت اللغة"],
  },
  path: {
    en: ["Meta Lead Ad", "Website form", "Google Ads form", "CRM lead, with its source", "Status and a dated task"],
    he: ["ליד ממודעת Meta", "טופס באתר", "טופס Google Ads", "ליד ב־CRM, עם המקור", "סטטוס ומשימה עם תאריך"],
    es: ["Lead de Meta", "Formulario del sitio", "Formulario de Google Ads", "Lead en el CRM, con su origen", "Estado y una tarea con fecha"],
    "pt-BR": ["Lead da Meta", "Formulário do site", "Formulário do Google Ads", "Lead no CRM, com a origem", "Status e uma tarefa com data"],
    ar: ["عميل من إعلان Meta", "نموذج الموقع", "نموذج Google Ads", "عميل في CRM مع مصدره", "حالة ومهمة بتاريخ"],
  },
  fees: {
    en: ["Bizuply: $29 / month for one connected number", "Meta: a separate fee per message, by country and category", "No free trial on the Bizuply number"],
    he: ["ביזאפלי: 29$ לחודש למספר מחובר אחד", "Meta: חיוב נפרד לכל הודעה, לפי מדינה וקטגוריה", "אין ניסיון חינם על המספר בביזאפלי"],
    es: ["Bizuply: 29 USD al mes por un número conectado", "Meta: una tarifa aparte por mensaje, según país y categoría", "Sin prueba gratis del número en Bizuply"],
    "pt-BR": ["Bizuply: US$ 29 por mês para um número conectado", "Meta: uma tarifa à parte por mensagem, por país e categoria", "Sem teste grátis do número na Bizuply"],
    ar: ["Bizuply: 29 دولاراً شهرياً لرقم واحد متصل", "Meta: رسم منفصل لكل رسالة حسب الدولة والفئة", "لا توجد تجربة مجانية لرقم Bizuply"],
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
