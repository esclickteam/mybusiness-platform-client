import React, { useEffect } from "react";
import "../../build/Build.css";
import "./ShopAndCalendar.css";

import { useBusinessServices } from "@context/BusinessServicesContext";
import { NavLink, useParams } from "react-router-dom";

export default function ShopAndCalendar({
  isPreview = false,
  setBusinessDetails,
  renderTopBar,
}) {
  const { services } = useBusinessServices();
  const safeServices = Array.isArray(services) ? services : [];
  const { businessId } = useParams();

  useEffect(() => {
    if (!isPreview && setBusinessDetails) {
      setBusinessDetails((prev) => ({
        ...prev,
        services: safeServices,
      }));
    }
  }, [safeServices, isPreview, setBusinessDetails]);

  if (!businessId) return null;

  return (
    <div className="build-wrapper">
      {/* =========================
         RIGHT – PREVIEW CARD
      ========================= */}
      <div className="preview-column">
        {renderTopBar?.()}

        <h3 className="section-title">Services & Availability</h3>

        <div className="shop-preview">
          {safeServices.length > 0 ? (
            safeServices.map((service) => (
              <div key={service._id} className="service-preview-item">
                <span className="service-name">{service.name}</span>
                {service.price && (
                  <span className="service-price">${service.price}</span>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No services added yet</p>
          )}
        </div>
      </div>

      {/* =========================
         LEFT – EDIT / SETTINGS
      ========================= */}
      <div className="form-column">
        <h3 className="section-title">Manage Services & Calendar</h3>

        {!isPreview && (
          <div className="edit-links-container">
            <NavLink
              to={`/business/${businessId}/dashboard/crm/work-hours`}
              className="edit-link-button"
            >
              Edit Work Hours
            </NavLink>

            <NavLink
              to={`/business/${businessId}/dashboard/crm/services`}
              className="edit-link-button"
            >
              Edit Services
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
