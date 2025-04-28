  import React, { useState, useEffect } from "react";
  import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
  import { useNavigate } from "react-router-dom";

  function ProductSection({ title, visibleProducts, handleNext, handlePrev, brandsByCategory = {}, id_category_product }) {
    const [filteredProducts, setFilteredProducts] = useState(visibleProducts);
    const navigate = useNavigate();

    useEffect(() => {
      setFilteredProducts(visibleProducts);
    }, [visibleProducts]);

    const brands = brandsByCategory[id_category_product] || [];
    
    console.log("id_category_product:", id_category_product);
    console.log("brandsByCategory[id_category_product]:", brandsByCategory[id_category_product]);
    const handleBrandClick = (id_category_brand, id_category_product) => {
      navigate(`/SearchProduct?brand=${id_category_brand}&category=${id_category_product}`);
    };
    

    return (
      <div className="section-product-one-content">
        <div className="section-product-one-content-btn section-prev-btn" onClick={handlePrev}>
          <FaChevronLeft />
        </div>
        <div className="section-product-one-content-btn section-next-btn" onClick={handleNext}>
          <FaChevronRight />
        </div>
      
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
                <p>Không có thương hiệu nào</p>
              )}
            </div>
          </div>

          <div className="section-product-one-content-items">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div className="section-product-one-content-item" key={`${title}-${index}`}>
                  <img
                    src={`http://localhost:5000/images/product/${product.image}`}
                    alt={product.alt || product.name_group_product}
                  />
                  <div className="section-product-one-content-item-text">
                    <ul>
                      <li>{product.name_group_product}</li>
                      <li>Online giá rẻ</li>
                      <li>{product.price}<sup>đ</sup></li>
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
