import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./BusinessChat.css";
import {
  Paperclip,
  Mic,
  Image,
  Send,
  ScrollText,
  FileSignature,
} from "lucide-react";

import CollabContractForm from "./CollabContractForm";
import CollabContractView from "./CollabContractView";

const BusinessCollabChat = () => {
  const [isTestMode, setIsTestMode] = useState(false);

  const demoSender = {
    _id: "sender123",
    businessName: "Business Test",
    email: "business@example.com",
  };

  const demoReceiver = {
    _id: "receiver456",
    businessName: "סטודיו לעיצוב גרפי",
    email: "newuser@example.com",
  };

  const currentUser = isTestMode ? demoReceiver : demoSender;
  const isDev = currentUser.email === "newuser@example.com";

  const [collabConversations, setCollabConversations] = useState([]);
  const [activeCollabChat, setActiveCollabChat] = useState(null);
  const [collabMessages, setCollabMessages] = useState([]);
  const [collabInput, setCollabInput] = useState("");
  const [contractDraft, setContractDraft] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [showContractForm, setShowContractForm] = useState(false);

  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [collabMessages]);

  useEffect(() => {
    setCollabConversations([
      {
        _id: "demo-collab-chat-1",
        partnerId: demoReceiver._id,
        partnerName: demoReceiver.businessName,
        lastMessage: { text: "נשמע מעניין, בואי נדבר!" },
      },
    ]);
  }, []);

  const openCollabChat = (chat) => {
    setActiveCollabChat(chat);
    setCollabMessages([
      {
        from: chat.partnerId,
        text: "היי, בא לך שיתוף פעולה בתחום הוויזואל?",
        time: new Date().toISOString(),
      },
      {
        from: currentUser._id,
        text: "כן, נראה מעולה! 😊",
        time: new Date().toISOString(),
      },
    ]);
    setContractDraft(null);
    setShowContractForm(false);
  };

  const handleCollabSend = async () => {
    if (!activeCollabChat) return;

    let newMsg;

    if (contractDraft && contractDraft.senderSignature) {
      newMsg = {
        conversationId: activeCollabChat._id,
        from: currentUser._id,
        to: activeCollabChat.partnerId,
        type: "contract",
        contractData: {
          ...contractDraft,
          sender: { businessName: demoSender.businessName },
          receiver: { businessName: demoReceiver.businessName },
          createdAt: new Date().toISOString(),
          status: "ממתין לאישור",
        },
        time: new Date().toISOString(),
      };
      setContractDraft(null);
      setShowContractForm(false);
    } else if (collabInput.trim()) {
      newMsg = {
        conversationId: activeCollabChat._id,
        from: currentUser._id,
        to: activeCollabChat.partnerId,
        text: collabInput.trim(),
        time: new Date().toISOString(),
      };
      setCollabInput("");
    } else {
      alert("אין תוכן לשליחה (חוזה חתום או הודעה)");
      return;
    }

    setCollabMessages((prev) => [...prev, { ...newMsg, from: "me", pending: true }]);

    try {
      await axios.post("/api/chat/send", newMsg); // לא חובה
      setCollabMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { ...msg, pending: false } : msg
        )
      );
    } catch (err) {
      console.error("❌ שגיאה בשליחה", err);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file || !activeCollabChat) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const msg = {
        type,
        fileName: file.name,
        fileData: reader.result,
        from: currentUser._id,
        to: activeCollabChat.partnerId,
        time: new Date().toISOString(),
      };
      setCollabMessages((prev) => [...prev, { ...msg, from: "me" }]);
    };
    reader.readAsDataURL(file);
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
      
          console.log("🎧 base64Audio:", base64Audio); // בדיקה בקונסול
          if (!base64Audio.startsWith("data:audio/webm;base64")) {
            console.error("❌ הקלטה לא בפורמט base64 תקין");
            return;
          }
      
          const msg = {
            type: "audio",
            fileData: base64Audio, // זה מה שנשלח ומוצג
            from: currentUser._id,
            to: activeCollabChat.partnerId,
            time: new Date().toISOString(),
          };
      
          console.log("📤 נשלח ל-chat:", msg); // בדיקה נוספת
      
          setCollabMessages((prev) => [...prev, { ...msg, from: "me" }]);
        };
      
        reader.readAsDataURL(blob); // 🚨 שורת המפתח – יוצרת base64
      };
      
  
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch {
      alert("🎤 אין גישה למיקרופון");
    }
  };
  
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };
  

  return (
    <div className="business-chat-wrapper" dir="rtl">
      {isDev && (
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <button
            className="collab-form-button"
            onClick={() => setIsTestMode((prev) => !prev)}
          >
            🔄 החלף משתמש ({isTestMode ? "מקבל" : "שולח"})
          </button>
          <div style={{ fontSize: "0.9rem", marginTop: "0.3rem", color: "#888" }}>
            מחובר כ: <strong>{currentUser.businessName}</strong>
          </div>
        </div>
      )}

      <aside className="chat-sidebar">
        <h3>💬 שיחות</h3>
        {collabConversations.map((chat) => (
          <div
            key={chat._id}
            className={`chat-list-item ${activeCollabChat?._id === chat._id ? "active" : ""}`}
            onClick={() => openCollabChat(chat)}
          >
            <strong>{chat.partnerName}</strong>
            <p>{chat.lastMessage?.text?.slice(0, 30)}...</p>
          </div>
        ))}
      </aside>

      <section className="chat-main">
        {activeCollabChat ? (
          <>
            <header className="chat-header">
              <h4>שיחה עם {activeCollabChat.partnerName}</h4>
              <ScrollText />
            </header>

            <div className="chat-messages">
              {collabMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-bubble ${
                    msg.from === currentUser._id || msg.from === "me"
                      ? "from-me"
                      : "from-them"
                  }`}
                >
                  <div>
                    {msg.type === "contract" ? (
                      <CollabContractView
                        contract={msg.contractData}
                        currentUser={currentUser}
                        onApprove={(updatedFields) => {
                          const updated = {
                            ...msg.contractData,
                            ...updatedFields,
                          };
                          setCollabMessages((prev) =>
                            prev.map((m, i) =>
                              i === idx
                                ? { ...m, contractData: updated }
                                : m
                            )
                          );
                        }}
                      />
                    ) : msg.type === "image" ? (
                      <img src={msg.fileData} alt="תמונה" />
                    ) : msg.type === "file" ? (
                      <a href={msg.fileData} download={msg.fileName}>📎 {msg.fileName}</a>
                    ) : msg.type === "audio" ? (
                      <audio controls src={msg.fileData} />
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className="timestamp">
                    {new Date(msg.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.pending && <span> ⏳</span>}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {showContractForm && (
              <div className="chat-contract-area">
                <CollabContractForm
                  currentUser={currentUser}
                  partnerBusiness={{
                    name: activeCollabChat.partnerName,
                  }}
                  onSubmit={(data) => setContractDraft(data)}
                />
              </div>
            )}

            <footer className="chat-input-bar">
              <button onClick={() => fileInputRef.current.click()}>
                <Paperclip size={18} />
              </button>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "file")} />

              <button onClick={() => imageInputRef.current.click()}>
                <Image size={18} />
              </button>
              <input type="file" ref={imageInputRef} accept="image/*" style={{ display: "none" }} onChange={(e) => handleFileUpload(e, "image")} />

              <button onClick={isRecording ? stopRecording : startRecording}>
                <Mic size={18} color={isRecording ? "#e74c3c" : "#6c5ce7"} />
              </button>

              <button onClick={() => setShowContractForm(true)}>
                <FileSignature size={18} />
              </button>

              <input
                type="text"
                value={collabInput}
                onChange={(e) => setCollabInput(e.target.value)}
                placeholder="כתוב הודעה..."
              />
              <button onClick={handleCollabSend}>
                <Send size={16} /> שלח
              </button>
            </footer>
          </>
        ) : (
          <div className="no-chat-selected">בחר שיחה כדי להתחיל</div>
        )}
      </section>
    </div>
  );
};

export default BusinessCollabChat;
