import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Table, Image, Container, Spinner } from "react-bootstrap";
import "../styles/comparepage.scss"
const ComparePage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ids = searchParams.get("ids");

  const [products, setProducts] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids) return;

    axios
      .get(`http://localhost:5000/api/compare?ids=${ids}`)
      .then((res) => {
        setProducts(res.data.products);
        setSpecifications(res.data.specifications);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu so sánh:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ids]);

  const groupSpecs = {};
  specifications.forEach((spec) => {
    if (!groupSpecs[spec.attribute]) {
      groupSpecs[spec.attribute] = {};
    }
    groupSpecs[spec.attribute][spec.id_group_product] = spec.value;
  });

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải dữ liệu so sánh...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">So sánh sản phẩm</h3>

      {products.length < 2 ? (
        <p className="text-center text-danger">
          Vui lòng chọn ít nhất 2 sản phẩm để so sánh.
        </p>
      ) : (
        <Table bordered responsive className={`compare-table compare-${products.length}`}>
          <thead>
            <tr>
              <th>Thuộc tính</th>
              {products.map((p) => (
                <th key={p.id_product}>{p.name_group_product}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ảnh</td>
              {products.map((p) => (
                <td key={p.id_product}>
                  <Image
                    src={`http://localhost:5000/images/product/${p.image}`}
                    width="100"
                    height="100"
                    rounded
                  />
                </td>
              ))}
            </tr>

            

            {/* Các thông số kỹ thuật động */}
            {Object.entries(groupSpecs).map(([attribute, values]) => (
              <tr key={attribute}>
                <td>{attribute}</td>
                {products.map((p) => (
                  <td key={p.id_product}>
                    {values[p.id_group_product] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ComparePage;
