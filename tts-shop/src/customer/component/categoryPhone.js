import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/categoryPhone.scss";
import { useNavigate } from "react-router-dom";

function CategoryPhone() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [brandsByCategory, setBrandsByCategory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/category").then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setSelectedCategoryId(res.data[0].id_category_product);
      }
    });
  }, []);

  useEffect(() => {
    if (
      selectedCategoryId &&
      !brandsByCategory[selectedCategoryId]
    ) {
      axios
        .get(`http://localhost:5000/api/category/${selectedCategoryId}/brands`)
        .then((res) => {
          setBrandsByCategory((prev) => ({
            ...prev,
            [selectedCategoryId]: res.data,
          }));
        });
    }
  }, [selectedCategoryId]);

  const handleBrandClick = (brandId) => {
    navigate(`/SearchProduct?category=${selectedCategoryId}&brand=${brandId}`);
  };

  return (
    <div className="category-phone">
      <div className="category-list">
        {categories.map((cat) => (
          <div
            key={cat.id_category_product}
            className={`category-item ${
              cat.id_category_product === selectedCategoryId ? "active" : ""
            }`}
            onClick={() => setSelectedCategoryId(cat.id_category_product)}
          >
            {cat.name_category_product}
          </div>
        ))}
      </div>
<div className="category-details">
  <h6>Thương hiệu</h6>
  <div className="brand-grid">
    {brandsByCategory[selectedCategoryId]?.length > 0 ? (
      brandsByCategory[selectedCategoryId].map((brand) => (
        <div
          key={brand.id_category_brand}
          className="brand-item"
          onClick={() => handleBrandClick(brand.id_category_brand)}
        >
          {brand.name_category_brand}
        </div>
      ))
    ) : (
      <div>Đang tải...</div>
    )}
  </div>
</div>

    </div>
  );
}

export default CategoryPhone;
