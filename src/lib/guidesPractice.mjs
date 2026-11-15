/**
 * Practical depth on the 13 guides that already have public URLs.
 * No new guide addresses. External numbers stay on the cited page.
 */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function t(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(pack, locale) {
  return pack[locale] || pack.en;
}

const PRICING = {
  href: "/pricing",
  external: false,
  label: t("Bizuply pricing", "מחירון ביזאפלי", "Precios de Bizuply", "Preços da Bizuply", "أسعار Bizuply"),
};

const META_PRICING = {
  href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/",
  external: true,
  label: t(
    "Meta: Pricing on the WhatsApp Business Platform, updated 30 September 2026",
    "Meta: מחירון WhatsApp Business Platform, עודכן ב־30 בספטמבר 2026",
    "Meta: precios de WhatsApp Business Platform, actualizado el 30 de septiembre de 2026",
    "Meta: preços da WhatsApp Business Platform, atualizado em 30 de setembro de 2026",
    "Meta: تسعير WhatsApp Business Platform، محدّث في 30 سبتمبر 2026",
  ),
};

const META_TEMPLATES = {
  href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview",
  external: true,
  label: t(
    "Meta: WhatsApp message templates",
    "Meta: תבניות הודעה ב־WhatsApp",
    "Meta: plantillas de mensajes de WhatsApp",
    "Meta: modelos de mensagem do WhatsApp",
    "Meta: قوالب رسائل واتساب",
  ),
};

const META_LEADS = {
  href: "https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads",
  external: true,
  label: t(
    "Meta: Lead Ads",
    "Meta: Lead Ads",
    "Meta: Lead Ads",
    "Meta: Lead Ads",
    "Meta: إعلانات العملاء",
  ),
};

const REVIEW = t(
  "Checked on 15 November 2026. Product prices on this page follow the pricing page. Read both again each quarter.",
  "נבדק ב־15 בנובמבר 2026. מחירי המוצר בעמוד הזה עוקבים אחרי עמוד המחירים. קוראים את שניהם שוב בכל רבעון.",
  "Revisado el 15 de noviembre de 2026. Los precios del producto en esta página siguen la página de precios. Lea ambas de nuevo cada trimestre.",
  "Verificado em 15 de novembro de 2026. Os preços do produto nesta página seguem a página de preços. Leia as duas de novo a cada trimestre.",
  "فُحص في 15 نوفمبر 2026. أسعار المنتج في هذه الصفحة تتبع صفحة الأسعار. أعيدوا قراءة الاثنتين كل ربع سنة.",
);

const REVIEW_META = t(
  "Checked on 15 November 2026. Bizuply's $29 is on the pricing page. Meta's category rates are not copied here. Open Meta's pricing page, updated 30 September 2026, before you budget a send, and read both again each quarter.",
  "נבדק ב־15 בנובמבר 2026. ה־29 דולר של ביזאפלי נמצאים בעמוד המחירים. תעריפי הקטגוריות של Meta לא מועתקים לכאן. פותחים את עמוד המחירים של Meta, שעודכן ב־30 בספטמבר 2026, לפני שמתקצבים שליחה, וקוראים את שניהם שוב בכל רבעון.",
  "Revisado el 15 de noviembre de 2026. Los 29 dólares de Bizuply están en la página de precios. Las tarifas por categoría de Meta no se copian aquí. Abra la página de precios de Meta, actualizada el 30 de septiembre de 2026, antes de presupuestar un envío, y lea ambas de nuevo cada trimestre.",
  "Verificado em 15 de novembro de 2026. Os US$ 29 da Bizuply estão na página de preços. As tarifas por categoria da Meta não são copiadas aqui. Abra a página de preços da Meta, atualizada em 30 de setembro de 2026, antes de orçar um envio, e leia as duas de novo a cada trimestre.",
  "فُحص في 15 نوفمبر 2026. مبلغ 29 دولاراً من Bizuply في صفحة الأسعار. أسعار فئات Meta غير منسوخة هنا. افتحوا صفحة أسعار Meta، المحدّثة في 30 سبتمبر 2026، قبل وضع ميزانية الإرسال، وأعيدوا قراءة الاثنتين كل ربع سنة.",
);

function link(href, label) {
  return { href, label };
}

function section(spec) {
  return { id: "practice", ...spec };
}

const PRACTICE = {
  "what-is-a-crm": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/crm", t("Open the CRM", "לעמוד ה־CRM", "Abrir el CRM", "Abrir o CRM", "صفحة CRM")), link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار"))],
    faq: [
      [
        t("When is a spreadsheet still enough?", "מתי גיליון עדיין מספיק?", "¿Cuándo sigue bastando una hoja de cálculo?", "Quando uma planilha ainda basta?", "متى يبقى الجدول كافياً؟"),
        t("When one person can see every open conversation without asking anyone else, and no lead arrives from an ad or a form while that person is out on a job.", "כשאדם אחד יכול לראות כל שיחה פתוחה בלי לשאול מישהו אחר, ואין ליד שמגיע ממודעה או מטופס בזמן שהוא בעבודה בחוץ.", "Cuando una persona puede ver cada conversación abierta sin preguntar a nadie, y ningún lead llega de un anuncio o un formulario mientras esa persona está fuera.", "Quando uma pessoa consegue ver cada conversa aberta sem perguntar a mais ninguém, e nenhum lead chega de um anúncio ou formulário enquanto essa pessoa está fora.", "حين يستطيع شخص واحد رؤية كل محادثة مفتوحة دون سؤال أحد، ولا يصل عميل من إعلان أو نموذج بينما ذلك الشخص خارج العمل."),
      ],
      [
        t("Does changing the status send a message?", "האם שינוי סטטוס שולח הודעה?", "¿Cambiar el estado envía un mensaje?", "Mudar o status envia uma mensagem?", "هل تغيير الحالة يرسل رسالة؟"),
        t("No. The status is a label on the record. A message is a separate action, and WhatsApp is a separate subscription.", "לא. הסטטוס הוא תווית על הרשומה. הודעה היא פעולה נפרדת, ווואטסאפ הוא מנוי נפרד.", "No. El estado es una etiqueta en el registro. Un mensaje es una acción aparte, y WhatsApp es una suscripción aparte.", "Não. O status é um rótulo no registro. Uma mensagem é uma ação à parte, e o WhatsApp é uma assinatura à parte.", "لا. الحالة وصف على السجل. الرسالة إجراء منفصل، وواتساب اشتراك منفصل."),
      ],
    ],
    section: section({
      heading: t("The first week with the record", "השבוע הראשון עם הרשומה", "La primera semana con el registro", "A primeira semana com o registro", "الأسبوع الأول مع السجل"),
      paragraphs: [
        t(
          "A CRM pays for itself only if the team stops keeping a second list. Use the first week to agree what the six statuses mean in this business, and who owns a lead that is still New at the end of the day.",
          "CRM מחזיר את עצמו רק אם הצוות מפסיק לנהל רשימה שנייה. בשבוע הראשון מסכימים מה ששת הסטטוסים אומרים בעסק הזה, ומי אחראי לליד שנשאר חדש בסוף היום.",
          "Un CRM se paga solo si el equipo deja de llevar una segunda lista. Use la primera semana para acordar qué significan los seis estados en este negocio y quién es dueño de un lead que sigue en Nuevo al final del día.",
          "Um CRM se paga se a equipe parar de manter uma segunda lista. Use a primeira semana para combinar o que os seis status significam neste negócio e quem é dono de um lead que continua Novo no fim do dia.",
          "CRM يعيد تكلفته فقط إذا توقف الفريق عن الاحتفاظ بقائمة ثانية. استخدموا الأسبوع الأول للاتفاق على معنى الحالات الست في هذا النشاط، ومن يملك عميلاً يبقى جديداً في نهاية اليوم.",
        ),
      ],
      steps: [
        t("Write one sentence for each status: New, Contacted, Interested, Converted, Lost and Old lead.", "כתבו משפט אחד לכל סטטוס: חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן.", "Escriba una frase para cada estado: Nuevo, Contactado, Interesado, Convertido, Perdido y Lead antiguo.", "Escreva uma frase para cada status: Novo, Contato feito, Interessado, Convertido, Perdido e Lead antigo.", "اكتبوا جملة لكل حالة: جديد، وتم التواصل، ومهتم، وتم التحويل، وضائع، وعميل قديم."),
        t("Name one person who owns every lead still marked New at the end of the day.", "קבעו אדם אחד שאחראי על כל ליד שעדיין מסומן כחדש בסוף היום.", "Nombre a una persona dueña de cada lead que siga en Nuevo al final del día.", "Nomeie uma pessoa dona de cada lead que continue Novo no fim do dia.", "سمّوا شخصاً واحداً يملك كل عميل ما زال جديداً في نهاية اليوم."),
        t("Agree that Contacted means a person was reached, not that a task exists.", "הסכימו ש־נוצר קשר אומר שהגעתם אל האדם, לא שקיימת משימה.", "Acuerden que Contactado significa que se llegó a la persona, no que exista una tarea.", "Combinem que Contato feito significa que a pessoa foi alcançada, não que exista uma tarefa.", "اتفقوا أن تم التواصل يعني أن الشخص تم الوصول إليه، لا أن هناك مهمة."),
        t("Keep a spreadsheet as an export if you need one. Do not let it become a second pipeline.", "השאירו גיליון כייצוא אם צריך. אל תתנו לו להפוך למעקב נפרד.", "Conserve una hoja como exportación si la necesita. No deje que sea un segundo seguimiento.", "Mantenha uma planilha como exportação se precisar. Não deixe que ela vire um segundo acompanhamento.", "أبقوا الجدول تصديراً إذا احتجتم. لا تجعلوه مساراً ثانياً."),
      ],
      example: {
        title: t("Two electricians, one price", "שני חשמלאים, מחיר אחד", "Dos electricistas, un precio", "Dois eletricistas, um preço", "كهربائيان، سعر واحد"),
        body: t(
          "Two people answer the same quote in two chats. One offers a price the other does not know. The record holds the price, the source and the next task, so the second person does not invent a different number.",
          "שני אנשים עונים לאותה הצעת מחיר בשני צ'אטים. אחד נותן מחיר שהשני לא מכיר. הרשומה מחזיקה את המחיר, את המקור ואת המשימה הבאה, כדי שהאדם השני לא ימציא מספר אחר.",
          "Dos personas responden el mismo presupuesto en dos chats. Una ofrece un precio que la otra no conoce. El registro guarda el precio, el origen y la siguiente tarea, para que la segunda persona no invente otro número.",
          "Duas pessoas respondem o mesmo orçamento em dois chats. Uma oferece um preço que a outra não conhece. O registro guarda o preço, a origem e a próxima tarefa, para a segunda pessoa não inventar outro número.",
          "شخصان يردان على عرض السعر نفسه في دردشتين. أحدهما يعرض سعراً لا يعرفه الآخر. يحتفظ السجل بالسعر والمصدر والمهمة التالية، كي لا يخترع الشخص الثاني رقماً مختلفاً.",
        ),
      },
      table: {
        columns: [
          t("Situation", "מצב", "Situación", "Situação", "الحالة"),
          t("A spreadsheet can hold it", "גיליון יכול להחזיק את זה", "Una hoja puede sostenerlo", "Uma planilha aguenta", "جدول يكفي"),
          t("Use the CRM record", "השתמשו ברשומת ה־CRM", "Use el registro del CRM", "Use o registro do CRM", "استخدموا سجل CRM"),
        ],
        rows: [
          [
            t("One person, and every open job is visible to them", "אדם אחד, וכל עבודה פתוחה גלויה לו", "Una persona, y cada trabajo abierto le es visible", "Uma pessoa, e cada trabalho aberto está visível para ela", "شخص واحد، وكل عمل مفتوح ظاهر له"),
            t("Yes", "כן", "Sí", "Sim", "نعم"),
            t("Optional", "לא חובה", "Opcional", "Opcional", "اختياري"),
          ],
          [
            t("Two people touch the same lead", "שני אנשים נוגעים באותו ליד", "Dos personas tocan el mismo lead", "Duas pessoas tocam o mesmo lead", "شخصان يلمسان العميل نفسه"),
            t("The second person works from memory", "האדם השני עובד מהזיכרון", "La segunda persona trabaja de memoria", "A segunda pessoa trabalha de memória", "الشخص الثاني يعمل من الذاكرة"),
            t("Yes", "כן", "Sí", "Sim", "نعم"),
          ],
          [
            t("Leads arrive from an ad, a site and a form in the same week", "לידים מגיעים ממודעה, מאתר ומטופס באותו שבוע", "Los leads llegan de un anuncio, un sitio y un formulario en la misma semana", "Os leads chegam de um anúncio, um site e um formulário na mesma semana", "يصل العملاء من إعلان وموقع ونموذج في الأسبوع نفسه"),
            t("The source gets lost", "המקור הולך לאיבוד", "El origen se pierde", "A origem se perde", "يضيع المصدر"),
            t("Yes. The source stays on the row.", "כן. המקור נשאר על השורה.", "Sí. El origen se queda en la fila.", "Sim. A origem fica na linha.", "نعم. يبقى المصدر على الصف."),
          ],
        ],
      },
      links: [
        link("/compare/crm-or-spreadsheet", t("CRM or a spreadsheet", "CRM או גיליון", "CRM o una hoja", "CRM ou uma planilha", "CRM أو جدول")),
        link("/templates", t("Lead workbook", "חוברת הלידים", "Libro de leads", "Pasta de leads", "دفتر العملاء")),
        link("/guides/follow-up-on-leads", t("Follow up on the lead", "מעקב אחרי הליד", "Seguimiento del lead", "Acompanhar o lead", "متابعة العميل")),
      ],
    }),
  },
  "follow-up-on-leads": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/crm", t("Open the CRM", "לעמוד ה־CRM", "Abrir el CRM", "Abrir o CRM", "صفحة CRM"))],
    faq: [
      [
        t("A task is overdue. Should the status change by itself?", "משימה באיחור. הסטטוס צריך להשתנות לבד?", "Una tarea está vencida. ¿El estado debe cambiar solo?", "Uma tarefa está atrasada. O status deve mudar sozinho?", "مهمة متأخرة. هل تتغير الحالة وحدها؟"),
        t("No. The notification center shows the late task. Contacted, Interested, Lost and Converted change only when a person records what happened.", "לא. מרכז ההתראות מראה את המשימה המאוחרת. נוצר קשר, מעוניין, אבוד והומר משתנים רק כשאדם רושם מה קרה.", "No. El centro de avisos muestra la tarea atrasada. Contactado, Interesado, Perdido y Convertido cambian solo cuando una persona registra lo que pasó.", "Não. O centro de avisos mostra a tarefa atrasada. Contato feito, Interessado, Perdido e Convertido mudam só quando uma pessoa registra o que aconteceu.", "لا. مركز التنبيهات يعرض المهمة المتأخرة. تم التواصل ومهتم وضائع وتم التحويل تتغير فقط حين يسجّل شخص ما حدث."),
      ],
    ],
    section: section({
      heading: t("A week you can audit", "שבוע שאפשר לבדוק", "Una semana que se puede auditar", "Uma semana que dá para auditar", "أسبوع يمكن مراجعته"),
      paragraphs: [
        t(
          "At the end of the week, every open lead should have a status that matches a real event and a dated next step, or a reason it is Lost. A lead with neither is the one that disappears.",
          "בסוף השבוע לכל ליד פתוח צריך להיות סטטוס שמתאים לאירוע אמיתי וצעד הבא עם תאריך, או סיבה שהוא אבוד. ליד בלי שני אלה הוא זה שנעלם.",
          "Al final de la semana, cada lead abierto debe tener un estado que coincida con un hecho real y un siguiente paso con fecha, o una razón de Perdido. Un lead sin ninguna de las dos cosas es el que desaparece.",
          "No fim da semana, cada lead aberto deve ter um status que combine com um fato real e um próximo passo com data, ou um motivo de Perdido. Um lead sem nenhum dos dois é o que desaparece.",
          "في نهاية الأسبوع يجب أن يكون لكل عميل مفتوح حالة تطابق حدثاً حقيقياً وخطوة تالية بتاريخ، أو سبب أنه ضائع. العميل الذي بلا أي منهما هو الذي يختفي.",
        ),
      ],
      table: {
        columns: [
          t("What you see", "מה רואים", "Qué ve", "O que se vê", "ما ترون"),
          t("What it means", "מה זה אומר", "Qué significa", "O que significa", "ما المعنى"),
          t("What to do", "מה עושים", "Qué hacer", "O que fazer", "ماذا تفعلون"),
        ],
        rows: [
          [
            t("New, and no task", "חדש, ובלי משימה", "Nuevo, y sin tarea", "Novo, e sem tarefa", "جديد، وبلا مهمة"),
            t("Nobody owns the next step", "אף אחד לא אחראי לצעד הבא", "Nadie es dueño del siguiente paso", "Ninguém é dono do próximo passo", "لا أحد يملك الخطوة التالية"),
            t("Reach the person. Set Contacted only if you did. Then date the next task.", "הגיעו אל האדם. סמנו נוצר קשר רק אם הגעתם. אחר כך תנו תאריך למשימה הבאה.", "Llegue a la persona. Ponga Contactado solo si lo hizo. Luego ponga fecha a la siguiente tarea.", "Alcance a pessoa. Marque Contato feito só se alcançou. Depois date a próxima tarefa.", "صلوا إلى الشخص. ضعوا تم التواصل فقط إذا فعلتم. ثم أرّخوا المهمة التالية."),
          ],
          [
            t("Contacted, task overdue", "נוצר קשר, משימה באיחור", "Contactado, tarea vencida", "Contato feito, tarefa atrasada", "تم التواصل، مهمة متأخرة"),
            t("The notification center is already showing it", "מרכז ההתראות כבר מראה את זה", "El centro de avisos ya lo muestra", "O centro de avisos já mostra isso", "مركز التنبيهات يعرضها أصلاً"),
            t("Do the task, or move the date and write why.", "בצעו את המשימה, או הזיזו את התאריך וכתבו למה.", "Haga la tarea, o mueva la fecha y escriba por qué.", "Faça a tarefa, ou mude a data e escreva por quê.", "نفّذوا المهمة، أو انقلوا التاريخ واكتبوا السبب."),
          ],
          [
            t("Interested, no task and no booking", "מעוניין, בלי משימה ובלי תור", "Interesado, sin tarea y sin reserva", "Interessado, sem tarefa e sem reserva", "مهتم، بلا مهمة وبلا حجز"),
            t("Someone said yes to a next step that was never written", "מישהו אמר כן לצעד הבא שמעולם לא נכתב", "Alguien dijo que sí a un paso que nunca se escribió", "Alguém disse sim a um passo que nunca foi escrito", "قال أحد نعم لخطوة لم تُكتب قط"),
            t("Book the service if you are on the business plan, or write the task if you are not.", "קבעו את השירות אם אתם בחבילה העסקית, או כתבו את המשימה אם לא.", "Reserve el servicio si está en el plan de negocio, o escriba la tarea si no.", "Reserve o serviço se estiver no plano de negócios, ou escreva a tarefa se não estiver.", "احجزوا الخدمة إذا كنتم في الخطة التجارية، أو اكتبوا المهمة إذا لم تكونوا."),
          ],
        ],
      },
      example: {
        title: t("A clinic on Thursday afternoon", "מרפאה ביום חמישי אחר הצהריים", "Una clínica el jueves por la tarde", "Uma clínica na quinta à tarde", "عيادة بعد ظهر الخميس"),
        body: t(
          "Four people asked about a treatment. Two have a task for Friday. One is Interested with nothing dated, so that file is the one to open before the front desk leaves. The fourth is still New from Tuesday: that is a missed first contact, not a busy week.",
          "ארבעה אנשים שאלו על טיפול. לשניים יש משימה ליום שישי. אחד מעוניין בלי תאריך, אז זה התיק שפותחים לפני שקבלה הולכת. הרביעי עדיין חדש מיום שלישי: זה מגע ראשון שהוחמץ, לא שבוע עמוס.",
          "Cuatro personas preguntaron por un tratamiento. Dos tienen una tarea para el viernes. Una está en Interesado sin fecha, así que ese es el expediente que hay que abrir antes de que recepción se vaya. La cuarta sigue en Nuevo desde el martes: es un primer contacto perdido, no una semana ocupada.",
          "Quatro pessoas perguntaram de um tratamento. Duas têm uma tarefa para sexta. Uma está Interessado sem data, então esse é o arquivo a abrir antes de a recepção sair. A quarta continua Novo desde terça: é um primeiro contato perdido, não uma semana cheia.",
          "أربعة أشخاص سألوا عن علاج. لاثنان مهمة يوم الجمعة. واحد مهتم بلا تاريخ، فهذا الملف الذي يُفتح قبل مغادرة الاستقبال. الرابع ما زال جديداً منذ الثلاثاء: هذا اتصال أول فائت، لا أسبوع مزدحم.",
        ),
      },
      links: [
        link("/guides/what-is-a-crm", t("What the record is", "מהי הרשומה", "Qué es el registro", "O que é o registro", "ما هو السجل")),
        link("/guides/business-automation", t("When a rule should create the task", "מתי כלל צריך ליצור את המשימה", "Cuándo una regla debe crear la tarea", "Quando uma regra deve criar a tarefa", "متى يجب أن تنشئ القاعدة المهمة")),
        link("/templates", t("Follow-up workbook", "חוברת המעקב", "Libro de seguimiento", "Pasta de acompanhamento", "دفتر المتابعة")),
      ],
    }),
  },
  "crm-and-business-platform": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار")), link("/platform", t("The platform", "הפלטפורמה", "La plataforma", "A plataforma", "المنصة"))],
    faq: [
      [
        t("Does the business plan include WhatsApp?", "האם החבילה העסקית כוללת וואטסאפ?", "¿El plan de negocio incluye WhatsApp?", "O plano de negócios inclui WhatsApp?", "هل تشمل الخطة التجارية واتساب؟"),
        t("No. A connected number is $29 a month, plus Meta's messaging charges. Neither CRM only nor the business plan includes that number.", "לא. מספר מחובר עולה 29 דולר לחודש, ועוד חיובי ההודעות של Meta. לא CRM בלבד ולא החבילה העסקית כוללים את המספר הזה.", "No. Un número conectado cuesta 29 dólares al mes, más los cargos de mensaje de Meta. Ni el CRM solo ni el plan de negocio incluyen ese número.", "Não. Um número conectado custa US$ 29 por mês, mais as cobranças de mensagem da Meta. Nem o CRM sozinho nem o plano de negócios incluem esse número.", "لا. الرقم المتصل 29 دولاراً في الشهر، إضافة إلى رسوم رسائل Meta. لا CRM وحده ولا الخطة التجارية يشملان هذا الرقم."),
      ],
    ],
    section: section({
      heading: t("Four questions before the plan", "ארבע שאלות לפני המסלול", "Cuatro preguntas antes del plan", "Quatro perguntas antes do plano", "أربعة أسئلة قبل الخطة"),
      paragraphs: [
        t(
          "Choose from the work, not from the label. CRM only at $49 a month is the pipeline and the client file. The business plan at $99 a month or $990 a year adds appointments, collaborations and automations. The website has its own price on the pricing page.",
          "בוחרים לפי העבודה, לא לפי השם. CRM בלבד ב־49 דולר לחודש הוא מהלך הלידים ותיק הלקוח. החבילה העסקית ב־99 דולר לחודש או 990 לשנה מוסיפה תורים, שיתופים ואוטומציות. לאתר יש מחיר משלו בעמוד המחירים.",
          "Elija por el trabajo, no por el nombre. El CRM solo a 49 dólares al mes es el seguimiento de los clientes y el expediente. El plan de negocio a 99 dólares al mes o 990 al año añade citas, colaboraciones y automatizaciones. El sitio tiene su propio precio en la página de precios.",
          "Escolha pelo trabalho, não pelo nome. O CRM sozinho a US$ 49 por mês é o acompanhamento dos clientes e o arquivo. O plano de negócios a US$ 99 por mês ou US$ 990 por ano acrescenta agenda, colaborações e automações. O site tem o próprio preço na página de preços.",
          "اختاروا حسب العمل، لا حسب الاسم. CRM وحده بـ 49 دولاراً في الشهر هو المسار وملف العميل. الخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة تضيف المواعيد والتعاون والأتمتة. للموقع سعره في صفحة الأسعار.",
        ),
      ],
      table: {
        columns: [
          t("The job", "העבודה", "El trabajo", "O trabalho", "العمل"),
          t("CRM only, $49 a month", "CRM בלבד, 49 דולר לחודש", "CRM solo, 49 dólares al mes", "CRM sozinho, US$ 49 por mês", "CRM وحده، 49 دولاراً في الشهر"),
          t("Business plan, $99 a month or $990 a year", "חבילה עסקית, 99 לחודש או 990 לשנה", "Plan de negocio, 99 al mes o 990 al año", "Plano de negócios, US$ 99 por mês ou US$ 990 por ano", "الخطة التجارية، 99 في الشهر أو 990 في السنة"),
        ],
        rows: [
          [
            t("Pipeline and client file", "מהלך הלידים ותיק לקוח", "Seguimiento y expediente", "Acompanhamento e arquivo", "المسار وملف العميل"),
            t("Included", "כלול", "Incluido", "Incluído", "مشمول"),
            t("Included", "כלול", "Incluido", "Incluído", "مشمول"),
          ],
          [
            t("Appointments and a service catalog", "תורים וקטלוג שירותים", "Citas y catálogo de servicios", "Agenda e catálogo de serviços", "مواعيد وكتالوج خدمات"),
            t("Not included", "לא כלול", "No incluido", "Não incluído", "غير مشمول"),
            t("Included", "כלול", "Incluido", "Incluído", "مشمول"),
          ],
          [
            t("A rule that creates the next task", "כלל שיוצר את המשימה הבאה", "Una regla que crea la siguiente tarea", "Uma regra que cria a próxima tarefa", "قاعدة تنشئ المهمة التالية"),
            t("Not included", "לא כלול", "No incluido", "Não incluído", "غير مشمول"),
            t("Included", "כלול", "Incluido", "Incluído", "مشمول"),
          ],
          [
            t("A connected WhatsApp number", "מספר וואטסאפ מחובר", "Un número de WhatsApp conectado", "Um número de WhatsApp conectado", "رقم واتساب متصل"),
            t("Separate, $29 a month", "נפרד, 29 דולר לחודש", "Aparte, 29 dólares al mes", "À parte, US$ 29 por mês", "منفصل، 29 دولاراً في الشهر"),
            t("Separate, $29 a month", "נפרד, 29 דולר לחודש", "Aparte, 29 dólares al mes", "À parte, US$ 29 por mês", "منفصل، 29 دولاراً في الشهر"),
          ],
        ],
      },
      links: [
        link("/guides/business-automation", t("What an automation is", "מהי אוטומציה", "Qué es una automatización", "O que é uma automação", "ما هي الأتمتة")),
        link("/guides/appointments-for-a-service-business", t("Appointments", "תורים", "Citas", "Agenda", "المواعيد")),
        link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار")),
      ],
    }),
  },
  "meta-lead-ads-to-crm": {
    review: REVIEW,
    sources: [META_LEADS, PRICING],
    products: [link("/crm", t("Open the CRM", "לעמוד ה־CRM", "Abrir el CRM", "Abrir o CRM", "صفحة CRM"))],
    faq: [
      [
        t("The campaign shows 30 results. Why are there 12 leads?", "הקמפיין מראה 30 תוצאות. למה יש 12 לידים?", "La campaña muestra 30 resultados. ¿Por qué hay 12 leads?", "A campanha mostra 30 resultados. Por que há 12 leads?", "الحملة تعرض 30 نتيجة. لماذا هناك 12 عميلاً؟"),
        t("A result in the campaign report is not a person in the file. A lead exists when Lead Ads creates a row after the business approved the permission on its own Facebook page. Bizuply is a Meta Tech Provider. That is not a Meta Business Partner badge.", "תוצאה בדוח הקמפיין אינה אדם בתיק. ליד קיים כש־Lead Ads יוצר שורה אחרי שהעסק אישר את ההרשאה על דף הפייסבוק שלו. ביזאפלי היא Meta Tech Provider. זה לא תג Meta Business Partner.", "Un resultado en el informe no es una persona en el expediente. Un lead existe cuando Lead Ads crea una fila después de que el negocio aprobó el permiso en su propia página de Facebook. Bizuply es Meta Tech Provider, no una insignia de Meta Business Partner.", "Um resultado no relatório não é uma pessoa no arquivo. Um lead existe quando o Lead Ads cria uma linha depois que o negócio aprovou a permissão na própria página do Facebook. A Bizuply é Meta Tech Provider, não um selo de Meta Business Partner.", "نتيجة في تقرير الحملة ليست شخصاً في الملف. العميل موجود حين ينشئ Lead Ads صفاً بعد موافقة النشاط على الإذن في صفحة فيسبوك الخاصة به. Bizuply هي Meta Tech Provider، وهذا ليس شارة Meta Business Partner."),
      ],
    ],
    section: section({
      heading: t("The same day the row arrives", "באותו יום שהשורה מגיעה", "El mismo día en que llega la fila", "No mesmo dia em que a linha chega", "في اليوم نفسه الذي يصل فيه الصف"),
      paragraphs: [
        t(
          "Meta documents how a lead form on an ad can collect the person's details. In Bizuply that becomes a CRM row only after the business connects its own page and approves the permission. The row starts as New, and the source stays on it. Connecting the page does not start ad spend.",
          "Meta מתעדת איך טופס לידים על מודעה יכול לאסוף את פרטי האדם. בביזאפלי זה הופך לשורת CRM רק אחרי שהעסק מחבר את הדף שלו ומאשר את ההרשאה. השורה מתחילה כחדשה, והמקור נשאר עליה. חיבור הדף לא מתחיל הוצאה על מודעות.",
          "Meta documenta cómo un formulario de lead en un anuncio puede recoger los datos de la persona. En Bizuply eso se vuelve una fila del CRM solo después de que el negocio conecta su propia página y aprueba el permiso. La fila empieza en Nuevo y el origen se queda en ella. Conectar la página no inicia el gasto.",
          "A Meta documenta como um formulário de lead num anúncio pode recolher os dados da pessoa. Na Bizuply isso vira uma linha do CRM só depois que o negócio conecta a própria página e aprova a permissão. A linha começa em Novo e a origem fica nela. Conectar a página não inicia o gasto.",
          "توثّق Meta كيف يمكن لنموذج عملاء في إعلان أن يجمع بيانات الشخص. في Bizuply يصبح ذلك صف CRM فقط بعد أن يربط النشاط صفحته ويوافق على الإذن. يبدأ الصف جديداً ويبقى المصدر عليه. ربط الصفحة لا يبدأ الإنفاق.",
        ),
      ],
      steps: [
        t("Open the new row and read the source before you read the campaign chart.", "פתחו את השורה החדשה וקראו את המקור לפני שקוראים את תרשים הקמפיין.", "Abra la fila nueva y lea el origen antes de leer el gráfico de la campaña.", "Abra a linha nova e leia a origem antes de ler o gráfico da campanha.", "افتحوا الصف الجديد واقرأوا المصدر قبل قراءة رسم الحملة."),
        t("Confirm the status is New. Do not mark Contacted until someone reaches the person.", "ודאו שהסטטוס חדש. אל תסמנו נוצר קשר עד שמישהו מגיע אל האדם.", "Confirme que el estado es Nuevo. No marque Contactado hasta que alguien llegue a la persona.", "Confirme que o status é Novo. Não marque Contato feito até alguém alcançar a pessoa.", "تأكدوا أن الحالة جديد. لا تضعوا تم التواصل حتى يصل أحد إلى الشخص."),
        t("Write a dated task before you leave the row.", "כתבו משימה עם תאריך לפני שעוזבים את השורה.", "Escriba una tarea con fecha antes de salir de la fila.", "Escreva uma tarefa com data antes de sair da linha.", "اكتبوا مهمة بتاريخ قبل مغادرة الصف."),
        t("Leave media spend with Meta. The CRM row is not an invoice for the ads.", "השאירו את הוצאת המדיה אצל Meta. שורת ה־CRM אינה חשבונית למודעות.", "Deje el gasto en medios con Meta. La fila del CRM no es una factura de los anuncios.", "Deixe o gasto de mídia com a Meta. A linha do CRM não é uma fatura dos anúncios.", "اتركوا إنفاق الوسائط لدى Meta. صف CRM ليس فاتورة للإعلانات."),
      ],
      links: [
        link("/guides/connect-a-meta-ad-account", t("Connect the ad account", "חיבור חשבון המודעות", "Conectar la cuenta de anuncios", "Conectar a conta de anúncios", "ربط حساب الإعلانات")),
        link("/guides/from-ad-to-follow-up", t("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة")),
      ],
    }),
  },
  "connect-a-meta-ad-account": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار"))],
    faq: [
      [
        t("Does connecting the account create a campaign?", "האם חיבור החשבון יוצר קמפיין?", "¿Conectar la cuenta crea una campaña?", "Conectar a conta cria uma campanha?", "هل ينشئ ربط الحساب حملة؟"),
        t("No. The connection lets Bizuply read the account the business authorizes. It does not create a campaign and it does not move money.", "לא. החיבור מאפשר לביזאפלי לקרוא את החשבון שהעסק מאשר. הוא לא יוצר קמפיין והוא לא מזיז כסף.", "No. La conexión permite a Bizuply leer la cuenta que el negocio autoriza. No crea una campaña y no mueve dinero.", "Não. A conexão permite à Bizuply ler a conta que o negócio autoriza. Ela não cria uma campanha e não move dinheiro.", "لا. يتيح الربط لـ Bizuply قراءة الحساب الذي يأذن به النشاط. لا ينشئ حملة ولا ينقل مالاً."),
      ],
    ],
    section: section({
      heading: t("What the connection is allowed to do", "מה מותר לחיבור לעשות", "Qué puede hacer la conexión", "O que a conexão pode fazer", "ما يُسمح للربط أن يفعله"),
      table: {
        columns: [
          t("Action", "פעולה", "Acción", "Ação", "الإجراء"),
          t("After the business authorizes the account", "אחרי שהעסק מאשר את החשבון", "Después de que el negocio autoriza la cuenta", "Depois que o negócio autoriza a conta", "بعد أن يأذن النشاط للحساب"),
        ],
        rows: [
          [
            t("Read the authorized ad account", "לקרוא את חשבון המודעות שאושר", "Leer la cuenta de anuncios autorizada", "Ler a conta de anúncios autorizada", "قراءة حساب الإعلانات المأذون"),
            t("Yes", "כן", "Sí", "Sim", "نعم"),
          ],
          [
            t("Create a campaign by itself", "ליצור קמפיין לבד", "Crear una campaña por sí sola", "Criar uma campanha sozinha", "إنشاء حملة وحده"),
            t("No", "לא", "No", "Não", "لا"),
          ],
          [
            t("Move money or pay Meta", "להזיז כסף או לשלם ל־Meta", "Mover dinero o pagar a Meta", "Mover dinheiro ou pagar a Meta", "نقل مال أو الدفع لـ Meta"),
            t("No. Meta bills the media.", "לא. Meta מחייבת את המדיה.", "No. Meta cobra los medios.", "Não. A Meta cobra a mídia.", "لا. تحصّل Meta الوسائط."),
          ],
          [
            t("Turn every campaign result into a person", "להפוך כל תוצאת קמפיין לאדם", "Convertir cada resultado de campaña en una persona", "Transformar cada resultado de campanha em uma pessoa", "تحويل كل نتيجة حملة إلى شخص"),
            t("No. A person arrives through Lead Ads, a Google Ads lead form, or a form on a Bizuply site.", "לא. אדם מגיע דרך Lead Ads, טופס לידים של Google Ads, או טופס באתר ביזאפלי.", "No. Una persona llega por Lead Ads, un formulario de Google Ads o un formulario en un sitio de Bizuply.", "Não. Uma pessoa chega por Lead Ads, um formulário do Google Ads ou um formulário num site da Bizuply.", "لا. يصل الشخص عبر Lead Ads أو نموذج Google Ads أو نموذج في موقع Bizuply."),
          ],
        ],
      },
      links: [
        link("/guides/manage-meta-campaigns", t("Read a campaign", "קריאת קמפיין", "Leer una campaña", "Ler uma campanha", "قراءة حملة")),
        link("/guides/meta-lead-ads-to-crm", t("Lead ads into the CRM", "לידים ממודעות אל ה־CRM", "Lead ads hacia el CRM", "Lead ads para o CRM", "إعلانات العملاء إلى CRM")),
      ],
    }),
  },
  "manage-meta-campaigns": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار"))],
    faq: [
      [
        t("Can this page tell me if a campaign is profitable?", "האם העמוד הזה יכול לומר אם קמפיין רווחי?", "¿Esta página puede decir si una campaña es rentable?", "Esta página pode dizer se uma campanha é lucrativa?", "هل تستطيع هذه الصفحة أن تقول إن الحملة مربحة؟"),
        t("No. The report shows performance of the connected campaigns. Profit needs the revenue you recorded against the spend Meta billed. Bizuply does not mark a campaign profitable from the report alone.", "לא. הדוח מראה ביצועים של הקמפיינים המחוברים. רווח צריך את ההכנסה שרשמתם מול ההוצאה ש־Meta חייבה. ביזאפלי לא מסמנת קמפיין כרווחי מהדוח לבדו.", "No. El informe muestra el rendimiento de las campañas conectadas. La ganancia necesita el ingreso que usted registró frente al gasto que cobró Meta. Bizuply no marca una campaña como rentable solo con el informe.", "Não. O relatório mostra o desempenho das campanhas conectadas. O lucro precisa da receita que você registrou contra o gasto que a Meta cobrou. A Bizuply não marca uma campanha como lucrativa só pelo relatório.", "لا. يعرض التقرير أداء الحملات المتصلة. الربح يحتاج الإيراد الذي سجّلتموه مقابل الإنفاق الذي حصّلته Meta. لا تعلّم Bizuply الحملة مربحة من التقرير وحده."),
      ],
    ],
    section: section({
      heading: t("Read the report as a report", "קוראים את הדוח כדוח", "Lea el informe como un informe", "Leia o relatório como um relatório", "اقرأوا التقرير بوصفه تقريراً"),
      paragraphs: [
        t(
          "After the business connects its own ad account, the dashboard can create and edit campaigns, ad sets and ads, and it can show performance. That view is not the client file.",
          "אחרי שהעסק מחבר את חשבון המודעות שלו, לוח הבקרה יכול ליצור ולערוך קמפיינים, ערכות מודעות ומודעות, והוא יכול להציג ביצועים. התצוגה הזאת אינה תיק הלקוח.",
          "Después de que el negocio conecta su propia cuenta de anuncios, el panel puede crear y editar campañas, conjuntos de anuncios y anuncios, y puede mostrar el rendimiento. Esa vista no es el expediente.",
          "Depois que o negócio conecta a própria conta de anúncios, o painel pode criar e editar campanhas, conjuntos de anúncios e anúncios, e pode mostrar o desempenho. Essa visão não é o arquivo do cliente.",
          "بعد أن يربط النشاط حساب إعلاناته، يمكن للوحة إنشاء الحملات ومجموعات الإعلانات والإعلانات وتعديلها، وعرض الأداء. هذا العرض ليس ملف العميل.",
        ),
      ],
      table: {
        columns: [
          t("In the campaign view", "בתצוגת הקמפיין", "En la vista de campaña", "Na visão da campanha", "في عرض الحملة"),
          t("In the CRM", "ב־CRM", "En el CRM", "No CRM", "في CRM"),
        ],
        rows: [
          [
            t("A result", "תוצאה", "Un resultado", "Um resultado", "نتيجة"),
            t("Not automatically a person", "לא אדם באופן אוטומטי", "No es automáticamente una persona", "Não é automaticamente uma pessoa", "ليست شخصاً تلقائياً"),
          ],
          [
            t("Spend", "הוצאה", "Gasto", "Gasto", "إنفاق"),
            t("Billed by Meta, not by this page", "מחויב על ידי Meta, לא על ידי העמוד הזה", "Lo cobra Meta, no esta página", "Cobrado pela Meta, não por esta página", "تحصّله Meta، لا هذه الصفحة"),
          ],
          [
            t("A person you can call", "אדם שאפשר להתקשר אליו", "Una persona a la que se puede llamar", "Uma pessoa para quem dá para ligar", "شخص يمكن الاتصال به"),
            t("A row from Lead Ads, Google Ads lead forms, or a Bizuply site form", "שורה מ־Lead Ads, מטפסי Google Ads, או מטופס באתר ביזאפלי", "Una fila de Lead Ads, formularios de Google Ads o un formulario de un sitio Bizuply", "Uma linha de Lead Ads, formulários do Google Ads ou um formulário de um site Bizuply", "صف من Lead Ads أو نماذج Google Ads أو نموذج موقع Bizuply"),
          ],
        ],
      },
      links: [
        link("/guides/from-ad-to-follow-up", t("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة")),
        link("/templates", t("Return calculator", "מחשבון התשואה", "Calculadora de retorno", "Calculadora de retorno", "حاسبة العائد")),
      ],
    }),
  },
  "business-automation": {
    review: REVIEW,
    sources: [PRICING, META_TEMPLATES],
    products: [link("/automations", t("Automations", "אוטומציות", "Automatizaciones", "Automações", "الأتمتة"))],
    faq: [
      [
        t("Can the rule mark a lead Contacted?", "האם הכלל יכול לסמן ליד כ־נוצר קשר?", "¿La regla puede marcar un lead como Contactado?", "A regra pode marcar um lead como Contato feito?", "هل تستطيع القاعدة تعليم العميل تم التواصل؟"),
        t("Do not publish that rule. Contacted means a person was reached. A task can be created automatically. The status should change when someone records the contact.", "אל תפרסמו כלל כזה. נוצר קשר אומר שהגעתם אל אדם. משימה יכולה להיווצר אוטומטית. הסטטוס צריך להשתנות כשמישהו רושם את הקשר.", "No publique esa regla. Contactado significa que se llegó a una persona. Una tarea puede crearse sola. El estado debe cambiar cuando alguien registra el contacto.", "Não publique essa regra. Contato feito significa que uma pessoa foi alcançada. Uma tarefa pode ser criada sozinha. O status deve mudar quando alguém registra o contato.", "لا تنشروا هذه القاعدة. تم التواصل يعني أن شخصاً تم الوصول إليه. يمكن إنشاء مهمة تلقائياً. يجب أن تتغير الحالة حين يسجّل أحد التواصل."),
      ],
    ],
    section: section({
      heading: t("Three rules worth publishing", "שלושה כללים ששווה לפרסם", "Tres reglas que vale la pena publicar", "Três regras que vale publicar", "ثلاث قواعد تستحق النشر"),
      paragraphs: [
        t(
          "An automation on the business plan is a background rule: a trigger such as a new lead or a status change can create a task or a reminder. It does not approve a WhatsApp template and it does not buy ads. Publish the rule before you expect it to run.",
          "אוטומציה בחבילה העסקית היא כלל ברקע: טריגר כמו ליד חדש או שינוי סטטוס יכול ליצור משימה או תזכורת. היא לא מאשרת תבנית וואטסאפ והיא לא קונה מודעות. מפרסמים את הכלל לפני שמצפים שהוא ירוץ.",
          "Una automatización del plan de negocio es una regla de fondo: un disparador como un lead nuevo o un cambio de estado puede crear una tarea o un recordatorio. No aprueba una plantilla de WhatsApp y no compra anuncios. Publique la regla antes de esperar que se ejecute.",
          "Uma automação do plano de negócios é uma regra de fundo: um gatilho como um lead novo ou uma mudança de status pode criar uma tarefa ou um lembrete. Ela não aprova um modelo de WhatsApp e não compra anúncios. Publique a regra antes de esperar que rode.",
          "أتمتة الخطة التجارية قاعدة في الخلفية: مشغّل مثل عميل جديد أو تغيير حالة يمكن أن ينشئ مهمة أو تذكيراً. لا توافق على قالب واتساب ولا تشتري إعلانات. انشروا القاعدة قبل أن تتوقعوا تشغيلها.",
        ),
      ],
      table: {
        columns: [
          t("Rule", "כלל", "Regla", "Regra", "القاعدة"),
          t("Publish it?", "לפרסם?", "¿Publicarla?", "Publicar?", "هل تُنشر؟"),
          t("Why", "למה", "Por qué", "Por quê", "لماذا"),
        ],
        rows: [
          [
            t("A new lead creates a dated task for the owner", "ליד חדש יוצר משימה עם תאריך לאחראי", "Un lead nuevo crea una tarea con fecha para el dueño", "Um lead novo cria uma tarefa com data para o dono", "عميل جديد ينشئ مهمة بتاريخ للمالك"),
            t("Yes", "כן", "Sí", "Sim", "نعم"),
            t("The next step exists even if nobody is at the desk", "הצעד הבא קיים גם אם אף אחד לא ליד השולחן", "El siguiente paso existe aunque nadie esté en el escritorio", "O próximo passo existe mesmo se ninguém estiver na mesa", "الخطوة التالية موجودة حتى لو لم يكن أحد عند المكتب"),
          ],
          [
            t("Interested, and no task exists, so create one", "מעוניין, ואין משימה, אז יוצרים אחת", "Interesado y no hay tarea, así que se crea una", "Interessado e não há tarefa, então cria-se uma", "مهتم ولا توجد مهمة، فتُنشأ واحدة"),
            t("Yes", "כן", "Sí", "Sim", "نعم"),
            t("A verbal yes does not survive the afternoon without a date", "כן בעל פה לא שורד את אחר הצהריים בלי תאריך", "Un sí de palabra no sobrevive la tarde sin una fecha", "Um sim de boca não sobrevive à tarde sem uma data", "نعم شفهية لا تبقى حتى المساء بلا تاريخ"),
          ],
          [
            t("An appointment creates a reminder task for the day before", "תור יוצר משימת תזכורת ליום שלפני", "Una cita crea una tarea de recordatorio para el día anterior", "Uma reserva cria uma tarefa de lembrete para o dia anterior", "موعد ينشئ مهمة تذكير لليوم السابق"),
            t("Yes", "כן", "Sí", "Sim", "نعم"),
            t("The reminder is a task. It is not an approved WhatsApp template.", "התזכורת היא משימה. היא לא תבנית וואטסאפ מאושרת.", "El recordatorio es una tarea. No es una plantilla de WhatsApp aprobada.", "O lembrete é uma tarefa. Não é um modelo de WhatsApp aprovado.", "التذكير مهمة. ليس قالب واتساب معتمداً."),
          ],
          [
            t("New becomes Contacted because a task exists", "חדש הופך ל־נוצר קשר כי יש משימה", "Nuevo pasa a Contactado porque existe una tarea", "Novo vira Contato feito porque existe uma tarefa", "جديد يصبح تم التواصل لأن هناك مهمة"),
            t("No", "לא", "No", "Não", "لا"),
            t("The status would describe a contact that did not happen", "הסטטוס היה מתאר קשר שלא קרה", "El estado describiría un contacto que no ocurrió", "O status descreveria um contato que não aconteceu", "ستصف الحالة تواصلاً لم يحدث"),
          ],
          [
            t("Every new lead sends a promotion on WhatsApp", "כל ליד חדש שולח מבצע בוואטסאפ", "Cada lead nuevo envía una promoción por WhatsApp", "Cada lead novo envia uma promoção no WhatsApp", "كل عميل جديد يرسل عرضاً على واتساب"),
            t("No", "לא", "No", "Não", "لا"),
            t("Meta still has to approve the template, and the number is a separate $29 subscription", "Meta עדיין צריכה לאשר את התבנית, והמספר הוא מנוי נפרד של 29 דולר", "Meta todavía tiene que aprobar la plantilla, y el número es una suscripción aparte de 29 dólares", "A Meta ainda precisa aprovar o modelo, e o número é uma assinatura à parte de US$ 29", "ما زال على Meta اعتماد القالب، والرقم اشتراك منفصل بـ 29 دولاراً"),
          ],
        ],
      },
      links: [
        link("/guides/whatsapp-message-templates", t("Message templates", "תבניות הודעה", "Plantillas de mensajes", "Modelos de mensagem", "قوالب الرسائل")),
        link("/guides/follow-up-on-leads", t("The follow-up the rule is trying to protect", "המעקב שהכלל מנסה לשמור", "El seguimiento que la regla intenta proteger", "O acompanhamento que a regra tenta proteger", "المتابعة التي تحميها القاعدة")),
      ],
    }),
  },
  "build-a-website-without-code": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/website-builder", t("Website builder", "בניית אתרים", "Constructor de sitios", "Construtor de sites", "منشئ المواقع"))],
    faq: [
      [
        t("Does publishing the site create the lead?", "האם פרסום האתר יוצר את הליד?", "¿Publicar el sitio crea el lead?", "Publicar o site cria o lead?", "هل نشر الموقع ينشئ العميل؟"),
        t("No. A form on the published Bizuply site can create a lead whose source is the website and whose first status is New. A page with no form does not.", "לא. טופס באתר ביזאפלי שפורסם יכול ליצור ליד שהמקור שלו הוא האתר והסטטוס הראשון שלו הוא חדש. עמוד בלי טופס לא עושה את זה.", "No. Un formulario en el sitio publicado de Bizuply puede crear un lead cuyo origen es el sitio y cuyo primer estado es Nuevo. Una página sin formulario no lo hace.", "Não. Um formulário no site publicado da Bizuply pode criar um lead cuja origem é o site e cujo primeiro status é Novo. Uma página sem formulário não faz isso.", "لا. نموذج في موقع Bizuply المنشور يمكن أن ينشئ عميلاً مصدره الموقع وحالته الأولى جديد. صفحة بلا نموذج لا تفعل ذلك."),
      ],
    ],
    section: section({
      heading: t("Before you publish", "לפני שמפרסמים", "Antes de publicar", "Antes de publicar", "قبل النشر"),
      paragraphs: [
        t(
          "The editor lets you change the page without writing it by hand. Publish only after the headline says who the page is for and the form asks for something a person can answer. The website has its own price on the pricing page. It is not the $49 CRM plan and it is not the $29 WhatsApp number.",
          "העורך מאפשר לשנות את העמוד בלי לכתוב אותו ביד. מפרסמים רק אחרי שהכותרת אומרת למי העמוד מיועד והטופס שואל משהו שאדם יכול לענות עליו. לאתר יש מחיר משלו בעמוד המחירים. זה לא מסלול ה־CRM של 49 דולר וזה לא מספר הוואטסאפ של 29 דולר.",
          "El editor permite cambiar la página sin escribirla a mano. Publique solo después de que el titular diga para quién es la página y el formulario pida algo que una persona pueda responder. El sitio tiene su propio precio en la página de precios. No es el plan CRM de 49 dólares ni el número de WhatsApp de 29.",
          "O editor permite mudar a página sem escrevê-la à mão. Publique só depois que o título diga para quem é a página e o formulário peça algo que uma pessoa possa responder. O site tem o próprio preço na página de preços. Não é o plano de CRM de US$ 49 nem o número de WhatsApp de US$ 29.",
          "يتيح المحرر تغيير الصفحة دون كتابتها يدوياً. انشروا فقط بعد أن يقول العنوان لمن الصفحة ويطلب النموذج شيئاً يستطيع الشخص الإجابة عنه. للموقع سعره في صفحة الأسعار. ليس خطة CRM بـ 49 دولاراً وليس رقم واتساب بـ 29 دولاراً.",
        ),
      ],
      steps: [
        t("Replace the headline with the service and the person it is for.", "החליפו את הכותרת בשירות ובאדם שהוא מיועד לו.", "Sustituya el titular por el servicio y la persona a la que va dirigido.", "Substitua o título pelo serviço e pela pessoa a quem se destina.", "استبدلوا العنوان بالخدمة والشخص الموجهة إليه."),
        t("Put one form on the page: name, a phone or WhatsApp number, and what they want in one line.", "שימו טופס אחד בעמוד: שם, טלפון או מספר וואטסאפ, ומה הם רוצים בשורה אחת.", "Ponga un formulario en la página: nombre, un teléfono o número de WhatsApp, y qué quieren en una línea.", "Coloque um formulário na página: nome, um telefone ou número de WhatsApp, e o que a pessoa quer numa linha.", "ضعوا نموذجاً واحداً في الصفحة: الاسم، وهاتف أو رقم واتساب، وماذا يريدون في سطر."),
        t("Save, then read the preview as if you did not build the page.", "שמרו, ואז קראו את התצוגה כאילו לא בניתם את העמוד.", "Guarde y luego lea la vista previa como si no hubiera construido la página.", "Salve e depois leia a prévia como se não tivesse construído a página.", "احفظوا، ثم اقرأوا المعاينة كأنكم لم تبنوا الصفحة."),
        t("Publish to the address you mean to use. A form on a site that is not built in Bizuply is not an automatic source.", "פרסמו לכתובת שאתם מתכוונים להשתמש בה. טופס באתר שלא נבנה בביזאפלי אינו מקור אוטומטי.", "Publique en la dirección que pretende usar. Un formulario en un sitio que no está hecho en Bizuply no es un origen automático.", "Publique no endereço que pretende usar. Um formulário num site que não foi feito na Bizuply não é uma origem automática.", "انشروا على العنوان الذي تنوون استخدامه. نموذج في موقع لم يُبنَ في Bizuply ليس مصدراً آلياً."),
      ],
      links: [
        link("/guides/website-form-to-crm", t("How the form becomes a lead", "איך הטופס הופך לליד", "Cómo el formulario se vuelve un lead", "Como o formulário vira um lead", "كيف يصبح النموذج عميلاً")),
        link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار")),
      ],
    }),
  },
  "website-form-to-crm": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/website-builder", t("Website builder", "בניית אתרים", "Constructor de sitios", "Construtor de sites", "منشئ المواقع")), link("/crm", t("Open the CRM", "לעמוד ה־CRM", "Abrir el CRM", "Abrir o CRM", "صفحة CRM"))],
    faq: [
      [
        t("Can a form on another site create the row?", "האם טופס באתר אחר יכול ליצור את השורה?", "¿Un formulario en otro sitio puede crear la fila?", "Um formulário em outro site pode criar a linha?", "هل يستطيع نموذج في موقع آخر إنشاء الصف؟"),
        t("Not as one of the automatic sources. Those are Meta Lead Ads, Google Ads lead forms, and a form on a site built in Bizuply.", "לא כאחד מהמקורות האוטומטיים. אלה הם Lead Ads של Meta, טפסי לידים של Google Ads, וטופס באתר שנבנה בביזאפלי.", "No como uno de los orígenes automáticos. Esos son Lead Ads de Meta, formularios de Google Ads y un formulario en un sitio construido en Bizuply.", "Não como uma das origens automáticas. Essas são Lead Ads da Meta, formulários do Google Ads e um formulário num site feito na Bizuply.", "ليس كأحد المصادر الآلية. تلك هي Lead Ads من Meta ونماذج Google Ads ونموذج في موقع بُني في Bizuply."),
      ],
    ],
    section: section({
      heading: t("The smallest form that is still usable", "הטופס הקטן שעדיין אפשר לעבוד איתו", "El formulario más pequeño que todavía sirve", "O menor formulário que ainda serve", "أصغر نموذج ما زال قابلاً للاستخدام"),
      paragraphs: [
        t(
          "Ask for a name, a phone or WhatsApp number, and what the person wants in one line. Extra questions do not score the lead. If the answer is too thin to act on, the row is still New and still needs a person.",
          "מבקשים שם, טלפון או מספר וואטסאפ, ומה האדם רוצה בשורה אחת. שאלות נוספות לא נותנות ציון לליד. אם התשובה דקה מכדי לפעול לפיה, השורה עדיין חדשה ועדיין צריכה אדם.",
          "Pida un nombre, un teléfono o número de WhatsApp y qué quiere la persona en una línea. Las preguntas extra no puntúan el lead. Si la respuesta es demasiado fina para actuar, la fila sigue en Nuevo y sigue necesitando a una persona.",
          "Peça um nome, um telefone ou número de WhatsApp e o que a pessoa quer numa linha. Perguntas extras não dão nota ao lead. Se a resposta for fina demais para agir, a linha continua Novo e continua precisando de uma pessoa.",
          "اطلبوا اسماً وهاتفاً أو رقم واتساب وماذا يريد الشخص في سطر. الأسئلة الإضافية لا تمنح درجة للعميل. إذا كان الجواب أرفع من أن يُعمل به، يبقى الصف جديداً ويظل بحاجة إلى شخص.",
        ),
      ],
      example: {
        title: t("A renovation form", "טופס לשיפוץ", "Un formulario de reforma", "Um formulário de reforma", "نموذج ترميم"),
        body: t(
          "\"Kitchen, this month, call after 16:00\" is enough to open the row and write the task. Twelve questions about budget bands the team will ignore produce a row nobody wants to open.",
          "\"מטבח, החודש, להתקשר אחרי 16:00\" מספיק כדי לפתוח את השורה ולכתוב את המשימה. שתים־עשרה שאלות על טווחי תקציב שהצוות יתעלם מהן מייצרות שורה שאף אחד לא רוצה לפתוח.",
          "\"Cocina, este mes, llamar después de las 16:00\" basta para abrir la fila y escribir la tarea. Doce preguntas sobre rangos de presupuesto que el equipo ignorará producen una fila que nadie quiere abrir.",
          "\"Cozinha, este mês, ligar depois das 16:00\" basta para abrir a linha e escrever a tarefa. Doze perguntas sobre faixas de orçamento que a equipe vai ignorar produzem uma linha que ninguém quer abrir.",
          "\"مطبخ، هذا الشهر، الاتصال بعد الرابعة\" يكفي لفتح الصف وكتابة المهمة. اثنا عشر سؤالاً عن شرائح ميزانية سيتجاهلها الفريق تنتج صفاً لا يريد أحد فتحه.",
        ),
      },
      links: [
        link("/guides/follow-up-on-leads", t("What happens after the row exists", "מה קורה אחרי שהשורה קיימת", "Qué pasa después de que existe la fila", "O que acontece depois que a linha existe", "ماذا يحدث بعد وجود الصف")),
        link("/guides/build-a-website-without-code", t("Build the page", "בניית העמוד", "Construir la página", "Construir a página", "بناء الصفحة")),
      ],
    }),
  },
  "appointments-for-a-service-business": {
    review: REVIEW,
    sources: [PRICING],
    products: [link("/appointments", t("Appointments", "תורים", "Citas", "Agenda", "المواعيد"))],
    faq: [
      [
        t("Does a booking mark the lead Converted?", "האם קביעת תור מסמנת את הליד כהומר?", "¿Una reserva marca el lead como Convertido?", "Uma reserva marca o lead como Convertido?", "هل يعلّم الحجز العميل تم التحويل؟"),
        t("No. Converted is a status a person sets when the work is won. A booking is a time on the calendar. The follow-up task on the file stays.", "לא. הומר הוא סטטוס שאדם קובע כשהעבודה נסגרה. תור הוא זמן ביומן. משימת המעקב על התיק נשארת.", "No. Convertido es un estado que una persona pone cuando el trabajo se ganó. Una reserva es una hora en el calendario. La tarea de seguimiento en el expediente se queda.", "Não. Convertido é um status que uma pessoa define quando o trabalho foi ganho. Uma reserva é um horário no calendário. A tarefa de acompanhamento no arquivo fica.", "لا. تم التحويل حالة يضعها شخص حين يُكسب العمل. الحجز وقت في التقويم. تبقى مهمة المتابعة على الملف."),
      ],
    ],
    section: section({
      heading: t("A booking is not the follow-up", "תור אינו המעקב", "Una reserva no es el seguimiento", "Uma reserva não é o acompanhamento", "الحجز ليس المتابعة"),
      paragraphs: [
        t(
          "Appointments are on the business plan, not on the $49 CRM plan. You set hours for each day and a service catalog with duration and price. Open times are calculated in 15-minute steps. The person still has to be a lead before the booking means anything to the next staff member.",
          "תורים נמצאים בחבילה העסקית, לא במסלול ה־CRM של 49 דולר. קובעים שעות לכל יום וקטלוג שירותים עם משך ומחיר. הזמנים הפנויים מחושבים בקפיצות של 15 דקות. האדם עדיין צריך להיות ליד לפני שלתור יש משמעות לאדם הבא בצוות.",
          "Las citas están en el plan de negocio, no en el CRM de 49 dólares. Se fijan horarios para cada día y un catálogo de servicios con duración y precio. Los huecos se calculan en pasos de 15 minutos. La persona sigue teniendo que ser un lead antes de que la reserva signifique algo para el siguiente miembro del equipo.",
          "A agenda está no plano de negócios, não no CRM de US$ 49. Definem-se horários para cada dia e um catálogo de serviços com duração e preço. Os horários livres são calculados em passos de 15 minutos. A pessoa ainda precisa ser um lead antes de a reserva significar algo para o próximo da equipe.",
          "المواعيد في الخطة التجارية، لا في CRM بـ 49 دولاراً. تُضبط الساعات لكل يوم وكتالوج خدمات بالمدة والسعر. تُحسب الأوقات المتاحة بخطوات 15 دقيقة. يجب أن يبقى الشخص عميلاً محتملاً قبل أن يعني الحجز شيئاً لموظف الفريق التالي.",
        ),
      ],
      table: {
        columns: [
          t("Piece", "חלק", "Pieza", "Peça", "البند"),
          t("Appointment", "תור", "Cita", "Reserva", "موعد"),
          t("Follow-up task", "משימת מעקב", "Tarea de seguimiento", "Tarefa de acompanhamento", "مهمة متابعة"),
        ],
        rows: [
          [
            t("What it is", "מה זה", "Qué es", "O que é", "ما هو"),
            t("A time for a service from the catalog", "זמן לשירות מהקטלוג", "Una hora para un servicio del catálogo", "Um horário para um serviço do catálogo", "وقت لخدمة من الكتالوج"),
            t("A dated action on the lead", "פעולה עם תאריך על הליד", "Una acción con fecha en el lead", "Uma ação com data no lead", "إجراء بتاريخ على العميل"),
          ],
          [
            t("Which plan", "איזה מסלול", "Qué plan", "Qual plano", "أي خطة"),
            t("Business plan", "החבילה העסקית", "Plan de negocio", "Plano de negócios", "الخطة التجارية"),
            t("The task itself is on the lead, including CRM only", "המשימה עצמה נמצאת על הליד, כולל CRM בלבד", "La tarea en sí está en el lead, incluido el CRM solo", "A tarefa em si está no lead, inclusive no CRM sozinho", "المهمة نفسها على العميل، بما فيه CRM وحده"),
          ],
          [
            t("What it does not do", "מה זה לא עושה", "Qué no hace", "O que não faz", "ما لا يفعله"),
            t("It does not set Converted and it does not send a WhatsApp template", "הוא לא קובע הומר והוא לא שולח תבנית וואטסאפ", "No pone Convertido y no envía una plantilla de WhatsApp", "Não define Convertido e não envia um modelo de WhatsApp", "لا يضع تم التحويل ولا يرسل قالب واتساب"),
            t("It does not put a time on the calendar", "היא לא שמה זמן ביומן", "No pone una hora en el calendario", "Não coloca um horário no calendário", "لا تضع وقتاً في التقويم"),
          ],
        ],
      },
      links: [
        link("/guides/follow-up-on-leads", t("The task on the file", "המשימה על התיק", "La tarea en el expediente", "A tarefa no arquivo", "المهمة على الملف")),
        link("/solutions/service-businesses", t("Service businesses", "עסקי שירות", "Negocios de servicios", "Negócios de serviços", "أنشطة الخدمات")),
      ],
    }),
  },
  "whatsapp-cloud-api-cost": {
    review: REVIEW_META,
    sources: [META_PRICING, PRICING],
    products: [link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار"))],
    faq: [
      [
        t("Does Bizuply's $29 include Meta's message rates?", "האם 29 הדולר של ביזאפלי כוללים את תעריפי ההודעות של Meta?", "¿Los 29 dólares de Bizuply incluyen las tarifas de mensaje de Meta?", "Os US$ 29 da Bizuply incluem as tarifas de mensagem da Meta?", "هل يشمل مبلغ 29 دولاراً من Bizuply أسعار رسائل Meta؟"),
        t("No. $29 a month is Bizuply's price for one connected number. There is no free trial. Meta charges delivered business-to-user messages separately. The rate card is on Meta's page, updated 30 September 2026, and it is not reprinted here.", "לא. 29 דולר לחודש הם המחיר של ביזאפלי למספר מחובר אחד. אין ניסיון חינם. Meta מחייבת בנפרד הודעות שנמסרו מעסק למשתמש. לוח התעריפים נמצא בעמוד של Meta, שעודכן ב־30 בספטמבר 2026, והוא לא מודפס כאן מחדש.", "No. 29 dólares al mes es el precio de Bizuply por un número conectado. No hay prueba gratis. Meta cobra aparte los mensajes de empresa a usuario que se entregan. La tabla está en la página de Meta, actualizada el 30 de septiembre de 2026, y no se reimprime aquí.", "Não. US$ 29 por mês é o preço da Bizuply por um número conectado. Não há teste grátis. A Meta cobra à parte as mensagens de empresa para usuário que são entregues. A tabela está na página da Meta, atualizada em 30 de setembro de 2026, e não é reimpressa aqui.", "لا. 29 دولاراً في الشهر هو سعر Bizuply لرقم متصل واحد. لا توجد تجربة مجانية. تحصّل Meta بشكل منفصل رسائل الأعمال إلى المستخدم التي تُسلَّم. جدول الأسعار في صفحة Meta، المحدّثة في 30 سبتمبر 2026، ولا يُعاد طبعه هنا."),
      ],
    ],
    section: section({
      heading: t("Two bills, and how Meta's bill is built", "שני חשבונות, ואיך החשבון של Meta בנוי", "Dos facturas, y cómo se arma la de Meta", "Duas faturas, e como a da Meta é montada", "فاتورتان، وكيف تُبنى فاتورة Meta"),
      paragraphs: [
        t(
          "Meta's pricing page, updated 30 September 2026, says Meta charges per delivered message from a business to a user. It does not charge for a message the user sends to the business. A message has one category. Template messages are marketing, utility or authentication. A non-template reply inside the open 24-hour customer service window is a service message, unless it is a Meta Business Agent message. Rates depend on that category and on the recipient number's country calling code. This page does not copy those rates.",
          "עמוד המחירים של Meta, שעודכן ב־30 בספטמבר 2026, אומר ש־Meta מחייבת לפי הודעה שנמסרה מעסק למשתמש. היא לא מחייבת על הודעה שהמשתמש שולח לעסק. להודעה יש קטגוריה אחת. הודעות תבנית הן שיווק, שירות תפעולי או אימות. תשובה שאינה תבנית בתוך חלון שירות הלקוחות הפתוח של 24 שעות היא הודעת שירות, אלא אם זו הודעת Meta Business Agent. התעריף תלוי בקטגוריה ובקידומת המדינה של מספר הנמען. העמוד הזה לא מעתיק את התעריפים.",
          "La página de precios de Meta, actualizada el 30 de septiembre de 2026, dice que Meta cobra por mensaje entregado de una empresa a un usuario. No cobra por un mensaje que el usuario envía a la empresa. Un mensaje tiene una categoría. Los mensajes de plantilla son marketing, utilidad o autenticación. Una respuesta que no es plantilla dentro de la ventana de servicio al cliente de 24 horas es un mensaje de servicio, salvo que sea un mensaje de Meta Business Agent. La tarifa depende de esa categoría y del prefijo del país del número del destinatario. Esta página no copia esas tarifas.",
          "A página de preços da Meta, atualizada em 30 de setembro de 2026, diz que a Meta cobra por mensagem entregue de uma empresa a um usuário. Não cobra por uma mensagem que o usuário envia à empresa. Uma mensagem tem uma categoria. Mensagens de modelo são marketing, utilidade ou autenticação. Uma resposta que não é modelo dentro da janela de atendimento de 24 horas é uma mensagem de serviço, salvo se for uma mensagem do Meta Business Agent. A tarifa depende dessa categoria e do código do país do número do destinatário. Esta página não copia essas tarifas.",
          "تقول صفحة أسعار Meta، المحدّثة في 30 سبتمبر 2026، إن Meta تحصّل عن كل رسالة مُسلَّمة من نشاط إلى مستخدم. لا تحصّل عن رسالة يرسلها المستخدم إلى النشاط. للرسالة فئة واحدة. رسائل القوالب هي تسويق أو خدمة تشغيلية أو توثيق. الرد غير القالب داخل نافذة خدمة العملاء المفتوحة لـ 24 ساعة هو رسالة خدمة، إلا إذا كانت رسالة Meta Business Agent. يعتمد السعر على تلك الفئة وعلى رمز دولة رقم المستلم. هذه الصفحة لا تنسخ تلك الأسعار.",
        ),
        t(
          "From 1 October 2026, Meta's page says each business phone number gets 1,000 delivered service messages free each month. Meta charges from the 1,001st. Unused free messages do not roll over. Utility templates sent inside an open customer service window were treated differently from utility templates sent outside it. Read the current page before you budget, because the table changes. Bizuply's $29 is not one of those rows.",
          "החל מ־1 באוקטובר 2026, עמוד Meta אומר שלכל מספר טלפון עסקי יש 1,000 הודעות שירות שנמסרו בחינם בכל חודש. Meta מחייבת מהודעה 1,001. הודעות חינם שלא נוצלו לא עוברות לחודש הבא. תבניות שירות תפעולי שנשלחו בתוך חלון שירות לקוחות פתוח טופלו אחרת מתבניות שנשלחו מחוץ לו. קוראים את העמוד העדכני לפני שמתקצבים, כי הטבלה משתנה. 29 הדולר של ביזאפלי אינם אחת מהשורות האלה.",
          "Desde el 1 de octubre de 2026, la página de Meta dice que cada número de teléfono de empresa tiene 1.000 mensajes de servicio entregados gratis al mes. Meta cobra desde el mensaje 1.001. Los mensajes gratis no usados no pasan al mes siguiente. Las plantillas de utilidad enviadas dentro de una ventana abierta se trataron de otra forma que las enviadas fuera de ella. Lea la página actual antes de presupuestar, porque la tabla cambia. Los 29 dólares de Bizuply no son una de esas filas.",
          "A partir de 1 de outubro de 2026, a página da Meta diz que cada número de telefone comercial tem 1.000 mensagens de serviço entregues grátis por mês. A Meta cobra a partir da mensagem 1.001. As mensagens grátis não usadas não passam para o mês seguinte. Modelos de utilidade enviados dentro de uma janela aberta foram tratados de outro modo que os enviados fora dela. Leia a página atual antes de orçar, porque a tabela muda. Os US$ 29 da Bizuply não são uma dessas linhas.",
          "اعتباراً من 1 أكتوبر 2026، تقول صفحة Meta إن لكل رقم هاتف تجاري 1,000 رسالة خدمة مُسلَّمة مجاناً كل شهر. تحصّل Meta ابتداءً من الرسالة 1,001. الرسائل المجانية غير المستخدمة لا تنتقل إلى الشهر التالي. عُوملت قوالب الخدمة التشغيلية المرسلة داخل نافذة مفتوحة بشكل مختلف عن المرسلة خارجها. اقرأوا الصفحة الحالية قبل وضع الميزانية، لأن الجدول يتغير. مبلغ 29 دولاراً من Bizuply ليس أحد هذه الصفوف.",
        ),
      ],
      table: {
        columns: [
          t("Bill", "חשבון", "Factura", "Fatura", "الفاتورة"),
          t("Who charges", "מי מחייב", "Quién cobra", "Quem cobra", "من يحصّل"),
          t("For what", "על מה", "Por qué", "Pelo quê", "مقابل ماذا"),
        ],
        rows: [
          [
            t("Bizuply", "ביזאפלי", "Bizuply", "Bizuply", "Bizuply"),
            t("Bizuply", "ביזאפלי", "Bizuply", "Bizuply", "Bizuply"),
            t("$29 a month for one connected number. No free trial. Another number is another subscription.", "29 דולר לחודש למספר מחובר אחד. אין ניסיון חינם. מספר נוסף הוא מנוי נוסף.", "29 dólares al mes por un número conectado. Sin prueba gratis. Otro número es otra suscripción.", "US$ 29 por mês por um número conectado. Sem teste grátis. Outro número é outra assinatura.", "29 دولاراً في الشهر لرقم متصل واحد. بلا تجربة مجانية. رقم آخر هو اشتراك آخر."),
          ],
          [
            t("Meta", "Meta", "Meta", "Meta", "Meta"),
            t("Meta", "Meta", "Meta", "Meta", "Meta"),
            t("A delivered business-to-user message, by category and by the recipient's country. Not copied here.", "הודעה שנמסרה מעסק למשתמש, לפי קטגוריה ולפי מדינת הנמען. לא מועתק לכאן.", "Un mensaje entregado de empresa a usuario, por categoría y por el país del destinatario. No se copia aquí.", "Uma mensagem entregue de empresa para usuário, por categoria e pelo país do destinatário. Não é copiada aqui.", "رسالة مُسلَّمة من نشاط إلى مستخدم، حسب الفئة ودولة المستلم. غير منسوخة هنا."),
          ],
        ],
      },
      links: [
        link("/compare/whatsapp-app-or-api", t("The app or the platform", "האפליקציה או הפלטפורמה", "La app o la plataforma", "O app ou a plataforma", "التطبيق أو المنصة")),
        link("/guides/whatsapp-message-templates", t("Templates", "תבניות", "Plantillas", "Modelos", "القوالب")),
      ],
    }),
  },
  "whatsapp-message-templates": {
    review: REVIEW_META,
    sources: [META_TEMPLATES, META_PRICING],
    products: [link("/pricing", t("Pricing", "מחירים", "Precios", "Preços", "الأسعار"))],
    faq: [
      [
        t("Can I send a normal text before the person writes?", "אפשר לשלוח טקסט רגיל לפני שהאדם כותב?", "¿Puedo enviar un texto normal antes de que la persona escriba?", "Posso enviar um texto normal antes de a pessoa escrever?", "هل أستطيع إرسال نص عادي قبل أن يكتب الشخص؟"),
        t("No. Meta's pricing page says a non-template message can be sent only inside an open 24-hour customer service window, which opens when the user messages or calls. Outside that window, the business can start with an approved template.", "לא. עמוד המחירים של Meta אומר שהודעה שאינה תבנית אפשר לשלוח רק בתוך חלון שירות לקוחות פתוח של 24 שעות, שנפתח כשהמשתמש שולח הודעה או מתקשר. מחוץ לחלון, העסק יכול לפתוח עם תבנית מאושרת.", "No. La página de precios de Meta dice que un mensaje que no es plantilla solo se puede enviar dentro de una ventana de servicio de 24 horas, que se abre cuando el usuario escribe o llama. Fuera de esa ventana, la empresa puede empezar con una plantilla aprobada.", "Não. A página de preços da Meta diz que uma mensagem que não é modelo só pode ser enviada dentro de uma janela de atendimento de 24 horas, que abre quando o usuário escreve ou liga. Fora dessa janela, a empresa pode começar com um modelo aprovado.", "لا. تقول صفحة أسعار Meta إن رسالة غير قالب تُرسل فقط داخل نافذة خدمة عملاء مفتوحة لـ 24 ساعة، تُفتح حين يراسل المستخدم أو يتصل. خارج تلك النافذة، يمكن للنشاط أن يبدأ بقالب معتمد."),
      ],
    ],
    section: section({
      heading: t("Why a template comes back rejected", "למה תבנית חוזרת דחויה", "Por qué una plantilla vuelve rechazada", "Por que um modelo volta recusado", "لماذا يعود القالب مرفوضاً"),
      paragraphs: [
        t(
          "Meta reviews the template before it can be sent. Bizuply does not add a second approval queue. The business uses Embedded Signup from the dashboard, and Meta approves the number and the template. A rejection is usually the wording, the category, or a missing sample, not a missing Bizuply setting.",
          "Meta בודקת את התבנית לפני שאפשר לשלוח אותה. ביזאפלי לא מוסיפה תור אישור שני. העסק משתמש ב־Embedded Signup מלוח הבקרה, ו־Meta מאשרת את המספר ואת התבנית. דחייה היא בדרך כלל הניסוח, הקטגוריה, או דוגמה חסרה, לא הגדרה חסרה בביזאפלי.",
          "Meta revisa la plantilla antes de que se pueda enviar. Bizuply no añade una segunda cola de aprobación. El negocio usa Embedded Signup desde el panel, y Meta aprueba el número y la plantilla. Un rechazo suele ser el texto, la categoría o una muestra que falta, no un ajuste que falte en Bizuply.",
          "A Meta revisa o modelo antes de ele poder ser enviado. A Bizuply não acrescenta uma segunda fila de aprovação. O negócio usa o Embedded Signup no painel, e a Meta aprova o número e o modelo. Uma recusa costuma ser o texto, a categoria ou uma amostra que falta, não um ajuste que falte na Bizuply.",
          "تراجع Meta القالب قبل أن يُرسل. لا تضيف Bizuply طابور موافقة ثانياً. يستخدم النشاط Embedded Signup من اللوحة، وتعتمد Meta الرقم والقالب. الرفض عادة الصياغة أو الفئة أو عيّنة ناقصة، لا إعداداً ناقصاً في Bizuply.",
        ),
      ],
      table: {
        columns: [
          t("What was submitted", "מה נשלח", "Qué se envió", "O que foi enviado", "ما أُرسل"),
          t("What to change", "מה לשנות", "Qué cambiar", "O que mudar", "ماذا يُغيَّر"),
        ],
        rows: [
          [
            t("An offer written as a utility template", "מבצע שנכתב כתבנית שירות תפעולי", "Una oferta escrita como plantilla de utilidad", "Uma oferta escrita como modelo de utilidade", "عرض كُتب كقالب خدمة تشغيلية"),
            t("Rewrite it as marketing, or remove the offer", "כתבו אותו מחדש כשיווק, או הסירו את המבצע", "Reescríbala como marketing, o quite la oferta", "Reescreva como marketing, ou retire a oferta", "أعيدوا كتابته كتسويق، أو أزيلوا العرض"),
          ],
          [
            t("A variable with no sample value", "משתנה בלי ערך לדוגמה", "Una variable sin valor de muestra", "Uma variável sem valor de amostra", "متغيّر بلا قيمة عيّنة"),
            t("Add a sample Meta can read, such as a name", "הוסיפו דוגמה ש־Meta יכולה לקרוא, למשל שם", "Añada una muestra que Meta pueda leer, como un nombre", "Acrescente uma amostra que a Meta possa ler, como um nome", "أضيفوا عيّنة تستطيع Meta قراءتها، مثل اسم"),
          ],
          [
            t("A send before the template is approved", "שליחה לפני שהתבנית אושרה", "Un envío antes de que la plantilla esté aprobada", "Um envio antes de o modelo ser aprovado", "إرسال قبل اعتماد القالب"),
            t("Wait. Outside the 24-hour window only an approved template can start the conversation.", "מחכים. מחוץ לחלון של 24 השעות רק תבנית מאושרת יכולה לפתוח את השיחה.", "Espere. Fuera de la ventana de 24 horas solo una plantilla aprobada puede empezar la conversación.", "Espere. Fora da janela de 24 horas só um modelo aprovado pode começar a conversa.", "انتظروا. خارج نافذة 24 ساعة فقط قالب معتمد يستطيع بدء المحادثة."),
          ],
        ],
      },
      example: {
        title: t("A clinic reminder", "תזכורת למרפאה", "Un recordatorio de clínica", "Um lembrete de clínica", "تذكير عيادة"),
        body: t(
          "\"Your appointment with {{1}} is tomorrow at {{2}}. Reply if you need to move it.\" is a reminder. \"Your appointment is tomorrow, and this month we have 20% off a second treatment\" is an offer. Those are different categories. Do not hide the offer inside the reminder.",
          "\"התור שלך עם {{1}} הוא מחר ב־{{2}}. תשיבו אם צריך להזיז.\" היא תזכורת. \"התור שלך מחר, והחודש יש 20% הנחה על טיפול שני\" הוא מבצע. אלה קטגוריות שונות. אל תחביאו את המבצע בתוך התזכורת.",
          "\"Su cita con {{1}} es mañana a las {{2}}. Responda si necesita moverla.\" es un recordatorio. \"Su cita es mañana, y este mes hay 20% de descuento en un segundo tratamiento\" es una oferta. Son categorías distintas. No esconda la oferta dentro del recordatorio.",
          "\"Sua consulta com {{1}} é amanhã às {{2}}. Responda se precisar mudar.\" é um lembrete. \"Sua consulta é amanhã, e este mês há 20% de desconto num segundo tratamento\" é uma oferta. São categorias diferentes. Não esconda a oferta dentro do lembrete.",
          "\"موعدكم مع {{1}} غداً في {{2}}. ردّوا إذا احتجتم نقله.\" تذكير. \"موعدكم غداً، وهذا الشهر خصم 20% على علاج ثان\" عرض. هاتان فئتان مختلفتان. لا تخفوا العرض داخل التذكير.",
        ),
      },
      links: [
        link("/guides/whatsapp-cloud-api-cost", t("The two bills", "שני החשבונות", "Las dos facturas", "As duas faturas", "الفاتورتان")),
        link("/compare/whatsapp-app-or-api", t("The app or the platform", "האפליקציה או הפלטפורמה", "La app o la plataforma", "O app ou a plataforma", "التطبيق أو المنصة")),
      ],
    }),
  },
  "from-ad-to-follow-up": {
    review: REVIEW,
    sources: [META_LEADS, PRICING],
    products: [link("/crm", t("Open the CRM", "לעמוד ה־CRM", "Abrir el CRM", "Abrir o CRM", "صفحة CRM"))],
    faq: [
      [
        t("Who owns a lead that arrived overnight?", "מי אחראי לליד שהגיע בלילה?", "¿Quién es dueño de un lead que llegó de noche?", "Quem é dono de um lead que chegou de noite?", "من يملك عميلاً وصل ليلاً؟"),
        t("The person named for New leads. The row does not assign itself, and the campaign report does not assign it either.", "האדם שנקבע ללידים חדשים. השורה לא משבצת את עצמה, וגם דוח הקמפיין לא משבץ אותה.", "La persona nombrada para los leads nuevos. La fila no se asigna sola, y el informe de la campaña tampoco la asigna.", "A pessoa nomeada para leads novos. A linha não se atribui sozinha, e o relatório da campanha também não a atribui.", "الشخص المسمّى للعملاء الجدد. الصف لا يعيّن نفسه، وتقرير الحملة لا يعيّنه أيضاً."),
      ],
    ],
    section: section({
      heading: t("One working day", "יום עבודה אחד", "Un día de trabajo", "Um dia de trabalho", "يوم عمل واحد"),
      steps: [
        t("Morning: open every row that is still New. Read the source. Reach the person or write why not, and date the next task.", "בוקר: פותחים כל שורה שעדיין חדשה. קוראים את המקור. מגיעים אל האדם או כותבים למה לא, ונותנים תאריך למשימה הבאה.", "Mañana: abra cada fila que siga en Nuevo. Lea el origen. Llegue a la persona o escriba por qué no, y ponga fecha a la siguiente tarea.", "Manhã: abra cada linha que continue Novo. Leia a origem. Alcance a pessoa ou escreva por que não, e date a próxima tarefa.", "صباحاً: افتحوا كل صف ما زال جديداً. اقرأوا المصدر. صلوا إلى الشخص أو اكتبوا لماذا لا، وأرّخوا المهمة التالية."),
        t("Afternoon: clear the overdue tasks in the notification center. Move a date only with a written reason.", "אחר הצהריים: מנקים את המשימות באיחור במרכז ההתראות. מזיזים תאריך רק עם סיבה כתובה.", "Tarde: limpie las tareas vencidas en el centro de avisos. Mueva una fecha solo con una razón escrita.", "Tarde: limpe as tarefas atrasadas no centro de avisos. Mude uma data só com um motivo escrito.", "بعد الظهر: أفرغوا المهام المتأخرة في مركز التنبيهات. انقلوا تاريخاً فقط مع سبب مكتوب."),
        t("End of day: a row that is still New has a named owner for the next morning, or it is Lost with a reason.", "סוף היום: שורה שעדיין חדשה יש לה אחראי עם שם לבוקר הבא, או שהיא אבודה עם סיבה.", "Fin del día: una fila que sigue en Nuevo tiene un dueño con nombre para la mañana siguiente, o está en Perdido con una razón.", "Fim do dia: uma linha que continua Novo tem um dono nomeado para a manhã seguinte, ou está Perdido com um motivo.", "نهاية اليوم: الصف الذي ما زال جديداً له مالك مسمّى لصباح الغد، أو هو ضائع مع سبب."),
      ],
      example: {
        title: t("A shop that runs ads and a site", "חנות שמריצה מודעות ואתר", "Una tienda que hace anuncios y un sitio", "Uma loja que faz anúncios e um site", "متجر يشغّل إعلانات وموقعاً"),
        body: t(
          "A Meta lead, a Google Ads form and a site form can all arrive before the shop opens. They are three rows, three sources, one status: New. The morning list is those rows, not the result count in the campaign.",
          "ליד מ־Meta, טופס מגוגל וטופס מהאתר יכולים כולם להגיע לפני שהחנות נפתחת. אלה שלוש שורות, שלושה מקורות, סטטוס אחד: חדש. רשימת הבוקר היא השורות האלה, לא מספר התוצאות בקמפיין.",
          "Un lead de Meta, un formulario de Google Ads y un formulario del sitio pueden llegar todos antes de que abra la tienda. Son tres filas, tres orígenes, un estado: Nuevo. La lista de la mañana son esas filas, no el recuento de resultados de la campaña.",
          "Um lead da Meta, um formulário do Google Ads e um formulário do site podem chegar todos antes de a loja abrir. São três linhas, três origens, um status: Novo. A lista da manhã são essas linhas, não a contagem de resultados da campanha.",
          "عميل من Meta ونموذج Google Ads ونموذج الموقع يمكن أن يصلوا جميعاً قبل أن يفتح المتجر. ثلاثة صفوف، ثلاثة مصادر، حالة واحدة: جديد. قائمة الصباح هي هذه الصفوف، لا عدد نتائج الحملة.",
        ),
      },
      links: [
        link("/guides/follow-up-on-leads", t("How to follow up", "איך עושים מעקב", "Cómo hacer el seguimiento", "Como acompanhar", "كيف تتم المتابعة")),
        link("/guides/meta-lead-ads-to-crm", t("How the lead ad becomes a row", "איך מודעת הלידים הופכת לשורה", "Cómo el lead ad se vuelve una fila", "Como o lead ad vira uma linha", "كيف يصبح إعلان العملاء صفاً")),
        link("/templates", t("Workbooks", "חוברות", "Libros", "Pastas", "دفاتر")),
      ],
    }),
  },
};

