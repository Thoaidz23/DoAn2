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


function PurchaseHistory() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user.id) {
          console.warn('Chưa đăng nhập');
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/orders/purchase-history/${user.id}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Lỗi lấy dữ liệu đơn hàng:', err);
      }
    };

    fetchOrders();
  }, [user.id]);

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


  const filters = [
    'Tất cả',
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang vận chuyển',
    'Đã giao hàng',
    'Chờ hủy',
    'Đã huỷ',
  ];

  const filteredOrders = orders.filter(order => {
    const orderStatusText = statusMap[order.status];
    return activeFilter === 'Tất cả' || orderStatusText === activeFilter;
  });
  console.log(user)
  return (
    <div className="PurchaseHistory_container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="purchase-history-content">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar" />
            <div className="user-details">
              <h3>{user.name || 'THOẠI MINH'}</h3>
              <p>{user.email || '09*****264'} <i className="bi bi-eye"></i></p>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-item">
              <h2>{orders.length}</h2>
              <p>đơn hàng</p>
            </div>
            <div className="summary-item">
              <h2>
                {orders.reduce((total, order) => total + order.total_price, 0).toLocaleString()} đ
              </h2>
              <p>Tổng tiền tích lũy từ {new Date(orders[orders.length-1]?.date).toLocaleDateString()}</p>


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
                    <span
                      className={'history-order-status ' + statusMap[order.status]?.replace(/\s+/g, '-')}>
                      {statusMap[order.status] || 'Không xác định'}
                    </span>
                    <span
                      className={'history-order-status ' + statusPay[order.paystatus]?.replace(/\s+/g, '-')}>
                      {statusPay[order.paystatus] || 'Không xác định'}
                    </span>

                    <p className="history-order-price">
                      {order.total_price.toLocaleString()} đ
                    </p>

                    <div className="history-order-actions">
                      {order.status === 0 && (
                        <button
                          className="history-cancel-button"
                          onClick={async () => {
                            if (window.confirm(`Bạn có chắc muốn yêu cầu hủy đơn ${order.code_order}?`)) {
                              try {
                                const res = await axios.put(`http://localhost:5000/api/bill-detail/cancel/${order.code_order}`);
                                alert(res.data.message || 'Yêu cầu hủy thành công');
                                
                                // Cập nhật lại danh sách đơn hàng sau khi hủy
                                const updatedOrders = await axios.get(`http://localhost:5000/api/orders/purchase-history/${user.id}`);
                                setOrders(updatedOrders.data);
                              } catch (err) {
                                console.error('Lỗi hủy đơn:', err);
                                alert('Hủy đơn không thành công!');
                              }
                            }
                          }}
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
    </div>
  );
}

export default PurchaseHistory;