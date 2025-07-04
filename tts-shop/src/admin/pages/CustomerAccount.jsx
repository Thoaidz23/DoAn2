import { useState, useEffect } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const CustomerAccount = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers")
      .then((res) => {
        setCustomers(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        console.error("Error fetching customer data:", err);
      });
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h4 className="mb-4">Tài khoản khách hàng</h4>

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
