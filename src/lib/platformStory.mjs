/**
 * Platform overview copy. Claims stay inside what the product already ships:
 * CRM, appointments, website builder, automations on the business plan,
 * Meta campaign tools after the business connects its own ad account,
 * and WhatsApp as a separate number subscription under Meta's rules.
 * No savings figures, certifications, or medical-record claims.
 */

function story(meta, sections, faq, links, steps, compare) {
  return { ...meta, sections, faq, links, steps, compare, updated: "2026-11-25" };
}

const LINKS = {
  en: [
    ["/crm", "Explore the CRM"],
    ["/whatsapp-api", "Explore WhatsApp Business"],
    ["/automations", "Explore automations"],
    ["/meta-campaigns", "Explore marketing tools"],
    ["/appointments", "Explore appointments"],
    ["/website-builder", "Explore the website builder"],
    ["/agents", "Explore the AI tools"],
    ["/pricing", "Compare the plans"],
    ["/guides", "Open the knowledge center"],
    ["/privacy", "Privacy policy"],
    ["/terms", "Terms of service"],
    ["/contact", "Contact support"],
  ],
  he: [
    ["/crm", "גלו את מערכת ה־CRM"],
    ["/whatsapp-api", "גלו את פתרון WhatsApp Business"],
    ["/automations", "הכירו את האוטומציות של Bizuply"],
    ["/meta-campaigns", "גלו את כלי השיווק וניהול הקמפיינים"],
    ["/appointments", "גלו את מערכת התורים והפגישות"],
    ["/website-builder", "גלו את מערכת בניית האתרים"],
    ["/agents", "גלו את כלי הבינה המלאכותית"],
    ["/pricing", "השוו בין החבילות"],
    ["/guides", "למרכז הידע"],
    ["/privacy", "מדיניות הפרטיות"],
    ["/terms", "תנאי השימוש"],
    ["/contact", "תמיכה"],
  ],
};

const FAQ_HE = [
  ["מהי Bizuply?", "Bizuply, או ביזאפלי בעברית, היא פלטפורמה לניהול עסקים המשלבת CRM, ניהול לקוחות ולידים, תקשורת עסקית, אוטומציות, שיווק, יומן פגישות, בניית אתרים וכלי AI. היכולות הזמינות תלויות במוצרים ובחבילה שנבחרו."],
  ["למי מתאימה פלטפורמת Bizuply?", "הפלטפורמה מתאימה לעסקים קטנים, נותני שירות, סוכנויות שיווק וצוותים שמעוניינים לרכז תהליכי ניהול לקוחות ופעילות עסקית בסביבת עבודה אחת."],
  ["מה ההבדל בין CRM לבין פלטפורמה לניהול עסק?", "CRM מתמקדת בניהול קשרי לקוחות, פניות ולידים. פלטפורמה לניהול עסק יכולה לכלול גם כלים משלימים כגון יומן, אוטומציות, תקשורת עסקית ושיווק. Bizuply משלבת CRM עם מודולים עסקיים נוספים בהתאם לחבילה."],
  ["האם ניתן לחבר WhatsApp Business ל־Bizuply?", "Bizuply מציעה חיבור ל־WhatsApp Business API הרשמי בהתאם לתנאי החיבור, להרשאות ולדרישות Meta. השימוש כפוף למדיניות Meta ולחיובי ההודעות הרלוונטיים."],
  ["האם אפשר לקבל לידים מקמפיינים ישירות למערכת?", "ניתן לקלוט לידים ממקורות פרסום נתמכים, כגון טופס באתר או טופס לידים של Meta כשהחיבור פעיל. הפניות נשמרות ב־CRM עם מקור הפנייה."],
  ["כיצד עובדות האוטומציות?", "אוטומציה מחברת טריגר, תנאי ופעולה. בחבילה העסקית אפשר, למשל, ליצור משימת המשך כשליד חדש נכנס. הפעולות הזמינות הן אלה שקיימות בעורך האוטומציות."],
  ["האם Bizuply כוללת מערכת תורים ופגישות?", "כן. אפשר להגדיר שירות, משך וזמינות, והמערכת מחשבת חלונות פנויים. הפגישה נשמרת עם הלקוח. הזמינות תלויה בחבילה."],
  ["האם אפשר לבנות אתר ולחבר אותו לניהול הלקוחות?", "בונה האתרים כולל עורך ויזואלי ותבניות. טופס באתר יכול להיפתח כליד ב־CRM, בהתאם להגדרות."],
  ["האם ניתן להשתמש רק בחלק מהכלים?", "כן. יש מוצרים וחבילות שונות. פירוט המחירים וההכללה של כל כלי נמצא בעמוד המחירים, ולא בעמוד הזה."],
  ["איך מתחילים להשתמש ב־Bizuply?", "אפשר להכיר את המוצרים, לבדוק את החבילות ולהירשם לפי האפשרויות באתר. אפשר גם לקבוע הדגמה."],
];

const FAQ_EN = [
  ["What is Bizuply?", "Bizuply, ביזאפלי in Hebrew, is a business platform that brings CRM, leads and customers, business communication, automations, marketing tools, an appointment calendar, a website builder and AI tools into one workspace. What is available depends on the products and the plan."],
  ["Who is the platform for?", "It is for small businesses, service providers, marketing agencies and teams that want customer work and day-to-day operations in one workspace."],
  ["What is the difference between a CRM and a business platform?", "A CRM focuses on customers, enquiries and leads. A business platform can also include a calendar, automations, communication and marketing tools. Bizuply combines a CRM with those modules according to the plan."],
  ["Can WhatsApp Business connect to Bizuply?", "Bizuply offers a connection to the official WhatsApp Business API, subject to Meta's connection terms, permissions and messaging fees. It does not promise unlimited messages or automatic template approval."],
  ["Can campaign leads enter the system?", "Supported sources can create a lead with its source. That includes a form on a Bizuply site and a Meta lead form when that connection is active. Media spend stays with Meta or Google."],
  ["How do automations work?", "An automation connects a trigger, a condition and an action. On the business plan, a new lead can open a follow-up task. Only actions that exist in the automation editor are available."],
  ["Does Bizuply include appointments?", "Yes. You set the service, duration and availability, and open times are calculated from that. The booking stays with the customer. Availability of the calendar depends on the plan."],
  ["Can a website connect to customer management?", "The website builder includes a visual editor and templates. A form on the site can open as a lead in the CRM, according to the settings."],
  ["Can a business use only some of the tools?", "Yes. Products and plans differ. Prices and what each plan includes are on the pricing page, not on this overview."],
  ["How do we start?", "Review the products, check the current plans and create an account from the options on the site. You can also book a demonstration."],
];

