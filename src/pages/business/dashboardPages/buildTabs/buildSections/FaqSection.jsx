import React from "react";
import FaqTab from "../buildTabs/FaqTab";

export default function FaqSection({
  faqs,
  setFaqs,
  currentUser,
  renderTopBar
}) {
  return (
    <>
      <div className="form-column">
        <FaqTab faqs={faqs} setFaqs={setFaqs} currentUser={currentUser} isPreview={false} />
      </div>
      <div className="preview-column">
        {renderTopBar()}
        <FaqTab faqs={faqs} setFaqs={setFaqs} currentUser={currentUser} isPreview />
      </div>
    </>
  );
}
