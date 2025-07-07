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
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [searchText, setSearchText] = useState("");

  const query = new URLSearchParams(location.search);
  const brandId = query.get("brand");
  const categoryId = query.get("category");


  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const brand = query.get("brand");
    const category = query.get("category");
    const search = query.get("search");
    const price = query.get("price");
     setSearchText(search || ""); 

    axios.get(`http://localhost:5000/api/searchproduct`, {
      params: {
        brand,
        category,
        search,
        price,
      },
    } )
      .then((res) => {
  const data = Array.isArray(res.data) ? res.data : [];
  setProducts(data);

  if (data.length > 0) {
    if (category) setCategoryName(data[0]?.name_category_product || "");
    if (brand) setBrandName(data[0]?.name_category_brand || "");
  }
})

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
          categoryName={categoryName}
          brandName={brandName}
        />

      <div className="container-search">
        <div className="product-one-content" style={{maxWidth:"1800px",margin:"auto"}}>
          <div className="container">
            <div className="product-one-content-title">
              {searchText === "" ?(
                <>
                   <h2 style={{margin:"10px 0 20px 0",width:"1200px",textAlign:"center"}}>Tìm thấy {products.length} sản phẩm "<strong>{categoryName} {brandName}</strong>"</h2>
                </>
              ) : (
                <>
                  <h2 style={{margin:"10px 0 20px 0",width:"1200px",textAlign:"center"}}>Tìm thấy {products.length} sản phẩm cho từ khóa "<strong>{searchText}</strong>"</h2>
                </>
              )}
              
            </div>
            <div className="product-one-content-items">
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <div className="product-one-content-item" key={product.id_group_product} >
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
                         {product.sale > 0 ? (
                        <>
                          <li className="old-price">
                            {Math.round(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup>
                          </li>
                          <li className="new-price">
                            {Math.round(product.saleprice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup>
                          </li>
                          <li className="sale-badge">Giảm {product.sale}%</li>
                        </>
                      ) : (
                        <li className="new-price">
                          {Math.round(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}<sup>đ</sup>
                        </li>
                      )}
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
