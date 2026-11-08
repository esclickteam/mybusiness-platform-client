import React, { useState } from "react";
import API from "../../../../api";

type ChatEditor = {
  data?: Record<string, unknown>;
  setData?: (value: Record<string, unknown> | ((current: Record<string, unknown>) => Record<string, unknown>)) => void;
  canvasRef?: { current?: HTMLElement | null };
  flushAutosave?: () => void | Promise<void>;
};

export default function AiEditorChat({ editor }: { editor: ChatEditor }) {
  const html = String(editor.data?.__aiDocument || "");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  if (!html) return null;
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} dir="rtl" className="fixed bottom-4 end-4 z-[2147483200] border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow">
        שינוי באמצעות AI
      </button>
    );
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const instruction = message.trim();
    if (instruction.length < 2 || busy) return;
    setBusy(true);
    setNote("");
    try {
      const live = editor.canvasRef?.current?.querySelector("main")?.outerHTML || html;
      const css = String(editor.data?.__aiCss || "");
      const { data } = await API.post("/ai-studio/editor-patch", {
        html: live,
        css,
        instruction,
      }, { timeout: 30000 });
      const nextHtml = String(data?.html || "");
      const nextCss = String(data?.css || css);
      if (!nextHtml || (nextHtml === live && nextCss === css)) {
        setNote("השינוי לא היה ממוקד, ולכן האתר לא הוחלף.");
        return;
      }
      editor.setData?.((current) => ({
        ...current,
        __aiDocument: nextHtml,
        __aiCss: nextCss,
      }));
      await editor.flushAutosave?.();
      setMessage("");
      setNote("השינוי נשמר. שאר העריכות נשארו.");
    } catch (error: any) {
      setNote(error?.response?.data?.error || "השינוי לא הושלם. העריכות הקודמות נשמרו.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={send} dir="rtl" className="fixed bottom-4 end-4 z-[2147483200] w-80 border border-slate-200 bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-800">שינוי באמצעות AI</p>
        <button type="button" onClick={() => setOpen(false)} className="border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700">סגירה</button>
      </div>
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-2 min-h-16 w-full border border-slate-200 p-2 text-sm" placeholder="שנו צבע, כפתור או כותרת. שאר העריכות נשמרות." />
      <button type="submit" disabled={busy || message.trim().length < 2} className="mt-2 bg-[#5B4CF5] px-4 py-2 text-sm font-black text-white disabled:opacity-50">שלח</button>
      {note ? <p className="mt-2 text-xs leading-5 text-slate-600">{note}</p> : null}
      <p className="mt-2 text-[11px] leading-5 text-slate-500">פרסום וחיבור דומיין אינם פעילים בגרסה הזו.</p>
    </form>
  );
}
