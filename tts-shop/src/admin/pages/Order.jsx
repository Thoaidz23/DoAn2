import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { Search } from "lucide-react";

const Post = () => {
  // Dữ liệu giả lập đơn hàng
  const orders = [
    {
      id: 1,
      code: "DH001",
      customer: "Nguyễn Văn A",
      total: "2.500.000₫",
      date: "12/04/2025",
      status: "Đã giao",
    },
    {
      id: 2,
      code: "DH002",
      customer: "Trần Thị B",
      total: "1.200.000₫",
      date: "11/04/2025",
      status: "Đang xử lý",
    },
    {
      id: 3,
      code: "DH003",
      customer: "Lê Văn C",
      total: "3.750.000₫",
      date: "10/04/2025",
      status: "Đang giao",
    },
  ];

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
            <th>#</th>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.code}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
              <td>
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
