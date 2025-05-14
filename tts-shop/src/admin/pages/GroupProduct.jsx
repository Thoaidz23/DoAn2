import React, { useEffect, useState,useContext } from "react";
import { Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import {
  Box,
  ShoppingCart,
  AlertTriangle,
  ShieldX,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../customer/context/AuthContext";

const Product = () => {
  const [products, setProducts] = useState([]);
  const {user} = useContext(AuthContext)

  // Gọi API từ backend khi component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
  }, []);

  return (
    <div>
      <h3 className="mb-4">Quản lý sản phẩm</h3>

      {/* Thống kê */}
      <Row className="mb-4">
        <Col md={3}>
          <Card bg="secondary" text="white" className="text-center">
            <Card.Body>
              <Box size={32} className="mb-2" />
              <Card.Title>Tổng sản phẩm</Card.Title>
              <Card.Text>{products.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white" className="text-center">
            <Card.Body>
              <ShoppingCart size={32} className="mb-2" />
              <Card.Title>Bán hôm nay</Card.Title>
              <Card.Text>15</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white" className="text-center">
            <Card.Body>
              <AlertTriangle size={32} className="mb-2" />
              <Card.Title>Sắp hết hàng</Card.Title>
              <Card.Text>8</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="secondary" text="white" className="text-center">
            <Card.Body>
              <ShieldX size={32} className="mb-2" />
              <Card.Title>Sản phẩm lỗi</Card.Title>
              <Card.Text>2</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tìm kiếm & Thêm sản phẩm */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form className="d-flex w-50">
          <Form.Control
            type="text"
            placeholder="Tìm sản phẩm..."
            className="me-2"
          />
          <Button variant="secondary">
            <Search size={16} />
          </Button>
        </Form>
           {user.role === 1 ? (
                    <>
                      <Button as={Link} to="/admin/product/add" variant="success" className="mb-3">
                       Thêm sản phẩm
                      </Button></>
                  ):(<></>)}


        

      </div>

      {/* Bảng sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Hình ảnh</th>
            <th className="text-center align-middle">Tên sản phẩm</th>
            <th className="text-center align-middle">Danh mục</th>
            <th className="text-center align-middle">Thương hiệu</th>
            <th className="text-center align-middle">Hành động</th> 
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product.id_group_product}>
                <td className="text-center align-middle">{index + 1}</td>
                <td className="text-center align-middle">
                <img
                  src={`http://localhost:5000/images/product/${product.image}`}
                  alt={product.name_group_product}
                  className="img-thumbnail"
                  style={{ width: "150px", height: "150px" }}
                />

                </td>
                <td className="text-center align-middle">{product.name_group_product}</td>
                <td className="text-center align-middle">{product.name_category_product}</td>
                <td className="text-center align-middle">{product.name_category_brand}</td>
                <td className="text-center align-middle">
                  {user.role === 1 ? (
                    <>
                    <Button as={Link} to={`/admin/product/${product.id_group_product}`}  variant="info" size="sm" className="me-2">Xem</Button>
                    <Button as={Link} to={`/admin/product/edit/${product.id_group_product}`} variant="warning" size="sm" className="me-2">Sửa</Button>
                    <Button variant="danger" size="sm">Xóa</Button></>
                  ):(
                    <>
                    <Button as={Link} to={`/admin/product/${product.id_group_product}`}  variant="info" size="sm" className="me-2">Xem</Button>
                    </>
                  )}
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Đang tải sản phẩm...</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Product;