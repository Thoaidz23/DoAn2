import React, { useEffect, useState } from "react";
import { Table, Button} from "react-bootstrap";
import { Link } from "react-router-dom";

const BrandCategory = () => {
  const [cagbrands, setCagbrands] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Gọi API từ backend khi component mount
    useEffect(() => {
      fetch("http://localhost:5000/api/cagbrands")
        .then((res) => res.json())
        .then((data) => setCagbrands(data))
        .catch((err) => console.error("Lỗi khi fetch danh mục thương hiệu:", err));
    }, []);

  // Xóa danh mục
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/cagbrands/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (response.ok) {
          setSuccess(true);
          // Cập nhật lại danh sách sản phẩm sau khi xóa
          setCagbrands(cagbrands.filter((cagbrand) => cagbrand.id_category_brand !== id));
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
      <h4 className="m-0">Quản lý danh mục thương hiệu</h4>
      {/* Nút thêm thương hiệu */}
      <Button as={Link} to="/admin/brands/add" variant="primary" className="mt-4 mb-3">
        Thêm thương hiệu
      </Button>

      {/* Bảng thương hiệu sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Tên thương hiệu</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cagbrands.length > 0 ?
            cagbrands.map((cagbrand, index) => (
              <tr key={cagbrand.id_category_brand}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">{cagbrand.name_category_brand}</td>
                <td className="text-center align-middle">
                <Button variant="info" size="sm" className="me-2">
                <Link to={`/admin/edit-brand/${cagbrand.id_category_brand}`} className="text-decoration-none text-white">
                  Sửa
                </Link>
              </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(cagbrand.id_category_brand)}>
                    Xóa
                  </Button>
                </td>
              </tr>
          )
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

export default BrandCategory;
