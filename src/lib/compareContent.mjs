/**
 * Objective comparisons. Bizuply is one option with published facts,
 * not the conclusion of the page. Meta rates are not copied here.
 */

const UPDATED = "2026-11-15";

function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function loc(pack, locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  return pack[language];
}

const CRM_SHEET = {
  slug: "crm-or-spreadsheet",
  path: "/compare/crm-or-spreadsheet",
  title: row(
    "CRM or a spreadsheet for a small business | BizUply",
    "CRM או גיליון לעסק קטן | ביזאפלי",
    "CRM o una hoja de cálculo para un negocio pequeño | BizUply",
    "CRM ou uma planilha para um pequeno negócio | BizUply",
    "CRM أو جدول لنشاط صغير | BizUply",
  ),
  description: row(
    "When a spreadsheet is enough for leads, and when a shared lead list is worth the move. Each side is named for what it is good at.",
    "מתי גיליון מספיק ללידים, ומתי רשימת לידים משותפת שווה את המעבר. כל צד מתואר לפי מה שהוא עושה היטב.",
    "Cuándo basta una hoja para los leads y cuándo merece la pena un seguimiento compartido. Cada lado se describe por lo que hace bien.",
    "Quando uma planilha basta para os leads e quando um acompanhamento compartilhado vale a pena. Cada lado é descrito pelo que faz bem.",
    "متى يكفي جدول للعملاء المحتملين ومتى تستحق قائمة عملاء مشتركة الانتقال. يُوصف كل جانب بما يجيده.",
  ),
  crumb: row("CRM or a spreadsheet", "CRM או גיליון", "CRM o una hoja", "CRM ou planilha", "CRM أو جدول"),
  h1: row(
    "A CRM or a spreadsheet: which should hold the leads?",
    "CRM או גיליון: איפה הלידים צריכים לשבת?",
    "¿Un CRM o una hoja de cálculo para los leads?",
    "CRM ou planilha: onde os leads devem ficar?",
    "CRM أو جدول: أين يجب أن تبقى العملاء المحتملون؟",
  ),
  lede: row(
    "A spreadsheet is a serious tool. Many businesses should stay on one. A CRM earns its place when more than one person has to know what happened, and the next step has to survive the day.",
    "גיליון הוא כלי רציני. עסקים רבים צריכים להישאר עליו. CRM מצדיק את מקומו כשיותר מאדם אחד צריך לדעת מה קרה, והצעד הבא צריך לשרוד את היום.",
    "Una hoja es una herramienta seria. Muchos negocios deben quedarse en ella. Un CRM se justifica cuando más de una persona tiene que saber qué pasó y el siguiente paso tiene que sobrevivir al día.",
    "Uma planilha é uma ferramenta séria. Muitos negócios devem continuar nela. Um CRM se justifica quando mais de uma pessoa precisa saber o que aconteceu e o próximo passo precisa sobreviver ao dia.",
    "الجدول أداة جدية. كثير من الأنشطة يجب أن تبقى عليه. يستحق CRM مكانه حين يحتاج أكثر من شخص أن يعرف ما حدث، ويجب أن تعبر الخطوة التالية اليوم.",
  ),
  sections: [
    {
      id: "spreadsheet",
      heading: row("What a spreadsheet already does well", "מה גיליון כבר עושה היטב", "Lo que una hoja ya hace bien", "O que uma planilha já faz bem", "ما يفعله الجدول جيداً"),
      paragraphs: [
        row(
          "Excel, Google Sheets and similar files are enough when one person owns the list, the volume is small, and the columns are stable. You can sort, filter, and share a link. A file is also a good place to design the columns before you pay for software.",
          "Excel, Google Sheets וקבצים דומים מספיקים כשאדם אחד אחראי על הרשימה, הכמות קטנה, והעמודות יציבות. אפשר למיין, לסנן ולשתף קישור. קובץ הוא גם מקום טוב לתכנן את העמודות לפני שמשלמים על תוכנה.",
          "Excel, Google Sheets y archivos parecidos bastan cuando una persona es dueña de la lista, el volumen es bajo y las columnas son estables. Puede ordenar, filtrar y compartir un enlace. Un archivo también sirve para diseñar las columnas antes de pagar un software.",
          "Excel, Google Sheets e arquivos parecidos bastam quando uma pessoa é dona da lista, o volume é baixo e as colunas são estáveis. Dá para ordenar, filtrar e compartilhar um link. Um arquivo também serve para desenhar as colunas antes de pagar um software.",
          "يكفي Excel وGoogle Sheets والملفات المشابهة حين يملك شخص واحد القائمة، والحجم صغير، والأعمدة ثابتة. يمكن الفرز والتصفية ومشاركة رابط. الملف أيضاً مكان جيد لتصميم الأعمدة قبل الدفع لبرنامج.",
        ),
      ],
    },
    {
      id: "breaks",
      heading: row("Where the file starts to fail", "איפה הקובץ מתחיל להיכשל", "Dónde el archivo empieza a fallar", "Onde o arquivo começa a falhar", "أين يبدأ الملف بالفشل"),
      paragraphs: [
        row(
          "The failure is usually not the grid. It is the missing event. Two people edit the same row. A status is typed three different ways. The next step is a cell with no date, so nothing reminds anyone. A lead from an ad is pasted in, and the source is lost. The file still opens. The work does not.",
          "הכישלון בדרך כלל אינו הטבלה. זה האירוע החסר. שני אנשים עורכים אותה שורה. סטטוס נכתב בשלוש צורות. הצעד הבא הוא תא בלי תאריך, אז שום דבר לא מזכיר לאף אחד. ליד ממודעה מודבק פנימה, והמקור אובד. הקובץ עדיין נפתח. העבודה לא.",
          "El fallo no suele ser la cuadrícula. Es el hecho que falta. Dos personas editan la misma fila. Un estado se escribe de tres formas. El siguiente paso es una celda sin fecha, así que nadie recibe un aviso. Un lead de un anuncio se pega y se pierde el origen. El archivo abre. El trabajo no.",
          "A falha em geral não é a grade. É o fato que falta. Duas pessoas editam a mesma linha. Um status é escrito de três jeitos. O próximo passo é uma célula sem data, então ninguém é lembrado. Um lead de um anúncio é colado e a origem se perde. O arquivo abre. O trabalho não.",
          "الفشل عادة ليس الشبكة. هو الحدث الناقص. شخصان يعدّلان الصف نفسه. تُكتب الحالة بثلاث صيغ. الخطوة التالية خلية بلا تاريخ، فلا أحد يُذكَّر. يُلصق عميل من إعلان ويضيع المصدر. الملف يُفتح. العمل لا.",
        ),
      ],
      mistakes: [
        {
          problem: row("\"Hot\" in one row and \"interested\" in the next.", "\"חם\" בשורה אחת ו\"מעוניין\" בשורה הבאה.", "\"Caliente\" en una fila e \"interesado\" en la siguiente.", "\"Quente\" numa linha e \"interessado\" na seguinte.", "«ساخن» في صف و«مهتم» في الذي يليه."),
          fix: row("Agree on a short list of statuses and stop inventing new ones in the cell.", "מסכימים על רשימת סטטוסים קצרה ומפסיקים להמציא חדשים בתא.", "Acuerde una lista corta de estados y deje de inventar otros en la celda.", "Combine uma lista curta de status e pare de inventar outros na célula.", "اتفقوا على قائمة حالات قصيرة وتوقفوا عن اختراع غيرها في الخلية."),
        },
        {
          problem: row("The follow-up date is \"this week\".", "תאריך המעקב הוא \"השבוע\".", "La fecha de seguimiento es \"esta semana\".", "A data do acompanhamento é \"esta semana\".", "تاريخ المتابعة هو «هذا الأسبوع»."),
          fix: row("Put a calendar date on the next step, or accept that it will be forgotten.", "שמים תאריך לוח על הצעד הבא, או מקבלים שהוא יישכח.", "Ponga una fecha de calendario en el siguiente paso, o acepte que se olvidará.", "Coloque uma data de calendário no próximo passo, ou aceite que será esquecido.", "ضعوا تاريخاً من التقويم على الخطوة التالية، أو اقبلوا أنها ستُنسى."),
        },
      ],
    },
    {
      id: "crm",
      heading: row("What changes when the record is a CRM", "מה משתנה כשהרשומה היא CRM", "Qué cambia cuando el registro es un CRM", "O que muda quando o registro é um CRM", "ما الذي يتغير حين يكون السجل CRM"),
      paragraphs: [
        row(
          "A CRM keeps one record per person, a status from a fixed list, a timeline of what changed, and a task with a date. Several people can work without copying the file. Leads from an ad form and from the website can arrive with a source, instead of being pasted.",
          "CRM שומר רשומה אחת לאדם, סטטוס מרשימה קבועה, ציר זמן של מה שהשתנה, ומשימה עם תאריך. כמה אנשים יכולים לעבוד בלי להעתיק את הקובץ. לידים מטופס מודעה ומהאתר יכולים להגיע עם מקור, במקום להיות מודבקים.",
          "Un CRM guarda un registro por persona, un estado de una lista fija, una línea de tiempo de lo que cambió y una tarea con fecha. Varias personas pueden trabajar sin copiar el archivo. Los leads de un formulario de anuncio y del sitio pueden llegar con origen, en lugar de pegarse.",
          "Um CRM guarda um registro por pessoa, um status de uma lista fixa, uma linha do tempo do que mudou e uma tarefa com data. Várias pessoas podem trabalhar sem copiar o arquivo. Leads de um formulário de anúncio e do site podem chegar com origem, em vez de serem colados.",
          "يحتفظ CRM بسجل واحد لكل شخص، وحالة من قائمة ثابتة، وخط زمني لما تغيّر، ومهمة بتاريخ. يمكن لعدة أشخاص أن يعملوا دون نسخ الملف. يمكن أن يصل عملاء من نموذج إعلان ومن الموقع مع مصدر، بدلاً من اللصق.",
        ),
        row(
          "That structure has a cost. Someone has to keep the statuses honest. Software does not make a team follow up. It makes a missed follow-up visible.",
          "למבנה הזה יש מחיר. מישהו צריך לשמור על סטטוסים כנים. תוכנה לא גורמת לצוות לעשות מעקב. היא הופכת מעקב שהוחמץ לגלוי.",
          "Esa estructura tiene un coste. Alguien tiene que mantener honestos los estados. El software no hace que el equipo haga seguimiento. Hace visible un seguimiento perdido.",
          "Essa estrutura tem um custo. Alguém precisa manter os status honestos. O software não faz a equipe acompanhar. Ele torna visível um acompanhamento perdido.",
          "لهذا الهيكل تكلفة. يجب أن يُبقي أحد الحالات صادقة. البرنامج لا يجعل الفريق يتابع. يجعل المتابعة الفائتة مرئية.",
        ),
      ],
    },
    {
      id: "choose",
      heading: row("A practical way to choose", "דרך מעשית לבחור", "Una forma práctica de elegir", "Um jeito prático de escolher", "طريقة عملية للاختيار"),
      paragraphs: [
        row(
          "Stay on the spreadsheet if one person can still name every open lead, and a missed day does not lose the sale. Move when a second person asks \"did anyone call them?\", when leads arrive from more than one place, or when the next step is regularly late.",
          "נשארים על הגיליון אם אדם אחד עדיין יכול לנקוב בכל ליד פתוח, ויום שהוחמץ לא מאבד את המכירה. עוברים כשאדם שני שואל \"מישהו התקשר אליהם?\", כשלידים מגיעים מיותר ממקום אחד, או כשהצעד הבא מאחר באופן קבוע.",
          "Quédese en la hoja si una persona todavía puede nombrar cada lead abierto y un día perdido no pierde la venta. Cámbiese cuando una segunda persona pregunte \"¿alguien les llamó?\", cuando los leads lleguen de más de un sitio o cuando el siguiente paso llegue tarde con regularidad.",
          "Fique na planilha se uma pessoa ainda consegue nomear cada lead aberto e um dia perdido não perde a venda. Mude quando uma segunda pessoa perguntar \"alguém ligou?\", quando os leads chegarem de mais de um lugar ou quando o próximo passo atrasar com frequência.",
          "ابقوا على الجدول إذا كان شخص واحد ما زال يستطيع تسمية كل عميل محتمل مفتوح، ويوم فائت لا يخسر البيع. انتقلوا حين يسأل شخص ثانٍ «هل اتصل أحد؟»، أو حين يصل العملاء من أكثر من مكان، أو حين تتأخر الخطوة التالية بانتظام.",
        ),
      ],
      steps: [
        row("Count open leads that have no dated next step.", "סופרים לידים פתוחים בלי צעד הבא עם תאריך.", "Cuente los leads abiertos sin un siguiente paso con fecha.", "Conte os leads abertos sem um próximo passo com data.", "عدّوا العملاء المحتملين المفتوحين بلا خطوة تالية بتاريخ."),
        row("Ask who else touches the same person.", "שואלים מי עוד נוגע באותו אדם.", "Pregunte quién más toca a la misma persona.", "Pergunte quem mais mexe com a mesma pessoa.", "اسألوا من غيركم يلمس الشخص نفسه."),
        row("List the doors a lead can enter: ad, site, phone, WhatsApp.", "רושמים את הדלתות שמהן ליד יכול להיכנס: מודעה, אתר, טלפון, וואטסאפ.", "Anote las puertas por las que puede entrar un lead: anuncio, sitio, teléfono, WhatsApp.", "Liste as portas por onde um lead pode entrar: anúncio, site, telefone, WhatsApp.", "اكتبوا الأبواب التي يدخل منها عميل محتمل: إعلان، موقع، هاتف، واتساب."),
        row("If the file still answers those three, keep it.", "אם הקובץ עדיין עונה על שלושת אלה, נשארים איתו.", "Si el archivo todavía responde a esas tres, consérvelo.", "Se o arquivo ainda responde a essas três, fique com ele.", "إذا كان الملف ما زال يجيب عن هذه الثلاثة، أبقوه."),
      ],
    },
    {
      id: "bizuply",
      heading: row("Where Bizuply fits, and where it does not", "איפה ביזאפלי מתאימה, ואיפה לא", "Dónde encaja Bizuply y dónde no", "Onde a Bizuply cabe e onde não cabe", "أين تناسب Bizuply وأين لا"),
      paragraphs: [
        row(
          "Bizuply CRM only is $49 a month. A lead has one of six statuses: New, Contacted, Interested, Converted, Lost or Old lead. Automated sources today are Meta Lead Ads, Google Ads lead forms, and a form on a site built in Bizuply. The business plan, at $99 a month or $990 a year, adds appointments, collaborations and automations.",
          "CRM בלבד של ביזאפלי עולה 49 דולר לחודש. לליד יש אחד משישה סטטוסים: חדש, נוצר קשר, מעוניין, הומר, אבוד או ליד ישן. המקורות האוטומטיים היום הם Meta Lead Ads, טפסי Google Ads, וטופס באתר שנבנה בביזאפלי. החבילה העסקית, ב־99 דולר לחודש או 990 לשנה, מוסיפה תורים, שיתופים ואוטומציות.",
          "El CRM solo de Bizuply cuesta 49 dólares al mes. Un lead tiene uno de seis estados: Nuevo, Contactado, Interesado, Convertido, Perdido o Lead antiguo. Las fuentes automáticas de hoy son Meta Lead Ads, formularios de Google Ads y un formulario en un sitio hecho en Bizuply. El plan de negocio, a 99 dólares al mes o 990 al año, añade citas, colaboraciones y automatizaciones.",
          "O CRM sozinho da Bizuply custa US$ 49 por mês. Um lead tem um de seis status: Novo, Contato feito, Interessado, Convertido, Perdido ou Lead antigo. As origens automáticas de hoje são Meta Lead Ads, formulários do Google Ads e um formulário num site feito na Bizuply. O plano de negócios, a US$ 99 por mês ou US$ 990 por ano, acrescenta agenda, colaborações e automações.",
          "CRM وحده من Bizuply يكلف 49 دولاراً في الشهر. للعميل المحتمل واحدة من ست حالات: جديد، وتم التواصل، ومهتم، وتم التحويل، وضائع، أو عميل قديم. المصادر الآلية اليوم هي إعلانات العملاء في Meta ونماذج Google Ads ونموذج في موقع بُني في Bizuply. الخطة التجارية، بـ 99 دولاراً في الشهر أو 990 في السنة، تضيف المواعيد والتعاون والأتمتة.",
        ),
        row(
          "Stay on a spreadsheet if you do not need those doors, or if you want a general-purpose grid for budgets and inventory. Bizuply is not an accounting workbook and it does not replace Excel for analysis. WhatsApp is a separate subscription at $29 a month per connected number, plus Meta's own message charges.",
          "נשארים על גיליון אם לא צריך את הדלתות האלה, או אם רוצים טבלה כללית לתקציבים ולמלאי. ביזאפלי אינה חוברת חשבונות והיא לא מחליפה את Excel לניתוח. וואטסאפ הוא מנוי נפרד של 29 דולר לחודש למספר מחובר, ובנוסף חיובי ההודעות של Meta.",
          "Quédese en una hoja si no necesita esas puertas, o si quiere una cuadrícula de uso general para presupuestos e inventario. Bizuply no es un libro de contabilidad y no sustituye a Excel para el análisis. WhatsApp es una suscripción aparte de 29 dólares al mes por número conectado, más los cargos de mensajes de Meta.",
          "Fique numa planilha se você não precisa dessas portas, ou se quer uma grade de uso geral para orçamentos e estoque. A Bizuply não é uma pasta de contabilidade e não substitui o Excel para análise. O WhatsApp é uma assinatura à parte de US$ 29 por mês por número conectado, mais as cobranças de mensagem da Meta.",
          "ابقوا على جدول إذا لم تحتاجوا إلى هذه الأبواب، أو إذا أردتم شبكة عامة للميزانيات والمخزون. Bizuply ليست دفتر محاسبة ولا تستبدل Excel للتحليل. واتساب اشتراك منفصل بـ 29 دولاراً في الشهر لكل رقم متصل، إضافة إلى رسوم رسائل Meta.",
        ),
      ],
    },
  ],
  faq: [
    [
      row("Is Excel wrong?", "האם Excel שגוי?", "¿Excel está mal?", "O Excel está errado?", "هل Excel خطأ؟"),
      row("No. It is the wrong place only when the next step and the history no longer fit in a shared file.", "לא. הוא המקום הלא נכון רק כשהצעד הבא וההיסטוריה כבר לא נכנסים לקובץ משותף.", "No. Es el lugar equivocado solo cuando el siguiente paso y el historial ya no caben en un archivo compartido.", "Não. É o lugar errado só quando o próximo passo e o histórico já não cabem num arquivo compartilhado.", "لا. هو المكان الخطأ فقط حين لا تعود الخطوة التالية والتاريخ يتسعان في ملف مشترك."),
    ],
    [
      row("Does Bizuply import an old spreadsheet?", "האם ביזאפלי מייבאת גיליון ישן?", "¿Bizuply importa una hoja antigua?", "A Bizuply importa uma planilha antiga?", "هل تستورد Bizuply جدولاً قديماً؟"),
      row("This page does not claim a one-click import. Moving a list is a project: clean the columns, then enter or connect the records you still need.", "העמוד הזה לא טוען לייבוא בלחיצה. העברת רשימה היא פרויקט: מנקים את העמודות, ואז מזינים או מחברים את הרשומות שעדיין צריך.", "Esta página no afirma una importación de un clic. Mover una lista es un proyecto: limpie las columnas y luego introduzca o conecte los registros que aún necesita.", "Esta página não afirma uma importação de um clique. Mover uma lista é um projeto: limpe as colunas e depois insira ou conecte os registros que ainda precisa.", "هذه الصفحة لا تدّعي استيراداً بنقرة. نقل قائمة مشروع: نظّفوا الأعمدة، ثم أدخلوا أو اربطوا السجلات التي ما زلتم تحتاجونها."),
    ],
  ],
  related: [
    ["/guides/what-is-a-crm", row("What is a CRM?", "מהו CRM?", "Qué es un CRM", "O que é um CRM", "ما هو CRM؟")],
    ["/guides/crm-and-business-platform", row("CRM only or the business plan", "CRM בלבד או החבילה העסקית", "CRM solo o el plan de negocio", "CRM sozinho ou o plano de negócios", "CRM وحده أو الخطة التجارية")],
    ["/crm", row("The CRM product", "מוצר ה־CRM", "El producto CRM", "O produto CRM", "منتج CRM")],
    ["/pricing", row("Pricing", "מחירים", "Precios", "Preços", "الأسعار")],
  ],
};

