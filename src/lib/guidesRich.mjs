/** Full guide articles. Prices and product limits match the shipped marketing facts. */

import { installRemainingGuides } from "./guidesRichRest.mjs";
import { installMoreGuides } from "./guidesRichMore.mjs";
import { installFinalGuides } from "./guidesRichFinal.mjs";
import { installLastGuides } from "./guidesRichLast.mjs";

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function t(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function article(spec) {
  const byLocale = {};
  for (const locale of LOCALES) {
    byLocale[locale] = {
      title: spec.title[locale],
      description: spec.description[locale],
      h1: spec.h1[locale],
      lede: spec.lede[locale],
      updated: "2026-10-24",
      related: spec.related,
      faq: spec.faq.map(([question, answer]) => [question[locale], answer[locale]]),
      sections: spec.sections.map((section) => ({
        id: section.id,
        heading: section.heading[locale],
        paragraphs: (section.paragraphs || []).map((paragraph) => paragraph[locale]),
        steps: section.steps?.map((step) => step[locale]),
        example: section.example
          ? { title: section.example.title[locale], body: section.example.body[locale] }
          : undefined,
        mistakes: section.mistakes?.map((item) => ({ problem: item.problem[locale], fix: item.fix[locale] })),
        table: section.table
          ? {
              columns: section.table.columns.map((column) => column[locale]),
              rows: section.table.rows.map((row) => row.map((cell) => cell[locale])),
            }
          : undefined,
        figure: section.figure,
        video: section.video,
        videoNote: section.videoNote?.[locale],
      })),
    };
  }
  return byLocale;
}

const ARTICLES = {};

function add(slug, spec) {
  ARTICLES[slug] = article(spec);
}

add("how-search-engines-read-a-business-site", {
  title: t(
    "How search and answer engines read a business site | Bizuply",
    "איך מנועי חיפוש ומנועי תשובות קוראים אתר עסקי | ביזאפלי",
    "Cómo leen los buscadores y los motores de respuesta un sitio de negocio | Bizuply",
    "Como buscadores e motores de resposta leem um site de negócio | Bizuply",
    "كيف تقرأ محركات البحث ومحركات الإجابة موقعاً تجارياً | Bizuply",
  ),
  description: t(
    "A practical reading of the title, H1, opening answer, canonical URL and hreflang. This guide does not sell a ranking.",
    "קריאה מעשית של הכותרת, ה־H1, התשובה בפתיח, כתובת ה־canonical ו־hreflang. המדריך לא מוכר דירוג.",
    "Una lectura práctica del título, el H1, la respuesta inicial, la URL canónica y hreflang. Esta guía no vende un ranking.",
    "Uma leitura prática do título, do H1, da resposta inicial, da URL canônica e do hreflang. Este guia não vende ranking.",
    "قراءة عملية للعنوان وH1 والإجابة الافتتاحية ورابط canonical وhreflang. هذا الدليل لا يبيع ترتيباً.",
  ),
  h1: t(
    "How search and answer engines read a business site",
    "איך מנועי חיפוש ומנועי תשובות קוראים אתר עסקי",
    "Cómo leen los buscadores y los motores de respuesta un sitio de negocio",
    "Como buscadores e motores de resposta leem um site de negócio",
    "كيف تقرأ محركات البحث ومحركات الإجابة موقعاً تجارياً",
  ),
  lede: t(
    "A crawler and an answer engine can only use what the page actually says. The useful work is to make the title, the heading and the first paragraph agree, in the language of the reader, and to point each language at its own URL.",
    "זחלן ומנוע תשובות יכולים להשתמש רק במה שהעמוד באמת אומר. העבודה המועילה היא שכותרת העמוד, הכותרת הראשית והפסקה הראשונה יגידו אותו דבר, בשפה של הקורא, ושלכל שפה תהיה כתובת משלה.",
    "Un rastreador y un motor de respuesta solo pueden usar lo que la página dice de verdad. El trabajo útil es que el título, el encabezado y el primer párrafo coincidan, en el idioma del lector, y que cada idioma tenga su propia URL.",
    "Um rastreador e um motor de resposta só usam o que a página realmente diz. O trabalho útil é fazer o título, o cabeçalho e o primeiro parágrafo concordarem, no idioma do leitor, e dar a cada idioma a própria URL.",
    "لا يستطيع الزاحف ومحرك الإجابة استخدام إلا ما تقوله الصفحة فعلاً. العمل المفيد هو أن يتفق عنوان الصفحة والعنوان الرئيسي والفقرة الأولى، بلغة القارئ، وأن يكون لكل لغة رابطها.",
  ),
  related: ["build-a-website-without-code", "website-form-to-crm", "crm-and-business-platform"],
  sections: [
    {
      id: "scope",
      heading: t("What this guide will and will not do", "מה המדריך הזה עושה ומה הוא לא עושה", "Qué hace esta guía y qué no hace", "O que este guia faz e o que não faz", "ماذا يفعل هذا الدليل وماذا لا يفعل"),
      paragraphs: [
        t(
          "It explains the parts of a public page that a search engine and an answer engine can read without guessing: the title, one H1, the opening paragraph, the canonical URL, and the language links. It also explains why a page that repeats the same sentence in five places is harder to quote than a page that answers once.",
          "הוא מסביר את החלקים בעמוד ציבורי שמנוע חיפוש ומנוע תשובות יכולים לקרוא בלי לנחש: כותרת העמוד, H1 אחד, פסקת הפתיחה, כתובת ה־canonical וקישורי השפה. הוא גם מסביר למה עמוד שחוזר על אותו משפט בחמישה מקומות קשה יותר לציטוט מעמוד שעונה פעם אחת.",
          "Explica las partes de una página pública que un buscador y un motor de respuesta pueden leer sin adivinar: el título, un H1, el párrafo inicial, la URL canónica y los enlaces de idioma. También explica por qué una página que repite la misma frase en cinco sitios es más difícil de citar que una página que responde una vez.",
          "Explica as partes de uma página pública que um buscador e um motor de resposta conseguem ler sem adivinhar: o título, um H1, o parágrafo inicial, a URL canônica e os links de idioma. Também explica por que uma página que repete a mesma frase em cinco lugares é mais difícil de citar do que uma página que responde uma vez.",
          "يشرح أجزاء الصفحة العامة التي يستطيع محرك البحث ومحرك الإجابة قراءتها دون تخمين: العنوان، وعنوان H1 واحد، والفقرة الافتتاحية، ورابط canonical، وروابط اللغة. ويشرح أيضاً لماذا يصعب اقتباس صفحة تكرر الجملة نفسها في خمسة مواضع أكثر من صفحة تجيب مرة واحدة.",
        ),
        t(
          "It will not make a site rank, and Bizuply does not sell that outcome. There is no public SEO or AEO retainer. A person can build a site in the editor, or pay for the published expert website build. Neither of those is a promise that a query will show the page.",
          "הוא לא יגרום לאתר להתברג, וביזאפלי לא מוכרת את התוצאה הזאת. אין מנוי ציבורי ל־SEO או ל־AEO. אפשר לבנות אתר בעורך, או לשלם על בניית האתר של המומחה שכבר מפורסמת. אף אחד מהם אינו הבטחה ששאילתה תציג את העמוד.",
          "No hará que un sitio se posicione, y Bizuply no vende ese resultado. No hay un servicio público de SEO o AEO. Una persona puede construir el sitio en el editor o pagar la construcción de experto ya publicada. Ninguna de las dos es una promesa de que una consulta mostrará la página.",
          "Ele não fará um site ranquear, e a Bizuply não vende esse resultado. Não há um serviço público de SEO ou AEO. A pessoa pode montar o site no editor ou pagar a construção de especialista já publicada. Nenhuma das duas promete que uma consulta mostrará a página.",
          "لن يجعل موقعاً يتصدر، وBizuply لا تبيع هذه النتيجة. لا يوجد اشتراك عام لـ SEO أو AEO. يستطيع الشخص بناء الموقع في المحرر أو دفع مقابل بناء المختص المنشور. لا شيء منهما وعد بأن الاستعلام سيعرض الصفحة.",
        ),
      ],
    },
    {
      id: "first",
      heading: t("What gets read first", "מה נקרא קודם", "Qué se lee primero", "O que é lido primeiro", "ما الذي يُقرأ أولاً"),
      paragraphs: [
        t(
          "The title is the name of the page in the browser and in the result. The H1 is the heading a person sees. They should describe the same job. If the title says “best CRM in Israel” and the page explains how a lead gets a status, the two texts are answering different questions.",
          "כותרת העמוד היא השם בדפדפן ובתוצאה. ה־H1 הוא הכותרת שאדם רואה. הן צריכות לתאר את אותה עבודה. אם הכותרת אומרת ״ה־CRM הטוב בישראל״ והעמוד מסביר איך ליד מקבל סטטוס, שני הטקסטים עונים על שאלות שונות.",
          "El título es el nombre de la página en el navegador y en el resultado. El H1 es el encabezado que ve una persona. Deben describir el mismo trabajo. Si el título dice “el mejor CRM de Israel” y la página explica cómo un lead recibe un estado, los dos textos responden preguntas distintas.",
          "O título é o nome da página no navegador e no resultado. O H1 é o cabeçalho que a pessoa vê. Os dois devem descrever o mesmo trabalho. Se o título diz “o melhor CRM de Israel” e a página explica como um lead recebe um status, os textos respondem a perguntas diferentes.",
          "عنوان الصفحة هو اسمها في المتصفح وفي النتيجة. عنوان H1 هو ما يراه الشخص. يجب أن يصفا العمل نفسه. إذا قال العنوان «أفضل CRM في إسرائيل» والصفحة تشرح كيف يحصل العميل المحتمل على حالة، فالنصان يجيبان عن سؤالين مختلفين.",
        ),
        t(
          "The first paragraph should answer the question in plain language. Prices, limits and steps belong there when they are true. A later section can explain the exception. A crawler should not have to assemble the answer from a slogan, a button and an image with no text.",
          "הפסקה הראשונה צריכה לענות על השאלה בשפה פשוטה. מחירים, גבולות וצעדים שייכים לשם כשהם נכונים. סעיף מאוחר יותר יכול להסביר את החריג. זחלן לא אמור להרכיב את התשובה מסיסמה, מכפתור ומתמונה בלי טקסט.",
          "El primer párrafo debe responder la pregunta en lenguaje llano. Los precios, los límites y los pasos van ahí cuando son verdaderos. Una sección posterior puede explicar la excepción. Un rastreador no debería tener que armar la respuesta con un eslogan, un botón y una imagen sin texto.",
          "O primeiro parágrafo deve responder à pergunta em linguagem simples. Preços, limites e passos ficam ali quando são verdadeiros. Uma seção posterior pode explicar a exceção. Um rastreador não deveria montar a resposta a partir de um slogan, um botão e uma imagem sem texto.",
          "يجب أن تجيب الفقرة الأولى عن السؤال بلغة واضحة. الأسعار والحدود والخطوات مكانها هناك حين تكون صحيحة. يمكن لقسم لاحق أن يشرح الاستثناء. لا يُفترض بالزاحف أن يركّب الإجابة من شعار وزر وصورة بلا نص.",
        ),
      ],
      steps: [
        t("Write the title as the job of the page.", "כתבו את כותרת העמוד כעבודה שהעמוד עושה.", "Escriba el título como el trabajo de la página.", "Escreva o título como o trabalho da página.", "اكتبوا العنوان بوصفه عمل الصفحة."),
        t("Use one H1 that a person would say out loud.", "השתמשו ב־H1 אחד שאדם היה אומר בקול.", "Use un solo H1 que una persona diría en voz alta.", "Use um único H1 que uma pessoa diria em voz alta.", "استخدموا عنوان H1 واحداً يمكن قوله بصوت عالٍ."),
        t("Put the direct answer in the opening paragraph.", "שימו את התשובה הישירה בפסקת הפתיחה.", "Ponga la respuesta directa en el párrafo inicial.", "Coloque a resposta direta no parágrafo inicial.", "ضعوا الإجابة المباشرة في الفقرة الافتتاحية."),
        t("Give the page one canonical URL.", "תנו לעמוד כתובת canonical אחת.", "Dé a la página una sola URL canónica.", "Dê à página uma única URL canônica.", "أعطوا الصفحة رابط canonical واحداً."),
        t("Add a language link only when that translation exists.", "הוסיפו קישור שפה רק כשהתרגום הזה קיים.", "Añada un enlace de idioma solo cuando esa traducción exista.", "Adicione um link de idioma só quando essa tradução existir.", "أضيفوا رابط لغة فقط حين توجد تلك الترجمة."),
      ],
      figure: "crawl",
    },
    {
      id: "languages",
      heading: t("One subject, five languages", "נושא אחד, חמש שפות", "Un tema, cinco idiomas", "Um assunto, cinco idiomas", "موضوع واحد، خمس لغات"),
      paragraphs: [
        t(
          "English lives at the unprefixed URL. Hebrew, Spanish, Brazilian Portuguese and Arabic each have their own path. Each page points to the others with hreflang, and the English page is the default. A Hebrew reader should not land on an English article that only switches direction after the page loads.",
          "אנגלית נמצאת בכתובת בלי קידומת. לעברית, לספרדית, לפורטוגזית ברזילאית ולערבית יש נתיב משלהן. כל עמוד מצביע על האחרים ב־hreflang, והעמוד האנגלי הוא ברירת המחדל. קורא בעברית לא אמור להגיע למאמר באנגלית שמשנה כיוון רק אחרי שהעמוד נטען.",
          "El inglés vive en la URL sin prefijo. El hebreo, el español, el portugués de Brasil y el árabe tienen su propia ruta. Cada página señala a las otras con hreflang, y la página en inglés es la predeterminada. Un lector en hebreo no debería llegar a un artículo en inglés que solo cambia de dirección después de cargar.",
          "O inglês fica na URL sem prefixo. Hebraico, espanhol, português do Brasil e árabe têm o próprio caminho. Cada página aponta para as outras com hreflang, e a página em inglês é o padrão. Um leitor em hebraico não deveria chegar a um artigo em inglês que só muda a direção depois de carregar.",
          "الإنجليزية على الرابط بلا بادئة. للعبرية والإسبانية والبرتغالية البرازيلية والعربية مسارها. كل صفحة تشير إلى الأخريات بـ hreflang، والصفحة الإنجليزية هي الافتراضية. لا يُفترض بقارئ بالعبرية أن يصل إلى مقال إنجليزي يغيّر الاتجاه فقط بعد التحميل.",
        ),
        t(
          "A missing translation should not be indexed as if it were finished. On this site, a legal page that does not have a real translation stays out of the index. The same rule belongs on a business site: do not publish an empty language URL and ask a crawler to treat it as the page.",
          "תרגום חסר לא אמור להיכנס לאינדקס כאילו הוא גמור. באתר הזה, עמוד משפטי בלי תרגום אמיתי נשאר מחוץ לאינדקס. אותו כלל מתאים לאתר עסקי: לא מפרסמים כתובת שפה ריקה ומבקשים מזחלן להתייחס אליה כאל העמוד.",
          "Una traducción que falta no debería indexarse como si estuviera terminada. En este sitio, una página legal sin una traducción real queda fuera del índice. La misma regla sirve en un sitio de negocio: no publique una URL de idioma vacía y pida a un rastreador que la trate como la página.",
          "Uma tradução ausente não deve ser indexada como se estivesse pronta. Neste site, uma página legal sem tradução real fica fora do índice. A mesma regra serve a um site de negócio: não publique uma URL de idioma vazia e peça a um rastreador que a trate como a página.",
          "لا ينبغي فهرسة ترجمة ناقصة كأنما اكتملت. في هذا الموقع، تبقى الصفحة القانونية بلا ترجمة حقيقية خارج الفهرس. القاعدة نفسها تصلح لموقع تجاري: لا تنشروا رابط لغة فارغاً وتطلبوا من الزاحف أن يعامله كأنه الصفحة.",
        ),
      ],
    },
    {
      id: "quote",
      heading: t("What an answer engine can quote", "מה מנוע תשובות יכול לצטט", "Qué puede citar un motor de respuesta", "O que um motor de resposta pode citar", "ما يمكن لمحرك الإجابة اقتباسه"),
      paragraphs: [
        t(
          "An answer engine quotes a sentence it can check against the page. A price with its unit, a limit, and the name of the thing being sold are quotable. “We are the leading platform” is not, because nothing on the page can prove it. Invented customer counts, review scores and search volumes have the same problem.",
          "מנוע תשובות מצטט משפט שאפשר לבדוק מול העמוד. מחיר עם היחידה שלו, גבול, ושם הדבר שנמכר ניתנים לציטוט. ״אנחנו הפלטפורמה המובילה״ לא, כי שום דבר בעמוד לא יכול להוכיח את זה. מספרי לקוחות, ציוני ביקורות ונפחי חיפוש שהומצאו הם אותה בעיה.",
          "Un motor de respuesta cita una frase que puede comprobar en la página. Un precio con su unidad, un límite y el nombre de lo que se vende se pueden citar. “Somos la plataforma líder” no, porque nada en la página puede probarlo. Los recuentos de clientes, las puntuaciones y los volúmenes de búsqueda inventados tienen el mismo problema.",
          "Um motor de resposta cita uma frase que consegue conferir na página. Um preço com a unidade, um limite e o nome do que é vendido podem ser citados. “Somos a plataforma líder” não, porque nada na página prova isso. Contagens de clientes, notas e volumes de busca inventados têm o mesmo problema.",
          "يقتبس محرك الإجابة جملة يمكن التحقق منها في الصفحة. السعر مع وحدته، والحد، واسم ما يُباع يمكن اقتباسها. «نحن المنصة الرائدة» لا، لأن لا شيء في الصفحة يثبتها. أعداد العملاء ودرجات المراجعات وحجوم البحث المخترعة المشكلة نفسها.",
        ),
        t(
          "Questions on the page should be questions a buyer actually asks, and the answer under each one should be complete. A question that exists only to repeat a keyword, with a one-line answer that points nowhere, gives an answer engine nothing solid to use.",
          "שאלות בעמוד צריכות להיות שאלות שקונה באמת שואל, והתשובה מתחת לכל אחת צריכה להיות שלמה. שאלה שקיימת רק כדי לחזור על מילת מפתח, עם תשובה של שורה אחת שלא מובילה לשום מקום, לא נותנת למנוע תשובות משהו מוצק.",
          "Las preguntas de la página deben ser preguntas que un comprador hace de verdad, y la respuesta debajo de cada una debe estar completa. Una pregunta que existe solo para repetir una palabra clave, con una respuesta de una línea que no lleva a ninguna parte, no le da a un motor de respuesta nada sólido.",
          "As perguntas da página devem ser perguntas que um comprador realmente faz, e a resposta abaixo de cada uma deve ser completa. Uma pergunta que existe só para repetir uma palavra-chave, com uma resposta de uma linha que não leva a lugar nenhum, não dá a um motor de resposta nada sólido.",
          "أسئلة الصفحة يجب أن تكون أسئلة يطرحها المشتري فعلاً، والإجابة تحت كل سؤال يجب أن تكون كاملة. سؤال موجود فقط لتكرار كلمة مفتاحية، بإجابة من سطر لا تؤدي إلى شيء، لا يعطي محرك الإجابة مادة صلبة.",
        ),
      ],
      example: {
        title: t("A sentence that can be quoted", "משפט שאפשר לצטט", "Una frase que se puede citar", "Uma frase que pode ser citada", "جملة يمكن اقتباسها"),
        body: t(
          "“CRM only is $49 a month. The business plan, which adds appointments, collaborations and automations, is $99 a month or $990 a year.” That sentence names the product, the price and the boundary. “The best price in the market” does not.",
          "״CRM בלבד עולה 49 דולר לחודש. החבילה העסקית, שמוסיפה תורים, שיתופים ואוטומציות, עולה 99 דולר לחודש או 990 דולר לשנה.״ המשפט מציין את המוצר, את המחיר ואת הגבול. ״המחיר הטוב בשוק״ לא.",
          "“El CRM solo cuesta 49 dólares al mes. El plan de negocio, que añade citas, colaboraciones y automatizaciones, cuesta 99 dólares al mes o 990 al año.” Esa frase nombra el producto, el precio y el límite. “El mejor precio del mercado” no.",
          "“O CRM sozinho custa US$ 49 por mês. O plano de negócios, que acrescenta agenda, colaborações e automações, custa US$ 99 por mês ou US$ 990 por ano.” A frase nomeia o produto, o preço e o limite. “O melhor preço do mercado” não.",
          "«CRM وحده 49 دولاراً في الشهر. الخطة التجارية، التي تضيف المواعيد والتعاون والأتمتة، 99 دولاراً في الشهر أو 990 دولاراً في السنة.» الجملة تسمي المنتج والسعر والحد. «أفضل سعر في السوق» لا تفعل.",
        ),
      },
    },
    {
      id: "practice",
      heading: t("A worked page for a service business", "עמוד לדוגמה לעסק שירות", "Una página trabajada para un negocio de servicios", "Uma página trabalhada para um negócio de serviço", "صفحة عملية لنشاط خدمات"),
      paragraphs: [
        t(
          "Take a clinic that wants appointments. The useful page says who it is for, that booking uses 15-minute windows, and what a person does next. The title might be “Book a clinic appointment”. The opening paragraph says the hours, the service, and that a confirmation email goes to the client and the business when a booking is made.",
          "קחו מרפאה שרוצה תורים. העמוד המועיל אומר למי הוא מיועד, שהזימון משתמש בחלונות של 15 דקות, ומה אדם עושה אחר כך. הכותרת יכולה להיות ״קביעת תור למרפאה״. פסקת הפתיחה אומרת את השעות, את השירות, ושאישור במייל נשלח ללקוח ולעסק כשקובעים תור.",
          "Tome una clínica que quiere citas. La página útil dice para quién es, que la reserva usa ventanas de 15 minutos y qué hace después una persona. El título puede ser “Reservar una cita en la clínica”. El párrafo inicial dice el horario, el servicio y que un correo de confirmación llega al cliente y al negocio cuando se reserva.",
          "Pegue uma clínica que quer agendamentos. A página útil diz para quem ela é, que a reserva usa janelas de 15 minutos e o que a pessoa faz depois. O título pode ser “Agendar uma consulta na clínica”. O parágrafo inicial diz o horário, o serviço e que um e-mail de confirmação vai para o cliente e para o negócio quando a reserva é feita.",
          "خذوا عيادة تريد مواعيد. الصفحة المفيدة تقول لمن هي، وأن الحجز يستخدم نوافذ من 15 دقيقة، وماذا يفعل الشخص بعد ذلك. قد يكون العنوان «حجز موعد في العيادة». الفقرة الافتتاحية تذكر الساعات والخدمة وأن رسالة تأكيد تصل إلى العميل وإلى النشاط عند الحجز.",
        ),
        t(
          "The same page should link to the booking page and, if the business also wants the inquiry in a pipeline, to the explanation of how a form becomes a lead. Those links help a person. They also tell a crawler which page owns which subject, so two pages are not competing to answer the same question.",
          "אותו עמוד צריך לקשר לעמוד הזימון, ואם העסק רוצה גם את הפנייה בצינור, להסבר איך טופס הופך לליד. הקישורים עוזרים לאדם. הם גם אומרים לזחלן איזה עמוד מחזיק איזה נושא, כך ששני עמודים לא מתחרים על אותה שאלה.",
          "La misma página debe enlazar a la página de reserva y, si el negocio también quiere la consulta en un pipeline, a la explicación de cómo un formulario se convierte en lead. Esos enlaces ayudan a una persona. También le dicen a un rastreador qué página posee cada tema, para que dos páginas no compitan por la misma pregunta.",
          "A mesma página deve ligar à página de reserva e, se o negócio também quer o contato no pipeline, à explicação de como um formulário vira lead. Esses links ajudam a pessoa. Também dizem ao rastreador qual página é dona de cada assunto, para que duas páginas não disputem a mesma pergunta.",
          "يجب أن تربط الصفحة نفسها بصفحة الحجز، وإذا أراد النشاط أيضاً أن يدخل الاستفسار إلى المسار، بشرح كيف يصبح النموذج عميلاً محتملاً. هذه الروابط تساعد الشخص. وتقول للزاحف أيضاً أي صفحة تملك أي موضوع، فلا تتنافس صفحتان على السؤال نفسه.",
        ),
      ],
      mistakes: [
        {
          problem: t("The title promises a ranking or a superlative.", "הכותרת מבטיחה דירוג או דרגת עליונות.", "El título promete un ranking o un superlativo.", "O título promete um ranking ou um superlativo.", "العنوان يعد بترتيب أو بصيغة تفضيل."),
          fix: t("Name the job and the reader. Leave the comparison out unless you can show the evidence on the page.", "ציינו את העבודה ואת הקורא. השאירו את ההשוואה בחוץ אלא אם אפשר להראות את הראיה בעמוד.", "Nombre el trabajo y el lector. Deje la comparación fuera, salvo que pueda mostrar la prueba en la página.", "Nomeie o trabalho e o leitor. Deixe a comparação de fora, a menos que a prova esteja na página.", "سمّوا العمل والقارئ. اتركوا المقارنة خارجاً إلا إذا أمكن إظهار الدليل في الصفحة."),
        },
        {
          problem: t("The same paragraph is pasted under every heading.", "אותה פסקה מודבקת מתחת לכל כותרת.", "El mismo párrafo está pegado bajo cada encabezado.", "O mesmo parágrafo está colado sob cada título.", "الفقرة نفسها ملصقة تحت كل عنوان."),
          fix: t("Each heading should add a step, a limit or an example that the previous section did not already say.", "כל כותרת צריכה להוסיף צעד, גבול או דוגמה שהסעיף הקודם לא אמר.", "Cada encabezado debe añadir un paso, un límite o un ejemplo que la sección anterior no haya dicho.", "Cada título deve acrescentar um passo, um limite ou um exemplo que a seção anterior não disse.", "يجب أن يضيف كل عنوان خطوة أو حداً أو مثالاً لم يقله القسم السابق."),
        },
        {
          problem: t("A language URL exists, but the text is still English.", "קיימת כתובת שפה, אבל הטקסט עדיין באנגלית.", "Existe una URL de idioma, pero el texto sigue en inglés.", "Existe uma URL de idioma, mas o texto continua em inglês.", "يوجد رابط لغة، لكن النص ما زال بالإنجليزية."),
          fix: t("Publish the translation or keep that URL out of the index. Do not point hreflang at an unfinished page.", "פרסמו את התרגום או השאירו את הכתובת מחוץ לאינדקס. אל תפנו hreflang לעמוד שלא הושלם.", "Publique la traducción o deje esa URL fuera del índice. No apunte hreflang a una página sin terminar.", "Publique a tradução ou deixe essa URL fora do índice. Não aponte hreflang para uma página inacabada.", "انشروا الترجمة أو أبقوا الرابط خارج الفهرس. لا توجّهوا hreflang إلى صفحة غير مكتملة."),
        },
      ],
    },
  ],
  faq: [
    [t("Will this guide make a site rank?", "האם המדריך הזה יגרום לאתר להתברג?", "¿Esta guía hará que un sitio se posicione?", "Este guia fará um site ranquear?", "هل يجعل هذا الدليل موقعاً يتصدر؟"), t("No. It describes how to write a page that a crawler and a person can read. Position depends on the query, the competition and the site.", "לא. הוא מתאר איך לכתוב עמוד שזחלן ואדם יכולים לקרוא. המיקום תלוי בשאילתה, בתחרות ובאתר.", "No. Describe cómo escribir una página que un rastreador y una persona puedan leer. La posición depende de la consulta, la competencia y el sitio.", "Não. Descreve como escrever uma página que um rastreador e uma pessoa consigam ler. A posição depende da consulta, da concorrência e do site.", "لا. يصف كيف تُكتب صفحة يستطيع زاحف وشخص قراءتها. الموضع يعتمد على الاستعلام والمنافسة والموقع.")],
    [t("Does Bizuply sell SEO or AEO?", "האם ביזאפלי מוכרת SEO או AEO?", "¿Bizuply vende SEO o AEO?", "A Bizuply vende SEO ou AEO?", "هل تبيع Bizuply SEO أو AEO؟"), t("No public retainer for either one. The website editor and the published expert website build exist. They do not include a ranking promise.", "אין מנוי ציבורי לאף אחד מהם. קיימים עורך האתרים ובניית האתר של המומחה שפורסמה. הם לא כוללים הבטחת דירוג.", "No hay un servicio público de ninguno de los dos. Existen el editor y la construcción de experto publicada. No incluyen una promesa de ranking.", "Não há um serviço público de nenhum dos dois. Existem o editor e a construção de especialista publicada. Eles não incluem promessa de ranking.", "لا يوجد اشتراك عام لأي منهما. يوجد المحرر وبناء المختص المنشور. وهما لا يشملان وعداً بالترتيب.")],
    [t("Should every page have a question section?", "האם לכל עמוד צריך מקטע שאלות?", "¿Cada página necesita una sección de preguntas?", "Toda página precisa de uma seção de perguntas?", "هل تحتاج كل صفحة إلى قسم أسئلة؟"), t("Only when the questions are real. Four precise answers are better than a list of headings that repeat the introduction.", "רק כשהשאלות אמיתיות. ארבע תשובות מדויקות עדיפות על רשימת כותרות שחוזרת על הפתיח.", "Solo cuando las preguntas son reales. Cuatro respuestas precisas son mejores que una lista de encabezados que repite la introducción.", "Só quando as perguntas são reais. Quatro respostas precisas são melhores do que uma lista de títulos que repete a introdução.", "فقط حين تكون الأسئلة حقيقية. أربع إجابات دقيقة أفضل من قائمة عناوين تكرر المقدمة.")],
    [t("Where should the price sit?", "איפה המחיר צריך לשבת?", "¿Dónde debe estar el precio?", "Onde o preço deve ficar?", "أين يجب أن يكون السعر؟"), t("On the page that sells the thing, in the opening answer and again in a table if several plans are being compared. Do not hide a public price in an image.", "בעמוד שמוכר את הדבר, בתשובה הפותחת ושוב בטבלה אם משווים כמה מסלולים. אל תחביאו מחיר ציבורי בתוך תמונה.", "En la página que vende eso, en la respuesta inicial y otra vez en una tabla si se comparan varios planes. No esconda un precio público dentro de una imagen.", "Na página que vende aquilo, na resposta inicial e de novo numa tabela se vários planos estão sendo comparados. Não esconda um preço público dentro de uma imagem.", "في الصفحة التي تبيع الشيء، في الإجابة الافتتاحية ومرة أخرى في جدول إذا قورنت عدة خطط. لا تخفوا سعراً عاماً داخل صورة.")],
  ],
});

installRemainingGuides(add, t);
installMoreGuides(add, t);
installFinalGuides(add, t);
installLastGuides(add, t);

export function getRichGuide(slug, locale) {
  const pack = ARTICLES[slug];
  if (!pack) return null;
  return pack[locale] || pack.en;
}

export const RICH_GUIDE_SLUGS = Object.keys(ARTICLES);
