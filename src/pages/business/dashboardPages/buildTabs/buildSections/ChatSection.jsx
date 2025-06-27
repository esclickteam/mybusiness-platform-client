import React from "react";
import { NavLink, useParams } from "react-router-dom";

export default function ChatButton() {
  const { businessId } = useParams();

  if (!businessId) return null;

  return (
    <div>
      <NavLink
        to={`/business/${businessId}/dashboard/chat`}
        className="edit-link-button"
      >
        צ'אט עם לקוחות
      </NavLink>
    </div>
  );
}
