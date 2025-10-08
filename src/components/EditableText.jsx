import React, { useState } from "react";
import "./EditableText.css";

function EditableText({ text, onSave, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onSave(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isAdmin) return <span>{text}</span>;

  return (
    <div className="editable-text">
      {isEditing ? (
        <div className="edit-box">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={handleSave}>💾 שמור</button>
        </div>
      ) : (
        <span onClick={() => setIsEditing(true)} className="editable-span">
          {text} <span className="edit-icon">✏️</span>
        </span>
      )}
      {saved && <span className="saved-message">✅ נשמר</span>}
    </div>
  );
}

export default EditableText;