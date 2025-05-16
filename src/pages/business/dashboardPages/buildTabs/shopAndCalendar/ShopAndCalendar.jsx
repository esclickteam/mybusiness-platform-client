import React, { useEffect } from 'react';
import '../../build/Build.css';
import './ShopAndCalendar.css';

import AppointmentsMain from './Appointments/AppointmentsMain';
import { useBusinessServices } from '@context/BusinessServicesContext';

export default function ShopAndCalendar({
  isPreview = false,
  workHours = {},
  setWorkHours = () => {},
  setBusinessDetails
}) {
  const { services, setServices } = useBusinessServices();
  const safeServices = Array.isArray(services) ? services : [];

  // סנכרון services ל-Build
  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails(prev => ({
        ...prev,
        services: safeServices
      }));
    }
  }, [safeServices, isPreview, setBusinessDetails]);

  // תמיד רנדר יומן בלבד
  return (
    <div className={`shop-calendar-wrapper ${isPreview ? 'preview-mode' : ''}`}>     
      <AppointmentsMain
        isPreview={isPreview}
        services={safeServices}
        setServices={setServices}
        workHours={
          isPreview
            ? JSON.parse(localStorage.getItem('demoWorkHours') || '{}')
            : workHours
        }
        setWorkHours={
          isPreview
            ? hours => localStorage.setItem('demoWorkHours', JSON.stringify(hours))
            : setWorkHours
        }
        setBusinessDetails={setBusinessDetails}
      />
    </div>
  );
}
