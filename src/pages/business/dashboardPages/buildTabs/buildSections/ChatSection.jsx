import React from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "./ChatSection.module.css";


export default function ChatButton({ previewContent, renderTopBar }) {
  const { businessId } = useParams();

  if (!businessId) return null;

  return (
    <>
      <div className="form-column">
        <div className="edit-link-button-container">
          <NavLink
            to={`/business/${businessId}/dashboard/chat`}
            className="edit-link-button"
          >
            צ'אט עם לקוחות
          </NavLink>
        </div>
      </div>

      <div className="preview-column">
        {renderTopBar && renderTopBar()}
        {previewContent}
      </div>
    </>
  );
}
