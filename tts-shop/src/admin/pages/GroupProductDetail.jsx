import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

const GroupProductDetail = () => {
  const { id } = useParams(); // id_group_product từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    if (!id) return;
    
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false); // Đánh dấu là đã tải xong dữ liệu
      })
      .catch((err) => {
        console.error("Lỗi khi fetch sản phẩm theo group:", err);
        setLoading(false); // Nếu có lỗi, dừng loading
      });
  }, [id]);

  if (loading) return <p>Đang tải chi tiết sản phẩm...</p>; // Hiển thị loading khi đang fetch

  if (products.length === 0) return <p>Không có sản phẩm để hiển thị.</p>; // Nếu không có sản phẩm

  return (
    <div>
      <h3>Danh sách sản phẩm thuộc dòng</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id_product}>
              <td>
                <img 
                  src={`http://localhost:5000/images/product/${item.image}`} 
                  style={{ width: '100px', objectFit: 'cover' }} 
                  alt={item.name_product} 
                />
              </td>
              <td>{item.name_product}</td>
              <td>{item.price.toLocaleString('vi-VN')}₫</td>
              <td>{item.quantity}</td>
              <td>{item.content || 'Không có mô tả'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="secondary" onClick={() => window.history.back()}>Quay lại</Button>
    </div>
  );
};

export default GroupProductDetail;
