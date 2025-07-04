import AccountBar from "../component/AccountBar";
import "../styles/BillDetail.scss";
import { IoArrowBack } from "react-icons/io5";
import { FaInfoCircle, FaUser, FaPhone, FaAddressBook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BillDetail() {
  const { code_order } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  console.log(products)
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');

  useEffect(() => {
    console.log("Mã đơn hàng:", code_order);
    axios.get(`http://localhost:5000/api/bill-detail/${code_order}`)
      .then(res => {
        setOrder(res.data.order);
        setProducts(res.data.products);
        console.log(res.data.order)
      })
      .catch(err => {
        console.error("Lỗi lấy chi tiết đơn hàng:", err);
      });
  }, [code_order]);

  if (!order) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="billdetail-container">
      <div className="container">
            <AccountBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <div className="detailbill-content">
          <div className="order-detail-bill">
            <div className="title-row">
              <IoArrowBack className="back-icon" onClick={() => window.history.back()} />
              <h1 className="title">CHI TIẾT ĐƠN HÀNG</h1>
            </div>
            <div className="title-underline"></div>

            <div className="order-meta-bill">
              <p><strong>Mã đơn hàng:</strong> <span className="highlight">{order.code_order}</span></p>
              <p>Ngày mua: {order.date_formatted}</p>
              <p>Thời gian: {order.time_formatted}</p>
              <div className="status-bill">
                Trạng thái: <span className="confirmed-bill">{order.status_text}</span>
              </div>
            </div>

            <div className="title-productbill"> Sản phẩm của bạn</div>
            <div className="order-items-bill">
              {products.map((item, index) => (
                <div className="item-detailbill" key={index}>
                  <img src={`http://localhost:5000/images/product/${item.image}`} alt={item.name_product} />
                  <div className="item-info-bill">
                    <h4>{item.name_product}</h4>
                    <p>Giá : <span className="price-bill">{item.price.toLocaleString()}đ</span></p>
                    <p>Số lượng: <span className="billdetail-Quantity">{item.quantity_product}</span></p>
                  </div>
                </div>
              ))}
            </div>

            <div className="title-underline"></div>
            <div className="payment-info-bill">
              <h4><i className="bi bi-credit-card"></i> Thông tin thanh toán</h4>
              <div className="payment-row-bill">
                <span>Tổng tiền sản phẩm:</span>
                <span>{order.total_price.toLocaleString()}đ</span>
              </div>
              <div className="payment-row-bill">
                <span>Phí vận chuyển:</span>
                <span className="freeship">Miễn phí</span>
              </div>
              <div className="payment-row total-bill">
                <span>Phải thanh toán:</span>
                <span className="bold">{order.total_price.toLocaleString()}đ</span>
              </div>
              <div className="payment-row paid-bill">
                <span>{order.paystatus === 1 ? 'Đã thanh toán:' : 'Chưa thanh toán:'}</span>
                <span className="bill-success">{order.paystatus === 1 ? `${order.total_price.toLocaleString()}đ` : '0đ'}</span>
              </div>
            </div>

            <div className="title-underline"></div>
            <div className="customer-info-bill">
              <div className="customer-header-bill">
                <strong>Thông tin khách hàng</strong>
              </div>
              <div className="customer-detailbill">
                <p><FaUser className="icon-bill" /> {order.name_user}</p>
                <p><FaPhone className="icon-bill" /> {order.phone}</p>
                <p><FaAddressBook className="icon-bill" /> Địa chỉ: {order.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillDetail;