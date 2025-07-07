import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <style>
        {`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }

          .sidebar,
          .admin-navbar,
          .footer {
            display: none !important;
          }

          button,
          .no-print {
            display: none !important;
          }

          @page {
            margin: 20mm;
          }
        }
        `}
      </style>
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

  useEffect(() => {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.flex-grow-1');

  if (sidebar) sidebar.style.display = 'none';
  if (mainContent) mainContent.style.marginLeft = '0';

  return () => {
    // Khi rời khỏi trang thì hiện lại
    if (sidebar) sidebar.style.display = '';
    if (mainContent) mainContent.style.marginLeft = '';
  };
}, []);


  if (!order) return <p>Đang tải đơn hàng...</p>;

  return (
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
            order.method === 1 ? "Chuyển khoản" :
            order.method === 2 ? "Momo" : "Khác"
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

        <p style={{ marginTop: 60 }}>Người lập hóa đơn: ___________________</p>

        {/* Nút hành động */}
        <div style={{ marginTop: 40 }} className="no-print">
          <button
            style={{ padding: "8px 20px", marginRight: "15px" }}
            onClick={() => window.print()}
          >
            In hóa đơn
          </button>
          <button
  style={{ padding: "8px 20px" }}
  onClick={() => {
    // Đặt lại layout trước khi quay lại
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.flex-grow-1');

    if (sidebar) sidebar.style.display = '';
    if (mainContent) mainContent.style.marginLeft = '';

    navigate("/admin/order");
  }}
>
  Quay lại
</button>

        </div>
      </div>
    </PrintLayout>
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
