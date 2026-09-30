import React from "react";
import type { AgreementSignatory } from "../../../lib/partnerAgreementApi";
import { linkStateLabel } from "./partnerAgreementPageCopy.js";
import { usePartnerAgreementPage } from "./usePartnerAgreementPage";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400";

function blank(party: "partner" | "bizuply", order: number): AgreementSignatory {
  return { party, fullName: "", title: "", email: "", phone: "", order, required: true };
}

function requiredCount(rows: AgreementSignatory[], party: "partner" | "bizuply") {
  return rows.filter((row) => row.party === party && row.required !== false).length;
}

function countValue(count: number, options: number[]) {
  return options.includes(count) ? String(count) : "custom";
}

export default function SignatoriesPanel({
  signingMode,
  signatories,
  editable,
  locked,
  agreementId,
  busy,
  onChange,
  onResend,
  onRevoke,
  onSignBizuply,
}: {
  signingMode: "parallel" | "sequential";
  signatories: AgreementSignatory[];
  editable: boolean;
  locked: boolean;
  agreementId?: string;
  busy: boolean;
  onChange: (signatories: AgreementSignatory[], mode: "parallel" | "sequential") => void;
  onResend?: (signatoryId: string) => void;
  onRevoke?: (signatoryId: string) => void;
  onSignBizuply?: (signatory: AgreementSignatory) => void;
}) {
  const page = usePartnerAgreementPage();
  const text = page.text.sign;
  const rows = signatories.length ? signatories : [blank("partner", 1), blank("bizuply", 1)];

  function update(next: AgreementSignatory[], mode = signingMode) {
    onChange(next, mode);
  }

  function setCount(party: "partner" | "bizuply", value: string) {
    if (value === "custom") return;
    const count = Number(value);
    const others = rows.filter((row) => row.party !== party);
    let side = rows.filter((row) => row.party === party);
    const current = side.filter((row) => row.required !== false).length;
    if (current < count) {
      for (let index = current; index < count; index += 1) side.push(blank(party, side.length + 1));
    } else if (current > count) {
      let extra = current - count;
      side = side.filter((row) => {
        if (!extra || row.required === false || row.signedAt) return true;
        extra -= 1;
        return false;
      });
    }
    side = side.map((row, index) => ({ ...row, order: index + 1 }));
    update([...others, ...side]);
  }

  function patch(index: number, patchRow: Partial<AgreementSignatory>) {
    update(rows.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patchRow } : row)));
  }

  function add(party: "partner" | "bizuply") {
    const count = rows.filter((row) => row.party === party).length;
    update([...rows, blank(party, count + 1)]);
  }

  function remove(index: number) {
    const row = rows[index];
    if (!row || row.signedAt) return;
    update(rows.filter((_, rowIndex) => rowIndex !== index));
  }

  const partnerOptions = [1, 2, 3, 4];
  const bizuplyOptions = [1, 2, 3];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5" dir={page.dir} lang={page.locale} data-testid="signatories-section">
      <h2 className="text-lg font-black text-slate-900">{text.section}</h2>
      {locked ? <p className="mt-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">{text.locked}</p> : null}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-800">
          {text.mode}
          <select
            className={`${inputClass} mt-1`}
            data-testid="signing-mode"
            disabled={!editable || locked}
            value={signingMode}
            onChange={(event) => update(rows, event.target.value === "sequential" ? "sequential" : "parallel")}
          >
            <option value="parallel">{text.parallel}</option>
            <option value="sequential">{text.sequential}</option>
          </select>
          <span className="mt-1 block text-xs font-semibold text-slate-500">
            {signingMode === "sequential" ? text.sequentialHelp : text.parallelHelp}
          </span>
        </label>
      </div>
      {(["partner", "bizuply"] as const).map((party) => {
        const options = party === "partner" ? partnerOptions : bizuplyOptions;
        const side = rows
          .map((row, index) => ({ row, index }))
          .filter((item) => item.row.party === party);
        return (
          <div key={party} className="mt-6" data-testid={`${party}-signatories`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-base font-black text-slate-900">{party === "partner" ? text.partner : text.bizuply}</h3>
              <label className="text-sm font-bold text-slate-800">
                {party === "partner" ? text.requiredPartner : text.requiredBizuply}
                <select
                  className={`${inputClass} mt-1`}
                  data-testid={`${party}-required-count`}
                  disabled={!editable || locked}
                  value={countValue(requiredCount(rows, party), options)}
                  onChange={(event) => setCount(party, event.target.value)}
                >
                  {options.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                  <option value="custom">{text.custom}</option>
                </select>
              </label>
            </div>
            <div className="mt-3 space-y-3">
              {side.map(({ row, index }) => (
                <article key={row.signatoryId || `${party}-${index}`} className="rounded-2xl border border-slate-200 p-3" data-testid="signatory-row">
                  <div className="grid gap-2 md:grid-cols-2">
                    <input className={inputClass} disabled={!editable || locked || Boolean(row.signedAt)} placeholder={text.name} aria-label={text.name} value={row.fullName} onChange={(event) => patch(index, { fullName: event.target.value })} />
                    <input className={inputClass} disabled={!editable || locked || Boolean(row.signedAt)} placeholder={text.title} aria-label={text.title} value={row.title} onChange={(event) => patch(index, { title: event.target.value })} />
                    <input className={inputClass} disabled={!editable || locked || Boolean(row.signedAt)} placeholder={text.email} aria-label={text.email} value={row.email} onChange={(event) => patch(index, { email: event.target.value })} />
                    <input className={inputClass} disabled={!editable || locked || Boolean(row.signedAt)} placeholder={text.phone} aria-label={text.phone} value={row.phone || ""} onChange={(event) => patch(index, { phone: event.target.value })} />
                    <label className="text-xs font-black uppercase text-slate-500">
                      {text.order}
                      <input className={`${inputClass} mt-1`} type="number" min={1} disabled={!editable || locked || Boolean(row.signedAt)} value={row.order} onChange={(event) => patch(index, { order: Number(event.target.value) || 1 })} />
                    </label>
                    <label className="text-xs font-black uppercase text-slate-500">
                      {text.status}
                      <select
                        className={`${inputClass} mt-1`}
                        data-testid="signatory-required"
                        disabled={!editable || locked || Boolean(row.signedAt)}
                        value={row.required === false ? "optional" : "required"}
                        onChange={(event) => patch(index, { required: event.target.value !== "optional" })}
                      >
                        <option value="required">{text.required}</option>
                        <option value="optional">{text.optional}</option>
                      </select>
                    </label>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                    <span>{row.signedAt ? text.signed : text.pending}</span>
                    {row.signedAt ? <span>{text.signedDate}: {String(row.signedAt).slice(0, 10)}</span> : null}
                    {row.linkState && row.linkState !== "none" ? <span>{linkStateLabel(row.linkState, page.text)}</span> : null}
                    {editable && !locked && !row.signedAt ? (
                      <button type="button" className="rounded-xl bg-slate-100 px-2 py-1" onClick={() => remove(index)}>
                        {text.remove}
                      </button>
                    ) : null}
                    {agreementId && row.signatoryId && !row.signedAt ? (
                      <>
                        <button type="button" disabled={busy} className="rounded-xl bg-slate-900 px-2 py-1 text-white" onClick={() => onResend?.(row.signatoryId || "")}>
                          {text.resend}
                        </button>
                        <button type="button" disabled={busy} className="rounded-xl bg-rose-50 px-2 py-1 text-rose-800" onClick={() => onRevoke?.(row.signatoryId || "")}>
                          {text.revoke}
                        </button>
                      </>
                    ) : null}
                    {agreementId && row.party === "bizuply" && row.signatoryId && !row.signedAt ? (
                      <button type="button" disabled={busy} className="rounded-xl bg-[#7C4DFF] px-2 py-1 text-white" onClick={() => onSignBizuply?.(row)}>
                        {text.signNow}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            {editable && !locked ? (
              <button type="button" className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black" onClick={() => add(party)}>
                {text.add}
              </button>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
