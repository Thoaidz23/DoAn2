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
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Email</th>
            <th className="text-center align-middle">Họ tên</th>
            <th className="text-center align-middle">Số điện thoại</th>
            <th className="text-center align-middle">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff, index) => (
            <tr key={staff.id}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">{staff.email}</td>
              <td className="text-center align-middle">{staff.name}</td>
              <td className="text-center align-middle">{staff.phone}</td>
              <td className="text-center align-middle">
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
