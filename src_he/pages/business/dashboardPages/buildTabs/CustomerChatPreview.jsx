import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessages from './ChatMessages';
import './CustomerChatPreview.css';

const CustomerChatPreview = ({ businessDetails, setMessages, messages }) => {
  const chatSettings = businessDetails?.chatSettings ?? {};
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState('');
  const [text, setText] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [showAttach, setShowAttach] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    let storedId = localStorage.getItem('chatClientId');
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem('chatClientId', storedId);
    }
    setClientId(storedId);
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [localMessages, filePreview]);

  useEffect(() => {
    if (chatSettings.welcomeMessage && chatSettings.enabled) {
      setLocalMessages([{
        id: uuidv4(),
        from: 'system',
        text: chatSettings.welcomeMessage,
        timestamp: Date.now(),
      }]);
    }
  }, [chatSettings.enabled, chatSettings.welcomeMessage]);

  useEffect(() => {
    const relevant = messages.filter(
      (msg) => msg.from === 'customer' || msg.from === 'business'
    );
    setLocalMessages(relevant);
  }, [messages]);

  const handleSend = () => {
    if (!clientId || (!filePreview && !text.trim())) return;

    const newMessage = {
      id: uuidv4(),
      from: 'customer',
      clientId,
      name: name.trim(),
      text: text.trim() || '',
      file: filePreview ?? null,
      timestamp: Date.now(),
      to: 'business',
    };

    setMessages((prev) => [...prev, newMessage]);
    setLocalMessages((prev) => [...prev, newMessage]);

    if (!chatSettings.enabled && chatSettings.offlineMessage) {
      const autoReply = {
        id: uuidv4(),
        from: 'system',
        text: chatSettings.offlineMessage,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, autoReply]);
      setLocalMessages((prev) => [...prev, autoReply]);
    }

    setText('');
    setFilePreview(null);
    setShowAttach(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFilePreview({
        url: URL.createObjectURL(selected),
        name: selected.name,
        type: selected.type,
      });
      setShowAttach(false);
    }
  };

  const handleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setAudioChunks([]);

        recorder.ondataavailable = (e) => {
          setAudioChunks((prev) => [...prev, e.data]);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);

          setFilePreview({
            url: audioUrl,
            name: `recording-${Date.now()}.webm`,
            type: 'audio/webm',
          });
        };

        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("🎤 Error activating microphone:", err);
      }
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
    }
  };

  const removePreview = () => setFilePreview(null);

  return (
    <div className="customer-chat-preview" dir="rtl">
      <h3>💬 Chat with the business</h3>

      <div className="chat-box-wrapper" ref={chatBoxRef}>
        {filePreview && (
          <div className="chat-message-row from-customer">
            <div className="chat-bubble preview">
              <button onClick={removePreview}>✖</button>
              {filePreview.type.startsWith('image') ? (
                <img src={filePreview.url} alt={filePreview.name} />
              ) : filePreview.type.startsWith('video') ? (
                <video controls>
                  <source src={filePreview.url} type={filePreview.type} />
                </video>
              ) : filePreview.type.startsWith('audio') ? (
                <audio controls style={{ marginTop: '6px', width: '100%' }}>
                  <source src={filePreview.url} type={filePreview.type} />
                  Your browser does not support audio playback.
                </audio>
              ) : (
                <p>{`📎 ${filePreview.name}`}</p>
              )}
            </div>
          </div>
        )}

        <ChatMessages messages={localMessages} currentClientId={clientId} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
        />

        <div className="chat-input-buttons">
          <button onClick={() => setShowAttach(!showAttach)}>📎</button>
          <button onClick={handleVoiceRecording}>
            {isRecording ? '⏹️ Stop' : '🎙️ Record'}
          </button>
          <button onClick={handleSend}>Send</button>
        </div>

        {showAttach && (
          <div className="attachment-popup">
            <button onClick={() => document.getElementById('fileInputImage').click()}>Image</button>
            <button onClick={() => document.getElementById('fileInputVideo').click()}>Video</button>
            <button onClick={() => document.getElementById('fileInputFile').click()}>File</button>
          </div>
        )}

        <input type="file" id="fileInputImage" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        <input type="file" id="fileInputVideo" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
        <input type="file" id="fileInputFile" accept=".pdf,.doc,.docx,.webm" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default CustomerChatPreview;
