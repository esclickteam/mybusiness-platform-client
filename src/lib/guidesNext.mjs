/** A closing section on each existing guide. No new public addresses. */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function text(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function link(href, label) {
  return { href, label };
}

const glossary = link("/glossary", text("Glossary", "מילון מושגים", "Glosario", "Glossário", "المعجم"));
const templates = link("/templates", text("Workbooks and calculators", "תבניות ומחשבונים", "Plantillas y calculadoras", "Modelos e calculadoras", "قوالب وآلات حاسبة"));
const sheet = link("/compare/crm-or-spreadsheet", text("CRM or a spreadsheet", "CRM או גיליון", "CRM o una hoja de cálculo", "CRM ou uma planilha", "CRM أو جدول"));
const wa = link("/compare/whatsapp-app-or-api", text("WhatsApp app or platform", "אפליקציית וואטסאפ או הפלטפורמה", "App de WhatsApp o plataforma", "App do WhatsApp ou plataforma", "تطبيق واتساب أو المنصة"));
const pricing = link("/pricing", text("Pricing", "מחירים", "Precios", "Preços", "الأسعار"));

const NEXT = {
  "what-is-a-crm": {
    body: text(
      "This page explains the record and the six statuses. It does not score a lead, import a spreadsheet in one click, or include appointments. Those appointments, collaborations and automations are on the business plan. The comparison with a spreadsheet, and a workbook you can use before you buy anything, are separate.",
      "העמוד הזה מסביר את הרשומה ואת ששת הסטטוסים. הוא לא נותן ציון לליד, לא מייבא גיליון בלחיצה, ולא כולל תורים. תורים, שיתופים ואוטומציות נמצאים בחבילה העסקית. ההשוואה לגיליון, וחוברת שאפשר להשתמש בה לפני שקונים משהו, נמצאות בנפרד.",
      "Esta página explica el registro y los seis estados. No puntúa un lead, no importa una hoja en un clic y no incluye citas. Esas citas, colaboraciones y automatizaciones están en el plan de negocio. La comparación con una hoja y un libro que se puede usar antes de comprar nada van aparte.",
      "Esta página explica o registro e os seis status. Ela não dá nota a um lead, não importa uma planilha num clique e não inclui agenda. Agenda, colaborações e automações ficam no plano de negócios. A comparação com uma planilha e uma pasta que dá para usar antes de comprar ficam à parte.",
      "تشرح هذه الصفحة السجل والحالات الست. لا تمنح درجة للعميل، ولا تستورد جدولاً بنقرة، ولا تشمل المواعيد. المواعيد والتعاون والأتمتة في الخطة التجارية. المقارنة مع جدول ودفتر يمكن استخدامه قبل الشراء منفصلان.",
    ),
    links: [sheet, templates, glossary, pricing],
  },
  "follow-up-on-leads": {
    body: text(
      "A note and a dated task are the follow-up. The page does not send the message for you, and it does not change New to Contacted because a task exists. Contacted means someone actually reached the person. WhatsApp can carry that message later, on its own subscription, after a template is approved when the send is outside the customer-service window.",
      "הערה ומשימה עם תאריך הן המעקב. העמוד לא שולח את ההודעה במקומכם, והוא לא משנה את הסטטוס מחדש ל־נוצר קשר רק כי יש משימה. נוצר קשר אומר שמישהו באמת הגיע אל האדם. וואטסאפ יכול לשאת את ההודעה אחר כך, במנוי נפרד, אחרי שתבנית מאושרת כשהשליחה מחוץ לחלון שירות הלקוחות.",
      "Una nota y una tarea con fecha son el seguimiento. La página no envía el mensaje y no cambia Nuevo a Contactado solo porque existe una tarea. Contactado significa que alguien llegó de verdad a la persona.",
      "Uma nota e uma tarefa com data são o acompanhamento. A página não envia a mensagem e não muda Novo para Contato feito só porque existe uma tarefa. Contato feito significa que alguém alcançou a pessoa de verdade.",
      "ملاحظة ومهمة بتاريخ هما المتابعة. الصفحة لا ترسل الرسالة، ولا تغيّر جديداً إلى تم التواصل لمجرد وجود مهمة. تم التواصل يعني أن أحداً وصل فعلاً إلى الشخص.",
    ),
    links: [
      link("/guides/whatsapp-message-templates", text("Message templates", "תבניות הודעה", "Plantillas de mensajes", "Modelos de mensagem", "قوالب الرسائل")),
      link("/guides/what-is-a-crm", text("What a CRM record is", "מהי רשומת CRM", "Qué es un registro de CRM", "O que é um registro de CRM", "ما هو سجل CRM")),
      templates,
    ],
  },
  "meta-lead-ads-to-crm": {
    body: text(
      "A lead ad can create a row after the business approves the permission on its own Facebook page. The row starts as New, and the source stays on that row. Connecting the page does not start ad spend, and a result count in campaigns is not a person in the file. Bizuply is a Meta Tech Provider. That is not a Meta Business Partner badge.",
      "ליד ממודעה יכול ליצור שורה אחרי שהעסק מאשר את ההרשאה על דף הפייסבוק שלו. השורה מתחילה כחדשה, והמקור נשאר עליה. חיבור הדף לא מתחיל הוצאה על מודעות, ומספר תוצאות בקמפיינים אינו אדם בתיק. ביזאפלי היא Meta Tech Provider. זה לא תג Meta Business Partner.",
      "Un lead ad puede crear una fila después de que el negocio aprueba el permiso en su propia página de Facebook. La fila empieza en Nuevo y el origen se queda en ella. Conectar la página no inicia el gasto, y un recuento de resultados no es una persona en el expediente. Bizuply es Meta Tech Provider, no una insignia de Meta Business Partner.",
      "Um lead ad pode criar uma linha depois que o negócio aprova a permissão na própria página do Facebook. A linha começa em Novo e a origem fica nela. Conectar a página não inicia o gasto, e uma contagem de resultados não é uma pessoa no arquivo. A Bizuply é Meta Tech Provider, não um selo de Meta Business Partner.",
      "يمكن لإعلان عملاء أن ينشئ صفاً بعد موافقة النشاط على الإذن في صفحة فيسبوك الخاصة به. يبدأ الصف جديداً ويبقى المصدر عليه. ربط الصفحة لا يبدأ الإنفاق، وعدد النتائج ليس شخصاً في الملف. Bizuply هي Meta Tech Provider، وهذا ليس شارة Meta Business Partner.",
    ),
    links: [
      link("/guides/connect-a-meta-ad-account", text("Connect a Meta ad account", "חיבור חשבון מודעות של Meta", "Conectar una cuenta de anuncios de Meta", "Conectar uma conta de anúncios da Meta", "ربط حساب إعلانات Meta")),
      link("/guides/from-ad-to-follow-up", text("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة")),
      pricing,
    ],
  },
  "connect-a-meta-ad-account": {
    body: text(
      "The connection lets Bizuply read the account the business authorizes. It does not create campaigns by itself, and it does not move money. Media spend is billed by Meta. Campaign tools sit with the business plan after that account is connected.",
      "החיבור מאפשר לביזאפלי לקרוא את החשבון שהעסק מאשר. הוא לא יוצר קמפיינים לבד, והוא לא מזיז כסף. את ההוצאה על המדיה מחייבת Meta. כלי הקמפיינים יושבים עם החבילה העסקית אחרי שהחשבון מחובר.",
      "La conexión permite a Bizuply leer la cuenta que el negocio autoriza. No crea campañas sola y no mueve dinero. Meta cobra el gasto en medios. Las herramientas de campaña están en el plan de negocio después de conectar esa cuenta.",
      "A conexão permite à Bizuply ler a conta que o negócio autoriza. Ela não cria campanhas sozinha e não move dinheiro. A Meta cobra o gasto de mídia. As ferramentas de campanha ficam no plano de negócios depois que essa conta está conectada.",
      "يتيح الربط لـ Bizuply قراءة الحساب الذي يأذن به النشاط. لا ينشئ حملات وحده ولا ينقل مالاً. تحصّل Meta إنفاق الوسائط. أدوات الحملات مع الخطة التجارية بعد ربط ذلك الحساب.",
    ),
    links: [
      link("/guides/manage-meta-campaigns", text("Read a Meta campaign", "קריאת קמפיין Meta", "Leer una campaña de Meta", "Ler uma campanha da Meta", "قراءة حملة Meta")),
      link("/guides/meta-lead-ads-to-crm", text("Lead ads into the CRM", "לידים ממודעות אל ה־CRM", "Lead ads hacia el CRM", "Lead ads para o CRM", "إعلانات العملاء إلى CRM")),
    ],
  },
  "manage-meta-campaigns": {
    body: text(
      "Use this page to read what a campaign is reporting. A result in that report is not yet a followed-up lead. The lead exists when a row is in the CRM. Meta bills the media. Bizuply does not mark a campaign as profitable from the report alone.",
      "משתמשים בעמוד הזה כדי לקרוא מה קמפיין מדווח. תוצאה בדוח הזה עדיין אינה ליד שטופל. הליד קיים כשיש שורה ב־CRM. Meta מחייבת את המדיה. ביזאפלי לא מסמנת קמפיין כרווחי מהדוח לבדו.",
      "Use esta página para leer lo que informa una campaña. Un resultado en ese informe todavía no es un lead con seguimiento. El lead existe cuando hay una fila en el CRM. Meta cobra los medios.",
      "Use esta página para ler o que uma campanha informa. Um resultado nesse relatório ainda não é um lead com acompanhamento. O lead existe quando há uma linha no CRM. A Meta cobra a mídia.",
      "استخدموا هذه الصفحة لقراءة ما تبلغ عنه الحملة. نتيجة في ذلك التقرير ليست بعد عميلاً تمت متابعته. العميل موجود حين يكون هناك صف في CRM. تحصّل Meta الوسائط.",
    ),
    links: [
      link("/guides/from-ad-to-follow-up", text("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة")),
      templates,
    ],
  },
  "from-ad-to-follow-up": {
    body: text(
      "The path is ad, form, row, task. Google Ads lead forms and a form on a Bizuply site can also create that row. The page does not promise a lead score, and it does not treat the ad platform's result count as the pipeline.",
      "הדרך היא מודעה, טופס, שורה, משימה. גם טפסי לידים של Google Ads וטופס באתר של ביזאפלי יכולים ליצור את השורה. העמוד לא מבטיח ציון ליד, והוא לא מתייחס למספר התוצאות של פלטפורמת המודעות כאל הצינור.",
      "El camino es anuncio, formulario, fila, tarea. Los formularios de Google Ads y un formulario en un sitio de Bizuply también pueden crear esa fila. La página no promete una puntuación de lead.",
      "O caminho é anúncio, formulário, linha, tarefa. Formulários do Google Ads e um formulário num site da Bizuply também podem criar essa linha. A página não promete uma nota de lead.",
      "المسار هو إعلان، نموذج، صف، مهمة. يمكن لنماذج Google Ads ولنموذج في موقع Bizuply أن ينشئا ذلك الصف أيضاً. الصفحة لا تعد بدرجة للعميل.",
    ),
    links: [
      link("/guides/follow-up-on-leads", text("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      link("/guides/website-form-to-crm", text("A website form into the CRM", "טופס אתר אל ה־CRM", "Un formulario del sitio al CRM", "Um formulário do site no CRM", "نموذج موقع إلى CRM")),
      templates,
    ],
  },
  "whatsapp-cloud-api-cost": {
    body: text(
      "Bizuply charges $29 a month for one connected number. There is no free trial. Meta charges delivered business-to-user messages separately, by category and by the recipient's country, and that table changes. This page does not copy Meta's rate card. Read the pricing page Meta updated on 30 September 2026 before you budget a send.",
      "ביזאפלי גובה 29 דולר לחודש למספר מחובר אחד. אין ניסיון חינם. Meta מחייבת בנפרד על הודעות מהעסק אל המשתמש שנמסרו, לפי קטגוריה ולפי מדינת הנמען, והטבלה משתנה. העמוד הזה לא מעתיק את מחירון Meta. קוראים את דף המחירים ש־Meta עדכנה ב־30 בספטמבר 2026 לפני שקובעים תקציב לשליחה.",
      "Bizuply cobra 29 dólares al mes por un número conectado. No hay prueba gratis. Meta cobra aparte los mensajes entregados del negocio al usuario, por categoría y por el país del destinatario, y esa tabla cambia. Esta página no copia la tarifa de Meta.",
      "A Bizuply cobra US$ 29 por mês por um número conectado. Não há teste grátis. A Meta cobra à parte as mensagens entregues da empresa ao usuário, por categoria e pelo país do destinatário, e essa tabela muda. Esta página não copia a tabela da Meta.",
      "تحصّل Bizuply 29 دولاراً في الشهر لرقم متصل واحد. لا توجد تجربة مجانية. تحصّل Meta بشكل منفصل الرسائل المسلّمة من النشاط إلى المستخدم، حسب الفئة وبلد المستلم، وهذا الجدول يتغير. هذه الصفحة لا تنسخ جدول Meta.",
    ),
    links: [wa, link("/guides/whatsapp-message-templates", text("Message templates", "תבניות הודעה", "Plantillas de mensajes", "Modelos de mensagem", "قوالب الرسائل")), pricing],
  },
  "whatsapp-message-templates": {
    body: text(
      "Meta approves the template and the number. There is no second approval queue at Bizuply. A template is what can be delivered outside the 24-hour customer-service window. A reply inside that window is not the same send. Managing several client numbers from one agency screen is not available.",
      "Meta מאשרת את התבנית ואת המספר. אין תור אישור שני בביזאפלי. תבנית היא מה שאפשר למסור מחוץ לחלון שירות הלקוחות של 24 שעות. תשובה בתוך החלון אינה אותה שליחה. ניהול כמה מספרי לקוחות ממסך סוכנות אחד אינו זמין.",
      "Meta aprueba la plantilla y el número. No hay una segunda cola en Bizuply. Una plantilla es lo que se puede entregar fuera de la ventana de 24 horas. Una respuesta dentro de esa ventana no es el mismo envío. Gestionar varios números de clientes desde una pantalla de agencia no está disponible.",
      "A Meta aprova o modelo e o número. Não há uma segunda fila na Bizuply. Um modelo é o que pode ser entregue fora da janela de 24 horas. Uma resposta dentro dessa janela não é o mesmo envio. Gerir vários números de clientes numa tela de agência não está disponível.",
      "توافق Meta على القالب والرقم. لا يوجد طابور موافقة ثانٍ في Bizuply. القالب هو ما يمكن تسليمه خارج نافذة 24 ساعة. الرد داخل النافذة ليس الإرسال نفسه. إدارة أرقام عملاء عدة من شاشة وكالة واحدة غير متاحة.",
    ),
    links: [wa, link("/guides/whatsapp-cloud-api-cost", text("What the WhatsApp subscription costs", "כמה עולה מנוי הוואטסאפ", "Cuánto cuesta la suscripción de WhatsApp", "Quanto custa a assinatura do WhatsApp", "كم يكلف اشتراك واتساب"))],
  },
  "business-automation": {
    body: text(
      "An automation here is a trigger, a condition and an action on a lead that is already in Bizuply, such as creating the next task when a status changes. It does not send a WhatsApp message unless a template is approved and the subscription exists. Automations are on the business plan, not on the $49 CRM plan.",
      "אוטומציה כאן היא טריגר, תנאי ופעולה על ליד שכבר נמצא בביזאפלי, למשל יצירת המשימה הבאה כשסטטוס משתנה. היא לא שולחת הודעת וואטסאפ אלא אם תבנית מאושרת והמנוי קיים. אוטומציות נמצאות בחבילה העסקית, לא במסלול ה־CRM של 49 דולר.",
      "Una automatización aquí es un disparador, una condición y una acción sobre un lead que ya está en Bizuply, como crear la siguiente tarea cuando cambia un estado. No envía un WhatsApp salvo que haya una plantilla aprobada y la suscripción. Las automatizaciones están en el plan de negocio, no en el CRM de 49 dólares.",
      "Uma automação aqui é um gatilho, uma condição e uma ação sobre um lead que já está na Bizuply, como criar a próxima tarefa quando um status muda. Ela não envia um WhatsApp a menos que haja um modelo aprovado e a assinatura. Automações ficam no plano de negócios, não no CRM de US$ 49.",
      "الأتمتة هنا مشغّل وشرط وإجراء على عميل موجود أصلاً في Bizuply، مثل إنشاء المهمة التالية حين تتغير حالة. لا ترسل واتساب إلا إذا كان هناك قالب موافق عليه والاشتراك. الأتمتة في الخطة التجارية، لا في CRM بـ 49 دولاراً.",
    ),
    links: [
      link("/guides/follow-up-on-leads", text("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      link("/automations", text("Automations product page", "עמוד האוטומציות", "Página de automatizaciones", "Página de automações", "صفحة الأتمتة")),
      pricing,
    ],
  },
  "build-a-website-without-code": {
    body: text(
      "The builder publishes pages on a Bizuply site. It is not a promise that a visitor becomes a lead. That happens when a form on the site creates a CRM row. An expert build of up to five pages, when it is offered, is a separate one-time price on the pricing page. Do not treat a number from an older guide as the current quote.",
      "הבנאי מפרסם עמודים באתר של ביזאפלי. הוא לא הבטחה שמבקר הופך לליד. זה קורה כשטופס באתר יוצר שורה ב־CRM. בנייה בידי מומחה של עד חמישה עמודים, כשהיא מוצעת, היא מחיר חד־פעמי נפרד בעמוד המחירים. אין להתייחס למספר ממדריך ישן כאל הצעת המחיר העדכנית.",
      "El constructor publica páginas en un sitio de Bizuply. No promete que un visitante se vuelva un lead. Eso ocurre cuando un formulario del sitio crea una fila en el CRM. Una construcción de experto de hasta cinco páginas, cuando se ofrece, es un precio único aparte en la página de precios.",
      "O construtor publica páginas num site da Bizuply. Ele não promete que um visitante vire um lead. Isso acontece quando um formulário do site cria uma linha no CRM. Uma construção por especialista de até cinco páginas, quando é oferecida, é um preço único à parte na página de preços.",
      "يبني المنشئ صفحات على موقع Bizuply. لا يعد بأن يصبح الزائر عميلاً. يحدث ذلك حين ينشئ نموذج في الموقع صفاً في CRM. بناء خبير حتى خمس صفحات، حين يُعرض، سعر لمرة واحدة منفصل في صفحة الأسعار.",
    ),
    links: [
      link("/guides/website-form-to-crm", text("A website form into the CRM", "טופס אתר אל ה־CRM", "Un formulario del sitio al CRM", "Um formulário do site no CRM", "نموذج موقع إلى CRM")),
      link("/website-builder", text("Website builder", "בניית אתרים", "Constructor de sitios", "Construtor de sites", "منشئ المواقع")),
      pricing,
    ],
  },
  "website-form-to-crm": {
    body: text(
      "The form on a Bizuply site can create a lead whose source is the website and whose first status is New. A form on a site that is not built in Bizuply is not one of the automatic sources. There is no one-click spreadsheet import on this path.",
      "טופס באתר של ביזאפלי יכול ליצור ליד שהמקור שלו הוא האתר והסטטוס הראשון שלו הוא חדש. טופס באתר שלא נבנה בביזאפלי אינו אחד מהמקורות האוטומטיים. אין בדרך הזו ייבוא גיליון בלחיצה.",
      "El formulario de un sitio de Bizuply puede crear un lead cuyo origen es el sitio y cuyo primer estado es Nuevo. Un formulario en un sitio que no está hecho en Bizuply no es una de las fuentes automáticas. No hay una importación de hoja en un clic en este camino.",
      "O formulário de um site da Bizuply pode criar um lead cuja origem é o site e cujo primeiro status é Novo. Um formulário num site que não foi feito na Bizuply não é uma das origens automáticas. Não há importação de planilha num clique neste caminho.",
      "يمكن لنموذج في موقع Bizuply أن ينشئ عميلاً مصدره الموقع وحالته الأولى جديد. نموذج في موقع لم يُبنَ في Bizuply ليس من المصادر الآلية. لا يوجد في هذا المسار استيراد جدول بنقرة.",
    ),
    links: [
      link("/guides/what-is-a-crm", text("What a CRM record is", "מהי רשומת CRM", "Qué es un registro de CRM", "O que é um registro de CRM", "ما هو سجل CRM")),
      link("/guides/build-a-website-without-code", text("Build the site", "בניית האתר", "Construir el sitio", "Construir o site", "بناء الموقع")),
      templates,
    ],
  },
  "appointments-for-a-service-business": {
    body: text(
      "Appointments are for a service business that already keeps the person in the CRM. They are part of the business plan, not of the $49 CRM plan. The page does not turn a lead into a booking by itself, and it does not replace the follow-up task on the file.",
      "תורים מיועדים לעסק שירות שכבר שומר את האדם ב־CRM. הם חלק מהחבילה העסקית, לא ממסלול ה־CRM של 49 דולר. העמוד לא הופך ליד לתור לבד, והוא לא מחליף את משימת המעקב על התיק.",
      "Las citas son para un negocio de servicios que ya guarda a la persona en el CRM. Forman parte del plan de negocio, no del CRM de 49 dólares. La página no convierte un lead en una reserva sola y no sustituye la tarea de seguimiento.",
      "A agenda é para um negócio de serviços que já guarda a pessoa no CRM. Ela faz parte do plano de negócios, não do CRM de US$ 49. A página não transforma um lead em reserva sozinha e não substitui a tarefa de acompanhamento.",
      "المواعيد لنشاط خدمات يحتفظ أصلاً بالشخص في CRM. هي جزء من الخطة التجارية، لا من CRM بـ 49 دولاراً. الصفحة لا تحوّل العميل إلى حجز وحدها ولا تستبدل مهمة المتابعة.",
    ),
    links: [
      link("/appointments", text("Appointments", "תורים", "Citas", "Agenda", "المواعيد")),
      link("/guides/follow-up-on-leads", text("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      link("/solutions/service-businesses", text("Service businesses", "עסקי שירות", "Negocios de servicios", "Negócios de serviços", "أنشطة الخدمات")),
    ],
  },
  "crm-and-business-platform": {
    body: text(
      "CRM only, at $49 a month, is the pipeline and the client file. The business plan, at $99 a month or $990 a year, adds appointments, collaborations and automations. WhatsApp stays separate at $29 a month per connected number. This page does not say that one plan includes the others.",
      "CRM בלבד, ב־49 דולר לחודש, הוא הצינור ותיק הלקוח. החבילה העסקית, ב־99 דולר לחודש או 990 לשנה, מוסיפה תורים, שיתופים ואוטומציות. וואטסאפ נשאר נפרד ב־29 דולר לחודש למספר מחובר. העמוד הזה לא אומר שמסלול אחד כולל את האחרים.",
      "El CRM solo, a 49 dólares al mes, es el pipeline y el expediente. El plan de negocio, a 99 dólares al mes o 990 al año, añade citas, colaboraciones y automatizaciones. WhatsApp sigue aparte a 29 dólares al mes por número conectado. Esta página no dice que un plan incluya a los otros.",
      "O CRM sozinho, a US$ 49 por mês, é o pipeline e o arquivo do cliente. O plano de negócios, a US$ 99 por mês ou US$ 990 por ano, acrescenta agenda, colaborações e automações. O WhatsApp continua à parte a US$ 29 por mês por número conectado. Esta página não diz que um plano inclui os outros.",
      "CRM وحده، بـ 49 دولاراً في الشهر، هو المسار وملف العميل. الخطة التجارية، بـ 99 دولاراً في الشهر أو 990 في السنة، تضيف المواعيد والتعاون والأتمتة. يبقى واتساب منفصلاً بـ 29 دولاراً في الشهر لكل رقم متصل. هذه الصفحة لا تقول إن خطة واحدة تشمل الأخريات.",
    ),
    links: [sheet, pricing, link("/platform", text("The platform", "הפלטפורמה", "La plataforma", "A plataforma", "المنصة"))],
  },
};

export function applyGuideNext(articles) {
  for (const [slug, section] of Object.entries(NEXT)) {
    if (!articles[slug]) continue;
    for (const locale of LOCALES) {
      const page = articles[slug][locale];
      page.updated = "2026-11-15";
      page.sections.push({
        id: "boundary",
        heading: text(
          "Where this page stops",
          "איפה העמוד הזה נעצר",
          "Dónde se detiene esta página",
          "Onde esta página para",
          "أين تتوقف هذه الصفحة",
        )[locale],
        paragraphs: [section.body[locale]],
        links: section.links.map((item) => ({ href: item.href, label: item.label[locale] })),
      });
    }
  }
}
