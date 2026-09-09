function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

function product(name, description, extra = {}) {
  return { name, description, ...extra };
}

const CATEGORIES = {
  website: row("Website and digital presence", "אתר ונוכחות דיגיטלית", "Sitio y presencia digital", "Site e presença digital", "الموقع والحضور الرقمي"),
  crm: row("CRM and client management", "CRM וניהול לקוחות", "CRM y gestión de clientes", "CRM e gestão de clientes", "CRM وإدارة العملاء"),
  automations: row("Automations", "אוטומציות", "Automatizaciones", "Automações", "الأتمتة"),
  whatsapp: row("WhatsApp and messaging", "WhatsApp ותקשורת", "WhatsApp y comunicación", "WhatsApp e comunicação", "واتساب والتواصل"),
  ai: row("AI", "AI", "IA", "IA", "ذكاء اصطناعي"),
  store: row("Sales and store", "מכירות וחנות", "Ventas y tienda", "Vendas e loja", "المبيعات والمتجر"),
  personal: row("Client portal", "אזור אישי", "Área personal", "Área pessoal", "المنطقة الشخصية"),
  marketing: row("Marketing", "שיווק", "Marketing", "Marketing", "التسويق"),
  plugins: row("Plugins", "תוספים", "Complementos", "Plugins", "إضافات"),
  professional: row("Professional services", "שירותים מקצועיים", "Servicios profesionales", "Serviços profissionais", "خدمات احترافية"),
};

const PLAN_NAMES = {
  partner_basic: row("Partner", "Partner", "Partner", "Partner", "Partner"),
  partner_pro: row("Partner Pro", "Partner Pro", "Partner Pro", "Partner Pro", "Partner Pro"),
  partner_premium: row("Partner Premium", "Partner Premium", "Partner Premium", "Partner Premium", "Partner Premium"),
  partner_percent: row("Percent only", "אחוזים בלבד", "Solo porcentaje", "Somente percentual", "نسبة فقط"),
};

const AUTOMATION_PLAN_NAMES = {
  automation_basic_39_ils: row("Automation Basic", "אוטומציה בסיסית", "Automatización Basic", "Automação Basic", "الأتمتة الأساسية"),
  automation_growth_79_ils: row("Automation Growth", "אוטומציה צמיחה", "Automatización Growth", "Automação Growth", "الأتمتة للنمو"),
  automation_pro_149_ils: row("Automation Pro", "אוטומציה Pro", "Automatización Pro", "Automação Pro", "الأتمتة Pro"),
};

