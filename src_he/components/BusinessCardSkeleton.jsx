// src/components/BusinessCardSkeleton.jsx
import React from 'react';
import './BusinessCardSkeleton.css';


export default function BusinessCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  );
}
