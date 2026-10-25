/** Remaining public guides. Facts stay inside the shipped product. */

export function installRemainingGuides(add, t) {
  add("what-is-a-crm", {
    title: t(
      "What is a CRM, and why does your business need one? | Bizuply",
      "מהו CRM, ולמה העסק צריך אותו? | Bizuply",
      "Qué es un CRM y por qué lo necesita un negocio | Bizuply",
      "O que é um CRM e por que o seu negócio precisa de um | Bizuply",
      "ما هو CRM، ولماذا يحتاجه عملك؟ | Bizuply",
    ),
    description: t(
      "CRM software organizes leads, customer information, conversations and follow-up. Learn how it works and how Bizuply keeps that record in one place.",
      "תוכנת CRM מסדרת לידים, מידע על לקוחות, שיחות ומעקב. כך זה עובד, וכך Bizuply שומרת את הרשומה במקום אחד.",
      "El software CRM organiza leads, información de clientes, conversaciones y seguimiento. Vea cómo funciona y cómo Bizuply guarda ese registro en un solo lugar.",
      "Um software de CRM organiza leads, informações de clientes, conversas e acompanhamento. Veja como funciona e como a Bizuply guarda esse registro em um só lugar.",
      "برنامج CRM ينظّم العملاء المحتملين ومعلومات العملاء والمحادثات والمتابعة. تعرّفوا على طريقة عمله وكيف تحفظ Bizuply هذا السجل في مكان واحد.",
    ),
    h1: t(
      "What is a CRM, and why does your business need one?",
      "מהו CRM, ולמה העסק צריך אותו?",
      "Qué es un CRM y por qué lo necesita un negocio",
      "O que é um CRM e por que o seu negócio precisa de um",
      "ما هو CRM، ولماذا يحتاجه عملك؟",
    ),
    lede: t(
      "CRM (Customer Relationship Management) software helps businesses organize information about leads and customers, track interactions and manage activities such as follow-ups, tasks and sales opportunities. Instead of leaving that history in separate inboxes and notes, a business can keep one record of where the person came from, what was said and what should happen next.",
      "תוכנת CRM לניהול קשרי לקוחות עוזרת לעסק לארגן מידע על לידים ולקוחות, לעקוב אחרי פניות ולנהל פעולות כמו מעקב, משימות והזדמנויות מכירה. במקום להשאיר את ההיסטוריה בתיבות דואר ופתקים נפרדים, אפשר לשמור רשומה אחת: מאיפה האדם הגיע, מה נאמר ומה הצעד הבא.",
      "El software CRM (gestión de relaciones con clientes) ayuda a organizar la información de leads y clientes, seguir las interacciones y gestionar actividades como seguimientos, tareas y oportunidades. En lugar de dejar ese historial en bandejas y notas separadas, el negocio puede guardar un solo registro: de dónde llegó la persona, qué se dijo y qué sigue.",
      "Um software de CRM (gestão de relacionamento com o cliente) ajuda a organizar informações de leads e clientes, acompanhar interações e gerir atividades como follow-ups, tarefas e oportunidades. Em vez de deixar esse histórico em caixas de entrada e anotações separadas, o negócio pode manter um único registro: de onde a pessoa veio, o que foi dito e qual é o próximo passo.",
      "يساعد برنامج CRM لإدارة علاقات العملاء على تنظيم معلومات العملاء المحتملين والعملاء، ومتابعة التفاعلات، وإدارة أنشطة مثل المتابعة والمهام وفرص البيع. بدلاً من ترك هذا السجل في صناديق بريد وملاحظات متفرقة، يمكن للعمل الاحتفاظ بسجل واحد: من أين أتى الشخص، وماذا قيل، وما الخطوة التالية.",
    ),
    related: ["follow-up-on-leads", "meta-lead-ads-to-crm", "crm-and-business-platform"],
    sections: [
      {
        id: "record",
        heading: t("The record, not the dashboard", "הרשומה, לא לוח הבקרה", "El registro, no el panel", "O registro, não o painel", "السجل، لا لوحة التحكم"),
        paragraphs: [
          t(
            "Open the lead before you look at a chart. The lead has a source, a status and a timeline. The six statuses are New, Contacted, Interested, Converted, Lost and Old lead. A status change is written on the timeline, so the next person can see when it moved.",
            "פותחים את הליד לפני שמסתכלים על תרשים. לליד יש מקור, סטטוס וציר זמן. ששת הסטטוסים הם חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן. שינוי סטטוס נכתב על ציר הזמן, כדי שהאדם הבא יראה מתי הוא זז.",
            "Abra el lead antes de mirar un gráfico. El lead tiene un origen, un estado y una línea de tiempo. Los seis estados son Nuevo, Contactado, Interesado, Convertido, Perdido y Lead antiguo. Un cambio de estado queda escrito en la línea de tiempo.",
            "Abra o lead antes de olhar um gráfico. O lead tem uma origem, um status e uma linha do tempo. Os seis status são Novo, Contato feito, Interessado, Convertido, Perdido e Lead antigo. Uma mudança de status fica escrita na linha do tempo.",
            "افتحوا العميل المحتمل قبل النظر إلى رسم. للعميل مصدر وحالة وخط زمني. الحالات الست هي جديد، وتم التواصل، ومهتم، وتم التحويل، وضائع، وعميل قديم. يُكتب تغيير الحالة على الخط الزمني.",
          ),
          t(
            "The client file can hold the contact details, notes, calls, WhatsApp logs, tasks, meetings, files and agreements. That is the CRM. A summary on the business dashboard is only a way back to those records.",
            "תיק הלקוח יכול להחזיק את פרטי הקשר, הערות, שיחות, יומני וואטסאפ, משימות, פגישות, קבצים והסכמים. זה ה־CRM. סיכום בלוח הבקרה של העסק הוא רק דרך חזרה אל הרשומות האלה.",
            "El expediente puede guardar los datos de contacto, notas, llamadas, registros de WhatsApp, tareas, reuniones, archivos y acuerdos. Eso es el CRM. Un resumen en el panel del negocio solo es un camino de vuelta a esos registros.",
            "O arquivo do cliente pode guardar os dados de contato, notas, ligações, registros de WhatsApp, tarefas, reuniões, arquivos e acordos. Isso é o CRM. Um resumo no painel do negócio é só um caminho de volta a esses registros.",
            "يمكن لملف العميل أن يحفظ بيانات الاتصال والملاحظات والمكالمات وسجلات واتساب والمهام والاجتماعات والملفات والاتفاقيات. هذا هو CRM. الملخص في لوحة النشاط مجرد طريق للعودة إلى هذه السجلات.",
          ),
        ],
        steps: [
          t("Open the lead, not a general chart.", "פתחו את הליד, לא תרשים כללי.", "Abra el lead, no un gráfico general.", "Abra o lead, não um gráfico geral.", "افتحوا العميل المحتمل، لا رسماً عاماً."),
          t("Read the source and the current status.", "קראו את המקור ואת הסטטוס הנוכחי.", "Lea el origen y el estado actual.", "Leia a origem e o status atual.", "اقرأوا المصدر والحالة الحالية."),
          t("Set the status that matches what just happened.", "קבעו את הסטטוס שמתאים למה שקרה עכשיו.", "Ponga el estado que corresponde a lo que acaba de pasar.", "Defina o status que corresponde ao que acabou de acontecer.", "ضعوا الحالة التي تطابق ما حدث للتو."),
          t("Write the note on the timeline before you leave the record.", "כתבו את ההערה על ציר הזמן לפני שעוזבים את הרשומה.", "Escriba la nota en la línea de tiempo antes de salir del registro.", "Escreva a nota na linha do tempo antes de sair do registro.", "اكتبوا الملاحظة على الخط الزمني قبل مغادرة السجل."),
        ],
        video: "crm",
        videoNote: t(
          "Change the status, write a note, and leave a follow-up task.",
          "משנים סטטוס, כותבים הערה, ומשאירים משימת מעקב.",
          "Cambie el estado, escriba una nota y deje una tarea de seguimiento.",
          "Mude o status, escreva uma nota e deixe uma tarefa de acompanhamento.",
          "غيّروا الحالة، واكتبوا ملاحظة، واتركوا مهمة متابعة.",
        ),
      },
      {
        id: "sources",
        heading: t("Where a lead is allowed to come from", "מאיפה ליד יכול להגיע", "De dónde puede llegar un lead", "De onde um lead pode chegar", "من أين يمكن أن يصل العميل المحتمل"),
        paragraphs: [
          t(
            "Three automated sources enter the same pipeline: Meta Lead Ads after the business connects its own Facebook page, Google Ads lead forms, and a form on a site built in Bizuply. Each lead keeps that source next to the contact details. The first status is New.",
            "שלושה מקורות אוטומטיים נכנסים לאותו צינור: לידים ממודעות Meta אחרי שהעסק מחבר את דף הפייסבוק שלו, טפסי לידים של Google Ads, וטופס באתר שנבנה בביזאפלי. כל ליד שומר את המקור ליד פרטי הקשר. הסטטוס הראשון הוא חדש.",
            "Tres orígenes automáticos entran en el mismo pipeline: Lead Ads de Meta después de que el negocio conecta su propia página de Facebook, formularios de Google Ads y un formulario en un sitio construido en Bizuply. Cada lead conserva ese origen. El primer estado es Nuevo.",
            "Três origens automáticas entram no mesmo pipeline: Lead Ads da Meta depois que o negócio conecta a própria página do Facebook, formulários do Google Ads e um formulário em um site feito na Bizuply. Cada lead guarda essa origem. O primeiro status é Novo.",
            "ثلاثة مصادر آلية تدخل المسار نفسه: إعلانات العملاء من Meta بعد أن يربط النشاط صفحة فيسبوك الخاصة به، ونماذج Google Ads، ونموذج في موقع بُني في Bizuply. يحتفظ كل عميل بمصدره. الحالة الأولى هي جديد.",
          ),
        ],
        example: {
          title: t("A studio, three doors, one pipeline", "סטודיו, שלוש דלתות, צינור אחד", "Un estudio, tres puertas, un pipeline", "Um estúdio, três portas, um pipeline", "استوديو، ثلاثة أبواب، مسار واحد"),
          body: t(
            "A beauty studio might receive a Meta lead on Monday, a website form on Tuesday and a Google Ads form on Wednesday. All three open as New, with different sources. The person who calls does not have to remember which ad it was.",
            "סטודיו לטיפוח יכול לקבל ליד מ־Meta ביום שני, טופס מהאתר ביום שלישי וטופס מגוגל ביום רביעי. שלושתם נפתחים כחדשים, עם מקורות שונים. מי שמתקשר לא צריך לזכור איזו מודעה זו הייתה.",
            "Un estudio de belleza puede recibir un lead de Meta el lunes, un formulario del sitio el martes y un formulario de Google Ads el miércoles. Los tres se abren como Nuevo, con orígenes distintos.",
            "Um estúdio de beleza pode receber um lead da Meta na segunda, um formulário do site na terça e um formulário do Google Ads na quarta. Os três abrem como Novo, com origens diferentes.",
            "قد يستقبل استوديو تجميل عميلاً من Meta يوم الاثنين، ونموذجاً من الموقع يوم الثلاثاء، ونموذج Google Ads يوم الأربعاء. الثلاثة يُفتحون كجدد، بمصادر مختلفة.",
          ),
        },
      },
      {
        id: "price",
        heading: t("What $49 includes, and what it does not", "מה כלול ב־49 דולר, ומה לא", "Qué incluyen los 49 dólares, y qué no", "O que os US$ 49 incluem, e o que não incluem", "ماذا يشمل مبلغ 49 دولاراً، وماذا لا يشمل"),
        paragraphs: [
          t(
            "CRM only is $49 a month and renews monthly. It is the pipeline and the client file. The business plan is $99 a month or $990 a year and adds appointments, collaborations and automations. WhatsApp is not included in either plan: a connected number is $29 a month, and Meta bills messages separately. Meta messaging charges apply separately, based on usage and message category.",
            "CRM בלבד עולה 49 דולר לחודש ומתחדש מדי חודש. זה הצינור ותיק הלקוח. החבילה העסקית עולה 99 דולר לחודש או 990 דולר לשנה ומוסיפה תורים, שיתופים ואוטומציות. וואטסאפ לא כלול באף מסלול: מספר מחובר עולה 29 דולר לחודש, ו־Meta מחייבת הודעות בנפרד. חיובי ההודעות של Meta מחושבים בנפרד, לפי השימוש וקטגוריית ההודעה.",
            "El CRM solo cuesta 49 dólares al mes y se renueva cada mes. Es el pipeline y el expediente. El plan de negocio cuesta 99 dólares al mes o 990 al año y añade citas, colaboraciones y automatizaciones. WhatsApp no entra en ninguno: un número conectado cuesta 29 dólares al mes, y Meta cobra los mensajes aparte. Los cargos de mensajería de Meta se aplican aparte, según el uso y la categoría del mensaje.",
            "O CRM sozinho custa US$ 49 por mês e renova todo mês. É o pipeline e o arquivo do cliente. O plano de negócios custa US$ 99 por mês ou US$ 990 por ano e acrescenta agenda, colaborações e automações. O WhatsApp não entra em nenhum: um número conectado custa US$ 29 por mês, e a Meta cobra as mensagens à parte. As cobranças de mensagens da Meta são à parte, conforme o uso e a categoria da mensagem.",
            "CRM وحده 49 دولاراً في الشهر ويتجدد شهرياً. هو المسار وملف العميل. الخطة التجارية 99 دولاراً في الشهر أو 990 دولاراً في السنة وتضيف المواعيد والتعاون والأتمتة. واتساب ليس في أي خطة: الرقم المتصل 29 دولاراً في الشهر، وMeta تحصّل الرسائل بشكل منفصل. تُحسب رسوم رسائل Meta بشكل منفصل، حسب الاستخدام وفئة الرسالة.",
          ),
        ],
        mistakes: [
          {
            problem: t("The team stores the conversation in a personal chat.", "הצוות שומר את השיחה בצ'אט אישי.", "El equipo guarda la conversación en un chat personal.", "A equipe guarda a conversa em um chat pessoal.", "الفريق يحفظ المحادثة في دردشة شخصية."),
            fix: t("Write the note and the next task on the lead before the chat is closed.", "כתבו את ההערה ואת המשימה הבאה על הליד לפני שסוגרים את הצ'אט.", "Escriba la nota y la siguiente tarea en el lead antes de cerrar el chat.", "Escreva a nota e a próxima tarefa no lead antes de fechar o chat.", "اكتبوا الملاحظة والمهمة التالية على العميل قبل إغلاق الدردشة."),
          },
          {
            problem: t("A new lead stays New because nobody owns the next step.", "ליד חדש נשאר חדש כי אף אחד לא אחראי לצעד הבא.", "Un lead nuevo sigue en Nuevo porque nadie es dueño del siguiente paso.", "Um lead novo continua Novo porque ninguém é dono do próximo passo.", "يبقى العميل جديداً لأن لا أحد يملك الخطوة التالية."),
            fix: t("The status change and a dated task are the handoff. The follow-up guide shows that sequence.", "שינוי הסטטוס ומשימה עם תאריך הם העברת האחריות. מדריך המעקב מראה את הרצף.", "El cambio de estado y una tarea con fecha son el traspaso. La guía de seguimiento muestra esa secuencia.", "A mudança de status e uma tarefa com data são a passagem. O guia de acompanhamento mostra essa sequência.", "تغيير الحالة ومهمة بتاريخ هما التسليم. دليل المتابعة يعرض هذا التسلسل."),
          },
        ],
      },
    ],
    faq: [
      [t("Does a CRM replace WhatsApp?", "האם CRM מחליף את וואטסאפ?", "¿Un CRM reemplaza a WhatsApp?", "Um CRM substitui o WhatsApp?", "هل يحل CRM محل واتساب؟"), t("No. WhatsApp is a separate subscription at $29 a month per connected number, plus Meta's message fees.", "לא. וואטסאפ הוא מנוי נפרד ב־29 דולר לחודש לכל מספר מחובר, ועוד חיובי ההודעות של Meta.", "No. WhatsApp es una suscripción aparte a 29 dólares al mes por número conectado, más las tarifas de mensaje de Meta.", "Não. O WhatsApp é uma assinatura à parte de US$ 29 por mês por número conectado, mais as tarifas de mensagem da Meta.", "لا. واتساب اشتراك منفصل بـ 29 دولاراً في الشهر لكل رقم متصل، إضافة إلى رسوم رسائل Meta.")],
      [t("How many lead statuses are there?", "כמה סטטוסים יש לליד?", "¿Cuántos estados de lead hay?", "Quantos status de lead existem?", "كم حالة للعميل المحتمل؟"), t("Six: New, Contacted, Interested, Converted, Lost and Old lead.", "שישה: חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן.", "Seis: Nuevo, Contactado, Interesado, Convertido, Perdido y Lead antiguo.", "Seis: Novo, Contato feito, Interessado, Convertido, Perdido e Lead antigo.", "ست: جديد، وتم التواصل، ومهتم، وتم التحويل، وضائع، وعميل قديم.")],
      [t("Can the $49 plan run an automation?", "האם מסלול 49 הדולר יכול להריץ אוטומציה?", "¿El plan de 49 dólares puede ejecutar una automatización?", "O plano de US$ 49 pode executar uma automação?", "هل تستطيع خطة 49 دولاراً تشغيل أتمتة؟"), t("No. Automations are on the business plan. The $49 plan keeps the record and the manual follow-up.", "לא. אוטומציות נמצאות בחבילה העסקית. מסלול 49 הדולר שומר את הרשומה ואת המעקב הידני.", "No. Las automatizaciones están en el plan de negocio. El plan de 49 dólares guarda el registro y el seguimiento manual.", "Não. As automações ficam no plano de negócios. O plano de US$ 49 guarda o registro e o acompanhamento manual.", "لا. الأتمتة في الخطة التجارية. خطة 49 دولاراً تحفظ السجل والمتابعة اليدوية.")],
    ],
  });
}
