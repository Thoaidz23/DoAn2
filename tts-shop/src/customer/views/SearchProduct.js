import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/SearchProduct.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";
import TopHeadBar from "../component/TopHeadBar.js"; // Cập nhật đường dẫn theo vị trí thực tế


function Product() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

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
  }, [location.search]); // 👈 theo dõi thay đổi query string
  
  

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

  return (
    <div>

         <TopHeadBar
  searchText={searchText}
  categoryName={filtered[0]?.name_category_brand || filtered[0]?.name_category_product}
/>

      <div className="container-search">
        <div className="product-one-content" style={{maxWidth:"1200px"}}>
          <div className="container">
            <div className="product-one-content-title">
              <h2 style={{marginLeft:"100px"}}>Kết quả tìm kiếm</h2>
            </div>

            <div className="product-one-content-items"style={{width:"100%",margin:"0 0 10% 14%"}}>
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <div className="product-one-content-item" key={product.id_group_product} style={{width:"21.7%"}}>
                    <Link to={`/product/${product.id_group_product}`}>
                      <img src={`http://localhost:5000/images/product/${product.image}`} alt={product.name_group_product} />
                    </Link>
                    <div className="product-one-content-item-text">
                      <ul>
                        <li>
                          <Link to={`/product/${product.id_group_product}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                <img src="no-products.png" alt="Không có sản phẩm" style={{margin:"0 0 0 15%"}} />

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
