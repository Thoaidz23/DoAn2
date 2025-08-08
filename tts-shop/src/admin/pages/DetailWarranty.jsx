import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Table, Badge, Card, Modal, Form } from "react-bootstrap";

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return <Badge bg="warning">Đang chờ bảo hành</Badge>;
    case 2:
      return <Badge bg="primary">Đã duyệt</Badge>;
    case 3:
      return <Badge bg="info">Đang bảo hành</Badge>;
    case 4:
      return <Badge bg="success">Bảo hành xong</Badge>;
    case 0:
      return <Badge bg="danger">Từ chối bảo hành</Badge>;
    default:
      return <Badge bg="secondary">Không xác định</Badge>;
  }
};

const getNextStatusInfo = (status) => {
  switch (status) {
    case 1:
      return { label: "Duyệt bảo hành", next: 2, variant: "primary" };
    case 2:
      return { label: "Đang bảo hành", next: 3, variant: "info" };
    case 3:
      return { label: "Bảo hành xong", next: 4, variant: "success" };
    default:
      return null;
  }
};

const DetailWarranty = () => {
  const { code } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { id_product } = location.state || {};
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (!id_product) {
      setError("Thiếu thông tin sản phẩm để truy vấn chi tiết bảo hành.");
      return;
    }

    const fetchWarranty = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/warranty-admin/${code}?id_product=${id_product}`);
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Lỗi khi tải dữ liệu bảo hành.");
          return;
        }
        const data = await res.json();
        setWarranty(data);
      } catch (err) {
        setError("Lỗi khi gọi API: " + err.message);
      }
    };

    fetchWarranty();
  }, [code, id_product]);

  if (error) return <p className="text-danger p-3">{error}</p>;
  if (!warranty) return <p className="p-3">Đang tải dữ liệu bảo hành...</p>;

  const statusButton = getNextStatusInfo(warranty.warranty_status);

  const handleRejectWarranty = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/warranty-admin/${warranty.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 0, reply: rejectReason })
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật từ chối bảo hành");
      setWarranty(prev => ({ ...prev, warranty_status: 0, reply: rejectReason }));
      setShowRejectModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-3 text-light" style={{ backgroundColor: "#1e1e2f", borderRadius: "12px" }}>
      <h4 className="pb-2 mb-4 border-bottom" style={{ color: "#00bcd4" }}>
        Chi tiết bảo hành - Đơn hàng #{warranty.code_order}
      </h4>

      {/* THÔNG TIN KHÁCH HÀNG */}
      <Card className="mb-4 bg-dark text-light shadow-sm">
        <Card.Header className="border-bottom border-secondary">
          <strong>Thông tin khách hàng</strong>
        </Card.Header>
        <Card.Body>
          <p><strong>Email:</strong> {warranty.user.email}</p>
          <p><strong>Tên tài khoản:</strong> {warranty.user.name}</p>
          <p><strong>Địa chỉ:</strong> {warranty.user.address}</p>
          <p><strong>Số điện thoại:</strong> {warranty.user.phone}</p>
          <p><strong>Ngày đặt:</strong> {new Date(warranty.order.date).toLocaleString("vi-VN")}</p>
          <p><strong>Trạng thái đơn hàng:</strong> <Badge bg="info">
            {({
              0: "Chờ xác nhận",
              1: "Đã xác nhận",
              2: "Đang vận chuyển",
              3: "Đã giao hàng",
              4: "Chờ hủy",
              5: "Đã hủy"
            })[warranty.order.order_status] || "Không xác định"}
          </Badge></p>
        </Card.Body>
      </Card>

      {/* LỊCH SỬ BẢO HÀNH */}
{warranty.history && warranty.history.length > 0 && (
  <div className="mt-4">
    <h5>Lịch sử bảo hành:</h5>
    <Table bordered hover responsive variant="dark" className="text-center align-middle">
      <thead>
        <tr>
          <th>Trạng thái</th>
          <th>Thời gian</th>
        </tr>
      </thead>
      <tbody>
        {warranty.history.map((h, idx) => (
          <tr key={idx}>
            <td>{getStatusLabel(h.status)}</td>
            <td>{new Date(h.time).toLocaleString("vi-VN")}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
)}


      {/* SẢN PHẨM BẢO HÀNH */}
      <Card className="mb-4 bg-dark text-light shadow-sm">
        <Card.Header className="border-bottom border-secondary">
          <strong>Sản phẩm bảo hành</strong>
        </Card.Header>
        <Card.Body>
          <Table bordered hover responsive variant="dark" className="text-center align-middle">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Thông tin sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Bảo hành</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src={`http://localhost:5000/images/product/${warranty.product.image}`}
                    alt="..."
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "10px",
                      boxShadow: "0 0 5px rgba(255, 255, 255, 0.1)"
                    }}
                  />
                </td>
                <td className="text-start">
                  <div><strong>{warranty.product.name_group_product}</strong></div>
                  {warranty.product.name_ram && <div>RAM: {warranty.product.name_ram}</div>}
                  {warranty.product.name_rom && <div>ROM: {warranty.product.name_rom}</div>}
                  {warranty.product.name_color && <div>Màu: {warranty.product.name_color}</div>}
                </td>
                <td>{warranty.product.price.toLocaleString("vi-VN")} VNĐ</td>
                <td>{warranty.product.quantity}</td>
                <td>
                  <div>Bắt đầu: {new Date(warranty.product.date_start_warranty).toLocaleDateString("vi-VN")}</div>
                  <div>Kết thúc: {new Date(warranty.product.date_end_warranty).toLocaleDateString("vi-VN")}</div>
                </td>
              </tr>
            </tbody>
          </Table>

          {/* Nếu bị từ chối thì hiện lý do */}
          {warranty.warranty_status === 0 && warranty.reply && (
            <div className="mt-3 p-3 bg-danger bg-opacity-25 rounded">
              <strong>Lý do từ chối:</strong> {warranty.reply}
            </div>
          )}

          {/* TRẠNG THÁI + NÚT HÀNH ĐỘNG */}
          <div className="mt-3 mb-2">
            <h5>Trạng thái bảo hành: {getStatusLabel(warranty.warranty_status)}</h5>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4 mb-3">
            {statusButton && (
              <Button
                variant={statusButton.variant}
                onClick={async () => {
                  try {
                    await fetch(`http://localhost:5000/api/warranty-admin/${warranty.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: statusButton.next })
                    });
                    setWarranty(prev => ({ ...prev, warranty_status: statusButton.next }));
                  } catch {
                    alert("Lỗi khi cập nhật trạng thái bảo hành!");
                  }
                }}
              >
                {statusButton.label}
              </Button>
            )}

            {/* Nút từ chối bảo hành */}
            {warranty.warranty_status !== 4 && warranty.warranty_status !== 0 && (
              <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                Từ chối bảo hành
              </Button>
            )}


            <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal nhập lý do từ chối */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Từ chối bảo hành</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleRejectWarranty} disabled={!rejectReason.trim()}>
            Xác nhận từ chối
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailWarranty;
