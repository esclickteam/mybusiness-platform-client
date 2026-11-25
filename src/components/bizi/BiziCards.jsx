import { useState } from "react";
import { biziCopy } from "./biziPublic";

export default function BiziCards({ cards = [], language, onLead }) {
  const copy = biziCopy(language);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", agree: false });
  if (!cards.length) return null;

  return (
    <div className="mt-2 space-y-2 text-start">
      {cards.map((card, index) => {
        if (card.type === "plan") {
          return (
            <article key={`${card.code}-${index}`} className="rounded-lg border border-[#2541f5]/20 bg-[#f1f4ff] px-3 py-2 text-xs text-[#111936]">
              <strong className="block text-sm">{card.name}</strong>
              <b>${card.price}</b> <span>{card.period}</span>
            </article>
          );
        }
        if (card.type === "compare") {
          return (
            <div key={`compare-${index}`} className="grid gap-1">
              {(card.plans || []).map((plan) => (
                <p key={plan.code} className="rounded-md bg-white px-2 py-1 text-xs text-[#111936]">
                  <strong>{plan.name}</strong> · ${plan.price} {plan.period}
                </p>
              ))}
            </div>
          );
        }
        if (card.type === "quote") {
          return (
            <article key={`quote-${index}`} className="rounded-lg border border-[#111936]/10 bg-white px-3 py-2 text-xs text-[#111936]">
              <strong>{copy.sample}</strong>
              <ul className="mt-1 space-y-1">
                {card.lines.map((line) => (
                  <li key={`${line.code}-${line.quantity}`}>
                    {line.name}{line.quantity > 1 ? ` × ${line.quantity}` : ""} · ${line.amount} {line.period}
                    {line.note ? ` · ${line.note}` : ""}
                  </li>
                ))}
              </ul>
              {card.total != null ? <p className="mt-1 font-bold">${card.total}</p> : null}
              {card.note ? <p className="mt-1 text-[11px]">{card.note}</p> : null}
            </article>
          );
        }
        if (card.type === "lead") {
          return (
            <form
              key={`lead-${index}`}
              className="grid gap-1 rounded-lg bg-[#fff0f8] p-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!form.agree || !form.name || (!form.email && !form.phone)) return;
                onLead?.(form);
              }}
            >
              <p className="text-xs font-bold text-[#111936]">{copy.lead}</p>
              <input className="h-8 rounded border border-[#111936]/15 px-2 text-xs" placeholder={copy.name} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <input className="h-8 rounded border border-[#111936]/15 px-2 text-xs" placeholder={copy.email} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <input className="h-8 rounded border border-[#111936]/15 px-2 text-xs" placeholder={copy.phone} value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              <input className="h-8 rounded border border-[#111936]/15 px-2 text-xs" placeholder={copy.company} value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
              <label className="flex items-center gap-2 text-[11px] text-[#111936]">
                <input type="checkbox" checked={form.agree} onChange={(event) => setForm({ ...form, agree: event.target.checked })} />
                {copy.agree}
              </label>
              <button type="submit" className="h-8 rounded bg-[#2541f5] text-xs font-bold text-white">{copy.send}</button>
            </form>
          );
        }
        return null;
      })}
    </div>
  );
}
