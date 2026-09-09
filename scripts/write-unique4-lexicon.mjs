#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
function r(en, es, pt, ar) {
  return { en, es, "pt-BR": pt, ar };
}

const unique4 = {
  "פודקאסט ואודיו": r("podcast and audio", "pódcast y audio", "podcast e áudio", "بودكاست وصوت"),
  "שירותים שנעים אופקית - משלב החלום ועד סט הפרטים האחרון.": r(
    "Services that move horizontally — from the dream stage to the last set of details.",
    "Servicios que se mueven en horizontal — de la etapa del sueño al último set de detalles.",
    "Serviços que se movem na horizontal — do estágio do sonho ao último conjunto de detalhes.",
    "خدمات تتحرك أفقياً — من مرحلة الحلم حتى آخر مجموعة تفاصيل.",
  ),
  "חלב מוקצף מבריק, דאבל שוט, איזון רך בין מתיקות למרירות.": r(
    "Glossy steamed milk, a double shot, a soft balance between sweet and bitter.",
    "Leche vaporizada brillante, un double shot, un equilibrio suave entre dulzor y amargor.",
    "Leite vaporizado brilhante, um double shot, um equilíbrio suave entre doce e amargo.",
    "حليب مبخّر لامع وشوت مزدوج وتوازن ناعم بين الحلاوة والمرارة.",
  ),
  "פולים מאתיופיה או קולומביה, חליטה ידנית נקייה ופרחונית.": r(
    "Ethiopian or Colombian lots, a clean floral pour-over.",
    "Lotes de Etiopía o Colombia, una infusión manual limpia y floral.",
    "Lotes da Etiópia ou da Colômbia, uma extração manual limpa e floral.",
    "دفعات من إثيوبيا أو كولومبيا واستخلاص يدوي نظيف وزهري.",
  ),
  "כניסה גבוהה, דלפק מאויש וקיר אור שמרכך את המעבר מהרחוב.": r(
    "A tall entrance, a staffed desk, and a light wall that softens the shift from the street.",
    "Una entrada alta, un mostrador atendido y un muro de luz que suaviza el paso desde la calle.",
    "Uma entrada alta, um balcão atendido e uma parede de luz que suaviza a passagem da rua.",
    "مدخل مرتفع ومكتب مأهول وجدار ضوء يلطّف الانتقال من الشارع.",
  ),
  "גישור מוצלח בסכסוך שותפים שחסך שנים של התדיינות משפטית.": r(
    "A successful mediation in a partner dispute that saved years of litigation.",
    "Una mediación exitosa en un conflicto de socios que ahorró años de litigio.",
    "Uma mediação bem-sucedida num conflito de sócios que poupou anos de litígio.",
    "وساطة ناجحة في نزاع شركاء وفّرت سنوات من التقاضي.",
  ),
  "כל batch נאסף, מיובש ונארז ידנית בבוטיק שלנו על הטיילת.": r(
    "Every batch is picked, dried, and packed by hand in our boutique on the promenade.",
    "Cada batch se recoge, se seca y se envasa a mano en nuestro boutique del paseo.",
    "Cada batch é colhido, seco e embalado à mão no nosso boutique da orla.",
    "كل دفعة تُجمع وتُجفف وتُعبأ يدوياً في بوتيكنا على الممشى.",
  ),
  "הקופי מדגיש מקור, עונה וטריות במקום רשימת מוצרים גנרית.": r(
    "The copy highlights origin, season, and freshness instead of a generic product list.",
    "El copy destaca origen, temporada y frescura en lugar de una lista genérica de productos.",
    "O copy destaca origem, estação e frescor em vez de uma lista genérica de produtos.",
    "النصوص تبرز المصدر والموسم والطزاجة بدل قائمة منتجات عامة.",
  ),
  "שאלות על מידות, גילאים ושימוש יומי מקבלות תשובה אנושית.": r(
    "Questions about sizes, ages, and daily use get a human answer.",
    "Las preguntas sobre tallas, edades y uso diario reciben una respuesta humana.",
    "Perguntas sobre tamanhos, idades e uso diário recebem uma resposta humana.",
    "الأسئلة عن المقاسات والأعمار والاستخدام اليومي تحصل على رد بشري.",
  ),
  "טבעות, שרשראות, עגילים וצמידים — ויטרינה דיגיטלית מלאה.": r(
    "Rings, necklaces, earrings, and bracelets — a full digital vitrine.",
    "Anillos, collares, pendientes y pulseras — una vitrina digital completa.",
    "Anéis, colares, brincos e pulseiras — uma vitrine digital completa.",
    "خواتم وقلائد وأقراط وأساور — واجهة رقمية كاملة.",
  ),
  "זרימות תפעול פשוטות שחוסכות זמן ומשפרות את חוויית הלקוח.": r(
    "Simple operations flows that save time and improve the client experience.",
    "Flujos operativos simples que ahorran tiempo y mejoran la experiencia del cliente.",
    "Fluxos operacionais simples que poupam tempo e melhoram a experiência do cliente.",
    "تدفقات تشغيل بسيطة توفّر الوقت وتحسّن تجربة العميل.",
  ),
  "מה כדאי לבדוק, איזה חומרים עובדים ומה לא לעשות לבד בבית.": r(
    "What to check, which materials work, and what not to do alone at home.",
    "Qué conviene comprobar, qué materiales funcionan y qué no hacer en casa por vuestra cuenta.",
    "O que vale checar, quais materiais funcionam e o que não fazer sozinho em casa.",
    "ماذا يجدر فحصه، وأي مواد تنجح، وما لا تفعلونه وحدكم في البيت.",
  ),
  "איך ליצור לוק שנראה טוב בתאורה, בצילומים ולאורך כל הערב.": r(
    "How to build a look that holds under lights, on camera, and through the whole evening.",
    "Cómo crear un look que se vea bien con luz, en fotos y a lo largo de toda la noche.",
    "Como criar um look que fique bem na luz, nas fotos e ao longo da noite toda.",
    "كيف تصنعون إطلالة تبدو جيدة تحت الضوء وفي الصور وطوال السهرة.",
  ),
  "נתח מיושן 45 יום, פירה כמהין, ירקות שורש ורוטב יין אדום.": r(
    "45-day dry-aged cut, truffle mash, root vegetables, and red-wine sauce.",
    "Corte madurado 45 días, puré de trufa, verduras de raíz y salsa de vino tinto.",
    "Corte maturado 45 dias, purê de trufa, legumes de raiz e molho de vinho tinto.",
    "قطعة معتّقة 45 يوماً ومهروسة كمأ وخضار جذور وصلصة نبيذ أحمر.",
  ),
  "המערכת רצה, מודדת ומשתפרת — ואתם מתמקדים במה שחשוב באמת.": r(
    "The system runs, measures, and improves — you stay on what actually matters.",
    "El sistema corre, mide y mejora — y vosotros os centráis en lo que de verdad importa.",
    "O sistema corre, mede e melhora — e vocês focam no que realmente importa.",
    "النظام يعمل ويقيس ويتحسّن — وأنتم تركزون على ما يهم فعلاً.",
  ),
  "הכירו את הנכס לפני שיוצאים מהבית — חוויה מלאה מכל זווית.": r(
    "Get to know the property before you leave home — a full experience from every angle.",
    "Conoced el inmueble antes de salir de casa — una experiencia completa desde cada ángulo.",
    "Conheçam o imóvel antes de sair de casa — uma experiência completa de cada ângulo.",
    "تعرّفوا على العقار قبل الخروج من البيت — تجربة كاملة من كل زاوية.",
  ),
  "מגדילים מה שעובד, סוגרים מה שלא, ומתחילים סיבוב חד יותר.": r(
    "We scale what works, close what does not, and start a sharper round.",
    "Ampliamos lo que funciona, cerramos lo que no, y empezamos una ronda más nítida.",
    "Ampliamos o que funciona, fechamos o que não, e começamos uma rodada mais nítida.",
    "نكبّر ما ينجح ونغلق ما لا ينجح ونبدأ جولة أحدّ.",
  ),
  "איפור ערב עדין, הכנת עור, ריסים בודדים ותיאום צבעים קצר.": r(
    "Soft evening makeup, skin prep, individual lashes, and a short color match.",
    "Maquillaje de noche suave, preparación de piel, pestañas sueltas y un ajuste de color corto.",
    "Maquiagem noturna suave, prep de pele, cílios unitários e um acerto de cor curto.",
    "مكياج سهرة لطيف وتحضير بشرة ورموش مفردة وتنسيق ألوان قصير.",
  ),
  "לא עוד שכבות כבדות, רק דיוק, הקשבה ותוצאה שמצטלמת מדהים.": r(
    "No more heavy layers — only precision, listening, and a result that photographs beautifully.",
    "Nada de capas pesadas: solo precisión, escucha y un resultado que se fotografía de maravilla.",
    "Chega de camadas pesadas — só precisão, escuta e um resultado que fotografa incrível.",
    "لا طبقات ثقيلة بعد اليوم — فقط دقة وإنصات ونتيجة تُصوَّر بروعة.",
  ),
  "פורטרטים, חללי עבודה וסיפור חזותי שמרגיש כמו המותג שלכם.": r(
    "Portraits, workspaces, and a visual story that feels like your brand.",
    "Retratos, espacios de trabajo e historia visual que se siente como vuestra marca.",
    "Retratos, espaços de trabalho e uma história visual que parece a marca de vocês.",
    "بورتريهات وأماكن عمل وقصة بصرية تشبه علامتكم.",
  ),
  "יום הקלטות מרוכז לזמרים ונגנים שרוצים לצאת עם דמו ראשון.": r(
    "A focused recording day for singers and players who want a first demo out the door.",
    "Un día de grabación concentrado para cantantes e instrumentistas que quieren salir con un primer demo.",
    "Um dia de gravação concentrado para cantores e instrumentistas que querem sair com um primeiro demo.",
    "يوم تسجيل مركّز لمغنّين وعازفين يريدون الخروج بديمو أول.",
  ),
  "בוטיק שמרגיש כמו עמוד מערכת חי, עם בחירה מצומצמת ובטוחה.": r(
    "A boutique that feels like a live editorial page, with a tight, confident selection.",
    "Un boutique que se siente como una página de redacción viva, con una selección breve y segura.",
    "Um boutique que parece uma página editorial viva, com uma seleção curta e segura.",
    "بوتيك يبدو كصفحة تحرير حيّة، باختيار محدود وواثق.",
  ),
  "מסמכים, CRM, מחסן נתונים ותמיכה נכנסים לשכבת הקשר אחידה.": r(
    "Documents, CRM, a data warehouse, and support enter one shared context layer.",
    "Documentos, CRM, almacén de datos y soporte entran en una capa de contexto unificada.",
    "Documentos, CRM, data warehouse e suporte entram numa camada de contexto unificada.",
    "المستندات والـ CRM ومستودع البيانات والدعم تدخل طبقة سياق موحّدة.",
  ),
  "סלון גבוה שפונה למים, מטבח שף ומרפסת שמלווה את כל החזית.": r(
    "A tall living room facing the water, a chef’s kitchen, and a terrace along the whole facade.",
    "Un salón alto que da al agua, una cocina de chef y una terraza que recorre toda la fachada.",
    "Uma sala alta de frente para a água, uma cozinha de chef e uma varanda ao longo de toda a fachada.",
    "صالة مرتفعة تطل على الماء ومطبخ شيف وشرفة ترافق الواجهة كلها.",
  ),
  "חתך שטח נוח, אפשרות חלוקה פנימית ותנועה שקטה מרחוב משני.": r(
    "A comfortable lot cut, optional inner division, and quiet access from a side street.",
    "Un recorte de solar cómodo, opción de división interior y movimiento quieto desde una calle secundaria.",
    "Um recorte de lote cômodo, opção de divisão interna e movimento quieto a partir de uma rua secundária.",
    "قطعة أرض مريحة وإمكانية تقسيم داخلي وحركة هادئة من شارع جانبي.",
  ),
  "ז׳אנר, גיל מומלץ, סוג נייר או כריכה מופיעים בעמוד המוצר.": r(
    "Genre, recommended age, paper type, or binding appear on the product page.",
    "Género, edad recomendada, tipo de papel o encuadernación aparecen en la página del producto.",
    "Gênero, idade recomendada, tipo de papel ou encadernação aparecem na página do produto.",
    "النوع والعمر الموصى به ونوع الورق أو التجليد تظهر في صفحة المنتج.",
  ),
  "כל שכבה מגולגלת ביד. חמאה קרה, תסיסה איטית וריח של בוקר.": r(
    "Every layer is rolled by hand. Cold butter, a slow ferment, and the smell of morning.",
    "Cada capa se lamina a mano. Mantequilla fría, fermentación lenta y olor a mañana.",
    "Cada camada é laminada à mão. Manteiga fria, fermentação lenta e cheiro de manhã.",
    "كل طبقة تُلفّ باليد. زبدة باردة وتخمير بطيء ورائحة صباح.",
  ),
  "שותף מקצועי שמבין עיצוב, אסטרטגיה ותוצאות עסקיות אמיתיות.": r(
    "A professional partner who understands design, strategy, and real business results.",
    "Un socio profesional que entiende diseño, estrategia y resultados de negocio reales.",
    "Um parceiro profissional que entende design, estratégia e resultados de negócio reais.",
    "شريك مهني يفهم التصميم والاستراتيجية ونتائج الأعمال الحقيقية.",
  ),
  "נתח מקומי על גריל פחמים, תפוחי אדמה קונפי וסלט עלים חריף.": r(
    "A local cut on a charcoal grill, confit potatoes, and a sharp leaf salad.",
    "Un corte local a la parrilla de carbón, patatas confitadas y una ensalada de hojas picante.",
    "Um corte local na grelha de carvão, batatas confit e uma salada de folhas picante.",
    "قطعة محلية على شواية فحم وبطاطا كونفي وسلطة أوراق حارة.",
  ),
  "רחובות, נס ציונה, יבנה, מודיעין, לוד, רמלה וישובי הסביבה.": r(
    "Rehovot, Ness Ziona, Yavne, Modiin, Lod, Ramla, and nearby towns.",
    "Rehovot, Ness Ziona, Yavne, Modiin, Lod, Ramla y localidades de alrededor.",
    "Rehovot, Ness Ziona, Yavne, Modiin, Lod, Ramla e vilarejos da região.",
    "رحوفوت ونِس تسيونا ويفنه وموديعين واللد والرملة وتجمعات المحيط.",
  ),
  "זה לא היה עוד דוח. זו הייתה מערכת הפעלה חדשה להנהלה שלנו.": r(
    "It was not another report. It was a new operating system for our leadership.",
    "No era otro informe. Era un sistema operativo nuevo para nuestra dirección.",
    "Não era mais um relatório. Era um sistema operacional novo para a nossa gestão.",
    "لم يكن تقريراً إضافياً. كان نظام تشغيل جديداً لإدارتنا.",
  ),
  "אבחון תלת-ממדי, תכנון כירורגי ושיקום קבוע באסתטיקה גבוהה.": r(
    "3D diagnostics, surgical planning, and a permanent restoration with high aesthetics.",
    "Diagnóstico 3D, planificación quirúrgica y una rehabilitación fija de alta estética.",
    "Diagnóstico 3D, planejamento cirúrgico e uma reabilitação fixa de alta estética.",
    "تشخيص ثلاثي الأبعاد وتخطيط جراحي وترميم ثابت بجماليات عالية.",
  ),
  "הטיפוח היה עדין, נקי ומהיר. חזרנו עם כלב רגוע וריח מושלם.": r(
    "The grooming was gentle, clean, and fast. We came back with a calm dog and a perfect scent.",
    "El cuidado fue suave, limpio y rápido. Volvimos con un perro calmado y un aroma perfecto.",
    "O cuidado foi gentil, limpo e rápido. Voltamos com um cão calmo e um cheiro perfeito.",
    "كانت العناية لطيفة ونظيفة وسريعة. عدنا بكلب هادئ ورائحة مثالية.",
  ),
  "שריטות שטיפה, ערפל צבע והולוגרמות נעלמים תחת תאורה ישירה.": r(
    "Wash swirls, color haze, and holograms disappear under direct light.",
    "Los swirls de lavado, la niebla de color y los hologramas desaparecen bajo luz directa.",
    "Swirls de lavagem, névoa de cor e hologramas desaparecem sob luz direta.",
    "خدوش الغسل وضباب اللون والهولوغرام تختفي تحت الضوء المباشر.",
  ),
  "כל המלצה מגיעה עם מקור, ביטחון, חלופות וסיבה עסקית ברורה.": r(
    "Every recommendation comes with a source, confidence, alternatives, and a clear business reason.",
    "Cada recomendación llega con fuente, confianza, alternativas y una razón de negocio clara.",
    "Cada recomendação chega com fonte, confiança, alternativas e um motivo de negócio claro.",
    "كل توصية تأتي مع مصدر وثقة وبدائل وسبب عمل واضح.",
  ),
  "העתיד לא צריך עוד דשבורד. הוא צריך מערכת שמחליטה בזהירות.": r(
    "The future does not need another dashboard. It needs a system that decides carefully.",
    "El futuro no necesita otro dashboard. Necesita un sistema que decide con cuidado.",
    "O futuro não precisa de mais um dashboard. Precisa de um sistema que decide com cuidado.",
    "المستقبل لا يحتاج لوحة أخرى. يحتاج نظاماً يقرر بحذر.",
  ),
  "סיורים לפי הזמנה, כתובות לאחר אימות, וליווי אישי לכל שלב.": r(
    "Tours by appointment, addresses after verification, and personal support at every step.",
    "Visitas con cita, direcciones tras verificación y acompañamiento personal en cada etapa.",
    "Visitas com hora marcada, endereços após verificação e acompanhamento pessoal em cada etapa.",
    "جولات حسب الموعد وعناوين بعد التحقق ومرافقة شخصية في كل مرحلة.",
  ),
  "מעלית ישירה, קירות זכוכית ורוח מערבית שנפתחת מעל קו החוף.": r(
    "A direct lift, glass walls, and a western wind that opens above the shoreline.",
    "Ascensor directo, paredes de cristal y un viento oeste que se abre sobre la línea de costa.",
    "Elevador direto, paredes de vidro e um vento oeste que se abre sobre a linha da costa.",
    "مصعد مباشر وجدران زجاج وريح غربية تنفتح فوق خط الساحل.",
  ),
  "תכנון מס, ליווי מול רשויות, השקעות והתנהלות פיננסית חכמה.": r(
    "Tax planning, support with authorities, investments, and smart financial conduct.",
    "Planificación fiscal, acompañamiento ante autoridades, inversiones y una gestión financiera inteligente.",
    "Planejamento tributário, acompanhamento perante autoridades, investimentos e uma condução financeira inteligente.",
    "تخطيط ضريبي ومرافقة أمام السلطات واستثمارات وتصرّف مالي ذكي.",
  ),
  "ייצוג בבתי משפט ובבוררויות, ניהול סיכונים ופתרון מחלוקות.": r(
    "Representation in courts and arbitrations, risk management, and dispute resolution.",
    "Representación en tribunales y arbitrajes, gestión de riesgos y resolución de conflictos.",
    "Representação em tribunais e arbitragens, gestão de riscos e resolução de disputas.",
    "تمثيل في المحاكم والتحكيم وإدارة مخاطر وحل النزاعات.",
  ),
  "השף בוחר דגים בבוקר, מבשל על גחלים, מגיש עם ירקות מהגינה.": r(
    "The chef picks fish in the morning, cooks over coals, and serves it with garden vegetables.",
    "El chef elige el pescado por la mañana, cocina sobre brasas y sirve con verduras del huerto.",
    "O chef escolhe o peixe de manhã, cozinha sobre brasas e serve com legumes da horta.",
    "الشيف يختار السمك صباحاً ويطبخ على الجمر ويقدّم مع خضار الحديقة.",
  ),
  "צוות מנוסה, יאכטות מטופחות ומסלולים מ-Herzliya ועד Eilat.": r(
    "An experienced crew, well-kept yachts, and routes from Herzliya to Eilat.",
    "Un equipo experimentado, yates cuidados y rutas de Herzliya a Eilat.",
    "Uma equipe experiente, iates bem cuidados e rotas de Herzliya a Eilat.",
    "طاقم خبير ويخوت معتنى بها ومسارات من هرتسليا إلى إيلات.",
  ),
  "עבודת האוטומציה עזרה לנו לזוז מהר יותר בלי להוסיף מורכבות.": r(
    "The automation work helped us move faster without adding complexity.",
    "El trabajo de automatización nos ayudó a movernos más rápido sin añadir complejidad.",
    "O trabalho de automação nos ajudou a nos mover mais rápido sem adicionar complexidade.",
    "عمل الأتمتة ساعدنا على التحرك أسرع دون إضافة تعقيد.",
  ),
  "כן. המבנה מתאים לליווי מוכרים, קונים, בעלי נכסים ומשקיעים.": r(
    "Yes. The structure fits support for sellers, buyers, owners, and investors.",
    "Sí. La estructura encaja para acompañar a vendedores, compradores, propietarios e inversores.",
    "Sim. A estrutura serve para acompanhar vendedores, compradores, proprietários e investidores.",
    "نعم. البنية تناسب مرافقة البائعين والمشترين وملاك العقارات والمستثمرين.",
  ),
  "ליווי נדל״ן יוקרתי, אישי ודיסקרטי — בלי לחשוף מחירים באתר.": r(
    "Luxury real-estate support that is personal and discreet — without posting prices on the site.",
    "Acompañamiento inmobiliario de lujo, personal y discreto — sin mostrar precios en la web.",
    "Acompanhamento imobiliário de luxo, pessoal e discreto — sem expor preços no site.",
    "مرافقة عقارية فاخرة وشخصية وكتومة — دون كشف الأسعار في الموقع.",
  ),
  "הצגת הנכסים הייתה מדויקת, בלי עומס ובלי תחושה מכירתית מדי.": r(
    "The property presentation was precise, without clutter and without feeling too salesy.",
    "La presentación de inmuebles fue precisa, sin saturación y sin una sensación demasiado comercial.",
    "A apresentação dos imóveis foi precisa, sem saturação e sem uma sensação demais de venda.",
    "عرض العقارات كان دقيقاً بلا ازدحام وبلا إحساس بيعي مفرط.",
  ),
  "מראה פתוח ועדין בלי עומס, עם תוצאה רכה שמדגישה את העיניים.": r(
    "An open, gentle look without clutter, with a soft result that highlights the eyes.",
    "Un look abierto y suave sin saturación, con un resultado tierno que destaca los ojos.",
    "Um look aberto e suave sem saturação, com um resultado macio que destaca os olhos.",
    "مظهر مفتوح ولطيف بلا ازدحام، بنتيجة ناعمة تبرز العينين.",
  ),
  "מחברים את הכלים והנתונים הקיימים בלחיצה, בלי הטמעה מורכבת.": r(
    "We connect the tools and data you already have in one click, without a heavy rollout.",
    "Conectamos las herramientas y los datos existentes en un clic, sin una implantación compleja.",
    "Conectamos as ferramentas e os dados existentes num clique, sem uma implantação complexa.",
    "نربط الأدوات والبيانات القائمة بنقرة، بلا نشر معقّد.",
  ),
  "מגדירים אוטומציות ולוחות מחוונים שמתאימים בדיוק לעסק שלכם.": r(
    "We set automations and dashboards that fit your business exactly.",
    "Definimos automatizaciones y paneles que encajan exactamente con vuestro negocio.",
    "Definimos automações e painéis que encaixam exatamente no negócio de vocês.",
    "نحدد أتمتة ولوحات تناسب عملكم تماماً.",
  ),
  "מעבירים את השיטה לצוות כך שהעסק ממשיך לרוץ בלי תלות ביועץ.": r(
    "We hand the method to the team so the business keeps running without depending on a consultant.",
    "Pasamos el método al equipo para que el negocio siga sin depender de un consultor.",
    "Passamos o método para a equipe para o negócio seguir sem depender de um consultor.",
    "ننقل المنهج للفريق حتى يستمر العمل دون اعتماد على مستشار.",
  ),
  "פגישת ניסיון, סקין פרפ, איפור יום האירוע וקיט טאצ' אפ קטן.": r(
    "A trial session, skin prep, event-day makeup, and a small touch-up kit.",
    "Una sesión de prueba, skin prep, maquillaje del día del evento y un kit pequeño de retoque.",
    "Uma sessão experimental, skin prep, maquiagem do dia do evento e um kit pequeno de retoque.",
    "جلسة تجريبية وتحضير بشرة ومكياج يوم المناسبة وعدة لمسات صغيرة.",
  ),
  "בלי משחקים. שירותים ברורים, זמן מדויק, תוצאה חדה וקצה נקי.": r(
    "No games. Clear services, exact timing, a sharp result, and a clean edge.",
    "Sin juegos. Servicios claros, tiempo exacto, un resultado nítido y un borde limpio.",
    "Sem jogos. Serviços claros, tempo exato, um resultado nítido e uma borda limpa.",
    "بلا ألعاب. خدمات واضحة ووقت دقيق ونتيجة حادة وحافة نظيفة.",
  ),
  "תוכנית כניסה למי שיודע להתאמן אבל צריך מסגרת, תפריט ומעקב.": r(
    "An on-ramp for anyone who already trains but needs a frame, a menu, and follow-up.",
    "Un plan de entrada para quien ya entrena pero necesita marco, menú y seguimiento.",
    "Um plano de entrada para quem já treina mas precisa de estrutura, cardápio e acompanhamento.",
    "خطة دخول لمن يعرف التمرين لكنه يحتاج إطاراً وقائمة ومتابعة.",
  ),
  "תוכנית אימון חודשית|יעדי תזונה|צ׳ק-אין שבועי|קהילת מתאמנים": r(
    "Monthly training plan | nutrition goals | weekly check-in | athlete community",
    "Plan de entrenamiento mensual | objetivos de nutrición | check-in semanal | comunidad de atletas",
    "Plano de treino mensal | metas de nutrição | check-in semanal | comunidade de atletas",
    "خطة تمرين شهرية | أهداف تغذية | متابعة أسبوعية | مجتمع متدربين",
  ),
};

const file = path.join(ROOT, "src/i18n/templateExactLexicon.unique4.json");
fs.writeFileSync(file, `${JSON.stringify(unique4, null, 2)}\n`);
console.log(`wrote ${Object.keys(unique4).length} unique4 rows`);
