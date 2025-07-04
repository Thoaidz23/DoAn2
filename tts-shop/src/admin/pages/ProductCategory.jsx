import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCategory = () => {
  const [cagproducts, setCagproducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Gọi API từ backend khi component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/cagproducts")
      .then((res) => res.json())
      .then((data) => setCagproducts(data))
      .catch((err) => console.error("Lỗi khi fetch danh mục thương hiệu:", err));
  }, []);

  // Xóa danh mục
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/cagproducts/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
          setSuccess(true);
          // Cập nhật lại danh sách sản phẩm sau khi xóa
          setCagproducts(cagproducts.filter((cagproduct) => cagproduct.id_category_product !== id));
        } else {
          setError(result.message || "Lỗi khi xóa danh mục.");
        }
      } catch (err) {
        setError("Lỗi máy chủ.");
      }
    }
  };

  return (
    
    <div>
      <h4 className="m-0">Quản lý danh mục sản phẩm</h4>
      {/* Nút thêm danh mục */}
      <Button as={Link} to="/admin/categories/add" variant="primary" className="mt-4 mb-3">
        Thêm danh mục
      </Button>

      {/* Bảng danh mục sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Tên danh mục</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cagproducts.length > 0 ? (
            cagproducts.map((cagproduct, index) => (
              <tr key={cagproduct.id_category_product}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">{cagproduct.name_category_product}</td>
                <td className="text-center align-middle">
                  <Link to={`/admin/categories/edit/${cagproduct.id_category_product}`}>
                    <Button variant="info" size="sm" className="me-2">
                      Sửa
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cagproduct.id_category_product)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Không có danh mục nào
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductCategory;
