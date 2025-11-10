import React from "react";
import { Modal, Button } from "react-bootstrap";

const warrantyStatusMap = {
  0: "Từ chối bảo hành",
  1: "Đang chờ duyệt",
  2: "Đã duyệt bảo hành",
  3: "Đang bảo hành",
  4: "Đã bảo hành xong",
};

function WarrantyHistoryModal({ show, onClose, history }) {
  return (
    <Modal show={show} onHide={onClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Lịch sử trạng thái bảo hành</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {history.length === 0 && <p>Không có lịch sử trạng thái bảo hành.</p>}
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>
              <strong>{warrantyStatusMap[item.status] || "Không xác định"}</strong> —{" "}
              {new Date(item.time).toLocaleString()}
            </li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WarrantyHistoryModal;
