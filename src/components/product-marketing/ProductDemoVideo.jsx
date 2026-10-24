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
    en: "Recorded in Bizuply. The trigger is a lead status change to Contacted, the action creates a CRM task, and the run history shows Success.",
    he: "צולם בתוך ביזאפלי. הטריגר הוא שינוי סטטוס ליד ל-Contacted, הפעולה יוצרת משימת CRM, והיסטוריית ההרצות מציגה הצלחה.",
    es: "Grabado dentro de Bizuply. El disparador es un cambio de estado a Contacted, la acción crea una tarea de CRM y el historial muestra Success.",
    "pt-br": "Gravado dentro da Bizuply. O gatilho é uma mudança de status para Contacted, a ação cria uma tarefa de CRM e o histórico mostra Success.",
    ar: "مُسجَّل داخل Bizuply. المشغّل هو تغيّر الحالة إلى Contacted، والإجراء ينشئ مهمة CRM، ويظهر سجل التشغيل كنجاح.",
  },
  websites: {
    en: "Recorded in the website studio. The headline and its color change, the page is saved, and the same result is previewed on desktop and on a phone.",
    he: "צולם בסטודיו האתרים. הכותרת והצבע שלה משתנים, העמוד נשמר, ואותה תוצאה מוצגת במחשב ובטלפון.",
    es: "Grabado en el estudio web. Cambian el título y su color, la página se guarda y el mismo resultado se previsualiza en escritorio y en el teléfono.",
    "pt-br": "Gravado no estúdio de sites. O título e a cor mudam, a página é salva e o mesmo resultado aparece no computador e no telefone.",
    ar: "مُسجَّل في استوديو المواقع. يتغير العنوان ولونه، وتُحفظ الصفحة، وتظهر النتيجة نفسها على الحاسوب والهاتف.",
  },
  campaigns: {
    en: "Recorded in Bizuply’s campaign manager. Ad sets, ads, budget, targeting, and results are demo data. No live Meta call was made and nothing was spent.",
    he: "צולם במנהל הקמפיינים של ביזאפלי. קבוצות מודעות, מודעות, תקציב, מיקוד ותוצאות הם נתוני הדגמה. לא בוצעה קריאה חיה ל-Meta ולא בוצעה הוצאה.",
    es: "Grabado en el administrador de campañas de Bizuply. Conjuntos, anuncios, presupuesto, segmentación y resultados son datos de demostración. No hubo llamada real a Meta ni gasto.",
    "pt-br": "Gravado no gerenciador de campanhas da Bizuply. Conjuntos, anúncios, orçamento, segmentação e resultados são dados de demonstração. Não houve chamada real à Meta nem gasto.",
    ar: "مُسجَّل في مدير الحملات داخل Bizuply. المجموعات والإعلانات والميزانية والاستهداف والنتائج بيانات تجريبية. لم يُجرَ اتصال حي بـ Meta ولم يُنفق شيء.",
  },
  whatsapp: {
    en: "Recorded in Bizuply. A template is opened and a reply is saved in the demo thread. The product labels it as not sent. WhatsApp was not called.",
    he: "צולם בתוך ביזאפלי. תבנית נפתחת ותשובה נשמרת בשיחת ההדגמה. המוצר מסמן שהיא לא נשלחה. לא בוצעה קריאה ל-WhatsApp.",
    es: "Grabado dentro de Bizuply. Se abre una plantilla y una respuesta se guarda en el hilo de demo. El producto indica que no se envió. No se llamó a WhatsApp.",
    "pt-br": "Gravado dentro da Bizuply. Um modelo é aberto e uma resposta é salva na conversa de demo. O produto indica que não foi enviada. O WhatsApp não foi chamado.",
    ar: "مُسجَّل داخل Bizuply. يُفتح قالب ويُحفظ رد في المحادثة التجريبية. يوضح المنتج أنه لم يُرسل. لم تُجرَ مكالمة إلى WhatsApp.",
  },
  appointments: {
    en: "Recorded in Bizuply. A demo booking is created, the time is changed, and the updated time stays on the calendar.",
    he: "צולם בתוך ביזאפלי. נוצר תור הדגמה, השעה משתנה, והשעה המעודכנת נשארת ביומן.",
    es: "Grabado dentro de Bizuply. Se crea una reserva de demostración, se cambia la hora y la hora nueva queda en el calendario.",
    "pt-br": "Gravado dentro da Bizuply. Um horário de demonstração é criado, a hora muda e o horário atualizado permanece na agenda.",
    ar: "مُسجَّل داخل Bizuply. يُنشأ موعد تجريبي، ويتغير الوقت، ويبقى الوقت المحدَّث في التقويم.",
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
