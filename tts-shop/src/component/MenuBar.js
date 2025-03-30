import React from "react";
import { Link } from "react-router-dom";
import { FaMobileAlt, FaDesktop, FaLaptop, FaTabletAlt, FaHeadphones, FaClock, FaTv } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/menubar.scss';
import '../styles/index.scss';

function MenuBar() {
  return (
    <div className="container">
      <div className="menu-bar">
        <ul className="menubar-nav">
          <li className="menu-item">
            <Link className="nav-link" to="/dien-thoai">
              <FaMobileAlt /> Điện thoại
            </Link>
          </li>
          <li className="menu-item">
            <Link className="nav-link" to="/pc">
              <FaDesktop /> PC
            </Link>
          </li>
          <li className="menu-item">
            <Link className="nav-link" to="/laptop">
              <FaLaptop /> Laptop
            </Link>
          </li>
          <li className="menu-item">
            <Link className="nav-link" to="/tablet">
              <FaTabletAlt /> Tablet
            </Link>
          </li>
          <li className="menu-item">
            <Link className="nav-link" to="/tai-nghe">
              <FaHeadphones /> Tai nghe
            </Link>
          </li>
          <li className="menu-item">
            <Link className="nav-link" to="/dong-ho">
              <FaClock /> Đồng hồ
            </Link>
          </li>
          <li className="menu-item">
            <Link className="nav-link" to="/tivi">
              <FaTv /> Tivi
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MenuBar;
