function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const FEATURES = {
  website: {
    0: row(
      "Full visual website builder",
      "בונה אתרים עם עורך ויזואלי מלא",
      "Constructor visual completo de sitios",
      "Construtor visual completo de sites",
      "منشئ مواقع مرئي كامل"
    ),
    1: row(
      "Hundreds of ready-made industry templates",
      "מאות תבניות מוכנות לענפים שונים",
      "Cientos de plantillas listas por sector",
      "Centenas de modelos prontos por setor",
      "مئات القوالب الجاهزة حسب المجال"
    ),
    2: row(
      "Pages, sections, galleries, and forms",
      "עמודים, סקשנים, גלריות וטפסים",
      "Páginas, secciones, galerías y formularios",
      "Páginas, seções, galerias e formulários",
      "صفحات وأقسام ومعارض ونماذج"
    ),
    3: row(
      "Mobile, tablet, and desktop responsive",
      "התאמה למובייל, טאבלט ודסקטופ",
      "Adaptado a móvil, tablet y escritorio",
      "Adaptado a celular, tablet e desktop",
      "متوافق مع الجوال واللوحي وسطح المكتب"
    ),
    4: row(
      "Free domain for the first year",
      "דומיין חינם לשנה הראשונה",
      "Dominio gratis el primer año",
      "Domínio grátis no primeiro ano",
      "نطاق مجاني للسنة الأولى"
    ),
    5: row(
      "Publish to BizUply URL or your domain",
      "פרסום לכתובת BizUply או דומיין שלכם",
      "Publica en URL de BizUply o tu dominio",
      "Publique na URL da BizUply ou no seu domínio",
      "انشروا على رابط BizUply أو نطاقكم"
    ),
    6: row(
      "Site lead form linked to CRM",
      "טופס לידים מהאתר מקושר ל-CRM",
      "Formulario de leads del sitio conectado al CRM",
      "Formulário de leads do site ligado ao CRM",
      "نموذج العملاء المحتملين مرتبط بالـ CRM"
    ),
    7: row(
      "Built-in accessibility tools",
      "כלי נגישות מובנים",
      "Herramientas de accesibilidad incluidas",
      "Ferramentas de acessibilidade incluídas",
      "أدوات إتاحة مدمجة"
    ),
    8: row(
      "Basic page SEO",
      "SEO בסיסי לעמודים",
      "SEO básico de páginas",
      "SEO básico de páginas",
      "تحسين محركات بحث أساسي للصفحات"
    ),
    9: row(
      "Edit anytime on your own",
      "עריכה עצמאית בכל זמן",
      "Edita cuando quieras por tu cuenta",
      "Edite quando quiser por conta própria",
      "حرّروا بأنفسكم في أي وقت"
    ),
  },
  monthly: {
    0: row(
      "Professional business page on the platform",
      "עמוד עסק מקצועי בפלטפורמה",
      "Página de negocio profesional en la plataforma",
      "Página profissional do negócio na plataforma",
      "صفحة أعمال احترافية على المنصة"
    ),
    1: row(
      "CRM for leads and clients",
      "CRM לניהול לידים ולקוחות",
      "CRM para leads y clientes",
      "CRM para leads e clientes",
      "CRM للعملاء المحتملين والعملاء"
    ),
    2: row(
      "Appointments calendar and services",
      "יומן תורים ושירותים",
      "Calendario de citas y servicios",
      "Agenda de marcações e serviços",
      "تقويم المواعيد والخدمات"
    ),
    3: row(
      "Built-in messaging",
      "מערכת הודעות מובנית",
      "Mensajería integrada",
      "Mensagens integradas",
      "مراسلة مدمجة"
    ),
    4: row(
      "Reviews and ratings management",
      "ניהול ביקורות ודירוגים",
      "Gestión de reseñas y valoraciones",
      "Gestão de avaliações e notas",
      "إدارة التقييمات والمراجعات"
    ),
    5: row(
      "Business collaboration network",
      "רשת שיתופי פעולה עסקיים",
      "Red de colaboraciones de negocio",
      "Rede de colaborações de negócio",
      "شبكة تعاون تجاري"
    ),
    6: row(
      "Smart automations",
      "אוטומציות חכמות",
      "Automatizaciones inteligentes",
      "Automações inteligentes",
      "أتمتة ذكية"
    ),
    7: row(
      "BizUply AI advisor and insights",
      "היועץ העסקי + אוטומציות AI",
      "Asesor IA de BizUply e insights",
      "Consultor de IA da BizUply e insights",
      "مستشار الذكاء الاصطناعي ورؤى BizUply"
    ),
    8: row(
      "Tasks, call logging, and alerts",
      "משימות, תיעוד שיחות והתראות",
      "Tareas, registro de llamadas y alertas",
      "Tarefas, registo de chamadas e alertas",
      "مهام وتسجيل مكالمات وتنبيهات"
    ),
    9: row(
      "Analytics and performance dashboard",
      "אנליטיקה ודשבורד ביצועים",
      "Analítica y panel de rendimiento",
      "Análises e painel de desempenho",
      "تحليلات ولوحة أداء"
    ),
    10: row(
      "Option to add human agents",
      "אפשרות להוסיף נציגים אנושיים",
      "Opción de añadir agentes humanos",
      "Opção de adicionar agentes humanos",
      "إمكانية إضافة مندوبين بشريين"
    ),
    11: row(
      "Option to add website building separately",
      "אפשרות להוסיף בניית אתר בנפרד",
      "Opción de añadir el sitio por separado",
      "Opção de adicionar o site à parte",
      "إمكانية إضافة بناء الموقع بشكل منفصل"
    ),
  },
  yearly: {
    0: row(
      "Everything in the Business monthly package",
      "הכול מהחבילה העסקית החודשית",
      "Todo lo del paquete Business mensual",
      "Tudo do pacote Business mensal",
      "كل ما في باقة الأعمال الشهرية"
    ),
    1: row(
      "Meaningful yearly savings",
      "חיסכון שנתי משמעותי",
      "Ahorro anual significativo",
      "Poupança anual significativa",
      "توفير سنوي ملموس"
    ),
    2: row(
      "Full access to all business modules",
      "גישה מלאה לכל המודולים העסקיים",
      "Acceso completo a todos los módulos de negocio",
      "Acesso completo a todos os módulos de negócio",
      "وصول كامل إلى كل وحدات الأعمال"
    ),
    3: row(
      "CRM + appointments + collaborations + AI",
      "CRM + תורים + שיתופים + AI",
      "CRM + citas + colaboraciones + IA",
      "CRM + marcações + colaborações + IA",
      "CRM + مواعيد + تعاون + ذكاء اصطناعي"
    ),
    4: row(
      "Automations and alerts without limits",
      "אוטומציות והתראות ללא הגבלה",
      "Automatizaciones y alertas sin límites",
      "Automações e alertas sem limites",
      "أتمتة وتنبيهات بلا حدود"
    ),
    5: row(
      "Performance dashboard and analytics",
      "דשבורד ביצועים ואנליטיקה",
      "Panel de rendimiento y analítica",
      "Painel de desempenho e análises",
      "لوحة أداء وتحليلات"
    ),
    6: row(
      "Option to add website building separately",
      "אפשרות להוסיף בניית אתר בנפרד",
      "Opción de añadir el sitio por separado",
      "Opção de adicionar o site à parte",
      "إمكانية إضافة بناء الموقع بشكل منفصل"
    ),
    7: row(
      "Option to add additional business services",
      "אפשרות להוסיף שירותים נוספים לעסק",
      "Opción de añadir más servicios de negocio",
      "Opção de adicionar mais serviços de negócio",
      "إمكانية إضافة خدمات أعمال إضافية"
    ),
  },
};

