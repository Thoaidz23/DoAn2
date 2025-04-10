import React, { useState } from "react";
import { Container, ListGroup, Image, Button, Form } from "react-bootstrap";
import "../styles/CartPage.scss";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Tai nghe Sony WH-1000XM4",
      price: 5990000,
      quantity: 1,
      image: require("../assets/img/img1.png"),
    },
    {
      id: 2,
      name: "Loa Bluetooth JBL Flip 5",
      price: 1800000,
      quantity: 2,
      image: require("../assets/img/img2.webp"),
    },
    
  ]);

  const handleQuantityChange = (id, value) => {
    const newCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Number(value)) }
        : item
    );
    setCartItems(newCart);
  };
  const handleDelete = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container className="custom-cart-container">
      <h2 className="cart-title">Giỏ hàng</h2>

      <ListGroup className="list-cart">
        {cartItems.map((item) => (
            <ListGroup.Item key={item.id} className="d-flex align-items-center position-relative cart-item">
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="me-3 rounded"
            />
            <div className="flex-grow-1">
              <h5 className="mb-1">{item.name}</h5>
              <Form.Group controlId={`quantity-${item.id}`} className="mb-0 d-flex align-items-center gap-2">
                <Form.Label className="mb-0">Số lượng:</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  style={{ width: "70px" }}
                />
              </Form.Group>
            </div>
            <div className="text-end">
              <strong className="text-danger">
                {item.price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </strong>
            </div>
          
            {/* Icon xóa sản phẩm */}
            <i className="bi bi-archive delete-icon" onClick={() => handleDelete(item.id)}></i>
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
          <Button variant="success" size="lg">
            Thanh toán
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CartPage;
