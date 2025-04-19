import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { Search } from "lucide-react";

const Post = () => {
  // Dữ liệu giả lập đơn hàng
  const [orders, setOrders] = useState([]);
  // Gọi API từ backend khi component mount

    useEffect(() => {
      fetch("http://localhost:5000/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Lỗi khi fetch sản phẩm:", err));
    }, []);

  return (
    <div>
      {/* Tiêu đề & Tìm kiếm */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">Quản lý đơn hàng</h4>
        <Form inline="true">
          <Row className="align-items-center">
            <Col xs="auto">
              <Form.Control type="text" placeholder="Tìm theo mã đơn..." />
            </Col>
            <Col xs="auto">
              <Button variant="primary">
                <Search size={16} className="me-1" />
                Tìm
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Bảng đơn hàng */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Mã đơn</th>
            <th className="text-center align-middle">Khách hàng</th>
            <th className="text-center align-middle">Tổng tiền</th>
            <th className="text-center align-middle">Ngày đặt</th>
            <th className="text-center align-middle">Trạng thái</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id_order}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">{order.code_order}</td>
              <td className="text-center align-middle">{order.name}</td>
              <td className="text-center align-middle">{order.total_price}</td>
              <td className="text-center align-middle">{order.date}</td>
              <td className="text-center align-middle">{order.status}</td>
              <td className="text-center align-middle">
                <Button variant="info" size="sm">Xem</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Post;
