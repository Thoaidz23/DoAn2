import React from "react";
import "../styles/MessageBox.scss";

const MessageBox = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`message-box ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}></button>
    </div>
  );
};

export default MessageBox;
