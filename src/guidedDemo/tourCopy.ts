/**
 * Guided-tour copy for the marketing modules.
 * Resolved by the selected demo language so catalog Hebrew is not shown in other locales.
 */

type StepCopy = { title: string; instruction: string };

const CAMPAIGN_TOUR: Record<string, Record<string, StepCopy>> = {
  en: {
    "meta-create": {
      title: "Create a campaign",
      instruction: "Click the create campaign button to open Ads Manager. Nothing is sent to Meta in the demo.",
    },
    "meta-objective": {
      title: "Choose an objective",
      instruction: "Awareness, Traffic, Engagement, Leads, or Sales. Leads is selected for this photography studio.",
    },
    "meta-objective-continue": {
      title: "Continue",
      instruction: "Click Continue to build the campaign.",
    },
    "meta-budget": {
      title: "Daily budget",
      instruction: "The budget is set at campaign level. The demo starts you at $25/day.",
    },
    "meta-open-adset": {
      title: "Open the ad set",
      instruction: "Click the ad set to choose who sees the ad.",
    },
    "meta-audience": {
      title: "Audience",
      instruction: "Location, ages 25–45, interests, and a custom audience of recent website visitors.",
    },
    "meta-open-ad": {
      title: "Open the ad",
      instruction: "Click the ad to set up the creative.",
    },
    "meta-creative": {
      title: "Creative",
      instruction: "Media, primary text, headline, and call to action. Leads arrive through a quick instant form.",
    },
    "meta-publish": {
      title: "Review & publish",
      instruction: "Click Publish. In the demo the campaign is created locally — nothing is sent to Meta.",
    },
    "meta-metrics": {
      title: "Campaign metrics",
      instruction: "Spend, leads, CPL, CTR, and ROAS. These figures are demo data, not a live Meta account.",
    },
    "meta-open-campaign": {
      title: "Your new campaign",
      instruction: "Your campaign is at the top of the list. Click it to open the details.",
    },
    "meta-open-leads": {
      title: "Leads go to the CRM",
      instruction: "Click View leads in CRM to see the people who came from the campaign.",
    },
  },
  he: {
    "meta-create": {
      title: "יצירת קמפיין",
      instruction: "לחצו על כפתור יצירת הקמפיין כדי לפתוח את מנהל המודעות. בדמו שום דבר לא נשלח ל-Meta.",
    },
    "meta-objective": {
      title: "בחירת מטרה",
      instruction: "מודעוּת, תנועה, מעורבות, לידים או מכירות. לסטודיו הצילום נבחרה המטרה לידים.",
    },
    "meta-objective-continue": {
      title: "המשך",
      instruction: "לחצו על «המשך» כדי לבנות את הקמפיין.",
    },
    "meta-budget": {
      title: "תקציב יומי",
      instruction: "התקציב נקבע ברמת הקמפיין. בדמו מתחילים ב-₪90 ליום.",
    },
    "meta-open-adset": {
      title: "פתיחת סט המודעות",
      instruction: "לחצו על סט המודעות כדי לבחור מי יראה את המודעה.",
    },
    "meta-audience": {
      title: "קהל יעד",
      instruction: "מיקום, גילאי 25–45, תחומי עניין וקהל מותאם של מבקרי האתר האחרונים.",
    },
    "meta-open-ad": {
      title: "פתיחת המודעה",
      instruction: "לחצו על המודעה כדי להגדיר את הקריאייטיב.",
    },
    "meta-creative": {
      title: "קריאייטיב",
      instruction: "מדיה, טקסט ראשי, כותרת וקריאה לפעולה. הלידים מגיעים דרך טופס מהיר.",
    },
    "meta-publish": {
      title: "סקירה ופרסום",
      instruction: "לחצו על «פרסום». בדמו הקמפיין נוצר מקומית — שום דבר לא נשלח ל-Meta.",
    },
    "meta-metrics": {
      title: "ביצועי הקמפיין",
      instruction: "הוצאה, לידים, CPL, CTR ו-ROAS. הנתונים הם נתוני דמו ולא חשבון Meta חי.",
    },
    "meta-open-campaign": {
      title: "הקמפיין החדש שלכם",
      instruction: "הקמפיין שלכם מופיע ראשון ברשימה. לחצו עליו כדי לפתוח את הפרטים.",
    },
    "meta-open-leads": {
      title: "הלידים עוברים ל-CRM",
      instruction: "לחצו על «צפייה בלידים ב-CRM» כדי לראות מי הגיע מהקמפיין.",
    },
  },
  es: {
    "meta-create": {
      title: "Crear una campaña",
      instruction: "Haga clic en el botón de crear campaña para abrir el Administrador de anuncios. En la demo no se envía nada a Meta.",
    },
    "meta-objective": {
      title: "Elegir un objetivo",
      instruction: "Reconocimiento, Tráfico, Interacción, Leads o Ventas. Para este estudio de fotografía está seleccionado Leads.",
    },
    "meta-objective-continue": {
      title: "Continuar",
      instruction: "Haga clic en Continuar para crear la campaña.",
    },
    "meta-budget": {
      title: "Presupuesto diario",
      instruction: "El presupuesto se define a nivel de campaña. La demo empieza con $25/día.",
    },
    "meta-open-adset": {
      title: "Abrir el conjunto de anuncios",
      instruction: "Haga clic en el conjunto de anuncios para elegir quién ve el anuncio.",
    },
    "meta-audience": {
      title: "Audiencia",
      instruction: "Ubicación, edades de 25 a 45, intereses y una audiencia personalizada de visitantes recientes del sitio.",
    },
    "meta-open-ad": {
      title: "Abrir el anuncio",
      instruction: "Haga clic en el anuncio para configurar la creatividad.",
    },
    "meta-creative": {
      title: "Creatividad",
      instruction: "Imagen, texto principal, título y llamada a la acción. Los leads llegan con un formulario instantáneo.",
    },
    "meta-publish": {
      title: "Revisar y publicar",
      instruction: "Haga clic en Publicar. En la demo la campaña se crea localmente y no se envía nada a Meta.",
    },
    "meta-metrics": {
      title: "Métricas de la campaña",
      instruction: "Gasto, leads, CPL, CTR y ROAS. Son datos demo, no una cuenta real de Meta.",
    },
    "meta-open-campaign": {
      title: "Su nueva campaña",
      instruction: "Su campaña aparece primera en la lista. Haga clic para abrir los detalles.",
    },
    "meta-open-leads": {
      title: "Los leads llegan al CRM",
      instruction: "Haga clic en Ver leads en el CRM para ver quién llegó desde la campaña.",
    },
  },
  "pt-BR": {
    "meta-create": {
      title: "Criar uma campanha",
      instruction: "Clique no botão de criar campanha para abrir o Gerenciador de anúncios. Na demo nada é enviado à Meta.",
    },
    "meta-objective": {
      title: "Escolher um objetivo",
      instruction: "Reconhecimento, Tráfego, Engajamento, Leads ou Vendas. Para este estúdio de fotografia, Leads está selecionado.",
    },
    "meta-objective-continue": {
      title: "Continuar",
      instruction: "Clique em Continuar para montar a campanha.",
    },
    "meta-budget": {
      title: "Orçamento diário",
      instruction: "O orçamento é definido no nível da campanha. A demo começa com $25/dia.",
    },
    "meta-open-adset": {
      title: "Abrir o conjunto de anúncios",
      instruction: "Clique no conjunto de anúncios para escolher quem vê o anúncio.",
    },
    "meta-audience": {
      title: "Público",
      instruction: "Localização, idades de 25 a 45, interesses e um público personalizado de visitantes recentes do site.",
    },
    "meta-open-ad": {
      title: "Abrir o anúncio",
      instruction: "Clique no anúncio para configurar o criativo.",
    },
    "meta-creative": {
      title: "Criativo",
      instruction: "Mídia, texto principal, título e chamada para ação. Os leads chegam por um formulário instantâneo.",
    },
    "meta-publish": {
      title: "Revisar e publicar",
      instruction: "Clique em Publicar. Na demo a campanha é criada localmente e nada é enviado à Meta.",
    },
    "meta-metrics": {
      title: "Métricas da campanha",
      instruction: "Gasto, leads, CPL, CTR e ROAS. São dados demo, não uma conta real da Meta.",
    },
    "meta-open-campaign": {
      title: "Sua nova campanha",
      instruction: "Sua campanha aparece no topo da lista. Clique nela para abrir os detalhes.",
    },
    "meta-open-leads": {
      title: "Os leads vão para o CRM",
      instruction: "Clique em Ver leads no CRM para ver quem veio da campanha.",
    },
  },
  ar: {
    "meta-create": {
      title: "إنشاء حملة",
      instruction: "انقروا على زر إنشاء حملة لفتح مدير الإعلانات. في العرض التجريبي لا يُرسل أي شيء إلى Meta.",
    },
    "meta-objective": {
      title: "اختيار الهدف",
      instruction: "الوعي أو الزيارات أو التفاعل أو العملاء المحتملون أو المبيعات. تم اختيار العملاء المحتملين لاستوديو التصوير.",
    },
    "meta-objective-continue": {
      title: "متابعة",
      instruction: "انقروا على «متابعة» لبناء الحملة.",
    },
    "meta-budget": {
      title: "الميزانية اليومية",
      instruction: "تُحدد الميزانية على مستوى الحملة. يبدأ العرض التجريبي بـ $25 / يوم.",
    },
    "meta-open-adset": {
      title: "فتح المجموعة الإعلانية",
      instruction: "انقروا على المجموعة الإعلانية لاختيار من يرى الإعلان.",
    },
    "meta-audience": {
      title: "الجمهور",
      instruction: "الموقع والأعمار من 25 إلى 45 والاهتمامات وجمهور مخصص من زوار الموقع مؤخرًا.",
    },
    "meta-open-ad": {
      title: "فتح الإعلان",
      instruction: "انقروا على الإعلان لإعداد المحتوى الإبداعي.",
    },
    "meta-creative": {
      title: "المحتوى الإبداعي",
      instruction: "الوسائط والنص الأساسي والعنوان وزر الدعوة لاتخاذ إجراء. يصل العملاء عبر نموذج فوري.",
    },
    "meta-publish": {
      title: "المراجعة والنشر",
      instruction: "انقروا على «نشر». في العرض التجريبي تُنشأ الحملة محليًا ولا يُرسل أي شيء إلى Meta.",
    },
    "meta-metrics": {
      title: "مقاييس الحملة",
      instruction: "الإنفاق والعملاء وCPL وCTR وROAS. هذه بيانات تجريبية وليست حساب Meta حقيقيًا.",
    },
    "meta-open-campaign": {
      title: "حملتكم الجديدة",
      instruction: "حملتكم في أعلى القائمة. انقروا عليها لفتح التفاصيل.",
    },
    "meta-open-leads": {
      title: "العملاء ينتقلون إلى CRM",
      instruction: "انقروا على «عرض العملاء في CRM» لرؤية من وصل من الحملة.",
    },
  },
};

