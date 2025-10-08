// src/components/BusinessChatContainer.jsx
import React, { useEffect, useState } from 'react';
import API from '../api'; // ודא שה־API הזה מכוּון ל-baseURL הנכון
import BusinessChat from './BusinessChat';

export default function BusinessChatContainer({
  token,
  role,
  myBusinessName,
  otherBusinessId,
}) {
  const [myBusinessId, setMyBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. נסו קודם לשלוף מה־localStorage
    const storedDetails = JSON.parse(localStorage.getItem('businessDetails') || '{}');
    if (storedDetails._id) {
      setMyBusinessId(storedDetails._id);
      localStorage.setItem('myBusinessId', storedDetails._id);
      setLoading(false);
      console.log('myBusinessId from localStorage:', storedDetails._id);
      return;
    }

    // 2. אם לא נמצא ב־localStorage, פנו ל־API
    async function fetchMyBusiness() {
      try {
        const res = await API.get('/business/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // בהתאם למבנה התשובה שלך:
        const id = res.data.business?._id || res.data._id;
        if (id) {
          setMyBusinessId(id);
          localStorage.setItem('myBusinessId', id);
          console.log('myBusinessId fetched from API:', id);
        } else {
          throw new Error('No business ID in response');
        }
      } catch (err) {
        console.error('Error fetching my business id:', err);
        setError('✖ לא ניתן לקבל מזהה עסק. בדוק API ו־token.');
      } finally {
        setLoading(false);
      }
    }

    fetchMyBusiness();
  }, [token]);

  if (loading) {
    return <p>טוען פרטי העסק…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // 3. במידה ואין ID גם אחרי הכל, הצג הודעה
  if (!myBusinessId) {
    return (
      <p style={{ color: 'red' }}>
        ✖ לא קיבלתי מזהה עסק תקין. ודא שהפרופיל העסקי קיים.
      </p>
    );
  }

  // 4. כל השאר – רינדור הצ'אט
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
