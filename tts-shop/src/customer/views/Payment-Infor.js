import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import "../styles/payment-infor.scss";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { FaExclamationTriangle } from "react-icons/fa";

const PaymentInfor = () => {
  const { user } = useContext(AuthContext);  // Lấy thông tin người dùng từ context
  const navigate = useNavigate();
  
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cartItems, setCartItems] = useState([]); // Lưu giỏ hàng
  const [userInfo, setUserInfo] = useState(null); // Lưu thông tin người dùng từ context
  const [loading, setLoading] = useState(true); // Trạng thái loading
 const [errorMessage, setErrorMessage] = useState("");

useEffect(() => {
  if (errorMessage) {
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [errorMessage]);


  const [tempAddress, setTempAddress] = useState("");  // Địa chỉ chỉnh sửa
  const [isEditingAddress, setIsEditingAddress] = useState(false); // Trạng thái chỉnh sửa

  const [tempPhone , setTempPhone] = useState("");  // Địa chỉ chỉnh sửa
  const [isEditingPhone, setIsEditingPhone] = useState(false); // Trạng thái chỉnh sửa


  useEffect(() => {
    if (!user) {
      setLoading(false); // Nếu không có user, thoát khỏi loading ngay
      return;
    }
    
    const fetchCartData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payment/${user.id}`);
        console.log("Dữ liệu từ API:", res.data);
        setCartItems(res.data.product); // dùng đúng mảng
        setTempAddress(res.data.address);
        setTempPhone(res.data.phone)
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
    setLoading(false);  // Đánh dấu kết thúc loading
  }, [user]);

  // Tính tổng giá trị giỏ hàng
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);



  // Hàm xử lý khi chọn phương thức thanh toán
  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  const handleAddToPay = async () => {
    if (selectedPayment === null) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
  
    if (!user || cartItems.length === 0 || !userInfo) return;
  
    const payload = {
      id_user: user.id,
      name_user: userInfo.name,
      address: tempAddress || userInfo.address,
      phone: tempPhone || userInfo.phone,
      method: selectedPayment, // Gửi phương thức thanh toán (0, 1, 2)
      products: cartItems.map(item => ({
        id_product: item.id_product,
        quantity: item.quantity,
        price: item.price,
        id_group_product: item.id_group_product
      }))
    };


  try {
    if (selectedPayment === 0) {
      const res = await axios.post("http://localhost:5000/api/pay/addpay", payload);
      navigate("/PurchaseHistory");
    } else if (selectedPayment === 1) {
      navigate("/Payment-momo", { state: { payload } });
    } else if (selectedPayment === 2) {
      navigate("/Payment-Bank", { state: { payload } });
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

        {/* Sản phẩm */}
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
                  <p className="price">
                    {item.price.toLocaleString()}<sup>đ</sup>
                  </p>
                </div>
                <p className="quantity">
                  Số lượng: <span>{item.quantity}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Giỏ hàng trống</p>
        )}

        {/* Thông tin khách hàng */}
        {userInfo ? (
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
                          style={{width:"200%"}}
                        />
                      ) : (
                        tempAddress || userInfo.address
                      )
                    }
                  <p
                    className="edit-icon"
                    onClick={() => setIsEditingAddress((prev) => !prev)}
                    style={{top:"44%"}}
                  >
                    {isEditingAddress ? "✔" : "✎"}
                  </p>

                  </p>
                  <p>
                    Số điện thoại: {
                      isEditingPhone ? (
                        <input
                          type="text"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="edit-address-input"s
                        />
                      ) : (
                        tempPhone || userInfo.phone
                      )
                    }
                    <span
                    className="edit-icon"
                    onClick={() => setIsEditingPhone((prev) => !prev)}
                  >
                    {isEditingPhone ? "✔" : "✎"}
                  </span>

                  </p>
                </div>
                <div className="right-align">
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Vui lòng đăng nhập để xem thông tin khách hàng.</p>
        )}
        

        {/* Phương thức thanh toán */}
        <h2 className="section-title section-header">PHƯƠNG THỨC THANH TOÁN</h2>
        <div className="info-card payment-options">
          <div
            className={`payment-option ${selectedPayment === 0 ? "active" : ""}`}
            onClick={() => handlePaymentSelect(0)}
          >
            <img
              src="https://th.bing.com/th/id/OIP.pr3kU9TsrcMbdI4tjJ8SDQAAAA?w=157&h=180&c=7&r=0&o=5&dpr=1.6&pid=1.7"
              alt="COD Icon"
              className="payment-icon cod-img"
            />
            <p>Thanh toán khi nhận hàng</p>
          </div>

          <div
            className={`payment-option ${selectedPayment === 1 ? "active" : ""}`}
            onClick={() => handlePaymentSelect(1)}
          >
            <img
              src="https://th.bing.com/th/id/OIP.-DhgkiQDEdoru7CJdZrwEAHaHa?w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.6&pid=3.1&rm=2"
              alt="MoMo Logo"
              className="payment-icon momo-img"
            />
            <p>Ví MoMo</p>
          </div>

          <div
            className={`payment-option ${selectedPayment === 2 ? "active" : ""}`}
            onClick={() => handlePaymentSelect(2)}
          >
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
            <strong>Tạm tính:</strong> <span className="price">{totalPrice.toLocaleString()}<sup>đ</sup></span>
          </p>
          <button className="checkout-button" onClick={handleAddToPay}>
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfor;