function packLocale(code) {
  const he = code === "he";
  const en = code === "en";
  const es = code === "es";
  const pt = code === "pt-BR";
  const t = (hebrew, english, spanish, portuguese, arabic) => (he ? hebrew : en ? english : es ? spanish : pt ? portuguese : arabic);
  return story(
    {
      kicker: t("פלטפורמת Bizuply", "The Bizuply platform", "La plataforma Bizuply", "A plataforma Bizuply", "منصة Bizuply"),
      title: t(
        "מערכת לניהול עסק עם CRM ואוטומציות | ביזאפלי",
        "All-in-One Business Management Platform | Bizuply",
        "Plataforma de gestión empresarial todo en uno | Bizuply",
        "Plataforma de gestão empresarial integrada | Bizuply",
        "منصة متكاملة لإدارة الأعمال والعملاء | Bizuply",
      ),
      description: t(
        "הכירו את פלטפורמת Bizuply לניהול העסק: CRM, לידים, WhatsApp Business, אוטומציות, קמפיינים, פגישות, אתרים וכלי AI בסביבת עבודה אחת.",
        "Manage customers, leads, WhatsApp conversations, campaigns, appointments, websites and business automation in one connected platform with Bizuply.",
        "Gestiona clientes, leads, WhatsApp Business, campañas, citas y automatizaciones desde una plataforma empresarial conectada.",
        "Gerencie clientes, leads, WhatsApp Business, campanhas, agendamentos e automações em uma plataforma empresarial integrada.",
        "أدر العملاء والعملاء المحتملين ومحادثات واتساب والحملات والمواعيد والأتمتة من خلال منصة أعمال متكاملة.",
      ),
      crumb: t("סקירת הפלטפורמה", "Platform overview", "Resumen de la plataforma", "Visão da plataforma", "نظرة على المنصة"),
      h1: t(
        "המערכת החכמה שמחברת את כל הפעילות העסקית שלכם",
        "The smart system that connects your business activity",
        "El sistema que conecta toda la actividad del negocio",
        "O sistema que conecta toda a atividade do negócio",
        "النظام الذي يربط كل نشاط العمل",
      ),
      lede: t(
        "ביזאפלי (Bizuply) היא פלטפורמה לניהול עסקים המשלבת מערכת CRM, ניהול לידים ולקוחות, WhatsApp Business, אוטומציות, קמפיינים, יומן פגישות, בניית אתרים וכלי בינה מלאכותית בסביבת עבודה אחת. נהלו את הפעילות ממקום מרכזי, חברו בין מקורות הפנייה והתקשורת עם הלקוחות, ותכננו את הצעד הבא.",
        "Bizuply (ביזאפלי) is a business platform that combines a CRM, leads and customers, WhatsApp Business, automations, campaigns, an appointment calendar, a website builder and AI tools in one workspace. Run the work from one place, connect enquiry sources with customer communication, and plan the next step.",
        "Bizuply es una plataforma de gestión que reúne CRM, leads y clientes, WhatsApp Business, automatizaciones, campañas, un calendario de citas, un constructor de sitios y herramientas de IA en un mismo espacio de trabajo.",
        "A Bizuply é uma plataforma de gestão que reúne CRM, leads e clientes, WhatsApp Business, automações, campanhas, agenda, um construtor de sites e ferramentas de IA em um só espaço de trabalho.",
        "Bizuply منصة لإدارة الأعمال تجمع CRM والعملاء المحتملين وواتساب للأعمال والأتمتة والحملات ومواعيد الاجتماعات وبناء المواقع وأدوات الذكاء الاصطناعي في مساحة عمل واحدة.",
      ),
      primary: t("התחילו עכשיו", "Get Started", "Empieza ahora", "Comece agora", "ابدأ الآن"),
      secondary: t("קבעו הדגמה אישית", "Book a personal demo", "Reserven una demostración", "Marquem uma demonstração", "احجزوا عرضاً شخصياً"),
      plans: t("השוו בין החבילות", "Compare the plans", "Comparen los planes", "Comparem os planos", "قارنوا الباقات"),
    },
    [
      [t("סביבת עבודה אחת לכל העסק", "One workspace for the whole business", "Un espacio de trabajo para todo el negocio", "Um espaço de trabalho para todo o negócio", "مساحة عمل واحدة لكل النشاط"), [
        t("עסקים משתמשים לעיתים במספר מערכות נפרדות כדי לנהל לקוחות, לקבל לידים, לשלוח הודעות, לקבוע פגישות ולבצע פעולות שיווקיות. כשהמידע מפוזר, קשה לשמור על רצף עבודה.", "Businesses often use separate systems for customers, leads, messages, meetings and marketing. When the information is scattered, the work is harder to follow.", "Muchos negocios usan sistemas separados para clientes, leads, mensajes, citas y marketing. Cuando la información se dispersa, el trabajo se corta.", "Muitos negócios usam sistemas separados para clientes, leads, mensagens, reuniões e marketing. Quando a informação se espalha, o trabalho se perde.", "تستخدم كثير من الأعمال أنظمة منفصلة للعملاء والطلبات والرسائل والمواعيد والتسويق. حين تتفرق المعلومات يصعب متابعة العمل."),
        t("Bizuply נועדה לרכז כלי ניהול ותקשורת בסביבה אחת. עובדים עם נתוני לקוחות, משימות, פגישות, שיחות ומקורות פנייה כחלק מתהליך מחובר, לפי המודולים והחבילה הפעילים.", "Bizuply is meant to gather management and communication tools in one place. Customer records, tasks, meetings, conversations and enquiry sources stay in one process, according to the active modules and plan.", "Bizuply reúne las herramientas de gestión y comunicación. Los registros, las tareas, las citas, las conversaciones y el origen de cada consulta quedan en un mismo proceso, según los módulos y el plan.", "A Bizuply reúne as ferramentas de gestão e comunicação. Registros, tarefas, reuniões, conversas e a origem de cada contato ficam no mesmo processo, conforme os módulos e o plano.", "تهدف Bizuply إلى جمع أدوات الإدارة والتواصل في مكان واحد، وفق الوحدات والباقة الفعالة."),
      ]],
      [t("מהפנייה הראשונה ועד להמשך הקשר עם הלקוח", "From the first enquiry through the next step with the customer", "De la primera consulta al siguiente paso con el cliente", "Do primeiro contato ao próximo passo com o cliente", "من أول طلب حتى الخطوة التالية مع العميل"), [
        t("כל קשר עסקי מתחיל בפנייה. בהמחשה של סטודיו בשם Studio North, נועה לוי משאירה בטופס האתר בקשה לפרטים ולפגישת ייעוץ. אלה נתוני הדגמה, לא לקוח אמיתי.", "Every business relationship starts with an enquiry. In a demonstration for a studio called Studio North, Noa Levi asks on the site form for details and a consultation. These are demonstration records, not a real customer.", "Toda relación empieza con una consulta. En una demostración de un estudio llamado Studio North, Noa Levi pide datos y una reunión. Son datos de demostración, no un cliente real.", "Todo relacionamento começa com um contato. Numa demonstração de um estúdio chamado Studio North, Noa Levi pede informações e uma reunião. São dados de demonstração, não um cliente real.", "كل علاقة تبدأ بطلب. في عرض لاستوديو باسم Studio North تطلب نوعا ليفي تفاصيل وموعداً. هذه بيانات عرض وليست عميلاً حقيقياً."),
        t("הפנייה נשמרת ברשימת הלידים עם המקור, מועד הקליטה והסטטוס. אחר כך נפתחים כרטיס הלקוח, שיחת WhatsApp לתיאום, פגישת ייעוץ ביום שלישי בשעה 10:30 ומשימת המשך. בחבילה העסקית, אוטומציה יכולה ליצור את המשימה לפי התנאים שהוגדרו.", "The enquiry is stored on the lead list with its source, the time it arrived and a status. The customer card, a WhatsApp thread about scheduling, a Tuesday 10:30 consultation and a follow-up task come next. On the business plan, an automation can create that task when the conditions match.", "La consulta queda en la lista de leads con su origen, la hora y el estado. Después se abren la ficha, una conversación de WhatsApp, una cita el martes a las 10:30 y una tarea de seguimiento. En el plan de negocio, una automatización puede crear esa tarea.", "O contato fica na lista de leads com a origem, o horário e o status. Depois vêm a ficha, uma conversa de WhatsApp, uma reunião na terça às 10:30 e uma tarefa de continuidade. No plano de negócios, uma automação pode criar essa tarefa.", "يُحفظ الطلب في قائمة العملاء المحتملين مع المصدر والوقت والحالة. ثم تُفتح البطاقة ومحادثة واتساب وموعد الثلاثاء الساعة 10:30 ومهمة متابعة. في الخطة التجارية يمكن للأتمتة إنشاء المهمة."),
      ]],
      [t("ניהול לקוחות ולידים שמאפשר לראות את התמונה המלאה", "Customer and lead management that shows the whole picture", "Gestión de clientes y leads con la imagen completa", "Gestão de clientes e leads com o quadro completo", "إدارة العملاء والعملاء المحتملين بصورة كاملة"), [
        t("מערכת ה־CRM מרכזת לידים ולקוחות, מקורות פנייה נתמכים, פרופיל מרכזי, שדות, שישה סטטוסים, היסטוריית פעילות, הערות, משימות המשך ופגישות. במקום לחפש בין הודעות וגיליונות, עובדים מתוך הכרטיס.", "The CRM keeps leads and customers, supported enquiry sources, a central profile, fields, six statuses, an activity history, notes, follow-up tasks and meetings. The work happens on the card instead of across messages and spreadsheets.", "El CRM reúne leads y clientes, orígenes compatibles, un perfil, campos, seis estados, historial, notas, tareas y citas. El trabajo ocurre en la ficha.", "O CRM reúne leads e clientes, origens compatíveis, um perfil, campos, seis status, histórico, notas, tarefas e reuniões. O trabalho acontece na ficha.", "يجمع CRM العملاء المحتملين والعملاء والمصادر المدعومة والملف والحقول وست حالات والسجل والملاحظات والمهام والمواعيد."),
      ]],
      [t("תקשורת עסקית שמחברת בין השיחה ללקוח", "Business communication that stays with the customer", "Comunicación que permanece junto al cliente", "Comunicação que permanece com o cliente", "تواصل يبقى مع العميل"), [
        t("באמצעות החיבור ל־WhatsApp Business API אפשר לנהל שיחות נכנסות ויוצאות, תבניות מאושרות ושיוך שיחה ללקוח, מתוך סביבת העבודה. השימוש כפוף למדיניות Meta, לסוג החיבור ולחיובי ההודעות. אין כאן הבטחה להודעות ללא הגבלה או לאישור אוטומטי של תבניות.", "The WhatsApp Business API connection can hold incoming and outgoing conversations, approved templates and a link from the thread to the customer. Use is subject to Meta's policy, the connection type and message fees. There is no promise of unlimited messages or automatic template approval.", "La conexión con WhatsApp Business API permite conversaciones, plantillas aprobadas y un vínculo con el cliente. El uso depende de la política de Meta y de las tarifas de los mensajes.", "A conexão com a API do WhatsApp Business permite conversas, modelos aprovados e um vínculo com o cliente. O uso depende da política da Meta e das tarifas das mensagens.", "يتيح الاتصال بواجهة واتساب للأعمال المحادثات والقوالب المعتمدة وربط المحادثة بالعميل، وفق سياسة Meta ورسوم الرسائل."),
      ]],
      [t("תהליכי עבודה חכמים שחוסכים פעולות חוזרות", "Workflows that remove repeated manual steps", "Procesos que evitan pasos manuales repetidos", "Processos que evitam passos manuais repetidos", "عمليات تقلل الخطوات اليدوية المتكررة"), [
        t("אוטומציה מתחילה בטריגר, נבדקת בתנאי ומסתיימת בפעולה. בחבילה העסקית אפשר ליצור משימת המשך אחרי שינוי סטטוס, להוסיף תגית, לעדכן שדה בכרטיס ולתעד את הפעולה. רק מה שקיים בעורך נחשב ליכולת של המערכת.", "An automation starts with a trigger, checks a condition and finishes with an action. On the business plan that can mean a follow-up task after a status change, a tag, a field update on the card and a record of the action. Only what exists in the editor counts as a capability.", "Una automatización empieza con un disparador, comprueba una condición y termina en una acción. En el plan de negocio puede crear una tarea, una etiqueta o una actualización en la ficha.", "Uma automação começa com um gatilho, verifica uma condição e termina numa ação. No plano de negócios pode criar uma tarefa, uma etiqueta ou uma atualização na ficha.", "تبدأ الأتمتة بمحفّز ثم شرط ثم إجراء. في الخطة التجارية يمكن إنشاء مهمة أو وسم أو تحديث في البطاقة."),
      ]],
      [t("חברו בין הפעילות השיווקית להזדמנויות העסקיות", "Connect marketing activity with business opportunities", "Conecten la actividad de marketing con las oportunidades", "Liguem a atividade de marketing às oportunidades", "اربطوا النشاط التسويقي بالفرص"), [
        t("אחרי חיבור חשבון Meta אפשר לנהל פעילות קמפיינים נתמכת ולקלוט לידים ממודעות עם מקור הפנייה. טפסי Google Ads נתמכים יכולים להיכנס גם הם, כשהחיבור קיים. הוצאת המדיה נשארת אצל Meta או Google. המספרים במסכים הם נתוני המחשה, לא הישגים של Bizuply.", "After a Meta account is connected, supported campaign activity and ad leads can enter with their source. Supported Google Ads forms can enter too, when that connection exists. Media spend stays with Meta or Google. Numbers on the screens are demonstration data, not Bizuply results.", "Tras conectar una cuenta de Meta, la actividad compatible y los leads de anuncios entran con su origen. Los formularios compatibles de Google Ads también, si la conexión existe. El gasto publicitario sigue en Meta o Google.", "Depois de conectar uma conta Meta, a atividade compatível e os leads de anúncios entram com a origem. Formulários compatíveis do Google Ads também, se a conexão existir. O gasto de mídia continua na Meta ou no Google.", "بعد ربط حساب Meta يمكن استقبال نشاط الحملات المدعوم وعملاء الإعلانات مع المصدر. نماذج Google Ads المدعومة تدخل أيضاً إذا كان الربط قائماً. إنفاق الإعلان يبقى لدى Meta أو Google."),
      ]],
      [t("יותר סדר בפגישות ויותר שליטה בזמן", "More order in meetings and more control of the day", "Más orden en las citas y más control del día", "Mais ordem nas reuniões e mais controle do dia", "ترتيب أكبر للمواعيد وتحكم أكبر باليوم"), [
        t("מגדירים שירות, משך וזמינות. המערכת מחשבת חלונות פנויים, והפגישה נשמרת עם הלקוח. בהמחשה: ייעוץ עם נועה לוי ב־10:30, שיחת היכרות עם דניאל כהן ב־12:00 ופגישת מעקב עם מיה רז ב־15:00.", "Set the service, the duration and the availability. Open times are calculated, and the booking stays with the customer. The demonstration shows a consultation with Noa Levi at 10:30, an introduction with Daniel Cohen at 12:00 and a follow-up with Maya Raz at 15:00.", "Se definen el servicio, la duración y la disponibilidad. La cita queda con el cliente. La demostración muestra una consulta con Noa Levi a las 10:30, una presentación con Daniel Cohen a las 12:00 y un seguimiento con Maya Raz a las 15:00.", "Definem-se o serviço, a duração e a disponibilidade. A reunião fica com o cliente. A demonstração mostra uma consulta com Noa Levi às 10:30, uma apresentação com Daniel Cohen às 12:00 e um acompanhamento com Maya Raz às 15:00.", "يُحدَّد الخدمة والمدة والتوفر. يُحفظ الموعد مع العميل. يعرض المثال استشارة مع نوعا ليفي الساعة 10:30 وتعارفاً مع دانيال كوهين الساعة 12:00 ومتابعة مع مايا راز الساعة 15:00."),
      ]],
      [t("בנו נוכחות דיגיטלית שמתחברת לניהול העסק", "Build a digital presence that connects to the business", "Construyan una presencia que se conecta a la gestión", "Construam uma presença que se liga à gestão", "ابنوا حضوراً رقمياً يرتبط بالإدارة"), [
        t("בונה האתרים כולל תבניות, עורך ויזואלי, עמודים, טפסים והתאמה לדסקטופ ולמובייל. טופס באתר יכול להיפתח כליד ב־CRM. חנות קיימת רק אם התוכנית כוללת אותה. זה אינו העתק של גלריית דף הבית.", "The website builder includes templates, a visual editor, pages, forms and desktop and mobile layouts. A form on the site can open as a CRM lead. A shop exists only when the plan includes it. This is not a copy of the homepage gallery.", "El constructor incluye plantillas, un editor visual, páginas, formularios y vistas de escritorio y móvil. Un formulario puede abrir un lead en el CRM. Una tienda existe solo si el plan la incluye.", "O construtor inclui modelos, um editor visual, páginas, formulários e vistas para computador e celular. Um formulário pode abrir um lead no CRM. Uma loja existe só se o plano a incluir.", "يتضمن منشئ المواقع قوالب ومحرراً مرئياً وصفحات ونماذج وعرض سطح المكتب والجوال. يمكن أن يفتح النموذج عميلاً محتملاً في CRM. المتجر موجود فقط إذا تضمنته الخطة."),
      ]],
      [t("בינה מלאכותית כחלק מסביבת העבודה", "AI inside the business workspace", "IA dentro del espacio de trabajo", "IA dentro do espaço de trabalho", "الذكاء الاصطناعي داخل مساحة العمل"), [
        t("בחבילה העסקית כלולים היועץ העסקי ואוטומציות AI, לצד משימות ותיעוד. אפשר לבקש סיכום של לידים שממתינים ולראות את התוצאה ליד הסטטוס והמקור. זה כלי העבודה במערכת, לא כפתור הייעוץ הצף, ולא הבטחה לניהול עסק אוטונומי או לסגירת עסקאות.", "The business plan includes the business advisor and AI automations, next to tasks and notes. You can ask which leads are waiting and see the result beside the status and the source. This is the tool inside the product, not the floating advisor, and it is not a promise of an autonomous business or closed deals.", "El plan de negocio incluye el asesor y automatizaciones de IA, junto a tareas y notas. Se puede pedir un resumen de los leads en espera. No es una promesa de un negocio autónomo ni de cierres automáticos.", "O plano de negócios inclui o consultor e automações de IA, ao lado de tarefas e notas. Dá para pedir um resumo dos leads em espera. Não é promessa de um negócio autônomo nem de fechamentos automáticos.", "تتضمن الخطة التجارية المستشار وأتمتة الذكاء الاصطناعي إلى جانب المهام والملاحظات. يمكن طلب ملخص للعملاء المنتظرين. هذا ليس وعداً بإدارة ذاتية أو بإغلاق صفقات."),
      ]],
      [t("יותר מכלי ניהול אחד", "More than one management tool", "Más que una sola herramienta", "Mais do que uma ferramenta", "أكثر من أداة إدارة واحدة"), [
        t("מלבד CRM, WhatsApp, אוטומציות, קמפיינים, יומן ואתרים, בקטלוג הציבורי קיימים גם סריקת אתרים, בדיקת נראות במנועי AI, סריקת אבטחת אתרים, סוכנים ומערכות SaaS מוכנות כפי שהן מופיעות במרקטפלייס. כל מוצר נשאר בעמוד שלו, ורק מה שמפורסם שם נחשב זמין.", "Besides CRM, WhatsApp, automations, campaigns, the calendar and websites, the public catalog also includes a website scan, an AI-visibility check, a website security scan, agents and ready SaaS systems as they appear on the marketplace. Each product stays on its own page, and only what that page publishes counts as available.", "Además del CRM, WhatsApp, automatizaciones, campañas, calendario y sitios, el catálogo público incluye un escaneo de sitios, una revisión de visibilidad en motores de IA, un escaneo de seguridad, agentes y sistemas SaaS listos según el marketplace.", "Além do CRM, WhatsApp, automações, campanhas, agenda e sites, o catálogo público inclui uma varredura de sites, uma verificação de visibilidade em motores de IA, uma varredura de segurança, agentes e sistemas SaaS prontos conforme o marketplace.", "إلى جانب CRM وواتساب والأتمتة والحملات والتقويم والمواقع، يتضمن الكتالوج العام فحص مواقع وفحص الظهور في محركات الذكاء الاصطناعي وفحص الأمان ووكلاء وأنظمة SaaS جاهزة كما تظهر في السوق."),
      ]],
      [t("מערכת שמתאימה לדרך שבה העסק עובד", "A system that follows how the business works", "Un sistema que sigue el modo de trabajo", "Um sistema que segue o modo de trabalho", "نظام يلائم طريقة عمل النشاط"), [
        t("נותני שירות מרכזים פניות, קשר, פגישות והמשך טיפול. קליניקות יכולות לנהל פניות, תורים ותקשורת, בלי להציג את המערכת כתיק רפואי ובלי טענה לתקן רפואי. מכוני יופי משלבים לקוחות, זמינות ותורים. נדל״ן מתעד פניות, פעילות ופגישות, בלי ספר נכסים אלא אם מוצר נפרד במרקטפלייס מספק אותו.", "Service providers gather enquiries, contact, meetings and follow-up. Clinics can manage enquiries, appointments and communication without treating the system as a medical record and without a medical-standard claim. Beauty studios combine customers, availability and bookings. Real estate records enquiries, activity and meetings, without a property ledger unless a separate marketplace product provides one.", "Los servicios reúnen consultas, contacto, citas y seguimiento. Una clínica puede gestionar consultas y citas sin presentar el sistema como historia clínica. Los centros de belleza combinan clientes y reservas. El inmobiliario registra consultas y reuniones, sin un libro de inmuebles salvo que un producto del marketplace lo aporte.", "Serviços reúnem contatos, comunicação, reuniões e continuidade. Uma clínica pode gerir contatos e horários sem apresentar o sistema como prontuário. Estúdios de beleza combinam clientes e reservas. O imobiliário registra contatos e reuniões, sem um cadastro de imóveis salvo se um produto do marketplace o fornecer.", "يجمع مقدمو الخدمات الطلبات والتواصل والمواعيد والمتابعة. يمكن للعيادة إدارة الطلبات والمواعيد دون تقديم النظام كملف طبي. تجمع مراكز التجميل العملاء والحجوزات. تسجّل العقارات الطلبات والاجتماعات دون سجل عقارات إلا إذا وفّره منتج منفصل في السوق."),
        t("סוכנויות שיווק מרכזות מקורות לידים ותהליכי עבודה. מסעדות ועסקים מקומיים יכולים להציג אתר ולנהל פניות. אין כאן הבטחה לקופה, למערכת הזמנות או לניהול מסעדה אם היכולת אינה קיימת כמוצר נפרד.", "Marketing agencies gather lead sources and workflows. Restaurants and local businesses can present a site and manage enquiries. There is no promise of a register, an ordering system or restaurant management unless that exists as a separate product.", "Las agencias reúnen orígenes de leads y procesos. Restaurantes y negocios locales pueden mostrar un sitio y gestionar consultas. No hay promesa de caja ni de pedidos si esa capacidad no existe como producto separado.", "Agências reúnem origens de leads e processos. Restaurantes e negócios locais podem mostrar um site e gerir contatos. Não há promessa de caixa nem de pedidos se essa capacidade não existir como produto separado.", "تجمع الوكالات مصادر العملاء والعمليات. يمكن للمطاعم والأعمال المحلية عرض موقع وإدارة الطلبات. لا وعد بصندوق أو بنظام طلبات إذا لم توجد القدرة كمنتج منفصل."),
      ]],
      [t("חברו את ערוצי הפעילות לסביבת עבודה אחת", "Connect work channels to one workspace", "Conecten los canales a un solo espacio", "Liguem os canais a um só espaço", "اربطوا قنوات العمل بمساحة واحدة"), [
        t("Meta, Facebook, Instagram, WhatsApp Business ו־Google Ads הם שירותים חיצוניים. CRM, ניהול קמפיינים וטפסי האתר הם מודולים של Bizuply. קו החיבור בהמחשה נע מהמקור אל סביבת העבודה ואל הפעולה העסקית, בלי לחצות את הלוגו ובלי להמציא חיבור שאינו קיים.", "Meta, Facebook, Instagram, WhatsApp Business and Google Ads are external services. CRM, campaign management and site forms are Bizuply modules. The demonstration moves from the source to the workspace and then to the business action, without crossing the logo and without inventing a connection that does not exist.", "Meta, Facebook, Instagram, WhatsApp Business y Google Ads son servicios externos. El CRM, las campañas y los formularios del sitio son módulos de Bizuply. La demostración va del origen al espacio de trabajo y a la acción, sin cruzar el logo.", "Meta, Facebook, Instagram, WhatsApp Business e Google Ads são serviços externos. O CRM, as campanhas e os formulários do site são módulos da Bizuply. A demonstração vai da origem ao espaço de trabalho e à ação, sem cruzar o logo.", "Meta وFacebook وInstagram وWhatsApp Business وGoogle Ads خدمات خارجية. CRM والحملات ونماذج الموقع وحدات من Bizuply. ينتقل العرض من المصدر إلى مساحة العمل ثم إلى الإجراء، دون عبور الشعار."),
      ]],
      [t("פחות מעבר בין מערכות ויותר רצף בעבודה", "Less switching, more continuity", "Menos cambios de sistema y más continuidad", "Menos troca de sistema e mais continuidade", "تنقّل أقل بين الأنظمة واستمرار أوضح"), [
        t("הערך אינו במספר הכלים אלא ביכולת לעבוד עם מידע, פניות, תקשורת נתמכת, משימות, יומן ומקורות שיווק באותו תהליך. אין כאן אחוזי חיסכון או מספרי לקוחות שלא נמדדו.", "The value is not the number of tools. It is the ability to work with records, enquiries, supported communication, tasks, the calendar and marketing sources in one process. There are no savings percentages or unpublished customer counts.", "El valor no está en el número de herramientas, sino en trabajar con registros, consultas, comunicación compatible, tareas, calendario y orígenes de marketing en un mismo proceso. No hay porcentajes de ahorro.", "O valor não está no número de ferramentas, e sim em trabalhar com registros, contatos, comunicação compatível, tarefas, agenda e origens de marketing no mesmo processo. Não há percentuais de economia.", "القيمة ليست في عدد الأدوات، بل في العمل على السجلات والطلبات والتواصل المدعوم والمهام والتقويم ومصادر التسويق في عملية واحدة. لا نسب توفير."),
      ]],
      [t("מה משתנה כשעובדים בסביבה מחוברת", "What changes in a connected workspace", "Qué cambia en un espacio conectado", "O que muda num espaço conectado", "ما الذي يتغيّر في مساحة متصلة"), [
        t("בכלים נפרדים המידע עשוי להימצא בכמה מערכות, התקשורת דורשת מעבר בין ערוצים, והמשימות נשמרות במעקב ידני. ב־Bizuply הנתונים הרלוונטיים נגישים ב־CRM, ערוצי התקשורת הנתמכים חלק מהפלטפורמה, והמשימות והפגישות משולבות לפי החבילה. ההשוואה מתארת דרך עבודה נפוצה. היא אינה טוענת שכל מערכת אחרת חסרה את היכולות האלה.", "With separate tools, records may sit in several systems, communication means switching channels, and tasks stay on a manual list. In Bizuply the relevant records are in the CRM, supported communication channels are part of the platform, and tasks and meetings are included according to the plan. The comparison describes a common way of working. It does not claim that every other system lacks these capabilities.", "Con herramientas separadas, los datos pueden estar en varios sistemas. En Bizuply los registros relevantes están en el CRM y los canales compatibles forman parte de la plataforma. La comparación describe una forma habitual de trabajo y no afirma que todo otro sistema carezca de estas funciones.", "Com ferramentas separadas, os dados podem estar em vários sistemas. Na Bizuply os registros relevantes ficam no CRM e os canais compatíveis fazem parte da plataforma. A comparação descreve um modo comum de trabalho e não afirma que todo outro sistema não tenha essas funções.", "مع أدوات منفصلة قد تتوزع البيانات على عدة أنظمة. في Bizuply تكون السجلات ذات الصلة في CRM والقنوات المدعومة جزءاً من المنصة. المقارنة تصف أسلوباً شائعاً ولا تدّعي أن كل نظام آخر يفتقر إلى هذه القدرات."),
      ]],
      [t("התחילו לעבוד בדרך שמתאימה לעסק", "Start in the way that fits the business", "Empiecen del modo que encaja con el negocio", "Comecem do modo que combina com o negócio", "ابدأوا بالطريقة التي تناسب العمل"), [
        t("במסלול עצמאי מכירים את המוצרים, פותחים חשבון לפי אפשרויות ההרשמה, מגדירים את סביבת העבודה ומחברים את הכלים הרלוונטיים. במסלול היכרות בודקים מה מתאים ומקבלים מידע על אפשרויות ההקמה והליווי הקיימות. אין הבטחה להקמה או לליווי בחינם אם הם אינם כלולים בתנאים.", "On the self-serve path, review the products, open an account from the registration options, set up the workspace and connect the relevant tools. On the introduction path, see what fits and ask about the setup and guidance that actually exist. There is no promise of free setup or guidance unless the terms include it.", "En el camino autónomo se revisan los productos, se abre una cuenta y se conectan las herramientas. En el camino de presentación se comprueba qué encaja. No hay promesa de puesta en marcha gratuita si los términos no la incluyen.", "No caminho autônomo revisam-se os produtos, abre-se uma conta e conectam-se as ferramentas. No caminho de apresentação verifica-se o que combina. Não há promessa de implantação gratuita se os termos não a incluírem.", "في المسار الذاتي تُراجع المنتجات ويُفتح حساب وتُربط الأدوات. في مسار التعارف يُفحص ما يناسب. لا وعد بإعداد مجاني إذا لم تتضمنه الشروط."),
      ]],
      [t("ניהול עסקי עם שליטה במידע ובגישה", "Control of information and access", "Control de la información y del acceso", "Controle da informação e do acesso", "التحكم في المعلومات والوصول"), [
        t("הגישה לרשומות נקבעת לפי ההרשאות שכבר קיימות בחשבון. תנאי השימוש ומדיניות הפרטיות מתארים את התנאים החלים על השימוש בפלטפורמה ובשירותים המחוברים. העמוד הזה אינו מוסיף הסמכת ISO, SOC 2, עמידה מלאה ב־GDPR, הצפנה מקצה לקצה, זמינות מובטחת או תדירות גיבוי שלא פורסמה.", "Access to records follows the roles already set on the account. The terms and the privacy policy describe the conditions that apply to the platform and the connected services. This page does not add an ISO certification, SOC 2, full GDPR compliance, end-to-end encryption, a guaranteed uptime or an unpublished backup schedule.", "El acceso sigue los permisos ya definidos en la cuenta. Las condiciones y la privacidad describen el uso. Esta página no añade una certificación ISO, SOC 2, cumplimiento total del GDPR, cifrado de extremo a extremo ni una disponibilidad garantizada.", "O acesso segue as permissões já definidas na conta. Os termos e a privacidade descrevem o uso. Esta página não acrescenta certificação ISO, SOC 2, conformidade total com o GDPR, criptografia de ponta a ponta nem disponibilidade garantida.", "يتبع الوصول الصلاحيات المعرّفة في الحساب. توضّح الشروط وسياسة الخصوصية الاستخدام. لا تضيف هذه الصفحة شهادة ISO أو SOC 2 أو امتثالاً كاملاً لـ GDPR أو تشفيراً طرفياً أو توفراً مضموناً."),
      ]],
      [t("הכירו דרכים חכמות יותר לניהול העסק", "Practical ways to run the business", "Formas prácticas de gestionar el negocio", "Formas práticas de conduzir o negócio", "طرق عملية لإدارة العمل"), [
        t("במרכז הידע יש מדריכים קיימים על CRM, לידים, WhatsApp Business API וקמפיינים. הכותרות והכתובות הן של המדריכים שכבר פורסמו, לא של עמודים חדשים.", "The knowledge center already has guides on CRM, leads, the WhatsApp Business API and campaigns. The titles and addresses are the guides that are already published, not new pages.", "El centro de conocimiento ya tiene guías sobre CRM, leads, la API de WhatsApp Business y campañas. Los títulos y las direcciones son las guías ya publicadas.", "O centro de conhecimento já tem guias sobre CRM, leads, a API do WhatsApp Business e campanhas. Os títulos e os endereços são os guias já publicados.", "في مركز المعرفة أدلة منشورة عن CRM والعملاء المحتملين وواجهة واتساب للأعمال والحملات. العناوين هي الأدلة الموجودة وليس صفحات جديدة."),
      ]],
      [t("קחו את ניהול העסק שלכם לשלב הבא", "Take the next step in running the business", "Den el siguiente paso en la gestión", "Dêem o próximo passo na gestão", "انقلوا إدارة العمل إلى الخطوة التالية"), [
        t("הכירו את הפלטפורמה שמחברת בין הלקוחות, התקשורת, השיווק ותהליכי העבודה. אפשר להתחיל עכשיו, לקבוע הדגמה אישית או להשוות בין החבילות. מחירי החבילות מוצגים בעמוד המחירים ולא ככרטיסיות בעמוד הזה.", "Meet the platform that connects customers, communication, marketing and everyday work. Get started, book a personal demonstration, or compare the plans. Plan prices stay on the pricing page, not as cards on this overview.", "Conozcan la plataforma que conecta clientes, comunicación, marketing y el trabajo diario. Empiecen ahora, reserven una demostración o comparen los planes. Los precios están en la página de precios.", "Conheçam a plataforma que conecta clientes, comunicação, marketing e o trabalho diário. Comecem agora, marquem uma demonstração ou comparem os planos. Os preços ficam na página de preços.", "تعرّفوا على المنصة التي تربط العملاء والتواصل والتسويق والعمل اليومي. ابدأ الآن أو احجزوا عرضاً أو قارنوا الباقات. الأسعار في صفحة الأسعار."),
      ]],
    ],
    he ? FAQ_HE : en ? FAQ_EN : FAQ_EN.map(([q, a], index) => {
      const local = {
        es: [
          ["¿Qué es Bizuply?", "Bizuply, ביזאפלי en hebreo, es una plataforma de gestión que reúne CRM, clientes, comunicación, automatizaciones, marketing, citas, sitios y herramientas de IA. Lo disponible depende de los productos y del plan."],
          ["¿Para quién es?", "Para negocios pequeños, servicios, agencias y equipos que quieren el trabajo con clientes en un solo espacio."],
          ["¿Cuál es la diferencia entre un CRM y una plataforma?", "El CRM se centra en clientes y consultas. La plataforma puede añadir calendario, automatizaciones, comunicación y marketing, según el plan."],
          ["¿Se puede conectar WhatsApp Business?", "Sí, mediante la API oficial, sujeta a las condiciones, los permisos y las tarifas de Meta. No hay mensajes ilimitados ni aprobación automática de plantillas."],
          ["¿Los leads de campañas entran al sistema?", "Las fuentes compatibles, como un formulario del sitio o un formulario de Meta conectado, crean un lead con su origen."],
          ["¿Cómo funcionan las automatizaciones?", "Conectan un disparador, una condición y una acción. En el plan de negocio, un lead nuevo puede abrir una tarea."],
          ["¿Hay citas?", "Sí. Se definen servicio, duración y disponibilidad, y la cita queda con el cliente, según el plan."],
          ["¿Un sitio puede conectarse al CRM?", "El constructor incluye editor y plantillas. Un formulario puede abrir un lead en el CRM."],
          ["¿Se puede usar solo una parte?", "Sí. Los productos y los planes son distintos. Los precios están en la página de precios."],
          ["¿Cómo se empieza?", "Revisen los productos, comprueben los planes y creen una cuenta. También pueden reservar una demostración."],
        ],
        pt: [
          ["O que é a Bizuply?", "A Bizuply, ביזאפלי em hebraico, é uma plataforma de gestão que reúne CRM, clientes, comunicação, automações, marketing, agenda, sites e ferramentas de IA. O que está disponível depende dos produtos e do plano."],
          ["Para quem é?", "Para pequenos negócios, serviços, agências e equipes que querem o trabalho com clientes em um só lugar."],
          ["Qual é a diferença entre CRM e plataforma?", "O CRM trata de clientes e contatos. A plataforma pode incluir agenda, automações, comunicação e marketing, conforme o plano."],
          ["Dá para conectar o WhatsApp Business?", "Sim, pela API oficial, sujeita às condições, permissões e tarifas da Meta. Não há mensagens ilimitadas nem aprovação automática de modelos."],
          ["Leads de campanhas entram no sistema?", "Fontes compatíveis, como um formulário do site ou um formulário Meta conectado, criam um lead com a origem."],
          ["Como funcionam as automações?", "Ligam um gatilho, uma condição e uma ação. No plano de negócios, um lead novo pode abrir uma tarefa."],
          ["Há agenda?", "Sim. Definem-se serviço, duração e disponibilidade, e a reunião fica com o cliente, conforme o plano."],
          ["Um site pode ligar ao CRM?", "O construtor inclui editor e modelos. Um formulário pode abrir um lead no CRM."],
          ["Dá para usar só uma parte?", "Sim. Os produtos e os planos são diferentes. Os preços ficam na página de preços."],
          ["Como começar?", "Revise os produtos, confira os planos e crie uma conta. Também dá para marcar uma demonstração."],
        ],
        ar: [
          ["ما هي Bizuply؟", "Bizuply، وبيزأبلي بالعبرية، منصة لإدارة الأعمال تجمع CRM والعملاء والتواصل والأتمتة والتسويق والمواعيد والمواقع وأدوات الذكاء الاصطناعي. المتاح يعتمد على المنتجات والباقة."],
          ["لمن تناسب؟", "للأعمال الصغيرة ومقدمي الخدمات والوكالات والفرق التي تريد عمل العملاء في مكان واحد."],
          ["ما الفرق بين CRM ومنصة إدارة؟", "يركز CRM على العملاء والطلبات. يمكن أن تضيف المنصة تقويماً وأتمتة وتواصلاً وتسويقاً وفق الباقة."],
          ["هل يمكن ربط واتساب للأعمال؟", "نعم عبر الواجهة الرسمية، وفق شروط Meta والصلاحيات ورسوم الرسائل. لا رسائل بلا حد ولا موافقة تلقائية على القوالب."],
          ["هل تدخل طلبات الحملات إلى النظام؟", "المصادر المدعومة، مثل نموذج الموقع أو نموذج Meta المتصل، تنشئ عميلاً محتملاً مع المصدر."],
          ["كيف تعمل الأتمتة؟", "تربط محفّزاً وشرطاً وإجراءً. في الخطة التجارية يمكن لعميل محتمل جديد أن يفتح مهمة."],
          ["هل توجد مواعيد؟", "نعم. تُحدَّد الخدمة والمدة والتوفر، ويُحفظ الموعد مع العميل وفق الباقة."],
          ["هل يمكن ربط موقع بـ CRM؟", "يتضمن المنشئ محرراً وقوالب. يمكن أن يفتح النموذج عميلاً محتملاً في CRM."],
          ["هل يمكن استخدام جزء فقط؟", "نعم. تختلف المنتجات والباقات. الأسعار في صفحة الأسعار."],
          ["كيف نبدأ؟", "راجعوا المنتجات والباقات وأنشئوا حساباً. يمكن أيضاً حجز عرض."],
        ],
      }[es ? "es" : pt ? "pt" : "ar"];
      return local[index];
    }),
    (he ? LINKS.he : LINKS.en),
    t(
      ["נועה לוי שולחת טופס ייעוץ מאתר Studio North.", "הליד נשמר עם המקור והסטטוס.", "נפתח כרטיס עם פרטי הקשר.", "נפתחת שיחת WhatsApp לתיאום.", "נקבעת פגישה ביום שלישי ב־10:30.", "נוצרת משימת המשך.", "אוטומציה בחבילה העסקית יכולה ליצור את המשימה."],
      ["Noa Levi sends a consultation form from the Studio North site.", "The lead is stored with its source and status.", "The customer card opens with the contact details.", "A WhatsApp thread opens to schedule the meeting.", "A consultation is set for Tuesday at 10:30.", "A follow-up task is created.", "On the business plan, an automation can create that task."],
      ["Noa Levi envía un formulario de consulta desde el sitio de Studio North.", "El lead se guarda con su origen y estado.", "Se abre la ficha con los datos de contacto.", "Se abre una conversación de WhatsApp para coordinar.", "Se fija una consulta el martes a las 10:30.", "Se crea una tarea de seguimiento.", "En el plan de negocio, una automatización puede crear esa tarea."],
      ["Noa Levi envia um formulário de consulta no site da Studio North.", "O lead fica salvo com a origem e o status.", "A ficha abre com os dados de contato.", "Uma conversa de WhatsApp abre para marcar a reunião.", "A consulta fica na terça às 10:30.", "Uma tarefa de continuidade é criada.", "No plano de negócios, uma automação pode criar essa tarefa."],
      ["ترسل نوعا ليفي نموذج استشارة من موقع Studio North.", "يُحفظ العميل المحتمل مع المصدر والحالة.", "تُفتح البطاقة ببيانات الاتصال.", "تُفتح محادثة واتساب للتنسيق.", "يُحدَّد موعد الثلاثاء الساعة 10:30.", "تُنشأ مهمة متابعة.", "في الخطة التجارية يمكن للأتمتة إنشاء المهمة."],
    ),
    {
      columns: t(["נושא", "כלים נפרדים", "Bizuply"], ["Topic", "Separate tools", "Bizuply"], ["Tema", "Herramientas separadas", "Bizuply"], ["Tema", "Ferramentas separadas", "Bizuply"], ["الموضوع", "أدوات منفصلة", "Bizuply"]),
      rows: t(
        [
          ["מידע על לקוחות", "המידע עשוי להימצא בכמה מערכות.", "הנתונים הרלוונטיים נגישים ב־CRM."],
          ["תקשורת", "מעבר בין ערוצים וכלי ניהול.", "ערוצים נתמכים כחלק מהפלטפורמה."],
          ["משימות ופגישות", "מעקב ידני או כלי נוסף.", "שילוב לפי החבילה."],
          ["מקורות לידים", "ריכוז ידני ממקורות שונים.", "קליטה ממקורות נתמכים."],
          ["פעולות חוזרות", "ביצוע ידני או כלי אוטומציה נפרד.", "אוטומציות לפי היכולות הקיימות."],
        ],
        [
          ["Customer information", "Records may sit in several systems.", "The relevant records are in the CRM."],
          ["Communication", "Switching between channels and management tools.", "Supported channels are part of the platform."],
          ["Tasks and meetings", "A manual list or another tool.", "Included according to the plan."],
          ["Lead sources", "Collected by hand from several places.", "Captured from supported sources."],
          ["Repeated work", "Done by hand or in a separate automation tool.", "Automations that already exist in the editor."],
        ],
        [
          ["Información de clientes", "Los datos pueden estar en varios sistemas.", "Los registros relevantes están en el CRM."],
          ["Comunicación", "Cambio entre canales y herramientas.", "Los canales compatibles forman parte de la plataforma."],
          ["Tareas y citas", "Una lista manual u otra herramienta.", "Incluidas según el plan."],
          ["Orígenes de leads", "Se reúnen a mano.", "Entran desde fuentes compatibles."],
          ["Trabajo repetido", "Se hace a mano o en otra herramienta.", "Automatizaciones que ya existen en el editor."],
        ],
        [
          ["Informação de clientes", "Os dados podem estar em vários sistemas.", "Os registros relevantes ficam no CRM."],
          ["Comunicação", "Troca entre canais e ferramentas.", "Os canais compatíveis fazem parte da plataforma."],
          ["Tarefas e reuniões", "Uma lista manual ou outra ferramenta.", "Incluídas conforme o plano."],
          ["Origens de leads", "Reunidas à mão.", "Entram de fontes compatíveis."],
          ["Trabalho repetido", "Feito à mão ou em outra ferramenta.", "Automações que já existem no editor."],
        ],
        [
          ["معلومات العملاء", "قد تتوزع البيانات على عدة أنظمة.", "السجلات ذات الصلة في CRM."],
          ["التواصل", "تنقّل بين القنوات والأدوات.", "القنوات المدعومة جزء من المنصة."],
          ["المهام والمواعيد", "قائمة يدوية أو أداة أخرى.", "مدمجة وفق الباقة."],
          ["مصادر العملاء", "تُجمع يدوياً.", "تدخل من مصادر مدعومة."],
          ["العمل المتكرر", "يُنجز يدوياً أو في أداة أخرى.", "أتمتة موجودة أصلاً في المحرر."],
        ],
      ),
    },
  );
}

const STORIES = {
  he: packLocale("he"),
  en: packLocale("en"),
  es: packLocale("es"),
  "pt-BR": packLocale("pt-BR"),
  ar: packLocale("ar"),
};

import { platformOverview } from "./platformOverview.mjs";

export function platformStory(locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  const base = STORIES[language] || STORIES.en;
  const next = platformOverview(language);
  return {
    ...base,
    title: next.title,
    description: next.description,
    h1: next.h1,
    lede: next.lede,
    sections: next.sections,
    steps: next.steps,
    compare: next.compare,
    faq: next.faq,
    ui: next.ui,
  };
}
