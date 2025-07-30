import React from 'react';
import '../styles/RefundModal.scss';

const RefundModal = ({ show, onClose, onSubmit,code_order =""}) => {
  if (!show) return null;

  return (
    <div className="refund-modal-overlay">
      <div className="refund-modal">
        <div className="modal-header">
          <h3>Xác nhận hoàn tiền</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>

        <p><strong>Bạn có chắc muốn hoàn tiền đơn hàng:</strong> <br /><span style={{ color: "red" }}>{code_order}</span>?</p>

        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onSubmit}>XÁC NHẬN</button>
          <button className="cancel-btn" onClick={onClose}>HỦY</button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
