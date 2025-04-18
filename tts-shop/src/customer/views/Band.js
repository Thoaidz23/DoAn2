import React from "react";
import { Link } from "react-router-dom"; // Dùng để điều hướng
import "../styles/product.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

function Band() {
  const products = [
    {
      id: 1,
      img: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg",
      alt: "iPhone 16 Pro Max",
      name: "iPhone 16 Pro Max",
      capacity: "512GB",
      price: "39.900.000",
    },
    {
      id: 2,
      img: "https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-den.png",
      alt: "iPhone 16 Plus",
      name: "iPhone 16 Plus",
      capacity: "256GB",
      price: "29.900.000",
    },
    {
      id: 3,
      img: "https://cdn.tgdd.vn/Products/Images/42/329135/iphone-16-blue-600x600.png",
      alt: "iPhone 16",
      name: "iPhone 16",
      capacity: "128GB",
      price: "22.900.000",
    },
    {
      id: 4,
      img: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-gold-thumbnew-600x600.jpg",
      alt: "iPhone 15 Pro Max",
      name: "iPhone 15 Pro Max",
      capacity: "256GB",
      price: "30.000.000",
    },
    {
      id: 5,
      img: "https://cdn.tgdd.vn/Products/Images/42/303823/iphone-15-plus-xanh-la-256gb-thumb-600x600.jpg",
      alt: "iPhone 15 Plus",
      name: "iPhone 15 Plus",
      capacity: "256GB",
      price: "25.900.000",
    },
    {
      id: 6,
      img: "https://cdn.tgdd.vn/Products/Images/42/303823/iphone-15-plus-xanh-la-256gb-thumb-600x600.jpg",
      alt: "iPhone 15 Plus",
      name: "iPhone 15 Plus",
      capacity: "256GB",
      price: "25.900.000",
    },
    {
      id: 7,
      img: "https://cdn.tgdd.vn/Products/Images/42/303823/iphone-15-plus-xanh-la-256gb-thumb-600x600.jpg",
      alt: "iPhone 15 Plus",
      name: "iPhone 15 Plus",
      capacity: "256GB",
      price: "25.900.000",
    },
    {
      id: 8,
      img: "https://cdn.tgdd.vn/Products/Images/42/303823/iphone-15-plus-xanh-la-256gb-thumb-600x600.jpg",
      alt: "iPhone 15 Plus",
      name: "iPhone 15 Plus",
      capacity: "256GB",
      price: "25.900.000",
    },
  ];

  return (
    <div>
      <div className="container-detail_bar">
        <div className="container">
          <p><i className="bi bi-house-door-fill"></i> Trang chủ</p>
          <i className="bi bi-chevron-right breadcrumb-icon"></i>
          <p>Apple</p>
        </div>
      </div>

      <div className="container">
        <div className="product-one-content">
          <div className="container">
            <div className="product-one-content-title">
              <h2>Apple</h2>
            </div>

            <div className="product-one-content-items">
              {products.map((product) => (
                <div className="product-one-content-item" key={product.id}>
                  <Link to={`/ProductDetail`}>
                    <img src={product.img} alt={product.alt} />
                  </Link>
                  <div className="product-one-content-item-text">
                    <ul>
                      <li>
                        <Link to={`/ProductDetail`} style={{ textDecoration: "none", color: "inherit" }}>
                          {product.name} <br /> {product.capacity}
                        </Link>
                      </li>
                      <li>Online giá rẻ</li>
                      <li>{product.price}<sup>đ</sup></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Band;
