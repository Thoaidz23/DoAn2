const connection = require('../../db');

// Hàm ghi lịch sử trạng thái
const insertOrderTime = (code_order, status) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO tbl_order_time (code_order, status) VALUES (?, ?)`;
    connection.query(query, [code_order, status], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Lấy tất cả đơn hàng
const getOrders = (req, res) => {
  const query = `
    SELECT o.id_order, o.code_order, u.name, o.total_price, o.status, o.date, 
           o.name_user, o.address, o.phone, p.method, p.paystatus 
    FROM tbl_order o 
    JOIN tbl_user u ON o.id_user = u.id_user 
    JOIN tbl_payment_infor p ON o.code_order = p.code_order 
    ORDER BY id_order DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn:", err);
      return res.status(500).json({ error: "Lỗi máy chủ" });
    }
    res.json(results);
  });
};

// Lấy chi tiết đơn hàng theo code_order
// const getOrderByCode = (req, res) => {
//   const { code } = req.params;

//   const query = `
//     SELECT 
//       o.id_order, o.code_order, o.total_price, o.status, o.date, 
//       o.name_user, o.address, o.phone,
//       u.id_user, u.name AS user_name, u.email,
//       od.id_order_detail, od.quantity_product,
//       p.id_product, p.price,
//       gp.name_group_product, gp.image,
//       ram.name_ram, rom.name_rom, color.name_color,
//       pi.method, pi.paystatus
//     FROM tbl_order o
//     JOIN tbl_user u ON o.id_user = u.id_user
//     JOIN tbl_order_detail od ON o.code_order = od.code_order
//     JOIN tbl_product p ON od.id_product = p.id_product
//     JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
//     LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
//     LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
//     LEFT JOIN tbl_color color ON p.id_color = color.id_color
//     LEFT JOIN tbl_payment_infor pi ON o.code_order = pi.code_order
//     WHERE o.code_order = ?;
//   `;

//   connection.query(query, [code], (err, results) => {
//     if (err) {
//       console.error("Lỗi truy vấn:", err);
//       return res.status(500).json({ error: "Lỗi máy chủ" });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "Đơn hàng không tồn tại" });
//     }

//     const order = results[0];
//     const products = results.map(row => ({
//       name_group_product: row.name_group_product,
//       name_ram: row.name_ram,
//       name_rom: row.name_rom,
//       name_color: row.name_color,
//       quantity_product: row.quantity_product,
//       price: row.price,
//       image: row.image
//     }));

//     res.json({ ...order, products });
//   });
// };

// Lấy chi tiết đơn hàng theo code_order
const getOrderByCode = (req, res) => {
  const { code } = req.params;

  const query = `
    SELECT 
      o.id_order, o.code_order, o.total_price, o.status, o.date, 
      o.name_user, o.address, o.phone,
      u.id_user, u.name AS user_name, u.email,
      od.id_order_detail, od.quantity_product,
      p.id_product, p.price,
      gp.name_group_product, gp.image,
      ram.name_ram, rom.name_rom, color.name_color,
      pi.method, pi.paystatus
    FROM tbl_order o
    JOIN tbl_user u ON o.id_user = u.id_user
    JOIN tbl_order_detail od ON o.code_order = od.code_order
    JOIN tbl_product p ON od.id_product = p.id_product
    JOIN tbl_group_product gp ON p.id_group_product = gp.id_group_product
    LEFT JOIN tbl_ram ram ON p.id_ram = ram.id_ram
    LEFT JOIN tbl_rom rom ON p.id_rom = rom.id_rom
    LEFT JOIN tbl_color color ON p.id_color = color.id_color
    LEFT JOIN tbl_payment_infor pi ON o.code_order = pi.code_order
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

    // Lấy lịch sử thời gian
    const timeQuery = `
      SELECT status, \`time\` 
      FROM tbl_order_time 
      WHERE code_order = ? 
      ORDER BY \`time\` ASC
    `;

    connection.query(timeQuery, [code], (err2, timeRows) => {
      if (err2) {
        console.error("Lỗi truy vấn thời gian:", err2);
        return res.status(500).json({ error: "Lỗi khi lấy lịch sử trạng thái" });
      }

      res.json({ 
        ...order, 
        products, 
        statusHistory: timeRows 
      });
    });
  });
};


