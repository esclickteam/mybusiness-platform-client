// BusinessChatContainer.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import BusinessChat from './BusinessChat';

export default function BusinessChatContainer({ token, role, myBusinessName, otherBusinessId }) {
  const [myBusinessId, setMyBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);

  // שלב 2
  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get('/business/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // שמור את ה־_id ב־state
        setMyBusinessId(res.data.business._id);
      } catch (err) {
        console.error('שגיאה בשליפת העסק:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyBusiness();
  }, [token]);

  // שלב 3
  if (loading) return <p>טוען פרטי העסק…</p>;
  if (!myBusinessId) return <p style={{ color: 'red' }}>לא נמצא מזהה עסק תקין.</p>;

  // שלב 4
  return (
    <BusinessChat
      token={token}
      role={role}
      myBusinessId={myBusinessId}
      myBusinessName={myBusinessName}
      otherBusinessId={otherBusinessId}
    />
  );
}
