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
  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentWarrantyId, setCurrentWarrantyId] = useState(null);

const updateStatus = async (warrantyId, newStatus, newReply = null) => {
  try {
    const res = await fetch(`http://localhost:5000/api/warranty-admin/${warrantyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, reply: newReply }),
    });
    if (!res.ok) throw new Error("Lỗi khi cập nhật trạng thái bảo hành");

    // Cập nhật state local warranties, tìm và thay đổi item có id = warrantyId
    setWarranties(prev => prev.map(w => {
      if (w.id === warrantyId) {
        return {
          ...w,
          warranty_status: newStatus,
          reply: newReply ?? w.reply,
          // Có thể cập nhật history nếu backend trả về
        };
      }
      return w;
    }));

    setShowRejectModal(false);
    setRejectReason("");
  } catch (err) {
    alert(err.message);
  }
};
  useEffect(() => {
    if (!id_product) {
      setError("Thiếu thông tin sản phẩm để truy vấn chi tiết bảo hành.");
      return;
    }

    const fetchWarranty = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/warranty-admin/${code}?id_product=${id_product}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Lỗi khi tải dữ liệu bảo hành.");
          return;
        }
        const data = await res.json();
        setWarranties(data);

        if (data.length > 0) {
          setWarranty(data[0]);
        }
      } catch (err) {
        setError("Lỗi khi gọi API: " + err.message);
      }
    };

    fetchWarranty();
  }, [code, id_product]);

  if (error) return <p className="text-danger p-3">{error}</p>;
  if (!warranty) return <p className="p-3">Đang tải dữ liệu bảo hành...</p>;

  const statusButton = getNextStatusInfo(warranty.warranty_status);

  return (
    <div className="p-3 text-light" style={{ backgroundColor: "#1e1e2f", borderRadius: "12px" }}>
      <h4 className="pb-2 mb-4 border-bottom" style={{ color: "#00bcd4" }}>
        Chi tiết bảo hành - Đơn hàng #{warranty.code_order}
      </h4>

      {/* Thông tin khách hàng */}
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
            {{
              0: "Chờ xác nhận",
              1: "Đã xác nhận",
              2: "Đang vận chuyển",
              3: "Đã giao hàng",
              4: "Chờ hủy",
              5: "Đã hủy"
            }[warranty.order.order_status] || "Không xác định"}
          </Badge></p>
        </Card.Body>
      </Card>

      {/* Lịch sử các lần yêu cầu bảo hành */}
      <div className="p-3 text-light" style={{ backgroundColor: "#1e1e2f", borderRadius: "12px" }}>
    <h4 className="pb-2 mb-4 border-bottom" style={{ color: "#00bcd4" }}>
      Chi tiết bảo hành - Đơn hàng #{code}
    </h4>

    {/* Lặp qua tất cả các lần bảo hành */}
    {warranties.length > 0 ? warranties.map((w, idx) => {
      const statusBtn = getNextStatusInfo(w.warranty_status);
      return (
        <Card key={w.id} className="mb-4 bg-dark text-light shadow-sm">
          <Card.Header className="border-bottom border-secondary">
            <strong>Lần bảo hành thứ {idx + 1} - Trạng thái: {getStatusLabel(w.warranty_status)}</strong>
            <div>Thời gian yêu cầu: {new Date(w.request_time).toLocaleString("vi-VN")}</div>
             {w.issue && (
              <div style={{ marginTop: "6px", fontStyle: "italic", color: "#ff6b6b" }}>
                  <strong>Vấn đề: </strong> {w.issue}
              </div>
            )}
              {/* {w.reply && (
              <div style={{fontStyle: "italic", color: "#ff6b6b" }}>
                  <strong>Lý do từ chối:</strong> {w.reply}
              </div>
            )} */}
          </Card.Header>
          <Card.Body>
            {/* Lịch sử trạng thái bảo hành */}
            <h6>Lịch sử trạng thái:</h6>
            <Table bordered size="sm" variant="dark" responsive className="text-center align-middle">
              <thead>
                <tr>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {w.history && w.history.length > 0 ? w.history.map((h, i) => (
                  <tr key={i}>
                    <td>{getStatusLabel(h.status)}</td>
                    <td>{new Date(h.time).toLocaleString("vi-VN")}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={2}>Không có lịch sử trạng thái</td></tr>
                )}
              </tbody>
            </Table>

            Lý do từ chối nếu có
            {w.warranty_status === 0 && w.reply && (
              <div className="mt-2 p-2 bg-danger bg-opacity-25 rounded">
                <strong>Lý do từ chối:</strong> {w.reply}
              </div>
            )}

            {/* Các nút cập nhật trạng thái cho lần này */}
            <div className="mt-3 d-flex gap-2">
              {statusBtn && (
                <Button
                  variant={statusBtn.variant}
                  onClick={() => updateStatus(w.id, statusBtn.next)}
                >
                  {statusBtn.label}
                </Button>
              )}
              {w.warranty_status !== 0 && w.warranty_status !== 4 && (
                <Button variant="danger" onClick={() => {
                  setRejectReason("");
                  setShowRejectModal(true);
                  setCurrentWarrantyId(w.id); // lưu id lần bảo hành hiện tại để reject
                }}>
                  Từ chối bảo hành
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      )
    }) : (
      <p>Không có dữ liệu bảo hành.</p>
    )}

    {/* Modal từ chối bảo hành (giữ nguyên modal, thêm xử lý id bảo hành hiện tại) */}
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
        <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Đóng</Button>
        <Button
          variant="danger"
          disabled={!rejectReason.trim()}
          onClick={() => {
            updateStatus(currentWarrantyId, 0, rejectReason);
            setShowRejectModal(false);
          }}
        >
          Xác nhận từ chối
        </Button>
      </Modal.Footer>
    </Modal>
  </div>

      {/* Sản phẩm bảo hành */}
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

      <h5>
  Trạng thái bảo hành: {getStatusLabel(warranties.length > 0 ? warranties[warranties.length - 1].warranty_status : 0)}
</h5>

          {/* Các nút hành động */}
          <div className="d-flex justify-content-center gap-3 mt-4 mb-3">
            {statusButton && (
              <Button
                variant={statusButton.variant}
                onClick={() => updateStatus(statusButton.next)}
              >
                {statusButton.label}
              </Button>
            )}

            {warranty.warranty_status !== 0 && warranty.warranty_status !== 4 && (
              <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                Từ chối bảo hành
              </Button>
            )}

            <Button variant="secondary" onClick={() => navigate(-1)}>Quay lại</Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal nhập lý do từ chối
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
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Đóng</Button>
          <Button variant="danger" onClick={() => {
  setRejectReason("");
  setShowRejectModal(true);
  setCurrentWarrantyId(w.id);
}}>
  Từ chối bảo hành
</Button>

        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default DetailWarranty;
