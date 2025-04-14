import { useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

const CustomerAccount = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu
  const customers = [
    { id: 1, email: "john@example.com", name: "John Doe", phone: "0123456789" },
    { id: 2, email: "jane@example.com", name: "Jane Smith", phone: "0987654321" },
    { id: 3, email: "mike@example.com", name: "Mike Johnson", phone: "0111222333" },
  ];

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4 className="mb-4">Tài khoản khách hàng</h4>

      {/* Tìm kiếm + Thêm */}
      <Row className="align-items-center mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary">Add Customer</Button>
        </Col>
      </Row>

      {/* Bảng hiển thị */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>STT</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={customer.id}>
              <td>{index + 1}</td>
              <td>{customer.email}</td>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Sửa
                </Button>
                <Button variant="danger" size="sm">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerAccount;
