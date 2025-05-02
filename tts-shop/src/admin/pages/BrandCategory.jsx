import React, { useEffect, useState } from "react";
import { Table, Button} from "react-bootstrap";
import { Link } from "react-router-dom";

const BrandCategory = () => {
  const [cagbrands, setCagbrands] = useState([]);

  // Gọi API từ backend khi component mount
    useEffect(() => {
      fetch("http://localhost:5000/api/cagbrands")
        .then((res) => res.json())
        .then((data) => setCagbrands(data))
        .catch((err) => console.error("Lỗi khi fetch danh mục thương hiệu:", err));
    }, []);


  return (
    <div>
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
                    Sửa
                  </Button>
                  <Button variant="danger" size="sm">
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