const WA = {
  slug: "whatsapp-app-or-api",
  path: "/compare/whatsapp-app-or-api",
  title: row(
    "WhatsApp Business app or the WhatsApp Business Platform | BizUply",
    "אפליקציית WhatsApp Business או פלטפורמת WhatsApp | ביזאפלי",
    "App WhatsApp Business o la plataforma de WhatsApp | BizUply",
    "App WhatsApp Business ou a plataforma do WhatsApp | BizUply",
    "تطبيق WhatsApp Business أو منصة واتساب | BizUply",
  ),
  description: row(
    "The app is for a person messaging in WhatsApp. The platform is the API a system uses, with templates and Meta's per-message charges. How to tell which one you need.",
    "האפליקציה מיועדת לאדם שכותב בתוך וואטסאפ. הפלטפורמה היא ה־API שמערכת משתמשת בו, עם תבניות וחיובי Meta לפי הודעה. איך יודעים מה צריך.",
    "La app es para una persona que escribe en WhatsApp. La plataforma es la API que usa un sistema, con plantillas y los cargos por mensaje de Meta. Cómo saber cuál necesita.",
    "O app é para uma pessoa que escreve no WhatsApp. A plataforma é a API que um sistema usa, com modelos e as cobranças por mensagem da Meta. Como saber qual você precisa.",
    "التطبيق لشخص يراسل داخل واتساب. المنصة هي API يستخدمها نظام، مع قوالب ورسوم Meta لكل رسالة. كيف تعرفون أيهما تحتاجون.",
  ),
  crumb: row("WhatsApp app or platform", "אפליקציה או פלטפורמה", "App o plataforma", "App ou plataforma", "التطبيق أو المنصة"),
  h1: row(
    "WhatsApp Business app or the WhatsApp Business Platform?",
    "אפליקציית WhatsApp Business או פלטפורמת WhatsApp?",
    "¿La app de WhatsApp Business o la plataforma?",
    "App WhatsApp Business ou a plataforma do WhatsApp?",
    "تطبيق WhatsApp Business أم منصة واتساب؟",
  ),
  lede: row(
    "They share a name and they are not the same product. The app is how a person replies inside WhatsApp. The platform is how another system sends and receives through an API. Pick the one that matches who does the work.",
    "יש להן שם דומה והן לא אותו מוצר. האפליקציה היא הדרך שבה אדם עונה בתוך וואטסאפ. הפלטפורמה היא הדרך שבה מערכת אחרת שולחת ומקבלת דרך API. בוחרים את זו שמתאימה למי שעושה את העבודה.",
    "Comparten nombre y no son el mismo producto. La app es cómo una persona responde dentro de WhatsApp. La plataforma es cómo otro sistema envía y recibe por una API. Elija la que coincida con quién hace el trabajo.",
    "Elas compartilham o nome e não são o mesmo produto. O app é como uma pessoa responde dentro do WhatsApp. A plataforma é como outro sistema envia e recebe por uma API. Escolha a que combina com quem faz o trabalho.",
    "يشتركان في الاسم وليسا المنتج نفسه. التطبيق هو كيف يرد شخص داخل واتساب. المنصة هي كيف يرسل نظام آخر ويستقبل عبر API. اختاروا ما يطابق من يقوم بالعمل.",
  ),
  sections: [
    {
      id: "app",
      heading: row("The app", "האפליקציה", "La app", "O app", "التطبيق"),
      paragraphs: [
        row(
          "The WhatsApp Business app is the product Meta describes for a small business that wants to message customers, show a business profile and a catalog, and reply in the conversation. It is the right tool when the owner or a small team can live inside WhatsApp itself.",
          "אפליקציית WhatsApp Business היא המוצר ש־Meta מתארת לעסק קטן שרוצה לכתוב ללקוחות, להציג פרופיל עסקי וקטלוג, ולענות בתוך השיחה. זה הכלי הנכון כשהבעלים או צוות קטן יכולים לחיות בתוך וואטסאפ עצמו.",
          "La app WhatsApp Business es el producto que Meta describe para un negocio pequeño que quiere escribir a los clientes, mostrar un perfil y un catálogo y responder en la conversación. Es la herramienta correcta cuando el dueño o un equipo pequeño pueden vivir dentro del propio WhatsApp.",
          "O app WhatsApp Business é o produto que a Meta descreve para um pequeno negócio que quer escrever aos clientes, mostrar um perfil e um catálogo e responder na conversa. É a ferramenta certa quando o dono ou uma equipe pequena podem viver dentro do próprio WhatsApp.",
          "تطبيق WhatsApp Business هو المنتج الذي تصفه Meta لنشاط صغير يريد مراسلة العملاء، وعرض ملف تجاري وكتالوج، والرد داخل المحادثة. هو الأداة الصحيحة حين يستطيع المالك أو فريق صغير أن يعيش داخل واتساب نفسه.",
        ),
      ],
    },
    {
      id: "platform",
      heading: row("The platform", "הפלטפורמה", "La plataforma", "A plataforma", "المنصة"),
      paragraphs: [
        row(
          "The WhatsApp Business Platform, including the Cloud API, is how software sends and receives messages. A CRM, a form or an automation can start an action through the API. That is a different job from a person typing in the app.",
          "פלטפורמת WhatsApp Business, כולל Cloud API, היא הדרך שבה תוכנה שולחת ומקבלת הודעות. CRM, טופס או אוטומציה יכולים להתחיל פעולה דרך ה־API. זו עבודה שונה מאדם שמקליד באפליקציה.",
          "La plataforma de WhatsApp Business, incluida la Cloud API, es cómo el software envía y recibe mensajes. Un CRM, un formulario o una automatización pueden iniciar una acción por la API. Es un trabajo distinto de una persona que escribe en la app.",
          "A plataforma do WhatsApp Business, incluindo a Cloud API, é como o software envia e recebe mensagens. Um CRM, um formulário ou uma automação podem iniciar uma ação pela API. É um trabalho diferente de uma pessoa digitando no app.",
          "منصة WhatsApp Business، بما فيها Cloud API، هي كيف يرسل البرنامج الرسائل ويستقبلها. يمكن لـ CRM أو نموذج أو أتمتة أن يبدأ فعلاً عبر API. هذا عمل مختلف عن شخص يكتب في التطبيق.",
        ),
        row(
          "Meta's pricing page, updated 30 September 2026, says that from 1 July 2025 Meta charges per delivered message from the business to the user. The rate depends on the message category and on the country of the recipient's phone number. Messages from users to the business are not charged. Template messages can be delivered at any time and fall into marketing, utility or authentication. A non-template message can be sent only inside an open 24-hour customer-service window, which opens and resets when the user messages. The same page describes service messages and Meta Business Agent as further categories. Rates change. Read the current table on Meta's site before you budget. This page does not copy it.",
          "דף המחירים של Meta, שעודכן ב־30 בספטמבר 2026, אומר שמ־1 ביולי 2025 Meta מחייבת לפי הודעה שנמסרה מהעסק אל המשתמש. התעריף תלוי בקטגוריית ההודעה ובמדינה של מספר הטלפון של הנמען. הודעות מהמשתמש אל העסק אינן מחויבות. הודעות תבנית אפשר למסור בכל זמן, והן נכנסות לשיווק, תפעול או אימות. הודעה שאינה תבנית אפשר לשלוח רק בתוך חלון שירות לקוחות פתוח של 24 שעות, שנפתח ומתאפס כשהמשתמש כותב. אותו דף מתאר גם הודעות שירות ואת Meta Business Agent כקטגוריות נוספות. התעריפים משתנים. קוראים את הטבלה העדכנית באתר של Meta לפני שקובעים תקציב. העמוד הזה לא מעתיק אותה.",
          "La página de precios de Meta, actualizada el 30 de septiembre de 2026, dice que desde el 1 de julio de 2025 Meta cobra por mensaje entregado del negocio al usuario. La tarifa depende de la categoría del mensaje y del país del número del destinatario. Los mensajes del usuario al negocio no se cobran. Las plantillas pueden entregarse en cualquier momento y entran en marketing, utilidad o autenticación. Un mensaje que no es plantilla solo puede enviarse dentro de una ventana de atención de 24 horas, que se abre y se reinicia cuando el usuario escribe. La misma página describe los mensajes de servicio y Meta Business Agent como categorías adicionales. Las tarifas cambian. Lea la tabla actual en el sitio de Meta antes de presupuestar. Esta página no la copia.",
          "A página de preços da Meta, atualizada em 30 de setembro de 2026, diz que desde 1º de julho de 2025 a Meta cobra por mensagem entregue da empresa ao usuário. A tarifa depende da categoria da mensagem e do país do número do destinatário. Mensagens do usuário para a empresa não são cobradas. Modelos podem ser entregues a qualquer momento e entram em marketing, utilidade ou autenticação. Uma mensagem que não é modelo só pode ser enviada dentro de uma janela de atendimento de 24 horas, que abre e reinicia quando o usuário escreve. A mesma página descreve mensagens de serviço e o Meta Business Agent como categorias adicionais. As tarifas mudam. Leia a tabela atual no site da Meta antes de orçar. Esta página não a copia.",
          "تقول صفحة أسعار Meta، المحدّثة في 30 سبتمبر 2026، إنه منذ 1 يوليو 2025 تحصّل Meta رسماً عن كل رسالة مُسلَّمة من النشاط إلى المستخدم. يعتمد السعر على فئة الرسالة وعلى بلد رقم المستلم. رسائل المستخدم إلى النشاط لا تُحصَّل. يمكن تسليم رسائل القوالب في أي وقت وتقع في تسويق أو خدمة أو توثيق. لا يمكن إرسال رسالة ليست قالباً إلا داخل نافذة خدمة عملاء مفتوحة لـ 24 ساعة، تُفتح وتُعاد حين يراسل المستخدم. تصف الصفحة نفسها رسائل الخدمة وMeta Business Agent كفئات إضافية. الأسعار تتغير. اقرأوا الجدول الحالي في موقع Meta قبل وضع الميزانية. هذه الصفحة لا تنسخه.",
        ),
      ],
    },
    {
      id: "choose",
      heading: row("Which one you need", "מה צריך", "Cuál necesita", "Qual você precisa", "أيهما تحتاجون"),
      paragraphs: [
        row(
          "Use the app if a person can answer, the catalog and the profile are enough, and you do not need another system to send the message. Use the platform if a lead in a CRM, a form, or an automation must be able to send an approved template or receive the event. The platform is extra machinery. Do not buy it for a conversation one person already handles well.",
          "משתמשים באפליקציה אם אדם יכול לענות, הקטלוג והפרופיל מספיקים, ולא צריך מערכת אחרת כדי לשלוח את ההודעה. משתמשים בפלטפורמה אם ליד ב־CRM, טופס או אוטומציה צריכים להיות מסוגלים לשלוח תבנית מאושרת או לקבל את האירוע. הפלטפורמה היא מכונה נוספת. לא קונים אותה לשיחה שאדם אחד כבר מטפל בה היטב.",
          "Use la app si una persona puede responder, el catálogo y el perfil bastan y no necesita otro sistema para enviar el mensaje. Use la plataforma si un lead en un CRM, un formulario o una automatización deben poder enviar una plantilla aprobada o recibir el evento. La plataforma es maquinaria extra. No la compre para una conversación que una persona ya atiende bien.",
          "Use o app se uma pessoa consegue responder, o catálogo e o perfil bastam e você não precisa de outro sistema para enviar a mensagem. Use a plataforma se um lead no CRM, um formulário ou uma automação precisam conseguir enviar um modelo aprovado ou receber o evento. A plataforma é maquinaria extra. Não a compre para uma conversa que uma pessoa já atende bem.",
          "استخدموا التطبيق إذا كان شخص يستطيع الرد، والكتالوج والملف يكفيان، ولا تحتاجون نظاماً آخر لإرسال الرسالة. استخدموا المنصة إذا كان يجب أن يستطيع عميل محتمل في CRM أو نموذج أو أتمتة إرسال قالب معتمد أو استلام الحدث. المنصة آلة إضافية. لا تشتروها لمحادثة يتعامل معها شخص واحد جيداً.",
        ),
      ],
      table: {
        columns: [
          row("Question", "שאלה", "Pregunta", "Pergunta", "سؤال"),
          row("App", "אפליקציה", "App", "App", "التطبيق"),
          row("Platform", "פלטפורמה", "Plataforma", "Plataforma", "المنصة"),
        ],
        rows: [
          [
            row("Who sends?", "מי שולח?", "¿Quién envía?", "Quem envia?", "من يرسل؟"),
            row("A person in WhatsApp", "אדם בתוך וואטסאפ", "Una persona en WhatsApp", "Uma pessoa no WhatsApp", "شخص داخل واتساب"),
            row("Software, through an API", "תוכנה, דרך API", "Software, por una API", "Software, por uma API", "برنامج، عبر API"),
          ],
          [
            row("Starting a conversation later", "פתיחת שיחה אחר כך", "Iniciar una conversación después", "Iniciar uma conversa depois", "بدء محادثة لاحقاً"),
            row("From the app, within Meta's rules for the app", "מהאפליקציה, לפי כללי Meta לאפליקציה", "Desde la app, según las reglas de Meta para la app", "Pelo app, segundo as regras da Meta para o app", "من التطبيق، وفق قواعد Meta للتطبيق"),
            row("An approved template, any time", "תבנית מאושרת, בכל זמן", "Una plantilla aprobada, en cualquier momento", "Um modelo aprovado, a qualquer momento", "قالب معتمد، في أي وقت"),
          ],
          [
            row("Tied to a CRM", "קשור ל־CRM", "Unido a un CRM", "Ligado a um CRM", "مربوط بـ CRM"),
            row("Only if a person copies the information", "רק אם אדם מעתיק את המידע", "Solo si una persona copia la información", "Só se uma pessoa copiar a informação", "فقط إذا نسخ شخص المعلومات"),
            row("The system can receive the event and send", "המערכת יכולה לקבל את האירוע ולשלוח", "El sistema puede recibir el evento y enviar", "O sistema pode receber o evento e enviar", "يمكن للنظام استلام الحدث والإرسال"),
          ],
        ],
      },
    },
    {
      id: "bizuply",
      heading: row("What Bizuply sells on top of Meta", "מה ביזאפלי מוכרת מעל Meta", "Qué vende Bizuply además de Meta", "O que a Bizuply vende além da Meta", "ماذا تبيع Bizuply فوق Meta"),
      paragraphs: [
        row(
          "Bizuply connects WhatsApp Cloud API. The Bizuply subscription is $29 a month for one connected number: the connection, the API and webhooks, templates, the dashboard and the docs. Another number needs another subscription. There is no free trial. Meta's message charges are separate and are billed by Meta. The business uses Meta Embedded Signup from the Bizuply dashboard. Meta approves the templates and the number. There is no second approval queue at Bizuply. Managing several client numbers from one agency screen is not available.",
          "ביזאפלי מחברת את WhatsApp Cloud API. המנוי של ביזאפלי הוא 29 דולר לחודש למספר מחובר אחד: החיבור, ה־API וה־webhooks, התבניות, לוח הבקרה והתיעוד. מספר נוסף דורש מנוי נוסף. אין ניסיון חינם. חיובי ההודעות של Meta נפרדים ומחויבים על ידי Meta. העסק משתמש ב־Embedded Signup של Meta מתוך לוח הבקרה של ביזאפלי. Meta מאשרת את התבניות ואת המספר. אין תור אישור שני בביזאפלי. ניהול כמה מספרי לקוחות ממסך סוכנות אחד אינו זמין.",
          "Bizuply conecta WhatsApp Cloud API. La suscripción de Bizuply es de 29 dólares al mes por un número conectado: la conexión, la API y los webhooks, las plantillas, el panel y la documentación. Otro número necesita otra suscripción. No hay prueba gratis. Los cargos de mensajes de Meta son aparte y los factura Meta. El negocio usa Embedded Signup de Meta desde el panel de Bizuply. Meta aprueba las plantillas y el número. No hay una segunda cola de aprobación en Bizuply. Gestionar varios números de clientes desde una pantalla de agencia no está disponible.",
          "A Bizuply conecta a WhatsApp Cloud API. A assinatura da Bizuply é de US$ 29 por mês por um número conectado: a conexão, a API e os webhooks, os modelos, o painel e a documentação. Outro número precisa de outra assinatura. Não há teste grátis. As cobranças de mensagem da Meta são à parte e são faturadas pela Meta. O negócio usa o Embedded Signup da Meta a partir do painel da Bizuply. A Meta aprova os modelos e o número. Não há uma segunda fila de aprovação na Bizuply. Gerir vários números de clientes numa tela de agência não está disponível.",
          "تربط Bizuply واجهة WhatsApp Cloud API. اشتراك Bizuply 29 دولاراً في الشهر لرقم متصل واحد: الاتصال، وAPI والويب هوك، والقوالب، ولوحة التحكم والوثائق. رقم آخر يحتاج اشتراكاً آخر. لا توجد تجربة مجانية. رسوم رسائل Meta منفصلة وتفوترها Meta. يستخدم النشاط Embedded Signup من Meta من داخل لوحة Bizuply. توافق Meta على القوالب والرقم. لا يوجد طابور موافقة ثانٍ في Bizuply. إدارة أرقام عملاء عدة من شاشة وكالة واحدة غير متاحة.",
        ),
      ],
    },
    {
      id: "sources",
      heading: row("Sources", "מקורות", "Fuentes", "Fontes", "مصادر"),
      paragraphs: [
        row(
          "Meta, Pricing on the WhatsApp Business Platform, page updated 30 September 2026: https://developers.facebook.com/docs/whatsapp/pricing. Meta, WhatsApp Business app: https://business.whatsapp.com/products/business-app. Check both pages again before you quote a price or a limit. Bizuply's own prices are the ones on the pricing page and on the WhatsApp product page.",
          "Meta, מחירים בפלטפורמת WhatsApp Business, דף שעודכן ב־30 בספטמבר 2026: https://developers.facebook.com/docs/whatsapp/pricing. Meta, אפליקציית WhatsApp Business: https://business.whatsapp.com/products/business-app. בודקים את שני העמודים שוב לפני שמצטטים מחיר או מגבלה. המחירים של ביזאפלי עצמה הם אלה שבדף המחירים ובעמוד המוצר של וואטסאפ.",
          "Meta, precios en la plataforma de WhatsApp Business, página actualizada el 30 de septiembre de 2026: https://developers.facebook.com/docs/whatsapp/pricing. Meta, app WhatsApp Business: https://business.whatsapp.com/products/business-app. Vuelva a mirar ambas páginas antes de citar un precio o un límite. Los precios propios de Bizuply son los de la página de precios y de la página del producto de WhatsApp.",
          "Meta, preços na plataforma do WhatsApp Business, página atualizada em 30 de setembro de 2026: https://developers.facebook.com/docs/whatsapp/pricing. Meta, app WhatsApp Business: https://business.whatsapp.com/products/business-app. Confira as duas páginas de novo antes de citar um preço ou um limite. Os preços da própria Bizuply são os da página de preços e da página do produto de WhatsApp.",
          "Meta، الأسعار على منصة WhatsApp Business، صفحة حُدّثت في 30 سبتمبر 2026: https://developers.facebook.com/docs/whatsapp/pricing. Meta، تطبيق WhatsApp Business: https://business.whatsapp.com/products/business-app. راجعوا الصفحتين من جديد قبل اقتباس سعر أو حد. أسعار Bizuply نفسها هي التي في صفحة الأسعار وصفحة منتج واتساب.",
        ),
      ],
    },
  ],
  faq: [
    [
      row("Does the $29 include Meta's message fees?", "האם 29 הדולר כוללים את חיובי ההודעות של Meta?", "¿Los 29 dólares incluyen las tarifas de mensajes de Meta?", "Os US$ 29 incluem as tarifas de mensagem da Meta?", "هل تشمل الـ 29 دولاراً رسوم رسائل Meta؟"),
      row("No. $29 is Bizuply's subscription for one connected number. Meta charges delivered business-to-user messages separately.", "לא. 29 דולר הם המנוי של ביזאפלי למספר מחובר אחד. Meta מחייבת בנפרד על הודעות מהעסק למשתמש שנמסרו.", "No. 29 dólares es la suscripción de Bizuply por un número conectado. Meta cobra aparte los mensajes entregados del negocio al usuario.", "Não. US$ 29 é a assinatura da Bizuply por um número conectado. A Meta cobra à parte as mensagens entregues da empresa ao usuário.", "لا. 29 دولاراً هي اشتراك Bizuply لرقم متصل واحد. تحصّل Meta بشكل منفصل رسائل النشاط إلى المستخدم التي سُلِّمت."),
    ],
    [
      row("Is there a free trial of the API in Bizuply?", "יש ניסיון חינם ל־API בביזאפלי?", "¿Hay prueba gratis de la API en Bizuply?", "Há teste grátis da API na Bizuply?", "هل توجد تجربة مجانية لـ API في Bizuply؟"),
      row("No.", "אין.", "No.", "Não.", "لا."),
    ],
  ],
  related: [
    ["/guides/whatsapp-cloud-api-cost", row("What the API costs in Bizuply", "כמה עולה ה־API בביזאפלי", "Cuánto cuesta la API en Bizuply", "Quanto custa a API na Bizuply", "كم تكلف API في Bizuply")],
    ["/guides/whatsapp-message-templates", row("How templates work", "איך תבניות עובדות", "Cómo funcionan las plantillas", "Como os modelos funcionam", "كيف تعمل القوالب")],
    ["/whatsapp-api", row("WhatsApp API product", "מוצר WhatsApp API", "Producto WhatsApp API", "Produto WhatsApp API", "منتج WhatsApp API")],
    ["/pricing", row("Pricing", "מחירים", "Precios", "Preços", "الأسعار")],
  ],
};

