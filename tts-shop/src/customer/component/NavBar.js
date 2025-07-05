import React, { useContext, useState ,useEffect} from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import logo from "../assets/img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.scss";

function Navbar() {
  const { user } = useContext(AuthContext); // Lấy user từ context
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showError, setShowError] = useState(false); 
  // Xử lý sự kiện tìm kiếm
  const handleSearch = (event) => {
  event.preventDefault();
  onSearch(searchQuery, navigate);
};
 // Fetch gợi ý khi người dùng gõ
  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchQuery.trim()) {
     axios.get("http://localhost:5000/api/search-suggestion", {
        params: { query: searchQuery },
        })
        .then((res) => {
          console.log("Suggestions: ", res.data);
          setSuggestions(res.data.slice(0, 5));
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 300); // đợi 300ms

  return () => clearTimeout(delayDebounce); // clear nếu người dùng tiếp tục gõ
}, [searchQuery]);

  
  const navigate = useNavigate();

  const handleToCart = () => {
    if (user) {
      navigate(`/cartpage/${user.id}`);
    } else {
      setShowError(true); // Nếu chưa đăng nhập, hiển thị thông báo lỗi
      // Tắt thông báo sau 3 giây
      setTimeout(() => {
        setShowError(false); // Ẩn thông báo sau 3 giây
      }, 3000);
      navigate("/login");
    }
  };
  const handleToHistory  = () => {
    if (user) {
      navigate(`/PurchaseHistory`);
    } else {
      setShowError(true); // Nếu chưa đăng nhập, hiển thị thông báo lỗi
      // Tắt thông báo sau 3 giây
      setTimeout(() => {
        setShowError(false); // Ẩn thông báo sau 3 giây
      }, 3000);
      navigate("/login");
    }
  };

  
  const nameParts = user?.name.split(' ');
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
            <img src={logo} alt="Shop Logo" width="150px" height="60px" />
          </Link>

          {/* Thanh tìm kiếm */}
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
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // tránh mất focus khi click
              />
              <button className="search-btn" type="submit">
                <FaSearch />
              </button>

              {showSuggestions && suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.map((item) => (
                    <li
                      key={item.id_group_product}
                      onClick={() =>  navigate(`/product/${item.id_group_product}`)}
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
            <li onClick={handleToHistory} className="nav-item" style={{cursor:"pointer"}}>
              <div className="nav-link-item px-3">
                <FaHistory /> Lịch sử đơn hàng
              </div>
            </li>
            <li className="nav-item">
              <div onClick={handleToCart} className="nav-link-item px-3" style={{cursor:"pointer"}}>
                <FaShoppingCart /> Giỏ hàng
              </div>
            </li>
            <li className="nav-item">
              {user ? (
                <>
                  <Link to="/MyAccount" className="nav-link-item px-3 fw-bold">
                    <FaUser /> {firstName}
                    
                  </Link>
                </>
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

const onSearch = (searchQuery, navigate) => {
  if (searchQuery.trim()) {
    navigate(`/SearchProduct?search=${encodeURIComponent(searchQuery)}`);
  }
};


export default Navbar;