// Xác nhận đơn (0 -> 1)
const updateOrder = (req, res) => {
  const { code } = req.params;
  const { status } = req.body;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, statusResult) => {
    if (err) return res.status(500).json({ error: "Lỗi máy chủ" });
    if (statusResult.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    const currentStatus = statusResult[0].status;

    if (currentStatus === 0 && status === 1) {
      const getProductsQuery = `
        SELECT od.id_product, od.quantity_product 
        FROM tbl_order_detail od
        JOIN tbl_order o ON od.code_order = o.code_order
        WHERE o.code_order = ?
      `;

      connection.query(getProductsQuery, [code], (err, products) => {
        if (err) return res.status(500).json({ error: "Lỗi khi lấy sản phẩm" });

        const updateQuantityPromises = products.map(product => {
          return new Promise((resolve, reject) => {
            const updateQtyQuery = `
              UPDATE tbl_product 
              SET quantity = quantity - ? 
              WHERE id_product = ? AND quantity >= ?
            `;
            connection.query(updateQtyQuery, [product.quantity_product, product.id_product, product.quantity_product], (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        });

        Promise.all(updateQuantityPromises)
          .then(() => {
            const updateOrderQuery = `UPDATE tbl_order SET status = ? WHERE code_order = ?`;
            connection.query(updateOrderQuery, [status, code], async (err) => {
              if (err) return res.status(500).json({ error: "Lỗi cập nhật đơn hàng" });

              try {
                await insertOrderTime(code, status);
              } catch (e) {
                console.error("Lỗi lưu lịch sử trạng thái:", e);
              }

              return res.json({ message: "Cập nhật trạng thái và trừ số lượng thành công" });
            });
          })
          .catch(() => res.status(500).json({ error: "Lỗi khi cập nhật số lượng sản phẩm" }));
      });
    } else {
      return res.status(400).json({ message: "Chỉ được phép từ trạng thái 0 sang 1" });
    }
  });
};

// In đơn nếu chưa xác nhận
const printOrderIfUnconfirmed = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = "SELECT status FROM tbl_order WHERE code_order = ?";
  connection.query(getStatusQuery, [code], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ message: "Lỗi hoặc không tìm thấy" });

    const currentStatus = results[0].status;

    if (currentStatus === 0) {
      const updateQuery = "UPDATE tbl_order SET status = 1 WHERE code_order = ?";
      connection.query(updateQuery, [code], async (err2) => {
        if (err2) return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });

        try {
          await insertOrderTime(code, 1);
        } catch (e) {
          console.error("Lỗi lưu lịch sử trạng thái:", e);
        }

        return res.json({ message: "Cập nhật trạng thái thành công" });
      });
    } else {
      return res.json({ message: "Đơn hàng không cần cập nhật" });
    }
  });
};

// Giao hàng (1 -> 2)
const markAsShipping = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    if (result[0].status === 1) {
      const updateQuery = 'UPDATE tbl_order SET status = 2 WHERE code_order = ?';
      connection.query(updateQuery, [code], async (err2) => {
        if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });

        try {
          await insertOrderTime(code, 2);
        } catch (e) {
          console.error("Lỗi lưu lịch sử trạng thái:", e);
        }

        return res.json({ message: "Đơn hàng đã chuyển sang: Đang vận chuyển" });
      });
    } else {
      return res.status(400).json({ message: "Chỉ có thể từ đã xác nhận sang đang vận chuyển" });
    }
  });
};

// Đã giao hàng (2 -> 3)
const markAsDelivered = (req, res) => {
  const { code } = req.params;

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    if (result[0].status !== 2) {
      return res.status(400).json({ message: "Chỉ có thể từ đang vận chuyển sang đã giao hàng" });
    }

    const updateOrderStatus = 'UPDATE tbl_order SET status = 3 WHERE code_order = ?';
    connection.query(updateOrderStatus, [code], async (err2) => {
      if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });

      try {
        await insertOrderTime(code, 3);
      } catch (e) {
        console.error("Lỗi lưu lịch sử trạng thái:", e);
      }

      const updatePayment = 'UPDATE tbl_payment_infor SET paystatus = 1 WHERE code_order = ?';
      connection.query(updatePayment, [code], (err3) => {
        if (err3) return res.status(500).json({ error: "Lỗi khi cập nhật thanh toán" });

        // cập nhật bảo hành như code cũ...
        return res.json({ message: "Đơn hàng đã chuyển sang: Đã giao hàng" });
      });
    });
  });
};

// Hủy đơn
const cancelOrder = (req, res) => {
  const { code } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim() === "") {
    return res.status(400).json({ message: "Vui lòng nhập lý do hủy đơn" });
  }

  const getStatusQuery = 'SELECT status FROM tbl_order WHERE code_order = ?';
  connection.query(getStatusQuery, [code], (err, result) => {
    if (err) return res.status(500).json({ error: "Lỗi khi truy vấn" });
    if (result.length === 0) return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    if (result[0].status === 3 || result[0].status === 5) {
      return res.status(400).json({ message: "Không thể hủy đơn đã giao hoặc đã hủy" });
    }

    const updateQuery = `UPDATE tbl_order SET status = 5, cancel_reason = ? WHERE code_order = ?`;
    connection.query(updateQuery, [reason, code], async (err2) => {
      if (err2) return res.status(500).json({ error: "Lỗi khi cập nhật hủy" });

      try {
        await insertOrderTime(code, 5);
      } catch (e) {
        console.error("Lỗi lưu lịch sử trạng thái:", e);
      }

      return res.json({ message: "Đơn hàng đã được hủy thành công" });
    });
  });
};

module.exports = {
  getOrders,
  getOrderByCode,
  updateOrder,
  printOrderIfUnconfirmed,
  markAsShipping,
  markAsDelivered,
  cancelOrder
};
