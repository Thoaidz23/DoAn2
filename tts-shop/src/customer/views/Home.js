import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "../styles/home.scss";
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/newbar.scss"
import ProductSection from "../component/ProductSetion";
import MenuBar from "../component/MenuBar";
import ChatWidget from "../component/chatai";


function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const  [banner,setBanner]  = useState([])
  const [brandsByCategory, setBrandsByCategory] = useState({}); // <-- Chuyển dòng này lên đây
  const [indexMap, setIndexMap] = useState({});
  const [loading, setLoading] = useState(true);
  const visibleCount = 5;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/Home")
    .then((response) => {
      setProducts(response.data.products || []);
      setCategories(response.data.categories || []);
      setBrands(response.data.brands || []);
      setBrandsByCategory(response.data.brandsByCategory || {});
      setPosts(response.data.posts || []); 
      setBanner(response.data.banner || [])
      console.log("brandsByCategory >>>", response.data.brandsByCategory); // 👈 THÊM DÒNG NÀY
  
      setLoading(false);  
    })
  ;
  }, []);

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.id_category_product]) {
      acc[product.id_category_product] = [];
    }
    acc[product.id_category_product].push(product);
    return acc;
  }, {});

  const handleNext = (id_category_product) => {
    const list = groupedProducts[id_category_product];
    const currentIndex = indexMap[id_category_product] || 0;
    const nextIndex = currentIndex + visibleCount < list.length ? currentIndex + 1 : 0;
    setIndexMap((prev) => ({ ...prev, [id_category_product]: nextIndex }));
  };

  const handlePrev = (id_category_product) => {
    const list = groupedProducts[id_category_product] || [];
    const currentIndex = indexMap[id_category_product] || 0;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : Math.max(0, list.length - visibleCount);
    setIndexMap((prev) => ({ ...prev, [id_category_product]: prevIndex }));
  };
  const formatDate = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const vnTime = new Date(date.getTime()); // Cộng 7 tiếng
  
    const day = vnTime.getDate().toString().padStart(2, '0');
    const month = (vnTime.getMonth() + 1).toString().padStart(2, '0');
    const year = vnTime.getFullYear();
    const hours = vnTime.getHours().toString().padStart(2, '0');
    const minutes = vnTime.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  if (loading) return <div className="text-center mt-4">Đang tải dữ liệu...</div>;

  return (
    <div className="Home">
      <div className="container">
        <div className="menu-wrapper">
          <MenuBar />
        </div>

        <div className="content">
          <div className="banner">
            <Carousel>
            {banner.map((bannera, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={`http://localhost:5000/images/banner/${bannera.image}`}
                    alt={`Banner ${index + 1}`}
                    className="d-block w-100 banner-item"
                  />
                </Carousel.Item>
              ))}
              {/* <Carousel.Item>
                <img src={banner1} alt="Banner 1" className="d-block w-100 banner-item" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={banner2} alt="Banner 2" className="d-block w-100 banner-item" />
              </Carousel.Item>
              <Carousel.Item>
                <img src={banner3} alt="Banner 3" className="d-block w-100 banner-item" />
              </Carousel.Item> */}
            </Carousel>
          </div>
        </div>

        {/* Hiển thị từng danh mục sản phẩm */}
        {Object.entries(groupedProducts).map(([id_category_product, productList]) => {
          if (!productList || productList.length === 0) return null;

          const index = indexMap[id_category_product] || 0;
          const visibleProducts = productList.slice(index, index + visibleCount);
          const category = categories.find((cat) => cat.id_category_product === Number(id_category_product));
          const title = category ? category.name_category_product : `Danh Mục ${id_category_product}`;

          return (
            <ProductSection
            key={id_category_product}
            title={title}
            visibleProducts={visibleProducts}
            handleNext={() => handleNext(Number(id_category_product))}
            handlePrev={() => handlePrev(Number(id_category_product))}
            brandsByCategory={brandsByCategory}
            id_category_product={Number(id_category_product)} 
          />
          );
        })}

        <div className="mb-5">
                <div className="content-title-newbar mt-4 d-flex justify-content-between align-items-center">
                  <h2>Bài viết mới nhất</h2>
                  <Link to={`/Catalognews/`} className="see-all-newbar">Xem tất cả</Link>
                </div>
                <div className="news-wrapper">
                  <div className="container">
                    <div className="row gx-2 gy-3">
                      {posts.slice(0,4).map((item) => (
                        <div className="col-md-3" key={item.id_post}>
                          <div className="card h-100 shadow-sm">
                            <div className="position-relative">
                            <Link to={`/postdetail/${item.id_post}`}>
                              <img
                                src={`http://localhost:5000/images/post/${item.image}`} // Đảm bảo rằng API trả về hình ảnh đúng
                                className="card-img-top rounded"
                                alt={item.title}
                                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                              /> </Link>
                            </div>
                            <div className="card-body p-2 pb-0">
                              <h6 className="card-title fw-bold">{item.title}</h6>
                              <div className="text-muted small d-flex flex-wrap align-items-center mt-0 mb-1">
                                <div className="me-5" >
                                  <i className="bi bi-person-circle me-1"></i>
                                  <span className="me-5">{item.author}</span>
                                </div>
                                <div className="me-5"></div>
                                <div>
                                  <i className="bi bi-clock me-1 "></i>
                                  <span>{formatDate(item.date)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

        <div className="footer-spacing"></div>
      </div>
      <ChatWidget />
    </div>
  );
}

export default Home;
