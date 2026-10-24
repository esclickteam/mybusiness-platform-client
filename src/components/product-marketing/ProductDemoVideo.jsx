import { useTranslation } from "react-i18next";
import "./productDemoVideo.css";

const COPY = {
  crm: {
    en: "Recorded in Bizuply. The interface is English. A demo lead is updated, noted, and given a follow-up task.",
    he: "צולם בתוך ביזאפלי. הממשק בסרטון באנגלית. ליד הדגמה משנה סטטוס, מקבל הערה ומשימת מעקב.",
    es: "Grabado dentro de Bizuply. La interfaz del video está en inglés. Un lead de demostración cambia de estado, recibe una nota y una tarea.",
    "pt-br": "Gravado dentro da Bizuply. A interface do vídeo está em inglês. Um lead de demonstração muda de status, recebe uma nota e uma tarefa.",
    ar: "مُسجَّل داخل Bizuply. واجهة الفيديو بالإنجليزية. عميل محتمل تجريبي تتغير حالته، مع ملاحظة ومهمة متابعة.",
  },
  automations: {
    en: "Recorded in Bizuply. A new-lead trigger, a status condition, and a CRM task are saved. Run history is the screen where results appear.",
    he: "צולם בתוך ביזאפלי. טריגר של ליד חדש, תנאי סטטוס ומשימת CRM נשמרים. היסטוריית ההרצות היא המסך שבו מופיעות התוצאות.",
    es: "Grabado dentro de Bizuply. Se guardan un disparador de lead nuevo, una condición de estado y una tarea de CRM. El historial muestra los resultados.",
    "pt-br": "Gravado dentro da Bizuply. Um gatilho de novo lead, uma condição de status e uma tarefa de CRM são salvos. O histórico mostra os resultados.",
    ar: "مُسجَّل داخل Bizuply. يُحفظ مشغّل عميل محتمل جديد وشرط حالة ومهمة CRM. سجل التشغيل هو الشاشة التي تظهر فيها النتائج.",
  },
  websites: {
    en: "Recorded in the website studio. A template is opened, a section is added, the site is saved, and the phone preview is shown.",
    he: "צולם בסטודיו האתרים. תבנית נפתחת, מקטע נוסף, האתר נשמר, ומוצגת תצוגה בטלפון.",
    es: "Grabado en el estudio web. Se abre una plantilla, se añade una sección, se guarda el sitio y se muestra la vista de teléfono.",
    "pt-br": "Gravado no estúdio de sites. Um modelo é aberto, uma seção é adicionada, o site é salvo e a prévia do telefone aparece.",
    ar: "مُسجَّل في استوديو المواقع. يُفتح قالب، ويُضاف قسم، ويُحفظ الموقع، ثم تظهر معاينة الهاتف.",
  },
  campaigns: {
    en: "Recorded in Bizuply’s campaign manager. Budget, results, and an ad set are opened, then the related lead in the CRM. The figures are isolated demo data. No campaign was published and nothing was spent.",
    he: "צולם במנהל הקמפיינים של ביזאפלי. נפתחים תקציב, תוצאות וקבוצת מודעות, ואחר כך הליד ב-CRM. המספרים הם נתוני הדגמה מבודדים. לא פורסם קמפיין ולא בוצע חיוב.",
    es: "Grabado en el administrador de campañas de Bizuply. Se abren presupuesto, resultados y un conjunto, y después el lead en el CRM. Las cifras son de la demo aislada. No se publicó ni se gastó nada.",
    "pt-br": "Gravado no gerenciador de campanhas da Bizuply. Orçamento, resultados e um conjunto são abertos, e depois o lead no CRM. Os números são da demo isolada. Nada foi publicado nem cobrado.",
    ar: "مُسجَّل في مدير الحملات داخل Bizuply. تُفتح الميزانية والنتائج ومجموعة الإعلانات، ثم العميل المحتمل في CRM. الأرقام من العرض المعزول. لم تُنشر حملة ولم يُنفق شيء.",
  },
  whatsapp: {
    en: "Recorded in Bizuply. Templates and the inbox use the isolated demo number. No WhatsApp message was sent.",
    he: "צולם בתוך ביזאפלי. התבניות ותיבת השיחות משתמשות במספר ההדגמה המבודד. לא נשלחה הודעת WhatsApp.",
    es: "Grabado dentro de Bizuply. Las plantillas y la bandeja usan el número de la demo aislada. No se envió ningún mensaje de WhatsApp.",
    "pt-br": "Gravado dentro da Bizuply. Os modelos e a caixa de entrada usam o número da demo isolada. Nenhuma mensagem de WhatsApp foi enviada.",
    ar: "مُسجَّل داخل Bizuply. القوالب وصندوق المحادثات يستخدمان الرقم التجريبي المعزول. لم تُرسل رسالة WhatsApp.",
  },
  appointments: {
    en: "Recorded in Bizuply. A demo appointment is created for a demo client and remains on the calendar.",
    he: "צולם בתוך ביזאפלי. נוצר תור הדגמה ללקוח הדגמה, והוא נשאר ביומן.",
    es: "Grabado dentro de Bizuply. Se crea una cita de demostración para un cliente de demostración y queda en el calendario.",
    "pt-br": "Gravado dentro da Bizuply. Um agendamento de demonstração é criado para um cliente de demonstração e permanece na agenda.",
    ar: "مُسجَّل داخل Bizuply. يُنشأ موعد تجريبي لعميل تجريبي ويبقى في التقويم.",
  },
};

const TRACKS = [
  ["en", "en", "English"],
  ["he", "he", "עברית"],
  ["es", "es", "Español"],
  ["pt-br", "pt-BR", "Português"],
  ["ar", "ar", "العربية"],
];

export function demoMediaLocale(language) {
  const value = String(language || "en").toLowerCase();
  if (value.startsWith("he")) return "he";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("pt")) return "pt-br";
  if (value.startsWith("ar")) return "ar";
  return "en";
}

export default function ProductDemoVideo({ moduleId }) {
  const { i18n } = useTranslation();
  const locale = demoMediaLocale(i18n.language);
  const copy = COPY[moduleId][locale] || COPY[moduleId].en;
  const src = `/demo-media/${moduleId}/${moduleId}-${locale}.mp4`;

  return (
    <figure className="pdv">
      <video
        key={src}
        className="pdv__video"
        controls
        playsInline
        preload="none"
        poster={`/demo-media/${moduleId}/poster.jpg`}
      >
        <source src={src} type="video/mp4" />
        {TRACKS.map(([fileLocale, srcLang, label]) => (
          <track
            key={fileLocale}
            kind="subtitles"
            src={`/demo-media/${moduleId}/${moduleId}.${fileLocale}.vtt`}
            srcLang={srcLang}
            label={label}
            default={fileLocale === locale}
          />
        ))}
      </video>
      <figcaption className="pdv__caption">{copy}</figcaption>
    </figure>
  );
}
