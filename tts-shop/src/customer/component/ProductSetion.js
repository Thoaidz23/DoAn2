import React, { useState, useEffect, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProductSection({ title, visibleProducts, handleNext, handlePrev, brandsByCategory = {}, id_category_product }) {
  const [filteredProducts, setFilteredProducts] = useState(visibleProducts);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredProducts(visibleProducts);
  }, [visibleProducts]);

  const brands = useMemo(() => brandsByCategory[id_category_product] || [], [id_category_product, brandsByCategory]);

  const handleBrandClick = (id_category_brand, id_category_product) => {
    // Thêm chút thời gian delay để chắc chắn component cập nhật trước khi chuyển hướng
    setTimeout(() => {
      navigate(`/SearchProduct?brand=${id_category_brand}&category=${id_category_product}`);
    }, 300);
  };
  

  return (
    <div className="section-product-one-content">
      {handlePrev && (
          <div className="section-product-one-content-btn section-prev-btn" onClick={handlePrev}>
            <FaChevronLeft />
          </div>
        )}
        {handleNext && (
          <div className="section-product-one-content-btn section-next-btn" onClick={handleNext}>
            <FaChevronRight />
          </div>
        )}
        
      <div className="container">
        <div className="section-product-one-content-title-with-buttons">
          <h2>{title}</h2>
          <div className="product-filter-buttons">
            {brands.length > 0 ? (
              brands.map((brand) => (
                <button
                  key={brand.id_category_brand}
                  className="brand-button"
                  onClick={() => handleBrandClick(brand.id_category_brand,id_category_product)}
                >
                  {brand.name_category_brand}
                </button>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>

        <div className="section-product-one-content-items">
        {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                className="section-product-one-content-item"
                key={`${title}-${index}`}
                onClick={() => navigate(`/product/${product.id_group_product}`)}
                style={{ cursor: "pointer",width:"230px",margin:"0 5px 0 5px" }}
              >
                <img
                  src={`http://localhost:5000/images/product/${product.image}`}
                  alt={product.alt || product.name_group_product}
                  style={{height:"200px"}}
                />
                <div className="section-product-one-content-item-text">
                  <ul>
                    <li>{product.name_group_product}</li>
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
            <p>Không có sản phẩm nào</p>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductSection;
