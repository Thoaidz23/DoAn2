import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Table, Badge, Card, Modal } from "react-bootstrap";
import axios from "axios";

const DetailOrder = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${code}`)
      .then((res) => res.json())
       .then((data) => {
      console.log("Dữ liệu đơn hàng:", data); // log ngay khi nhận được
      setOrder(data);
    })
      .catch((err) => console.error("Lỗi khi lấy chi tiết đơn hàng:", err));
  }, [code]);

  const handleCancelAndRefund = async () => {
    try {
      // 1. Hoàn tiền nếu đã thanh toán
      if (order.paystatus === 1) {
        if (order.method === 3) {
          // PayPal
          await axios.post("http://localhost:5000/api/paypal/refund", {
            code_order: order.code_order,
            amount: order.total_price,
            capture_id: order.capture_id,
          });
          alert("Hoàn tiền PayPal thành công!");
        } else if (order.method === 1) {
          // MoMo
          await axios.post("http://localhost:5000/api/momo/refund", {
            orderId: order.code_order,
            requestId: `${order.code_order}-${Date.now()}`,
            transId: order.capture_id,
            amount: order.total_price,
          });
          alert("Hoàn tiền MoMo thành công!");
        }
      }

      // 2. Hủy đơn
      const res = await fetch(`http://localhost:5000/api/orders/${code}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
  reason: order.customer_cancel_reason || cancelReason 
}),

      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi hủy đơn");

      alert("Hoàn tiền & hủy đơn thành công!");
      setShowCancelModal(false);
      navigate("/admin/order");

    } catch (err) {
      console.error("Lỗi:", err);
      alert("Không thể hoàn tiền hoặc hủy đơn.");
    }
  };

  if (!order) return <p>Đang tải đơn hàng...</p>;

  return (
    <div className="p-3 text-light" style={{ backgroundColor: "#1e1e2f", borderRadius: "12px" }}>
      <h4 className="pb-2 mb-4 border-bottom" style={{ color: "#00bcd4" }}>
        Chi tiết đơn hàng #{order.code_order}
      </h4>

      {/* Thông tin khách hàng */}
      <Card className="mb-4 bg-dark text-light shadow-sm">
        <Card.Header className="border-bottom border-secondary">
          <strong>Thông tin khách hàng</strong>
        </Card.Header>
        <Card.Body>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Tên tài khoản:</strong> {order.name_user}</p>
          <p><strong>Tên người nhận:</strong> {order.user_name}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
          <p><strong>Số điện thoại:</strong> {order.phone}</p>
          <p><strong>Ngày đặt:</strong> {new Date(order.date).toLocaleString("vi-VN")}</p>
          <p><strong>Phương thức thanh toán:</strong> {
            order.method === 0
              ? "Thanh toán trực tiếp"
              : order.method === 1
              ? "Thanh toán qua MoMo"
              : order.method === 3
              ? "Thanh toán qua Paypal"
              : "Không xác định"
          }</p>
          <p><strong>Trạng thái thanh toán:</strong> {order.paystatus === 1 ? "Đã thanh toán" : "Chưa thanh toán"}</p>
          <p><strong>Trạng thái đơn hàng:</strong> <Badge bg="info">
            {
              order.status === 0 ? "Chờ xác nhận" :
              order.status === 1 ? "Đã xác nhận" :
              order.status === 2 ? "Đang vận chuyển" :
              order.status === 4 ? "Đang chờ hủy" :
              order.status === 3 ? "Đã giao hàng" :
              order.status === 5 ? "Đã hủy" :
              "Không xác định"
            }
          </Badge></p>
        </Card.Body>
      </Card>

      {/* Lịch sử trạng thái */}
      <Card className="mb-4 bg-dark text-light shadow-sm">
        <Card.Header className="border-bottom border-secondary">
          <strong>Lịch sử trạng thái</strong>
        </Card.Header>
        <Card.Body>
          {order.statusHistory && order.statusHistory.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {order.statusHistory.map((item, idx) => (
                <li key={idx} className="mb-2">
                  <Badge bg={
                    item.status === 0 ? "secondary" :
                    item.status === 1 ? "primary" :
                    item.status === 2 ? "warning" :
                    item.status === 3 ? "success" :
                    item.status === 4 ? "info" :
                    item.status === 5 ? "danger" : "dark"
                  }>
                    {item.status === 0 ? "Chờ xác nhận" :
                     item.status === 1 ? "Đã xác nhận" :
                     item.status === 2 ? "Đang vận chuyển" :
                     item.status === 3 ? "Đã giao hàng" :
                     item.status === 4 ? "Đang chờ hủy" :
                     item.status === 5 ? "Đã hủy" :
                     "Không xác định"}
                  </Badge>{" "}
                  - {new Date(item.time).toLocaleString("vi-VN")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Chưa có lịch sử trạng thái.</p>
          )}
        </Card.Body>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card className="mb-4 bg-dark text-light shadow-sm">
        <Card.Header className="border-bottom border-secondary">
          <strong>Sản phẩm trong đơn hàng</strong>
        </Card.Header>
        <Card.Body>
          <Table bordered hover responsive variant="dark" className="text-center align-middle">
            <thead>
              <tr>
                <th>STT</th>
                <th>Ảnh</th>
                <th>Thông tin sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((product, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <img
                      src={`http://localhost:5000/images/product/${product.image}`}
                      alt="..."
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 0 5px rgba(255, 255, 255, 0.1)",
                      }}
                    />
                  </td>
                  <td className="text-start">
                    <div>Tên sản phẩm: <strong>{product.name_group_product}</strong></div>
                    {product.name_ram && <div>RAM: {product.name_ram}</div>}
                    {product.name_rom && <div>ROM: {product.name_rom}</div>}
                    {product.name_color && <div>Màu: {product.name_color}</div>}
                  </td>
                  <td>{product.price.toLocaleString("vi-VN")} VNĐ</td>
                  <td>{product.quantity_product}</td>
                  <td>{(product.price * product.quantity_product).toLocaleString("vi-VN")} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Tổng thành tiền */}
          <div className="mt-3 mb-2 ml-2">
            <h5>
              Tổng cộng:{" "}
              <span className="text-warning">
                {order.total_price.toLocaleString("vi-VN")} VNĐ
              </span>
            </h5>
          </div>
        </Card.Body>

        {/* Nút thao tác */}
        <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
          {order.status === 0 && (
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/api/orders/print/${code}`, { method: "PUT" });
                  window.open(`/admin/order/print/${code}`, "_blank");
                } catch (err) {
                  alert("Lỗi khi cập nhật và in đơn hàng!");
                }
              }}
            >
              Xác nhận & In đơn hàng
            </Button>
          )}

          {order.status === 1 && (
            <Button
              variant="warning"
              onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/api/orders/${code}/shipping`, { method: "PUT" });
                  navigate("/admin/order");
                } catch (err) {
                  alert("Lỗi khi cập nhật trạng thái!");
                }
              }}
            >
              Xác nhận đang vận chuyển
            </Button>
          )}

          {order.status === 2 && (
            <Button
              variant="success"
              onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/api/orders/${code}/delivered`, { method: "PUT" });
                  navigate("/admin/order");
                } catch (err) {
                  alert("Lỗi khi cập nhật trạng thái!");
                }
              }}
            >
              Xác nhận đã giao hàng
            </Button>
          )}

          {/* Nút gộp hoàn tiền & hủy đơn */}
          {order.status !== 3 && order.status !== 5 && order.paystatus === 1 && (
            <Button variant="danger" onClick={() => setShowCancelModal(true)}>
              Hoàn tiền & Hủy đơn
            </Button>
          )}
          
          {/* Nếu là COD thì chỉ hủy đơn */}
          {order.status !== 3 && order.status !== 5 && order.method === 0 && (
            <Button variant="danger" onClick={() => setShowCancelModal(true)}>
              Hủy đơn hàng
            </Button>                                                                   
          )}

          <Button variant="secondary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </Card>

      {/* Modal Hoàn tiền & Hủy đơn */}
<Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Hoàn tiền & Hủy đơn hàng</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {order.customer_cancel_reason ? (
      <div>
        <strong>Lý do khách hủy:</strong>
        <p className="mt-2 p-2 bg-light text-dark rounded">
          {order.customer_cancel_reason}
        </p>
      </div>
    ) : (
      <textarea
        className="form-control"
        placeholder="Nhập lý do hủy đơn..."
        rows={4}
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      />
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
      Đóng
    </Button>
    <Button variant="danger" onClick={handleCancelAndRefund}>
      Xác nhận
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default DetailOrder;
