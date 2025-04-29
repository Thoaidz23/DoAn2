import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as FaIcons from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/menubar.scss";
import "../styles/index.scss";

function getIconByCategory(iconName) {
  const IconComponent = FaIcons[iconName];
  return IconComponent ? <IconComponent /> : <FaIcons.FaMobileAlt />;
}

function MenuBar() {
  const [category, setCategories] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [brandsByCategory, setBrandsByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/category")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Lỗi khi tải danh mục:", err));
  }, []);

  const handleMouseEnter = (category) => {
    setHoveredItem(category.id_category_product);

    // Nếu chưa có thương hiệu cho danh mục này thì gọi API
    if (!brandsByCategory[category.id_category_product]) {
      axios.get(`http://localhost:5000/api/category/${category.id_category_product}/brands`)
        .then(res => {
          console.log("API brands data:", res.data);
          setBrandsByCategory(prev => ({
            ...prev,
            [category.id_category_product]: res.data
          }));
        })
        .catch(err => console.error("Lỗi khi tải thương hiệu:", err));
    }
  };

  const handleBrandClick = (categoryId, brandId) => {
    navigate(`/SearchProduct?category=${categoryId}&brand=${brandId}`);
  };

  return (
    <div className="container">
      <div className="menu-bar">
        <h3 className="menu-title">Danh mục</h3>
        <ul className="menubar-nav">
          {category.map((category) => (
            <li
              key={category.id_category_product}
              className="menu-item"
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                className="nav-link"
                to={`/SearchProduct?category=${category.id_category_product}`}
                title={category.name_category_product}
              >
                {getIconByCategory(category.icon)}
                <span className="menu-label">{category.name_category_product}</span>
              </Link>

              {hoveredItem === category.id_category_product && (
                <div className="hover-panel">
                  <div className="hover-column">
                    <h6>Thương hiệu {category.name_category_product}</h6>
                    <ul>
                      {brandsByCategory[category.id_category_product] ? (
                        brandsByCategory[category.id_category_product].length > 0 ? (
                          brandsByCategory[category.id_category_product].map((brand) => (
                            <li
                              key={brand.id_category_brand}
                              onClick={() => handleBrandClick(category.id_category_product, brand.id_category_brand)}
                              className="hover-brand"
                            >
                              {brand.name_category_brand}
                            </li>
                          ))
                        ) : (
                          <li>Không có thương hiệu</li>
                        )
                      ) : (
                        <li>Đang tải...</li>
                      )}
                    </ul>
                  </div>
                  <div className="hover-column">
                    <h6>Mức giá</h6>
                    <ul>
                      <li onClick={() => navigate(`/SearchProduct?category=${category.id_category_product}&price=0-2000000`)}>Dưới 2 triệu</li>
                      <li onClick={() => navigate(`/SearchProduct?category=${category.id_category_product}&price=2000000-5000000`)}>2 - 5 triệu</li>
                      <li onClick={() => navigate(`/SearchProduct?category=${category.id_category_product}&price=5000000-10000000`)}>5 - 10 triệu</li>
                      <li onClick={() => navigate(`/SearchProduct?category=${category.id_category_product}&price=10000000-`)}>Trên 10 triệu</li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MenuBar;
