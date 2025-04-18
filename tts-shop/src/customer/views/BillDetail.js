import AccountBar from "../component/AccountBar";
import "../styles/BillDetail.scss";
import { IoArrowBack } from "react-icons/io5"; // icon quay lại
import { FaInfoCircle, FaUser, FaPhone, FaAddressBook } from "react-icons/fa"; // icon khách hàng

function BillDetail() {
  return (
    <div className="billdetail-container">
      <div className="container">
        <AccountBar />
        <div className="detailbill-content">
          <div className="order-detail-bill">
            <div className="title-row">
              <IoArrowBack className="back-icon" onClick={() => window.history.back()} />
              <h1 className="title">CHI TIẾT ĐƠN HÀNG</h1>
            </div>
            <div className="title-underline"></div>

            <div className="order-meta-bill">
              <p><strong>Mã đơn hàng:</strong> <span className="highlight">THOAI</span></p>
              <p>Ngày mua: 17/08/2024</p>
              <p>Thời gian: 12 giờ 40 phút</p>
              <div className="status-bill">
                Trạng thái: <span className="confirmed-bill">Đã xác nhận</span>
              </div>
            </div>
              <div className="title-productbill"> Sản phẩm của bạn</div>
            <div className="order-items-bill">
              <div className="item-detailbill">
                <img
                  src="https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg"
                  alt="Samsung"
                />
                <div className="item-info-bill">
                  <h4>SamSung Galaxy A55-Đen</h4>
                  <p>Giá : <span className="price-bill">9.000.000đ</span></p>
                  <p>Số lượng: <span className="billdetail-Quantity">1</span></p>
                </div>
              </div>

              <div className="item-detailbill">
                <img
                  src="https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg"
                  alt="Samsung"
                />
                <div className="item-info-bill">
                  <h4>SamSung Galaxy A55-Đen</h4>
                  <p>Giá : <span className="price-bill">9.000.000đ</span></p>
                  <p>Số lượng: <span className="billdetail-Quantity">1</span></p>
                </div>
              </div>
            </div>
            <div className="title-underline"></div>
            <div className="payment-info-bill">
              <h4><i className="bi bi-credit-card"></i> Thông tin thanh toán</h4>
              <div className="payment-row-bill">
                <span>Tổng tiền sản phẩm:</span>
                <span>18.000.000đ</span>
              </div>
              <div className="payment-row-bill">
                <span>Phí vận chuyển:</span>
                <span className="freeship">Miễn phí</span>
              </div>
              <div className="payment-row total-bill">
                <span>Phải thanh toán:</span>
                <span className="bold">18.000.000đ</span>
              </div>
              <div className="payment-row paid-bill">
                <span>Đã thanh toán:</span>
                <span className="bill-success">18.000.000đ</span>
              </div>
            </div>
            <div className="title-underline"></div>
            {/* Thông tin khách hàng */}
            <div className="customer-info-bill">
              <div className="customer-header-bill">
                <strong>Thông tin khách hàng</strong>
              </div>
              <div className="customer-detailbill">
                <p><FaUser className="icon-bill" /> Minh Thoại</p>
                <p><FaPhone className="icon-bill" /> 0977031264</p>
                <p><FaAddressBook className="icon-bill" /> Địa chỉ: Bạc Liêu</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BillDetail;
