import AccountBar from "../component/AccountBar";
import "../styles/BillDetail.scss";
import { IoArrowBack } from "react-icons/io5";
import { FaUser, FaPhone, FaAddressBook } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import WriteReviewButton from "../component/WriteReviewButton";
import WarrantyModal from "../component/WarrantyModal";
import MessageBox from "../component/MessageBox"; // import thêm
import OrderHistoryModal from "../component/OrderHistoryModal";
import WarrantyHistoryModal from "../component/WarrantyHistoryModal";

function BillDetail() {
  const { code_order } = useParams();
  const [showWarranty, setShowWarranty] = useState(false);
  const [warrantyProduct, setWarrantyProduct] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState('Lịch sử mua hàng');
  const [reviewMap, setReviewMap] = useState({});
  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("success");
const [statusHistory, setStatusHistory] = useState([]);
const [showWarrantyHistory, setShowWarrantyHistory] = useState(false);
const [selectedWarrantyHistory, setSelectedWarrantyHistory] = useState([]);

const showMessage = (msg, type = "success") => {
  setMessage(msg);
  setMessageType(type);
  setTimeout(() => {
    setMessage("");
  }, 3000); // Tự ẩn sau 3s
};
  const openWarrantyHistory = (history) => {
  setSelectedWarrantyHistory(history);
  setShowWarrantyHistory(true);
};

  // 🔁 Lấy đánh giá cho các sản phẩm trong đơn hàng
 const fetchReviewsForProducts = async (productList, userId) => {
  const reviewsData = {};
  console.log(productList, userId)
  await Promise.all(
    productList.map(async (item) => {
      
      try {
        const res = await axios.get("http://localhost:5000/api/customer-reviews/check-reviewed", {
          params: {
            userId: userId, // ✅ lấy từ đối số truyền vào
            groupProductId: item.id_group_product,
            code_order: code_order,
          },
        });
       if (res.data.reviewed) {
        reviewsData[item.id_group_product] = {
          ...res.data.review,
          editable: res.data.editable,
        };
      }

      } catch (err) {
        console.error("Lỗi kiểm tra đánh giá:", err);
      }
    })
  );

  setReviewMap(reviewsData);
};
  
  useEffect(() => {
  axios.get(`http://localhost:5000/api/bill-detail/${code_order}`)
    .then(res => {
      setOrder(res.data.order);
      setProducts(res.data.products);
      setStatusHistory(res.data.statusHistory); // ✅ Lưu riêng
    })
    .catch(err => {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
    });
}, [code_order]);


  // 🧾 Lấy thông tin đơn hàng và sản phẩm
  useEffect(() => {
  axios.get(`http://localhost:5000/api/bill-detail/${code_order}`)
    .then(res => {
      setOrder(res.data.order);
      console.log(res.data.order)
      setProducts(res.data.products);
      console.log(res.data.products)
      // KHÔNG gọi fetchReviewsForProducts ở đây nữa
    })
    .catch(err => {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
    });
}, [code_order]);

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
  <button 
    className="btn btn-link p-0 ms-2"
    onClick={() => setShowHistoryModal(true)}
  >
    Xem lịch sử
  </button>
</div>

<OrderHistoryModal
  show={showHistoryModal}
  onClose={() => setShowHistoryModal(false)}
  statusHistory={statusHistory}
/>


              {/* Chỉ hiện nếu có lý do hủy đơn */}
              {order.cancel_reason && (
                <div style={{color:'red'}}>
                  <span style={{fontWeight:'700'}}>Lý do hủy đơn: </span> <span className="confirmed-bill">{order.cancel_reason}</span>
                </div>
              )}

            </div>

            <div className="title-productbill">Sản phẩm của bạn</div>
            <div className="order-items-bill">
              {products.map((item, index) => {
                const review = reviewMap[item.id_group_product];
                const hasReviewed = !!review;
                const editable = review?.editable ?? true;
                return (
                  <div className="item-detailbill" key={index}>
                    <img src={`http://localhost:5000/images/product/${item.image}`} alt={item.name_group_product} />
                    <div className="item-info-bill">
                      <h4>{item.name_group_product} {item.name_color} {item.name_ram} {item.name_rom}</h4>
                      <p>Giá : <span className="price-bill">{item.price.toLocaleString()}đ</span></p>
                      <p>Số lượng: <span className="billdetail-Quantity">{item.quantity_product}</span></p>
                      
                      {order.status_text === "Đã giao hàng" ?( 
                        <>  
                        {item.date_end_warranty == item.date_start_warranty ? (
                          <>
                           <p>
                              Thời gian bảo hành <span style={{ color: "red" }}>trọn đời</span> tính từ 
                              <span style={{ color: "red" }}> {item.date_start_warranty.slice(0, 10)} </span>
                              
                            </p>
                          </>
                        ):(
                          <>
                            {new Date(item.date_end_warranty).getFullYear() - new Date(item.date_start_warranty).getFullYear() < 1 ? (
                            <p>
                              Thời gian bảo hành <span style={{ color: "red" }}>6 tháng</span> tính từ 
                              <span style={{ color: "red" }}> {item.date_start_warranty.slice(0, 10)} </span>
                              đến 
                              <span style={{ color: "red" }}> {item.date_end_warranty.slice(0, 10)} </span>
                            </p>
                          ) : (
                            <p>
                              Thời gian bảo hành <span style={{ color: "red" }}>
                                {new Date(item.date_end_warranty).getFullYear() - new Date(item.date_start_warranty).getFullYear()} năm
                              </span> tính từ 
                              <span style={{ color: "red" }}> {item.date_start_warranty.slice(0, 10)} </span>
                              đến 
                              <span style={{ color: "red" }}> {item.date_end_warranty.slice(0, 10)} </span>
                            </p>
                          )}
                          </>
                        )}

                           {item.warranty_status_text && (
                             <>
                             <p>Trạng thái bảo hành: {item.warranty_status_text}</p>
                             {item.issue && (
                                <p style={{ color: "#555", fontStyle: "italic" }}>
                                  Lý do gửi bảo hành: {item.issue}
                                </p>
                              )}
                              {item.reply && (
                                <p style={{ color: "red", fontStyle: "italic" }}>
                                  Phản hồi từ shop: {item.reply}
                                </p>
                              )}
                             </>

                           )}           
                           {item.warrantyRequests && item.warrantyRequests.length > 0 && (
  <button
    className="btn btn-link p-0 mt-1"
    onClick={() => openWarrantyHistory(item.warrantyRequests.flatMap(w => w.history))}
  >
    Xem lịch sử bảo hành
  </button>
)}
           

                         {hasReviewed && (
                        <p>
                          Đánh giá: {"⭐".repeat(review.rating)}{" "}
                          <span style={{ color: "#999" }}>({review.rating} sao)</span>
                        </p>
                      )}
                      
                      <div style={{ marginTop: "10px" }}>
                        {!["Đang chờ duyệt", "Đã duyệt bảo hành", "Đang bảo hành"].includes(item.warranty_status_text) && 
                           (item.date_end_warranty === item.date_start_warranty || new Date() <= new Date(item.date_end_warranty)) && (
                             <button
                               className="write-btn-review"
                               onClick={() => {
                                 setWarrantyProduct(item);
                                 setShowWarranty(true);
                               }}
                             >
                               Gửi yêu cầu bảo hành
                             </button>
                           )}
                           
                            {showWarranty && warrantyProduct && (
                            <WarrantyModal
                              show={showWarranty}
                              onClose={() => setShowWarranty(false)}
                              productName={warrantyProduct.name_group_product}
                              defaultPhone={order.phone}
                              onSubmit={(data) => {
                                const payload = {
                                  ...data,
                                  id_user: order.id_user,
                                  id_product: warrantyProduct.id_product,
                                  code_order: order.code_order,
                                };
                              
                                axios.post("http://localhost:5000/api/warranty", payload)
                                  .then(() => {
                                    showMessage("Yêu cầu bảo hành đã được gửi!", "success");
                                    setShowWarranty(false);
                                    window.location.reload();
                                  })
                                  .catch((err) => {
                                    console.error("Lỗi gửi bảo hành:", err);
                                    showMessage("Gửi yêu cầu bảo hành thất bại.", "error");
                                  });
                              }}
                            />
                          )}
                       {editable ? (
                          <WriteReviewButton
                            hasPurchased={true}
                            hasReviewed={hasReviewed}
                            existingReview={review}
                            codeOrder= {order.code_order}
                            onSubmit={(data) => {
                              const payload = {
                                id_group_product: item.id_group_product,
                                id_user: order.id_user,
                                initials: order.name_user?.charAt(0).toUpperCase() || "K",
                                code_order: order.code_order,
                                id_product: item.id_product,
                                ...data,
                              };
                              const request = hasReviewed
                                ? axios.put(`http://localhost:5000/api/customer-reviews/${review.id}`, payload)
                                : axios.post("http://localhost:5000/api/customer-reviews", payload);
                              
                              request
                                .then(() => {
                                  showMessage("Đánh giá đã được gửi thành công!", "success");
                                  // ❗ Cập nhật lại danh sách đánh giá sau khi gửi thành công
                                  fetchReviewsForProducts(products, order.id_user);
                                })
                                .catch((err) => {
                                  console.error("Lỗi gửi đánh giá:", err);
                                  showMessage("Lỗi khi gửi đánh giá.", "error");
                                });
                            }}
                          />
                          
                        ) : (
                          <p style={{ color: "gray", fontStyle: "italic" }}>
                            Bạn không thể sửa đánh giá sau 2 tháng.
                          </p>
                        )}


                      </div>
                        </>
                      ):(
                        <>
                         
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
      <WarrantyHistoryModal
  show={showWarrantyHistory}
  onClose={() => setShowWarrantyHistory(false)}
  history={selectedWarrantyHistory}
/>

      <MessageBox
  type={messageType}
  message={message}
  onClose={() => setMessage("")}
/>
    </div>
    
  );
  
}

export default BillDetail;
