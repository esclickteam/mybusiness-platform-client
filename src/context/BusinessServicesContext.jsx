// BusinessServicesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const BusinessServicesContext = createContext();

export const BusinessServicesProvider = ({ children }) => {
  const [services, setServices] = useState(() => {
    const stored = localStorage.getItem('business-services');
    return stored ? JSON.parse(stored) : [];
  });

  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('business-products');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('business-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('business-products', JSON.stringify(products));
  }, [products]);

  return (
    <BusinessServicesContext.Provider value={{ services, setServices, products, setProducts }}>
      {children}
    </BusinessServicesContext.Provider>
  );
};

export const useBusinessServices = () => {
  const context = useContext(BusinessServicesContext);
  if (!context) {
    throw new Error('useBusinessServices must be used within a BusinessServicesProvider');
  }
  return context;
};
