import React, { useEffect, useState } from 'react';
import '../styles/payment-momo.scss';
import QRmomo from '../assets/img/Qrmomo.jpg'; // Thêm dòng này ở đầu file

const Paymentmomo = () => {
  const [minutes, setMinutes] = useState(59);
  const [seconds, setSeconds] = useState(59);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prev => prev - 1);
      } else {
        if (minutes === 0) {
          clearInterval(timer);
        } else {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div>
     <div className="header-momo">
  <div className="header-momo__logo">
    <img 
      src="https://th.bing.com/th/id/OIP.-DhgkiQDEdoru7CJdZrwEAHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2" 
      alt="logo"
    />
    <span>Cổng thanh toán Momo</span>
  </div>
</div>
<div className="container-momo">
  <div className="payment-momo-wrapper">
    {/* Thông tin đơn hàng */}
    <div className="payment-momo-box">
      <h3>Thông tin đơn hàng</h3>
      <div className="order-info-momo">
        <div className="row-momo">
          <strong>Nhà cung cấp:</strong> <span>TTS SHOP</span>
        </div>
        <div className="row-momo">
          <strong>Mã đơn hàng:</strong> <span>302793411</span>
        </div>
        <div className="row-momo price-row">
          <strong>Số tiền:</strong> <span className="price">189.000đ</span>
        </div>
      </div>

      <div className="countdown">
        <div className="label-momo">Đơn hàng sẽ hết hạn sau:</div>
        <div className="time-box-momo">
          <div>
            <div className="unit-mm">{minutes.toString().padStart(2, '0')}</div>
            <div>Phút</div>
          </div>
          <div>
            <div className="unit-mm">{seconds.toString().padStart(2, '0')}</div>
            <div>Giây</div>
          </div>
        </div>
      </div>

      <div className="back-button-mm">
        <button onClick={handleBack}>Quay về</button>
      </div>
    </div>

    {/* QR code */}
    <div className="content-momo">
      <div className="momo-qr-wrapper">
        <h4>Quét mã QR để thanh toán</h4>
        <div className="momo-qr-box">
          <img src={QRmomo} alt="QR MoMo" />
        </div>
        <div className="momo-instruction">
          <p>
            📱 Sử dụng <strong>App MoMo</strong> hoặc ứng dụng camera hỗ trợ QR code để quét mã
          </p>
          <p>
            Gặp khó khăn khi thanh toán? <a href="#">Xem Hướng dẫn</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  </div>
  );
};

export default Paymentmomo;
