// src/components/BusinessChatContainer.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';             // ודא שה־API הזה מכוּון ל-baseURL הנכון
import BusinessChat from './BusinessChat';

export default function BusinessChatContainer({
  token,
  role,
  myBusinessName,
  otherBusinessId,
}) {
  const [myBusinessId, setMyBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyBusiness() {
      try {
        const res = await API.get('/business/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // שים לב למבנה התשובה: אולי זה res.data._id או res.data.business._id
        setMyBusinessId(res.data.business._id);
        console.log('myBusinessId fetched:', res.data.business._id);
      } catch (err) {
        console.error('Error fetching my business id:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyBusiness();
  }, [token]);

  if (loading) return <p>טוען פרטי העסק…</p>;
  if (!myBusinessId)
    return (
      <p style={{ color: 'red' }}>
        ✖ לא קיבלתי מזהה עסק תקין. בדוק את ה־API ו־token.
      </p>
    );

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
