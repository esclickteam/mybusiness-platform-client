import React, { useState, useEffect, useRef } from "react";
import {
  Paperclip,
  Mic,
  Image,
  FileText,
  Send,
  ScrollText,
  FileSignature,
} from "lucide-react";
import axios from "axios";

const BusinessChat = ({ currentUser, partnerId, partnerName, demoMessages }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (demoMessages?.length) {
        const formatted = demoMessages.map((msg) => ({
          ...msg,
          from: msg.sender === "business" ? currentUser._id : partnerId,
          time: new Date().toISOString()
        }));
        setMessages(formatted);
        return;
      }

      try {
        const res = await axios.get(`/api/chat/${partnerId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("❌ שגיאה בטעינת שיחה", err);
      }
    };

    if (partnerId) fetchMessages();
  }, [partnerId, demoMessages, currentUser._id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      from: currentUser._id,
      to: partnerId,
      text: input.trim(),
      time: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, { ...newMessage, from: "me", pending: true }]);
    setInput("");

    try {
      await axios.post("/api/chat/send", newMessage);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, pending: false } : msg
        )
      );
    } catch (error) {
      console.error("❌ שגיאה בשליחת הודעה", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Audio = reader.result;
          const msg = {
            type: "audio",
            fileData: base64Audio,
            from: currentUser._id,
            to: partnerId,
            time: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, { ...msg, from: "me" }]);
        };

        reader.readAsDataURL(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("🎤 שגיאה בגישה למיקרופון:", err);
      alert("לא ניתן לגשת למיקרופון");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSendAgreement = () => {
    alert("📄 פתיחת טופס הסכם לשיתוף פעולה - בהמשך");
  };

  return (
    <div className="chat-card mx-auto max-w-3xl w-full bg-white rounded-2xl shadow border p-4" dir="rtl">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h3 className="text-xl font-bold text-purple-700">💬 שיחה עם {partnerName}</h3>
        <ScrollText className="text-purple-400" />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 px-1 h-[400px]">
        <div className="bc-messages">
          {messages.map((msg, idx) => {
            const isMe = msg.from === "me" || msg.from === currentUser._id;
            return (
              <div key={idx} className={`bc-bubble ${isMe ? "bc-bubble-business" : "bc-bubble-client"}`}>
                <div>{msg.type === "audio" ? <audio controls src={msg.fileData} /> : msg.text}</div>
                <div className="bc-time">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {msg.pending && <span className="ml-2 text-gray-400">⏳</span>}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className="bc-input-area mt-2">
        <button className="p-2 hover:text-purple-600"><Paperclip size={18} /></button>
        <button className="p-2 hover:text-purple-600"><Image size={18} /></button>
        <button className="p-2 hover:text-purple-600"><FileText size={18} /></button>
        <button
          className="p-2 hover:text-purple-600"
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? "עצור הקלטה" : "התחל הקלטה"}
        >
          <Mic size={18} color={isRecording ? "#e74c3c" : "#6c5ce7"} />
        </button>
        <button
          className="p-2 hover:text-purple-600"
          onClick={handleSendAgreement}
          title="שלח הסכם"
        >
          <FileSignature size={18} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="כתוב הודעה..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-purple-400"
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
        >
          <Send size={16} /> שלח
        </button>
      </div>
    </div>
  );
};

export default BusinessChat;
