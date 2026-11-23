/**
 * Proposed privacy notice for first-party content measurement.
 * It is rendered for review. Do not treat this file as legal approval,
 * and do not turn collection on from this text.
 */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

const EVENTS = [
  ["resource_view", {
    en: "A view of the resource library, glossary, templates, a comparison, or a reading path.",
    he: "צפייה בספריית המשאבים, במילון, בתבניות, בהשוואה או במסלול קריאה.",
    es: "Una vista de la biblioteca, el glosario, las plantillas, una comparación o una ruta de lectura.",
    "pt-BR": "Uma visualização da biblioteca, do glossário, dos modelos, de uma comparação ou de um percurso de leitura.",
    ar: "مشاهدة مكتبة الموارد أو المعجم أو القوالب أو مقارنة أو مسار قراءة.",
  }],
  ["guide_view", {
    en: "A view of a guide.",
    he: "צפייה במדריך.",
    es: "Una vista de una guía.",
    "pt-BR": "Uma visualização de um guia.",
    ar: "مشاهدة دليل.",
  }],
  ["guide_product_click", {
    en: "A click from a guide to a product page.",
    he: "לחיצה ממדריך אל עמוד מוצר.",
    es: "Un clic desde una guía hacia una página de producto.",
    "pt-BR": "Um clique de um guia para uma página de produto.",
    ar: "نقرة من دليل إلى صفحة منتج.",
  }],
  ["template_download", {
    en: "A download of a template file.",
    he: "הורדה של קובץ תבנית.",
    es: "Una descarga de un archivo de plantilla.",
    "pt-BR": "Um download de um arquivo de modelo.",
    ar: "تنزيل ملف قالب.",
  }],
  ["calculator_use", {
    en: "Use of a calculator. The amounts you type are not stored.",
    he: "שימוש במחשבון. הסכומים שמקלידים אינם נשמרים.",
    es: "Uso de una calculadora. Los importes que escribe no se guardan.",
    "pt-BR": "Uso de uma calculadora. Os valores digitados não são guardados.",
    ar: "استخدام حاسبة. المبالغ التي تُكتب لا تُحفظ.",
  }],
  ["pricing_click", {
    en: "A click from a content page to the pricing page.",
    he: "לחיצה מעמוד תוכן אל עמוד המחירים.",
    es: "Un clic desde una página de contenido hacia la página de precios.",
    "pt-BR": "Um clique de uma página de conteúdo para a página de preços.",
    ar: "نقرة من صفحة محتوى إلى صفحة الأسعار.",
  }],
  ["content_signup", {
    en: "A registration attributed to content, and only after a view of that same content was already stored under this consent.",
    he: "הרשמה שמשויכת לתוכן, ורק אחרי שצפייה באותו תוכן כבר נשמרה תחת אותה הסכמה.",
    es: "Un registro atribuido al contenido, y solo después de que una vista de ese mismo contenido ya se guardó con este consentimiento.",
    "pt-BR": "Um cadastro atribuído ao conteúdo, e só depois que uma visualização desse mesmo conteúdo já foi guardada com este consentimento.",
    ar: "تسجيل يُنسب إلى المحتوى، وفقط بعد أن حُفظت مشاهدة للمحتوى نفسه بموجب هذه الموافقة.",
  }],
];

function pick(pack, locale) {
  return pack[locale] || pack.en;
}

