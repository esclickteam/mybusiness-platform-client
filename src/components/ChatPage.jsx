import React, { useState, useEffect } from 'react';
import ChatComponent from './ChatComponent';

const ChatPage = () => {
  const [partnerId, setPartnerId] = useState(null); // תחילה partnerId הוא null
  const userId = "6808a79b7e22f6b69b8d2c80"; // מזהה הלקוח
  const clientProfilePic = "path/to/client/profilePic";
  const businessProfilePic = "path/to/business/profilePic";

  // נניח שאנחנו טוענים את מזהה העסק (partnerId) מ-API
  useEffect(() => {
    // סימולציה של חיבור ל-API שמחזיר את partnerId
    const fetchPartnerId = async () => {
      try {
        // כאן אתה יכול להחליף את זה בבקשת API אמיתית:
        const partnerIdFromAPI = "partner123"; // נתון לדוגמה
        setPartnerId(partnerIdFromAPI);
      } catch (error) {
        console.error('שגיאה בטעינת partnerId', error);
      }
    };

    fetchPartnerId();
  }, []); // הפונקציה תרוץ רק פעם אחת אחרי שמרנדרים את הקומפוננטה

  // אם partnerId לא הוגדר, מציגים הודעה מתאימה
  if (!partnerId) {
    return <div>טוען נתונים...</div>; // שים לב שההודעה מוצגת עד ש-`partnerId` נטען
  }

  return (
    <div>
      <ChatComponent
        userId={userId}
        partnerId={partnerId}  // ודא ש- partnerId מועבר כראוי
        clientProfilePic={clientProfilePic}
        businessProfilePic={businessProfilePic}
        isBusiness={false} // אם זה לקוח, ערך זה יהיה false
      />
    </div>
  );
};

export default ChatPage;