function materialize(spec, locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  if (!spec.title[language]) return null;
  return {
    slug: spec.slug,
    path: spec.path,
    title: spec.title[language],
    description: spec.description[language],
    crumb: spec.crumb[language],
    h1: spec.h1[language],
    lede: spec.lede[language],
    updated: UPDATED,
    sections: spec.sections.map((section) => ({
      id: section.id,
      heading: section.heading[language],
      paragraphs: section.paragraphs.map((paragraph) => paragraph[language]),
      steps: section.steps?.map((step) => step[language]),
      mistakes: section.mistakes?.map((item) => ({ problem: item.problem[language], fix: item.fix[language] })),
      table: section.table
        ? {
            columns: section.table.columns.map((column) => column[language]),
            rows: section.table.rows.map((line) => line.map((cell) => cell[language])),
          }
        : undefined,
    })),
    faq: spec.faq.map(([question, answer]) => [question[language], answer[language]]),
    related: spec.related.map(([href, label]) => ({ href, label: label[language] })),
  };
}

export const COMPARE_SLUGS = [CRM_SHEET.slug, WA.slug];

export function getCompare(slug, locale) {
  if (slug === CRM_SHEET.slug) return materialize(CRM_SHEET, locale);
  if (slug === WA.slug) return materialize(WA, locale);
  return null;
}

