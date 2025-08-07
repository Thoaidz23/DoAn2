import React from 'react';
import '../styles/RefundModal.scss';

const RefundModal = ({ show, onClose, onSubmit, code_order = "", loading = false }) => {
  if (!show) return null;

  return (
    <div className="refund-modal-overlay">
      <div className="refund-modal">
        <div className="modal-header">
          <h3>Xác nhận hoàn tiền</h3>
          <button className="close-modal" onClick={onClose} disabled={loading}>×</button>
        </div>

        <p><strong>Bạn có chắc muốn hoàn tiền đơn hàng:</strong> <br /><span style={{ color: "red" }}>{code_order}</span>?</p>
        <p>Đơn hành chuyển thành thanh toán khi nhận hàng</p>

        <div className="modal-buttons">
          <button
            className="confirm-btn"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "XÁC NHẬN"
            )}
          </button>
          <button className="cancel-btn" onClick={onClose} disabled={loading}>HỦY</button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
