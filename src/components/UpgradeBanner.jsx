import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpgradeBanner() {
  const navigate = useNavigate();
  return (
    <div className="mt-6 p-4 bg-yellow-100 border border-yellow-500 rounded text-center">
      <p>This feature is included only in advanced plans.</p>
      <button
        onClick={() => navigate('/subscription-plans')}
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Upgrade Now
      </button>
    </div>
  );
}
