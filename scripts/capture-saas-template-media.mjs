/**
 * Renders the BeautyFlow and Global Properties demo workspaces and writes
 * the marketplace stills, posters, and walkthrough videos.
 * Run: node scripts/capture-saas-template-media.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = resolve(root, "public/saas-media");
const chrome = "/usr/bin/google-chrome";

function page({ title, css, body }) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { font-family: "Segoe UI", "Avenir Next", "Helvetica Neue", sans-serif; color: #1c1630; background: ${css.bg}; }
  button, input { font: inherit; }
  .app { display: grid; grid-template-columns: 228px 1fr; height: 100vh; }
  aside { background: ${css.ink}; color: white; padding: 22px 16px; display: flex; flex-direction: column; gap: 18px; }
  .mark { display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: -0.03em; }
  .mark i { width: 28px; height: 28px; border-radius: 9px; background: linear-gradient(135deg, ${css.accent}, ${css.accent2}); display: block; }
  nav { display: grid; gap: 4px; }
  nav span { display: block; padding: 9px 12px; border-radius: 12px; color: rgba(255,255,255,.72); font-size: 13px; font-weight: 650; }
  nav span.on { background: rgba(255,255,255,.12); color: white; }
  .tenant { margin-top: auto; padding: 12px; border-radius: 14px; background: rgba(255,255,255,.08); font-size: 12px; line-height: 1.4; }
  .tenant b { display: block; font-size: 13px; }
  main { display: flex; flex-direction: column; min-width: 0; }
  header.top { height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; background: rgba(255,255,255,.72); border-bottom: 1px solid rgba(28,22,48,.06); }
  header.top strong { font-size: 15px; }
  header.top em { font-style: normal; color: #6b6478; font-size: 13px; margin-left: 8px; }
  .pill { border: 0; border-radius: 999px; padding: 8px 14px; background: ${css.accent}; color: white; font-weight: 750; font-size: 13px; }
  .content { padding: 22px 28px 28px; display: grid; gap: 16px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .card { background: white; border-radius: 18px; padding: 16px; box-shadow: 0 10px 30px rgba(28,22,48,.05); }
  .kpi b { display: block; font-size: 26px; letter-spacing: -0.04em; margin-top: 6px; }
  .kpi span, .muted { color: #6b6478; font-size: 12px; font-weight: 650; }
  .split { display: grid; grid-template-columns: 1.4fr .8fr; gap: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #8a8498; padding: 0 8px 10px; }
  td { padding: 12px 8px; border-top: 1px solid #f0eef5; font-weight: 650; }
  .who { display: flex; align-items: center; gap: 10px; }
  .av { width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; color: white; font-size: 12px; font-weight: 800; }
  .tag { display: inline-flex; border-radius: 999px; padding: 4px 8px; font-size: 11px; font-weight: 800; background: ${css.soft}; color: ${css.accent}; }
  .cal { display: grid; grid-template-columns: 64px repeat(5, 1fr); gap: 8px; }
  .slot { min-height: 72px; border-radius: 12px; background: #f7f5fb; padding: 8px; font-size: 12px; font-weight: 700; }
  .slot b { display: block; }
  .slot.fill { background: ${css.soft}; color: ${css.ink}; }
  .time { color: #8a8498; font-size: 12px; padding-top: 8px; }
  .people { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .person { display: grid; gap: 6px; }
  .person .av { width: 42px; height: 42px; }
  .menu { display: grid; gap: 10px; }
  .rowline { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #f0eef5; }
  .swatches { display: flex; gap: 10px; }
  .sw { width: 54px; height: 54px; border-radius: 16px; }
  .site { display: grid; grid-template-columns: 220px 1fr; gap: 16px; }
  .block { border: 1px dashed #ddd6ea; border-radius: 16px; padding: 16px; background: #fcfbfe; }
  .hero-block { border-radius: 18px; padding: 28px; color: white; background: linear-gradient(120deg, ${css.accent}, ${css.accent2}); min-height: 180px; }
  .plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .plan { border-radius: 18px; padding: 16px; background: white; }
  .plan.on { outline: 2px solid ${css.accent}; }
  .bars { display: flex; align-items: flex-end; gap: 10px; height: 140px; }
  .bars i { display: block; flex: 1; border-radius: 10px 10px 4px 4px; background: linear-gradient(${css.accent}, ${css.accent2}); }
  .props { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .photo { height: 120px; border-radius: 14px; }
  .filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip { border-radius: 999px; background: white; padding: 8px 12px; font-size: 12px; font-weight: 750; border: 1px solid #e7e3ef; }
  .chip.on { background: ${css.ink}; color: white; border-color: transparent; }
  .detail { display: grid; grid-template-columns: 1.3fr .7fr; gap: 16px; }
  .phone { width: 390px; height: 844px; background: white; overflow: hidden; }
  .phone head, .ph-top { padding: 28px 20px 12px; }
  .ph-hero { margin: 8px 16px; border-radius: 22px; padding: 22px; color: white; background: linear-gradient(160deg, ${css.accent}, ${css.accent2}); }
  .ph-card { margin: 10px 16px; padding: 14px; border-radius: 18px; background: #f7f5fb; }
</style></head><body>${body}</body></html>`;
}

const beauty = {
  accent: "#C026D3",
  accent2: "#FB7185",
  ink: "#3B0764",
  bg: "#FFF7FB",
  soft: "#FCE7F3",
};
const property = {
  accent: "#0F766E",
  accent2: "#38BDF8",
  ink: "#134E4A",
  bg: "#F3FBFA",
  soft: "#CCFBF1",
};

function desk(theme, { product, tenant, note, active, title, crumb, action, body }) {
  const nav = [
    "Today",
    "Calendar",
    "Clients",
    "Team",
    "Services",
    "Website",
    "Brand",
    "Plans",
    "Reports",
  ];
  return page({
    title,
    css: theme,
    body: `<div class="app"><aside><div class="mark"><i></i>${product}</div><nav>${nav
      .map((item) => `<span class="${item === active ? "on" : ""}">${item}</span>`)
      .join("")}</nav><div class="tenant"><b>${tenant}</b>${note}</div></aside><main><header class="top"><div><strong>${title}</strong><em>${crumb}</em></div><button class="pill">${action}</button></header><div class="content">${body}</div></main></div>`,
  });
}

function estate(theme, { product, tenant, note, active, title, crumb, action, body, nav }) {
  return page({
    title,
    css: theme,
    body: `<div class="app"><aside><div class="mark"><i></i>${product}</div><nav>${nav
      .map((item) => `<span class="${item === active ? "on" : ""}">${item}</span>`)
      .join("")}</nav><div class="tenant"><b>${tenant}</b>${note}</div></aside><main><header class="top"><div><strong>${title}</strong><em>${crumb}</em></div><button class="pill">${action}</button></header><div class="content">${body}</div></main></div>`,
  });
}

const estateNav = ["Market", "Search", "Listings", "Owners", "Leads", "Projects", "Firms", "Brand", "Insights"];

const beautyScreens = [
  {
    file: "dashboard.png",
    label: "Dashboard",
    caption: "The day at a glance for one salon workspace.",
    gallery: "dashboard",
    tab: "dashboard",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Today",
      title: "Today",
      crumb: "Thursday · 6 chairs",
      action: "New appointment",
      body: `<div class="kpis">
        <div class="card kpi"><span>On the book</span><b>28</b></div>
        <div class="card kpi"><span>In the chair</span><b>6</b></div>
        <div class="card kpi"><span>Open slots</span><b>9</b></div>
        <div class="card kpi"><span>Packages due</span><b>4</b></div>
      </div>
      <div class="split">
        <div class="card"><h3 style="margin:0 0 8px">Next arrivals</h3>
          <table><tr><th>Guest</th><th>Service</th><th>With</th><th>Time</th></tr>
          <tr><td><div class="who"><i class="av" style="background:#C026D3">MC</i>Maya Cohen</div></td><td>Balayage</td><td>Noa</td><td>10:30</td></tr>
          <tr><td><div class="who"><i class="av" style="background:#FB7185">LS</i>Lina Sabag</div></td><td>Gloss + cut</td><td>Amit</td><td>11:00</td></tr>
          <tr><td><div class="who"><i class="av" style="background:#7C3AED">ER</i>Eden Rahav</div></td><td>Brow shape</td><td>Yael</td><td>11:20</td></tr>
          <tr><td><div class="who"><i class="av" style="background:#BE185D">DK</i>Dana Klein</div></td><td>Color correction</td><td>Noa</td><td>13:00</td></tr>
          </table>
        </div>
        <div class="card"><h3 style="margin:0 0 8px">Floor</h3>
          <div class="rowline"><span>Noa Levi</span><span class="tag">Chair 2</span></div>
          <div class="rowline"><span>Amit Bar</span><span class="tag">Chair 4</span></div>
          <div class="rowline"><span>Yael Oz</span><span class="tag">Room B</span></div>
          <div class="rowline"><span>Reception</span><span class="tag">2 waiting</span></div>
        </div>
      </div>`,
    }),
  },
  {
    file: "appointments.png",
    label: "Appointments",
    caption: "The week book for chairs and treatment rooms.",
    gallery: "jobs",
    tab: "bookings",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Calendar",
      title: "Appointments",
      crumb: "Week of 12 May",
      action: "Block time",
      body: `<div class="card"><div class="cal">
        <div></div><b>Mon</b><b>Tue</b><b>Wed</b><b>Thu</b><b>Fri</b>
        <div class="time">10:00</div>
        <div class="slot fill"><b>Maya</b>Balayage</div><div class="slot"></div><div class="slot fill"><b>Lina</b>Gloss</div><div class="slot fill"><b>Eden</b>Brows</div><div class="slot"></div>
        <div class="time">12:00</div>
        <div class="slot"></div><div class="slot fill"><b>Dana</b>Color</div><div class="slot"></div><div class="slot fill"><b>Noa</b>Cut</div><div class="slot fill"><b>Team</b>Lunch</div>
        <div class="time">15:00</div>
        <div class="slot fill"><b>Romi</b>Blowdry</div><div class="slot fill"><b>Hila</b>Facial</div><div class="slot"></div><div class="slot fill"><b>Tamar</b>Package</div><div class="slot"></div>
      </div></div>`,
    }),
  },
  {
    file: "customers.png",
    label: "Customers",
    caption: "Client notes, formulas, and visit rhythm.",
    gallery: "customers",
    tab: "customers",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Clients",
      title: "Customers",
      crumb: "CRM",
      action: "Add client",
      body: `<div class="card"><table>
        <tr><th>Client</th><th>Last visit</th><th>Formula</th><th>Next</th></tr>
        <tr><td><div class="who"><i class="av" style="background:#C026D3">MC</i>Maya Cohen</div></td><td>2 weeks ago</td><td>7/13 + gloss</td><td><span class="tag">Thu 10:30</span></td></tr>
        <tr><td><div class="who"><i class="av" style="background:#FB7185">LS</i>Lina Sabag</div></td><td>5 weeks ago</td><td>Toner only</td><td><span class="tag">Due</span></td></tr>
        <tr><td><div class="who"><i class="av" style="background:#7C3AED">ER</i>Eden Rahav</div></td><td>Yesterday</td><td>Lash fill</td><td><span class="tag">3 weeks</span></td></tr>
        <tr><td><div class="who"><i class="av" style="background:#BE185D">DK</i>Dana Klein</div></td><td>Today</td><td>Correction</td><td><span class="tag">In chair</span></td></tr>
        <tr><td><div class="who"><i class="av" style="background:#9D174D">HB</i>Hila Ben</div></td><td>8 weeks ago</td><td>Facial course</td><td><span class="tag">Call</span></td></tr>
      </table></div>`,
    }),
  },
  {
    file: "staff.png",
    label: "Staff",
    caption: "Who is on the floor and which chair they hold.",
    gallery: "admin",
    tab: "",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Team",
      title: "Staff",
      crumb: "This shift",
      action: "Invite stylist",
      body: `<div class="people">
        ${[
          ["NL", "Noa Levi", "Color director", "Chair 2"],
          ["AB", "Amit Bar", "Senior stylist", "Chair 4"],
          ["YO", "Yael Oz", "Brows & skin", "Room B"],
          ["RK", "Romi Katz", "Junior", "Chair 1"],
          ["TS", "Tamar Shahar", "Reception", "Desk"],
          ["ML", "Michal Luz", "Off today", "—"],
        ]
          .map(
            ([ini, name, role, place], index) =>
              `<div class="card person"><i class="av" style="background:${["#C026D3", "#FB7185", "#7C3AED", "#BE185D", "#9D174D", "#6B21A8"][index]}">${ini}</i><b>${name}</b><span class="muted">${role}</span><span class="tag">${place}</span></div>`
          )
          .join("")}
      </div>`,
    }),
  },
  {
    file: "services.png",
    label: "Services",
    caption: "The menu guests book from, with time and price.",
    gallery: "services",
    tab: "",
    audience: "both",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Services",
      title: "Services",
      crumb: "Public menu",
      action: "Add service",
      body: `<div class="card menu">
        ${[
          ["Balayage", "Color", "180 min", "₪680"],
          ["Gloss + cut", "Color", "90 min", "₪420"],
          ["Brow shape", "Skin", "40 min", "₪160"],
          ["Signature facial", "Skin", "75 min", "₪390"],
          ["Blowdry", "Style", "45 min", "₪180"],
        ]
          .map(
            ([name, group, time, price]) =>
              `<div class="rowline"><div><b>${name}</b><div class="muted">${group} · ${time}</div></div><span class="tag">${price}</span></div>`
          )
          .join("")}
      </div>`,
    }),
  },
  {
    file: "branding.png",
    label: "Branding",
    caption: "Name, colors, and the domain guests see.",
    gallery: "settings",
    tab: "branding",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Brand",
      title: "Branding",
      crumb: "White label",
      action: "Publish brand",
      body: `<div class="split">
        <div class="card"><h3 style="margin-top:0">Lumen Studio</h3><p class="muted">book.lumen.studio</p>
          <div class="swatches" style="margin-top:16px"><i class="sw" style="background:#C026D3"></i><i class="sw" style="background:#FB7185"></i><i class="sw" style="background:#3B0764"></i><i class="sw" style="background:#FFF7FB;border:1px solid #f3e8ff"></i></div>
          <div class="rowline"><span>Logo</span><span class="tag">Wordmark</span></div>
          <div class="rowline"><span>Booking page</span><span class="tag">On</span></div>
        </div>
        <div class="hero-block"><b style="font-size:28px">Lumen</b><p>Color, cut, and care. Book a chair this week.</p><span class="pill" style="background:white;color:#3B0764">Book</span></div>
      </div>`,
    }),
  },
  {
    file: "website.png",
    label: "Website editor",
    caption: "The public site, edited beside the live preview.",
    gallery: "admin",
    tab: "",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Website",
      title: "Website editor",
      crumb: "Home",
      action: "Publish site",
      body: `<div class="site">
        <div class="card"><b>Sections</b><div class="rowline">Hero</div><div class="rowline">Services</div><div class="rowline">Team</div><div class="rowline">Book</div></div>
        <div class="hero-block"><div class="muted" style="color:white">Hero</div><b style="font-size:36px;display:block;margin:8px 0">A chair with your name on it.</b><span class="pill" style="background:white;color:#3B0764">Choose a time</span></div>
      </div>`,
    }),
  },
  {
    file: "plans.png",
    label: "SaaS Plans",
    caption: "The plans this salon offers its own guests.",
    gallery: "admin",
    tab: "",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Plans",
      title: "SaaS Plans",
      crumb: "Guest memberships",
      action: "New plan",
      body: `<div class="plans">
        <div class="plan card"><span class="muted">Glow</span><b style="font-size:28px;display:block">₪89</b><div class="muted">monthly</div><div class="rowline">1 blowdry</div><div class="rowline">Member hours</div></div>
        <div class="plan card on"><span class="muted">Studio</span><b style="font-size:28px;display:block">₪189</b><div class="muted">monthly</div><div class="rowline">Cut + gloss</div><div class="rowline">Priority book</div></div>
        <div class="plan card"><span class="muted">Atelier</span><b style="font-size:28px;display:block">₪320</b><div class="muted">monthly</div><div class="rowline">Color credit</div><div class="rowline">Guest pass</div></div>
      </div>`,
    }),
  },
  {
    file: "reports.png",
    label: "Reports",
    caption: "Which services filled the book this week.",
    gallery: "reports",
    tab: "reports",
    audience: "admin",
    html: desk(beauty, {
      product: "BeautyFlow",
      tenant: "Lumen Studio",
      note: "Sample workspace",
      active: "Reports",
      title: "Reports",
      crumb: "This week",
      action: "Export",
      body: `<div class="split"><div class="card"><h3 style="margin-top:0">Appointments by service</h3><div class="bars"><i style="height:70%"></i><i style="height:100%"></i><i style="height:46%"></i><i style="height:80%"></i><i style="height:34%"></i></div><div class="muted" style="display:flex;justify-content:space-between;margin-top:8px"><span>Color</span><span>Cut</span><span>Brows</span><span>Skin</span><span>Style</span></div></div><div class="card"><div class="rowline"><span>Color</span><b>42</b></div><div class="rowline"><span>Cut</span><b>31</b></div><div class="rowline"><span>Skin</span><b>18</b></div><div class="rowline"><span>No-shows</span><b>2</b></div></div></div>`,
    }),
  },
];

const beautyMobile = page({
  title: "Book",
  css: beauty,
  body: `<div class="phone"><div class="ph-top"><b>Lumen Studio</b><div class="muted">Choose a service</div></div>
    <div class="ph-hero"><div class="muted" style="color:white">Next opening</div><b style="font-size:28px;display:block">Thu · 10:30</b><div>With Noa · Chair 2</div></div>
    <div class="ph-card"><b>Balayage</b><div class="muted">180 min · ₪680</div></div>
    <div class="ph-card"><b>Gloss + cut</b><div class="muted">90 min · ₪420</div></div>
    <div class="ph-card"><b>Brow shape</b><div class="muted">40 min · ₪160</div></div>
    <div style="padding:16px"><button class="pill" style="width:100%">Continue</button></div>
  </div>`,
});

const propertyScreens = [
  {
    file: "marketplace.png",
    label: "Marketplace",
    caption: "Homes a guest can browse under the firm’s name.",
    gallery: "properties",
    tab: "",
    audience: "customer",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Market",
      title: "Marketplace",
      crumb: "Lisbon homes",
      action: "Share board",
      nav: estateNav,
      body: `<div class="props">${[
        ["#0F766E", "Alfama loft", "2 bed · river", "€640,000"],
        ["#155E75", "Cascais villa", "4 bed · garden", "€1,250,000"],
        ["#0369A1", "Chiado flat", "1 bed · light", "€480,000"],
      ]
        .map(
          ([color, name, meta, price]) =>
            `<div class="card"><div class="photo" style="background:linear-gradient(135deg, ${color}, #99f6e4)"></div><b>${name}</b><div class="muted">${meta}</div><span class="tag">${price}</span></div>`
        )
        .join("")}</div>`,
    }),
  },
  {
    file: "search.png",
    label: "Property search",
    caption: "Filters for city, rooms, and budget.",
    gallery: "properties",
    tab: "bookings",
    audience: "customer",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Search",
      title: "Property search",
      crumb: "18 matches",
      action: "Save search",
      nav: estateNav,
      body: `<div class="filters"><span class="chip on">Lisbon</span><span class="chip">2+ beds</span><span class="chip">Under €800k</span><span class="chip">Sea view</span><span class="chip">Ready</span></div>
        <div class="card"><table><tr><th>Home</th><th>Area</th><th>Beds</th><th>Ask</th></tr>
        <tr><td>Alfama loft</td><td>Alfama</td><td>2</td><td>€640,000</td></tr>
        <tr><td>Chiado flat</td><td>Chiado</td><td>1</td><td>€480,000</td></tr>
        <tr><td>Santos townhouse</td><td>Santos</td><td>3</td><td>€790,000</td></tr>
        <tr><td>Estoril apartment</td><td>Estoril</td><td>2</td><td>€710,000</td></tr>
        </table></div>`,
    }),
  },
  {
    file: "detail.png",
    label: "Property detail",
    caption: "One listing, with the facts a buyer asks first.",
    gallery: "properties",
    tab: "",
    audience: "customer",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Market",
      title: "Alfama loft",
      crumb: "Listing",
      action: "Request a visit",
      nav: estateNav,
      body: `<div class="detail"><div class="photo" style="height:280px;background:linear-gradient(120deg,#0F766E,#38BDF8);border-radius:18px"></div><div class="card"><b style="font-size:28px">€640,000</b><p class="muted">2 bed · 1 bath · 92 m²</p><div class="rowline"><span>Floor</span><b>3</b></div><div class="rowline"><span>View</span><b>River</b></div><div class="rowline"><span>Status</span><span class="tag">Available</span></div></div></div>`,
    }),
  },
  {
    file: "owner.png",
    label: "Owner dashboard",
    caption: "What the firm is showing, holding, and following up.",
    gallery: "dashboard",
    tab: "dashboard",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Owners",
      title: "Owner dashboard",
      crumb: "This week",
      action: "Add listing",
      nav: estateNav,
      body: `<div class="kpis"><div class="card kpi"><span>Live listings</span><b>46</b></div><div class="card kpi"><span>Visits booked</span><b>12</b></div><div class="card kpi"><span>Open leads</span><b>19</b></div><div class="card kpi"><span>New this week</span><b>5</b></div></div>
        <div class="card"><table><tr><th>Listing</th><th>Owner</th><th>Stage</th></tr>
        <tr><td>Alfama loft</td><td>Inês Carvalho</td><td><span class="tag">Visit Thu</span></td></tr>
        <tr><td>Cascais villa</td><td>Pedro Nunes</td><td><span class="tag">Offer</span></td></tr>
        <tr><td>Chiado flat</td><td>Marta Silva</td><td><span class="tag">Photos</span></td></tr>
        </table></div>`,
    }),
  },
  {
    file: "properties.png",
    label: "Properties",
    caption: "The inventory the team publishes and pauses.",
    gallery: "properties",
    tab: "",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Listings",
      title: "Properties",
      crumb: "Management",
      action: "New property",
      nav: estateNav,
      body: `<div class="card"><table><tr><th>Listing</th><th>City</th><th>Ask</th><th>State</th></tr>
        <tr><td>Alfama loft</td><td>Lisbon</td><td>€640,000</td><td><span class="tag">Live</span></td></tr>
        <tr><td>Cascais villa</td><td>Cascais</td><td>€1,250,000</td><td><span class="tag">Live</span></td></tr>
        <tr><td>Santos townhouse</td><td>Lisbon</td><td>€790,000</td><td><span class="tag">Draft</span></td></tr>
        <tr><td>Estoril apartment</td><td>Estoril</td><td>€710,000</td><td><span class="tag">Paused</span></td></tr>
      </table></div>`,
    }),
  },
  {
    file: "leads.png",
    label: "Leads",
    caption: "Inquiries, with the listing they asked about.",
    gallery: "customers",
    tab: "customers",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Leads",
      title: "Leads",
      crumb: "CRM",
      action: "Log inquiry",
      nav: estateNav,
      body: `<div class="card"><table><tr><th>Person</th><th>About</th><th>Channel</th><th>Next</th></tr>
        <tr><td>João Mendes</td><td>Alfama loft</td><td>Site</td><td><span class="tag">Call</span></td></tr>
        <tr><td>Sara Levi</td><td>Cascais villa</td><td>Partner</td><td><span class="tag">Visit</span></td></tr>
        <tr><td>Elena Costa</td><td>Chiado flat</td><td>WhatsApp</td><td><span class="tag">Reply</span></td></tr>
        <tr><td>Mark Adler</td><td>Budget search</td><td>Form</td><td><span class="tag">Qualify</span></td></tr>
      </table></div>`,
    }),
  },
  {
    file: "projects.png",
    label: "Projects",
    caption: "Developments the firm is releasing in phases.",
    gallery: "admin",
    tab: "",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Projects",
      title: "Projects",
      crumb: "Developments",
      action: "New project",
      nav: estateNav,
      body: `<div class="props">${[
        ["Ribeira Court", "24 homes", "Phase 2"],
        ["Costa Verde", "8 villas", "Launch"],
        ["Baixa Works", "Retail + loft", "Planning"],
      ]
        .map(
          ([name, meta, stage]) =>
            `<div class="card"><div class="photo" style="background:linear-gradient(160deg,#134E4A,#38BDF8)"></div><b>${name}</b><div class="muted">${meta}</div><span class="tag">${stage}</span></div>`
        )
        .join("")}</div>`,
    }),
  },
  {
    file: "organizations.png",
    label: "Organizations",
    caption: "The firms and owner groups on this workspace.",
    gallery: "admin",
    tab: "",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Firms",
      title: "Organizations",
      crumb: "Directory",
      action: "Add organization",
      nav: estateNav,
      body: `<div class="people">${[
        ["HC", "Harbor & Co", "Brokerage", "18 agents"],
        ["AN", "Atlântico Norte", "Owner group", "6 assets"],
        ["MV", "Mar Vila", "Developer", "2 projects"],
      ]
        .map(
          ([ini, name, role, meta]) =>
            `<div class="card person"><i class="av" style="background:#0F766E">${ini}</i><b>${name}</b><span class="muted">${role}</span><span class="tag">${meta}</span></div>`
        )
        .join("")}</div>`,
    }),
  },
  {
    file: "branding.png",
    label: "Branding",
    caption: "The public name, palette, and listing domain.",
    gallery: "settings",
    tab: "branding",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Brand",
      title: "Branding",
      crumb: "White label",
      action: "Publish brand",
      nav: estateNav,
      body: `<div class="split"><div class="card"><h3 style="margin-top:0">Harbor & Co</h3><p class="muted">homes.harbor.co</p><div class="swatches" style="margin-top:16px"><i class="sw" style="background:#0F766E"></i><i class="sw" style="background:#38BDF8"></i><i class="sw" style="background:#134E4A"></i><i class="sw" style="background:#F3FBFA;border:1px solid #ccfbf1"></i></div></div><div class="hero-block"><b style="font-size:28px">Harbor</b><p>Homes along the coast, listed under your name.</p></div></div>`,
    }),
  },
  {
    file: "analytics.png",
    label: "Analytics",
    caption: "Which listings drew visits and inquiries.",
    gallery: "reports",
    tab: "reports",
    audience: "admin",
    html: estate(property, {
      product: "Global Properties",
      tenant: "Harbor & Co",
      note: "Sample workspace",
      active: "Insights",
      title: "Analytics",
      crumb: "Last 30 days",
      action: "Export",
      nav: estateNav,
      body: `<div class="split"><div class="card"><h3 style="margin-top:0">Inquiries by area</h3><div class="bars"><i style="height:90%"></i><i style="height:60%"></i><i style="height:40%"></i><i style="height:75%"></i></div><div class="muted" style="display:flex;justify-content:space-between;margin-top:8px"><span>Lisbon</span><span>Cascais</span><span>Estoril</span><span>Porto</span></div></div><div class="card"><div class="rowline"><span>Listing views</span><b>1,284</b></div><div class="rowline"><span>Visit requests</span><b>64</b></div><div class="rowline"><span>Saved searches</span><b>22</b></div></div></div>`,
    }),
  },
];

const propertyMobile = page({
  title: "Search",
  css: property,
  body: `<div class="phone" style="background:#F3FBFA"><div class="ph-top"><b>Harbor & Co</b><div class="muted">Homes in Lisbon</div></div>
    <div class="ph-hero"><div class="muted" style="color:white">Alfama loft</div><b style="font-size:26px;display:block">€640,000</b><div>2 bed · river</div></div>
    <div class="ph-card"><b>Cascais villa</b><div class="muted">4 bed · €1,250,000</div></div>
    <div class="ph-card"><b>Chiado flat</b><div class="muted">1 bed · €480,000</div></div>
    <div style="padding:16px"><button class="pill" style="width:100%">Request a visit</button></div>
  </div>`,
});

function video(dir, frames, file) {
  const args = ["-y"];
  for (const frame of frames) {
    args.push("-loop", "1", "-t", "1.35", "-i", resolve(dir, frame));
  }
  const fades = [];
  let cursor = 0;
  for (let i = 0; i < frames.length - 1; i += 1) {
    const offset = (1.05 * (i + 1)).toFixed(2);
    const left = i === 0 ? "[0:v]" : `[v${i}]`;
    const right = `[${i + 1}:v]`;
    const name = i === frames.length - 2 ? "[v]" : `[v${i + 1}]`;
    fades.push(`${left}${right}xfade=transition=fade:duration=0.3:offset=${offset}${name}`);
    cursor = offset;
  }
  args.push(
    "-filter_complex",
    fades.join(";"),
    "-map",
    "[v]",
    "-r",
    "30",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    resolve(dir, file)
  );
  execFileSync("ffmpeg", args, { stdio: "inherit" });
  void cursor;
}

const jobs = [
  { slug: "beautyflow", screens: beautyScreens, mobile: beautyMobile, video: ["dashboard.png", "appointments.png", "customers.png", "services.png", "branding.png", "website.png", "reports.png"] },
  { slug: "global-properties", screens: propertyScreens, mobile: propertyMobile, video: ["marketplace.png", "search.png", "detail.png", "owner.png", "leads.png", "branding.png", "analytics.png"] },
];

const browser = await chromium.launch({
  executablePath: chrome,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

for (const job of jobs) {
  const dir = resolve(outRoot, job.slug);
  mkdirSync(dir, { recursive: true });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  for (const screen of job.screens) {
    await desktop.setContent(screen.html, { waitUntil: "load" });
    await desktop.screenshot({ path: resolve(dir, screen.file), type: "png" });
  }
  await desktop.close();
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await phone.setContent(job.mobile, { waitUntil: "load" });
  await phone.screenshot({ path: resolve(dir, "mobile.png"), type: "png" });
  await phone.close();
  execFileSync("ffmpeg", ["-y", "-i", resolve(dir, job.video[0]), "-frames:v", "1", resolve(dir, "poster.jpg")], {
    stdio: "inherit",
  });
  video(dir, job.video, "walkthrough.mp4");
}

await browser.close();
writeFileSync(
  resolve(outRoot, "manifest.json"),
  JSON.stringify(
    {
      beautyflow: beautyScreens.map(({ file, label, caption, gallery, tab, audience }) => ({ file, label, caption, gallery, tab, audience })),
      "global-properties": propertyScreens.map(({ file, label, caption, gallery, tab, audience }) => ({ file, label, caption, gallery, tab, audience })),
    },
    null,
    2
  )
);
console.log("saas media written", outRoot);
