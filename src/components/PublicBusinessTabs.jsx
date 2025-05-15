import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './PublicBusinessTabs.css';

const TABS = [
  { to: '',        label: 'ראשי' },
  { to: 'gallery', label: 'גלריה' },
  { to: 'reviews', label: 'ביקורות' },
  { to: 'faq',     label: 'שאלות ותשובות' },
  { to: 'chat',    label: 'צ\'אט עם העסק' },
  { to: 'shop',    label: 'יומן' }, // שונה ל"יומן"
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
