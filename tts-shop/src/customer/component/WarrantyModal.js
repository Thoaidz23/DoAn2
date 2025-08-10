import React, { useState } from 'react';
import '../styles/WarrantyModal.scss';

const WarrantyModal = ({ show, onClose, onSubmit, productName = "", defaultPhone = "" }) => {
  const [issue, setIssue] = useState('');
  const [phone, setPhone] = useState(defaultPhone);
  const [errors, setErrors] = useState({ issue: '', phone: '' });

  const handleSubmit = () => {
    let valid = true;
    const newErrors = { issue: '', phone: '' };

    if (issue.trim().length < 10) {
      newErrors.issue = 'Vui lòng mô tả vấn đề ít nhất 10 ký tự';
      valid = false;
    }

    if (!phone.match(/^0\d{9}$/)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      onSubmit({ issue, phone });
    }
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
          {errors.phone && <p className="error-message_md">{errors.phone}</p>}

          <label>Mô tả vấn đề:</label>
          <textarea
            rows={4}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Mô tả lỗi/vấn đề cần bảo hành"
          />
          {errors.issue && <p className="error-message_md">{errors.issue}</p>}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>GỬI YÊU CẦU</button>
      </div>
    </div>
  );
};

export default WarrantyModal;
