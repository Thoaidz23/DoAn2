import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/index.scss';
import '../styles/purchaseHistory.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';
import AccountBar from '../component/AccountBar';

function PurchaseHistory() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const navigate = useNavigate(); // Khai báo navigate

  const filters = [
    'Tất cả',
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang vận chuyển',
    'Đã giao hàng',
    'Đã huỷ',
  ];

  const orders = [
    {
      id: 1,
      img: 'https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg',
      alt: 'iPhone 16 Pro Max',
      name: 'iPhone 16 Pro Max',
      capacity: '512GB',
      price: '39900000',
      status: 'Đã xác nhận',
    },
    {
      id: 2,
      img: 'https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-den.png',
      alt: 'iPhone 16 Plus',
      name: 'iPhone 16 Plus',
      capacity: '256GB',
      price: '29900000',
      status: 'Đã giao hàng',
    },
    {
      id: 3,
      img: 'https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-den.png',
      alt: 'iPhone 16 Plus',
      name: 'iPhone 16 Plus',
      capacity: '256GB',
      price: '29900000',
      status: 'Đã hủy',
    },
    {
      id: 4,
      img: 'https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-den.png',
      alt: 'iPhone 16 Plus',
      name: 'iPhone 16 Plus',
      capacity: '256GB',
      price: '29900000',
      status: 'Chờ xác nhận',
    },
    {
      id: 5,
      img: 'https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-den.png',
      alt: 'iPhone 16 Plus',
      name: 'iPhone 16 Plus',
      capacity: '256GB',
      price: '29900000',
      status: 'Đang vận chuyển',
    },
  ];

  return (
    <div>
      <div className="PurchaseHistory_container">
        <div className="container">
          <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <div className="purchase-history-content">
            <div className="user-info">
              <img src="/avatar.png" alt="Avatar" className="avatar" />
              <div className="user-details">
                <h3>THOẠI MINH</h3>
                <p>
                  09*****264 <i className="bi bi-eye"></i>
                </p>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-item">
                <h2>{orders.length}</h2>
                <p>đơn hàng</p>
              </div>
              <div className="summary-item">
                <h2>
                  {orders
                    .reduce((total, order) => total + parseInt(order.price), 0)
                    .toLocaleString()}{" "}
                  đ
                </h2>
                <p>Tổng tiền tích lũy từ 01/01/2024</p>
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

            <div className="order-list">
              {orders
                .filter((order) =>
                  activeFilter === 'Tất cả' ? true : order.status === activeFilter
                )
                .map((order) => (
                  <div key={order.id} className="history-order-item">
                    <div className="history-order-left">
                      <img
                        src={order.img}
                        alt={order.name}
                        className="history-order-item-image"
                      />
                    </div>
                    <div className="history-order-right">
                      <div className="history-order-header">
                        <span className="history-order-time">19/04/2025 16:47</span>
                      </div>
                      <h4 className="history-order-name">{order.name}</h4>
                      <span
                        className={
                          'history-order-status ' + order.status.replace(/\s+/g, '-')
                        }
                      >
                        {order.status}
                      </span>

                      <p className="history-order-price">
                        {parseInt(order.price).toLocaleString()} đ
                      </p>
                      <div className="history-order-actions">
                        <button
                          className="history-detail-button"
                          onClick={() => navigate('/BillDetail')}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="empty-order">
              {orders.length === 0 && (
                <div>
                  <img
                    src="https://th.bing.com/th/id/OIP.ab45PW30UOa0XJ7sDrQK7QHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.6"
                    alt="Không có đơn hàng"
                  />
                  <p>Không có đơn hàng nào thỏa mãn!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseHistory;
