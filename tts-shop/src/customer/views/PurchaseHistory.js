import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/index.scss';
import '../styles/purchaseHistory.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';
import AccountBar from '../component/AccountBar';

import img1 from "../assets/img/ss.webp";
import img2 from "../assets/img/ss.webp";
import img3 from "../assets/img/ss.webp";

function PurchaseHistory() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const navigate = useNavigate();

  const orders = [
    {
      id: "ZFD559585",
      name: "Smart Tivi LG 4K 55 inch Evo Oled Pose (55LX1TPSA) 2024",
      image: img1,
      price: 25000000,
      status: "Đã giao hàng",
    },
    {
      id: "GZB643108",
      name: "Đồng hồ thông minh Huawei Watch D2",
      image: img2,
      price: 8280000,
      status: "Chờ xác nhận",
    },
  
  ];

  const filters = [
    'Tất cả',
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang vận chuyển',
    'Đã giao hàng',
    'Đã huỷ',
  ];

  return (
    <div className="PurchaseHistory_container">
      <div className="container">
        <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="purchase-history-content">
          <div className="user-info">
            <img src="/avatar.png" alt="Avatar" className="avatar" />
            <div className="user-details">
              <h3>THOẠI MINH</h3>
              <p>09*****264 <i className="bi bi-eye"></i></p>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-item">
              <h2>{orders.length}</h2>
              <p>đơn hàng</p>
            </div>
            <div className="summary-item">
              <h2>
                {orders.reduce((total, order) => total + order.price, 0).toLocaleString()} đ
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

          {orders.length === 0 ? (
            <div className="empty-order">
              <img
                src="https://th.bing.com/th/id/OIP.ab45PW30UOa0XJ7sDrQK7QHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.6"
                alt="Không có đơn hàng"
              />
              <p>Không có đơn hàng nào thỏa mãn!</p>
            </div>
          ) : (
            <div className="order-list">
              {orders
                .filter(order => activeFilter === 'Tất cả' || order.status === activeFilter)
                .map(order => (
                  <div key={order.id} className="history-order-item">
                    <div className="history-order-left">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="history-order-item-image"
                      />
                    </div>
                    <div className="history-order-right">
                      <div className="history-order-header">
                        <span className="history-order-time">19/04/2025 16:47</span>
                      </div>
                      <h4 className="history-order-name">{order.name}</h4>
                      <span className={'history-order-status ' + order.status.replace(/\s+/g, '-')}>
                        {order.status}
                      </span>

                      <p className="history-order-price">
                        {order.price.toLocaleString()} đ
                      </p>

                      <div className="history-order-actions">
                        {/* Yêu cầu hủy đơn: Luôn hiển thị */}
                        <button
                          className="history-cancel-button"
                          onClick={() => alert(`Bạn đã yêu cầu hủy đơn: ${order.id}`)}
                        >
                          Yêu cầu hủy đơn
                        </button>

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
          )}
        </div>
      </div>
    </div>
  );
}

export default PurchaseHistory;
