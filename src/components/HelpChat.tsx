import React, {
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type MessageSender = "user" | "bot";

interface ChatMessage {
  sender: MessageSender;
  text: string;
}

interface ChatbotResponse {
  answer?: string;
}

export default function HelpChat() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send a question to the server and add the response to the chat
  async function sendQuestion(): Promise<void> {
    const question = input.trim();

    if (!question) return;

    const userMessage: ChatMessage = {
      sender: "user",
      text: question,
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);
    setInput("");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = (await response.json()) as ChatbotResponse;

      const botMessage: ChatMessage = {
        sender: "bot",
        text:
          data.answer ||
          "Sorry, no suitable answer was found.",
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        botMessage,
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          sender: "bot",
          text: "An error occurred, please try again later.",
        },
      ]);
    }
  }

  function handleInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ): void {
    if (event.key === "Enter") {
      void sendQuestion();
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <header
            className="border-b border-slate-100 px-5 py-6 sm:px-8 sm:py-8"
            dir="rtl"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-100" />
                  מרכז העזרה של Bizuply
                </div>

                <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                  איך אפשר לעזור?
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  שאלו שאלה וקבלו תשובה מהירה על המערכת,
                  האתר וכלי העסק.
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-slate-700"
                  aria-hidden="true"
                >
                  <path
                    d="M8.5 18.5H7A4 4 0 0 1 3 14.5v-5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4h-4.5L8 21v-2.5h.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10h8M8 14h5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="border-b border-slate-100 p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex h-[480px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-[#fbfcfe]">
                <div
                  className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
                  dir="ltr"
                >
                  {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <div className="max-w-sm text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-6 w-6 text-slate-500"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 3a8 8 0 0 0-8 8v1.5A2.5 2.5 0 0 0 6.5 15H8v-6H6.1A6 6 0 0 1 18 11v4h-2v-3h-3v6h3a4 4 0 0 0 4-4v-3a8 8 0 0 0-8-8Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <h2 className="text-base font-bold text-slate-800">
                          התחילו שיחה
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          כתבו שאלה בתיבה למטה ונעזור למצוא
                          את התשובה המתאימה.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isUser = message.sender === "user";

                      return (
                        <div
                          key={`${message.sender}-${index}`}
                          className={`flex ${
                            isUser
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] whitespace-pre-wrap break-words px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
                              isUser
                                ? "rounded-[20px_20px_6px_20px] bg-slate-900 text-white"
                                : "rounded-[20px_20px_20px_6px] border border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100">
                    <input
                      type="text"
                      placeholder="כתבו את השאלה שלכם..."
                      value={input}
                      onChange={(event) =>
                        setInput(event.target.value)
                      }
                      onKeyDown={handleInputKeyDown}
                      className="min-w-0 flex-1 bg-transparent px-3 py-3 text-right text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
                      aria-label="Help question"
                      dir="rtl"
                    />

                    <button
                      type="button"
                      onClick={() => void sendQuestion()}
                      disabled={!input.trim()}
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      aria-label="Send question"
                    >
                      <span className="hidden sm:inline">
                        שליחה
                      </span>

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <path
                          d="m5 12 14-7-4 14-3.2-5.8L5 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside
              className="bg-slate-50/70 p-5 sm:p-6 lg:p-8"
              dir="rtl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                שאלות נפוצות
              </p>

              <h2 className="mt-2 text-xl font-extrabold text-slate-900">
                אפשר להתחיל מכאן
              </h2>

              <div className="mt-6 space-y-3">
                {[
                  "איך בונים אתר?",
                  "איך מנהלים לידים ב־CRM?",
                  "איך מפרסמים את האתר?",
                  "איך משתמשים בכלי ה־AI?",
                  "איך עורכים את פרופיל העסק?",
                ].map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => setInput(question)}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-right text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <span>{question}</span>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:-translate-x-0.5 group-hover:text-slate-700"
                      aria-hidden="true"
                    >
                      <path
                        d="m15 6-6 6 6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 8v4m0 4h.01M10.3 3.7 3.7 15.1A2 2 0 0 0 5.4 18h13.2a2 2 0 0 0 1.7-2.9L13.7 3.7a2 2 0 0 0-3.4 0Z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      לא מצאתם תשובה?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      כתבו שאלה מפורטת בצ&apos;אט וננסה
                      לספק תשובה מדויקת יותר.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}