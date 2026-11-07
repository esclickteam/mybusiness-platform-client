function story(title, description, crumb, h1, lede, sections, faq, links) {
  return {
    title,
    description,
    crumb,
    h1,
    lede,
    paragraphs: [lede],
    sections: sections.map(([heading, ...paragraphs]) => ({ heading, paragraphs })),
    faq,
    links,
  };
}

const L = {
  en: [["/crm", "CRM"], ["/automations", "Automations"], ["/whatsapp-api", "WhatsApp"], ["/pricing", "Pricing"], ["/guides", "Guides"]],
  he: [["/crm", "CRM"], ["/automations", "אוטומציות"], ["/whatsapp-api", "WhatsApp"], ["/pricing", "מחירים"], ["/guides", "מדריכים"]],
  es: [["/crm", "CRM"], ["/automations", "Automatizaciones"], ["/whatsapp-api", "WhatsApp"], ["/pricing", "Precios"], ["/guides", "Guías"]],
  "pt-BR": [["/crm", "CRM"], ["/automations", "Automações"], ["/whatsapp-api", "WhatsApp"], ["/pricing", "Preços"], ["/guides", "Guias"]],
  ar: [["/crm", "CRM"], ["/automations", "الأتمتة"], ["/whatsapp-api", "WhatsApp"], ["/pricing", "الأسعار"], ["/guides", "الأدلة"]],
};

