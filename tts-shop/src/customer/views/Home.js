import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MenuBar from "../component/MenuBar";
import { Carousel } from "react-bootstrap";
import "../styles/home.scss";
import "../styles/index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ProductSection from "../component/ProductSetion";
import banner1 from "../assets/img/xiaomi-14-web.jpg";
import banner2 from "../assets/img/banner2.jpg";
import banner3 from "../assets/img/banner3.jpg";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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

  const newsList = [
    {
      id: 1,
      title: "Rò rỉ cấu hình chi tiết Galaxy Z...",
      description: "Đây là mô tả ngắn cho bài viết số 1.",
      image: "https://cdn-media.sforum.vn/storage/app/media/thanhdat/2025/danh-gia-huawei-pura-x/danh-gia-huawei-pura-x-thumb.jpg",
    },
  ];

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

        {/* Tin tức */}
        <div className="container">
          <div className="section-product-one-content-title-with-buttons">
            <h2>Bài viết</h2>
            <Link to="/Catalognews" className="see-all">
              Xem tất cả
            </Link>
          </div>
          <div className="news-wrapper" style={{ margin: "10px" }}>
            <div className="row gx-2 gy-2">
              {posts.map((item) => (
                <div className="col-md-3" key={item.id_post}>
                  <div className="card h-100">
                    <div className="image-wrapper p-1">
                      <img src={`http://localhost:5000/images/product/${item.image}`} className="card-img-top rounded" alt={item.title} />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.content.slice(0,100)}...</p>
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

export default Home;
