import type { AdminWhatsAppCopy } from "./adminWhatsAppInboxCopy";
import { conversationIdentity } from "./conversationIdentity";
import type { PublicWhatsAppThread } from "./whatsAppWebMessages";

export function WhatsAppContactPanel({
  row,
  copy,
  onAdd,
  onEdit,
}: {
  row: PublicWhatsAppThread;
  copy: AdminWhatsAppCopy;
  onAdd: () => void;
  onEdit: () => void;
}) {
  const identity = conversationIdentity(row);
  return (
    <aside className="hidden h-full min-h-0 w-[300px] shrink-0 flex-col overflow-y-auto border-s border-[#e9edef] bg-white p-4 xl:flex">
      <p className="text-xs font-black uppercase tracking-wide text-[#7C4DFF]">{copy.contactDetails}</p>
      <h2 className="mt-2 text-lg font-black text-[#111b21]">{identity.title || copy.unsavedHint}</h2>
      {identity.person ? <p className="text-sm font-bold text-slate-600">{identity.person}</p> : null}
      {identity.phone ? (
        <p className="mt-1 text-sm font-bold text-slate-500" dir="ltr">
          {identity.phone}
        </p>
      ) : null}
      {row.contactSaved ? (
        <dl className="mt-4 space-y-2 text-sm">
          {row.email ? (
            <div>
              <dt className="text-xs font-bold text-slate-400">{copy.email}</dt>
              <dd className="font-bold" dir="ltr">
                {row.email}
              </dd>
            </div>
          ) : null}
          {row.country ? (
            <div>
              <dt className="text-xs font-bold text-slate-400">{copy.country}</dt>
              <dd className="font-bold">{row.country}</dd>
            </div>
          ) : null}
          {row.notes ? (
            <div>
              <dt className="text-xs font-bold text-slate-400">{copy.notes}</dt>
              <dd className="whitespace-pre-wrap font-semibold text-slate-700">{row.notes}</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="mt-3 text-sm font-semibold text-slate-500">{copy.unsavedHint}</p>
      )}
      <button
        type="button"
        className="mt-4 min-h-11 rounded-full bg-[#7C4DFF] px-4 text-sm font-black text-white"
        onClick={row.contactSaved ? onEdit : onAdd}
      >
        {row.contactSaved ? copy.editContact : copy.addContact}
      </button>
    </aside>
  );
}
