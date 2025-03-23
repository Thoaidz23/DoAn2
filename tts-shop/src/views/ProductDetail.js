import React from "react";
import "../styles/ProductDetail.scss"; 
import Layout from "../component/Layout.js"
import Primg from "../assets/img/img1.png"

function ProductDetail() {
  return (
    <Layout>
    <div className="product-detail">
      {/* Bên trái - Ảnh, Tên, Mô tả */}
      <div className="product-left">
        <h1 className="product-title">Xiaomi Redmi Note 14 6GB 128GB </h1>
        <img src ={Primg}/> 
        <p className="product-description">Đây là mô tả chi tiết về sản phẩm...</p>
      </div>

      {/* Bên phải - Giá, Nút, Tin tức */}
      <div className="product-right">
        <p className="product-price">$1,200</p>
        <button className="btn buy-btn">Mua Ngay</button>
        <button className="btn cart-btn">Thêm vào Giỏ Hàng</button>
        <h3 className="news-title">Tin tức liên quan</h3>
        <ul className="news-list">
          <li><a href="#">Bài viết 1</a></li>
          <li><a href="#">Bài viết 2</a></li>
          <li><a href="#">Bài viết 3</a></li>
        </ul>
      </div>
    </div>
    </Layout>
  );
};

export default ProductDetail;