const SHARED = {
  websiteContactMessage: row(
    "Hi, I’d like to start with the Website-only package at {{price}}/year (self-serve from template, linked to CRM).",
    "שלום, אשמח להתחיל עם חבילת בניית אתר בלבד ב־{{price}} לשנה (בניה עצמאית מתבנית, מקושר ל-CRM).",
    "Hola, me gustaría empezar con el paquete Solo sitio web a {{price}}/año (autoservicio desde plantilla, vinculado al CRM).",
    "Oi, gostaria de começar com o pacote Apenas website a {{price}}/ano (autoatendimento a partir do modelo, ligado ao CRM).",
    "مرحباً، أود البدء بحزمة الموقع فقط بسعر {{price}}/سنة (بناء ذاتي من قالب ومرتبط بالـ CRM)."
  ),
  websiteAddonLabel: row(
    "{{price}} one-time — self-serve website as a business-plan add-on",
    "{{price}} חד־פעמי — בניית אתר עצמאי כתוספת לחבילה העסקית",
    "{{price}} único — sitio de autoservicio como extra del plan Business",
    "{{price}} único — site self-serve como extra do plano Business",
    "{{price}} لمرة واحدة — موقع ذاتي كإضافة لباقة الأعمال"
  ),
  yearlyNote: row(
    "Renewing yearly billing · save {{savings}} vs monthly",
    "חיוב שנתי מתחדש · חיסכון של {{savings}} לעומת חודשי",
    "Facturación anual renovable · ahorra {{savings}} frente al mensual",
    "Cobrança anual renovável · poupe {{savings}} face ao mensal",
    "فوترة سنوية متجددة · وفّروا {{savings}} مقابل الشهري"
  ),
};

export function extraPricingFeaturesLocaleObject(locale) {
  return {
    pricing: {
      websiteContactMessage: SHARED.websiteContactMessage[locale],
      websiteAddon: {
        label: SHARED.websiteAddonLabel[locale],
      },
      packages: {
        website: { features: pick(FEATURES.website, locale) },
        monthly: { features: pick(FEATURES.monthly, locale) },
        yearly: {
          note: SHARED.yearlyNote[locale],
          features: pick(FEATURES.yearly, locale),
        },
      },
    },
  };
}
