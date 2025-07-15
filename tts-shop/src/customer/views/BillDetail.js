import AccountBar from "../component/AccountBar";
import "../styles/BillDetail.scss";
import { IoArrowBack } from "react-icons/io5";
import { FaUser, FaPhone, FaAddressBook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import WriteReviewButton from "../component/WriteReviewButton";


function BillDetail() {
  const { code_order } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const [reviewMap, setReviewMap] = useState({});

  // 🔁 Lấy đánh giá cho các sản phẩm trong đơn hàng
 const fetchReviewsForProducts = async (productList, userId) => {
  const reviewsData = {};

  await Promise.all(
    productList.map(async (item) => {
      try {
        const res = await axios.get("http://localhost:5000/api/reviews/check-reviewed", {
          params: {
            userId: userId, // ✅ lấy từ đối số truyền vào
            groupProductId: item.id_group_product,
          },
        });
        if (res.data.reviewed) {
          reviewsData[item.id_group_product] = res.data.review;
        }
      } catch (err) {
        console.error("Lỗi kiểm tra đánh giá:", err);
      }
    })
  );

  setReviewMap(reviewsData);
};


  // 🧾 Lấy thông tin đơn hàng và sản phẩm
  useEffect(() => {
  axios.get(`http://localhost:5000/api/bill-detail/${code_order}`)
    .then(res => {
      setOrder(res.data.order);
      setProducts(res.data.products);
      // KHÔNG gọi fetchReviewsForProducts ở đây nữa
    })
    .catch(err => {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
    });
}, [code_order]);

// 👉 Gọi khi order đã có
useEffect(() => {
  if (order && products.length > 0) {
    fetchReviewsForProducts(products, order.id_user);
  }
}, [order, products]);


  // 🔁 Chờ có order và products mới fetch đánh giá
  useEffect(() => {
    if (order && products.length > 0) {
      fetchReviewsForProducts(products, order.id_user);
    }
  }, [order, products]);

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

            <div className="title-productbill">Sản phẩm của bạn</div>
            <div className="order-items-bill">
              {products.map((item, index) => {
                const review = reviewMap[item.id_group_product];
                const hasReviewed = !!review;
                

                return (
                  <div className="item-detailbill" key={index}>
                    <img src={`http://localhost:5000/images/product/${item.image}`} alt={item.name_group_product} />
                    <div className="item-info-bill">
                      <h4>{item.name_group_product}</h4>
                      <p>Giá : <span className="price-bill">{item.price.toLocaleString()}đ</span></p>
                      <p>Số lượng: <span className="billdetail-Quantity">{item.quantity_product}</span></p>
                      {order.status_text === "Đã giao hàng" &&(
                        <>
                         {hasReviewed && (
                        <p>
                          Đánh giá: {"⭐".repeat(review.rating)}{" "}
                          <span style={{ color: "#999" }}>({review.rating} sao)</span>
                        </p>
                      )}
                      <div style={{ marginTop: "10px" }}>
                       <WriteReviewButton
  hasPurchased={true}
  hasReviewed={hasReviewed}
  existingReview={review}
  onSubmit={(data) => {
  const payload = {
    id_group_product: item.id_group_product,
    id_user: order.id_user,
    initials: order.name_user?.charAt(0).toUpperCase() || "K",
    ...data,
  };

  const request = hasReviewed
    ? axios.put(`http://localhost:5000/api/reviews/${review.id}`, payload)
    : axios.post("http://localhost:5000/api/reviews", payload);

  request
    .then(() => {
      alert("Đánh giá đã được gửi thành công!");

      // 🔗 Chỉ chuyển hướng khi đang ở trang BillDetail
      if (location.pathname.includes("bill-detail")) {
        navigate(`/product/${item.id_group_product}`);
      }
    })
    .catch((err) => {
      console.error("Lỗi gửi đánh giá:", err);
      alert("Lỗi khi gửi đánh giá.");
    });
}}

/>

                      </div>
                        </>
                      )}
                     
                    </div>
                  </div>
                );
              })}
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
