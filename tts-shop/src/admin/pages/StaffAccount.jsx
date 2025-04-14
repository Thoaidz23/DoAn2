import { Table, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { Search, UserPlus } from "lucide-react";

const StaffAccount = () => {
  // Dữ liệu mẫu
  const staffs = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "a.nguyen@example.com",
      phone: "0123456789",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "b.tran@example.com",
      phone: "0987654321",
    },
  ];

  return (
    <div>
      <h4 className="mb-4">Tài khoản nhân viên</h4>
      {/* Thanh tìm kiếm và nút thêm */}
      <Row className="align-items-center mt-4 mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control placeholder="Tìm tài khoản nhân viên..." />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary">
            <UserPlus size={18} className="me-2" />
            Thêm tài khoản nhân viên
          </Button>
        </Col>
      </Row>

      {/* Bảng tài khoản nhân viên */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff, index) => (
            <tr key={staff.id}>
              <td>{index + 1}</td>
              <td>{staff.email}</td>
              <td>{staff.name}</td>
              <td>{staff.phone}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Sửa
                </Button>
                <Button variant="danger" size="sm">
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StaffAccount;
