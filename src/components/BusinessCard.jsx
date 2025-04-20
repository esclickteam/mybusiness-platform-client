import React from 'react';

export default function BusinessCard({ business }) {
  return (
    <div className="border rounded-xl p-4 shadow">
      <h3 className="font-bold text-lg">{business.name}</h3>
      <p className="text-gray-600">{business.industry}</p>
      <p className="text-sm">{business.city}</p>
    </div>
  );
}
