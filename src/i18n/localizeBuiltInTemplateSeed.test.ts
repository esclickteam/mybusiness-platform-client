import { describe, expect, it } from "vitest";
import {
  localizeBuiltInTemplateSeed,
  localizeBuiltInText,
  localizeLibraryInsertStyle,
} from "./localizeBuiltInTemplateSeed";

describe("localizeBuiltInTemplateSeed", () => {
  it("keeps Hebrew source when the dashboard language is Hebrew", () => {
    expect(localizeBuiltInText("צור קשר", "he")).toBe("צור קשר");
  });

  it("translates built-in demo phrases without touching unknown customer copy", () => {
    expect(localizeBuiltInText("צור קשר", "en")).toBe("Contact");
    expect(localizeBuiltInText("Custom headline from the client", "en")).toBe(
      "Custom headline from the client",
    );
  });

  it("replaces longer phrases before shorter ones", () => {
    expect(localizeBuiltInText("שאלות נפוצות", "en")).toBe("FAQ");
  });

  it("walks nested default seed objects", () => {
    expect(
      localizeBuiltInTemplateSeed(
        { nav: { contact: "צור קשר" }, title: "שירותים" },
        "es",
      ),
    ).toEqual({ nav: { contact: "Contacto" }, title: "Servicios" });
  });

  it("localizes a restaurant template seed for each dashboard language", () => {
    const seed = {
      heroEyebrow: "פיצה · תנור עצים",
      heroPrimary: "הזמינו פיצה",
      navContact: "צור קשר",
    };
    expect(localizeBuiltInTemplateSeed(seed, "en").heroPrimary).toBe("Order pizza");
    expect(localizeBuiltInTemplateSeed(seed, "es").navContact).toBe("Contacto");
    expect(localizeBuiltInTemplateSeed(seed, "pt-BR").heroEyebrow).toBe("Pizza · forno a lenha");
    expect(localizeBuiltInTemplateSeed(seed, "ar").heroPrimary).toBe("اطلبوا البيتزا");
    expect(localizeBuiltInTemplateSeed(seed, "he").heroPrimary).toBe("הזמינו פיצה");
  });

  it("uses quality lexicon copy instead of leftover-Hebrew phrasebook rows", () => {
    expect(localizeBuiltInText("הזמינו פיצה", "en")).toBe("Order pizza");
    expect(localizeBuiltInText("פיצה · תנור עצים", "en")).toBe("Pizza · wood oven");
    expect(localizeBuiltInText("הזמינו פיצה", "ar")).toBe("اطلبوا البيتزا");
  });

  it("does not smash leftover Hebrew into hybrid sentences", () => {
    const smashed = localizeBuiltInText(
      "אנחנו מאמינות שכל לקוחה צריכה יחס אישי, אבחון מדויק וטיפול שמותאם בדיוק לעור, לשיער ולסגנון שלה — כדי לצאת מהסלון רעננה, בטוחה וזוהרת.",
      "en",
    );
    expect(smashed).not.toMatch(/Client/);
    expect(smashed).toMatch(/personal attention|client/i);
  });

  it("translates booking CTAs without leftover Hebrew", () => {
    expect(localizeBuiltInText("לקביעת ייעוץ", "en")).toBe("Book a consultation");
    expect(localizeBuiltInText("לקביעת תור", "es")).toBe("Reservar cita");
    expect(localizeBuiltInText("לראות שירותים", "pt-BR")).toBe("Ver serviços");
    expect(localizeBuiltInText("לקביעת ייעוץ", "ar")).toBe("احجزوا استشارة");
    expect(localizeBuiltInText("לקביעת ייעוץ", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("uses the generated exact lexicon for gallery template descriptions", () => {
    expect(
      localizeBuiltInText(
        "תבנית פיצרייה: הירו באלכסון עם פיצה מסתובבת, תפריט כבלוקי משולשים, רצועת חום תנור וטופס כרטיס הזמנה — אבק קמח ואנימציית stretch.",
        "en",
      ),
    ).toMatch(/pizzeria template/i);
  });

  it("localizes store chrome and studio library defaults", () => {
    expect(localizeBuiltInText("הסל שלכם", "en")).toBe("Your cart");
    expect(localizeBuiltInText("משלוח מהיר", "es")).toBe("Envío rápido");
    expect(localizeBuiltInText("תשלום מאובטח", "pt-BR")).toBe("Pagamento seguro");
    expect(localizeBuiltInText("קורות חיים", "en")).toBe("Resume");
    expect(localizeBuiltInText("טבלת מחירים", "ar")).toBe("جدول أسعار");
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).toMatch(/Home page/i);
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).toMatch(/Split opening/i);
    expect(localizeBuiltInText("הסל שלכם", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("rewrites baked-in RTL markup for LTR dashboard languages", () => {
    const html =
      '<table style="direction:rtl;text-align:right"><th>פריט</th></table>';
    const en = localizeBuiltInText(html, "en");
    expect(en).toMatch(/direction:ltr/);
    expect(en).toMatch(/text-align:start/);
    expect(en).toMatch(/Item/);
    expect(en).not.toMatch(/direction:rtl/);
    const he = localizeBuiltInText(html, "he");
    expect(he).toMatch(/direction:rtl/);
    expect(he).toMatch(/פריט/);
  });

  it("localizes HTML text nodes without letting leftover names block the rest", () => {
    const html =
      '<html lang="he" dir="rtl"><p>הדר עשת ביוטי</p><a>צור קשר</a></html>';
    const en = localizeBuiltInText(html, "en");
    expect(en).toMatch(/lang="en"/);
    expect(en).toMatch(/dir="ltr"/);
    expect(en).toMatch(/Contact/);
    expect(en).toMatch(/הדר עשת ביוטי/);
    expect(en).not.toMatch(/צור קשר/);
  });

  it("does not smash short hero lines into broken word-by-word English", () => {
    expect(localizeBuiltInText("לילה קטן. טעמים גדולים.", "en")).toBe(
      "A small night. Big flavors.",
    );
    expect(localizeBuiltInText("הזמינו בר", "en")).toBe("Book the bar");
    expect(localizeBuiltInText("בוקר שנמשך עד הצהריים.", "en")).toBe(
      "A morning that lasts until noon.",
    );
  });

  it("translates shared restaurant and course defaultData sentences", () => {
    expect(
      localizeBuiltInText("ספרו לנו מתי אתם מגיעים, כמה סועדים ומה חשוב לכם — ואנחנו נכין את השולחן.", "en"),
    ).toMatch(/Tell us when you are coming/i);
    expect(localizeBuiltInText("איך נרשמים?", "es")).toBe("¿Cómo me inscribo?");
    expect(localizeBuiltInText("אפשר ללמוד מרחוק?", "pt-BR")).toBe("Dá para estudar à distância?");
    expect(
      localizeBuiltInText("מהתוסף חנות בניהול העסק — ברגע שמוסיפים מוצרים הם נמשכים אוטומטית.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("translates store hero copy without leftover Hebrew hybrids", () => {
    const hero = localizeBuiltInText(
      "מצעים ובדים שנבחרים לפי מגע, לא רק לפי צבע.",
      "en",
    );
    expect(hero).toMatch(/Bedding and fabrics chosen by touch/i);
    expect(hero).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("דרופ. קורט. תרבות.", "en")).toBe(
      "Drop. Court. Culture.",
    );
    expect(localizeBuiltInText("הסל שלכם", "he")).toBe("הסל שלכם");
  });

  it("rewrites library insert styles to follow the dashboard language", () => {
    expect(
      localizeLibraryInsertStyle(
        { direction: "rtl", textAlign: "right", color: "#111" },
        "en",
      ),
    ).toEqual({ direction: "ltr", textAlign: "start", color: "#111" });
    expect(
      localizeLibraryInsertStyle(
        { direction: "rtl", textAlign: "right" },
        "he",
      ),
    ).toEqual({ direction: "rtl", textAlign: "right" });
    expect(
      localizeLibraryInsertStyle(
        { direction: "rtl", textAlign: "right" },
        "ar",
      ),
    ).toEqual({ direction: "rtl", textAlign: "start" });
  });

  it("translates remaining unique hero and CTA defaultData", () => {
    expect(localizeBuiltInText("למנות", "en")).toBe("See the dishes");
    expect(localizeBuiltInText("קבעו ביקור", "es")).toBe("Reserven una visita");
    expect(localizeBuiltInText("בדקו זמינות", "en")).toMatch(/availability|available/i);
    expect(localizeBuiltInText("לתיאום פגישה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("הצעד הבא בלמידה מתחיל בשיחה קצרה — בלי התחייבות.", "en"),
    ).toMatch(/next step|short conversation/i);
    expect(localizeBuiltInText("אבחון לפני התחלה", "pt-BR")).toMatch(/Diagnóstico/i);
    expect(localizeBuiltInText("ביטול עד 24 שעות ללא חיוב", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שנות ניסיון", "en")).toBe("Years of experience");
    expect(localizeBuiltInText("שעות פעילות", "es")).toMatch(/Horario/i);
    expect(localizeBuiltInText("לצפייה בתפריט", "en")).toBe("See the menu");
    expect(localizeBuiltInText("משלוחים והחזרות", "en")).toBe("Shipping and returns");
    expect(localizeBuiltInText("צריכים עזרה בבחירה?", "es")).toMatch(/ayuda/i);
    expect(localizeBuiltInText("45-75 דק׳", "en")).toBe("45-75 min");
    expect(localizeBuiltInText("משך משוער", "es")).toMatch(/Duraci[oó]n/i);
    expect(localizeBuiltInText("קבלת פנים", "en")).toBe("Reception");
    expect(localizeBuiltInText("מומחית", "pt-BR")).toBe("Especialista");
    expect(localizeBuiltInText("שם המותג", "en")).toBe("Brand name");
    expect(localizeBuiltInText("רעבים?", "en")).toBe("Hungry?");
    expect(
      localizeBuiltInText(
        "לא מתחילות טיפול לפני התאמת ציפיות ותיעוד מלא.",
        "en",
      ),
    ).toMatch(/expectations|notes/i);
    expect(
      localizeBuiltInText("טוען מוצרים מתוסף החנות...", "ar"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שיחה", "en")).toBe("Consult");
    expect(
      localizeBuiltInText(
        "הקמנו מקום שמקשיב קודם כל לאדם שמולנו, לפני בחירת צבע, חומר או פרוטוקול.",
        "en",
      ),
    ).toMatch(/listens|person/i);
    expect(localizeBuiltInText("רגליים מלאות", "en")).toBe("Full legs");
    expect(
      localizeBuiltInText(
        "שעווה רכה ותוצאה אחידה. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מוצר אביזרים מתוך קטלוג Sportifya.", "en")).toBe(
      "Accessories product from the Sportifya catalog.",
    );
    expect(localizeBuiltInText("מוצר ירקות מתוך קטלוג Greenbite.", "es")).toMatch(
      /verduras|Greenbite/i,
    );
    expect(localizeBuiltInText("הסיפור של Burgerhaus.", "en")).toBe(
      "The story of Burgerhaus.",
    );
    expect(localizeBuiltInText("נולדנו מהקמח.", "en")).toBe(
      "We were born from flour.",
    );
    expect(localizeBuiltInText("רפואה רגועה,\nמדויקת ואנושית.", "es")).toMatch(
      /Medicina/i,
    );
    expect(localizeBuiltInText("דרופ חצות", "en")).toBe("Midnight drop");
    expect(localizeBuiltInText("חדש בקולקציה", "en")).toBe("New in the collection");
    expect(localizeBuiltInText("הוסף לסל", "es")).toMatch(/carrito/i);
    expect(localizeBuiltInText("נעל אימון מתוך קטלוג Soleora — נעליים.", "en")).toBe(
      "Training shoe from the Soleora catalog — shoes.",
    );
    expect(
      localizeBuiltInText("Playora · כיף ברמה גבוהה. · מוצרים מתוסף החנות", "es"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סגור", "en")).toBe("Close");
    expect(
      localizeBuiltInText("אתר מלא לסוכנות פרסום: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("בר צבע לשיער: בליאז׳, גוונים, תיקוני צבע וברק.", "pt-BR"),
    ).toMatch(/balayage/i);
  });

  it("localizes store experience, project codes, dates, and unique rows", () => {
    expect(
      localizeBuiltInText("Vinora — יקב ויינות עם חוויית חנות מלאה.", "en"),
    ).toBe("Vinora — winery and wines with a full store experience.");
    expect(
      localizeBuiltInText("Vinora — יקב ויינות עם חוויית חנות מלאה.", "es"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("Vinora · יקב ויינות · Powered by Bizuply", "en"),
    ).toBe("Vinora · winery and wines · Powered by Bizuply");
    expect(localizeBuiltInText("פרויקט Alpha", "en")).toBe("Project Alpha");
    expect(localizeBuiltInText("פרויקט Beta", "es")).toBe("Proyecto Beta");
    expect(localizeBuiltInText("פרויקט Gamma", "pt-BR")).toBe("Projeto Gamma");
    expect(localizeBuiltInText("28 במאי 2026", "en")).toBe("May 28, 2026");
    expect(localizeBuiltInText("27 פברואר, 2026", "es")).toMatch(/27 de febrero de 2026/i);
    expect(localizeBuiltInText("קפה ספיישלטי", "en")).toBe("specialty coffee");
    expect(localizeBuiltInText("תאריך", "en")).toBe("Date");
    expect(localizeBuiltInText("וילות", "es")).toBe("Villas");
    expect(localizeBuiltInText("נשמח לקבל אתכם.", "en")).toMatch(/welcome/i);
    expect(localizeBuiltInText("Vinora — יקב ויינות עם חוויית חנות מלאה.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("כותרת שירות 1", "en")).toBe("Service title 1");
    expect(localizeBuiltInText("שאלה 3", "es")).toMatch(/Pregunta 3/);
    expect(localizeBuiltInText("מאי 2026", "en")).toBe("May 2026");
    expect(localizeBuiltInText("שבת 19:00", "en")).toMatch(/Saturday 19:00/);
    expect(localizeBuiltInText("15 דק׳", "en")).toBe("15 min");
    expect(
      localizeBuiltInText("בייקון סמאש — לחמנייה, בשר, גבינה — בלי פילוסופיה.", "en"),
    ).toMatch(/Bacon smash/);
    expect(
      localizeBuiltInText("בייקון סמאש — לחמנייה, בשר, גבינה — בלי פילוסופיה.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("Adspire — סוכנות פרסום עם תהליך חד ותוצאות מדידות.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("מיפוי אור, רעש, תנועה, שכנים, מגבלות וחומר מקומי.", "en"),
    ).toMatch(/light|noise|neighbors/i);
    expect(localizeBuiltInText("אזל מהמלאי", "es")).toMatch(/Agotado/i);
    expect(
      localizeBuiltInText("Lumenware — אלקטרוניקה וגאדג׳טים עם חוויית קנייה מלאה.", "en"),
    ).toMatch(/full shopping experience/i);
    expect(
      localizeBuiltInText("Lumenware — אלקטרוניקה וגאדג׳טים עם חוויית קנייה מלאה.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("א׳–ה׳ 09:00–20:00 · ו׳ 09:00–14:00", "en")).toMatch(/Sun–Thu/);
    expect(localizeBuiltInText("א׳–ה׳ 09:00–20:00 · ו׳ 09:00–14:00", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(
      localizeBuiltInText("מוס שוקולד טבעוני — מהאדמה לצלחת — בלי פשרות על טעם.", "en"),
    ).toMatch(/Vegan chocolate mousse/);
    expect(
      localizeBuiltInText("יחס עדין וסבלני שהופך את הביקור לחוויה נעימה לילדים.", "en"),
    ).toMatch(/children|gentle/i);
    expect(
      localizeBuiltInText("Influencix — סוכנות משפיענים עם חתימת creator spotlight.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("זרימות תפעול פשוטות שחוסכות זמן ומשפרות את חוויית הלקוח.", "en"),
    ).toMatch(/operations|client experience/i);
    expect(localizeBuiltInText("שפה 01", "en")).toBe("Language 01");
    expect(localizeBuiltInText("תיק 12", "en")).toBe("Case 12");
    expect(localizeBuiltInText("סגור תפריט", "es")).toMatch(/Cerrar menú/i);
    expect(
      localizeBuiltInText("ניהול שוטף לעוסק עם נפח מסמכים קבוע ודוחות חודשיים פשוטים.", "en"),
    ).toMatch(/bookkeeping|monthly reports/i);
    expect(localizeBuiltInText("> מתחילים בדיקת היקף", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "ירושלים, מבשרת, מעלה אדומים, גוש עציון ובית שמש בתיאום מוקדם.",
        "en",
      ),
    ).toMatch(/Jerusalem/);
    expect(
      localizeBuiltInText(
        "ירושלים, מבשרת, מעלה אדומים, גוש עציון ובית שמש בתיאום מוקדם.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "הסטודיו מרגיש כמו חדר נשימה בעיר. עדין, מדויק ומאוד לא מתאמץ.",
        "es",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "מכינים תוכניות, מפרטים וספקים כדי שכל פרט יהיה ברור לפני הביצוע.",
        "en",
      ),
    ).toMatch(/plans|specs|suppliers/i);
    expect(
      localizeBuiltInText(
        "מכינים תוכניות, מפרטים וספקים כדי שכל פרט יהיה ברור לפני הביצוע.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "כן, אפשר להתחיל בחינם לגמרי וללא כרטיס אשראי, ולשדרג רק כשמוכנים.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "בית טוב לא צועק. הוא מחזיק את השקט, את האור ואת האנשים שנכנסים אליו.",
        "en",
      ),
    ).toMatch(/quiet|light/i);
    expect(
      localizeBuiltInText(
        "בית טוב לא צועק. הוא מחזיק את השקט, את האור ואת האנשים שנכנסים אליו.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לא נמצא", "en")).toBe("Not found");
    expect(
      localizeBuiltInText(
        "לא. הפגישה נועדה להבין את המקרה, לבדוק התאמה ולהציג כיווני פעולה אפשריים.",
        "es",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "היי! ברוכים הבאים ל־Novastra. צריכים עזרה לבחור קפסולה, מידה או לוק? אנחנו כאן.",
        "en",
      ),
    ).toMatch(/Welcome to Novastra/);
    expect(
      localizeBuiltInText(
        "היי! ברוכים הבאים ל־Novastra. צריכים עזרה לבחור קפסולה, מידה או לוק? אנחנו כאן.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "חנות בית ועיצוב מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.",
        "en",
      ),
    ).toMatch(/home and design|store add-on/i);
    expect(
      localizeBuiltInText(
        "חנות בית ועיצוב מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "חנות קוסמטיקה ויופי מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "סינדר היא בית קלייה ושולחן טעימות. פולים טריים, חליטות מדויקות, ואווירה בלי הצגות.",
        "en",
      ),
    ).toMatch(/roast|tasting/i);
    expect(
      localizeBuiltInText(
        "סינדר היא בית קלייה ושולחן טעימות. פולים טריים, חליטות מדויקות, ואווירה בלי הצגות.",
        "es",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "אנחנו בונים חנות בית ועיצוב שמכבדת גם עיצוב וגם תפעול: קטגוריות, סינונים, עמודי מוצר וסל — והכול מחובר לתוסף החנות.",
        "en",
      ),
    ).toMatch(/home and design/i);
    expect(
      localizeBuiltInText(
        "אנחנו בונים חנות בית ועיצוב שמכבדת גם עיצוב וגם תפעול: קטגוריות, סינונים, עמודי מוצר וסל — והכול מחובר לתוסף החנות.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "תקציב, יעד, קהל, דדליין. אנחנו נחזור עם כיוון ראשוני ומה צריך לקרות כדי לבדוק אותו מהר.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "גוון טבעי בלי הלם. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).toMatch(/Natural tone without shock/i);
    expect(
      localizeBuiltInText(
        "גוון טבעי בלי הלם. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "חידוש צבע אחרי החלמה או שנה. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).toMatch(/Color refresh after healing/i);
    expect(
      localizeBuiltInText(
        "חידוש צבע אחרי החלמה או שנה. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "מנות קטנות, שיחות ארוכות ויין שנשפך בנדיבות — ככה אנחנו אוהבים לילות. מאחורי כל מנה עומד צוות שמכיר את חומרי הגלם בשמם, בונה הכנות מוקדמות בקצב יומי ושומר על אירוח חם מהרגע שנכנסים ועד הקינוח האחרון.",
        "en",
      ),
    ).toMatch(/Small plates|hospitality/i);
    expect(
      localizeBuiltInText(
        "מנות קטנות, שיחות ארוכות ויין שנשפך בנדיבות — ככה אנחנו אוהבים לילות. מאחורי כל מנה עומד צוות שמכיר את חומרי הגלם בשמם, בונה הכנות מוקדמות בקצב יומי ושומר על אירוח חם מהרגע שנכנסים ועד הקינוח האחרון.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "Playora נבנתה כחנות גדולה עם עשרות סקשנים, עמודי תוכן וחיבור מלא לתוסף החנות של Bizuply.",
        "es",
      ),
    ).toMatch(/tienda grande/i);
    expect(
      localizeBuiltInText(
        "Justora נבנתה למשרדי עורכי דין שרוצים לשדר אמינות, עוצמה ומקצועיות — בלי אתר כבד, מיושן או עמוס. המבנה מוביל את הלקוח מהבעיה, דרך תחומי ההתמחות, ועד קביעת ייעוץ.",
        "en",
      ),
    ).toMatch(/law firms/i);
    expect(
      localizeBuiltInText(
        "Justora נבנתה למשרדי עורכי דין שרוצים לשדר אמינות, עוצמה ומקצועיות — בלי אתר כבד, מיושן או עמוס. המבנה מוביל את הלקוח מהבעיה, דרך תחומי ההתמחות, ועד קביעת ייעוץ.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קיבלנו את פנייתך", "en")).toBe("We received your inquiry");
    expect(localizeBuiltInText('<p>מופעל באמצעות Bizuply</p>', "es")).toMatch(/Funciona con Bizuply/);
    expect(
      localizeBuiltInText(
        "Craftora מזמינה מבוגרים ויוצרים לעבוד עם קרמיקה, צבע, נייר והדפס. הסדנאות קטנות, החומרים איכותיים, והאווירה מאפשרת לטעות, לחזור ולגלות סגנון.",
        "en",
      ),
    ).toMatch(/ceramics|workshops/i);
    expect(
      localizeBuiltInText(
        "Craftora מזמינה מבוגרים ויוצרים לעבוד עם קרמיקה, צבע, נייר והדפס. הסדנאות קטנות, החומרים איכותיים, והאווירה מאפשרת לטעות, לחזור ולגלות סגנון.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique16 leftover demo titles and from-price labels", () => {
    expect(localizeBuiltInText("שקית בית", "en")).toBe("Home tote bag");
    expect(localizeBuiltInText("דברו איתי", "es")).toBe("Háblame");
    expect(localizeBuiltInText("חזר למלאי", "pt-BR")).toBe("De volta ao estoque");
    expect(localizeBuiltInText("ג׳קט רחוב", "ar")).toBe("جاكيت شارع");
    expect(localizeBuiltInText("שקית בית", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החל מ־₪180", "en")).toBe("From ₪180");
    expect(localizeBuiltInText("החל מ־₪240", "es")).toBe("Desde ₪240");
    expect(localizeBuiltInText("החל מ־₪160", "pt-BR")).toBe("A partir de ₪160");
    expect(localizeBuiltInText("החל מ־₪390", "ar")).toMatch(/₪390/);
    expect(localizeBuiltInText("החל מ־₪180", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("תאריך:", "en")).toBe("Date:");
    expect(localizeBuiltInText("משימה לנציג", "en")).toBe("Task for the agent");
    expect(localizeBuiltInText("תוצאה 1", "en")).toBe("Result 1");
  });

  it("localizes unique17 rich-store demo copy and AI inspector phrases", () => {
    expect(localizeBuiltInText("סטודיו מסחר עשיר", "en")).toBe("Rich commerce studio");
    expect(localizeBuiltInText("בחירות החנות", "es")).toBe("Selección de la tienda");
    expect(localizeBuiltInText("פתיחת החנות", "pt-BR")).toBe("Abrir a loja");
    expect(localizeBuiltInText("מה חשוב לך בדירוג?", "en")).toBe("What matters in the score?");
    expect(localizeBuiltInText("כשנכנס ליד חדש", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סטודיו מסחר עשיר", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("does not rewrite saved customer copy over localized defaults", () => {
    const defaults = localizeBuiltInTemplateSeed(
      { heroTitle: "צור קשר", heroPrimary: "הזמינו פיצה" },
      "en",
    );
    const saved = {
      heroTitle: "Custom headline from the client",
      __content: { "home.hero.h1": { text: "Our edited hero" } },
    };
    const merged = { ...defaults, ...saved };
    expect(merged.heroTitle).toBe("Custom headline from the client");
    expect(merged.__content["home.hero.h1"].text).toBe("Our edited hero");
    expect(merged.heroPrimary).toBe("Order pizza");
    expect(localizeBuiltInText("Custom headline from the client", "en")).toBe(
      "Custom headline from the client",
    );
  });

  it("localizes unique18 dish suffixes and leftover sentences", () => {
    expect(localizeBuiltInText("בורגר עדשים — מהאדמה לצלחת — בלי פשרות על טעם.", "en")).toMatch(/lentil/i);
    expect(localizeBuiltInText("טארטלט לימון — סוכר כחומר גלם — לא רק מתיקות.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שיאו לונג באו — הקיטור מרים — הסל יורד לשולחן.", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מטבח שנולד מאהבה לחומר הגלם ולאנשים סביב השולחן.", "en")).toMatch(/kitchen/i);
    expect(localizeBuiltInText("כתבו כתובת, גודל ומחיר מבוקש — נחזור עם הערכה.", "pt-BR")).toMatch(/endereço/i);
    expect(localizeBuiltInText("פגישה עם {{appointment.clientName}}", "en")).toBe(
      "Appointment with {{appointment.clientName}}",
    );
    expect(localizeBuiltInText("בורגר עדשים — מהאדמה לצלחת — בלי פשרות על טעם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique19 leftover sentences, juice/melt/perfect-dish, and ASCII total", () => {
    expect(localizeBuiltInText("גזר כורכום — סחוט עכשיו — נשתייה מיד.", "en")).toMatch(/carrot/i);
    expect(localizeBuiltInText("גזר כורכום — סחוט עכשיו — נשתייה מיד.", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("וניל מדגסקר — ההמסה היא חלק מהחוויה.", "es")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("המנה של לימון אמלפי הייתה מושלמת.", "pt-BR")).toMatch(/perfeito/i);
    expect(localizeBuiltInText("צלעות Baby — עשן נמוך, חום ארוך, טעם עמוק.", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText('סה"כ', "en")).toBe("Total");
    expect(localizeBuiltInText("איפה שתובנה אנושית פוגשת טכנולוגיה חכמה", "en")).toMatch(/insight/i);
    expect(localizeBuiltInText("מפגשים קצרים, AMA וסדנאות שמתאימות ליומן העמוס.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
  });

  it("localizes unique20 leftover sentences, strawberry melt, and store chrome", () => {
    expect(localizeBuiltInText("מיקום טוב הוא השקעה — לא רק כתובת.", "en")).toMatch(/investment/i);
    expect(localizeBuiltInText("מיקום טוב הוא השקעה — לא רק כתובת.", "pt-BR")).toMatch(/endereço/i);
    expect(localizeBuiltInText("תות שדה — ההמסה היא חלק מהחוויה.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סגור תפריט", "es")).toMatch(/Cerrar menú/i);
    expect(localizeBuiltInText("מציג את המוצרים מניהול החנות שלך", "en")).toMatch(/store/i);
    expect(localizeBuiltInText("להרגיע", "en")).toMatch(/soothe/i);
    expect(localizeBuiltInText("מפרט 01", "en")).toMatch(/spec/i);
  });

  it("localizes unique21 leftover sentences", () => {
    expect(localizeBuiltInText("ערב שמתחיל בצלחת ונגמר בזיכרון.", "en")).toMatch(/memory/i);
    expect(localizeBuiltInText("ערב שמתחיל בצלחת ונגמר בזיכרון.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("איך להפחית עומס רגשי ביום־יום?", "pt-BR")).toMatch(/emocional/i);
    expect(localizeBuiltInText("5 אוטומציות שכל עסק צריך לבנות", "es")).toMatch(/automatizaciones/i);
  });

  it("localizes unique22 leftover sentences", () => {
    expect(localizeBuiltInText("יותר מארוחה — ערב שנשאר איתך.", "en")).toMatch(/evening/i);
    expect(localizeBuiltInText("יותר מארוחה — ערב שנשאר איתך.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מותגים ומוצרים שעובדים איתנו", "pt-BR")).toMatch(/conosco/i);
    expect(localizeBuiltInText("סוכר הוא מבנה — לא רק מתיקות.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique23 leftover sentences", () => {
    expect(localizeBuiltInText("בית טוב מורגש — לא רק נראה.", "en")).toMatch(/felt/i);
    expect(localizeBuiltInText("בית טוב מורגש — לא רק נראה.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שלושה מנועים.", "es")).toMatch(/Tres motores/i);
    expect(localizeBuiltInText("הזמינו טאקוס — נצרוב עכשיו.", "pt-BR")).toMatch(/tacos/i);
  });

  it("localizes unique24 leftover sentences, know-all, and ingredient-fit", () => {
    expect(localizeBuiltInText("מיצים — כל מה שצריך לדעת.", "en")).toMatch(/juice/i);
    expect(localizeBuiltInText("מיצים — כל מה שצריך לדעת.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חומרי גלם שמתאימים לסושי", "es")).toMatch(/sushi/i);
    expect(localizeBuiltInText("כל הזכויות שמורות © 2026", "pt-BR")).toMatch(/direitos reservados/i);
  });

  it("localizes unique25 titles, behind-the-scenes, and ₪ unit prices", () => {
    expect(localizeBuiltInText("המעבדה — מאחורי הקלעים.", "en")).toMatch(/behind the scenes/i);
    expect(localizeBuiltInText("המעבדה — מאחורי הקלעים.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("₪42 · 3 יח׳", "en")).toBe("₪42 · 3 pcs");
    expect(localizeBuiltInText("₪28 · פרוסה", "es")).toMatch(/rebanada/i);
    expect(localizeBuiltInText("כמה זמן לוקח לקבל תור?", "pt-BR")).toMatch(/horário/i);
  });

  it("localizes unique26 leftover titles and hyphen opening hours", () => {
    expect(localizeBuiltInText("מאידאה למוצר ולשוק.", "en")).toMatch(/idea/i);
    expect(localizeBuiltInText("מאידאה למוצר ולשוק.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("א׳-ה׳ 08:30-19:00", "en")).toMatch(/Sun–Thu/i);
    expect(localizeBuiltInText("א׳-ה׳ 08:30-19:00", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique27 titles, read-time, shekel-from, and multiline chrome", () => {
    expect(localizeBuiltInText("נדל״ן ועסקאות מורכבות", "en")).toMatch(/real estate/i);
    expect(localizeBuiltInText("נדל״ן ועסקאות מורכבות", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("12 דק׳ קריאה · אתמול", "en")).toBe("12 min read · yesterday");
    expect(localizeBuiltInText("6 דק׳ קריאה · השבוע", "es")).toMatch(/lectura/i);
    expect(localizeBuiltInText("החל מ-220 ש״ח", "pt-BR")).toMatch(/220/);
    expect(localizeBuiltInText("החל מ-220 ש״ח", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החל מ-₪3,400 לשן", "en")).toMatch(/tooth/i);
    expect(localizeBuiltInText("₪54 · חריף עדין", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שלושה מנועים.\nאפס קוסמטיקה.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("4 חדרים · שתי חזיתות", "en")).toMatch(/2 facades|two facades/i);
    expect(localizeBuiltInText("טיפול · 90 דק׳", "es")).toMatch(/90 min/i);
    expect(localizeBuiltInText("שיקום מחסום העור", "en")).toMatch(/skin barrier/i);
    expect(localizeBuiltInText("שיקום מחסום העור", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מחירים שקופים", "en")).toMatch(/transparent/i);
    expect(localizeBuiltInText("3 חד׳ · קומה 4", "en")).toMatch(/floor 4/i);
    expect(localizeBuiltInText("4 חד׳ · נוף", "en")).toMatch(/view/i);
    expect(localizeBuiltInText("צבע וגוונים", "es")).toMatch(/color/i);
    expect(localizeBuiltInText("ליווי ציבורי שוטף.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יצירת קשר", "pt-BR")).toBe("Fale conosco");
    expect(localizeBuiltInText("השירותים שלנו", "pt-BR")).toBe("Nossos serviços");
    expect(localizeBuiltInText("הטיפולים שלנו", "pt-BR")).toBe("Nossos tratamentos");
    expect(localizeBuiltInText("כלכלה שקופה", "en")).toMatch(/transparent/i);
    expect(localizeBuiltInText("כלכלה שקופה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("נתחיל בשיחה", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עיסוי קטיפה", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ברסקט מעושן", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עיסוי פנים", "en")).toMatch(/facial/i);
    expect(localizeBuiltInText("עיסוי פנים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שלחו דרישה", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חומוס ביתי", "pt-BR")).toMatch(/homus|hummus/i);
    expect(localizeBuiltInText("שמפו בוטני", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique33 leftover FAQ, contact, and studio chrome", () => {
    expect(localizeBuiltInText("מידע נוסף", "en")).toMatch(/more info|learn more/i);
    expect(localizeBuiltInText("מידע נוסף", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("השארת פרטים", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("נרשמים ובוחרים תבנית.", "pt-BR")).toMatch(/modelo|cadastre/i);
    expect(localizeBuiltInText("בכל רגע.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("פס 1 - כותרת", "en")).toMatch(/band 1/i);
    expect(localizeBuiltInText("הצוות שלנו", "pt-BR")).toMatch(/equipe/i);
    expect(localizeBuiltInText("צ׳אט ומייל.", "es")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique34 leftover quote, reviews, and store chrome", () => {
    expect(localizeBuiltInText("בקשת הצעת מחיר", "en")).toMatch(/quote/i);
    expect(localizeBuiltInText("בקשת הצעת מחיר", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("המלצות לקוחות", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מוצרים נבחרים", "pt-BR")).toMatch(/produto/i);
    expect(localizeBuiltInText("אזל מהמלאי", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הבלוג שלנו", "en")).toMatch(/blog/i);
    expect(
      localizeBuiltInText("עיצוב טוב מרגישים עוד לפני שמסבירים אותו.", "pt-BR"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("פורטפוליו", "es")).toMatch(/portafolio/i);
    expect(localizeBuiltInText("בקבוקי וינטג'", "en")).toMatch(/vintage/i);
    expect(localizeBuiltInText("בקבוקי וינטג'", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique35 leftover insert-default section chrome", () => {
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם.", "en")).toMatch(/details|get back/i);
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ללא ספאם. אפשר להסיר הרשמה בכל רגע.", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("איך זה עובד?", "pt-BR")).toMatch(/funciona/i);
    expect(localizeBuiltInText("לחצי כדי להחליף, להוסיף או לערוך מדיה.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קבלת פרטים", "en")).toMatch(/detail/i);
    expect(localizeBuiltInText("אזור וידאו", "pt-BR")).toMatch(/v[ií]deo/i);
  });

  it("localizes unique36 leftover insert-default feature and CRM chrome", () => {
    expect(localizeBuiltInText("החל מ־", "en")).toMatch(/from/i);
    expect(localizeBuiltInText("החל מ־", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החל מ־₪350", "en")).toMatch(/350/);
    expect(localizeBuiltInText("החל מ־₪350", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("כל סקשן נראה מעולה גם במובייל.", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מעלים אתר מקצועי תוך זמן קצר.", "pt-BR")).toMatch(/site|profissional/i);
    expect(localizeBuiltInText("וידאו הסבר", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שם הלקוח מהאזור האישי / CRM", "en")).toMatch(/client name|CRM/i);
    expect(localizeBuiltInText("עבודות חשמל מסודרות ומקצועיות", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique37 leftover insert-default section and editor chrome", () => {
    expect(localizeBuiltInText("חבילות ומחירים ברורים", "en")).toMatch(/package|price/i);
    expect(localizeBuiltInText("חבילות ומחירים ברורים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("האנשים מאחורי המותג", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שאלות שחשוב לשאול", "pt-BR")).toMatch(/pergunt/i);
    expect(localizeBuiltInText("נתונים וסטטיסטיקות", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יתרון בפרויקט 1", "en")).toMatch(/advantage|project/i);
    expect(localizeBuiltInText("יתרון בפרויקט 1", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יכולת 1 - כותרת", "en")).toMatch(/capability|title/i);
    expect(localizeBuiltInText("יכולת 1 - כותרת", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("טופס בקשת שירות", "pt-BR")).toMatch(/formul[aá]rio|servi[cç]o/i);
  });

  it("localizes unique39 leftover IDO preview body, FAQ, and form chrome", () => {
    expect(
      localizeBuiltInText(
        "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל\nמהיכרות ראשונה ועד פנייה אמיתית.",
        "en",
      ),
    ).toMatch(/clear language|inquiry/i);
    expect(
      localizeBuiltInText(
        "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל\nמהיכרות ראשונה ועד פנייה אמיתית.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לא רק תוכן — מערכת צמיחה", "es")).toMatch(/contenido|crecimiento/i);
    expect(localizeBuiltInText("תוכן שמייצר אמון", "pt-BR")).toMatch(/confiança/i);
    expect(localizeBuiltInText("דאטה שמוביל החלטות", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "מחברים בין קהל, תוכן, דאטה\nוקמפיינים\nלמערכת צמיחה אחת ברורה.",
        "en",
      ),
    ).toMatch(/growth system|campaign/i);
    expect(localizeBuiltInText("בואו נבנה\nתוכנית צמיחה\nלעסק שלך.", "pt-BR")).toMatch(/negócio|crescimento/i);
    expect(localizeBuiltInText("זה מותאם לנייד?", "en")).toMatch(/mobile/i);
    expect(localizeBuiltInText("שליחת בקשה לשיחה", "es")).toMatch(/llamada|solicitud/i);
    expect(localizeBuiltInText("חשיפות", "en")).toBe("Impressions");
    expect(localizeBuiltInText("ניהול סושיאל", "pt-BR")).toMatch(/social/i);
  });

  it("localizes unique40 leftover gallery preview body after unique39", () => {
    expect(
      localizeBuiltInText(
        "סטודיו דיגיטלי שמחבר בין עיצוב, אוטומציות, CRM ותהליכי מכירה כדי\nלעזור לעסקים לעבוד מהר יותר, מסודר יותר ורווחי יותר.",
        "en",
      ),
    ).toMatch(/digital studio|CRM/i);
    expect(
      localizeBuiltInText(
        "סטודיו דיגיטלי שמחבר בין עיצוב, אוטומציות, CRM ותהליכי מכירה כדי\nלעזור לעסקים לעבוד מהר יותר, מסודר יותר ורווחי יותר.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מערכת לידים ומכירות", "es")).toMatch(/lead|venta/i);
    expect(localizeBuiltInText("כל הזכויות שמורות.", "pt-BR")).toMatch(/direitos reservados/i);
    expect(localizeBuiltInText("נשלח — נחזור אליכם בקרוב", "en")).toMatch(/sent|back/i);
    expect(localizeBuiltInText("מעגל כוח", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique41 leftover gallery preview chrome after unique40", () => {
    expect(
      localizeBuiltInText(
        "שירותים שמוצגים בצורה אלגנטית, ברורה ולא עמוסה — עם חלוקה נכונה,\nCTA עדין והיררכיה שמרגישה פרימיום.",
        "en",
      ),
    ).toMatch(/elegance|premium|CTA/i);
    expect(
      localizeBuiltInText(
        "שירותים שמוצגים בצורה אלגנטית, ברורה ולא עמוסה — עם חלוקה נכונה,\nCTA עדין והיררכיה שמרגישה פרימיום.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מרחב רגוע", "es")).toMatch(/espacio|sereno/i);
    expect(localizeBuiltInText("תיקים", "en")).toBe("Cases");
    expect(localizeBuiltInText("תיקים", "en")).not.toMatch(/bag/i);
    expect(localizeBuiltInText("לפרטים נוספים ←", "pt-BR")).toMatch(/detalhes/i);
    expect(localizeBuiltInText("ייעוץ ברור. החלטות מדויקות.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("לאן תרצו לטוס?", "en")).toMatch(/fly|where/i);
    expect(localizeBuiltInText("מענה", "en")).toBe("Response");
  });

  it("localizes unique42 leftover Wantravel and Lexora built-in seed copy", () => {
    expect(localizeBuiltInText("חופשות בוטיק בהתאמה אישית", "en")).toMatch(
      /boutique/i,
    );
    expect(localizeBuiltInText("חופשות בוטיק בהתאמה אישית", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("בואו נבנה מסלול", "es")).toMatch(/itinerario/i);
    expect(localizeBuiltInText("תכנון מלא", "pt-BR")).toMatch(/planejamento completo/i);
    expect(localizeBuiltInText("ייעוץ משפטי אסטרטגי", "en")).toMatch(/legal/i);
    expect(localizeBuiltInText("סטנדרט גבוה יותר לליווי משפטי", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("קביעת ייעוץ", "en")).toMatch(/consult/i);
  });

  it("localizes unique43 leftover Spalcio, Elevora, and Servora built-in seed copy", () => {
    expect(localizeBuiltInText("אסטרטגיה, צמיחה ותוצאות", "en")).toMatch(
      /strategy|growth/i,
    );
    expect(localizeBuiltInText("אסטרטגיה, צמיחה ותוצאות", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("אתר עסקי שמרגיש יוקרתי, ברור ומוכן להביא לקוחות.", "es")).toMatch(
      /lujo|negocio/i,
    );
    expect(localizeBuiltInText("מתקנים, משדרגים ומשפצים מערכות חשמל", "pt-BR")).toMatch(
      /elétric/i,
    );
    expect(localizeBuiltInText("לקביעת ביקור", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קביעת שיחת ייעוץ", "en")).toMatch(/consult/i);
  });

  it("localizes unique44 leftover PulseCore and Servora built-in seed copy", () => {
    expect(
      localizeBuiltInText(
        "אימון קצר, חד ועוצמתי שמשלב דופק גבוה, כוח ותנועה מהירה.",
        "en",
      ),
    ).toMatch(/short|heart|strength/i);
    expect(
      localizeBuiltInText(
        "אימון קצר, חד ועוצמתי שמשלב דופק גבוה, כוח ותנועה מהירה.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עילית", "es")).toMatch(/élite|elite/i);
    expect(localizeBuiltInText("פנייה ואבחון", "pt-BR")).toMatch(
      /consulta|diagnóstico/i,
    );
    expect(localizeBuiltInText("צריך ניסיון קודם?", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("חבילת התחלה", "en")).toMatch(/starter|start/i);
  });

  it("localizes unique45 leftover Aeline, PulseCore, Servora, and Spalcio chrome", () => {
    expect(localizeBuiltInText("הופכים פניות", "en")).toMatch(/inquir|turn/i);
    expect(localizeBuiltInText("הופכים פניות", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("אימון חזק.", "es")).toMatch(/entreno|fuerte/i);
    expect(localizeBuiltInText("לתיאום ייעוץ", "pt-BR")).toMatch(/consult/i);
    expect(localizeBuiltInText("תהליך מדויק שמוביל לפנייה", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("ליד חדש", "en")).toMatch(/lead/i);
  });

  it("localizes unique46 leftover Aeline testimonial quotes", () => {
    expect(
      localizeBuiltInText(
        "הפסקנו לאבד פניות. כל ליד מקבל טיפול מסודר וברור.",
        "en",
      ),
    ).toMatch(/inquir|lead/i);
    expect(
      localizeBuiltInText(
        "הפסקנו לאבד פניות. כל ליד מקבל טיפול מסודר וברור.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עסק #1", "pt-BR")).toMatch(/negócio/i);
  });

  it("localizes unique47 leftover Adion, Serenova, Justora, and Novastra chrome", () => {
    expect(localizeBuiltInText("קבעו צילום", "en")).toMatch(/book|shoot/i);
    expect(localizeBuiltInText("קבעו צילום", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קביעת שיחת היכרות", "es")).toMatch(/llamada|present/i);
    expect(localizeBuiltInText("כל התיקים", "pt-BR")).toMatch(/casos/i);
    expect(localizeBuiltInText("קנה עכשיו", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חבילות ברורות.", "en")).toMatch(/package|clear/i);
  });

  it("localizes unique48 leftover Adion, Serenova, and Justora body chrome", () => {
    expect(localizeBuiltInText("הפקה", "en")).toMatch(/production/i);
    expect(localizeBuiltInText("סרט מותג", "en")).toMatch(/brand|film/i);
    expect(localizeBuiltInText("סרט מותג", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "משלב הרעיון ועד יום הצילום — אנחנו מנהלים את התהליך עם כיוון ויזואלי ברור ותקשורת מקצועית.",
        "en",
      ),
    ).toMatch(/shoot|visual/i);
    expect(localizeBuiltInText("היכרות", "es")).toMatch(/present|introduc/i);
    expect(localizeBuiltInText("מורידים חשש ומסבירים איך זה עובד.", "pt-BR")).toMatch(
      /preocup|explica/i,
    );
    expect(
      localizeBuiltInText(
        "משרד עורכי דין שמעניק ייעוץ, אסטרטגיה וייצוג מקצועי לכל צורך משפטי — בדיסקרטיות, בהירות וזמינות.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("נזקי גוף", "en")).toMatch(/injury|personal/i);
    expect(localizeBuiltInText("תיקים שטופלו", "en")).toMatch(/case/i);
  });

  it("localizes unique49 leftover Adion pricing, Serenova services, and Justora body", () => {
    expect(localizeBuiltInText("₪8,900 לפרויקט", "en")).toMatch(/project/i);
    expect(localizeBuiltInText("₪8,900 לפרויקט", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עריכה קולנועית", "es")).toMatch(/cinemat/i);
    expect(localizeBuiltInText("מבנה שמוביל את הלקוח בלי עומס", "pt-BR")).toMatch(
      /estrutura|sobrecarga/i,
    );
    expect(localizeBuiltInText("הצוות המשפטי", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בדיקת סיכונים", "en")).toMatch(/risk/i);
  });

  it("localizes unique38 leftover built-in preview headlines", () => {
    expect(localizeBuiltInText("מומחה סושיאל\nשבונה נוכחות\nשמוכרת בשבילך", "en")).toMatch(/social expert/i);
    expect(localizeBuiltInText("מומחה סושיאל\nשבונה נוכחות\nשמוכרת בשבילך", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שמוכרת בשבילך", "es")).toMatch(/vende/i);
    expect(localizeBuiltInText("לא מעלים פוסטים.", "pt-BR")).toMatch(/postamos|publicamos/i);
    expect(localizeBuiltInText("מייצרים פניות.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בונים ביקוש.", "en")).toMatch(/demand/i);
    expect(
      localizeBuiltInText("אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית", "en"),
    ).toMatch(/strategy|campaign/i);
    expect(
      localizeBuiltInText("אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "בניית מותג דיגיטלי, תוכן שמייצר אמון וקמפיינים שמביאים לידים,\nלקוחות ותוצאות מדידות.",
        "pt-BR",
      ),
    ).toMatch(/marca digital|confiança|leads/i);
    expect(localizeBuiltInText("קביעת שיחת ייעוץ", "en")).toMatch(/consult/i);
    expect(localizeBuiltInText("צפייה בשירותים", "es")).toMatch(/servicio/i);
    expect(localizeBuiltInText("קביעת שיחה", "pt-BR")).toMatch(/chamada|agendar/i);
  });

  it("keeps a saved rich-store headline over localized unique17 defaults", () => {
    const defaults = localizeBuiltInTemplateSeed(
      { brandName: "סטודיו מסחר עשיר", productsEyebrow: "בחירות החנות" },
      "en",
    );
    expect(defaults.brandName).toBe("Rich commerce studio");
    const merged = {
      ...defaults,
      brandName: "Our boutique name",
    };
    expect(merged.brandName).toBe("Our boutique name");
    expect(merged.productsEyebrow).toBe("Store picks");
  });
});
