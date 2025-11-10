import React from "react";
import { Modal, Badge } from "react-bootstrap";

export default function OrderHistoryModal({ show, onClose, statusHistory }) {
  const getBadgeVariant = (status) => {
    switch (status) {
      case 0: return "secondary"; // Chờ xác nhận
      case 1: return "primary";   // Đã xác nhận
      case 2: return "warning";   // Đang vận chuyển
      case 3: return "success";   // Đã giao hàng
      case 4: return "info";      // Đang chờ hủy
      case 5: return "danger";    // Đã hủy
      default: return "dark";     // Không xác định
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0: return "Chờ xác nhận";
      case 1: return "Đã xác nhận";
      case 2: return "Đang vận chuyển";
      case 3: return "Đã giao hàng";
      case 4: return "Đang chờ hủy";
      case 5: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Lịch sử trạng thái đơn hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {statusHistory && statusHistory.length > 0 ? (
          <ul className="list-unstyled mb-0">
            {statusHistory.map((item, idx) => (
              <li key={idx} className="mb-2">
                <Badge bg={getBadgeVariant(item.status)}>
                  {getStatusText(item.status)}
                </Badge>{" "}
                - {new Date(item.time).toLocaleString("vi-VN")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Chưa có lịch sử trạng thái.</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
