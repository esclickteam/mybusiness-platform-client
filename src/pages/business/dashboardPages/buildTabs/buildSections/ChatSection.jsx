import React from "react";
import ChatTab from "../buildTabs/ChatTab";

export default function ChatSection({
  businessDetails,
  setBusinessDetails,
  renderTopBar
}) {
  return (
    <>
      <div className="form-column">
        <ChatTab
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          isPreview={false}
        />
      </div>
      <div className="preview-column">
        {renderTopBar()}
        <ChatTab
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          isPreview
        />
      </div>
    </>
  );
}
