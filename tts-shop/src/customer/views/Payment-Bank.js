import React, { useEffect, useState } from 'react';
import '../styles/payment-bank.scss';
import Qrvcb from '../assets/img/Qrvcb.jpg'; // Thêm dòng này ở đầu file
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentBank = () => {
  const [minutes, setMinutes] = useState(59);
  const [seconds, setSeconds] = useState(59);

    const navigate = useNavigate();
    const location = useLocation();
    const { payload } = location.state || {}; // Lấy payload từ location
     const [errorMessage, setErrorMessage] = useState("");
    
    useEffect(() => {
  if (errorMessage && errorMessage !== "Thanh toán thành công qua Vietcombank!") {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [errorMessage]);


    const generateCodeOrder = () => {
        const letters = Array.from({ length: 4 }, () =>
          String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join('');
        const numbers = Math.floor(1000 + Math.random() * 9000);
        return letters + numbers;
      };
      const [code] = useState(generateCodeOrder());

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
 const handleHistory = async () => {
  if (!payload) {
    setErrorMessage("Không có dữ liệu đơn hàng!");
    return;
  }

  try {
    const vcbPayload = {
      ...payload,
      method: 2,
      code_order: code,
    };

    const res = await axios.post("http://localhost:5000/api/pay/addpay", vcbPayload);
    setErrorMessage("Thanh toán thành công qua Vietcombank!");
    
    // ⏳ Chờ 3 giây trước khi chuyển trang
    setTimeout(() => {
      navigate("/PurchaseHistory");
    }, 3000);
    
  } catch (error) {
    console.error("Lỗi khi gửi đơn hàng:", error);
    setErrorMessage("Gửi đơn hàng thất bại!");
  }
};


  return (
    <div>
     <div className="header-bank">
       {errorMessage && (
    <div className="notification-bank">
      {errorMessage}
    </div>
  )}

  <div className="header-bank__logo"></div>
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
      <div className="order-info-bank">
      <h3>Thông tin đơn hàng</h3>
        <div className="row-bank">
          <strong>Nhà cung cấp</strong> <span>TTS SHOP</span>
        </div>
        <div className="row-bank">
          <strong>Mã đơn hàng <span style={{fontWeight:"100",color:"red"}}>(Vui lòng nhập mã đơn hàng vào lời nhắn)</span></strong> <span>{code}</span>
        </div>
        <div className="row-bank price-row-bank">
        <strong>Số tiền <span style={{fontWeight:"100",color:"red",fontSize:"14px"}}>(Vui lòng nhập đúng giá tiền)</span></strong> 
                <span className="price">
                  {payload?.products?.reduce((sum, item) => sum + item.price * item.quantity, 0)?.toLocaleString()}đ
                </span>
        </div>
      </div>

      <div className="countdown-bank">
        <div className="label-bank">Đơn hàng sẽ hết hạn sau:</div>
        <div className="time-box-bank">
        <div><div className="unit-mm">{minutes.toString().padStart(2, '0')}</div><div>Phút</div></div>
        <div><div className="unit-mm">{seconds.toString().padStart(2, '0')}</div><div>Giây</div></div>
        </div>
      </div>

      <div className="back-button-bank">
        <button onClick={handleBack}>Quay về</button>
      </div>
      <div className="back-button-mm">
        <button onClick={handleHistory}>Đã thanh toán</button>
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