const PRODUCTS = {
  monthly: product(
    row("Business system license", "רישיון שימוש במערכת", "Licencia del sistema de negocio", "Licença do sistema de negócio", "رخصة نظام الأعمال"),
    row("₪149 per month — renewing monthly billing", "149₪ לחודש — חיוב חודשי מתחדש", "₪149 al mes — facturación mensual renovable", "₪149 por mês — cobrança mensal recorrente", "₪149 شهرياً — فوترة شهرية متجددة"),
    {
      tagline: row(
        "A full business-management license — CRM, leads, appointments, automations, and more.",
        "רישיון שימוש במערכת ניהול עסק מלאה — CRM, לידים, תורים, אוטומציות ועוד.",
        "Licencia completa de gestión — CRM, leads, citas, automatizaciones y más.",
        "Licença completa de gestão — CRM, leads, agendamentos, automações e mais.",
        "رخصة إدارة أعمال كاملة — CRM وعملاء محتملون ومواعيد وأتمتة والمزيد."
      ),
      included: [
        row("CRM", "CRM", "CRM", "CRM", "CRM"),
        row("Leads", "לידים", "Leads", "Leads", "عملاء محتملون"),
        row("Appointments", "תורים", "Citas", "Agendamentos", "مواعيد"),
        row("Automations", "אוטומציות", "Automatizaciones", "Automações", "الأتمتة"),
        row("AI Assistant", "AI Assistant", "Asistente de IA", "Assistente de IA", "مساعد الذكاء الاصطناعي"),
        row("Managed WhatsApp", "WhatsApp מנוהל", "WhatsApp gestionado", "WhatsApp gerenciado", "واتساب مُدار"),
        row("Collaborations", "שיתופי פעולה", "Colaboraciones", "Colaborações", "تعاونات"),
      ],
    }
  ),
  yearly: product(
    row("Business system license (annual)", "רישיון שימוש במערכת (שנתי)", "Licencia del sistema (anual)", "Licença do sistema (anual)", "رخصة النظام (سنوية)"),
    row("₪1,490 per year — renewing yearly billing", "1,490₪ לשנה — חיוב שנתי מתחדש", "₪1,490 al año — facturación anual renovable", "₪1.490 por ano — cobrança anual recorrente", "₪1,490 سنوياً — فوترة سنوية متجددة"),
    {
      tagline: row(
        "The same system license, billed yearly.",
        "אותו רישיון שימוש במערכת בחיוב שנתי.",
        "La misma licencia del sistema, facturada anualmente.",
        "A mesma licença do sistema, cobrada anualmente.",
        "نفس رخصة النظام بفوترة سنوية."
      ),
      included: [
        row("CRM", "CRM", "CRM", "CRM", "CRM"),
        row("Leads", "לידים", "Leads", "Leads", "عملاء محتملون"),
        row("Appointments", "תורים", "Citas", "Agendamentos", "مواعيد"),
        row("Automations", "אוטומציות", "Automatizaciones", "Automações", "الأتمتة"),
        row("AI Assistant", "AI Assistant", "Asistente de IA", "Assistente de IA", "مساعد الذكاء الاصطناعي"),
        row("Managed WhatsApp", "WhatsApp מנוהל", "WhatsApp gestionado", "WhatsApp gerenciado", "واتساب مُدار"),
        row("Collaborations", "שיתופי פעולה", "Colaboraciones", "Colaborações", "تعاونات"),
      ],
    }
  ),
  crm_only_monthly: product(
    row("CRM only", "CRM בלבד", "Solo CRM", "Somente CRM", "CRM فقط"),
    row("₪89 per month — renewing monthly billing · CRM only", "89₪ לחודש — חיוב חודשי מתחדש · CRM בלבד", "₪89 al mes — facturación mensual · solo CRM", "₪89 por mês — cobrança mensal · somente CRM", "₪89 شهرياً — فوترة شهرية · CRM فقط")
  ),
  earlybird: product(
    row("Early Bird monthly (inactive)", "חבילה חודשית Early Bird (לא פעיל)", "Mensual Early Bird (inactivo)", "Mensal Early Bird (inativo)", "شهري Early Bird (غير نشط)"),
    row("Launch price — disabled, not purchasable", "מחיר השקה — מושבת, לא ניתן לרכישה", "Precio de lanzamiento — desactivado, no se puede comprar", "Preço de lançamento — desativado, não dá para comprar", "سعر الإطلاق — معطّل وغير قابل للشراء")
  ),
  website_only: product(
    row("Website only", "אתר בלבד", "Solo sitio", "Somente site", "الموقع فقط"),
    row(
      "₪600 per year — one-time payment, no commitment and no auto-renewal · includes free domain for the first year",
      "600₪ לשנה — תשלום חד־פעמי, ללא התחייבות וללא חידוש אוטומטי · כולל דומיין חינם לשנה הראשונה",
      "₪600 al año — pago único, sin compromiso ni renovación automática · incluye dominio gratis el primer año",
      "₪600 por ano — pagamento único, sem compromisso e sem renovação automática · inclui domínio grátis no primeiro ano",
      "₪600 سنوياً — دفعة لمرة واحدة دون التزام ودون تجديد تلقائي · يشمل نطاقاً مجانياً للسنة الأولى"
    ),
    {
      tagline: row(
        "Website build and domain management — without CRM modules.",
        "בניית אתר וניהול דומיין — בלי מודולי CRM.",
        "Creación de sitio y dominio — sin módulos de CRM.",
        "Criação de site e domínio — sem módulos de CRM.",
        "بناء موقع وإدارة النطاق — دون وحدات CRM."
      ),
      included: [
        row("Website builder", "בונה אתרים", "Constructor de sitios", "Criador de sites", "منشئ المواقع"),
        row("Domain", "דומיין", "Dominio", "Domínio", "النطاق"),
      ],
    }
  ),
  website_addon: product(
    row("Website add-on", "תוספת אתר", "Complemento de sitio", "Complemento de site", "إضافة موقع"),
    row(
      "₪550 one-time — self-serve website as a business-plan add-on · includes free domain for 1 year",
      "550₪ חד־פעמי — בניית אתר עצמאי כתוספת לחבילה העסקית · כולל דומיין חינם לשנה",
      "₪550 único — sitio de autoservicio como extra del plan · incluye dominio gratis 1 año",
      "₪550 único — site self-serve como extra do plano · inclui domínio grátis por 1 ano",
      "₪550 لمرة واحدة — موقع ذاتي الخدمة كإضافة للخطة · يشمل نطاقاً مجانياً لسنة"
    )
  ),
  push_notifications_monthly_29_ils: product(
    row("Push notifications — monthly", "התראות Push — חודשי", "Notificaciones push — mensual", "Notificações push — mensal", "إشعارات الدفع — شهري"),
    row("₪29 / month — 7-day trial, renewing monthly", "29₪ לחודש — 7 ימי ניסיון, חיוב חודשי מתחדש", "₪29 / mes — 7 días de prueba, facturación mensual", "₪29 / mês — 7 dias de teste, cobrança mensal", "₪29 / شهر — تجربة 7 أيام، فوترة شهرية")
  ),
  push_notifications_annual_228_ils: product(
    row("Push notifications — annual", "התראות Push — שנתי", "Notificaciones push — anual", "Notificações push — anual", "إشعارات الدفع — سنوي"),
    row("₪228 / year (equiv. ₪19/mo) — 7-day trial, billed annually", "228₪ לשנה (שווה ערך ל־19₪ לחודש) — 7 ימי ניסיון, חיוב שנתי מראש", "₪228 / año (equiv. ₪19/mes) — 7 días de prueba, anual", "₪228 / ano (equiv. ₪19/mês) — 7 dias de teste, anual", "₪228 / سنة (يعادل ₪19/شهر) — تجربة 7 أيام، سنوي")
  ),
  client_portal_monthly_199_ils: product(
    row("Client portal", "אזור אישי", "Área personal", "Área pessoal", "المنطقة الشخصية"),
    row("₪199 / month — renewing client portal add-on", "199 ₪ לחודש — מנוי מתחדש לאזור אישי באתר", "₪199 / mes — extra de área personal renovable", "₪199 / mês — extra de área pessoal recorrente", "₪199 / شهر — إضافة منطقة شخصية متجددة")
  ),
  automations_setup_1_390_ils: product(
    row("Automations setup (1)", "הקמת אוטומציה אחת", "Configuración de 1 automatización", "Configuração de 1 automação", "إعداد أتمتة واحدة"),
    row("Setup of one business automation", "הקמה והגדרה של אוטומציה עסקית אחת", "Configuración de una automatización de negocio", "Configuração de uma automação de negócio", "إعداد أتمتة أعمال واحدة")
  ),
  automations_setup_3_890_ils: product(
    row("Automations setup (3)", "חבילת 3 אוטומציות", "Paquete de 3 automatizaciones", "Pacote de 3 automações", "باقة 3 أتمتات"),
    row("Setup of three business automations", "הקמה והגדרה של 3 אוטומציות עסקיות", "Configuración de tres automatizaciones", "Configuração de três automações", "إعداد ثلاث أتمتات أعمال")
  ),
  automations_setup_6_1490_ils: product(
    row("Automations setup (6)", "חבילת 6 אוטומציות", "Paquete de 6 automatizaciones", "Pacote de 6 automações", "باقة 6 أتمتات"),
    row("Setup of six business automations", "הקמה והגדרה של 6 אוטומציות עסקיות", "Configuración de seis automatizaciones", "Configuração de seis automações", "إعداد ست أتمتات أعمال")
  ),
  crm_migration_790_ils: product(
    row("CRM migration", "מעבר ממערכת CRM אחרת", "Migración de CRM", "Migração de CRM", "ترحيل CRM"),
    row("Transfer clients, leads, and statuses from an existing CRM", "העברת לקוחות, לידים וסטטוסים ממערכת קיימת", "Traslado de clientes, leads y estados desde un CRM existente", "Transferência de clientes, leads e status de um CRM existente", "نقل العملاء والعملاء المحتملين والحالات من CRM قائم")
  ),
  expert_website_build_1490_ils: product(
    row("Expert website build", "בניית אתר על ידי מומחה", "Sitio creado por un experto", "Site criado por um especialista", "بناء موقع بواسطة خبير"),
    row("Professional website built by a BizUply expert", "בניית אתר מקצועי על ידי מומחה BizUply", "Sitio profesional creado por un experto de BizUply", "Site profissional criado por um especialista da BizUply", "موقع احترافي يبنيه خبير BizUply")
  ),
  store_products_upload_490_ils: product(
    row("Store products upload (up to 20)", "העלאת מוצרים לחנות (עד 20)", "Subida de productos (hasta 20)", "Envio de produtos (até 20)", "رفع منتجات للمتجر (حتى 20)"),
    row("Upload up to 20 products with images, categories, and prices", "העלאת עד 20 מוצרים עם תמונות, קטגוריות ומחירים", "Sube hasta 20 productos con imágenes, categorías y precios", "Envie até 20 produtos com imagens, categorias e preços", "رفع حتى 20 منتجاً مع صور وفئات وأسعار")
  ),
  store_products_upload_50_990_ils: product(
    row("Store products upload (up to 50)", "העלאת מוצרים לחנות (עד 50)", "Subida de productos (hasta 50)", "Envio de produtos (até 50)", "رفع منتجات للمتجر (حتى 50)"),
    row("Upload up to 50 products with images, categories, and prices", "העלאת עד 50 מוצרים עם תמונות, קטגוריות ומחירים", "Sube hasta 50 productos con imágenes, categorías y precios", "Envie até 50 produtos com imagens, categorias e preços", "رفع حتى 50 منتجاً مع صور وفئات وأسعار")
  ),
  old_leads_followup_590_ils: product(
    row("Old leads follow-up (50)", "פולואפים ללידים ישנים (50)", "Seguimiento de leads antiguos (50)", "Follow-up de leads antigos (50)", "متابعة العملاء المحتملين القدامى (50)"),
    row("Re-engage old leads and verify relevance — up to 50 leads", "חזרה ללידים ישנים ובדיקת רלוונטיות — עד 50 לידים", "Reactivar leads antiguos y comprobar relevancia — hasta 50", "Reativar leads antigos e verificar relevância — até 50", "إعادة تفعيل العملاء المحتملين القدامى والتحقق من الصلة — حتى 50")
  ),
  old_leads_followup_100_990_ils: product(
    row("Old leads follow-up (up to 100)", "פולואפים ללידים ישנים (עד 100)", "Seguimiento de leads antiguos (hasta 100)", "Follow-up de leads antigos (até 100)", "متابعة العملاء المحتملين القدامى (حتى 100)"),
    row("Re-engage old leads and verify relevance — up to 100 leads", "חזרה ללידים ישנים ובדיקת רלוונטיות — עד 100 לידים", "Reactivar leads antiguos y comprobar relevancia — hasta 100", "Reativar leads antigos e verificar relevância — até 100", "إعادة تفعيل العملاء المحتملين القدامى والتحقق من الصلة — حتى 100")
  ),
  lead_response_690_ils_monthly: product(
    row("Lead first response (monthly)", "מענה ראשוני ללידים", "Primera respuesta a leads (mensual)", "Primeira resposta a leads (mensal)", "الرد الأولي على العملاء المحتملين (شهري)"),
    row("Human agent responds to new leads and updates the CRM", "נציג אנושי חוזר ללידים חדשים ומעדכן ב-CRM", "Un agente humano responde a leads nuevos y actualiza el CRM", "Um agente humano responde a leads novos e atualiza o CRM", "مندوب بشري يرد على العملاء المحتملين الجدد ويحدّث CRM")
  ),
  collaboration_manager_790_ils_monthly: product(
    row("Collaboration manager (monthly)", "מנהל שיתופי פעולה אישי", "Gestor de colaboraciones (mensual)", "Gestor de colaborações (mensal)", "مدير التعاونات (شهري)"),
    row("Find partners and manage collaborations", "איתור שותפים וליווי שיתופי פעולה", "Encontrar socios y gestionar colaboraciones", "Encontrar parceiros e gerenciar colaborações", "إيجاد شركاء وإدارة التعاونات")
  ),
  personal_sales_rep_1490_ils_monthly: product(
    row("Personal sales rep (monthly)", "נציג מכירות אישי", "Comercial personal (mensual)", "Representante de vendas pessoal (mensal)", "مندوب مبيعات شخصي (شهري)"),
    row("Personal sales representative through to close", "נציג מכירות אישי עד לסגירה", "Comercial personal hasta el cierre", "Representante de vendas até o fechamento", "مندوب مبيعات شخصي حتى الإغلاق")
  ),
  automation_basic_39_ils: product(
    row("Automation Basic", "אוטומציה בסיסית", "Automatización Basic", "Automação Basic", "الأتمتة الأساسية"),
    row("2,500 automation actions per month", "2,500 פעולות בחודש", "2.500 acciones de automatización al mes", "2.500 ações de automação por mês", "2,500 إجراء أتمتة شهرياً")
  ),
  automation_growth_79_ils: product(
    row("Automation Growth", "אוטומציה צמיחה", "Automatización Growth", "Automação Growth", "الأتمتة للنمو"),
    row("10,000 automation actions per month", "10,000 פעולות בחודש", "10.000 acciones de automatización al mes", "10.000 ações de automação por mês", "10,000 إجراء أتمتة شهرياً")
  ),
  automation_pro_149_ils: product(
    row("Automation Pro", "אוטומציה Pro", "Automatización Pro", "Automação Pro", "الأتمتة Pro"),
    row("30,000 automation actions per month", "30,000 פעולות בחודש", "30.000 acciones de automatización al mes", "30.000 ações de automação por mês", "30,000 إجراء أتمتة شهرياً")
  ),
  expert_website_extra_page_190_ils: product(
    row("Extra website page", "עמוד נוסף לאתר", "Página extra del sitio", "Página extra do site", "صفحة إضافية للموقع"),
    row("Additional page in the expert-built website", "עמוד נוסף באתר שנבנה על ידי מומחה", "Página adicional en el sitio creado por un experto", "Página adicional no site criado por um especialista", "صفحة إضافية في الموقع الذي بناه خبير")
  ),
  expert_website_content_writing_590_ils: product(
    row("Website content writing", "כתיבת תוכן לאתר", "Redacción de contenido del sitio", "Redação de conteúdo do site", "كتابة محتوى الموقع"),
    row("Marketing content writing for the website pages", "כתיבת תוכן שיווקי לעמודי האתר", "Redacción de contenido de marketing para las páginas", "Redação de conteúdo de marketing para as páginas", "كتابة محتوى تسويقي لصفحات الموقع")
  ),
  expert_website_basic_store_1490_ils: product(
    row("Basic online store", "חנות בסיסית לאתר", "Tienda online básica", "Loja online básica", "متجر إلكتروني أساسي"),
    row("Basic online store added to the website", "הקמת חנות אונליין בסיסית באתר", "Tienda online básica añadida al sitio", "Loja online básica adicionada ao site", "متجر إلكتروني أساسي يُضاف إلى الموقع")
  ),
  expert_website_advanced_design_2990_ils: product(
    row("Advanced website design", "עיצוב מתקדם לאתר", "Diseño avanzado del sitio", "Design avançado do site", "تصميم موقع متقدم"),
    row("Advanced, custom-tailored website design", "עיצוב מתקדם ומותאם אישית לאתר", "Diseño avanzado y a medida del sitio", "Design avançado e sob medida do site", "تصميم موقع متقدم ومخصص")
  ),
};

function pickProduct(skuDef, locale) {
  const out = {
    name: skuDef.name[locale] || skuDef.name.en,
    description: skuDef.description[locale] || skuDef.description.en,
  };
  if (skuDef.tagline) out.tagline = skuDef.tagline[locale] || skuDef.tagline.en;
  if (Array.isArray(skuDef.included)) {
    out.included = Object.fromEntries(
      skuDef.included.map((item, index) => [String(index), item[locale] || item.en])
    );
  }
  return out;
}

export function extraPartnerCatalogProductsLocaleObject(locale) {
  return {
    partner: {
      catalog: {
        categories: pickLocaleMap(CATEGORIES, locale),
        products: Object.fromEntries(
          Object.entries(PRODUCTS).map(([sku, def]) => [sku, pickProduct(def, locale)])
        ),
      },
      planNames: pickLocaleMap(PLAN_NAMES, locale),
    },
    automations: {
      billing: {
        planNames: pickLocaleMap(AUTOMATION_PLAN_NAMES, locale),
      },
    },
  };
}
