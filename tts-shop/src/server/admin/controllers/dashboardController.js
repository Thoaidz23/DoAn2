const connection = require('../../db');

// Hàm hỗ trợ thực hiện truy vấn và xử lý lỗi
const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn:", err);
        reject(err);
      } else {
        console.log("Kết quả truy vấn:", results); // Log kết quả trả về
        resolve(results);
      }
    });
  });
};

const getDashboardData = async (req, res) => {
  try {
    // Tổng đơn hàng
    const ordersResult = await executeQuery("SELECT COUNT(*) AS totalOrders FROM tbl_order");
    if (!ordersResult || ordersResult.length === 0) {
      throw new Error("Không có dữ liệu đơn hàng.");
    }
    const orders = ordersResult[0]?.totalOrders || 0;

    // Tổng khách hàng
    const usersResult = await executeQuery("SELECT COUNT(*) AS totalUsers FROM tbl_user WHERE role = 3");
    if (!usersResult || usersResult.length === 0) {
      throw new Error("Không có dữ liệu người dùng.");
    }
    const users = usersResult[0]?.totalUsers || 0;

    // Tổng sản phẩm
    const productsResult = await executeQuery("SELECT COUNT(*) AS totalProducts FROM tbl_product");
    if (!productsResult || productsResult.length === 0) {
      throw new Error("Không có dữ liệu sản phẩm.");
    }
    const products = productsResult[0]?.totalProducts || 0;

    // Doanh thu theo tháng
    const revenuesResult = await executeQuery(`
      SELECT 
        MONTH(date) AS month, 
        SUM(total_price) AS revenue
      FROM tbl_order
      WHERE YEAR(date) = YEAR(CURDATE())
      GROUP BY MONTH(date)
      ORDER BY month ASC
    `);
    if (!revenuesResult || revenuesResult.length === 0) {
      throw new Error("Không có dữ liệu doanh thu.");
    }
    const revenues = revenuesResult.length ? revenuesResult : [];

    // Top sản phẩm bán chạy
    const topProductsResult = await executeQuery(`
      SELECT 
        gp.name_group_product AS name,
        SUM(od.quantity_product) AS total_sold,
        p.price * SUM(od.quantity_product) AS total_revenue,
        gp.image
      FROM tbl_order_detail od
      JOIN tbl_product p ON od.id_product = p.id_product
      JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
      GROUP BY p.id_product, gp.name_group_product, p.price
      ORDER BY total_sold DESC
      LIMIT 10
    `);
    if (!topProductsResult || topProductsResult.length === 0) {
      throw new Error("Không có dữ liệu sản phẩm bán chạy.");
    }
    const topProducts = topProductsResult.length ? topProductsResult : [];

    // 10 sản phẩm ít bán chạy nhất
    const leastSoldProductsResult = await executeQuery(`
      SELECT 
        gp.name_group_product AS name,
        SUM(od.quantity_product) AS total_sold,
        p.price * SUM(od.quantity_product) AS total_revenue,
        gp.image
      FROM tbl_order_detail od
      JOIN tbl_product p ON od.id_product = p.id_product
      JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
      GROUP BY p.id_product, gp.name_group_product, p.price
      ORDER BY total_sold ASC
      LIMIT 10
    `);
    if (!leastSoldProductsResult || leastSoldProductsResult.length === 0) {
      throw new Error("Không có dữ liệu sản phẩm ít bán chạy.");
    }
    const leastSoldProducts = leastSoldProductsResult.length ? leastSoldProductsResult : [];

    // Trả về tất cả dữ liệu
    res.json({
      orders,
      users,
      products,
      revenues,
      topProducts,
      leastSoldProducts, // Gộp luôn vào kết quả trả về
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getDashboardData };
