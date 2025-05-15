import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
 
import { AuthContext } from "../../customer/context/AuthContext";
import { useContext } from "react";

const Dashboard = () => {
<<<<<<< HEAD
  const [stats, setStats] = useState({
    orders: 0,
    users: 0,
    products: 0,
    revenues: [],
    topProducts: [],
    leastSoldProducts: [],
  });
=======
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
>>>>>>> feeca5d1e87190f834b6b5a345109092b71f2daf

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboards");
        console.log(res.data.leastSoldProducts);
        setStats(res.data);
        // console.log(res.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
        alert("Lỗi khi tải dữ liệu, vui lòng thử lại sau.");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Tổng quan</h3>

      {/* Cards thống kê */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Tổng đơn hàng</h6>
                <h4 className="mb-0">{stats.orders}</h4>
              </div>
              <div className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center">
                <ShoppingCart size={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Khách hàng</h6>
                <h4 className="mb-0">{stats.users}</h4>
              </div>
              <div className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center">
                <Users size={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-secondary text-white shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Sản phẩm</h6>
                <h4 className="mb-0">{stats.products}</h4>
              </div>
              <div className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center">
                <Package size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo ngày */}
      <div className="card bg-dark text-white border-secondary mb-4">
  <div className="card-header border-bottom border-secondary">
    <h5 className="mb-0">Doanh thu theo tháng (VND)</h5>
  </div>
  <div className="card-body" style={{ height: "300px", marginTop: "40px" }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={stats.revenues}
        margin={{ top: 5, right: 20, bottom: 5, left: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#6c757d" />
        <XAxis
  dataKey="month"  // Sử dụng cột month
  stroke="#fff"
  tickFormatter={(month) => {
    const date = new Date(`${month}-01`);  // Dựng lại ngày từ tháng
    return `Tháng ${date.getMonth() + 1}`; // Lấy số tháng và thêm "Tháng"
  }}
  interval="preserveStartEnd"
/>
        <YAxis stroke="#fff" />
        <Tooltip
          formatter={(value) => [
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(value),
            "Doanh thu",
          ]}
        />
        <Line type="monotone" dataKey="revenue" stroke="#0d6efd" />
      </LineChart>
    </ResponsiveContainer>
  </div>
  <div className="card-footer text-muted d-flex justify-content-between">
    <span>{stats.revenues[0]?.month || "Tháng đầu tiên"}</span>
    <span>{stats.revenues[stats.revenues.length - 1]?.month || "Tháng cuối cùng"}</span>
  </div>
</div>


      <div className="row">
  {/* Bảng xếp hạng sản phẩm 1 */}
  <div className="col-md-6 mb-4 d-flex justify-content-center">
    <div className="card bg-dark text-white border-secondary w-100">
      <div className="card-header border-bottom border-secondary">
        <h5 className="mb-0 text-center">Top 10 sản phẩm bán chạy nhất</h5>
      </div>
      <div className="card-body p-0">
        <table className="table table-dark table-hover table-striped mb-0">
          <thead>
            <tr>
              <th className="text-center border-right">STT</th>
              <th className="text-center border-right">Tên sản phẩm</th>
              <th className="text-center border-right">Số lượng</th>
              <th className="text-center">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {stats.topProducts.map((p, i) => (
              <tr key={i}>
                <td className="text-center">{i + 1}</td>
                <td className="text-center">{p.name}</td>
                <td className="text-center">{p.total_sold}</td>
                <td className="text-center">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(p.total_revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  {/* Bảng xếp hạng sản phẩm 2 */}
  <div className="col-md-6 mb-4 d-flex justify-content-center">
    <div className="card bg-dark text-white border-secondary w-100">
      <div className="card-header border-bottom border-secondary">
        <h5 className="mb-0 text-center">Top 10 sản phẩm bán kém nhất</h5>
      </div>
      <div className="card-body p-0">
        <table className="table table-dark table-hover table-striped mb-0">
          <thead>
            <tr>
              <th className="text-center border-right">STT</th>
              <th className="text-center border-right">Tên sản phẩm</th>
              <th className="text-center border-right">Số lượng</th>
              <th className="text-center">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {stats.leastSoldProducts.map((p, i) => (
              <tr key={i}>
                <td className="text-center">{i + 1}</td>
                <td className="text-center">{p.name}</td>
                <td className="text-center">{p.total_sold}</td>
                <td className="text-center">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(p.total_revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>





      
    </div>
  );
};

export default Dashboard;
