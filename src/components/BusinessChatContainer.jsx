// src/components/BusinessChatContainer.jsx
import React, { useEffect, useState } from 'react';
import API from '../api'; // Make sure this API points to the correct baseURL
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
    // 1. Try to fetch from localStorage first
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
        // Based on your response structure:
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

  // 3. If no ID even after all checks, show message
  if (!myBusinessId) {
    return (
      <p style={{ color: 'red' }}>
        ✖ No valid business ID received. Please ensure the business profile exists.
      </p>
    );
  }

  // 4. Otherwise — render the chat
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
