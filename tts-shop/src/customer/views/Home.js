import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MenuBar from "../component/MenuBar";
import { Carousel } from "react-bootstrap";
import "../styles/home.scss";
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import banner1 from "../assets/img/xiaomi-14-web.jpg";
import banner2 from "../assets/img/banner2.jpg";
import banner3 from "../assets/img/banner3.jpg";

function Home() {
  const [products, setProducts] = useState([]);
  const [phoneIndex, setPhoneIndex] = useState(0);
  const [laptopIndex, setLaptopIndex] = useState(0);
  const [saleProductIndex, setSaleProductIndex] = useState(0);
  const [tvIndex, setTvIndex] = useState(0);
  const visibleCount = 5;

  useEffect(() => {
    axios.get("http://localhost:3001/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      });
  }, []);

  const handleNext = (type) => {
    if (type === "phone" && phoneIndex + visibleCount < products.length) {
      setPhoneIndex((prev) => prev + 1);
    }
    if (type === "laptop" && laptopIndex + visibleCount < products.length) {
      setLaptopIndex((prev) => prev + 1);
    }
    if (type === "saleProduct") {
      if (saleProductIndex + visibleCount < products.length) {
        setSaleProductIndex((prev) => prev + 1);
      } else {
        setSaleProductIndex(0);
      }
    }
    if (type === "tv" && tvIndex + visibleCount < products.length) {
      setTvIndex((prev) => prev + 1);
    }
  };

  const handlePrev = (type) => {
    if (type === "phone" && phoneIndex > 0) {
      setPhoneIndex((prev) => prev - 1);
    }
    if (type === "laptop" && laptopIndex > 0) {
      setLaptopIndex((prev) => prev - 1);
    }
    if (type === "saleProduct" && saleProductIndex > 0) {
      setSaleProductIndex((prev) => prev - 1);
    }
    if (type === "tv" && tvIndex > 0) {
      setTvIndex((prev) => prev - 1);
    }
  };

  const visiblePhones = products.slice(phoneIndex, phoneIndex + visibleCount);
  const visibleLaptops = products.slice(laptopIndex, laptopIndex + visibleCount);
  const visibleSaleProducts = products.slice(saleProductIndex, saleProductIndex + visibleCount);
  const visibleTvs = products.slice(tvIndex, tvIndex + visibleCount);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext("saleProduct");
    }, 3000);
    return () => clearInterval(interval);
  }, [saleProductIndex]);

  const newsList = [
    {
      id: 1,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 1.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
    },
    // Add more items as needed...
  ];

  return (
    <div className="Home">
      <div className="container">
        <div className="menu-wrapper">
          <MenuBar />
        </div>

        <div className="content">
          <div className="banner">
            <Carousel>
              <Carousel.Item>
                <img src={banner1} alt="Banner 1" className="d-block w-100 banner-item" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={banner2} alt="Banner 2" className="d-block w-100 banner-item" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={banner3} alt="Banner 3" className="d-block w-100 banner-item" />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>

        {/* Khuyến mãi hot */}
        <div className="sale-product">
          <div className="title-sale">Khuyến Mãi Hôm Nay</div>
          <div className="sale-product-btn section-prev-btn" onClick={() => handlePrev("saleProduct")}>
            <FaChevronLeft />
          </div>
          <div className="sale-product-btn section-next-btn" onClick={() => handleNext("saleProduct")}>
            <FaChevronRight />
          </div>
          <div className="container">
            <div className="section-product-one-content-items">
              {visibleSaleProducts.map((product, index) => (
                <div className="section-product-one-content-item" key={`sale-${index}`}>
                  <img src={product.img || product.hinhanh} alt={product.alt || product.tensanpham} />
                  <div className="section-product-one-content-item-text">
                    <ul>
                      <li>{product.name || product.tensanpham} <br /> {product.capacity || product.dungluong}</li>
                      <li>Online giá rẻ</li>
                      <li>{product.price || product.gia}<sup>đ</sup></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Điện thoại */}
        <ProductSection
          title="Điện Thoại Nổi Bật"
          visibleProducts={visiblePhones}
          handleNext={() => handleNext("phone")}
          handlePrev={() => handlePrev("phone")}
        />

        {/* Laptop */}
        <ProductSection
          title="Máy Tính Nổi Bật"
          visibleProducts={visibleLaptops}
          handleNext={() => handleNext("laptop")}
          handlePrev={() => handlePrev("laptop")}
        />

        {/* Tivi */}
        <ProductSection
          title="Tivi Nổi Bật"
          visibleProducts={visibleTvs}
          handleNext={() => handleNext("tv")}
          handlePrev={() => handlePrev("tv")}
        />

        {/* News */}
        <div className="container">
          <div className="section-product-one-content-title-with-buttons">
            <h2>Bài viết</h2>
            <Link to="/Catalognews" className="see-all">Xem tất cả</Link>
          </div>
          <div className="news-wrapper" style={{ margin: '10px' }}>
            <div className="row gx-2 gy-2">
              {newsList.map((item) => (
                <div className="col-md-3" key={item.id}>
                  <div className="card h-100">
                    <div className="image-wrapper p-1">
                      <img src={item.image} className="card-img-top rounded" alt={item.title} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-spacing"></div>
      </div>
    </div>
  );
}

// Reusable product section component
function ProductSection({ title, visibleProducts, handleNext, handlePrev }) {
  return (
    <div className="section-product-one-content">
      <div className="section-product-one-content-btn section-prev-btn" onClick={handlePrev}>
        <FaChevronLeft />
      </div>
      <div className="section-product-one-content-btn section-next-btn" onClick={handleNext}>
        <FaChevronRight />
      </div>
      <div className="container">
        <div className="section-product-one-content-title-with-buttons">
          <h2>{title}</h2>
          <div className="product-filter-buttons">
            <button className="brand-button">Apple</button>
            <button className="brand-button">Samsung</button>
            <button className="brand-button">Oppo</button>
            <button className="brand-button">Xem tất cả</button>
          </div>
        </div>
        <div className="section-product-one-content-items">
          {visibleProducts.map((product, index) => (
            <div className="section-product-one-content-item" key={`${title}-${index}`}>
              <img src={product.img || product.hinhanh} alt={product.alt || product.tensanpham} />
              <div className="section-product-one-content-item-text">
                <ul>
                  <li>{product.name || product.tensanpham} <br /> {product.capacity || product.dungluong}</li>
                  <li>Online giá rẻ</li>
                  <li>{product.price || product.gia}<sup>đ</sup></li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
