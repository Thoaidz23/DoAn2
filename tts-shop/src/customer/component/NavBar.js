import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import logo from "../assets/img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.scss";
import logo1 from "../assets/img/logo1.png";

function Navbar() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchQuery, navigate, setSearchQuery);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        axios
          .get("http://localhost:5000/api/search-suggestion", {
            params: { query: searchQuery },
          })
          .then((res) => {
            setSuggestions(res.data.slice(0, 5));
            setShowSuggestions(true);
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleToCart = () => {
    if (user) {
      navigate(`/cartpage/${user.id}`);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      navigate("/login");
    }
  };

  const handleToHistory = () => {
    if (user) {
      navigate(`/PurchaseHistory`);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      navigate("/login");
    }
  };

  const nameParts = user?.name.split(" ");
  const firstName = nameParts?.[nameParts.length - 1];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white">
        <div className="container">
          {showError && (
            <div className="error-message">
              <p>Vui lòng đăng nhập</p>
            </div>
          )}

          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Shop Logo" width="150" height="60" className="logo-desktop" />
            <img src={logo1} alt="Shop Logo Small" width="80" height="60" className="logo-mobile" />
          </Link>

          {/* Tìm kiếm */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container" style={{ position: "relative" }}>
              <input
                className="form-control search-input"
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button className="search-btn" type="submit">
                <FaSearch />
              </button>

              {showSuggestions && suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.slice(0, 4).map((item) => (
                    <li
                      key={item.id_group_product}
                      onClick={() => {
                        navigate(`/product/${item.id_group_product}`);
                        setShowSuggestions(false);
                        setSearchQuery("");
                      }}
                    >
                      <img
                        src={`http://localhost:5000/images/product/${item.image}`}
                        alt={item.name_group_product}
                        width="40"
                        height="40"
                      />
                      <span>{item.name_group_product}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>

          {/* Menu */}
          <ul className="navbar-nav ms-auto">
            <li onClick={handleToHistory} className="nav-item hide-on-mobile" style={{ cursor: "pointer" }}>
              <div className="nav-link-item px-3">
                <FaHistory /> Lịch sử đơn hàng
              </div>
            </li>
            <li className="nav-item hide-on-mobile">
              <div onClick={handleToCart} className="nav-link-item px-3" style={{ cursor: "pointer" }}>
                <FaShoppingCart /> Giỏ hàng
              </div>
            </li>
            <li className="nav-item">
              {user ? (
               <Link to="/MyAccount" className="nav-link-item px-3 fw-bold account-nav-item">
  {firstName} <FaUser />
</Link>

              ) : (
                <Link to="/login" className="nav-link-item btn btn-outline-dark nav-item-custom px-3">
                  <FaUser /> Đăng nhập
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

const onSearch = (searchQuery, navigate, setSearchQuery) => {
  if (searchQuery.trim()) {
    navigate(`/SearchProduct?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  }
};

export default Navbar;
