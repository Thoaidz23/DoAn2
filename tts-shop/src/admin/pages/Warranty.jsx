import React, { useEffect, useState } from "react";
import { Table, Card, Badge, Button } from "react-bootstrap";

const WarrantyRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/warranty-admin")
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu bảo hành:", err));
  }, []);

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
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const handleUpdateStatus = (id, nextStatus) => {
    fetch(`http://localhost:5000/api/warranty-admin/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: nextStatus } : req
          )
        );
      })
      .catch((err) => console.error("Lỗi cập nhật trạng thái:", err));
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-center">Danh sách yêu cầu bảo hành</h3>

      <Card className="shadow rounded-4 border-0">
        <Card.Body>
          <Table striped bordered hover responsive className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Mã đơn</th>
                <th>ID Sản phẩm</th>
                <th>SĐT</th>
                <th>Lỗi mô tả</th>
                <th>Thời gian gửi</th>
                <th>Trạng thái</th>
                <th>Xử lý</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.id}>
                  <td>{index + 1}</td>
                  <td>{req.code_order}</td>
                  <td>{req.id_product}</td>
                  <td>{req.phone}</td>
                  <td>{req.issue}</td>
                  <td>
                    {new Date(req.request_time).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </td>
                  <td>{getStatusLabel(req.status)}</td>
                  <td>
                    {req.status === 1 && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleUpdateStatus(req.id, 2)}
                      >
                        Duyệt bảo hành
                      </Button>
                    )}
                    {req.status === 2 && (
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleUpdateStatus(req.id, 3)}
                      >
                        Đang bảo hành
                      </Button>
                    )}
                    {req.status === 3 && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleUpdateStatus(req.id, 4)}
                      >
                        Bảo hành xong
                      </Button>
                    )}
                    {req.status >= 4 && (
                      <Badge bg="secondary">Đã hoàn tất</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default WarrantyRequests;
