import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './print.scss';

const PrintLayout = ({ children }) => {
  return (
    <div
      style={{
        background: "#fff",
        color: "#000",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        zIndex: 9999
      }}
    >
      {children}
    </div>
  );
};

const PrintOrder = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/${code}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err));
  }, [code]);

  if (!order) return <p>Đang tải đơn hàng...</p>;

  return (
    <>
      <div id="print-section">
        <PrintLayout>
          <div style={styles.container}>
            <h2 style={styles.title}>HÓA ĐƠN BÁN HÀNG</h2>

            <div style={styles.section}>
              <p><strong>Mã đơn hàng:</strong> {order.code_order}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.date).toLocaleString("vi-VN")}</p>
              <p><strong>Tên khách hàng:</strong> {order.user_name}</p>
              <p><strong>Địa chỉ:</strong> {order.address}</p>
              <p><strong>Điện thoại:</strong> {order.phone}</p>
              <p><strong>Phương thức thanh toán:</strong> {
                order.method === 0 ? "Tiền mặt" :
                order.method === 1 ? "Momo" :
                order.method === 3 ? "Paypal" : "Khác"
              }</p>
            </div>

            <table style={styles.table} border="1">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên SP</th>
                  <th>RAM</th>
                  <th>ROM</th>
                  <th>Màu</th>
                  <th>SL</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{product.name_group_product}</td>
                    <td>{product.name_ram}</td>
                    <td>{product.name_rom}</td>
                    <td>{product.name_color}</td>
                    <td>{product.quantity_product}</td>
                    <td>{Number(product.price).toLocaleString("vi-VN")}</td>
                    <td>{(product.price * product.quantity_product).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ textAlign: "right", marginTop: 20 }}>
              Tổng cộng: <span style={{ color: "red" }}>
                {order.total_price.toLocaleString("vi-VN")} VNĐ
              </span>
            </h4>
          </div>
        </PrintLayout>
      </div>

      {/* Nút in và quay lại - bên ngoài nội dung in */}
      <div className="no-print d-flex justify-content-center gap-3 mt-5">
        <button className="btn btn-primary" onClick={() => window.print()}>
          In hóa đơn
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/order")}>
          Quay lại
        </button>
      </div>
    </>
  );
};

const styles = {
  container: {
    width: "100%",
    color: "#000"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  section: {
    marginBottom: 20,
    lineHeight: 1.8
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px"
  }
};

export default PrintOrder;
