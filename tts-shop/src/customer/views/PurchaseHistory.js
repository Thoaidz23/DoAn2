import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/index.scss';
import '../styles/purchaseHistory.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';
import AccountBar from '../component/AccountBar';
import { AuthContext } from "../context/AuthContext";
import RefundModal from "../component/RefundModal";

function PurchaseHistory() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const [orders, setOrders] = useState([]);
  const [errorMessage1, setErrorMessage1] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, orderCode: '' });
  const [userInfo, setUserInfo] = useState(null);
  const [showRefund, setShowRefund] = useState(false);
  const [refundProduct, setRefundProduct] = useState(null);
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  console.log(user)


useEffect(() => {
  if (user && user.id) {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/account/${user.id}`);
        setUserInfo(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };
    fetchUserInfo();
  }
}, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user.id) return;
        const res = await axios.get(`http://localhost:5000/api/orders/purchase-history/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu đơn hàng:', err);
      }
    };

    fetchOrders();
  }, [user.id]);

  useEffect(() => {
    if (errorMessage1) {
      const timer = setTimeout(() => {
        setErrorMessage1('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage1]);

  const statusPay = {
    0: 'Chưa thanh toán',
    1: 'Đã thanh toán'
  };

  const statusMap = {
    0: 'Chờ xác nhận',
    1: 'Đã xác nhận',
    2: 'Đang vận chuyển',
    3: 'Đã giao hàng',
    4: 'Chờ hủy',
    5: 'Đã huỷ',
  };

  const filters = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang vận chuyển', 'Đã giao hàng', 'Chờ hủy', 'Đã huỷ'];

  const filteredOrders = orders.filter(order => {
    const orderStatusText = statusMap[order.status];
    return activeFilter === 'Tất cả' || orderStatusText === activeFilter;
  });

  const handleCancelOrder = async () => {
  if (!cancelReason.trim()) {
    alert("Vui lòng nhập lý do hủy đơn.");
    return;
  }

  try {
    const res = await axios.put(
      `http://localhost:5000/api/bill-detail/cancel/${confirmModal.orderCode}`,
      { customer_cancel_reason: cancelReason } // gửi lý do kèm theo
      
    );
    console.log(cancelReason)
    setErrorMessage1(res.data.message || 'Yêu cầu hủy đơn thành công');
    const updatedOrders = await axios.get(`http://localhost:5000/api/orders/purchase-history/${user.id}`);
    setOrders(updatedOrders.data);
  } catch (err) {
    console.error('Lỗi hủy đơn:', err);
    setErrorMessage1('Hủy đơn không thành công!');
  } finally {
    setConfirmModal({ show: false, orderCode: '' });
    setCancelReason(""); // reset lý do
  }
};

  return (
    <div className="PurchaseHistory_container">
        {errorMessage1 && (
            <div className="alert-message">
              {errorMessage1}
            </div>
          )}

      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="purchase-history-content">
          <div className="user-info">
            <img
              src={userInfo?.avatar || "https://ui-avatars.com/api/?name=U&background=random&color=fff"}
              alt="Avatar"
              className="avatar"
            />
            <div className="user-details">
              <h3>{userInfo?.name || "Người dùng"}</h3>
              <p>{userInfo?.email || "email@..."}</p>
            </div>
          </div>


          <div className="order-summary">
            <div className="summary-item">
              <h2>{orders.length}</h2>
              <p>đơn hàng</p>
            </div>
            <div className="summary-item">
              <h2>
                {/* {orders.reduce((total, order) => total + order.total_price, 0).toLocaleString()} đ */}
                {orders.reduce((total, order) => total + order.total_price, 0).toLocaleString("vi-VN") + "đ"}
              </h2>
              <p>Tổng tiền tích lũy từ {new Date(orders[orders.length - 1]?.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-buttons">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={activeFilter === filter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-order">
              <img
                src="https://th.bing.com/th/id/OIP.ab45PW30UOa0XJ7sDrQK7QHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.6"
                alt="Không có đơn hàng"
              />
              <p>Không có đơn hàng nào thỏa mãn!</p>
            </div>
          ) : (
            <div className="order-list">
              {filteredOrders.map((order) => (
                <div key={order.code_order} className="history-order-item">
                  <div className="history-order-left">
                    <img
                      src={`http://localhost:5000/images/product/${order.product_image}`}
                      alt={order.product_name}
                      className="history-order-item-image"
                    />
                  </div>
                  <div className="history-order-right">
                    <div className="history-order-header">
                      <span className="history-order-time">
                        {new Date(order.date).toLocaleString()}
                      </span>
                    </div>
                    <h4 className="history-order-name">{order.product_name}</h4>
                    <span className={'history-order-status ' + statusMap[order.status]?.replace(/\s+/g, '-')}>
                      {statusMap[order.status] || 'Không xác định'}
                    </span>
                    <span className={'history-order-status ' + statusPay[order.paystatus]?.replace(/\s+/g, '-')}>
                      {statusPay[order.paystatus] || 'Không xác định'}
                    </span>

                    <p className="history-order-price">
                      {Math.round(order.total_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                      
                    </p>

                    <div className="history-order-actions ">
                      {order.paystatus == 1 && (order.method == 3 || order.method == 1) && order.status != 3 && (

                        <>
                          {/* <button
                            className="history-refund-button"
                            onClick={() => {
                              setRefundProduct(order);
                              setShowRefund(true);
                            }}
                          >
                            Hoàn tiền
                          </button> */}
                          {showRefund && refundProduct && (
                            <RefundModal
                              show={showRefund}
                              onClose={() => setShowRefund(false)}
                              code_order={refundProduct.code_order}
                              loading={loadingRefund}
                              onSubmit={async () => {
                                setLoadingRefund(true);
                                const payload = {
                                  code_order: refundProduct.code_order,
                                  amount: refundProduct.total_price,
                                };
                              
                                try {
                                  if (refundProduct.method === 3) {
                                    payload.capture_id = refundProduct.capture_id;
                                    await axios.post("http://localhost:5000/api/paypal/refund", payload);
                                    alert("Hoàn tiền PayPal thành công!");
                                  } else if (refundProduct.method === 1) {
                                    await axios.post("http://localhost:5000/api/momo/refund", {
                                      orderId: refundProduct.code_order,
                                      requestId: `${refundProduct.code_order}-${Date.now()}`,
                                      transId: refundProduct.capture_id,
                                      amount: refundProduct.total_price
                                    });
                                    alert("Hoàn tiền MoMo thành công!");
                                  }
                                
                                  setShowRefund(false);
                                  window.location.reload();
                                
                                } catch (err) {
                                  console.error("Lỗi hoàn tiền:", err);
                                  alert("Không thể hoàn tiền.");
                                } finally {
                                  setLoadingRefund(false);
                                }
                              }}
                            />
                            
                            )}
                          </>
                      )}
                      {(order.status === 0 || order.status === 1) && (
                        
                        <button
                          className="history-cancel-button"
                          onClick={() => setConfirmModal({ show: true, orderCode: order.code_order })}
                        >
                          Yêu cầu hủy đơn
                        </button>
                      )}

                      <button
                        className="history-detail-button"
                        onClick={() => navigate(`/bill-detail/${order.code_order}`)}
                      >
                        Xem chi tiết
                      </button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal.show && (
  <div className="custom-confirm-modal">
    <div className="modal-content">
      <p>Bạn có chắc muốn yêu cầu hủy đơn {confirmModal.orderCode}?</p>
      <p>Lý do hủy đơn</p>
      <textarea
        placeholder="Thay đổi địa chỉ, đổi ý, ...."
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
      />
      <div className="modal-buttons">
        <button onClick={handleCancelOrder}>Đồng ý</button>
        <button onClick={() => {
          setConfirmModal({ show: false, orderCode: '' });
          setCancelReason("");
        }}>Hủy</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default PurchaseHistory;
