import React, { useEffect } from 'react';
import '../../build/Build.css';
import './ShopAndCalendar.css';

import { useBusinessServices } from '@context/BusinessServicesContext';
import { NavLink } from 'react-router-dom';

export default function ShopAndCalendar({
  isPreview = false,
  isEditMode = false, // פרופ חדש למצב עריכה
  workHours = {},
  setWorkHours = () => {},
  setBusinessDetails
}) {
  const { services, setServices } = useBusinessServices();
  const safeServices = Array.isArray(services) ? services : [];

  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails(prev => ({
        ...prev,
        services: safeServices
      }));
    }
  }, [safeServices, isPreview, setBusinessDetails]);

  return (
    <div className={`shop-calendar-wrapper ${isPreview ? 'preview-mode' : ''}`}>
      {isEditMode && (
        <div className="edit-links-container">
          <NavLink to="/crm/work-hours" className="edit-link-button">
            עריכת שעות פעילות
          </NavLink>
          <NavLink to="/crm/services" className="edit-link-button">
            עריכת שירותים
          </NavLink>
        </div>
      )}
    </div>
  );
}
