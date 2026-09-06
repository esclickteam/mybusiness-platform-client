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
});
