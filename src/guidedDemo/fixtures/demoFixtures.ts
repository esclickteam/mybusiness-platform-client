import type { DemoLocale } from "../sessionStore";

type PerLocale<T> = Record<DemoLocale, T>;

/** Suggested values shown in the tour, keyed by step id. */
export const STEP_SUGGESTED: Record<string, PerLocale<string>> = {
  "crm-note-text": {
    en: "Spoke with the customer — interested in the couples photography package.",
    he: "דיברנו — מעוניין בחבילת צילום זוגי",
    es: "Hablé con el cliente — le interesa el paquete de fotografía de pareja.",
    "pt-BR": "Falei com o cliente — tem interesse no pacote de fotografia de casal.",
    ar: "تحدثت مع العميل — مهتم بباقة تصوير الأزواج.",
  },
  "services-name": {
    en: "Initial consultation",
    he: "ייעוץ ראשוני",
    es: "Consulta inicial",
    "pt-BR": "Consulta inicial",
    ar: "استشارة أولية",
  },
  "services-save": {
    en: "Initial consultation",
    he: "ייעוץ ראשוני",
    es: "Consulta inicial",
    "pt-BR": "Consulta inicial",
    ar: "استشارة أولية",
  },
  "site-headline": {
    en: "Photos that feel like you.",
    he: "תמונות שמרגישות כמוכם.",
    es: "Fotos que se sienten como tú.",
    "pt-BR": "Fotos que têm a sua cara.",
    ar: "صور تشبهك.",
  },
};

const LEAD_STATUS_UPDATED: PerLocale<string> = {
  en: "Great — the lead status was updated.",
  he: "מעולה — סטטוס הליד עודכן.",
  es: "Perfecto — se actualizó el estado del lead.",
  "pt-BR": "Ótimo — o status do lead foi atualizado.",
  ar: "رائع — تم تحديث حالة العميل المحتمل.",
};

/** Success toasts shown after a tour step completes, keyed by step id. */
export const STEP_SUCCESS: Record<string, PerLocale<string>> = {
  "dash-quick-action": {
    en: "A new lead went straight into the CRM.",
    he: "ליד חדש נכנס ישירות ל־CRM.",
    es: "Un nuevo lead entró directo al CRM.",
    "pt-BR": "Um novo lead entrou direto no CRM.",
    ar: "دخل عميل محتمل جديد مباشرة إلى CRM.",
  },
  "crm-status-contacted": LEAD_STATUS_UPDATED,
  "leads-status-interested": LEAD_STATUS_UPDATED,
  "crm-add-note": {
    en: "The note was saved to the customer card.",
    he: "ההערה נשמרה בכרטיס הלקוח.",
    es: "La nota se guardó en la ficha del cliente.",
    "pt-BR": "A nota foi salva na ficha do cliente.",
    ar: "تم حفظ الملاحظة في بطاقة العميل.",
  },
  "services-save": {
    en: "The service is ready to use in the calendar.",
    he: "השירות מוכן לשימוש ביומן.",
    es: "El servicio está listo para usarse en la agenda.",
    "pt-BR": "O serviço está pronto para uso na agenda.",
    ar: "الخدمة جاهزة للاستخدام في التقويم.",
  },
  "hours-save": {
    en: "Business hours saved. You can now book appointments.",
    he: "שעות הפעילות נשמרו. עכשיו אפשר לקבוע פגישות.",
    es: "Horario guardado. Ya puedes agendar citas.",
    "pt-BR": "Horário salvo. Agora você pode agendar compromissos.",
    ar: "تم حفظ ساعات العمل. يمكنك الآن حجز المواعيد.",
  },
  "cal-save": {
    en: "The appointment was added to the calendar.",
    he: "הפגישה נוספה ליומן.",
    es: "La cita se agregó a la agenda.",
    "pt-BR": "O compromisso foi adicionado à agenda.",
    ar: "تمت إضافة الموعد إلى التقويم.",
  },
  "auto-trigger": {
    en: "Great — the automation now knows when to run.",
    he: "מצוין — עכשיו האוטומציה יודעת מתי לפעול.",
    es: "Excelente — la automatización ya sabe cuándo ejecutarse.",
    "pt-BR": "Excelente — a automação já sabe quando agir.",
    ar: "ممتاز — أصبحت الأتمتة تعرف متى تعمل.",
  },
  "auto-action-email": {
    en: "The email action was added to the automation.",
    he: "פעולת האימייל נוספה לאוטומציה.",
    es: "La acción de correo se agregó a la automatización.",
    "pt-BR": "A ação de e-mail foi adicionada à automação.",
    ar: "تمت إضافة إجراء البريد الإلكتروني إلى الأتمتة.",
  },
  "auto-save": {
    en: "The automation is ready. In the demo it won't send real messages.",
    he: "האוטומציה מוכנה. בדמו היא לא תשלח הודעות אמיתיות.",
    es: "La automatización está lista. En la demo no enviará mensajes reales.",
    "pt-BR": "A automação está pronta. Na demo ela não enviará mensagens reais.",
    ar: "الأتمتة جاهزة. في العرض التجريبي لن ترسل رسائل حقيقية.",
  },
  "meta-publish": {
    en: "Campaign published in demo mode — nothing was sent to Meta.",
    he: "הקמפיין פורסם במצב דמו — שום דבר לא נשלח ל־Meta.",
    es: "Campaña publicada en modo demo — no se envió nada a Meta.",
    "pt-BR": "Campanha publicada no modo demo — nada foi enviado à Meta.",
    ar: "تم نشر الحملة في الوضع التجريبي — لم يُرسل أي شيء إلى Meta.",
  },
};