const COPY = {
  en: {
    nav: "Content measurement",
    title: "Content measurement on the public site",
    leadOff: "Collection is off. Bizuply does not store these events and does not set a measurement cookie until you choose analytics and Bizuply turns collection on. Choosing advertising, or keeping an older choice, does not start it.",
    leadOn: "Collection runs only after you choose analytics for this notice. Necessary cookies and an advertising choice do not start it.",
    purpose: "The purpose is to see which public guides, templates, and other resource pages are read, and which of them come before a product page, the pricing page, or a registration. Bizuply uses that to improve the public resource center. The records are not used to advertise to you, and they are not combined with Google Search Console as if they were the same audience.",
    eventsTitle: "The seven events",
    identifier: "The server creates a random identifier and a separate visit identifier. It stores them in a cookie named bizuply_measure. That cookie is HttpOnly and Secure, it is signed by the server, and the page cannot read it. A second cookie, bizuply_measure_hint, only says that analytics was allowed. It does not contain the identifier. You cannot supply your own identifier. A request that tries to do that is rejected.",
    notAnonymous: "The random identifier is an online identifier for this browser. It is not a name, and the records are not fully anonymous, because events can be connected to the same browser until they are deleted. A record can include the event, the page path without query parameters, the language, the referring site's host, a device class, and a country code when the edge network provides one. It does not include your name, email, phone, the text you type in a form, the amounts you type in a calculator, or your IP address.",
    meta: "This measurement is separate from advertising with Meta. The Meta Pixel, and the cookies _fbp and _fbc, load only after you allow advertising. Allowing advertising does not allow this measurement. Allowing this measurement does not load the Meta Pixel, and these counts are not sent to Meta.",
    consent: "Nothing in this section is stored before an explicit analytics choice for the current notice. A missing choice, a refusal, and an older saved value of all or essential are not that choice. You can allow analytics, refuse it, or change the choice later from Cookie settings in the footer and from the button on this page.",
    retention: "The planned retention is about 180 days. Old records are removed on the database cleanup cycle, not at an exact second. While collection is off, that cleanup index is not applied, because there is nothing to delete.",
    withdraw: "You can withdraw the analytics choice at any time. Withdrawal stops new events. It does not change the advertising choice, and it does not create a new identifier.",
    deletion: "When the withdrawal is accepted, Bizuply deletes the content events and the consent record for that identifier. One revocation marker remains, with the same random identifier and without the page history, so a reused cookie cannot record new events. That marker leaves on the same cleanup cycle of about 180 days. Deletion is not promised at an exact second.",
    access: "The report is limited to platform administrators. A business customer and a signed-out visitor do not receive it.",
    separation: "These records are kept in their own collection for the public Bizuply site. They are separate from measurement of websites that business customers publish. A choice on this site does not turn measurement on for a customer site.",
    cookiesTitle: "Cookies used for this measurement",
    change: "Cookie settings replace the previous choice. Turning analytics off is the withdrawal described above. Turning it on again, after collection is on, creates a new identifier only when the server accepts the new consent.",
    columns: ["Name", "Who sets it", "What it is for", "How long"],
  },
  he: {
    nav: "מדידת תוכן",
    title: "מדידת תוכן באתר הציבורי",
    leadOff: "האיסוף כבוי. ביזאפלי אינה שומרת את האירועים האלה ואינה קובעת עוגיית מדידה עד שבוחרים אנליטיקס וביזאפלי מפעילה את האיסוף. בחירה בפרסום, או בחירה ישנה שנשמרה, אינה מפעילה את זה.",
    leadOn: "האיסוף פועל רק אחרי בחירה באנליטיקס לנוסח הזה. עוגיות הכרחיות ובחירה בפרסום אינן מפעילות אותו.",
    purpose: "המטרה היא לראות אילו מדריכים, תבניות ועמודי משאבים ציבוריים נקראים, ואילו מהם קודמים לעמוד מוצר, לעמוד המחירים או להרשמה. ביזאפלי משתמשת בזה כדי לשפר את מרכז המשאבים הציבורי. הרשומות אינן משמשות לפרסום, והן אינן מחוברות אל Search Console כאילו הן אותו קהל.",
    eventsTitle: "שבעת האירועים",
    identifier: "השרת יוצר מזהה אקראי ומזהה ביקור נפרד. הוא שומר אותם בעוגייה בשם bizuply_measure. העוגייה היא HttpOnly ו־Secure, היא חתומה בידי השרת, והעמוד אינו יכול לקרוא אותה. עוגייה שנייה, bizuply_measure_hint, רק מציינת שהאנליטיקס אושר. אין בה את המזהה. אי אפשר לשלוח מזהה משלכם. בקשה שמנסה לעשות זאת נדחית.",
    notAnonymous: "המזהה האקראי הוא מזהה מקוון של הדפדפן הזה. הוא אינו שם, והרשומות אינן אנונימיות לחלוטין, כי אפשר לקשור אירועים לאותו דפדפן עד למחיקה. רשומה יכולה לכלול את האירוע, את נתיב העמוד בלי פרמטרים, את השפה, את מארח האתר המפנה, סוג מכשיר, וקוד מדינה אם רשת ההפצה מוסרת אותו. היא אינה כוללת שם, דוא״ל, טלפון, טקסט שמקלידים בטופס, סכומים שמקלידים במחשבון, או כתובת IP.",
    meta: "המדידה הזו נפרדת מפרסום באמצעות Meta. פיקסל Meta, והעוגיות _fbp ו־_fbc, נטענים רק אחרי אישור פרסום. אישור פרסום אינו אישור למדידה הזו. אישור המדידה הזו אינו טוען את פיקסל Meta, והמספרים האלה אינם נשלחים אל Meta.",
    consent: "דבר מהסעיף הזה אינו נשמר לפני בחירה מפורשת באנליטיקס לנוסח הנוכחי. בחירה חסרה, סירוב, וערך ישן של all או essential אינם הבחירה הזו. אפשר לאשר אנליטיקס, לסרב, או לשנות את הבחירה אחר כך מהגדרות העוגיות בתחתית האתר ומהכפתור בעמוד הזה.",
    retention: "תקופת השמירה המתוכננת היא כ־180 יום. רשומות ישנות יוצאות במחזור הניקוי של המסד, לא בשנייה מדויקת. כל עוד האיסוף כבוי, אינדקס הניקוי אינו מוחל, כי אין מה למחוק.",
    withdraw: "אפשר לבטל את בחירת האנליטיקס בכל עת. הביטול עוצר אירועים חדשים. הוא אינו משנה את בחירת הפרסום, והוא אינו יוצר מזהה חדש.",
    deletion: "כשבקשת הביטול מתקבלת, ביזאפלי מוחקת את אירועי התוכן ואת רשומת ההסכמה של אותו מזהה. נשאר סימן ביטול אחד, עם אותו מזהה אקראי ובלי היסטוריית העמודים, כדי שעוגייה שנעשה בה שימוש חוזר לא תוכל לרשום אירועים חדשים. הסימן הזה יוצא באותו מחזור ניקוי של כ־180 יום. המחיקה אינה מובטחת לשנייה מדויקת.",
    access: "הדוח מוגבל למנהלי הפלטפורמה. לקוח עסקי ומבקר שאינו מחובר אינם מקבלים אותו.",
    separation: "הרשומות האלה נשמרות באוסף משלהן עבור האתר הציבורי של ביזאפלי. הן נפרדות ממדידה של אתרים שלקוחות עסקיים מפרסמים. בחירה באתר הזה אינה מפעילה מדידה באתר של לקוח.",
    cookiesTitle: "עוגיות המשמשות למדידה הזו",
    change: "הגדרות העוגיות מחליפות את הבחירה הקודמת. כיבוי האנליטיקס הוא הביטול שתואר למעלה. הפעלה מחדש, אחרי שהאיסוף פועל, יוצרת מזהה חדש רק כשהשרת מקבל את ההסכמה החדשה.",
    columns: ["שם", "מי קובע", "למה היא משמשת", "כמה זמן"],
  },
  es: {
    nav: "Medición de contenido",
    title: "Medición de contenido en el sitio público",
    leadOff: "La recogida está apagada. Bizuply no guarda estos eventos ni crea una cookie de medición hasta que usted elija analítica y Bizuply active la recogida. Elegir publicidad, o conservar una elección anterior, no la inicia.",
    leadOn: "La recogida funciona solo después de elegir analítica para este aviso. Las cookies necesarias y una elección de publicidad no la inician.",
    purpose: "La finalidad es ver qué guías, plantillas y otras páginas públicas se leen, y cuáles preceden a una página de producto, a la página de precios o a un registro. Bizuply usa eso para mejorar el centro público de recursos. Los registros no se usan para anunciarle, y no se unen a Google Search Console como si fueran el mismo público.",
    eventsTitle: "Los siete eventos",
    identifier: "El servidor crea un identificador aleatorio y un identificador de visita distinto. Los guarda en una cookie llamada bizuply_measure. Esa cookie es HttpOnly y Secure, está firmada por el servidor y la página no puede leerla. Una segunda cookie, bizuply_measure_hint, solo indica que se permitió la analítica. No contiene el identificador. Usted no puede enviar un identificador propio. Una solicitud que lo intenta es rechazada.",
    notAnonymous: "El identificador aleatorio es un identificador en línea de este navegador. No es un nombre, y los registros no son totalmente anónimos, porque los eventos pueden unirse al mismo navegador hasta que se borren. Un registro puede incluir el evento, la ruta de la página sin parámetros, el idioma, el servidor del sitio de procedencia, una clase de dispositivo y un código de país cuando la red de borde lo aporta. No incluye su nombre, correo, teléfono, el texto que escribe en un formulario, los importes que escribe en una calculadora ni su dirección IP.",
    meta: "Esta medición está separada de la publicidad con Meta. El Meta Pixel, y las cookies _fbp y _fbc, se cargan solo después de permitir la publicidad. Permitir la publicidad no permite esta medición. Permitir esta medición no carga el Meta Pixel, y estos recuentos no se envían a Meta.",
    consent: "Nada de esta sección se guarda antes de una elección explícita de analítica para el aviso vigente. Una elección ausente, un rechazo y un valor antiguo all o essential no son esa elección. Puede permitir la analítica, rechazarla o cambiarla después desde la configuración de cookies del pie y desde el botón de esta página.",
    retention: "La conservación prevista es de unos 180 días. Los registros antiguos salen en el ciclo de limpieza de la base, no en un segundo exacto. Mientras la recogida está apagada, ese índice de limpieza no se aplica, porque no hay nada que borrar.",
    withdraw: "Puede retirar la elección de analítica en cualquier momento. La retirada detiene los eventos nuevos. No cambia la elección de publicidad y no crea un identificador nuevo.",
    deletion: "Cuando se acepta la retirada, Bizuply borra los eventos de contenido y el registro de consentimiento de ese identificador. Queda un marcador de retirada, con el mismo identificador aleatorio y sin el historial de páginas, para que una cookie reutilizada no pueda registrar eventos nuevos. Ese marcador sale en el mismo ciclo de limpieza de unos 180 días. El borrado no se promete en un segundo exacto.",
    access: "El informe se limita a los administradores de la plataforma. Un cliente empresarial y un visitante sin sesión no lo reciben.",
    separation: "Estos registros se guardan en su propia colección para el sitio público de Bizuply. Están separados de la medición de los sitios que publican los clientes empresariales. Una elección en este sitio no activa la medición en el sitio de un cliente.",
    cookiesTitle: "Cookies usadas para esta medición",
    change: "La configuración de cookies sustituye la elección anterior. Apagar la analítica es la retirada descrita arriba. Volver a encenderla, cuando la recogida está activa, crea un identificador nuevo solo cuando el servidor acepta el nuevo consentimiento.",
    columns: ["Nombre", "Quién la crea", "Para qué sirve", "Cuánto tiempo"],
  },
  "pt-BR": {
    nav: "Medição de conteúdo",
    title: "Medição de conteúdo no site público",
    leadOff: "A coleta está desligada. A Bizuply não guarda estes eventos e não cria um cookie de medição até você escolher análise e a Bizuply ligar a coleta. Escolher publicidade, ou manter uma escolha antiga, não inicia isso.",
    leadOn: "A coleta funciona só depois que você escolhe análise para este aviso. Cookies necessários e uma escolha de publicidade não a iniciam.",
    purpose: "A finalidade é ver quais guias, modelos e outras páginas públicas são lidos, e quais deles vêm antes de uma página de produto, da página de preços ou de um cadastro. A Bizuply usa isso para melhorar o centro público de recursos. Os registros não servem para anunciar a você e não são unidos ao Google Search Console como se fossem o mesmo público.",
    eventsTitle: "Os sete eventos",
    identifier: "O servidor cria um identificador aleatório e um identificador de visita separado. Ele os guarda num cookie chamado bizuply_measure. Esse cookie é HttpOnly e Secure, é assinado pelo servidor, e a página não consegue lê-lo. Um segundo cookie, bizuply_measure_hint, só indica que a análise foi permitida. Ele não contém o identificador. Você não pode enviar um identificador próprio. Um pedido que tenta fazer isso é recusado.",
    notAnonymous: "O identificador aleatório é um identificador online deste navegador. Não é um nome, e os registros não são totalmente anônimos, porque os eventos podem ser ligados ao mesmo navegador até serem apagados. Um registro pode incluir o evento, o caminho da página sem parâmetros, o idioma, o servidor do site de origem, uma classe de dispositivo e um código de país quando a rede de borda o informa. Não inclui seu nome, e-mail, telefone, o texto digitado num formulário, os valores digitados numa calculadora nem seu endereço IP.",
    meta: "Esta medição é separada da publicidade com a Meta. O Meta Pixel, e os cookies _fbp e _fbc, carregam só depois que você permite publicidade. Permitir publicidade não permite esta medição. Permitir esta medição não carrega o Meta Pixel, e estas contagens não são enviadas à Meta.",
    consent: "Nada desta seção é guardado antes de uma escolha explícita de análise para o aviso vigente. Uma escolha ausente, uma recusa e um valor antigo all ou essential não são essa escolha. Você pode permitir a análise, recusar ou mudar a escolha depois nas configurações de cookies do rodapé e no botão desta página.",
    retention: "A retenção prevista é de cerca de 180 dias. Registros antigos saem no ciclo de limpeza do banco, não num segundo exato. Enquanto a coleta está desligada, esse índice de limpeza não é aplicado, porque não há o que apagar.",
    withdraw: "Você pode retirar a escolha de análise a qualquer momento. A retirada interrompe eventos novos. Ela não muda a escolha de publicidade e não cria um identificador novo.",
    deletion: "Quando a retirada é aceita, a Bizuply apaga os eventos de conteúdo e o registro de consentimento daquele identificador. Fica um marcador de retirada, com o mesmo identificador aleatório e sem o histórico de páginas, para que um cookie reutilizado não possa registrar eventos novos. Esse marcador sai no mesmo ciclo de limpeza de cerca de 180 dias. A exclusão não é prometida num segundo exato.",
    access: "O relatório fica limitado aos administradores da plataforma. Um cliente empresarial e um visitante sem sessão não o recebem.",
    separation: "Estes registros ficam numa coleção própria do site público da Bizuply. Eles são separados da medição dos sites que clientes empresariais publicam. Uma escolha neste site não liga a medição no site de um cliente.",
    cookiesTitle: "Cookies usados nesta medição",
    change: "As configurações de cookies substituem a escolha anterior. Desligar a análise é a retirada descrita acima. Ligar de novo, depois que a coleta está ativa, cria um identificador novo só quando o servidor aceita o novo consentimento.",
    columns: ["Nome", "Quem cria", "Para que serve", "Por quanto tempo"],
  },
  ar: {
    nav: "قياس المحتوى",
    title: "قياس المحتوى في الموقع العام",
    leadOff: "الجمع متوقف. لا تحفظ Bizuply هذه الأحداث ولا تضع كعكة قياس إلى أن تختاروا التحليلات وتُشغّل Bizuply الجمع. اختيار الإعلان، أو إبقاء اختيار قديم، لا يبدأ ذلك.",
    leadOn: "يعمل الجمع فقط بعد اختيار التحليلات لهذا الإشعار. ملفات الارتباط الضرورية واختيار الإعلان لا يبدأانه.",
    purpose: "الغرض هو معرفة أي الأدلة والقوالب وصفحات الموارد العامة تُقرأ، وأيها يسبق صفحة منتج أو صفحة الأسعار أو تسجيلاً. تستخدم Bizuply ذلك لتحسين مركز الموارد العام. لا تُستخدم السجلات للإعلان لكم، ولا تُدمج مع Google Search Console كأن الجمهور واحد.",
    eventsTitle: "الأحداث السبعة",
    identifier: "ينشئ الخادم معرّفاً عشوائياً ومعرّف زيارة منفصلاً. يحفظهما في كعكة اسمها bizuply_measure. هذه الكعكة HttpOnly وSecure، وموقّعة من الخادم، والصفحة لا تستطيع قراءتها. كعكة ثانية، bizuply_measure_hint، تشير فقط إلى أن التحليلات سُمح بها. لا تحتوي المعرّف. لا يمكنكم إرسال معرّف من عندكم. الطلب الذي يحاول ذلك يُرفض.",
    notAnonymous: "المعرّف العشوائي معرّف عبر الإنترنت لهذا المتصفح. ليس اسماً، والسجلات ليست مجهولة تماماً، لأن الأحداث يمكن ربطها بالمتصفح نفسه إلى أن تُحذف. يمكن أن يتضمن السجل الحدث، ومسار الصفحة بلا معاملات، واللغة، ومضيف الموقع المحيل، وفئة الجهاز، ورمز بلد إذا قدّمته شبكة التوزيع. لا يتضمن الاسم أو البريد أو الهاتف أو النص المكتوب في نموذج أو المبالغ المكتوبة في حاسبة أو عنوان IP.",
    meta: "هذا القياس منفصل عن الإعلان عبر Meta. يُحمَّل Meta Pixel، وكعكتا _fbp و_fbc، فقط بعد السماح بالإعلان. السماح بالإعلان لا يسمح بهذا القياس. السماح بهذا القياس لا يحمّل Meta Pixel، وهذه الأعداد لا تُرسل إلى Meta.",
    consent: "لا يُحفظ شيء من هذا القسم قبل اختيار صريح للتحليلات للإشعار الحالي. الاختيار الغائب والرفض والقيمة القديمة all أو essential ليست هذا الاختيار. يمكن السماح بالتحليلات أو رفضها أو تغيير الاختيار لاحقاً من إعدادات ملفات الارتباط في التذييل ومن الزر في هذه الصفحة.",
    retention: "مدة الحفظ المخططة نحو 180 يوماً. تخرج السجلات القديمة في دورة تنظيف قاعدة البيانات، وليس في ثانية محددة. ما دام الجمع متوقفاً، لا يُطبَّق فهرس التنظيف، لأنه لا يوجد ما يُحذف.",
    withdraw: "يمكن سحب اختيار التحليلات في أي وقت. السحب يوقف الأحداث الجديدة. لا يغيّر اختيار الإعلان، ولا ينشئ معرّفاً جديداً.",
    deletion: "عندما يُقبل السحب، تحذف Bizuply أحداث المحتوى وسجل الموافقة لذلك المعرّف. يبقى علامة سحب واحدة، بالمعرّف العشوائي نفسه ومن غير سجل الصفحات، حتى لا تستطيع كعكة أُعيد استخدامها تسجيل أحداث جديدة. تخرج هذه العلامة في دورة التنظيف نفسها بعد نحو 180 يوماً. الحذف غير مضمون في ثانية محددة.",
    access: "التقرير مقصور على مديري المنصة. عميل النشاط التجاري والزائر غير المسجّل لا يتلقيانه.",
    separation: "تُحفظ هذه السجلات في مجموعة خاصة بالموقع العام لـ Bizuply. هي منفصلة عن قياس المواقع التي ينشرها العملاء التجاريون. اختيار في هذا الموقع لا يُشغّل القياس في موقع عميل.",
    cookiesTitle: "ملفات الارتباط المستخدمة لهذا القياس",
    change: "إعدادات ملفات الارتباط تستبدل الاختيار السابق. إيقاف التحليلات هو السحب الموصوف أعلاه. تشغيلها من جديد، بعد أن يعمل الجمع، ينشئ معرّفاً جديداً فقط عندما يقبل الخادم الموافقة الجديدة.",
    columns: ["الاسم", "من يضعها", "الغرض", "المدة"],
  },
};

