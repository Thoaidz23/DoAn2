// src/component/FloatingCart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Cart } from "react-bootstrap-icons";
import "../styles/FloatingCart.scss";

const FloatingCart = ({ cartCount }) => {
  const navigate = useNavigate();

  return (
    <div className="floating-cart" onClick={() => navigate("/cartpage")}>
      <Cart size={24} />
      {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
    </div>
  );
};

export default FloatingCart;
