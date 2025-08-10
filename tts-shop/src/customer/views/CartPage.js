import React, { useState, useEffect, useContext } from "react";
import { Container, ListGroup, Image, Button, Form, Modal } from "react-bootstrap";
import "../styles/CartPage.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom"; // 👈 điều hướng đến trang khác
import axios from "axios"; // 👈 import axios để gọi API
import { AuthContext } from "../context/AuthContext";

const CartPage = () => {
  const Paynavigate = useNavigate(); // 👈 điều hướng đến trang thanh toán
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMaxQtyModal, setShowMaxQtyModal] = useState(false);

  const { user } = useContext(AuthContext); // Lấy user từ context
  // Lấy dữ liệu giỏ hàng khi trang load
  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/cartpage/${user.id}`)
        .then((response) => {
          setCartItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Lỗi khi tải giỏ hàng:', error);
          setLoading(false);
        });
    }
  }, [user]);

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = (id, value) => {
    const newCart = cartItems.map((item) =>
      item.id_cart === id
        ? { ...item, quantity: Math.max(1, Number(value)) }
        : item
    );
    setCartItems(newCart);

    axios.put("http://localhost:5000/api/cartpage/update", {
      id_user: user.id,
      id_product: newCart.find((item) => item.id_cart === id).id_product,
      quantity: value
    })
      .then(() => {
      })
      .catch((error) => console.error('Lỗi khi cập nhật số lượng:', error));
  };

  // Xóa sản phẩm khỏi giỏ
  const handleDelete = (id_cart) => {
  
    axios.delete("http://localhost:5000/api/cartpage/delete", {
      data: { id_cart }  // Đảm bảo gửi đúng id_cart
    
    })
    .then(() => {
      setCartItems(cartItems.filter(item => item.id_cart !== id_cart));  // Cập nhật lại giỏ hàng sau khi xóa
    })
    .catch((error) => {
      console.error('Lỗi khi xóa sản phẩm:', error);
    });
  };
  
  

  // Tính tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.saleprice * item.quantity,
    0
  );

  return (
      <>
      
     <Modal show={showMaxQtyModal} onHide={() => setShowMaxQtyModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title style={{ fontWeight: '700', fontSize: '1.5rem', color: '#d9534f' }}>
      Thông báo
    </Modal.Title>
  </Modal.Header>

  <Modal.Body style={{ fontSize: '1rem', lineHeight: '1.6', color: '#333' }}>
    <p><strong>Số lượng sản phẩm đã đạt đến mức tối đa.</strong></p>
    <p>Quý khách vui lòng liên hệ nhanh:</p>
    <p style={{color:'red'}}>
      Thông tin chi tiết ở cuối trang
    </p>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="primary" onClick={() => setShowMaxQtyModal(false)} style={{ fontWeight: '600', padding: '0.5rem 1.5rem' }}>
      Đóng
    </Button>
  </Modal.Footer>
</Modal>

      {loading ? (
        <div>Đang tải...</div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart text-center"   style={{ marginTop: "-60px" ,marginBottom : "100px"}}>
          <div
            className="cart-header-empty position-relative mb-0 pb-2 "
            style={{ borderBottom: "1px solid gray", height: "50px",width:"50%" }}
          >
            <i
              className="bi bi-arrow-left position-absolute start-0 top-50 translate-middle-y ms-2 text-black fs-4"
              onClick={() => Paynavigate(-1)}
              style={{ cursor: "pointer" }}
            ></i>
  
            <h2 className="mb-0 mt-3 fw-bold text-center" style={{ fontSize: "1.8rem" }}>
              Giỏ hàng
            </h2>
          </div>
            <Image
              src={require("../assets/img/giohangtrong.png")}
              alt="Giỏ hàng trống"
              fluid
              className="empty-cart-img"
            />
            <h4 className="mt-3">Giỏ hàng của bạn đang trống</h4>
          </div>
        ) : (
          <Container className="custom-cart-container"  style={{ marginTop: "80px" ,marginBottom : "150px"}}>
          
            <ListGroup className="list-cart">
            <div
            className="cart-header position-relative mb-3 pb-2"
            style={{ borderBottom: "1px solid gray", height: "50px" }}
          >
            <i
              className="bi bi-arrow-left position-absolute start-0 top-50 translate-middle-y ms-2 text-black fs-4"
              onClick={() => Paynavigate(-1)}
              style={{ cursor: "pointer" }}
            ></i>

            <h2 className="mb-0 fw-bold text-center" style={{ fontSize: "1.8rem" }}>
              Giỏ hàng
            </h2>
          </div>

            {cartItems.map((item) => (
            <ListGroup.Item key={item.id_cart} className="d-flex align-items-center position-relative cart-item">
                <Image
                  src={`http://localhost:5000/images/product/${item.image}`}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="me-3 rounded"
                />

                <div className="flex-grow-1">
                  <h5 className="mb-1">{item.name_group_product} {item.name_color} {item.name_ram} {item.name_rom}</h5>
                  <Form.Group controlId={`quantity-${item.id_cart}`} className="mb-0 d-flex align-items-center gap-2">
  <Form.Label className="mb-0">Số lượng:</Form.Label>
  <Form.Control
  type="number"
  min="1"
  max="6"
  step="1"
  value={item.quantity}
  onChange={(e) => {
  let val = e.target.value;
  console.log("Input value:", val);

  if (val.includes('.')) {
    val = val.split('.')[0];
  }
  val = Number(val);

  if (isNaN(val) || val < 1) val = 1;

  if (val > 5) {
    console.log("Show modal triggered");
    setShowMaxQtyModal(true);
    val = 5;
  }

  handleQuantityChange(item.id_cart, val);
}}
  style={{ width: "70px" }}
/>

</Form.Group>

                </div>
                <div className="text-end">
                  <strong className="text-danger">
                    {(item.saleprice * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </strong>
                </div>
                <i className="bi bi-trash delete-icon" onClick={() => handleDelete(item.id_cart)}></i>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="cart-total-bar">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="mb-0">
                Tổng:{" "}
                <span className="text-danger">
                  {total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </h5>
              <Button variant="success" size="lg" onClick={() => Paynavigate("/Payment-Infor")}>
                Thanh toán
              </Button>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default CartPage;
