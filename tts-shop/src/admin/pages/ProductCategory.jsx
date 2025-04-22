import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const ProductCategory = () => {
  const [cagproducts, setCagproducts] = useState([]);

  // Gọi API từ backend khi component mount
      useEffect(() => {
        fetch("http://localhost:5000/api/cagproducts")
          .then((res) => res.json())
          .then((data) => setCagproducts(data))
          .catch((err) => console.error("Lỗi khi fetch danh mục thương hiệu:", err));
      }, []);


  return (
    <div>

      {/* Nút thêm danh mục */}
      <Button variant="primary" className="mt-4 mb-3">
        Thêm danh mục
      </Button>

      {/* Bảng danh mục sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Tên danh mục</th>
            <th className="text-center align-middle">Số lượng sản phẩm</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cagproducts.length > 0 ?
          cagproducts.map((cagproduct, index) => (
            <tr key={cagproduct.id_dmsp}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">{cagproduct.ten_dmsp}</td>
              <td className="text-center align-middle">{cagproduct.productCount}</td>
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

export default ProductCategory;
