import React, { useState } from 'react';
import '../styles/WarrantyModal.scss';

const WarrantyModal = ({ show, onClose, onSubmit, productName = "", defaultPhone = "" }) => {
  const [issue, setIssue] = useState('');
  const [phone, setPhone] = useState(defaultPhone);

  const handleSubmit = () => {
    if (issue.trim().length < 10) {
      alert('Vui lòng mô tả vấn đề ít nhất 10 ký tự');
      return;
    }
    if (!phone.match(/^0\d{9}$/)) {
      alert('Số điện thoại không hợp lệ');
      return;
    }
    onSubmit({ issue, phone });
  };

  if (!show) return null;

  return (
    <div className="warranty-modal-overlay">
      <div className="warranty-modal">
        <div className="modal-header">
          <h3>Yêu cầu bảo hành</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>

        <p><strong>Sản phẩm:</strong> {productName}</p>

        <div className="modal-body">
          <label>Số điện thoại liên lạc:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập SĐT của bạn"
          />

          <label>Mô tả vấn đề:</label>
          <textarea
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Mô tả lỗi/vấn đề cần bảo hành"
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit}>GỬI YÊU CẦU</button>
      </div>
    </div>
  );
};

export default WarrantyModal;
