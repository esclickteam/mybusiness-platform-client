import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { biziCopy } from "./biziPublic";
import BiziCards from "./BiziCards";
import "./biziDock.css";

const STORE = "bizi-transcript";

export default function BiziDock() {
  const { i18n } = useTranslation();
  const copy = biziCopy(i18n.language);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const faceRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true));
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || "[]");
      if (Array.isArray(saved)) setMessages(saved);
    } catch {
      /* keep the empty thread */
    }
    const openFromPage = () => setOpen(true);
    window.addEventListener("bizuply:openSupportChat", openFromPage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("bizuply:openSupportChat", openFromPage);
    };
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-40)));
    } catch {
      /* storage can be unavailable */
    }
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  async function ask(text, extra = {}) {
    const question = String(text || "").trim();
    if (!question || loading) return;
    setInput("");
    setMessages((current) => [...current, { sender: "user", text: question }]);
    setLoading(true);
    try {
      const recentMessages = messages.slice(-6).map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
        content: String(item.text || "").slice(0, 800),
      }));
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question,
          locale: i18n.language,
          currentPath: window.location.pathname,
          recentMessages,
          channel: "bizi",
          consent: extra.consent === true,
          contact: extra.contact,
        }),
      });
      const data = await response.json().catch(() => ({}));
      setMessages((current) => [
        ...current,
        {
          sender: "bot",
          text: data.answer || copy.hint,
          cards: Array.isArray(data.cards) ? data.cards : [],
          offerHuman: Boolean(data.offerHuman),
        },
      ]);
    } catch {
      setMessages((current) => [...current, { sender: "bot", text: copy.hint }]);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const face = faceRef.current;
    const first = face?.getBoundingClientRect();
    setOpen((value) => !value);
    window.requestAnimationFrame(() => {
      const next = faceRef.current?.getBoundingClientRect();
      if (!first || !next || !faceRef.current) return;
      const dx = first.left - next.left;
      const dy = first.top - next.top;
      const scale = first.width / next.width;
      faceRef.current.style.transition = "none";
      faceRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      window.requestAnimationFrame(() => {
        if (!faceRef.current) return;
        faceRef.current.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
        faceRef.current.style.transform = "none";
      });
    });
  }

  return (
    <aside className={`bizi-dock${entered ? " is-in" : ""}${open ? " is-open" : ""}`} dir={i18n.dir()}>
      <div className="bizi-dock__shell">
        <header className="bizi-dock__bar">
          <img ref={faceRef} className="bizi-dock__face" src="/brand/bizi.png" alt="" width="68" height="68" />
          <button type="button" className="bizi-dock__hit" onClick={toggle} aria-expanded={open}>
            <span className="bizi-dock__copy">
              <strong>{open ? copy.title : copy.launcher}</strong>
              <small>{open ? copy.role : copy.launcherSub}</small>
            </span>
            <span className="bizi-dock__chat" aria-hidden="true">{open ? "×" : "✎"}</span>
          </button>
        </header>
        {open ? (
          <div className="bizi-dock__panel">
            <div className="bizi-dock__thread" ref={listRef}>
              {messages.length === 0 ? <p className="bizi-dock__hello">{copy.greeting}</p> : null}
              {messages.map((message, index) => (
                <div key={`${message.sender}-${index}`} className={`bizi-dock__msg is-${message.sender}`}>
                  <p>{message.text}</p>
                  {message.cards?.length ? (
                    <BiziCards
                      cards={message.cards}
                      language={i18n.language}
                      onLead={(contact) => ask(copy.agree, { consent: true, contact })}
                    />
                  ) : null}
                  {message.offerHuman ? (
                    <button type="button" className="bizi-dock__human" onClick={() => ask(copy.prompts[5])}>
                      {copy.prompts[5]}
                    </button>
                  ) : null}
                </div>
              ))}
              {loading ? <p className="bizi-dock__msg is-bot">…</p> : null}
              {messages.length === 0 ? (
                <div className="bizi-dock__starts">
                  {copy.prompts.slice(0, 5).map((prompt) => (
                    <button key={prompt} type="button" onClick={() => ask(prompt)}>{prompt}</button>
                  ))}
                </div>
              ) : null}
            </div>
            <form
              className="bizi-dock__form"
              onSubmit={(event) => {
                event.preventDefault();
                ask(input);
              }}
            >
              <input value={input} onChange={(event) => setInput(event.target.value)} aria-label={copy.launcher} />
              <button type="submit">{copy.send}</button>
            </form>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
