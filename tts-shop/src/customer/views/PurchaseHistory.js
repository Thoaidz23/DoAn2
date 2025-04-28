import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/index.scss';
import '../styles/purchaseHistory.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';
import AccountBar from '../component/AccountBar';

import img1 from "../assets/img/ss.webp"

function PurchaseHistory() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const navigate = useNavigate(); // Khai báo navigate

  const orders = [
    {
      id: "ZFD559585",
      name: "Smart Tivi LG 4K 55 inch Evo Oled Pose (55LX1TPSA) 2024",
      image: img1,
      price: 25000000,
      status: "Đã giao hàng",
      showCancel: false,
    },
    {
      id: "GZB643108",
      name: "Đồng hồ thông minh Huawei Watch D2",
      image: "/watch.png",
      price: 8280000,
      status: "Chờ xác nhận",
      showCancel: true,
    },
    {
      id: "XXI307473",
      name: "Smart Tivi LG 4K 55 inch Evo Oled Pose (55LX1TPSA) 2024 và 1 sản phẩm khác",
      image: "/tv.png",
      price: 25790000,
      status: "Đang chờ huỷ",
      showCancel: false,
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
  {orders.map((order) => (
    <div className="order-item-v2" key={order.id}>
      <img src={order.image} alt={order.name} className="product-image" />
      <div className="order-info">
        <h5>{order.id}</h5>
        <p>{order.name}</p>
        <div className="order-meta">
          <p className="price">{order.price.toLocaleString()}đ</p>
          <span
  className={`order-status ${order.status.replace(/\s/g, "-").toLowerCase()}`}
  style={{
    position: "absolute", // cần thiết để right hoạt động
    right: "44%",            // đẩy sang phải
    margin:"0 0 1% 0"    
  }}
>
  {order.status}
</span>

          
        </div>
      </div>
      <div className="order-actions">
        
        <button className="btn btn-outline-danger btn-sm">
          Chi tiết hóa đơn
        </button>
        {order.showCancel && (
          <button className="btn btn-outline-danger btn-sm mb-2">
            Yêu cầu huỷ đơn
          </button>
        )}  
      </div>
    </div>
  ))}
</div>

            )}


          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseHistory;