export const MORE = {
  "/automations": {
    en: story(
      "Business automations for customers and processes | BizUply",
      "BizUply automations run on the business plan. A supported event, such as a new lead, can create a follow-up task. The business plan is $99 per month or $990 per year.",
      "Automations",
      "Business automations that take repeated work off the list",
      "Some of the same actions happen every day: a new enquiry needs a next step, a status change needs a note, a date needs a reminder. On the business plan, BizUply can run the actions the product already supports.",
      [
        ["Not every step has to be typed again", "A follow-up, a reminder and a routine update take attention even when the rule is the same each time. An automation is that rule, stored in the account, so the step happens when the event happens.", "Automations are part of the business plan, together with CRM, appointments and collaborations. They are not included in CRM only at $49 per month."],
        ["A clear process starts with a clear rule", "The useful shape is simple. A trigger is the event that starts the run, such as a new lead. A condition decides whether this lead should continue. An action is what the system does, such as creating a dated follow-up task.", "This page only describes that path. It does not add a trigger the product has not shipped."],
        ["Automations next to the customer record", "The task lands on the same lead the person will open later. The status, the note and the task stay in one record, so the team sees what the automation already did.", "An automation does not replace a conversation that needs a person. It prepares the next step."],
        ["The account stays in charge", "Someone in the business turns the automation on, checks the rule, and can turn it off. The product does not send a WhatsApp template by itself from this page, and it does not spend a Meta budget.", "If the rule is wrong, the task will be wrong. Review the first leads before leaving the automation on for the whole pipeline."],
      ],
      [
        ["What is a business automation?", "A stored rule. When a supported event happens, BizUply performs the action that was configured, such as creating a follow-up task."],
        ["Which work should be automated first?", "Work that repeats, follows a clear rule, and does not need a new decision every time. A dated task for every new lead is the example this product already publishes."],
        ["Does automation replace the team?", "No. It performs a defined action. A judgement, a quote or a sensitive reply stays with a person."],
        ["Can automations work with the CRM?", "Yes, on the business plan. A new lead can create the follow-up task on that same lead. CRM only, at $49 per month, does not include automations."],
      ],
      L.en,
    ),
    he: story(
      "אוטומציות עסקיות לניהול לקוחות ותהליכים | BizUply",
      "האוטומציות של BizUply כלולות בחבילה העסקית. אירוע נתמך, כמו ליד חדש, יכול ליצור משימת המשך. החבילה עולה 99 דולר לחודש או 990 דולר לשנה.",
      "אוטומציות",
      "אוטומציות עסקיות שמפחיתות עבודה חוזרת",
      "חלק מהפעולות חוזרות בכל יום: פנייה חדשה צריכה צעד הבא, שינוי סטטוס צריך תיעוד, ותאריך צריך תזכורת. בחבילה העסקית BizUply יכולה לבצע את הפעולות שהמוצר כבר תומך בהן.",
      [
        ["לא כל פעולה צריכה להיכתב מחדש", "מעקב, תזכורת ועדכון שגרתי דורשים תשומת לב גם כשהכלל זהה בכל פעם. אוטומציה היא הכלל הזה, שמור בחשבון, כך שהצעד קורה כשהאירוע קורה.", "האוטומציות חלק מהחבילה העסקית, יחד עם CRM, תורים ושיתופי פעולה. הן לא כלולות ב־CRM בלבד ב־49 דולר לחודש."],
        ["תהליך ברור מתחיל בכלל ברור", "הצורה השימושית פשוטה. טריגר הוא האירוע שמתחיל את הריצה, למשל ליד חדש. תנאי קובע אם הליד הזה ממשיך. פעולה היא מה שהמערכת עושה, למשל יצירת משימת המשך עם תאריך.", "העמוד הזה מתאר את המסלול הזה. הוא לא מוסיף טריגר שהמוצר לא פרסם."],
        ["אוטומציה ליד רשומת הלקוח", "המשימה נוחתת על אותו ליד שהאדם יפתח אחר כך. הסטטוס, ההערה והמשימה נשארים ברשומה אחת, והצוות רואה מה האוטומציה כבר עשתה.", "אוטומציה לא מחליפה שיחה שדורשת אדם. היא מכינה את הצעד הבא."],
        ["החשבון נשאר בשליטה", "מישהו בעסק מפעיל את האוטומציה, בודק את הכלל, ויכול לכבות אותה. המוצר לא שולח מכאן תבנית WhatsApp בעצמו, ולא מוציא תקציב פרסום ב־Meta.", "אם הכלל שגוי, גם המשימה תהיה שגויה. כדאי לבדוק את הלידים הראשונים לפני שמשאירים את האוטומציה על כל הצינור."],
      ],
      [
        ["מהי אוטומציה עסקית?", "כלל שמור. כשמתרחש אירוע נתמך, BizUply מבצעת את הפעולה שהוגדרה, למשל יצירת משימת המשך."],
        ["אילו תהליכים כדאי להתחיל מהם?", "עבודה שחוזרת, מבוססת על כלל ברור, ולא דורשת החלטה חדשה בכל מקרה. משימה עם תאריך לכל ליד חדש היא הדוגמה שהמוצר מפרסם."],
        ["האם אוטומציה מחליפה את הצוות?", "לא. היא מבצעת פעולה מוגדרת. שיקול דעת, הצעת מחיר או תשובה רגישה נשארים אצל אדם."],
        ["האם אפשר לחבר אוטומציות ל־CRM?", "כן, בחבילה העסקית. ליד חדש יכול ליצור משימת המשך על אותו ליד. CRM בלבד, ב־49 דולר לחודש, לא כולל אוטומציות."],
      ],
      L.he,
    ),
    es: story(
      "Automatizaciones de negocio para clientes y procesos | BizUply",
      "Las automatizaciones de BizUply forman parte del plan de negocio. Un evento compatible, como un lead nuevo, puede crear una tarea de seguimiento. El plan cuesta 99 dólares al mes o 990 al año.",
      "Automatizaciones",
      "Automatizaciones que quitan trabajo repetido de la lista",
      "Hay pasos que se repiten cada día: una consulta nueva necesita un siguiente paso, un cambio de estado necesita una nota y una fecha necesita un recordatorio. En el plan de negocio, BizUply puede ejecutar las acciones que el producto ya admite.",
      [
        ["No hace falta volver a escribir cada paso", "Un seguimiento, un recordatorio y una actualización rutinaria piden atención aunque la regla sea siempre la misma. La automatización guarda esa regla en la cuenta.", "Las automatizaciones van en el plan de negocio, junto con CRM, citas y colaboraciones. No están en CRM solo, de 49 dólares al mes."],
        ["Un proceso claro empieza con una regla clara", "La forma útil es simple. El disparador es el evento, por ejemplo un lead nuevo. La condición decide si ese lead sigue. La acción es lo que hace el sistema, por ejemplo crear una tarea con fecha.", "Esta página describe ese camino. No añade un disparador que el producto no haya publicado."],
        ["La automatización junto a la ficha", "La tarea queda en el mismo lead que la persona abrirá después. El estado, la nota y la tarea siguen en un solo registro.", "La automatización no sustituye una conversación que necesita a una persona. Prepara el siguiente paso."],
        ["La cuenta sigue al mando", "Alguien del negocio enciende la automatización, revisa la regla y puede apagarla. Desde esta página el producto no envía una plantilla de WhatsApp por su cuenta ni gasta un presupuesto de Meta.", "Si la regla está mal, la tarea también lo estará. Conviene revisar los primeros leads antes de dejarla activa en todo el pipeline."],
      ],
      [
        ["¿Qué es una automatización de negocio?", "Una regla guardada. Cuando ocurre un evento compatible, BizUply hace la acción configurada, como crear una tarea de seguimiento."],
        ["¿Qué trabajo conviene automatizar primero?", "El que se repite, sigue una regla clara y no pide una decisión nueva cada vez. Una tarea con fecha para cada lead nuevo es el ejemplo que el producto ya publica."],
        ["¿La automatización sustituye al equipo?", "No. Ejecuta una acción definida. Un criterio, un presupuesto o una respuesta delicada siguen en manos de una persona."],
        ["¿Se puede combinar con el CRM?", "Sí, en el plan de negocio. Un lead nuevo puede crear la tarea de seguimiento en ese mismo lead. CRM solo, a 49 dólares al mes, no incluye automatizaciones."],
      ],
      L.es,
    ),
    "pt-BR": story(
      "Automações de negócio para clientes e processos | BizUply",
      "As automações da BizUply fazem parte do plano de negócios. Um evento compatível, como um lead novo, pode criar uma tarefa de acompanhamento. O plano custa 99 dólares por mês ou 990 por ano.",
      "Automações",
      "Automações que tiram o trabalho repetido da lista",
      "Há passos que se repetem todo dia: uma consulta nova precisa de um próximo passo, uma mudança de status precisa de um registro e uma data precisa de um lembrete. No plano de negócios, a BizUply pode executar as ações que o produto já oferece.",
      [
        ["Nem todo passo precisa ser digitado de novo", "Um acompanhamento, um lembrete e uma atualização de rotina pedem atenção mesmo quando a regra é sempre a mesma. A automação guarda essa regra na conta.", "As automações entram no plano de negócios, junto com CRM, agenda e colaborações. Não entram no CRM sozinho, de 49 dólares por mês."],
        ["Um processo claro começa com uma regra clara", "A forma útil é simples. O gatilho é o evento, por exemplo um lead novo. A condição decide se aquele lead continua. A ação é o que o sistema faz, por exemplo criar uma tarefa com data.", "Esta página descreve esse caminho. Ela não acrescenta um gatilho que o produto não publicou."],
        ["A automação ao lado da ficha", "A tarefa fica no mesmo lead que a pessoa vai abrir depois. Status, nota e tarefa permanecem num único registro.", "A automação não substitui uma conversa que precisa de uma pessoa. Ela prepara o próximo passo."],
        ["A conta continua no comando", "Alguém do negócio liga a automação, confere a regra e pode desligar. Desta página o produto não envia um modelo de WhatsApp por conta própria nem gasta verba de anúncio na Meta.", "Se a regra estiver errada, a tarefa também estará. Vale revisar os primeiros leads antes de deixar a automação ativa no funil inteiro."],
      ],
      [
        ["O que é uma automação de negócio?", "Uma regra salva. Quando um evento compatível acontece, a BizUply executa a ação configurada, como criar uma tarefa de acompanhamento."],
        ["Qual trabalho automatizar primeiro?", "O que se repete, segue uma regra clara e não pede uma decisão nova a cada caso. Uma tarefa com data para cada lead novo é o exemplo que o produto já publica."],
        ["A automação substitui a equipe?", "Não. Ela executa uma ação definida. Um julgamento, um orçamento ou uma resposta sensível continuam com uma pessoa."],
        ["Dá para combinar com o CRM?", "Sim, no plano de negócios. Um lead novo pode criar a tarefa de acompanhamento nesse mesmo lead. O CRM sozinho, a 49 dólares por mês, não inclui automações."],
      ],
      L["pt-BR"],
    ),
    ar: story(
      "أتمتة الأعمال لإدارة العملاء والعمليات | BizUply",
      "أتمتة BizUply جزء من الخطة التجارية. حدث مدعوم، مثل عميل محتمل جديد، يمكن أن ينشئ مهمة متابعة. الخطة 99 دولاراً شهرياً أو 990 سنوياً.",
      "الأتمتة",
      "أتمتة تخفف العمل المتكرر",
      "بعض الخطوات تتكرر كل يوم: استفسار جديد يحتاج خطوة تالية، وتغيير الحالة يحتاج توثيقاً، والموعد يحتاج تذكيراً. في الخطة التجارية تستطيع BizUply تنفيذ الإجراءات التي يدعمها المنتج فعلاً.",
      [
        ["ليس كل إجراء يحتاج إلى كتابة من جديد", "المتابعة والتذكير والتحديث الروتيني تطلب انتباهاً حتى حين تكون القاعدة نفسها في كل مرة. الأتمتة هي هذه القاعدة محفوظة في الحساب.", "الأتمتة جزء من الخطة التجارية، مع CRM والمواعيد والتعاون. ليست ضمن CRM وحده بسعر 49 دولاراً شهرياً."],
        ["العملية الواضحة تبدأ بقاعدة واضحة", "الشكل المفيد بسيط. المشغّل هو الحدث، مثل عميل محتمل جديد. الشرط يقرر إن كان هذا العميل يستمر. الإجراء هو ما ينفذه النظام، مثل إنشاء مهمة متابعة بتاريخ.", "تصف هذه الصفحة هذا المسار. لا تضيف مشغّلاً لم ينشره المنتج."],
        ["الأتمتة إلى جانب سجل العميل", "تصل المهمة إلى العميل المحتمل نفسه الذي سيفتحه الشخص لاحقاً. تبقى الحالة والملاحظة والمهمة في سجل واحد.", "لا تحل الأتمتة محل محادثة تحتاج إلى شخص. هي تجهّز الخطوة التالية."],
        ["يبقى الحساب هو صاحب القرار", "يشغّل أحد أفراد النشاط الأتمتة، ويراجع القاعدة، ويستطيع إيقافها. من هذه الصفحة لا يرسل المنتج قالب WhatsApp من تلقاء نفسه ولا ينفق ميزانية Meta.", "إذا كانت القاعدة خاطئة فستكون المهمة خاطئة. راجعوا العملاء الأوائل قبل ترك الأتمتة تعمل على المسار كله."],
      ],
      [
        ["ما هي أتمتة الأعمال؟", "قاعدة محفوظة. عند وقوع حدث مدعوم تنفّذ BizUply الإجراء الذي تم ضبطه، مثل إنشاء مهمة متابعة."],
        ["أي عمل يُؤتمت أولاً؟", "العمل الذي يتكرر، ويتبع قاعدة واضحة، ولا يحتاج قراراً جديداً في كل حالة. مهمة بتاريخ لكل عميل محتمل جديد هي المثال الذي ينشره المنتج."],
        ["هل تحل الأتمتة محل الفريق؟", "لا. هي تنفّذ إجراءً محدداً. التقدير أو عرض السعر أو الرد الحساس يبقى عند شخص."],
        ["هل يمكن ربط الأتمتة بـ CRM؟", "نعم، في الخطة التجارية. يمكن لعميل محتمل جديد أن ينشئ مهمة المتابعة على السجل نفسه. CRM وحده، بسعر 49 دولاراً شهرياً، لا يشمل الأتمتة."],
      ],
      L.ar,
    ),
  },
};
