import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // ודא שזו הכתובת הנכונה
import ChatPage from './ChatPage.jsx';

export default function ChatLayout({
  clientProfilePic,
  businessProfilePic,
  isBusiness
}) {
  const { businessId } = useParams();
  const { user } = useAuth();

  // userId אמיתי: אם isBusiness נשתמש ב־businessId, אחרת ב־user.id מהקונטקסט
  const userId = isBusiness
    ? businessId  // אם מדובר בצד העסק, השתמש במזהה העסק מ-URL
    : user?.id || '';  // אם אין user (למשל לא מחובר), אל תשלח מזהה

  // העברת פרופילים ו-ID של המשתמש או העסק ל-ChatPage
  return (
    <ChatPage
      isBusiness={isBusiness}                // מציין אם מדובר בצד עסקי
      userId={userId}                        // מזהה המשתמש או העסק
      clientProfilePic={clientProfilePic}    // תמונת פרופיל של הלקוח
      businessProfilePic={businessProfilePic} // תמונת פרופיל של העסק
      initialPartnerId={businessId}         // אם מדובר בצד העסק, ה-PartnerId הוא ה-ID של העסק
    />
  );
}
