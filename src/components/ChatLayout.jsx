import React from 'react';
import ChatComponent from './ChatComponent';
import './ChatLayout.css';

export default function ChatLayout(props) {
  return (
    <div className="chat-layout">
      {/* הסיידבר */}
      <aside className="chat-sidebar">
        <h4>שיחות <span className="chat-sidebar-icon">💬</span></h4>
        {/* לדוגמה: פריט אחד */}
        <div className="chat-sidebar-item">
          סטודיו לעיצוב גרפי<br/>
          נשמע מעניין, בואי נדבר…
        </div>
        {/* כאן תעברי על רשימת השיחות האמיתית */}
      </aside>

      {/* אזור הצ'אט הראשי */}
      <section className="chat-main">
        <ChatComponent {...props} />
      </section>
    </div>
  );
}
