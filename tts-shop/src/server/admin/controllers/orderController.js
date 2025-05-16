const connection = require('../../db');  // Đảm bảo bạn đã có kết nối với MySQL

// Lấy tất cả đơn hàng từ cơ sở dữ liệu
const getOrders = (req, res) => {
  const query = 'SELECT o.id_order, o.code_order, u.name, o.total_price, o.status, o.date, o.name_user, o.address, o.phone, o.paystatus FROM tbl_order o JOIN tbl_user u ON o.id_user = u.id_user';
  
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);  // Trả về kết quả dưới dạng JSON
  });
};

// Lấy chi tiết đơn hàng theo code_order
const getOrderByCode = (req, res) => {
  const { code } = req.params;
  
  const query = `
    SELECT 
    o.id_order,
    o.code_order,
    o.total_price,
    o.status,
    o.paystatus,
    o.method,
    o.date,
    o.name_user,
    o.address,
    o.phone,

    u.id_user,
    u.name AS user_name,
    u.email,

    od.id_order_detail,
    od.quantity_product,

    p.id_product,
    p.price,

    gp.name_group_product,
    gp.image,

    ram.name_ram,
    rom.name_rom,
    color.name_color

    FROM tbl_order o
    JOIN tbl_user u ON o.id_user = u.id_user
    JOIN tbl_order_detail od ON o.code_order = od.code_order
    JOIN tbl_product p ON od.id_product = p.id_product
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
    LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
    LEFT JOIN tbl_color color ON p.id_color = color.id_color

    WHERE o.code_order = ?;
    `;

  connection.query(query, [code], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const order = results[0];
    const products = results.map(row => ({
      name_group_product: row.name_group_product,
      name_ram: row.name_ram,
      name_rom: row.name_rom,
      name_color: row.name_color,
      quantity_product: row.quantity_product,
      price: row.price,
      image: row.image
    }));

    res.json({ ...order, products });
  });
};

const updateOrder = (req, res) => {
  const { code } = req.params;
  const { status, paystatus } = req.body;

  // 1. Lấy trạng thái hiện tại của đơn hàng
  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, statusResult) => {
    if (err) {
      console.error("Lỗi truy vấn trạng thái:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }

    if (statusResult.length === 0) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    const currentStatus = statusResult[0].status;

    // 2. Nếu từ trạng thái 0 -> 1 thì trừ số lượng
    if (currentStatus === 0 && status === 1) {
      const getProductsQuery = `
        SELECT od.id_product, od.quantity_product 
FROM tbl_order_detail od
JOIN tbl_order o ON od.code_order = o.code_order
WHERE o.code_order = ?
      `;
      connection.query(getProductsQuery, [code], (err, products) => {
        if (err) {
          console.error("Lỗi truy vấn sản phẩm:", err);
          return res.status(500).json({ error: "Lỗi máy chủ khi lấy sản phẩm" });
        }

        // Trừ số lượng sản phẩm
        const updateQuantityPromises = products.map(product => {
          return new Promise((resolve, reject) => {
            const updateQtyQuery = `
              UPDATE tbl_product 
              SET quantity = quantity - ? 
              WHERE id_product = ? AND quantity >= ?
            `;
            connection.query(updateQtyQuery, [product.quantity_product, product.id_product, product.quantity_product], (err, result) => {
              if (err) return reject(err);
              resolve();
            });
          });
        });

        Promise.all(updateQuantityPromises)
          .then(() => {
            // Sau khi trừ xong thì cập nhật trạng thái đơn hàng
            const updateOrderQuery = `
              UPDATE tbl_order 
              SET status = ?, paystatus = ? 
              WHERE code_order = ?
            `;
            connection.query(updateOrderQuery, [status, paystatus, code], (err, result) => {
              if (err) {
                console.error("Lỗi cập nhật đơn hàng:", err);
                return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật đơn hàng" });
              }

              return res.json({ message: "Cập nhật trạng thái và trừ số lượng thành công" });
            });
          })
          .catch((err) => {
            console.error("Lỗi khi trừ số lượng sản phẩm:", err);
            return res.status(500).json({ error: "Lỗi khi cập nhật số lượng sản phẩm" });
          });
      });
    } else {
      // Nếu không cần trừ số lượng thì chỉ cập nhật trạng thái
      const updateOrderQuery = `
        UPDATE tbl_order 
        SET status = ?, paystatus = ? 
        WHERE code_order = ?
      `;
      connection.query(updateOrderQuery, [status, paystatus, code], (err, result) => {
        if (err) {
          console.error("Lỗi cập nhật đơn hàng:", err);
          return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật đơn hàng" });
        }

        return res.json({ message: "Cập nhật trạng thái thành công" });
      });
    }
  });
};



module.exports = { getOrders, getOrderByCode, updateOrder };
