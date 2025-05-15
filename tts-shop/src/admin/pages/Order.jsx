import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

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

    const getOrderStatus = (status) => {
      switch (status) {
        case 0:
          return "Chờ xác nhận";
        case 1:
          return "Đã xác nhận";
        case 2:
          return "Đang vận chuyển";
        case 4:
          return "Đang chờ hủy";
        case 3: 
          return "Đã giao hàng";
        case 5:
          return "Đã hủy";
        default:
          return "Không xác định";
      }
    };

    const getOrderPayStatus = (status) => {
      switch (status) {
        case 0:
          return "Chưa thanh toán";
        case 1:
          return "Đã thanh toán";
        default:
          return "Không xác định";
      }
    };


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
            <th className="text-center align-middle">Thanh toán</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id_order}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">{order.code_order}</td>
              <td className="text-center align-middle">{order.name_user}</td>
              <td className="text-center align-middle">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_price)}
              </td>
              <td className="text-center align-middle">
                {new Date(order.date).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Ho_Chi_Minh"
                })}
              </td>
              <td className="text-center align-middle">
                {getOrderStatus(order.status)}
              </td>
              <td className="text-center align-middle">
                {getOrderPayStatus(order.paystatus)}
              </td>

              <td className="text-center align-middle">
              <Link to={`/admin/orders/${order.code_order}`}>
                <Button variant="info" size="sm">Xem</Button>
              </Link>
            </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Post;
