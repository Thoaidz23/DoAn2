import React, { useState, useEffect, useContext } from "react";
import { Container, ListGroup, Image, Button, Form } from "react-bootstrap";
import "../styles/CartPage.scss";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom"; // 👈 điều hướng đến trang khác
import axios from "axios"; // 👈 import axios để gọi API
import { AuthContext } from "../context/AuthContext";

const CartPage = () => {
  const Paynavigate = useNavigate(); // 👈 điều hướng đến trang thanh toán
  const [cartItems, setCartItems] = useState([]);
  console.log(cartItems)
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext); // Lấy user từ context
  console.log("user context", user);

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
        console.log("Cập nhật số lượng thành công");
      })
      .catch((error) => console.error('Lỗi khi cập nhật số lượng:', error));
  };

  // Xóa sản phẩm khỏi giỏ
  const handleDelete = (id_cart) => {
    console.log("id_cart cần xóa:", id_cart); // Kiểm tra giá trị của id_cart
  
    axios.delete("http://localhost:5000/api/cartpage/delete", {
      data: { id_cart }  // Đảm bảo gửi đúng id_cart
    
    })
    .then(() => {
      console.log("Xóa sản phẩm thành công");
      setCartItems(cartItems.filter(item => item.id_cart !== id_cart));  // Cập nhật lại giỏ hàng sau khi xóa
    })
    .catch((error) => {
      console.error('Lỗi khi xóa sản phẩm:', error);
    });
  };
  
  

  // Tính tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {loading ? (
        <div>Đang tải...</div>
      ) : cartItems.length === 0 ? (
        <div className="empty-cart text-center">
          <h3>Giỏ hàng của bạn</h3>
          <Image
            src={require("../assets/img/giohangtrong.png")}
            alt="Giỏ hàng trống"
            fluid
            className="empty-cart-img"
          />
          <h4 className="mt-3">Giỏ hàng của bạn đang trống</h4>
        </div>
      ) : (
        <Container className="custom-cart-container">
          <h2 className="cart-title">Giỏ hàng</h2>
          <ListGroup className="list-cart">
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
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id_cart, e.target.value)}
                      style={{ width: "70px" }}
                    />
                  </Form.Group>
                </div>
                <div className="text-end">
                  <strong className="text-danger">
                    {(item.price * item.quantity).toLocaleString("vi-VN", {
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
