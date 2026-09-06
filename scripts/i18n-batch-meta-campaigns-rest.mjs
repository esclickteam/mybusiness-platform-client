function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const NAV = {
  mainAria: row(
    "Main navigation",
    "ניווט ראשי",
    "Navegación principal",
    "Navegação principal",
    "التنقل الرئيسي"
  ),
};

const PARTNER = {
  statusLabel: row("Status", "סטטוס", "Estado", "Status", "الحالة"),
};

const STUDIO = {
  pagesNav: row("Pages", "עמודים", "Páginas", "Páginas", "صفحات"),
  sitePagesNav: row("Site pages", "עמודי האתר", "Páginas del sitio", "Páginas do site", "صفحات الموقع"),
  pageChip: row("Page", "עמוד", "Página", "Página", "صفحة"),
};

const META_ACTIONS = {
  resume: row("Resume", "הפעלה מחדש", "Reanudar", "Retomar", "استئناف"),
  resumeHint: row("Resume this campaign", "הפעלה מחדש של הקמפיין", "Reanudar esta campaña", "Retomar esta campanha", "استئناف هذه الحملة"),
  pauseHint: row("Pause this campaign", "השהיית הקמפיין", "Pausar esta campaña", "Pausar esta campanha", "إيقاف هذه الحملة مؤقتاً"),
  confirmPauseTitle: row("Pause campaign?", "להשהות את הקמפיין?", "¿Pausar la campaña?", "Pausar a campanha?", "إيقاف الحملة مؤقتاً؟"),
  confirmPauseBody: row(
    "Pause {{name}} in Meta? Ads will stop running until you resume it.",
    "להשהות את {{name}} במטא? המודעות יופסקו עד שתפעילו מחדש.",
    "¿Pausar {{name}} en Meta? Los anuncios se detendrán hasta que la reanudes.",
    "Pausar {{name}} no Meta? Os anúncios param até você retomar.",
    "إيقاف {{name}} مؤقتاً في ميتا؟ ستتوقف الإعلانات حتى تستأنفوها."
  ),
  confirmResumeTitle: row("Resume campaign?", "להפעיל מחדש את הקמפיין?", "¿Reanudar la campaña?", "Retomar a campanha?", "استئناف الحملة؟"),
  confirmResumeBody: row(
    "Resume {{name}} in Meta? Ads will start running again with the saved settings.",
    "להפעיל מחדש את {{name}} במטא? המודעות יחזרו לרוץ לפי ההגדרות השמורות.",
    "¿Reanudar {{name}} en Meta? Los anuncios volverán a publicarse con los ajustes guardados.",
    "Retomar {{name}} no Meta? Os anúncios voltam a rodar com as configurações salvas.",
    "استئناف {{name}} في ميتا؟ ستعود الإعلانات للعمل حسب الإعدادات المحفوظة."
  ),
};

const META_EMPTY = {
  selectAccountTitle: row(
    "Select an ad account",
    "בחירת חשבון מודעות",
    "Selecciona una cuenta publicitaria",
    "Selecione uma conta de anúncios",
    "اختيار حساب إعلانات"
  ),
  selectAccountBody: row(
    "Choose a Meta ad account to load campaigns and performance.",
    "בחרו חשבון מודעות במטא כדי לטעון קמפיינים וביצועים.",
    "Elige una cuenta publicitaria de Meta para cargar campañas y resultados.",
    "Escolha uma conta de anúncios do Meta para carregar campanhas e resultados.",
    "اختاروا حساب إعلانات ميتا لتحميل الحملات والأداء."
  ),
  selectAccountCta: row(
    "Choose ad account",
    "בחירת חשבון מודעות",
    "Elegir cuenta publicitaria",
    "Escolher conta de anúncios",
    "اختيار حساب الإعلانات"
  ),
};

const META_ERRORS = {
  selectBusiness: row(
    "Could not save the Meta business",
    "שמירת העסק במטא נכשלה",
    "No se pudo guardar el negocio de Meta",
    "Não foi possível salvar o negócio do Meta",
    "تعذّر حفظ نشاط ميتا"
  ),
  statusNotPersisted: row(
    "Meta updated the campaign, but BizUply could not save the new status. Refresh and try again.",
    "מטא עדכנה את הקמפיין, אבל BizUply לא הצליחה לשמור את הסטטוס החדש. רעננו ונסו שוב.",
    "Meta actualizó la campaña, pero BizUply no pudo guardar el nuevo estado. Actualiza e inténtalo de nuevo.",
    "O Meta atualizou a campanha, mas o BizUply não conseguiu salvar o novo status. Atualize e tente de novo.",
    "حدّثت ميتا الحملة لكن تعذّر على BizUply حفظ الحالة الجديدة. حدّثوا الصفحة وحاولوا مرة أخرى."
  ),
};

