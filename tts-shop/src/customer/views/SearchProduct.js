import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/SearchProduct.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

function Product() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  console.log(filtered)
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const brandId = query.get("brand");
  const categoryId = query.get("category");
  const searchText = query.get("search");
  const price = query.get("price");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const brand = query.get("brand");
    const category = query.get("category");
    const search = query.get("search");
    const price = query.get("price");
    
    console.log("Request params:", { brand, category, search, price }); 

    axios.get(`http://localhost:5000/api/searchproduct`, {
      params: {
        brand,
        category,
        search,
        price,
      },
    })
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error(err);
        setProducts([]);
      });
  }, [location.search]);


  useEffect(() => {
    let result = [...products];

    if (brandId) {
      result = result.filter((p) => String(p.id_category_brand) === brandId);
    }
    
    if (categoryId) {
      result = result.filter((p) => String(p.id_category_product) === categoryId);
    }
    

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter((p) => p.name_group_product.toLowerCase().includes(searchLower));
    }

    setFiltered(result);
  }, [brandId, categoryId, searchText, products]);
  console.log(searchText)
  return (
    <div>
                  <div className="container-detail_bar pt-2">
              <div className="container">
                <p><i className="bi bi-house-door-fill"></i> Trang chủ</p>
                <i className="bi bi-chevron-right breadcrumb-icon"></i>
                <p>
                  {searchText
                    ? searchText
                    : ( filtered[0]?.name_category_brand ||filtered[0]?.name_category_product )}
                </p>
              </div>
            </div>

      <div className="container-search">
        <div className="product-one-content">
          <div className="container">
          <div className="product-one-content-title">
              <h2>Kết quả tìm kiếm</h2>
            </div>
            <div className="product-one-content-items">
              
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  
                  <div className="product-one-content-item" key={product.id_group_product}  onClick={() => navigate(`/product/${product.id_group_product}`)}>
                    
                    <Link to={`/ProductDetail/${product.id_group_product}`}>
                      <img src={`http://localhost:5000/images/product/${product.image}`} alt={product.name_group_product} />
                    </Link>
                    <div className="product-one-content-item-text">
                      <ul>
                        <li>
                          <Link to={`/ProductDetail/${product.id_group_product}`} style={{ textDecoration: "none", color: "inherit" }}>
                            {product.name_group_product}
                          </Link>
                        </li>
                        <li>Online giá rẻ</li>
                        <li>{product.price}<sup>đ</sup></li>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div role="status" style={{margin:"20% auto 30% 20%",display:"flex"}}>
                  <img style={{width:"50%"}} src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/search/6724b074573bd78dea13.png" />
                  <div style={{fontSize:"24px",margin:"15% 10% 0 0 "}}>Không tìm thấy kết quả nào</div>
               </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
