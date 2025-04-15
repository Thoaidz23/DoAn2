import React, { useState } from "react";
import "../styles/index.scss";
import "../styles/purchaseHistory.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-datepicker/dist/react-datepicker.css";
import AccountBar from "../component/AccountBar";

function PurchaseHistory() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [activeMenu, setActiveMenu] = useState("Lịch sử mua hàng");

  const filters = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang vận chuyển",
    "Đã giao hàng",
    "Đã huỷ",
  ];

  return (
    <div>
      <div className="PurchaseHistory_container">
        <div className="container">
          {/* Truyền activeMenu và setActiveMenu vào AccountBar */}
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
                <h2>0</h2>
                <p>đơn hàng</p>
              </div>
              <div className="summary-item">
                <h2>0đ</h2>
                <p>Tổng tiền tích lũy từ 01/01/2024</p>
              </div>
            </div>

            <div className="filter-section">
              <div className="filter-buttons">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={activeFilter === filter ? "active" : ""}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="empty-order">
              <img
                src="https://th.bing.com/th/id/OIP.ab45PW30UOa0XJ7sDrQK7QHaHa?pid=ImgDet&w=206&h=206&c=7&dpr=1.6"
                alt="Không có đơn hàng"
              />
              <p>Không có đơn hàng nào thỏa mãn!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseHistory;
