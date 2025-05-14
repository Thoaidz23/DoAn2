import {
  ShoppingCart,
  Users,
  Package,
  Smartphone,
  Laptop,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
 
import { AuthContext } from "../../customer/context/AuthContext";
import { useContext } from "react";

const Dashboard = () => {
 const { user } = useContext(AuthContext); // Lấy user từ context
  console.log(user)
  // Dữ liệu doanh thu
  const revenueData = [
    { month: "1", revenue: 10 },
    { month: "2", revenue: 12 },
    { month: "3", revenue: 8 },
    { month: "4", revenue: 15 },
    { month: "5", revenue: 20 },
    { month: "6", revenue: 18 },
  ];

  // Dữ liệu bảng xếp hạng
  const topProducts = [
    { name: "iPhone 15 Pro Max", type: "Smartphone", sold: 150 },
    { name: "Samsung Galaxy S24", type: "Smartphone", sold: 130 },
    { name: "MacBook Air M2", type: "Laptop", sold: 90 },
    { name: "Asus ROG Zephyrus", type: "Laptop", sold: 85 },
  ];

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Tổng quan</h3>

      {/* Cards thống kê */}
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Tổng đơn hàng</h6>
                <h4 className="mb-0">1.245</h4>
              </div>
              <div className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center">
                <ShoppingCart size={28} />
              </div>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Khách hàng</h6>
                <h4 className="mb-0">822</h4>
              </div>
              <div className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center">
                <Users size={28} />
              </div>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Sản phẩm</h6>
                <h4 className="mb-0">563</h4>
              </div>
              <div className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center">
                <Package size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh số */}
      <div className="card bg-dark text-white border-secondary mb-4">
        <div className="card-header border-bottom border-secondary">
          <h5 className="mb-0">Doanh thu theo tháng (triệu VND)</h5>
        </div>
        <div className="card-body" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#6c757d" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bảng xếp hạng sản phẩm */}
      <div className="card bg-dark text-white border-secondary mb-4">
        <div className="card-header border-bottom border-secondary">
          <h5 className="mb-0">Sản phẩm bán chạy</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-dark table-hover table-striped mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên sản phẩm</th>
                <th>Loại</th>
                <th>Đã bán</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>
                    {p.type === "Smartphone" ? (
                      <Smartphone size={18} className="me-1" />
                    ) : (
                      <Laptop size={18} className="me-1" />
                    )}
                    {p.type}
                  </td>
                  <td>{p.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
