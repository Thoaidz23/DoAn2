import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser, FaHistory } from "react-icons/fa";
import logo from "../assets/img/logo.png";
import logo1 from "../assets/img/logo1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.scss";

function Navbar() {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showError, setShowError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const navigate = useNavigate();

  // Load brands
  useEffect(() => {
    axios.get("http://localhost:5000/api/cagbrands")
      .then(res => setBrands(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load categories
  useEffect(() => {
    axios.get("http://localhost:5000/api/category")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);
const parseSearchQuery = (searchText, categories = [], brands = []) => {
  const removeVN = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const textNoVN = removeVN(searchText.trim());
  const textRaw = searchText.trim();

  let categoryId = null;
  let brandId = null;
  let specsArray = [];

  // ================================
  // 1) Detect CATEGORY (không dấu)
  // ================================
  categories.forEach(c => {
    const cateName = removeVN(c.name_category_product);
    if (textNoVN.includes(cateName)) {
      categoryId = c.id_category_product;
    }
  });

  // ================================
  // 2) Detect BRAND (không dấu)
  // ================================
  brands.forEach(b => {
    const brandName = removeVN(b.name_category_brand);
    if (textNoVN.includes(brandName)) {
      brandId = b.id_category_brand;
    }
  });

// =========================
// Detect SPEC với alias (FULL FIXED)
// =========================
const attrAlias = {
  "màu": "Màu sắc",
  "mau": "Màu sắc",
  "color": "Màu sắc",
  "ram": "RAM",
  "rom": "ROM",
  "bộ nhớ trong": "ROM",
  "dung lượng": "ROM",
  "chip": "Chipset",
  "chipset": "Chipset",
  "camera trước": "Camera trước",
  "camera sau": "Camera sau"
};

const rawTokens = searchText
  .split(",")            // chỉ tách theo dấu phẩy
  .map(t => t.trim())    // xóa khoảng trắng dư thừa
  .filter(t => t.length > 0);

rawTokens.forEach(token => {
  const tokenNoVN = removeVN(token);

  // ===== CASE 1: ram: 8GB, màu: đỏ =====
  if (token.includes(":")) {
    let [attr, val] = token.split(":").map(s => s.trim());
    const attrKey = removeVN(attr);

    const aliasKey = Object.keys(attrAlias).find(a => removeVN(a) === attrKey);
    const attribute = aliasKey ? attrAlias[aliasKey] : attr;

    if (val && val.length > 0) {
      specsArray.push({ attribute, value: val });
    }

    return;
  }

  // ===== CASE 2: ram 8GB (không dấu ":") =====
  const aliasKey = Object.keys(attrAlias).find(a =>
    tokenNoVN.startsWith(removeVN(a))
  );

  if (aliasKey) {
    const attribute = attrAlias[aliasKey];
    const value = token.substring(aliasKey.length).trim();
    if (value.length > 0) {
      specsArray.push({ attribute, value });
    }
  }
});

  // =======================================
  // 4) Nếu không category + brand + specs → search keyword
  // =======================================
  const isPureKeyword =
    !categoryId && !brandId && specsArray.length === 0;

  return {
    categoryId,
    brandId,
    search: isPureKeyword ? searchText : "",
    specs: specsArray.length
      ? specsArray.map(s => `${s.attribute}:${s.value}`).join(',')
      : ""
  };
};

  // --- Gợi ý tìm kiếm ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        axios
          .get("http://localhost:5000/api/search-suggestion", {
            params: { query: searchQuery }
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

  // --- Kích hoạt tìm kiếm ---
  const onSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;

    const { brandId, categoryId, search, specs } = parseSearchQuery(searchQuery, categories, brands);

    let url = `/SearchProduct?`;
    const queryParams = [];

    if (categoryId) queryParams.push(`category=${categoryId}`);
    if (brandId) queryParams.push(`brand=${brandId}`);
    if (specs) queryParams.push(`specs=${encodeURIComponent(specs)}`);
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);

    navigate(url + queryParams.join("&"));
    setSearchQuery("");
  };

  const handleSearch = (e) => { e.preventDefault(); onSearch(searchQuery); };

  // Cart + History
  const handleToCart = () => {
    if (user) navigate(`/cartpage/${user.id}`);
    else { setShowError(true); setTimeout(() => setShowError(false), 3000); navigate("/login"); }
  };

  const handleToHistory = () => {
    if (user) navigate(`/PurchaseHistory`);
    else { setShowError(true); setTimeout(() => setShowError(false), 3000); navigate("/login"); }
  };

  const firstName = user?.name?.split(" ").pop();

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white">
        <div className="container">
          {showError && <div className="error-message"><p>Vui lòng đăng nhập</p></div>}

          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Shop Logo" width="150" height="60" className="logo-desktop" />
            <img src={logo1} alt="Shop Logo Small" width="80" height="60" className="logo-mobile" />
          </Link>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container" style={{ position: "relative" }}>
              <input
                className="form-control search-input"
                type="search"
                placeholder="Tìm sản phẩm... (vd: điện thoại samsung, màu: đỏ, ..)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button className="search-btn" type="submit"><FaSearch /></button>

              {showSuggestions && suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.map(item => (
                    <li key={item.id_group_product} onClick={() => {
                      navigate(`/product/${item.id_group_product}`);
                      setShowSuggestions(false);
                      setSearchQuery("");
                    }}>
                      <img src={`http://localhost:5000/images/product/${item.image}`} alt={item.name_group_product} width="40" height="40"/>
                      <span>{item.name_group_product}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>

          <ul className="navbar-nav ms-auto">
            <li onClick={handleToHistory} className="nav-item hide-on-mobile" style={{ cursor: "pointer" }}>
              <div className="nav-link-item px-3"><FaHistory /> Lịch sử đơn hàng</div>
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

export default Navbar;
