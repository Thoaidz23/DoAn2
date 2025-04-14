import React from "react";
import { Table, Button, Form, Row, Col, Card } from "react-bootstrap";
import {
    Box,
    ShoppingCart,
    AlertTriangle,
    ShieldX,
    Search,
  } from "lucide-react";
  


const Product = () => {
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
        <Card.Text>200</Card.Text>
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
          <Form.Control type="text" placeholder="Tìm sản phẩm..." className="me-2" />
          <Button variant="secondary">
            <Search size={16} />
          </Button>
        </Form>
        <Button variant="primary">+ Thêm sản phẩm</Button>
      </div>

      {/* Bảng sản phẩm */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">#</th>
            <th className="text-center align-middle">Hình ảnh</th>
            <th className="text-center align-middle">Tên sản phẩm</th>
            <th className="text-center align-middle">Số lượng</th>
            <th className="text-center align-middle">Giá</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center align-middle">1</td>
            <td className="text-center align-middle">
              <img
                src="https://cdn.tgdd.vn/Products/Images/42/329140/iphone-16-plus-xanh.png"
                alt="Sản phẩm"
                className="img-thumbnail"
                style={{ width: "150px", height: "150px" }}
              />
            </td>
            <td className="text-center align-middle">Iphone 15</td>
            <td className="text-center align-middle">20</td>
            <td className="text-center align-middle">25.000.000₫</td>
            <td className="text-center align-middle">
              <Button variant="info" size="sm" className="me-2">Xem</Button>
              <Button variant="warning" size="sm" className="me-2">Sửa</Button>
              <Button variant="danger" size="sm">Xóa</Button>
            </td>
          </tr>
          {/* Thêm các dòng sản phẩm tại đây */}
        </tbody>
      </Table>
    </div>
  );
};

export default Product;
