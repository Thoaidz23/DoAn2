import React, { useEffect, useState } from "react";
import { Table, Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WarrantyRequests = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

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
      case 0:
        return <Badge bg="success">Từ chối bảo hành</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
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
                <th>Hành động</th>
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
                    <Button
                      variant="info"
                      onClick={() =>
                        navigate(`/admin/warranty/${req.code_order}`, {
                          state: { id_product: req.id_product }
                        })
                      }
                    >
                      Xem chi tiết
                    </Button>

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
