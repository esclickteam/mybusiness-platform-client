```javascript
// src/components/BusinessChatContainer.jsx
import React, { useEffect, useState } from 'react';
import API from '../api'; // Make sure this API is pointed to the correct baseURL
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
    // 1. First, try to retrieve from localStorage
    const storedDetails = JSON.parse(localStorage.getItem('businessDetails') || '{}');
    if (storedDetails._id) {
      setMyBusinessId(storedDetails._id);
      localStorage.setItem('myBusinessId', storedDetails._id);
      setLoading(false);
      console.log('myBusinessId from localStorage:', storedDetails._id);
      return;
    }

    // 2. If not found in localStorage, call the API
    async function fetchMyBusiness() {
      try {
        const res = await API.get('/business/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Depending on your response structure:
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
        setError('✖ Unable to retrieve business ID. Check API and token.');
      } finally {
        setLoading(false);
      }
    }

    fetchMyBusiness();
  }, [token]);

  if (loading) {
    return <p>Loading business details…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // 3. If there is no ID after all, display a message
  if (!myBusinessId) {
    return (
      <p style={{ color: 'red' }}>
        ✖ I did not receive a valid business ID. Ensure the business profile exists.
      </p>
    );
  }

  // 4. Everything else – render the chat
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
```