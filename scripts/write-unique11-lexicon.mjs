#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
function r(en, es, pt, ar) {
  return { en, es, "pt-BR": pt, ar };
}

const unique11 = {
  "שיפוץ מקלחת אחרי נזק מים הסתיים בזמן, בלי הפתעות במחיר. העבודה נראית מדויקת וחזקה.": r(
    "The shower renovation after water damage finished on time, with no price surprises. The work looks precise and strong.",
    "La reforma del baño tras un daño de agua terminó a tiempo, sin sorpresas de precio. El trabajo se ve preciso y sólido.",
    "A reforma do chuveiro após dano de água terminou no prazo, sem surpresas de preço. O trabalho parece preciso e forte.",
    "تجديد الدش بعد ضرر المياه انتهى في الوقت، بلا مفاجآت في السعر. العمل يبدو دقيقاً وقوياً.",
  ),
  "שלושה אימוני כוח בשבוע, יעד קלורי אישי וצ׳ק-אין קבוע כדי להוריד שומן בלי לאבד כוח.": r(
    "Three strength sessions a week, a personal calorie target, and a regular check-in to lose fat without losing strength.",
    "Tres entrenos de fuerza a la semana, un objetivo calórico personal y un check-in fijo para bajar grasa sin perder fuerza.",
    "Três treinos de força por semana, uma meta calórica pessoal e um check-in fixo para baixar gordura sem perder força.",
    "ثلاثة تدريبات قوة في الأسبوع وهدف سعرات شخصي ومتابعة ثابتة لإنقاص الدهون دون فقدان القوة.",
  ),
  "משאירים פרטים, עושים שיחת אבחון קצרה ומקבלים המלצה למסלול שמתאים ליעד ולשגרה שלכם.": r(
    "Leave details, do a short diagnosis call, and get a track suggestion that fits your goal and routine.",
    "Dejáis datos, hacéis una llamada de diagnóstico breve y recibís una recomendación de itinerario que encaja con vuestro objetivo y rutina.",
    "Deixam os dados, fazem uma conversa curta de diagnóstico e recebem uma recomendação de percurso que cabe na meta e na rotina de vocês.",
    "تتركون بيانات وتجرون مكالمة تشخيص قصيرة وتحصلون على توصية مسار تناسب هدفكم وروتينكم.",
  ),
  "סינדר היא בית קלייה ושולחן טעימות. פולים טריים, חליטות מדויקות, ואווירה בלי הצגות.": r(
    "Cinder is a roast house and a tasting table. Fresh beans, precise brews, and an atmosphere without a show.",
    "Cinder es una casa de tueste y una mesa de cata. Granos frescos, infusiones precisas y un ambiente sin teatro.",
    "A Cinder é uma casa de torra e uma mesa de degustação. Grãos frescos, extrações precisas e uma atmosfera sem encenação.",
    "سيندر بيت تحميص وطاولة تذوّق. حبوب طازجة وتحضيرات دقيقة وأجواء بلا عروض.",
  ),
  "הצוות הכי מקצועי שעבדנו איתו. הבינו אותנו מהר, ותרגמו את החזון בדיוק לאיך שדמיינו.": r(
    "The most professional team we have worked with. They understood us fast and translated the vision exactly as we imagined.",
    "El equipo más profesional con el que hemos trabajado. Nos entendieron rápido y tradujeron la visión exactamente como la imaginamos.",
    "A equipe mais profissional com quem trabalhamos. Entenderam a gente rápido e traduziram a visão exatamente como imaginamos.",
    "الفريق الأكثر احترافاً الذي عملنا معه. فهمونا بسرعة وترجموا الرؤية بالضبط كما تخيلناها.",
  ),
  "השתמשו בסקשן הסיום הזה לאיסוף לידים, קביעת שיחות או הפניית מבקרים לעמוד יצירת הקשר.": r(
    "Use this closing section to collect leads, book calls, or send visitors to the contact page.",
    "Usad esta sección final para recoger leads, concertar llamadas o dirigir visitantes a la página de contacto.",
    "Usem esta seção final para coletar leads, marcar conversas ou enviar visitantes à página de contato.",
    "استخدموا قسم الختام هذا لجمع العملاء المحتملين أو حجز مكالمات أو توجيه الزوار إلى صفحة التواصل.",
  ),
  "נוצר לנוחות, מעוצב לשמירה על מבנה ומיועד לשבת מושלם בתוך בלוק מוצר עיתונאי פרימיום.": r(
    "Made for comfort, designed to hold structure, and meant to sit perfectly inside a premium editorial product block.",
    "Creado para la comodidad, diseñado para mantener la estructura y pensado para sentarse perfecto dentro de un bloque de producto editorial premium.",
    "Feito para conforto, desenhado para manter a estrutura e pensado para sentar perfeito dentro de um bloco de produto editorial premium.",
    "صُنع للراحة وصُمم للحفاظ على البنية ومعدّ ليجلس مثالياً داخل كتلة منتج صحفية فاخرة.",
  ),
  "עמוד קולקציה נקי לכל המוצרים, הדרופים והקטגוריות. משתמש באותם כרטיסים כמו בדף הבית.": r(
    "A clean collection page for all products, drops, and categories. It uses the same cards as the home page.",
    "Una página de colección limpia para todos los productos, drops y categorías. Usa las mismas tarjetas que en la home.",
    "Uma página de coleção limpa para todos os produtos, drops e categorias. Usa os mesmos cartões da home.",
    "صفحة مجموعة نظيفة لكل المنتجات والدروبات والفئات. تستخدم نفس البطاقات كما في الصفحة الرئيسية.",
  ),
  "ספרו לנו מה צריך להצטלם, לאן התמונות מיועדות ומה הדדליין. נחזור עם כיוון הפקה ברור.": r(
    "Tell us what needs to be photographed, where the images will go, and the deadline. We will come back with a clear production direction.",
    "Decid qué hay que fotografiar, para dónde van las fotos y cuál es el deadline. Volveremos con una dirección de producción clara.",
    "Digam o que precisa ser fotografado, para onde as fotos vão e qual é o prazo. Voltaremos com uma direção de produção clara.",
    "أخبرونا ماذا يجب تصويره وأين ستُستخدم الصور وما الموعد النهائي. سنعود باتجاه إنتاج واضح.",
  ),
  "החליפו בין מצב התחלתי לתכנון הסופי וראו איך שינוי קטן בפרופורציות משנה את כל ההבעה.": r(
    "Switch between the starting state and the final plan and see how a small change in proportion changes the whole expression.",
    "Cambiad entre el estado inicial y el plan final y ved cómo un cambio pequeño de proporciones cambia toda la expresión.",
    "Troquem entre o estado inicial e o plano final e vejam como uma mudança pequena nas proporções muda toda a expressão.",
    "بدّلوا بين الحالة الابتدائية والتخطيط النهائي وانظروا كيف يغيّر تغيير صغير في النِسَب التعبير كله.",
  ),
  "כן, אנחנו עובדים עם מרבית קופות החולים והביטוחים המשלימים. נשמח לבדוק עבורכם זכאות.": r(
    "Yes, we work with most health funds and supplementary insurance. We will gladly check eligibility for you.",
    "Sí, trabajamos con la mayoría de las mutuas y seguros complementarios. Estaremos encantados de comprobar la elegibilidad por vosotros.",
    "Sim, trabalhamos com a maioria dos planos de saúde e seguros complementares. Teremos prazer em checar a elegibilidade para vocês.",
    "نعم، نعمل مع معظم صناديق المرضى والتأمينات التكميلية. يسعدنا فحص الأهلية لكم.",
  ),
  "פיתוח מודל זכיינות, חוברות הפעלה וגיוס זכיינים למותגים שרוצים לצמוח בלי לאבד שליטה.": r(
    "Building a franchise model, operations manuals, and recruiting franchisees for brands that want to grow without losing control.",
    "Desarrollar un modelo de franquicia, manuales de operación y captar franquiciados para marcas que quieren crecer sin perder el control.",
    "Desenvolver um modelo de franquia, manuais de operação e recrutar franqueados para marcas que querem crescer sem perder o controle.",
    "تطوير نموذج امتياز وكتيبات تشغيل وتجنيد أصحاب امتياز لعلامات تريد النمو دون فقدان السيطرة.",
  ),
  "בדיקה משפטית וליווי חוזי שמנעו סיכונים משמעותיים לפני חתימה והבטיחו עסקה בטוחה יותר.": r(
    "Legal review and contract support that prevented significant risks before signing and made the deal safer.",
    "Una revisión jurídica y un acompañamiento contractual que evitaron riesgos importantes antes de firmar y aseguraron una operación más segura.",
    "Uma revisão jurídica e um acompanhamento contratual que evitaram riscos importantes antes da assinatura e deixaram o negócio mais seguro.",
    "فحص قانوني ومرافقة تعاقدية منعا مخاطر جوهرية قبل التوقيع وضمنا صفقة أكثر أماناً.",
  ),
  "הצצה קצרה לאווירה, לחדרי הטיפול ולדרך שבה אנחנו בונות לכל לקוחה חוויה רגועה ומדויקת.": r(
    "A short look at the atmosphere, the treatment rooms, and how we build a calm, precise experience for every client.",
    "Una mirada breve al ambiente, a las salas de tratamiento y a cómo construimos para cada clienta una experiencia calmada y precisa.",
    "Um olhar curto à atmosfera, às salas de tratamento e ao jeito como construímos para cada cliente uma experiência calma e precisa.",
    "لمحة قصيرة عن الأجواء وغرف العلاج والطريقة التي نبني بها لكل زبونة تجربة هادئة ودقيقة.",
  ),
  "הפכנו את Fluxora לטקס בוקר של הצוות. כולם מדברים על אותם מאמרים ומגיעים מוכנים יותר.": r(
    "We turned Fluxora into the team’s morning ritual. Everyone talks about the same articles and shows up more prepared.",
    "Convertimos Fluxora en el ritual de mañana del equipo. Todos hablan de los mismos artículos y llegan más preparados.",
    "Transformamos a Fluxora no ritual da manhã da equipe. Todo mundo fala dos mesmos artigos e chega mais preparado.",
    "حوّلنا Fluxora إلى طقس صباح الفريق. الجميع يتحدث عن المقالات نفسها ويصلون أكثر استعداداً.",
  ),
  "כן. התוכנית החינמית כוללת פיד מותאם, קהילות בסיסיות ותוסף דפדפן. אפשר לשדרג בכל רגע.": r(
    "Yes. The free plan includes a tailored feed, basic communities, and a browser add-on. You can upgrade at any moment.",
    "Sí. El plan gratuito incluye un feed adaptado, comunidades básicas y un extra de navegador. Se puede subir de plan en cualquier momento.",
    "Sim. O plano gratuito inclui um feed adaptado, comunidades básicas e um extra de navegador. Dá para fazer upgrade a qualquer momento.",
    "نعم. الخطة المجانية تشمل خلاصة ملائمة ومجتمعات أساسية وإضافة متصفح. يمكن الترقية في أي لحظة.",
  ),
  "עיצוב גבות והרמת ריסים במראה נקי, מאוזן ולא עשוי מדי, להדגשת המבט בלי לוותר על רכות.": r(
    "Brow design and a lash lift in a clean, balanced look that is not overdone, to lift the gaze without giving up softness.",
    "Diseño de cejas y lifting de pestañas con un look limpio, equilibrado y nada recargado, para destacar la mirada sin renunciar a la suavidad.",
    "Design de sobrancelhas e lifting de cílios num visual limpo, equilibrado e nada carregado, para destacar o olhar sem abrir mão da suavidade.",
    "تصميم حواجب ورفع رموش بمظهر نظيف ومتوازن وغير مبالغ، لإبراز النظرة دون التخلي عن النعومة.",
  ),
  "השאירו פרטים או התקשרו עכשיו. נבין את התקלה, נשלח צוות מתאים ונעדכן מחיר לפני עבודה.": r(
    "Leave details or call now. We will understand the issue, send the right crew, and confirm a price before work starts.",
    "Dejad datos o llamad ahora. Entenderemos la avería, enviaremos un equipo adecuado y actualizaremos el precio antes de trabajar.",
    "Deixem os dados ou liguem agora. Vamos entender o problema, enviar a equipe certa e confirmar o preço antes do trabalho.",
    "اتركوا بيانات أو اتصلوا الآن. سنفهم العطل ونرسل فريقاً مناسباً ونحدّث السعر قبل العمل.",
  ),
  "Advisora הכריחו אותנו לבחור. תוך חודש ידענו על מה מפסיקים לעבוד ועל מה מכפילים מאמץ.": r(
    "Advisora forced us to choose. Within a month we knew what to stop working on and where to double the effort.",
    "Advisora nos obligó a elegir. En un mes sabíamos en qué dejar de trabajar y en qué duplicar el esfuerzo.",
    "A Advisora nos obrigou a escolher. Em um mês sabíamos no que parar de trabalhar e no que dobrar o esforço.",
    "Advisora أجبرتنا على الاختيار. خلال شهر عرفنا على ماذا نتوقف عن العمل وعلى ماذا نضاعف الجهد.",
  ),
  "לא לשיחת ההיכרות. לפני אבחון מלא נבקש דוחות בסיסיים, מבנה צוות, יעדים ומדדים קיימים.": r(
    "Not for the intro call. Before a full diagnosis we will ask for basic reports, team structure, goals, and current metrics.",
    "No para la llamada de presentación. Antes de un diagnóstico completo pediremos informes básicos, estructura de equipo, objetivos y métricas existentes.",
    "Não para a conversa de apresentação. Antes de um diagnóstico completo pediremos relatórios básicos, estrutura de equipe, metas e métricas existentes.",
    "ليس لمكالمة التعارف. قبل تشخيص كامل سنطلب تقارير أساسية وهيكل فريق وأهدافاً ومؤشرات قائمة.",
  ),
  "Markora לא צבעו לנו מודעות. הם שינו את הדרך שבה אנחנו חושבים על ניסוי, תקציב וסקייל.": r(
    "Markora did not just paint ads for us. They changed how we think about testing, budget, and scale.",
    "Markora no nos pintó anuncios. Cambiaron la forma en que pensamos sobre ensayo, presupuesto y escala.",
    "A Markora não pintou anúncios para nós. Mudaram o jeito como pensamos em teste, orçamento e escala.",
    "Markora لم ترسم لنا إعلانات. غيّروا الطريقة التي نفكر بها في التجربة والميزانية والتوسّع.",
  ),
  "העבודה שלנו בנויה על סגירת חודש קבועה, בדיקות כפולות ותיעוד שנגיש לבעל העסק בכל רגע.": r(
    "Our work is built on a fixed month-end close, double checks, and documentation the owner can reach at any moment.",
    "Nuestro trabajo se apoya en un cierre de mes fijo, dobles revisiones y documentación accesible para el dueño en cualquier momento.",
    "Nosso trabalho se apoia num fechamento de mês fixo, checagens duplas e documentação acessível ao dono a qualquer momento.",
    "عملنا مبني على إغلاق شهر ثابت وفحوصات مزدوجة وتوثيق يصل إليه صاحب العمل في أي لحظة.",
  ),
  "רצפים שמחזקים ליבה, גב ורגליים דרך החזקה חכמה, מעברים איטיים ותשומת לב לפרטים קטנים.": r(
    "Sequences that strengthen core, back, and legs through smart holds, slow transitions, and attention to small details.",
    "Secuencias que refuerzan core, espalda y piernas a través de una contención inteligente, transiciones lentas y atención a los detalles pequeños.",
    "Sequências que fortalecem core, costas e pernas por retenção inteligente, transições lentas e atenção aos detalhes pequenos.",
    "تسلسلات تقوّي الجذع والظهر والساقين عبر تثبيت ذكي وانتقالات بطيئة وانتباه للتفاصيل الصغيرة.",
  ),
  "אזור יום פעיל, חדרי שינה שקטים וחצר מוצלת מאפשרים לכל כלב או חתול למצוא את הקצב שלו.": r(
    "An active day area, quiet sleeping rooms, and a shaded yard let every dog or cat find its own pace.",
    "Una zona de día activa, habitaciones de sueño silenciosas y un patio sombreado permiten a cada perro o gato encontrar su ritmo.",
    "Uma área de dia ativa, quartos de sono silenciosos e um quintal sombreado permitem a cada cão ou gato achar o próprio ritmo.",
    "منطقة نهار نشطة وغرف نوم هادئة وفناء مظلل تتيح لكل كلب أو قط إيجاد إيقاعه.",
  ),
  "אנחנו בוחנים את המגדל כולו: שכנים, מעליות, ניהול, נוף והיכולת לחזור הביתה בלי חיכוך.": r(
    "We look at the whole tower: neighbors, elevators, management, views, and the ability to come home without friction.",
    "Examinamos toda la torre: vecinos, ascensores, gestión, vistas y la capacidad de volver a casa sin fricción.",
    "Examinamos a torre inteira: vizinhos, elevadores, gestão, vista e a capacidade de voltar para casa sem atrito.",
    "نفحص البرج كله: الجيران والمصاعد والإدارة والإطلالة والقدرة على العودة إلى البيت بلا احتكاك.",
  ),
  "צוות סוכנות יחסי ציבור שעובד צמוד ללקוח: אבחון, תכנון, ביצוע ומדידה — בלי רעש מיותר.": r(
    "A PR-agency team that works close to the client: diagnosis, plan, execution, and measurement — without extra noise.",
    "Un equipo de agencia de relaciones públicas que trabaja cerca del cliente: diagnóstico, planificación, ejecución y medición — sin ruido de más.",
    "Uma equipe de agência de RP que trabalha perto do cliente: diagnóstico, planejamento, execução e medição — sem ruído extra.",
    "فريق وكالة علاقات عامة يعمل قرب العميل: تشخيص وتخطيط وتنفيذ وقياس — بلا ضجيج زائد.",
  ),
  "כן. נתוני התבנית כוללים מערך מוצרים ניתן לעריכה עם תמונה, כותרת, קטגוריה, תגית ומחיר.": r(
    "Yes. The template data includes an editable product set with image, title, category, tag, and price.",
    "Sí. Los datos de la plantilla incluyen un conjunto de productos editable con imagen, título, categoría, etiqueta y precio.",
    "Sim. Os dados do modelo incluem um conjunto de produtos editável com imagem, título, categoria, tag e preço.",
    "نعم. بيانات القالب تشمل مجموعة منتجات قابلة للتحرير بصورة وعنوان وفئة ووسم وسعر.",
  ),
  "איזה מסמכים להביא, אילו שאלות לשאול ואיך להבין את האפשרויות המשפטיות כבר בתחילת הדרך.": r(
    "Which documents to bring, which questions to ask, and how to understand the legal options from the start of the road.",
    "Qué documentos traer, qué preguntas hacer y cómo entender las opciones jurídicas ya al principio del camino.",
    "Quais documentos trazer, quais perguntas fazer e como entender as opções jurídicas já no começo do caminho.",
    "أي مستندات تُحضر وأي أسئلة تُسأل وكيف تُفهم الخيارات القانونية من بداية الطريق.",
  ),
  "מהרגע שנכנסתי הכול הרגיש יוקרתי ומרגיע. הטיפול היה מדויק והתוצאה נשארה יפה לאורך זמן.": r(
    "From the moment I walked in everything felt luxurious and calming. The treatment was precise and the result stayed beautiful over time.",
    "Desde que entré todo se sintió de lujo y relajante. El tratamiento fue preciso y el resultado se mantuvo bonito con el tiempo.",
    "Desde que entrei tudo pareceu luxuoso e calmante. O tratamento foi preciso e o resultado ficou bonito com o tempo.",
    "من لحظة دخولي بدا كل شيء فاخراً ومريحاً. العلاج كان دقيقاً والنتيجة بقيت جميلة على مدى الزمن.",
  ),
  "בלי אייקונים, בלי רעש. רק רצועות טקסט צפות שמספרות מה הגוף מרגיש כשהתרגול נעשה מדויק.": r(
    "No icons, no noise. Only floating text bands that tell what the body feels when the practice is precise.",
    "Sin iconos, sin ruido. Solo bandas de texto flotantes que cuentan lo que el cuerpo siente cuando el ejercicio se hace preciso.",
    "Sem ícones, sem ruído. Só faixas de texto flutuantes que contam o que o corpo sente quando o exercício é preciso.",
    "بلا أيقونات وبلا ضجيج. فقط أشرطة نص عائمة تحكي ماذا يشعر الجسد حين يكون التمرين دقيقاً.",
  ),
  "הדבר הכי מרשים הוא ההסבר של כל פעולה. הצוותים סומכים על המערכת כי היא לא מסתירה כלום.": r(
    "The most impressive thing is the explanation of every action. Teams trust the system because it hides nothing.",
    "Lo más impresionante es la explicación de cada acción. Los equipos confían en el sistema porque no esconde nada.",
    "O mais impressionante é a explicação de cada ação. As equipes confiam no sistema porque ele não esconde nada.",
    "أكثر ما يبهر هو شرح كل فعل. الفرق تثق بالنظام لأنه لا يخفي شيئاً.",
  ),
  "נבחר יחד גוונים, גודל, ברכה ושעת משלוח. אפשר להזמין זר יחיד, מנוי או עיצוב אירוע מלא.": r(
    "Together we will choose tones, size, a greeting, and a delivery time. You can order a single bouquet, a subscription, or a full event design.",
    "Elegiremos juntos tonos, tamaño, una felicitación y la hora de entrega. Se puede pedir un ramo suelto, una suscripción o un diseño de evento completo.",
    "Escolheremos juntos tons, tamanho, uma mensagem e o horário de entrega. Dá para pedir um arranjo único, uma assinatura ou um design de evento completo.",
    "سنختار معاً الدرجات والحجم والتحية وساعة التوصيل. يمكن طلب باقة واحدة أو اشتراك أو تصميم مناسبة كامل.",
  ),
  "חתונות ואירועים פרטיים עם קו עיצובי נקי, רגש מדויק, והפקה שנשארת רגועה מאחורי הקלעים.": r(
    "Weddings and private events with a clean design line, precise emotion, and a production that stays calm backstage.",
    "Bodas y eventos privados con una línea de diseño limpia, emoción precisa y una producción que se mantiene calmada entre bambalinas.",
    "Casamentos e eventos particulares com uma linha de design limpa, emoção precisa e uma produção que permanece calma nos bastidores.",
    "حفلات زفاف ومناسبات خاصة بخط تصميم نظيف وعاطفة دقيقة وإنتاج يبقى هادئاً خلف الكواليس.",
  ),
  "המוצרים החיים מתוסף החנות נכנסים לסקרולר חשוך, עם מחיר בשקלים ומפרט קצר לבחירה מהירה.": r(
    "Live products from the store add-on enter a dark scroller, with a clear price and a short spec for a fast choice.",
    "Los productos vivos del extra de tienda entran en un scroller oscuro, con un precio claro y una ficha breve para elegir rápido.",
    "Os produtos ao vivo do extra da loja entram num scroller escuro, com um preço claro e um resumo curto para escolher rápido.",
    "المنتجات الحية من إضافة المتجر تدخل شريطاً داكناً، بسعر واضح ومواصفات قصيرة لاختيار سريع.",
  ),
  "החבילות משתנות לפי הפיצ׳רים שנבחרים, מגבלות שימוש, רמת שירות והדרישות הכוללות של העסק.": r(
    "Packages change with the features you pick, usage limits, service level, and the overall needs of the business.",
    "Los paquetes cambian según las funciones que se eligen, los límites de uso, el nivel de servicio y los requisitos generales del negocio.",
    "Os pacotes mudam conforme os recursos escolhidos, os limites de uso, o nível de serviço e as exigências gerais do negócio.",
    "الباقات تتغير حسب الميزات المختارة وحدود الاستخدام ومستوى الخدمة ومتطلبات العمل الشاملة.",
  ),
  "כי בנדל״ן יוקרתי או אישי עדיף לפעמים לסנן פניות, להבין התאמה ולמסור פרטים בשיחה פרטית.": r(
    "Because in luxury or personal real estate it is sometimes better to filter inquiries, check fit, and share details in a private call.",
    "Porque en inmobiliaria de lujo o personal a veces conviene filtrar consultas, entender el encaje y dar detalles en una conversación privada.",
    "Porque em imobiliário de luxo ou pessoal às vezes vale filtrar contatos, entender o encaixe e passar detalhes numa conversa particular.",
    "لأن في العقار الفاخر أو الشخصي يفضل أحياناً تصفية الاستفسارات وفهم الملاءمة وتقديم التفاصيل في حديث خاص.",
  ),
  "השתמשו בעמוד יצירת הקשר לשאלות סטיילינג, תמיכה בהזמנות, שיתופי פעולה או פניות לסטודיו.": r(
    "Use the contact page for styling questions, order support, collaborations, or studio inquiries.",
    "Usad la página de contacto para preguntas de styling, soporte de pedidos, colaboraciones o consultas al estudio.",
    "Usem a página de contato para perguntas de styling, suporte de pedidos, colaborações ou contatos com o estúdio.",
    "استخدموا صفحة التواصل لأسئلة الستايلنغ ودعم الطلبات والشراكات أو استفسارات الاستوديو.",
  ),
  "מאלפי מקורות מקצועיים שנבדקים ברציפות — בלוגים, מחקרים, ניוזלטרים ומגזינים טכנולוגיים.": r(
    "From thousands of professional sources checked continuously — blogs, research, newsletters, and tech magazines.",
    "De miles de fuentes profesionales revisadas de forma continua — blogs, estudios, newsletters y revistas tecnológicas.",
    "De milhares de fontes profissionais checadas de forma contínua — blogs, pesquisas, newsletters e revistas de tecnologia.",
    "من آلاف المصادر المهنية التي تُفحص باستمرار — مدونات وأبحاث ونشرات ومجلات تقنية.",
  ),
  "ארוחות שף, טעימות יין, השקות אינטימיות וחגיגות משפחתיות בחלל שמרגיש אישי מהרגע הראשון.": r(
    "Chef dinners, wine tastings, intimate launches, and family celebrations in a space that feels personal from the first moment.",
    "Cenas de chef, catas de vino, lanzamientos íntimos y celebraciones familiares en un espacio que se siente personal desde el primer momento.",
    "Jantares de chef, degustações de vinho, lançamentos íntimos e celebrações familiares num espaço que parece pessoal desde o primeiro momento.",
    "وجبات شيف وتذوّق نبيذ وإطلاقات حميمة واحتفالات عائلية في فراغ يبدو شخصياً من اللحظة الأولى.",
  ),
  "חברות שירותים, SaaS, מסחר ועסקים בצמיחה שמרגישים שהניהול הקיים כבר לא מספיק לקצב החדש.": r(
    "Service companies, SaaS, commerce, and growing businesses that feel the current management is no longer enough for the new pace.",
    "Empresas de servicios, SaaS, comercio y negocios en crecimiento que sienten que la gestión actual ya no llega al ritmo nuevo.",
    "Empresas de serviços, SaaS, comércio e negócios em crescimento que sentem que a gestão atual já não chega ao ritmo novo.",
    "شركات خدمات وSaaS وتجارة وأعمال في نمو تشعر أن الإدارة القائمة لم تعد تكفي للإيقاع الجديد.",
  ),
  "הרגשנו שיש מישהי שמחזיקה את כל הפרטים, אבל משאירה לנו את ההתרגשות. היום עבר קל ומושלם.": r(
    "We felt someone was holding every detail, but leaving us the excitement. The day went easy and perfect.",
    "Sentimos que había alguien que sostenía todos los detalles, pero nos dejaba la emoción. El día pasó fácil y perfecto.",
    "Sentimos que havia alguém segurando todos os detalhes, mas nos deixando a emoção. O dia passou leve e perfeito.",
    "شعرنا أن هناك من تمسك بكل التفاصيل، لكنها تترك لنا الحماس. مرّ اليوم خفيفاً ومثالي.",
  ),
  "יש לנו רשת ספקים איכותית, אבל הבחירה תמיד מותאמת לזוג, למיקום, לתקציב ולאווירה הרצויה.": r(
    "We have a quality vendor network, but the choice is always matched to the couple, the venue, the budget, and the desired atmosphere.",
    "Tenemos una red de proveedores de calidad, pero la elección siempre se adapta a la pareja, el lugar, el presupuesto y el ambiente deseado.",
    "Temos uma rede de fornecedores de qualidade, mas a escolha sempre se adapta ao casal, ao lugar, ao orçamento e à atmosfera desejada.",
    "لدينا شبكة مورّدين جيدة، لكن الاختيار دائماً ملائم للعروسين والمكان والميزانية والأجواء المطلوبة.",
  ),
  "השאירו פרטים ונחזור עם המלצה לשיעור פתיחה לפי ניסיון, שעות נוחות ומה שהגוף מבקש עכשיו.": r(
    "Leave details and we will come back with an opening-class suggestion based on experience, convenient hours, and what the body is asking for now.",
    "Dejad datos y volveremos con una recomendación de clase de apertura según experiencia, horas cómodas y lo que el cuerpo pide ahora.",
    "Deixem os dados e voltaremos com uma recomendação de aula de abertura conforme a experiência, horários cômodos e o que o corpo pede agora.",
    "اتركوا بيانات وسنعود بتوصية درس افتتاح حسب الخبرة والساعات المريحة وما يطلبه الجسد الآن.",
  ),
  "ספרו לנו על גובה, נוף, מרפסת ושירותים. נחזיר רשימה קצרה של דירות במגדלים שנבדקו לעומק.": r(
    "Tell us about height, view, balcony, and amenities. We will send a short list of tower apartments that were checked in depth.",
    "Habladnos de altura, vistas, terraza y servicios. Devolveremos una lista corta de pisos en torres revisados a fondo.",
    "Contem sobre altura, vista, varanda e serviços. Devolveremos uma lista curta de apartamentos em torres checados a fundo.",
    "أخبرونا عن الارتفاع والإطلالة والشرفة والخدمات. سنعيد قائمة قصيرة لشقق في أبراج فُحصت بعمق.",
  ),
  "ארבורה מתכננת חצרות, גגות ומרחבים ציבוריים — עם צמחייה מקומית, ניקוז חכם ושקט ויזואלי.": r(
    "Arbora designs courtyards, roofs, and public spaces — with local planting, smart drainage, and visual quiet.",
    "Arbora proyecta patios, cubiertas y espacios públicos — con vegetación local, drenaje inteligente y silencio visual.",
    "A Arbora projeta pátios, telhados e espaços públicos — com vegetação local, drenagem inteligente e silêncio visual.",
    "أربورا تخطط أفنية وأسطحاً وفراغات عامة — بنبات محلي وتصريف ذكي وهدوء بصري.",
  ),
  "אחת מארוחות הערב הכי מדויקות שאכלתי בארץ. כל מנה הייתה מהוקצעת, והשירות פשוט חם ואנושי.": r(
    "One of the most precise dinners I have eaten in the country. Every dish was refined, and the service was simply warm and human.",
    "Una de las cenas más precisas que he comido en el país. Cada plato estaba afinado y el servicio fue simplemente cálido y humano.",
    "Um dos jantares mais precisos que comi no país. Cada prato estava afinado e o serviço foi simplesmente caloroso e humano.",
    "واحدة من أدق وجبات العشاء التي أكلتها في البلاد. كل طبق كان مصقولاً والخدمة ببساطة دافئة وإنسانية.",
  ),
  "גזירה, גוון וברק בשפה טבעית ומדויקת, עם התאמה למבנה הפנים, אורח החיים והטקסטורה הקיימת.": r(
    "Cut, tone, and shine in a natural, precise language, matched to face shape, lifestyle, and the existing texture.",
    "Corte, tono y brillo en un lenguaje natural y preciso, con encaje a la forma del rostro, el estilo de vida y la textura existente.",
    "Corte, tom e brilho numa linguagem natural e precisa, com encaixe no formato do rosto, no estilo de vida e na textura existente.",
    "قصة ودرجة ولمعان بلغة طبيعية ودقيقة، مع ملاءمة لشكل الوجه وأسلوب الحياة والملمس القائم.",
  ),
  "צוות Luminelle יחזור אלייך עם תיאום אישי, הכנה לטיפול והמלצה ראשונית שמתאימה למטרה שלך.": r(
    "The Luminelle team will come back with a personal booking, treatment prep, and a first suggestion that fits your goal.",
    "El equipo de Luminelle te devolverá una coordinación personal, una preparación para el tratamiento y una primera recomendación que encaje con tu objetivo.",
    "A equipe da Luminelle voltará com um agendamento pessoal, preparação para o tratamento e uma primeira recomendação que caiba no seu objetivo.",
    "فريق Luminelle سيعود إليك بتنسيق شخصي وتحضير للعلاج وتوصية أولية تناسب هدفك.",
  ),
};

const file = path.join(ROOT, "src/i18n/templateExactLexicon.unique11.json");
fs.writeFileSync(file, `${JSON.stringify(unique11, null, 2)}\n`);
console.log(`wrote ${Object.keys(unique11).length} unique11 rows`);
