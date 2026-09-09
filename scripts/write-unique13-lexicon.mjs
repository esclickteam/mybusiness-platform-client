#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
function r(en, es, pt, ar) {
  return { en, es, "pt-BR": pt, ar };
}

const unique13 = {
  "גוון טבעי בלי הלם.": r("Natural tone without shock.", "Tono natural sin shock.", "Tom natural sem choque.", "درجة طبيعية بلا صدمة."),
  "גבות + איפור קליל.": r("Brows + light makeup.", "Cejas + maquillaje ligero.", "Sobrancelhas + maquiagem leve.", "حواجب + مكياج خفيف."),
  "שיער מושלם ב־45 דקות.": r("Perfect hair in 45 minutes.", "Cabello perfecto en 45 minutos.", "Cabelo perfeito em 45 minutos.", "شعر مثالي خلال 45 دقيقة."),
  "לוקים מתואמים למשפחה.": r("Looks matched for the family.", "Looks coordinados para la familia.", "Looks combinados para a família.", "إطلالات منسّقة للعائلة."),
  "שחרור שריר אחרי עומס.": r("Muscle release after load.", "Liberación muscular después de carga.", "Liberação muscular depois de carga.", "تحرير عضلة بعد حمل."),
  "ריס על ריס למראה פתוח.": r("Lash-by-lash for an open look.", "Pestaña a pestaña para un look abierto.", "Cílio a cílio para um look aberto.", "رمش على رمش لمظهر مفتوح."),
  "צפיפות עדינה בלי כובד.": r("Gentle density without heaviness.", "Densidad suave sin peso.", "Densidade suave sem peso.", "كثافة لطيفة بلا ثقل."),
  "צורה קבועה ל־6 שבועות.": r("A lasting shape for 6 weeks.", "Forma fija durante 6 semanas.", "Forma fixa por 6 semanas.", "شكل ثابت لـ 6 أسابيع."),
  "מיצוק וזוהר לאורך זמן.": r("Firming and glow over time.", "Firmeza y luminosidad a lo largo del tiempo.", "Firmeza e glow ao longo do tempo.", "شد وإشراق على مدى الزمن."),
  "זוהר מיידי לפני יציאה.": r("Instant glow before going out.", "Luminosidad inmediata antes de salir.", "Glow imediato antes de sair.", "إشراق فوري قبل الخروج."),
  "שפם, סנטר וקו גבה נקי.": r("Clean upper lip, chin, and brow line.", "Labio, mentón y línea de ceja limpios.", "Buço, queixo e linha de sobrancelha limpos.", "شارب وذقن وخط حاجب نظيف."),
  "חריטה עדינה למילוי טבעי.": r("A gentle etch for a natural fill.", "Un grabado suave para un relleno natural.", "Uma gravação suave para um preenchimento natural.", "حفر لطيف لتعبئة طبيعية."),
  "ריס על ריס לפתיחה עדינה.": r("Lash-by-lash for a gentle opening.", "Pestaña a pestaña para una apertura suave.", "Cílio a cílio para uma abertura suave.", "رمش على رمش لفتح لطيف."),
  "רגליים רכות + לכה מושלמת.": r("Soft feet + perfect polish.", "Pies suaves + laca perfecta.", "Pés suaves + esmalte perfeito.", "أقدام ناعمة + طلاء مثالي."),
  "צורה שחיה גם ביום הרביעי.": r("A shape that still lives on day four.", "Una forma que sigue viva el cuarto día.", "Uma forma que ainda vive no quarto dia.", "شكل يعيش حتى في اليوم الرابع."),
  "ברק רך ותחושת משי אמיתית.": r("A soft shine and a real silk feel.", "Un brillo suave y una sensación de seda real.", "Um brilho suave e uma sensação de seda de verdade.", "لمعان ناعم وإحساس حرير حقيقي."),
  "מילוי טבעי בלי מראה מצויר.": r("A natural fill without a drawn-on look.", "Un relleno natural sin aspecto dibujado.", "Um preenchimento natural sem visual desenhado.", "تعبئة طبيعية بلا مظهر مرسوم."),
  "גוון רך שממלא פערים קטנים.": r("A soft tone that fills small gaps.", "Un tono suave que rellena huecos pequeños.", "Um tom suave que preenche lacunas pequenas.", "درجة ناعمة تملأ فجوات صغيرة."),
  "מיפוי צורה לפני פתיחת מחט.": r("Shape mapping before the needle opens.", "Mapeo de forma antes de abrir la aguja.", "Mapeamento de forma antes de abrir a agulha.", "رسم الشكل قبل فتح الإبرة."),
  "עיצוב מלא לפי תמונת השראה.": r("A full design from an inspiration photo.", "Un diseño completo según una foto de inspiración.", "Um design completo a partir de uma foto de inspiração.", "تصميم كامل حسب صورة إلهام."),
  "רצף טיפולים עם מעקב תוצאה.": r("A treatment sequence with result tracking.", "Una secuencia de tratamientos con seguimiento de resultado.", "Uma sequência de tratamentos com acompanhamento de resultado.", "تسلسل علاجات بمتابعة نتيجة."),
  "הבהרה מדורגת עם שורש טבעי.": r("Gradual lightening with a natural root.", "Una aclaración gradual con raíz natural.", "Uma clareação gradual com raiz natural.", "تفتيح متدرج بجذر طبيعي."),
  "הקלה בנפיחות ותחושת קלילות.": r("Less puffiness and a lighter feeling.", "Alivio de hinchazón y una sensación de ligereza.", "Alívio de inchaço e uma sensação de leveza.", "تخفيف تورم وإحساس خفة."),
  "גוון רך שמחזיר מסגרת וחיות.": r("A soft tone that returns frame and vitality.", "Un tono suave que devuelve marco y vitalidad.", "Um tom suave que devolve moldura e vitalidade.", "درجة ناعمة تعيد إطاراً وحيوية."),
  "קו ריסים דק שמדגיש את העין.": r("A thin lash line that defines the eye.", "Una línea de pestañas fina que destaca el ojo.", "Uma linha de cílios fina que destaca o olho.", "خط رموش رفيع يبرز العين."),
  "סידור שערה למראה מלא ומורם.": r("Hair placed for a full, lifted look.", "Colocación del cabello para un look lleno y elevado.", "Arranjo do cabelo para um look cheio e elevado.", "ترتيب الشعرة لمظهر ممتلئ ومرفوع."),
  "סדר שימוש ומוצרים ללא עומס.": r("An order of use and products without overload.", "Un orden de uso y productos sin sobrecarga.", "Uma ordem de uso e produtos sem sobrecarga.", "ترتيب استخدام ومنتجات بلا عبء."),
  "מניפות דקות ללא תחושת כובד.": r("Thin fans without a heavy feeling.", "Abanicos finos sin sensación de peso.", "Leques finos sem sensação de peso.", "مراوح رقيقة بلا إحساس ثقل."),
  "השלמת נשירה ושמירה על צורה.": r("Filling shedding and keeping the shape.", "Completar la caída y conservar la forma.", "Completar a queda e manter a forma.", "إكمال التساقط والحفاظ على الشكل."),
  "לטיפול נקודתי מומלץ לקבוע כשבוע מראש. לפני אירוע חשוב כדאי להגיע לייעוץ ארבעה עד שישה שבועות קודם.": r(
    "For a spot treatment it is best to book about a week ahead. Before an important event, come for a consult four to six weeks earlier.",
    "Para un tratamiento puntual conviene reservar unos siete días antes. Antes de un evento importante, venid a una asesoría cuatro a seis semanas antes.",
    "Para um tratamento pontual vale marcar cerca de uma semana antes. Antes de um evento importante, venham a uma consultoria quatro a seis semanas antes.",
    "لعلاج نقطي يُفضَّل الحجز قبل أسبوع تقريباً. قبل مناسبة مهمة يحسن المجيء لاستشارة قبل أربعة إلى ستة أسابيع.",
  ),
  "רוב המתאמנים מרגישים שינוי באנרגיה כבר בשבועיים הראשונים ורואים שינוי פיזי משמעותי אחרי 6-8 שבועות.": r(
    "Most trainees feel an energy change in the first two weeks and see a real physical change after 6–8 weeks.",
    "La mayoría de los entrenados sienten un cambio de energía ya en las dos primeras semanas y ven un cambio físico significativo después de 6-8 semanas.",
    "A maioria dos treinandos sente uma mudança de energia já nas duas primeiras semanas e vê uma mudança física significativa depois de 6-8 semanas.",
    "معظم المتدربين يشعرون بتغيّر في الطاقة خلال الأسبوعين الأولين ويرون تغيّراً جسدياً واضحاً بعد 6-8 أسابيع.",
  ),
  "וספרה היא אולם אינטימי ל־180 איש. אנחנו מאמינים שערב טוב לא צריך להיות גדול — הוא צריך להיות מדויק.": r(
    "Vespera is an intimate hall for 180 people. We believe a good evening does not need to be large — it needs to be precise.",
    "Vespera es una sala íntima para 180 personas. Creemos que una velada buena no tiene que ser grande — tiene que ser precisa.",
    "A Vespera é uma sala íntima para 180 pessoas. Acreditamos que uma noite boa não precisa ser grande — precisa ser precisa.",
    "فيسبرا قاعة حميمة لـ 180 شخصاً. نؤمن أن أمسية جيدة لا تحتاج أن تكون كبيرة — تحتاج أن تكون دقيقة.",
  ),
  "Lexhaven לקחו עסקה תקועה והחזירו לנו שליטה. השילוב בין חדות משפטית לשפה עסקית חסך חודשים של אי ודאות.": r(
    "Lexhaven took a stuck deal and returned control to us. The mix of legal sharpness and business language saved months of uncertainty.",
    "Lexhaven tomó una operación atascada y nos devolvió el control. La mezcla de agudeza jurídica y lenguaje de negocio ahorró meses de incertidumbre.",
    "A Lexhaven pegou um negócio travado e nos devolveu o controle. A mistura de agudeza jurídica e linguagem de negócio poupou meses de incerteza.",
    "Lexhaven أخذت صفقة عالقة وأعادت لنا السيطرة. مزيج الحدة القانونية واللغة التجارية وفّر شهوراً من عدم اليقين.",
  ),
  "קולאז׳ של רגעים קטנים: בדיקות תאורה, פרחים רגע לפני האורחים, שולחנות ערוכים וחופה שנבנתה בדיוק למקום.": r(
    "A collage of small moments: lighting checks, flowers just before guests, set tables, and a chuppah built exactly for the place.",
    "Un collage de momentos pequeños: pruebas de luz, flores un instante antes de los invitados, mesas puestas y una jupá construida exactamente para el lugar.",
    "Uma colagem de momentos pequenos: checagens de luz, flores um instante antes dos convidados, mesas postas e uma chupá construída exatamente para o lugar.",
    "كولاج لحظات صغيرة: فحوصات إضاءة وورود قبل الضيوف بلحظة وطاولات معدّة وحوبا بُنيت بالضبط للمكان.",
  ),
  "אנחנו בוחנים שכונות לפי הליכה לבית ספר, גינות, שקט בערב, קהילה קיימת ויכולת לגדול בבית בלי לעבור שוב.": r(
    "We look at neighborhoods by walk to school, gardens, evening quiet, an existing community, and the ability to grow in the house without moving again.",
    "Examinamos barrios según el camino al colegio, jardines, silencio por la tarde, una comunidad existente y la capacidad de crecer en casa sin mudarse otra vez.",
    "Examinamos bairros pela caminhada até a escola, jardins, silêncio à noite, uma comunidade existente e a capacidade de crescer na casa sem se mudar de novo.",
    "نفحص الأحياء حسب المشي إلى المدرسة والحدائق وهدوء المساء ومجتمع قائم والقدرة على النمو في البيت دون الانتقال مرة أخرى.",
  ),
  "אנחנו מתחילים בשיחה איטית על שגרה, קצב, אור, ילדים, עבודה ותחושת רחוב. רק אחר כך נפתחת רשימת הכתובות.": r(
    "We start with a slow conversation about routine, pace, light, children, work, and street feel. Only then does the address list open.",
    "Empezamos con una conversación lenta sobre rutina, ritmo, luz, niños, trabajo y sensación de calle. Solo después se abre la lista de direcciones.",
    "Começamos com uma conversa lenta sobre rotina, ritmo, luz, crianças, trabalho e sensação de rua. Só depois a lista de endereços se abre.",
    "نبدأ بحوار بطيء عن الروتين والإيقاع والضوء والأطفال والعمل وإحساس الشارع. فقط بعد ذلك تُفتح قائمة العناوين.",
  ),
  "אנחנו משלבים אסטרטגיה, עיצוב, פיתוח ותנועה כדי ליצור חוויות דיגיטליות יוקרתיות, זכירות ומכוונות תוצאה.": r(
    "We combine strategy, design, development, and motion to create luxurious, memorable, result-oriented digital experiences.",
    "Combinamos estrategia, diseño, desarrollo y movimiento para crear experiencias digitales de lujo, memorables y orientadas a resultado.",
    "Combinamos estratégia, design, desenvolvimento e movimento para criar experiências digitais luxuosas, memoráveis e orientadas a resultado.",
    "نجمع الاستراتيجية والتصميم والتطوير والحركة لصناعة تجارب رقمية فاخرة ولا تُنسى وموجّهة للنتيجة.",
  ),
  "כן. אנחנו עובדות בפרוטוקולים מדורגים, בוחרות חומרים לפי תגובת העור ונמנעות מעומס פעילים כשאין בו צורך.": r(
    "Yes. We work in staged protocols, choose materials by skin response, and avoid active overload when it is not needed.",
    "Sí. Trabajamos con protocolos escalonados, elegimos materiales según la reacción de la piel y evitamos sobrecarga de activos cuando no hace falta.",
    "Sim. Trabalhamos com protocolos em etapas, escolhemos materiais conforme a reação da pele e evitamos sobrecarga de ativos quando não precisa.",
    "نعم. نعمل ببروتوكولات متدرجة ونختار الخامات حسب رد فعل البشرة ونتجنب عبء المواد الفعالة حين لا حاجة له.",
  ),
  "מורים שמגיעים מאולפנים, במות והרכבים פעילים. כל אחד מביא צליל אחר, בלי להפוך את השיעור לבית ספר משעמם.": r(
    "Teachers who come from studios, stages, and active bands. Each one brings a different sound, without turning the lesson into a boring school.",
    "Profesores que vienen de estudios, escenarios y bandas activas. Cada uno aporta un sonido distinto, sin convertir la clase en un colegio aburrido.",
    "Professores que vêm de estúdios, palcos e bandas ativas. Cada um traz um som diferente, sem transformar a aula numa escola chata.",
    "معلمون يأتون من استوديوهات ومسارح وفرق نشطة. كل واحد يجلب صوتاً آخر، دون تحويل الدرس إلى مدرسة مملة.",
  ),
  "כל נכס שנשלח אליכם עבר ביקור, שאלות שכנות ובדיקת התאמה לתמונה שתיארתם. אם אין התאמה, הוא לא נכנס לתיק.": r(
    "Every listing sent to you has had a visit, neighbor questions, and a fit check against the picture you described. If it does not fit, it does not enter the file.",
    "Cada inmueble que os enviamos ha pasado una visita, preguntas a vecinos y una comprobación de encaje con la imagen que describisteis. Si no encaja, no entra en el expediente.",
    "Cada imóvel enviado a vocês passou por visita, perguntas a vizinhos e uma checagem de encaixe com a imagem que descreveram. Se não encaixa, não entra no dossiê.",
    "كل عقار يُرسل إليكم مرّ بزيارة وأسئلة جيران وفحص ملاءمة للصورة التي وصفتموها. إن لم تكن هناك ملاءمة، لا يدخل الملف.",
  ),
  "ניהול משא ומתן רגיש שהוביל להסכם יציב, ברור ומקובל על שני הצדדים תוך שמירה על אינטרסים משפטיים ואישיים.": r(
    "Sensitive negotiation that led to a stable, clear agreement both sides accepted, while protecting legal and personal interests.",
    "Una negociación sensible que llevó a un acuerdo estable, claro y aceptado por ambas partes, protegiendo intereses jurídicos y personales.",
    "Uma negociação sensível que levou a um acordo estável, claro e aceito pelas duas partes, protegendo interesses jurídicos e pessoais.",
    "إدارة تفاوض حسّاسة أدت إلى اتفاق مستقر وواضح ومقبول من الطرفين مع الحفاظ على المصالح القانونية والشخصية.",
  ),
  "אירחנו לקוחות מחו״ל בחדר הפרטי. התפריט, הקצב והדיוק של הצוות הפכו את הערב לחוויה יוקרתית ומאוד ישראלית.": r(
    "We hosted overseas clients in the private room. The menu, the pace, and the team’s precision turned the evening into a luxurious, very Israeli experience.",
    "Recibimos clientes del extranjero en el comedor privado. El menú, el ritmo y la precisión del equipo convirtieron la velada en una experiencia de lujo y muy israelí.",
    "Recebemos clientes do exterior na sala particular. O cardápio, o ritmo e a precisão da equipe transformaram a noite numa experiência luxuosa e muito israelense.",
    "استضفنا عملاء من الخارج في الغرفة الخاصة. القائمة والإيقاع ودقة الفريق حوّلت الأمسية إلى تجربة فاخرة وإسرائيلية جداً.",
  ),
  "ארבורה הוא סטודיו לאדריכלות נוף שפועל ממרכז הארץ. אנחנו עובדים צמוד עם אדריכלים, קבלנים ולקוחות פרטיים.": r(
    "Arbora is a landscape-architecture studio in the center of the country. We work closely with architects, contractors, and private clients.",
    "Arbora es un estudio de arquitectura del paisaje que opera desde el centro del país. Trabajamos cerca con arquitectos, contratistas y clientes particulares.",
    "A Arbora é um estúdio de arquitetura paisagística no centro do país. Trabalhamos perto de arquitetos, empreiteiros e clientes particulares.",
    "أربورا استوديو عمارة منظر يعمل من وسط البلاد. نعمل قرب المهندسين والمقاولين والعملاء الخاصين.",
  ),
  "בפגישה הראשונה נבצע אבחון קצר ונבנה המלצה לפי מצב העור או השיער, רגישויות, אירועים קרובים ושגרת הבית שלך.": r(
    "In the first meeting we will do a short diagnosis and build a suggestion from skin or hair state, sensitivities, upcoming events, and your home routine.",
    "En la primera cita haremos un diagnóstico breve y construiremos una recomendación según el estado de piel o cabello, sensibilidades, eventos próximos y tu rutina de casa.",
    "Na primeira reunião faremos um diagnóstico curto e construiremos uma recomendação conforme o estado da pele ou do cabelo, sensibilidades, eventos próximos e a rotina de casa.",
    "في اللقاء الأول سنجري تشخيصاً قصيراً ونبني توصية حسب حالة البشرة أو الشعر والحساسيات والمناسبات القريبة وروتين البيت.",
  ),
  "כל מסלול נבנה סביב צוואר הבקבוק העסקי: אסטרטגיה, תפעול, כספים או הנהלה. אין מצגות מדף, יש קצב עבודה ברור.": r(
    "Every track is built around the business bottleneck: strategy, operations, finance, or leadership. No shelf decks — there is a clear work pace.",
    "Cada itinerario se construye alrededor del cuello de botella del negocio: estrategia, operación, finanzas o dirección. No hay presentaciones de catálogo, hay un ritmo de trabajo claro.",
    "Cada percurso é construído em torno do gargalo do negócio: estratégia, operação, finanças ou direção. Não há apresentações de prateleira, há um ritmo de trabalho claro.",
    "كل مسار يُبنى حول عنق الزجاجة التجاري: استراتيجية أو تشغيل أو مالية أو إدارة. لا عروض جاهزة، هناك إيقاع عمل واضح.",
  ),
  "אחת הארוחות המדויקות שאכלנו בארץ. כל מנה הרגישה נקייה, חכמה ועם אופי, והשירות היה קשוב בלי להיות רשמי מדי.": r(
    "One of the most precise meals we have eaten in the country. Every dish felt clean, smart, and with character, and the service was attentive without being too formal.",
    "Una de las comidas más precisas que hemos comido en el país. Cada plato se sentía limpio, inteligente y con carácter, y el servicio fue atento sin ser demasiado formal.",
    "Uma das refeições mais precisas que comemos no país. Cada prato parecia limpo, inteligente e com caráter, e o serviço foi atento sem ser formal demais.",
    "واحدة من أدق الوجبات التي أكلناها في البلاد. كل طبق بدا نظيفاً وذكياً وذا طابع، والخدمة كانت منتبهة دون أن تكون رسمية أكثر من اللازم.",
  ),
  "השתמשו במדריך המידות בכל עמוד מוצר והשוו לפריט האהוב עליכם בבית. לגזרות רפויות — בחרו את המידה הרגילה שלכם.": r(
    "Use the size guide on every product page and compare it to your favorite piece at home. For relaxed cuts — choose your usual size.",
    "Usad la guía de tallas en cada página de producto y comparadla con la prenda que más os gusta en casa. En cortes holgados — elegid vuestra talla habitual.",
    "Usem o guia de tamanhos em cada página de produto e comparem com a peça favorita em casa. Em cortes folgados — escolham o tamanho habitual de vocês.",
    "استخدموا دليل المقاسات في كل صفحة منتج وقارنوا بالقطعة المفضلة لديكم في البيت. للقصات الفضفاضة — اختاروا مقاسكم المعتاد.",
  ),
  "יחס אישי, צוות מומחיות, מוצרים פרימיום ואווירה שמרגישה כמו רגע לעצמך — בדיוק כמו אתר סלון יוקרתי צריך לשדר.": r(
    "Personal care, a specialist team, premium products, and an atmosphere that feels like a moment for yourself — exactly what a luxury salon site should broadcast.",
    "Trato personal, un equipo de especialidad, productos premium y un ambiente que se siente como un momento para ti — exactamente lo que un sitio de salón de lujo debe transmitir.",
    "Trato pessoal, uma equipe de especialidade, produtos premium e uma atmosfera que parece um momento para você — exatamente o que um site de salão de luxo precisa transmitir.",
    "تعامل شخصي وفريق تخصص ومنتجات فاخرة وأجواء تشبه لحظة لنفسك — بالضبط كما يجب أن يبث موقع صالون فاخر.",
  ),
  "כל רופא ב-Vitalcare נבחר בזכות ניסיון קליני מוכח, תקשורת אנושית ויכולת לבנות תוכנית טיפול ברורה ולא מלחיצה.": r(
    "Every doctor at Vitalcare is chosen for proven clinical experience, human communication, and the ability to build a clear, unstressful treatment plan.",
    "Cada médico de Vitalcare se elige por experiencia clínica demostrada, comunicación humana y la capacidad de construir un plan de tratamiento claro y no estresante.",
    "Cada médico da Vitalcare é escolhido por experiência clínica comprovada, comunicação humana e a capacidade de construir um plano de tratamento claro e sem pressão.",
    "كل طبيب في Vitalcare يُختار بفضل خبرة سريرية مثبتة وتواصل إنساني وقدرة على بناء خطة علاج واضحة وغير مرهقة.",
  ),
  "המרפאה שקטה, נקייה ומאורגנת. הרופא הקדיש זמן, ענה על כל שאלה והצוות טיפל בכל עניין הביטוח בלי שאצטרך לרדוף.": r(
    "The clinic is quiet, clean, and organized. The doctor gave time, answered every question, and the team handled insurance without me having to chase.",
    "La clínica es silenciosa, limpia y ordenada. El médico dedicó tiempo, respondió cada pregunta y el equipo se ocupó de todo lo del seguro sin que yo tuviera que perseguirlo.",
    "A clínica é silenciosa, limpa e organizada. O médico dedicou tempo, respondeu cada pergunta e a equipe cuidou de tudo do seguro sem eu precisar correr atrás.",
    "العيادة هادئة ونظيفة ومرتبة. الطبيب خصّص وقتاً وأجاب على كل سؤال والفريق عالج كل أمر التأمين دون أن أحتاج للملاحقة.",
  ),
  "הגעתי אחרי חודשים של חוסר ודאות. בתוך ביקור אחד קיבלתי הסבר מסודר, בדיקות מתאימות ותוכנית טיפול שאפשר להבין.": r(
    "I arrived after months of uncertainty. In one visit I got an orderly explanation, the right tests, and a treatment plan I could understand.",
    "Llegué después de meses de incertidumbre. En una sola visita recibí una explicación ordenada, pruebas adecuadas y un plan de tratamiento que se podía entender.",
    "Cheguei depois de meses de incerteza. Em uma visita recebi uma explicação organizada, exames adequados e um plano de tratamento que dá para entender.",
    "وصلت بعد أشهر من عدم اليقين. خلال زيارة واحدة حصلت على شرح مرتب وفحوصات مناسبة وخطة علاج يمكن فهمها.",
  ),
  "השתמשו בסקשן הזה כדי להסביר את הערך של האסטרטגיה, המערכות ותהליך המסירה. כל כרטיס, תמונה וטקסט ניתנים לעריכה.": r(
    "Use this section to explain the value of the strategy, the systems, and the delivery process. Every card, image, and text is editable.",
    "Usad esta sección para explicar el valor de la estrategia, los sistemas y el proceso de entrega. Cada tarjeta, imagen y texto se pueden editar.",
    "Usem esta seção para explicar o valor da estratégia, dos sistemas e do processo de entrega. Cada cartão, imagem e texto podem ser editados.",
    "استخدموا هذا القسم لشرح قيمة الاستراتيجية والأنظمة ومسار التسليم. كل بطاقة وصورة ونص قابلة للتحرير.",
  ),
  "כל החלטה עוברת דרך שלושה מסננים: איך היא נשמעת בחלל, איך היא מזדקנת עם חומר, ואיך היא גורמת לאנשים לזוז אחרת.": r(
    "Every decision goes through three filters: how it sounds in the space, how it ages with material, and how it makes people move differently.",
    "Cada decisión pasa por tres filtros: cómo suena en el espacio, cómo envejece con el material y cómo hace que la gente se mueva de otra forma.",
    "Cada decisão passa por três filtros: como soa no espaço, como envelhece com o material e como faz as pessoas se moverem de outro jeito.",
    "كل قرار يمر عبر ثلاثة فلاتر: كيف يُسمع في الفراغ، وكيف يشيخ مع الخامة، وكيف يجعل الناس يتحركون بشكل مختلف.",
  ),
  "ברוב ההתמחויות ניתן לקבוע תור ישירות. אם נדרשת הפניה לצורך החזר או בדיקה מסוימת, מתאמת רפואית תעדכן אתכם מראש.": r(
    "In most specialties you can book directly. If a referral is needed for reimbursement or a specific test, a medical coordinator will update you in advance.",
    "En la mayoría de las especialidades se puede pedir cita directamente. Si hace falta una derivación para reembolso o una prueba concreta, una coordinadora médica os actualizará de antemano.",
    "Na maioria das especialidades dá para marcar direto. Se for preciso um encaminhamento para reembolso ou um exame específico, uma coordenadora médica atualiza vocês de antemão.",
    "في معظم التخصصات يمكن حجز موعد مباشرة. إن لزم تحويل للاسترداد أو لفحص معيّن، ستحدّثكم منسّقة طبية مسبقاً.",
  ),
  "אנחנו בונות לכל לקוחה מסלול טיפול אישי — לא טיפול גנרי. המטרה היא תוצאה מחמיאה, רגועה ומדויקת שמרגישה באמת שלך.": r(
    "We build a personal treatment track for every client — not a generic treatment. The goal is a flattering, calm, precise result that actually feels yours.",
    "Construimos para cada clienta un itinerario de tratamiento personal — no un tratamiento genérico. El objetivo es un resultado favorecedor, calmado y preciso que se sienta de verdad tuyo.",
    "Construímos para cada cliente um percurso de tratamento pessoal — não um tratamento genérico. O objetivo é um resultado favorecedor, calmo e preciso que realmente pareça seu.",
    "نبني لكل زبونة مسار علاج شخصي — لا علاجاً عاماً. الهدف نتيجة مُرضية وهادئة ودقيقة تشعر أنها لك حقاً.",
  ),
  "האתר מציג את הערך של הנכס דרך עיצוב, מיקום, תחושה ותהליך — בלי להעמיס על הלקוח ובלי להיראות כמו עוד תבנית רגילה.": r(
    "The site shows the listing’s value through design, location, feeling, and process — without overloading the client and without looking like just another template.",
    "El sitio muestra el valor del inmueble a través de diseño, ubicación, sensación y proceso — sin sobrecargar al cliente y sin parecer otra plantilla más.",
    "O site mostra o valor do imóvel por design, localização, sensação e processo — sem sobrecarregar o cliente e sem parecer mais um modelo comum.",
    "الموقع يعرض قيمة العقار عبر التصميم والموقع والإحساس والمسار — بلا إثقال على العميل وبلا أن يبدو قالباً عادياً آخر.",
  ),
  "Estateo בונה תיק שקט סביב הלקוח: אימות יכולת רכישה, חשיפה מבוקרת, סיורים סגורים ומשא ומתן שמתרחש מחוץ לרעש השוק.": r(
    "Estateo builds a quiet file around the client: purchase-capacity checks, controlled exposure, closed tours, and negotiation that happens outside market noise.",
    "Estateo construye un expediente silencioso alrededor del cliente: verificación de capacidad de compra, exposición controlada, visitas cerradas y una negociación que ocurre fuera del ruido del mercado.",
    "A Estateo constrói um dossiê silencioso em torno do cliente: verificação de capacidade de compra, exposição controlada, visitas fechadas e uma negociação que acontece fora do ruído do mercado.",
    "Estateo تبني ملفاً هادئاً حول العميل: التحقق من قدرة الشراء وتعريض مضبوط وجولات مغلقة وتفاوض يجري خارج ضجيج السوق.",
  ),
  "מיפינו עלויות לפי סניפים, הגדרנו SLA פנימי והעברנו את המנהלים לדשבורד שבועי אחד. פחות כיבוי שריפות, יותר רווחיות.": r(
    "We mapped costs by branch, set an internal SLA, and moved managers onto one weekly dashboard. Less firefighting, more profitability.",
    "Mapeamos costes por sucursales, definimos un SLA interno y pasamos a los managers a un solo panel semanal. Menos apagar incendios, más rentabilidad.",
    "Mapeamos custos por filiais, definimos um SLA interno e passamos os gestores para um único painel semanal. Menos apagar incêndio, mais lucratividade.",
    "رسمنا التكاليف حسب الفروع وحدّدنا SLA داخلياً ونقلنا المديرين إلى لوحة أسبوعية واحدة. أقل إطفاء حرائق، أكثر ربحية.",
  ),
  "סולן היא סטודיו להפקת אירועים שפועל במרכז. אנחנו אוהבים חומרים טבעיים, פרחים עונתיים, ואור שנכון למצלמה וגם לעין.": r(
    "Solen is an event-production studio in the center. We like natural materials, seasonal flowers, and light that is right for the camera and the eye.",
    "Solen es un estudio de producción de eventos que opera en el centro. Nos gustan los materiales naturales, las flores de temporada y una luz correcta para la cámara y para el ojo.",
    "A Solen é um estúdio de produção de eventos no centro. Gostamos de materiais naturais, flores sazonais e uma luz certa para a câmera e para o olho.",
    "سولن استوديو إنتاج مناسبات يعمل في المركز. نحب الخامات الطبيعية والورود الموسمية وضوءاً صحيحاً للكاميرا وللعين.",
  ),
};

const file = path.join(ROOT, "src/i18n/templateExactLexicon.unique13.json");
fs.writeFileSync(file, `${JSON.stringify(unique13, null, 2)}\n`);
console.log(`wrote ${Object.keys(unique13).length} unique13 rows`);
