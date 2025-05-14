import { useState } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";

const CustomerAccount = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu mẫu
  const customers = [
    { id: 1, email: "john@example.com", name: "John Doe", phone: "0123456789" ,address:""},
    { id: 2, email: "jane@example.com", name: "Jane Smith", phone: "0987654321",address:""},
    { id: 3, email: "mike@example.com", name: "Mike Johnson", phone: "0111222333" ,address:""},
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
      </Row>

      {/* Bảng hiển thị */}
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th className="text-center align-middle">STT</th>
            <th className="text-center align-middle">Email</th>
            <th className="text-center align-middle">Full Name</th>
            <th className="text-center align-middle">Phone</th>
            <th className="text-center align-middle">Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={customer.id}>
              <td className="text-center align-middle">{index + 1}</td>
              <td className="text-center align-middle">{customer.email}</td>
              <td className="text-center align-middle">{customer.name}</td>
              <td className="text-center align-middle">{customer.phone}</td>
              <td className="text-center align-middle">{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerAccount;
