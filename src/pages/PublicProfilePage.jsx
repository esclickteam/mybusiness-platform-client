import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import BusinessProfileView from "../components/shared/BusinessProfileView";

export default function PublicProfilePage() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    API.get(`/business/${businessId}`)
       .then(({ data }) => setBusiness(data.business || data))
       .catch(console.error);
  }, [businessId]);

  if (!business) return <p>🔄 טוען פרופיל העסק…</p>;

  return (
    <div className="public-profile-container">
      <BusinessProfileView
        profileData={business}
        profileImage={business.logo}
        canChat={false}
        canSchedule={false}
      />
    </div>
  );
}
