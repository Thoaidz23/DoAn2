import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/SearchProduct.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import TopHeadBar from "../component/TopHeadBar";
import Pagination from "../component/Pagination";

function Product() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [specs, setSpecs] = useState("");

  const query = new URLSearchParams(location.search);
  const brandId = query.get("brand");
  const categoryId = query.get("category");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
  const brand = query.get("brand");
  const category = query.get("category");
  const search = query.get("search");
  const specsQuery = query.get("specs");
  const categorySearch = query.get("category_search");
  const price = query.get("price"); // <-- thêm dòng này

  setSearchText(search || "");
  setSpecs(specsQuery || "");
  setCurrentPage(1);

  axios.get(`http://localhost:5000/api/searchproduct`, {
    params: { brand, category, search, specs: specsQuery, category_search: categorySearch, price } // <-- gửi price lên backend
  })
  .then(res => {
    const data = Array.isArray(res.data) ? res.data : [];
    setProducts(data);
    setFiltered(data);

    if (data.length > 0) {
      setCategoryName(category ? data[0]?.name_category_product || "" : "");
      setBrandName(brand ? data[0]?.name_category_brand || "" : "");
    }
  })
  .catch(err => { console.error(err); setProducts([]); setFiltered([]); });
}, [location.search]);


  const cleanText = (text) => text ? text.replace(/&nbsp;/g, ' ').trim() : "";

  const getTitleText = () => {
    const totalCount = products.length;
    let title = `Tìm thấy ${totalCount} sản phẩm`;
    let keywordDisplay = "";

    if (searchText) keywordDisplay += ` "${searchText}"`;
    if (specs) keywordDisplay += ` (Filter: ${specs.split(',').join(', ')})`;
    if (categoryName) keywordDisplay += ` Danh mục: ${categoryName}`;
    if (brandName) keywordDisplay += ` Hãng: ${brandName}`;
    if (!searchText && !specs && !categoryName && !brandName) return `Tìm kiếm chung`;

    return `${title} cho từ khóa${keywordDisplay}`;
  };

  return (
    <div>
      <TopHeadBar searchText={searchText} categoryName={categoryName} brandName={brandName} categoryID={categoryId} brandID={brandId} />
      <div className="container-search">
        <div className="product-one-content" style={{ maxWidth: "1800px", margin: "auto" }}>
          <div className="container">
            <div className="product-one-content-title">
              <h2 style={{ margin: "10px 0 20px 0", width: "1200px", textAlign: "center" }}>
                <strong>{cleanText(getTitleText())}</strong>
              </h2>
            </div>
            <div className="product-one-content-items">
              {filtered.length > 0 ? currentProducts.map(product => (
                <div className="product-one-content-item" key={product.id_group_product}>
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
                          <li className="old-price">{Math.round(product.price).toLocaleString()}<sup>đ</sup></li>
                          <li className="new-price">{Math.round(product.saleprice).toLocaleString()}<sup>đ</sup></li>
                          <li className="sale-badge">Giảm {product.sale}%</li>
                        </>
                      ) : (
                        <li className="new-price">{Math.round(product.price).toLocaleString()}<sup>đ</sup></li>
                      )}
                    </ul>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: "center", marginTop: "50px" ,marginLeft:"50%"}}>
                  <img src="no-products.png" alt="Không có sản phẩm" />
                  <p>Không tìm thấy sản phẩm nào.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>
  );
}

export default Product;