/** Module steps whose catalog copy is Hebrew only; Hebrew demos use the catalog. */
const MODULE_TOUR: Record<string, Record<string, StepCopy>> = {
  en: {
    "msg-intro": { title: "Messages", instruction: "Customer conversations live here. In the demo we only send an internal sample message." },
    "msg-demo-send": { title: "Send a sample", instruction: "Click the sample message button. It appears in the thread marked as not sent to a real customer." },
    "email-intro": { title: "Email", instruction: "Connecting Gmail or Outlook lets automations send email. The live connection is blocked in the demo — you'll see how it works without OAuth." },
    "email-blocked": { title: "Nothing goes out", instruction: "The demo doesn't connect a real account or send email. With a real account you connect once and you're set." },
    "push-intro": { title: "Notification center", instruction: "Alerts about leads, appointments, and important activity show up here. The demo creates sample alerts only — no real push to a device." },
    "push-unread": { title: "Unread badge", instruction: "The unread indicator helps you never miss a new inquiry. In the demo it's a sample only." },
    "push-wrap": { title: "No real noise", instruction: "The demo sends no push to real devices. In a live business the same alerts arrive in real time." },
    "store-intro": { title: "Store and orders", instruction: "You can sell from your website. The demo shows a sample catalog — no real payment." },
    "store-open-site": { title: "Open the site", instruction: "Open the studio website to get to the store." },
    "portal-intro": { title: "Client portal", instruction: "Clients can see their file, appointments, and documents. The demo has no real orders and no charges." },
    "plugins-intro": { title: "Add-ons", instruction: "Add-ons connect forms, a store, accessibility, and more. In the demo you can view details — with no charge." },
    "plugins-open": { title: "Demo site", instruction: "Open the website to get to the add-ons." },
    "build-intro": { title: "Business page", instruction: "This is the public Bizuply profile page — name, description, gallery, and reviews. It's different from a full website." },
    "build-nav": { title: "Edit the business page", instruction: "Click Business page in the menu." },
    "build-details": { title: "Editing details", instruction: "Update the name, description, phone, and category here. Changes show up in the preview right away." },
    "build-preview": { title: "What customers see", instruction: "The side panel previews the public page. You can also open the profile the way a customer sees it." },
    "build-view-public": { title: "View as a customer", instruction: "Click View profile to see the page the way a customer does." },
  },
  es: {
    "msg-intro": { title: "Mensajes", instruction: "Aquí se reúnen las conversaciones con clientes. En la demo solo enviamos un mensaje de muestra interno." },
    "msg-demo-send": { title: "Enviar una muestra", instruction: "Haga clic en el botón de mensaje de muestra. Aparece en la conversación marcado como no enviado a un cliente real." },
    "email-intro": { title: "Correo electrónico", instruction: "Conectar Gmail u Outlook permite enviar correos desde automatizaciones. En la demo la conexión real está bloqueada: verá cómo funciona sin OAuth." },
    "email-blocked": { title: "No sale nada", instruction: "La demo no conecta una cuenta real ni envía correos. Con una cuenta real se conecta una sola vez y listo." },
    "push-intro": { title: "Centro de notificaciones", instruction: "Aquí aparecen avisos de leads, citas y actividad importante. La demo solo crea avisos de muestra, sin push real al dispositivo." },
    "push-unread": { title: "Indicador de no leídos", instruction: "El indicador de no leídos le ayuda a no perder una consulta nueva. En la demo es solo una muestra." },
    "push-wrap": { title: "Sin ruido real", instruction: "La demo no envía push a dispositivos reales. En un negocio activo, los mismos avisos llegan en tiempo real." },
    "store-intro": { title: "Tienda y pedidos", instruction: "Puede vender desde su sitio. La demo muestra un catálogo de ejemplo, sin pagos reales." },
    "store-open-site": { title: "Abrir el sitio", instruction: "Abra el sitio del estudio para llegar a la tienda." },
    "portal-intro": { title: "Portal de clientes", instruction: "Los clientes pueden ver su expediente, citas y archivos. La demo no tiene pedidos reales ni cobros." },
    "plugins-intro": { title: "Complementos", instruction: "Los complementos conectan formularios, tienda, accesibilidad y más. En la demo puede ver los detalles sin costo." },
    "plugins-open": { title: "Sitio demo", instruction: "Abra el sitio para llegar a los complementos." },
    "build-intro": { title: "Página del negocio", instruction: "Esta es la página de perfil pública en Bizuply: nombre, descripción, galería y reseñas. Es distinta de un sitio completo." },
    "build-nav": { title: "Editar la página del negocio", instruction: "Haga clic en Página del negocio en el menú." },
    "build-details": { title: "Editar los datos", instruction: "Aquí actualiza el nombre, la descripción, el teléfono y la categoría. Los cambios aparecen al instante en la vista previa." },
    "build-preview": { title: "Lo que ve el cliente", instruction: "El panel lateral muestra la vista previa de la página pública. También puede abrir el perfil como lo ve un cliente." },
    "build-view-public": { title: "Ver como cliente", instruction: "Haga clic en Ver perfil para ver la página como la ve un cliente." },
  },
  "pt-BR": {
    "msg-intro": { title: "Mensagens", instruction: "As conversas com clientes ficam aqui. Na demo enviamos apenas uma mensagem de exemplo interna." },
    "msg-demo-send": { title: "Enviar um exemplo", instruction: "Clique no botão de mensagem de exemplo. Ela aparece na conversa marcada como não enviada a um cliente real." },
    "email-intro": { title: "E-mail", instruction: "Conectar Gmail ou Outlook permite enviar e-mails pelas automações. Na demo a conexão real fica bloqueada — você vê como funciona sem OAuth." },
    "email-blocked": { title: "Nada é enviado", instruction: "A demo não conecta uma conta real nem envia e-mails. Com uma conta real você conecta uma vez e pronto." },
    "push-intro": { title: "Central de notificações", instruction: "Aqui aparecem alertas de leads, compromissos e atividades importantes. A demo cria apenas alertas de exemplo, sem push real no dispositivo." },
    "push-unread": { title: "Indicador de não lidas", instruction: "O indicador de não lidas ajuda a não perder um novo contato. Na demo é só um exemplo." },
    "push-wrap": { title: "Sem barulho real", instruction: "A demo não envia push para dispositivos reais. Em um negócio ativo, os mesmos alertas chegam em tempo real." },
    "store-intro": { title: "Loja e pedidos", instruction: "Você pode vender pelo site. A demo mostra um catálogo de exemplo, sem pagamento real." },
    "store-open-site": { title: "Abrir o site", instruction: "Abra o site do estúdio para chegar à loja." },
    "portal-intro": { title: "Portal do cliente", instruction: "Os clientes podem ver a ficha, os compromissos e os arquivos. A demo não tem pedidos reais nem cobranças." },
    "plugins-intro": { title: "Complementos", instruction: "Os complementos conectam formulários, loja, acessibilidade e mais. Na demo você pode ver os detalhes sem custo." },
    "plugins-open": { title: "Site demo", instruction: "Abra o site para chegar aos complementos." },
    "build-intro": { title: "Página do negócio", instruction: "Esta é a página de perfil pública no Bizuply — nome, descrição, galeria e avaliações. É diferente de um site completo." },
    "build-nav": { title: "Editar a página do negócio", instruction: "Clique em Página do negócio no menu." },
    "build-details": { title: "Editar os dados", instruction: "Aqui você atualiza nome, descrição, telefone e categoria. As mudanças aparecem na hora na prévia." },
    "build-preview": { title: "O que o cliente vê", instruction: "O painel lateral mostra a prévia da página pública. Você também pode abrir o perfil como o cliente vê." },
    "build-view-public": { title: "Ver como cliente", instruction: "Clique em Ver perfil para ver a página como o cliente vê." },
  },
  ar: {
    "msg-intro": { title: "الرسائل", instruction: "تتجمع هنا المحادثات مع العملاء. في العرض التجريبي نرسل رسالة تجريبية داخلية فقط." },
    "msg-demo-send": { title: "إرسال رسالة تجريبية", instruction: "انقروا على زر الرسالة التجريبية. ستظهر في المحادثة مع إشارة أنها لم تُرسل إلى عميل حقيقي." },
    "email-intro": { title: "البريد الإلكتروني", instruction: "ربط Gmail أو Outlook يتيح الإرسال من الأتمتة. في العرض التجريبي الاتصال الحقيقي محظور — سترون كيف يعمل دون OAuth." },
    "email-blocked": { title: "لا يُرسل شيء", instruction: "العرض التجريبي لا يربط حسابًا حقيقيًا ولا يرسل بريدًا. مع حساب حقيقي تربطون مرة واحدة وتتابعون." },
    "push-intro": { title: "مركز الإشعارات", instruction: "تظهر هنا تنبيهات العملاء المحتملين والمواعيد والنشاط المهم. العرض التجريبي ينشئ تنبيهات تجريبية فقط دون إشعار حقيقي للجهاز." },
    "push-unread": { title: "مؤشر غير المقروء", instruction: "مؤشر الإشعارات غير المقروءة يساعدكم على عدم تفويت أي طلب جديد. في العرض التجريبي هذا للتوضيح فقط." },
    "push-wrap": { title: "بلا إزعاج حقيقي", instruction: "العرض التجريبي لا يرسل إشعارات لأجهزة حقيقية. في نشاط حقيقي تصل التنبيهات نفسها فورًا." },
    "store-intro": { title: "المتجر والطلبات", instruction: "يمكنكم البيع من الموقع. يعرض العرض التجريبي كتالوجًا نموذجيًا دون دفع حقيقي." },
    "store-open-site": { title: "افتحوا الموقع", instruction: "افتحوا موقع الاستوديو للوصول إلى المتجر." },
    "portal-intro": { title: "بوابة العملاء", instruction: "يمكن للعملاء رؤية ملفهم ومواعيدهم ومستنداتهم. لا توجد في العرض التجريبي طلبات حقيقية ولا رسوم." },
    "plugins-intro": { title: "الإضافات", instruction: "تربط الإضافات النماذج والمتجر وإمكانية الوصول وغيرها. في العرض التجريبي يمكنكم رؤية التفاصيل دون رسوم." },
    "plugins-open": { title: "موقع العرض", instruction: "افتحوا الموقع للوصول إلى الإضافات." },
    "build-intro": { title: "صفحة النشاط التجاري", instruction: "هذه صفحة الملف العام في Bizuply — الاسم والوصف والمعرض والتقييمات. وهي تختلف عن موقع كامل." },
    "build-nav": { title: "تعديل صفحة النشاط التجاري", instruction: "انقروا على صفحة النشاط التجاري في القائمة." },
    "build-details": { title: "تعديل التفاصيل", instruction: "هنا تحدّثون الاسم والوصف والهاتف والفئة. تظهر التغييرات فورًا في المعاينة." },
    "build-preview": { title: "ما يراه العميل", instruction: "تعرض اللوحة الجانبية معاينة للصفحة العامة. ويمكنكم أيضًا فتح الملف كما يراه العميل." },
    "build-view-public": { title: "العرض كعميل", instruction: "انقروا على عرض الملف لرؤية الصفحة كما يراها العميل." },
  },
};

