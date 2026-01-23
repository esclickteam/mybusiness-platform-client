import React, { useEffect } from 'react'; 
import '../../build/Build.css';
import './ShopAndCalendar.css';

import { useBusinessServices } from '@context/BusinessServicesContext';
import { NavLink, useParams } from 'react-router-dom';

export default function ShopAndCalendar({
  isPreview = false,
  workHours = {},
  setWorkHours = () => {},
  setBusinessDetails
}) {
  const { services, setServices } = useBusinessServices();
  const safeServices = Array.isArray(services) ? services : [];
  const { businessId } = useParams();

  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails(prev => ({
        ...prev,
        services: safeServices
      }));
    }
  }, [safeServices, isPreview, setBusinessDetails]);

  if (!businessId) return null; // Prevents errors if no business ID

  return (
    <div className={`shop-calendar-wrapper ${isPreview ? 'preview-mode' : ''}`}>
      {!isPreview && (
        <div className="edit-links-container">
          <NavLink to={`/business/${businessId}/dashboard/crm/work-hours`} className="edit-link-button">
            Edit Work Hours
          </NavLink>
          <NavLink to={`/business/${businessId}/dashboard/crm/services`} className="edit-link-button">
            Edit Services
          </NavLink>
        </div>
      )}
    </div>
  );
}
