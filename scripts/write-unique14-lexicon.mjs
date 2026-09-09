#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
function r(en, es, pt, ar) {
  return { en, es, "pt-BR": pt, ar };
}

const unique14 = {
  "הסטודיו מלווה מספר קטן של עסקאות חוף בכל רבעון: בדיקת כיווני רוח, פרטיות, רעש טיילת, תכנון עתידי ומחיר אמיתי למטר.": r(
    "The studio supports a small number of coastal deals each quarter: wind direction, privacy, promenade noise, future planning, and a real price per meter.",
    "El estudio acompaña un número pequeño de operaciones de costa cada trimestre: dirección del viento, privacidad, ruido del paseo, planificación futura y un precio real por metro.",
    "O estúdio acompanha um número pequeno de negócios de costa a cada trimestre: direção do vento, privacidade, ruído da orla, planejamento futuro e um preço real por metro.",
    "الاستوديو يرافق عدداً صغيراً من صفقات الساحل كل ربع: اتجاه الرياح والخصوصية وضجيج الممشى والتخطيط المستقبلي وسعر حقيقي للمتر.",
  ),
  "מרידיאן הוא מלון בוטיק עם 24 חדרים בלבד. אנחנו מעדיפים פחות אורחים, יותר תשומת לב, ועיצוב שנשאר נכון גם בעוד עשור.": r(
    "Meridian is a boutique hotel with only 24 rooms. We prefer fewer guests, more attention, and a design that still holds in a decade.",
    "Meridian es un hotel boutique con solo 24 habitaciones. Preferimos menos huéspedes, más atención y un diseño que sigue siendo correcto dentro de diez años.",
    "O Meridian é um hotel boutique com só 24 quartos. Preferimos menos hóspedes, mais atenção e um design que continua certo daqui a uma década.",
    "مريديان فندق بوتيك بـ 24 غرفة فقط. نفضّل ضيوفاً أقل واهتماماً أكثر وتصميماً يبقى صحيحاً حتى بعد عقد.",
  ),
  "בנינו מודל צינור מכירות, שגרות Forecast ותיעדוף שווקים. בתוך 90 יום ההנהלה ראתה איפה נתקעים עסקאות ומה מתקנים קודם.": r(
    "We built a sales-pipeline model, forecast routines, and market prioritization. Within 90 days leadership saw where deals stall and what to fix first.",
    "Construimos un modelo de pipeline de ventas, rutinas de Forecast y priorización de mercados. En 90 días la dirección vio dónde se atascan las operaciones y qué hay que corregir primero.",
    "Construímos um modelo de pipeline de vendas, rotinas de Forecast e priorização de mercados. Em 90 dias a direção viu onde os negócios travam e o que corrigir primeiro.",
    "بنينا نموذج أنبوب مبيعات وروتين Forecast وترتيب أسواق. خلال 90 يوماً رأت الإدارة أين تعلق الصفقات وماذا يُصلَح أولاً.",
  ),
  "Lectora בונה לכל לומד מסע צפייה, תרגול ומשוב. כל שיעור קצר, ערוך ומדויק, וכל פרויקט מקבל במה עד שהוא מוכן לצאת לעולם.": r(
    "Lectora builds every learner a journey of watching, practice, and feedback. Every lesson is short, edited, and precise, and every project gets a stage until it is ready to go out.",
    "Lectora construye para cada alumno un viaje de visionado, práctica y feedback. Cada clase es corta, editada y precisa, y cada proyecto recibe un escenario hasta que está listo para salir al mundo.",
    "A Lectora constrói para cada aluno uma jornada de visão, prática e feedback. Cada aula é curta, editada e precisa, e cada projeto ganha um palco até estar pronto para ir ao mundo.",
    "Lectora تبني لكل متعلم رحلة مشاهدة وتدريب وملاحظات. كل درس قصير ومُحرَّر ودقيق، وكل مشروع يحصل على منصة حتى يكون جاهزاً للخروج إلى العالم.",
  ),
  "Nadlanist נבנתה עבור סוכן נדל״ן שרוצה לשדר אמינות, יוקרה ושקט. בלי עומס, בלי מחירים פומביים ובלי עיצוב שמשתלט על התוכן.": r(
    "Nadlanist was built for a real-estate agent who wants to broadcast trust, luxury, and quiet. No clutter, no public prices, and no design that takes over the content.",
    "Nadlanist se construyó para un agente inmobiliario que quiere transmitir fiabilidad, lujo y silencio. Sin sobrecarga, sin precios públicos y sin un diseño que se apodere del contenido.",
    "A Nadlanist foi feita para um corretor que quer transmitir confiança, luxo e silêncio. Sem sobrecarga, sem preços públicos e sem um design que tome o conteúdo.",
    "Nadlanist بُنيت لوكيل عقارات يريد بث المصداقية والفخامة والهدوء. بلا ازدحام وبلا أسعار علنية وبلا تصميم يسيطر على المحتوى.",
  ),
  "במקרה חירום רפואי יש לפנות למוקד חירום או חדר מיון. במקרים שאינם מסכני חיים, צוות המרפאה ינסה לתאם תור מהיר לפי זמינות.": r(
    "In a medical emergency go to emergency services or the ER. In cases that are not life-threatening, the clinic team will try to book a fast appointment by availability.",
    "En una emergencia médica hay que acudir a un centro de emergencias o a urgencias. En casos que no ponen en riesgo la vida, el equipo de la clínica intentará coordinar una cita rápida según disponibilidad.",
    "Em uma emergência médica procure o pronto-socorro ou a emergência. Em casos que não põem a vida em risco, a equipe da clínica tentará marcar um horário rápido conforme a disponibilidade.",
    "في حالة طوارئ طبية يجب التوجه إلى مركز طوارئ أو غرفة الإسعاف. في الحالات غير المهددة للحياة سيحاول فريق العيادة تنسيق موعد سريع حسب التوفر.",
  ),
  "התהליך מתחיל מהחיים שלכם: שעות יציאה בבוקר, גילאי הילדים, מי עובד מהבית, כמה חצר באמת צריך ומה יגרום לשבת להרגיש רגועה.": r(
    "The process starts from your life: morning leave times, the kids’ ages, who works from home, how much yard you really need, and what will make Saturday feel calm.",
    "El proceso empieza en vuestra vida: horas de salida por la mañana, edades de los niños, quién trabaja desde casa, cuánto patio hace falta de verdad y qué hará que el sábado se sienta calmado.",
    "O processo começa na vida de vocês: horários de saída de manhã, idades das crianças, quem trabalha de casa, quanto quintal realmente precisa e o que fará o sábado parecer calmo.",
    "المسار يبدأ من حياتكم: ساعات الخروج صباحاً وأعمار الأطفال ومن يعمل من البيت وكم فناء تحتاجون حقاً وما الذي يجعل السبت يبدو هادئاً.",
  ),
  "Noteline מחבר טכניקה, תרגול ובמה. הלמידה נכתבת כמו מחברת תווים: קווים ברורים, חזרות קבועות, הקלטות ומשוב שמפתח סגנון אישי.": r(
    "Noteline connects technique, practice, and stage. Learning is written like a music notebook: clear lines, regular repeats, recordings, and feedback that develops a personal style.",
    "Noteline une técnica, práctica y escenario. El aprendizaje se escribe como un cuaderno de partituras: líneas claras, repeticiones fijas, grabaciones y un feedback que desarrolla un estilo personal.",
    "A Noteline liga técnica, prática e palco. A aprendizagem se escreve como um caderno de partituras: linhas claras, repetições fixas, gravações e um feedback que desenvolve um estilo pessoal.",
    "Noteline تربط التقنية والتدريب والمنصة. التعلّم يُكتب كدفتر نوتات: خطوط واضحة وتكرارات ثابتة وتسجيلات وملاحظات تطوّر أسلوباً شخصياً.",
  ),
  "Kidwise בונה חוגים וסדנאות שבהם ילדים חוקרים, יוצרים ומדברים בביטחון. כל פעילות משלבת צבע, תנועה, סקרנות ומורה שרואה את הילד.": r(
    "Kidwise builds classes and workshops where children explore, create, and speak with confidence. Every activity mixes color, movement, curiosity, and a teacher who sees the child.",
    "Kidwise construye extracurriculares y talleres en los que los niños investigan, crean y hablan con confianza. Cada actividad combina color, movimiento, curiosidad y un profesor que ve al niño.",
    "A Kidwise constrói cursos e oficinas em que crianças exploram, criam e falam com confiança. Cada atividade mistura cor, movimento, curiosidade e um professor que vê a criança.",
    "Kidwise تبني نوادي وورشات يستكشف فيها الأطفال ويبدعون ويتكلمون بثقة. كل نشاط يجمع لوناً وحركة وفضولاً ومعلماً يرى الطفل.",
  ),
  "Masterly יוצרת חוויית למידה פרטית ומוקפדת: מרצים בכירים, עריכה אישית, מפגשי עומק וקהל קטן. כל מסלול נבנה כמו פרק במגזין יוקרתי.": r(
    "Masterly creates a private, careful learning experience: senior lecturers, personal editing, deep sessions, and a small audience. Every track is built like a chapter in a luxury magazine.",
    "Masterly crea una experiencia de aprendizaje privada y cuidada: profesores senior, edición personal, encuentros de profundidad y un público pequeño. Cada itinerario se construye como un capítulo de una revista de lujo.",
    "A Masterly cria uma experiência de aprendizagem particular e cuidada: professores seniores, edição pessoal, encontros de profundidade e um público pequeno. Cada percurso é construído como um capítulo de uma revista de luxo.",
    "Masterly تصنع تجربة تعلّم خاصة ودقيقة: محاضرون كبار وتحرير شخصي ولقاءات عمق وجمهور صغير. كل مسار يُبنى كفصل في مجلة فاخرة.",
  ),
  "במקום עיגולים, טאבים ותמונה סטטית — אזור וידאו גדול ונקי שמציג את הסלון, הטיפולים והתחושה שהלקוחה מקבלת עוד לפני שהיא קובעת תור.": r(
    "Instead of circles, tabs, and a static image — a large, clean video area that shows the salon, the treatments, and the feeling the client gets before she books.",
    "En lugar de círculos, pestañas y una imagen estática — una zona de vídeo grande y limpia que muestra el salón, los tratamientos y la sensación que recibe la clienta antes de pedir cita.",
    "No lugar de círculos, abas e uma imagem estática — uma área de vídeo grande e limpa que mostra o salão, os tratamentos e a sensação que a cliente recebe antes de marcar horário.",
    "بدل دوائر وتبويبات وصورة ثابتة — منطقة فيديو كبيرة ونظيفة تعرض الصالون والعلاجات والإحساس الذي تحصل عليه الزبونة قبل حجز الموعد.",
  ),
  "Skillforge בנויה כמו בית מלאכה מקצועי: אימון קצר, אתגר ביצוע, משוב ותיקון. כל מסלול מתמקד במיומנות אחת עד שהיא הופכת להרגל עבודה.": r(
    "Skillforge is built like a professional workshop: a short drill, a performance challenge, feedback, and a fix. Every track focuses on one skill until it becomes a work habit.",
    "Skillforge está construida como un taller profesional: un entrenamiento corto, un reto de ejecución, feedback y corrección. Cada itinerario se centra en una habilidad hasta que se convierte en un hábito de trabajo.",
    "A Skillforge é construída como uma oficina profissional: um treino curto, um desafio de execução, feedback e correção. Cada percurso foca em uma habilidade até ela virar hábito de trabalho.",
    "Skillforge مبنية كبيت ورشة مهني: تدريب قصير وتحدي أداء وملاحظات وتصحيح. كل مسار يركز على مهارة واحدة حتى تصبح عادة عمل.",
  ),
  "Campusly מעניקה לתלמידים וסטודנטים מערכת תמיכה מלאה: אבחון, שיעורים, מרתונים, סימולציות ומעקב ציונים. הכל בנוי כמו קמפוס קטן וברור.": r(
    "Campusly gives pupils and students a full support system: diagnosis, lessons, marathons, simulations, and grade tracking. Everything is built like a small, clear campus.",
    "Campusly ofrece a alumnos y estudiantes un sistema de apoyo completo: diagnóstico, clases, maratones, simulaciones y seguimiento de notas. Todo está construido como un campus pequeño y claro.",
    "A Campusly oferece a alunos e estudantes um sistema de apoio completo: diagnóstico, aulas, maratonas, simulações e acompanhamento de notas. Tudo é construído como um campus pequeno e claro.",
    "Campusly تمنح التلاميذ والطلاب نظام دعم كامل: تشخيصاً ودروساً وماراثونات ومحاكاة ومتابعة علامات. الكل مبني كحرم صغير وواضح.",
  ),
  "אנחנו לא מתחילים מתבנית. כל תיק נפתח בשאלות על אנשים, כסף, מוניטין וזמן. רק אחרי שמבינים מה באמת בסיכון, כותבים מסמך או נכנסים לאולם.": r(
    "We do not start from a template. Every case opens with questions about people, money, reputation, and time. Only after we understand what is really at risk do we write a document or enter the hall.",
    "No empezamos desde una plantilla. Cada expediente se abre con preguntas sobre personas, dinero, reputación y tiempo. Solo después de entender qué está realmente en riesgo escribimos un documento o entramos a la sala.",
    "Não começamos de um modelo. Cada processo abre com perguntas sobre pessoas, dinheiro, reputação e tempo. Só depois de entender o que está realmente em risco escrevemos um documento ou entramos na sala.",
    "نحن لا نبدأ من قالب. كل ملف يُفتح بأسئلة عن الناس والمال والسمعة والوقت. فقط بعد فهم ما هو في خطر حقاً نكتب مستنداً أو ندخل القاعة.",
  ),
  "Mentora מחברת בין יעדים מקצועיים לבין שיחות עומק, משימות שבועיות ומדידה עדינה. המנטור מכיר את הקצב שלכם ונשאר לצדכם עד שהשינוי מורגש.": r(
    "Mentora connects professional goals with deep conversations, weekly tasks, and gentle measurement. The mentor knows your pace and stays with you until the change is felt.",
    "Mentora conecta objetivos profesionales con conversaciones de profundidad, tareas semanales y una medición suave. El mentor conoce vuestro ritmo y se queda a vuestro lado hasta que el cambio se siente.",
    "A Mentora liga metas profissionais a conversas de profundidade, tarefas semanais e uma medição suave. O mentor conhece o ritmo de vocês e fica ao lado até a mudança ser sentida.",
    "Mentora تربط بين الأهداف المهنية وحوارات العمق ومهام أسبوعية وقياس لطيف. المرشد يعرف إيقاعكم ويبقى إلى جانبكم حتى يُشعَر بالتغيير.",
  ),
  "Polyglota משלבת שיעורים חיים, תרגול יומי קצר וקבוצות שיחה רכות. כל מסלול בנוי סביב ביטחון בדיבור, אוצר מילים שימושי והיכרות עם תרבות.": r(
    "Polyglota combines live lessons, a short daily drill, and gentle conversation groups. Every track is built around speaking confidence, useful vocabulary, and meeting a culture.",
    "Polyglota combina clases en vivo, práctica diaria corta y grupos de conversación suaves. Cada itinerario se construye alrededor de confianza al hablar, vocabulario útil y un encuentro con la cultura.",
    "A Polyglota combina aulas ao vivo, prática diária curta e grupos de conversa suaves. Cada percurso se constrói em torno de confiança na fala, vocabulário útil e um encontro com a cultura.",
    "Polyglota تجمع دروساً حية وتدريباً يومياً قصيراً ومجموعات حديث لطيفة. كل مسار مبني حول الثقة في الكلام ومفردات نافعة والتعرّف على ثقافة.",
  ),
  "הלקוחות שלנו מקבלים שותף משפטי נגיש שמתרגם מורכבות להחלטות. אין ערפל מקצועי, אין הבטחות ריקות — יש דרך פעולה, עדכונים קבועים ואחריות מלאה.": r(
    "Our clients get an accessible legal partner who turns complexity into decisions. No professional fog, no empty promises — there is a way of working, regular updates, and full responsibility.",
    "Nuestros clientes reciben un socio jurídico accesible que traduce complejidad en decisiones. No hay niebla profesional ni promesas vacías — hay una forma de actuar, actualizaciones fijas y responsabilidad plena.",
    "Nossos clientes recebem um sócio jurídico acessível que traduz complexidade em decisões. Não há névoa profissional nem promessas vazias — há um jeito de agir, atualizações fixas e responsabilidade plena.",
    "عملاؤنا يحصلون على شريك قانوني قريب يحوّل التعقيد إلى قرارات. لا ضباب مهني ولا وعود فارغة — هناك طريق عمل وتحديثات ثابتة ومسؤولية كاملة.",
  ),
  "Codehaus מתייחס ללמידה כמו לריפו אמיתי: ספרינטים, קומיטים, ביקורת קוד ופרויקטים עם API, דאטה וענן. המטרה היא לא רק לדעת תחביר אלא לשחרר מוצר.": r(
    "Codehaus treats learning like a real repo: sprints, commits, code review, and projects with APIs, data, and cloud. The goal is not only to know syntax but to ship a product.",
    "Codehaus trata el aprendizaje como un repo de verdad: sprints, commits, revisión de código y proyectos con API, datos y nube. El objetivo no es solo saber sintaxis, sino lanzar un producto.",
    "A Codehaus trata a aprendizagem como um repo de verdade: sprints, commits, review de código e projetos com API, dados e nuvem. O objetivo não é só saber sintaxe, e sim lançar um produto.",
    "Codehaus تعامل التعلّم كمستودع حقيقي: سبرنتات وكوميتات ومراجعة كود ومشاريع بـ API وبيانات وسحابة. الهدف ليس معرفة الصياغة فقط بل إطلاق منتج.",
  ),
  "Craftora מזמינה מבוגרים ויוצרים לעבוד עם קרמיקה, צבע, נייר והדפס. הסדנאות קטנות, החומרים איכותיים, והאווירה מאפשרת לטעות, לחזור ולגלות סגנון.": r(
    "Craftora invites adults and makers to work with ceramics, paint, paper, and print. Workshops are small, materials are good, and the atmosphere lets you err, return, and find a style.",
    "Craftora invita a adultos y creadores a trabajar con cerámica, color, papel e impresión. Los talleres son pequeños, los materiales son de calidad y el ambiente permite equivocarse, volver y descubrir un estilo.",
    "A Craftora convida adultos e criadores a trabalhar com cerâmica, cor, papel e impressão. As oficinas são pequenas, os materiais são de qualidade e a atmosfera deixa errar, voltar e descobrir um estilo.",
    "Craftora تدعو البالغين والمبدعين للعمل مع الخزف واللون والورق والطباعة. الورشات صغيرة والخامات جيدة والأجواء تتيح الخطأ والعودة واكتشاف أسلوب.",
  ),
};

const file = path.join(ROOT, "src/i18n/templateExactLexicon.unique14.json");
fs.writeFileSync(file, `${JSON.stringify(unique14, null, 2)}\n`);
console.log(`wrote ${Object.keys(unique14).length} unique14 rows`);
