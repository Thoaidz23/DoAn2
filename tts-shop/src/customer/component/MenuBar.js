import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMobileAlt,
  FaDesktop,
  FaLaptop,
  FaTabletAlt,
  FaHeadphones,
  FaClock,
  FaTv,
  FaAngleRight
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/menubar.scss";
import "../styles/index.scss";

function MenuBar() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const brands = {
    "dien-thoai": {
      title1: "Hãng điện thoại",
      items1: [
        "iPhone", "Samsung", "Xiaomi", "OPPO", "realme", "TECNO", "vivo", "Infinix",
        "Nokia", "Nubia", "Nothing Phone HOT and NEW", "Masstel", "Sony", "Itel", "Điện thoại phổ thông"
      ],
      title2: "Mức giá điện thoại",
      items2: [
        "Dưới 2 triệu", "Từ 2 - 4 triệu", "Từ 4 - 7 triệu",
        "Từ 7 - 13 triệu", "Từ 13 - 20 triệu", "Trên 20 triệu"
      ]
    },
    "laptop": {
      title1: "Thương hiệu",
      items1: [
        "Mac", "ASUS", "Lenovo", "Dell", "HP", "Acer",
        "LG", "Huawei", "MSI", "Gigabyte", "Vaio", "Masstel"
      ],
      title2: "Phân khúc giá",
      items2: [
        "Dưới 10 triệu", "Từ 10 - 15 triệu", "Từ 15 - 20 triệu",
        "Từ 20 - 25 triệu", "Từ 25 - 30 triệu"
      ]
    },
    "tivi": {
      title1: "Chọn theo hãng",
      items1: [
        "Samsung", "LG", "Xiaomi", "Coocaa", "Sony", "Toshiba", "TCL", "Hisense", "Aqua HOT and NEW"
      ],
      title2: "Chọn theo mức giá",
      items2: [
        "Dưới 5 triệu", "Từ 5 - 9 triệu", "Từ 9 - 12 triệu",
        "Từ 12 - 15 triệu", "Trên 15 triệu"
      ]
    },
    "dong-ho": {
      title1: "Loại đồng hồ",
      items1: [
        "Đồng hồ thông minh", "Vòng đeo tay thông minh", "Đồng hồ định vị trẻ em", "Dây đeo"
      ],
      title2: "Chọn theo thương hiệu",
      items2: [
        "Apple Watch", "Samsung", "Xiaomi", "Huawei", "Coros", "Garmin",
        "Kieslect", "Amazfit", "Black Shark", "Mibro", "Masstel",
        "imoo", "Kospet", "MyKID"
      ]
    },
    "tai-nghe": {
      title1: "Hãng tai nghe",
      items1: [
        "Apple", "Sony", "JBL", "Samsung", "Marshall", "Soundpeats", "Bose", "Edifier", "Xiaomi"
      ],
      title2: "Chọn theo giá",
      items2: [
        "Tai nghe dưới 200K",
        "Tai nghe dưới 500K",
        "Tai nghe dưới 1 triệu",
        "Tai nghe dưới 2 triệu",
        "Tai nghe dưới 5 triệu"
      ]
    },
    "tablet": {
      title1: "Hãng máy tính bảng",
      items1: ["iPad", "Samsung Tab", "Lenovo", "Xiaomi", "Nokia", "Masstel", "Kindle"],
      title2: "Phân khúc giá",
      items2: [
        "Dưới 3 triệu", "Từ 3 - 7 triệu", "Từ 7 - 10 triệu",
        "Từ 10 - 15 triệu", "Trên 15 triệu"
      ]
    },
    "pc": {
      title1: "Thương hiệu PC",
      items1: ["Dell", "HP", "Lenovo", "ASUS", "MSI", "Acer", "Gigabyte"],
      title2: "Mức giá",
      items2: [
        "Dưới 10 triệu", "Từ 10 - 15 triệu", "Từ 15 - 20 triệu",
        "Trên 20 triệu"
      ]
    }
  };
  

  const menuItems = [
    { to: "/dien-thoai", icon: <FaMobileAlt />, label: "Điện thoại", key: "dien-thoai" },
    { to: "/pc", icon: <FaDesktop />, label: "PC", key: "pc" },
    { to: "/laptop", icon: <FaLaptop />, label: "Laptop", key: "laptop" },
    { to: "/tablet", icon: <FaTabletAlt />, label: "Tablet", key: "tablet" },
    { to: "/tai-nghe", icon: <FaHeadphones />, label: "Tai nghe", key: "tai-nghe" },
    { to: "/dong-ho", icon: <FaClock />, label: "Đồng hồ", key: "dong-ho" },
    { to: "/tivi", icon: <FaTv />, label: "Tivi", key: "tivi" }
  ];

  return (
    <div className="container">
      <div className="menu-bar">
        <h3 className="menu-title">Danh mục</h3>
        <ul className="menubar-nav">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className="menu-item"
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link className="nav-link" to={item.to}>
                {item.icon}
                <span className="menu-label">{item.label}</span>
                <span className="expand-icon">
                  <FaAngleRight />
                </span>
              </Link>

              {/* Hover Panel */}
              {hoveredItem === item.key && (
                <div className="hover-panel">
                  {brands[item.key]?.title1 && brands[item.key]?.items1 ? (
                    <div className="panel-columns">
                      <div className="panel-column">
                        <h6>{brands[item.key].title1}</h6>
                        <ul>
                          {brands[item.key].items1.map((brand, index) => (
                            <li key={index}>{brand}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="panel-column">
                        <h6>{brands[item.key].title2}</h6>
                        <ul>
                          {brands[item.key].items2.map((price, index) => (
                            <li key={index}>{price}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <ul>
                      {brands[item.key]?.map((brand, index) => (
                        <li key={index}>{brand}</li>
                      ))}
                    </ul>
                  )}
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
