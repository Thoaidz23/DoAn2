import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "../styles/payment-infor.scss";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaExclamationTriangle } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentInfor = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempPhone, setTempPhone] = useState("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);

 useEffect(() => {
  const fetchExchangeRate = async () => {
    const cachedRate = localStorage.getItem("usdVndRate");
    const cachedTime = localStorage.getItem("usdVndRateTime");
    const now = Date.now();

    // Dùng cache nếu còn hạn (6 tiếng)
    if (cachedRate && cachedTime && now - cachedTime < 6 * 60 * 60 * 1000) {
      setExchangeRate(parseFloat(cachedRate));
      console.log("✅ Dùng tỷ giá từ cache:", cachedRate);
      return;
    }

    try {
      const res = await axios.get("https://api.frankfurter.app/latest", {
        params: {
          from: "USD",
          to: "VND",
        },
      });

      const usdToVnd = res.data.rates?.VND;
      const vndToUsd = 1 / usdToVnd;

      // Lưu vào localStorage
      localStorage.setItem("usdVndRate", vndToUsd);
      localStorage.setItem("usdVndRateTime", now.toString());

      setExchangeRate(vndToUsd);
      console.log("📡 Frankfurter API tỷ giá:", vndToUsd);
    } catch (err) {
      console.error("❌ Lỗi gọi Frankfurter API:", err);
      const fallback = 1 / 25000;
      setExchangeRate(fallback);
    }
  };

  fetchExchangeRate();
}, []);
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payment/${user.id}`);
        setCartItems(res.data.product);
        setTempAddress(res.data.address);
        setTempPhone(res.data.phone);
      } catch (err) {
        console.error("Lỗi khi lấy giỏ hàng:", err);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/account/${user.id}`);
        setUserInfo(userResponse.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchCartData();
    fetchUserInfo();
    setLoading(false);
  }, [user]);

  const totalPrice = cartItems.reduce((sum, item) => sum + Math.round(item.saleprice) * item.quantity, 0);

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handleAddToPay = async () => {
    if (selectedPayment === null) {
      setErrorMessage("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (!user || cartItems.length === 0 || !userInfo) return;

    const payload = {
      email: user.email,
      id_user: user.id,
      name_user: userInfo.name,
      address: tempAddress || userInfo.address,
      phone: tempPhone || userInfo.phone,
      method: selectedPayment,
      products: cartItems.map(item => ({
        id_product: item.id_product,
        quantity: item.quantity,
        price: Math.round(item.saleprice),
        id_group_product: item.id_group_product,
        name_group_product: item.name_group_product,
        image: item.image,
      })),
    };

    try {
      if (selectedPayment === 0) {
        await axios.post("http://localhost:5000/api/pay/addpay", payload);
        navigate("/PurchaseHistory");
     } else if (selectedPayment === 1) {
  try {
    const res = await axios.post("http://localhost:5000/api/pay/generate-order-code", {
  id_user: user.id,
});
const code_order = res.data.code_order;

const momoRes = await axios.post("http://localhost:5000/api/momo/create-payment-url", {
  code_order,
  amount: totalPrice,
  orderInfo: "Thanh toán MoMo đơn hàng",
  paymentCode: "mã paymentCode MoMo người dùng", // <== Bắt buộc
  userData: {
    email: user.email,
    id_user: user.id,
    name_user: userInfo.name,
    address: tempAddress || userInfo.address,
    phone: tempPhone || userInfo.phone,
    method: 1,
    paystatus: 1,
    products: cartItems.map(item => ({
      id_product: item.id_product,
      quantity: item.quantity,
      price: Math.round(item.saleprice),
      id_group_product: item.id_group_product,
      name_group_product: item.name_group_product,
      image: item.image,
    }))
  }
});

if (momoRes.data.payUrl) {
  window.location.href = momoRes.data.payUrl;
} else if (momoRes.data.deeplink) {
  window.location.href = momoRes.data.deeplink;
} else if (momoRes.data.qrCodeUrl) {
  // Trường hợp không dùng redirect, có thể hiển thị QR code
  window.open(momoRes.data.qrCodeUrl, "_blank");
} else {
  setErrorMessage("Không thể mở trang thanh toán MoMo.");
}


  } catch (err) {
    console.error("Lỗi khi tạo đơn MoMo:", err);
    setErrorMessage("Thanh toán MoMo thất bại.");
  }
}


else if (selectedPayment === 2) {
        try {
          const res = await axios.post("http://localhost:5000/api/pay/addpay", payload);
          const orderId = res.data.code_order;
          const paymentRes = await axios.post("http://localhost:5000/api/vnpay/create-payment-url", {
            amount: totalPrice,
            orderId,
            orderDesc: `Thanh toan don hang cho nguoi dung ${user.email}`,
            bankCode: "",
            language: "vn",
          });

          const { paymentUrl } = paymentRes.data;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            setErrorMessage("Không thể tạo link thanh toán VNPay.");
          }
        } catch (error) {
          console.error("Lỗi khi thanh toán VNPay:", error);
          setErrorMessage("Thanh toán thất bại.");
        }
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào đơn hàng:", err);
      setErrorMessage("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!");
    }
  };

  return (
    <div className="payment-infor">
      {errorMessage && (
        <p className="error-message">
          <FaExclamationTriangle className="warning-icon" />
          {errorMessage}
        </p>
      )}

      <div className="container-infor">
        <div className="title-row">
          <IoArrowBack className="back-icon" onClick={() => window.history.back()} />
          <h1 className="title">Thông Tin</h1>
        </div>
        <div className="title-underline"></div>

        {loading ? (
          <h3>Đang tải giỏ hàng...</h3>
        ) : cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div className="info-card" key={item.id_product}>
              <div className="product-section">
                <img
                  src={`http://localhost:5000/images/product/${item.image}`}
                  alt={item.name_product}
                  className="product-img"
                />
                <div className="product-details">
                  <h3 className="product-name">{item.name_group_product}</h3>
                  <p className="price">{Math.round(item.saleprice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup></p>
                </div>
                <p className="quantity">Số lượng: <span>{item.quantity}</span></p>
              </div>
            </div>
          ))
        ) : (
          <p>Giỏ hàng trống</p>
        )}

        {userInfo && (
          <>
            <h2 className="section-title section-header">THÔNG TIN KHÁCH HÀNG</h2>
            <div className="info-card">
              <div className="customer-section">
                <div>
                  <p>{userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                  <p>
                    Địa chỉ: {
                      isEditingAddress ? (
                        <input
                          type="text"
                          value={tempAddress}
                          onChange={(e) => setTempAddress(e.target.value)}
                          className="edit-address-input"
                          style={{ width: "200%" }}
                        />
                      ) : (
                        tempAddress || userInfo.address
                      )
                    }
                    <span className="edit-icon" onClick={() => setIsEditingAddress(prev => !prev)} style={{ top: "44%" }}>
                      {isEditingAddress ? "✔" : "✎"}
                    </span>
                  </p>
                  <p>
                    Số điện thoại: {
                      isEditingPhone ? (
                        <input
                          type="text"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="edit-address-input"
                        />
                      ) : (
                        tempPhone || userInfo.phone
                      )
                    }
                    <span className="edit-icon" onClick={() => setIsEditingPhone(prev => !prev)}>
                      {isEditingPhone ? "✔" : "✎"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <h2 className="section-title section-header">PHƯƠNG THỨC THANH TOÁN</h2>
        <div className="info-card payment-options">
          {totalPrice < 10000000 && (
            <div className={`payment-option ${selectedPayment === 0 ? "active" : ""}`} onClick={() => handlePaymentSelect(0)}>
              <img
                src="https://th.bing.com/th/id/OIP.pr3kU9TsrcMbdI4tjJ8SDQAAAA?w=157&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
                alt="COD Icon"
                className="payment-icon cod-img"
              />
              <p>Thanh toán khi nhận hàng</p>
            </div>
          )}

          <div className={`payment-option ${selectedPayment === 1 ? "active" : ""}`} onClick={() => handlePaymentSelect(1)}>
            <img
              src="https://th.bing.com/th/id/OIP.-DhgkiQDEdoru7CJdZrwEAHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2"
              alt="MoMo Logo"
              className="payment-icon momo-img"
            />
            <p>Ví MoMo</p>
          </div>

      
          <div className={`payment-option ${selectedPayment === 3 ? "active" : ""}`} onClick={() => handlePaymentSelect(3)}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
              alt="PayPal"
              className="payment-icon paypal-img"
              style={{ height: "40px", width: "40px" }}
            />
            <p>PayPal</p>
          </div>
        </div>

        <div className="checkout-summary">
          <p className="subtotal">
            <strong>Tạm tính:</strong> <span className="price">{Math.round(totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup></span>
          </p>

          {selectedPayment === 3 ? (
            <PayPalScriptProvider options={{ "client-id": "Af5lqsQmtCOeP8wS_2L5VTg3wMliyzbvnakxrNTy2U--aVBB938BjRc-Hvq3OOSZPyRMhD4e74v5qPu3", currency: "USD" }}>
  <PayPalButtons
    className="checkout-button"
    style={{ layout: "vertical" }}
    createOrder={(data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: (totalPrice * exchangeRate).toFixed(2) // USD
          },
        }],
      });
    }}
   onApprove={async (data, actions) => {
  const details = await actions.order.capture();
  alert(`Thanh toán PayPal thành công bởi ${details.payer.name.given_name}`);

  try {
    // 👉 Tạo code_order trước
    const codeRes = await axios.post("http://localhost:5000/api/pay/generate-order-code", {
      id_user: user.id,
    });
    const code_order = codeRes.data.code_order;

    // 👉 Chuẩn bị payload đầy đủ
    const payload = {
      email: user.email,
      id_user: user.id,
      name_user: userInfo.name,
      address: tempAddress || userInfo.address,
      phone: tempPhone || userInfo.phone,
      method: 3,
      paystatus: 1,
      code_order, // ✅ thêm dòng này
      products: cartItems.map(item => ({
        id_product: item.id_product,
        quantity: item.quantity,
        price: Math.round(item.saleprice),
        id_group_product: item.id_group_product,
        name_group_product: item.name_group_product,
        image: item.image,
      })),
    };

    await axios.post("http://localhost:5000/api/pay/addpay", payload);
    navigate("/PurchaseHistory");
  } catch (err) {
    console.error("Lỗi khi thêm đơn hàng sau PayPal:", err);
    console.log("Chi tiết lỗi:", err.response?.data);
    setErrorMessage("Đã thanh toán nhưng lỗi khi lưu đơn hàng.");
  }
}}
    onError={(err) => {
      console.error("Lỗi PayPal:", err);
      setErrorMessage("Có lỗi xảy ra khi thanh toán bằng PayPal.");
    }}
  />
</PayPalScriptProvider>

          ) : (
            <button className="checkout-button" onClick={handleAddToPay}>
              Thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfor;
