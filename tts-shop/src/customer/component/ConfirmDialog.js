// ConfirmDialog.jsx
import React from "react";
import "../styles/confirmDialog.scss";

const ConfirmDialog = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>Không đồng ý</button>
          <button className="btn-confirm" onClick={onConfirm}>Đồng ý</button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
