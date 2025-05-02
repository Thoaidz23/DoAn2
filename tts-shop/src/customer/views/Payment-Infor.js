import React, { useState } from "react";
import "../styles/payment-infor.scss";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const PaymentInfor = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleCheckout = () => {
    if (!selectedPayment) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    // Điều hướng tùy theo phương thức thanh toán
    if (selectedPayment === "momo") {
      navigate("/Payment-momo");  // Điều hướng đến trang MoMo
    } else if (selectedPayment === "bank") {
      navigate("/Payment-Bank");  // Điều hướng đến trang Payment-Bank
    } else if (selectedPayment === "cod") {
      alert("Thanh toán thành công bằng COD");
    }
  };

  return (
    <div className="payment-infor">
      <div className="container-infor">
        <div className="title-row">
          <IoArrowBack className="back-icon" onClick={() => window.history.back()} />
          <h1 className="title">Thông Tin</h1>
        </div>
        <div className="title-underline"></div>

        {/* Sản phẩm */}
        <div className="info-card">
          <div className="product-section">
            <img
              src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
              alt="Huawei Watch D2"
              className="product-img"
            />
            <div className="product-details">
              <h3 className="product-name">Đồng hồ thông minh Huawei Watch D2</h3>
              <p className="price">
                8.280.000<sup>đ</sup>
              </p>
            </div>
            <p className="quantity">
              Số lượng: <span>1</span>
            </p>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <h2 className="section-title section-header">THÔNG TIN KHÁCH HÀNG</h2>
        <div className="info-card">
          <div className="customer-section">
            <div>
              <p>Trần Minh Thoại</p>
              <p>Email: mthoai733@gmail.com</p>
              <p>Địa chỉ : Bạc Liêu</p>
            </div>
            <div className="right-align">
              <p>0977031264</p>
              <span
                className="edit-icon"
                onClick={() => navigate('/Home.js')}>✎</span>
            </div>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <h2 className="section-title section-header">PHƯƠNG THỨC THANH TOÁN</h2>
        <div className="info-card payment-options">
          <div className={`payment-option ${selectedPayment === "cod" ? "active" : ""}`}
            onClick={() => setSelectedPayment("cod")}>
            <img
              src="https://th.bing.com/th/id/OIP.pr3kU9TsrcMbdI4tjJ8SDQAAAA?w=157&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
              alt="COD Icon"
              className="payment-icon cod-img"
            />
            <p>Thanh toán khi nhận hàng</p>
          </div>

          <div className={`payment-option ${selectedPayment === "momo" ? "active" : ""}`}
            onClick={() => setSelectedPayment("momo")}>
            <img
              src="https://th.bing.com/th/id/OIP.-DhgkiQDEdoru7CJdZrwEAHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2"
              alt="MoMo Logo"
              className="payment-icon momo-img"
            />
            <p>Ví MoMo</p>
          </div>

          <div className={`payment-option ${selectedPayment === "bank" ? "active" : ""}`}
            onClick={() => setSelectedPayment("bank")}>
            <img
              src="https://tse4.mm.bing.net/th?id=OIP.GS7EznS-5gn-0FkuODh5SQHaHa&pid=ImgDet&w=206&h=206&c=7"
              alt="QR Logo"
              className="payment-icon qr-img"
            />
            <p>Chuyển khoản ngân hàng</p>
          </div>
        </div>

        {/* Thanh toán */}
        <div className="checkout-summary">
          <p className="subtotal">
            <strong>Tạm tính:</strong> <span className="price">8.280.000<sup>đ</sup></span>
          </p>
          <button className="checkout-button" onClick={handleCheckout}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfor;
