import React from "react";
import { NavLink, useParams } from "react-router-dom";
import styles from "./ChatSection.module.css";

export default function ChatButton({ previewContent, renderTopBar }) {
  const { businessId } = useParams();

  if (!businessId) return null;

  return (
    <>
      <div className="form-column">
        <div className={styles["edit-link-button-container"]}>
          <NavLink
            to={`/business/${businessId}/dashboard/messages`}
            className={({ isActive }) =>
              isActive
                ? `${styles["edit-link-button"]} ${styles.active}`
                : styles["edit-link-button"]
            }
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
