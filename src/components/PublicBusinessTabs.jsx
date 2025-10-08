import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './PublicBusinessTabs.css';

const TABS = [
  { to: '',        label: 'Home' },
  { to: 'gallery', label: 'Gallery' },
  { to: 'reviews', label: 'Reviews' },
  { to: 'faq',     label: 'Questions and Answers' },
  { to: 'chat',    label: 'Chat with the business' },
  { to: 'shop',    label: 'Diary' }, // changed to "Diary"
];

export default function PublicBusinessTabs() {
  const { businessId } = useParams();

  return (
    <nav className="public-tabs">
      {TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          relative="path"
          end={to === ''}
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}