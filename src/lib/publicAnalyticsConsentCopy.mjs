/**
 * Proposed banner sentences for when content measurement is switched on.
 * They are not shown while VITE_PUBLIC_CONTENT_ANALYTICS is off, and they
 * do not replace the published privacy policy.
 */

export const ANALYTICS_CONSENT_COPY = {
  en: {
    noticeIntro: "Necessary cookies run the site. Analytics and advertising stay off until you allow each one. You can change or withdraw the choice at any time.",
    intro: "Necessary cookies stay on. Analytics and advertising are separate choices, and both start off.",
    analyticsDetail: "First-party measurement of guides, templates, calculators, and the path to pricing or registration. It uses a random identifier on this browser. It does not store your name, email, phone, form entries, calculator amounts, or IP address. Records are kept for 180 days and then deleted. Turning this off stops new events and deletes the events tied to this browser's identifier.",
    analyticsPurpose: "Counts content views, downloads, calculator use, and content-attributed registration after you allow analytics.",
    analyticsDuration: "Until you withdraw consent. Server records are deleted after 180 days.",
  },
  he: {
    noticeIntro: "עוגיות הכרחיות מפעילות את האתר. מדידה ופרסום נשארים כבויים עד שתאשרו כל אחד מהם. אפשר לשנות או לבטל את הבחירה בכל עת.",
    intro: "עוגיות הכרחיות נשארות פעילות. מדידה ופרסום הן שתי בחירות נפרדות, ושתיהן מתחילות כבויות.",
    analyticsDetail: "מדידה פנימית של מדריכים, תבניות, מחשבונים, והדרך אל המחיר או ההרשמה. נשמר מזהה אקראי בדפדפן הזה. לא נשמרים שם, דוא״ל, טלפון, שדות טפסים, סכומים שהוקלדו במחשבון או כתובת IP. הרשומות נשמרות 180 יום ואז נמחקות. כיבוי עוצר אירועים חדשים ומוחק את האירועים של המזהה בדפדפן הזה.",
    analyticsPurpose: "סופר צפיות בתוכן, הורדות, שימוש במחשבון והרשמה שמשויכת לתוכן, אחרי אישור מדידה.",
    analyticsDuration: "עד לביטול ההסכמה. רשומות בשרת נמחקות אחרי 180 יום.",
  },
  es: {
    noticeIntro: "Las cookies necesarias hacen funcionar el sitio. La medición y la publicidad permanecen apagadas hasta que permita cada una. Puede cambiar o retirar la elección en cualquier momento.",
    intro: "Las cookies necesarias siguen activas. La medición y la publicidad son elecciones separadas y ambas empiezan apagadas.",
    analyticsDetail: "Medición propia de guías, plantillas, calculadoras y el camino al precio o al registro. Usa un identificador aleatorio en este navegador. No guarda nombre, correo, teléfono, campos de formularios, importes de la calculadora ni la dirección IP. Los registros se conservan 180 días y después se borran.",
    analyticsPurpose: "Cuenta vistas, descargas, uso de calculadoras y registros atribuidos al contenido después de permitir la medición.",
    analyticsDuration: "Hasta que retire el consentimiento. Los registros del servidor se borran a los 180 días.",
  },
  "pt-BR": {
    noticeIntro: "Cookies necessários fazem o site funcionar. Medição e publicidade ficam desligadas até você permitir cada uma. É possível mudar ou retirar a escolha a qualquer momento.",
    intro: "Cookies necessários continuam ativos. Medição e publicidade são escolhas separadas e as duas começam desligadas.",
    analyticsDetail: "Medição própria de guias, modelos, calculadoras e o caminho até o preço ou o cadastro. Usa um identificador aleatório neste navegador. Não guarda nome, e-mail, telefone, campos de formulário, valores da calculadora nem endereço IP. Os registros ficam 180 dias e depois são apagados.",
    analyticsPurpose: "Conta visualizações, downloads, uso de calculadoras e cadastros atribuídos ao conteúdo depois da permissão.",
    analyticsDuration: "Até retirar o consentimento. Os registros do servidor são apagados após 180 dias.",
  },
  ar: {
    noticeIntro: "ملفات الارتباط الضرورية تشغّل الموقع. يبقى القياس والإعلان متوقفين حتى تسمحوا بكل واحد. يمكن تغيير الاختيار أو سحبه في أي وقت.",
    intro: "تبقى ملفات الارتباط الضرورية تعمل. القياس والإعلان خياران منفصلان، وكلاهما يبدأ متوقفاً.",
    analyticsDetail: "قياس داخلي للأدلة والقوالب والحاسبات والطريق إلى السعر أو التسجيل. يُستخدم معرّف عشوائي في هذا المتصفح. لا يُحفظ الاسم أو البريد أو الهاتف أو حقول النماذج أو مبالغ الحاسبة أو عنوان IP. تُحفظ السجلات 180 يوماً ثم تُحذف.",
    analyticsPurpose: "يحسب المشاهدات والتنزيلات واستخدام الحاسبة والتسجيل المرتبط بالمحتوى بعد السماح بالقياس.",
    analyticsDuration: "حتى سحب الموافقة. تُحذف سجلات الخادم بعد 180 يوماً.",
  },
};

export function analyticsConsentCopy(language) {
  const locale = language === "pt" ? "pt-BR" : language;
  return ANALYTICS_CONSENT_COPY[locale] || ANALYTICS_CONSENT_COPY.en;
}
