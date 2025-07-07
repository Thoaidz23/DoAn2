import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/comparemodal.scss';
export default function CompareModal({
  onClose,
  selected,
  setSelected,
  currentGroupId,
  currentCategoryId, // 👈 thêm dòng này
}) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const hasAddedCurrent = useRef(false);
        

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        const cleaned = res.data.map(p => ({
          ...p,
          id_product: Number(p.id_product),
          id_group_product: Number(p.id_group_product),
          name_category_product: (p.name_category_product), // 👈 đảm bảo có
        }));

        // ✅ Lọc theo id_category_product
        const filtered = cleaned.filter(p => p.name_category_product === currentCategoryId);


        // ✅ Lấy duy nhất 1 sản phẩm cho mỗi group
        const uniqueGroups = Array.from(
          new Map(filtered.map(item => [item.id_group_product, item])).values()
        );

        setProducts(uniqueGroups);

        // ✅ Tự động thêm sản phẩm hiện tại (nếu cần)
        if (currentGroupId && !hasAddedCurrent.current) {
          hasAddedCurrent.current = true;
          setSelected(prev => {
            if (!prev.includes(currentGroupId)) {
              return [...prev, currentGroupId];
            }
            return prev;
          });
        }

      })
      .catch((err) => console.error("Lỗi khi tải sản phẩm:", err));
  }, []);

  const toggleSelect = (id_group_product) => {
    const id = Number(id_group_product);
    if (isNaN(id)) return;

    // Không cho bỏ chọn sản phẩm hiện tại
    if (id === currentGroupId) return;

    setSelected(prev => {
      const updated = prev.includes(id)
        ? prev.filter(pid => pid !== id)
        : prev.length < 3
          ? [...prev, id]
          : (alert("Chỉ được chọn tối đa 3 sản phẩm."), prev);
      return updated;
    });
  };

  const handleCompare = () => {
    if (selected.length < 2) {
      alert("Vui lòng chọn ít nhất 2 sản phẩm để so sánh.");
      return;
    }
    navigate(`/compare?ids=${selected.join(',')}`);
    onClose();
  };

  const handleClearSelected = () => {
    // Giữ lại sản phẩm hiện tại
    setSelected([currentGroupId]);
  };

  return (
    <div className="compare-modal-overlay">
      <div className="compare-modal-content">
        <h4>So sánh sản phẩm</h4>

        <ul className="compare-product-list">
          {products.map((product) => (
            <li key={product.id_group_product}>
              <label className="compare-product-item">
                {product.id_group_product !== currentGroupId ? (
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id_group_product)}
                    onChange={() => toggleSelect(product.id_group_product)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked
                    disabled
                  />
                )}

                <img
                  src={`http://localhost:5000/images/product/${product.image}`}
                  width="50"
                  alt={product.name_group_product}
                />
                <span>{product.name_group_product}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="compare-modal-buttons">
          <button className="btn btn-success" onClick={handleCompare}>
            So sánh
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {selected.length > 1 && (
            <button
              className="btn btn-danger"
              onClick={handleClearSelected}
              style={{ marginLeft: '10px' }}
            >
              Xoá tất cả
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