const META_OVERVIEW = {
  lastUpdatedLabel: row("Last updated", "עודכן לאחרונה", "Última actualización", "Última atualização", "آخر تحديث"),
};

const META_REVIEW = {
  captionsAuth: row(
    "App Review · Facebook Login · ads_read · ads_management · business_management",
    "בדיקת אפליקציה · התחברות לפייסבוק · ads_read · ads_management · business_management",
    "Revisión de la app · Facebook Login · ads_read · ads_management · business_management",
    "Revisão do app · Facebook Login · ads_read · ads_management · business_management",
    "مراجعة التطبيق · تسجيل فيسبوك · ads_read · ads_management · business_management"
  ),
  captionsUse: row(
    "App Review · ads_read · ads_management · business_management",
    "בדיקת אפליקציה · ads_read · ads_management · business_management",
    "Revisión de la app · ads_read · ads_management · business_management",
    "Revisão do app · ads_read · ads_management · business_management",
    "مراجعة التطبيق · ads_read · ads_management · business_management"
  ),
  hideCaptions: row("Hide", "הסתרה", "Ocultar", "Ocultar", "إخفاء"),
  managementBadge: row("ads_management", "ads_management", "ads_management", "ads_management", "ads_management"),
  captionN: row("Caption {{n}}", "כיתוב {{n}}", "Leyenda {{n}}", "Legenda {{n}}", "تعليق {{n}}"),
  settingsCaption1: row(
    "The business owner signs in to BizUply, then starts Facebook Login to connect Meta Ads.",
    "בעל העסק נכנס ל-BizUply ואז מתחיל התחברות לפייסבוק כדי לחבר את Meta Ads.",
    "El dueño inicia sesión en BizUply y luego abre Facebook Login para conectar Meta Ads.",
    "O dono entra no BizUply e inicia o Facebook Login para conectar o Meta Ads.",
    "يسجّل صاحب العمل الدخول إلى BizUply ثم يبدأ تسجيل فيسبوك لربط إعلانات ميتا."
  ),
  settingsCaption2: row(
    "Facebook Login asks the user to grant ads_read, ads_management, and business_management.",
    "התחברות לפייסבוק מבקשת הרשאות ads_read, ads_management ו-business_management.",
    "Facebook Login pide ads_read, ads_management y business_management.",
    "O Facebook Login pede ads_read, ads_management e business_management.",
    "يطلب تسجيل فيسبوك صلاحيات ads_read وads_management وbusiness_management."
  ),
  settingsCaption3: row(
    "BizUply uses business_management to list Business Portfolios and the Ad Accounts owned or shared by the selected business.",
    "BizUply משתמשת ב-business_management כדי להציג תיקי עסקים וחשבונות מודעות שבבעלות העסק שנבחר או משותפים איתו.",
    "BizUply usa business_management para listar carteras de negocio y las cuentas publicitarias del negocio elegido.",
    "O BizUply usa business_management para listar portfólios e contas de anúncios do negócio escolhido.",
    "يستخدم BizUply business_management لعرض محافظ الأعمال وحسابات الإعلانات المملوكة أو المشتركة مع النشاط المختار."
  ),
  settingsCaption4: row(
    "After authorization, the user selects their Meta Business Portfolio, then the Ad Account used to retrieve and manage campaigns.",
    "אחרי האישור בוחרים תיק עסקים במטא ואז את חשבון המודעות שממנו נטענים ומנוהלים הקמפיינים.",
    "Tras autorizar, elige la cartera de Meta y luego la cuenta publicitaria para ver y gestionar campañas.",
    "Depois da autorização, escolha o portfólio do Meta e a conta de anúncios para ver e gerenciar campanhas.",
    "بعد التفويض يختار المستخدم محفظة أعمال ميتا ثم حساب الإعلانات لتحميل الحملات وإدارتها."
  ),
  overviewCaption1: row(
    "BizUply uses ads_read to retrieve the authenticated business's advertising campaigns and performance metrics from Meta.",
    "BizUply משתמשת ב-ads_read כדי לשלוף ממטא את הקמפיינים והמדדים של העסק המחובר.",
    "BizUply usa ads_read para traer de Meta las campañas y métricas del negocio autenticado.",
    "O BizUply usa ads_read para buscar no Meta as campanhas e métricas do negócio autenticado.",
    "يستخدم BizUply ads_read لجلب حملات النشاط المصادق عليه ومقاييس الأداء من ميتا."
  ),
  overviewCaption2: row(
    "The dashboard shows campaign names, statuses, spend, impressions, reach, clicks, and the selected date range.",
    "הלוח מציג שמות קמפיינים, סטטוסים, הוצאה, חשיפות, טווח, קליקים וטווח התאריכים שנבחר.",
    "El panel muestra nombres, estados, gasto, impresiones, alcance, clics y el rango de fechas.",
    "O painel mostra nomes, status, gasto, impressões, alcance, cliques e o período selecionado.",
    "تعرض اللوحة أسماء الحملات والحالات والإنفاق والظهور والوصول والنقرات ونطاق التاريخ."
  ),
  overviewCaption3: row(
    "BizUply uses ads_management so the business owner can pause or resume a campaign from BizUply.",
    "BizUply משתמשת ב-ads_management כדי שבעל העסק יוכל להשהות או להפעיל מחדש קמפיין מתוך BizUply.",
    "BizUply usa ads_management para pausar o reanudar una campaña desde BizUply.",
    "O BizUply usa ads_management para pausar ou retomar uma campanha pelo BizUply.",
    "يستخدم BizUply ads_management حتى يتمكن صاحب العمل من إيقاف حملة مؤقتاً أو استئنافها من BizUply."
  ),
  overviewCaption4: row(
    "After Pause or Resume, BizUply reads the campaign back from Meta and shows the updated status.",
    "אחרי השהיה או הפעלה מחדש BizUply קוראת שוב את הקמפיין ממטא ומציגה את הסטטוס המעודכן.",
    "Tras Pausar o Reanudar, BizUply vuelve a leer la campaña en Meta y muestra el estado actualizado.",
    "Depois de Pausar ou Retomar, o BizUply lê a campanha de novo no Meta e mostra o status atualizado.",
    "بعد الإيقاف المؤقت أو الاستئناف يقرأ BizUply الحملة من ميتا ويعرض الحالة المحدّثة."
  ),
};