const STEPS: Record<string, Record<string, StepCopy>> = {
  en: {
    "wa-overview": {
      title: "Receive and reply to WhatsApp conversations without leaving Bizuply.",
      instruction:
        "Connection status, business number, and usage on this screen are demo data. No live WhatsApp account is connected.",
    },
    "wa-inbox": {
      title: "Inbox",
      instruction:
        "Open a thread to see incoming and outgoing messages, time, and delivered or read status. Sarah Cohen is the same lead in the CRM.",
    },
    "wa-templates": {
      title: "Templates",
      instruction:
        "Welcome, Appointment Reminder, Lead Follow-up, Offer, and Thank You are approved demo templates. A new template is not submitted to Meta.",
    },
    "wa-flow": {
      title: "Follow up automatically using WhatsApp and automations.",
      instruction:
        "New lead, then CRM, then a WhatsApp welcome, a follow-up, and a sales task. Demo messages stay inside Bizuply.",
    },
    "meta-overview": {
      title: "Run and monitor your Meta campaigns.",
      instruction:
        "Spend, leads, cost per lead, and ROAS are demo fixtures for Demo Business Ads. This is not a live Meta account.",
    },
    "meta-list": {
      title: "Ads manager",
      instruction:
        "Open a campaign to see ad sets, ads, creative, audience, budget, and results. Publish stays inside the demo.",
    },
    "meta-lead": {
      title: "Every advertising lead is automatically connected to your CRM.",
      instruction:
        "Open the lead count to see people from the campaign, including Sarah Cohen from the September lead ad.",
    },
    "meta-journey": {
      title: "Track the customer from first click to sale.",
      instruction:
        "Meta campaign, then lead, CRM, WhatsApp, appointment or task, then automation — one Bizuply flow.",
    },
    "crm-open-daniel": {
      title: "Customer card",
      instruction: "Open Daniel Cohen’s card to see contact details, need, status, and history.",
    },
    "leads-open-maya": {
      title: "Open a lead",
      instruction: "Open Maya Levi’s card.",
    },
    "clients-open-yael": {
      title: "Open a client file",
      instruction: "Open Emma Brooks’s file.",
    },
  },
  he: {
    "wa-overview": {
      title: "קבלו והשיבו לשיחות WhatsApp בלי לצאת מ-Bizuply.",
      instruction:
        "סטטוס החיבור, מספר העסק ונתוני השימוש כאן הם נתוני דמו. אין חשבון WhatsApp חי.",
    },
    "wa-inbox": {
      title: "תיבת הודעות",
      instruction:
        "פתחו שיחה כדי לראות הודעות נכנסות ויוצאות, זמן, וסטטוס נמסר או נקרא. שרה כהן היא אותו ליד ב-CRM.",
    },
    "wa-templates": {
      title: "תבניות",
      instruction:
        "ברוכים הבאים, תזכורת פגישה, פולואפ לליד, הצעה ותודה הן תבניות דמו מאושרות. תבנית חדשה לא נשלחת ל-Meta.",
    },
    "wa-flow": {
      title: "המשיכו טיפול אוטומטי ב-WhatsApp ובאוטומציות.",
      instruction:
        "ליד חדש, אחר כך CRM, הודעת פתיחה ב-WhatsApp, פולואפ ומשימת מכירה. הודעות הדמו נשארות בתוך Bizuply.",
    },
    "meta-overview": {
      title: "נהלו ועקבו אחרי קמפיינים ב-Meta.",
      instruction:
        "הוצאה, לידים, עלות לליד ו-ROAS הם נתוני דמו של חשבון מודעות לדוגמה. זה לא חשבון Meta חי.",
    },
    "meta-list": {
      title: "מנהל המודעות",
      instruction:
        "פתחו קמפיין כדי לראות סטים, מודעות, קריאייטיב, קהל, תקציב ותוצאות. פרסום נשאר בתוך הדמו.",
    },
    "meta-lead": {
      title: "כל ליד מפרסום מחובר אוטומטית ל-CRM.",
      instruction:
        "פתחו את מספר הלידים כדי לראות את מי שהגיע מהקמפיין, כולל שרה כהן ממודעת הלידים.",
    },
    "meta-journey": {
      title: "עקבו אחרי הלקוח מהקליק הראשון ועד המכירה.",
      instruction:
        "קמפיין Meta, אחר כך ליד, CRM, WhatsApp, פגישה או משימה, ואז אוטומציה — מסלול אחד ב-Bizuply.",
    },
  },
  es: {
    "wa-overview": {
      title: "Reciba y responda conversaciones de WhatsApp sin salir de Bizuply.",
      instruction:
        "El estado de conexión, el número y el uso son datos demo. No hay una cuenta real de WhatsApp.",
    },
    "wa-inbox": {
      title: "Bandeja",
      instruction:
        "Abra un hilo para ver mensajes, hora y estado entregado o leído. Sarah Cohen es el mismo lead del CRM.",
    },
    "wa-templates": {
      title: "Plantillas",
      instruction:
        "Bienvenida, Recordatorio de cita, Seguimiento de lead, Oferta y Gracias son plantillas demo aprobadas. Una plantilla nueva no se envía a Meta.",
    },
    "wa-flow": {
      title: "Haga seguimiento automático con WhatsApp y automatizaciones.",
      instruction:
        "Lead nuevo, CRM, bienvenida por WhatsApp, seguimiento y tarea de ventas. Los mensajes demo no salen de Bizuply.",
    },
    "meta-overview": {
      title: "Gestione y supervise sus campañas de Meta.",
      instruction:
        "Gasto, leads, coste por lead y ROAS son datos demo de Cuenta publicitaria de demostración. No es una cuenta real de Meta.",
    },
    "meta-list": {
      title: "Administrador de anuncios",
      instruction:
        "Abra una campaña para ver conjuntos, anuncios, creatividades, audiencia, presupuesto y resultados. Publicar queda dentro del demo.",
    },
    "meta-lead": {
      title: "Cada lead de publicidad se conecta automáticamente al CRM.",
      instruction:
        "Abra el número de leads para ver a quienes llegaron de la campaña, incluida Sarah Cohen.",
    },
    "meta-journey": {
      title: "Siga al cliente desde el primer clic hasta la venta.",
      instruction:
        "Campaña de Meta, lead, CRM, WhatsApp, cita o tarea y automatización: un solo flujo en Bizuply.",
    },
    "crm-open-daniel": {
      title: "Ficha del cliente",
      instruction: "Abrir la ficha de Daniel Cohen para ver contacto, necesidad, estado e historial.",
    },
    "leads-open-maya": {
      title: "Abrir un lead",
      instruction: "Abrir la ficha de Maya Levi.",
    },
    "clients-open-yael": {
      title: "Abrir un expediente",
      instruction: "Abrir el expediente de Emma Brooks.",
    },
  },
  "pt-BR": {
    "wa-overview": {
      title: "Receba e responda conversas de WhatsApp sem sair do Bizuply.",
      instruction:
        "Status da conexão, número e uso são dados demo. Não há uma conta real de WhatsApp.",
    },
    "wa-inbox": {
      title: "Caixa de entrada",
      instruction:
        "Abra uma conversa para ver mensagens, horário e status entregue ou lido. Sarah Cohen é o mesmo lead do CRM.",
    },
    "wa-templates": {
      title: "Modelos",
      instruction:
        "Boas-vindas, Lembrete de compromisso, Acompanhamento de lead, Oferta e Obrigado são modelos demo aprovados. Um modelo novo não é enviado à Meta.",
    },
    "wa-flow": {
      title: "Faça o acompanhamento automaticamente com WhatsApp e automações.",
      instruction:
        "Novo lead, CRM, boas-vindas no WhatsApp, acompanhamento e tarefa de vendas. Mensagens demo ficam no Bizuply.",
    },
    "meta-overview": {
      title: "Gerencie e acompanhe suas campanhas da Meta.",
      instruction:
        "Gasto, leads, custo por lead e ROAS são dados demo de Conta de anúncios de demonstração. Não é uma conta real da Meta.",
    },
    "meta-list": {
      title: "Gerenciador de anúncios",
      instruction:
        "Abra uma campanha para ver conjuntos, anúncios, criativo, público, orçamento e resultados. Publicar fica dentro do demo.",
    },
    "meta-lead": {
      title: "Cada lead de anúncio entra automaticamente no CRM.",
      instruction:
        "Abra a contagem de leads para ver quem veio da campanha, incluindo Sarah Cohen.",
    },
    "meta-journey": {
      title: "Acompanhe o cliente do primeiro clique até a venda.",
      instruction:
        "Campanha da Meta, lead, CRM, WhatsApp, compromisso ou tarefa e automação — um fluxo só no Bizuply.",
    },
    "crm-open-daniel": {
      title: "Ficha do cliente",
      instruction: "Abra a ficha de Daniel Cohen para ver contato, necessidade, status e histórico.",
    },
    "leads-open-maya": {
      title: "Abrir um lead",
      instruction: "Abra a ficha de Maya Levi.",
    },
    "clients-open-yael": {
      title: "Abrir um prontuário",
      instruction: "Abra o prontuário de Emma Brooks.",
    },
  },
  ar: {
    "wa-overview": {
      title: "استقبلوا وردوا على محادثات WhatsApp دون مغادرة Bizuply.",
      instruction:
        "حالة الاتصال والرقم والاستخدام هنا بيانات تجريبية. لا يوجد حساب WhatsApp حقيقي.",
    },
    "wa-inbox": {
      title: "صندوق الوارد",
      instruction:
        "افتحوا محادثة لرؤية الرسائل والوقت وحالة التسليم أو القراءة. سارة كوهين هي نفس العميل في CRM.",
    },
    "wa-templates": {
      title: "القوالب",
      instruction:
        "مرحبا، تذكير بالموعد، متابعة عميل محتمل، عرض وشكرا قوالب تجريبية معتمدة. القالب الجديد لا يُرسل إلى Meta.",
    },
    "wa-flow": {
      title: "تابعوا تلقائيا عبر WhatsApp والأتمتة.",
      instruction:
        "عميل جديد ثم CRM ثم ترحيب WhatsApp ثم متابعة ثم مهمة مبيعات. رسائل العرض تبقى داخل Bizuply.",
    },
    "meta-overview": {
      title: "أديروا وراقبوا حملات Meta.",
      instruction:
        "الإنفاق والعملاء وتكلفة العميل وROAS بيانات تجريبية لحساب إعلانات تجريبي. هذا ليس حساب Meta حقيقيا.",
    },
    "meta-list": {
      title: "مدير الإعلانات",
      instruction:
        "افتحوا حملة لرؤية المجموعات والإعلانات والإبداع والجمهور والميزانية والنتائج. النشر يبقى داخل العرض.",
    },
    "meta-lead": {
      title: "كل عميل من الإعلان يتصل تلقائيا بـ CRM.",
      instruction:
        "افتحوا عدد العملاء لرؤية من وصل من الحملة، بمن فيهم سارة كوهين.",
    },
    "meta-journey": {
      title: "تتبعوا العميل من أول نقرة حتى البيع.",
      instruction:
        "حملة Meta ثم عميل ثم CRM ثم WhatsApp ثم موعد أو مهمة ثم أتمتة — مسار واحد في Bizuply.",
    },
    "crm-open-daniel": {
      title: "بطاقة العميل",
      instruction: "افتحوا بطاقة دانيال كوهين لرؤية التواصل والحاجة والحالة والسجل.",
    },
    "leads-open-maya": {
      title: "فتح عميل محتمل",
      instruction: "افتحوا بطاقة مايا ليفي.",
    },
    "clients-open-yael": {
      title: "فتح ملف عميلة",
      instruction: "افتحوا ملف إيما بروكس.",
    },
  },
};