export type DemoServiceFixture = {
  name: string;
  description: string;
  duration: number;
  price: number;
};

export const SERVICE_FIXTURE: PerLocale<DemoServiceFixture> = {
  en: {
    name: "Initial consultation",
    description: "A 45-minute intro meeting to plan your shoot and choose the right package.",
    duration: 45,
    price: 120,
  },
  he: {
    name: "ייעוץ ראשוני",
    description: "פגישת היכרות של 45 דקות לתכנון הצילומים ובחירת החבילה המתאימה.",
    duration: 45,
    price: 450,
  },
  es: {
    name: "Consulta inicial",
    description: "Reunión inicial de 45 minutos para planificar la sesión y elegir el paquete ideal.",
    duration: 45,
    price: 120,
  },
  "pt-BR": {
    name: "Consulta inicial",
    description: "Reunião inicial de 45 minutos para planejar o ensaio e escolher o pacote ideal.",
    duration: 45,
    price: 120,
  },
  ar: {
    name: "استشارة أولية",
    description: "اجتماع تعارف مدته 45 دقيقة لتخطيط جلسة التصوير واختيار الباقة المناسبة.",
    duration: 45,
    price: 120,
  },
};

export type DemoCampaignFixture = {
  name: string;
  adSetName: string;
  adName: string;
  headline: string;
  primaryText: string;
  description: string;
  location: string;
  countryCode: string;
  interests: string[];
  customAudience: string;
  dailyBudget: number;
  ageMin: number;
  ageMax: number;
  instantFormName: string;
};

export const CAMPAIGN_FIXTURE: PerLocale<DemoCampaignFixture> = {
  en: {
    name: "Couples photography — spring leads",
    adSetName: "Couples 25–45 · Website visitors",
    adName: "Couples shoot — natural light",
    headline: "Book your couples shoot",
    primaryText:
      "Natural, relaxed couples photography in the studio or outdoors. Leave your details and we'll send available dates.",
    description: "Limited spring dates",
    location: "United States",
    countryCode: "US",
    interests: ["Weddings", "Photography", "Engagement"],
    customAudience: "Website visitors — last 30 days",
    dailyBudget: 25,
    ageMin: 25,
    ageMax: 45,
    instantFormName: "Couples shoot — quick form",
  },
  he: {
    name: "צילום זוגי — לידים לאביב",
    adSetName: "זוגות 25–45 · מבקרי האתר",
    adName: "צילום זוגי — אור טבעי",
    headline: "קבעו צילום זוגי",
    primaryText: "צילום זוגי טבעי ורגוע בסטודיו או בחוץ. השאירו פרטים ונשלח תאריכים פנויים.",
    description: "מספר תאריכים מוגבל באביב",
    location: "ישראל",
    countryCode: "IL",
    interests: ["חתונות", "צילום", "אירוסין"],
    customAudience: "מבקרי האתר — 30 הימים האחרונים",
    dailyBudget: 90,
    ageMin: 25,
    ageMax: 45,
    instantFormName: "צילום זוגי — טופס מהיר",
  },
  es: {
    name: "Fotografía de pareja — leads de primavera",
    adSetName: "Parejas 25–45 · Visitantes del sitio",
    adName: "Sesión de pareja — luz natural",
    headline: "Reserva tu sesión de pareja",
    primaryText:
      "Fotografía de pareja natural y relajada, en estudio o al aire libre. Deja tus datos y te enviaremos fechas disponibles.",
    description: "Fechas de primavera limitadas",
    location: "México",
    countryCode: "MX",
    interests: ["Bodas", "Fotografía", "Compromiso"],
    customAudience: "Visitantes del sitio — últimos 30 días",
    dailyBudget: 25,
    ageMin: 25,
    ageMax: 45,
    instantFormName: "Sesión de pareja — formulario rápido",
  },
  "pt-BR": {
    name: "Fotografia de casal — leads de primavera",
    adSetName: "Casais 25–45 · Visitantes do site",
    adName: "Ensaio de casal — luz natural",
    headline: "Agende seu ensaio de casal",
    primaryText:
      "Fotografia de casal natural e leve, em estúdio ou ao ar livre. Deixe seus dados e enviaremos as datas disponíveis.",
    description: "Datas de primavera limitadas",
    location: "Brasil",
    countryCode: "BR",
    interests: ["Casamentos", "Fotografia", "Noivado"],
    customAudience: "Visitantes do site — últimos 30 dias",
    dailyBudget: 25,
    ageMin: 25,
    ageMax: 45,
    instantFormName: "Ensaio de casal — formulário rápido",
  },
  ar: {
    name: "تصوير الأزواج — عملاء الربيع",
    adSetName: "الأزواج 25–45 · زوار الموقع",
    adName: "جلسة الأزواج — ضوء طبيعي",
    headline: "احجز جلسة تصوير للأزواج",
    primaryText:
      "تصوير طبيعي ومريح للأزواج في الاستوديو أو في الهواء الطلق. اترك بياناتك وسنرسل لك المواعيد المتاحة.",
    description: "مواعيد الربيع محدودة",
    location: "الإمارات العربية المتحدة",
    countryCode: "AE",
    interests: ["حفلات الزفاف", "التصوير", "الخطوبة"],
    customAudience: "زوار الموقع — آخر 30 يومًا",
    dailyBudget: 25,
    ageMin: 25,
    ageMax: 45,
    instantFormName: "جلسة الأزواج — نموذج سريع",
  },
};

export const DEMO_FIXTURES = {
  stepSuggested: STEP_SUGGESTED,
  stepSuccess: STEP_SUCCESS,
  service: SERVICE_FIXTURE,
  campaign: CAMPAIGN_FIXTURE,
};