export function compareIndex(locale) {
  const pages = COMPARE_SLUGS.map((slug) => getCompare(slug, locale)).filter(Boolean);
  const integrated = {
    href: "/guides/crm-and-business-platform",
    title: loc(row(
      "CRM only or a business platform",
      "CRM בלבד או מערכת עסקית",
      "CRM solo o una plataforma de negocio",
      "CRM sozinho ou uma plataforma de negócio",
      "CRM وحده أو منصة عمل",
    ), locale),
    description: loc(row(
      "CRM only is $49 a month. The business plan is $99 a month or $990 a year and adds appointments, collaborations, and automations. WhatsApp is a separate subscription.",
      "CRM בלבד עולה 49 דולר לחודש. החבילה העסקית עולה 99 דולר לחודש או 990 לשנה, ומוסיפה תורים, שיתופי פעולה ואוטומציות. וואטסאפ הוא מנוי נפרד.",
      "El CRM solo cuesta 49 dólares al mes. El plan de negocio cuesta 99 dólares al mes o 990 al año y añade citas, colaboraciones y automatizaciones. WhatsApp es una suscripción aparte.",
      "O CRM sozinho custa US$ 49 por mês. O plano de negócios custa US$ 99 por mês ou US$ 990 por ano e acrescenta agenda, colaborações e automações. O WhatsApp é uma assinatura à parte.",
      "CRM وحده بـ 49 دولاراً في الشهر. الخطة التجارية بـ 99 دولاراً في الشهر أو 990 في السنة، وتضيف المواعيد والتعاون والأتمتة. واتساب اشتراك منفصل.",
    ), locale),
  };
  const pack = loc(row(
    {
      title: "Comparisons | BizUply",
      description: "A CRM next to a spreadsheet, and the WhatsApp Business app next to the platform.",
      crumb: "Comparisons",
      h1: "Two ways to do the same work",
      lede: "A CRM next to a spreadsheet, and the WhatsApp Business app next to the platform. Each comparison names what you gain and what you give up.",
    },
    {
      title: "השוואות | ביזאפלי",
      description: "CRM לצד גיליון, ואפליקציית WhatsApp Business לצד הפלטפורמה.",
      crumb: "השוואות",
      h1: "שתי דרכים לאותה עבודה",
      lede: "CRM לצד גיליון, ואפליקציית WhatsApp Business לצד הפלטפורמה. כל השוואה אומרת מה מקבלים ועל מה מוותרים.",
    },
    {
      title: "Comparaciones | BizUply",
      description: "Un CRM junto a una hoja de cálculo, y la app de WhatsApp Business junto a la plataforma.",
      crumb: "Comparaciones",
      h1: "Dos formas de hacer el mismo trabajo",
      lede: "Un CRM junto a una hoja de cálculo, y la app de WhatsApp Business junto a la plataforma. Cada comparación dice qué se gana y qué se deja.",
    },
    {
      title: "Comparações | BizUply",
      description: "Um CRM ao lado de uma planilha, e o app WhatsApp Business ao lado da plataforma.",
      crumb: "Comparações",
      h1: "Dois jeitos de fazer o mesmo trabalho",
      lede: "Um CRM ao lado de uma planilha, e o app WhatsApp Business ao lado da plataforma. Cada comparação diz o que se ganha e o que se deixa.",
    },
    {
      title: "مقارنات | BizUply",
      description: "CRM إلى جانب جدول، وتطبيق WhatsApp Business إلى جانب المنصة.",
      crumb: "مقارنات",
      h1: "طريقتان للعمل نفسه",
      lede: "CRM إلى جانب جدول، وتطبيق WhatsApp Business إلى جانب المنصة. كل مقارنة تقول ماذا تربحون وماذا تتركون.",
    },
  ), locale);
  if (!pack) return null;
  return { ...pack, updated: UPDATED, pages, integrated };
}