const MODULES: Record<string, Record<string, string>> = {
  en: { whatsapp: "WhatsApp API", "meta-campaigns": "Meta Campaigns" },
  he: { whatsapp: "WhatsApp API", "meta-campaigns": "ניהול קמפיינים" },
  es: { whatsapp: "WhatsApp API", "meta-campaigns": "Campañas de Meta" },
  "pt-BR": { whatsapp: "WhatsApp API", "meta-campaigns": "Campanhas da Meta" },
  ar: { whatsapp: "WhatsApp API", "meta-campaigns": "حملات Meta" },
};

function localeBucket(language?: string) {
  const raw = String(language || "en").toLowerCase();
  if (raw.startsWith("he") || raw.startsWith("iw")) return "he";
  if (raw.startsWith("es")) return "es";
  if (raw.startsWith("pt")) return "pt-BR";
  if (raw.startsWith("ar")) return "ar";
  return "en";
}

export function tourStepText(stepId: string, language?: string) {
  const bucket = localeBucket(language);
  const own =
    CAMPAIGN_TOUR[bucket]?.[stepId] ||
    MODULE_TOUR[bucket]?.[stepId] ||
    STEPS[bucket]?.[stepId];
  if (own) return own;
  // Catalog copy is Hebrew, so a Hebrew demo must not fall back to English.
  if (bucket === "he") return null;
  return CAMPAIGN_TOUR.en[stepId] || MODULE_TOUR.en[stepId] || STEPS.en[stepId] || null;
}

export function tourModuleTitle(moduleKey: string, language?: string) {
  const bucket = localeBucket(language);
  return MODULES[bucket]?.[moduleKey] || MODULES.en[moduleKey] || "";
}