const META_SETTINGS = {
  business: row("Meta business", "עסק במטא", "Negocio de Meta", "Negócio do Meta", "نشاط ميتا"),
  businessHint: row(
    "Choose the Meta Business Portfolio that owns or shares the ad accounts you will manage.",
    "בחרו את תיק העסקים במטא שבבעלותו או בשיתוף איתו חשבונות המודעות שתנהלו.",
    "Elige la cartera de Meta que posee o comparte las cuentas publicitarias que vas a gestionar.",
    "Escolha o portfólio do Meta que possui ou compartilha as contas de anúncios que você vai gerenciar.",
    "اختاروا محفظة أعمال ميتا التي تملك أو تشارك حسابات الإعلانات التي ستُدار."
  ),
  businessPlaceholder: row(
    "Select a Meta business",
    "בחירת עסק במטא",
    "Selecciona un negocio de Meta",
    "Selecione um negócio do Meta",
    "اختيار نشاط ميتا"
  ),
  businessTitle: row(
    "Meta Business Portfolio",
    "תיק עסקים במטא",
    "Cartera de negocio de Meta",
    "Portfólio de negócio do Meta",
    "محفظة أعمال ميتا"
  ),
  connectHint: row(
    "Sign in with Facebook Login and grant ads_read, ads_management, and business_management.",
    "התחברו עם פייסבוק ואשרו ads_read, ads_management ו-business_management.",
    "Inicia sesión con Facebook Login y concede ads_read, ads_management y business_management.",
    "Entre com o Facebook Login e conceda ads_read, ads_management e business_management.",
    "سجّلوا الدخول عبر فيسبوك وامنحوا ads_read وads_management وbusiness_management."
  ),
  grantedPermissions: row(
    "Granted permissions",
    "הרשאות שאושרו",
    "Permisos concedidos",
    "Permissões concedidas",
    "الصلاحيات الممنوحة"
  ),
  noBusinesses: row(
    "No Meta businesses were returned. Reconnect and grant business_management.",
    "לא חזרו עסקים ממטא. חברו מחדש ואשרו business_management.",
    "Meta no devolvió negocios. Vuelve a conectar y concede business_management.",
    "O Meta não devolveu negócios. Reconecte e conceda business_management.",
    "لم تُرجع ميتا أي أنشطة. أعيدوا الربط وامنحوا business_management."
  ),
  permissionWhyTitle: row(
    "Why these permissions",
    "למה ההרשאות האלה",
    "Por qué estos permisos",
    "Por que estas permissões",
    "لماذا هذه الصلاحيات"
  ),
  permissionWhyAdsRead: row(
    "ads_read — load campaigns and performance from Meta.",
    "ads_read — טעינת קמפיינים וביצועים ממטא.",
    "ads_read — cargar campañas y resultados desde Meta.",
    "ads_read — carregar campanhas e resultados do Meta.",
    "ads_read — تحميل الحملات والأداء من ميتا."
  ),
  permissionWhyAdsManagement: row(
    "ads_management — pause or resume campaigns from BizUply.",
    "ads_management — השהיה או הפעלה מחדש של קמפיינים מתוך BizUply.",
    "ads_management — pausar o reanudar campañas desde BizUply.",
    "ads_management — pausar ou retomar campanhas pelo BizUply.",
    "ads_management — إيقاف الحملات مؤقتاً أو استئنافها من BizUply."
  ),
  permissionWhyBusinessManagement: row(
    "business_management — list Business Portfolios and their ad accounts.",
    "business_management — הצגת תיקי עסקים וחשבונות המודעות שלהם.",
    "business_management — listar carteras de negocio y sus cuentas publicitarias.",
    "business_management — listar portfólios e suas contas de anúncios.",
    "business_management — عرض محافظ الأعمال وحسابات إعلاناتها."
  ),
  saveAccountHint: row(
    "Save the selected ad account for campaign management.",
    "שמירת חשבון המודעות שנבחר לניהול קמפיינים.",
    "Guardar la cuenta publicitaria seleccionada para gestionar campañas.",
    "Salvar a conta de anúncios selecionada para gerenciar campanhas.",
    "حفظ حساب الإعلانات المختار لإدارة الحملات."
  ),
  saveBusiness: row("Save Meta business", "שמירת עסק במטא", "Guardar negocio de Meta", "Salvar negócio do Meta", "حفظ نشاط ميتا"),
  saveBusinessHint: row(
    "Save the selected Meta Business Portfolio, then pick an ad account.",
    "שמירת תיק העסקים שנבחר במטא, ואז בחירת חשבון מודעות.",
    "Guarda la cartera de Meta y luego elige una cuenta publicitaria.",
    "Salve o portfólio do Meta e depois escolha uma conta de anúncios.",
    "احفظوا محفظة ميتا ثم اختاروا حساب إعلانات."
  ),
  selectBusinessRequired: row(
    "Please select a Meta business",
    "יש לבחור עסק במטא",
    "Selecciona un negocio de Meta",
    "Selecione um negócio do Meta",
    "يرجى اختيار نشاط ميتا"
  ),
  tokenInvalid: row(
    "The Meta token is no longer valid. Reconnect to continue.",
    "אסימון מטא אינו תקף יותר. חברו מחדש כדי להמשיך.",
    "El token de Meta ya no es válido. Vuelve a conectar para continuar.",
    "O token do Meta não é mais válido. Reconecte para continuar.",
    "رمز ميتا لم يعد صالحاً. أعيدوا الربط للمتابعة."
  ),
};

const META_TOASTS = {
  businessSelected: row(
    "Meta business saved",
    "העסק במטא נשמר",
    "Negocio de Meta guardado",
    "Negócio do Meta salvo",
    "تم حفظ نشاط ميتا"
  ),
};

export function extraMetaCampaignsRestLocaleObject(locale) {
  return {
    nav: pickLocaleMap(NAV, locale),
    partner: pickLocaleMap(PARTNER, locale),
    studio: pickLocaleMap(STUDIO, locale),
    metaCampaigns: {
      actions: pickLocaleMap(META_ACTIONS, locale),
      empty: pickLocaleMap(META_EMPTY, locale),
      errors: pickLocaleMap(META_ERRORS, locale),
      overview: pickLocaleMap(META_OVERVIEW, locale),
      review: pickLocaleMap(META_REVIEW, locale),
      settings: pickLocaleMap(META_SETTINGS, locale),
      toasts: pickLocaleMap(META_TOASTS, locale),
    },
  };
}
