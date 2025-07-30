import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup, Card, ButtonGroup} from "react-bootstrap";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const Post = () => {
  // Dữ liệu giả lập đơn hàng
  const [orders, setOrders] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(null);
const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);



  
  // Gọi API từ backend khi component mount

    useEffect(() => {
  fetch("http://localhost:5000/api/orders")
    .then((res) => res.json())
    .then((data) => {
      console.log("API /orders trả về:", data);
      setOrders(data);
      setFilteredOrders(data); // thêm dòng này
    })
    .catch((err) => console.error("Lỗi khi fetch đơn hàng:", err));
}, []);

useEffect(() => {
  const filtered = orders.filter((order) => {
    const matchCode = order.code_order.toLowerCase().includes(searchCode.toLowerCase());
    const matchDelivery = deliveryStatusFilter === null || order.status === deliveryStatusFilter;
    const matchPayment = paymentStatusFilter === null || order.paystatus === paymentStatusFilter;
    return matchCode && matchDelivery && matchPayment;
  });
  setFilteredOrders(filtered);
}, [searchCode, orders, deliveryStatusFilter, paymentStatusFilter]);






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

    // Đếm số đơn theo trạng thái giao hàng
const countByDeliveryStatus = (value) => {
  if (value === null) return orders.length;
  return orders.filter(order => order.status === value).length;
};

// Đếm số đơn theo trạng thái thanh toán
const countByPaymentStatus = (value) => {
  if (value === null) return orders.length;
  return orders.filter(order => order.paystatus === value).length;
};



  return (
    <div>
      {/* Tiêu đề & Tìm kiếm */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0">Quản lý đơn hàng</h4>
        <Form inline="true">
          {/* Thanh tìm kiếm bên trái */}
<InputGroup style={{ maxWidth: "500px" }}>
  <InputGroup.Text>
    <Search size={18} />
  </InputGroup.Text>
  <Form.Control
    placeholder="Tìm theo mã đơn hàng..."
    value={searchCode}
    onChange={(e) => setSearchCode(e.target.value)}
  />
</InputGroup>

        </Form>
      </div>

{/* Loc */}
      <div className="mb-4">
  <Card className="bg-dark text-white border-secondary">
    <Card.Body>
      <strong className="d-block mb-2">Lọc theo trạng thái giao hàng:</strong>
      <ButtonGroup className="flex-wrap">
        {[
          { label: "Tất cả", value: null },
          { label: "Chờ xác nhận", value: 0 },
          { label: "Đã xác nhận", value: 1 },
          { label: "Đang vận chuyển", value: 2 },
          { label: "Đang chờ hủy", value: 4 },
          { label: "Đã giao hàng", value: 3 },
          { label: "Đã hủy", value: 5 },
        ].map((item) => (
          <Button
            key={item.value ?? "all"}
            variant={deliveryStatusFilter === item.value ? "primary" : "outline-light"}
            className="mb-2 me-2 d-flex align-items-center"
            onClick={() => setDeliveryStatusFilter(item.value)}
          >
            <span>{item.label}</span>
            <span className="badge bg-secondary ms-2" style={{ fontSize: '0.8rem' }}>
              {countByDeliveryStatus(item.value)}
            </span>
          </Button>
        ))}
      </ButtonGroup>
    </Card.Body>
  </Card>
</div>

<div className="mb-4">
  <Card className="bg-dark text-white border-secondary">
    <Card.Body>
      <strong className="d-block mb-2">Lọc theo trạng thái thanh toán:</strong>
      <ButtonGroup className="flex-wrap">
        {[
          { label: "Tất cả", value: null },
          { label: "Chưa thanh toán", value: 0 },
          { label: "Đã thanh toán", value: 1 },
        ].map((item) => (
          <Button
            key={item.value ?? "all"}
            variant={paymentStatusFilter === item.value ? "success" : "outline-light"}
            className="mb-2 me-2 d-flex align-items-center"
            onClick={() => setPaymentStatusFilter(item.value)}
          >
            <span>{item.label}</span>
            <span className="badge bg-secondary ms-2" style={{ fontSize: '0.8rem' }}>
              {countByPaymentStatus(item.value)}
            </span>
          </Button>
        ))}
      </ButtonGroup>
    </Card.Body>
  </Card>
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
          {filteredOrders.map((order, index) => (
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
