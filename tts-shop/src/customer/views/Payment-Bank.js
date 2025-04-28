import React, { useEffect, useState } from 'react';
import '../styles/payment-bank.scss';
import Qrvcb from '../assets/img/Qrvcb.jpg'; // Thêm dòng này ở đầu file

const PaymentBank = () => {
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
     <div className="header-bank">
  <div className="header-bank__logo">
    <img 
      src="https://th.bing.com/th/id/OIP.6rGzO2j2Dy_7dotwoZCvPgHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2" 
      alt="logo"
    />
    <span>Cổng thanh toán ngân hàng</span>
  </div>
</div>
<div className="container-bank">
  <div className="payment-bank-wrapper">
    {/* Thông tin đơn hàng */}
    <div className="payment-bank-box">
      <h3>Thông tin đơn hàng</h3>
      <div className="order-info-bank">
        <div className="row-bank">
          <strong>Nhà cung cấp:</strong> <span>TTS SHOP</span>
        </div>
        <div className="row-bank">
          <strong>Mã đơn hàng:</strong> <span>302793411</span>
        </div>
        <div className="row-bank price-row-bank">
          <strong>Số tiền:</strong> <span className="price">189.000đ</span>
        </div>
      </div>

      <div className="countdown-bank">
        <div className="label-bank">Đơn hàng sẽ hết hạn sau:</div>
        <div className="time-box-bank">
          <div>
            <div className="unit-bank">{minutes.toString().padStart(2, '0')}</div>
            <div>Phút</div>
          </div>
          <div>
            <div className="unit-bank">{seconds.toString().padStart(2, '0')}</div>
            <div>Giây</div>
          </div>
        </div>
      </div>

      <div className="back-button-bank">
        <button onClick={handleBack}>Quay về</button>
      </div>
    </div>

    {/* QR code */}
    <div className="content-bank">
      <div className="bank-qr-wrapper">
        <h4>Quét mã QR để thanh toán</h4>
        <div className="bank-qr-box">
          <img src={Qrvcb} alt="QR vcb" />
        </div>
        <div className="bank-instruction">
          <p>
            📱 Sử dụng <strong>App Vietcombank</strong> hoặc ứng dụng camera hỗ trợ QR code để quét mã
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

export default PaymentBank;
