/**
 * Editorial drafts. They are not routes, not sitemap entries, and not published.
 * An editor has to approve facts before any of this can move to the public library.
 */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function t(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(pack, locale) {
  return pack[locale] || pack.en;
}

function article(spec) {
  const locales = {};
  for (const locale of LOCALES) {
    locales[locale] = {
      title: pick(spec.title, locale),
      description: pick(spec.description, locale),
      h1: pick(spec.h1, locale),
      lede: pick(spec.lede, locale),
      sections: spec.sections.map((section) => ({
        id: section.id,
        heading: pick(section.heading, locale),
        paragraphs: (section.paragraphs || []).map((item) => pick(item, locale)),
        steps: section.steps?.map((item) => pick(item, locale)),
      })),
      faq: spec.faq.map(([question, answer]) => [pick(question, locale), pick(answer, locale)]),
      related: spec.related.map((item) => ({ href: item.href, label: pick(item.label, locale) })),
    };
  }
  return {
    slug: spec.slug,
    status: "draft",
    aiAssisted: true,
    cluster: spec.cluster,
    updated: "2026-11-15",
    intent: spec.intent,
    adds: spec.adds,
    sources: spec.sources,
    locales,
  };
}

const pricing = { href: "/pricing", label: t("Pricing", "מחירים", "Precios", "Preços", "الأسعار") };
const metaPricing = {
  href: "https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/",
  label: t(
    "Meta pricing page, updated 30 September 2026",
    "עמוד המחירים של Meta, עודכן ב־30 בספטמבר 2026",
    "Página de precios de Meta, actualizada el 30 de septiembre de 2026",
    "Página de preços da Meta, atualizada em 30 de setembro de 2026",
    "صفحة أسعار Meta، محدّثة في 30 سبتمبر 2026",
  ),
};

export const KNOWLEDGE_DRAFTS = [
  article({
    slug: "choose-a-crm-for-a-small-business",
    cluster: "crm",
    intent: t(
      "Someone comparing whether to buy a CRM, before they care which buttons it has.",
      "מישהו שמשווה אם לקנות CRM, לפני שמעניין אותו אילו כפתורים יש.",
      "Alguien que compara si comprar un CRM, antes de los botones.",
      "Alguém que compara se compra um CRM, antes dos botões.",
      "شخص يقارن هل يشتري CRM، قبل الأزرار.",
    ),
    adds: t(
      "The public guide explains the record and the six statuses. This draft is the buying decision, including when not to buy.",
      "המדריך הציבורי מסביר את הרשומה ואת ששת הסטטוסים. הטיוטה הזו היא החלטת הקנייה, כולל מתי לא לקנות.",
      "La guía pública explica el registro y los seis estados. Este borrador es la decisión de compra, incluido cuándo no comprar.",
      "O guia público explica o registro e os seis status. Este rascunho é a decisão de compra, inclusive quando não comprar.",
      "الدليل العام يشرح السجل والحالات الست. هذه المسودة قرار الشراء، بما فيه متى لا تشترون.",
    ),
    title: t(
      "How to choose a CRM for a small business | BizUply",
      "איך לבחור CRM לעסק קטן | ביזאפלי",
      "Cómo elegir un CRM para un negocio pequeño | BizUply",
      "Como escolher um CRM para um pequeno negócio | BizUply",
      "كيف تختارون CRM لنشاط صغير | BizUply",
    ),
    description: t(
      "Choose a CRM from the work: one owner for new leads, statuses the team can say out loud, and a source on every row. Skip it when one person can already see every open job.",
      "בוחרים CRM לפי העבודה: אחראי אחד ללידים חדשים, סטטוסים שהצוות יכול לומר בקול, ומקור על כל שורה. מוותרים כשאדם אחד כבר רואה כל עבודה פתוחה.",
      "Elija un CRM por el trabajo: un dueño para los leads nuevos, estados que el equipo puede decir en voz alta y un origen en cada fila. Déjelo cuando una persona ya ve cada trabajo abierto.",
      "Escolha um CRM pelo trabalho: um dono para leads novos, status que a equipe consegue dizer em voz alta e uma origem em cada linha. Deixe quando uma pessoa já vê cada trabalho aberto.",
      "اختاروا CRM حسب العمل: مالك واحد للعملاء الجدد، وحالات يستطيع الفريق قولها، ومصدر على كل صف. تجاوزوه حين يرى شخص واحد كل عمل مفتوح.",
    ),
    h1: t(
      "How to choose a CRM for a small business",
      "איך לבחור CRM לעסק קטן",
      "Cómo elegir un CRM para un negocio pequeño",
      "Como escolher um CRM para um pequeno negócio",
      "كيف تختارون CRM لنشاط صغير",
    ),
    lede: t(
      "Buy the record, not the dashboard. If two people can tell two different stories about the same customer, you already need one place that holds the source, the status and the next step.",
      "קונים את הרשומה, לא את לוח הבקרה. אם שני אנשים יכולים לספר שני סיפורים שונים על אותו לקוח, כבר צריך מקום אחד שמחזיק את המקור, את הסטטוס ואת הצעד הבא.",
      "Compre el registro, no el panel. Si dos personas pueden contar dos historias distintas del mismo cliente, ya necesita un lugar que guarde el origen, el estado y el siguiente paso.",
      "Compre o registro, não o painel. Se duas pessoas podem contar duas histórias diferentes do mesmo cliente, você já precisa de um lugar que guarde a origem, o status e o próximo passo.",
      "اشتروا السجل، لا اللوحة. إذا استطاع شخصان رواية قصتين مختلفتين عن العميل نفسه، فأنتم بحاجة أصلاً إلى مكان واحد يحفظ المصدر والحالة والخطوة التالية.",
    ),
    sections: [
      {
        id: "skip",
        heading: t("When not to buy one yet", "מתי עוד לא לקנות", "Cuándo no comprar todavía", "Quando ainda não comprar", "متى لا تشترون بعد"),
        paragraphs: [t(
          "Stay on a spreadsheet when one person can see every open conversation without asking, and no lead arrives from an ad or a form while that person is out. A CRM will not invent customers. It will add a system nobody opens.",
          "נשארים על גיליון כשאדם אחד יכול לראות כל שיחה פתוחה בלי לשאול, ואין ליד שמגיע ממודעה או מטופס בזמן שהוא בחוץ. CRM לא ימציא לקוחות. הוא יוסיף מערכת שאף אחד לא פותח.",
          "Quédese en una hoja cuando una persona puede ver cada conversación abierta sin preguntar, y ningún lead llega de un anuncio o un formulario mientras esa persona está fuera. Un CRM no inventa clientes. Añade un sistema que nadie abre.",
          "Fique na planilha quando uma pessoa consegue ver cada conversa aberta sem perguntar, e nenhum lead chega de um anúncio ou formulário enquanto essa pessoa está fora. Um CRM não inventa clientes. Acrescenta um sistema que ninguém abre.",
          "ابقوا على الجدول حين يستطيع شخص واحد رؤية كل محادثة مفتوحة دون سؤال، ولا يصل عميل من إعلان أو نموذج بينما ذلك الشخص خارجاً. CRM لا يخترع عملاء. يضيف نظاماً لا يفتحه أحد.",
        )],
      },
      {
        id: "checks",
        heading: t("What to decide before the software", "מה להחליט לפני התוכנה", "Qué decidir antes del software", "O que decidir antes do software", "ماذا تقررون قبل البرنامج"),
        steps: [
          t("Name the person who owns a lead that is still new at the end of the day.", "קבעו את האדם שאחראי לליד שעדיין חדש בסוף היום.", "Nombre a la persona dueña de un lead que sigue nuevo al final del día.", "Nomeie a pessoa dona de um lead que continua novo no fim do dia.", "سمّوا الشخص الذي يملك عميلاً ما زال جديداً في نهاية اليوم."),
          t("Write the statuses in the team's words. In Bizuply there are six, and they are not a score.", "כתבו את הסטטוסים במילים של הצוות. בביזאפלי יש שישה, והם לא ציון.", "Escriba los estados con las palabras del equipo. En Bizuply hay seis, y no son una puntuación.", "Escreva os status com as palavras da equipe. Na Bizuply há seis, e não são uma nota.", "اكتبوا الحالات بكلمات الفريق. في Bizuply هناك ست، وهي ليست درجة."),
          t("List the places a lead can arrive. If you need a source the product does not take automatically, plan to type it. Do not pretend the import exists.", "רשמו מאיפה ליד יכול להגיע. אם צריך מקור שהמוצר לא קולט אוטומטית, מתכננים להקליד אותו. לא מעמידים פנים שהייבוא קיים.", "Liste de dónde puede llegar un lead. Si necesita un origen que el producto no toma solo, planee escribirlo. No finja que la importación existe.", "Liste de onde um lead pode chegar. Se precisar de uma origem que o produto não pega sozinho, planeje digitá-la. Não finja que a importação existe.", "اكتبوا من أين يمكن أن يصل العميل. إذا احتجتم مصدراً لا يلتقطه المنتج آلياً، خططوا لكتابته. لا تتظاهروا أن الاستيراد موجود."),
          t("Decide what you will not automate in the first month. A rule that marks Contacted is a bad first rule.", "החליטו מה לא תעשו אוטומטי בחודש הראשון. כלל שמסמן נוצר קשר הוא כלל ראשון גרוע.", "Decida qué no automatizará el primer mes. Una regla que marca Contactado es una mala primera regla.", "Decida o que não vai automatizar no primeiro mês. Uma regra que marca Contato feito é uma má primeira regra.", "قرروا ما لن تؤتمتوه في الشهر الأول. قاعدة تعلّم تم التواصل قاعدة أولى سيئة."),
        ],
      },
      {
        id: "bizuply",
        heading: t("Where Bizuply fits that list", "איפה ביזאפלי יושבת ברשימה הזאת", "Dónde encaja Bizuply en esa lista", "Onde a Bizuply cabe nessa lista", "أين تناسب Bizuply هذه القائمة"),
        paragraphs: [t(
          "CRM only is $49 a month: the pipeline and the client file. Automated sources today are Meta Lead Ads, Google Ads lead forms, and a form on a Bizuply site. There is no one-click spreadsheet import on this path. Appointments, collaborations and automations are the business plan at $99 a month or $990 a year. WhatsApp is neither of those prices.",
          "CRM בלבד הוא 49 דולר לחודש: הצינור ותיק הלקוח. המקורות האוטומטיים היום הם Lead Ads של Meta, טפסי Google Ads, וטופס באתר ביזאפלי. אין ייבוא גיליון בלחיצה במסלול הזה. תורים, שיתופים ואוטומציות הם החבילה העסקית ב־99 לחודש או 990 לשנה. וואטסאפ אינו אף אחד מהמחירים האלה.",
          "El CRM solo cuesta 49 dólares al mes: el pipeline y el expediente. Los orígenes automáticos de hoy son Lead Ads de Meta, formularios de Google Ads y un formulario en un sitio de Bizuply. No hay importación de hoja en un clic en este camino. Citas, colaboraciones y automatizaciones son el plan de negocio a 99 al mes o 990 al año. WhatsApp no es ninguno de esos precios.",
          "O CRM sozinho custa US$ 49 por mês: o pipeline e o arquivo. As origens automáticas de hoje são Lead Ads da Meta, formulários do Google Ads e um formulário num site da Bizuply. Não há importação de planilha num clique neste caminho. Agenda, colaborações e automações são o plano de negócios a US$ 99 por mês ou US$ 990 por ano. O WhatsApp não é nenhum desses preços.",
          "CRM وحده 49 دولاراً في الشهر: المسار وملف العميل. المصادر الآلية اليوم هي Lead Ads من Meta ونماذج Google Ads ونموذج في موقع Bizuply. لا يوجد استيراد جدول بنقرة في هذا المسار. المواعيد والتعاون والأتمتة هي الخطة التجارية بـ 99 في الشهر أو 990 في السنة. واتساب ليس أياً من هذه الأسعار.",
        )],
      },
    ],
    faq: [[
      t("Should the first demo be the chart?", "ההדגמה הראשונה צריכה להיות התרשים?", "¿La primera demo debe ser el gráfico?", "A primeira demo deve ser o gráfico?", "هل يجب أن يكون العرض الأول الرسم؟"),
      t("No. Open one lead. If the source, the status and the next task are not obvious, the chart will not fix the work.", "לא. פותחים ליד אחד. אם המקור, הסטטוס והמשימה הבאה לא ברורים, התרשים לא יתקן את העבודה.", "No. Abra un lead. Si el origen, el estado y la siguiente tarea no son obvios, el gráfico no arregla el trabajo.", "Não. Abra um lead. Se a origem, o status e a próxima tarefa não forem óbvios, o gráfico não conserta o trabalho.", "لا. افتحوا عميلاً واحداً. إذا لم يكن المصدر والحالة والمهمة التالية واضحة، فالرسم لن يصلح العمل."),
    ]],
    related: [
      { href: "/guides/what-is-a-crm", label: t("What a CRM record is", "מהי רשומת CRM", "Qué es un registro de CRM", "O que é um registro de CRM", "ما هو سجل CRM") },
      { href: "/compare/crm-or-spreadsheet", label: t("CRM or a spreadsheet", "CRM או גיליון", "CRM o una hoja", "CRM ou uma planilha", "CRM أو جدول") },
      pricing,
    ],
    sources: [{ href: "/pricing", label: t("Bizuply pricing", "מחירון ביזאפלי", "Precios de Bizuply", "Preços da Bizuply", "أسعار Bizuply") }],
  }),
  article({
    slug: "lead-management",
    cluster: "crm",
    intent: t("Someone who already has leads and is losing them between people.", "מישהו שכבר יש לו לידים והם הולכים לאיבוד בין אנשים.", "Alguien que ya tiene leads y los pierde entre personas.", "Alguém que já tem leads e os perde entre pessoas.", "شخص لديه عملاء ويضيعون بين الناس."),
    adds: t(
      "The follow-up guide is one lead and one task. This draft is the weekly operating rhythm: intake, aging, and a lost reason.",
      "מדריך המעקב הוא ליד אחד ומשימה אחת. הטיוטה הזו היא קצב השבוע: קליטה, התיישנות, וסיבת אבוד.",
      "La guía de seguimiento es un lead y una tarea. Este borrador es el ritmo de la semana: entrada, antigüedad y una razón de perdido.",
      "O guia de acompanhamento é um lead e uma tarefa. Este rascunho é o ritmo da semana: entrada, envelhecimento e um motivo de perdido.",
      "دليل المتابعة عميل واحد ومهمة واحدة. هذه المسودة إيقاع الأسبوع: الاستقبال، والتقادم، وسبب الضياع.",
    ),
    title: t("A working guide to lead management | BizUply", "מדריך עבודה לניהול לידים | ביזאפלי", "Una guía de trabajo para gestionar leads | BizUply", "Um guia de trabalho para gerir leads | BizUply", "دليل عمل لإدارة العملاء المحتملين | BizUply"),
    description: t(
      "Lead management is intake, one owner, a dated next step, and a written reason when the lead is lost. A status with no event behind it is decoration.",
      "ניהול לידים הוא קליטה, אחראי אחד, צעד הבא עם תאריך, וסיבה כתובה כשהליד אבוד. סטטוס בלי אירוע מאחוריו הוא קישוט.",
      "Gestionar leads es la entrada, un dueño, un siguiente paso con fecha y una razón escrita cuando el lead se pierde. Un estado sin un hecho detrás es decoración.",
      "Gerir leads é a entrada, um dono, um próximo passo com data e um motivo escrito quando o lead se perde. Um status sem um fato por trás é decoração.",
      "إدارة العملاء هي الاستقبال، ومالك واحد، وخطوة تالية بتاريخ، وسبب مكتوب حين يضيع العميل. حالة بلا حدث خلفها زينة.",
    ),
    h1: t("A working guide to lead management", "מדריך עבודה לניהול לידים", "Una guía de trabajo para gestionar leads", "Um guia de trabalho para gerir leads", "دليل عمل لإدارة العملاء المحتملين"),
    lede: t(
      "A lead is managed when the next person can open the row and know what happened and what happens next. A pile of names is not management.",
      "ליד מנוהל כשהאדם הבא יכול לפתוח את השורה ולדעת מה קרה ומה קורה אחר כך. ערימת שמות אינה ניהול.",
      "Un lead está gestionado cuando la siguiente persona puede abrir la fila y saber qué pasó y qué sigue. Un montón de nombres no es gestión.",
      "Um lead está gerido quando a próxima pessoa pode abrir a linha e saber o que aconteceu e o que vem depois. Uma pilha de nomes não é gestão.",
      "العميل مُدار حين يستطيع الشخص التالي فتح الصف ومعرفة ما حدث وما يحدث بعد ذلك. كومة أسماء ليست إدارة.",
    ),
    sections: [
      {
        id: "intake",
        heading: t("Intake", "קליטה", "Entrada", "Entrada", "الاستقبال"),
        paragraphs: [t(
          "Every automatic row starts as New, with its source. Meta Lead Ads, a Google Ads lead form, and a form on a Bizuply site are the automatic sources. A person who calls the shop is typed in, and the source is written by hand. Do not leave the source blank because you will not remember the door later.",
          "כל שורה אוטומטית מתחילה כחדשה, עם המקור שלה. Lead Ads של Meta, טופס לידים של Google Ads, וטופס באתר ביזאפלי הם המקורות האוטומטיים. אדם שמתקשר לחנות מוקלד, והמקור נכתב ביד. אל תשאירו את המקור ריק כי אחר כך לא תזכרו את הדלת.",
          "Cada fila automática empieza en Nuevo, con su origen. Lead Ads de Meta, un formulario de Google Ads y un formulario en un sitio de Bizuply son los orígenes automáticos. Una persona que llama a la tienda se escribe, y el origen se anota a mano. No deje el origen en blanco porque después no recordará la puerta.",
          "Cada linha automática começa em Novo, com a origem. Lead Ads da Meta, um formulário do Google Ads e um formulário num site da Bizuply são as origens automáticas. Uma pessoa que liga para a loja é digitada, e a origem é escrita à mão. Não deixe a origem em branco porque depois não vai lembrar a porta.",
          "كل صف آلي يبدأ جديداً، مع مصدره. Lead Ads من Meta ونموذج Google Ads ونموذج في موقع Bizuply هي المصادر الآلية. الشخص الذي يتصل بالمتجر يُكتب، والمصدر يُدوَّن يدوياً. لا تتركوا المصدر فارغاً لأنكم لن تذكروا الباب لاحقاً.",
        )],
      },
      {
        id: "aging",
        heading: t("Aging", "התיישנות", "Antigüedad", "Envelhecimento", "التقادم"),
        paragraphs: [t(
          "Once a week, sort the open rows by how long they have sat. New with no task is an untouched intake. Contacted with an overdue task is a broken promise. Interested with no date is a yes that was never booked. Old lead is not a place to hide a row you do not want to call.",
          "פעם בשבוע ממיינים את השורות הפתוחות לפי כמה זמן הן יושבות. חדש בלי משימה הוא קליטה שלא נגע בה. נוצר קשר עם משימה באיחור הוא הבטחה שנשברה. מעוניין בלי תאריך הוא כן שמעולם לא נקבע. ליד ישן אינו מקום להחביא שורה שלא רוצים להתקשר אליה.",
          "Una vez por semana, ordene las filas abiertas por cuánto tiempo llevan quietas. Nuevo sin tarea es una entrada intacta. Contactado con una tarea vencida es una promesa rota. Interesado sin fecha es un sí que nunca se reservó. Lead antiguo no es un lugar para esconder una fila a la que no quiere llamar.",
          "Uma vez por semana, ordene as linhas abertas por quanto tempo estão paradas. Novo sem tarefa é uma entrada intocada. Contato feito com tarefa atrasada é uma promessa quebrada. Interessado sem data é um sim que nunca foi reservado. Lead antigo não é um lugar para esconder uma linha para a qual não quer ligar.",
          "مرة في الأسبوع، رتّبوا الصفوف المفتوحة حسب مدة بقائها. جديد بلا مهمة استقبال لم يُمس. تم التواصل مع مهمة متأخرة وعد مكسور. مهتم بلا تاريخ نعم لم يُحجز قط. عميل قديم ليس مكاناً لإخفاء صف لا تريدون الاتصال به.",
        )],
      },
      {
        id: "lost",
        heading: t("A lost reason", "סיבת אבוד", "Una razón de perdido", "Um motivo de perdido", "سبب الضياع"),
        paragraphs: [t(
          "Lost is a decision, written on the timeline, with a reason the next person can read: no answer after the dated attempts, wrong service, or chose someone else. Without the reason, Lost becomes the status for anything inconvenient.",
          "אבוד הוא החלטה, שנכתבת על ציר הזמן, עם סיבה שהאדם הבא יכול לקרוא: אין מענה אחרי הניסיונות שתוארכו, שירות לא מתאים, או בחרו במישהו אחר. בלי הסיבה, אבוד הופך לסטטוס של כל מה שלא נוח.",
          "Perdido es una decisión, escrita en la línea de tiempo, con una razón que la siguiente persona puede leer: no hubo respuesta tras los intentos fechados, el servicio no correspondía, o eligieron a otro. Sin la razón, Perdido se vuelve el estado de todo lo incómodo.",
          "Perdido é uma decisão, escrita na linha do tempo, com um motivo que a próxima pessoa pode ler: sem resposta depois das tentativas datadas, serviço errado, ou escolheram outra pessoa. Sem o motivo, Perdido vira o status de tudo que é inconveniente.",
          "ضائع قرار، يُكتب على الخط الزمني، مع سبب يستطيع الشخص التالي قراءته: لا رد بعد المحاولات المؤرخة، أو خدمة غير مناسبة، أو اختاروا غيركم. بلا السبب يصبح ضائع حالة كل ما هو مزعج.",
        )],
      },
    ],
    faq: [[
      t("Is a weekly meeting the system?", "האם ישיבה שבועית היא המערכת?", "¿Una reunión semanal es el sistema?", "Uma reunião semanal é o sistema?", "هل الاجتماع الأسبوعي هو النظام؟"),
      t("Only if the meeting changes a row: a task, a status, or a lost reason. A meeting that admires the list does not manage it.", "רק אם הישיבה משנה שורה: משימה, סטטוס, או סיבת אבוד. ישיבה שמתפעלת מהרשימה לא מנהלת אותה.", "Solo si la reunión cambia una fila: una tarea, un estado o una razón de perdido. Una reunión que admira la lista no la gestiona.", "Só se a reunião muda uma linha: uma tarefa, um status ou um motivo de perdido. Uma reunião que admira a lista não a gere.", "فقط إذا غيّر الاجتماع صفاً: مهمة أو حالة أو سبب ضياع. اجتماع يعجب بالقائمة لا يديرها."),
    ]],
    related: [
      { href: "/guides/follow-up-on-leads", label: t("Follow up on one lead", "מעקב על ליד אחד", "Seguimiento de un lead", "Acompanhar um lead", "متابعة عميل واحد") },
      { href: "/templates", label: t("Lead workbook", "חוברת הלידים", "Libro de leads", "Pasta de leads", "دفتر العملاء") },
    ],
    sources: [{ href: "/guides/what-is-a-crm", label: t("The six statuses", "ששת הסטטוסים", "Los seis estados", "Os seis status", "الحالات الست") }],
  }),
  article({
    slug: "build-a-sales-funnel",
    cluster: "crm",
    intent: t("Someone who wants a funnel and is about to draw boxes that the team will not use.", "מישהו שרוצה משפך ועומד לצייר תיבות שהצוות לא ישתמש בהן.", "Alguien que quiere un embudo y va a dibujar cajas que el equipo no usará.", "Alguém que quer um funil e vai desenhar caixas que a equipe não vai usar.", "شخص يريد قمعاً وسيرسم مربعات لن يستخدمها الفريق."),
    adds: t(
      "The ad-to-follow-up guide is one path into the file. This draft is what each stage must produce, and where Bizuply's six statuses stop matching a textbook funnel.",
      "המדריך מהמודעה למעקב הוא מסלול אחד אל התיק. הטיוטה הזו היא מה כל שלב חייב להפיק, ואיפה ששת הסטטוסים של ביזאפלי מפסיקים להתאים למשפך מספר לימוד.",
      "La guía del anuncio al seguimiento es un camino al expediente. Este borrador es lo que cada etapa debe producir, y dónde los seis estados de Bizuply dejan de coincidir con un embudo de manual.",
      "O guia do anúncio ao acompanhamento é um caminho até o arquivo. Este rascunho é o que cada etapa deve produzir, e onde os seis status da Bizuply deixam de coincidir com um funil de manual.",
      "دليل من الإعلان إلى المتابعة مسار واحد إلى الملف. هذه المسودة ما يجب أن تنتجه كل مرحلة، وأين تتوقف الحالات الست في Bizuply عن مطابقة قمع الكتاب.",
    ),
    title: t("Build a sales funnel a small team can run | BizUply", "בניית משפך מכירות שצוות קטן יכול להריץ | ביזאפלי", "Construir un embudo de ventas que un equipo pequeño pueda llevar | BizUply", "Construir um funil de vendas que uma equipe pequena consiga tocar | BizUply", "بناء قمع مبيعات يستطيع فريق صغير تشغيله | BizUply"),
    description: t(
      "A funnel is the artifact each stage must leave behind: a source, a reached person, a dated next step, or a lost reason. Extra stages that nobody updates are fiction.",
      "משפך הוא מה שכל שלב חייב להשאיר: מקור, אדם שהגעתם אליו, צעד הבא עם תאריך, או סיבת אבוד. שלבים נוספים שאף אחד לא מעדכן הם סיפור.",
      "Un embudo es lo que cada etapa debe dejar: un origen, una persona a la que se llegó, un siguiente paso con fecha o una razón de perdido. Las etapas extra que nadie actualiza son ficción.",
      "Um funil é o que cada etapa deve deixar: uma origem, uma pessoa alcançada, um próximo passo com data ou um motivo de perdido. Etapas extras que ninguém atualiza são ficção.",
      "القمع هو ما يجب أن تتركه كل مرحلة: مصدر، أو شخص تم الوصول إليه، أو خطوة تالية بتاريخ، أو سبب ضياع. المراحل الزائدة التي لا يحدّثها أحد خيال.",
    ),
    h1: t("Build a sales funnel a small team can run", "בניית משפך מכירות שצוות קטן יכול להריץ", "Construir un embudo de ventas que un equipo pequeño pueda llevar", "Construir um funil de vendas que uma equipe pequena consiga tocar", "بناء قمع مبيعات يستطيع فريق صغير تشغيله"),
    lede: t(
      "Draw the funnel from the artifacts, not from a poster. If a stage does not change the record, it is not a stage.",
      "מציירים את המשפך לפי מה שנשאר בתיק, לא לפי פוסטר. אם שלב לא משנה את הרשומה, הוא לא שלב.",
      "Dibuje el embudo desde lo que queda en el expediente, no desde un póster. Si una etapa no cambia el registro, no es una etapa.",
      "Desenhe o funil a partir do que fica no arquivo, não de um pôster. Se uma etapa não muda o registro, não é uma etapa.",
      "ارسموا القمع مما يبقى في الملف، لا من ملصق. إذا لم تغيّر مرحلة السجل، فليست مرحلة.",
    ),
    sections: [
      {
        id: "artifacts",
        heading: t("What each stage must leave", "מה כל שלב חייב להשאיר", "Qué debe dejar cada etapa", "O que cada etapa deve deixar", "ما يجب أن تتركه كل مرحلة"),
        steps: [
          t("Arrived: a row with a source. Without the source you cannot tell which door worked.", "הגיע: שורה עם מקור. בלי המקור אי אפשר לדעת איזו דלת עבדה.", "Llegó: una fila con origen. Sin el origen no se puede saber qué puerta funcionó.", "Chegou: uma linha com origem. Sem a origem não dá para saber qual porta funcionou.", "وصل: صف مع مصدر. بلا المصدر لا يمكن معرفة أي باب نجح."),
          t("Reached: status Contacted, plus a note of what was said. A task alone is not contact.", "הגעתם: סטטוס נוצר קשר, ועוד הערה של מה שנאמר. משימה לבדה אינה קשר.", "Se llegó: estado Contactado, más una nota de lo que se dijo. Una tarea sola no es contacto.", "Alcançado: status Contato feito, mais uma nota do que foi dito. Uma tarefa sozinha não é contato.", "تم الوصول: حالة تم التواصل، مع ملاحظة بما قيل. المهمة وحدها ليست تواصلاً."),
          t("Next step accepted: status Interested only when there is a dated task or a booking.", "הצעד הבא התקבל: סטטוס מעוניין רק כשיש משימה עם תאריך או תור.", "Siguiente paso aceptado: estado Interesado solo cuando hay una tarea con fecha o una reserva.", "Próximo passo aceito: status Interessado só quando há uma tarefa com data ou uma reserva.", "قُبلت الخطوة التالية: حالة مهتم فقط حين توجد مهمة بتاريخ أو حجز."),
          t("Won or closed: Converted when the work is won, Lost with a reason when it is not. Old lead is not a silent Lost.", "נסגר: הומר כשהעבודה נסגרה, אבוד עם סיבה כשלא. ליד ישן אינו אבוד שקט.", "Cerrado: Convertido cuando el trabajo se ganó, Perdido con una razón cuando no. Lead antiguo no es un Perdido silencioso.", "Fechado: Convertido quando o trabalho foi ganho, Perdido com um motivo quando não. Lead antigo não é um Perdido silencioso.", "أُغلق: تم التحويل حين يُكسب العمل، وضائع مع سبب حين لا. عميل قديم ليس ضائعاً صامتاً."),
        ],
      },
      {
        id: "stop",
        heading: t("Where a textbook funnel does not fit", "איפה משפך מספר לימוד לא מתאים", "Dónde un embudo de manual no encaja", "Onde um funil de manual não cabe", "أين لا يناسب قمع الكتاب"),
        paragraphs: [t(
          "Bizuply does not score a lead, and it does not add marketing-qualified and sales-qualified as extra statuses. If the team needs those words, write them in the note. Do not invent a seventh status on a whiteboard and expect the product to store it. The six statuses are the funnel the file can actually show.",
          "ביזאפלי לא נותנת ציון לליד, והיא לא מוסיפה כשיר־שיווק וכשיר־מכירה כסטטוסים נוספים. אם הצוות צריך את המילים האלה, כותבים אותן בהערה. לא ממציאים סטטוס שביעי על הלוח ומצפים שהמוצר ישמור אותו. ששת הסטטוסים הם המשפך שהתיק באמת יכול להראות.",
          "Bizuply no puntúa un lead y no añade calificado por marketing y calificado por ventas como estados extra. Si el equipo necesita esas palabras, escríbalas en la nota. No invente un séptimo estado en la pizarra y espere que el producto lo guarde. Los seis estados son el embudo que el expediente puede mostrar de verdad.",
          "A Bizuply não dá nota a um lead e não acrescenta qualificado por marketing e qualificado por vendas como status extras. Se a equipe precisa dessas palavras, escreva-as na nota. Não invente um sétimo status no quadro e espere que o produto o guarde. Os seis status são o funil que o arquivo consegue mostrar de verdade.",
          "لا تمنح Bizuply درجة للعميل، ولا تضيف مؤهلاً تسويقياً ومؤهلاً للمبيعات كحالات إضافية. إذا احتاج الفريق هذه الكلمات، اكتبوها في الملاحظة. لا تخترعوا حالة سابعة على اللوح وتتوقعوا أن يحفظها المنتج. الحالات الست هي القمع الذي يستطيع الملف إظهاره فعلاً.",
        )],
      },
    ],
    faq: [[
      t("Should the funnel start with an ad?", "האם המשפך צריך להתחיל במודעה?", "¿El embudo debe empezar con un anuncio?", "O funil deve começar com um anúncio?", "هل يجب أن يبدأ القمع بإعلان؟"),
      t("Only if an ad is one of your doors. A phone call and a site form are the same first stage once they are rows: arrived, with a source.", "רק אם מודעה היא אחת מהדלתות שלכם. שיחת טלפון וטופס באתר הם אותו שלב ראשון ברגע שהם שורות: הגיע, עם מקור.", "Solo si un anuncio es una de sus puertas. Una llamada y un formulario del sitio son la misma primera etapa en cuanto son filas: llegó, con un origen.", "Só se um anúncio é uma das suas portas. Uma ligação e um formulário do site são a mesma primeira etapa assim que são linhas: chegou, com uma origem.", "فقط إذا كان الإعلان أحد أبوابكم. المكالمة ونموذج الموقع هما المرحلة الأولى نفسها حالما يصبحان صفين: وصل، مع مصدر."),
    ]],
    related: [
      { href: "/guides/from-ad-to-follow-up", label: t("From the ad to the follow-up", "מהמודעה אל המעקב", "Del anuncio al seguimiento", "Do anúncio ao acompanhamento", "من الإعلان إلى المتابعة") },
      { href: "/templates", label: t("Funnel workbook", "חוברת המשפך", "Libro del embudo", "Pasta do funil", "دفتر القمع") },
    ],
    sources: [{ href: "/guides/what-is-a-crm", label: t("The six statuses", "ששת הסטטוסים", "Los seis estados", "Os seis status", "الحالات الست") }],
  }),
  article({
    slug: "connect-whatsapp-api-to-a-crm",
    cluster: "whatsapp",
    intent: t("Someone who wants WhatsApp and the CRM to be one system and needs the boundary.", "מישהו שרוצה שוואטסאפ וה־CRM יהיו מערכת אחת וצריך את הגבול.", "Alguien que quiere que WhatsApp y el CRM sean un solo sistema y necesita el límite.", "Alguém que quer que o WhatsApp e o CRM sejam um sistema só e precisa do limite.", "شخص يريد أن يكون واتساب وCRM نظاماً واحداً ويحتاج الحد."),
    adds: t(
      "The template guide and the cost guide do not say what is written on the lead. This draft is that boundary.",
      "מדריך התבניות ומדריך המחיר לא אומרים מה נכתב על הליד. הטיוטה הזו היא הגבול הזה.",
      "La guía de plantillas y la de precio no dicen qué se escribe en el lead. Este borrador es ese límite.",
      "O guia de modelos e o de preço não dizem o que se escreve no lead. Este rascunho é esse limite.",
      "دليل القوالب ودليل السعر لا يقولان ما يُكتب على العميل. هذه المسودة هي ذلك الحد.",
    ),
    title: t("Connect WhatsApp Business Platform to a CRM | BizUply", "חיבור WhatsApp Business Platform ל־CRM | ביזאפלי", "Conectar WhatsApp Business Platform a un CRM | BizUply", "Conectar a WhatsApp Business Platform a um CRM | BizUply", "ربط WhatsApp Business Platform بـ CRM | BizUply"),
    description: t(
      "The number is a separate $29 subscription, connected with Meta Embedded Signup. A WhatsApp log can sit on the lead. The connection does not approve a template and does not replace the follow-up task.",
      "המספר הוא מנוי נפרד של 29 דולר, שמחובר עם Meta Embedded Signup. יומן וואטסאפ יכול לשבת על הליד. החיבור לא מאשר תבנית ולא מחליף את משימת המעקב.",
      "El número es una suscripción aparte de 29 dólares, conectada con Meta Embedded Signup. Un registro de WhatsApp puede quedar en el lead. La conexión no aprueba una plantilla y no sustituye la tarea de seguimiento.",
      "O número é uma assinatura à parte de US$ 29, conectada com o Meta Embedded Signup. Um registro de WhatsApp pode ficar no lead. A conexão não aprova um modelo e não substitui a tarefa de acompanhamento.",
      "الرقم اشتراك منفصل بـ 29 دولاراً، يُربط عبر Meta Embedded Signup. يمكن لسجل واتساب أن يبقى على العميل. الربط لا يعتمد قالباً ولا يستبدل مهمة المتابعة.",
    ),
    h1: t("Connect WhatsApp Business Platform to a CRM", "חיבור WhatsApp Business Platform ל־CRM", "Conectar WhatsApp Business Platform a un CRM", "Conectar a WhatsApp Business Platform a um CRM", "ربط WhatsApp Business Platform بـ CRM"),
    lede: t(
      "WhatsApp carries the conversation. The CRM carries the record of what was decided. Connecting them does not merge the two bills or the two jobs.",
      "וואטסאפ נושא את השיחה. ה־CRM נושא את הרשומה של מה שהוחלט. החיבור ביניהם לא ממזג את שני החשבונות או את שתי העבודות.",
      "WhatsApp lleva la conversación. El CRM lleva el registro de lo que se decidió. Conectarlos no fusiona las dos facturas ni los dos trabajos.",
      "O WhatsApp carrega a conversa. O CRM carrega o registro do que foi decidido. Conectá-los não funde as duas faturas nem os dois trabalhos.",
      "واتساب يحمل المحادثة. CRM يحمل سجل ما تقرر. ربطهما لا يدمج الفاتورتين ولا العملين.",
    ),
    sections: [
      {
        id: "connect",
        heading: t("What you actually connect", "מה באמת מחברים", "Qué se conecta de verdad", "O que se conecta de verdade", "ماذا تربطون فعلاً"),
        steps: [
          t("Subscribe the number in Bizuply at $29 a month. There is no free trial. A second number is a second subscription.", "עושים מנוי למספר בביזאפלי ב־29 דולר לחודש. אין ניסיון חינם. מספר שני הוא מנוי שני.", "Suscriba el número en Bizuply a 29 dólares al mes. No hay prueba gratis. Un segundo número es una segunda suscripción.", "Assine o número na Bizuply a US$ 29 por mês. Não há teste grátis. Um segundo número é uma segunda assinatura.", "اشتركوا بالرقم في Bizuply بـ 29 دولاراً في الشهر. لا تجربة مجانية. الرقم الثاني اشتراك ثان."),
          t("Use Meta Embedded Signup from the Bizuply dashboard. Meta approves the number. Bizuply does not add another approval queue.", "משתמשים ב־Meta Embedded Signup מלוח הבקרה של ביזאפלי. Meta מאשרת את המספר. ביזאפלי לא מוסיפה תור אישור נוסף.", "Use Meta Embedded Signup desde el panel de Bizuply. Meta aprueba el número. Bizuply no añade otra cola de aprobación.", "Use o Meta Embedded Signup no painel da Bizuply. A Meta aprova o número. A Bizuply não acrescenta outra fila de aprovação.", "استخدموا Meta Embedded Signup من لوحة Bizuply. تعتمد Meta الرقم. لا تضيف Bizuply طابور موافقة آخر."),
          t("Keep the lead open while you write. A WhatsApp log belongs on that lead, next to the note and the task.", "משאירים את הליד פתוח בזמן שכותבים. יומן הוואטסאפ שייך לליד הזה, ליד ההערה והמשימה.", "Deje el lead abierto mientras escribe. Un registro de WhatsApp pertenece a ese lead, junto a la nota y la tarea.", "Deixe o lead aberto enquanto escreve. Um registro de WhatsApp pertence a esse lead, junto da nota e da tarefa.", "أبقوا العميل مفتوحاً وأنتم تكتبون. سجل واتساب يخص ذلك العميل، بجانب الملاحظة والمهمة."),
        ],
      },
      {
        id: "not",
        heading: t("What the connection does not do", "מה החיבור לא עושה", "Qué no hace la conexión", "O que a conexão não faz", "ما لا يفعله الربط"),
        paragraphs: [t(
          "It does not turn the WhatsApp app on a personal phone into the CRM. It does not approve a template. It does not pay Meta's per-message charges. It does not mark the lead Contacted because a message was sent. Contacted still means a person was reached, and someone writes that on the timeline. An agency screen that manages many client accounts from one login is not available. Each number has its own subscription.",
          "הוא לא הופך את אפליקציית הוואטסאפ בטלפון אישי ל־CRM. הוא לא מאשר תבנית. הוא לא משלם את חיובי ההודעה של Meta. הוא לא מסמן את הליד כ־נוצר קשר כי נשלחה הודעה. נוצר קשר עדיין אומר שהגעתם אל אדם, ומישהו כותב את זה על ציר הזמן. מסך סוכנות שמנהל חשבונות לקוח רבים מהתחברות אחת אינו זמין. לכל מספר יש מנוי משלו.",
          "No convierte la app de WhatsApp de un teléfono personal en el CRM. No aprueba una plantilla. No paga los cargos por mensaje de Meta. No marca el lead como Contactado porque se envió un mensaje. Contactado sigue significando que se llegó a una persona, y alguien lo escribe en la línea de tiempo. Una pantalla de agencia que gestione muchas cuentas de clientes desde un acceso no está disponible. Cada número tiene su propia suscripción.",
          "Não transforma o app de WhatsApp de um telefone pessoal no CRM. Não aprova um modelo. Não paga as cobranças por mensagem da Meta. Não marca o lead como Contato feito porque uma mensagem foi enviada. Contato feito continua significando que uma pessoa foi alcançada, e alguém escreve isso na linha do tempo. Uma tela de agência que gerencie muitas contas de clientes num login não está disponível. Cada número tem a própria assinatura.",
          "لا يحوّل تطبيق واتساب على هاتف شخصي إلى CRM. لا يعتمد قالباً. لا يدفع رسوم الرسالة لدى Meta. لا يعلّم العميل تم التواصل لأن رسالة أُرسلت. تم التواصل ما زال يعني أن شخصاً تم الوصول إليه، ويكتب أحد ذلك على الخط الزمني. شاشة وكالة تدير حسابات عملاء كثيرة من دخول واحد غير متاحة. لكل رقم اشتراكه.",
        )],
      },
    ],
    faq: [[
      t("Can the first message be a normal text?", "האם ההודעה הראשונה יכולה להיות טקסט רגיל?", "¿El primer mensaje puede ser un texto normal?", "A primeira mensagem pode ser um texto normal?", "هل يمكن أن تكون الرسالة الأولى نصاً عادياً؟"),
      t("Only inside an open customer service window. Outside it, Meta requires an approved template. The template guide covers that rule.", "רק בתוך חלון שירות לקוחות פתוח. מחוץ לו, Meta דורשת תבנית מאושרת. מדריך התבניות מכסה את הכלל הזה.", "Solo dentro de una ventana de servicio abierta. Fuera de ella, Meta exige una plantilla aprobada. La guía de plantillas cubre esa regla.", "Só dentro de uma janela de atendimento aberta. Fora dela, a Meta exige um modelo aprovado. O guia de modelos cobre essa regra.", "فقط داخل نافذة خدمة عملاء مفتوحة. خارجها، تشترط Meta قالباً معتمداً. دليل القوالب يغطي هذه القاعدة."),
    ]],
    related: [
      { href: "/guides/whatsapp-message-templates", label: t("Message templates", "תבניות הודעה", "Plantillas", "Modelos", "قوالب الرسائل") },
      { href: "/guides/whatsapp-cloud-api-cost", label: t("What the number costs", "כמה עולה המספר", "Cuánto cuesta el número", "Quanto custa o número", "كم يكلف الرقم") },
      { href: "/compare/whatsapp-app-or-api", label: t("The app or the platform", "האפליקציה או הפלטפורמה", "La app o la plataforma", "O app ou a plataforma", "التطبيق أو المنصة") },
    ],
    sources: [metaPricing, { href: "/pricing", label: t("Bizuply pricing", "מחירון ביזאפלי", "Precios de Bizuply", "Preços da Bizuply", "أسعار Bizuply") }],
  }),
  article({
    slug: "whatsapp-api-billing-structure",
    cluster: "whatsapp",
    intent: t("Someone budgeting a month of WhatsApp, not looking up the $29 line.", "מישהו שמתקצב חודש של וואטסאפ, לא מחפש את שורת 29 הדולר.", "Alguien que presupuesta un mes de WhatsApp, no la línea de 29 dólares.", "Alguém que orça um mês de WhatsApp, não a linha de US$ 29.", "شخص يضع ميزانية شهر من واتساب، لا سطر الـ 29 دولاراً."),
    adds: t(
      "The public cost guide explains the two bills and the categories. This draft is a way to estimate a month without pasting Meta's rate card, which changes.",
      "מדריך העלות הציבורי מסביר את שני החשבונות ואת הקטגוריות. הטיוטה הזו היא דרך להעריך חודש בלי להדביק את לוח התעריפים של Meta, שמשתנה.",
      "La guía pública de costo explica las dos facturas y las categorías. Este borrador es una forma de estimar un mes sin pegar la tabla de Meta, que cambia.",
      "O guia público de custo explica as duas faturas e as categorias. Este rascunho é um jeito de estimar um mês sem colar a tabela da Meta, que muda.",
      "دليل التكلفة العام يشرح الفاتورتين والفئات. هذه المسودة طريقة لتقدير شهر دون لصق جدول Meta، الذي يتغير.",
    ),
    title: t("How to estimate a month of WhatsApp API charges | BizUply", "איך מעריכים חודש של חיובי WhatsApp API | ביזאפלי", "Cómo estimar un mes de cargos de WhatsApp API | BizUply", "Como estimar um mês de cobranças da API do WhatsApp | BizUply", "كيف تقدّرون شهراً من رسوم WhatsApp API | BizUply"),
    description: t(
      "Count delivered messages by category, then read Meta's current rate for the recipient country. Add Bizuply's $29 per number. Do not budget from a copied table.",
      "סופרים הודעות שנמסרו לפי קטגוריה, ואז קוראים את התעריף העדכני של Meta למדינת הנמען. מוסיפים את 29 הדולר של ביזאפלי לכל מספר. לא מתקצבים מטבלה שהועתקה.",
      "Cuente los mensajes entregados por categoría y luego lea la tarifa actual de Meta para el país del destinatario. Sume los 29 dólares de Bizuply por número. No presupueste desde una tabla copiada.",
      "Conte as mensagens entregues por categoria e depois leia a tarifa atual da Meta para o país do destinatário. Some os US$ 29 da Bizuply por número. Não orce a partir de uma tabela copiada.",
      "عدّوا الرسائل المُسلَّمة حسب الفئة، ثم اقرأوا سعر Meta الحالي لدولة المستلم. أضيفوا 29 دولاراً من Bizuply لكل رقم. لا تضعوا الميزانية من جدول منسوخ.",
    ),
    h1: t("How to estimate a month of WhatsApp API charges", "איך מעריכים חודש של חיובי WhatsApp API", "Cómo estimar un mes de cargos de WhatsApp API", "Como estimar um mês de cobranças da API do WhatsApp", "كيف تقدّرون شهراً من رسوم WhatsApp API"),
    lede: t(
      "The estimate has two lines that must not be added as if they were the same company. Bizuply bills the number. Meta bills delivered business-to-user messages.",
      "להערכה יש שתי שורות שאסור לחבר כאילו הן אותה חברה. ביזאפלי מחייבת את המספר. Meta מחייבת הודעות שנמסרו מעסק למשתמש.",
      "La estimación tiene dos líneas que no se deben sumar como si fueran la misma empresa. Bizuply cobra el número. Meta cobra los mensajes entregados de empresa a usuario.",
      "A estimativa tem duas linhas que não se devem somar como se fossem a mesma empresa. A Bizuply cobra o número. A Meta cobra as mensagens entregues de empresa para usuário.",
      "للتقدير سطران لا يُجمعان كأنهما الشركة نفسها. تحصّل Bizuply الرقم. تحصّل Meta الرسائل المُسلَّمة من النشاط إلى المستخدم.",
    ),
    sections: [
      {
        id: "count",
        heading: t("Count before you multiply", "סופרים לפני שמכפילים", "Cuente antes de multiplicar", "Conte antes de multiplicar", "عدّوا قبل الضرب"),
        steps: [
          t("Write $29 once for each connected number. That line is Bizuply. It does not change with how many messages you send.", "כותבים 29 דולר פעם אחת לכל מספר מחובר. השורה הזו היא ביזאפלי. היא לא משתנה לפי כמה הודעות שולחים.", "Escriba 29 dólares una vez por cada número conectado. Esa línea es Bizuply. No cambia con cuántos mensajes envíe.", "Escreva US$ 29 uma vez para cada número conectado. Essa linha é a Bizuply. Ela não muda com quantas mensagens você envia.", "اكتبوا 29 دولاراً مرة لكل رقم متصل. هذا السطر هو Bizuply. لا يتغير بعدد الرسائل التي ترسلون."),
          t("Count messages you expect Meta to deliver, split by category: marketing template, utility template, authentication template, and service replies.", "סופרים הודעות שמצפים ש־Meta תמסור, מחולקות לפי קטגוריה: תבנית שיווק, תבנית שירות תפעולי, תבנית אימות, ותשובות שירות.", "Cuente los mensajes que espera que Meta entregue, separados por categoría: plantilla de marketing, de utilidad, de autenticación y respuestas de servicio.", "Conte as mensagens que espera que a Meta entregue, separadas por categoria: modelo de marketing, de utilidade, de autenticação e respostas de serviço.", "عدّوا الرسائل التي تتوقعون أن تسلّمها Meta، مقسومة حسب الفئة: قالب تسويق، وقالب خدمة تشغيلية، وقالب توثيق، وردود خدمة."),
          t("For service messages, subtract the 1,000 free delivered service messages per business phone number per month that Meta's page, updated 30 September 2026, describes from 1 October 2026. They do not roll over.", "להודעות שירות, מחסירים את 1,000 הודעות השירות שנמסרו בחינם לכל מספר טלפון עסקי בחודש, כפי שעמוד Meta, שעודכן ב־30 בספטמבר 2026, מתאר החל מ־1 באוקטובר 2026. הן לא עוברות הלאה.", "Para los mensajes de servicio, reste los 1.000 mensajes de servicio entregados gratis por número de teléfono de empresa al mes que describe la página de Meta, actualizada el 30 de septiembre de 2026, desde el 1 de octubre de 2026. No se acumulan.", "Para mensagens de serviço, subtraia as 1.000 mensagens de serviço entregues grátis por número de telefone comercial por mês que a página da Meta, atualizada em 30 de setembro de 2026, descreve a partir de 1 de outubro de 2026. Elas não acumulam.", "لرسائل الخدمة، اطرحوا 1,000 رسالة خدمة مُسلَّمة مجاناً لكل رقم هاتف تجاري في الشهر، كما تصف صفحة Meta المحدّثة في 30 سبتمبر 2026 اعتباراً من 1 أكتوبر 2026. لا تتراكم."),
          t("Open Meta's rate table for the recipient country and multiply there. Paste the date you read it next to the estimate. Do not paste the rates into a page that will go stale.", "פותחים את טבלת התעריפים של Meta למדינת הנמען ומכפילים שם. מדביקים את התאריך שבו קראתם ליד ההערכה. לא מדביקים את התעריפים לעמוד שיתיישן.", "Abra la tabla de tarifas de Meta para el país del destinatario y multiplique allí. Pegue la fecha en que la leyó junto a la estimación. No pegue las tarifas en una página que se volverá vieja.", "Abra a tabela de tarifas da Meta para o país do destinatário e multiplique ali. Cole a data em que leu ao lado da estimativa. Não cole as tarifas numa página que vai envelhecer.", "افتحوا جدول أسعار Meta لدولة المستلم واضربوا هناك. الصقوا تاريخ القراءة بجانب التقدير. لا تلصقوا الأسعار في صفحة ستتقادم."),
        ],
      },
      {
        id: "exclude",
        heading: t("What not to put in the estimate", "מה לא לשים בהערכה", "Qué no poner en la estimación", "O que não colocar na estimativa", "ما لا يوضع في التقدير"),
        paragraphs: [t(
          "Do not count a message the user sends you. Meta's page says it does not charge those. Do not count a message that was not delivered. Do not treat a campaign result or a CRM row as a WhatsApp charge. Do not add the $49 CRM plan or the $99 business plan into the message line. Those are different products.",
          "לא סופרים הודעה שהמשתמש שולח אליכם. עמוד Meta אומר שהיא לא מחייבת על אלה. לא סופרים הודעה שלא נמסרה. לא מתייחסים לתוצאת קמפיין או לשורת CRM כחיוב וואטסאפ. לא מוסיפים את מסלול ה־CRM של 49 דולר או את החבילה העסקית של 99 לשורת ההודעות. אלה מוצרים שונים.",
          "No cuente un mensaje que el usuario le envía. La página de Meta dice que no cobra esos. No cuente un mensaje que no se entregó. No trate un resultado de campaña o una fila del CRM como un cargo de WhatsApp. No sume el plan CRM de 49 dólares ni el plan de negocio de 99 a la línea de mensajes. Son productos distintos.",
          "Não conte uma mensagem que o usuário envia a você. A página da Meta diz que não cobra essas. Não conte uma mensagem que não foi entregue. Não trate um resultado de campanha ou uma linha do CRM como uma cobrança de WhatsApp. Não some o plano de CRM de US$ 49 nem o plano de negócios de US$ 99 à linha das mensagens. São produtos diferentes.",
          "لا تعدّوا رسالة يرسلها المستخدم إليكم. تقول صفحة Meta إنها لا تحصّل تلك. لا تعدّوا رسالة لم تُسلَّم. لا تعاملوا نتيجة حملة أو صف CRM كرسوم واتساب. لا تضيفوا خطة CRM بـ 49 دولاراً أو الخطة التجارية بـ 99 إلى سطر الرسائل. هذه منتجات مختلفة.",
        )],
      },
    ],
    faq: [[
      t("Why not print the rates here?", "למה לא להדפיס את התעריפים כאן?", "¿Por qué no imprimir las tarifas aquí?", "Por que não imprimir as tarifas aqui?", "لماذا لا تُطبع الأسعار هنا؟"),
      t("Because Meta updates them, and a copied number becomes a false quote. The public cost guide points at the page. This estimate only tells you which counts to take there.", "כי Meta מעדכנת אותם, ומספר שהועתק הופך להצעת מחיר שקרית. מדריך העלות הציבורי מצביע על העמוד. ההערכה הזו רק אומרת אילו ספירות לקחת לשם.", "Porque Meta las actualiza, y un número copiado se vuelve un presupuesto falso. La guía pública de costo señala la página. Esta estimación solo dice qué conteos llevar allí.", "Porque a Meta as atualiza, e um número copiado vira um orçamento falso. O guia público de custo aponta a página. Esta estimativa só diz quais contagens levar para lá.", "لأن Meta تحدّثها، والرقم المنسوخ يصبح عرض سعر كاذباً. دليل التكلفة العام يشير إلى الصفحة. هذا التقدير يقول فقط أي أعداد تأخذون إلى هناك."),
    ]],
    related: [
      { href: "/guides/whatsapp-cloud-api-cost", label: t("The two bills", "שני החשבונות", "Las dos facturas", "As duas faturas", "الفاتورتان") },
      { href: "/templates", label: t("Calculators", "מחשבונים", "Calculadoras", "Calculadoras", "آلات حاسبة") },
    ],
    sources: [metaPricing],
  }),
  article({
    slug: "write-whatsapp-templates",
    cluster: "whatsapp",
    intent: t("Someone ready to write the first three templates, not to learn the price.", "מישהו שמוכן לכתוב את שלוש התבניות הראשונות, לא ללמוד את המחיר.", "Alguien listo para escribir las tres primeras plantillas, no para aprender el precio.", "Alguém pronto para escrever os três primeiros modelos, não para aprender o preço.", "شخص جاهز لكتابة القوالب الثلاثة الأولى، لا لتعلّم السعر."),
    adds: t(
      "The public template guide explains rejection and the 24-hour window. This draft is three templates written out, and the opt-in they depend on.",
      "מדריך התבניות הציבורי מסביר דחייה ואת חלון 24 השעות. הטיוטה הזו היא שלוש תבניות כתובות, וההסכמה שהן תלויות בה.",
      "La guía pública de plantillas explica el rechazo y la ventana de 24 horas. Este borrador son tres plantillas escritas, y el permiso del que dependen.",
      "O guia público de modelos explica a recusa e a janela de 24 horas. Este rascunho são três modelos escritos, e o consentimento de que dependem.",
      "دليل القوالب العام يشرح الرفض ونافذة 24 ساعة. هذه المسودة ثلاثة قوالب مكتوبة، والموافقة التي تعتمد عليها.",
    ),
    title: t("Write the first three WhatsApp templates | BizUply", "כתיבת שלוש תבניות הוואטסאפ הראשונות | ביזאפלי", "Escribir las tres primeras plantillas de WhatsApp | BizUply", "Escrever os três primeiros modelos de WhatsApp | BizUply", "كتابة قوالب واتساب الثلاثة الأولى | BizUply"),
    description: t(
      "A first reply, a reminder, and a reactivation are three different categories. Each needs a sample for every variable, and a person who opted in.",
      "תשובה ראשונה, תזכורת, והפעלה מחדש הן שלוש קטגוריות שונות. לכל אחת צריך דוגמה לכל משתנה, ואדם שהסכים.",
      "Una primera respuesta, un recordatorio y una reactivación son tres categorías distintas. Cada una necesita una muestra por variable, y una persona que aceptó.",
      "Uma primeira resposta, um lembrete e uma reativação são três categorias diferentes. Cada uma precisa de uma amostra por variável, e uma pessoa que aceitou.",
      "رد أول وتذكير وإعادة تنشيط ثلاث فئات مختلفة. كل واحد يحتاج عيّنة لكل متغيّر، وشخصاً وافق.",
    ),
    h1: t("Write the first three WhatsApp templates", "כתיבת שלוש תבניות הוואטסאפ הראשונות", "Escribir las tres primeras plantillas de WhatsApp", "Escrever os três primeiros modelos de WhatsApp", "كتابة قوالب واتساب الثلاثة الأولى"),
    lede: t(
      "Write the message you would actually send, then choose the category that matches it. Do not choose a cheaper-sounding category and bend the words.",
      "כותבים את ההודעה שהייתם שולחים באמת, ואז בוחרים את הקטגוריה שמתאימה לה. לא בוחרים קטגוריה שנשמעת זולה יותר ומכופפים את המילים.",
      "Escriba el mensaje que de verdad enviaría y luego elija la categoría que le corresponde. No elija una categoría que suene más barata y doble las palabras.",
      "Escreva a mensagem que realmente enviaria e depois escolha a categoria que combina. Não escolha uma categoria que pareça mais barata e entorte as palavras.",
      "اكتبوا الرسالة التي سترسلونها فعلاً، ثم اختاروا الفئة التي تطابقها. لا تختاروا فئة تبدو أرخص وتعوجوا الكلمات.",
    ),
    sections: [
      {
        id: "three",
        heading: t("Three messages, three jobs", "שלוש הודעות, שלוש עבודות", "Tres mensajes, tres trabajos", "Três mensagens, três trabalhos", "ثلاث رسائل، ثلاثة أعمال"),
        paragraphs: [t(
          "First reply, outside the window: \"Hi {{1}}, this is {{2}}. You asked about {{3}}. Reply here and we will continue.\" That is a follow-up to a request, not a discount. Reminder: \"Your appointment with {{1}} is on {{2}}. Reply if you need to move it.\" Leave the offer out. Reactivation: \"{{1}}, it has been a while since {{2}}. If you want another visit, reply and we will find a time.\" If you add a percent off, it is marketing. Meta reviews the category. The public guide shows the rejection patterns.",
          "תשובה ראשונה, מחוץ לחלון: \"היי {{1}}, כאן {{2}}. שאלתם על {{3}}. תשיבו כאן ונמשיך.\" זה מעקב אחרי בקשה, לא הנחה. תזכורת: \"התור שלך עם {{1}} הוא ב־{{2}}. תשיבו אם צריך להזיז.\" בלי מבצע. הפעלה מחדש: \"{{1}}, עבר זמן מאז {{2}}. אם בא לכם ביקור נוסף, תשיבו ונקבע זמן.\" אם מוסיפים אחוז הנחה, זה שיווק. Meta בודקת את הקטגוריה. המדריך הציבורי מראה את דפוסי הדחייה.",
          "Primera respuesta, fuera de la ventana: \"Hola {{1}}, soy {{2}}. Preguntó por {{3}}. Responda aquí y seguimos.\" Es un seguimiento de una petición, no un descuento. Recordatorio: \"Su cita con {{1}} es el {{2}}. Responda si necesita moverla.\" Sin oferta. Reactivación: \"{{1}}, ha pasado un tiempo desde {{2}}. Si quiere otra visita, responda y buscamos hora.\" Si añade un porcentaje, es marketing. Meta revisa la categoría. La guía pública muestra los rechazos.",
          "Primeira resposta, fora da janela: \"Olá {{1}}, aqui é {{2}}. Você perguntou sobre {{3}}. Responda aqui e seguimos.\" É um acompanhamento de um pedido, não um desconto. Lembrete: \"Sua consulta com {{1}} é em {{2}}. Responda se precisar mudar.\" Sem oferta. Reativação: \"{{1}}, faz tempo desde {{2}}. Se quiser outra visita, responda e marcamos um horário.\" Se acrescentar um percentual, é marketing. A Meta revisa a categoria. O guia público mostra as recusas.",
          "رد أول، خارج النافذة: \"مرحباً {{1}}، هنا {{2}}. سألتم عن {{3}}. ردّوا هنا ونتابع.\" هذه متابعة لطلب، لا خصم. تذكير: \"موعدكم مع {{1}} في {{2}}. ردّوا إذا احتجتم نقله.\" بلا عرض. إعادة تنشيط: \"{{1}}، مرّ وقت منذ {{2}}. إذا أردتم زيارة أخرى، ردّوا ونجد وقتاً.\" إذا أضفتم نسبة خصم، فهذا تسويق. تراجع Meta الفئة. الدليل العام يعرض أنماط الرفض.",
        )],
      },
      {
        id: "optin",
        heading: t("The opt-in is part of the template", "ההסכמה היא חלק מהתבנית", "El permiso es parte de la plantilla", "O consentimento faz parte do modelo", "الموافقة جزء من القالب"),
        paragraphs: [t(
          "Meta's pricing page says you can send only to people who opted in to messages from you. A purchased list is not an opt-in. A form on your site can be one, if the line next to the number says they agree to hear from you on WhatsApp. Keep that sentence next to the template, so the person who submits it can show what the recipient agreed to.",
          "עמוד המחירים של Meta אומר שאפשר לשלוח רק לאנשים שהסכימו לקבל מכם הודעות. רשימה שנקנתה אינה הסכמה. טופס באתר יכול להיות הסכמה, אם השורה ליד המספר אומרת שהם מסכימים לשמוע מכם בוואטסאפ. שומרים את המשפט הזה ליד התבנית, כדי שמי שמגיש אותה יוכל להראות למה הנמען הסכים.",
          "La página de precios de Meta dice que solo puede enviar a personas que aceptaron mensajes suyos. Una lista comprada no es un permiso. Un formulario en su sitio puede serlo, si la línea junto al número dice que aceptan saber de usted por WhatsApp. Guarde esa frase junto a la plantilla, para que quien la envíe pueda mostrar a qué aceptó el destinatario.",
          "A página de preços da Meta diz que só se pode enviar a pessoas que aceitaram mensagens suas. Uma lista comprada não é consentimento. Um formulário no seu site pode ser, se a linha ao lado do número disser que aceitam ouvir de você no WhatsApp. Guarde essa frase junto do modelo, para quem o envia poder mostrar com o que o destinatário concordou.",
          "تقول صفحة أسعار Meta إن الإرسال ممكن فقط لمن وافق على رسائل منكم. قائمة مشتراة ليست موافقة. نموذج في موقعكم يمكن أن يكون كذلك، إذا قال السطر بجانب الرقم إنهم يوافقون على أن يسمعوا منكم على واتساب. احتفظوا بهذه الجملة بجانب القالب، حتى يستطيع من يقدّمه أن يُظهر ما وافق عليه المستلم.",
        )],
      },
    ],
    faq: [[
      t("Do I need a sample for {{1}}?", "צריך דוגמה ל־{{1}}?", "¿Necesito una muestra para {{1}}?", "Preciso de uma amostra para {{1}}?", "هل أحتاج عيّنة لـ {{1}}؟"),
      t("Yes. Meta reviews an example, such as a real first name. An empty variable is a common reason a template comes back.", "כן. Meta בודקת דוגמה, למשל שם פרטי אמיתי. משתנה ריק הוא סיבה נפוצה שתבנית חוזרת.", "Sí. Meta revisa un ejemplo, como un nombre real. Una variable vacía es una razón frecuente de que la plantilla vuelva.", "Sim. A Meta revisa um exemplo, como um primeiro nome real. Uma variável vazia é um motivo comum de o modelo voltar.", "نعم. تراجع Meta مثالاً، مثل اسم أول حقيقي. المتغيّر الفارغ سبب شائع لعودة القالب."),
    ]],
    related: [
      { href: "/guides/whatsapp-message-templates", label: t("Why a template is rejected", "למה תבנית נדחית", "Por qué se rechaza una plantilla", "Por que um modelo é recusado", "لماذا يُرفض القالب") },
      { href: "/guides/website-form-to-crm", label: t("The form that can carry the opt-in", "הטופס שיכול לשאת את ההסכמה", "El formulario que puede llevar el permiso", "O formulário que pode carregar o consentimento", "النموذج الذي يمكن أن يحمل الموافقة") },
    ],
    sources: [
      metaPricing,
      { href: "https://developers.facebook.com/docs/whatsapp/message-templates", label: t("Meta: message templates", "Meta: תבניות הודעה", "Meta: plantillas", "Meta: modelos", "Meta: قوالب الرسائل") },
    ],
  }),
  article({
    slug: "automations-that-save-time",
    cluster: "automations",
    intent: t("Someone who wants fewer repeated tasks, not a map of every possible trigger.", "מישהו שרוצה פחות משימות שחוזרות, לא מפה של כל טריגר אפשרי.", "Alguien que quiere menos tareas repetidas, no un mapa de cada disparador.", "Alguém que quer menos tarefas repetidas, não um mapa de cada gatilho.", "شخص يريد مهاماً متكررة أقل، لا خريطة لكل مشغّل."),
    adds: t(
      "The public automation guide lists three rules worth publishing. This draft is how to measure whether a rule saved the team's own minutes.",
      "מדריך האוטומציה הציבורי מציג שלושה כללים ששווה לפרסם. הטיוטה הזו היא איך מודדים אם כלל חסך את הדקות של הצוות עצמו.",
      "La guía pública de automatización lista tres reglas que vale la pena publicar. Este borrador es cómo medir si una regla ahorró los minutos del propio equipo.",
      "O guia público de automação lista três regras que vale publicar. Este rascunho é como medir se uma regra poupou os minutos da própria equipe.",
      "دليل الأتمتة العام يسرد ثلاث قواعد تستحق النشر. هذه المسودة كيف تقيسون إن كانت قاعدة وفّرت دقائق الفريق نفسه.",
    ),
    title: t("Automations that save a small team's time | BizUply", "אוטומציות שחוסכות זמן לצוות קטן | ביזאפלי", "Automatizaciones que ahorran tiempo a un equipo pequeño | BizUply", "Automações que poupam tempo de uma equipe pequena | BizUply", "أتمتة توفّر وقت فريق صغير | BizUply"),
    description: t(
      "Time saved is the minutes your team stops spending, counted by you. A rule on the business plan can create a task. It cannot invent an hour.",
      "זמן שנחסך הוא הדקות שהצוות מפסיק לבזבז, ואתן סופרים אותן. כלל בחבילה העסקית יכול ליצור משימה. הוא לא יכול להמציא שעה.",
      "El tiempo ahorrado son los minutos que su equipo deja de gastar, contados por usted. Una regla del plan de negocio puede crear una tarea. No puede inventar una hora.",
      "O tempo poupado são os minutos que a equipe deixa de gastar, contados por você. Uma regra do plano de negócios pode criar uma tarefa. Ela não inventa uma hora.",
      "الوقت الموفَّر هو الدقائق التي يتوقف فريقكم عن إنفاقها، تعدّونها أنتم. قاعدة في الخطة التجارية يمكن أن تنشئ مهمة. لا تخترع ساعة.",
    ),
    h1: t("Automations that save a small team's time", "אוטומציות שחוסכות זמן לצוות קטן", "Automatizaciones que ahorran tiempo a un equipo pequeño", "Automações que poupam tempo de uma equipe pequena", "أتمتة توفّر وقت فريق صغير"),
    lede: t(
      "Start from a task the team already repeats. If you cannot name who does it and how many minutes it takes, you do not have an automation. You have a wish.",
      "מתחילים ממשימה שהצוות כבר חוזר עליה. אם אי אפשר לומר מי עושה אותה וכמה דקות היא לוקחת, אין אוטומציה. יש משאלה.",
      "Empiece por una tarea que el equipo ya repite. Si no puede decir quién la hace y cuántos minutos toma, no tiene una automatización. Tiene un deseo.",
      "Comece por uma tarefa que a equipe já repete. Se não consegue dizer quem faz e quantos minutos leva, não tem uma automação. Tem um desejo.",
      "ابدأوا بمهمة يكررها الفريق أصلاً. إذا لم تستطيعوا تسمية من يفعلها وكم دقيقة تستغرق، فليس لديكم أتمتة. لديكم أمنية.",
    ),
    sections: [
      {
        id: "audit",
        heading: t("Count your own minutes", "סופרים את הדקות שלכם", "Cuente sus propios minutos", "Conte os seus próprios minutos", "عدّوا دقائقكم"),
        steps: [
          t("For one week, write each repeated task, who does it, and the minutes.", "במשך שבוע כותבים כל משימה שחוזרת, מי עושה אותה, ואת הדקות.", "Durante una semana, escriba cada tarea repetida, quién la hace y los minutos.", "Durante uma semana, escreva cada tarefa repetida, quem faz e os minutos.", "لأسبوع، اكتبوا كل مهمة متكررة، ومن يفعلها، والدقائق."),
          t("Keep a candidate only if the product can see the trigger: a new lead, a status change, or an appointment on the business plan.", "משאירים מועמד רק אם המוצר יכול לראות את הטריגר: ליד חדש, שינוי סטטוס, או תור בחבילה העסקית.", "Conserve un candidato solo si el producto puede ver el disparador: un lead nuevo, un cambio de estado o una cita en el plan de negocio.", "Mantenha um candidato só se o produto consegue ver o gatilho: um lead novo, uma mudança de status ou uma reserva no plano de negócios.", "أبقوا مرشحاً فقط إذا استطاع المنتج رؤية المشغّل: عميل جديد، أو تغيير حالة، أو موعد في الخطة التجارية."),
          t("Publish one rule. The public guide names three that are worth it and two that are not, including a rule that marks Contacted.", "מפרסמים כלל אחד. המדריך הציבורי מציין שלושה ששווים ושניים שלא, כולל כלל שמסמן נוצר קשר.", "Publique una regla. La guía pública nombra tres que valen y dos que no, incluida una regla que marca Contactado.", "Publique uma regra. O guia público nomeia três que valem e duas que não, inclusive uma regra que marca Contato feito.", "انشروا قاعدة واحدة. يسمّي الدليل العام ثلاثاً تستحق واثنتين لا، بما فيها قاعدة تعلّم تم التواصل."),
          t("After two weeks, count the minutes again. If the task still happens by hand, the rule did not save time.", "אחרי שבועיים סופרים שוב את הדקות. אם המשימה עדיין נעשית ביד, הכלל לא חסך זמן.", "Después de dos semanas, cuente los minutos otra vez. Si la tarea sigue haciéndose a mano, la regla no ahorró tiempo.", "Depois de duas semanas, conte os minutos de novo. Se a tarefa ainda é feita à mão, a regra não poupou tempo.", "بعد أسبوعين عدّوا الدقائق مرة أخرى. إذا كانت المهمة ما زالت تُنجز يدوياً، فالقاعدة لم توفّر وقتاً."),
        ],
      },
      {
        id: "plan",
        heading: t("Which plan can run the rule", "איזה מסלול יכול להריץ את הכלל", "Qué plan puede ejecutar la regla", "Qual plano pode executar a regra", "أي خطة تستطيع تشغيل القاعدة"),
        paragraphs: [t(
          "Automations are on the business plan at $99 a month or $990 a year, together with appointments and collaborations. CRM only at $49 keeps the record and the manual task. The rule does not approve a WhatsApp template and does not buy ads.",
          "אוטומציות נמצאות בחבילה העסקית ב־99 דולר לחודש או 990 לשנה, יחד עם תורים ושיתופים. CRM בלבד ב־49 שומר את הרשומה ואת המשימה הידנית. הכלל לא מאשר תבנית וואטסאפ ולא קונה מודעות.",
          "Las automatizaciones están en el plan de negocio a 99 dólares al mes o 990 al año, junto con citas y colaboraciones. El CRM solo a 49 guarda el registro y la tarea manual. La regla no aprueba una plantilla de WhatsApp y no compra anuncios.",
          "As automações ficam no plano de negócios a US$ 99 por mês ou US$ 990 por ano, junto com agenda e colaborações. O CRM sozinho a US$ 49 guarda o registro e a tarefa manual. A regra não aprova um modelo de WhatsApp e não compra anúncios.",
          "الأتمتة في الخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة، مع المواعيد والتعاون. CRM وحده بـ 49 يحفظ السجل والمهمة اليدوية. القاعدة لا تعتمد قالب واتساب ولا تشتري إعلانات.",
        )],
      },
    ],
    faq: [[
      t("Is there a standard number of hours saved?", "יש מספר שעות סטנדרטי שנחסכות?", "¿Hay un número estándar de horas ahorradas?", "Existe um número padrão de horas poupadas?", "هل هناك عدد ساعات قياسي يُوفَّر؟"),
      t("No. Use the count from your own week. A borrowed percentage is not your team.", "לא. משתמשים בספירה מהשבוע שלכם. אחוז שהושאל אינו הצוות שלכם.", "No. Use el conteo de su propia semana. Un porcentaje prestado no es su equipo.", "Não. Use a contagem da sua própria semana. Uma porcentagem emprestada não é a sua equipe.", "لا. استخدموا العد من أسبوعكم. النسبة المستعارة ليست فريقكم."),
    ]],
    related: [
      { href: "/guides/business-automation", label: t("Rules worth publishing", "כללים ששווה לפרסם", "Reglas que vale publicar", "Regras que vale publicar", "قواعد تستحق النشر") },
      { href: "/automations", label: t("Automations", "אוטומציות", "Automatizaciones", "Automações", "الأتمتة") },
    ],
    sources: [{ href: "/pricing", label: t("Bizuply pricing", "מחירון ביזאפלי", "Precios de Bizuply", "Preços da Bizuply", "أسعار Bizuply") }],
  }),
  article({
    slug: "brochure-site-or-landing-page",
    cluster: "websites",
    intent: t("Someone deciding whether the business needs several pages or one page with one offer.", "מישהו שמחליט אם העסק צריך כמה עמודים או עמוד אחד עם הצעה אחת.", "Alguien que decide si el negocio necesita varias páginas o una página con una oferta.", "Alguém que decide se o negócio precisa de várias páginas ou uma página com uma oferta.", "شخص يقرر إن كان النشاط يحتاج صفحات عدة أو صفحة واحدة بعرض واحد."),
    adds: t(
      "The public website guide is how to edit and publish in Bizuply. This draft is the choice between a multi-page site and a single offer page.",
      "מדריך האתר הציבורי הוא איך עורכים ומפרסמים בביזאפלי. הטיוטה הזו היא הבחירה בין אתר של כמה עמודים לעמוד הצעה אחד.",
      "La guía pública del sitio es cómo editar y publicar en Bizuply. Este borrador es la elección entre un sitio de varias páginas y una página de una oferta.",
      "O guia público do site é como editar e publicar na Bizuply. Este rascunho é a escolha entre um site de várias páginas e uma página de uma oferta.",
      "دليل الموقع العام هو كيف تحرّرون وتنشرون في Bizuply. هذه المسودة الاختيار بين موقع بعدة صفحات وصفحة عرض واحدة.",
    ),
    title: t("A brochure site or a landing page | BizUply", "אתר תדמית או דף נחיתה | ביזאפלי", "Un sitio de presentación o una página de aterrizaje | BizUply", "Um site institucional ou uma página de destino | BizUply", "موقع تعريفي أو صفحة هبوط | BizUply"),
    description: t(
      "Use several pages when people need to trust the business before they ask. Use one page when there is one offer and one next step. Both still need a form if you want a lead.",
      "משתמשים בכמה עמודים כשאנשים צריכים לבטוח בעסק לפני שהם שואלים. משתמשים בעמוד אחד כשיש הצעה אחת וצעד הבא אחד. לשניהם עדיין צריך טופס אם רוצים ליד.",
      "Use varias páginas cuando la gente necesita confiar en el negocio antes de preguntar. Use una página cuando hay una oferta y un siguiente paso. Las dos siguen necesitando un formulario si quiere un lead.",
      "Use várias páginas quando as pessoas precisam confiar no negócio antes de perguntar. Use uma página quando há uma oferta e um próximo passo. As duas ainda precisam de um formulário se você quer um lead.",
      "استخدموا صفحات عدة حين يحتاج الناس أن يثقوا بالنشاط قبل أن يسألوا. استخدموا صفحة واحدة حين يوجد عرض واحد وخطوة تالية واحدة. كلاهما ما زال يحتاج نموذجاً إذا أردتم عميلاً.",
    ),
    h1: t("A brochure site or a landing page", "אתר תדמית או דף נחיתה", "Un sitio de presentación o una página de aterrizaje", "Um site institucional ou uma página de destino", "موقع تعريفي أو صفحة هبوط"),
    lede: t(
      "The page type follows the decision the visitor has to make. It does not follow a trend.",
      "סוג העמוד עוקב אחרי ההחלטה שהמבקר צריך לקבל. הוא לא עוקב אחרי אופנה.",
      "El tipo de página sigue la decisión que el visitante tiene que tomar. No sigue una moda.",
      "O tipo de página segue a decisão que o visitante tem de tomar. Não segue uma moda.",
      "نوع الصفحة يتبع القرار الذي يجب على الزائر اتخاذه. لا يتبع موضة.",
    ),
    sections: [
      {
        id: "choose",
        heading: t("Which one matches the visit", "מה מתאים לביקור", "Cuál corresponde a la visita", "Qual combina com a visita", "أيّهما يطابق الزيارة"),
        paragraphs: [t(
          "A brochure site is several pages: what you do, where you are, and how to ask. People use it when they are comparing you with another business and need more than one fact. A landing page is one offer, one audience, and one next step. People use it when an ad or a message already named the offer. If you put five services and an about story on the landing page, you built a brochure site with nowhere to go.",
          "אתר תדמית הוא כמה עמודים: מה אתם עושים, איפה אתם, ואיך שואלים. אנשים משתמשים בו כשהם משווים אתכם לעסק אחר וצריכים יותר מעובדה אחת. דף נחיתה הוא הצעה אחת, קהל אחד, וצעד הבא אחד. אנשים משתמשים בו כשמודעה או הודעה כבר נתנה שם להצעה. אם שמים חמישה שירותים וסיפור עלינו על דף הנחיתה, בניתם אתר תדמית בלי לאן ללכת.",
          "Un sitio de presentación son varias páginas: qué hace, dónde está y cómo preguntar. La gente lo usa cuando le compara con otro negocio y necesita más de un dato. Una página de aterrizaje es una oferta, un público y un siguiente paso. La gente la usa cuando un anuncio o un mensaje ya nombró la oferta. Si pone cinco servicios y una historia de nosotros en la página de aterrizaje, construyó un sitio de presentación sin adónde ir.",
          "Um site institucional são várias páginas: o que você faz, onde está e como perguntar. As pessoas usam quando comparam você com outro negócio e precisam de mais de um fato. Uma página de destino é uma oferta, um público e um próximo passo. As pessoas usam quando um anúncio ou uma mensagem já nomeou a oferta. Se colocar cinco serviços e uma história sobre nós na página de destino, construiu um site institucional sem para onde ir.",
          "الموقع التعريفي صفحات عدة: ماذا تفعلون، وأين أنتم، وكيف يُسأل. يستخدمه الناس حين يقارنونكم بنشاط آخر ويحتاجون أكثر من حقيقة. صفحة الهبوط عرض واحد وجمهور واحد وخطوة تالية واحدة. يستخدمها الناس حين سمّى إعلان أو رسالة العرض أصلاً. إذا وضعتم خمس خدمات وقصة عنكم على صفحة الهبوط، بنيتم موقعاً تعريفياً بلا مكان يُذهب إليه.",
        )],
      },
      {
        id: "form",
        heading: t("Both still need the form", "לשניהם עדיין צריך את הטופס", "Las dos siguen necesitando el formulario", "As duas ainda precisam do formulário", "كلاهما ما زال يحتاج النموذج"),
        paragraphs: [t(
          "Neither page creates a lead by being pretty. On a site built in Bizuply, a form can create a row whose source is the website and whose first status is New. A page with no form leaves the inquiry in whoever's inbox. The website has its own price on the pricing page. It is not included in the $49 CRM plan.",
          "אף עמוד לא יוצר ליד מזה שהוא יפה. באתר שנבנה בביזאפלי, טופס יכול ליצור שורה שהמקור שלה הוא האתר והסטטוס הראשון שלה הוא חדש. עמוד בלי טופס משאיר את הפנייה בתיבת הדואר של מישהו. לאתר יש מחיר משלו בעמוד המחירים. הוא לא כלול במסלול ה־CRM של 49 דולר.",
          "Ninguna página crea un lead por ser bonita. En un sitio hecho en Bizuply, un formulario puede crear una fila cuyo origen es el sitio y cuyo primer estado es Nuevo. Una página sin formulario deja la consulta en el buzón de alguien. El sitio tiene su propio precio en la página de precios. No está incluido en el plan CRM de 49 dólares.",
          "Nenhuma página cria um lead por ser bonita. Num site feito na Bizuply, um formulário pode criar uma linha cuja origem é o site e cujo primeiro status é Novo. Uma página sem formulário deixa o pedido na caixa de alguém. O site tem o próprio preço na página de preços. Não está incluído no plano de CRM de US$ 49.",
          "لا تنشئ أي صفحة عميلاً لأنها جميلة. في موقع بُني في Bizuply، يمكن لنموذج أن ينشئ صفاً مصدره الموقع وحالته الأولى جديد. صفحة بلا نموذج تترك الاستفسار في صندوق أحد. للموقع سعره في صفحة الأسعار. ليس مشمولاً في خطة CRM بـ 49 دولاراً.",
        )],
      },
    ],
    faq: [[
      t("Can one Bizuply site be both?", "האם אתר ביזאפלי אחד יכול להיות שניהם?", "¿Un sitio de Bizuply puede ser las dos cosas?", "Um site da Bizuply pode ser as duas coisas?", "هل يمكن لموقع Bizuply واحد أن يكون الاثنين؟"),
      t("Yes. The home page can explain the business, and one inner page can carry a single offer from an ad. Do not send the ad to the home page and hope the visitor finds the offer.", "כן. עמוד הבית יכול להסביר את העסק, ועמוד פנימי אחד יכול לשאת הצעה אחת ממודעה. לא שולחים את המודעה לעמוד הבית ומקווים שהמבקר ימצא את ההצעה.", "Sí. La página de inicio puede explicar el negocio, y una página interior puede llevar una sola oferta de un anuncio. No envíe el anuncio a la página de inicio y espere que el visitante encuentre la oferta.", "Sim. A página inicial pode explicar o negócio, e uma página interna pode carregar uma única oferta de um anúncio. Não envie o anúncio para a página inicial e espere que o visitante ache a oferta.", "نعم. يمكن للصفحة الرئيسية أن تشرح النشاط، وصفحة داخلية واحدة أن تحمل عرضاً واحداً من إعلان. لا ترسلوا الإعلان إلى الصفحة الرئيسية وتأملوا أن يجد الزائر العرض."),
    ]],
    related: [
      { href: "/guides/build-a-website-without-code", label: t("How to publish the page", "איך מפרסמים את העמוד", "Cómo publicar la página", "Como publicar a página", "كيف تنشرون الصفحة") },
      { href: "/guides/website-form-to-crm", label: t("The form", "הטופס", "El formulario", "O formulário", "النموذج") },
    ],
    sources: [{ href: "/pricing", label: t("Bizuply pricing", "מחירון ביזאפלי", "Precios de Bizuply", "Preços da Bizuply", "أسعار Bizuply") }],
  }),
  article({
    slug: "improve-lead-conversion",
    cluster: "crm",
    intent: t("Someone who wants a higher conversion rate and is about to copy a benchmark.", "מישהו שרוצה אחוז המרה גבוה יותר ועומד להעתיק מדד.", "Alguien que quiere una tasa de conversión más alta y va a copiar un referente.", "Alguém que quer uma taxa de conversão mais alta e vai copiar um referencial.", "شخص يريد نسبة تحويل أعلى وسينسخ معياراً."),
    adds: t(
      "The calculators divide two numbers. This draft says which two numbers, and which operating changes the file can actually support. It does not quote an industry rate.",
      "המחשבונים מחלקים שני מספרים. הטיוטה הזו אומרת אילו שני מספרים, ואילו שינויים בעבודה התיק באמת יכול לתמוך בהם. היא לא מצטטת שיעור ענפי.",
      "Las calculadoras dividen dos números. Este borrador dice cuáles dos números, y qué cambios de trabajo el expediente puede sostener de verdad. No cita una tasa del sector.",
      "As calculadoras dividem dois números. Este rascunho diz quais dois números, e quais mudanças de trabalho o arquivo consegue sustentar de verdade. Ele não cita uma taxa do setor.",
      "الآلات الحاسبة تقسم رقمين. تقول هذه المسودة أي رقمين، وأي تغييرات عمل يستطيع الملف دعمها فعلاً. لا تقتبس نسبة قطاع.",
    ),
    title: t("How to improve a lead conversion rate | BizUply", "איך משפרים אחוז המרה של לידים | ביזאפלי", "Cómo mejorar una tasa de conversión de leads | BizUply", "Como melhorar uma taxa de conversão de leads | BizUply", "كيف تحسّنون نسبة تحويل العملاء | BizUply"),
    description: t(
      "Name the action and the group before you trust the percent. Then fix owner, next step, and the form. A borrowed benchmark is not your rate.",
      "נותנים שם לפעולה ולקבוצה לפני שסומכים על האחוז. אחר כך מתקנים אחראי, צעד הבא, והטופס. מדד שהושאל אינו השיעור שלכם.",
      "Nombre la acción y el grupo antes de fiarse del porcentaje. Luego arregle el dueño, el siguiente paso y el formulario. Un referente prestado no es su tasa.",
      "Nomeie a ação e o grupo antes de confiar na porcentagem. Depois conserte o dono, o próximo passo e o formulário. Um referencial emprestado não é a sua taxa.",
      "سمّوا الإجراء والمجموعة قبل الاعتماد على النسبة. ثم أصلحوا المالك والخطوة التالية والنموذج. المعيار المستعار ليس نسبتكم.",
    ),
    h1: t("How to improve a lead conversion rate", "איך משפרים אחוז המרה של לידים", "Cómo mejorar una tasa de conversión de leads", "Como melhorar uma taxa de conversão de leads", "كيف تحسّنون نسبة تحويل العملاء"),
    lede: t(
      "Conversion rate is conversions divided by opportunities, times 100. If you have not named both, the percent is not a result. It is a slogan.",
      "אחוז המרה הוא המרות חלקי הזדמנויות, כפול 100. אם לא נתתם שם לשניהם, האחוז אינו תוצאה. הוא סיסמה.",
      "La tasa de conversión es conversiones divididas por oportunidades, por 100. Si no ha nombrado las dos, el porcentaje no es un resultado. Es un eslogan.",
      "A taxa de conversão é conversões divididas por oportunidades, vezes 100. Se você não nomeou as duas, a porcentagem não é um resultado. É um slogan.",
      "نسبة التحويل هي التحويلات مقسومة على الفرص، ضرب 100. إذا لم تسمّوا الاثنين، فالنسبة ليست نتيجة. هي شعار.",
    ),
    sections: [
      {
        id: "define",
        heading: t("Name the fraction", "נותנים שם לשבר", "Nombre la fracción", "Nomeie a fração", "سمّوا الكسر"),
        steps: [
          t("Write the action that counts as converted: a paid booking, a signed job, or a first visit. Converted in the CRM should mean that same action.", "כותבים את הפעולה שנחשבת הומר: תור ששולם, עבודה שנחתמה, או ביקור ראשון. הומר ב־CRM צריך להיות אותה פעולה.", "Escriba la acción que cuenta como convertido: una reserva pagada, un trabajo firmado o una primera visita. Convertido en el CRM debe ser esa misma acción.", "Escreva a ação que conta como convertido: uma reserva paga, um trabalho assinado ou uma primeira visita. Convertido no CRM deve ser essa mesma ação.", "اكتبوا الإجراء الذي يُعد تم التحويل: حجز مدفوع، أو عمل موقَّع، أو زيارة أولى. تم التحويل في CRM يجب أن يكون الإجراء نفسه."),
          t("Write the group: leads that arrived this month from a named source, not every name you have ever stored.", "כותבים את הקבוצה: לידים שהגיעו החודש ממקור עם שם, לא כל שם שאי פעם שמרתם.", "Escriba el grupo: leads que llegaron este mes de un origen con nombre, no cada nombre que haya guardado.", "Escreva o grupo: leads que chegaram este mês de uma origem nomeada, não cada nome que você já guardou.", "اكتبوا المجموعة: العملاء الذين وصلوا هذا الشهر من مصدر مسمّى، لا كل اسم خزّنتموه يوماً."),
          t("Use the calculator on the templates page. If the number of opportunities is zero, it will not invent a percent.", "משתמשים במחשבון בעמוד התבניות. אם מספר ההזדמנויות הוא אפס, הוא לא ימציא אחוז.", "Use la calculadora en la página de plantillas. Si el número de oportunidades es cero, no inventará un porcentaje.", "Use a calculadora na página de modelos. Se o número de oportunidades for zero, ela não inventa uma porcentagem.", "استخدموا الحاسبة في صفحة القوالب. إذا كان عدد الفرص صفراً، فلن تخترع نسبة."),
        ],
      },
      {
        id: "levers",
        heading: t("Changes the file can support", "שינויים שהתיק יכול לתמוך בהם", "Cambios que el expediente puede sostener", "Mudanças que o arquivo consegue sustentar", "تغييرات يستطيع الملف دعمها"),
        paragraphs: [t(
          "Give New a named owner. Require a dated task before the row is left. Do not mark Contacted until someone was reached. Ask the form for what the person wants in one line, so the first contact is about that, not about a missing field. Keep the source, so you can see which door converts, not a blended number that hides a bad ad. None of these is a promise of a higher percent. They are the conditions under which the percent means something.",
          "נותנים לחדש אחראי עם שם. דורשים משימה עם תאריך לפני שעוזבים את השורה. לא מסמנים נוצר קשר עד שהגעתם אל מישהו. מבקשים בטופס מה האדם רוצה בשורה אחת, כדי שהמגע הראשון יהיה על זה, לא על שדה חסר. שומרים את המקור, כדי לראות איזו דלת ממירה, לא מספר מעורבב שמסתיר מודעה גרועה. אף אחד מאלה אינו הבטחה לאחוז גבוה יותר. אלה התנאים שבהם לאחוז יש משמעות.",
          "Dé a Nuevo un dueño con nombre. Exija una tarea con fecha antes de dejar la fila. No marque Contactado hasta que se llegó a alguien. Pida en el formulario qué quiere la persona en una línea, para que el primer contacto trate de eso, no de un campo que falta. Conserve el origen, para ver qué puerta convierte, no un número mezclado que esconde un mal anuncio. Nada de esto promete un porcentaje más alto. Son las condiciones en las que el porcentaje significa algo.",
          "Dê a Novo um dono com nome. Exija uma tarefa com data antes de sair da linha. Não marque Contato feito até alguém ser alcançado. Peça no formulário o que a pessoa quer numa linha, para o primeiro contato ser sobre isso, não sobre um campo que falta. Guarde a origem, para ver qual porta converte, não um número misturado que esconde um anúncio ruim. Nada disso promete uma porcentagem mais alta. São as condições em que a porcentagem significa algo.",
          "امنحوا جديداً مالكاً مسمّى. اشترطوا مهمة بتاريخ قبل مغادرة الصف. لا تضعوا تم التواصل حتى يُوصل إلى أحد. اطلبوا في النموذج ماذا يريد الشخص في سطر، ليكون الاتصال الأول عن ذلك، لا عن حقل ناقص. أبقوا المصدر، لتروا أي باب يحوّل، لا رقماً ممزوجاً يخفي إعلاناً سيئاً. لا شيء من هذا يعد بنسبة أعلى. هذه الشروط التي تعني فيها النسبة شيئاً.",
        )],
      },
    ],
    faq: [[
      t("What is a good conversion rate?", "מהו אחוז המרה טוב?", "¿Cuál es una buena tasa de conversión?", "Qual é uma boa taxa de conversão?", "ما هي نسبة تحويل جيدة؟"),
      t("The one you can compare with your own previous month, for the same action and the same source. A number from another industry is a different fraction.", "זה שאפשר להשוות לחודש הקודם שלכם, לאותה פעולה ולאותו מקור. מספר מענף אחר הוא שבר אחר.", "La que puede comparar con su propio mes anterior, para la misma acción y el mismo origen. Un número de otro sector es otra fracción.", "A que você consegue comparar com o seu próprio mês anterior, para a mesma ação e a mesma origem. Um número de outro setor é outra fração.", "تلك التي تستطيعون مقارنتها بشهركم السابق، للإجراء نفسه والمصدر نفسه. رقم من قطاع آخر كسر آخر."),
    ]],
    related: [
      { href: "/templates", label: t("Conversion calculator", "מחשבון המרה", "Calculadora de conversión", "Calculadora de conversão", "حاسبة التحويل") },
      { href: "/guides/follow-up-on-leads", label: t("The follow-up", "המעקב", "El seguimiento", "O acompanhamento", "المتابعة") },
      { href: "/guides/website-form-to-crm", label: t("The form", "הטופס", "El formulario", "O formulário", "النموذج") },
    ],
    sources: [{ href: "/templates", label: t("The calculator on this site", "המחשבון באתר הזה", "La calculadora en este sitio", "A calculadora neste site", "الحاسبة في هذا الموقع") }],
  }),
  article({
    slug: "choose-a-business-system",
    cluster: "crm",
    intent: t("Someone choosing a system for the whole business, not only a pipeline.", "מישהו שבוחר מערכת לכל העסק, לא רק לצינור.", "Alguien que elige un sistema para todo el negocio, no solo un pipeline.", "Alguém que escolhe um sistema para o negócio todo, não só um pipeline.", "شخص يختار نظاماً للنشاط كله، لا للمسار فقط."),
    adds: t(
      "The public comparison is CRM only versus the business plan. This draft is the buying list across CRM, appointments, automations, the website and WhatsApp, including when the split is a poor fit.",
      "ההשוואה הציבורית היא CRM בלבד מול החבילה העסקית. הטיוטה הזו היא רשימת הקנייה על פני CRM, תורים, אוטומציות, האתר ווואטסאפ, כולל מתי הפיצול הוא התאמה גרועה.",
      "La comparación pública es CRM solo frente al plan de negocio. Este borrador es la lista de compra entre CRM, citas, automatizaciones, el sitio y WhatsApp, incluido cuándo la separación encaja mal.",
      "A comparação pública é CRM sozinho contra o plano de negócios. Este rascunho é a lista de compra entre CRM, agenda, automações, o site e WhatsApp, inclusive quando a separação encaixa mal.",
      "المقارنة العامة هي CRM وحده مقابل الخطة التجارية. هذه المسودة قائمة الشراء عبر CRM والمواعيد والأتمتة والموقع وواتساب، بما فيه متى يكون الفصل ملاءمة سيئة.",
    ),
    title: t("How to choose a system to run the business | BizUply", "איך בוחרים מערכת לניהול העסק | ביזאפלי", "Cómo elegir un sistema para llevar el negocio | BizUply", "Como escolher um sistema para tocar o negócio | BizUply", "كيف تختارون نظاماً لإدارة النشاط | BizUply"),
    description: t(
      "List the jobs first. In Bizuply those jobs are separate prices: CRM, the business plan, the website, and WhatsApp. A single login that includes all of them is not what this pricing is.",
      "קודם רושמים את העבודות. בביזאפלי העבודות האלה הן מחירים נפרדים: CRM, החבילה העסקית, האתר, ווואטסאפ. התחברות אחת שכוללת את כולם אינה המחיר הזה.",
      "Primero liste los trabajos. En Bizuply esos trabajos son precios separados: CRM, el plan de negocio, el sitio y WhatsApp. Un solo acceso que los incluya todos no es este precio.",
      "Primeiro liste os trabalhos. Na Bizuply esses trabalhos são preços separados: CRM, o plano de negócios, o site e WhatsApp. Um único acesso que inclua todos não é este preço.",
      "أولاً اكتبوا الأعمال. في Bizuply هذه الأعمال أسعار منفصلة: CRM، والخطة التجارية، والموقع، وواتساب. دخول واحد يشملها جميعاً ليس هذا التسعير.",
    ),
    h1: t("How to choose a system to run the business", "איך בוחרים מערכת לניהול העסק", "Cómo elegir un sistema para llevar el negocio", "Como escolher um sistema para tocar o negócio", "كيف تختارون نظاماً لإدارة النشاط"),
    lede: t(
      "A business system is the set of jobs you refuse to keep in separate chats. The software should match that set, including the jobs it does not do.",
      "מערכת לניהול עסק היא קבוצת העבודות שאתם מסרבים להשאיר בצ'אטים נפרדים. התוכנה צריכה להתאים לקבוצה הזאת, כולל העבודות שהיא לא עושה.",
      "Un sistema para el negocio es el conjunto de trabajos que se niega a dejar en chats separados. El software debe coincidir con ese conjunto, incluidos los trabajos que no hace.",
      "Um sistema para o negócio é o conjunto de trabalhos que você se recusa a deixar em chats separados. O software deve combinar com esse conjunto, inclusive os trabalhos que não faz.",
      "نظام إدارة النشاط هو مجموعة الأعمال التي ترفضون تركها في دردشات منفصلة. يجب أن يطابق البرنامج هذه المجموعة، بما فيها الأعمال التي لا يؤديها.",
    ),
    sections: [
      {
        id: "jobs",
        heading: t("Match a job to a price", "מתאימים עבודה למחיר", "Haga coincidir un trabajo con un precio", "Combine um trabalho com um preço", "طابقوا عملاً مع سعر"),
        paragraphs: [t(
          "Pipeline and client file: CRM only, $49 a month. Appointments, collaborations and automations: the business plan, $99 a month or $990 a year, which includes the CRM. A public site: its own price on the pricing page. A connected WhatsApp number: $29 a month, plus Meta's message charges, with no free trial. Meta ad spend is billed by Meta. If your list of jobs is only one of these, do not buy the others because a bundle sounds complete.",
          "צינור ותיק לקוח: CRM בלבד, 49 דולר לחודש. תורים, שיתופים ואוטומציות: החבילה העסקית, 99 לחודש או 990 לשנה, שכוללת את ה־CRM. אתר ציבורי: מחיר משלו בעמוד המחירים. מספר וואטסאפ מחובר: 29 דולר לחודש, ועוד חיובי ההודעות של Meta, בלי ניסיון חינם. הוצאת מודעות של Meta מחויבת על ידי Meta. אם רשימת העבודות שלכם היא רק אחת מאלה, אל תקנו את האחרות כי חבילה נשמעת שלמה.",
          "Pipeline y expediente: CRM solo, 49 dólares al mes. Citas, colaboraciones y automatizaciones: el plan de negocio, 99 al mes o 990 al año, que incluye el CRM. Un sitio público: su propio precio en la página de precios. Un número de WhatsApp conectado: 29 dólares al mes, más los cargos de mensaje de Meta, sin prueba gratis. El gasto en anuncios de Meta lo cobra Meta. Si su lista de trabajos es solo uno de estos, no compre los otros porque un paquete suena completo.",
          "Pipeline e arquivo: CRM sozinho, US$ 49 por mês. Agenda, colaborações e automações: o plano de negócios, US$ 99 por mês ou US$ 990 por ano, que inclui o CRM. Um site público: o próprio preço na página de preços. Um número de WhatsApp conectado: US$ 29 por mês, mais as cobranças de mensagem da Meta, sem teste grátis. O gasto em anúncios da Meta é cobrado pela Meta. Se a sua lista de trabalhos é só um destes, não compre os outros porque um pacote parece completo.",
          "المسار وملف العميل: CRM وحده، 49 دولاراً في الشهر. المواعيد والتعاون والأتمتة: الخطة التجارية، 99 في الشهر أو 990 في السنة، وتشمل CRM. موقع عام: سعره في صفحة الأسعار. رقم واتساب متصل: 29 دولاراً في الشهر، إضافة إلى رسوم رسائل Meta، بلا تجربة مجانية. إنفاق إعلانات Meta تحصّله Meta. إذا كانت قائمة أعمالكم واحدة فقط من هذه، لا تشتروا الأخريات لأن الحزمة تبدو كاملة.",
        )],
      },
      {
        id: "poor",
        heading: t("When this split is a poor fit", "מתי הפיצול הזה הוא התאמה גרועה", "Cuándo esta separación encaja mal", "Quando esta separação encaixa mal", "متى يكون هذا الفصل ملاءمة سيئة"),
        paragraphs: [t(
          "If you need one contract that includes ads management, a shared inbox for many client WhatsApp numbers, and accounting, this pricing is the wrong shape. Bizuply does not offer an agency screen for many client accounts, and it does not include Meta's media bill. If you need the record, the calendar and a site form in one place, the split matches the work, and you can leave WhatsApp until a template is actually required.",
          "אם צריך חוזה אחד שכולל ניהול מודעות, תיבת דואר משותפת למספרי וואטסאפ רבים של לקוחות, והנהלת חשבונות, לצורה של המחיר הזה אין התאמה. ביזאפלי לא מציעה מסך סוכנות לחשבונות לקוח רבים, והיא לא כוללת את חשבון המדיה של Meta. אם צריך את הרשומה, את היומן וטופס באתר במקום אחד, הפיצול מתאים לעבודה, ואפשר להשאיר את הוואטסאפ עד שבאמת צריך תבנית.",
          "Si necesita un contrato que incluya gestión de anuncios, una bandeja compartida para muchos números de WhatsApp de clientes y contabilidad, esta forma de precio no encaja. Bizuply no ofrece una pantalla de agencia para muchas cuentas de clientes, y no incluye la factura de medios de Meta. Si necesita el registro, el calendario y un formulario del sitio en un lugar, la separación coincide con el trabajo, y puede dejar WhatsApp hasta que una plantilla sea de verdad necesaria.",
          "Se você precisa de um contrato que inclua gestão de anúncios, uma caixa compartilhada para muitos números de WhatsApp de clientes e contabilidade, esta forma de preço não encaixa. A Bizuply não oferece uma tela de agência para muitas contas de clientes, e não inclui a fatura de mídia da Meta. Se você precisa do registro, do calendário e de um formulário do site num lugar, a separação combina com o trabalho, e pode deixar o WhatsApp até um modelo ser de fato necessário.",
          "إذا احتجتم عقداً واحداً يشمل إدارة الإعلانات وصندوقاً مشتركاً لأرقام واتساب كثيرة للعملاء والمحاسبة، فشكل هذا السعر غير مناسب. لا تقدّم Bizuply شاشة وكالة لحسابات عملاء كثيرة، ولا تشمل فاتورة وسائط Meta. إذا احتجتم السجل والتقويم ونموذج الموقع في مكان واحد، فالفصل يطابق العمل، ويمكن ترك واتساب حتى يُحتاج قالب فعلاً.",
        )],
      },
    ],
    faq: [[
      t("Should I start with everything?", "כדאי להתחיל עם הכול?", "¿Debo empezar con todo?", "Devo começar com tudo?", "هل أبدأ بكل شيء؟"),
      t("Start with the job that is already failing. If two people disagree about a customer, start with the CRM. If the calendar is the failure, you need the business plan, not another chat app.", "מתחילים בעבודה שכבר נכשלת. אם שני אנשים חלוקים על לקוח, מתחילים ב־CRM. אם היומן הוא הכישלון, צריך את החבילה העסקית, לא עוד אפליקציית צ'אט.", "Empiece por el trabajo que ya falla. Si dos personas discrepan sobre un cliente, empiece por el CRM. Si el calendario es el fallo, necesita el plan de negocio, no otra app de chat.", "Comece pelo trabalho que já falha. Se duas pessoas discordam sobre um cliente, comece pelo CRM. Se o calendário é a falha, você precisa do plano de negócios, não de outro app de chat.", "ابدأوا بالعمل الذي يفشل أصلاً. إذا اختلف شخصان على عميل، ابدأوا بـ CRM. إذا كان التقويم هو الفشل، فأنتم بحاجة إلى الخطة التجارية، لا إلى تطبيق دردشة آخر."),
    ]],
    related: [
      { href: "/guides/crm-and-business-platform", label: t("CRM only and the business plan", "CRM בלבד והחבילה העסקית", "CRM solo y el plan de negocio", "CRM sozinho e o plano de negócios", "CRM وحده والخطة التجارية") },
      pricing,
      { href: "/platform", label: t("The platform", "הפלטפורמה", "La plataforma", "A plataforma", "المنصة") },
    ],
    sources: [{ href: "/pricing", label: t("Bizuply pricing", "מחירון ביזאפלי", "Precios de Bizuply", "Preços da Bizuply", "أسعار Bizuply") }],
  }),
];

const HERO = {
  crm: "/demo-media/home/screens/en-desktop-crm-list.webp",
  whatsapp: "/demo-media/home/screens/en-desktop-whatsapp.webp",
  automations: "/demo-media/home/screens/en-desktop-automation.webp",
  websites: "/demo-media/websites/still-8.jpg",
};

const CATEGORY = {
  crm: "CRM",
  whatsapp: "WhatsApp",
  automations: "Automations",
  websites: "Websites",
};

const SOURCE_HEADING = {
  en: "Sources",
  he: "מקורות",
  es: "Fuentes",
  "pt-BR": "Fontes",
  ar: "المصادر",
};

function clip(value, max) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Records shaped for the knowledge store. Every row stays an unapproved draft. */
export function cmsDraftRecords() {
  const records = [];
  for (const draft of KNOWLEDGE_DRAFTS) {
    for (const locale of LOCALES) {
      const page = draft.locales[locale];
      const sections = page.sections.map((section) => {
        const paragraphs = [...(section.paragraphs || [])];
        (section.steps || []).forEach((step, index) => paragraphs.push(`${index + 1}. ${step}`));
        return {
          heading: clip(section.heading, 200),
          paragraphs: paragraphs.map((paragraph) => clip(paragraph, 8000)).filter(Boolean),
        };
      });
      const sourceLines = (draft.sources || []).map(
        (source) => `${clip(pick(source.label, locale), 240)} — ${source.href}`,
      );
      if (sourceLines.length) sections.push({ heading: SOURCE_HEADING[locale], paragraphs: sourceLines });
      const relatedPaths = [...new Set(
        (page.related || [])
          .map((item) => item.href)
          .filter((href) => href.startsWith("/") && !href.startsWith("//") && !href.includes("://")),
      )];
      records.push({
        slug: draft.slug,
        locale,
        translationGroup: draft.slug,
        status: "draft",
        editorialApproved: false,
        aiAssisted: true,
        title: clip(page.title, 180),
        description: clip(page.description, 300),
        h1: clip(page.h1, 180),
        lede: clip(page.lede, 600),
        category: CATEGORY[draft.cluster] || "Guides",
        tags: [draft.cluster, "fact-check"],
        heroImage: HERO[draft.cluster] || "",
        relatedPaths,
        sections,
        faq: page.faq.map(([question, answer]) => [clip(question, 300), clip(answer, 8000)]),
        updated: draft.updated,
      });
    }
  }
  return records;
}

export const DRAFT_SLUGS = KNOWLEDGE_DRAFTS.map((item) => item.slug);

export function draftBySlug(slug) {
  return KNOWLEDGE_DRAFTS.find((item) => item.slug === slug) || null;
}
