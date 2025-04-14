import React, { useState } from "react";
import Navbar from "../component/NavBar";
import MenuBar from "../component/MenuBar";
import { Carousel } from "react-bootstrap";
import "../styles/home.scss";
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Footer from "../component/Footer";
import banner1 from "../assets/img/xiaomi-14-web.jpg";
import banner2 from "../assets/img/banner2.jpg";
import banner3 from "../assets/img/banner3.jpg";

function Home() {
  const [phoneIndex, setPhoneIndex] = useState(0);
  const [laptopIndex, setLaptopIndex] = useState(0);
  const [tvIndex, setTvIndex] = useState(0);
  const visibleCount = 5;
  const newsList = [
    {
      id: 1,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z... ',
      description: 'Đây là mô tả ngắn cho bài viết số 1.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
    },
    {
      id: 2,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 2.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
    },
    {
      id: 3,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 3.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
    },
    {
      id: 4,
      title: 'Rò rỉ cấu hình chi tiết Galaxy Z...',
      description: 'Đây là mô tả ngắn cho bài viết số 4.',
      image: 'https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg',
    },
  ];

  const products = [
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg",
      alt: "iPhone 16 Pro Max",
      name: "iPhone 16 Pro Max",
      capacity: "512GB",
      price: "39.900.000",
    },
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg",
      alt: "iPhone 16 Pro Max",
      name: "iPhone 16 Pro Max",
      capacity: "512GB",
      price: "39.900.000",
    },
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-den.png",
      alt: "iPhone 16 Plus",
      name: "iPhone 16 Plus",
      capacity: "256GB",
      price: "29.900.000",
    },
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/329150/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg",
      alt: "iPhone 16 Pro Max",
      name: "iPhone 16 Pro Max",
      capacity: "512GB",
      price: "39.900.000",
    },
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/329135/iphone-16-blue-600x600.png",
      alt: "iPhone 16",
      name: "iPhone 16",
      capacity: "128GB",
      price: "22.900.000",
    },
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-gold-thumbnew-600x600.jpg",
      alt: "iPhone 15 Pro Max",
      name: "iPhone 15 Pro Max",
      capacity: "256GB",
      price: "30.000.000",
    },
    {
      img: "https://cdn.tgdd.vn/Products/Images/42/303823/iphone-15-plus-xanh-la-256gb-thumb-600x600.jpg",
      alt: "iPhone 15 Plus",
      name: "iPhone 15 Plus",
      capacity: "256GB",
      price: "25.900.000",
    },
  ];

  const handleNext = (type) => {
    if (type === "phone" && phoneIndex + visibleCount < products.length) {
      setPhoneIndex((prev) => prev + 1);
    }
    if (type === "laptop" && laptopIndex + visibleCount < products.length) {
      setLaptopIndex((prev) => prev + 1);
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
    if (type === "tv" && tvIndex > 0) {
      setTvIndex((prev) => prev - 1);
    }
  };

  const visiblePhones = products.slice(phoneIndex, phoneIndex + visibleCount);
  const visibleLaptops = products.slice(laptopIndex, laptopIndex + visibleCount);
  const visibleTvs = products.slice(tvIndex, tvIndex + visibleCount);

  return (
    <div>
      <Navbar />
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

        {/* ĐIỆN THOẠI */}
        <div className="section-product-one-content">
          <div className="section-product-one-content-btn section-prev-btn" onClick={() => handlePrev("phone")}>
            <FaChevronLeft />
          </div>
          <div className="section-product-one-content-btn section-next-btn" onClick={() => handleNext("phone")}>
            <FaChevronRight />
          </div>
          <div className="container">
            <div className="section-product-one-content-title-with-buttons">
              <h2>Điện Thoại Nổi Bật</h2>
              <div className="product-filter-buttons">
                <button className="brand-button">Apple</button>
                <button className="brand-button">Oppo</button>
                <button className="brand-button">Samsung</button>
                <button className="brand-button">Xiaomi</button>
                <button className="brand-button">Xem tất cả</button>
              </div>
            </div>
            <div className="section-product-one-content-items">
              {visiblePhones.map((product, index) => (
                <div className="section-product-one-content-item" key={`phone-${index}`}>
                  <img src={product.img} alt={product.alt} />
                  <div className="section-product-one-content-item-text">
                    <ul>
                      <li>{product.name} <br /> {product.capacity}</li>
                      <li>Online giá rẻ</li>
                      <li>{product.price}<sup>đ</sup></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LAPTOP */}
        <div className="section-product-one-content">
          <div className="section-product-one-content-btn section-prev-btn" onClick={() => handlePrev("laptop")}>
            <FaChevronLeft />
          </div>
          <div className="section-product-one-content-btn section-next-btn" onClick={() => handleNext("laptop")}>
            <FaChevronRight />
          </div>
          <div className="container">
            <div className="section-product-one-content-title-with-buttons">
              <h2>Máy Tính Nổi Bật</h2>
              <div className="product-filter-buttons">
                <button className="brand-button">Asus</button>
                <button className="brand-button">MacBook</button>
                <button className="brand-button">Dell</button>
                <button className="brand-button">Lenovo</button>
                <button className="brand-button">Xem tất cả</button>
              </div>
            </div>
            <div className="section-product-one-content-items">
              {visibleLaptops.map((product, index) => (
                <div className="section-product-one-content-item" key={`laptop-${index}`}>
                  <img src={product.img} alt={product.alt} />
                  <div className="section-product-one-content-item-text">
                    <ul>
                      <li>{product.name} <br /> {product.capacity}</li>
                      <li>Online giá rẻ</li>
                      <li>{product.price}<sup>đ</sup></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIVI */}
        <div className="section-product-one-content">
          <div className="section-product-one-content-btn section-prev-btn" onClick={() => handlePrev("tv")}>
            <FaChevronLeft />
          </div>
          <div className="section-product-one-content-btn section-next-btn" onClick={() => handleNext("tv")}>
            <FaChevronRight />
          </div>
          <div className="container">
            <div className="section-product-one-content-title-with-buttons">
              <h2>Tivi Nổi Bật</h2>
              <div className="product-filter-buttons">
                <button className="brand-button">LG</button>
                <button className="brand-button">Samsung</button>
                <button className="brand-button">TCL</button>
                <button className="brand-button">Xem tất cả</button>
              </div>
            </div>
            <div className="section-product-one-content-items">
              {visibleTvs.map((product, index) => (
                <div className="section-product-one-content-item" key={`tv-${index}`}>
                  <img src={product.img} alt={product.alt} />
                  <div className="section-product-one-content-item-text">
                    <ul>
                      <li>{product.name} <br /> {product.capacity}</li>
                      <li>Online giá rẻ</li>
                      <li>{product.price}<sup>đ</sup></li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="container">
  <div className="section-product-one-content-title-with-buttons">
    <h2>Bài viết</h2>
    <button className="see-all">Xem tất cả</button>
  </div>

  <div className="news-wrapper" style={{ margin: '10px' }}>
    <div className="container">
      {/* Giảm khoảng cách giữa các bài viết */}
      <div className="row gx-2 gy-2">
        {newsList.map((item) => (
          <div className="col-md-3" key={item.id}>
            <div className="card h-100">
              {/* Giảm padding hình ảnh */}
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
</div>

      </div>
      <div className = "footer-spacing">
      <Footer ></Footer>
      </div>
    </div>
  );
}

export default Home;