const COOKIES = [
  {
    name: "bizuply_measure",
    who: {
      en: "Bizuply server",
      he: "שרת ביזאפלי",
      es: "Servidor de Bizuply",
      "pt-BR": "Servidor da Bizuply",
      ar: "خادم Bizuply",
    },
    purpose: {
      en: "Carries the random identifier and the visit identifier after analytics consent. HttpOnly, Secure, SameSite=Lax, signed by the server.",
      he: "נושאת את המזהה האקראי ואת מזהה הביקור אחרי הסכמה לאנליטיקס. HttpOnly,‏ Secure,‏ SameSite=Lax, וחתומה בידי השרת.",
      es: "Lleva el identificador aleatorio y el de la visita después del consentimiento de analítica. HttpOnly, Secure, SameSite=Lax, firmada por el servidor.",
      "pt-BR": "Carrega o identificador aleatório e o da visita depois do consentimento de análise. HttpOnly, Secure, SameSite=Lax, assinada pelo servidor.",
      ar: "تحمل المعرّف العشوائي ومعرّف الزيارة بعد موافقة التحليلات. HttpOnly وSecure وSameSite=Lax وموقّعة من الخادم.",
    },
    duration: {
      en: "About 180 days, or until you withdraw analytics.",
      he: "כ־180 יום, או עד לביטול האנליטיקס.",
      es: "Unos 180 días, o hasta retirar la analítica.",
      "pt-BR": "Cerca de 180 dias, ou até retirar a análise.",
      ar: "نحو 180 يوماً، أو حتى سحب التحليلات.",
    },
  },
  {
    name: "bizuply_measure_hint",
    who: {
      en: "Bizuply server",
      he: "שרת ביזאפלי",
      es: "Servidor de Bizuply",
      "pt-BR": "Servidor da Bizuply",
      ar: "خادم Bizuply",
    },
    purpose: {
      en: "Says only that analytics was allowed, so the page can send an event. It does not contain the identifier.",
      he: "מציינת רק שהאנליטיקס אושר, כדי שהעמוד יוכל לשלוח אירוע. אין בה את המזהה.",
      es: "Solo indica que se permitió la analítica, para que la página pueda enviar un evento. No contiene el identificador.",
      "pt-BR": "Indica só que a análise foi permitida, para a página poder enviar um evento. Não contém o identificador.",
      ar: "تشير فقط إلى أن التحليلات سُمح بها، حتى تستطيع الصفحة إرسال حدث. لا تحتوي المعرّف.",
    },
    duration: {
      en: "About 180 days, or until you withdraw analytics.",
      he: "כ־180 יום, או עד לביטול האנליטיקס.",
      es: "Unos 180 días, o hasta retirar la analítica.",
      "pt-BR": "Cerca de 180 dias, ou até retirar a análise.",
      ar: "نحو 180 يوماً، أو حتى سحب التحليلات.",
    },
  },
  {
    name: "bizuply_tracking",
    who: {
      en: "This site",
      he: "האתר הזה",
      es: "Este sitio",
      "pt-BR": "Este site",
      ar: "هذا الموقع",
    },
    purpose: {
      en: "Stores the advertising choice, and the analytics choice once that choice exists. It is not the measurement identifier. An older value of all is advertising only.",
      he: "שומרת את בחירת הפרסום, ואת בחירת האנליטיקס אחרי שהבחירה הזו קיימת. היא אינה מזהה המדידה. ערך ישן של all הוא פרסום בלבד.",
      es: "Guarda la elección de publicidad y, cuando existe, la de analítica. No es el identificador de medición. Un valor antiguo all es solo publicidad.",
      "pt-BR": "Guarda a escolha de publicidade e, quando existe, a de análise. Não é o identificador de medição. Um valor antigo all é só publicidade.",
      ar: "تحفظ اختيار الإعلان، واختيار التحليلات بعد أن يوجد. ليست معرّف القياس. القيمة القديمة all إعلان فقط.",
    },
    duration: {
      en: "About 180 days.",
      he: "כ־180 יום.",
      es: "Unos 180 días.",
      "pt-BR": "Cerca de 180 dias.",
      ar: "نحو 180 يوماً.",
    },
  },
];

export function measurementNotice(language) {
  const locale = LOCALES.includes(language) ? language : language === "pt" ? "pt-BR" : "en";
  const copy = COPY[locale];
  return {
    ...copy,
    events: EVENTS.map(([id, label]) => ({ id, label: label[locale] })),
    cookies: COOKIES.map((row) => ({
      name: row.name,
      who: pick(row.who, locale),
      purpose: pick(row.purpose, locale),
      duration: pick(row.duration, locale),
    })),
  };
}

export function measurementNoticeLocales() {
  return LOCALES;
}
