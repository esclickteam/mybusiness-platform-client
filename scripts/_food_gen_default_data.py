"""Fragment: gen_default_data for food templates. Imported/inlined by patch script."""


def _esc(s: str) -> str:
    return str(s).replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")


def gen_default_data(t, index):
    nav = "\n".join(
        f'  nav{pid[0].upper() + pid[1:]}: "{_esc(label)}",'
        for pid, label, _ in t["pages"]
    )
    c = t["copy"]
    imgs = t["images"]
    address = CITIES[index % len(CITIES)]
    items_lines = []
    for i, it in enumerate(c["items"], 1):
        key = {1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f"}[i]
        items_lines.append(
            f'  item{i}Title: "{_esc(it[0])}",\n'
            f'  item{i}Meta: "{_esc(it[1])}",\n'
            f'  item{i}Text: "{_esc(it[2])}",\n'
            f'  item{i}Image: "{imgs[key]}",'
        )
    items = "\n".join(items_lines)
    rev_lines = []
    for i, (text, name, role) in enumerate(c["reviews"], 1):
        rev_lines.append(
            f'  review{i}Text: "{_esc(text)}",\n'
            f'  review{i}Name: "{_esc(name)}",\n'
            f'  review{i}Role: "{_esc(role)}",'
        )
    faq_lines = []
    for i, (q, a) in enumerate(c["faq"], 1):
        faq_lines.append(f'  faq{i}Q: "{_esc(q)}",\n  faq{i}A: "{_esc(a)}",')
    proc_lines = []
    for i, (title, text) in enumerate(c["processSteps"], 1):
        proc_lines.append(f'  process{i}Title: "{_esc(title)}",\n  process{i}Text: "{_esc(text)}",')
    cat_lines = []
    for i, (title, text) in enumerate(c["categories"], 1):
        cat_lines.append(f'  cat{i}Title: "{_esc(title)}",\n  cat{i}Text: "{_esc(text)}",')
    pair_lines = []
    for i, (title, text) in enumerate(c["pairings"], 1):
        pair_lines.append(f'  pair{i}Title: "{_esc(title)}",\n  pair{i}Text: "{_esc(text)}",')
    tech_lines = []
    for i, (title, text) in enumerate(c["techSteps"], 1):
        tech_lines.append(f'  tech{i}Title: "{_esc(title)}",\n  tech{i}Text: "{_esc(text)}",')
    mat_lines = []
    for i, (title, text) in enumerate(c["materials"], 1):
        mat_lines.append(f'  mat{i}Title: "{_esc(title)}",\n  mat{i}Text: "{_esc(text)}",')
    tl_lines = []
    for i, (year, text) in enumerate(c["timeline"], 1):
        tl_lines.append(f'  timeline{i}Year: "{_esc(year)}",\n  timeline{i}Text: "{_esc(text)}",')
    val_lines = []
    for i, (title, text) in enumerate(c["values"], 1):
        val_lines.append(f'  value{i}Title: "{_esc(title)}",\n  value{i}Text: "{_esc(text)}",')

    return f'''export const {t["id"]}DefaultData = {{
  templateId: "{t["id"]}",
  name: "{_esc(t["name"])}",
  brandName: "{_esc(t["brand"])}",
  logoText: "{_esc(t["logo"])}",
{nav}
  heroEyebrow: "{_esc(t["niche"])}",
  heroTitle: "{_esc(c["title"])}",
  heroSubtitle: "{_esc(c["subtitle"])}",
  heroPrimary: "{_esc(c["primary"])}",
  heroSecondary: "{_esc(c["secondary"])}",
  heroImage: "{imgs["hero"]}",
  featuredTitle: "{_esc(c["featuredTitle"])}",
  processTitle: "{_esc(c["processTitle"])}",
{chr(10).join(proc_lines)}
  galleryTitle: "{_esc(c["galleryTitle"])}",
  galleryImage1: "{imgs["gallery1"]}",
  galleryImage2: "{imgs["gallery2"]}",
  galleryImage3: "{imgs["gallery3"]}",
  galleryImage4: "{imgs["gallery4"]}",
  reviewsTitle: "{_esc(c["reviewsTitle"])}",
{chr(10).join(rev_lines)}
  stat1: "{_esc(c["stat1"])}",
  stat1Label: "{_esc(c["stat1Label"])}",
  stat2: "{_esc(c["stat2"])}",
  stat2Label: "{_esc(c["stat2Label"])}",
  stat3: "{_esc(c["stat3"])}",
  stat3Label: "{_esc(c["stat3Label"])}",
  hours: "{_esc(c["hours"])}",
  ctaBandTitle: "{_esc(c["ctaBandTitle"])}",
  ctaBandText: "{_esc(c["ctaBandText"])}",
  page1Title: "{_esc(c["page1Title"])}",
  page1Subtitle: "{_esc(c["page1Subtitle"])}",
  page2Title: "{_esc(c["page2Title"])}",
  page2Subtitle: "{_esc(c["page2Subtitle"])}",
  menuListTitle: "{_esc(c["menuListTitle"])}",
{chr(10).join(cat_lines)}
  pairingTitle: "{_esc(c["pairingTitle"])}",
{chr(10).join(pair_lines)}
  chefPickEyebrow: "{_esc(c["chefPickEyebrow"])}",
  chefPickTitle: "{_esc(c["chefPickTitle"])}",
  chefPickText: "{_esc(c["chefPickText"])}",
  techTitle: "{_esc(c["techTitle"])}",
{chr(10).join(tech_lines)}
  matTitle: "{_esc(c["matTitle"])}",
{chr(10).join(mat_lines)}
  eventsTitle: "{_esc(c["eventsTitle"])}",
  eventsText: "{_esc(c["eventsText"])}",
  eventsMeta: "{_esc(c["eventsMeta"])}",
  aboutEyebrow: "{_esc(c["aboutEyebrow"])}",
  aboutPageTitle: "{_esc(c["aboutPageTitle"])}",
  aboutPageLead: "{_esc(c["aboutPageLead"])}",
  aboutTitle: "{_esc(c["aboutTitle"])}",
  aboutText: "{_esc(c["aboutText"])}",
  aboutImage: "{imgs["c"]}",
  timelineTitle: "{_esc(c["timelineTitle"])}",
{chr(10).join(tl_lines)}
  chefLabel: "{_esc(c["chefLabel"])}",
  chefName: "{_esc(c["chefName"])}",
  chefBio: "{_esc(c["chefBio"])}",
  chefQuote: "{_esc(c["chefQuote"])}",
  chefImage: "{imgs["chef"]}",
{chr(10).join(val_lines)}
  contactEyebrow: "{_esc(c["contactEyebrow"])}",
  contactPageTitle: "{_esc(c["contactPageTitle"])}",
  contactPageText: "{_esc(c["contactPageText"])}",
  contactTitle: "{_esc(c["contactTitle"])}",
  contactText: "{_esc(c["contactText"])}",
  hoursTitle: "{_esc(c["hoursTitle"])}",
  mapLabel: "{_esc(c["mapLabel"])}",
  faqTitle: "{_esc(c["faqTitle"])}",
{chr(10).join(faq_lines)}
  cta: "{_esc(c["primary"])}",
  phone: "03-555-{1000 + index}",
  email: "hello@{t["id"]}.co.il",
  address: "{address}",
{items}
}};
'''