function materialize(spec, locale) {
  const sectionSpec = spec.section;
  return {
    id: "practice",
    heading: pick(sectionSpec.heading, locale),
    paragraphs: (sectionSpec.paragraphs || []).map((item) => pick(item, locale)),
    steps: sectionSpec.steps?.map((item) => pick(item, locale)),
    example: sectionSpec.example
      ? { title: pick(sectionSpec.example.title, locale), body: pick(sectionSpec.example.body, locale) }
      : undefined,
    table: sectionSpec.table
      ? {
          columns: sectionSpec.table.columns.map((item) => pick(item, locale)),
          rows: sectionSpec.table.rows.map((row) => row.map((cell) => pick(cell, locale))),
        }
      : undefined,
    links: sectionSpec.links?.map((item) => ({ href: item.href, label: pick(item.label, locale) })),
  };
}

export function applyGuidePractice(articles) {
  for (const [slug, spec] of Object.entries(PRACTICE)) {
    if (!articles[slug]) continue;
    for (const locale of LOCALES) {
      const page = articles[slug][locale];
      if (page.sections.some((item) => item.id === "practice")) continue;
      const block = materialize(spec, locale);
      const boundary = page.sections.findIndex((item) => item.id === "boundary");
      if (boundary === -1) page.sections.push(block);
      else page.sections.splice(boundary, 0, block);
      page.faq = [...page.faq, ...spec.faq.map(([question, answer]) => [pick(question, locale), pick(answer, locale)])];
      page.sources = spec.sources.map((item) => ({ href: item.href, external: item.external, label: pick(item.label, locale) }));
      page.products = spec.products.map((item) => ({ href: item.href, label: pick(item.label, locale) }));
      page.review = pick(spec.review, locale);
    }
  }
}

export const PRACTICE_SLUGS = Object.keys(PRACTICE);
